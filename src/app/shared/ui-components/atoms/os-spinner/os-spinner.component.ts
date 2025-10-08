import { Component, input, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

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
  imports: [CommonModule],
  template: `
    <div
      [class]="spinnerClass()"
      [attr.aria-label]="ariaLabel() || 'Loading'"
      [attr.aria-hidden]="ariaHidden()"
    >
      <div [class]="spinnerInnerClass()"></div>
    </div>
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
}
