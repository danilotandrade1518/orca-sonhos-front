import type { Meta, StoryObj } from '@storybook/angular';
import { OsGoalProgressComponent } from './os-goal-progress.component';

const meta: Meta<OsGoalProgressComponent> = {
  title: 'Design System/Organisms/Goal Progress',
  component: OsGoalProgressComponent,
  parameters: {
    docs: {
      description: {
        component:
          'Progresso de metas do Design System Orca Sonhos com barras de progresso e estatísticas.',
      },
    },
  },
  argTypes: {
    goalData: {
      control: { type: 'object' },
      description: 'Dados da meta',
    },
    variant: {
      control: { type: 'select' },
      options: ['default', 'compact', 'detailed', 'minimal'],
      description: 'Variante do progresso',
    },
    size: {
      control: { type: 'select' },
      options: ['small', 'medium', 'large'],
      description: 'Tamanho do progresso',
    },
    theme: {
      control: { type: 'select' },
      options: ['light', 'dark'],
      description: 'Tema do progresso',
    },
    showIcon: {
      control: { type: 'boolean' },
      description: 'Mostrar ícone',
    },
    showDescription: {
      control: { type: 'boolean' },
      description: 'Mostrar descrição',
    },
    showCategory: {
      control: { type: 'boolean' },
      description: 'Mostrar categoria',
    },
    showStats: {
      control: { type: 'boolean' },
      description: 'Mostrar estatísticas',
    },
    showPercentage: {
      control: { type: 'boolean' },
      description: 'Mostrar porcentagem na barra de progresso',
    },
    showDeadline: {
      control: { type: 'boolean' },
      description: 'Mostrar prazo',
    },
    showActions: {
      control: { type: 'boolean' },
      description: 'Mostrar ações',
    },
    animated: {
      control: { type: 'boolean' },
      description: 'Animação da barra de progresso',
    },
    actions: {
      control: { type: 'object' },
      description: 'Lista de ações',
    },
    ariaLabel: {
      control: { type: 'text' },
      description: 'Label de acessibilidade',
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<OsGoalProgressComponent>;

const sampleGoalData = {
  id: '1',
  title: 'Viagem para Europa',
  description: 'Economizar para uma viagem de 15 dias pela Europa',
  targetAmount: 15000,
  currentAmount: 8500,
  currency: 'BRL',
  deadline: new Date('2024-12-31'),
  category: 'Viagem',
  priority: 'high' as const,
};

const completedGoalData = {
  id: '2',
  title: 'Notebook Novo',
  description: 'Comprar um notebook para trabalho',
  targetAmount: 5000,
  currentAmount: 5000,
  currency: 'BRL',
  deadline: new Date('2024-06-30'),
  category: 'Tecnologia',
  priority: 'medium' as const,
};

const overdueGoalData = {
  id: '3',
  title: 'Curso de Inglês',
  description: 'Pagar curso de inglês online',
  targetAmount: 2000,
  currentAmount: 1200,
  currency: 'BRL',
  deadline: new Date('2024-01-15'),
  category: 'Educação',
  priority: 'high' as const,
};

const lowPriorityGoalData = {
  id: '4',
  title: 'Livros',
  description: 'Comprar livros para leitura',
  targetAmount: 500,
  currentAmount: 200,
  currency: 'BRL',
  deadline: new Date('2024-08-31'),
  category: 'Educação',
  priority: 'low' as const,
};

export const Default: Story = {
  args: {
    goalData: sampleGoalData,
    variant: 'default',
    size: 'medium',
    theme: 'light',
    showIcon: true,
    showDescription: true,
    showCategory: true,
    showStats: true,
    showPercentage: true,
    showDeadline: true,
    showActions: false,
    animated: true,
    actions: [],
    ariaLabel: null,
  },
  render: (args) => ({
    props: args,
    template: `
      <os-goal-progress
        [goalData]="goalData"
        [variant]="variant"
        [size]="size"
        [theme]="theme"
        [showIcon]="showIcon"
        [showDescription]="showDescription"
        [showCategory]="showCategory"
        [showStats]="showStats"
        [showPercentage]="showPercentage"
        [showDeadline]="showDeadline"
        [showActions]="showActions"
        [animated]="animated"
        [actions]="actions"
        [ariaLabel]="ariaLabel"
        (goalClick)="goalClick($event)"
        (actionClick)="actionClick($event)"
      ></os-goal-progress>
    `,
  }),
};

export const Variants: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 24px;">
        <div>
          <h4>Default</h4>
          <os-goal-progress
            [goalData]="sampleGoalData"
            variant="default"
          ></os-goal-progress>
        </div>

        <div>
          <h4>Compact</h4>
          <os-goal-progress
            [goalData]="sampleGoalData"
            variant="compact"
          ></os-goal-progress>
        </div>

        <div>
          <h4>Detailed</h4>
          <os-goal-progress
            [goalData]="sampleGoalData"
            variant="detailed"
          ></os-goal-progress>
        </div>

        <div>
          <h4>Minimal</h4>
          <os-goal-progress
            [goalData]="sampleGoalData"
            variant="minimal"
          ></os-goal-progress>
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
        story: 'Todas as variantes disponíveis do progresso de metas.',
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
          <os-goal-progress
            [goalData]="sampleGoalData"
            size="small"
          ></os-goal-progress>
        </div>

        <div>
          <h4>Medium</h4>
          <os-goal-progress
            [goalData]="sampleGoalData"
            size="medium"
          ></os-goal-progress>
        </div>

        <div>
          <h4>Large</h4>
          <os-goal-progress
            [goalData]="sampleGoalData"
            size="large"
          ></os-goal-progress>
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
        story: 'Todos os tamanhos disponíveis do progresso de metas.',
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
          <os-goal-progress
            [goalData]="sampleGoalData"
            theme="light"
          ></os-goal-progress>
        </div>

        <div>
          <h4>Dark Theme</h4>
          <os-goal-progress
            [goalData]="sampleGoalData"
            theme="dark"
          ></os-goal-progress>
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
        story: 'Temas claro e escuro do progresso de metas.',
      },
    },
  },
};

export const GoalStatuses: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 24px;">
        <div>
          <h4>Em Progresso</h4>
          <os-goal-progress
            [goalData]="sampleGoalData"
            variant="default"
          ></os-goal-progress>
        </div>

        <div>
          <h4>Concluída</h4>
          <os-goal-progress
            [goalData]="completedGoalData"
            variant="default"
          ></os-goal-progress>
        </div>

        <div>
          <h4>Atrasada</h4>
          <os-goal-progress
            [goalData]="overdueGoalData"
            variant="default"
          ></os-goal-progress>
        </div>

        <div>
          <h4>Baixa Prioridade</h4>
          <os-goal-progress
            [goalData]="lowPriorityGoalData"
            variant="default"
          ></os-goal-progress>
        </div>
      </div>
    `,
    props: {
      sampleGoalData,
      completedGoalData,
      overdueGoalData,
      lowPriorityGoalData,
    },
  }),
  parameters: {
    docs: {
      description: {
        story: 'Diferentes status de metas (em progresso, concluída, atrasada).',
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
          <os-goal-progress
            [goalData]="sampleGoalData"
            [showIcon]="true"
            [showDescription]="true"
            [showCategory]="true"
            [showStats]="true"
            [showPercentage]="true"
            [showDeadline]="true"
          ></os-goal-progress>
        </div>

        <div>
          <h4>Mínimo</h4>
          <os-goal-progress
            [goalData]="sampleGoalData"
            [showIcon]="false"
            [showDescription]="false"
            [showCategory]="false"
            [showStats]="false"
            [showPercentage]="false"
            [showDeadline]="false"
          ></os-goal-progress>
        </div>

        <div>
          <h4>Sem Descrição e Categoria</h4>
          <os-goal-progress
            [goalData]="sampleGoalData"
            [showDescription]="false"
            [showCategory]="false"
          ></os-goal-progress>
        </div>

        <div>
          <h4>Sem Estatísticas</h4>
          <os-goal-progress
            [goalData]="sampleGoalData"
            [showStats]="false"
          ></os-goal-progress>
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

export const WithActions: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 24px;">
        <div>
          <h4>Com Ações</h4>
          <os-goal-progress
            [goalData]="sampleGoalData"
            [showActions]="true"
            [actions]="actions"
            (actionClick)="onActionClick($event)"
          ></os-goal-progress>
        </div>

        <div>
          <h4>Sem Ações</h4>
          <os-goal-progress
            [goalData]="sampleGoalData"
            [showActions]="false"
          ></os-goal-progress>
        </div>
      </div>
    `,
    props: {
      sampleGoalData,
      actions: [
        { label: 'Editar', variant: 'primary' },
        { label: 'Adicionar Valor', variant: 'secondary' },
        { label: 'Excluir', variant: 'danger' },
      ],
      onActionClick: (event: MouseEvent) => console.log('Action clicked:', event),
    },
  }),
  parameters: {
    docs: {
      description: {
        story: 'Progresso de metas com e sem ações.',
      },
    },
  },
};

export const DifferentCategories: Story = {
  render: () => ({
    template: `
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 24px;">
        <div>
          <h4>Viagem</h4>
          <os-goal-progress
            [goalData]="{
              id: '1',
              title: 'Viagem para Europa',
              description: 'Economizar para uma viagem de 15 dias',
              targetAmount: 15000,
              currentAmount: 8500,
              currency: 'BRL',
              deadline: new Date('2024-12-31'),
              category: 'Viagem',
              priority: 'high'
            }"
            variant="default"
          ></os-goal-progress>
        </div>

        <div>
          <h4>Educação</h4>
          <os-goal-progress
            [goalData]="{
              id: '2',
              title: 'Curso de Inglês',
              description: 'Pagar curso de inglês online',
              targetAmount: 2000,
              currentAmount: 1200,
              currency: 'BRL',
              deadline: new Date('2024-06-30'),
              category: 'Educação',
              priority: 'medium'
            }"
            variant="default"
          ></os-goal-progress>
        </div>

        <div>
          <h4>Tecnologia</h4>
          <os-goal-progress
            [goalData]="{
              id: '3',
              title: 'Notebook Novo',
              description: 'Comprar um notebook para trabalho',
              targetAmount: 5000,
              currentAmount: 3000,
              currency: 'BRL',
              deadline: new Date('2024-08-31'),
              category: 'Tecnologia',
              priority: 'high'
            }"
            variant="default"
          ></os-goal-progress>
        </div>

        <div>
          <h4>Saúde</h4>
          <os-goal-progress
            [goalData]="{
              id: '4',
              title: 'Plano de Saúde',
              description: 'Pagar plano de saúde anual',
              targetAmount: 3000,
              currentAmount: 3000,
              currency: 'BRL',
              deadline: new Date('2024-03-31'),
              category: 'Saúde',
              priority: 'high'
            }"
            variant="default"
          ></os-goal-progress>
        </div>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Metas de diferentes categorias.',
      },
    },
  },
};

export const DifferentCurrencies: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 24px;">
        <div>
          <h4>Real Brasileiro (BRL)</h4>
          <os-goal-progress
            [goalData]="{
              id: '1',
              title: 'Meta em Reais',
              targetAmount: 10000,
              currentAmount: 6000,
              currency: 'BRL',
              deadline: new Date('2024-12-31'),
              category: 'Geral'
            }"
            variant="default"
          ></os-goal-progress>
        </div>

        <div>
          <h4>Dólar Americano (USD)</h4>
          <os-goal-progress
            [goalData]="{
              id: '2',
              title: 'Meta em Dólares',
              targetAmount: 5000,
              currentAmount: 2500,
              currency: 'USD',
              deadline: new Date('2024-12-31'),
              category: 'Geral'
            }"
            variant="default"
          ></os-goal-progress>
        </div>

        <div>
          <h4>Euro (EUR)</h4>
          <os-goal-progress
            [goalData]="{
              id: '3',
              title: 'Meta em Euros',
              targetAmount: 3000,
              currentAmount: 1800,
              currency: 'EUR',
              deadline: new Date('2024-12-31'),
              category: 'Geral'
            }"
            variant="default"
          ></os-goal-progress>
        </div>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Metas com diferentes moedas.',
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
    showIcon: true,
    showDescription: true,
    showCategory: true,
    showStats: true,
    showPercentage: true,
    showDeadline: true,
    showActions: false,
    animated: true,
    actions: [],
    ariaLabel: null,
  },
  render: (args) => ({
    props: args,
    template: `
      <os-goal-progress
        [goalData]="goalData"
        [variant]="variant"
        [size]="size"
        [theme]="theme"
        [showIcon]="showIcon"
        [showDescription]="showDescription"
        [showCategory]="showCategory"
        [showStats]="showStats"
        [showPercentage]="showPercentage"
        [showDeadline]="showDeadline"
        [showActions]="showActions"
        [animated]="animated"
        [actions]="actions"
        [ariaLabel]="ariaLabel"
        (goalClick)="goalClick($event)"
        (actionClick)="actionClick($event)"
      ></os-goal-progress>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Progresso de metas interativo com controles para testar todas as propriedades.',
      },
    },
  },
};
