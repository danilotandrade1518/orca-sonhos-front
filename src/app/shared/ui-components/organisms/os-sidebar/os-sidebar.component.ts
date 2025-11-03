import { CommonModule, DOCUMENT } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
  signal,
  inject,
  OnDestroy,
  effect,
  ElementRef,
  ViewChild,
  AfterViewInit,
} from '@angular/core';
import { Subscription, filter, fromEvent } from 'rxjs';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
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
  host: {
    '(keydown.escape)': 'onEscapeKey()',
  },
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

    <!-- Desktop Backdrop when Expanded -->
    @if (!isMobile() && isExpanded()) {
    <div
      class="os-sidebar__backdrop os-sidebar__backdrop--desktop"
      [attr.aria-hidden]="true"
      (click)="collapseExpanded()"
      (keydown.escape)="collapseExpanded()"
    ></div>
    }

    <aside
      #sidebarElement
      [class]="sidebarClasses()"
      [attr.aria-label]="ariaLabel()"
      [attr.aria-hidden]="isMobile() ? !isOpen() : false"
      [attr.aria-expanded]="isMobile() ? isOpen() : isExpanded()"
      role="complementary"
      tabindex="-1"
    >
      <!-- Rail actions (Expand button) -->
      @if (!isMobile() && showExpandButton()) {
      <div class="os-sidebar__rail-actions">
        <button
          class="os-sidebar__expand"
          type="button"
          [attr.aria-label]="expanded() ? 'Recolher navegação' : 'Expandir navegação'"
          [attr.aria-expanded]="expanded()"
          (click)="toggleExpanded()"
          (keydown.enter)="toggleExpanded()"
          (keydown.space)="toggleExpanded()"
        >
          <os-icon [name]="isExpanded() ? 'menu_open' : 'menu'" />
        </button>
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
export class OsSidebarComponent implements OnDestroy, AfterViewInit {
  private breakpointObserver = inject(BreakpointObserver);
  private router = inject(Router);
  private document = inject(DOCUMENT);
  @ViewChild('sidebarElement') sidebarElement?: ElementRef<HTMLElement>;
  private isOpenSignal = signal(false);
  private isMobileSignal = signal(false);
  private currentUrlSignal = signal<string>('');
  private breakpointSubscription?: Subscription;
  private routerSubscription?: Subscription;
  private clickOutsideSubscription?: Subscription;
  readonly items = input.required<SidebarItem[]>();
  readonly variant = input<SidebarVariant>('default');
  readonly size = input<SidebarSize>('medium');
  readonly theme = input<SidebarTheme>('light');
  readonly collapsed = input<boolean>(false);
  readonly expanded = input<boolean>(false);
  private localExpandedSignal = signal<boolean>(false);
  readonly activeItemId = input<string | null>(null);
  readonly ariaLabel = input<string>('Navegação lateral');
  readonly showFooter = input<boolean>(false);
  readonly showCustomContent = input<boolean>(false);
  readonly showExpandButton = input<boolean>(true);
  readonly animation = input<SidebarAnimation>('slide');
  readonly mobileBreakpoint = input<number>(768);
  readonly hapticFeedback = input<boolean>(true);

  readonly itemClick = output<SidebarItem>();
  readonly navigate = output<{ item: SidebarItem; route?: string; href?: string }>();
  readonly collapseChange = output<boolean>();
  readonly expandedChange = output<boolean>();
  readonly openChange = output<boolean>();
  readonly backdropClick = output<void>();

  constructor() {
    this.breakpointSubscription = this.breakpointObserver
      .observe([`(max-width: ${this.mobileBreakpoint()}px)`])
      .subscribe((result) => {
        this.isMobileSignal.set(result.matches);
      });

    this.currentUrlSignal.set(this.router.url);
    this.routerSubscription = this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event) => {
        this.currentUrlSignal.set(event.urlAfterRedirects || event.url);
        if (this.isMobileSignal() && this.isOpen()) {
          setTimeout(() => {
            if (this.isMobileSignal() && this.isOpen()) {
              this.closeSidebar();
            }
          }, 50);
        } else if (!this.isMobileSignal() && this.isExpanded()) {
          setTimeout(() => {
            if (!this.isMobileSignal() && this.isExpanded()) {
              this.collapseExpanded();
            }
          }, 50);
        }
      });
  }

  ngAfterViewInit(): void {
    effect(() => {
      const isExpanded = this.isExpanded();
      const isMobile = this.isMobileSignal();

      if (!isMobile && isExpanded) {
        this.setupClickOutsideListener();
      } else {
        this.removeClickOutsideListener();
      }
    });
  }

  ngOnDestroy(): void {
    this.breakpointSubscription?.unsubscribe();
    this.routerSubscription?.unsubscribe();
    this.removeClickOutsideListener();
  }

  private setupClickOutsideListener(): void {
    if (this.clickOutsideSubscription) {
      return;
    }

    setTimeout(() => {
      this.clickOutsideSubscription = fromEvent<MouseEvent>(this.document, 'click').subscribe(
        (event) => {
          if (!this.sidebarElement?.nativeElement) {
            return;
          }

          const sidebarEl = this.sidebarElement.nativeElement;
          const target = event.target as HTMLElement;

          if (sidebarEl.contains(target) || target.closest('.os-sidebar__backdrop')) {
            return;
          }

          if (this.isExpanded()) {
            this.collapseExpanded();
          }
        }
      );
    }, 0);
  }

  private removeClickOutsideListener(): void {
    this.clickOutsideSubscription?.unsubscribe();
    this.clickOutsideSubscription = undefined;
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
    const expandedRail = !this.isMobile() && this.isExpanded() ? 'os-sidebar--expanded-rail' : '';

    return `${base} ${variant} ${size} ${theme} ${collapsed} ${mobile} ${open} ${animation} ${expandedRail}`.trim();
  });

  isMobile = computed(() => this.isMobileSignal());
  isOpen = computed(() => this.isOpenSignal());

  isCollapsed = computed(() => this.collapsed());
  isExpanded = computed(() => this.expanded() || this.localExpandedSignal());

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
    const explicitActiveId = this.activeItemId();
    if (explicitActiveId) return explicitActiveId === item.id;

    if (!item.route) return false;
    const current = this.currentUrlSignal();
    if (!current) return false;
    return current === item.route || current.startsWith(item.route + '/');
  }

  onItemClick(item: SidebarItem): void {
    if (item.disabled) return;

    this.itemClick.emit(item);

    if (item.route || item.href) {
      this.navigate.emit({ item, route: item.route, href: item.href });
    }

    if (this.isMobile()) {
      setTimeout(() => {
        if (this.isMobile() && this.isOpen()) {
          this.closeSidebar();
        }
      }, 100);
    }
  }

  toggleCollapse(): void {
    const newCollapsed = !this.isCollapsed();
    this.collapseChange.emit(newCollapsed);
    this.triggerHapticFeedback();
  }

  toggleExpanded(): void {
    const newExpanded = !this.isExpanded();
    this.localExpandedSignal.set(newExpanded);
    this.expandedChange.emit(newExpanded);
    this.triggerHapticFeedback();
  }

  collapseExpanded(): void {
    if (this.isMobileSignal() || !this.isExpanded()) {
      return;
    }
    this.localExpandedSignal.set(false);
    this.expandedChange.emit(false);
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

  onEscapeKey(): void {
    if (this.isMobile() && this.isOpen()) {
      this.closeSidebar();
    } else if (!this.isMobile() && this.isExpanded()) {
      this.collapseExpanded();
    }
  }

  private triggerHapticFeedback(): void {
    if (this.hapticFeedback() && 'vibrate' in navigator) {
      navigator.vibrate(50);
    }
  }
}
