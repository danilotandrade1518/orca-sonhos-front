import { OsCardComponent } from './os-card.component';

import type { Meta, StoryObj } from '@storybook/angular';
const meta: Meta<OsCardComponent> = {
  title: 'Design System/Molecules/Card',
  component: OsCardComponent,
  parameters: {
    docs: {
      description: {
        component:
          'Card do Design System Orca Sonhos com 4 variantes, 3 tamanhos, suporte a header, actions e clickable.',
      },
    },
  },
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['default', 'outlined', 'elevated', 'flat'],
      description: 'Variante visual do card',
    },
    size: {
      control: { type: 'select' },
      options: ['small', 'medium', 'large'],
      description: 'Tamanho do card',
    },
    header: {
      control: { type: 'boolean' },
      description: 'Exibir header do card',
    },
    actions: {
      control: { type: 'boolean' },
      description: 'Exibir actions do card',
    },
    clickable: {
      control: { type: 'boolean' },
      description: 'Card clicável',
    },
    loading: {
      control: { type: 'boolean' },
      description: 'Estado de loading com shimmer effect',
    },
    disabled: {
      control: { type: 'boolean' },
      description: 'Card desabilitado',
    },
    selected: {
      control: { type: 'boolean' },
      description: 'Card selecionado',
    },
    ariaLabel: {
      control: { type: 'text' },
      description: 'Label ARIA para acessibilidade',
    },
    ariaDescribedBy: {
      control: { type: 'text' },
      description: 'ID do elemento que descreve o card',
    },
    cardClick: {
      action: 'cardClick',
      description: 'Evento de clique do card',
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<OsCardComponent>;

export const Default: Story = {
  args: {
    variant: 'default',
    size: 'medium',
    header: false,
    actions: false,
    clickable: false,
  },
  render: (args) => ({
    props: args,
    template: `
      <os-card
        [variant]="variant"
        [size]="size"
        [header]="header"
        [actions]="actions"
        [clickable]="clickable"
        (cardClick)="cardClick($event)"
      >
        <div slot="header" *ngIf="header">
          <h3>Título do Card</h3>
        </div>

        <p>Conteúdo do card. Este é um exemplo de conteúdo que pode ser exibido dentro do card.</p>

        <div slot="actions" *ngIf="actions">
          <os-button size="small" variant="primary">Ação 1</os-button>
          <os-button size="small" variant="secondary">Ação 2</os-button>
        </div>
      </os-card>
    `,
  }),
};

export const Variants: Story = {
  render: () => ({
    template: `
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 16px;">
        <os-card variant="default">
          <h3>Default</h3>
          <p>Card com estilo padrão do sistema.</p>
        </os-card>

        <os-card variant="outlined">
          <h3>Outlined</h3>
          <p>Card com borda destacada.</p>
        </os-card>

        <os-card variant="elevated">
          <h3>Elevated</h3>
          <p>Card com sombra elevada.</p>
        </os-card>

        <os-card variant="flat">
          <h3>Flat</h3>
          <p>Card com estilo plano.</p>
        </os-card>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Todas as variantes disponíveis do card.',
      },
    },
  },
};

export const Sizes: Story = {
  render: () => ({
    template: `
      <div style="display: flex; gap: 16px; align-items: flex-start;">
        <os-card size="small">
          <h3>Small</h3>
          <p>Card pequeno para informações compactas.</p>
        </os-card>

        <os-card size="medium">
          <h3>Medium</h3>
          <p>Card médio para uso geral.</p>
        </os-card>

        <os-card size="large">
          <h3>Large</h3>
          <p>Card grande para conteúdo extenso.</p>
        </os-card>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Todos os tamanhos disponíveis do card.',
      },
    },
  },
};

export const WithHeader: Story = {
  render: () => ({
    template: `
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 16px;">
        <os-card [header]="true">
          <div slot="header">
            <h3><os-icon name="fa fa-user" size="small"></os-icon> Usuário</h3>
          </div>
          <p>Card com header personalizado contendo ícone e título.</p>
        </os-card>

        <os-card [header]="true" variant="outlined">
          <div slot="header">
            <h3>Configurações</h3>
            <p style="margin: 0; font-size: 0.875rem; color: #666;">Gerencie suas preferências</p>
          </div>
          <p>Card com header mais complexo incluindo subtítulo.</p>
        </os-card>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Cards com header personalizado.',
      },
    },
  },
};

export const WithActions: Story = {
  render: () => ({
    template: `
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 16px;">
        <os-card [actions]="true">
          <h3>Card com Ações</h3>
          <p>Este card possui botões de ação na parte inferior.</p>
          <div slot="actions">
            <os-button size="small" variant="primary">Salvar</os-button>
            <os-button size="small" variant="secondary">Cancelar</os-button>
          </div>
        </os-card>

        <os-card [actions]="true" variant="elevated">
          <h3>Card Completo</h3>
          <p>Card com header, conteúdo e ações.</p>
          <div slot="header">
            <h3><os-icon name="fa fa-star" size="small"></os-icon> Destacado</h3>
          </div>
          <div slot="actions">
            <os-button size="small" variant="tertiary" icon="fa fa-edit">Editar</os-button>
            <os-button size="small" variant="danger" icon="fa fa-trash">Excluir</os-button>
          </div>
        </os-card>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Cards com ações na parte inferior.',
      },
    },
  },
};

export const Clickable: Story = {
  render: () => ({
    template: `
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 16px;">
        <os-card [clickable]="true" (cardClick)="onCardClick($event)">
          <h3>Card Clicável</h3>
          <p>Este card pode ser clicado para navegar ou executar uma ação.</p>
        </os-card>

        <os-card [clickable]="true" variant="outlined" (cardClick)="onCardClick($event)">
          <h3><os-icon name="fa fa-link" size="small"></os-icon> Link Card</h3>
          <p>Card clicável com ícone indicativo.</p>
        </os-card>
      </div>
    `,
    methods: {
      onCardClick: () => {
        console.log('Card clicado!');
      },
    },
  }),
  parameters: {
    docs: {
      description: {
        story: 'Cards clicáveis para navegação ou ações.',
      },
    },
  },
};

export const Loading: Story = {
  render: () => ({
    template: `
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 16px;">
        <os-card [loading]="true">
          <h3>Card Carregando</h3>
          <p>Este card está em estado de loading com shimmer effect.</p>
        </os-card>

        <os-card [loading]="true" variant="elevated">
          <h3>Card Elevado Carregando</h3>
          <p>Card elevado com loading state.</p>
        </os-card>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Cards em estado de loading com shimmer effect.',
      },
    },
  },
};

export const Disabled: Story = {
  render: () => ({
    template: `
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 16px;">
        <os-card [disabled]="true" [clickable]="true">
          <h3>Card Desabilitado</h3>
          <p>Este card está desabilitado e não pode ser clicado.</p>
        </os-card>

        <os-card [disabled]="true" variant="outlined" [clickable]="true">
          <h3>Card Outline Desabilitado</h3>
          <p>Card outline desabilitado com opacidade reduzida.</p>
        </os-card>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Cards desabilitados com opacidade reduzida.',
      },
    },
  },
};

export const Selected: Story = {
  render: () => ({
    template: `
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 16px;">
        <os-card [selected]="true" [clickable]="true">
          <h3>Card Selecionado</h3>
          <p>Este card está selecionado com destaque visual.</p>
        </os-card>

        <os-card [selected]="false" [clickable]="true">
          <h3>Card Não Selecionado</h3>
          <p>Este card não está selecionado.</p>
        </os-card>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Cards com estado de seleção.',
      },
    },
  },
};

export const Accessibility: Story = {
  render: () => ({
    template: `
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 16px;">
        <os-card
          [clickable]="true"
          ariaLabel="Card acessível com descrição"
          ariaDescribedBy="card-description"
        >
          <h3>Card Acessível</h3>
          <p id="card-description">Este card possui atributos ARIA para melhor acessibilidade.</p>
        </os-card>

        <os-card
          [clickable]="true"
          [disabled]="true"
          ariaLabel="Card desabilitado"
        >
          <h3>Card Desabilitado Acessível</h3>
          <p>Card desabilitado com atributos ARIA apropriados.</p>
        </os-card>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Cards com atributos de acessibilidade ARIA.',
      },
    },
  },
};

export const Interactive: Story = {
  args: {
    variant: 'default',
    size: 'medium',
    header: true,
    actions: true,
    clickable: false,
    loading: false,
    disabled: false,
    selected: false,
  },
  render: (args) => ({
    props: args,
    template: `
      <os-card
        [variant]="variant"
        [size]="size"
        [header]="header"
        [actions]="actions"
        [clickable]="clickable"
        [loading]="loading"
        [disabled]="disabled"
        [selected]="selected"
        (cardClick)="cardClick($event)"
      >
        <div slot="header" *ngIf="header">
          <h3>Card Interativo</h3>
        </div>

        <p>Este é um card interativo com controles para testar todas as propriedades.</p>

        <div slot="actions" *ngIf="actions">
          <os-button size="small" variant="primary">Ação 1</os-button>
          <os-button size="small" variant="secondary">Ação 2</os-button>
        </div>
      </os-card>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Card interativo com controles para testar todas as propriedades.',
      },
    },
  },
};
