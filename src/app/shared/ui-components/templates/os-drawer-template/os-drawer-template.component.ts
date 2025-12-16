import { Component, computed, input, output, ChangeDetectionStrategy, signal } from '@angular/core';
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
    <div
      [class]="drawerClass()"
      [attr.aria-label]="ariaLabel()"
      [attr.aria-modal]="true"
      [attr.role]="'dialog'"
      [attr.tabindex]="-1"
      [attr.aria-describedby]="subtitleId()"
    >
      @if (config().showHeader ?? true) {
      <header class="os-drawer-template__header" [class]="headerClass()">
        <div class="os-drawer-template__header-content">
          <h2 class="os-drawer-template__title" [id]="titleId()" [attr.aria-level]="2">
            {{ config().title }}
          </h2>
          @if (config().subtitle) {
          <p
            class="os-drawer-template__subtitle"
            [id]="subtitleId()"
            [attr.aria-describedby]="titleId()"
          >
            {{ config().subtitle }}
          </p>
          }
        </div>
        @if (config().showCloseButton ?? true) {
        <os-button
          [variant]="'tertiary'"
          [size]="size()"
          [icon]="'close'"
          (click)="onClose()"
          [attr.aria-label]="'Fechar drawer'"
          [attr.aria-describedby]="titleId()"
        />
        }
      </header>
      }

      <main
        class="os-drawer-template__content"
        [class]="contentClass()"
        [attr.aria-labelledby]="titleId()"
        [attr.aria-describedby]="subtitleId()"
      >
        <ng-content />
      </main>

      @if (config().showActions ?? true) {
      <footer class="os-drawer-template__actions" [class]="actionsClass()">
        @if (config().showCancelButton ?? true) {
        <os-button
          [variant]="'secondary'"
          [size]="size()"
          [disabled]="disabled()"
          (click)="onCancel()"
          [attr.aria-label]="config().cancelButtonText || 'Cancelar'"
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
          [attr.aria-label]="config().confirmButtonText || 'Confirmar'"
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
          [attr.aria-label]="action.label"
        >
          {{ action.label }}
        </os-button>
        }
      </footer>
      }
    </div>
  `,
  styleUrls: ['./os-drawer-template.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [OsButtonComponent],
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

  private readonly componentId = signal(`drawer-${Math.random().toString(36).substr(2, 9)}`);

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

  titleId = computed(() => {
    return `${this.componentId()}-title`;
  });

  subtitleId = computed(() => {
    return `${this.componentId()}-subtitle`;
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
