import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { CommonModule } from '@angular/common';
import { RouterTestingModule } from '@angular/router/testing';

import { OsDashboardTemplateComponent } from './os-dashboard-template.component';
import { OsHeaderComponent } from '../../organisms/os-header/os-header.component';
import { OsFooterComponent } from '../../organisms/os-footer/os-footer.component';
import { OsSidebarComponent } from '../../organisms/os-sidebar/os-sidebar.component';
import { OsBudgetSummaryComponent } from '../../organisms/os-budget-summary/os-budget-summary.component';
import { OsGoalProgressComponent } from '../../organisms/os-goal-progress/os-goal-progress.component';
import { OsTransactionListComponent } from '../../organisms/os-transaction-list/os-transaction-list.component';
import { OsCategoryManagerComponent } from '../../organisms/os-category-manager/os-category-manager.component';
import { OsBudgetTrackerComponent } from '../../organisms/os-budget-tracker/os-budget-tracker.component';
import { OsGoalTrackerComponent } from '../../organisms/os-goal-tracker/os-goal-tracker.component';

const meta: Meta<OsDashboardTemplateComponent> = {
  title: 'Design System/Templates/Dashboard Template',
  component: OsDashboardTemplateComponent,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Template de dashboard refinado do Design System Orca Sonhos com widgets organizados em grid responsivo, acessibilidade WCAG 2.1 AA e design tokens otimizados.',
      },
    },
  },
  decorators: [
    moduleMetadata({
      imports: [
        CommonModule,
        RouterTestingModule,
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
    }),
  ],
  argTypes: {
    layout: {
      control: { type: 'object' },
      description: 'Configuração do layout do dashboard',
    },
    widgets: {
      control: { type: 'object' },
      description: 'Lista de widgets do dashboard',
    },
    loading: {
      control: { type: 'boolean' },
      description: 'Estado de carregamento',
    },
    emptyState: {
      control: { type: 'object' },
      description: 'Estado vazio do dashboard',
    },
    headerLogo: {
      control: { type: 'text' },
      description: 'Logo do header',
    },
    headerNavigation: {
      control: { type: 'object' },
      description: 'Navegação do header',
    },
    headerUser: {
      control: { type: 'object' },
      description: 'Informações do usuário no header',
    },
    headerActions: {
      control: { type: 'object' },
      description: 'Ações do header',
    },
    headerMobileMenu: {
      control: { type: 'object' },
      description: 'Menu mobile do header',
    },
    sidebarNavigation: {
      control: { type: 'object' },
      description: 'Navegação da sidebar',
    },
    sidebarTitle: {
      control: { type: 'text' },
      description: 'Título da sidebar',
    },
    sidebarLogo: {
      control: { type: 'text' },
      description: 'Logo da sidebar',
    },
    sidebarShowHeader: {
      control: { type: 'boolean' },
      description: 'Mostrar header da sidebar',
    },
    sidebarShowFooter: {
      control: { type: 'boolean' },
      description: 'Mostrar footer da sidebar',
    },
    sidebarShowToggleButton: {
      control: { type: 'boolean' },
      description: 'Mostrar botão de toggle da sidebar',
    },
    footerLinks: {
      control: { type: 'object' },
      description: 'Links do footer',
    },
    footerCopyright: {
      control: { type: 'text' },
      description: 'Texto de copyright do footer',
    },
    footerSocial: {
      control: { type: 'object' },
      description: 'Links sociais do footer',
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<OsDashboardTemplateComponent>;

const sampleLayout = {
  variant: 'default' as const,
  size: 'medium' as const,
  theme: 'light' as const,
  showHeader: true,
  showSidebar: true,
  showFooter: true,
  sidebarCollapsed: false,
};

const sampleWidgets = [
  {
    id: '1',
    title: 'Resumo do Orçamento',
    type: 'budget-summary' as const,
    size: 'medium' as const,
    position: { row: 1, col: 1 },
    data: {
      id: '1',
      name: 'Orçamento Mensal',
      totalBudget: 5000,
      spentAmount: 3200,
      remainingAmount: 1800,
      percentage: 64,
      status: 'on-track',
      category: 'Geral',
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-01-31'),
      lastUpdated: new Date('2024-01-20'),
    },
  },
  {
    id: '2',
    title: 'Progresso da Meta',
    type: 'goal-progress' as const,
    size: 'medium' as const,
    position: { row: 1, col: 7 },
    data: {
      id: '1',
      title: 'Viagem para Europa',
      description: 'Economizar para uma viagem de 15 dias',
      targetAmount: 15000,
      currentAmount: 8500,
      currency: 'BRL',
      deadline: new Date('2024-12-31'),
      category: 'Viagem',
      priority: 'high',
    },
  },
  {
    id: '3',
    title: 'Lista de Transações',
    type: 'transaction-list' as const,
    size: 'large' as const,
    position: { row: 2, col: 1 },
    data: {
      variant: 'default',
      size: 'medium',
    },
  },
];

const sampleHeaderNavigation = [
  { label: 'Dashboard', route: '/dashboard', icon: 'dashboard' },
  { label: 'Transações', route: '/transactions', icon: 'list' },
  { label: 'Orçamentos', route: '/budgets', icon: 'account_balance_wallet' },
  { label: 'Metas', route: '/goals', icon: 'flag' },
];

const sampleHeaderUser = {
  name: 'João Silva',
  avatar: 'https://via.placeholder.com/40',
  email: 'joao@example.com',
};

const sampleHeaderActions = [
  { label: 'Notificações', icon: 'notifications', action: 'notifications' },
  { label: 'Configurações', icon: 'settings', action: 'settings' },
];

const sampleSidebarNavigation = [
  { id: '1', label: 'Dashboard', route: '/dashboard', icon: 'dashboard' },
  { id: '2', label: 'Transações', route: '/transactions', icon: 'list' },
  { id: '3', label: 'Orçamentos', route: '/budgets', icon: 'account_balance_wallet' },
  { id: '4', label: 'Metas', route: '/goals', icon: 'flag' },
  { id: '5', label: 'Relatórios', route: '/reports', icon: 'bar_chart' },
];

const sampleFooterLinks = [
  { label: 'Sobre', route: '/about' },
  { label: 'Ajuda', route: '/help' },
  { label: 'Contato', route: '/contact' },
  { label: 'Política de Privacidade', route: '/privacy' },
];

const sampleFooterSocial = [
  { platform: 'Facebook', url: 'https://facebook.com', icon: 'facebook' },
  { platform: 'Twitter', url: 'https://twitter.com', icon: 'twitter' },
  { platform: 'LinkedIn', url: 'https://linkedin.com', icon: 'linkedin' },
];

export const Default: Story = {
  args: {
    layout: sampleLayout,
    widgets: sampleWidgets,
    loading: false,
    emptyState: null,
    headerLogo: 'OrçaSonhos',
    headerNavigation: sampleHeaderNavigation,
    headerUser: sampleHeaderUser,
    headerActions: sampleHeaderActions,
    headerMobileMenu: sampleHeaderNavigation,
    sidebarNavigation: sampleSidebarNavigation,
    sidebarTitle: 'Menu',
    sidebarLogo: 'OS',
    sidebarShowHeader: true,
    sidebarShowFooter: false,
    sidebarShowToggleButton: true,
    footerLinks: sampleFooterLinks,
    footerCopyright: '© 2024 OrçaSonhos. Todos os direitos reservados.',
    footerSocial: sampleFooterSocial,
  },
  render: (args) => ({
    props: args,
    template: `
      <os-dashboard-template
        [layout]="layout"
        [widgets]="widgets"
        [loading]="loading"
        [emptyState]="emptyState"
        [headerLogo]="headerLogo"
        [headerNavigation]="headerNavigation"
        [headerUser]="headerUser"
        [headerActions]="headerActions"
        [headerMobileMenu]="headerMobileMenu"
        [sidebarNavigation]="sidebarNavigation"
        [sidebarTitle]="sidebarTitle"
        [sidebarLogo]="sidebarLogo"
        [sidebarShowHeader]="sidebarShowHeader"
        [sidebarShowFooter]="sidebarShowFooter"
        [sidebarShowToggleButton]="sidebarShowToggleButton"
        [footerLinks]="footerLinks"
        [footerCopyright]="footerCopyright"
        [footerSocial]="footerSocial"
        (navigationClick)="navigationClick($event)"
        (userMenuClick)="userMenuClick($event)"
        (actionClick)="actionClick($event)"
        (mobileMenuToggle)="mobileMenuToggle($event)"
        (sidebarNavigationClick)="sidebarNavigationClick($event)"
        (sidebarToggleClick)="sidebarToggleClick($event)"
        (widgetClick)="widgetClick($event)"
        (emptyStateActionClick)="emptyStateActionClick($event)"
        (footerLinkClick)="footerLinkClick($event)"
        (footerSocialClick)="footerSocialClick($event)"
      ></os-dashboard-template>
    `,
  }),
};

export const AccessibilityFeatures: Story = {
  args: {
    layout: {
      variant: 'default',
      size: 'medium',
      theme: 'light',
      showHeader: true,
      showSidebar: true,
      showFooter: true,
      sidebarCollapsed: false,
    },
    widgets: sampleWidgets,
    loading: false,
    emptyState: null,
    headerLogo: 'OrçaSonhos',
    headerNavigation: sampleHeaderNavigation,
    headerUser: sampleHeaderUser,
    headerActions: sampleHeaderActions,
    headerMobileMenu: sampleHeaderNavigation,
    sidebarNavigation: sampleSidebarNavigation,
    sidebarTitle: 'Menu Principal',
    sidebarLogo: 'OS',
    sidebarShowHeader: true,
    sidebarShowFooter: false,
    sidebarShowToggleButton: true,
    footerLinks: sampleFooterLinks,
    footerCopyright: '© 2024 OrçaSonhos. Todos os direitos reservados.',
    footerSocial: sampleFooterSocial,
  },
  parameters: {
    docs: {
      description: {
        story: 'Demonstração dos recursos de acessibilidade WCAG 2.1 AA implementados no template.',
      },
    },
  },
  render: (args) => ({
    props: args,
    template: `
      <div style="padding: 16px; background: #f5f5f5;">
        <h3>Recursos de Acessibilidade Implementados</h3>
        <ul>
          <li>✅ Roles semânticos (main, banner, navigation, contentinfo)</li>
          <li>✅ ARIA labels e descriptions</li>
          <li>✅ Navegação por teclado (tabindex)</li>
          <li>✅ Estados de loading com aria-live</li>
          <li>✅ Focus management</li>
          <li>✅ Suporte a reduced motion</li>
          <li>✅ High contrast mode</li>
          <li>✅ Touch targets >= 44px</li>
        </ul>
        <os-dashboard-template
          [layout]="layout"
          [widgets]="widgets"
          [loading]="loading"
          [emptyState]="emptyState"
          [headerLogo]="headerLogo"
          [headerNavigation]="headerNavigation"
          [headerUser]="headerUser"
          [headerActions]="headerActions"
          [headerMobileMenu]="headerMobileMenu"
          [sidebarNavigation]="sidebarNavigation"
          [sidebarTitle]="sidebarTitle"
          [sidebarLogo]="sidebarLogo"
          [sidebarShowHeader]="sidebarShowHeader"
          [sidebarShowFooter]="sidebarShowFooter"
          [sidebarShowToggleButton]="sidebarShowToggleButton"
          [footerLinks]="footerLinks"
          [footerCopyright]="footerCopyright"
          [footerSocial]="footerSocial"
          (navigationClick)="navigationClick($event)"
          (userMenuClick)="userMenuClick($event)"
          (actionClick)="actionClick($event)"
          (mobileMenuToggle)="mobileMenuToggle($event)"
          (sidebarNavigationClick)="sidebarNavigationClick($event)"
          (sidebarToggleClick)="sidebarToggleClick($event)"
          (widgetClick)="widgetClick($event)"
          (emptyStateActionClick)="emptyStateActionClick($event)"
          (footerLinkClick)="footerLinkClick($event)"
          (footerSocialClick)="footerSocialClick($event)"
        ></os-dashboard-template>
      </div>
    `,
  }),
};

export const LayoutVariants: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 24px;">
        <div>
          <h4>Default Layout</h4>
          <os-dashboard-template
            [layout]="defaultLayout"
            [widgets]="sampleWidgets"
            [sidebarNavigation]="sampleSidebarNavigation"
          ></os-dashboard-template>
        </div>

        <div>
          <h4>Compact Layout</h4>
          <os-dashboard-template
            [layout]="compactLayout"
            [widgets]="sampleWidgets"
            [sidebarNavigation]="sampleSidebarNavigation"
          ></os-dashboard-template>
        </div>

        <div>
          <h4>Extended Layout</h4>
          <os-dashboard-template
            [layout]="extendedLayout"
            [widgets]="sampleWidgets"
            [sidebarNavigation]="sampleSidebarNavigation"
          ></os-dashboard-template>
        </div>
      </div>
    `,
    props: {
      defaultLayout: {
        variant: 'default',
        size: 'medium',
        theme: 'light',
        showHeader: true,
        showSidebar: true,
        showFooter: true,
        sidebarCollapsed: false,
      },
      compactLayout: {
        variant: 'compact',
        size: 'small',
        theme: 'light',
        showHeader: true,
        showSidebar: true,
        showFooter: true,
        sidebarCollapsed: false,
      },
      extendedLayout: {
        variant: 'extended',
        size: 'large',
        theme: 'light',
        showHeader: true,
        showSidebar: true,
        showFooter: true,
        sidebarCollapsed: false,
      },
      sampleWidgets,
      sampleSidebarNavigation,
    },
  }),
  parameters: {
    docs: {
      description: {
        story: 'Diferentes variantes de layout do dashboard.',
      },
    },
  },
};

export const Themes: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 24px;">
        <div>
          <h4>Light Theme</h4>
          <os-dashboard-template
            [layout]="lightLayout"
            [widgets]="sampleWidgets"
            [sidebarNavigation]="sampleSidebarNavigation"
          ></os-dashboard-template>
        </div>

        <div>
          <h4>Dark Theme</h4>
          <os-dashboard-template
            [layout]="darkLayout"
            [widgets]="sampleWidgets"
            [sidebarNavigation]="sampleSidebarNavigation"
          ></os-dashboard-template>
        </div>
      </div>
    `,
    props: {
      lightLayout: {
        variant: 'default',
        size: 'medium',
        theme: 'light',
        showHeader: true,
        showSidebar: true,
        showFooter: true,
        sidebarCollapsed: false,
      },
      darkLayout: {
        variant: 'default',
        size: 'medium',
        theme: 'dark',
        showHeader: true,
        showSidebar: true,
        showFooter: true,
        sidebarCollapsed: false,
      },
      sampleWidgets,
      sampleSidebarNavigation,
    },
  }),
  parameters: {
    docs: {
      description: {
        story: 'Temas claro e escuro do dashboard.',
      },
    },
  },
};

export const WithSidebar: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 24px;">
        <div>
          <h4>Com Sidebar Expandida</h4>
          <os-dashboard-template
            [layout]="expandedLayout"
            [widgets]="sampleWidgets"
            [sidebarNavigation]="sampleSidebarNavigation"
            [sidebarTitle]="'Menu Principal'"
          ></os-dashboard-template>
        </div>

        <div>
          <h4>Com Sidebar Colapsada</h4>
          <os-dashboard-template
            [layout]="collapsedLayout"
            [widgets]="sampleWidgets"
            [sidebarNavigation]="sampleSidebarNavigation"
            [sidebarTitle]="'Menu Principal'"
          ></os-dashboard-template>
        </div>

        <div>
          <h4>Sem Sidebar</h4>
          <os-dashboard-template
            [layout]="noSidebarLayout"
            [widgets]="sampleWidgets"
          ></os-dashboard-template>
        </div>
      </div>
    `,
    props: {
      expandedLayout: {
        variant: 'default',
        size: 'medium',
        theme: 'light',
        showHeader: true,
        showSidebar: true,
        showFooter: true,
        sidebarCollapsed: false,
      },
      collapsedLayout: {
        variant: 'default',
        size: 'medium',
        theme: 'light',
        showHeader: true,
        showSidebar: true,
        showFooter: true,
        sidebarCollapsed: true,
      },
      noSidebarLayout: {
        variant: 'default',
        size: 'medium',
        theme: 'light',
        showHeader: true,
        showSidebar: false,
        showFooter: true,
        sidebarCollapsed: false,
      },
      sampleWidgets,
      sampleSidebarNavigation,
    },
  }),
  parameters: {
    docs: {
      description: {
        story: 'Dashboard com diferentes configurações de sidebar.',
      },
    },
  },
};

export const WidgetSizes: Story = {
  render: () => ({
    template: `
      <os-dashboard-template
        [layout]="layout"
        [widgets]="differentSizeWidgets"
        [sidebarNavigation]="sampleSidebarNavigation"
      ></os-dashboard-template>
    `,
    props: {
      layout: {
        variant: 'default',
        size: 'medium',
        theme: 'light',
        showHeader: true,
        showSidebar: true,
        showFooter: true,
        sidebarCollapsed: false,
      },
      differentSizeWidgets: [
        {
          id: '1',
          title: 'Widget Pequeno',
          type: 'budget-summary',
          size: 'small',
          position: { row: 1, col: 1 },
          data: {
            id: '1',
            name: 'Orçamento Pequeno',
            totalBudget: 1000,
            spentAmount: 500,
            remainingAmount: 500,
            percentage: 50,
            status: 'on-track',
            category: 'Geral',
            startDate: new Date('2024-01-01'),
            endDate: new Date('2024-01-31'),
            lastUpdated: new Date('2024-01-20'),
          },
        },
        {
          id: '2',
          title: 'Widget Médio',
          type: 'goal-progress',
          size: 'medium',
          position: { row: 1, col: 4 },
          data: {
            id: '1',
            title: 'Meta Média',
            targetAmount: 5000,
            currentAmount: 2500,
            currency: 'BRL',
            deadline: new Date('2024-12-31'),
            category: 'Geral',
            priority: 'medium',
          },
        },
        {
          id: '3',
          title: 'Widget Grande',
          type: 'transaction-list',
          size: 'large',
          position: { row: 1, col: 10 },
          data: {
            variant: 'default',
            size: 'medium',
          },
        },
        {
          id: '4',
          title: 'Widget Completo',
          type: 'budget-tracker',
          size: 'full',
          position: { row: 2, col: 1 },
          data: {
            id: '1',
            name: 'Rastreador Completo',
            totalBudget: 10000,
            spentAmount: 6000,
            remainingAmount: 4000,
            percentage: 60,
            status: 'on-track',
            category: 'Geral',
            startDate: new Date('2024-01-01'),
            endDate: new Date('2024-12-31'),
            lastUpdated: new Date('2024-01-20'),
            monthlySpending: [],
            trends: {
              spendingTrend: 'stable',
              projection: 8000,
              riskLevel: 'low',
            },
          },
        },
      ],
      sampleSidebarNavigation,
    },
  }),
  parameters: {
    docs: {
      description: {
        story: 'Dashboard com widgets de diferentes tamanhos.',
      },
    },
  },
};

export const LoadingState: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 24px;">
        <div>
          <h4>Carregando</h4>
          <os-dashboard-template
            [layout]="layout"
            [widgets]="[]"
            [loading]="true"
            [sidebarNavigation]="sampleSidebarNavigation"
          ></os-dashboard-template>
        </div>

        <div>
          <h4>Carregado</h4>
          <os-dashboard-template
            [layout]="layout"
            [widgets]="sampleWidgets"
            [loading]="false"
            [sidebarNavigation]="sampleSidebarNavigation"
          ></os-dashboard-template>
        </div>
      </div>
    `,
    props: {
      layout: {
        variant: 'default',
        size: 'medium',
        theme: 'light',
        showHeader: true,
        showSidebar: true,
        showFooter: true,
        sidebarCollapsed: false,
      },
      sampleWidgets,
      sampleSidebarNavigation,
    },
  }),
  parameters: {
    docs: {
      description: {
        story: 'Estados de carregamento do dashboard.',
      },
    },
  },
};

export const EmptyState: Story = {
  render: () => ({
    template: `
      <os-dashboard-template
        [layout]="layout"
        [widgets]="[]"
        [loading]="false"
        [emptyState]="emptyState"
        [sidebarNavigation]="sampleSidebarNavigation"
      ></os-dashboard-template>
    `,
    props: {
      layout: {
        variant: 'default',
        size: 'medium',
        theme: 'light',
        showHeader: true,
        showSidebar: true,
        showFooter: true,
        sidebarCollapsed: false,
      },
      emptyState: {
        message: 'Nenhum widget configurado ainda. Comece adicionando widgets ao seu dashboard.',
        action: {
          label: 'Adicionar Widget',
          action: 'add-widget',
        },
      },
      sampleSidebarNavigation,
    },
  }),
  parameters: {
    docs: {
      description: {
        story: 'Estado vazio do dashboard quando não há widgets.',
      },
    },
  },
};

export const Interactive: Story = {
  args: {
    layout: sampleLayout,
    widgets: sampleWidgets,
    loading: false,
    emptyState: null,
    headerLogo: 'OrçaSonhos',
    headerNavigation: sampleHeaderNavigation,
    headerUser: sampleHeaderUser,
    headerActions: sampleHeaderActions,
    headerMobileMenu: sampleHeaderNavigation,
    sidebarNavigation: sampleSidebarNavigation,
    sidebarTitle: 'Menu',
    sidebarLogo: 'OS',
    sidebarShowHeader: true,
    sidebarShowFooter: false,
    sidebarShowToggleButton: true,
    footerLinks: sampleFooterLinks,
    footerCopyright: '© 2024 OrçaSonhos. Todos os direitos reservados.',
    footerSocial: sampleFooterSocial,
  },
  render: (args) => ({
    props: args,
    template: `
      <os-dashboard-template
        [layout]="layout"
        [widgets]="widgets"
        [loading]="loading"
        [emptyState]="emptyState"
        [headerLogo]="headerLogo"
        [headerNavigation]="headerNavigation"
        [headerUser]="headerUser"
        [headerActions]="headerActions"
        [headerMobileMenu]="headerMobileMenu"
        [sidebarNavigation]="sidebarNavigation"
        [sidebarTitle]="sidebarTitle"
        [sidebarLogo]="sidebarLogo"
        [sidebarShowHeader]="sidebarShowHeader"
        [sidebarShowFooter]="sidebarShowFooter"
        [sidebarShowToggleButton]="sidebarShowToggleButton"
        [footerLinks]="footerLinks"
        [footerCopyright]="footerCopyright"
        [footerSocial]="footerSocial"
        (navigationClick)="navigationClick($event)"
        (userMenuClick)="userMenuClick($event)"
        (actionClick)="actionClick($event)"
        (mobileMenuToggle)="mobileMenuToggle($event)"
        (sidebarNavigationClick)="sidebarNavigationClick($event)"
        (sidebarToggleClick)="sidebarToggleClick($event)"
        (widgetClick)="widgetClick($event)"
        (emptyStateActionClick)="emptyStateActionClick($event)"
        (footerLinkClick)="footerLinkClick($event)"
        (footerSocialClick)="footerSocialClick($event)"
      ></os-dashboard-template>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Dashboard interativo com controles para testar todas as propriedades.',
      },
    },
  },
};
