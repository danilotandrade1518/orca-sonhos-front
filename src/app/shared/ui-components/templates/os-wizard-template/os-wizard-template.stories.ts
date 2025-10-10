import type { Meta, StoryObj } from '@storybook/angular';
import { OsWizardTemplateComponent } from './os-wizard-template.component';

const meta: Meta<OsWizardTemplateComponent> = {
  title: 'Design System/Templates/Wizard Template',
  component: OsWizardTemplateComponent,
  parameters: {
    docs: {
      description: {
        component:
          'Template de assistente (wizard) do Design System Orca Sonhos com navegação por etapas.',
      },
    },
  },
  argTypes: {
    config: {
      control: { type: 'object' },
      description: 'Configuração do template de wizard',
    },
    currentStep: {
      control: { type: 'text' },
      description: 'ID da etapa atual',
    },
    size: {
      control: { type: 'select' },
      options: ['small', 'medium', 'large'],
      description: 'Tamanho do wizard',
    },
    variant: {
      control: { type: 'select' },
      options: ['default', 'compact', 'detailed'],
      description: 'Variante do template',
    },
    theme: {
      control: { type: 'select' },
      options: ['light', 'dark'],
      description: 'Tema do wizard',
    },
    disabled: {
      control: { type: 'boolean' },
      description: 'Estado desabilitado',
    },
    loading: {
      control: { type: 'boolean' },
      description: 'Estado de carregamento',
    },
    showHeader: {
      control: { type: 'boolean' },
      description: 'Mostrar header',
    },
    showProgress: {
      control: { type: 'boolean' },
      description: 'Mostrar barra de progresso',
    },
    showStepNavigation: {
      control: { type: 'boolean' },
      description: 'Mostrar navegação das etapas',
    },
    showActions: {
      control: { type: 'boolean' },
      description: 'Mostrar ações',
    },
    showStepNumbers: {
      control: { type: 'boolean' },
      description: 'Mostrar números das etapas',
    },
    showStepIcons: {
      control: { type: 'boolean' },
      description: 'Mostrar ícones das etapas',
    },
    allowSkipSteps: {
      control: { type: 'boolean' },
      description: 'Permitir pular etapas',
    },
    showStepValidation: {
      control: { type: 'boolean' },
      description: 'Mostrar validação das etapas',
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<OsWizardTemplateComponent>;

const sampleSteps = [
  {
    id: 'step1',
    title: 'Informações Básicas',
    subtitle: 'Dados pessoais',
    description: 'Preencha suas informações pessoais básicas',
    icon: 'person',
    completed: false,
    disabled: false,
    optional: false,
  },
  {
    id: 'step2',
    title: 'Configurações',
    subtitle: 'Preferências',
    description: 'Configure suas preferências e opções',
    icon: 'settings',
    completed: false,
    disabled: false,
    optional: false,
  },
  {
    id: 'step3',
    title: 'Revisão',
    subtitle: 'Confirmação',
    description: 'Revise todas as informações antes de finalizar',
    icon: 'check_circle',
    completed: false,
    disabled: false,
    optional: false,
  },
];

const sampleConfig = {
  title: 'Assistente de Configuração',
  subtitle: 'Configure sua conta em poucos passos',
  showBackButton: true,
  backUrl: '/dashboard',
  showNextButton: true,
  showPreviousButton: true,
  showFinishButton: true,
  nextButtonText: 'Próximo',
  previousButtonText: 'Anterior',
  finishButtonText: 'Finalizar',
  showProgress: true,
  showStepNumbers: true,
  showStepIcons: true,
  allowSkipSteps: false,
  showStepValidation: true,
  steps: sampleSteps,
};

const compactSteps = [
  {
    id: 'step1',
    title: 'Passo 1',
    completed: false,
    disabled: false,
    optional: false,
  },
  {
    id: 'step2',
    title: 'Passo 2',
    completed: false,
    disabled: false,
    optional: false,
  },
  {
    id: 'step3',
    title: 'Passo 3',
    completed: false,
    disabled: false,
    optional: false,
  },
];

const compactConfig = {
  title: 'Wizard Compacto',
  showBackButton: false,
  showNextButton: true,
  showPreviousButton: true,
  showFinishButton: true,
  showProgress: true,
  showStepNumbers: true,
  showStepIcons: false,
  allowSkipSteps: false,
  showStepValidation: true,
  steps: compactSteps,
};

const detailedSteps = [
  {
    id: 'step1',
    title: 'Informações Pessoais',
    subtitle: 'Dados básicos',
    description: 'Preencha suas informações pessoais básicas para começar',
    icon: 'person',
    completed: false,
    disabled: false,
    optional: false,
  },
  {
    id: 'step2',
    title: 'Configurações de Conta',
    subtitle: 'Preferências e opções',
    description: 'Configure suas preferências e opções de conta',
    icon: 'account_circle',
    completed: false,
    disabled: false,
    optional: false,
  },
  {
    id: 'step3',
    title: 'Configurações de Notificação',
    subtitle: 'Alertas e notificações',
    description: 'Configure como você deseja receber notificações',
    icon: 'notifications',
    completed: false,
    disabled: false,
    optional: true,
  },
  {
    id: 'step4',
    title: 'Revisão e Confirmação',
    subtitle: 'Verificação final',
    description: 'Revise todas as informações antes de finalizar a configuração',
    icon: 'check_circle',
    completed: false,
    disabled: false,
    optional: false,
  },
];

const detailedConfig = {
  title: 'Assistente Detalhado',
  subtitle: 'Configure sua conta com todas as opções disponíveis',
  showBackButton: true,
  backUrl: '/dashboard',
  showNextButton: true,
  showPreviousButton: true,
  showFinishButton: true,
  nextButtonText: 'Continuar',
  previousButtonText: 'Voltar',
  finishButtonText: 'Concluir Configuração',
  showProgress: true,
  showStepNumbers: true,
  showStepIcons: true,
  allowSkipSteps: true,
  showStepValidation: true,
  steps: detailedSteps,
};

export const Default: Story = {
  args: {
    config: sampleConfig,
    currentStep: 'step1',
    size: 'medium',
    variant: 'default',
    theme: 'light',
    disabled: false,
    loading: false,
    showHeader: true,
    showProgress: true,
    showStepNavigation: true,
    showActions: true,
    showStepNumbers: true,
    showStepIcons: true,
    allowSkipSteps: false,
    showStepValidation: true,
  },
  render: (args) => ({
    props: args,
    template: `
      <os-wizard-template
        [config]="config"
        [currentStep]="currentStep"
        [size]="size"
        [variant]="variant"
        [theme]="theme"
        [disabled]="disabled"
        [loading]="loading"
        [showHeader]="showHeader"
        [showProgress]="showProgress"
        [showStepNavigation]="showStepNavigation"
        [showActions]="showActions"
        [showStepNumbers]="showStepNumbers"
        [showStepIcons]="showStepIcons"
        [allowSkipSteps]="allowSkipSteps"
        [showStepValidation]="showStepValidation"
        (next)="next()"
        (previous)="previous()"
        (finishWizard)="finishWizard()"
        (skip)="skip()"
        (stepClick)="stepClick($event)"
      >
        <div style="padding: 20px;">
          <h3>Etapa Atual: {{ currentStep }}</h3>
          <p>Este é o conteúdo da etapa atual do wizard.</p>
          <div style="display: flex; flex-direction: column; gap: 16px;">
            <div>
              <label>Campo da Etapa:</label>
              <input type="text" placeholder="Digite aqui" style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;">
            </div>
            <div>
              <label>Outro Campo:</label>
              <select style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;">
                <option>Opção 1</option>
                <option>Opção 2</option>
                <option>Opção 3</option>
              </select>
            </div>
          </div>
        </div>
      </os-wizard-template>
    `,
  }),
};

export const Variants: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 24px;">
        <div>
          <h4>Default</h4>
          <os-wizard-template
            [config]="defaultConfig"
            [currentStep]="'step1'"
            variant="default"
          >
            <div style="padding: 20px;">
              <p>Wizard padrão com todas as funcionalidades.</p>
            </div>
          </os-wizard-template>
        </div>

        <div>
          <h4>Compact</h4>
          <os-wizard-template
            [config]="compactConfig"
            [currentStep]="'step1'"
            variant="compact"
          >
            <div style="padding: 20px;">
              <p>Wizard compacto para economizar espaço.</p>
            </div>
          </os-wizard-template>
        </div>

        <div>
          <h4>Detailed</h4>
          <os-wizard-template
            [config]="detailedConfig"
            [currentStep]="'step1'"
            variant="detailed"
          >
            <div style="padding: 20px;">
              <p>Wizard detalhado com mais informações.</p>
            </div>
          </os-wizard-template>
        </div>
      </div>
    `,
    props: {
      defaultConfig: {
        title: 'Wizard Default',
        subtitle: 'Wizard padrão do sistema',
        showBackButton: true,
        backUrl: '/dashboard',
        showNextButton: true,
        showPreviousButton: true,
        showFinishButton: true,
        showProgress: true,
        showStepNumbers: true,
        showStepIcons: true,
        allowSkipSteps: false,
        showStepValidation: true,
        steps: sampleSteps,
      },
      compactConfig,
      detailedConfig,
    },
  }),
  parameters: {
    docs: {
      description: {
        story: 'Todas as variantes disponíveis do template de wizard.',
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
          <os-wizard-template
            [config]="config"
            [currentStep]="'step1'"
            size="small"
          >
            <div style="padding: 20px;">
              <p>Wizard pequeno para interfaces compactas.</p>
            </div>
          </os-wizard-template>
        </div>

        <div>
          <h4>Medium</h4>
          <os-wizard-template
            [config]="config"
            [currentStep]="'step1'"
            size="medium"
          >
            <div style="padding: 20px;">
              <p>Wizard médio para a maioria dos casos de uso.</p>
            </div>
          </os-wizard-template>
        </div>

        <div>
          <h4>Large</h4>
          <os-wizard-template
            [config]="config"
            [currentStep]="'step1'"
            size="large"
          >
            <div style="padding: 20px;">
              <p>Wizard grande para conteúdo extenso.</p>
            </div>
          </os-wizard-template>
        </div>
      </div>
    `,
    props: {
      config: {
        title: 'Wizard',
        showBackButton: true,
        backUrl: '/dashboard',
        showNextButton: true,
        showPreviousButton: true,
        showFinishButton: true,
        showProgress: true,
        showStepNumbers: true,
        showStepIcons: true,
        allowSkipSteps: false,
        showStepValidation: true,
        steps: sampleSteps,
      },
    },
  }),
  parameters: {
    docs: {
      description: {
        story: 'Todos os tamanhos disponíveis do template de wizard.',
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
          <os-wizard-template
            [config]="config"
            [currentStep]="'step1'"
            theme="light"
          >
            <div style="padding: 20px;">
              <p>Wizard com tema claro.</p>
            </div>
          </os-wizard-template>
        </div>

        <div>
          <h4>Dark Theme</h4>
          <os-wizard-template
            [config]="config"
            [currentStep]="'step1'"
            theme="dark"
          >
            <div style="padding: 20px;">
              <p>Wizard com tema escuro.</p>
            </div>
          </os-wizard-template>
        </div>
      </div>
    `,
    props: {
      config: {
        title: 'Wizard',
        showBackButton: true,
        backUrl: '/dashboard',
        showNextButton: true,
        showPreviousButton: true,
        showFinishButton: true,
        showProgress: true,
        showStepNumbers: true,
        showStepIcons: true,
        allowSkipSteps: false,
        showStepValidation: true,
        steps: sampleSteps,
      },
    },
  }),
  parameters: {
    docs: {
      description: {
        story: 'Temas claro e escuro do template de wizard.',
      },
    },
  },
};

export const WithOptionalSteps: Story = {
  render: () => ({
    template: `
      <os-wizard-template
        [config]="configWithOptional"
        [currentStep]="'step1'"
      >
        <div style="padding: 20px;">
          <h3>Etapa com Passos Opcionais</h3>
          <p>Este wizard possui passos opcionais que podem ser pulados.</p>
        </div>
      </os-wizard-template>
    `,
    props: {
      configWithOptional: {
        title: 'Wizard com Passos Opcionais',
        subtitle: 'Alguns passos são opcionais',
        showBackButton: true,
        backUrl: '/dashboard',
        showNextButton: true,
        showPreviousButton: true,
        showFinishButton: true,
        showProgress: true,
        showStepNumbers: true,
        showStepIcons: true,
        allowSkipSteps: true,
        showStepValidation: true,
        steps: [
          {
            id: 'step1',
            title: 'Passo Obrigatório',
            subtitle: 'Informações essenciais',
            description: 'Este passo é obrigatório',
            icon: 'person',
            completed: false,
            disabled: false,
            optional: false,
          },
          {
            id: 'step2',
            title: 'Passo Opcional',
            subtitle: 'Configurações extras',
            description: 'Este passo é opcional e pode ser pulado',
            icon: 'settings',
            completed: false,
            disabled: false,
            optional: true,
          },
          {
            id: 'step3',
            title: 'Finalização',
            subtitle: 'Conclusão',
            description: 'Finalize o processo',
            icon: 'check_circle',
            completed: false,
            disabled: false,
            optional: false,
          },
        ],
      },
    },
  }),
  parameters: {
    docs: {
      description: {
        story: 'Wizard com passos opcionais que podem ser pulados.',
      },
    },
  },
};

export const WithCompletedSteps: Story = {
  render: () => ({
    template: `
      <os-wizard-template
        [config]="configWithCompleted"
        [currentStep]="'step3'"
      >
        <div style="padding: 20px;">
          <h3>Etapa Final</h3>
          <p>Algumas etapas já foram concluídas e estão marcadas com check.</p>
        </div>
      </os-wizard-template>
    `,
    props: {
      configWithCompleted: {
        title: 'Wizard com Etapas Concluídas',
        subtitle: 'Algumas etapas já foram finalizadas',
        showBackButton: true,
        backUrl: '/dashboard',
        showNextButton: true,
        showPreviousButton: true,
        showFinishButton: true,
        showProgress: true,
        showStepNumbers: true,
        showStepIcons: true,
        allowSkipSteps: false,
        showStepValidation: true,
        steps: [
          {
            id: 'step1',
            title: 'Informações Básicas',
            subtitle: 'Dados pessoais',
            description: 'Preencha suas informações pessoais básicas',
            icon: 'person',
            completed: true,
            disabled: false,
            optional: false,
          },
          {
            id: 'step2',
            title: 'Configurações',
            subtitle: 'Preferências',
            description: 'Configure suas preferências e opções',
            icon: 'settings',
            completed: true,
            disabled: false,
            optional: false,
          },
          {
            id: 'step3',
            title: 'Revisão',
            subtitle: 'Confirmação',
            description: 'Revise todas as informações antes de finalizar',
            icon: 'check_circle',
            completed: false,
            disabled: false,
            optional: false,
          },
        ],
      },
    },
  }),
  parameters: {
    docs: {
      description: {
        story: 'Wizard com etapas já concluídas marcadas com check.',
      },
    },
  },
};

export const WithoutProgress: Story = {
  render: () => ({
    template: `
      <os-wizard-template
        [config]="configWithoutProgress"
        [currentStep]="'step1'"
        [showProgress]="false"
      >
        <div style="padding: 20px;">
          <h3>Wizard sem Barra de Progresso</h3>
          <p>Este wizard não possui barra de progresso.</p>
        </div>
      </os-wizard-template>
    `,
    props: {
      configWithoutProgress: {
        title: 'Wizard sem Progresso',
        subtitle: 'Interface simplificada',
        showBackButton: true,
        backUrl: '/dashboard',
        showNextButton: true,
        showPreviousButton: true,
        showFinishButton: true,
        showProgress: false,
        showStepNumbers: true,
        showStepIcons: true,
        allowSkipSteps: false,
        showStepValidation: true,
        steps: sampleSteps,
      },
    },
  }),
  parameters: {
    docs: {
      description: {
        story: 'Wizard sem barra de progresso para uma interface mais limpa.',
      },
    },
  },
};

export const WithoutStepNavigation: Story = {
  render: () => ({
    template: `
      <os-wizard-template
        [config]="configWithoutNavigation"
        [currentStep]="'step1'"
        [showStepNavigation]="false"
      >
        <div style="padding: 20px;">
          <h3>Wizard sem Navegação de Etapas</h3>
          <p>Este wizard não mostra a navegação das etapas, apenas o conteúdo atual.</p>
        </div>
      </os-wizard-template>
    `,
    props: {
      configWithoutNavigation: {
        title: 'Wizard sem Navegação',
        subtitle: 'Interface minimalista',
        showBackButton: true,
        backUrl: '/dashboard',
        showNextButton: true,
        showPreviousButton: true,
        showFinishButton: true,
        showProgress: true,
        showStepNumbers: false,
        showStepIcons: false,
        allowSkipSteps: false,
        showStepValidation: true,
        steps: sampleSteps,
      },
    },
  }),
  parameters: {
    docs: {
      description: {
        story: 'Wizard sem navegação de etapas para uma interface mais limpa.',
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
          <os-wizard-template
            [config]="config"
            [currentStep]="'step1'"
            [loading]="true"
          >
            <div style="padding: 20px;">
              <p>Processando etapa atual...</p>
            </div>
          </os-wizard-template>
        </div>

        <div>
          <h4>Carregado</h4>
          <os-wizard-template
            [config]="config"
            [currentStep]="'step1'"
            [loading]="false"
          >
            <div style="padding: 20px;">
              <p>Wizard carregado com sucesso.</p>
            </div>
          </os-wizard-template>
        </div>
      </div>
    `,
    props: {
      config: {
        title: 'Wizard',
        showBackButton: true,
        backUrl: '/dashboard',
        showNextButton: true,
        showPreviousButton: true,
        showFinishButton: true,
        showProgress: true,
        showStepNumbers: true,
        showStepIcons: true,
        allowSkipSteps: false,
        showStepValidation: true,
        steps: sampleSteps,
      },
    },
  }),
  parameters: {
    docs: {
      description: {
        story: 'Estados de carregamento do template de wizard.',
      },
    },
  },
};

export const Interactive: Story = {
  args: {
    config: sampleConfig,
    currentStep: 'step1',
    size: 'medium',
    variant: 'default',
    theme: 'light',
    disabled: false,
    loading: false,
    showHeader: true,
    showProgress: true,
    showStepNavigation: true,
    showActions: true,
    showStepNumbers: true,
    showStepIcons: true,
    allowSkipSteps: false,
    showStepValidation: true,
  },
  render: (args) => ({
    props: args,
    template: `
      <os-wizard-template
        [config]="config"
        [currentStep]="currentStep"
        [size]="size"
        [variant]="variant"
        [theme]="theme"
        [disabled]="disabled"
        [loading]="loading"
        [showHeader]="showHeader"
        [showProgress]="showProgress"
        [showStepNavigation]="showStepNavigation"
        [showActions]="showActions"
        [showStepNumbers]="showStepNumbers"
        [showStepIcons]="showStepIcons"
        [allowSkipSteps]="allowSkipSteps"
        [showStepValidation]="showStepValidation"
        (next)="next()"
        (previous)="previous()"
        (finishWizard)="finishWizard()"
        (skip)="skip()"
        (stepClick)="stepClick($event)"
      >
        <div style="padding: 20px;">
          <h3>Wizard Interativo</h3>
          <p>Use os controles para testar diferentes configurações do wizard.</p>
          <div style="display: flex; flex-direction: column; gap: 16px;">
            <div>
              <label>Campo da Etapa:</label>
              <input type="text" placeholder="Digite aqui" style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;">
            </div>
            <div>
              <label>Seleção:</label>
              <select style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;">
                <option>Opção 1</option>
                <option>Opção 2</option>
                <option>Opção 3</option>
              </select>
            </div>
          </div>
        </div>
      </os-wizard-template>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Template de wizard interativo com controles para testar todas as propriedades.',
      },
    },
  },
};
