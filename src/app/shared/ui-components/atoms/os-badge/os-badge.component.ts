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
  | 'info'
  | 'goal-active'
  | 'goal-completed'
  | 'goal-overdue';
export type OsBadgeSize = 'sm' | 'md' | 'lg' | 'xl';
export type OsBadgePosition = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'inline';
export type OsBadgeRole = 'status' | 'alert' | 'decorative';

@Component({
  selector: 'os-badge',
  standalone: true,
  imports: [CommonModule, MatBadgeModule, OsIconComponent],
  template: `
    <div
      [class]="badgeClass()"
      [attr.aria-label]="ariaLabel() || null"
      [attr.title]="title() || null"
      [attr.aria-hidden]="ariaHidden()"
      [attr.role]="badgeRole()"
    >
      @if (position() === 'inline') { @if (icon() && !text()) {
      <os-icon [name]="icon()" [size]="iconSize()" [variant]="iconVariant()" [ariaHidden]="true" />
      } @else if (text()) {
      <span [class]="textClass()">{{ displayText() }}</span>
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
        <span [class]="textClass()">{{ displayText() }}</span>
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
  role = input<OsBadgeRole>('decorative');
  ariaLabel = input<string>('');
  title = input<string>('');
  animated = input(true);
  maxValue = input<number>(99);
  badgeClass = computed(() => {
    return [
      'os-badge',
      `os-badge--${this.variant()}`,
      `os-badge--${this.size()}`,
      `os-badge--${this.position()}`,
      this.pill() ? 'os-badge--pill' : '',
      this.outlined() ? 'os-badge--outlined' : '',
      this.dot() ? 'os-badge--dot' : '',
      this.animated() ? 'os-badge--animated' : '',
    ]
      .filter(Boolean)
      .join(' ');
  });

  // Computed properties para acessibilidade
  ariaHidden = computed(() => {
    return this.role() === 'decorative';
  });

  badgeRole = computed(() => {
    switch (this.role()) {
      case 'status':
        return 'status';
      case 'alert':
        return 'alert';
      default:
        return null;
    }
  });

  // Formatação de números grandes
  displayText = computed(() => {
    const text = this.text();
    if (!text) return '';

    // Verificar se é um número
    const numValue = parseInt(text, 10);
    if (!isNaN(numValue) && numValue > this.maxValue()) {
      return `${this.maxValue()}+`;
    }

    return text;
  });

  textClass = computed(() => {
    return ['os-badge__text', this.outlined() ? 'os-badge__text--outlined' : '']
      .filter(Boolean)
      .join(' ');
  });

  iconSize = computed(() => {
    const sizeMap: Record<OsBadgeSize, 'xs' | 'sm' | 'md' | 'lg'> = {
      sm: 'xs',
      md: 'sm',
      lg: 'md',
      xl: 'lg',
    };
    return sizeMap[this.size()];
  });

  iconVariant = computed(() => {
    if (this.outlined()) {
      // Mapear variants específicos para variants de ícone suportados
      switch (this.variant()) {
        case 'goal-active':
          return 'primary';
        case 'goal-completed':
          return 'success';
        case 'goal-overdue':
          return 'warning';
        default:
          return this.variant() as
            | 'default'
            | 'primary'
            | 'secondary'
            | 'success'
            | 'warning'
            | 'error'
            | 'info';
      }
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
      case 'goal-completed':
        return 'primary';
      case 'warning':
      case 'goal-overdue':
        return 'warn';
      case 'error':
        return 'warn';
      case 'info':
      case 'goal-active':
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
      case 'xl':
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
      return this.displayText();
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
