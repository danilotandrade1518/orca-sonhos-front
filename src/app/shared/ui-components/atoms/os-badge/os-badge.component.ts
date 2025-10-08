import { Component, input, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OsIconComponent } from '../os-icon/os-icon.component';

export type OsBadgeVariant =
  | 'default'
  | 'primary'
  | 'secondary'
  | 'success'
  | 'warning'
  | 'error'
  | 'info';
export type OsBadgeSize = 'sm' | 'md' | 'lg';
export type OsBadgePosition = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'inline';

@Component({
  selector: 'os-badge',
  standalone: true,
  imports: [CommonModule, OsIconComponent],
  template: `
    <div [class]="badgeClass()" [attr.aria-label]="ariaLabel() || null">
      @if (icon() && !text()) {
      <os-icon [name]="icon()" [size]="iconSize()" [variant]="iconVariant()" [ariaHidden]="true" />
      } @else if (text()) {
      <span [class]="textClass()">{{ text() }}</span>
      } @if (dot() && !text() && !icon()) {
      <span class="os-badge__dot" [attr.aria-label]="ariaLabel() || 'Badge'"></span>
      }
    </div>
  `,
  styleUrls: ['./os-badge.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OsBadgeComponent {
  text = input<string>('');
  icon = input<string>('');
  variant = input<OsBadgeVariant>('default');
  size = input<OsBadgeSize>('md');
  position = input<OsBadgePosition>('inline');
  dot = input(false);
  pill = input(false);
  outlined = input(false);
  ariaLabel = input<string>('');
  badgeClass = computed(() => {
    return [
      'os-badge',
      `os-badge--${this.variant()}`,
      `os-badge--${this.size()}`,
      `os-badge--${this.position()}`,
      this.pill() ? 'os-badge--pill' : '',
      this.outlined() ? 'os-badge--outlined' : '',
      this.dot() ? 'os-badge--dot' : '',
    ]
      .filter(Boolean)
      .join(' ');
  });

  textClass = computed(() => {
    return ['os-badge__text', this.outlined() ? 'os-badge__text--outlined' : '']
      .filter(Boolean)
      .join(' ');
  });

  iconSize = computed(() => {
    const sizeMap: Record<OsBadgeSize, 'xs' | 'sm' | 'md'> = {
      sm: 'xs',
      md: 'sm',
      lg: 'md',
    };
    return sizeMap[this.size()];
  });

  iconVariant = computed(() => {
    if (this.outlined()) {
      return this.variant();
    }
    return 'default';
  });
}
