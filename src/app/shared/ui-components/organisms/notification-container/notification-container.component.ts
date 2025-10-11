import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OsAlertComponent } from '../../molecules/os-alert/os-alert.component';
import { OsSpinnerComponent } from '../../atoms/os-spinner/os-spinner.component';
import { NotificationService } from '../../../../core/services/notification/notification.service';

@Component({
  selector: 'os-notification-container',
  standalone: true,
  imports: [CommonModule, OsAlertComponent, OsSpinnerComponent],
  template: `
    <!-- Global Loading Spinner -->
    @if (notificationService.isLoading()) {
    <div class="os-notification-container__loading">
      <os-spinner size="md" variant="primary" ariaLabel="Carregando..." />
    </div>
    }

    <!-- Notifications -->
    <div class="os-notification-container__notifications">
      @for (notification of notificationService.notifications(); track notification.id) {
      <os-alert
        [type]="notification.type"
        [title]="notification.title || ''"
        [dismissible]="notification.dismissible ?? true"
        (dismiss)="onDismiss(notification.id)"
        class="os-notification-container__alert"
      >
        {{ notification.message }}
      </os-alert>
      }
    </div>
  `,
  styleUrl: './notification-container.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationContainerComponent {
  protected readonly notificationService = inject(NotificationService);

  onDismiss(notificationId: string): void {
    this.notificationService.dismissNotification(notificationId);
  }
}
