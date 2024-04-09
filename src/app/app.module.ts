import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { EthCompComponent } from './components/eth-comp/eth-comp.component';
import { TokenOneSelectorComponent } from './components/token-one-selector/token-one-selector.component';

@NgModule({
  declarations: [
    AppComponent,
    EthCompComponent,
    TokenOneSelectorComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
