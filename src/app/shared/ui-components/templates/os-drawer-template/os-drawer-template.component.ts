import { CommonModule } from '@angular/common';
import { Component, computed, input, output, ChangeDetectionStrategy } from '@angular/core';
import { OsButtonComponent } from '../../atoms/os-button/os-button.component';

export interface DrawerTemplateConfig {
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
  selector: 'os-drawer-template',
  template: `
    <div [class]="drawerClass()" [attr.aria-label]="ariaLabel()">
      @if (config().showHeader ?? true) {
      <div class="os-drawer-template__header" [class]="headerClass()">
        <div class="os-drawer-template__header-content">
          <h2 class="os-drawer-template__title">{{ config().title }}</h2>
          @if (config().subtitle) {
          <p class="os-drawer-template__subtitle">{{ config().subtitle }}</p>
          }
        </div>
        @if (config().showCloseButton ?? true) {
        <os-button
          [variant]="'tertiary'"
          [size]="size()"
          [icon]="'close'"
          (click)="onClose()"
          [attr.aria-label]="'Fechar drawer'"
        />
        }
      </div>
      }

      <div class="os-drawer-template__content" [class]="contentClass()">
        <ng-content />
      </div>

      @if (config().showActions ?? true) {
      <div class="os-drawer-template__actions" [class]="actionsClass()">
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
    </div>
  `,
  styleUrls: ['./os-drawer-template.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, OsButtonComponent],
})
export class OsDrawerTemplateComponent {
  config = input.required<DrawerTemplateConfig>();
  size = input<'small' | 'medium' | 'large'>('medium');
  variant = input<'default' | 'compact' | 'detailed'>('default');
  theme = input<'light' | 'dark'>('light');
  position = input<'left' | 'right' | 'top' | 'bottom'>('right');
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

  drawerClass = computed(() => {
    return [
      'os-drawer-template',
      `os-drawer-template--${this.variant()}`,
      `os-drawer-template--${this.size()}`,
      `os-drawer-template--${this.theme()}`,
      `os-drawer-template--${this.position()}`,
      this.disabled() ? 'os-drawer-template--disabled' : '',
      this.loading() ? 'os-drawer-template--loading' : '',
    ]
      .filter(Boolean)
      .join(' ');
  });

  headerClass = computed(() => {
    return [
      'os-drawer-template__header',
      `os-drawer-template__header--${this.variant()}`,
      `os-drawer-template__header--${this.size()}`,
    ]
      .filter(Boolean)
      .join(' ');
  });

  contentClass = computed(() => {
    return [
      'os-drawer-template__content',
      `os-drawer-template__content--${this.variant()}`,
      `os-drawer-template__content--${this.size()}`,
      this.disabled() ? 'os-drawer-template__content--disabled' : '',
      this.loading() ? 'os-drawer-template__content--loading' : '',
    ]
      .filter(Boolean)
      .join(' ');
  });

  actionsClass = computed(() => {
    return [
      'os-drawer-template__actions',
      `os-drawer-template__actions--${this.variant()}`,
      `os-drawer-template__actions--${this.size()}`,
    ]
      .filter(Boolean)
      .join(' ');
  });

  isValid = computed(() => {
    return this.valid();
  });

  ariaLabel = computed(() => {
    return `Drawer: ${this.config().title}`;
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
}
