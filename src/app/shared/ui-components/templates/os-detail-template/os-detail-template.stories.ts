import type { Meta, StoryObj } from '@storybook/angular';
import { OsDetailTemplateComponent } from './os-detail-template.component';

const meta: Meta<OsDetailTemplateComponent> = {
  title: 'Design System/Templates/Detail Template',
  component: OsDetailTemplateComponent,
  parameters: {
    docs: {
      description: {
        component:
          'Template de detalhes do Design System Orca Sonhos para exibir informações organizadas em seções.',
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
    disabled: {
      control: { type: 'boolean' },
      description: 'Estado desabilitado',
    },
    loading: {
      control: { type: 'boolean' },
      description: 'Estado de carregamento',
    },
    title: {
      control: { type: 'text' },
      description: 'Título da página',
    },
    subtitle: {
      control: { type: 'text' },
      description: 'Subtítulo da página',
    },
    showHeader: {
      control: { type: 'boolean' },
      description: 'Mostrar header',
    },
    showBreadcrumb: {
      control: { type: 'boolean' },
      description: 'Mostrar breadcrumb',
    },
    breadcrumbItems: {
      control: { type: 'object' },
      description: 'Itens do breadcrumb',
    },
    headerActions: {
      control: { type: 'object' },
      description: 'Ações do header',
    },
    sections: {
      control: { type: 'object' },
      description: 'Seções de detalhes',
    },
    actions: {
      control: { type: 'object' },
      description: 'Ações do template',
    },
    tabs: {
      control: { type: 'object' },
      description: 'Abas de navegação',
    },
    activeTabId: {
      control: { type: 'text' },
      description: 'ID da aba ativa',
    },
    showSidebar: {
      control: { type: 'boolean' },
      description: 'Mostrar sidebar',
    },
    sidebarAriaLabel: {
      control: { type: 'text' },
      description: 'Label ARIA da sidebar',
    },
    breadcrumbs: {
      control: { type: 'object' },
      description: 'Breadcrumbs de navegação',
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<OsDetailTemplateComponent>;

const sampleSections = [
  {
    title: 'Informações Básicas',
    fields: [
      { label: 'Nome', value: 'João Silva', type: 'text' as const, variant: 'default' as const },
      {
        label: 'Email',
        value: 'joao@example.com',
        type: 'text' as const,
        variant: 'default' as const,
      },
      {
        label: 'Telefone',
        value: '(11) 99999-9999',
        type: 'text' as const,
        variant: 'default' as const,
      },
      {
        label: 'Data de Nascimento',
        value: new Date('1990-05-15'),
        type: 'date' as const,
        variant: 'default' as const,
      },
    ],
    collapsible: false,
    expanded: true,
  },
  {
    title: 'Informações Financeiras',
    fields: [
      { label: 'Salário', value: 5000, type: 'currency' as const, variant: 'highlight' as const },
      {
        label: 'Despesas Mensais',
        value: 3500,
        type: 'currency' as const,
        variant: 'default' as const,
      },
      {
        label: 'Economia Mensal',
        value: 1500,
        type: 'currency' as const,
        variant: 'highlight' as const,
      },
      {
        label: 'Percentual de Economia',
        value: 30,
        type: 'percentage' as const,
        variant: 'highlight' as const,
      },
    ],
    collapsible: true,
    expanded: true,
  },
  {
    title: 'Metas e Objetivos',
    fields: [
      {
        label: 'Meta de Viagem',
        value: 15000,
        type: 'currency' as const,
        variant: 'default' as const,
      },
      {
        label: 'Progresso da Meta',
        value: 8500,
        type: 'currency' as const,
        variant: 'highlight' as const,
      },
      {
        label: 'Percentual Concluído',
        value: 56.67,
        type: 'percentage' as const,
        variant: 'highlight' as const,
      },
      {
        label: 'Data Limite',
        value: new Date('2024-12-31'),
        type: 'date' as const,
        variant: 'default' as const,
      },
    ],
    collapsible: true,
    expanded: false,
  },
];

const sampleHeaderActions = [
  { id: 'edit', label: 'Editar', variant: 'primary' as const, icon: 'edit' },
  { id: 'delete', label: 'Excluir', variant: 'danger' as const, icon: 'trash' },
];

const sampleActions = [
  { id: 'save', label: 'Salvar', variant: 'primary' as const, icon: 'save' },
  { id: 'cancel', label: 'Cancelar', variant: 'secondary' as const, icon: 'close' },
  { id: 'export', label: 'Exportar', variant: 'tertiary' as const, icon: 'download' },
];

const sampleBreadcrumbItems = [
  { label: 'Dashboard', route: '/dashboard' },
  { label: 'Usuários', route: '/users' },
  { label: 'João Silva', route: '/users/123' },
];

const sampleTabs = [
  { id: 'overview', label: 'Visão Geral', icon: 'home' },
  { id: 'details', label: 'Detalhes', icon: 'info' },
  { id: 'history', label: 'Histórico', icon: 'history' },
  { id: 'settings', label: 'Configurações', icon: 'settings', disabled: false },
];

export const Default: Story = {
  args: {
    variant: 'default',
    size: 'medium',
    theme: 'light',
    disabled: false,
    loading: false,
    title: 'Detalhes do Usuário',
    subtitle: 'Informações completas do perfil',
    showHeader: true,
    showBreadcrumb: false,
    breadcrumbs: [],
    headerActions: sampleHeaderActions,
    sections: sampleSections,
    actions: sampleActions,
    tabs: [],
    activeTabId: null,
    showSidebar: false,
    sidebarAriaLabel: 'Sidebar de informações adicionais',
  },
  render: (args) => ({
    props: args,
    template: `
      <os-detail-template
        [variant]="variant"
        [size]="size"
        [theme]="theme"
        [disabled]="disabled"
        [loading]="loading"
        [title]="title"
        [subtitle]="subtitle"
        [showHeader]="showHeader"
        [showBreadcrumb]="showBreadcrumb"
        [breadcrumbItems]="breadcrumbItems"
        [headerActions]="headerActions"
        [sections]="sections"
        [actions]="actions"
        (headerActionClicked)="headerActionClicked($event)"
        (actionClicked)="actionClicked($event)"
        (sectionToggled)="sectionToggled($event)"
      ></os-detail-template>
    `,
  }),
};

export const Variants: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 24px;">
        <div>
          <h4>Default</h4>
          <os-detail-template
            [title]="'Template Default'"
            [sections]="sampleSections"
            variant="default"
          ></os-detail-template>
        </div>

        <div>
          <h4>Compact</h4>
          <os-detail-template
            [title]="'Template Compact'"
            [sections]="sampleSections"
            variant="compact"
          ></os-detail-template>
        </div>

        <div>
          <h4>Detailed</h4>
          <os-detail-template
            [title]="'Template Detailed'"
            [sections]="sampleSections"
            variant="detailed"
          ></os-detail-template>
        </div>
      </div>
    `,
    props: {
      sampleSections,
    },
  }),
  parameters: {
    docs: {
      description: {
        story: 'Todas as variantes disponíveis do template de detalhes.',
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
          <os-detail-template
            [title]="'Template Small'"
            [sections]="sampleSections"
            size="small"
          ></os-detail-template>
        </div>

        <div>
          <h4>Medium</h4>
          <os-detail-template
            [title]="'Template Medium'"
            [sections]="sampleSections"
            size="medium"
          ></os-detail-template>
        </div>

        <div>
          <h4>Large</h4>
          <os-detail-template
            [title]="'Template Large'"
            [sections]="sampleSections"
            size="large"
          ></os-detail-template>
        </div>
      </div>
    `,
    props: {
      sampleSections,
    },
  }),
  parameters: {
    docs: {
      description: {
        story: 'Todos os tamanhos disponíveis do template de detalhes.',
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
          <os-detail-template
            [title]="'Template Light'"
            [sections]="sampleSections"
            theme="light"
          ></os-detail-template>
        </div>

        <div>
          <h4>Dark Theme</h4>
          <os-detail-template
            [title]="'Template Dark'"
            [sections]="sampleSections"
            theme="dark"
          ></os-detail-template>
        </div>
      </div>
    `,
    props: {
      sampleSections,
    },
  }),
  parameters: {
    docs: {
      description: {
        story: 'Temas claro e escuro do template de detalhes.',
      },
    },
  },
};

export const WithBreadcrumb: Story = {
  render: () => ({
    template: `
      <os-detail-template
        [title]="'Usuário: João Silva'"
        [subtitle]="'Perfil completo do usuário'"
        [showBreadcrumb]="true"
        [breadcrumbs]="breadcrumbItems"
        [sections]="sampleSections"
        [headerActions]="sampleHeaderActions"
      ></os-detail-template>
    `,
    props: {
      sampleSections,
      sampleHeaderActions,
      breadcrumbItems: sampleBreadcrumbItems,
    },
  }),
  parameters: {
    docs: {
      description: {
        story: 'Template de detalhes com breadcrumb de navegação.',
      },
    },
  },
};

export const WithTabs: Story = {
  render: () => ({
    template: `
      <os-detail-template
        [title]="'Usuário: João Silva'"
        [subtitle]="'Perfil completo do usuário'"
        [tabs]="sampleTabs"
        [activeTabId]="'overview'"
        [sections]="sampleSections"
        [headerActions]="sampleHeaderActions"
      ></os-detail-template>
    `,
    props: {
      sampleSections,
      sampleHeaderActions,
      sampleTabs,
    },
  }),
  parameters: {
    docs: {
      description: {
        story: 'Template de detalhes com navegação por abas.',
      },
    },
  },
};

export const WithSidebar: Story = {
  render: () => ({
    template: `
      <os-detail-template
        [title]="'Usuário: João Silva'"
        [subtitle]="'Perfil completo do usuário'"
        [showSidebar]="true"
        [sidebarAriaLabel]="'Informações adicionais'"
        [sections]="sampleSections"
        [headerActions]="sampleHeaderActions"
      >
        <div slot="sidebar">
          <h4>Informações Adicionais</h4>
          <p>Conteúdo da sidebar com informações complementares.</p>
          <ul>
            <li>Última atualização: 15/01/2024</li>
            <li>Status: Ativo</li>
            <li>Permissões: Administrador</li>
          </ul>
        </div>
      </os-detail-template>
    `,
    props: {
      sampleSections,
      sampleHeaderActions,
    },
  }),
  parameters: {
    docs: {
      description: {
        story: 'Template de detalhes com sidebar para informações adicionais.',
      },
    },
  },
};

export const WithTabsAndSidebar: Story = {
  render: () => ({
    template: `
      <os-detail-template
        [title]="'Usuário: João Silva'"
        [subtitle]="'Perfil completo do usuário'"
        [tabs]="sampleTabs"
        [activeTabId]="'overview'"
        [showSidebar]="true"
        [sidebarAriaLabel]="'Informações adicionais'"
        [sections]="sampleSections"
        [headerActions]="sampleHeaderActions"
      >
        <div slot="sidebar">
          <h4>Informações Adicionais</h4>
          <p>Conteúdo da sidebar com informações complementares.</p>
          <ul>
            <li>Última atualização: 15/01/2024</li>
            <li>Status: Ativo</li>
            <li>Permissões: Administrador</li>
          </ul>
        </div>
      </os-detail-template>
    `,
    props: {
      sampleSections,
      sampleHeaderActions,
      sampleTabs,
    },
  }),
  parameters: {
    docs: {
      description: {
        story: 'Template de detalhes com abas e sidebar combinados.',
      },
    },
  },
};

export const CollapsibleSections: Story = {
  render: () => ({
    template: `
      <os-detail-template
        [title]="'Template com Seções Colapsáveis'"
        [sections]="collapsibleSections"
        [actions]="sampleActions"
      ></os-detail-template>
    `,
    props: {
      collapsibleSections: [
        {
          title: 'Informações Pessoais',
          fields: [
            { label: 'Nome', value: 'João Silva', type: 'text', variant: 'default' },
            { label: 'Email', value: 'joao@example.com', type: 'text', variant: 'default' },
          ],
          collapsible: true,
          expanded: true,
        },
        {
          title: 'Informações Financeiras',
          fields: [
            { label: 'Salário', value: 5000, type: 'currency', variant: 'highlight' },
            { label: 'Despesas', value: 3500, type: 'currency', variant: 'default' },
          ],
          collapsible: true,
          expanded: false,
        },
        {
          title: 'Configurações',
          fields: [
            { label: 'Tema', value: 'Claro', type: 'text', variant: 'default' },
            { label: 'Idioma', value: 'Português', type: 'text', variant: 'default' },
          ],
          collapsible: true,
          expanded: false,
        },
      ],
      sampleActions,
    },
  }),
  parameters: {
    docs: {
      description: {
        story: 'Template com seções colapsáveis para organizar melhor o conteúdo.',
      },
    },
  },
};

export const FieldTypes: Story = {
  render: () => ({
    template: `
      <os-detail-template
        [title]="'Diferentes Tipos de Campos'"
        [sections]="fieldTypeSections"
      ></os-detail-template>
    `,
    props: {
      fieldTypeSections: [
        {
          title: 'Tipos de Campos',
          fields: [
            { label: 'Texto Simples', value: 'João Silva', type: 'text', variant: 'default' },
            { label: 'Número', value: 12345, type: 'number', variant: 'default' },
            { label: 'Moeda', value: 1500.5, type: 'currency', variant: 'highlight' },
            { label: 'Porcentagem', value: 75.5, type: 'percentage', variant: 'highlight' },
            { label: 'Data', value: new Date('2024-01-15'), type: 'date', variant: 'default' },
            {
              label: 'Texto Muted',
              value: 'Informação secundária',
              type: 'text',
              variant: 'muted',
            },
          ],
          collapsible: false,
          expanded: true,
        },
      ],
    },
  }),
  parameters: {
    docs: {
      description: {
        story: 'Diferentes tipos de campos suportados pelo template.',
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
          <os-detail-template
            [title]="'Carregando...'"
            [sections]="[]"
            [loading]="true"
          ></os-detail-template>
        </div>

        <div>
          <h4>Carregado</h4>
          <os-detail-template
            [title]="'Carregado'"
            [sections]="sampleSections"
            [loading]="false"
          ></os-detail-template>
        </div>
      </div>
    `,
    props: {
      sampleSections,
    },
  }),
  parameters: {
    docs: {
      description: {
        story: 'Estados de carregamento do template de detalhes.',
      },
    },
  },
};

export const DisabledState: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 24px;">
        <div>
          <h4>Habilitado</h4>
          <os-detail-template
            [title]="'Habilitado'"
            [sections]="sampleSections"
            [actions]="sampleActions"
            [disabled]="false"
          ></os-detail-template>
        </div>

        <div>
          <h4>Desabilitado</h4>
          <os-detail-template
            [title]="'Desabilitado'"
            [sections]="sampleSections"
            [actions]="sampleActions"
            [disabled]="true"
          ></os-detail-template>
        </div>
      </div>
    `,
    props: {
      sampleSections,
      sampleActions,
    },
  }),
  parameters: {
    docs: {
      description: {
        story: 'Estados habilitado e desabilitado do template de detalhes.',
      },
    },
  },
};

export const WithoutHeader: Story = {
  render: () => ({
    template: `
      <os-detail-template
        [title]="'Sem Header'"
        [sections]="sampleSections"
        [actions]="sampleActions"
        [showHeader]="false"
      ></os-detail-template>
    `,
    props: {
      sampleSections,
      sampleActions,
    },
  }),
  parameters: {
    docs: {
      description: {
        story: 'Template de detalhes sem header.',
      },
    },
  },
};

export const Interactive: Story = {
  args: {
    variant: 'default',
    size: 'medium',
    theme: 'light',
    disabled: false,
    loading: false,
    title: 'Detalhes do Usuário',
    subtitle: 'Informações completas do perfil',
    showHeader: true,
    showBreadcrumb: false,
    breadcrumbItems: [],
    headerActions: sampleHeaderActions,
    sections: sampleSections,
    actions: sampleActions,
  },
  render: (args) => ({
    props: args,
    template: `
      <os-detail-template
        [variant]="variant"
        [size]="size"
        [theme]="theme"
        [disabled]="disabled"
        [loading]="loading"
        [title]="title"
        [subtitle]="subtitle"
        [showHeader]="showHeader"
        [showBreadcrumb]="showBreadcrumb"
        [breadcrumbItems]="breadcrumbItems"
        [headerActions]="headerActions"
        [sections]="sections"
        [actions]="actions"
        (headerActionClicked)="headerActionClicked($event)"
        (actionClicked)="actionClicked($event)"
        (sectionToggled)="sectionToggled($event)"
      ></os-detail-template>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Template de detalhes interativo com controles para testar todas as propriedades.',
      },
    },
  },
};
