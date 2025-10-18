import type { Meta, StoryObj } from '@storybook/angular';
import { OsToggleComponent } from './os-toggle.component';

const meta: Meta<OsToggleComponent> = {
  title: 'Design System/Atoms/Toggle',
  component: OsToggleComponent,
  parameters: {
    docs: {
      description: {
        component:
          'Toggle refinado do Design System Orca Sonhos com acessibilidade WCAG 2.1 AA, touch targets adequados, animações e suporte completo a dark mode.',
      },
    },
  },
  argTypes: {
    id: {
      control: { type: 'text' },
      description: 'ID único do toggle',
    },
    name: {
      control: { type: 'text' },
      description: 'Nome do toggle para formulários',
    },
    label: {
      control: { type: 'text' },
      description: 'Label principal do toggle',
    },
    description: {
      control: { type: 'text' },
      description: 'Descrição adicional do toggle',
    },
    checked: {
      control: { type: 'boolean' },
      description: 'Estado ativado do toggle',
    },
    disabled: {
      control: { type: 'boolean' },
      description: 'Estado desabilitado do toggle',
    },
    required: {
      control: { type: 'boolean' },
      description: 'Indica se o toggle é obrigatório',
    },
    size: {
      control: { type: 'select' },
      options: ['small', 'medium', 'large'],
      description: 'Tamanho do toggle (touch targets >= 44px)',
    },
    variant: {
      control: { type: 'select' },
      options: ['primary', 'secondary', 'success', 'warning', 'danger'],
      description: 'Variante visual do toggle',
    },
    role: {
      control: { type: 'select' },
      options: ['switch', 'checkbox'],
      description: 'Role de acessibilidade do toggle',
    },
    animated: {
      control: { type: 'boolean' },
      description: 'Habilita animações e micro-interactions',
    },
    ariaLabel: {
      control: { type: 'text' },
      description: 'Label ARIA para acessibilidade',
    },
    ariaDescribedBy: {
      control: { type: 'text' },
      description: 'ID do elemento que descreve o toggle',
    },
    toggled: {
      action: 'toggled',
      description: 'Evento emitido quando o estado muda',
    },
    focused: {
      action: 'focused',
      description: 'Evento emitido quando o toggle recebe foco',
    },
    blurred: {
      action: 'blurred',
      description: 'Evento emitido quando o toggle perde foco',
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

export const WithDescription: Story = {
  args: {
    size: 'medium',
    variant: 'primary',
    label: 'Notificações push',
    description: 'Receba notificações instantâneas sobre transações e metas',
    checked: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Toggle com descrição adicional para melhor contexto.',
      },
    },
  },
};

export const AccessibilityRoles: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 16px; max-width: 400px;">
        <h3 style="margin: 0; font-size: 18px; font-weight: 600;">Roles de Acessibilidade</h3>

        <os-toggle
          role="switch"
          label="Modo escuro (switch)"
          description="Ativa/desativa o modo escuro"
          [checked]="true">
        </os-toggle>

        <os-toggle
          role="checkbox"
          label="Aceito os termos (checkbox)"
          description="Confirma que você leu e aceita os termos de uso"
          [checked]="false">
        </os-toggle>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Demonstração dos diferentes roles de acessibilidade (switch vs checkbox).',
      },
    },
  },
};

export const TouchTargets: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 16px; max-width: 400px;">
        <h3 style="margin: 0; font-size: 18px; font-weight: 600;">Touch Targets</h3>
        <p style="margin: 0; font-size: 14px; color: #666;">Todos os tamanhos atendem ao mínimo de 44px para mobile</p>

        <os-toggle
          size="small"
          variant="primary"
          label="Toggle pequeno (44px)"
          [checked]="false">
        </os-toggle>

        <os-toggle
          size="medium"
          variant="primary"
          label="Toggle médio (44px)"
          [checked]="false">
        </os-toggle>

        <os-toggle
          size="large"
          variant="primary"
          label="Toggle grande (48px)"
          [checked]="false">
        </os-toggle>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Demonstração dos touch targets adequados para mobile (>= 44px).',
      },
    },
  },
};

export const AnimationStates: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 16px; max-width: 400px;">
        <h3 style="margin: 0; font-size: 18px; font-weight: 600;">Estados de Animação</h3>

        <os-toggle
          animated="true"
          label="Com animações"
          description="Hover e active states animados"
          [checked]="false">
        </os-toggle>

        <os-toggle
          animated="false"
          label="Sem animações"
          description="Ideal para usuários que preferem reduced motion"
          [checked]="false">
        </os-toggle>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Demonstração dos estados de animação (com e sem animações).',
      },
    },
  },
};

export const AccessibilityFeatures: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 16px; max-width: 400px;">
        <h3 style="margin: 0; font-size: 18px; font-weight: 600;">Recursos de Acessibilidade</h3>

        <os-toggle
          ariaLabel="Configuração de privacidade"
          label="Perfil público"
          description="Torna seu perfil visível para outros usuários"
          [checked]="false">
        </os-toggle>

        <os-toggle
          ariaLabel="Notificação de transações"
          ariaDescribedBy="transaction-desc"
          label="Notificações de transações"
          [checked]="true">
        </os-toggle>

        <div id="transaction-desc" style="font-size: 12px; color: #666; margin-top: -8px;">
          Receba alertas quando houver movimentações em suas contas
        </div>

        <os-toggle
          required="true"
          label="Aceito os termos"
          description="Campo obrigatório para continuar"
          [checked]="false">
        </os-toggle>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Demonstração dos recursos de acessibilidade WCAG 2.1 AA.',
      },
    },
  },
};
