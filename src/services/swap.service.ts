import { Injectable, NgZone } from '@angular/core';
import { ethers } from 'ethers';
import { BehaviorSubject } from 'rxjs';

export interface Token {
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

  tokenOne: Token = {
    name: 'Tether USD',
    symbol: 'USDT',
    logo: 'https://cdn.moralis.io/eth/0xdac17f958d2ee523a2206206994597c13d831ec7.png',
    address: '0xFA3c05C2023918A4324fDE7163591Fe6BEBd1692',
    decimals: 18
  };

  tokenTwo: Token = {
    name: 'Cresio',
    symbol: 'XCRE',
    logo: 'https://s2.coinmarketcap.com/static/img/coins/64x64/16639.png',
    address: '0xFA3c05C2023918A4324fDE7163591Fe6BEBd1692',
    decimals: 18
  };

  constructor(private ngZone: NgZone) {

  }
}
