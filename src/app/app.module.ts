import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common'; // Importa CommonModule
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { EthCompComponent } from './components/eth-comp/eth-comp.component';
import { CoinListComponent } from './components/coin-list/coin-list.component';
import { FormsModule } from '@angular/forms'; // Importa FormsModule
import { HttpClientModule } from '@angular/common/http';
import { NotificationComponent } from './components/notification/notification.component'

@NgModule({
  declarations: [
    AppComponent,
    EthCompComponent,
    CoinListComponent,
    NotificationComponent,
  ],
  imports: [BrowserModule, AppRoutingModule, CommonModule, FormsModule, HttpClientModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
