import { CommonModule } from '@angular/common';
import {
  Component,
  computed,
  inject,
  input,
  output,
  signal,
  ChangeDetectionStrategy,
} from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { BreakpointObserver } from '@angular/cdk/layout';
import {
  OsHeaderComponent,
  HeaderNavigationItem,
  HeaderUserMenu,
  HeaderAction as OsHeaderAction,
} from '@shared/ui-components/organisms/os-header/os-header.component';
import {
  OsSidebarComponent,
  SidebarItem,
  SidebarVariant,
} from '@shared/ui-components/organisms/os-sidebar/os-sidebar.component';
import { OsToggleComponent } from '@shared/ui-components/atoms/os-toggle/os-toggle.component';
import { ThemeService } from '@core/services/theme/theme.service';

export interface AppShellLayout {
  variant: 'default' | 'compact';
  size: 'small' | 'medium' | 'large';
  theme: 'light' | 'dark';
  showHeader: boolean;
  showSidebar: boolean;
  sidebarCollapsed: boolean;
}

@Component({
  selector: 'os-app-shell-template',
  template: `
    <div [class]="appShellClass()" [attr.aria-label]="ariaLabel()" role="main">
      <!-- Skip Links for Accessibility -->
      <a href="#main-content" class="os-app-shell-template__skip-link"
        >Pular para conteúdo principal</a
      >
      <a href="#budget-selector" class="os-app-shell-template__skip-link"
        >Pular para seletor de orçamento</a
      >

      <div class="os-app-shell-template__content">
        <!-- Sidebar -->
        @if (computedLayout().showSidebar) {
        <nav
          role="navigation"
          [attr.aria-label]="'Navegação principal'"
          class="os-app-shell-template__sidebar-wrapper"
        >
          <os-sidebar
            [items]="sidebarItems()"
            [variant]="sidebarVariant()"
            [size]="computedLayout().size"
            [theme]="computedLayout().theme"
            [collapsed]="computedLayout().sidebarCollapsed"
            [expanded]="sidebarExpanded()"
            [showExpandButton]="sidebarShowExpandButton()"
            [showFooter]="true"
            [ariaLabel]="'Navegação principal'"
            (itemClick)="onSidebarItemClick($event)"
            (collapseChange)="onSidebarCollapseChange($event)"
            (expandedChange)="onSidebarExpandedChange($event)"
            (openChange)="onSidebarOpenChange($event)"
            (backdropClick)="onSidebarBackdropClick()"
          >
            <div slot="footer" class="os-app-shell-template__sidebar-theme-toggle">
              <os-toggle
                [checked]="themeService.isDark()"
                [size]="'small'"
                [variant]="'primary'"
                [ariaLabel]="'Alternar tema'"
                [label]="themeService.isDark() ? 'Modo escuro' : 'Modo claro'"
                (toggled)="onThemeToggle()"
              />
            </div>
          </os-sidebar>
        </nav>
        }

        <!-- Header and Main Content Area -->
        <div [class]="headerMainWrapperClass()">
          <!-- Header -->
          @if (computedLayout().showHeader) {
          <header role="banner" class="os-app-shell-template__header-wrapper">
            <os-header
              [variant]="headerVariant()"
              [size]="computedLayout().size"
              [theme]="computedLayout().theme"
              [logo]="headerLogo()"
              [logoText]="headerLogoText()"
              [logoRoute]="headerLogoRoute()"
              [actions]="headerActions()"
              [userName]="headerUser()?.name || null"
              [userRole]="headerUser()?.role || null"
              [userAvatar]="headerUser()?.avatar || null"
              [userInitials]="getUserInitials()"
              [userMenuItems]="headerUserMenuItems()"
              [showUserMenu]="!!headerUser()"
              [showMobileMenu]="headerMobileMenuItems().length > 0"
              [ariaLabel]="'Cabeçalho principal'"
              (navigationClick)="onHeaderNavigationClick($event)"
              (userMenuItemClick)="onHeaderUserMenuClick($event)"
              (actionClick)="onHeaderActionClick($event)"
              (mobileMenuToggle)="onHeaderMobileMenuToggle($event)"
              (logoClick)="onHeaderLogoClick()"
            >
              <!-- Header Content Slot (for Budget Selector) -->
              <div slot="header-content">
                <ng-content select="[slot=header-content]"></ng-content>
              </div>
            </os-header>
          </header>
          }

          <!-- Main Content Area -->
          <main
            id="main-content"
            class="os-app-shell-template__main"
            [class]="mainClass()"
            role="main"
            [attr.aria-label]="'Área principal do aplicativo'"
            [attr.aria-busy]="loading()"
          >
            <!-- Loading State -->
            @if (loading()) {
            <div
              class="os-app-shell-template__loading"
              role="status"
              [attr.aria-live]="'polite'"
              [attr.aria-label]="loadingText()"
            >
              <div class="os-app-shell-template__spinner" aria-hidden="true"></div>
              <p class="os-app-shell-template__loading-text">{{ loadingText() }}</p>
            </div>
            }

            <!-- Error State -->
            @if (error() && !loading()) {
            <div
              class="os-app-shell-template__error"
              role="alert"
              [attr.aria-live]="'assertive'"
              [attr.aria-label]="errorText()"
            >
              <div class="os-app-shell-template__error-icon" aria-hidden="true">⚠️</div>
              <h2 class="os-app-shell-template__error-title">{{ errorText() }}</h2>
              <p class="os-app-shell-template__error-message">{{ error() }}</p>
              <button
                class="os-app-shell-template__retry-button"
                type="button"
                (click)="onRetry()"
                [attr.aria-label]="'Tentar novamente'"
              >
                Tentar Novamente
              </button>
            </div>
            }

            <!-- Normal Content -->
            @if (!loading() && !error()) {
            <!-- Contextual Actions Slot -->
            @if (showContextualActions()) {
            <div class="os-app-shell-template__contextual-actions">
              <ng-content select="[slot=contextual-actions]"></ng-content>
            </div>
            }

            <!-- Router Outlet -->
            <div class="os-app-shell-template__outlet">
              <router-outlet />
            </div>
            }
          </main>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./os-app-shell-template.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    RouterModule,
    RouterOutlet,
    OsHeaderComponent,
    OsSidebarComponent,
    OsToggleComponent,
  ],
})
export class OsAppShellTemplateComponent {
  private readonly breakpointObserver = inject(BreakpointObserver);
  readonly themeService = inject(ThemeService);

  layout = input<AppShellLayout>({
    variant: 'default',
    size: 'medium',
    theme: 'light',
    showHeader: true,
    showSidebar: true,
    sidebarCollapsed: false,
  });

  computedLayout = computed(() => ({
    ...this.layout(),
    theme: this.themeService.currentTheme() as 'light' | 'dark',
  }));

  headerLogo = input<string>('');
  headerLogoText = input<string>('OrçaSonhos');
  headerLogoRoute = input<string>('/dashboard');
  headerActions = input<OsHeaderAction[]>([]);
  headerUser = input<{ name: string; avatar?: string; email?: string; role?: string } | null>(null);
  headerUserMenuItems = input<HeaderUserMenu[]>([]);
  headerMobileMenuItems = input<HeaderNavigationItem[]>([]);

  sidebarItems = input<SidebarItem[]>([]);
  sidebarExpanded = input<boolean>(false);
  sidebarShowExpandButton = input<boolean>(true);

  ariaLabel = input<string>('Shell principal do aplicativo');

  loading = input<boolean>(false);
  error = input<string | null>(null);
  loadingText = input<string>('Carregando...');
  errorText = input<string>('Ocorreu um erro');

  private readonly isMobileSignal = signal(false);
  private readonly sidebarOpenSignal = signal(false);

  headerNavigationClick = output<{ item: string; route?: string; href?: string }>();
  headerUserMenuClick = output<{ action: string; user: { name: string; email?: string } }>();
  headerActionClick = output<{ action: string; label: string }>();
  headerMobileMenuToggle = output<{ open: boolean }>();
  headerLogoClick = output<void>();
  sidebarItemClick = output<SidebarItem>();
  sidebarCollapseChange = output<boolean>();
  sidebarExpandedChange = output<boolean>();
  sidebarOpenChange = output<boolean>();
  sidebarBackdropClick = output<void>();
  retry = output<void>();

  appShellClass = computed(() => {
    const classes = ['os-app-shell-template'];

    if (this.computedLayout().variant === 'compact') {
      classes.push('os-app-shell-template--compact');
    }

    if (this.computedLayout().theme === 'dark') {
      classes.push('os-app-shell-template--dark');
    }

    if (this.isMobileSignal()) {
      classes.push('os-app-shell-template--mobile');
    }

    return classes.join(' ');
  });

  headerVariant = computed(() => {
    if (this.isMobileSignal()) {
      return 'compact';
    }
    return this.computedLayout().variant === 'compact' ? 'compact' : 'default';
  });

  sidebarVariant = computed((): SidebarVariant => {
    if (this.isMobileSignal()) {
      return 'compact';
    }

    if (this.computedLayout().sidebarCollapsed) {
      return 'minimal';
    }

    return 'default';
  });

  headerMainWrapperClass = computed(() => {
    const classes = ['os-app-shell-template__header-main-wrapper'];

    if (this.computedLayout().showSidebar && !this.isMobileSignal()) {
      if (this.computedLayout().sidebarCollapsed) {
        classes.push('os-app-shell-template__header-main-wrapper--sidebar-collapsed');
      } else if (this.sidebarExpanded()) {
        classes.push('os-app-shell-template__header-main-wrapper--sidebar-expanded');
      } else {
        classes.push('os-app-shell-template__header-main-wrapper--sidebar-default');
      }
    }

    return classes.join(' ');
  });

  mainClass = computed(() => {
    const classes = ['os-app-shell-template__main-content'];

    if (this.computedLayout().showSidebar && !this.isMobileSignal()) {
      classes.push('os-app-shell-template__main-content--with-sidebar');

      if (this.computedLayout().sidebarCollapsed) {
        classes.push('os-app-shell-template__main-content--sidebar-collapsed');
      } else if (this.sidebarExpanded()) {
        classes.push('os-app-shell-template__main-content--sidebar-expanded');
      }
    }

    return classes.join(' ');
  });

  showContextualActions = computed(() => {
    return this.headerActions().length > 0;
  });

  constructor() {
    this.breakpointObserver.observe(['(max-width: 767px)']).subscribe((result) => {
      this.isMobileSignal.set(result.matches);
    });
  }

  getUserInitials(): string {
    const user = this.headerUser();
    if (!user?.name) return '';

    return user.name
      .split(' ')
      .map((name) => name.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }

  onHeaderNavigationClick(event: { item: HeaderNavigationItem; event: MouseEvent }): void {
    this.headerNavigationClick.emit({
      item: event.item.label,
      route: event.item.route,
      href: undefined,
    });
  }

  onHeaderUserMenuClick(event: { item: HeaderUserMenu; event: MouseEvent }): void {
    const user = this.headerUser();
    if (!user) return;

    this.headerUserMenuClick.emit({
      action: event.item.action || event.item.label,
      user: { name: user.name, email: user.email },
    });
  }

  onHeaderActionClick(event: { action: OsHeaderAction; event: MouseEvent }): void {
    this.headerActionClick.emit({
      action: event.action.label,
      label: event.action.label,
    });
  }

  onHeaderMobileMenuToggle(open: boolean): void {
    this.headerMobileMenuToggle.emit({ open });
  }

  onHeaderLogoClick(): void {
    this.headerLogoClick.emit();
  }

  onSidebarItemClick(item: SidebarItem): void {
    this.sidebarItemClick.emit(item);
  }

  onSidebarCollapseChange(collapsed: boolean): void {
    this.sidebarCollapseChange.emit(collapsed);
  }

  onSidebarOpenChange(open: boolean): void {
    this.sidebarOpenSignal.set(open);
    this.sidebarOpenChange.emit(open);
  }

  onSidebarExpandedChange(expanded: boolean): void {
    this.sidebarExpandedChange.emit(expanded);
  }

  onSidebarBackdropClick(): void {
    this.sidebarBackdropClick.emit();
  }

  onThemeToggle(): void {
    this.themeService.toggleTheme();
  }

  onRetry(): void {
    this.retry.emit();
  }
}
