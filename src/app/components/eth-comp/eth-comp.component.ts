import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { EthAuthService } from 'src/services/eth-auth.service';
import { SwapService, TokenType } from 'src/services/swap.service';
/* import { ModalService } from 'src/services/modal.service'; */
import { FetchService } from 'src/services/fetch.service';
import { NotificationService } from '../../../services/notification.service';

@Component({
  selector: 'app-eth-comp',
  templateUrl: './eth-comp.component.html',
  styleUrls: ['./eth-comp.component.scss'],
})
export class EthCompComponent implements OnInit {
  /*  */

  /*************** Variables y estados locales ***************/
  isLoading: boolean = false; // Cuando se cambia a true, se muestran los spinners de loading en el botón que se esté renderizando
  loginUser: boolean = false;
  showModalComponent: boolean = false;
  isApproved: boolean = false;
  // isSwapped = false;
  selectedToken: number = 1;
  tokenOne: TokenType;
  tokenTwo: TokenType;
  tokenOneBalance: number = 0;
  tokenTwoBalance: number = 0;
  topAmountOfTokens: number = 1; // cantidad de tokens de la parte de arriba
  topAmountOfTokensOldValue: number = 1;
  cresioPrice: any = 0;
  bottomAmountOfTokens: number = 0; // cantidad de tokens a recibir (de la parte de abajo)
  @ViewChild('input', { static: false }) input;

  /***********************************************************/
  constructor(
    private cdr: ChangeDetectorRef,
    private ethereumService: EthAuthService,
    private swapService: SwapService,
    private fetchService: FetchService,
    private notificationService: NotificationService
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
    this.ethereumService.loginUser.subscribe(async (res: boolean) => {
      this.loginUser = res;
      this.cdr.detectChanges();

      if (res) {
        await this.swapService.getTokenBalance(
          this.swapService.balanceTokenOne,
          this.swapService.tokenOne.getValue()
        );
        await this.swapService.getTokenBalance(
          this.swapService.balanceTokenTwo,
          this.swapService.tokenTwo.getValue()
        );
      }
    });

    this.swapService.tokenOne.subscribe(async (token) => {
      this.tokenOne = token;
      if (this.loginUser) {
        await this.swapService.getTokenBalance(
          this.swapService.balanceTokenOne,
          this.swapService.tokenOne.getValue()
        );
      }

      if (token.name === 'Matic') {
        this.isApproved = true;
      } else {
        this.isApproved = false;
      }
    });

    this.swapService.tokenTwo.subscribe(async (token) => {
      this.tokenTwo = token;
      if (this.loginUser) {
        await this.swapService.getTokenBalance(
          this.swapService.balanceTokenTwo,
          this.swapService.tokenTwo.getValue()
        );
      }
    });

    this.swapService.balanceTokenOne.subscribe((balance) => {
      this.tokenOneBalance = balance;
    });

    this.swapService.balanceTokenTwo.subscribe((balance) => {
      this.tokenTwoBalance = balance;
    });

    this.fetchService
      .fetchPrices(
        '0xc2132d05d31c914a87c6611c10748aeb04b58e8f',
        '0xFA3c05C2023918A4324fDE7163591Fe6BEBd1692'
      )
      .subscribe(
        (data: any) => {
          console.log(data);
          this.cresioPrice = data.tokenTwo;
          this.bottomAmountOfTokens = this.topAmountOfTokens / this.cresioPrice;
        },
        (error: any) => {
          console.log(error);
        }
      );
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

    let currentTokenOne: TokenType = this.tokenOne;
    let currentTokenTwo: TokenType = this.tokenTwo;

    this.swapService.tokenOne.next(currentTokenTwo);
    this.swapService.tokenTwo.next(currentTokenOne);
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
      console.log('Valor inválido');
    } else {
      this.topAmountOfTokens = newValue;
      this.topAmountOfTokensOldValue = newValue;
      console.log('Nuevo valor del input: ', newValue);

      this.swapService.amountIn.next(newValue);
      console.log(
        'Nuevo valor del servicio: ',
        this.swapService.amountIn.value
      );

      this.bottomAmountOfTokens = newValue / this.cresioPrice;
    }
  }

  async handleApprove() {
    await this.swapService
      .approvePermitContract()
      .then(async (tx) => {
        await tx.wait();
        alert('Aprobación completada exitosamente');
        this.isApproved = true;
      })
      .catch((error) => {
        alert(`Ocurrió un error en la aprobación: ${error.reason}`);
      });
  }

  async handleSwap() {
    await this.swapService
      .executeSwap()
      .then(async (tx) => {
        await tx.wait();
        alert('Swap completado');
        this.isApproved = false;
      })
      .catch((error) => {
        alert(`Ocurrió un error en el swap: ${error.reason}`);
      });
  }

  async handleSetMax() {
    const tokenOneBalance = await this.swapService.getWeiTokenBalance();
    this.topAmountOfTokens = tokenOneBalance;
    this.topAmountOfTokensOldValue = tokenOneBalance;
    console.log('Nuevo valor del input: ', tokenOneBalance);

    this.swapService.amountIn.next(tokenOneBalance);
    console.log('Nuevo valor del servicio: ', this.swapService.amountIn.value);

    this.bottomAmountOfTokens = this.topAmountOfTokens / this.cresioPrice;
  }



  /* Notificaciones */
  triggerSuccess() {
    this.notificationService.showNotification('success', 'Operación exitosa.');
  }

  triggerError() {
    this.notificationService.showNotification('error', 'Ocurrió un error.');
  }
}
