import { Injectable, NgZone } from '@angular/core';
import { ethers, BigNumber, utils, Contract } from 'ethers';
import { BehaviorSubject } from 'rxjs';
import { PERMIT2_ADDRESS, AllowanceTransfer, AllowanceProvider } from '@uniswap/permit2-sdk';
import { AlphaRouter, SwapOptions, SwapType } from '@uniswap/smart-order-router';
import { CurrencyAmount, TradeType, Percent, Token, Ether, Currency } from '@uniswap/sdk-core';
import erc20Abi from '../utils/ERC20.json'
import { EthAuthService } from './eth-auth.service';


export interface TokenType {
  name: string;
  symbol: string;
  logo: string;
  address: string;
  decimals: number;
}

@Injectable({
  providedIn: 'root'
})
export class SwapService {

  tokenOne: BehaviorSubject<TokenType> = new BehaviorSubject<TokenType>(
    {
      name: 'Tether USD',
      symbol: 'USDT',
      logo: 'https://cdn.moralis.io/eth/0xdac17f958d2ee523a2206206994597c13d831ec7.png',
      address: '0xc2132d05d31c914a87c6611c10748aeb04b58e8f',
      decimals: 6
    }
  )

  tokenTwo: BehaviorSubject<TokenType> = new BehaviorSubject<TokenType>(
    {
      name: 'Cresio',
      symbol: 'XCRE',
      logo: 'https://s2.coinmarketcap.com/static/img/coins/64x64/16639.png',
      address: '0xFA3c05C2023918A4324fDE7163591Fe6BEBd1692',
      decimals: 18
    }
  )

  balanceTokenOne: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  balanceTokenTwo: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  amountIn: BehaviorSubject<number> = new BehaviorSubject<number>(1)
  chainId: number = 137
  uniswapRouterAddress: string = '0x643770E279d5D0733F21d6DC03A8efbABf3255B4'

  constructor(private ngZone: NgZone, private ethereumService: EthAuthService) {
  }

  async getWeiTokenBalance() {

    const walletAddress = await this.ethereumService.signer.getValue().getAddress()

    if (this.tokenOne.getValue().name === 'Matic') {
      var maticBalance: any = await this.ethereumService.provider.getBalance(walletAddress);
      maticBalance = utils.formatEther(maticBalance);
      return maticBalance;
    } else {
      const contract = new Contract(this.tokenOne.getValue().address, erc20Abi, this.ethereumService.signer.getValue());
      var balance = await contract.balanceOf(walletAddress);
      balance = utils.formatUnits(balance, this.tokenOne.getValue().decimals);
      return balance;
    }
  }

  async getTokenBalance(token: BehaviorSubject<number>, tokenType: TokenType) {

    const walletAddress = await this.ethereumService.signer.getValue().getAddress()

    if (tokenType.name === 'Matic') {
      var maticBalance: any = await this.ethereumService.provider.getBalance(walletAddress);
      maticBalance = utils.formatEther(maticBalance)
      maticBalance = (parseFloat(maticBalance)).toFixed(2)
      token.next(Number(maticBalance));

    } else {
      const contract = new Contract(tokenType.address, erc20Abi, this.ethereumService.signer.getValue());
      var balance = await contract.balanceOf(walletAddress);
      balance = utils.formatUnits(balance, tokenType.decimals)
      balance = (parseFloat(balance)).toFixed(2)
      token.next(Number(balance));
    }
  }

  async approvePermitContract() {
    const tokenOneValue = this.tokenOne.getValue();
    const tokenOneAddress = tokenOneValue.address;
    const tokenOneDecimals = tokenOneValue.decimals;
    const amountInWei = utils.parseUnits((this.amountIn.getValue()).toString(), tokenOneDecimals)
    const contract = new Contract(tokenOneAddress, erc20Abi, this.ethereumService.signer.getValue());
    return contract.approve(PERMIT2_ADDRESS, amountInWei);
  }

  async getSwapRoute(
    sourceToken: Token,
    destToken,
    amountInWei,
    permit,
    signature
  ) {

    const isNativeTokenOne = sourceToken.name === 'Matic'
    const isNativeTokenTwo = destToken.name === 'Matic'

    const tokenA = isNativeTokenOne ? (Ether.onChain(137) as Currency) : sourceToken
    const tokenB = isNativeTokenTwo ? (Ether.onChain(137) as Currency) : destToken

    const inputAmount = CurrencyAmount.fromRawAmount(
      tokenA,
      amountInWei.toString()
    );

    const chainId = this.chainId
    const router = new AlphaRouter({ chainId, provider: this.ethereumService.provider });
    const walletAddress = await this.ethereumService.signer.getValue().getAddress()

    let swapOptions: SwapOptions = {
      type: SwapType.UNIVERSAL_ROUTER,
      recipient: walletAddress,
      slippageTolerance: new Percent(5, 1000),
      deadlineOrPreviousBlockhash: Math.floor(Date.now() / 1000 + 1800),
    }

    if (permit) {
      swapOptions = {
        ...swapOptions,
        inputTokenPermit: {
          ...permit,
          signature
        }
      }
    }

    const route = await router.route(
      inputAmount,
      tokenB,
      TradeType.EXACT_INPUT,
      swapOptions
    );
    // console.log(`Quote Exact In: ${amountInWei}  -> ${route.quote.toExact()}`);
    return route;
  }

  async executeSwap() {

    const tokenA = this.tokenOne.getValue()
    const tokenB = this.tokenTwo.getValue()
    const A = new Token(
      this.chainId,
      tokenA.address,
      tokenA.decimals,
      tokenA.symbol,
      tokenA.name
    )

    const B = new Token(
      this.chainId,
      tokenB.address,
      tokenB.decimals,
      tokenB.symbol,
      tokenB.name
    )

    const sourceToken = A
    const destToken = B

    const amountInWei = utils.parseUnits((this.amountIn.getValue()).toString(), tokenA.decimals)
    const expiry = Math.floor(Date.now() / 1000 + 1800)
    const walletAddress = await this.ethereumService.signer.getValue().getAddress()

    var permit
    var signature

    if (tokenA.name === 'Matic') {

    } else {
      const allowanceProvider = new AllowanceProvider(this.ethereumService.provider, PERMIT2_ADDRESS)
      const nonce = await allowanceProvider.getNonce(
        sourceToken.address,
        walletAddress,
        this.uniswapRouterAddress
      )
      // console.log('nonce value:', nonce)
      permit = {
        details: {
          token: sourceToken.address,
          amount: amountInWei,
          expiration: expiry,
          nonce
        },
        spender: this.uniswapRouterAddress,
        sigDeadline: expiry
      }
      const { domain, types, values } = AllowanceTransfer.getPermitData(
        permit,
        PERMIT2_ADDRESS,
        this.chainId
      )
      signature = await this.ethereumService.signer.getValue()._signTypedData(domain, types, values)
    }

    const route = await this.getSwapRoute(
      sourceToken,
      destToken,
      amountInWei,
      permit,
      signature
    )

    const txArguments = {
      data: route.methodParameters.calldata,
      to: this.uniswapRouterAddress,
      value: BigNumber.from(route.methodParameters.value),
      from: walletAddress,
      gasPrice: route.gasPriceWei,
    };

    return await this.ethereumService.signer.getValue().sendTransaction(txArguments);

    // const transaction = await this.ethereumService.signer.getValue().sendTransaction(txArguments);
    // console.log('Swap transaction hash: ', transaction.hash);
  }
}
