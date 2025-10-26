import { Component, input, output, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatRippleModule } from '@angular/material/core';
import { OsIconComponent } from '../os-icon';

export type OsButtonVariant =
  | 'primary'
  | 'secondary'
  | 'tertiary'
  | 'danger'
  | 'success'
  | 'warning';
export type OsButtonSize = 'small' | 'medium' | 'large';

@Component({
  selector: 'os-button',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatRippleModule, OsIconComponent],
  template: `
    <button
      [matButton]="buttonVariant"
      [disabled]="disabled() || loading()"
      [type]="type()"
      [class]="buttonClass()"
      matRipple
      [matRippleDisabled]="disabled() || loading()"
      [matRippleColor]="rippleColor()"
      (click)="handleClick($event)"
    >
      @if (loading()) {
      <span class="os-button__spinner" aria-hidden="true"></span>
      } @else if (icon() && !loading()) {
      <os-icon [name]="icon()" [ariaHidden]="true" />
      }
      <span class="os-button__content">
        <ng-content />
      </span>
    </button>
  `,
  styleUrls: ['./os-button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OsButtonComponent {
  variant = input<OsButtonVariant>('primary');
  size = input<OsButtonSize>('medium');
  disabled = input(false);
  loading = input(false);
  icon = input<string>('');
  type = input<'button' | 'submit' | 'reset'>('button');

  buttonClick = output<MouseEvent>();

  buttonClass = computed(() => {
    return [
      'os-button',
      `os-button--${this.variant()}`,
      `os-button--${this.size()}`,
      this.disabled() ? 'os-button--disabled' : '',
      this.loading() ? 'os-button--loading' : '',
    ]
      .filter(Boolean)
      .join(' ');
  });

  handleClick(event: MouseEvent): void {
    if (!this.disabled() && !this.loading()) {
      this.buttonClick.emit(event);
    }
  }

  protected rippleColor = computed(() => {
    switch (this.variant()) {
      case 'primary':
      case 'success':
        return 'rgba(255, 255, 255, 0.3)';
      case 'secondary':
      case 'tertiary':
        return 'rgba(59, 130, 246, 0.3)';
      case 'danger':
      case 'warning':
        return 'rgba(255, 255, 255, 0.3)';
      default:
        return 'rgba(0, 0, 0, 0.1)';
    }
  });

  get buttonVariant() {
    switch (this.variant()) {
      case 'primary':
      case 'danger':
      case 'success':
      case 'warning':
        return 'filled';

      case 'secondary':
        return 'outlined';

      case 'tertiary':
        return '';

      default:
        return 'elevated';
    }
  }
}
