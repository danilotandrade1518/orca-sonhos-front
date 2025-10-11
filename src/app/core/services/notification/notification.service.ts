import { Injectable, signal, computed } from '@angular/core';
import { OsAlertType } from '../../../shared/ui-components/molecules/os-alert/os-alert.component';

export interface Notification {
  id: string;
  type: OsAlertType;
  title?: string;
  message: string;
  dismissible?: boolean;
  duration?: number;
}

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private readonly _notifications = signal<Notification[]>([]);
  private readonly _isLoading = signal<boolean>(false);

  readonly notifications = this._notifications.asReadonly();
  readonly isLoading = this._isLoading.asReadonly();
  readonly hasNotifications = computed(() => this._notifications().length > 0);

  showSuccess(message: string, title?: string, duration = 5000): string {
    return this.addNotification({
      type: 'success',
      message,
      title,
      dismissible: true,
      duration,
    });
  }

  showError(message: string, title?: string, duration = 8000): string {
    return this.addNotification({
      type: 'error',
      message,
      title,
      dismissible: true,
      duration,
    });
  }

  showWarning(message: string, title?: string, duration = 6000): string {
    return this.addNotification({
      type: 'warning',
      message,
      title,
      dismissible: true,
      duration,
    });
  }

  showInfo(message: string, title?: string, duration = 4000): string {
    return this.addNotification({
      type: 'info',
      message,
      title,
      dismissible: true,
      duration,
    });
  }

  setLoading(loading: boolean): void {
    this._isLoading.set(loading);
  }

  dismissNotification(id: string): void {
    this._notifications.update((notifications) =>
      notifications.filter((notification) => notification.id !== id)
    );
  }

  clearAll(): void {
    this._notifications.set([]);
  }

  private addNotification(notification: Omit<Notification, 'id'>): string {
    const id = `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newNotification: Notification = {
      ...notification,
      id,
    };

    this._notifications.update((notifications) => [...notifications, newNotification]);

    if (notification.duration && notification.duration > 0) {
      setTimeout(() => {
        this.dismissNotification(id);
      }, notification.duration);
    }

    return id;
  }
}
