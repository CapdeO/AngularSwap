/* import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  private display: BehaviorSubject<boolean> = new BehaviorSubject(false);

  watch() {
    return this.display.asObservable();
  }

  open() {
    this.display.next(true);
  }

  close() {
    this.display.next(false);
  }
}
 */
