import { Component, input, output, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OsIconComponent } from '../../atoms/os-icon/os-icon.component';
import { OsButtonComponent } from '../../atoms/os-button/os-button.component';

export type OsAlertType = 'success' | 'warning' | 'error' | 'info';
export type OsAlertSize = 'small' | 'medium' | 'large';

@Component({
  selector: 'os-alert',
  standalone: true,
  imports: [CommonModule, OsIconComponent, OsButtonComponent],
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

  // Mapeamento interno para Atoms
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
