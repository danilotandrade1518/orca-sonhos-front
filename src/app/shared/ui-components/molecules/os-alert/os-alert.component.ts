import {
  Component,
  input,
  output,
  computed,
  effect,
  signal,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { OsIconComponent } from '../../atoms/os-icon/os-icon.component';
import { OsButtonComponent } from '../../atoms/os-button/os-button.component';

export type OsAlertType = 'success' | 'warning' | 'error' | 'info';
export type OsAlertSize = 'small' | 'medium' | 'large';
export type OsAlertRole = 'alert' | 'status' | 'alertdialog';

@Component({
  selector: 'os-alert',
  standalone: true,
  imports: [CommonModule, OsIconComponent, OsButtonComponent],
  template: `
    @if (visible()) {
    <div
      class="os-alert"
      [class]="alertClasses()"
      [attr.data-type]="type()"
      [attr.data-size]="size()"
      [attr.data-role]="role()"
      [attr.data-animated]="animated()"
      [attr.role]="role()"
      [attr.aria-live]="ariaLive()"
      [attr.aria-label]="effectiveAriaLabel()"
    >
      @if (showIcon()) {
      <div class="os-alert__icon">
        <os-icon [name]="iconName()" [size]="iconSize()" [variant]="iconVariant()" />
      </div>
      }

      <div class="os-alert__content">
        @if (title()) {
        <div class="os-alert__title">{{ title() }}</div>
        }
        <div class="os-alert__message">
          <ng-content></ng-content>
        </div>
      </div>

      @if (dismissible()) {
      <os-button
        variant="tertiary"
        size="small"
        [icon]="'close'"
        (buttonClick)="onDismiss()"
        [attr.aria-label]="'Fechar alerta'"
      />
      }
    </div>
    }
  `,
  styleUrl: './os-alert.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'os-alert-host',
  },
})
export class OsAlertComponent {
  type = input<OsAlertType>('info');
  size = input<OsAlertSize>('medium');
  title = input<string>('');
  dismissible = input<boolean>(false);
  showIcon = input<boolean>(true);
  role = input<OsAlertRole>('alert');
  autoDismiss = input<boolean>(false);
  autoDismissDelay = input<number>(5000);
  animated = input<boolean>(true);
  ariaLabel = input<string | undefined>(undefined);

  dismiss = output<void>();

  visible = signal<boolean>(true);

  private autoDismissTimer: ReturnType<typeof setTimeout> | null = null;

  constructor() {
    effect(() => {
      if (this.autoDismiss() && this.visible()) {
        this.autoDismissTimer = setTimeout(() => {
          if (this.visible()) {
            this.onDismiss();
          }
        }, this.autoDismissDelay());
      }
    });
  }

  protected iconName = computed(() => {
    const iconMap: Record<OsAlertType, string> = {
      success: 'check_circle',
      warning: 'warning',
      error: 'error',
      info: 'info',
    };
    return iconMap[this.type()];
  });

  protected iconSize = computed(() => {
    const sizeMap: Record<OsAlertSize, 'sm' | 'md' | 'lg'> = {
      small: 'sm',
      medium: 'md',
      large: 'lg',
    };
    return sizeMap[this.size()];
  });

  protected iconVariant = computed(() => {
    switch (this.type()) {
      case 'success':
        return 'success';
      case 'warning':
        return 'warning';
      case 'error':
        return 'error';
      default:
        return 'info';
    }
  });

  alertClasses = computed(() => {
    const classes = ['os-alert'];

    if (this.type() !== 'info') {
      classes.push(`os-alert--${this.type()}`);
    }

    if (this.size() !== 'medium') {
      classes.push(`os-alert--${this.size()}`);
    }

    if (this.dismissible()) {
      classes.push('os-alert--dismissible');
    }

    if (this.animated()) {
      classes.push('os-alert--animated');
    }

    if (!this.visible()) {
      classes.push('os-alert--dismissing');
    }

    return classes.join(' ');
  });

  ariaLive = computed(() => {
    const roleMap: Record<OsAlertRole, 'polite' | 'assertive' | 'off'> = {
      alert: 'assertive',
      status: 'polite',
      alertdialog: 'assertive',
    };
    return roleMap[this.role()];
  });

  effectiveAriaLabel = computed(() => {
    if (this.ariaLabel()) {
      return this.ariaLabel();
    }
    const typeLabels: Record<OsAlertType, string> = {
      success: 'Mensagem de sucesso',
      warning: 'Mensagem de aviso',
      error: 'Mensagem de erro',
      info: 'Mensagem informativa',
    };
    return typeLabels[this.type()];
  });

  onDismiss(): void {
    if (this.autoDismissTimer) {
      clearTimeout(this.autoDismissTimer);
      this.autoDismissTimer = null;
    }

    this.visible.set(false);
    setTimeout(
      () => {
        if (!this.visible()) {
          this.dismiss.emit();
        }
      },
      this.animated() ? 300 : 0
    );
  }
}
