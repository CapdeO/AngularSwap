// src/app/notification/notification.component.ts

import { Component, OnInit } from '@angular/core';
import {
  NotificationService,
  NotificationMessage,
} from '../../../services/notification.service';

@Component({
  selector: 'app-notification',
  template: `
    <div
      *ngIf="notification"
      [ngClass]="{
        'success-notification': notification.state === 'success',
        'error-notification': notification.state === 'error'
      }"
      class="notification"
    >
      {{ notification.text }}
    </div>
  `,
  styleUrls: ['./notification.component.scss'],
})
export class NotificationComponent implements OnInit {
  notification: NotificationMessage | null = null;

  constructor(private notificationService: NotificationService) {}

  ngOnInit() {
    this.notificationService.getNotification().subscribe((message) => {
      this.notification = message;
    });
  }
}
