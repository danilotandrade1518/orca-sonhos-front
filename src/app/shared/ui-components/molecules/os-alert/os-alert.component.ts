import { Component, input, output, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OsIconComponent } from '../../atoms/os-icon/os-icon.component';

export type OsAlertType = 'success' | 'warning' | 'error' | 'info';
export type OsAlertSize = 'small' | 'medium' | 'large';

@Component({
  selector: 'os-alert',
  standalone: true,
  imports: [CommonModule, OsIconComponent],
  template: `
    <div
      class="os-alert"
      [class]="alertClasses()"
      [attr.data-type]="type()"
      [attr.data-size]="size()"
      [attr.role]="'alert'"
      [attr.aria-live]="'polite'"
    >
      @if (showIcon()) {
      <div class="os-alert__icon">
        <os-icon [name]="iconName()" [size]="iconSize()"></os-icon>
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
      <button
        class="os-alert__dismiss"
        (click)="onDismiss()"
        [attr.aria-label]="'Fechar alerta'"
        type="button"
      >
        <os-icon name="close" size="sm"></os-icon>
      </button>
      }
    </div>
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

  dismiss = output<void>();

  iconName = () => {
    const iconMap: Record<OsAlertType, string> = {
      success: 'check-circle',
      warning: 'warning',
      error: 'error',
      info: 'info',
    };
    return iconMap[this.type()];
  };

  iconSize = () => {
    const sizeMap: Record<OsAlertSize, 'sm' | 'md' | 'lg'> = {
      small: 'sm',
      medium: 'md',
      large: 'lg',
    };
    return sizeMap[this.size()];
  };

  alertClasses = () => {
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

    return classes.join(' ');
  };

  onDismiss(): void {
    this.dismiss.emit();
  }
}
