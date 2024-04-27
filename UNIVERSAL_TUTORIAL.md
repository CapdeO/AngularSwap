Important Functions
getQuote()

Fetching the swap quote involves obtaining the best rate and maximum output token while spending the least on gas. The following function handles this:

const getQuote = async (
  amount, // amount of input token you want to swap
  tokenIn, // input token object with token address, decimals, symbol, name
  tokenOut, // output token object with token address, decimals, symbol, name
  permitSig=undefined, // permit signature object
) => {
  const router = new AlphaRouter({
    chainId, // chainId of the network you want to use
    provider, // ethers.js provider object
  });

  try {
    const tokenA =
      tokenIn.token_address.toLowerCase() === getChainWiseNativeToken(chainId) // check if input token is native token of the chain
        ? nativeOnChain(chainId) // if native token, get native token object
        : new Token(
            chainId,
            tokenIn.token_address,
            +tokenIn.decimals,
            tokenIn.symbol,
            tokenIn.symbol,
          ); // if not native token, create token object
    const tokenB = new Token(
      chainId,
      tokenOut.address,
      tokenOut.decimals,
      tokenOut.symbol,
      tokenOut.name,
    ); // create token object for output token

    const amountIn = CurrencyAmount.fromRawAmount(
      tokenA,
      JSBI.BigInt(ethers.utils.parseUnits(amount.toString(), tokenA.decimals)),
    ); // get input token amount in CurrencyAmount object

    let swapOptions = {
      type: SwapType.UNIVERSAL_ROUTER,
      recipient: userWalletAddress,
      slippageTolerance: new Percent(5, 100),
      deadlineOrPreviousBlockhash: parseDeadline(360),
    }; // swap options object

    if (permitSig?.signature) {
      swapOptions = {
        ...swapOptions,
        inputTokenPermit: {
          ...permitSig?.permit,
          signature: permitSig.signature,
        },
      };
    } // if permit signature is present, add permit signature to swap options

    const quote = await router.route(
      amountIn,
      tokenB,
      TradeType.EXACT_INPUT,
      swapOptions,
    ); // get quote from router

    console.log(quote, "quote");
    return quote; // return quote
  } catch (err) {
    console.log(err);
  }
};


This function returns data about the amount to be received in the output token, estimated gas utilization, and the swap route.
handleSwap()

The core function for executing the token swap after we receive the quote:

const handleSwap = async (
  quote, // quote object from getQuote()
  token_A, // input token object
  token_B, // output token object
) => {
  const { trade, route } = quote;

  const signer = provider.getSigner(); // get the signer from metamask provider

  try {
    let methodParameters = quote.methodParameters;

    const universalRouter = methodParameters?.to; // universal router address

    if (
      token_A.token_address.toLowerCase() !== getChainWiseNativeToken(chainId)
    ) {
      console.log(
        `checking ${token_A.symbol.toUpperCase()} token allowance...`,
      );
      // Give approval to the router to spend the token
      const tokenApproval = await getTokenTransferApproval(
        token_A.token_address,
        +token_A.decimals,
        token_A.symbol,
        +trade.inputAmount.toExact(),
      );
      // Fail if transfer approvals do not go through
      if (!tokenApproval) {
        return;
      }
      let permitSignatureTemp = permitSignature; // store permitSignature in a state variable
      if (
        !permitSignatureTemp ||
        !verifySignature(permitSignatureTemp, token_A)
      ) {
        const permit = makePermit(
          token_A.token_address,
          MaxUint160.toString(),
          undefined,
          universalRouter,
        );
        const signature = await generatePermitSignature(
          permit,
          signer,
          chainId,
        );
        if (!signature) return console.log("signature generation failed");
        permitSignatureTemp = {
          signature,
          permit,
        };
        setPermitSignature(permitSignatureTemp);
      }

      const newQuote = await getQuote(
        +trade.inputAmount.toExact(),
        token_A,
        token_B,
        permitSignatureTemp,
      );

      if (!newQuote) return;

      methodParameters = newQuote.methodParameters;
      // }
    }

    console.log("swapping tokens...");

    const hexValue = methodParameters?.value;
    const bigNumberValue = ethers.BigNumber.from(hexValue);

    const tx = {
      to: methodParameters?.to,
      data: methodParameters?.calldata,
      ...(!bigNumberValue.isZero() ? { value: methodParameters?.value } : {}),
    };

    console.log(tx, "tx");

    let gasEstimate;
    try {
      gasEstimate = await signer.estimateGas(tx);
    } catch (err) {
      console.log(err?.message);
      gasEstimate = ethers.BigNumber.from(DEFAULT_GAS_LIMIT); // DEFAULT_GAS_LIMIT = 210000
    }
    const gasLimit = gasEstimate.mul(120).div(100);
    const response = await signer.sendTransaction({
      ...tx,
      gasLimit,
    });
    const receipt = await response.wait();
    console.log("---------------------------- SUCCESS?");
    console.log("status", receipt.status);
    return receipt;
  } catch (err) {
    console.log(err);
    return null;
  }
};

    The handleSwap function orchestrates the entire token-swapping process on Uniswap using the Universal Router.
    It checks if the input token is the native token of the chain and performs token approval if needed.
    If the permit signature is absent or not verified, it signs the permit2 message.
    The new permit signature is then appended to the method parameters.
    A new quote is fetched with the updated permit signature.
    The method parameters are updated, and the transaction is constructed.
    Gas estimation is performed, and the gas limit is adjusted.
    The transaction is sent, and the receipt is obtained.

This function encapsulates the complexity of token swapping, taking care of necessary approvals and signatures in the Uniswap ecosystem.

Utility Functions

    getTokenTransferApproval(): This function handles the approval process for the permit2 contract to spend tokens.

    async function getTokenTransferApproval(tokenAddress, decimals, amount) {
  const signer = provider.getSigner();

  try {
    const tokenContract = new ethers.Contract(tokenAddress, erc20ABI, signer);
    const allowance = await tokenContract.allowance(
      userWalletAddress,
      PERMIT2_ADDRESS
    );

    if (allowance.gte(ethers.BigNumber.from(fromReadableAmount(amount, +decimals)))) {
      return true;
    }

    console.log("Approving token...");

    const transaction = await tokenContract.approve(
      PERMIT2_ADDRESS,
      ethers.constants.MaxUint256
    );

    const receipt = await transaction.wait();

    if (receipt.status === 0) {
      console.log("Approval transaction failed");
      return false;
    }

    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
}

2. verifySignature(): This function verifies the permit2 signature.

const verifySignature = (signature, token_A) => {
  const { permit } = signature;

  if (permit.details.token.toLowerCase() !== token_A.token_address.toLowerCase()) {
    return false;
  }

  if (moment().isAfter(moment.unix(+permit.sigDeadline))) {
    return false;
  }

  return true;
};

3. makePermit(): This function generates a permit object for signing.

export const makePermit = (tokenAddress, amount, nonce, spender) => {
  return {
    details: {
      token: tokenAddress,
      amount,
      expiration: moment().add(1, "month").unix().toString(),
      nonce,
    },
    spender,
    sigDeadline: moment().add(30, "minutes").unix().toString(),
  };
};

4. generatePermitSignature(): This function generates the permit2 signature.

export async function generatePermitSignature(permit, signer, chainId) {
  const { domain, types, values } = AllowanceTransfer.getPermitData(
    permit,
    PERMIT2_ADDRESS,
    chainId
  );

  try {
    const signature = await signer._signTypedData(domain, types, values);
    return signature;
  } catch (e) {
    console.log(e?.message);
    return null;
  }
}

Wrapping Up

Understanding the steps involved in swapping tokens on Uniswap is crucial. Follow the What is an approval transaction? — Uniswap Labs guide.

    Approve the Permit2 Contract: Authorize the permit2 contract to spend tokens from the wallet.
    Sign the Permit2 Message: Securely sign the permit2 message for token approvals.
    Swap the Tokens: Initiate the token swap process.

Note: Signing the permit2 message is a new step introduced with the universal router, providing a secure way for token approvals within the Uniswap universe. Read more about it in Introducing Permit2 & Universal Router.

