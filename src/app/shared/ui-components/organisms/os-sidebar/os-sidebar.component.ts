import {
  Component,
  Input,
  Output,
  EventEmitter,
  signal,
  computed,
  ChangeDetectionStrategy,
  HostBinding,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import {
  OsNavigationItemComponent,
  OsNavigationItemVariant,
  OsNavigationItemSize,
} from '../../molecules/os-navigation-item/os-navigation-item.component';
import { OsIconComponent } from '../../atoms/os-icon/os-icon.component';

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

@Component({
  selector: 'os-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, OsNavigationItemComponent, OsIconComponent],
  template: `
    <aside [class]="sidebarClasses()" [attr.aria-label]="ariaLabel()" role="complementary">
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
export class OsSidebarComponent {
  // Inputs
  @Input({ required: true }) items = signal<SidebarItem[]>([]);
  @Input() variant = signal<SidebarVariant>('default');
  @Input() size = signal<SidebarSize>('medium');
  @Input() theme = signal<SidebarTheme>('light');
  @Input() collapsed = signal(false);
  @Input() activeItemId = signal<string | null>(null);
  @Input() ariaLabel = signal('Navegação lateral');
  @Input() title = signal<string | null>(null);
  @Input() logo = signal<string | null>(null);
  @Input() logoAlt = signal('Logo');
  @Input() showHeader = signal(true);
  @Input() showFooter = signal(false);
  @Input() showToggleButton = signal(true);
  @Input() showCustomContent = signal(false);

  // Outputs
  @Output() itemClick = new EventEmitter<SidebarItem>();
  @Output() navigate = new EventEmitter<{ item: SidebarItem; route?: string; href?: string }>();
  @Output() collapseChange = new EventEmitter<boolean>();

  // Computed properties
  sidebarClasses = computed(() => {
    const base = 'os-sidebar';
    const variant = `os-sidebar--${this.variant()}`;
    const size = `os-sidebar--${this.size()}`;
    const theme = `os-sidebar--${this.theme()}`;
    const collapsed = this.isCollapsed() ? 'os-sidebar--collapsed' : '';

    return `${base} ${variant} ${size} ${theme} ${collapsed}`.trim();
  });

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

  // Methods
  isActiveItem(item: SidebarItem): boolean {
    const activeId = this.activeItemId();
    return activeId === item.id;
  }

  onItemClick(item: SidebarItem): void {
    if (item.disabled) return;

    this.itemClick.emit(item);

    // Auto-navigate if route or href is provided
    if (item.route || item.href) {
      this.navigate.emit({ item, route: item.route, href: item.href });
    }
  }

  toggleCollapse(): void {
    const newCollapsed = !this.isCollapsed();
    this.collapsed.set(newCollapsed);
    this.collapseChange.emit(newCollapsed);
  }

  onNavigate(event: { item: SidebarItem; route?: string; href?: string }): void {
    this.navigate.emit(event);
  }
}
