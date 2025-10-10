import type { Meta, StoryObj } from '@storybook/angular';
import { OsPageHeaderComponent } from './os-page-header.component';

const meta: Meta<OsPageHeaderComponent> = {
  title: 'Design System/Organisms/Page Header',
  component: OsPageHeaderComponent,
  parameters: {
    docs: {
      description: {
        component:
          'Cabeçalho de página do Design System Orca Sonhos com breadcrumbs, título, ações e descrição.',
      },
    },
  },
  argTypes: {
    title: {
      control: { type: 'text' },
      description: 'Título da página',
    },
    subtitle: {
      control: { type: 'text' },
      description: 'Subtítulo da página',
    },
    description: {
      control: { type: 'text' },
      description: 'Descrição da página',
    },
    icon: {
      control: { type: 'text' },
      description: 'Ícone da página',
    },
    breadcrumbs: {
      control: { type: 'object' },
      description: 'Lista de breadcrumbs',
    },
    actions: {
      control: { type: 'object' },
      description: 'Ações do cabeçalho',
    },
    variant: {
      control: { type: 'select' },
      options: ['default', 'compact', 'extended'],
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
    ariaLabel: {
      control: { type: 'text' },
      description: 'Rótulo para acessibilidade',
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<OsPageHeaderComponent>;

const sampleBreadcrumbs = [
  { label: 'Início', route: '/' },
  { label: 'Orçamentos', route: '/budgets' },
  { label: 'Criar Orçamento', disabled: true },
];

const sampleActions = [
  { label: 'Salvar', icon: 'save', variant: 'primary' as const },
  { label: 'Cancelar', icon: 'close', variant: 'secondary' as const },
];

const extendedActions = [
  { label: 'Exportar', icon: 'download', variant: 'secondary' as const },
  { label: 'Imprimir', icon: 'print', variant: 'secondary' as const },
  { label: 'Compartilhar', icon: 'share', variant: 'secondary' as const },
  { label: 'Editar', icon: 'edit', variant: 'primary' as const },
];

export const Default: Story = {
  args: {
    title: 'Criar Orçamento',
    subtitle: 'Configure seu novo orçamento mensal',
    description: 'Preencha os dados abaixo para criar um novo orçamento personalizado.',
    icon: 'account_balance_wallet',
    breadcrumbs: sampleBreadcrumbs,
    actions: sampleActions,
    variant: 'default',
    size: 'medium',
    theme: 'light',
    ariaLabel: 'Cabeçalho da página',
  },
  render: (args) => ({
    props: args,
    template: `
      <os-page-header
        [title]="title"
        [subtitle]="subtitle"
        [description]="description"
        [icon]="icon"
        [breadcrumbs]="breadcrumbs"
        [actions]="actions"
        [variant]="variant"
        [size]="size"
        [theme]="theme"
        [ariaLabel]="ariaLabel"
        (actionClick)="actionClick($event)"
      ></os-page-header>
    `,
  }),
};

export const Variants: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 24px;">
        <div>
          <h4>Default</h4>
          <os-page-header
            title="Dashboard"
            subtitle="Visão geral das suas finanças"
            description="Acompanhe seus gastos e receitas em tempo real."
            icon="dashboard"
            [breadcrumbs]="sampleBreadcrumbs"
            [actions]="sampleActions"
            variant="default"
          ></os-page-header>
        </div>

        <div>
          <h4>Compact</h4>
          <os-page-header
            title="Transações"
            subtitle="Lista de transações"
            icon="receipt"
            [breadcrumbs]="sampleBreadcrumbs"
            [actions]="sampleActions"
            variant="compact"
          ></os-page-header>
        </div>

        <div>
          <h4>Extended</h4>
          <os-page-header
            title="Relatórios Financeiros"
            subtitle="Análise detalhada dos seus dados"
            description="Visualize gráficos, tendências e insights sobre suas finanças pessoais."
            icon="bar_chart"
            [breadcrumbs]="sampleBreadcrumbs"
            [actions]="extendedActions"
            variant="extended"
          ></os-page-header>
        </div>
      </div>
    `,
    props: {
      sampleBreadcrumbs,
      sampleActions,
      extendedActions,
    },
  }),
  parameters: {
    docs: {
      description: {
        story: 'Todas as variantes disponíveis do cabeçalho de página.',
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
          <os-page-header
            title="Configurações"
            subtitle="Ajustes do sistema"
            icon="settings"
            [breadcrumbs]="sampleBreadcrumbs"
            [actions]="sampleActions"
            size="small"
          ></os-page-header>
        </div>

        <div>
          <h4>Medium</h4>
          <os-page-header
            title="Orçamentos"
            subtitle="Gerencie seus orçamentos"
            icon="account_balance_wallet"
            [breadcrumbs]="sampleBreadcrumbs"
            [actions]="sampleActions"
            size="medium"
          ></os-page-header>
        </div>

        <div>
          <h4>Large</h4>
          <os-page-header
            title="Relatórios"
            subtitle="Análise financeira completa"
            description="Visualize todos os seus dados financeiros em relatórios detalhados."
            icon="bar_chart"
            [breadcrumbs]="sampleBreadcrumbs"
            [actions]="sampleActions"
            size="large"
          ></os-page-header>
        </div>
      </div>
    `,
    props: {
      sampleBreadcrumbs,
      sampleActions,
    },
  }),
  parameters: {
    docs: {
      description: {
        story: 'Todos os tamanhos disponíveis do cabeçalho de página.',
      },
    },
  },
};

export const WithBreadcrumbs: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 24px;">
        <div>
          <h4>Com Breadcrumbs</h4>
          <os-page-header
            title="Criar Orçamento"
            subtitle="Configure seu novo orçamento"
            icon="account_balance_wallet"
            [breadcrumbs]="sampleBreadcrumbs"
            [actions]="sampleActions"
          ></os-page-header>
        </div>

        <div>
          <h4>Com Breadcrumbs Longos</h4>
          <os-page-header
            title="Detalhes da Transação"
            subtitle="Visualize os detalhes completos"
            icon="receipt"
            [breadcrumbs]="[
              { label: 'Início', route: '/' },
              { label: 'Transações', route: '/transactions' },
              { label: 'Janeiro 2024', route: '/transactions/2024/01' },
              { label: 'Alimentação', route: '/transactions/2024/01/food' },
              { label: 'Detalhes', disabled: true }
            ]"
            [actions]="sampleActions"
          ></os-page-header>
        </div>

        <div>
          <h4>Sem Breadcrumbs</h4>
          <os-page-header
            title="Dashboard"
            subtitle="Visão geral"
            icon="dashboard"
            [breadcrumbs]="[]"
            [actions]="sampleActions"
          ></os-page-header>
        </div>
      </div>
    `,
    props: {
      sampleBreadcrumbs,
      sampleActions,
    },
  }),
  parameters: {
    docs: {
      description: {
        story: 'Cabeçalho com e sem breadcrumbs.',
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
          <os-page-header
            title="Orçamentos"
            subtitle="Gerencie seus orçamentos"
            icon="account_balance_wallet"
            [breadcrumbs]="sampleBreadcrumbs"
            [actions]="sampleActions"
          ></os-page-header>
        </div>

        <div>
          <h4>Com Múltiplas Ações</h4>
          <os-page-header
            title="Relatórios"
            subtitle="Análise financeira"
            icon="bar_chart"
            [breadcrumbs]="sampleBreadcrumbs"
            [actions]="extendedActions"
          ></os-page-header>
        </div>

        <div>
          <h4>Sem Ações</h4>
          <os-page-header
            title="Dashboard"
            subtitle="Visão geral"
            icon="dashboard"
            [breadcrumbs]="sampleBreadcrumbs"
            [actions]="[]"
          ></os-page-header>
        </div>
      </div>
    `,
    props: {
      sampleBreadcrumbs,
      sampleActions,
      extendedActions,
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

export const WithDescription: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 24px;">
        <div>
          <h4>Com Descrição</h4>
          <os-page-header
            title="Criar Orçamento"
            subtitle="Configure seu novo orçamento mensal"
            description="Preencha os dados abaixo para criar um novo orçamento personalizado. Você pode definir categorias, limites e metas para cada área de gastos."
            icon="account_balance_wallet"
            [breadcrumbs]="sampleBreadcrumbs"
            [actions]="sampleActions"
          ></os-page-header>
        </div>

        <div>
          <h4>Sem Descrição</h4>
          <os-page-header
            title="Transações"
            subtitle="Lista de transações"
            icon="receipt"
            [breadcrumbs]="sampleBreadcrumbs"
            [actions]="sampleActions"
          ></os-page-header>
        </div>
      </div>
    `,
    props: {
      sampleBreadcrumbs,
      sampleActions,
    },
  }),
  parameters: {
    docs: {
      description: {
        story: 'Cabeçalho com e sem descrição.',
      },
    },
  },
};

export const WithIcon: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 24px;">
        <div>
          <h4>Com Ícone</h4>
          <os-page-header
            title="Dashboard"
            subtitle="Visão geral das finanças"
            icon="dashboard"
            [breadcrumbs]="sampleBreadcrumbs"
            [actions]="sampleActions"
          ></os-page-header>
        </div>

        <div>
          <h4>Com Ícone Diferente</h4>
          <os-page-header
            title="Metas Financeiras"
            subtitle="Acompanhe seu progresso"
            icon="flag"
            [breadcrumbs]="sampleBreadcrumbs"
            [actions]="sampleActions"
          ></os-page-header>
        </div>

        <div>
          <h4>Sem Ícone</h4>
          <os-page-header
            title="Configurações"
            subtitle="Ajustes do sistema"
            [breadcrumbs]="sampleBreadcrumbs"
            [actions]="sampleActions"
          ></os-page-header>
        </div>
      </div>
    `,
    props: {
      sampleBreadcrumbs,
      sampleActions,
    },
  }),
  parameters: {
    docs: {
      description: {
        story: 'Cabeçalho com e sem ícone.',
      },
    },
  },
};

export const DarkTheme: Story = {
  render: () => ({
    template: `
      <div style="background-color: #1a1a1a; padding: 20px; border-radius: 8px;">
        <h4 style="color: white; margin-bottom: 16px;">Tema Escuro</h4>
        <os-page-header
          title="Relatórios Financeiros"
          subtitle="Análise detalhada dos dados"
          description="Visualize gráficos, tendências e insights sobre suas finanças pessoais."
          icon="bar_chart"
          [breadcrumbs]="sampleBreadcrumbs"
          [actions]="extendedActions"
          theme="dark"
        ></os-page-header>
      </div>
    `,
    props: {
      sampleBreadcrumbs,
      extendedActions,
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

export const Minimal: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 24px;">
        <div>
          <h4>Apenas Título</h4>
          <os-page-header
            title="Dashboard"
            [breadcrumbs]="[]"
            [actions]="[]"
          ></os-page-header>
        </div>

        <div>
          <h4>Título e Subtítulo</h4>
          <os-page-header
            title="Orçamentos"
            subtitle="Gerencie seus orçamentos"
            [breadcrumbs]="[]"
            [actions]="[]"
          ></os-page-header>
        </div>

        <div>
          <h4>Título, Subtítulo e Ícone</h4>
          <os-page-header
            title="Transações"
            subtitle="Lista de transações"
            icon="receipt"
            [breadcrumbs]="[]"
            [actions]="[]"
          ></os-page-header>
        </div>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Cabeçalho minimalista com apenas elementos essenciais.',
      },
    },
  },
};

export const Interactive: Story = {
  args: {
    title: 'Criar Orçamento',
    subtitle: 'Configure seu novo orçamento mensal',
    description: 'Preencha os dados abaixo para criar um novo orçamento personalizado.',
    icon: 'account_balance_wallet',
    breadcrumbs: sampleBreadcrumbs,
    actions: sampleActions,
    variant: 'default',
    size: 'medium',
    theme: 'light',
    ariaLabel: 'Cabeçalho da página',
  },
  render: (args) => ({
    props: args,
    template: `
      <os-page-header
        [title]="title"
        [subtitle]="subtitle"
        [description]="description"
        [icon]="icon"
        [breadcrumbs]="breadcrumbs"
        [actions]="actions"
        [variant]="variant"
        [size]="size"
        [theme]="theme"
        [ariaLabel]="ariaLabel"
        (actionClick)="actionClick($event)"
      ></os-page-header>
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
