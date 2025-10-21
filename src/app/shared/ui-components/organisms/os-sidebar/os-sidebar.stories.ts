import type { Meta, StoryObj } from '@storybook/angular';
import { OsSidebarComponent } from './os-sidebar.component';

const meta: Meta<OsSidebarComponent> = {
  title: 'Design System/Organisms/Sidebar',
  component: OsSidebarComponent,
  parameters: {
    docs: {
      description: {
        component:
          'Sidebar do Design System Orca Sonhos com 4 variantes, 3 tamanhos e suporte a colapso e sub-itens.',
      },
    },
  },
  argTypes: {
    items: {
      control: { type: 'object' },
      description: 'Lista de itens da sidebar',
    },
    variant: {
      control: { type: 'select' },
      options: ['default', 'minimal', 'compact', 'expanded'],
      description: 'Variante da sidebar',
    },
    size: {
      control: { type: 'select' },
      options: ['small', 'medium', 'large'],
      description: 'Tamanho da sidebar',
    },
    theme: {
      control: { type: 'select' },
      options: ['light', 'dark'],
      description: 'Tema da sidebar',
    },
    collapsed: {
      control: { type: 'boolean' },
      description: 'Sidebar colapsada',
    },
    activeItemId: {
      control: { type: 'text' },
      description: 'ID do item ativo',
    },
    ariaLabel: {
      control: { type: 'text' },
      description: 'Rótulo para acessibilidade',
    },
    title: {
      control: { type: 'text' },
      description: 'Título da sidebar',
    },
    logo: {
      control: { type: 'text' },
      description: 'URL do logo',
    },
    logoAlt: {
      control: { type: 'text' },
      description: 'Texto alternativo do logo',
    },
    showHeader: {
      control: { type: 'boolean' },
      description: 'Mostrar cabeçalho',
    },
    showFooter: {
      control: { type: 'boolean' },
      description: 'Mostrar rodapé',
    },
    showToggleButton: {
      control: { type: 'boolean' },
      description: 'Mostrar botão de colapsar',
    },
    showCustomContent: {
      control: { type: 'boolean' },
      description: 'Mostrar conteúdo personalizado',
    },
    animation: {
      control: { type: 'select' },
      options: ['slide', 'fade', 'scale'],
      description: 'Tipo de animação para mobile',
    },
    mobileBreakpoint: {
      control: { type: 'number' },
      description: 'Breakpoint para mobile (px)',
    },
    hapticFeedback: {
      control: { type: 'boolean' },
      description: 'Feedback háptico em dispositivos móveis',
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<OsSidebarComponent>;

const sampleItems = [
  { id: 'dashboard', label: 'Dashboard', icon: 'dashboard', route: '/dashboard' },
  { id: 'budgets', label: 'Orçamentos', icon: 'account_balance_wallet', route: '/budgets' },
  { id: 'goals', label: 'Metas', icon: 'flag', route: '/goals' },
  { id: 'transactions', label: 'Transações', icon: 'receipt', route: '/transactions' },
  { id: 'reports', label: 'Relatórios', icon: 'bar_chart', route: '/reports' },
];

const itemsWithSubItems = [
  { id: 'dashboard', label: 'Dashboard', icon: 'dashboard', route: '/dashboard' },
  {
    id: 'budgets',
    label: 'Orçamentos',
    icon: 'account_balance_wallet',
    route: '/budgets',
    children: [
      { id: 'budgets-list', label: 'Lista de Orçamentos', route: '/budgets/list' },
      { id: 'budgets-create', label: 'Criar Orçamento', route: '/budgets/create' },
      { id: 'budgets-categories', label: 'Categorias', route: '/budgets/categories' },
    ],
  },
  {
    id: 'goals',
    label: 'Metas',
    icon: 'flag',
    route: '/goals',
    children: [
      { id: 'goals-list', label: 'Lista de Metas', route: '/goals/list' },
      { id: 'goals-create', label: 'Criar Meta', route: '/goals/create' },
      { id: 'goals-progress', label: 'Progresso', route: '/goals/progress' },
    ],
  },
  { id: 'transactions', label: 'Transações', icon: 'receipt', route: '/transactions' },
  { id: 'reports', label: 'Relatórios', icon: 'bar_chart', route: '/reports' },
];

const itemsWithBadges = [
  { id: 'dashboard', label: 'Dashboard', icon: 'dashboard', route: '/dashboard' },
  {
    id: 'budgets',
    label: 'Orçamentos',
    icon: 'account_balance_wallet',
    route: '/budgets',
    badge: '3',
  },
  { id: 'goals', label: 'Metas', icon: 'flag', route: '/goals', badge: '12' },
  { id: 'transactions', label: 'Transações', icon: 'receipt', route: '/transactions' },
  { id: 'reports', label: 'Relatórios', icon: 'bar_chart', route: '/reports', badge: '!' },
];

export const Default: Story = {
  args: {
    items: sampleItems,
    variant: 'default',
    size: 'medium',
    theme: 'light',
    collapsed: false,
    activeItemId: 'dashboard',
    ariaLabel: 'Navegação lateral',
    title: 'OrçaSonhos',
    logo: null,
    logoAlt: 'Logo',
    showHeader: true,
    showFooter: false,
    showToggleButton: true,
    showCustomContent: false,
  },
  render: (args) => ({
    props: args,
    template: `
      <os-sidebar
        [items]="items"
        [variant]="variant"
        [size]="size"
        [theme]="theme"
        [collapsed]="collapsed"
        [activeItemId]="activeItemId"
        [ariaLabel]="ariaLabel"
        [title]="title"
        [logo]="logo"
        [logoAlt]="logoAlt"
        [showHeader]="showHeader"
        [showFooter]="showFooter"
        [showToggleButton]="showToggleButton"
        [showCustomContent]="showCustomContent"
        (itemClick)="itemClick($event)"
        (navigate)="navigate($event)"
        (collapseChange)="collapseChange($event)"
      ></os-sidebar>
    `,
  }),
};

export const Variants: Story = {
  render: () => ({
    template: `
      <div style="display: flex; gap: 24px; min-height: 400px;">
        <div style="width: 250px;">
          <h4>Default</h4>
          <os-sidebar
            [items]="sampleItems"
            variant="default"
            title="OrçaSonhos"
          ></os-sidebar>
        </div>

        <div style="width: 200px;">
          <h4>Minimal</h4>
          <os-sidebar
            [items]="sampleItems"
            variant="minimal"
            title="OrçaSonhos"
          ></os-sidebar>
        </div>

        <div style="width: 180px;">
          <h4>Compact</h4>
          <os-sidebar
            [items]="sampleItems"
            variant="compact"
            title="OrçaSonhos"
          ></os-sidebar>
        </div>

        <div style="width: 300px;">
          <h4>Expanded</h4>
          <os-sidebar
            [items]="sampleItems"
            variant="expanded"
            title="OrçaSonhos"
          ></os-sidebar>
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
        story: 'Todas as variantes disponíveis da sidebar.',
      },
    },
  },
};

export const Sizes: Story = {
  render: () => ({
    template: `
      <div style="display: flex; gap: 24px; min-height: 400px;">
        <div style="width: 200px;">
          <h4>Small</h4>
          <os-sidebar
            [items]="sampleItems"
            size="small"
            title="OrçaSonhos"
          ></os-sidebar>
        </div>

        <div style="width: 250px;">
          <h4>Medium</h4>
          <os-sidebar
            [items]="sampleItems"
            size="medium"
            title="OrçaSonhos"
          ></os-sidebar>
        </div>

        <div style="width: 300px;">
          <h4>Large</h4>
          <os-sidebar
            [items]="sampleItems"
            size="large"
            title="OrçaSonhos"
          ></os-sidebar>
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
        story: 'Todos os tamanhos disponíveis da sidebar.',
      },
    },
  },
};

export const WithSubItems: Story = {
  render: () => ({
    template: `
      <div style="display: flex; gap: 24px; min-height: 400px;">
        <div style="width: 300px;">
          <h4>Com Sub-itens</h4>
          <os-sidebar
            [items]="itemsWithSubItems"
            variant="expanded"
            title="OrçaSonhos"
            activeItemId="budgets-list"
          ></os-sidebar>
        </div>

        <div style="width: 250px;">
          <h4>Com Sub-itens - Compact</h4>
          <os-sidebar
            [items]="itemsWithSubItems"
            variant="compact"
            title="OrçaSonhos"
            activeItemId="goals-create"
          ></os-sidebar>
        </div>
      </div>
    `,
    props: {
      itemsWithSubItems,
    },
  }),
  parameters: {
    docs: {
      description: {
        story: 'Sidebar com sub-itens de navegação.',
      },
    },
  },
};

export const WithBadges: Story = {
  render: () => ({
    template: `
      <div style="display: flex; gap: 24px; min-height: 400px;">
        <div style="width: 250px;">
          <h4>Com Badges</h4>
          <os-sidebar
            [items]="itemsWithBadges"
            title="OrçaSonhos"
            activeItemId="budgets"
          ></os-sidebar>
        </div>

        <div style="width: 200px;">
          <h4>Com Badges - Minimal</h4>
          <os-sidebar
            [items]="itemsWithBadges"
            variant="minimal"
            title="OrçaSonhos"
            activeItemId="goals"
          ></os-sidebar>
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
        story: 'Sidebar com badges nos itens.',
      },
    },
  },
};

export const Collapsed: Story = {
  render: () => ({
    template: `
      <div style="display: flex; gap: 24px; min-height: 400px;">
        <div style="width: 80px;">
          <h4>Colapsada</h4>
          <os-sidebar
            [items]="sampleItems"
            [collapsed]="true"
            title="OrçaSonhos"
          ></os-sidebar>
        </div>

        <div style="width: 250px;">
          <h4>Expandida</h4>
          <os-sidebar
            [items]="sampleItems"
            [collapsed]="false"
            title="OrçaSonhos"
          ></os-sidebar>
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
        story: 'Sidebar colapsada e expandida.',
      },
    },
  },
};

export const WithLogo: Story = {
  render: () => ({
    template: `
      <div style="display: flex; gap: 24px; min-height: 400px;">
        <div style="width: 250px;">
          <h4>Com Logo</h4>
          <os-sidebar
            [items]="sampleItems"
            title="OrçaSonhos"
            logo="https://via.placeholder.com/120x40/0066CC/FFFFFF?text=OrçaSonhos"
            logoAlt="OrçaSonhos Logo"
          ></os-sidebar>
        </div>

        <div style="width: 250px;">
          <h4>Apenas Título</h4>
          <os-sidebar
            [items]="sampleItems"
            title="OrçaSonhos"
          ></os-sidebar>
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
        story: 'Sidebar com logo e apenas com título.',
      },
    },
  },
};

export const DarkTheme: Story = {
  render: () => ({
    template: `
      <div style="background-color: #1a1a1a; padding: 20px; border-radius: 8px; min-height: 400px;">
        <h4 style="color: white; margin-bottom: 16px;">Tema Escuro</h4>
        <div style="display: flex; gap: 24px;">
          <div style="width: 250px;">
            <os-sidebar
              [items]="sampleItems"
              title="OrçaSonhos"
              theme="dark"
              activeItemId="budgets"
            ></os-sidebar>
          </div>

          <div style="width: 200px;">
            <os-sidebar
              [items]="itemsWithSubItems"
              variant="minimal"
              title="OrçaSonhos"
              theme="dark"
              activeItemId="goals-list"
            ></os-sidebar>
          </div>
        </div>
      </div>
    `,
    props: {
      sampleItems,
      itemsWithSubItems,
    },
  }),
  parameters: {
    docs: {
      description: {
        story: 'Sidebar com tema escuro.',
      },
    },
  },
};

export const WithFooter: Story = {
  render: () => ({
    template: `
      <div style="display: flex; gap: 24px; min-height: 400px;">
        <div style="width: 250px;">
          <h4>Com Rodapé</h4>
          <os-sidebar
            [items]="sampleItems"
            title="OrçaSonhos"
            [showFooter]="true"
          >
            <div slot="footer" style="padding: 16px; background: #f5f5f5; border-radius: 8px; margin: 16px;">
              <p style="margin: 0; font-size: 12px; color: #666;">Versão 1.0.0</p>
              <p style="margin: 4px 0 0 0; font-size: 12px; color: #666;">© 2024 OrçaSonhos</p>
            </div>
          </os-sidebar>
        </div>

        <div style="width: 250px;">
          <h4>Com Conteúdo Personalizado</h4>
          <os-sidebar
            [items]="sampleItems"
            title="OrçaSonhos"
            [showCustomContent]="true"
          >
            <div slot="custom" style="padding: 16px; background: #e3f2fd; border-radius: 8px; margin: 16px;">
              <h5 style="margin: 0 0 8px 0; font-size: 14px; font-weight: 600; color: #1976d2;">Dica</h5>
              <p style="margin: 0; font-size: 12px; color: #1976d2;">Use o sidebar para navegar rapidamente entre as seções.</p>
            </div>
          </os-sidebar>
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
        story: 'Sidebar com rodapé e conteúdo personalizado.',
      },
    },
  },
};

export const WithoutHeader: Story = {
  render: () => ({
    template: `
      <div style="display: flex; gap: 24px; min-height: 400px;">
        <div style="width: 250px;">
          <h4>Sem Cabeçalho</h4>
          <os-sidebar
            [items]="sampleItems"
            [showHeader]="false"
          ></os-sidebar>
        </div>

        <div style="width: 250px;">
          <h4>Sem Botão de Colapsar</h4>
          <os-sidebar
            [items]="sampleItems"
            title="OrçaSonhos"
            [showToggleButton]="false"
          ></os-sidebar>
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
        story: 'Sidebar sem cabeçalho e sem botão de colapsar.',
      },
    },
  },
};

export const Interactive: Story = {
  args: {
    items: sampleItems,
    variant: 'default',
    size: 'medium',
    theme: 'light',
    collapsed: false,
    activeItemId: 'dashboard',
    ariaLabel: 'Navegação lateral',
    title: 'OrçaSonhos',
    logo: null,
    logoAlt: 'Logo',
    showHeader: true,
    showFooter: false,
    showToggleButton: true,
    showCustomContent: false,
  },
  render: (args) => ({
    props: args,
    template: `
      <os-sidebar
        [items]="items"
        [variant]="variant"
        [size]="size"
        [theme]="theme"
        [collapsed]="collapsed"
        [activeItemId]="activeItemId"
        [ariaLabel]="ariaLabel"
        [title]="title"
        [logo]="logo"
        [logoAlt]="logoAlt"
        [showHeader]="showHeader"
        [showFooter]="showFooter"
        [showToggleButton]="showToggleButton"
        [showCustomContent]="showCustomContent"
        (itemClick)="itemClick($event)"
        (navigate)="navigate($event)"
        (collapseChange)="collapseChange($event)"
      ></os-sidebar>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Sidebar interativa com controles para testar todas as propriedades.',
      },
    },
  },
};

export const MobileOptimized: Story = {
  args: {
    items: sampleItems,
    variant: 'default',
    size: 'medium',
    theme: 'light',
    collapsed: false,
    activeItemId: 'dashboard',
    ariaLabel: 'Navegação lateral',
    title: 'OrçaSonhos',
    logo: null,
    logoAlt: 'Logo',
    showHeader: true,
    showFooter: false,
    showToggleButton: true,
    showCustomContent: false,
    animation: 'slide',
    mobileBreakpoint: 768,
    hapticFeedback: true,
  },
  render: (args) => ({
    props: args,
    template: `
      <div style="height: 100vh; position: relative;">
        <os-sidebar
          [items]="items"
          [variant]="variant"
          [size]="size"
          [theme]="theme"
          [collapsed]="collapsed"
          [activeItemId]="activeItemId"
          [ariaLabel]="ariaLabel"
          [title]="title"
          [logo]="logo"
          [logoAlt]="logoAlt"
          [showHeader]="showHeader"
          [showFooter]="showFooter"
          [showToggleButton]="showToggleButton"
          [showCustomContent]="showCustomContent"
          [animation]="animation"
          [mobileBreakpoint]="mobileBreakpoint"
          [hapticFeedback]="hapticFeedback"
          (itemClick)="itemClick($event)"
          (navigate)="navigate($event)"
          (collapseChange)="collapseChange($event)"
          (openChange)="openChange($event)"
          (backdropClick)="backdropClick($event)"
        ></os-sidebar>
        <div style="margin-left: 280px; padding: 20px;">
          <h2>Conteúdo Principal</h2>
          <p>Este é o conteúdo principal da página. Em dispositivos móveis, a sidebar será um overlay.</p>
        </div>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Sidebar otimizada para mobile com overlay, backdrop e animações.',
      },
    },
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};

export const AnimationVariants: Story = {
  render: () => ({
    template: `
      <div style="display: flex; gap: 20px; height: 100vh;">
        <div>
          <h3>Slide Animation</h3>
          <os-sidebar
            [items]="items"
            animation="slide"
            [mobileBreakpoint]="768"
            [hapticFeedback]="true"
          ></os-sidebar>
        </div>
        <div>
          <h3>Fade Animation</h3>
          <os-sidebar
            [items]="items"
            animation="fade"
            [mobileBreakpoint]="768"
            [hapticFeedback]="true"
          ></os-sidebar>
        </div>
        <div>
          <h3>Scale Animation</h3>
          <os-sidebar
            [items]="items"
            animation="scale"
            [mobileBreakpoint]="768"
            [hapticFeedback]="true"
          ></os-sidebar>
        </div>
      </div>
    `,
    props: {
      items: sampleItems,
    },
  }),
  parameters: {
    docs: {
      description: {
        story: 'Demonstração das diferentes animações disponíveis para mobile.',
      },
    },
  },
};
