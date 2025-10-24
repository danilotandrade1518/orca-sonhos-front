import type { Meta, StoryObj } from '@storybook/angular';
import { OsDatePickerComponent } from './os-date-picker.component';

const meta: Meta<OsDatePickerComponent> = {
  title: 'Design System/Molecules/Date Picker',
  component: OsDatePickerComponent,
  parameters: {
    docs: {
      description: {
        component: `
# Date Picker

Seletor de data refinado do Design System Orca Sonhos com suporte a:
- 3 variantes (default, outlined, filled)
- 3 tamanhos (small, medium, large)
- Seleção rápida de datas (hoje, amanhã, próxima semana, próximo mês)
- Interface mobile-friendly com touch targets >= 44px
- Suporte a range de datas
- Indicador visual de "hoje"
- Validação de datas mínimas e máximas
- Acessibilidade WCAG 2.1 AA completa
- Keyboard navigation completa

## Novos Recursos

- **Quick Selection**: Botões rápidos para selecionar datas comuns
- **Today Indicator**: Destaque visual quando a data selecionada é hoje
- **Range Picker**: Suporte para seleção de intervalo de datas
- **Mobile-Friendly**: Interface otimizada para dispositivos móveis
- **Auto Helper Text**: Texto de ajuda automático com formato de data
        `,
      },
    },
  },
  argTypes: {
    value: {
      control: { type: 'date' },
      description: 'Data selecionada',
    },
    label: {
      control: { type: 'text' },
      description: 'Rótulo do campo',
    },
    placeholder: {
      control: { type: 'text' },
      description: 'Texto placeholder',
    },
    helperText: {
      control: { type: 'text' },
      description: 'Texto de ajuda (auto-gerado se vazio)',
    },
    size: {
      control: { type: 'select' },
      options: ['small', 'medium', 'large'],
      description: 'Tamanho do componente',
    },
    variant: {
      control: { type: 'select' },
      options: ['default', 'outlined', 'filled'],
      description: 'Variante visual do componente',
    },
    required: {
      control: { type: 'boolean' },
      description: 'Campo obrigatório',
    },
    disabled: {
      control: { type: 'boolean' },
      description: 'Campo desabilitado',
    },
    minDate: {
      control: { type: 'date' },
      description: 'Data mínima permitida',
    },
    maxDate: {
      control: { type: 'date' },
      description: 'Data máxima permitida',
    },
    touchUi: {
      control: { type: 'boolean' },
      description: 'Interface touch para dispositivos móveis',
    },
    mobileFriendly: {
      control: { type: 'boolean' },
      description: 'Otimizações mobile-friendly (touch targets >= 44px)',
    },
    showQuickSelection: {
      control: { type: 'boolean' },
      description: 'Mostrar botões de seleção rápida',
    },
    showTodayIndicator: {
      control: { type: 'boolean' },
      description: 'Mostrar indicador quando a data é hoje',
    },
    isRangePicker: {
      control: { type: 'boolean' },
      description: 'Modo de seleção de intervalo',
    },
    calendarIcon: {
      control: { type: 'text' },
      description: 'Ícone do calendário',
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<OsDatePickerComponent>;

export const Default: Story = {
  args: {
    value: null,
    label: 'Data de Nascimento',
    placeholder: 'Selecionar data',
    helperText: '',
    size: 'medium',
    variant: 'default',
    required: false,
    disabled: false,
    minDate: null,
    maxDate: null,
    touchUi: false,
    mobileFriendly: true,
    showQuickSelection: false,
    showTodayIndicator: true,
    isRangePicker: false,
    calendarIcon: 'calendar_today',
  },
};

export const Variants: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 24px;">
        <div>
          <h4>Default</h4>
          <os-date-picker
            label="Data de Nascimento"
            placeholder="Selecionar data"
            variant="default"
          ></os-date-picker>
        </div>

        <div>
          <h4>Outlined</h4>
          <os-date-picker
            label="Data de Nascimento"
            placeholder="Selecionar data"
            variant="outlined"
          ></os-date-picker>
        </div>

        <div>
          <h4>Filled</h4>
          <os-date-picker
            label="Data de Nascimento"
            placeholder="Selecionar data"
            variant="filled"
          ></os-date-picker>
        </div>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Todas as variantes disponíveis do seletor de data.',
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
          <os-date-picker
            label="Data de Nascimento"
            placeholder="Selecionar data"
            size="small"
          ></os-date-picker>
        </div>

        <div>
          <h4>Medium (Padrão)</h4>
          <os-date-picker
            label="Data de Nascimento"
            placeholder="Selecionar data"
            size="medium"
          ></os-date-picker>
        </div>

        <div>
          <h4>Large</h4>
          <os-date-picker
            label="Data de Nascimento"
            placeholder="Selecionar data"
            size="large"
          ></os-date-picker>
        </div>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story:
          'Todos os tamanhos disponíveis do seletor de data com touch targets >= 44px em mobile.',
      },
    },
  },
};

export const WithQuickSelection: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 24px;">
        <div>
          <h4>Com Seleção Rápida (Opções Padrão)</h4>
          <os-date-picker
            label="Data de Meta"
            placeholder="Selecionar data"
            [showQuickSelection]="true"
            helperText="Use os botões para seleção rápida"
          ></os-date-picker>
        </div>

        <div>
          <h4>Sem Seleção Rápida</h4>
          <os-date-picker
            label="Data de Nascimento"
            placeholder="Selecionar data"
            [showQuickSelection]="false"
          ></os-date-picker>
        </div>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: `
Seletor de data com botões de seleção rápida para datas comuns:
- **Hoje**: Seleciona a data atual
- **Amanhã**: Seleciona o próximo dia
- **Próxima Semana**: Seleciona 7 dias à frente
- **Próximo Mês**: Seleciona 1 mês à frente

Perfeito para metas SMART onde prazos comuns são frequentemente usados.
        `,
      },
    },
  },
};

export const TodayIndicator: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 24px;">
        <div>
          <h4>Data Atual (Com Indicador)</h4>
          <os-date-picker
            label="Data Selecionada"
            placeholder="Selecionar data"
            [value]="new Date()"
            [showTodayIndicator]="true"
          ></os-date-picker>
        </div>

        <div>
          <h4>Data Passada (Sem Indicador)</h4>
          <os-date-picker
            label="Data Selecionada"
            placeholder="Selecionar data"
            [value]="new Date('2020-01-15')"
            [showTodayIndicator]="true"
          ></os-date-picker>
        </div>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Indicador visual destacado quando a data selecionada é a data atual (hoje).',
      },
    },
  },
};

export const RangePicker: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 24px;">
        <div>
          <h4>Seleção de Intervalo</h4>
          <os-date-picker
            label="Data Inicial"
            endDateLabel="Data Final"
            placeholder="Selecionar data inicial"
            endDatePlaceholder="Selecionar data final"
            helperText="Selecione o período desejado"
            [isRangePicker]="true"
            [showRangeEnd]="true"
          ></os-date-picker>
        </div>

        <div>
          <h4>Com Seleção Rápida</h4>
          <os-date-picker
            label="Data Inicial"
            endDateLabel="Data Final"
            placeholder="Selecionar data inicial"
            [isRangePicker]="true"
            [showRangeEnd]="true"
            [showQuickSelection]="true"
            helperText="Use a seleção rápida para a data inicial"
          ></os-date-picker>
        </div>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: `
Seletor de intervalo de datas para relatórios e filtros:
- **Responsivo**: Empilhado em mobile, lado a lado em desktop
- **Validação**: Data final não pode ser anterior à data inicial
- **Seleção Rápida**: Opções rápidas aplicam apenas à data inicial
        `,
      },
    },
  },
};

export const WithValidation: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 24px;">
        <div>
          <h4>Data Mínima (Hoje)</h4>
          <os-date-picker
            label="Data de Início"
            placeholder="Selecionar data"
            helperText="Data não pode ser anterior a hoje"
            [minDate]="new Date()"
            [showQuickSelection]="true"
          ></os-date-picker>
        </div>

        <div>
          <h4>Data Máxima (Fim do Ano)</h4>
          <os-date-picker
            label="Data de Fim"
            placeholder="Selecionar data"
            helperText="Data não pode ser posterior a 31/12/2024"
            [maxDate]="new Date('2024-12-31')"
          ></os-date-picker>
        </div>

        <div>
          <h4>Intervalo Específico</h4>
          <os-date-picker
            label="Data de Evento"
            placeholder="Selecionar data"
            helperText="Data deve estar entre 01/01/2024 e 31/12/2024"
            [minDate]="new Date('2024-01-01')"
            [maxDate]="new Date('2024-12-31')"
          ></os-date-picker>
        </div>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story:
          'Seletor de data com validação de datas mínimas e máximas para metas SMART com prazos definidos.',
      },
    },
  },
};

export const MobileFriendly: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 24px; max-width: 375px;">
        <div>
          <h4>Mobile-Friendly (Padrão)</h4>
          <os-date-picker
            label="Data de Meta"
            placeholder="Selecionar data"
            [mobileFriendly]="true"
            [showQuickSelection]="true"
            helperText="Touch targets >= 44px, layout otimizado"
          ></os-date-picker>
        </div>

        <div>
          <h4>Com Intervalo</h4>
          <os-date-picker
            label="Data Inicial"
            endDateLabel="Data Final"
            [isRangePicker]="true"
            [showRangeEnd]="true"
            [mobileFriendly]="true"
            helperText="Empilhado verticalmente em mobile"
          ></os-date-picker>
        </div>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: `
Interface otimizada para dispositivos móveis:
- **Touch Targets**: Todos os elementos interativos >= 44px
- **Layout Responsivo**: Empilhamento inteligente em telas pequenas
- **Seleção Rápida**: Botões full-width em telas < 375px
- **Calendário**: Full-screen em mobile para melhor usabilidade
        `,
      },
    },
  },
};

export const WithHelperText: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 24px;">
        <os-date-picker
          label="Data de Nascimento"
          placeholder="Selecionar data"
          helperText="Digite sua data de nascimento no formato DD/MM/AAAA"
        ></os-date-picker>

        <os-date-picker
          label="Data de Vencimento"
          placeholder="Selecionar data"
          helperText="Data de vencimento do pagamento"
          [required]="true"
        ></os-date-picker>

        <os-date-picker
          label="Data de Agendamento"
          placeholder="Selecionar data"
          [minDate]="new Date()"
        ></os-date-picker>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story:
          'Seletor de data com texto de ajuda. Quando não fornecido, o formato de data é mostrado automaticamente.',
      },
    },
  },
};

export const DisabledAndReadonly: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 24px;">
        <div>
          <h4>Desabilitado</h4>
          <os-date-picker
            label="Data de Nascimento"
            placeholder="Selecionar data"
            [disabled]="true"
            [value]="new Date('1990-01-01')"
          ></os-date-picker>
        </div>

        <div>
          <h4>Com Valor e Seleção Rápida</h4>
          <os-date-picker
            label="Data de Cadastro"
            placeholder="Selecionar data"
            [value]="new Date('2024-01-15')"
            [showQuickSelection]="true"
            helperText="Data de cadastro no sistema"
          ></os-date-picker>
        </div>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Seletor de data desabilitado e com valor pré-definido.',
      },
    },
  },
};

export const FormExample: Story = {
  render: () => ({
    template: `
      <div style="max-width: 600px;">
        <h3>Formulário de Meta SMART</h3>
        <form style="display: flex; flex-direction: column; gap: 16px;">
          <os-date-picker
            label="Data de Início"
            placeholder="Selecionar data"
            helperText="Quando você vai começar?"
            [required]="true"
            [showQuickSelection]="true"
            [minDate]="new Date()"
          ></os-date-picker>

          <os-date-picker
            label="Data de Conclusão"
            placeholder="Selecionar data"
            helperText="Quando você pretende concluir?"
            [required]="true"
            [showQuickSelection]="true"
            [minDate]="new Date()"
          ></os-date-picker>

          <os-date-picker
            label="Período de Análise"
            endDateLabel="Data Final"
            placeholder="Data inicial"
            endDatePlaceholder="Data final"
            helperText="Selecione o período para análise de progresso"
            [isRangePicker]="true"
            [showRangeEnd]="true"
          ></os-date-picker>
        </form>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story:
          'Exemplo de uso em um formulário de metas SMART com múltiplos seletores de data e funcionalidades avançadas.',
      },
    },
  },
};

export const Accessibility: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 24px;">
        <div>
          <h4>Com ARIA Labels</h4>
          <os-date-picker
            label="Data de Nascimento"
            placeholder="Selecionar data"
            ariaLabel="Selecione sua data de nascimento"
            ariaDescribedBy="birth-date-help"
            helperText="Use as setas do teclado para navegar"
          ></os-date-picker>
          <p id="birth-date-help" style="font-size: 12px; color: #666;">
            Pressione Enter para abrir o calendário, Escape para fechar
          </p>
        </div>

        <div>
          <h4>Com Seleção Rápida e ARIA</h4>
          <os-date-picker
            label="Data de Meta"
            [showQuickSelection]="true"
            ariaLabel="Selecione a data da meta"
            helperText="Use Tab para navegar entre os botões rápidos"
          ></os-date-picker>
        </div>

        <div>
          <h4>Range Picker com ARIA</h4>
          <os-date-picker
            label="Data Inicial"
            endDateLabel="Data Final"
            [isRangePicker]="true"
            [showRangeEnd]="true"
            ariaLabel="Selecione a data inicial do período"
            endDateAriaLabel="Selecione a data final do período"
            helperText="Use Tab para navegar entre os campos"
          ></os-date-picker>
        </div>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: `
Recursos de acessibilidade WCAG 2.1 AA:
- **Keyboard Navigation**: Tab, Enter, Escape, Arrow keys
- **ARIA Attributes**: Roles, labels, described-by
- **Screen Reader**: Live regions para anúncios
- **Focus Management**: Foco visível em todos os elementos
- **Touch Targets**: >= 44px em dispositivos móveis
- **Contraste**: >= 4.5:1 para texto
        `,
      },
    },
  },
};

export const Interactive: Story = {
  args: {
    value: null,
    label: 'Data de Meta SMART',
    placeholder: 'Selecionar data',
    helperText: '',
    size: 'medium',
    variant: 'default',
    required: false,
    disabled: false,
    minDate: null,
    maxDate: null,
    touchUi: false,
    mobileFriendly: true,
    showQuickSelection: true,
    showTodayIndicator: true,
    isRangePicker: false,
    calendarIcon: 'calendar_today',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Seletor de data interativo com controles para testar todas as propriedades. Experimente ativar a seleção rápida e o indicador de hoje.',
      },
    },
  },
};
