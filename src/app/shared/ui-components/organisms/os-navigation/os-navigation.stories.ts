import type { Meta, StoryObj } from '@storybook/angular';
import { signal } from '@angular/core';
import { OsNavigationComponent, NavigationItem } from './os-navigation.component';

const meta: Meta<OsNavigationComponent> = {
  title: 'Design System/Organisms/Navigation',
  component: OsNavigationComponent,
  parameters: {
    docs: {
      description: {
        component:
          'Navegação do Design System Orca Sonhos com 4 variantes, 3 tamanhos e suporte a orientação horizontal/vertical.',
      },
    },
  },
  argTypes: {
    items: {
      control: { type: 'object' },
      description: 'Lista de itens de navegação',
    },
    variant: {
      control: { type: 'select' },
      options: ['default', 'minimal', 'sidebar', 'tabs'],
      description: 'Variante da navegação',
    },
    size: {
      control: { type: 'select' },
      options: ['small', 'medium', 'large'],
      description: 'Tamanho da navegação',
    },
    orientation: {
      control: { type: 'select' },
      options: ['horizontal', 'vertical'],
      description: 'Orientação da navegação',
    },
    activeItemId: {
      control: { type: 'text' },
      description: 'ID do item ativo',
    },
    ariaLabel: {
      control: { type: 'text' },
      description: 'Rótulo para acessibilidade',
    },
    showCustomContent: {
      control: { type: 'boolean' },
      description: 'Mostrar conteúdo personalizado',
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<OsNavigationComponent>;

const sampleItems: NavigationItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: 'dashboard',
    route: '/dashboard',
    description: 'Visão geral do sistema',
    priority: 'high',
  },
  {
    id: 'budgets',
    label: 'Orçamentos',
    icon: 'account_balance_wallet',
    route: '/budgets',
    description: 'Gerenciar orçamentos',
    priority: 'high',
  },
  {
    id: 'goals',
    label: 'Metas',
    icon: 'flag',
    route: '/goals',
    description: 'Definir e acompanhar metas',
    priority: 'medium',
  },
  {
    id: 'transactions',
    label: 'Transações',
    icon: 'receipt',
    route: '/transactions',
    description: 'Registrar transações',
    priority: 'medium',
  },
  {
    id: 'reports',
    label: 'Relatórios',
    icon: 'bar_chart',
    route: '/reports',
    description: 'Visualizar relatórios',
    priority: 'low',
  },
];

const itemsWithBadges = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: 'dashboard',
    route: '/dashboard',
    description: 'Visão geral do sistema',
    priority: 'high',
  },
  {
    id: 'budgets',
    label: 'Orçamentos',
    icon: 'account_balance_wallet',
    route: '/budgets',
    badge: '3',
    description: 'Gerenciar orçamentos',
    priority: 'high',
  },
  {
    id: 'goals',
    label: 'Metas',
    icon: 'flag',
    route: '/goals',
    badge: '12',
    description: 'Definir e acompanhar metas',
    priority: 'medium',
  },
  {
    id: 'transactions',
    label: 'Transações',
    icon: 'receipt',
    route: '/transactions',
    description: 'Registrar transações',
    priority: 'medium',
  },
  {
    id: 'reports',
    label: 'Relatórios',
    icon: 'bar_chart',
    route: '/reports',
    badge: '!',
    description: 'Visualizar relatórios',
    priority: 'low',
  },
];

const itemsWithDisabled = [
  { id: 'dashboard', label: 'Dashboard', icon: 'dashboard', route: '/dashboard' },
  { id: 'budgets', label: 'Orçamentos', icon: 'account_balance_wallet', route: '/budgets' },
  { id: 'goals', label: 'Metas', icon: 'flag', route: '/goals', disabled: true },
  { id: 'transactions', label: 'Transações', icon: 'receipt', route: '/transactions' },
  { id: 'reports', label: 'Relatórios', icon: 'bar_chart', route: '/reports', disabled: true },
];

export const Default: Story = {
  args: {
    items: sampleItems,
    variant: signal('default'),
    size: signal('medium'),
    orientation: signal('horizontal'),
    activeItemId: signal('dashboard'),
    ariaLabel: 'Navegação principal',
    showCustomContent: signal(false),
  },
  render: (args) => ({
    props: args,
    template: `
      <os-navigation
        [items]="items"
        [variant]="variant"
        [size]="size"
        [orientation]="orientation"
        [activeItemId]="activeItemId"
        [ariaLabel]="ariaLabel"
        [showCustomContent]="showCustomContent"
        (itemClick)="itemClick($event)"
        (navigate)="navigate($event)"
      ></os-navigation>
    `,
  }),
};

export const Variants: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 24px;">
        <div>
          <h4>Default</h4>
          <os-navigation
            [items]="sampleItems"
            variant="default"
            orientation="horizontal"
          ></os-navigation>
        </div>

        <div>
          <h4>Minimal</h4>
          <os-navigation
            [items]="sampleItems"
            variant="minimal"
            orientation="horizontal"
          ></os-navigation>
        </div>

        <div>
          <h4>Sidebar</h4>
          <os-navigation
            [items]="sampleItems"
            variant="sidebar"
            orientation="vertical"
          ></os-navigation>
        </div>

        <div>
          <h4>Tabs</h4>
          <os-navigation
            [items]="sampleItems"
            variant="tabs"
            orientation="horizontal"
          ></os-navigation>
        </div>
      </div>
    `,
    props: {
      sampleItems,
    },
  }),
  parameters: {
    docs: {
      description: {
        story: 'Todas as variantes disponíveis da navegação.',
      },
    },
  },
};

export const Sizes: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 24px;">
        <div>
          <h4>Small</h4>
          <os-navigation
            [items]="sampleItems"
            size="small"
            orientation="horizontal"
          ></os-navigation>
        </div>

        <div>
          <h4>Medium</h4>
          <os-navigation
            [items]="sampleItems"
            size="medium"
            orientation="horizontal"
          ></os-navigation>
        </div>

        <div>
          <h4>Large</h4>
          <os-navigation
            [items]="sampleItems"
            size="large"
            orientation="horizontal"
          ></os-navigation>
        </div>
      </div>
    `,
    props: {
      sampleItems,
    },
  }),
  parameters: {
    docs: {
      description: {
        story: 'Todos os tamanhos disponíveis da navegação.',
      },
    },
  },
};

export const Orientations: Story = {
  render: () => ({
    template: `
      <div style="display: flex; gap: 24px;">
        <div style="flex: 1;">
          <h4>Horizontal</h4>
          <os-navigation
            [items]="sampleItems"
            orientation="horizontal"
            variant="default"
          ></os-navigation>
        </div>

        <div style="flex: 1;">
          <h4>Vertical</h4>
          <os-navigation
            [items]="sampleItems"
            orientation="vertical"
            variant="sidebar"
          ></os-navigation>
        </div>
      </div>
    `,
    props: {
      sampleItems,
    },
  }),
  parameters: {
    docs: {
      description: {
        story: 'Navegação horizontal e vertical.',
      },
    },
  },
};

export const WithBadges: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 24px;">
        <div>
          <h4>Com Badges</h4>
          <os-navigation
            [items]="itemsWithBadges"
            orientation="horizontal"
            variant="default"
          ></os-navigation>
        </div>

        <div>
          <h4>Com Badges - Sidebar</h4>
          <os-navigation
            [items]="itemsWithBadges"
            orientation="vertical"
            variant="sidebar"
          ></os-navigation>
        </div>
      </div>
    `,
    props: {
      itemsWithBadges,
    },
  }),
  parameters: {
    docs: {
      description: {
        story: 'Navegação com badges nos itens.',
      },
    },
  },
};

export const WithDisabledItems: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 24px;">
        <div>
          <h4>Com Itens Desabilitados</h4>
          <os-navigation
            [items]="itemsWithDisabled"
            orientation="horizontal"
            variant="default"
          ></os-navigation>
        </div>

        <div>
          <h4>Com Itens Desabilitados - Sidebar</h4>
          <os-navigation
            [items]="itemsWithDisabled"
            orientation="vertical"
            variant="sidebar"
          ></os-navigation>
        </div>
      </div>
    `,
    props: {
      itemsWithDisabled,
    },
  }),
  parameters: {
    docs: {
      description: {
        story: 'Navegação com itens desabilitados.',
      },
    },
  },
};

export const WithActiveItem: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 24px;">
        <div>
          <h4>Com Item Ativo - Horizontal</h4>
          <os-navigation
            [items]="sampleItems"
            orientation="horizontal"
            variant="default"
            activeItemId="budgets"
          ></os-navigation>
        </div>

        <div>
          <h4>Com Item Ativo - Vertical</h4>
          <os-navigation
            [items]="sampleItems"
            orientation="vertical"
            variant="sidebar"
            activeItemId="goals"
          ></os-navigation>
        </div>

        <div>
          <h4>Com Item Ativo - Tabs</h4>
          <os-navigation
            [items]="sampleItems"
            orientation="horizontal"
            variant="tabs"
            activeItemId="transactions"
          ></os-navigation>
        </div>
      </div>
    `,
    props: {
      sampleItems,
    },
  }),
  parameters: {
    docs: {
      description: {
        story: 'Navegação com item ativo destacado.',
      },
    },
  },
};

export const WithCustomContent: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 24px;">
        <div>
          <h4>Com Conteúdo Personalizado</h4>
          <os-navigation
            [items]="sampleItems"
            orientation="vertical"
            variant="sidebar"
            [showCustomContent]="true"
          >
            <div slot="custom" style="padding: 16px; background: #f5f5f5; border-radius: 8px; margin: 16px 0;">
              <h5 style="margin: 0 0 8px 0; font-size: 14px; font-weight: 600;">Conteúdo Personalizado</h5>
              <p style="margin: 0; font-size: 12px; color: #666;">Este é um exemplo de conteúdo personalizado na navegação.</p>
            </div>
          </os-navigation>
        </div>
      </div>
    `,
    props: {
      sampleItems,
    },
  }),
  parameters: {
    docs: {
      description: {
        story: 'Navegação com conteúdo personalizado.',
      },
    },
  },
};

export const SidebarNavigation: Story = {
  render: () => ({
    template: `
      <div style="display: flex; gap: 24px; min-height: 400px;">
        <div style="width: 250px; background: #f8f9fa; padding: 16px; border-radius: 8px;">
          <h4 style="margin: 0 0 16px 0;">Sidebar</h4>
          <os-navigation
            [items]="sampleItems"
            orientation="vertical"
            variant="sidebar"
            size="large"
            activeItemId="dashboard"
          ></os-navigation>
        </div>

        <div style="flex: 1; background: #fff; padding: 16px; border-radius: 8px; border: 1px solid #e0e0e0;">
          <h4 style="margin: 0 0 16px 0;">Conteúdo Principal</h4>
          <p>Este é o conteúdo principal da página. A navegação sidebar está à esquerda.</p>
          <p>Você pode clicar nos itens da navegação para navegar entre as seções.</p>
        </div>
      </div>
    `,
    props: {
      sampleItems,
    },
  }),
  parameters: {
    docs: {
      description: {
        story: 'Exemplo de navegação sidebar em layout de página.',
      },
    },
  },
};

export const TabNavigation: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 16px;">
        <div>
          <h4>Navegação em Abas</h4>
          <os-navigation
            [items]="sampleItems"
            orientation="horizontal"
            variant="tabs"
            size="large"
            activeItemId="budgets"
          ></os-navigation>
        </div>

        <div style="background: #fff; padding: 16px; border-radius: 8px; border: 1px solid #e0e0e0;">
          <h5 style="margin: 0 0 8px 0;">Conteúdo da Aba Ativa</h5>
          <p style="margin: 0;">Este é o conteúdo da aba ativa. As abas estão acima.</p>
        </div>
      </div>
    `,
    props: {
      sampleItems,
    },
  }),
  parameters: {
    docs: {
      description: {
        story: 'Exemplo de navegação em abas.',
      },
    },
  },
};

export const Interactive: Story = {
  args: {
    items: sampleItems,
    variant: signal('default'),
    size: signal('medium'),
    orientation: signal('horizontal'),
    activeItemId: signal('dashboard'),
    ariaLabel: 'Navegação principal',
    showCustomContent: signal(false),
    isLoading: signal(false),
    hapticFeedback: signal(true),
    enableKeyboardNavigation: signal(true),
    autoFocus: signal(false),
  },
  render: (args) => ({
    props: args,
    template: `
      <os-navigation
        [items]="items"
        [variant]="variant"
        [size]="size"
        [orientation]="orientation"
        [activeItemId]="activeItemId"
        [ariaLabel]="ariaLabel"
        [showCustomContent]="showCustomContent"
        [isLoading]="isLoading"
        [hapticFeedback]="hapticFeedback"
        [enableKeyboardNavigation]="enableKeyboardNavigation"
        [autoFocus]="autoFocus"
        (itemClick)="itemClick($event)"
        (navigate)="navigate($event)"
        (mobileDetected)="mobileDetected($event)"
      ></os-navigation>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Navegação interativa com controles para testar todas as propriedades.',
      },
    },
  },
};

export const WithLoadingState: Story = {
  args: {
    items: sampleItems,
    variant: signal('default'),
    size: signal('medium'),
    orientation: signal('horizontal'),
    activeItemId: signal('dashboard'),
    ariaLabel: 'Navegação principal',
    showCustomContent: signal(false),
    isLoading: signal(true),
  },
  render: (args) => ({
    props: args,
    template: `
      <os-navigation
        [items]="items"
        [variant]="variant"
        [size]="size"
        [orientation]="orientation"
        [activeItemId]="activeItemId"
        [ariaLabel]="ariaLabel"
        [showCustomContent]="showCustomContent"
        [isLoading]="isLoading"
        (itemClick)="itemClick($event)"
        (navigate)="navigate($event)"
      ></os-navigation>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Navegação com estado de loading ativo.',
      },
    },
  },
};

export const MobileOptimized: Story = {
  args: {
    items: sampleItems,
    variant: signal('default'),
    size: signal('large'),
    orientation: signal('horizontal'),
    activeItemId: signal('dashboard'),
    ariaLabel: 'Navegação principal',
    showCustomContent: signal(false),
    hapticFeedback: signal(true),
  },
  render: (args) => ({
    props: args,
    template: `
      <div style="max-width: 375px; border: 1px solid #e0e0e0; border-radius: 8px; padding: 16px;">
        <h4 style="margin: 0 0 16px 0; font-size: 14px;">Mobile Navigation</h4>
        <os-navigation
          [items]="items"
          [variant]="variant"
          [size]="size"
          [orientation]="orientation"
          [activeItemId]="activeItemId"
          [ariaLabel]="ariaLabel"
          [showCustomContent]="showCustomContent"
          [hapticFeedback]="hapticFeedback"
          (itemClick)="itemClick($event)"
          (navigate)="navigate($event)"
          (mobileDetected)="mobileDetected($event)"
        ></os-navigation>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Navegação otimizada para dispositivos móveis com touch targets adequados.',
      },
    },
  },
};

export const WithPriorityItems: Story = {
  args: {
    items: sampleItems,
    variant: signal('sidebar'),
    size: signal('medium'),
    orientation: signal('vertical'),
    activeItemId: signal('dashboard'),
    ariaLabel: 'Navegação principal',
    showCustomContent: signal(false),
  },
  render: (args) => ({
    props: args,
    template: `
      <div style="display: flex; gap: 24px; min-height: 400px;">
        <div style="width: 250px; background: #f8f9fa; padding: 16px; border-radius: 8px;">
          <h4 style="margin: 0 0 16px 0;">Navegação com Prioridades</h4>
          <os-navigation
            [items]="items"
            [variant]="variant"
            [size]="size"
            [orientation]="orientation"
            [activeItemId]="activeItemId"
            [ariaLabel]="ariaLabel"
            [showCustomContent]="showCustomContent"
            (itemClick)="itemClick($event)"
            (navigate)="navigate($event)"
          ></os-navigation>
        </div>
        <div style="flex: 1; background: #fff; padding: 16px; border-radius: 8px; border: 1px solid #e0e0e0;">
          <h4 style="margin: 0 0 16px 0;">Conteúdo Principal</h4>
          <p>Esta navegação demonstra itens com diferentes prioridades (high, medium, low).</p>
          <p>Os itens são organizados por prioridade para melhor experiência do usuário.</p>
        </div>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Navegação com itens organizados por prioridade para melhor UX.',
      },
    },
  },
};
