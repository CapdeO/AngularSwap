import { Component, Input, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-coin-list',
  templateUrl: './coin-list.component.html',
  styleUrls: ['./coin-list.component.scss'],
})
export class CoinListComponent {
  tokens = [
    { name: 'Tether USD', symbol: 'USDT', logo: 'tether-logo.png' },
    { name: 'Dai Stablecoin', symbol: 'DAI', logo: 'dai-logo.png' },
    { name: 'Cresio', symbol: 'XCRE', logo: 'cresio-logo.png' },
    { name: 'USD Coin (PoS)', symbol: 'USD.c', logo: 'usdc-logo.png' },
    { name: 'USD Coin', symbol: 'USDC', logo: 'usdc-logo.png' },
    { name: 'Binance-Peg BUSD', symbol: 'BUSD', logo: 'busd-logo.png' },
  ];
}
