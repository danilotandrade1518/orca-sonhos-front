import type { Meta, StoryObj } from '@storybook/angular';
import { OsListTemplateComponent } from './os-list-template.component';

const meta: Meta<OsListTemplateComponent> = {
  title: 'Design System/Templates/List Template',
  component: OsListTemplateComponent,
  parameters: {
    docs: {
      description: {
        component: 'Template de lista do Design System Orca Sonhos com filtros, paginação e ações.',
      },
    },
  },
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['default', 'compact', 'detailed'],
      description: 'Variante do template',
    },
    size: {
      control: { type: 'select' },
      options: ['small', 'medium', 'large'],
      description: 'Tamanho do template',
    },
    theme: {
      control: { type: 'select' },
      options: ['light', 'dark'],
      description: 'Tema do template',
    },
    title: {
      control: { type: 'text' },
      description: 'Título da lista',
    },
    subtitle: {
      control: { type: 'text' },
      description: 'Subtítulo da lista',
    },
    breadcrumbs: {
      control: { type: 'object' },
      description: 'Breadcrumbs de navegação',
    },
    showBackButton: {
      control: { type: 'boolean' },
      description: 'Mostrar botão de voltar',
    },
    backUrl: {
      control: { type: 'text' },
      description: 'URL para voltar',
    },
    data: {
      control: { type: 'object' },
      description: 'Dados da lista',
    },
    columns: {
      control: { type: 'object' },
      description: 'Colunas da tabela',
    },
    filters: {
      control: { type: 'object' },
      description: 'Filtros disponíveis',
    },
    sort: {
      control: { type: 'object' },
      description: 'Ordenação atual',
    },
    page: {
      control: { type: 'number' },
      description: 'Página atual',
    },
    pageSize: {
      control: { type: 'number' },
      description: 'Tamanho da página',
    },
    totalItems: {
      control: { type: 'number' },
      description: 'Total de itens',
    },
    loading: {
      control: { type: 'boolean' },
      description: 'Estado de carregamento',
    },
    disabled: {
      control: { type: 'boolean' },
      description: 'Estado desabilitado',
    },
    loadingText: {
      control: { type: 'text' },
      description: 'Texto de carregamento',
    },
    emptyTitle: {
      control: { type: 'text' },
      description: 'Título do estado vazio',
    },
    emptyDescription: {
      control: { type: 'text' },
      description: 'Descrição do estado vazio',
    },
    emptyIcon: {
      control: { type: 'text' },
      description: 'Ícone do estado vazio',
    },
    emptyAction: {
      control: { type: 'object' },
      description: 'Ação do estado vazio',
    },
    showFilters: {
      control: { type: 'boolean' },
      description: 'Mostrar filtros',
    },
    showFooter: {
      control: { type: 'boolean' },
      description: 'Mostrar footer',
    },
    showGridHeader: {
      control: { type: 'boolean' },
      description: 'Mostrar header da grid',
    },
    showGridFooter: {
      control: { type: 'boolean' },
      description: 'Mostrar footer da grid',
    },
    showLastUpdate: {
      control: { type: 'boolean' },
      description: 'Mostrar última atualização',
    },
    headerActions: {
      control: { type: 'object' },
      description: 'Ações do header',
    },
    gridActions: {
      control: { type: 'object' },
      description: 'Ações da grid',
    },
    footerActions: {
      control: { type: 'object' },
      description: 'Ações do footer',
    },
    footerText: {
      control: { type: 'text' },
      description: 'Texto do footer',
    },
    lastUpdate: {
      control: { type: 'date' },
      description: 'Data da última atualização',
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<OsListTemplateComponent>;

const sampleData = [
  {
    id: '1',
    title: 'João Silva',
    subtitle: 'Desenvolvedor Senior',
    status: 'Ativo',
    date: new Date('2024-01-15'),
    amount: 5000,
    category: 'Tecnologia',
    tags: ['Frontend', 'Angular'],
  },
  {
    id: '2',
    title: 'Maria Santos',
    subtitle: 'Designer UX/UI',
    status: 'Ativo',
    date: new Date('2024-01-10'),
    amount: 4500,
    category: 'Design',
    tags: ['UX', 'UI', 'Figma'],
  },
  {
    id: '3',
    title: 'Pedro Costa',
    subtitle: 'Gerente de Projetos',
    status: 'Inativo',
    date: new Date('2024-01-05'),
    amount: 6000,
    category: 'Gestão',
    tags: ['Agile', 'Scrum'],
  },
  {
    id: '4',
    title: 'Ana Oliveira',
    subtitle: 'Analista de Dados',
    status: 'Ativo',
    date: new Date('2024-01-20'),
    amount: 4200,
    category: 'Dados',
    tags: ['Python', 'SQL', 'Machine Learning'],
  },
  {
    id: '5',
    title: 'Carlos Ferreira',
    subtitle: 'DevOps Engineer',
    status: 'Ativo',
    date: new Date('2024-01-18'),
    amount: 5500,
    category: 'Infraestrutura',
    tags: ['AWS', 'Docker', 'Kubernetes'],
  },
];

const sampleColumns = [
  { key: 'title', label: 'Nome', sortable: true },
  { key: 'subtitle', label: 'Cargo', sortable: true },
  { key: 'status', label: 'Status', sortable: true },
  { key: 'date', label: 'Data', sortable: true },
  { key: 'amount', label: 'Salário', sortable: true },
  { key: 'category', label: 'Categoria', sortable: true },
];

const sampleFilters = [
  { field: 'status', operator: 'equals' as const, value: 'Ativo' },
  { field: 'category', operator: 'contains' as const, value: 'Tecnologia' },
  { field: 'amount', operator: 'greaterThan' as const, value: 4000 },
];

const sampleBreadcrumbs = [
  { label: 'Dashboard', url: '/dashboard' },
  { label: 'Usuários', url: '/users' },
  { label: 'Lista', url: '/users/list' },
];

const sampleHeaderActions = [
  { label: 'Adicionar', icon: 'add', variant: 'primary' as const, size: 'medium' as const },
  { label: 'Importar', icon: 'upload', variant: 'secondary' as const, size: 'medium' as const },
  { label: 'Exportar', icon: 'download', variant: 'tertiary' as const, size: 'medium' as const },
];

const sampleGridActions = [
  { key: 'edit', label: 'Editar', icon: 'edit', color: 'primary' as const },
  { key: 'delete', label: 'Excluir', icon: 'delete', color: 'warn' as const },
  { key: 'view', label: 'Visualizar', icon: 'visibility', color: 'secondary' as const },
];

const sampleFooterActions = [
  { id: 'refresh', label: 'Atualizar', icon: 'refresh', variant: 'tertiary' as const },
  { id: 'settings', label: 'Configurações', icon: 'settings', variant: 'tertiary' as const },
];

export const Default: Story = {
  args: {
    variant: 'default',
    size: 'medium',
    theme: 'light',
    title: 'Lista de Usuários',
    subtitle: 'Gerencie todos os usuários do sistema',
    breadcrumbs: sampleBreadcrumbs,
    showBackButton: false,
    backUrl: '',
    data: sampleData,
    columns: sampleColumns,
    filters: sampleFilters,
    sort: { field: 'title', direction: 'asc' as const },
    page: 1,
    pageSize: 10,
    totalItems: 5,
    loading: false,
    disabled: false,
    loadingText: 'Carregando...',
    emptyTitle: 'Nenhum usuário encontrado',
    emptyDescription: 'Não há usuários para exibir no momento.',
    emptyIcon: 'person',
    emptyAction: null,
    showFilters: true,
    showFooter: true,
    showGridHeader: true,
    showGridFooter: true,
    showLastUpdate: true,
    headerActions: sampleHeaderActions,
    gridActions: sampleGridActions,
    footerActions: sampleFooterActions,
    footerText: 'Total de 5 usuários',
    lastUpdate: new Date(),
  },
  render: (args) => ({
    props: args,
    template: `
      <os-list-template
        [variant]="variant"
        [size]="size"
        [theme]="theme"
        [title]="title"
        [subtitle]="subtitle"
        [breadcrumbs]="breadcrumbs"
        [showBackButton]="showBackButton"
        [backUrl]="backUrl"
        [data]="data"
        [columns]="columns"
        [filters]="filters"
        [sort]="sort"
        [page]="page"
        [pageSize]="pageSize"
        [totalItems]="totalItems"
        [loading]="loading"
        [disabled]="disabled"
        [loadingText]="loadingText"
        [emptyTitle]="emptyTitle"
        [emptyDescription]="emptyDescription"
        [emptyIcon]="emptyIcon"
        [emptyAction]="emptyAction"
        [showFilters]="showFilters"
        [showFooter]="showFooter"
        [showGridHeader]="showGridHeader"
        [showGridFooter]="showGridFooter"
        [showLastUpdate]="showLastUpdate"
        [headerActions]="headerActions"
        [gridActions]="gridActions"
        [footerActions]="footerActions"
        [footerText]="footerText"
        [lastUpdate]="lastUpdate"
        (rowClick)="rowClick($event)"
        (headerActionClick)="headerActionClick($event)"
        (gridActionClick)="gridActionClick($event)"
        (footerActionClick)="footerActionClick($event)"
        (filterChange)="filterChange($event)"
        (sortChange)="sortChange($event)"
        (pageChange)="pageChange($event)"
        (refresh)="refresh()"
        (export)="export()"
        (add)="add()"
        (backClick)="backClick($event)"
        (emptyActionClick)="emptyActionClick($event)"
      ></os-list-template>
    `,
  }),
};

export const Variants: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 24px;">
        <div>
          <h4>Default</h4>
          <os-list-template
            [title]="'Lista Default'"
            [data]="sampleData"
            [columns]="sampleColumns"
            variant="default"
          ></os-list-template>
        </div>

        <div>
          <h4>Compact</h4>
          <os-list-template
            [title]="'Lista Compact'"
            [data]="sampleData"
            [columns]="sampleColumns"
            variant="compact"
          ></os-list-template>
        </div>

        <div>
          <h4>Detailed</h4>
          <os-list-template
            [title]="'Lista Detailed'"
            [data]="sampleData"
            [columns]="sampleColumns"
            variant="detailed"
          ></os-list-template>
        </div>
      </div>
    `,
    props: {
      sampleData,
      sampleColumns,
    },
  }),
  parameters: {
    docs: {
      description: {
        story: 'Todas as variantes disponíveis do template de lista.',
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
          <os-list-template
            [title]="'Lista Small'"
            [data]="sampleData"
            [columns]="sampleColumns"
            size="small"
          ></os-list-template>
        </div>

        <div>
          <h4>Medium</h4>
          <os-list-template
            [title]="'Lista Medium'"
            [data]="sampleData"
            [columns]="sampleColumns"
            size="medium"
          ></os-list-template>
        </div>

        <div>
          <h4>Large</h4>
          <os-list-template
            [title]="'Lista Large'"
            [data]="sampleData"
            [columns]="sampleColumns"
            size="large"
          ></os-list-template>
        </div>
      </div>
    `,
    props: {
      sampleData,
      sampleColumns,
    },
  }),
  parameters: {
    docs: {
      description: {
        story: 'Todos os tamanhos disponíveis do template de lista.',
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
          <os-list-template
            [title]="'Lista Light'"
            [data]="sampleData"
            [columns]="sampleColumns"
            theme="light"
          ></os-list-template>
        </div>

        <div>
          <h4>Dark Theme</h4>
          <os-list-template
            [title]="'Lista Dark'"
            [data]="sampleData"
            [columns]="sampleColumns"
            theme="dark"
          ></os-list-template>
        </div>
      </div>
    `,
    props: {
      sampleData,
      sampleColumns,
    },
  }),
  parameters: {
    docs: {
      description: {
        story: 'Temas claro e escuro do template de lista.',
      },
    },
  },
};

export const WithBreadcrumbs: Story = {
  render: () => ({
    template: `
      <os-list-template
        [title]="'Lista com Breadcrumbs'"
        [subtitle]="'Navegação hierárquica'"
        [breadcrumbs]="breadcrumbs"
        [data]="sampleData"
        [columns]="sampleColumns"
        [showBackButton]="true"
        [backUrl]="'/dashboard'"
      ></os-list-template>
    `,
    props: {
      sampleData,
      sampleColumns,
      breadcrumbs: sampleBreadcrumbs,
    },
  }),
  parameters: {
    docs: {
      description: {
        story: 'Template de lista com breadcrumbs de navegação.',
      },
    },
  },
};

export const WithFilters: Story = {
  render: () => ({
    template: `
      <os-list-template
        [title]="'Lista com Filtros'"
        [subtitle]="'Filtros avançados disponíveis'"
        [data]="sampleData"
        [columns]="sampleColumns"
        [filters]="filters"
        [showFilters]="true"
      ></os-list-template>
    `,
    props: {
      sampleData,
      sampleColumns,
      filters: sampleFilters,
    },
  }),
  parameters: {
    docs: {
      description: {
        story: 'Template de lista com filtros avançados.',
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
          <os-list-template
            [title]="'Carregando...'"
            [data]="[]"
            [columns]="sampleColumns"
            [loading]="true"
            [loadingText]="'Carregando dados...'"
          ></os-list-template>
        </div>

        <div>
          <h4>Carregado</h4>
          <os-list-template
            [title]="'Carregado'"
            [data]="sampleData"
            [columns]="sampleColumns"
            [loading]="false"
          ></os-list-template>
        </div>
      </div>
    `,
    props: {
      sampleData,
      sampleColumns,
    },
  }),
  parameters: {
    docs: {
      description: {
        story: 'Estados de carregamento do template de lista.',
      },
    },
  },
};

export const EmptyState: Story = {
  render: () => ({
    template: `
      <os-list-template
        [title]="'Lista Vazia'"
        [subtitle]="'Nenhum item encontrado'"
        [data]="[]"
        [columns]="sampleColumns"
        [loading]="false"
        [emptyTitle]="'Nenhum usuário encontrado'"
        [emptyDescription]="'Não há usuários cadastrados no sistema.'"
        [emptyIcon]="'person_off'"
        [emptyAction]="{
          id: 'add-user',
          label: 'Adicionar Primeiro Usuário',
          icon: 'person_add',
          variant: 'primary',
          size: 'medium'
        }"
      ></os-list-template>
    `,
    props: {
      sampleColumns,
    },
  }),
  parameters: {
    docs: {
      description: {
        story: 'Estado vazio da lista com ação para adicionar item.',
      },
    },
  },
};

export const WithActions: Story = {
  render: () => ({
    template: `
      <os-list-template
        [title]="'Lista com Ações'"
        [subtitle]="'Múltiplas ações disponíveis'"
        [data]="sampleData"
        [columns]="sampleColumns"
        [headerActions]="headerActions"
        [gridActions]="gridActions"
        [footerActions]="footerActions"
        [showFooter]="true"
        [footerText]="'Total de 5 usuários'"
        [lastUpdate]="new Date()"
      ></os-list-template>
    `,
    props: {
      sampleData,
      sampleColumns,
      headerActions: sampleHeaderActions,
      gridActions: sampleGridActions,
      footerActions: sampleFooterActions,
    },
  }),
  parameters: {
    docs: {
      description: {
        story: 'Template de lista com ações no header, grid e footer.',
      },
    },
  },
};

export const WithoutFilters: Story = {
  render: () => ({
    template: `
      <os-list-template
        [title]="'Lista sem Filtros'"
        [subtitle]="'Lista simplificada'"
        [data]="sampleData"
        [columns]="sampleColumns"
        [showFilters]="false"
      ></os-list-template>
    `,
    props: {
      sampleData,
      sampleColumns,
    },
  }),
  parameters: {
    docs: {
      description: {
        story: 'Template de lista sem filtros para uma interface mais limpa.',
      },
    },
  },
};

export const WithoutFooter: Story = {
  render: () => ({
    template: `
      <os-list-template
        [title]="'Lista sem Footer'"
        [subtitle]="'Interface minimalista'"
        [data]="sampleData"
        [columns]="sampleColumns"
        [showFooter]="false"
      ></os-list-template>
    `,
    props: {
      sampleData,
      sampleColumns,
    },
  }),
  parameters: {
    docs: {
      description: {
        story: 'Template de lista sem footer para economizar espaço.',
      },
    },
  },
};

export const Interactive: Story = {
  args: {
    variant: 'default',
    size: 'medium',
    theme: 'light',
    title: 'Lista de Usuários',
    subtitle: 'Gerencie todos os usuários do sistema',
    breadcrumbs: sampleBreadcrumbs,
    showBackButton: false,
    backUrl: '',
    data: sampleData,
    columns: sampleColumns,
    filters: sampleFilters,
    sort: { field: 'title', direction: 'asc' as const },
    page: 1,
    pageSize: 10,
    totalItems: 5,
    loading: false,
    disabled: false,
    loadingText: 'Carregando...',
    emptyTitle: 'Nenhum usuário encontrado',
    emptyDescription: 'Não há usuários para exibir no momento.',
    emptyIcon: 'person',
    emptyAction: null,
    showFilters: true,
    showFooter: true,
    showGridHeader: true,
    showGridFooter: true,
    showLastUpdate: true,
    headerActions: sampleHeaderActions,
    gridActions: sampleGridActions,
    footerActions: sampleFooterActions,
    footerText: 'Total de 5 usuários',
    lastUpdate: new Date(),
  },
  render: (args) => ({
    props: args,
    template: `
      <os-list-template
        [variant]="variant"
        [size]="size"
        [theme]="theme"
        [title]="title"
        [subtitle]="subtitle"
        [breadcrumbs]="breadcrumbs"
        [showBackButton]="showBackButton"
        [backUrl]="backUrl"
        [data]="data"
        [columns]="columns"
        [filters]="filters"
        [sort]="sort"
        [page]="page"
        [pageSize]="pageSize"
        [totalItems]="totalItems"
        [loading]="loading"
        [disabled]="disabled"
        [loadingText]="loadingText"
        [emptyTitle]="emptyTitle"
        [emptyDescription]="emptyDescription"
        [emptyIcon]="emptyIcon"
        [emptyAction]="emptyAction"
        [showFilters]="showFilters"
        [showFooter]="showFooter"
        [showGridHeader]="showGridHeader"
        [showGridFooter]="showGridFooter"
        [showLastUpdate]="showLastUpdate"
        [headerActions]="headerActions"
        [gridActions]="gridActions"
        [footerActions]="footerActions"
        [footerText]="footerText"
        [lastUpdate]="lastUpdate"
        (rowClick)="rowClick($event)"
        (headerActionClick)="headerActionClick($event)"
        (gridActionClick)="gridActionClick($event)"
        (footerActionClick)="footerActionClick($event)"
        (filterChange)="filterChange($event)"
        (sortChange)="sortChange($event)"
        (pageChange)="pageChange($event)"
        (refresh)="refresh()"
        (export)="export()"
        (add)="add()"
        (backClick)="backClick($event)"
        (emptyActionClick)="emptyActionClick($event)"
      ></os-list-template>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Template de lista interativo com controles para testar todas as propriedades.',
      },
    },
  },
};

export const WithInfiniteScroll: Story = {
  args: {
    ...Default.args,
    infiniteScroll: {
      enabled: true,
      threshold: 0.8,
      loadMoreText: 'Carregar mais itens',
      loadingText: 'Carregando mais itens...',
      noMoreText: 'Todos os itens foram carregados',
    },
    title: 'Lista com Infinite Scroll',
    subtitle: 'Scroll infinito para carregar mais dados automaticamente',
  },
  render: (args) => ({
    props: args,
    template: `
      <os-list-template
        [variant]="variant"
        [size]="size"
        [theme]="theme"
        [title]="title"
        [subtitle]="subtitle"
        [data]="data"
        [columns]="columns"
        [infiniteScroll]="infiniteScroll"
        [showFilters]="true"
        [showFooter]="true"
        (loadMore)="onLoadMore()"
      />
    `,
    methods: {
      onLoadMore: () => {
        console.log('Loading more items...');
      },
    },
  }),
};

export const WithMobileFilters: Story = {
  args: {
    ...Default.args,
    mobileFilters: {
      enabled: true,
      overlay: true,
      position: 'left',
      width: '300px',
    },
    title: 'Lista com Filtros Mobile',
    subtitle: 'Filtros otimizados para dispositivos móveis',
  },
  render: (args) => ({
    props: args,
    template: `
      <os-list-template
        [variant]="variant"
        [size]="size"
        [theme]="theme"
        [title]="title"
        [subtitle]="subtitle"
        [data]="data"
        [columns]="columns"
        [mobileFilters]="mobileFilters"
        [showFilters]="true"
        [showFooter]="true"
        (mobileFiltersToggle)="onMobileFiltersToggle($event)"
      />
    `,
    methods: {
      onMobileFiltersToggle: (isOpen: boolean) => {
        console.log('Mobile filters toggled:', isOpen);
      },
    },
  }),
};

export const EnhancedEmptyState: Story = {
  args: {
    ...Default.args,
    data: [],
    emptyTitle: 'Nenhuma transação encontrada',
    emptyDescription:
      'Você ainda não possui transações registradas. Comece adicionando sua primeira transação para acompanhar seus gastos.',
    emptyAction: {
      id: 'add-transaction',
      label: 'Adicionar Transação',
      icon: 'add',
      variant: 'primary',
      size: 'medium',
    },
    title: 'Estado Vazio Aprimorado',
    subtitle: 'Empty state com ação e descrição detalhada',
  },
  render: (args) => ({
    props: args,
    template: `
      <os-list-template
        [variant]="variant"
        [size]="size"
        [theme]="theme"
        [title]="title"
        [subtitle]="subtitle"
        [data]="data"
        [columns]="columns"
        [emptyTitle]="emptyTitle"
        [emptyDescription]="emptyDescription"
        [emptyAction]="emptyAction"
        [showFilters]="false"
        [showFooter]="false"
        (emptyActionClick)="onEmptyActionClick($event)"
      />
    `,
    methods: {
      onEmptyActionClick: (event: MouseEvent) => {
        console.log('Empty action clicked:', event);
      },
    },
  }),
};

export const AccessibilityDemo: Story = {
  args: {
    ...Default.args,
    title: 'Demonstração de Acessibilidade',
    subtitle: 'Template com foco em acessibilidade WCAG 2.1 AA',
  },
  render: (args) => ({
    props: args,
    template: `
      <div style="padding: 1rem;">
        <h2>Funcionalidades de Acessibilidade</h2>
        <ul>
          <li><strong>ARIA Labels:</strong> Todos os elementos têm labels apropriados</li>
          <li><strong>Keyboard Navigation:</strong> Navegação completa por teclado</li>
          <li><strong>Screen Reader:</strong> Suporte completo a leitores de tela</li>
          <li><strong>Focus Management:</strong> Gerenciamento de foco adequado</li>
          <li><strong>High Contrast:</strong> Suporte a modo de alto contraste</li>
          <li><strong>Reduced Motion:</strong> Respeita preferências de movimento</li>
        </ul>

        <os-list-template
          [variant]="variant"
          [size]="size"
          [theme]="theme"
          [title]="title"
          [subtitle]="subtitle"
          [data]="data"
          [columns]="columns"
          [showFilters]="true"
          [showFooter]="true"
        />
      </div>
    `,
  }),
};
