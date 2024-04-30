// src/app/notification.service.ts

import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

export interface NotificationMessage {
  state: 'success' | 'error';
  text: string;
}

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private notificationSubject = new Subject<NotificationMessage | null>();

  constructor() {}

  getNotification(): Observable<NotificationMessage | null> {
    return this.notificationSubject.asObservable();
  }

  showNotification(state: 'success' | 'error', text: string): void {
    this.notificationSubject.next({ state, text });
    setTimeout(() => {
      this.notificationSubject.next(null); // Clears the notification after 5 seconds
    }, 5000);
  }
}
