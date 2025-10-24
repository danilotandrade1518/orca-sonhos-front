import type { Meta, StoryObj } from '@storybook/angular';
import { OsMoneyDisplayComponent } from './os-money-display.component';

const meta: Meta<OsMoneyDisplayComponent> = {
  title: 'Design System/Molecules/Money Display',
  component: OsMoneyDisplayComponent,
  parameters: {
    docs: {
      description: {
        component:
          'Exibição de valores monetários do Design System Orca Sonhos com 5 variantes, 3 tamanhos e suporte a múltiplas moedas.',
      },
    },
  },
  argTypes: {
    value: {
      control: { type: 'number' },
      description: 'Valor monetário',
    },
    currency: {
      control: { type: 'select' },
      options: ['BRL', 'USD', 'EUR', 'GBP'],
      description: 'Moeda',
    },
    locale: {
      control: { type: 'text' },
      description: 'Localização para formatação',
    },
    variant: {
      control: { type: 'select' },
      options: ['default', 'success', 'warning', 'error', 'info'],
      description: 'Variante visual',
    },
    size: {
      control: { type: 'select' },
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
      description: 'Tamanho da exibição',
    },
    showCurrency: {
      control: { type: 'boolean' },
      description: 'Exibir símbolo da moeda',
    },
    precision: {
      control: { type: 'number' },
      description: 'Número de casas decimais',
    },
    autoVariant: {
      control: { type: 'boolean' },
      description: 'Aplicar variante automaticamente baseada no valor',
    },
    highlightLarge: {
      control: { type: 'boolean' },
      description: 'Destacar valores grandes',
    },
    largeThreshold: {
      control: { type: 'number' },
      description: 'Limite para destacar valores grandes',
    },
    role: {
      control: { type: 'text' },
      description: 'Role ARIA',
    },
    ariaLabel: {
      control: { type: 'text' },
      description: 'Label ARIA',
    },
    ariaDescribedBy: {
      control: { type: 'text' },
      description: 'Descrito por ARIA',
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<OsMoneyDisplayComponent>;

export const Default: Story = {
  args: {
    value: 1250.5,
    currency: 'BRL',
    locale: 'pt-BR',
    variant: 'default',
    size: 'md',
    showCurrency: true,
    precision: 2,
    autoVariant: true,
    highlightLarge: true,
    largeThreshold: 10000,
    role: 'text',
    ariaLabel: '',
    ariaDescribedBy: '',
  },
  render: (args) => ({
    props: args,
    template: `
      <os-money-display
        [value]="value"
        [currency]="currency"
        [locale]="locale"
        [variant]="variant"
        [size]="size"
        [showCurrency]="showCurrency"
        [precision]="precision"
      ></os-money-display>
    `,
  }),
};

export const Variants: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 16px;">
        <div>
          <h4>Default</h4>
          <os-money-display value="1250.50" variant="default"></os-money-display>
        </div>

        <div>
          <h4>Success (Receita)</h4>
          <os-money-display value="2500.00" variant="success"></os-money-display>
        </div>

        <div>
          <h4>Warning (Atenção)</h4>
          <os-money-display value="-500.00" variant="warning"></os-money-display>
        </div>

        <div>
          <h4>Error (Despesa)</h4>
          <os-money-display value="-1200.75" variant="error"></os-money-display>
        </div>

        <div>
          <h4>Info (Informação)</h4>
          <os-money-display value="0.00" variant="info"></os-money-display>
        </div>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Todas as variantes disponíveis para exibição de valores monetários.',
      },
    },
  },
};

export const Sizes: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 16px;">
        <div>
          <h4>Extra Small (xs)</h4>
          <os-money-display value="1250.50" size="xs"></os-money-display>
        </div>

        <div>
          <h4>Small (sm)</h4>
          <os-money-display value="1250.50" size="sm"></os-money-display>
        </div>

        <div>
          <h4>Medium (md)</h4>
          <os-money-display value="1250.50" size="md"></os-money-display>
        </div>

        <div>
          <h4>Large (lg)</h4>
          <os-money-display value="1250.50" size="lg"></os-money-display>
        </div>

        <div>
          <h4>Extra Large (xl)</h4>
          <os-money-display value="1250.50" size="xl"></os-money-display>
        </div>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Todos os tamanhos disponíveis para exibição de valores monetários.',
      },
    },
  },
};

export const Currencies: Story = {
  render: () => ({
    template: `
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px;">
        <div>
          <h4>Real Brasileiro (BRL)</h4>
          <os-money-display value="1250.50" currency="BRL" locale="pt-BR"></os-money-display>
        </div>

        <div>
          <h4>Dólar Americano (USD)</h4>
          <os-money-display value="1250.50" currency="USD" locale="en-US"></os-money-display>
        </div>

        <div>
          <h4>Euro (EUR)</h4>
          <os-money-display value="1250.50" currency="EUR" locale="de-DE"></os-money-display>
        </div>

        <div>
          <h4>Libra Esterlina (GBP)</h4>
          <os-money-display value="1250.50" currency="GBP" locale="en-GB"></os-money-display>
        </div>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Diferentes moedas com formatação apropriada para cada localização.',
      },
    },
  },
};

export const Precision: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 16px;">
        <div>
          <h4>0 casas decimais</h4>
          <os-money-display value="1250.50" [precision]="0"></os-money-display>
        </div>

        <div>
          <h4>1 casa decimal</h4>
          <os-money-display value="1250.50" [precision]="1"></os-money-display>
        </div>

        <div>
          <h4>2 casas decimais (padrão)</h4>
          <os-money-display value="1250.50" [precision]="2"></os-money-display>
        </div>

        <div>
          <h4>3 casas decimais</h4>
          <os-money-display value="1250.50" [precision]="3"></os-money-display>
        </div>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Diferentes precisões para exibição de valores monetários.',
      },
    },
  },
};

export const WithoutCurrency: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 16px;">
        <div>
          <h4>Com símbolo da moeda</h4>
          <os-money-display value="1250.50" [showCurrency]="true"></os-money-display>
        </div>

        <div>
          <h4>Sem símbolo da moeda</h4>
          <os-money-display value="1250.50" [showCurrency]="false"></os-money-display>
        </div>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Exibição com e sem símbolo da moeda.',
      },
    },
  },
};

export const FinancialDashboard: Story = {
  render: () => ({
    template: `
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; padding: 20px; background: #f5f5f5; border-radius: 8px;">
        <div style="background: white; padding: 20px; border-radius: 8px; text-align: center;">
          <h3>Receitas</h3>
          <os-money-display value="15000.00" variant="success" size="large"></os-money-display>
          <p style="margin: 8px 0 0 0; color: #666; font-size: 0.875rem;">Este mês</p>
        </div>

        <div style="background: white; padding: 20px; border-radius: 8px; text-align: center;">
          <h3>Despesas</h3>
          <os-money-display value="8500.75" variant="error" size="large"></os-money-display>
          <p style="margin: 8px 0 0 0; color: #666; font-size: 0.875rem;">Este mês</p>
        </div>

        <div style="background: white; padding: 20px; border-radius: 8px; text-align: center;">
          <h3>Saldo</h3>
          <os-money-display value="6499.25" variant="default" size="large"></os-money-display>
          <p style="margin: 8px 0 0 0; color: #666; font-size: 0.875rem;">Disponível</p>
        </div>

        <div style="background: white; padding: 20px; border-radius: 8px; text-align: center;">
          <h3>Investimentos</h3>
          <os-money-display value="25000.00" variant="info" size="large"></os-money-display>
          <p style="margin: 8px 0 0 0; color: #666; font-size: 0.875rem;">Total</p>
        </div>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Exemplo de uso em um dashboard financeiro.',
      },
    },
  },
};

export const TransactionList: Story = {
  render: () => ({
    template: `
      <div style="background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
        <div style="padding: 16px; border-bottom: 1px solid #eee; background: #f8f9fa;">
          <h3 style="margin: 0;">Transações Recentes</h3>
        </div>

        <div style="padding: 0;">
          <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px 16px; border-bottom: 1px solid #f0f0f0;">
            <div>
              <div style="font-weight: 500;">Salário</div>
              <div style="font-size: 0.875rem; color: #666;">01/01/2024</div>
            </div>
            <os-money-display value="5000.00" variant="success" size="medium"></os-money-display>
          </div>

          <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px 16px; border-bottom: 1px solid #f0f0f0;">
            <div>
              <div style="font-weight: 500;">Aluguel</div>
              <div style="font-size: 0.875rem; color: #666;">05/01/2024</div>
            </div>
            <os-money-display value="-1200.00" variant="error" size="medium"></os-money-display>
          </div>

          <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px 16px; border-bottom: 1px solid #f0f0f0;">
            <div>
              <div style="font-weight: 500;">Supermercado</div>
              <div style="font-size: 0.875rem; color: #666;">10/01/2024</div>
            </div>
            <os-money-display value="-350.50" variant="error" size="medium"></os-money-display>
          </div>

          <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px 16px;">
            <div>
              <div style="font-weight: 500;">Freelance</div>
              <div style="font-size: 0.875rem; color: #666;">15/01/2024</div>
            </div>
            <os-money-display value="800.00" variant="success" size="medium"></os-money-display>
          </div>
        </div>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Exemplo de uso em uma lista de transações.',
      },
    },
  },
};

export const AutoVariant: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 16px;">
        <div>
          <h4>Valores Positivos (Auto: positive)</h4>
          <os-money-display value="2500.00" [autoVariant]="true"></os-money-display>
        </div>

        <div>
          <h4>Valores Negativos (Auto: negative)</h4>
          <os-money-display value="-1200.75" [autoVariant]="true"></os-money-display>
        </div>

        <div>
          <h4>Valores Zero (Auto: neutral)</h4>
          <os-money-display value="0.00" [autoVariant]="true"></os-money-display>
        </div>

        <div>
          <h4>Variante Manual (Auto: false)</h4>
          <os-money-display value="1000.00" [autoVariant]="false" variant="error"></os-money-display>
        </div>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Aplicação automática de variantes baseada no valor (positivo/negativo/neutro).',
      },
    },
  },
};

export const LargeValueHighlighting: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 16px;">
        <div>
          <h4>Valor Pequeno (Normal)</h4>
          <os-money-display value="500.00" [highlightLarge]="true" [largeThreshold]="10000"></os-money-display>
        </div>

        <div>
          <h4>Valor Grande (Destacado)</h4>
          <os-money-display value="15000.00" [highlightLarge]="true" [largeThreshold]="10000"></os-money-display>
        </div>

        <div>
          <h4>Valor Grande (Sem Destaque)</h4>
          <os-money-display value="15000.00" [highlightLarge]="false"></os-money-display>
        </div>

        <div>
          <h4>Limite Personalizado (5000)</h4>
          <os-money-display value="6000.00" [highlightLarge]="true" [largeThreshold]="5000"></os-money-display>
        </div>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Destaque automático para valores grandes com limite configurável.',
      },
    },
  },
};

export const Accessibility: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 16px;">
        <div>
          <h4>Com ARIA Labels</h4>
          <os-money-display
            value="2500.00"
            role="status"
            ariaLabel="Total de receitas do mês"
            ariaDescribedBy="revenue-description"
          ></os-money-display>
          <p id="revenue-description" style="font-size: 0.875rem; color: #666; margin: 4px 0 0 0;">
            Valor total das receitas registradas este mês
          </p>
        </div>

        <div>
          <h4>Sem Símbolo da Moeda (Acessível)</h4>
          <os-money-display
            value="1500.00"
            [showCurrency]="false"
            ariaLabel="Valor: 1500 reais"
          ></os-money-display>
        </div>

        <div>
          <h4>Role Personalizado</h4>
          <os-money-display
            value="5000.00"
            role="alert"
            ariaLabel="Meta atingida!"
          ></os-money-display>
        </div>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Exemplos de uso com acessibilidade WCAG 2.1 AA.',
      },
    },
  },
};

export const Interactive: Story = {
  args: {
    value: 1250.5,
    currency: 'BRL',
    locale: 'pt-BR',
    variant: 'default',
    size: 'md',
    showCurrency: true,
    precision: 2,
    autoVariant: true,
    highlightLarge: true,
    largeThreshold: 10000,
    role: 'text',
    ariaLabel: '',
    ariaDescribedBy: '',
  },
  render: (args) => ({
    props: args,
    template: `
      <os-money-display
        [value]="value"
        [currency]="currency"
        [locale]="locale"
        [variant]="variant"
        [size]="size"
        [showCurrency]="showCurrency"
        [precision]="precision"
        [autoVariant]="autoVariant"
        [highlightLarge]="highlightLarge"
        [largeThreshold]="largeThreshold"
        [role]="role"
        [ariaLabel]="ariaLabel"
        [ariaDescribedBy]="ariaDescribedBy"
      ></os-money-display>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story:
          'Exibição de valor monetário interativa com controles para testar todas as propriedades.',
      },
    },
  },
};
