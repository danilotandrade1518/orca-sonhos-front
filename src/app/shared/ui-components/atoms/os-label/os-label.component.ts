import { Component, input, computed, signal, ChangeDetectionStrategy } from '@angular/core';
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
      [id]="labelId"
      [class]="labelClass()"
      [for]="for()"
      [attr.aria-describedby]="ariaDescribedBy() || null"
      [attr.aria-label]="ariaLabel() || null"
      [attr.aria-required]="required() ? 'true' : 'false'"
      [attr.aria-disabled]="disabled() ? 'true' : 'false'"
      [attr.tabindex]="disabled() ? -1 : 0"
      (mouseenter)="onMouseEnter()"
      (mouseleave)="onMouseLeave()"
      (focus)="onFocus($event)"
      (blur)="onBlur($event)"
      (click)="onClick()"
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
  animated = input(true);
  hapticFeedback = input(true);

  labelId = `os-label-${Math.random().toString(36).substr(2, 9)}`;
  isFocused = signal(false);
  isHovered = signal(false);

  labelClass = computed(() => {
    return [
      'os-label',
      `os-label--${this.variant()}`,
      `os-label--${this.size()}`,
      `os-label--${this.weight()}`,
      this.required() ? 'os-label--required' : '',
      this.disabled() ? 'os-label--disabled' : '',
      this.isFocused() ? 'os-label--focused' : '',
      this.isHovered() ? 'os-label--hovered' : '',
      this.animated() ? 'os-label--animated' : '',
    ]
      .filter(Boolean)
      .join(' ');
  });

  onMouseEnter(): void {
    this.isHovered.set(true);
  }

  onMouseLeave(): void {
    this.isHovered.set(false);
  }

  onFocus(event: FocusEvent): void {
    this.isFocused.set(true);
  }

  onBlur(event: FocusEvent): void {
    this.isFocused.set(false);
  }

  onClick(): void {
    if (!this.disabled()) {
      this.triggerHapticFeedback();
    }
  }

  triggerHapticFeedback(): void {
    if (this.hapticFeedback() && 'vibrate' in navigator) {
      navigator.vibrate(50); // 50ms vibration
    }
  }
}
