import type { Meta, StoryObj } from '@storybook/angular';
import { OsGoalProgressCardComponent, GoalProgressData } from './os-goal-progress-card.component';

const meta: Meta<OsGoalProgressCardComponent> = {
  title: 'Design System/Molecules/Goal Progress Card',
  component: OsGoalProgressCardComponent,
  parameters: {
    docs: {
      description: {
        component:
          'Card de progresso de metas do Design System OrçaSonhos com visual motivacional, acessibilidade WCAG 2.1 AA e responsividade mobile-first.',
      },
    },
  },
  argTypes: {
    goalData: {
      control: { type: 'object' },
      description: 'Dados da meta para exibição',
    },
    variant: {
      control: { type: 'select' },
      options: ['default', 'compact', 'extended'],
      description: 'Variante visual do card',
    },
    size: {
      control: { type: 'select' },
      options: ['small', 'medium', 'large'],
      description: 'Tamanho do card',
    },
    state: {
      control: { type: 'select' },
      options: ['default', 'completed', 'overdue', 'loading'],
      description: 'Estado do card',
    },
    ariaLabel: {
      control: { type: 'text' },
      description: 'Label de acessibilidade',
    },
    cardClick: {
      action: 'cardClick',
      description: 'Evento de clique no card',
    },
    cardExpand: {
      action: 'cardExpand',
      description: 'Evento de expansão do card',
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<OsGoalProgressCardComponent>;

// Sample data
const sampleGoalData: GoalProgressData = {
  id: 'goal-1',
  title: 'Casa Própria',
  description: 'Economizar para entrada da casa dos sonhos',
  currentValue: 45000,
  targetValue: 100000,
  unit: 'R$',
  deadline: new Date('2025-12-31'),
  priority: 'high',
  category: 'Moradia',
};

const completedGoalData: GoalProgressData = {
  id: 'goal-2',
  title: 'Curso de Inglês',
  description: 'Investimento em educação para crescimento profissional',
  currentValue: 2500,
  targetValue: 2500,
  unit: 'R$',
  deadline: new Date('2024-11-30'),
  priority: 'medium',
  category: 'Educação',
};

const overdueGoalData: GoalProgressData = {
  id: 'goal-3',
  title: 'Viagem para Europa',
  description: 'Sonho de conhecer a Europa com a família',
  currentValue: 15000,
  targetValue: 50000,
  unit: 'R$',
  deadline: new Date('2024-06-30'),
  priority: 'high',
  category: 'Lazer',
};

// Stories
export const Default: Story = {
  args: {
    goalData: sampleGoalData,
    variant: 'default',
    size: 'medium',
    state: 'default',
    ariaLabel: 'Card de progresso da meta Casa Própria',
  },
};

export const Compact: Story = {
  args: {
    goalData: sampleGoalData,
    variant: 'compact',
    size: 'small',
    state: 'default',
    ariaLabel: 'Card compacto de progresso da meta',
  },
};

export const Extended: Story = {
  args: {
    goalData: sampleGoalData,
    variant: 'extended',
    size: 'large',
    state: 'default',
    ariaLabel: 'Card estendido de progresso da meta',
  },
};

export const Completed: Story = {
  args: {
    goalData: completedGoalData,
    variant: 'default',
    size: 'medium',
    state: 'completed',
    ariaLabel: 'Meta concluída - Curso de Inglês',
  },
};

export const Overdue: Story = {
  args: {
    goalData: overdueGoalData,
    variant: 'default',
    size: 'medium',
    state: 'overdue',
    ariaLabel: 'Meta atrasada - Viagem para Europa',
  },
};

export const Loading: Story = {
  args: {
    goalData: null,
    variant: 'default',
    size: 'medium',
    state: 'loading',
    ariaLabel: 'Carregando dados da meta',
  },
};

export const HighPriority: Story = {
  args: {
    goalData: {
      ...sampleGoalData,
      priority: 'high',
      title: 'Emergência Médica',
      description: 'Fundo de emergência para situações médicas',
    },
    variant: 'default',
    size: 'medium',
    state: 'default',
    ariaLabel: 'Meta de alta prioridade - Emergência Médica',
  },
};

export const MediumPriority: Story = {
  args: {
    goalData: {
      ...sampleGoalData,
      priority: 'medium',
      title: 'Upgrade do Notebook',
      description: 'Investimento em equipamento para trabalho',
    },
    variant: 'default',
    size: 'medium',
    state: 'default',
    ariaLabel: 'Meta de prioridade média - Upgrade do Notebook',
  },
};

export const LowPriority: Story = {
  args: {
    goalData: {
      ...sampleGoalData,
      priority: 'low',
      title: 'Coleção de Livros',
      description: 'Construir biblioteca pessoal',
    },
    variant: 'default',
    size: 'medium',
    state: 'default',
    ariaLabel: 'Meta de baixa prioridade - Coleção de Livros',
  },
};

export const WithoutDeadline: Story = {
  args: {
    goalData: {
      ...sampleGoalData,
      deadline: undefined,
      title: 'Fundo de Aposentadoria',
      description: 'Investimento de longo prazo para aposentadoria',
    },
    variant: 'default',
    size: 'medium',
    state: 'default',
    ariaLabel: 'Meta sem prazo definido - Fundo de Aposentadoria',
  },
};

export const WithoutDescription: Story = {
  args: {
    goalData: {
      ...sampleGoalData,
      description: undefined,
      title: 'Carro Novo',
    },
    variant: 'default',
    size: 'medium',
    state: 'default',
    ariaLabel: 'Meta sem descrição - Carro Novo',
  },
};

export const WithoutCategory: Story = {
  args: {
    goalData: {
      ...sampleGoalData,
      category: undefined,
      title: 'Investimento em Ações',
    },
    variant: 'default',
    size: 'medium',
    state: 'default',
    ariaLabel: 'Meta sem categoria - Investimento em Ações',
  },
};

export const AccessibilityDemo: Story = {
  args: {
    goalData: sampleGoalData,
    variant: 'default',
    size: 'medium',
    state: 'default',
    ariaLabel: 'Demonstração de acessibilidade - Card de progresso da meta',
  },
  parameters: {
    docs: {
      description: {
        story: 'Demonstração das funcionalidades de acessibilidade do card de progresso de metas.',
      },
    },
  },
};
