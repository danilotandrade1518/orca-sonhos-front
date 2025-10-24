import type { Meta, StoryObj } from '@storybook/angular';
import { OsDataGridComponent } from './os-data-grid.component';

const meta: Meta<OsDataGridComponent> = {
  title: 'Design System/Organisms/Data Grid',
  component: OsDataGridComponent,
  parameters: {
    docs: {
      description: {
        component:
          'Grid de dados do Design System Orca Sonhos com filtros, paginação, ordenação e ações.',
      },
    },
  },
  argTypes: {
    data: {
      control: { type: 'object' },
      description: 'Dados do grid',
    },
    columns: {
      control: { type: 'object' },
      description: 'Colunas do grid',
    },
    filterOptions: {
      control: { type: 'object' },
      description: 'Opções de filtro',
    },
    tableActions: {
      control: { type: 'object' },
      description: 'Ações da tabela',
    },
    title: {
      control: { type: 'text' },
      description: 'Título do grid',
    },
    subtitle: {
      control: { type: 'text' },
      description: 'Subtítulo do grid',
    },
    size: {
      control: { type: 'select' },
      options: ['small', 'medium', 'large'],
      description: 'Tamanho do grid',
    },
    variant: {
      control: { type: 'select' },
      options: ['default', 'compact', 'detailed'],
      description: 'Variante do grid',
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
    showNoData: {
      control: { type: 'boolean' },
      description: 'Mostrar mensagem de sem dados',
    },
    noDataText: {
      control: { type: 'text' },
      description: 'Texto quando não há dados',
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
    useVirtualScrolling: {
      control: { type: 'boolean' },
      description: 'Usar virtual scrolling para grandes datasets',
    },
    virtualScrollThreshold: {
      control: { type: 'number' },
      description: 'Limite de itens para ativar virtual scrolling',
    },
    virtualScrollItemSize: {
      control: { type: 'number' },
      description: 'Altura de cada item no virtual scrolling',
    },
    virtualScrollMinBuffer: {
      control: { type: 'number' },
      description: 'Buffer mínimo do virtual scrolling',
    },
    virtualScrollMaxBuffer: {
      control: { type: 'number' },
      description: 'Buffer máximo do virtual scrolling',
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<OsDataGridComponent>;

const sampleData = [
  {
    id: 1,
    name: 'João Silva',
    email: 'joao@email.com',
    status: 'Ativo',
    role: 'Admin',
    createdAt: '2024-01-15',
  },
  {
    id: 2,
    name: 'Maria Santos',
    email: 'maria@email.com',
    status: 'Inativo',
    role: 'User',
    createdAt: '2024-01-16',
  },
  {
    id: 3,
    name: 'Pedro Costa',
    email: 'pedro@email.com',
    status: 'Ativo',
    role: 'User',
    createdAt: '2024-01-17',
  },
  {
    id: 4,
    name: 'Ana Oliveira',
    email: 'ana@email.com',
    status: 'Pendente',
    role: 'User',
    createdAt: '2024-01-18',
  },
  {
    id: 5,
    name: 'Carlos Lima',
    email: 'carlos@email.com',
    status: 'Ativo',
    role: 'Moderator',
    createdAt: '2024-01-19',
  },
];

const sampleColumns = [
  { key: 'id', label: 'ID', sortable: true, width: '80px' },
  { key: 'name', label: 'Nome', sortable: true, width: '200px' },
  { key: 'email', label: 'Email', sortable: true, width: '250px' },
  { key: 'status', label: 'Status', sortable: true, width: '120px' },
  { key: 'role', label: 'Função', sortable: true, width: '120px' },
  { key: 'createdAt', label: 'Criado em', sortable: true, width: '120px' },
];

const sampleFilterOptions = [
  { key: 'name', label: 'Nome', value: null, type: 'text' as const },
  {
    key: 'status',
    label: 'Status',
    value: null,
    type: 'select' as const,
    options: [
      { value: 'Ativo', label: 'Ativo' },
      { value: 'Inativo', label: 'Inativo' },
      { value: 'Pendente', label: 'Pendente' },
    ],
  },
  {
    key: 'role',
    label: 'Função',
    value: null,
    type: 'select' as const,
    options: [
      { value: 'Admin', label: 'Admin' },
      { value: 'User', label: 'User' },
      { value: 'Moderator', label: 'Moderator' },
    ],
  },
  { key: 'createdAt', label: 'Data de Criação', value: null, type: 'date' as const },
];

const sampleTableActions = [
  { key: 'edit', label: 'Editar', icon: 'edit', variant: 'primary' as const },
  { key: 'delete', label: 'Excluir', icon: 'delete', variant: 'danger' as const },
  { key: 'view', label: 'Visualizar', icon: 'visibility', variant: 'secondary' as const },
];

export const Default: Story = {
  args: {
    data: sampleData,
    columns: sampleColumns,
    filterOptions: sampleFilterOptions,
    tableActions: sampleTableActions,
    title: 'Usuários',
    subtitle: 'Gerencie os usuários do sistema',
    size: 'medium',
    variant: 'default',
    showHeaderActions: true,
    showRefreshButton: true,
    showExportButton: true,
    showAddButton: true,
    addButtonText: 'Adicionar Usuário',
    showFilters: true,
    showPagination: true,
    showNoData: true,
    noDataText: 'Nenhum usuário encontrado',
    showFooter: true,
    showItemCount: true,
    showLastUpdated: true,
    showFooterActions: false,
    pageSizeOptions: [5, 10, 25, 50],
    showFirstLastButtons: true,
    isLoading: false,
    lastUpdated: new Date(),
  },
  render: (args) => ({
    props: args,
    template: `
      <os-data-grid
        [data]="data"
        [columns]="columns"
        [filterOptions]="filterOptions"
        [tableActions]="tableActions"
        [title]="title"
        [subtitle]="subtitle"
        [size]="size"
        [variant]="variant"
        [showHeaderActions]="showHeaderActions"
        [showRefreshButton]="showRefreshButton"
        [showExportButton]="showExportButton"
        [showAddButton]="showAddButton"
        [addButtonText]="addButtonText"
        [showFilters]="showFilters"
        [showPagination]="showPagination"
        [showNoData]="showNoData"
        [noDataText]="noDataText"
        [showFooter]="showFooter"
        [showItemCount]="showItemCount"
        [showLastUpdated]="showLastUpdated"
        [showFooterActions]="showFooterActions"
        [pageSizeOptions]="pageSizeOptions"
        [showFirstLastButtons]="showFirstLastButtons"
        [isLoading]="isLoading"
        [lastUpdated]="lastUpdated"
        (rowClick)="rowClick($event)"
        (tableActionClick)="tableActionClick($event)"
        (refresh)="refresh()"
        (export)="export()"
        (add)="add()"
        (filterChange)="filterChange($event)"
        (sortChange)="sortChange($event)"
        (pageChange)="pageChange($event)"
      ></os-data-grid>
    `,
  }),
};

export const Variants: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 24px;">
        <div>
          <h4>Default</h4>
          <os-data-grid
            [data]="sampleData"
            [columns]="sampleColumns"
            [filterOptions]="sampleFilterOptions"
            [tableActions]="sampleTableActions"
            title="Usuários"
            subtitle="Lista de usuários"
            variant="default"
          ></os-data-grid>
        </div>

        <div>
          <h4>Compact</h4>
          <os-data-grid
            [data]="sampleData"
            [columns]="sampleColumns"
            [filterOptions]="sampleFilterOptions"
            [tableActions]="sampleTableActions"
            title="Usuários"
            subtitle="Lista compacta"
            variant="compact"
            size="small"
          ></os-data-grid>
        </div>

        <div>
          <h4>Detailed</h4>
          <os-data-grid
            [data]="sampleData"
            [columns]="sampleColumns"
            [filterOptions]="sampleFilterOptions"
            [tableActions]="sampleTableActions"
            title="Usuários"
            subtitle="Lista detalhada"
            variant="detailed"
            size="large"
          ></os-data-grid>
        </div>
      </div>
    `,
    props: {
      sampleData,
      sampleColumns,
      sampleFilterOptions,
      sampleTableActions,
    },
  }),
  parameters: {
    docs: {
      description: {
        story: 'Todas as variantes disponíveis do grid de dados.',
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
          <os-data-grid
            [data]="sampleData"
            [columns]="sampleColumns"
            [filterOptions]="sampleFilterOptions"
            [tableActions]="sampleTableActions"
            title="Usuários"
            size="small"
          ></os-data-grid>
        </div>

        <div>
          <h4>Medium</h4>
          <os-data-grid
            [data]="sampleData"
            [columns]="sampleColumns"
            [filterOptions]="sampleFilterOptions"
            [tableActions]="sampleTableActions"
            title="Usuários"
            size="medium"
          ></os-data-grid>
        </div>

        <div>
          <h4>Large</h4>
          <os-data-grid
            [data]="sampleData"
            [columns]="sampleColumns"
            [filterOptions]="sampleFilterOptions"
            [tableActions]="sampleTableActions"
            title="Usuários"
            size="large"
          ></os-data-grid>
        </div>
      </div>
    `,
    props: {
      sampleData,
      sampleColumns,
      sampleFilterOptions,
      sampleTableActions,
    },
  }),
  parameters: {
    docs: {
      description: {
        story: 'Todos os tamanhos disponíveis do grid de dados.',
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
          <os-data-grid
            [data]="sampleData"
            [columns]="sampleColumns"
            [filterOptions]="sampleFilterOptions"
            [tableActions]="sampleTableActions"
            title="Usuários"
            subtitle="Filtre os usuários por diferentes critérios"
            [showFilters]="true"
          ></os-data-grid>
        </div>

        <div>
          <h4>Sem Filtros</h4>
          <os-data-grid
            [data]="sampleData"
            [columns]="sampleColumns"
            [tableActions]="sampleTableActions"
            title="Usuários"
            subtitle="Lista simples sem filtros"
            [showFilters]="false"
          ></os-data-grid>
        </div>
      </div>
    `,
    props: {
      sampleData,
      sampleColumns,
      sampleFilterOptions,
      sampleTableActions,
    },
  }),
  parameters: {
    docs: {
      description: {
        story: 'Grid com e sem filtros.',
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
          <os-data-grid
            [data]="sampleData"
            [columns]="sampleColumns"
            [tableActions]="sampleTableActions"
            title="Usuários"
            subtitle="Gerencie os usuários"
            [showHeaderActions]="true"
            [showRefreshButton]="true"
            [showExportButton]="true"
            [showAddButton]="true"
            addButtonText="Novo Usuário"
          ></os-data-grid>
        </div>

        <div>
          <h4>Com Ações da Tabela</h4>
          <os-data-grid
            [data]="sampleData"
            [columns]="sampleColumns"
            [tableActions]="sampleTableActions"
            title="Usuários"
            subtitle="Ações por linha"
            [showHeaderActions]="false"
          ></os-data-grid>
        </div>

        <div>
          <h4>Sem Ações</h4>
          <os-data-grid
            [data]="sampleData"
            [columns]="sampleColumns"
            [tableActions]="[]"
            title="Usuários"
            subtitle="Apenas visualização"
            [showHeaderActions]="false"
          ></os-data-grid>
        </div>
      </div>
    `,
    props: {
      sampleData,
      sampleColumns,
      sampleTableActions,
    },
  }),
  parameters: {
    docs: {
      description: {
        story: 'Grid com diferentes configurações de ações.',
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
          <os-data-grid
            [data]="sampleData"
            [columns]="sampleColumns"
            [tableActions]="sampleTableActions"
            title="Usuários"
            subtitle="Com paginação"
            [showPagination]="true"
            [pageSizeOptions]="[2, 5, 10]"
          ></os-data-grid>
        </div>

        <div>
          <h4>Sem Paginação</h4>
          <os-data-grid
            [data]="sampleData"
            [columns]="sampleColumns"
            [tableActions]="sampleTableActions"
            title="Usuários"
            subtitle="Sem paginação"
            [showPagination]="false"
          ></os-data-grid>
        </div>
      </div>
    `,
    props: {
      sampleData,
      sampleColumns,
      sampleTableActions,
    },
  }),
  parameters: {
    docs: {
      description: {
        story: 'Grid com e sem paginação.',
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
          <os-data-grid
            [data]="sampleData"
            [columns]="sampleColumns"
            [tableActions]="sampleTableActions"
            title="Usuários"
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
          </os-data-grid>
        </div>

        <div>
          <h4>Sem Rodapé</h4>
          <os-data-grid
            [data]="sampleData"
            [columns]="sampleColumns"
            [tableActions]="sampleTableActions"
            title="Usuários"
            subtitle="Sem rodapé"
            [showFooter]="false"
          ></os-data-grid>
        </div>
      </div>
    `,
    props: {
      sampleData,
      sampleColumns,
      sampleTableActions,
    },
  }),
  parameters: {
    docs: {
      description: {
        story: 'Grid com e sem rodapé.',
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
          <os-data-grid
            [data]="sampleData"
            [columns]="sampleColumns"
            [tableActions]="sampleTableActions"
            title="Usuários"
            subtitle="Carregando dados..."
            [isLoading]="true"
            [showRefreshButton]="true"
          ></os-data-grid>
        </div>

        <div>
          <h4>Dados Carregados</h4>
          <os-data-grid
            [data]="sampleData"
            [columns]="sampleColumns"
            [tableActions]="sampleTableActions"
            title="Usuários"
            subtitle="Dados carregados com sucesso"
            [isLoading]="false"
            [showRefreshButton]="true"
          ></os-data-grid>
        </div>
      </div>
    `,
    props: {
      sampleData,
      sampleColumns,
      sampleTableActions,
    },
  }),
  parameters: {
    docs: {
      description: {
        story: 'Grid em estado de carregamento e com dados carregados.',
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
          <os-data-grid
            [data]="[]"
            [columns]="sampleColumns"
            [tableActions]="sampleTableActions"
            title="Usuários"
            subtitle="Nenhum usuário encontrado"
            [showNoData]="true"
            noDataText="Nenhum usuário cadastrado no sistema"
          ></os-data-grid>
        </div>

        <div>
          <h4>Estado Vazio com Ação</h4>
          <os-data-grid
            [data]="[]"
            [columns]="sampleColumns"
            [tableActions]="sampleTableActions"
            title="Usuários"
            subtitle="Comece adicionando seu primeiro usuário"
            [showNoData]="true"
            [showAddButton]="true"
            addButtonText="Adicionar Primeiro Usuário"
            noDataText="Nenhum usuário cadastrado. Clique em 'Adicionar Primeiro Usuário' para começar."
          ></os-data-grid>
        </div>
      </div>
    `,
    props: {
      sampleColumns,
      sampleTableActions,
    },
  }),
  parameters: {
    docs: {
      description: {
        story: 'Grid em estado vazio com diferentes configurações.',
      },
    },
  },
};

export const VirtualScrolling: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 24px;">
        <div>
          <h4>Com Virtual Scrolling (Grande Dataset)</h4>
          <os-data-grid
            [data]="largeDataset"
            [columns]="sampleColumns"
            [tableActions]="sampleTableActions"
            title="Usuários"
            subtitle="Dataset grande com virtual scrolling"
            [useVirtualScrolling]="true"
            [virtualScrollThreshold]="50"
            [virtualScrollItemSize]="48"
            [virtualScrollMinBuffer]="200"
            [virtualScrollMaxBuffer]="400"
            [showPagination]="false"
          ></os-data-grid>
        </div>

        <div>
          <h4>Sem Virtual Scrolling (Dataset Pequeno)</h4>
          <os-data-grid
            [data]="sampleData"
            [columns]="sampleColumns"
            [tableActions]="sampleTableActions"
            title="Usuários"
            subtitle="Dataset pequeno sem virtual scrolling"
            [useVirtualScrolling]="false"
            [showPagination]="true"
          ></os-data-grid>
        </div>
      </div>
    `,
    props: {
      sampleData,
      sampleColumns,
      sampleTableActions,
      largeDataset: Array.from({ length: 1000 }, (_, i) => ({
        id: i + 1,
        name: `Usuário ${i + 1}`,
        email: `usuario${i + 1}@email.com`,
        status: ['Ativo', 'Inativo', 'Pendente'][i % 3],
        role: ['Admin', 'User', 'Moderator'][i % 3],
        createdAt: new Date(2024, 0, 1 + (i % 30)).toISOString().split('T')[0],
      })),
    },
  }),
  parameters: {
    docs: {
      description: {
        story:
          'Grid com virtual scrolling para grandes datasets e sem virtual scrolling para datasets pequenos.',
      },
    },
  },
};

export const Responsive: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 24px;">
        <div>
          <h4>Layout Responsivo</h4>
          <p>Redimensione a janela para ver o comportamento responsivo do grid.</p>
          <os-data-grid
            [data]="sampleData"
            [columns]="sampleColumns"
            [filterOptions]="sampleFilterOptions"
            [tableActions]="sampleTableActions"
            title="Usuários"
            subtitle="Layout adaptativo para diferentes tamanhos de tela"
            [showHeaderActions]="true"
            [showRefreshButton]="true"
            [showExportButton]="true"
            [showAddButton]="true"
            addButtonText="Adicionar Usuário"
            [showFilters]="true"
            [showPagination]="true"
            [showFooter]="true"
            [showItemCount]="true"
            [showLastUpdated]="true"
          ></os-data-grid>
        </div>
      </div>
    `,
    props: {
      sampleData,
      sampleColumns,
      sampleFilterOptions,
      sampleTableActions,
    },
  }),
  parameters: {
    docs: {
      description: {
        story:
          'Grid responsivo que se adapta a diferentes tamanhos de tela, otimizado para mobile.',
      },
    },
  },
};

export const Interactive: Story = {
  args: {
    data: sampleData,
    columns: sampleColumns,
    filterOptions: sampleFilterOptions,
    tableActions: sampleTableActions,
    title: 'Usuários',
    subtitle: 'Gerencie os usuários do sistema',
    size: 'medium',
    variant: 'default',
    showHeaderActions: true,
    showRefreshButton: true,
    showExportButton: true,
    showAddButton: true,
    addButtonText: 'Adicionar Usuário',
    showFilters: true,
    showPagination: true,
    showNoData: true,
    noDataText: 'Nenhum usuário encontrado',
    showFooter: true,
    showItemCount: true,
    showLastUpdated: true,
    showFooterActions: false,
    pageSizeOptions: [5, 10, 25, 50],
    showFirstLastButtons: true,
    isLoading: false,
    lastUpdated: new Date(),
    useVirtualScrolling: false,
    virtualScrollThreshold: 100,
    virtualScrollItemSize: 48,
    virtualScrollMinBuffer: 200,
    virtualScrollMaxBuffer: 400,
  },
  render: (args) => ({
    props: args,
    template: `
      <os-data-grid
        [data]="data"
        [columns]="columns"
        [filterOptions]="filterOptions"
        [tableActions]="tableActions"
        [title]="title"
        [subtitle]="subtitle"
        [size]="size"
        [variant]="variant"
        [showHeaderActions]="showHeaderActions"
        [showRefreshButton]="showRefreshButton"
        [showExportButton]="showExportButton"
        [showAddButton]="showAddButton"
        [addButtonText]="addButtonText"
        [showFilters]="showFilters"
        [showPagination]="showPagination"
        [showNoData]="showNoData"
        [noDataText]="noDataText"
        [showFooter]="showFooter"
        [showItemCount]="showItemCount"
        [showLastUpdated]="showLastUpdated"
        [showFooterActions]="showFooterActions"
        [pageSizeOptions]="pageSizeOptions"
        [showFirstLastButtons]="showFirstLastButtons"
        [isLoading]="isLoading"
        [lastUpdated]="lastUpdated"
        [useVirtualScrolling]="useVirtualScrolling"
        [virtualScrollThreshold]="virtualScrollThreshold"
        [virtualScrollItemSize]="virtualScrollItemSize"
        [virtualScrollMinBuffer]="virtualScrollMinBuffer"
        [virtualScrollMaxBuffer]="virtualScrollMaxBuffer"
        (rowClick)="rowClick($event)"
        (tableActionClick)="tableActionClick($event)"
        (refresh)="refresh()"
        (export)="export()"
        (add)="add()"
        (filterChange)="filterChange($event)"
        (sortChange)="sortChange($event)"
        (pageChange)="pageChange($event)"
      ></os-data-grid>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story:
          'Grid interativo com controles para testar todas as propriedades, incluindo virtual scrolling e responsividade.',
      },
    },
  },
};
