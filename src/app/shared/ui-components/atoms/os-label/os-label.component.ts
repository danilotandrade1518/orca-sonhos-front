import { Component, input, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

export type OsLabelVariant =
  | 'default'
  | 'primary'
  | 'secondary'
  | 'success'
  | 'warning'
  | 'error'
  | 'info';
export type OsLabelSize = 'small' | 'medium' | 'large';
export type OsLabelWeight = 'light' | 'regular' | 'medium' | 'semibold' | 'bold';

@Component({
  selector: 'os-label',
  standalone: true,
  imports: [CommonModule],
  template: `
    <label
      [class]="labelClass()"
      [for]="for()"
      [attr.aria-describedby]="ariaDescribedBy() || null"
      [attr.aria-label]="ariaLabel() || null"
    >
      <ng-content />
    </label>
  `,
  styleUrls: ['./os-label.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OsLabelComponent {
  variant = input<OsLabelVariant>('default');
  size = input<OsLabelSize>('medium');
  weight = input<OsLabelWeight>('regular');
  for = input<string>('');
  required = input(false);
  disabled = input(false);
  ariaDescribedBy = input<string>('');
  ariaLabel = input<string>('');

  labelClass = computed(() => {
    return [
      'os-label',
      `os-label--${this.variant()}`,
      `os-label--${this.size()}`,
      `os-label--${this.weight()}`,
      this.required() ? 'os-label--required' : '',
      this.disabled() ? 'os-label--disabled' : '',
    ]
      .filter(Boolean)
      .join(' ');
  });
}
