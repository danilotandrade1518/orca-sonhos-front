import { Component, input, output, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { OsIconComponent } from '../../atoms/os-icon/os-icon.component';

export type OsNavigationItemSize = 'small' | 'medium' | 'large';
export type OsNavigationItemVariant = 'default' | 'primary' | 'secondary' | 'accent';
export type OsNavigationItemRole = 'navigation' | 'menuitem' | 'tab' | 'button';

@Component({
  selector: 'os-navigation-item',
  standalone: true,
  imports: [CommonModule, RouterModule, OsIconComponent],
  template: `
    <div 
      [class]="containerClass()" 
      [attr.data-variant]="variant()" 
      [attr.data-size]="size()"
      [attr.role]="role()"
      [attr.aria-describedby]="ariaDescribedBy()"
    >
      @if (routerLink()) {
      <a
        [routerLink]="routerLink()!"
        [queryParams]="queryParams()"
        [fragment]="fragment()"
        [class]="linkClass()"
        [attr.aria-current]="isActive() ? 'page' : null"
        [attr.aria-label]="effectiveAriaLabel()"
        [attr.aria-expanded]="hasSubNav() ? isExpanded() : null"
        [attr.tabindex]="disabled() ? -1 : 0"
        (click)="handleClick($event)"
        (keydown.enter)="handleKeyDown($any($event))"
        (keydown.space)="handleKeyDown($any($event))"
      >
        @if (icon()) {
        <os-icon 
          [name]="icon()" 
          [size]="getIconSize()" 
          [variant]="getIconVariant()"
          [attr.aria-hidden]="true"
        />
        }
        <span [class]="textClass()">
          <ng-content />
        </span>
        @if (hasSubNav()) {
        <os-icon 
          [name]="isExpanded() ? 'expand_less' : 'expand_more'" 
          [size]="'sm'"
          [attr.aria-hidden]="true"
          class="os-navigation-item__expand-icon"
        />
        }
        @if (badge() && badge()! > 0) {
        <span 
          [class]="badgeClass()" 
          [attr.aria-label]="getBadgeAriaLabel()"
          role="status"
        >
          {{ badge()! > 99 ? '99+' : badge()! }}
        </span>
        }
      </a>
      } @else {
      <button
        [class]="buttonClass()"
        [disabled]="disabled()"
        [attr.aria-label]="effectiveAriaLabel()"
        [attr.aria-current]="isActive() ? 'page' : null"
        [attr.aria-expanded]="hasSubNav() ? isExpanded() : null"
        [attr.type]="'button'"
        (click)="handleClick($event)"
        (keydown.enter)="handleKeyDown($any($event))"
        (keydown.space)="handleKeyDown($any($event))"
      >
        @if (icon()) {
        <os-icon 
          [name]="icon()" 
          [size]="getIconSize()" 
          [variant]="getIconVariant()"
          [attr.aria-hidden]="true"
        />
        }
        <span [class]="textClass()">
          <ng-content />
        </span>
        @if (hasSubNav()) {
        <os-icon 
          [name]="isExpanded() ? 'expand_less' : 'expand_more'" 
          [size]="'sm'"
          [attr.aria-hidden]="true"
          class="os-navigation-item__expand-icon"
        />
        }
        @if (badge() && badge()! > 0) {
        <span 
          [class]="badgeClass()" 
          [attr.aria-label]="getBadgeAriaLabel()"
          role="status"
        >
          {{ badge()! > 99 ? '99+' : badge()! }}
        </span>
        }
      </button>
      }
      @if (hasSubNav() && isExpanded()) {
      <div class="os-navigation-item__subnav" role="group">
        <ng-content select="[osSubNav]" />
      </div>
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
  ariaDescribedBy = input<string>('');
  role = input<OsNavigationItemRole>('navigation');
  hasSubNav = input(false);
  isExpanded = input(false);

  itemClick = output<MouseEvent>();
  toggle = output<void>();

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

  effectiveAriaLabel = computed(() => {
    if (this.ariaLabel()) {
      return this.ariaLabel();
    }
    const badgeText = this.badge() && this.badge()! > 0 
      ? ` (${this.badge()! > 99 ? '99+' : this.badge()!} notifications)` 
      : '';
    return `${this.label()}${badgeText}`;
  });

  getBadgeAriaLabel(): string {
    const count = this.badge()!;
    return count > 99 
      ? 'More than 99 notifications' 
      : `${count} notification${count > 1 ? 's' : ''}`;
  }

  handleClick(event: MouseEvent): void {
    if (!this.disabled()) {
      if (this.hasSubNav()) {
        event.preventDefault();
        this.toggle.emit();
      }
      this.itemClick.emit(event);
    }
  }

  handleKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      if (!this.disabled()) {
        if (this.hasSubNav()) {
          this.toggle.emit();
        }
        const mouseEvent = new MouseEvent('click', {
          bubbles: true,
          cancelable: true,
          view: window
        });
        this.itemClick.emit(mouseEvent);
      }
    }
  }
}
