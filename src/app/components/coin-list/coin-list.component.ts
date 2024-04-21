import { Component, OnInit } from '@angular/core';
import { ModalService } from '../../../services/modal.service'; // Ajusta la ruta según sea necesario

@Component({
  selector: 'app-coin-list',
  templateUrl: './coin-list.component.html',
  styleUrls: ['./coin-list.component.scss'],
})
export class CoinListComponent {
  display$ = this.modalService.watch();
  showModal = true;

  constructor(private modalService: ModalService) {}

  handleModalVisibility() {
    console.log('Closing modal...');
    this.showModal = !this.showModal;
  }
}
