import type { Meta, StoryObj } from '@storybook/angular';
import { OsGoalTrackerComponent, GoalTrackerData } from './os-goal-tracker.component';

const meta: Meta<OsGoalTrackerComponent> = {
  title: 'Design System/Organisms/Goal Tracker',
  component: OsGoalTrackerComponent,
  parameters: {
    docs: {
      description: {
        component:
          'Rastreador de metas do Design System Orca Sonhos com histórico e análise de progresso.',
      },
    },
  },
  argTypes: {
    goalData: {
      control: { type: 'object' },
      description: 'Dados da meta para rastreamento',
    },
    variant: {
      control: { type: 'select' },
      options: ['default', 'compact', 'detailed'],
      description: 'Variante do rastreador',
    },
    size: {
      control: { type: 'select' },
      options: ['small', 'medium', 'large'],
      description: 'Tamanho do rastreador',
    },
    theme: {
      control: { type: 'select' },
      options: ['light', 'dark'],
      description: 'Tema do rastreador',
    },
    showTimeline: {
      control: { type: 'boolean' },
      description: 'Mostrar informações de prazo',
    },
    showHistory: {
      control: { type: 'boolean' },
      description: 'Mostrar histórico de progresso',
    },
    showContribution: {
      control: { type: 'boolean' },
      description: 'Mostrar informações de contribuição mensal',
    },
    showStatus: {
      control: { type: 'boolean' },
      description: 'Mostrar status da meta',
    },
    showQuickActions: {
      control: { type: 'boolean' },
      description: 'Mostrar ações rápidas',
    },
    showFilters: {
      control: { type: 'boolean' },
      description: 'Mostrar filtros por status e prioridade',
    },
    showPriority: {
      control: { type: 'boolean' },
      description: 'Mostrar indicador visual de prioridade',
    },
    enableHapticFeedback: {
      control: { type: 'boolean' },
      description: 'Habilitar feedback háptico em dispositivos móveis',
    },
    loading: {
      control: { type: 'boolean' },
      description: 'Estado de carregamento',
    },
    clickable: {
      control: { type: 'boolean' },
      description: 'Card clicável',
    },
    ariaLabel: {
      control: { type: 'text' },
      description: 'Label de acessibilidade',
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<OsGoalTrackerComponent>;

const sampleGoalData = {
  id: '1',
  title: 'Viagem para Europa',
  description: 'Economizar para uma viagem de 15 dias pela Europa',
  targetAmount: 15000,
  currentAmount: 8500,
  currency: 'BRL',
  deadline: new Date('2024-12-31'),
  startDate: new Date('2024-01-01'),
  lastUpdated: new Date('2024-01-20'),
  status: 'active' as const,
  priority: 'high' as const,
  category: 'Viagem',
  monthlyContribution: 1000,
  progressHistory: [
    { date: new Date('2024-01-01'), amount: 0, percentage: 0, note: 'Meta criada' },
    { date: new Date('2024-01-15'), amount: 2000, percentage: 13, note: 'Primeira contribuição' },
    { date: new Date('2024-02-01'), amount: 3500, percentage: 23, note: 'Contribuição mensal' },
    { date: new Date('2024-02-15'), amount: 5000, percentage: 33, note: 'Bônus recebido' },
    { date: new Date('2024-03-01'), amount: 6500, percentage: 43, note: 'Contribuição mensal' },
    { date: new Date('2024-03-15'), amount: 8500, percentage: 57, note: 'Venda de ativos' },
  ],
};

const completedGoalData = {
  id: '2',
  title: 'Notebook Novo',
  description: 'Comprar um notebook para trabalho',
  targetAmount: 5000,
  currentAmount: 5000,
  currency: 'BRL',
  deadline: new Date('2024-06-30'),
  startDate: new Date('2024-01-01'),
  lastUpdated: new Date('2024-03-15'),
  status: 'completed' as const,
  priority: 'medium' as const,
  category: 'Tecnologia',
  monthlyContribution: 1000,
  progressHistory: [
    { date: new Date('2024-01-01'), amount: 0, percentage: 0, note: 'Meta criada' },
    { date: new Date('2024-01-15'), amount: 1000, percentage: 20, note: 'Primeira contribuição' },
    { date: new Date('2024-02-01'), amount: 2000, percentage: 40, note: 'Contribuição mensal' },
    { date: new Date('2024-02-15'), amount: 3000, percentage: 60, note: 'Bônus recebido' },
    { date: new Date('2024-03-01'), amount: 4000, percentage: 80, note: 'Contribuição mensal' },
    { date: new Date('2024-03-15'), amount: 5000, percentage: 100, note: 'Meta concluída!' },
  ],
};

const overdueGoalData = {
  id: '3',
  title: 'Curso de Inglês',
  description: 'Pagar curso de inglês online',
  targetAmount: 2000,
  currentAmount: 1200,
  currency: 'BRL',
  deadline: new Date('2024-01-15'),
  startDate: new Date('2023-12-01'),
  lastUpdated: new Date('2024-01-10'),
  status: 'active' as const,
  priority: 'high' as const,
  category: 'Educação',
  monthlyContribution: 500,
  progressHistory: [
    { date: new Date('2023-12-01'), amount: 0, percentage: 0, note: 'Meta criada' },
    { date: new Date('2023-12-15'), amount: 500, percentage: 25, note: 'Primeira contribuição' },
    { date: new Date('2024-01-01'), amount: 1000, percentage: 50, note: 'Contribuição mensal' },
    { date: new Date('2024-01-10'), amount: 1200, percentage: 60, note: 'Última contribuição' },
  ],
};

const pausedGoalData = {
  id: '4',
  title: 'Casa Própria',
  description: 'Entrada para compra de casa',
  targetAmount: 50000,
  currentAmount: 15000,
  currency: 'BRL',
  deadline: new Date('2025-12-31'),
  startDate: new Date('2023-01-01'),
  lastUpdated: new Date('2024-01-01'),
  status: 'paused' as const,
  priority: 'high' as const,
  category: 'Imóvel',
  monthlyContribution: 2000,
  progressHistory: [
    { date: new Date('2023-01-01'), amount: 0, percentage: 0, note: 'Meta criada' },
    {
      date: new Date('2023-06-01'),
      amount: 10000,
      percentage: 20,
      note: 'Contribuições regulares',
    },
    {
      date: new Date('2023-12-01'),
      amount: 15000,
      percentage: 30,
      note: 'Meta pausada temporariamente',
    },
  ],
};

export const Default: Story = {
  args: {
    goalData: sampleGoalData,
    variant: 'default',
    size: 'medium',
    theme: 'light',
    showTimeline: true,
    showHistory: true,
    showContribution: true,
    showStatus: true,
    showQuickActions: true,
    showFilters: true,
    showPriority: true,
    enableHapticFeedback: true,
    loading: false,
    clickable: false,
    ariaLabel: null,
  },
  render: (args) => ({
    props: args,
    template: `
      <os-goal-tracker
        [goalData]="goalData"
        [variant]="variant"
        [size]="size"
        [theme]="theme"
        [showTimeline]="showTimeline"
        [showHistory]="showHistory"
        [showContribution]="showContribution"
        [showStatus]="showStatus"
        [loading]="loading"
        [clickable]="clickable"
        [ariaLabel]="ariaLabel"
        (goalClick)="goalClick($event)"
        (refreshClick)="refreshClick()"
        (actionClick)="actionClick($event)"
      ></os-goal-tracker>
    `,
  }),
};

export const Variants: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 24px;">
        <div>
          <h4>Default</h4>
          <os-goal-tracker
            [goalData]="sampleGoalData"
            variant="default"
          ></os-goal-tracker>
        </div>

        <div>
          <h4>Compact</h4>
          <os-goal-tracker
            [goalData]="sampleGoalData"
            variant="compact"
          ></os-goal-tracker>
        </div>

        <div>
          <h4>Detailed</h4>
          <os-goal-tracker
            [goalData]="sampleGoalData"
            variant="detailed"
          ></os-goal-tracker>
        </div>
      </div>
    `,
    props: {
      sampleGoalData,
    },
  }),
  parameters: {
    docs: {
      description: {
        story: 'Todas as variantes disponíveis do rastreador de metas.',
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
          <os-goal-tracker
            [goalData]="sampleGoalData"
            size="small"
          ></os-goal-tracker>
        </div>

        <div>
          <h4>Medium</h4>
          <os-goal-tracker
            [goalData]="sampleGoalData"
            size="medium"
          ></os-goal-tracker>
        </div>

        <div>
          <h4>Large</h4>
          <os-goal-tracker
            [goalData]="sampleGoalData"
            size="large"
          ></os-goal-tracker>
        </div>
      </div>
    `,
    props: {
      sampleGoalData,
    },
  }),
  parameters: {
    docs: {
      description: {
        story: 'Todos os tamanhos disponíveis do rastreador de metas.',
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
          <os-goal-tracker
            [goalData]="sampleGoalData"
            theme="light"
          ></os-goal-tracker>
        </div>

        <div>
          <h4>Dark Theme</h4>
          <os-goal-tracker
            [goalData]="sampleGoalData"
            theme="dark"
          ></os-goal-tracker>
        </div>
      </div>
    `,
    props: {
      sampleGoalData,
    },
  }),
  parameters: {
    docs: {
      description: {
        story: 'Temas claro e escuro do rastreador de metas.',
      },
    },
  },
};

export const GoalStatuses: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 24px;">
        <div>
          <h4>Ativa</h4>
          <os-goal-tracker
            [goalData]="sampleGoalData"
            variant="default"
          ></os-goal-tracker>
        </div>

        <div>
          <h4>Concluída</h4>
          <os-goal-tracker
            [goalData]="completedGoalData"
            variant="default"
          ></os-goal-tracker>
        </div>

        <div>
          <h4>Atrasada</h4>
          <os-goal-tracker
            [goalData]="overdueGoalData"
            variant="default"
          ></os-goal-tracker>
        </div>

        <div>
          <h4>Pausada</h4>
          <os-goal-tracker
            [goalData]="pausedGoalData"
            variant="default"
          ></os-goal-tracker>
        </div>
      </div>
    `,
    props: {
      sampleGoalData,
      completedGoalData,
      overdueGoalData,
      pausedGoalData,
    },
  }),
  parameters: {
    docs: {
      description: {
        story: 'Diferentes status de metas (ativa, concluída, atrasada, pausada).',
      },
    },
  },
};

export const WithOptions: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 24px;">
        <div>
          <h4>Com Todas as Opções</h4>
          <os-goal-tracker
            [goalData]="sampleGoalData"
            [showTimeline]="true"
            [showHistory]="true"
            [showContribution]="true"
            [showStatus]="true"
          ></os-goal-tracker>
        </div>

        <div>
          <h4>Mínimo</h4>
          <os-goal-tracker
            [goalData]="sampleGoalData"
            [showTimeline]="false"
            [showHistory]="false"
            [showContribution]="false"
            [showStatus]="false"
          ></os-goal-tracker>
        </div>

        <div>
          <h4>Sem Histórico</h4>
          <os-goal-tracker
            [goalData]="sampleGoalData"
            [showHistory]="false"
          ></os-goal-tracker>
        </div>

        <div>
          <h4>Sem Contribuição</h4>
          <os-goal-tracker
            [goalData]="sampleGoalData"
            [showContribution]="false"
          ></os-goal-tracker>
        </div>
      </div>
    `,
    props: {
      sampleGoalData,
    },
  }),
  parameters: {
    docs: {
      description: {
        story: 'Diferentes combinações de opções de exibição.',
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
          <os-goal-tracker
            [goalData]="null"
            [loading]="true"
          ></os-goal-tracker>
        </div>

        <div>
          <h4>Carregado</h4>
          <os-goal-tracker
            [goalData]="sampleGoalData"
            [loading]="false"
          ></os-goal-tracker>
        </div>
      </div>
    `,
    props: {
      sampleGoalData,
    },
  }),
  parameters: {
    docs: {
      description: {
        story: 'Estados de carregamento do rastreador de metas.',
      },
    },
  },
};

export const Clickable: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 24px;">
        <div>
          <h4>Card Clicável</h4>
          <os-goal-tracker
            [goalData]="sampleGoalData"
            [clickable]="true"
            (goalClick)="onGoalClick($event)"
          ></os-goal-tracker>
        </div>

        <div>
          <h4>Card Não Clicável</h4>
          <os-goal-tracker
            [goalData]="sampleGoalData"
            [clickable]="false"
          ></os-goal-tracker>
        </div>
      </div>
    `,
    props: {
      sampleGoalData,
      onGoalClick: (data: GoalTrackerData) => console.log('Goal clicked:', data),
    },
  }),
  parameters: {
    docs: {
      description: {
        story: 'Rastreador de metas clicável e não clicável.',
      },
    },
  },
};

export const DifferentPriorities: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 24px;">
        <div>
          <h4>Alta Prioridade</h4>
          <os-goal-tracker
            [goalData]="{
              id: '1',
              title: 'Meta Alta Prioridade',
              targetAmount: 10000,
              currentAmount: 3000,
              currency: 'BRL',
              deadline: new Date('2024-06-30'),
              startDate: new Date('2024-01-01'),
              lastUpdated: new Date('2024-01-20'),
              status: 'active',
              priority: 'high',
              category: 'Geral',
              monthlyContribution: 1000,
              progressHistory: []
            }"
            variant="default"
          ></os-goal-tracker>
        </div>

        <div>
          <h4>Média Prioridade</h4>
          <os-goal-tracker
            [goalData]="{
              id: '2',
              title: 'Meta Média Prioridade',
              targetAmount: 5000,
              currentAmount: 2000,
              currency: 'BRL',
              deadline: new Date('2024-12-31'),
              startDate: new Date('2024-01-01'),
              lastUpdated: new Date('2024-01-20'),
              status: 'active',
              priority: 'medium',
              category: 'Geral',
              monthlyContribution: 500,
              progressHistory: []
            }"
            variant="default"
          ></os-goal-tracker>
        </div>

        <div>
          <h4>Baixa Prioridade</h4>
          <os-goal-tracker
            [goalData]="{
              id: '3',
              title: 'Meta Baixa Prioridade',
              targetAmount: 2000,
              currentAmount: 500,
              currency: 'BRL',
              deadline: new Date('2025-12-31'),
              startDate: new Date('2024-01-01'),
              lastUpdated: new Date('2024-01-20'),
              status: 'active',
              priority: 'low',
              category: 'Geral',
              monthlyContribution: 200,
              progressHistory: []
            }"
            variant="default"
          ></os-goal-tracker>
        </div>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Metas com diferentes níveis de prioridade.',
      },
    },
  },
};

export const QuickActions: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 24px;">
        <div>
          <h4>Meta Ativa - Ações Disponíveis</h4>
          <os-goal-tracker
            [goalData]="sampleGoalData"
            [showQuickActions]="true"
            (actionClick)="onActionClick($event)"
          ></os-goal-tracker>
        </div>

        <div>
          <h4>Meta Pausada - Ações Disponíveis</h4>
          <os-goal-tracker
            [goalData]="pausedGoalData"
            [showQuickActions]="true"
            (actionClick)="onActionClick($event)"
          ></os-goal-tracker>
        </div>

        <div>
          <h4>Meta Concluída - Ações Limitadas</h4>
          <os-goal-tracker
            [goalData]="completedGoalData"
            [showQuickActions]="true"
            (actionClick)="onActionClick($event)"
          ></os-goal-tracker>
        </div>
      </div>
    `,
    props: {
      sampleGoalData,
      pausedGoalData,
      completedGoalData,
      onActionClick: (event: { action: string; goal: GoalTrackerData }) =>
        console.log('Action clicked:', event),
    },
  }),
  parameters: {
    docs: {
      description: {
        story: 'Ações rápidas disponíveis para diferentes status de metas.',
      },
    },
  },
};

export const PriorityVisualization: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 24px;">
        <div>
          <h4>Alta Prioridade - Urgente</h4>
          <os-goal-tracker
            [goalData]="{
              id: '1',
              title: 'Meta Urgente - Alta Prioridade',
              targetAmount: 10000,
              currentAmount: 2000,
              currency: 'BRL',
              deadline: new Date('2024-02-15'),
              startDate: new Date('2024-01-01'),
              lastUpdated: new Date('2024-01-20'),
              status: 'active',
              priority: 'high',
              category: 'Urgente',
              monthlyContribution: 1000,
              progressHistory: []
            }"
            [showPriority]="true"
          ></os-goal-tracker>
        </div>

        <div>
          <h4>Média Prioridade</h4>
          <os-goal-tracker
            [goalData]="{
              id: '2',
              title: 'Meta Média Prioridade',
              targetAmount: 5000,
              currentAmount: 2000,
              currency: 'BRL',
              deadline: new Date('2024-12-31'),
              startDate: new Date('2024-01-01'),
              lastUpdated: new Date('2024-01-20'),
              status: 'active',
              priority: 'medium',
              category: 'Normal',
              monthlyContribution: 500,
              progressHistory: []
            }"
            [showPriority]="true"
          ></os-goal-tracker>
        </div>

        <div>
          <h4>Baixa Prioridade</h4>
          <os-goal-tracker
            [goalData]="{
              id: '3',
              title: 'Meta Baixa Prioridade',
              targetAmount: 2000,
              currentAmount: 500,
              currency: 'BRL',
              deadline: new Date('2025-12-31'),
              startDate: new Date('2024-01-01'),
              lastUpdated: new Date('2024-01-20'),
              status: 'active',
              priority: 'low',
              category: 'Baixa',
              monthlyContribution: 200,
              progressHistory: []
            }"
            [showPriority]="true"
          ></os-goal-tracker>
        </div>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Visualização de prioridades com indicadores visuais e badges de urgência.',
      },
    },
  },
};

export const Filters: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 24px;">
        <div>
          <h4>Com Filtros Ativos</h4>
          <os-goal-tracker
            [goalData]="sampleGoalData"
            [showFilters]="true"
            (filterChange)="onFilterChange($event)"
          ></os-goal-tracker>
        </div>

        <div>
          <h4>Sem Filtros</h4>
          <os-goal-tracker
            [goalData]="sampleGoalData"
            [showFilters]="false"
          ></os-goal-tracker>
        </div>
      </div>
    `,
    props: {
      sampleGoalData,
      onFilterChange: (event: { status: string; priority: string }) =>
        console.log('Filter changed:', event),
    },
  }),
  parameters: {
    docs: {
      description: {
        story: 'Filtros por status e prioridade para organizar metas.',
      },
    },
  },
};

export const MobileOptimized: Story = {
  render: () => ({
    template: `
      <div style="max-width: 375px; margin: 0 auto;">
        <h4>Otimizado para Mobile</h4>
        <os-goal-tracker
          [goalData]="sampleGoalData"
          [showQuickActions]="true"
          [showFilters]="true"
          [showPriority]="true"
          [enableHapticFeedback]="true"
          size="small"
        ></os-goal-tracker>
      </div>
    `,
    props: {
      sampleGoalData,
    },
  }),
  parameters: {
    docs: {
      description: {
        story: 'Versão otimizada para dispositivos móveis com touch targets adequados.',
      },
    },
  },
};

export const Interactive: Story = {
  args: {
    goalData: sampleGoalData,
    variant: 'default',
    size: 'medium',
    theme: 'light',
    showTimeline: true,
    showHistory: true,
    showContribution: true,
    showStatus: true,
    showQuickActions: true,
    showFilters: true,
    showPriority: true,
    enableHapticFeedback: true,
    loading: false,
    clickable: false,
    ariaLabel: null,
  },
  render: (args) => ({
    props: args,
    template: `
      <os-goal-tracker
        [goalData]="goalData"
        [variant]="variant"
        [size]="size"
        [theme]="theme"
        [showTimeline]="showTimeline"
        [showHistory]="showHistory"
        [showContribution]="showContribution"
        [showStatus]="showStatus"
        [showQuickActions]="showQuickActions"
        [showFilters]="showFilters"
        [showPriority]="showPriority"
        [enableHapticFeedback]="enableHapticFeedback"
        [loading]="loading"
        [clickable]="clickable"
        [ariaLabel]="ariaLabel"
        (goalClick)="goalClick($event)"
        (refreshClick)="refreshClick()"
        (actionClick)="actionClick($event)"
        (filterChange)="filterChange($event)"
        (priorityChange)="priorityChange($event)"
      ></os-goal-tracker>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story:
          'Rastreador de metas interativo com controles para testar todas as propriedades refinadas.',
      },
    },
  },
};
