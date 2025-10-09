import {
  Component,
  Input,
  Output,
  EventEmitter,
  signal,
  computed,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import {
  OsNavigationItemComponent,
  OsNavigationItemVariant,
  OsNavigationItemSize,
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
}

export type NavigationVariant = 'default' | 'minimal' | 'sidebar' | 'tabs';
export type NavigationSize = 'small' | 'medium' | 'large';
export type NavigationOrientation = 'horizontal' | 'vertical';

@Component({
  selector: 'os-navigation',
  standalone: true,
  imports: [CommonModule, RouterModule, OsNavigationItemComponent],
  template: `
    <nav [class]="navigationClasses()" [attr.aria-label]="ariaLabel" role="navigation">
      <!-- Navigation Items -->
      <ul [class]="listClasses()" role="list">
        @for (item of items(); track item.id) {
        <li role="none">
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
        </li>
        }
      </ul>

      <!-- Custom Content -->
      @if (showCustomContent()) {
      <div class="os-navigation__custom">
        <ng-content select="[slot=custom]"></ng-content>
      </div>
      }
    </nav>
  `,
  styleUrls: ['./os-navigation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OsNavigationComponent {
  // Inputs
  @Input({ required: true }) items = signal<NavigationItem[]>([]);
  @Input() variant = signal<NavigationVariant>('default');
  @Input() size = signal<NavigationSize>('medium');
  @Input() orientation = signal<NavigationOrientation>('horizontal');
  @Input() activeItemId = signal<string | null>(null);
  @Input() ariaLabel = 'Navegação principal';
  @Input() showCustomContent = signal(false);

  // Outputs
  @Output() itemClick = new EventEmitter<NavigationItem>();
  @Output() navigate = new EventEmitter<{ item: NavigationItem; route?: string; href?: string }>();

  // Computed properties
  navigationClasses = computed(() => {
    const base = 'os-navigation';
    const variant = `os-navigation--${this.variant()}`;
    const size = `os-navigation--${this.size()}`;
    const orientation = `os-navigation--${this.orientation()}`;

    return `${base} ${variant} ${size} ${orientation}`;
  });

  listClasses = computed(() => {
    const base = 'os-navigation__list';
    const orientation = `os-navigation__list--${this.orientation()}`;
    const variant = `os-navigation__list--${this.variant()}`;

    return `${base} ${orientation} ${variant}`;
  });

  itemVariant = computed(() => {
    const variantMap: Record<NavigationVariant, OsNavigationItemVariant> = {
      default: 'default',
      minimal: 'secondary',
      sidebar: 'primary',
      tabs: 'accent',
    };
    return variantMap[this.variant()];
  });

  itemSize = computed(() => {
    const sizeMap: Record<NavigationSize, OsNavigationItemSize> = {
      small: 'small',
      medium: 'medium',
      large: 'large',
    };
    return sizeMap[this.size()];
  });

  // Methods
  isActiveItem(item: NavigationItem): boolean {
    const activeId = this.activeItemId();
    return activeId === item.id;
  }

  onItemClick(item: NavigationItem): void {
    if (item.disabled) return;

    this.itemClick.emit(item);

    // Auto-navigate if route or href is provided
    if (item.route || item.href) {
      this.navigate.emit({ item, route: item.route, href: item.href });
    }
  }

  onNavigate(event: { item: NavigationItem; route?: string; href?: string }): void {
    this.navigate.emit(event);
  }
}
