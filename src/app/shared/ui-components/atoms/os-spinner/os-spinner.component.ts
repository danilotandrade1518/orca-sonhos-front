import { Component, input, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

export type OsSpinnerSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type OsSpinnerVariant =
  | 'default'
  | 'primary'
  | 'secondary'
  | 'success'
  | 'warning'
  | 'error'
  | 'info';
export type OsSpinnerRole = 'status' | 'progressbar' | 'presentation';
export type OsSpinnerType = 'default' | 'overlay';

@Component({
  selector: 'os-spinner',
  standalone: true,
  imports: [CommonModule, MatProgressSpinnerModule],
  template: `
    <div
      [class]="spinnerWrapperClass()"
      [attr.aria-live]="ariaLive()"
      [attr.aria-label]="ariaLabel()"
      [attr.role]="spinnerRole()"
    >
      <mat-spinner
        [class]="spinnerClass()"
        [attr.aria-label]="ariaLabel() || 'Loading'"
        [attr.aria-hidden]="ariaHidden()"
        [diameter]="matDiameter()"
        [color]="matColor()"
      ></mat-spinner>
    </div>
  `,
  styleUrls: ['./os-spinner.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OsSpinnerComponent {
  size = input<OsSpinnerSize>('md');
  variant = input<OsSpinnerVariant>('default');
  type = input<OsSpinnerType>('default');
  role = input<OsSpinnerRole>('status');
  ariaLabel = input<string>('Loading');
  ariaHidden = input(false);
  animated = input(true);
  fadeIn = input(true);
  fadeOut = input(true);

  spinnerWrapperClass = computed(() => {
    return [
      'os-spinner-wrapper',
      `os-spinner-wrapper--${this.type()}`,
      `os-spinner-wrapper--${this.size()}`,
      this.animated() ? 'os-spinner-wrapper--animated' : '',
      this.fadeIn() ? 'os-spinner-wrapper--fade-in' : '',
      this.fadeOut() ? 'os-spinner-wrapper--fade-out' : '',
    ]
      .filter(Boolean)
      .join(' ');
  });

  spinnerClass = computed(() => {
    return [
      'os-spinner',
      `os-spinner--${this.size()}`,
      `os-spinner--${this.variant()}`,
      this.animated() ? 'os-spinner--animated' : '',
    ]
      .filter(Boolean)
      .join(' ');
  });

  spinnerInnerClass = computed(() => {
    return ['os-spinner__inner', `os-spinner__inner--${this.size()}`].filter(Boolean).join(' ');
  });

  spinnerRole = computed(() => {
    return this.role();
  });

  ariaLive = computed(() => {
    return this.role() === 'status' ? 'polite' : null;
  });

  // Mapeamento interno para Angular Material
  protected matDiameter = computed(() => {
    switch (this.size()) {
      case 'xs':
        return 16;
      case 'sm':
        return 20;
      case 'md':
        return 24;
      case 'lg':
        return 32;
      case 'xl':
        return 40;
      default:
        return 24;
    }
  });

  protected matColor = computed(() => {
    switch (this.variant()) {
      case 'primary':
        return 'primary';
      case 'secondary':
        return 'accent';
      case 'success':
        return 'primary'; // Material não tem success, usar primary
      case 'warning':
        return 'accent'; // Material não tem warning, usar accent
      case 'error':
        return 'warn';
      case 'info':
        return 'primary'; // Material não tem info, usar primary
      default:
        return undefined; // Usar cor padrão do Material
    }
  });
}
