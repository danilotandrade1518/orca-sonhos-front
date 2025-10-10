import { Component, input, output, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { OsIconComponent } from '../../atoms/os-icon/os-icon.component';

export type OsNavigationItemSize = 'small' | 'medium' | 'large';
export type OsNavigationItemVariant = 'default' | 'primary' | 'secondary' | 'accent';

@Component({
  selector: 'os-navigation-item',
  standalone: true,
  imports: [CommonModule, RouterModule, OsIconComponent],
  template: `
    <div [class]="containerClass()" [attr.data-variant]="variant()" [attr.data-size]="size()">
      @if (routerLink()) {
      <a
        [routerLink]="routerLink()!"
        [queryParams]="queryParams()"
        [fragment]="fragment()"
        [class]="linkClass()"
        [attr.aria-current]="isActive() ? 'page' : null"
        [attr.aria-label]="ariaLabel()"
        (click)="handleClick($event)"
      >
        @if (icon()) {
        <os-icon [name]="icon()" [size]="getIconSize()" [variant]="getIconVariant()" />
        }
        <span [class]="textClass()">
          <ng-content />
        </span>
        @if (badge() && badge()! > 0) {
        <span [class]="badgeClass()" [attr.aria-label]="badge()! + ' notifications'">
          {{ badge()! > 99 ? '99+' : badge()! }}
        </span>
        }
      </a>
      } @else {
      <button
        [class]="buttonClass()"
        [disabled]="disabled()"
        [attr.aria-label]="ariaLabel()"
        [attr.aria-current]="isActive() ? 'page' : null"
        (click)="handleClick($event)"
      >
        @if (icon()) {
        <os-icon [name]="icon()" [size]="getIconSize()" [variant]="getIconVariant()" />
        }
        <span [class]="textClass()">
          <ng-content />
        </span>
        @if (badge() && badge()! > 0) {
        <span [class]="badgeClass()" [attr.aria-label]="badge()! + ' notifications'">
          {{ badge()! > 99 ? '99+' : badge()! }}
        </span>
        }
      </button>
      }
    </div>
  `,
  styleUrl: './os-navigation-item.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'os-navigation-item-host',
  },
})
export class OsNavigationItemComponent {
  label = input<string>('');
  icon = input<string>('');
  routerLink = input<string | string[] | undefined>(undefined);
  queryParams = input<Record<string, string | number | boolean> | undefined>(undefined);
  fragment = input<string | undefined>(undefined);
  variant = input<OsNavigationItemVariant>('default');
  size = input<OsNavigationItemSize>('medium');
  disabled = input(false);
  active = input(false);
  badge = input<number | null>(null);
  ariaLabel = input<string>('');

  itemClick = output<MouseEvent>();

  isActive = computed(() => this.active());

  // Mapeamento interno para Atoms
  protected getIconSize = () => {
    const sizeMap: Record<OsNavigationItemSize, 'sm' | 'md' | 'lg'> = {
      small: 'sm',
      medium: 'md',
      large: 'lg',
    };
    return sizeMap[this.size()];
  };

  protected getIconVariant = () => {
    const variantMap: Record<
      OsNavigationItemVariant,
      'default' | 'primary' | 'secondary' | 'info'
    > = {
      default: 'default',
      primary: 'primary',
      secondary: 'secondary',
      accent: 'info',
    };
    return variantMap[this.variant()];
  };

  containerClass = computed(() => {
    const classes = ['os-navigation-item'];

    if (this.variant() !== 'default') {
      classes.push(`os-navigation-item--${this.variant()}`);
    }

    if (this.size() !== 'medium') {
      classes.push(`os-navigation-item--${this.size()}`);
    }

    if (this.disabled()) {
      classes.push('os-navigation-item--disabled');
    }

    if (this.isActive()) {
      classes.push('os-navigation-item--active');
    }

    return classes.join(' ');
  });

  linkClass = computed(() => {
    const classes = ['os-navigation-item__link'];

    if (this.variant() !== 'default') {
      classes.push(`os-navigation-item__link--${this.variant()}`);
    }

    if (this.size() !== 'medium') {
      classes.push(`os-navigation-item__link--${this.size()}`);
    }

    return classes.join(' ');
  });

  buttonClass = computed(() => {
    const classes = ['os-navigation-item__button'];

    if (this.variant() !== 'default') {
      classes.push(`os-navigation-item__button--${this.variant()}`);
    }

    if (this.size() !== 'medium') {
      classes.push(`os-navigation-item__button--${this.size()}`);
    }

    return classes.join(' ');
  });

  textClass = computed(() => {
    const classes = ['os-navigation-item__text'];

    if (this.size() !== 'medium') {
      classes.push(`os-navigation-item__text--${this.size()}`);
    }

    return classes.join(' ');
  });

  badgeClass = computed(() => {
    const classes = ['os-navigation-item__badge'];

    if (this.size() !== 'medium') {
      classes.push(`os-navigation-item__badge--${this.size()}`);
    }

    return classes.join(' ');
  });

  handleClick(event: MouseEvent): void {
    if (!this.disabled()) {
      this.itemClick.emit(event);
    }
  }
}
