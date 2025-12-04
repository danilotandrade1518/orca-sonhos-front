import {
  Component,
  computed,
  ChangeDetectionStrategy,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { OsModalTemplateComponent, ModalTemplateConfig } from '../../templates/os-modal-template/os-modal-template.component';
import { OsIconComponent } from '../../atoms/os-icon/os-icon.component';

export type ConfirmDialogVariant = 'danger' | 'warning' | 'info';

export interface ConfirmDialogData {
  title: string;
  message: string;
  variant?: ConfirmDialogVariant;
  confirmText?: string;
  cancelText?: string;
}

@Component({
  selector: 'os-confirm-dialog',
  imports: [CommonModule, OsModalTemplateComponent, OsIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <os-modal-template
      [config]="modalConfig()"
      [variant]="'compact'"
      [size]="'small'"
      [disabled]="false"
      [loading]="false"
      [valid]="true"
      (confirmed)="onConfirm()"
      (cancelled)="onCancel()"
      (closed)="onCancel()"
      (backdropClick)="onCancel()"
      (escapeKey)="onCancel()"
    >
      <div class="os-confirm-dialog__content" [class]="contentClasses()">
        <div class="os-confirm-dialog__alert" [class]="alertClasses()" role="alert">
          <os-icon [fontIcon]="iconName()" [size]="'lg'" [variant]="iconVariant()" />
          <p class="os-confirm-dialog__message">{{ message() }}</p>
        </div>
      </div>
    </os-modal-template>
  `,
  styleUrls: ['./os-confirm-dialog.component.scss'],
})
export class OsConfirmDialogComponent {
  private readonly dialogRef = inject<MatDialogRef<OsConfirmDialogComponent>>(MatDialogRef);
  private readonly data = inject<ConfirmDialogData>(MAT_DIALOG_DATA, { optional: true });

  readonly title = signal<string>(this.data?.title || 'Confirmar ação');
  readonly message = signal<string>(this.data?.message || '');
  readonly variant = signal<ConfirmDialogVariant>(this.data?.variant || 'info');
  readonly confirmText = signal<string>(this.data?.confirmText || 'Confirmar');
  readonly cancelText = signal<string>(this.data?.cancelText || 'Cancelar');

  readonly confirmed = output<void>();
  readonly cancelled = output<void>();

  readonly modalConfig = computed<ModalTemplateConfig>(() => ({
    title: this.title(),
    showHeader: true,
    showFooter: true,
    showActions: true,
    showConfirmButton: true,
    showCancelButton: true,
    confirmButtonText: this.confirmText(),
    cancelButtonText: this.cancelText(),
  }));

  readonly contentClasses = computed(() => {
    return [
      'os-confirm-dialog__content',
      `os-confirm-dialog__content--${this.variant()}`,
    ].join(' ');
  });

  readonly alertClasses = computed(() => {
    return [
      'os-confirm-dialog__alert',
      `os-confirm-dialog__alert--${this.variant()}`,
    ].join(' ');
  });

  readonly iconName = computed(() => {
    const variant = this.variant();
    switch (variant) {
      case 'danger':
        return 'error_outline';
      case 'warning':
        return 'warning_amber';
      case 'info':
      default:
        return 'info_outline';
    }
  });

  readonly iconVariant = computed(() => {
    const variant = this.variant();
    switch (variant) {
      case 'danger':
        return 'error';
      case 'warning':
        return 'warning';
      case 'info':
      default:
        return 'info';
    }
  });

  onConfirm(): void {
    this.confirmed.emit();
    this.dialogRef?.close(true);
  }

  onCancel(): void {
    this.cancelled.emit();
    this.dialogRef?.close(false);
  }
}

