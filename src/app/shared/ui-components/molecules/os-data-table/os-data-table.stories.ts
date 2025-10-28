import type { Meta, StoryObj } from '@storybook/angular';
import {
  OsDataTableComponent,
  OsDataTableColumn,
  OsDataTableAction,
  OsDataTableRow,
} from './os-data-table.component';
import { PageEvent } from '@angular/material/paginator';

const meta: Meta<OsDataTableComponent> = {
  title: 'Design System/Molecules/Data Table',
  component: OsDataTableComponent,
  parameters: {
    docs: {
      description: {
        component: 'Tabela de dados do Design System Orca Sonhos com ordenação, paginação e ações.',
      },
    },
  },
  argTypes: {
    title: {
      control: { type: 'text' },
      description: 'Título da tabela',
    },
    data: {
      control: { type: 'object' },
      description: 'Dados da tabela',
    },
    columns: {
      control: { type: 'object' },
      description: 'Colunas da tabela',
    },
    actions: {
      control: { type: 'object' },
      description: 'Ações da tabela',
    },
    size: {
      control: { type: 'select' },
      options: ['small', 'medium', 'large'],
      description: 'Tamanho da tabela',
    },
    variant: {
      control: { type: 'select' },
      options: ['default', 'striped', 'bordered'],
      description: 'Variante visual da tabela',
    },
    showActions: {
      control: { type: 'boolean' },
      description: 'Exibir ações da tabela',
    },
    showPagination: {
      control: { type: 'boolean' },
      description: 'Exibir paginação',
    },
    pageSize: {
      control: { type: 'number' },
      description: 'Tamanho da página',
    },
    totalItems: {
      control: { type: 'number' },
      description: 'Total de itens',
    },
    rowClick: {
      action: 'rowClick',
      description: 'Evento de clique na linha',
    },
    actionClick: {
      action: 'actionClick',
      description: 'Evento de clique na ação',
    },
    sortChange: {
      action: 'sortChange',
      description: 'Evento de mudança de ordenação',
    },
    pageChange: {
      action: 'pageChange',
      description: 'Evento de mudança de página',
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<OsDataTableComponent>;

const sampleData: OsDataTableRow[] = [
  { id: 1, name: 'João Silva', email: 'joao@email.com', age: 30, status: 'Ativo' },
  { id: 2, name: 'Maria Santos', email: 'maria@email.com', age: 25, status: 'Ativo' },
  { id: 3, name: 'Pedro Costa', email: 'pedro@email.com', age: 35, status: 'Inativo' },
  { id: 4, name: 'Ana Oliveira', email: 'ana@email.com', age: 28, status: 'Ativo' },
  { id: 5, name: 'Carlos Lima', email: 'carlos@email.com', age: 42, status: 'Pendente' },
];

const sampleColumns: OsDataTableColumn[] = [
  { key: 'id', label: 'ID', sortable: true, width: '80px' },
  { key: 'name', label: 'Nome', sortable: true },
  { key: 'email', label: 'Email', sortable: true },
  { key: 'age', label: 'Idade', sortable: true, width: '100px', align: 'center' },
  { key: 'status', label: 'Status', sortable: true, width: '120px' },
];

const sampleActions: OsDataTableAction[] = [
  { key: 'edit', label: 'Editar', icon: 'fa fa-edit', color: 'primary' },
  { key: 'delete', label: 'Excluir', icon: 'fa fa-trash', color: 'warn' },
  { key: 'view', label: 'Visualizar', icon: 'fa fa-eye', color: 'secondary' },
];

export const Default: Story = {
  args: {
    title: 'Usuários',
    data: sampleData,
    columns: sampleColumns,
    actions: sampleActions,
    size: 'medium',
    variant: 'default',
    showActions: true,
    showPagination: true,
    pageSize: 5,
    totalItems: 5,
  },
  render: (args) => ({
    props: args,
    template: `
      <os-data-table
        [title]="title"
        [data]="data"
        [columns]="columns"
        [actions]="actions"
        [size]="size"
        [variant]="variant"
        [showActions]="showActions"
        [showPagination]="showPagination"
        [pageSize]="pageSize"
        [totalItems]="totalItems"
        [loading]="loading"
        [emptyMessage]="emptyMessage"
        (rowClick)="rowClick($event)"
        (actionClick)="actionClick($event)"
        (sortChange)="sortChange($event)"
        (pageChange)="pageChange($event)"
      ></os-data-table>
    `,
  }),
};

export const Variants: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 24px;">
        <div>
          <h4>Default</h4>
          <os-data-table
            [data]="data"
            [columns]="columns"
            variant="default"
          ></os-data-table>
        </div>

        <div>
          <h4>Striped</h4>
          <os-data-table
            [data]="data"
            [columns]="columns"
            variant="striped"
          ></os-data-table>
        </div>

        <div>
          <h4>Bordered</h4>
          <os-data-table
            [data]="data"
            [columns]="columns"
            variant="bordered"
          ></os-data-table>
        </div>
      </div>
    `,
    props: {
      data: sampleData,
      columns: sampleColumns,
    },
  }),
  parameters: {
    docs: {
      description: {
        story: 'Todas as variantes disponíveis da tabela de dados.',
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
          <os-data-table
            [data]="data"
            [columns]="columns"
            size="small"
          ></os-data-table>
        </div>

        <div>
          <h4>Medium</h4>
          <os-data-table
            [data]="data"
            [columns]="columns"
            size="medium"
          ></os-data-table>
        </div>

        <div>
          <h4>Large</h4>
          <os-data-table
            [data]="data"
            [columns]="columns"
            size="large"
          ></os-data-table>
        </div>
      </div>
    `,
    props: {
      data: sampleData,
      columns: sampleColumns,
    },
  }),
  parameters: {
    docs: {
      description: {
        story: 'Todos os tamanhos disponíveis da tabela de dados.',
      },
    },
  },
};

export const WithActions: Story = {
  render: () => ({
    template: `
      <os-data-table
        title="Usuários com Ações"
        [data]="data"
        [columns]="columns"
        [actions]="actions"
        [showActions]="true"
        (actionClick)="onActionClick($event)"
      ></os-data-table>
    `,
    props: {
      data: sampleData,
      columns: sampleColumns,
      actions: sampleActions,
    },
    methods: {
      onActionClick: (event: { action: OsDataTableAction; row: OsDataTableRow }) => {
        console.log('Ação clicada:', event.action.key, 'na linha:', event.row);
      },
    },
  }),
  parameters: {
    docs: {
      description: {
        story: 'Tabela com ações em cada linha.',
      },
    },
  },
};

export const WithPagination: Story = {
  render: () => ({
    template: `
      <os-data-table
        title="Usuários com Paginação"
        [data]="data"
        [columns]="columns"
        [showPagination]="true"
        [pageSize]="2"
        [totalItems]="5"
        (pageChange)="onPageChange($event)"
      ></os-data-table>
    `,
    props: {
      data: sampleData.slice(0, 2), 
      columns: sampleColumns,
    },
    methods: {
      onPageChange: (event: PageEvent) => {
        console.log('Página alterada:', event);
      },
    },
  }),
  parameters: {
    docs: {
      description: {
        story: 'Tabela com paginação.',
      },
    },
  },
};

export const Loading: Story = {
  render: () => ({
    template: `
      <os-data-table
        title="Carregando Dados"
        [data]="[]"
        [columns]="columns"
        [loading]="true"
      ></os-data-table>
    `,
    props: {
      columns: sampleColumns,
    },
  }),
  parameters: {
    docs: {
      description: {
        story: 'Tabela em estado de carregamento.',
      },
    },
  },
};

export const Empty: Story = {
  render: () => ({
    template: `
      <os-data-table
        title="Lista Vazia"
        [data]="[]"
        [columns]="columns"
        emptyMessage="Nenhum usuário encontrado"
      ></os-data-table>
    `,
    props: {
      columns: sampleColumns,
    },
  }),
  parameters: {
    docs: {
      description: {
        story: 'Tabela vazia com mensagem personalizada.',
      },
    },
  },
};

export const Financial: Story = {
  render: () => ({
    template: `
      <os-data-table
        title="Transações Financeiras"
        [data]="financialData"
        [columns]="financialColumns"
        [actions]="financialActions"
        [showActions]="true"
        variant="striped"
      ></os-data-table>
    `,
    props: {
      financialData: [
        { id: 1, description: 'Salário', amount: 5000.0, date: '2024-01-01', category: 'Receita' },
        { id: 2, description: 'Aluguel', amount: -1200.0, date: '2024-01-05', category: 'Despesa' },
        {
          id: 3,
          description: 'Supermercado',
          amount: -350.5,
          date: '2024-01-10',
          category: 'Despesa',
        },
        { id: 4, description: 'Freelance', amount: 800.0, date: '2024-01-15', category: 'Receita' },
        { id: 5, description: 'Energia', amount: -150.75, date: '2024-01-20', category: 'Despesa' },
      ],
      financialColumns: [
        { key: 'id', label: 'ID', sortable: true, width: '80px' },
        { key: 'description', label: 'Descrição', sortable: true },
        { key: 'amount', label: 'Valor', sortable: true, width: '120px', align: 'right' },
        { key: 'date', label: 'Data', sortable: true, width: '120px' },
        { key: 'category', label: 'Categoria', sortable: true, width: '120px' },
      ],
      financialActions: [
        { key: 'edit', label: 'Editar', icon: 'fa fa-edit', color: 'primary' },
        { key: 'delete', label: 'Excluir', icon: 'fa fa-trash', color: 'warn' },
      ],
    },
  }),
  parameters: {
    docs: {
      description: {
        story: 'Exemplo de tabela para dados financeiros.',
      },
    },
  },
};

export const Interactive: Story = {
  args: {
    title: 'Tabela Interativa',
    data: sampleData,
    columns: sampleColumns,
    actions: sampleActions,
    size: 'medium',
    variant: 'default',
    showActions: true,
    showPagination: true,
    pageSize: 5,
    totalItems: 5,
  },
  render: (args) => ({
    props: args,
    template: `
      <os-data-table
        [title]="title"
        [data]="data"
        [columns]="columns"
        [actions]="actions"
        [size]="size"
        [variant]="variant"
        [showActions]="showActions"
        [showPagination]="showPagination"
        [pageSize]="pageSize"
        [totalItems]="totalItems"
        [loading]="loading"
        [emptyMessage]="emptyMessage"
        (rowClick)="rowClick($event)"
        (actionClick)="actionClick($event)"
        (sortChange)="sortChange($event)"
        (pageChange)="pageChange($event)"
      ></os-data-table>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Tabela interativa com controles para testar todas as propriedades.',
      },
    },
  },
};
