import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  Input,
  OnDestroy,
  OnInit,
  signal,
  output,
  input
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';

import {
  OsNavigationItemComponent,
  OsNavigationItemSize,
  OsNavigationItemVariant,
} from '../../molecules/os-navigation-item/os-navigation-item.component';

export interface NavigationItem {
  id: string;
  label: string;
  icon?: string;
  route?: string;
  href?: string;
  badge?: string | number;
  disabled?: boolean;
  children?: NavigationItem[];
  description?: string;
  priority?: 'high' | 'medium' | 'low';
}

export type NavigationVariant = 'default' | 'minimal' | 'sidebar' | 'tabs';
export type NavigationSize = 'small' | 'medium' | 'large';
export type NavigationOrientation = 'horizontal' | 'vertical';

@Component({
  selector: 'os-navigation',
  standalone: true,
  imports: [RouterModule, OsNavigationItemComponent],
  template: `
    <nav
      [class]="navigationClasses()"
      [attr.aria-label]="ariaLabel()"
      [attr.aria-orientation]="orientation()()"
      [attr.data-variant]="variant()()"
      [attr.data-size]="size()()"
      [attr.data-mobile]="isMobile()"
      role="navigation"
    >
      <!-- Navigation Items -->
      <ul [class]="listClasses()" role="list" [attr.aria-label]="ariaLabel()">
        @for (item of items(); track item.id) {
        <li role="none" [attr.data-priority]="item.priority || 'medium'">
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
            [ariaDescription]="item.description"
            (itemClick)="onItemClick(item)"
          >
            {{ item.label }}
          </os-navigation-item>
        </li>
        }
      </ul>

      <!-- Custom Content -->
      @if (showCustomContent()()) {
      <div
        class="os-navigation__custom"
        role="complementary"
        [attr.aria-label]="'Conteúdo personalizado'"
      >
        <ng-content select="[slot=custom]" />
      </div>
      }

      <!-- Loading State -->
      @if (isLoading()()) {
      <div class="os-navigation__loading" role="status" aria-label="Carregando navegação">
        <div class="os-navigation__loading-spinner"></div>
      </div>
      }
    </nav>
  `,
  styleUrls: ['./os-navigation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OsNavigationComponent implements OnInit, OnDestroy {
  private breakpointObserver = inject(BreakpointObserver);

  @Input({ required: true }) items = signal<NavigationItem[]>([]);
  readonly variant = input(signal<NavigationVariant>('default'));
  readonly size = input(signal<NavigationSize>('medium'));
  readonly orientation = input(signal<NavigationOrientation>('horizontal'));
  readonly activeItemId = input(signal<string | null>(null));
  readonly ariaLabel = input('Navegação principal');
  readonly showCustomContent = input(signal(false));
  readonly isLoading = input(signal(false));
  readonly hapticFeedback = input(signal(true));
  readonly enableKeyboardNavigation = input(signal(true));
  readonly autoFocus = input(signal(false));

  readonly itemClick = output<NavigationItem>();
  readonly navigate = output<{
    item: NavigationItem;
    route?: string;
    href?: string;
}>();
  readonly mobileDetected = output<boolean>();

  private isMobileSignal = signal(false);
  private subscription?: Subscription;

  navigationClasses = computed(() => {
    const base = 'os-navigation';
    const variant = `os-navigation--${this.variant()()}`;
    const size = `os-navigation--${this.size()()}`;
    const orientation = `os-navigation--${this.orientation()()}`;
    const mobile = this.isMobile() ? 'os-navigation--mobile' : '';
    const loading = this.isLoading()() ? 'os-navigation--loading' : '';

    return `${base} ${variant} ${size} ${orientation} ${mobile} ${loading}`.trim();
  });

  listClasses = computed(() => {
    const base = 'os-navigation__list';
    const orientation = `os-navigation__list--${this.orientation()()}`;
    const variant = `os-navigation__list--${this.variant()()}`;
    const mobile = this.isMobile() ? 'os-navigation__list--mobile' : '';

    return `${base} ${orientation} ${variant} ${mobile}`.trim();
  });

  itemVariant = computed(() => {
    const variantMap: Record<NavigationVariant, OsNavigationItemVariant> = {
      default: 'default',
      minimal: 'secondary',
      sidebar: 'primary',
      tabs: 'accent',
    };
    return variantMap[this.variant()()];
  });

  itemSize = computed(() => {
    const sizeMap: Record<NavigationSize, OsNavigationItemSize> = {
      small: 'small',
      medium: 'medium',
      large: 'large',
    };
    return sizeMap[this.size()()];
  });

  isMobile = computed(() => this.isMobileSignal());

  ngOnInit(): void {
    this.setupBreakpointObserver();

    if (this.autoFocus()()) {
      this.focusFirstItem();
    }
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  isActiveItem(item: NavigationItem): boolean {
    const activeId = this.activeItemId()();
    return activeId === item.id;
  }

  onItemClick(item: NavigationItem): void {
    if (item.disabled) return;

    this.itemClick.emit(item);

    if (item.route || item.href) {
      this.navigate.emit({ item, route: item.route, href: item.href });
    }
  }

  onNavigate(event: { item: NavigationItem; route?: string; href?: string }): void {
    this.navigate.emit(event);
  }

  private setupBreakpointObserver(): void {
    this.subscription = this.breakpointObserver
      .observe([Breakpoints.Handset, Breakpoints.Tablet])
      .subscribe((result) => {
        const isMobile = result.matches;
        this.isMobileSignal.set(isMobile);
        this.mobileDetected.emit(isMobile);
      });
  }

  private focusFirstItem(): void {
    
    const firstEnabledItem = this.items().find((item) => !item.disabled);
    if (firstEnabledItem) {
      
      setTimeout(() => {
        const firstItemElement = document.querySelector(
          `[data-navigation-item="${firstEnabledItem.id}"]`
        ) as HTMLElement;
        if (firstItemElement) {
          firstItemElement.focus();
        }
      }, 0);
    }
  }

  focusItem(itemId: string): void {
    const item = this.items().find((item) => item.id === itemId);
    if (item && !item.disabled) {
      const itemElement = document.querySelector(
        `[data-navigation-item="${itemId}"]`
      ) as HTMLElement;
      if (itemElement) {
        itemElement.focus();
      }
    }
  }

  getItemById(itemId: string): NavigationItem | undefined {
    return this.items().find((item) => item.id === itemId);
  }

  getActiveItem(): NavigationItem | undefined {
    const activeId = this.activeItemId()();
    return activeId ? this.getItemById(activeId) : undefined;
  }
}
