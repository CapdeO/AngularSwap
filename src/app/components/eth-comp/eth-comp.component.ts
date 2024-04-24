import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { EthAuthService } from 'src/services/eth-auth.service';
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

  


  /***********************************************************/
  constructor(
    private cdr: ChangeDetectorRef,
    private ethereumService: EthAuthService
  ) {}

  ngOnInit(): void {
    this.ethereumService.loginUser.subscribe((res: boolean) => {
      this.loginUser = res;
      this.cdr.detectChanges();
    });
  }

  async connectToMetaMask() {
    await this.ethereumService.connectToMetaMaskWallet();
  }

  handleShowModalComponent() {
    console.log('opening modal');
    this.showModalComponent = !this.showModalComponent;
  }
}

