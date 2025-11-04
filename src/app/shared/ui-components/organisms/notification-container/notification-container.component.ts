import { Component, inject, ChangeDetectionStrategy, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OsAlertComponent } from '../../molecules/os-alert/os-alert.component';
import { OsSpinnerComponent } from '../../atoms/os-spinner/os-spinner.component';
import { NotificationService } from '../../../../core/services/notification/notification.service';

@Component({
  selector: 'os-notification-container',
  standalone: true,
  imports: [CommonModule, OsAlertComponent, OsSpinnerComponent],
  template: `
    <div class="os-notification-container">
      @if (isLoading()) {
      <div class="os-notification-container__loading" role="status" aria-live="polite">
        <os-spinner size="md" variant="primary" ariaLabel="Carregando..." />
      </div>
      }

      <div
        class="os-notification-container__notifications"
        role="alert"
        aria-live="polite"
        aria-label="Notificações"
      >
        @for (notification of notifications(); track notification.id) {
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
    </div>
  `,
  styleUrl: './notification-container.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationContainerComponent {
  private readonly notificationService = inject(NotificationService);

  protected readonly isLoading = computed(() => this.notificationService.isLoading());
  protected readonly notifications = computed(() => this.notificationService.notifications());

  onDismiss(notificationId: string): void {
    this.notificationService.dismissNotification(notificationId);
  }
}
