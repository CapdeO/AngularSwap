import { Injectable, NgZone } from '@angular/core';
import { ethers } from 'ethers';
import { BehaviorSubject } from 'rxjs';

declare let window: any;

@Injectable({
  providedIn: 'root'
})
export class EthAuthService {

  provider: ethers.providers.Web3Provider | undefined
  signer: BehaviorSubject<ethers.providers.JsonRpcSigner | undefined> = new BehaviorSubject<ethers.providers.JsonRpcSigner | undefined>(undefined)
  hainIds: string[] = ['137']
  loginUser: any = new BehaviorSubject<boolean>(false)

  constructor(private ngZone: NgZone) {
    if (typeof window.ethereum !== 'undefined') {
      this.provider = new ethers.providers.Web3Provider(window.ethereum, 'any');
      this.signer.next(this.provider.getSigner());

      // Listen for changes in MetaMask accounts
      window.ethereum.on('accountsChanged', (accounts: string[]) => {
        this.ngZone.run(() => {
          if (accounts.length === 0) {
            // MetaMask disconnected or switched accounts
            this.handleMetaMaskDisconnect();
          } else {
            // MetaMask accounts changed
            this.handleMetaMaskAccountsChanged(accounts);
          }
        });
      });

      // window.ethereum.on('chainChanged', (chainId: string) => {
      //   // this.checkChainID()
      //   this.ngZone.run(() => {
      //     this.checkChainID()
      //   })
      // })

    } else {
      console.error('MetaMask is not installed.');
    }
  }

  private handleMetaMaskDisconnect() {
    console.log('MetaMask disconnected.');
    this.loginUser.next(false)
    this.provider = undefined;
    this.signer.next(undefined);
  }

  private handleMetaMaskAccountsChanged(accounts: string[]) {
    console.log('MetaMask accounts changed:', accounts);
    this.provider = new ethers.providers.Web3Provider(window.ethereum);
    this.signer.next(this.provider.getSigner());

    this.checkChainID()
  }

  async connectToMetaMaskWallet() {
    if (typeof window.ethereum !== 'undefined') {
      // Request access to the user's MetaMask account
      await window.ethereum.request({ method: 'eth_requestAccounts' });

      // Connect to MetaMask using the Web3Provider
      this.provider = new ethers.providers.Web3Provider(window.ethereum);
      this.signer.next(this.provider.getSigner());

      const address = await this.signer.getValue()!.getAddress();
      this.loginUser.next(true)

      console.log('Connected to MetaMask with address:', address);

      this.checkChainID()

    } else {
      console.error('MetaMask is not installed.');
    }
  }

  async checkChainID() {
    const { chainId } = await this.provider.getNetwork()

    console.log(chainId)

    if (chainId !== 137) {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x89' }],
      });
    }
  }

  getSigner() { return this.signer.getValue(); }
}

