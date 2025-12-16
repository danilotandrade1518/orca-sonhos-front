import { Component, computed, input, output, signal, inject } from '@angular/core';

import { RouterModule } from '@angular/router';
import { ChangeDetectionStrategy } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';
import { OsButtonComponent } from '../../atoms/os-button/os-button.component';
import { OsIconComponent } from '../../atoms/os-icon/os-icon.component';

export interface BreadcrumbItem {
  label: string;
  route?: string;
  disabled?: boolean;
}

export interface PageHeaderAction {
  label: string;
  icon?: string;
  variant?: 'primary' | 'secondary' | 'tertiary' | 'danger';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
}

@Component({
  selector: 'os-page-header',
  standalone: true,
  imports: [RouterModule, OsButtonComponent, OsIconComponent],
  template: `
    <header
      class="os-page-header"
      [class]="headerClasses()"
      [attr.aria-label]="ariaLabel()"
      role="banner"
    >
      <div class="os-page-header__content">
        @if (breadcrumbs().length > 0) {
        <nav
          class="os-page-header__breadcrumbs"
          [attr.aria-label]="breadcrumbAriaLabel()"
          role="navigation"
        >
          <ol class="os-page-header__breadcrumb-list">
            @for (item of breadcrumbs(); track $index; let isLast = $last) {
            <li class="os-page-header__breadcrumb-item">
              @if (item.route && !item.disabled && !isLast) {
              <a
                class="os-page-header__breadcrumb-link"
                [routerLink]="item.route"
                [attr.aria-current]="isLast ? 'page' : null"
                [attr.aria-label]="'Ir para ' + item.label"
                (click)="onBreadcrumbClick(item)"
              >
                {{ item.label }}
              </a>
              } @else {
              <span
                class="os-page-header__breadcrumb-text"
                [class]="getBreadcrumbClasses(item, isLast)"
                [attr.aria-current]="isLast ? 'page' : null"
                [attr.aria-label]="isLast ? 'Página atual: ' + item.label : item.label"
              >
                {{ item.label }}
              </span>
              } @if (!isLast) {
              <os-icon
                name="chevron-right"
                size="sm"
                class="os-page-header__breadcrumb-separator"
                aria-hidden="true"
              />
              }
            </li>
            }
          </ol>
        </nav>
        }

        <div class="os-page-header__main">
          <div class="os-page-header__title-section">
            @if (icon()) {
            <os-icon
              [name]="icon()!"
              [size]="iconSize()"
              class="os-page-header__icon"
              [attr.aria-hidden]="true"
            />
            }
            <div class="os-page-header__title-content">
              <h1 class="os-page-header__title" [id]="titleId()">
                {{ title() }}
              </h1>
              @if (subtitle()) {
              <p class="os-page-header__subtitle" [id]="subtitleId()">
                {{ subtitle() }}
              </p>
              }
            </div>
          </div>

          @if (actions().length > 0) {
          <div class="os-page-header__actions" [attr.aria-label]="actionsAriaLabel()" role="group">
            @for (action of actions(); track action.label) {
            <os-button
              [variant]="action.variant || 'secondary'"
              [size]="action.size || 'medium'"
              [disabled]="action.disabled || false"
              [loading]="action.loading || false"
              [icon]="action.icon || ''"
              [attr.aria-label]="action.label + (action.loading ? ' (carregando)' : '')"
              (clicked)="onActionClick(action)"
            >
              {{ action.label }}
            </os-button>
            }
          </div>
          }
        </div>

        @if (description()) {
        <div
          class="os-page-header__description"
          [id]="descriptionId()"
          [attr.aria-describedby]="titleId()"
        >
          {{ description() }}
        </div>
        }
      </div>
    </header>
  `,
  styleUrls: ['./os-page-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OsPageHeaderComponent {
  private readonly breakpointObserver = inject(BreakpointObserver);

  readonly title = input.required<string>();
  readonly subtitle = input<string | null>(null);
  readonly description = input<string | null>(null);
  readonly icon = input<string | null>(null);
  readonly breadcrumbs = input<BreadcrumbItem[]>([]);
  readonly actions = input<PageHeaderAction[]>([]);
  readonly variant = input<'default' | 'compact' | 'extended'>('default');
  readonly size = input<'small' | 'medium' | 'large'>('medium');
  readonly theme = input<'light' | 'dark'>('light');
  readonly ariaLabel = input<string | null>(null);
  readonly enableHapticFeedback = input(false);
  readonly breadcrumbCollapse = input(false);

  readonly actionClick = output<PageHeaderAction>();
  readonly breadcrumbClick = output<BreadcrumbItem>();

  readonly titleId = signal(`page-title-${Math.random().toString(36).substr(2, 9)}`);
  readonly subtitleId = signal(`page-subtitle-${Math.random().toString(36).substr(2, 9)}`);
  readonly descriptionId = signal(`page-description-${Math.random().toString(36).substr(2, 9)}`);
  readonly isMobile = signal(false);

  readonly headerClasses = computed(() => {
    const classes = ['os-page-header'];
    classes.push(`os-page-header--${this.variant()}`);
    classes.push(`os-page-header--${this.size()}`);

    if (this.theme() === 'dark') {
      classes.push('os-page-header--dark');
    }

    if (this.breadcrumbs().length > 0) {
      classes.push('os-page-header--with-breadcrumbs');
    }

    if (this.actions().length > 0) {
      classes.push('os-page-header--with-actions');
    }

    if (this.description()) {
      classes.push('os-page-header--with-description');
    }

    if (this.isMobile()) {
      classes.push('os-page-header--mobile');
    }

    if (this.breadcrumbCollapse()) {
      classes.push('os-page-header--breadcrumb-collapsed');
    }

    return classes.join(' ');
  });

  readonly iconSize = computed(() => {
    const sizeMap: Record<string, 'sm' | 'md' | 'lg'> = {
      small: 'sm',
      medium: 'md',
      large: 'lg',
    };
    return sizeMap[this.size()];
  });

  readonly breadcrumbAriaLabel = computed(() => {
    const breadcrumbs = this.breadcrumbs();
    if (breadcrumbs.length === 0) return null;

    const labels = breadcrumbs.map((item) => item.label);
    return `Navegação: ${labels.join(' > ')}`;
  });

  readonly actionsAriaLabel = computed(() => {
    const actions = this.actions();
    if (actions.length === 0) return null;

    const labels = actions.map((action) => action.label);
    return `Ações disponíveis: ${labels.join(', ')}`;
  });

  constructor() {
    this.breakpointObserver.observe(['(max-width: 768px)']).subscribe((result) => {
      this.isMobile.set(result.matches);
    });
  }

  getBreadcrumbClasses(item: BreadcrumbItem, isLast: boolean): string {
    const classes = ['os-page-header__breadcrumb-text'];

    if (item.disabled) {
      classes.push('os-page-header__breadcrumb-text--disabled');
    }

    if (isLast) {
      classes.push('os-page-header__breadcrumb-text--current');
    }

    return classes.join(' ');
  }

  onActionClick(action: PageHeaderAction): void {
    if (!action.disabled && !action.loading) {
      if (this.enableHapticFeedback() && 'vibrate' in navigator) {
        navigator.vibrate(50);
      }
      this.actionClick.emit(action);
    }
  }

  onBreadcrumbClick(item: BreadcrumbItem): void {
    if (!item.disabled && item.route) {
      if (this.enableHapticFeedback() && 'vibrate' in navigator) {
        navigator.vibrate(30);
      }
      this.breadcrumbClick.emit(item);
    }
  }
}
