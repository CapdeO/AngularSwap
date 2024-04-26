import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { EthAuthService } from 'src/services/eth-auth.service';
import { SwapService, Token } from 'src/services/swap.service';
/* import { ModalService } from 'src/services/modal.service'; */

@Component({
  selector: 'app-eth-comp',
  templateUrl: './eth-comp.component.html',
  styleUrls: ['./eth-comp.component.scss'],
})
export class EthCompComponent implements OnInit {
  /*  */

  /*************** Variables y estados locales ***************/

  loginUser: boolean = false;
  showModalComponent: boolean = false;
  isSwapped = false;
  selectedToken: number = 1;
  tokenOne: Token;
  tokenTwo: Token;
  topAmountOfTokens: number = 0; // cantidad de tokens de la parte de arriba
  bottomAmountOfTokens: number = 0; // cantidad de tokens a recibir (de la parte de abajo)

  /***********************************************************/
  constructor(
    private cdr: ChangeDetectorRef,
    private ethereumService: EthAuthService,
    private swapService: SwapService
  ) {
    this.tokenOne = {
      name: '',
      symbol: '',
      logo: '',
      address: '',
      decimals: 0,
    };
    this.tokenTwo = {
      name: '',
      symbol: '',
      logo: '',
      address: '',
      decimals: 0,
    };
  }

  ngOnInit(): void {
    this.ethereumService.loginUser.subscribe((res: boolean) => {
      this.loginUser = res;
      this.cdr.detectChanges();
    });

    this.swapService.tokenOne.subscribe((token) => {
      this.tokenOne = token;
    });

    this.swapService.tokenTwo.subscribe((token) => {
      this.tokenTwo = token;
    });
  }

  async connectToMetaMask() {
    await this.ethereumService.connectToMetaMaskWallet();
  }

  handleShowModalComponent(tokenNumber: number) {
    this.selectedToken = tokenNumber;
    console.log('opening modal');
    this.showModalComponent = !this.showModalComponent;
  }

  // hace que los componentes de input suban o bajen al clickear el boton de la flecha en medio
  toggleSwap() {
    this.isSwapped = !this.isSwapped;
  }

  /*   logPayAmount() {
    console.log('payAmount', this.payAmount); // Correcto: dentro de un método.
  } */

  logChange(variableName: string, value: any) {
    console.log(`${variableName} changed to:`, value);
  }
}

