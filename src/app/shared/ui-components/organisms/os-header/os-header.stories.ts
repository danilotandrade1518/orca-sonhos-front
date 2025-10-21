import type { Meta, StoryObj } from '@storybook/angular';
import { OsHeaderComponent } from './os-header.component';

const meta: Meta<OsHeaderComponent> = {
  title: 'Design System/Organisms/Header',
  component: OsHeaderComponent,
  parameters: {
    docs: {
      description: {
        component:
          'Cabeçalho do Design System Orca Sonhos com navegação, ações, menu do usuário e suporte a mobile.',
      },
    },
  },
  argTypes: {
    logoText: {
      control: { type: 'text' },
      description: 'Texto do logo',
    },
    logoImage: {
      control: { type: 'text' },
      description: 'URL da imagem do logo',
    },
    logoRoute: {
      control: { type: 'text' },
      description: 'Rota do logo',
    },
    navigationItems: {
      control: { type: 'object' },
      description: 'Itens de navegação',
    },
    showUserMenu: {
      control: { type: 'boolean' },
      description: 'Mostrar menu do usuário',
    },
    userName: {
      control: { type: 'text' },
      description: 'Nome do usuário',
    },
    userRole: {
      control: { type: 'text' },
      description: 'Função do usuário',
    },
    userAvatar: {
      control: { type: 'text' },
      description: 'URL do avatar do usuário',
    },
    userInitials: {
      control: { type: 'text' },
      description: 'Iniciais do usuário',
    },
    userMenuItems: {
      control: { type: 'object' },
      description: 'Itens do menu do usuário',
    },
    actions: {
      control: { type: 'object' },
      description: 'Ações do cabeçalho',
    },
    showMobileMenu: {
      control: { type: 'boolean' },
      description: 'Mostrar menu mobile',
    },
    variant: {
      control: { type: 'select' },
      options: ['default', 'compact', 'extended', 'minimal'],
      description: 'Variante do cabeçalho',
    },
    size: {
      control: { type: 'select' },
      options: ['small', 'medium', 'large'],
      description: 'Tamanho do cabeçalho',
    },
    theme: {
      control: { type: 'select' },
      options: ['light', 'dark'],
      description: 'Tema do cabeçalho',
    },
    sticky: {
      control: { type: 'boolean' },
      description: 'Cabeçalho fixo',
    },
    enableAnimations: {
      control: { type: 'boolean' },
      description: 'Habilitar animações',
    },
    enableHapticFeedback: {
      control: { type: 'boolean' },
      description: 'Habilitar feedback háptico',
    },
    mobileMenuAnimation: {
      control: { type: 'select' },
      options: ['slide', 'fade', 'scale'],
      description: 'Animação do menu mobile',
    },
    stickyThreshold: {
      control: { type: 'number' },
      description: 'Threshold para sticky behavior',
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<OsHeaderComponent>;

const sampleNavigationItems = [
  { label: 'Dashboard', icon: 'dashboard', route: '/dashboard', active: true },
  { label: 'Orçamentos', icon: 'account_balance_wallet', route: '/budgets' },
  { label: 'Metas', icon: 'flag', route: '/goals' },
  { label: 'Transações', icon: 'receipt', route: '/transactions' },
  { label: 'Relatórios', icon: 'bar_chart', route: '/reports' },
];

const sampleUserMenuItems = [
  { label: 'Perfil', icon: 'person', route: '/profile' },
  { label: 'Configurações', icon: 'settings', route: '/settings' },
  { label: '', divider: true },
  { label: 'Sair', icon: 'logout', action: 'logout' },
];

const sampleActions = [
  { label: 'Nova Transação', icon: 'add', variant: 'primary' as const },
  { label: 'Notificações', icon: 'notifications', variant: 'secondary' as const },
];

export const Default: Story = {
  args: {
    logoText: 'OrçaSonhos',
    logoRoute: '/',
    navigationItems: sampleNavigationItems,
    showUserMenu: true,
    userName: 'João Silva',
    userRole: 'Administrador',
    userInitials: 'JS',
    userMenuItems: sampleUserMenuItems,
    actions: sampleActions,
    showMobileMenu: true,
    variant: 'default',
    size: 'medium',
    theme: 'light',
    sticky: false,
    enableAnimations: true,
    enableHapticFeedback: false,
    mobileMenuAnimation: 'slide',
    stickyThreshold: 0,
  },
  render: (args) => ({
    props: args,
    template: `
      <os-header
        [logoText]="logoText"
        [logoRoute]="logoRoute"
        [navigationItems]="navigationItems"
        [showUserMenu]="showUserMenu"
        [userName]="userName"
        [userRole]="userRole"
        [userInitials]="userInitials"
        [userMenuItems]="userMenuItems"
        [actions]="actions"
        [showMobileMenu]="showMobileMenu"
        [variant]="variant"
        [size]="size"
        [theme]="theme"
        [sticky]="sticky"
        (logoClick)="logoClick($event)"
        (navigationClick)="navigationClick($event)"
        (actionClick)="actionClick($event)"
        (userMenuItemClick)="userMenuItemClick($event)"
        (mobileNavigationClick)="mobileNavigationClick($event)"
        (mobileMenuToggle)="mobileMenuToggle($event)"
      ></os-header>
    `,
  }),
};

export const WithAnimations: Story = {
  args: {
    ...Default.args,
    enableAnimations: true,
    enableHapticFeedback: true,
    mobileMenuAnimation: 'slide',
    sticky: true,
    stickyThreshold: 100,
  },
  render: (args) => ({
    props: args,
    template: `
      <div style="height: 200vh; padding: 20px;">
        <p>Role a página para ver o comportamento sticky com animações</p>
        <os-header
          [logoText]="logoText"
          [logoRoute]="logoRoute"
          [navigationItems]="navigationItems"
          [showUserMenu]="showUserMenu"
          [userName]="userName"
          [userRole]="userRole"
          [userInitials]="userInitials"
          [userMenuItems]="userMenuItems"
          [actions]="actions"
          [showMobileMenu]="showMobileMenu"
          [variant]="variant"
          [size]="size"
          [theme]="theme"
          [sticky]="sticky"
          [enableAnimations]="enableAnimations"
          [enableHapticFeedback]="enableHapticFeedback"
          [mobileMenuAnimation]="mobileMenuAnimation"
          [stickyThreshold]="stickyThreshold"
          (logoClick)="logoClick($event)"
          (navigationClick)="navigationClick($event)"
          (actionClick)="actionClick($event)"
          (userMenuItemClick)="userMenuItemClick($event)"
          (mobileNavigationClick)="mobileNavigationClick($event)"
          (mobileMenuToggle)="mobileMenuToggle($event)"
          (stickyChange)="stickyChange($event)"
          (scrollChange)="scrollChange($event)"
        ></os-header>
        <div style="padding: 20px;">
          <h2>Conteúdo da página</h2>
          <p>Este é um exemplo de conteúdo para demonstrar o comportamento sticky do header.</p>
          <p>Role a página para ver as animações em ação.</p>
        </div>
      </div>
    `,
  }),
};

export const MobileAnimations: Story = {
  args: {
    ...Default.args,
    enableAnimations: true,
    mobileMenuAnimation: 'fade',
    showMobileMenu: true,
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
  render: (args) => ({
    props: args,
    template: `
      <os-header
        [logoText]="logoText"
        [logoRoute]="logoRoute"
        [navigationItems]="navigationItems"
        [showUserMenu]="showUserMenu"
        [userName]="userName"
        [userRole]="userRole"
        [userInitials]="userInitials"
        [userMenuItems]="userMenuItems"
        [actions]="actions"
        [showMobileMenu]="showMobileMenu"
        [variant]="variant"
        [size]="size"
        [theme]="theme"
        [sticky]="sticky"
        [enableAnimations]="enableAnimations"
        [enableHapticFeedback]="enableHapticFeedback"
        [mobileMenuAnimation]="mobileMenuAnimation"
        [stickyThreshold]="stickyThreshold"
        (logoClick)="logoClick($event)"
        (navigationClick)="navigationClick($event)"
        (actionClick)="actionClick($event)"
        (userMenuItemClick)="userMenuItemClick($event)"
        (mobileNavigationClick)="mobileNavigationClick($event)"
        (mobileMenuToggle)="mobileMenuToggle($event)"
        (stickyChange)="stickyChange($event)"
        (scrollChange)="scrollChange($event)"
      ></os-header>
    `,
  }),
};

export const Variants: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 24px;">
        <div>
          <h4>Default</h4>
          <os-header
            logoText="OrçaSonhos"
            [navigationItems]="sampleNavigationItems"
            [showUserMenu]="true"
            userName="João Silva"
            userInitials="JS"
            [userMenuItems]="sampleUserMenuItems"
            variant="default"
          ></os-header>
        </div>

        <div>
          <h4>Compact</h4>
          <os-header
            logoText="OrçaSonhos"
            [navigationItems]="sampleNavigationItems"
            [showUserMenu]="true"
            userName="João Silva"
            userInitials="JS"
            [userMenuItems]="sampleUserMenuItems"
            variant="compact"
          ></os-header>
        </div>

        <div>
          <h4>Extended</h4>
          <os-header
            logoText="OrçaSonhos"
            [navigationItems]="sampleNavigationItems"
            [showUserMenu]="true"
            userName="João Silva"
            userRole="Administrador"
            userInitials="JS"
            [userMenuItems]="sampleUserMenuItems"
            variant="extended"
          ></os-header>
        </div>

        <div>
          <h4>Minimal</h4>
          <os-header
            logoText="OrçaSonhos"
            [showUserMenu]="true"
            userName="João Silva"
            userInitials="JS"
            [userMenuItems]="sampleUserMenuItems"
            variant="minimal"
          ></os-header>
        </div>
      </div>
    `,
    props: {
      sampleNavigationItems,
      sampleUserMenuItems,
    },
  }),
  parameters: {
    docs: {
      description: {
        story: 'Todas as variantes disponíveis do cabeçalho.',
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
          <os-header
            logoText="OrçaSonhos"
            [navigationItems]="sampleNavigationItems"
            [showUserMenu]="true"
            userName="João Silva"
            userInitials="JS"
            [userMenuItems]="sampleUserMenuItems"
            size="small"
          ></os-header>
        </div>

        <div>
          <h4>Medium</h4>
          <os-header
            logoText="OrçaSonhos"
            [navigationItems]="sampleNavigationItems"
            [showUserMenu]="true"
            userName="João Silva"
            userInitials="JS"
            [userMenuItems]="sampleUserMenuItems"
            size="medium"
          ></os-header>
        </div>

        <div>
          <h4>Large</h4>
          <os-header
            logoText="OrçaSonhos"
            [navigationItems]="sampleNavigationItems"
            [showUserMenu]="true"
            userName="João Silva"
            userInitials="JS"
            [userMenuItems]="sampleUserMenuItems"
            size="large"
          ></os-header>
        </div>
      </div>
    `,
    props: {
      sampleNavigationItems,
      sampleUserMenuItems,
    },
  }),
  parameters: {
    docs: {
      description: {
        story: 'Todos os tamanhos disponíveis do cabeçalho.',
      },
    },
  },
};

export const WithLogoImage: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 24px;">
        <div>
          <h4>Com Imagem do Logo</h4>
          <os-header
            logoImage="https://via.placeholder.com/120x40/0066CC/FFFFFF?text=OrçaSonhos"
            logoAlt="OrçaSonhos Logo"
            [navigationItems]="sampleNavigationItems"
            [showUserMenu]="true"
            userName="João Silva"
            userInitials="JS"
            [userMenuItems]="sampleUserMenuItems"
          ></os-header>
        </div>

        <div>
          <h4>Com Texto do Logo</h4>
          <os-header
            logoText="OrçaSonhos"
            [navigationItems]="sampleNavigationItems"
            [showUserMenu]="true"
            userName="João Silva"
            userInitials="JS"
            [userMenuItems]="sampleUserMenuItems"
          ></os-header>
        </div>
      </div>
    `,
    props: {
      sampleNavigationItems,
      sampleUserMenuItems,
    },
  }),
  parameters: {
    docs: {
      description: {
        story: 'Cabeçalho com imagem e texto do logo.',
      },
    },
  },
};

export const WithActions: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 24px;">
        <div>
          <h4>Com Ações</h4>
          <os-header
            logoText="OrçaSonhos"
            [navigationItems]="sampleNavigationItems"
            [actions]="sampleActions"
            [showUserMenu]="true"
            userName="João Silva"
            userInitials="JS"
            [userMenuItems]="sampleUserMenuItems"
          ></os-header>
        </div>

        <div>
          <h4>Sem Ações</h4>
          <os-header
            logoText="OrçaSonhos"
            [navigationItems]="sampleNavigationItems"
            [showUserMenu]="true"
            userName="João Silva"
            userInitials="JS"
            [userMenuItems]="sampleUserMenuItems"
          ></os-header>
        </div>
      </div>
    `,
    props: {
      sampleNavigationItems,
      sampleActions,
      sampleUserMenuItems,
    },
  }),
  parameters: {
    docs: {
      description: {
        story: 'Cabeçalho com e sem ações.',
      },
    },
  },
};

export const WithUserMenu: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 24px;">
        <div>
          <h4>Com Menu do Usuário</h4>
          <os-header
            logoText="OrçaSonhos"
            [navigationItems]="sampleNavigationItems"
            [showUserMenu]="true"
            userName="João Silva"
            userRole="Administrador"
            userInitials="JS"
            [userMenuItems]="sampleUserMenuItems"
          ></os-header>
        </div>

        <div>
          <h4>Com Avatar do Usuário</h4>
          <os-header
            logoText="OrçaSonhos"
            [navigationItems]="sampleNavigationItems"
            [showUserMenu]="true"
            userName="Maria Santos"
            userRole="Usuário"
            userAvatar="https://via.placeholder.com/40x40/FF6B6B/FFFFFF?text=MS"
            [userMenuItems]="sampleUserMenuItems"
          ></os-header>
        </div>

        <div>
          <h4>Sem Menu do Usuário</h4>
          <os-header
            logoText="OrçaSonhos"
            [navigationItems]="sampleNavigationItems"
            [showUserMenu]="false"
          ></os-header>
        </div>
      </div>
    `,
    props: {
      sampleNavigationItems,
      sampleUserMenuItems,
    },
  }),
  parameters: {
    docs: {
      description: {
        story: 'Cabeçalho com diferentes configurações do menu do usuário.',
      },
    },
  },
};

export const WithMobileMenu: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 24px;">
        <div>
          <h4>Com Menu Mobile</h4>
          <os-header
            logoText="OrçaSonhos"
            [navigationItems]="sampleNavigationItems"
            [showMobileMenu]="true"
            [showUserMenu]="true"
            userName="João Silva"
            userInitials="JS"
            [userMenuItems]="sampleUserMenuItems"
          ></os-header>
        </div>

        <div>
          <h4>Sem Menu Mobile</h4>
          <os-header
            logoText="OrçaSonhos"
            [navigationItems]="sampleNavigationItems"
            [showMobileMenu]="false"
            [showUserMenu]="true"
            userName="João Silva"
            userInitials="JS"
            [userMenuItems]="sampleUserMenuItems"
          ></os-header>
        </div>
      </div>
    `,
    props: {
      sampleNavigationItems,
      sampleUserMenuItems,
    },
  }),
  parameters: {
    docs: {
      description: {
        story: 'Cabeçalho com e sem menu mobile.',
      },
    },
  },
};

export const DarkTheme: Story = {
  render: () => ({
    template: `
      <div style="background-color: #1a1a1a; padding: 20px; border-radius: 8px;">
        <h4 style="color: white; margin-bottom: 16px;">Tema Escuro</h4>
        <os-header
          logoText="OrçaSonhos"
          [navigationItems]="sampleNavigationItems"
          [actions]="sampleActions"
          [showUserMenu]="true"
          userName="João Silva"
          userRole="Administrador"
          userInitials="JS"
          [userMenuItems]="sampleUserMenuItems"
          [showMobileMenu]="true"
          theme="dark"
        ></os-header>
      </div>
    `,
    props: {
      sampleNavigationItems,
      sampleActions,
      sampleUserMenuItems,
    },
  }),
  parameters: {
    docs: {
      description: {
        story: 'Cabeçalho com tema escuro.',
      },
    },
  },
};

export const Sticky: Story = {
  render: () => ({
    template: `
      <div style="height: 200vh; padding: 20px;">
        <h4>Cabeçalho Fixo (Sticky)</h4>
        <p>Role a página para ver o comportamento do cabeçalho fixo.</p>

        <os-header
          logoText="OrçaSonhos"
          [navigationItems]="sampleNavigationItems"
          [actions]="sampleActions"
          [showUserMenu]="true"
          userName="João Silva"
          userInitials="JS"
          [userMenuItems]="sampleUserMenuItems"
          [showMobileMenu]="true"
          [sticky]="true"
        ></os-header>

        <div style="margin-top: 100px;">
          <h3>Conteúdo da Página</h3>
          <p>Este é o conteúdo da página que aparece abaixo do cabeçalho fixo.</p>
          <p>Role para cima e para baixo para ver o comportamento do cabeçalho sticky.</p>
        </div>
      </div>
    `,
    props: {
      sampleNavigationItems,
      sampleActions,
      sampleUserMenuItems,
    },
  }),
  parameters: {
    docs: {
      description: {
        story: 'Cabeçalho com comportamento sticky (fixo).',
      },
    },
  },
};

export const Interactive: Story = {
  args: {
    logoText: 'OrçaSonhos',
    logoRoute: '/',
    navigationItems: sampleNavigationItems,
    showUserMenu: true,
    userName: 'João Silva',
    userRole: 'Administrador',
    userInitials: 'JS',
    userMenuItems: sampleUserMenuItems,
    actions: sampleActions,
    showMobileMenu: true,
    variant: 'default',
    size: 'medium',
    theme: 'light',
    sticky: false,
  },
  render: (args) => ({
    props: args,
    template: `
      <os-header
        [logoText]="logoText"
        [logoRoute]="logoRoute"
        [navigationItems]="navigationItems"
        [showUserMenu]="showUserMenu"
        [userName]="userName"
        [userRole]="userRole"
        [userInitials]="userInitials"
        [userMenuItems]="userMenuItems"
        [actions]="actions"
        [showMobileMenu]="showMobileMenu"
        [variant]="variant"
        [size]="size"
        [theme]="theme"
        [sticky]="sticky"
        (logoClick)="logoClick($event)"
        (navigationClick)="navigationClick($event)"
        (actionClick)="actionClick($event)"
        (userMenuItemClick)="userMenuItemClick($event)"
        (mobileNavigationClick)="mobileNavigationClick($event)"
        (mobileMenuToggle)="mobileMenuToggle($event)"
      ></os-header>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Cabeçalho interativo com controles para testar todas as propriedades.',
      },
    },
  },
};
