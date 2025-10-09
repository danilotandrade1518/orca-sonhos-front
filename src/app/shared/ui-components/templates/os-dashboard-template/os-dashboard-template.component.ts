import { Component, ChangeDetectionStrategy, computed, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import {
  OsHeaderComponent,
  HeaderNavigationItem,
  HeaderAction,
} from '../../organisms/os-header/os-header.component';
import { OsFooterComponent } from '../../organisms/os-footer/os-footer.component';
import { OsSidebarComponent, SidebarItem } from '../../organisms/os-sidebar/os-sidebar.component';
import {
  OsBudgetSummaryComponent,
  BudgetSummaryData,
} from '../../organisms/os-budget-summary/os-budget-summary.component';
import {
  OsGoalProgressComponent,
  GoalProgressData,
} from '../../organisms/os-goal-progress/os-goal-progress.component';
import { OsTransactionListComponent } from '../../organisms/os-transaction-list/os-transaction-list.component';
import { OsCategoryManagerComponent } from '../../organisms/os-category-manager/os-category-manager.component';
import {
  OsBudgetTrackerComponent,
  BudgetTrackerData,
} from '../../organisms/os-budget-tracker/os-budget-tracker.component';
import {
  OsGoalTrackerComponent,
  GoalTrackerData,
} from '../../organisms/os-goal-tracker/os-goal-tracker.component';

export interface DashboardWidget {
  id: string;
  title: string;
  type:
    | 'budget-summary'
    | 'goal-progress'
    | 'transaction-list'
    | 'category-manager'
    | 'budget-tracker'
    | 'goal-tracker';
  size: 'small' | 'medium' | 'large' | 'full';
  position: { row: number; col: number };
  data?: Record<string, unknown>;
}

export interface DashboardLayout {
  variant: 'default' | 'compact' | 'extended';
  size: 'small' | 'medium' | 'large';
  theme: 'light' | 'dark';
  showHeader: boolean;
  showSidebar: boolean;
  showFooter: boolean;
  sidebarCollapsed: boolean;
}

@Component({
  selector: 'os-dashboard-template',
  template: `
    <div [class]="dashboardClass()" [attr.aria-label]="ariaLabel()">
      @if (layout().showHeader) {
      <os-header
        [variant]="headerVariant()"
        [size]="layout().size"
        [theme]="layout().theme"
        [logo]="headerLogo()"
        (navigationClick)="onNavigationClick($event)"
        (userMenuItemClick)="onUserMenuClick($event)"
        (actionClick)="onActionClick($event)"
        (mobileMenuToggle)="onMobileMenuToggle($event)"
      />
      }

      <div class="os-dashboard-template__content">
        @if (layout().showSidebar) {
        <os-sidebar
          [items]="sidebarNavigation()"
          [variant]="sidebarVariant()"
          [size]="layout().size"
          [theme]="layout().theme"
          [collapsed]="layout().sidebarCollapsed"
          [title]="sidebarTitle()"
          [logo]="sidebarLogo()"
          [showHeader]="sidebarShowHeader()"
          [showFooter]="sidebarShowFooter()"
          [showToggleButton]="sidebarShowToggleButton()"
          (itemClick)="onSidebarNavigationClick($event)"
          (collapseChange)="onSidebarToggleClick($event)"
        />
        }
        <main class="os-dashboard-template__main" [class]="mainClass()">
          @if (loading()) {
          <div class="os-dashboard-template__loading">
            <div class="os-dashboard-template__spinner"></div>
            <p>Carregando dashboard...</p>
          </div>
          } @else if (emptyState() && widgets().length === 0) {
          <div class="os-dashboard-template__empty">
            <div class="os-dashboard-template__empty-icon">📊</div>
            <h3>{{ emptyState()!.message }}</h3>
            @if (emptyState()!.action) {
            <button
              class="os-dashboard-template__empty-action"
              (click)="onEmptyStateActionClick(emptyState()!.action!.action)"
            >
              {{ emptyState()!.action!.label }}
            </button>
            }
          </div>
          } @else {
          <div class="os-dashboard-template__grid" [class]="gridClass()">
            @for (widget of widgets(); track widget.id) {
            <div
              class="os-dashboard-template__widget"
              [class]="widgetClass(widget)"
              [style.grid-column]="getWidgetGridColumn(widget)"
              [style.grid-row]="getWidgetGridRow(widget)"
              [attr.aria-label]="widget.title"
            >
              @switch (widget.type) { @case ('budget-summary') {
              <os-budget-summary
                [variant]="getBudgetSummaryVariant(widget)"
                [size]="getWidgetSizeTyped(widget)"
                [budgetData]="getBudgetSummaryData(widget)"
                (click)="onWidgetClick(widget.type, $event)"
              />
              } @case ('goal-progress') {
              <os-goal-progress
                [variant]="getGoalProgressVariant(widget)"
                [size]="getWidgetSizeTyped(widget)"
                [goalData]="getGoalProgressData(widget)"
                (click)="onWidgetClick(widget.type, $event)"
              />
              } @case ('transaction-list') {
              <os-transaction-list
                [variant]="getTransactionListVariant(widget)"
                [size]="getWidgetSizeTyped(widget)"
                (click)="onWidgetClick(widget.type, $event)"
              />
              } @case ('category-manager') {
              <os-category-manager
                [variant]="getCategoryManagerVariant(widget)"
                [size]="getWidgetSizeTyped(widget)"
                (click)="onWidgetClick(widget.type, $event)"
              />
              } @case ('budget-tracker') {
              <os-budget-tracker
                [variant]="getBudgetTrackerVariant(widget)"
                [size]="getWidgetSizeTyped(widget)"
                [budgetData]="getBudgetTrackerData(widget)"
                (click)="onWidgetClick(widget.type, $event)"
              />
              } @case ('goal-tracker') {
              <os-goal-tracker
                [variant]="getGoalTrackerVariant(widget)"
                [size]="getWidgetSizeTyped(widget)"
                [goalData]="getGoalTrackerData(widget)"
                (click)="onWidgetClick(widget.type, $event)"
              />
              } }
            </div>
            }
          </div>
          }
        </main>
      </div>

      @if (layout().showFooter) {
      <os-footer
        [variant]="footerVariant()"
        [size]="layout().size"
        [theme]="layout().theme"
        (linkClick)="onFooterLinkClick()"
        (socialClick)="onFooterSocialClick()"
      />
      }
    </div>
  `,
  styleUrls: ['./os-dashboard-template.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    RouterModule,
    OsHeaderComponent,
    OsFooterComponent,
    OsSidebarComponent,
    OsBudgetSummaryComponent,
    OsGoalProgressComponent,
    OsTransactionListComponent,
    OsCategoryManagerComponent,
    OsBudgetTrackerComponent,
    OsGoalTrackerComponent,
  ],
})
export class OsDashboardTemplateComponent {
  layout = input<DashboardLayout>({
    variant: 'default',
    size: 'medium',
    theme: 'light',
    showHeader: true,
    showSidebar: true,
    showFooter: true,
    sidebarCollapsed: false,
  });

  widgets = input<DashboardWidget[]>([]);
  loading = input<boolean>(false);
  emptyState = input<{ message: string; action?: { label: string; action: string } } | null>(null);
  headerLogo = input<string>('');
  headerNavigation = input<{ label: string; route?: string; href?: string; icon?: string }[]>([]);
  headerUser = input<{ name: string; avatar?: string; email?: string } | null>(null);
  headerActions = input<{ label: string; icon?: string; action: string }[]>([]);
  headerMobileMenu = input<{ label: string; route?: string; href?: string; icon?: string }[]>([]);
  sidebarNavigation = input<SidebarItem[]>([]);
  sidebarTitle = input<string>('');
  sidebarLogo = input<string>('');
  sidebarShowHeader = input<boolean>(true);
  sidebarShowFooter = input<boolean>(false);
  sidebarShowToggleButton = input<boolean>(true);
  footerLinks = input<{ label: string; route?: string; href?: string; external?: boolean }[]>([]);
  footerCopyright = input<string>('');
  footerSocial = input<{ platform: string; url: string; icon?: string }[]>([]);

  navigationClick = output<{ item: string; route?: string; href?: string }>();
  userMenuClick = output<{ action: string; user: { name: string; email?: string } }>();
  actionClick = output<{ action: string; label: string }>();
  mobileMenuToggle = output<{ open: boolean }>();
  sidebarNavigationClick = output<SidebarItem>();
  sidebarToggleClick = output<{ collapsed: boolean }>();
  sidebarHeaderClick = output<{ action: string }>();
  sidebarFooterClick = output<{ action: string }>();
  widgetClick = output<{ type: string; data: unknown; widget: DashboardWidget }>();
  emptyStateActionClick = output<{ action: string }>();
  footerLinkClick = output<{ label: string; route?: string; href?: string }>();
  footerSocialClick = output<{ platform: string; url: string }>();

  public dashboardClass = computed(() => {
    const layout = this.layout();
    return [
      'os-dashboard-template',
      `os-dashboard-template--${layout.variant}`,
      `os-dashboard-template--${layout.size}`,
      `os-dashboard-template--${layout.theme}`,
      layout.sidebarCollapsed ? 'os-dashboard-template--sidebar-collapsed' : '',
    ]
      .filter(Boolean)
      .join(' ');
  });

  public mainClass = computed(() => {
    const layout = this.layout();
    return [
      'os-dashboard-template__main',
      layout.showSidebar ? 'os-dashboard-template__main--with-sidebar' : '',
      layout.sidebarCollapsed ? 'os-dashboard-template__main--sidebar-collapsed' : '',
    ]
      .filter(Boolean)
      .join(' ');
  });

  public gridClass = computed(() => {
    const layout = this.layout();
    return [
      'os-dashboard-template__grid',
      `os-dashboard-template__grid--${layout.variant}`,
      `os-dashboard-template__grid--${layout.size}`,
    ]
      .filter(Boolean)
      .join(' ');
  });

  public ariaLabel = computed(() => {
    return `Dashboard template with ${this.widgets().length} widgets`;
  });

  public headerVariant = computed(() => {
    const layout = this.layout();
    return layout.variant === 'compact' ? 'compact' : 'default';
  });

  public sidebarVariant = computed(() => {
    const layout = this.layout();
    return layout.variant === 'compact' ? 'minimal' : 'default';
  });

  public footerVariant = computed(() => {
    const layout = this.layout();
    return layout.variant === 'compact' ? 'minimal' : 'default';
  });

  public widgetClass = (widget: DashboardWidget) => {
    return [
      'os-dashboard-template__widget',
      `os-dashboard-template__widget--${widget.type}`,
      `os-dashboard-template__widget--${widget.size}`,
    ]
      .filter(Boolean)
      .join(' ');
  };

  public getWidgetVariant = (widget: DashboardWidget): string => {
    return ((widget.data as Record<string, unknown>)?.['variant'] as string) || 'default';
  };

  public getWidgetSize = (widget: DashboardWidget): string => {
    const sizeMap: Record<string, string> = {
      small: 'small',
      medium: 'medium',
      large: 'large',
      full: 'large',
    };
    return sizeMap[widget.size] || 'medium';
  };

  public getWidgetData = (widget: DashboardWidget): Record<string, unknown> => {
    return widget.data || {};
  };

  public getBudgetSummaryData = (widget: DashboardWidget): BudgetSummaryData => {
    return widget.data as unknown as BudgetSummaryData;
  };

  public getGoalProgressData = (widget: DashboardWidget): GoalProgressData => {
    return widget.data as unknown as GoalProgressData;
  };

  public getBudgetTrackerData = (widget: DashboardWidget): BudgetTrackerData => {
    return widget.data as unknown as BudgetTrackerData;
  };

  public getGoalTrackerData = (widget: DashboardWidget): GoalTrackerData => {
    return widget.data as unknown as GoalTrackerData;
  };

  public getBudgetSummaryVariant = (
    widget: DashboardWidget
  ): 'default' | 'compact' | 'detailed' => {
    return (this.getWidgetVariant(widget) as 'default' | 'compact' | 'detailed') || 'default';
  };

  public getGoalProgressVariant = (
    widget: DashboardWidget
  ): 'default' | 'compact' | 'detailed' | 'minimal' => {
    return (
      (this.getWidgetVariant(widget) as 'default' | 'compact' | 'detailed' | 'minimal') || 'default'
    );
  };

  public getTransactionListVariant = (
    widget: DashboardWidget
  ): 'default' | 'compact' | 'detailed' => {
    return (this.getWidgetVariant(widget) as 'default' | 'compact' | 'detailed') || 'default';
  };

  public getCategoryManagerVariant = (
    widget: DashboardWidget
  ): 'default' | 'compact' | 'detailed' => {
    return (this.getWidgetVariant(widget) as 'default' | 'compact' | 'detailed') || 'default';
  };

  public getBudgetTrackerVariant = (
    widget: DashboardWidget
  ): 'default' | 'compact' | 'detailed' => {
    return (this.getWidgetVariant(widget) as 'default' | 'compact' | 'detailed') || 'default';
  };

  public getGoalTrackerVariant = (widget: DashboardWidget): 'default' | 'compact' | 'detailed' => {
    return (this.getWidgetVariant(widget) as 'default' | 'compact' | 'detailed') || 'default';
  };

  public getWidgetSizeTyped = (widget: DashboardWidget): 'small' | 'medium' | 'large' => {
    return (this.getWidgetSize(widget) as 'small' | 'medium' | 'large') || 'medium';
  };

  public getWidgetGridColumn = (widget: DashboardWidget): string => {
    const colSpan = this.getWidgetColumnSpan(widget);
    const startCol = widget.position.col;
    const endCol = startCol + colSpan;
    return `${startCol} / ${endCol}`;
  };

  public getWidgetGridRow = (widget: DashboardWidget): string => {
    return `${widget.position.row}`;
  };

  private getWidgetColumnSpan = (widget: DashboardWidget): number => {
    const sizeMap: Record<string, number> = {
      small: 3, // 3 colunas
      medium: 6, // 6 colunas
      large: 9, // 9 colunas
      full: 12, // 12 colunas (toda a largura)
    };
    return sizeMap[widget.size] || 6;
  };

  public onNavigationClick(event: { item: HeaderNavigationItem; event: MouseEvent }) {
    this.navigationClick.emit({
      item: event.item.label,
      route: event.item.route,
      href: undefined,
    });
  }

  public onUserMenuClick(event: { item: { action?: string; label?: string }; event: MouseEvent }) {
    this.userMenuClick.emit({
      action: event.item.action || 'unknown',
      user: { name: 'User', email: undefined },
    });
  }

  public onActionClick(event: { action: HeaderAction; event: MouseEvent }) {
    this.actionClick.emit({
      action: event.action.label,
      label: event.action.label,
    });
  }

  public onMobileMenuToggle(open: boolean) {
    this.mobileMenuToggle.emit({ open });
  }

  public onSidebarNavigationClick(event: SidebarItem) {
    this.sidebarNavigationClick.emit(event);
  }

  public onSidebarToggleClick(collapsed: boolean) {
    this.sidebarToggleClick.emit({ collapsed });
  }

  public onSidebarHeaderClick(event: { action: string }) {
    this.sidebarHeaderClick.emit(event);
  }

  public onSidebarFooterClick(event: { action: string }) {
    this.sidebarFooterClick.emit(event);
  }

  public onWidgetClick(type: string, event: MouseEvent) {
    const widget = this.widgets().find((w) => w.type === type);
    this.widgetClick.emit({ type, data: event, widget: widget! });
  }

  public onEmptyStateActionClick(action: string) {
    this.emptyStateActionClick.emit({ action });
  }

  public onFooterLinkClick() {
    this.footerLinkClick.emit({
      label: 'Link',
      route: undefined,
      href: undefined,
    });
  }

  public onFooterSocialClick() {
    this.footerSocialClick.emit({
      platform: 'social',
      url: '#',
    });
  }
}
