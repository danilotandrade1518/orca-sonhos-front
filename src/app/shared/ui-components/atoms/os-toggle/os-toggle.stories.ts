import type { Meta, StoryObj } from '@storybook/angular';
import { OsToggleComponent } from './os-toggle.component';

const meta: Meta<OsToggleComponent> = {
  title: 'Design System/Atoms/Toggle',
  component: OsToggleComponent,
  parameters: {
    docs: {
      description: {
        component:
          'Toggle do Design System Orca Sonhos com 5 variantes, 3 tamanhos e integração com Angular Forms.',
      },
    },
  },
  argTypes: {
    id: {
      control: { type: 'text' },
      description: 'ID do toggle',
    },
    name: {
      control: { type: 'text' },
      description: 'Nome do toggle',
    },
    label: {
      control: { type: 'text' },
      description: 'Label do toggle',
    },
    checked: {
      control: { type: 'boolean' },
      description: 'Estado ativado',
    },
    disabled: {
      control: { type: 'boolean' },
      description: 'Estado desabilitado',
    },
    size: {
      control: { type: 'select' },
      options: ['small', 'medium', 'large'],
      description: 'Tamanho do toggle',
    },
    variant: {
      control: { type: 'select' },
      options: ['primary', 'secondary', 'success', 'warning', 'danger'],
      description: 'Variante visual do toggle',
    },
    toggled: {
      action: 'toggled',
      description: 'Evento de mudança de estado',
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<OsToggleComponent>;

export const Default: Story = {
  args: {
    size: 'medium',
    variant: 'primary',
    label: 'Toggle padrão',
    checked: false,
  },
};

export const Primary: Story = {
  args: {
    size: 'medium',
    variant: 'primary',
    label: 'Toggle primário',
    checked: true,
  },
};

export const Secondary: Story = {
  args: {
    size: 'medium',
    variant: 'secondary',
    label: 'Toggle secundário',
    checked: false,
  },
};

export const Success: Story = {
  args: {
    size: 'medium',
    variant: 'success',
    label: 'Toggle de sucesso',
    checked: true,
  },
};

export const Warning: Story = {
  args: {
    size: 'medium',
    variant: 'warning',
    label: 'Toggle de aviso',
    checked: false,
  },
};

export const Danger: Story = {
  args: {
    size: 'medium',
    variant: 'danger',
    label: 'Toggle de perigo',
    checked: true,
  },
};

export const Small: Story = {
  args: {
    size: 'small',
    variant: 'primary',
    label: 'Toggle pequeno',
    checked: false,
  },
};

export const Large: Story = {
  args: {
    size: 'large',
    variant: 'primary',
    label: 'Toggle grande',
    checked: true,
  },
};

export const Checked: Story = {
  args: {
    size: 'medium',
    variant: 'primary',
    label: 'Toggle ativado',
    checked: true,
  },
};

export const Disabled: Story = {
  args: {
    size: 'medium',
    variant: 'primary',
    label: 'Toggle desabilitado',
    checked: false,
    disabled: true,
  },
};

export const DisabledChecked: Story = {
  args: {
    size: 'medium',
    variant: 'primary',
    label: 'Toggle desabilitado e ativado',
    checked: true,
    disabled: true,
  },
};

export const WithoutLabel: Story = {
  args: {
    size: 'medium',
    variant: 'primary',
    checked: false,
  },
};

export const AllSizes: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 16px;">
        <os-toggle
          size="small"
          variant="primary"
          label="Toggle pequeno"
          [checked]="false">
        </os-toggle>
        <os-toggle
          size="medium"
          variant="primary"
          label="Toggle médio"
          [checked]="false">
        </os-toggle>
        <os-toggle
          size="large"
          variant="primary"
          label="Toggle grande"
          [checked]="false">
        </os-toggle>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Demonstração de todos os tamanhos disponíveis do toggle.',
      },
    },
  },
};

export const AllVariants: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 16px;">
        <os-toggle
          variant="primary"
          label="Toggle primário"
          [checked]="true">
        </os-toggle>
        <os-toggle
          variant="secondary"
          label="Toggle secundário"
          [checked]="true">
        </os-toggle>
        <os-toggle
          variant="success"
          label="Toggle de sucesso"
          [checked]="true">
        </os-toggle>
        <os-toggle
          variant="warning"
          label="Toggle de aviso"
          [checked]="true">
        </os-toggle>
        <os-toggle
          variant="danger"
          label="Toggle de perigo"
          [checked]="true">
        </os-toggle>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Demonstração de todas as variantes disponíveis do toggle.',
      },
    },
  },
};

export const States: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 16px;">
        <os-toggle
          variant="primary"
          label="Estado normal"
          [checked]="false">
        </os-toggle>
        <os-toggle
          variant="primary"
          label="Estado ativado"
          [checked]="true">
        </os-toggle>
        <os-toggle
          variant="default"
          label="Estado desabilitado"
          [checked]="false"
          [disabled]="true">
        </os-toggle>
        <os-toggle
          variant="primary"
          label="Estado desabilitado e ativado"
          [checked]="true"
          [disabled]="true">
        </os-toggle>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Demonstração dos diferentes estados do toggle.',
      },
    },
  },
};

export const SettingsExample: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 16px; max-width: 400px;">
        <h3 style="margin: 0; font-size: 18px; font-weight: 600;">Configurações de Notificação</h3>

        <os-toggle
          variant="primary"
          label="Notificações por email"
          [checked]="true">
        </os-toggle>

        <os-toggle
          variant="primary"
          label="Notificações push"
          [checked]="false">
        </os-toggle>

        <os-toggle
          variant="primary"
          label="Notificações de marketing"
          [checked]="false">
        </os-toggle>

        <os-toggle
          variant="primary"
          label="Notificações de segurança"
          [checked]="true">
        </os-toggle>

        <os-toggle
          variant="primary"
          label="Notificações de transações"
          [checked]="true">
        </os-toggle>

        <os-toggle
          variant="primary"
          label="Notificações de relatórios"
          [checked]="false">
        </os-toggle>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Exemplo de uso em configurações de notificação.',
      },
    },
  },
};

export const FormExample: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 16px; max-width: 400px;">
        <h3 style="margin: 0; font-size: 18px; font-weight: 600;">Preferências de Conta</h3>

        <div>
          <h4 style="margin: 0 0 8px 0; font-size: 14px; font-weight: 600;">Privacidade:</h4>
          <div style="display: flex; flex-direction: column; gap: 8px;">
            <os-toggle
              variant="primary"
              label="Perfil público"
              [checked]="false">
            </os-toggle>
            <os-toggle
              variant="primary"
              label="Mostrar saldo"
              [checked]="true">
            </os-toggle>
            <os-toggle
              variant="primary"
              label="Permitir busca"
              [checked]="false">
            </os-toggle>
          </div>
        </div>

        <div>
          <h4 style="margin: 0 0 8px 0; font-size: 14px; font-weight: 600;">Segurança:</h4>
          <div style="display: flex; flex-direction: column; gap: 8px;">
            <os-toggle
              variant="success"
              label="Autenticação de dois fatores"
              [checked]="true">
            </os-toggle>
            <os-toggle
              variant="primary"
              label="Login biométrico"
              [checked]="false">
            </os-toggle>
            <os-toggle
              variant="primary"
              label="Sessões seguras"
              [checked]="true">
            </os-toggle>
          </div>
        </div>

        <div>
          <h4 style="margin: 0 0 8px 0; font-size: 14px; font-weight: 600;">Experiência:</h4>
          <div style="display: flex; flex-direction: column; gap: 8px;">
            <os-toggle
              variant="primary"
              label="Modo escuro"
              [checked]="false">
            </os-toggle>
            <os-toggle
              variant="primary"
              label="Animações"
              [checked]="true">
            </os-toggle>
            <os-toggle
              variant="primary"
              label="Som de notificação"
              [checked]="true">
            </os-toggle>
          </div>
        </div>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Exemplo de uso em um formulário de preferências de conta.',
      },
    },
  },
};

export const ToggleGroup: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 16px; max-width: 400px;">
        <h3 style="margin: 0; font-size: 18px; font-weight: 600;">Filtros de Transação</h3>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
          <os-toggle
            variant="success"
            label="Receitas"
            [checked]="true">
          </os-toggle>
          <os-toggle
            variant="danger"
            label="Despesas"
            [checked]="true">
          </os-toggle>
          <os-toggle
            variant="primary"
            label="Transferências"
            [checked]="false">
          </os-toggle>
          <os-toggle
            variant="warning"
            label="Investimentos"
            [checked]="false">
          </os-toggle>
        </div>

        <div style="padding: 16px; background: #f5f5f5; border-radius: 8px; margin-top: 8px;">
          <h4 style="margin: 0 0 8px 0; font-size: 14px; font-weight: 600;">Período:</h4>
          <div style="display: flex; flex-direction: column; gap: 8px;">
            <os-toggle
              variant="primary"
              label="Últimos 30 dias"
              [checked]="true">
            </os-toggle>
            <os-toggle
              variant="primary"
              label="Últimos 3 meses"
              [checked]="false">
            </os-toggle>
            <os-toggle
              variant="primary"
              label="Último ano"
              [checked]="false">
            </os-toggle>
          </div>
        </div>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Exemplo de uso em um grupo de filtros.',
      },
    },
  },
};

