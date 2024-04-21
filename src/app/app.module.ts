import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common'; // Importa CommonModule
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { EthCompComponent } from './components/eth-comp/eth-comp.component';
import { TokenOneSelectorComponent } from './components/token-one-selector/token-one-selector.component';
import { CoinListComponent } from './components/coin-list/coin-list.component';

@NgModule({
  declarations: [
    AppComponent,
    EthCompComponent,
    TokenOneSelectorComponent,
    CoinListComponent,
  ],
  imports: [BrowserModule, AppRoutingModule, CommonModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
