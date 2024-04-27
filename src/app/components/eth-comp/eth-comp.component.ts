import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { EthAuthService } from 'src/services/eth-auth.service';
import { SwapService, TokenType } from 'src/services/swap.service';
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
  // isSwapped = false;
  selectedToken: number = 1;
  tokenOne: TokenType;
  tokenTwo: TokenType;
  topAmountOfTokens: number = 1; // cantidad de tokens de la parte de arriba
  topAmountOfTokensOldValue: number = 1;
  bottomAmountOfTokens: number = 1; // cantidad de tokens a recibir (de la parte de abajo)
  @ViewChild('input', { static: false }) input;

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
    // this.isSwapped = !this.isSwapped;

    let currentTokenOne: TokenType = this.tokenOne
    let currentTokenTwo: TokenType = this.tokenTwo

    this.swapService.tokenOne.next(currentTokenTwo)
    this.swapService.tokenTwo.next(currentTokenOne)
  }

  /*   logPayAmount() {
    console.log('payAmount', this.payAmount); // Correcto: dentro de un método.
  } */

  logChange(variableName: string, value: any) {
    console.log(`${variableName} changed to:`, value);
  }

  handleInputChange(newValue: any) {
    const regex = /^\d*\.?\d*$/;

    // Se borra todo PERO SE ESCRIBEN CARÁCTERES NO PERMITIDOS !! D:

    // if (regex.test(newValue) || !newValue) {
    //   this.topAmountOfTokens = newValue;
    //   this.topAmountOfTokensOldValue = newValue;
    // } else {
    //   this.input.nativeElement.value = this.topAmountOfTokensOldValue;
    //   console.log(newValue)
    // }

    if (!regex.test(newValue)) {
      this.input.nativeElement.value = this.topAmountOfTokensOldValue;
      console.log('Valor inválido')
    } else {

      this.topAmountOfTokens = newValue;
      this.topAmountOfTokensOldValue = newValue;
      console.log('Nuevo valor del input: ', newValue)

      this.swapService.amountIn.next(newValue)
      console.log('Nuevo valor del servicio: ', this.swapService.amountIn.value)
    }
  }

  async handleApprove() {
    await this.swapService.approvePermitContract()
      .then(async (tx) => {
        await tx.wait()
        alert('Aprobación completada exitosamente');
      })
      .catch((error) => {
        alert(`Ocurrió un error en la aprobación: ${error.reason}`);
      });
  }

}

