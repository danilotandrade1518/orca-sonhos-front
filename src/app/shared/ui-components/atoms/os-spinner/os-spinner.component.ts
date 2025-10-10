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

@Component({
  selector: 'os-spinner',
  standalone: true,
  imports: [CommonModule, MatProgressSpinnerModule],
  template: `
    <mat-spinner
      [class]="spinnerClass()"
      [attr.aria-label]="ariaLabel() || 'Loading'"
      [attr.aria-hidden]="ariaHidden()"
      [diameter]="matDiameter()"
      [color]="matColor()"
    ></mat-spinner>
  `,
  styleUrls: ['./os-spinner.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OsSpinnerComponent {
  size = input<OsSpinnerSize>('md');
  variant = input<OsSpinnerVariant>('default');
  ariaLabel = input<string>('Loading');
  ariaHidden = input(false);
  spinnerClass = computed(() => {
    return ['os-spinner', `os-spinner--${this.size()}`, `os-spinner--${this.variant()}`]
      .filter(Boolean)
      .join(' ');
  });

  spinnerInnerClass = computed(() => {
    return ['os-spinner__inner', `os-spinner__inner--${this.size()}`].filter(Boolean).join(' ');
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
