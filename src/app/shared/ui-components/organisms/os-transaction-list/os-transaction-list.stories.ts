import type { Meta, StoryObj } from '@storybook/angular';
import { OsTransactionListComponent } from './os-transaction-list.component';

const meta: Meta<OsTransactionListComponent> = {
  title: 'Design System/Organisms/Transaction List',
  component: OsTransactionListComponent,
  parameters: {
    docs: {
      description: {
        component:
          'Lista de transações do Design System Orca Sonhos com filtros, paginação, ordenação e ações.',
      },
    },
  },
  argTypes: {
    transactions: {
      control: { type: 'object' },
      description: 'Lista de transações',
    },
    title: {
      control: { type: 'text' },
      description: 'Título da lista',
    },
    subtitle: {
      control: { type: 'text' },
      description: 'Subtítulo da lista',
    },
    size: {
      control: { type: 'select' },
      options: ['small', 'medium', 'large'],
      description: 'Tamanho da lista',
    },
    variant: {
      control: { type: 'select' },
      options: ['default', 'compact', 'detailed', 'card'],
      description: 'Variante da lista',
    },
    theme: {
      control: { type: 'select' },
      options: ['light', 'dark'],
      description: 'Tema da lista',
    },
    showHeaderActions: {
      control: { type: 'boolean' },
      description: 'Mostrar ações do cabeçalho',
    },
    showRefreshButton: {
      control: { type: 'boolean' },
      description: 'Mostrar botão de atualizar',
    },
    showExportButton: {
      control: { type: 'boolean' },
      description: 'Mostrar botão de exportar',
    },
    showAddButton: {
      control: { type: 'boolean' },
      description: 'Mostrar botão de adicionar',
    },
    addButtonText: {
      control: { type: 'text' },
      description: 'Texto do botão adicionar',
    },
    showFilters: {
      control: { type: 'boolean' },
      description: 'Mostrar filtros',
    },
    showPagination: {
      control: { type: 'boolean' },
      description: 'Mostrar paginação',
    },
    showFooter: {
      control: { type: 'boolean' },
      description: 'Mostrar rodapé',
    },
    showItemCount: {
      control: { type: 'boolean' },
      description: 'Mostrar contagem de itens',
    },
    showLastUpdated: {
      control: { type: 'boolean' },
      description: 'Mostrar última atualização',
    },
    showFooterActions: {
      control: { type: 'boolean' },
      description: 'Mostrar ações do rodapé',
    },
    filterOptions: {
      control: { type: 'object' },
      description: 'Opções de filtro',
    },
    pageSizeOptions: {
      control: { type: 'object' },
      description: 'Opções de tamanho da página',
    },
    showFirstLastButtons: {
      control: { type: 'boolean' },
      description: 'Mostrar botões primeira/última página',
    },
    isLoading: {
      control: { type: 'boolean' },
      description: 'Estado de carregamento',
    },
    lastUpdated: {
      control: { type: 'date' },
      description: 'Data da última atualização',
    },
    noDataTitle: {
      control: { type: 'text' },
      description: 'Título quando não há dados',
    },
    noDataText: {
      control: { type: 'text' },
      description: 'Texto quando não há dados',
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<OsTransactionListComponent>;

const sampleTransactions = [
  {
    id: '1',
    description: 'Salário',
    amount: 5000,
    date: new Date('2024-01-15'),
    category: 'Receita',
    type: 'income' as const,
    status: 'completed' as const,
    account: 'Conta Corrente',
    tags: ['salário', 'trabalho'],
    priority: 'high' as const,
    icon: 'money',
  },
  {
    id: '2',
    description: 'Supermercado',
    amount: -150.5,
    date: new Date('2024-01-16'),
    category: 'Alimentação',
    type: 'expense' as const,
    status: 'completed' as const,
    account: 'Cartão de Crédito',
    tags: ['compras', 'alimentação'],
    priority: 'medium' as const,
    icon: 'shopping-cart',
  },
  {
    id: '3',
    description: 'Transferência para Poupança',
    amount: -1000,
    date: new Date('2024-01-17'),
    category: 'Investimentos',
    type: 'transfer' as const,
    status: 'completed' as const,
    account: 'Conta Corrente',
    tags: ['poupança', 'investimento'],
    priority: 'high' as const,
    icon: 'piggy-bank',
  },
  {
    id: '4',
    description: 'Gasolina',
    amount: -80.0,
    date: new Date('2024-01-18'),
    category: 'Transporte',
    type: 'expense' as const,
    status: 'pending' as const,
    account: 'Cartão de Débito',
    tags: ['combustível', 'transporte'],
    priority: 'low' as const,
    icon: 'car',
  },
  {
    id: '5',
    description: 'Freelance',
    amount: 800,
    date: new Date('2024-01-19'),
    category: 'Receita',
    type: 'income' as const,
    status: 'completed' as const,
    account: 'Conta Corrente',
    tags: ['freelance', 'trabalho'],
    priority: 'medium' as const,
    icon: 'briefcase',
  },
];

const sampleFilterOptions = [
  { key: 'description', label: 'Descrição', value: null, type: 'text' as const },
  {
    key: 'category',
    label: 'Categoria',
    value: null,
    type: 'select' as const,
    options: [
      { value: 'Receita', label: 'Receita' },
      { value: 'Alimentação', label: 'Alimentação' },
      { value: 'Transporte', label: 'Transporte' },
      { value: 'Investimentos', label: 'Investimentos' },
    ],
  },
  {
    key: 'type',
    label: 'Tipo',
    value: null,
    type: 'select' as const,
    options: [
      { value: 'income', label: 'Receita' },
      { value: 'expense', label: 'Despesa' },
      { value: 'transfer', label: 'Transferência' },
    ],
  },
  {
    key: 'status',
    label: 'Status',
    value: null,
    type: 'select' as const,
    options: [
      { value: 'completed', label: 'Concluída' },
      { value: 'pending', label: 'Pendente' },
      { value: 'cancelled', label: 'Cancelada' },
    ],
  },
  { key: 'date', label: 'Data', value: null, type: 'date' as const },
  { key: 'amount', label: 'Valor', value: null, type: 'number' as const },
];

export const Default: Story = {
  args: {
    transactions: sampleTransactions,
    title: 'Transações',
    subtitle: 'Gerencie suas transações financeiras',
    size: 'medium',
    variant: 'default',
    theme: 'light',
    showHeaderActions: true,
    showRefreshButton: true,
    showExportButton: true,
    showAddButton: true,
    addButtonText: 'Nova Transação',
    showFilters: true,
    showPagination: true,
    showFooter: true,
    showItemCount: true,
    showLastUpdated: true,
    showFooterActions: false,
    filterOptions: sampleFilterOptions,
    pageSizeOptions: [5, 10, 25, 50],
    showFirstLastButtons: true,
    isLoading: false,
    lastUpdated: new Date(),
    noDataTitle: 'Nenhuma transação encontrada',
    noDataText: 'Não há transações para exibir no momento.',
  },
  render: (args) => ({
    props: args,
    template: `
      <os-transaction-list
        [transactions]="transactions"
        [title]="title"
        [subtitle]="subtitle"
        [size]="size"
        [variant]="variant"
        [theme]="theme"
        [showHeaderActions]="showHeaderActions"
        [showRefreshButton]="showRefreshButton"
        [showExportButton]="showExportButton"
        [showAddButton]="showAddButton"
        [addButtonText]="addButtonText"
        [showFilters]="showFilters"
        [showPagination]="showPagination"
        [showFooter]="showFooter"
        [showItemCount]="showItemCount"
        [showLastUpdated]="showLastUpdated"
        [showFooterActions]="showFooterActions"
        [filterOptions]="filterOptions"
        [pageSizeOptions]="pageSizeOptions"
        [showFirstLastButtons]="showFirstLastButtons"
        [isLoading]="isLoading"
        [lastUpdated]="lastUpdated"
        [noDataTitle]="noDataTitle"
        [noDataText]="noDataText"
        (rowClick)="rowClick($event)"
        (tableActionClick)="tableActionClick($event)"
        (refresh)="refresh()"
        (export)="export()"
        (add)="add()"
        (filterChange)="filterChange($event)"
        (sortChange)="sortChange($event)"
        (pageChange)="pageChange($event)"
      ></os-transaction-list>
    `,
  }),
};

export const Variants: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 24px;">
        <div>
          <h4>Default</h4>
          <os-transaction-list
            [transactions]="sampleTransactions"
            title="Transações"
            subtitle="Lista padrão de transações"
            variant="default"
            [filterOptions]="sampleFilterOptions"
          ></os-transaction-list>
        </div>

        <div>
          <h4>Compact</h4>
          <os-transaction-list
            [transactions]="sampleTransactions"
            title="Transações"
            subtitle="Lista compacta de transações"
            variant="compact"
            size="small"
            [filterOptions]="sampleFilterOptions"
          ></os-transaction-list>
        </div>

        <div>
          <h4>Detailed</h4>
          <os-transaction-list
            [transactions]="sampleTransactions"
            title="Transações"
            subtitle="Lista detalhada de transações"
            variant="detailed"
            size="large"
            [filterOptions]="sampleFilterOptions"
          ></os-transaction-list>
        </div>

        <div>
          <h4>Card</h4>
          <os-transaction-list
            [transactions]="sampleTransactions"
            title="Transações"
            subtitle="Lista em formato de cards"
            variant="card"
            size="medium"
            [filterOptions]="sampleFilterOptions"
          ></os-transaction-list>
        </div>
      </div>
    `,
    props: {
      sampleTransactions,
      sampleFilterOptions,
    },
  }),
  parameters: {
    docs: {
      description: {
        story: 'Todas as variantes disponíveis da lista de transações.',
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
          <os-transaction-list
            [transactions]="sampleTransactions"
            title="Transações"
            subtitle="Lista pequena"
            size="small"
            [filterOptions]="sampleFilterOptions"
          ></os-transaction-list>
        </div>

        <div>
          <h4>Medium</h4>
          <os-transaction-list
            [transactions]="sampleTransactions"
            title="Transações"
            subtitle="Lista média"
            size="medium"
            [filterOptions]="sampleFilterOptions"
          ></os-transaction-list>
        </div>

        <div>
          <h4>Large</h4>
          <os-transaction-list
            [transactions]="sampleTransactions"
            title="Transações"
            subtitle="Lista grande"
            size="large"
            [filterOptions]="sampleFilterOptions"
          ></os-transaction-list>
        </div>
      </div>
    `,
    props: {
      sampleTransactions,
      sampleFilterOptions,
    },
  }),
  parameters: {
    docs: {
      description: {
        story: 'Todos os tamanhos disponíveis da lista de transações.',
      },
    },
  },
};

export const WithFilters: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 24px;">
        <div>
          <h4>Com Filtros</h4>
          <os-transaction-list
            [transactions]="sampleTransactions"
            title="Transações"
            subtitle="Filtre as transações por diferentes critérios"
            [showFilters]="true"
            [filterOptions]="sampleFilterOptions"
          ></os-transaction-list>
        </div>

        <div>
          <h4>Sem Filtros</h4>
          <os-transaction-list
            [transactions]="sampleTransactions"
            title="Transações"
            subtitle="Lista simples sem filtros"
            [showFilters]="false"
          ></os-transaction-list>
        </div>
      </div>
    `,
    props: {
      sampleTransactions,
      sampleFilterOptions,
    },
  }),
  parameters: {
    docs: {
      description: {
        story: 'Lista de transações com e sem filtros.',
      },
    },
  },
};

export const WithActions: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 24px;">
        <div>
          <h4>Com Ações do Cabeçalho</h4>
          <os-transaction-list
            [transactions]="sampleTransactions"
            title="Transações"
            subtitle="Gerencie suas transações"
            [showHeaderActions]="true"
            [showRefreshButton]="true"
            [showExportButton]="true"
            [showAddButton]="true"
            addButtonText="Nova Transação"
          ></os-transaction-list>
        </div>

        <div>
          <h4>Com Ações da Tabela</h4>
          <os-transaction-list
            [transactions]="sampleTransactions"
            title="Transações"
            subtitle="Ações por linha"
            [showHeaderActions]="false"
          ></os-transaction-list>
        </div>

        <div>
          <h4>Sem Ações</h4>
          <os-transaction-list
            [transactions]="sampleTransactions"
            title="Transações"
            subtitle="Apenas visualização"
            [showHeaderActions]="false"
          ></os-transaction-list>
        </div>
      </div>
    `,
    props: {
      sampleTransactions,
    },
  }),
  parameters: {
    docs: {
      description: {
        story: 'Lista de transações com diferentes configurações de ações.',
      },
    },
  },
};

export const WithPagination: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 24px;">
        <div>
          <h4>Com Paginação</h4>
          <os-transaction-list
            [transactions]="sampleTransactions"
            title="Transações"
            subtitle="Com paginação"
            [showPagination]="true"
            [pageSizeOptions]="[2, 5, 10]"
          ></os-transaction-list>
        </div>

        <div>
          <h4>Sem Paginação</h4>
          <os-transaction-list
            [transactions]="sampleTransactions"
            title="Transações"
            subtitle="Sem paginação"
            [showPagination]="false"
          ></os-transaction-list>
        </div>
      </div>
    `,
    props: {
      sampleTransactions,
    },
  }),
  parameters: {
    docs: {
      description: {
        story: 'Lista de transações com e sem paginação.',
      },
    },
  },
};

export const LoadingState: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 24px;">
        <div>
          <h4>Estado de Carregamento</h4>
          <os-transaction-list
            [transactions]="sampleTransactions"
            title="Transações"
            subtitle="Carregando transações..."
            [isLoading]="true"
            [showRefreshButton]="true"
          ></os-transaction-list>
        </div>

        <div>
          <h4>Dados Carregados</h4>
          <os-transaction-list
            [transactions]="sampleTransactions"
            title="Transações"
            subtitle="Dados carregados com sucesso"
            [isLoading]="false"
            [showRefreshButton]="true"
          ></os-transaction-list>
        </div>
      </div>
    `,
    props: {
      sampleTransactions,
    },
  }),
  parameters: {
    docs: {
      description: {
        story: 'Lista de transações em estado de carregamento e com dados carregados.',
      },
    },
  },
};

export const EmptyState: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 24px;">
        <div>
          <h4>Estado Vazio</h4>
          <os-transaction-list
            [transactions]="[]"
            title="Transações"
            subtitle="Nenhuma transação encontrada"
            [showNoData]="true"
            noDataTitle="Nenhuma transação encontrada"
            noDataText="Não há transações para exibir no momento."
          ></os-transaction-list>
        </div>

        <div>
          <h4>Estado Vazio com Ação</h4>
          <os-transaction-list
            [transactions]="[]"
            title="Transações"
            subtitle="Comece adicionando sua primeira transação"
            [showNoData]="true"
            [showAddButton]="true"
            addButtonText="Adicionar Primeira Transação"
            noDataTitle="Nenhuma transação encontrada"
            noDataText="Não há transações para exibir. Clique em 'Adicionar Primeira Transação' para começar."
          ></os-transaction-list>
        </div>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Lista de transações em estado vazio com diferentes configurações.',
      },
    },
  },
};

export const DarkTheme: Story = {
  render: () => ({
    template: `
      <div style="background-color: #1a1a1a; padding: 20px; border-radius: 8px;">
        <h4 style="color: white; margin-bottom: 16px;">Tema Escuro</h4>
        <os-transaction-list
          [transactions]="sampleTransactions"
          title="Transações"
          subtitle="Lista de transações com tema escuro"
          theme="dark"
          [filterOptions]="sampleFilterOptions"
        ></os-transaction-list>
      </div>
    `,
    props: {
      sampleTransactions,
      sampleFilterOptions,
    },
  }),
  parameters: {
    docs: {
      description: {
        story: 'Lista de transações com tema escuro.',
      },
    },
  },
};

export const WithFooter: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 24px;">
        <div>
          <h4>Com Rodapé</h4>
          <os-transaction-list
            [transactions]="sampleTransactions"
            title="Transações"
            subtitle="Com informações do rodapé"
            [showFooter]="true"
            [showItemCount]="true"
            [showLastUpdated]="true"
            [showFooterActions]="true"
          >
            <div slot="footer-actions">
              <button style="padding: 8px 16px; background: #f5f5f5; border: 1px solid #ddd; border-radius: 4px; cursor: pointer;">
                Ação Personalizada
              </button>
            </div>
          </os-transaction-list>
        </div>

        <div>
          <h4>Sem Rodapé</h4>
          <os-transaction-list
            [transactions]="sampleTransactions"
            title="Transações"
            subtitle="Sem rodapé"
            [showFooter]="false"
          ></os-transaction-list>
        </div>
      </div>
    `,
    props: {
      sampleTransactions,
    },
  }),
  parameters: {
    docs: {
      description: {
        story: 'Lista de transações com e sem rodapé.',
      },
    },
  },
};

export const Interactive: Story = {
  args: {
    transactions: sampleTransactions,
    title: 'Transações',
    subtitle: 'Gerencie suas transações financeiras',
    size: 'medium',
    variant: 'default',
    theme: 'light',
    showHeaderActions: true,
    showRefreshButton: true,
    showExportButton: true,
    showAddButton: true,
    addButtonText: 'Nova Transação',
    showFilters: true,
    showPagination: true,
    showFooter: true,
    showItemCount: true,
    showLastUpdated: true,
    showFooterActions: false,
    filterOptions: sampleFilterOptions,
    pageSizeOptions: [5, 10, 25, 50],
    showFirstLastButtons: true,
    isLoading: false,
    lastUpdated: new Date(),
    noDataTitle: 'Nenhuma transação encontrada',
    noDataText: 'Não há transações para exibir no momento.',
    layout: 'table',
    sortBy: 'date',
    enableInfiniteScroll: false,
    enableCategoryColors: true,
    enablePriorityIndicators: true,
    enableHapticFeedback: true,
  },
  render: (args) => ({
    props: args,
    template: `
      <os-transaction-list
        [transactions]="transactions"
        [title]="title"
        [subtitle]="subtitle"
        [size]="size"
        [variant]="variant"
        [theme]="theme"
        [showHeaderActions]="showHeaderActions"
        [showRefreshButton]="showRefreshButton"
        [showExportButton]="showExportButton"
        [showAddButton]="showAddButton"
        [addButtonText]="addButtonText"
        [showFilters]="showFilters"
        [showPagination]="showPagination"
        [showFooter]="showFooter"
        [showItemCount]="showItemCount"
        [showLastUpdated]="showLastUpdated"
        [showFooterActions]="showFooterActions"
        [filterOptions]="filterOptions"
        [pageSizeOptions]="pageSizeOptions"
        [showFirstLastButtons]="showFirstLastButtons"
        [isLoading]="isLoading"
        [lastUpdated]="lastUpdated"
        [noDataTitle]="noDataTitle"
        [noDataText]="noDataText"
        [layout]="layout"
        [sortBy]="sortBy"
        [enableInfiniteScroll]="enableInfiniteScroll"
        [enableCategoryColors]="enableCategoryColors"
        [enablePriorityIndicators]="enablePriorityIndicators"
        [enableHapticFeedback]="enableHapticFeedback"
        (rowClick)="rowClick($event)"
        (tableActionClick)="tableActionClick($event)"
        (refresh)="refresh()"
        (export)="export()"
        (add)="add()"
        (filterChange)="filterChange($event)"
        (sortChange)="sortChange($event)"
        (pageChange)="pageChange($event)"
      ></os-transaction-list>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Lista de transações interativa com controles para testar todas as propriedades.',
      },
    },
  },
};
