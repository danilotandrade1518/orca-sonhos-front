import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
  signal,
  inject,
  OnDestroy,
  HostListener,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { RouterModule } from '@angular/router';
import { BreakpointObserver } from '@angular/cdk/layout';

import { OsIconComponent } from '../../atoms/os-icon/os-icon.component';
import {
  OsNavigationItemComponent,
  OsNavigationItemSize,
  OsNavigationItemVariant,
} from '../../molecules/os-navigation-item/os-navigation-item.component';

export interface SidebarItem {
  id: string;
  label: string;
  icon?: string;
  route?: string;
  href?: string;
  badge?: string | number;
  disabled?: boolean;
  children?: SidebarItem[];
}

export type SidebarVariant = 'default' | 'minimal' | 'compact' | 'expanded';
export type SidebarSize = 'small' | 'medium' | 'large';
export type SidebarTheme = 'light' | 'dark';
export type SidebarAnimation = 'slide' | 'fade' | 'scale';

@Component({
  selector: 'os-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, OsNavigationItemComponent, OsIconComponent],
  template: `
    <!-- Mobile Backdrop -->
    @if (isMobile() && isOpen()) {
    <div
      class="os-sidebar__backdrop"
      [attr.aria-hidden]="true"
      (click)="closeSidebar()"
      (keydown.escape)="closeSidebar()"
    ></div>
    }

    <aside
      [class]="sidebarClasses()"
      [attr.aria-label]="ariaLabel()"
      [attr.aria-hidden]="isMobile() ? !isOpen() : false"
      [attr.aria-expanded]="isMobile() ? isOpen() : !isCollapsed()"
      role="complementary"
      tabindex="-1"
    >
      <!-- Header -->
      @if (showHeader()) {
      <div class="os-sidebar__header">
        @if (logo()) {
        <div class="os-sidebar__logo">
          <img [src]="logo()" [alt]="logoAlt()" class="os-sidebar__logo-image" />
        </div>
        } @if (title()) {
        <h2 class="os-sidebar__title">{{ title() }}</h2>
        } @if (showToggleButton()) {
        <button
          class="os-sidebar__toggle"
          [attr.aria-label]="isCollapsed() ? 'Expandir sidebar' : 'Colapsar sidebar'"
          [attr.aria-expanded]="!isCollapsed()"
          (click)="toggleCollapse()"
          (keydown.enter)="toggleCollapse()"
          (keydown.space)="toggleCollapse()"
        >
          <os-icon [name]="isCollapsed() ? 'chevron-right' : 'chevron-left'" size="sm" />
        </button>
        }
      </div>
      }

      <!-- Navigation -->
      <nav class="os-sidebar__nav" role="navigation">
        <ul class="os-sidebar__list" role="list">
          @for (item of items(); track item.id) {
          <li class="os-sidebar__item" role="none">
            <os-navigation-item
              [label]="item.label"
              [icon]="item.icon || ''"
              [routerLink]="item.route"
              [variant]="itemVariant()"
              [size]="itemSize()"
              [active]="isActiveItem(item)"
              [disabled]="item.disabled || false"
              [badge]="item.badge ? +item.badge : null"
              [ariaLabel]="item.label"
              (itemClick)="onItemClick(item)"
            >
              {{ item.label }}
            </os-navigation-item>

            <!-- Sub-items -->
            @if (item.children && item.children.length > 0 && !isCollapsed()) {
            <ul class="os-sidebar__sub-list" role="list">
              @for (subItem of item.children; track subItem.id) {
              <li class="os-sidebar__sub-item" role="none">
                <os-navigation-item
                  [label]="subItem.label"
                  [icon]="subItem.icon || ''"
                  [routerLink]="subItem.route"
                  [variant]="subItemVariant()"
                  [size]="subItemSize()"
                  [active]="isActiveItem(subItem)"
                  [disabled]="subItem.disabled || false"
                  [badge]="subItem.badge ? +subItem.badge : null"
                  [ariaLabel]="subItem.label"
                  (itemClick)="onItemClick(subItem)"
                >
                  {{ subItem.label }}
                </os-navigation-item>
              </li>
              }
            </ul>
            }
          </li>
          }
        </ul>
      </nav>

      <!-- Footer -->
      @if (showFooter()) {
      <div class="os-sidebar__footer">
        <ng-content select="[slot=footer]"></ng-content>
      </div>
      }

      <!-- Custom Content -->
      @if (showCustomContent()) {
      <div class="os-sidebar__custom">
        <ng-content select="[slot=custom]"></ng-content>
      </div>
      }
    </aside>
  `,
  styleUrls: ['./os-sidebar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OsSidebarComponent implements OnDestroy {
  private breakpointObserver = inject(BreakpointObserver);
  private isOpenSignal = signal(false);
  private isMobileSignal = signal(false);
  private breakpointSubscription?: Subscription;
  readonly items = input.required<SidebarItem[]>();
  readonly variant = input<SidebarVariant>('default');
  readonly size = input<SidebarSize>('medium');
  readonly theme = input<SidebarTheme>('light');
  readonly collapsed = input<boolean>(false);
  readonly activeItemId = input<string | null>(null);
  readonly ariaLabel = input<string>('Navegação lateral');
  readonly title = input<string | null>(null);
  readonly logo = input<string | null>(null);
  readonly logoAlt = input<string>('Logo');
  readonly showHeader = input<boolean>(true);
  readonly showFooter = input<boolean>(false);
  readonly showToggleButton = input<boolean>(true);
  readonly showCustomContent = input<boolean>(false);
  readonly animation = input<SidebarAnimation>('slide');
  readonly mobileBreakpoint = input<number>(768);
  readonly hapticFeedback = input<boolean>(true);

  readonly itemClick = output<SidebarItem>();
  readonly navigate = output<{ item: SidebarItem; route?: string; href?: string }>();
  readonly collapseChange = output<boolean>();
  readonly openChange = output<boolean>();
  readonly backdropClick = output<void>();

  constructor() {
    this.breakpointSubscription = this.breakpointObserver
      .observe([`(max-width: ${this.mobileBreakpoint()}px)`])
      .subscribe((result) => {
        this.isMobileSignal.set(result.matches);
      });
  }

  ngOnDestroy(): void {
    this.breakpointSubscription?.unsubscribe();
  }

  sidebarClasses = computed(() => {
    const base = 'os-sidebar';
    const variant = `os-sidebar--${this.variant()}`;
    const size = `os-sidebar--${this.size()}`;
    const theme = `os-sidebar--${this.theme()}`;
    const collapsed = this.isCollapsed() ? 'os-sidebar--collapsed' : '';
    const mobile = this.isMobile() ? 'os-sidebar--mobile' : '';
    const open = this.isMobile() && this.isOpen() ? 'os-sidebar--open' : '';
    const animation = `os-sidebar--${this.animation()}`;

    return `${base} ${variant} ${size} ${theme} ${collapsed} ${mobile} ${open} ${animation}`.trim();
  });

  isMobile = computed(() => this.isMobileSignal());
  isOpen = computed(() => this.isOpenSignal());

  isCollapsed = computed(() => this.collapsed());

  itemVariant = computed(() => {
    const variantMap: Record<SidebarVariant, OsNavigationItemVariant> = {
      default: 'primary',
      minimal: 'secondary',
      compact: 'default',
      expanded: 'primary',
    };
    return variantMap[this.variant()];
  });

  itemSize = computed(() => {
    const sizeMap: Record<SidebarSize, OsNavigationItemSize> = {
      small: 'small',
      medium: 'medium',
      large: 'large',
    };
    return sizeMap[this.size()];
  });

  subItemVariant = computed(() => {
    const variantMap: Record<SidebarVariant, OsNavigationItemVariant> = {
      default: 'secondary',
      minimal: 'secondary',
      compact: 'secondary',
      expanded: 'secondary',
    };
    return variantMap[this.variant()];
  });

  subItemSize = computed(() => {
    const sizeMap: Record<SidebarSize, OsNavigationItemSize> = {
      small: 'small',
      medium: 'small',
      large: 'medium',
    };
    return sizeMap[this.size()];
  });

  isActiveItem(item: SidebarItem): boolean {
    const activeId = this.activeItemId();
    return activeId === item.id;
  }

  onItemClick(item: SidebarItem): void {
    if (item.disabled) return;

    this.itemClick.emit(item);

    if (item.route || item.href) {
      this.navigate.emit({ item, route: item.route, href: item.href });
    }

    if (this.isMobile()) {
      this.closeSidebar();
    }
  }

  toggleCollapse(): void {
    const newCollapsed = !this.isCollapsed();
    this.collapseChange.emit(newCollapsed);
    this.triggerHapticFeedback();
  }

  openSidebar(): void {
    if (!this.isMobile()) return;
    this.isOpenSignal.set(true);
    this.openChange.emit(true);
    this.triggerHapticFeedback();
  }

  closeSidebar(): void {
    if (!this.isMobile()) return;
    this.isOpenSignal.set(false);
    this.openChange.emit(false);
    this.backdropClick.emit();
    this.triggerHapticFeedback();
  }

  onNavigate(event: { item: SidebarItem; route?: string; href?: string }): void {
    this.navigate.emit(event);
  }

  @HostListener('keydown.escape')
  onEscapeKey(): void {
    if (this.isMobile() && this.isOpen()) {
      this.closeSidebar();
    }
  }

  private triggerHapticFeedback(): void {
    if (this.hapticFeedback() && 'vibrate' in navigator) {
      navigator.vibrate(50);
    }
  }
}
