import { Component, Input, EventEmitter } from '@angular/core';
import { TokenType } from 'src/services/swap.service';
import { EthCompComponent } from '../eth-comp/eth-comp.component';
import { SwapService } from 'src/services/swap.service';

@Component({
  selector: 'app-coin-list',
  templateUrl: './coin-list.component.html',
  styleUrls: ['./coin-list.component.scss'],
})
export class CoinListComponent {
  tokens: TokenType[] = [
    {
      name: 'Matic',
      symbol: 'MATIC',
      logo: 'https://s3.coinmarketcap.com/static-gravity/image/b8db9a2ac5004c1685a39728cdf4e100.png',
      address: '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270',
      decimals: 18
    },
    {
      name: 'Tether USD',
      symbol: 'USDT',
      logo: 'https://cdn.moralis.io/eth/0xdac17f958d2ee523a2206206994597c13d831ec7.png',
      address: '0xc2132d05d31c914a87c6611c10748aeb04b58e8f',
      decimals: 6
    },
    {
      name: 'Dai Stablecoin',
      symbol: 'DAI',
      logo: 'https://cdn.moralis.io/eth/0x6b175474e89094c44da98b954eedeac495271d0f.png',
      address: '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063',
      decimals: 18
    },
    {
      name: 'Cresio',
      symbol: 'XCRE',
      logo: 'https://s2.coinmarketcap.com/static/img/coins/64x64/16639.png',
      address: '0xFA3c05C2023918A4324fDE7163591Fe6BEBd1692',
      decimals: 18
    },
    {
      name: 'USD Coin (PoS)',
      symbol: 'USDC.e',
      logo: 'https://s2.coinmarketcap.com/static/img/coins/64x64/18852.png',
      address: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
      decimals: 6
    },
    {
      name: 'USD Coin',
      symbol: 'USDC',
      logo: 'https://s2.coinmarketcap.com/static/img/coins/64x64/18852.png',
      address: '0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359',
      decimals: 6
    },
    {
      name: 'Binance-Peg BUSD',
      symbol: 'BUSD',
      logo: 'https://polygonscan.com/token/images/busdnew_32.png',
      address: '0x9C9e5fD8bbc25984B178FdCE6117Defa39d2db39',
      decimals: 18
    },
  ];

  constructor(
    private ethComp: EthCompComponent,
    private swapServ: SwapService
  ) {
  }

  handleTokenSelection(token: TokenType) {

    if(this.ethComp.selectedToken === 1)
      this.swapServ.tokenOne.next(token)
    else
      this.swapServ.tokenTwo.next(token)
    
    this.ethComp.handleShowModalComponent(1);
  }
}
