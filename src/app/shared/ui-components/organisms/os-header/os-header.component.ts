import { Component, computed, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ChangeDetectionStrategy } from '@angular/core';
import { OsButtonComponent } from '../../atoms/os-button/os-button.component';
import { OsAvatarComponent } from '../../atoms/os-avatar/os-avatar.component';
import { OsNavigationItemComponent } from '../../molecules/os-navigation-item/os-navigation-item.component';
import { OsIconComponent } from '../../atoms/os-icon/os-icon.component';

export interface HeaderNavigationItem {
  label: string;
  icon?: string;
  route?: string;
  active?: boolean;
  badge?: number;
  disabled?: boolean;
}

export interface HeaderUserMenu {
  label: string;
  icon?: string;
  route?: string;
  action?: string;
  disabled?: boolean;
  divider?: boolean;
}

export interface HeaderAction {
  label: string;
  icon?: string;
  variant?: 'primary' | 'secondary' | 'tertiary' | 'danger';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
}

@Component({
  selector: 'os-header',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    OsButtonComponent,
    OsAvatarComponent,
    OsNavigationItemComponent,
    OsIconComponent,
  ],
  template: `
    <header class="os-header" [class]="headerClasses()" [attr.aria-label]="ariaLabel()">
      <div class="os-header__container">
        <!-- Logo/Brand Section -->
        <div class="os-header__brand">
          @if (logo()) {
          <a
            class="os-header__logo"
            [routerLink]="logoRoute()"
            [attr.aria-label]="logoAlt()"
            (click)="onLogoClick($event)"
          >
            @if (logoImage()) {
            <img [src]="logoImage()" [alt]="logoAlt()" class="os-header__logo-image" />
            } @else {
            <span class="os-header__logo-text">{{ logoText() }}</span>
            }
          </a>
          } @else if (logoText()) {
          <div class="os-header__logo-text-only">{{ logoText() }}</div>
          }
        </div>

        <!-- Navigation Section -->
        @if (navigationItems().length > 0) {
        <nav class="os-header__navigation" [attr.aria-label]="navigationAriaLabel()">
          <ul class="os-header__nav-list">
            @for (item of navigationItems(); track item.label) {
            <li class="os-header__nav-item">
              <os-navigation-item
                [label]="item.label"
                [icon]="item.icon || ''"
                [routerLink]="item.route"
                [active]="item.active || false"
                [badge]="item.badge || null"
                [disabled]="item.disabled || false"
                [variant]="getNavigationVariant()"
                [size]="getNavigationSize()"
                (itemClick)="onNavigationClick(item, $event)"
              />
            </li>
            }
          </ul>
        </nav>
        }

        <!-- Actions Section -->
        <div class="os-header__actions">
          @if (actions().length > 0) {
          <div class="os-header__action-buttons">
            @for (action of actions(); track action.label) {
            <os-button
              [variant]="action.variant || 'secondary'"
              [size]="action.size || 'medium'"
              [disabled]="action.disabled || false"
              [loading]="action.loading || false"
              [icon]="action.icon || ''"
              (buttonClick)="onActionClick(action, $event)"
            >
              {{ action.label }}
            </os-button>
            }
          </div>
          }

          <!-- User Menu -->
          @if (showUserMenu()) {
          <div class="os-header__user-menu">
            <button
              class="os-header__user-trigger"
              [class]="userTriggerClasses()"
              [disabled]="userMenuDisabled()"
              [attr.aria-label]="userMenuAriaLabel()"
              [attr.aria-expanded]="userMenuOpen()"
              [attr.aria-haspopup]="'menu'"
              (click)="toggleUserMenu()"
            >
              <os-avatar
                [image]="userAvatar() || ''"
                [initials]="userInitials() || ''"
                [size]="getAvatarSize()"
                [variant]="'circle'"
                [ariaLabel]="userName() || 'User'"
              />
              @if (showUserInfo()) {
              <div class="os-header__user-info">
                <span class="os-header__user-name">{{ userName() }}</span>
                @if (userRole()) {
                <span class="os-header__user-role">{{ userRole() }}</span>
                }
              </div>
              }
              <os-icon
                name="chevron-down"
                size="sm"
                class="os-header__user-chevron"
                [class]="userChevronClasses()"
                [attr.aria-hidden]="true"
              />
            </button>

            @if (userMenuOpen()) {
            <div class="os-header__user-dropdown" [attr.role]="'menu'">
              @for (menuItem of userMenuItems(); track menuItem.label) { @if (menuItem.divider) {
              <div class="os-header__user-divider" role="separator"></div>
              } @else {
              <button
                class="os-header__user-menu-item"
                [class]="getUserMenuItemClasses(menuItem)"
                [disabled]="menuItem.disabled || false"
                [attr.aria-label]="menuItem.label"
                (click)="onUserMenuItemClick(menuItem, $event)"
              >
                @if (menuItem.icon) {
                <os-icon
                  [name]="menuItem.icon"
                  size="sm"
                  class="os-header__user-menu-icon"
                  [attr.aria-hidden]="true"
                />
                }
                <span class="os-header__user-menu-text">{{ menuItem.label }}</span>
              </button>
              } }
            </div>
            }
          </div>
          }

          <!-- Mobile Menu Toggle -->
          @if (showMobileMenu()) {
          <button
            class="os-header__mobile-toggle"
            [class]="mobileToggleClasses()"
            [attr.aria-label]="mobileMenuAriaLabel()"
            [attr.aria-expanded]="mobileMenuOpen()"
            (click)="toggleMobileMenu()"
          >
            <os-icon
              [name]="mobileMenuOpen() ? 'close' : 'menu'"
              size="md"
              [attr.aria-hidden]="true"
            />
          </button>
          }
        </div>
      </div>

      <!-- Mobile Navigation -->
      @if (showMobileMenu() && mobileMenuOpen()) {
      <div class="os-header__mobile-navigation" [attr.role]="'navigation'">
        <nav class="os-header__mobile-nav" [attr.aria-label]="mobileNavigationAriaLabel()">
          <ul class="os-header__mobile-nav-list">
            @for (item of navigationItems(); track item.label) {
            <li class="os-header__mobile-nav-item">
              <os-navigation-item
                [label]="item.label"
                [icon]="item.icon || ''"
                [routerLink]="item.route"
                [active]="item.active || false"
                [badge]="item.badge || null"
                [disabled]="item.disabled || false"
                [variant]="getMobileNavigationVariant()"
                [size]="getMobileNavigationSize()"
                (itemClick)="onMobileNavigationClick(item, $event)"
              />
            </li>
            }
          </ul>
        </nav>
      </div>
      }
    </header>
  `,
  styleUrls: ['./os-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OsHeaderComponent {
  // Logo/Brand inputs
  readonly logo = input<string | null>(null);
  readonly logoText = input<string | null>(null);
  readonly logoImage = input<string | null>(null);
  readonly logoRoute = input<string>('/');
  readonly logoAlt = input<string>('Logo');

  // Navigation inputs
  readonly navigationItems = input<HeaderNavigationItem[]>([]);
  readonly navigationAriaLabel = input<string>('Main navigation');

  // User menu inputs
  readonly showUserMenu = input(false);
  readonly userName = input<string | null>(null);
  readonly userRole = input<string | null>(null);
  readonly userAvatar = input<string | null>(null);
  readonly userInitials = input<string | null>(null);
  readonly userMenuItems = input<HeaderUserMenu[]>([]);
  readonly userMenuDisabled = input(false);
  readonly userMenuAriaLabel = input<string>('User menu');

  // Actions inputs
  readonly actions = input<HeaderAction[]>([]);

  // Mobile menu inputs
  readonly showMobileMenu = input(false);
  readonly mobileMenuAriaLabel = input<string>('Mobile menu');
  readonly mobileNavigationAriaLabel = input<string>('Mobile navigation');

  // Styling inputs
  readonly variant = input<'default' | 'compact' | 'extended' | 'minimal'>('default');
  readonly size = input<'small' | 'medium' | 'large'>('medium');
  readonly theme = input<'light' | 'dark'>('light');
  readonly sticky = input(false);
  readonly ariaLabel = input<string | null>(null);

  // State signals
  readonly userMenuOpen = signal(false);
  readonly mobileMenuOpen = signal(false);

  // Outputs
  readonly logoClick = output<MouseEvent>();
  readonly navigationClick = output<{ item: HeaderNavigationItem; event: MouseEvent }>();
  readonly actionClick = output<{ action: HeaderAction; event: MouseEvent }>();
  readonly userMenuItemClick = output<{ item: HeaderUserMenu; event: MouseEvent }>();
  readonly mobileNavigationClick = output<{ item: HeaderNavigationItem; event: MouseEvent }>();
  readonly mobileMenuToggle = output<boolean>();

  readonly headerClasses = computed(() => {
    const classes = ['os-header'];
    classes.push(`os-header--${this.variant()}`);
    classes.push(`os-header--${this.size()}`);

    if (this.theme() === 'dark') {
      classes.push('os-header--dark');
    }

    if (this.sticky()) {
      classes.push('os-header--sticky');
    }

    if (this.navigationItems().length > 0) {
      classes.push('os-header--with-navigation');
    }

    if (this.actions().length > 0) {
      classes.push('os-header--with-actions');
    }

    if (this.showUserMenu()) {
      classes.push('os-header--with-user-menu');
    }

    if (this.showMobileMenu()) {
      classes.push('os-header--with-mobile-menu');
    }

    if (this.mobileMenuOpen()) {
      classes.push('os-header--mobile-open');
    }

    return classes.join(' ');
  });

  readonly userTriggerClasses = computed(() => {
    const classes = ['os-header__user-trigger'];

    if (this.userMenuOpen()) {
      classes.push('os-header__user-trigger--open');
    }

    if (this.userMenuDisabled()) {
      classes.push('os-header__user-trigger--disabled');
    }

    return classes.join(' ');
  });

  readonly userChevronClasses = computed(() => {
    const classes = ['os-header__user-chevron'];

    if (this.userMenuOpen()) {
      classes.push('os-header__user-chevron--open');
    }

    return classes.join(' ');
  });

  readonly mobileToggleClasses = computed(() => {
    const classes = ['os-header__mobile-toggle'];

    if (this.mobileMenuOpen()) {
      classes.push('os-header__mobile-toggle--open');
    }

    return classes.join(' ');
  });

  readonly showUserInfo = computed(() => {
    return this.variant() === 'extended' && (this.userName() || this.userRole());
  });

  readonly getAvatarSize = computed(() => {
    const sizeMap: Record<string, 'sm' | 'md' | 'lg'> = {
      small: 'sm',
      medium: 'md',
      large: 'lg',
    };
    return sizeMap[this.size()];
  });

  readonly getNavigationVariant = computed(() => {
    return this.theme() === 'dark' ? ('accent' as const) : ('default' as const);
  });

  readonly getNavigationSize = computed(() => {
    const sizeMap: Record<string, 'small' | 'medium' | 'large'> = {
      small: 'small',
      medium: 'medium',
      large: 'large',
    };
    return sizeMap[this.size()] as 'small' | 'medium' | 'large';
  });

  readonly getMobileNavigationVariant = computed(() => {
    return 'primary' as const;
  });

  readonly getMobileNavigationSize = computed(() => {
    return 'large' as const;
  });

  getUserMenuItemClasses(menuItem: HeaderUserMenu): string {
    const classes = ['os-header__user-menu-item'];

    if (menuItem.disabled) {
      classes.push('os-header__user-menu-item--disabled');
    }

    return classes.join(' ');
  }

  onLogoClick(event: MouseEvent): void {
    this.logoClick.emit(event);
  }

  onNavigationClick(item: HeaderNavigationItem, event: MouseEvent): void {
    this.navigationClick.emit({ item, event });
  }

  onActionClick(action: HeaderAction, event: MouseEvent): void {
    this.actionClick.emit({ action, event });
  }

  onUserMenuItemClick(menuItem: HeaderUserMenu, event: MouseEvent): void {
    if (!menuItem.disabled) {
      this.userMenuItemClick.emit({ item: menuItem, event });
      this.userMenuOpen.set(false);
    }
  }

  onMobileNavigationClick(item: HeaderNavigationItem, event: MouseEvent): void {
    this.mobileNavigationClick.emit({ item, event });
    this.mobileMenuOpen.set(false);
  }

  toggleUserMenu(): void {
    if (!this.userMenuDisabled()) {
      this.userMenuOpen.update((open) => !open);
    }
  }

  toggleMobileMenu(): void {
    this.mobileMenuOpen.update((open) => !open);
    this.mobileMenuToggle.emit(this.mobileMenuOpen());
  }
}
