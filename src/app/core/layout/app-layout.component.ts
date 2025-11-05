import {
  Component,
  computed,
  signal,
  ChangeDetectionStrategy,
  inject,
  OnInit,
} from '@angular/core';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';
import { OsAppShellTemplateComponent } from '@shared/ui-components/templates/os-app-shell-template/os-app-shell-template.component';
import { SidebarItem } from '@shared/ui-components/organisms/os-sidebar/os-sidebar.component';
import { HeaderUserMenu } from '@shared/ui-components/organisms/os-header/os-header.component';
import { BudgetSelectorComponent } from '@features/dashboard/components/budget-selector/budget-selector.component';

@Component({
  selector: 'app-layout',
  template: `
    <os-app-shell-template
      [layout]="layoutConfig()"
      [headerUser]="headerUser()"
      [headerUserMenuItems]="headerUserMenuItems()"
      [sidebarItems]="sidebarItems()"
      [ariaLabel]="'Layout principal do aplicativo'"
      (sidebarItemClick)="onSidebarItemClick($event)"
      (sidebarCollapseChange)="onSidebarCollapseChange($event)"
      (headerLogoClick)="onHeaderLogoClick()"
    >
      <!-- Header Content Slot (Budget Selector) -->
      <div slot="header-content">
        <os-dashboard-budget-selector
          id="budget-selector"
          [variant]="'primary'"
          [size]="'small'"
          [placeholder]="'Selecionar orçamento'"
          [ariaLabel]="'Seletor de orçamento'"
          class="app-layout__budget-selector"
        />
      </div>

      <!-- Contextual Actions Slot -->
      <div slot="contextual-actions">
        <ng-content select="[slot=contextual-actions]"></ng-content>
      </div>
    </os-app-shell-template>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterModule, OsAppShellTemplateComponent, BudgetSelectorComponent],
})
export class AppLayoutComponent implements OnInit {
  private readonly router = inject(Router);

  private readonly sidebarCollapsed = signal(false);
  private readonly currentRoute = signal<string>('/');

  layoutConfig = computed(() => ({
    variant: 'default' as const,
    size: 'medium' as const,
    theme: 'light' as const,
    showHeader: true,
    showSidebar: true,
    sidebarCollapsed: this.sidebarCollapsed(),
  }));

  sidebarItems = computed((): SidebarItem[] => [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: 'dashboard',
      route: '/dashboard',
    },
    {
      id: 'budgets',
      label: 'Orçamentos',
      icon: 'account_balance',
      route: '/budgets',
    },
    {
      id: 'accounts',
      label: 'Contas',
      icon: 'account_balance_wallet',
      route: '/accounts',
    },
    {
      id: 'goals',
      label: 'Metas',
      icon: 'flag',
      route: '/goals',
    },
    {
      id: 'transactions',
      label: 'Transações',
      icon: 'receipt',
      route: '/transactions',
    },
    {
      id: 'reports',
      label: 'Relatórios',
      icon: 'analytics',
      route: '/reports',
    },
    {
      id: 'settings',
      label: 'Configurações',
      icon: 'settings',
      route: '/settings',
    },
  ]);

  headerUser = computed(() => ({
    name: 'Usuário',
    email: 'usuario@orca-sonhos.com',
    role: 'Administrador',
  }));

  headerUserMenuItems = computed((): HeaderUserMenu[] => [
    {
      label: 'Perfil',
      icon: 'person',
    },
    {
      label: 'Configurações',
      icon: 'settings',
    },
    {
      label: 'Sair',
      icon: 'logout',
    },
  ]);

  onSidebarItemClick(item: SidebarItem): void {
    console.log('Sidebar item clicked:', item);
  }

  onSidebarCollapseChange(collapsed: boolean): void {
    this.sidebarCollapsed.set(collapsed);
  }

  onHeaderLogoClick(): void {
    this.router.navigate(['/dashboard']);
  }

  ngOnInit(): void {
    this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe({
      next: (event) => {
        if (event instanceof NavigationEnd) {
          this.currentRoute.set(event.urlAfterRedirects);
        }
      },
    });

    this.currentRoute.set(this.router.url);
  }
}
