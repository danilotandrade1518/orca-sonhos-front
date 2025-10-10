import type { Meta, StoryObj } from '@storybook/angular';
import { OsTooltipComponent } from './os-tooltip.component';

const meta: Meta<OsTooltipComponent> = {
  title: 'Design System/Molecules/Tooltip',
  component: OsTooltipComponent,
  parameters: {
    docs: {
      description: {
        component:
          'Tooltip do Design System Orca Sonhos com 8 variantes, 3 tamanhos e 6 posições.',
      },
    },
  },
  argTypes: {
    tooltipText: {
      control: { type: 'text' },
      description: 'Texto do tooltip',
    },
    position: {
      control: { type: 'select' },
      options: ['above', 'below', 'left', 'right', 'before', 'after'],
      description: 'Posição do tooltip',
    },
    size: {
      control: { type: 'select' },
      options: ['small', 'medium', 'large'],
      description: 'Tamanho do tooltip',
    },
    variant: {
      control: { type: 'select' },
      options: ['default', 'primary', 'secondary', 'accent', 'error', 'warning', 'info', 'success'],
      description: 'Variante visual do tooltip',
    },
    disabled: {
      control: { type: 'boolean' },
      description: 'Tooltip desabilitado',
    },
    hideDelay: {
      control: { type: 'number' },
      description: 'Delay para esconder (ms)',
    },
    showDelay: {
      control: { type: 'number' },
      description: 'Delay para mostrar (ms)',
    },
    touchGestures: {
      control: { type: 'select' },
      options: ['auto', 'on', 'off'],
      description: 'Gestos de toque',
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<OsTooltipComponent>;

export const Default: Story = {
  args: {
    tooltipText: 'Este é um tooltip padrão',
    position: 'above',
    size: 'medium',
    variant: 'default',
    disabled: false,
    hideDelay: 0,
    showDelay: 0,
    touchGestures: 'auto',
  },
  render: (args) => ({
    props: args,
    template: `
      <os-tooltip 
        [tooltipText]="tooltipText"
        [position]="position"
        [size]="size"
        [variant]="variant"
        [disabled]="disabled"
        [hideDelay]="hideDelay"
        [showDelay]="showDelay"
        [touchGestures]="touchGestures"
      >
        <os-button>Hover me</os-button>
      </os-tooltip>
    `,
  }),
};

export const Positions: Story = {
  render: () => ({
    template: `
      <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 40px; padding: 40px; text-align: center;">
        <div></div>
        <os-tooltip tooltipText="Tooltip acima" position="above">
          <os-button>Above</os-button>
        </os-tooltip>
        <div></div>
        
        <os-tooltip tooltipText="Tooltip à esquerda" position="left">
          <os-button>Left</os-button>
        </os-tooltip>
        <div style="display: flex; justify-content: center; align-items: center; height: 60px;">
          <span>Hover nos botões</span>
        </div>
        <os-tooltip tooltipText="Tooltip à direita" position="right">
          <os-button>Right</os-button>
        </os-tooltip>
        
        <div></div>
        <os-tooltip tooltipText="Tooltip abaixo" position="below">
          <os-button>Below</os-button>
        </os-tooltip>
        <div></div>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Todas as posições disponíveis do tooltip.',
      },
    },
  },
};

export const Variants: Story = {
  render: () => ({
    template: `
      <div style="display: flex; gap: 16px; flex-wrap: wrap; padding: 20px;">
        <os-tooltip tooltipText="Tooltip padrão" variant="default">
          <os-button variant="primary">Default</os-button>
        </os-tooltip>
        
        <os-tooltip tooltipText="Tooltip primário" variant="primary">
          <os-button variant="primary">Primary</os-button>
        </os-tooltip>
        
        <os-tooltip tooltipText="Tooltip secundário" variant="secondary">
          <os-button variant="secondary">Secondary</os-button>
        </os-tooltip>
        
        <os-tooltip tooltipText="Tooltip de destaque" variant="accent">
          <os-button variant="tertiary">Accent</os-button>
        </os-tooltip>
        
        <os-tooltip tooltipText="Tooltip de erro" variant="error">
          <os-button variant="danger">Error</os-button>
        </os-tooltip>
        
        <os-tooltip tooltipText="Tooltip de aviso" variant="warning">
          <os-button variant="secondary">Warning</os-button>
        </os-tooltip>
        
        <os-tooltip tooltipText="Tooltip informativo" variant="info">
          <os-button variant="tertiary">Info</os-button>
        </os-tooltip>
        
        <os-tooltip tooltipText="Tooltip de sucesso" variant="success">
          <os-button variant="primary">Success</os-button>
        </os-tooltip>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Todas as variantes disponíveis do tooltip.',
      },
    },
  },
};

export const Sizes: Story = {
  render: () => ({
    template: `
      <div style="display: flex; gap: 16px; align-items: center; padding: 20px;">
        <os-tooltip tooltipText="Tooltip pequeno" size="small">
          <os-button size="small">Small</os-button>
        </os-tooltip>
        
        <os-tooltip tooltipText="Tooltip médio" size="medium">
          <os-button size="medium">Medium</os-button>
        </os-tooltip>
        
        <os-tooltip tooltipText="Tooltip grande" size="large">
          <os-button size="large">Large</os-button>
        </os-tooltip>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Todos os tamanhos disponíveis do tooltip.',
      },
    },
  },
};

export const WithIcons: Story = {
  render: () => ({
    template: `
      <div style="display: flex; gap: 16px; flex-wrap: wrap; padding: 20px;">
        <os-tooltip tooltipText="Ícone de usuário" variant="info">
          <os-icon name="fa fa-user" size="large"></os-icon>
        </os-tooltip>
        
        <os-tooltip tooltipText="Ícone de configurações" variant="primary">
          <os-icon name="fa fa-cog" size="large"></os-icon>
        </os-tooltip>
        
        <os-tooltip tooltipText="Ícone de ajuda" variant="secondary">
          <os-icon name="fa fa-question-circle" size="large"></os-icon>
        </os-tooltip>
        
        <os-tooltip tooltipText="Ícone de informação" variant="info">
          <os-icon name="fa fa-info-circle" size="large"></os-icon>
        </os-tooltip>
        
        <os-tooltip tooltipText="Ícone de aviso" variant="warning">
          <os-icon name="fa fa-exclamation-triangle" size="large"></os-icon>
        </os-tooltip>
        
        <os-tooltip tooltipText="Ícone de erro" variant="error">
          <os-icon name="fa fa-times-circle" size="large"></os-icon>
        </os-tooltip>
        
        <os-tooltip tooltipText="Ícone de sucesso" variant="success">
          <os-icon name="fa fa-check-circle" size="large"></os-icon>
        </os-tooltip>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Tooltips com ícones para diferentes contextos.',
      },
    },
  },
};

export const WithDelays: Story = {
  render: () => ({
    template: `
      <div style="display: flex; gap: 16px; flex-wrap: wrap; padding: 20px;">
        <os-tooltip tooltipText="Aparece imediatamente" [showDelay]="0" [hideDelay]="0">
          <os-button>Sem Delay</os-button>
        </os-tooltip>
        
        <os-tooltip tooltipText="Aparece após 500ms" [showDelay]="500" [hideDelay]="200">
          <os-button>Delay 500ms</os-button>
        </os-tooltip>
        
        <os-tooltip tooltipText="Aparece após 1s" [showDelay]="1000" [hideDelay]="500">
          <os-button>Delay 1s</os-button>
        </os-tooltip>
        
        <os-tooltip tooltipText="Fica visível por 2s" [showDelay]="0" [hideDelay]="2000">
          <os-button>Hide 2s</os-button>
        </os-tooltip>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Tooltips com diferentes delays de exibição e ocultação.',
      },
    },
  },
};

export const Disabled: Story = {
  render: () => ({
    template: `
      <div style="display: flex; gap: 16px; flex-wrap: wrap; padding: 20px;">
        <os-tooltip tooltipText="Este tooltip está desabilitado" [disabled]="true">
          <os-button>Desabilitado</os-button>
        </os-tooltip>
        
        <os-tooltip tooltipText="Este tooltip está habilitado" [disabled]="false">
          <os-button>Habilitado</os-button>
        </os-tooltip>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Tooltips habilitados e desabilitados.',
      },
    },
  },
};

export const LongText: Story = {
  render: () => ({
    template: `
      <div style="display: flex; gap: 16px; flex-wrap: wrap; padding: 20px;">
        <os-tooltip tooltipText="Este é um tooltip com texto longo que demonstra como o componente se comporta com conteúdo extenso. O tooltip deve se ajustar automaticamente ao tamanho do texto." variant="info">
          <os-button>Texto Longo</os-button>
        </os-tooltip>
        
        <os-tooltip tooltipText="Tooltip com múltiplas linhas de texto que pode conter informações detalhadas sobre o elemento que está sendo destacado." variant="primary" size="large">
          <os-button>Múltiplas Linhas</os-button>
        </os-tooltip>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Tooltips com texto longo e múltiplas linhas.',
      },
    },
  },
};

export const Interactive: Story = {
  args: {
    tooltipText: 'Tooltip interativo',
    position: 'above',
    size: 'medium',
    variant: 'default',
    disabled: false,
    hideDelay: 0,
    showDelay: 0,
    touchGestures: 'auto',
  },
  render: (args) => ({
    props: args,
    template: `
      <os-tooltip 
        [tooltipText]="tooltipText"
        [position]="position"
        [size]="size"
        [variant]="variant"
        [disabled]="disabled"
        [hideDelay]="hideDelay"
        [showDelay]="showDelay"
        [touchGestures]="touchGestures"
      >
        <os-button>Hover me</os-button>
      </os-tooltip>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Tooltip interativo com controles para testar todas as propriedades.',
      },
    },
  },
};

