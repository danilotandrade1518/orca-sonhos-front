import { Component, input, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatBadgeModule } from '@angular/material/badge';
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
  imports: [CommonModule, MatBadgeModule, OsIconComponent],
  template: `
    <div [class]="badgeClass()" [attr.aria-label]="ariaLabel() || null">
      @if (position() === 'inline') { @if (icon() && !text()) {
      <os-icon [name]="icon()" [size]="iconSize()" [variant]="iconVariant()" [ariaHidden]="true" />
      } @else if (text()) {
      <span [class]="textClass()">{{ text() }}</span>
      } @if (dot() && !text() && !icon()) {
      <span class="os-badge__dot" [attr.aria-label]="ariaLabel() || 'Badge'"></span>
      } } @else {
      <div
        [matBadge]="badgeContent()"
        [matBadgeColor]="matColor()"
        [matBadgeSize]="matSize()"
        [matBadgePosition]="matPosition()"
        [matBadgeOverlap]="false"
        [matBadgeHidden]="!shouldShowBadge()"
        class="os-badge__wrapper"
      >
        @if (icon() && !text()) {
        <os-icon
          [name]="icon()"
          [size]="iconSize()"
          [variant]="iconVariant()"
          [ariaHidden]="true"
        />
        } @else if (text()) {
        <span [class]="textClass()">{{ text() }}</span>
        } @if (dot() && !text() && !icon()) {
        <span class="os-badge__dot" [attr.aria-label]="ariaLabel() || 'Badge'"></span>
        }
      </div>
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

  // Mapeamento interno para Material
  protected matColor = computed(() => {
    switch (this.variant()) {
      case 'primary':
        return 'primary';
      case 'secondary':
        return 'accent';
      case 'success':
        return 'primary';
      case 'warning':
        return 'warn';
      case 'error':
        return 'warn';
      case 'info':
        return 'accent';
      default:
        return undefined;
    }
  });

  protected matSize = computed(() => {
    switch (this.size()) {
      case 'sm':
        return 'small';
      case 'md':
        return 'medium';
      case 'lg':
        return 'large';
      default:
        return 'medium';
    }
  });

  protected matPosition = computed(() => {
    switch (this.position()) {
      case 'top-right':
        return 'above after';
      case 'top-left':
        return 'above before';
      case 'bottom-right':
        return 'below after';
      case 'bottom-left':
        return 'below before';
      default:
        return 'above after';
    }
  });

  protected badgeContent = computed(() => {
    if (this.text()) {
      return this.text();
    }
    if (this.dot()) {
      return '';
    }
    return null;
  });

  protected shouldShowBadge = computed(() => {
    return this.text() || this.dot();
  });
}
