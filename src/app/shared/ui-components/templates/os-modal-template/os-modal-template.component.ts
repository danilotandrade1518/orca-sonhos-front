import { Component, computed, input, output, ChangeDetectionStrategy } from '@angular/core';
import { OsModalComponent } from '../../organisms/os-modal/os-modal.component';
import { OsButtonComponent } from '../../atoms/os-button/os-button.component';

export interface ModalTemplateConfig {
  title: string;
  subtitle?: string;
  showCloseButton?: boolean;
  showHeader?: boolean;
  showFooter?: boolean;
  showActions?: boolean;
  closeButtonText?: string;
  confirmButtonText?: string;
  cancelButtonText?: string;
  showConfirmButton?: boolean;
  showCancelButton?: boolean;
  actions?: {
    label: string;
    variant: 'primary' | 'secondary' | 'tertiary' | 'danger';
    size: 'small' | 'medium' | 'large';
    disabled?: boolean;
    loading?: boolean;
    icon?: string;
  }[];
}

@Component({
  selector: 'os-modal-template',
  template: `
    <os-modal
      [variant]="modalVariant()"
      [size]="size()"
      [title]="config().title"
      [subtitle]="config().subtitle || null"
      (close)="onClose()"
      (backdropClick)="onBackdropClick()"
      (escapeKey)="onEscapeKey()"
    >
      <div class="os-modal-template__content" [class]="contentClass()">
        <ng-content />
      </div>

      @if (config().showActions ?? true) {
      <div class="os-modal-template__actions" [class]="actionsClass()">
        @if (config().showCancelButton ?? true) {
        <os-button
          [variant]="'secondary'"
          [size]="size()"
          [disabled]="disabled()"
          (click)="onCancel()"
        >
          {{ config().cancelButtonText || 'Cancelar' }}
        </os-button>
        } @if (config().showConfirmButton ?? true) {
        <os-button
          [variant]="'primary'"
          [size]="size()"
          [disabled]="disabled() || !isValid()"
          [loading]="loading()"
          (click)="onConfirm()"
        >
          {{ config().confirmButtonText || 'Confirmar' }}
        </os-button>
        } @for (action of config().actions || []; track action.label) {
        <os-button
          [variant]="action.variant"
          [size]="action.size"
          [disabled]="action.disabled || disabled()"
          [loading]="action.loading || false"
          [icon]="action.icon || ''"
          (click)="onActionClick(action)"
        >
          {{ action.label }}
        </os-button>
        }
      </div>
      }
    </os-modal>
  `,
  styleUrls: ['./os-modal-template.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [OsModalComponent, OsButtonComponent],
})
export class OsModalTemplateComponent {
  config = input.required<ModalTemplateConfig>();
  size = input<'small' | 'medium' | 'large'>('medium');
  variant = input<'default' | 'compact' | 'detailed'>('default');
  theme = input<'light' | 'dark'>('light');
  disabled = input(false);
  loading = input(false);
  valid = input(true);

  closed = output<void>();
  confirmed = output<void>();
  cancelled = output<void>();
  actionClick = output<{
    label: string;
    variant: 'primary' | 'secondary' | 'tertiary' | 'danger';
    size: 'small' | 'medium' | 'large';
    disabled?: boolean;
    loading?: boolean;
    icon?: string;
  }>();
  backdropClick = output<void>();
  escapeKey = output<void>();

  modalVariant = computed(() => {
    const variant = this.variant();
    return variant === 'compact' ? 'confirmation' : 'default';
  });

  contentClass = computed(() => {
    return [
      'os-modal-template__content',
      `os-modal-template__content--${this.variant()}`,
      `os-modal-template__content--${this.size()}`,
      this.disabled() ? 'os-modal-template__content--disabled' : '',
      this.loading() ? 'os-modal-template__content--loading' : '',
    ]
      .filter(Boolean)
      .join(' ');
  });

  actionsClass = computed(() => {
    return [
      'os-modal-template__actions',
      `os-modal-template__actions--${this.variant()}`,
      `os-modal-template__actions--${this.size()}`,
    ]
      .filter(Boolean)
      .join(' ');
  });

  isValid = computed(() => {
    return this.valid();
  });

  onClose(): void {
    this.closed.emit();
  }

  onConfirm(): void {
    this.confirmed.emit();
  }

  onCancel(): void {
    this.cancelled.emit();
  }

  onActionClick(action: {
    label: string;
    variant: 'primary' | 'secondary' | 'tertiary' | 'danger';
    size: 'small' | 'medium' | 'large';
    disabled?: boolean;
    loading?: boolean;
    icon?: string;
  }): void {
    this.actionClick.emit(action);
  }

  onBackdropClick(): void {
    this.backdropClick.emit();
  }

  onEscapeKey(): void {
    this.escapeKey.emit();
  }
}
