import type { Meta, StoryObj } from '@storybook/angular';
import { OsCheckboxComponent } from './os-checkbox.component';

const meta: Meta<OsCheckboxComponent> = {
  title: 'Design System/Atoms/Checkbox',
  component: OsCheckboxComponent,
  parameters: {
    docs: {
      description: {
        component:
          'Checkbox do Design System Orca Sonhos com 3 variantes, 3 tamanhos e estados de seleção.',
      },
    },
  },
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['default', 'primary', 'secondary', 'success', 'warning', 'error'],
      description: 'Variante visual do checkbox',
    },
    size: {
      control: { type: 'select' },
      options: ['small', 'medium', 'large'],
      description: 'Tamanho do checkbox',
    },
    label: {
      control: { type: 'text' },
      description: 'Label do checkbox',
    },
    checked: {
      control: { type: 'boolean' },
      description: 'Estado marcado',
    },
    indeterminate: {
      control: { type: 'boolean' },
      description: 'Estado indeterminado',
    },
    disabled: {
      control: { type: 'boolean' },
      description: 'Estado desabilitado',
    },
    required: {
      control: { type: 'boolean' },
      description: 'Campo obrigatório',
    },
    ariaDescribedBy: {
      control: { type: 'text' },
      description: 'ID do elemento que descreve o checkbox',
    },
    ariaLabel: {
      control: { type: 'text' },
      description: 'Label de acessibilidade',
    },
    checkboxChange: {
      action: 'checkboxChange',
      description: 'Evento de mudança de estado',
    },
    checkboxFocusEvent: {
      action: 'checkboxFocusEvent',
      description: 'Evento de foco',
    },
    checkboxBlurEvent: {
      action: 'checkboxBlurEvent',
      description: 'Evento de perda de foco',
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<OsCheckboxComponent>;

export const Default: Story = {
  args: {
    variant: 'default',
    size: 'medium',
    label: 'Checkbox Padrão',
    checked: false,
    indeterminate: false,
    disabled: false,
    required: false,
    ariaDescribedBy: '',
    ariaLabel: '',
  },
  render: (args) => ({
    props: args,
    template:
      '<os-checkbox [variant]="variant" [size]="size" [label]="label" [checked]="checked" [indeterminate]="indeterminate" [disabled]="disabled" [required]="required" [ariaDescribedBy]="ariaDescribedBy" [ariaLabel]="ariaLabel" (checkboxChange)="checkboxChange($event)" (checkboxFocusEvent)="checkboxFocusEvent($event)" (checkboxBlurEvent)="checkboxBlurEvent($event)"></os-checkbox>',
  }),
};

export const Variants: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 16px;">
        <os-checkbox variant="default" label="Checkbox Padrão"></os-checkbox>
        <os-checkbox variant="switch" label="Switch Toggle"></os-checkbox>
        <os-checkbox variant="toggle" label="Toggle Button"></os-checkbox>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Todas as variantes disponíveis do checkbox.',
      },
    },
  },
};

export const Sizes: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 16px;">
        <os-checkbox size="small" label="Checkbox Pequeno"></os-checkbox>
        <os-checkbox size="medium" label="Checkbox Médio"></os-checkbox>
        <os-checkbox size="large" label="Checkbox Grande"></os-checkbox>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Todos os tamanhos disponíveis do checkbox.',
      },
    },
  },
};

export const States: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 16px;">
        <os-checkbox label="Normal" checked="false"></os-checkbox>
        <os-checkbox label="Marcado" checked="true"></os-checkbox>
        <os-checkbox label="Indeterminado" indeterminate="true"></os-checkbox>
        <os-checkbox label="Desabilitado" disabled="true"></os-checkbox>
        <os-checkbox label="Obrigatório" required="true"></os-checkbox>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Diferentes estados do checkbox.',
      },
    },
  },
};

export const FormExample: Story = {
  render: () => ({
    template: `
      <form style="display: flex; flex-direction: column; gap: 16px; max-width: 400px; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
        <h3 style="margin: 0 0 16px 0;">Configurações de Notificação</h3>

        <os-checkbox label="Receber emails de marketing" checked="true"></os-checkbox>
        <os-checkbox label="Notificações push" checked="false"></os-checkbox>
        <os-checkbox label="Lembretes por SMS" checked="true"></os-checkbox>
        <os-checkbox label="Atualizações de segurança" checked="true" required="true"></os-checkbox>

        <div style="margin-top: 16px;">
          <os-checkbox variant="switch" label="Modo escuro" size="large"></os-checkbox>
        </div>
      </form>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Exemplo de uso em formulário com diferentes tipos de checkbox.',
      },
    },
  },
};

export const SwitchExamples: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 16px;">
        <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px; border: 1px solid #ddd; border-radius: 4px;">
          <span>Wi-Fi</span>
          <os-checkbox variant="switch" size="medium"></os-checkbox>
        </div>
        <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px; border: 1px solid #ddd; border-radius: 4px;">
          <span>Bluetooth</span>
          <os-checkbox variant="switch" size="medium" checked="true"></os-checkbox>
        </div>
        <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px; border: 1px solid #ddd; border-radius: 4px;">
          <span>Localização</span>
          <os-checkbox variant="switch" size="medium"></os-checkbox>
        </div>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Exemplos de uso como switches em configurações.',
      },
    },
  },
};

export const Interactive: Story = {
  args: {
    variant: 'default',
    size: 'medium',
    label: 'Checkbox Interativo',
    checked: false,
    indeterminate: false,
    disabled: false,
    required: false,
    ariaDescribedBy: '',
    ariaLabel: '',
  },
  render: (args) => ({
    props: args,
    template:
      '<os-checkbox [variant]="variant" [size]="size" [label]="label" [checked]="checked" [indeterminate]="indeterminate" [disabled]="disabled" [required]="required" [ariaDescribedBy]="ariaDescribedBy" [ariaLabel]="ariaLabel" (checkboxChange)="checkboxChange($event)" (checkboxFocusEvent)="checkboxFocusEvent($event)" (checkboxBlurEvent)="checkboxBlurEvent($event)"></os-checkbox>',
  }),
  parameters: {
    docs: {
      description: {
        story: 'Checkbox interativo com controles para testar todas as propriedades.',
      },
    },
  },
};
