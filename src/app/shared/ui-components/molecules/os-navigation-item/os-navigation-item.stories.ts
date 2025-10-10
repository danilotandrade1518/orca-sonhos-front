import type { Meta, StoryObj } from '@storybook/angular';
import { OsNavigationItemComponent } from './os-navigation-item.component';

const meta: Meta<OsNavigationItemComponent> = {
  title: 'Design System/Molecules/Navigation Item',
  component: OsNavigationItemComponent,
  parameters: {
    docs: {
      description: {
        component:
          'Item de navegação do Design System Orca Sonhos com 4 variantes, 3 tamanhos e suporte a ícones e badges.',
      },
    },
  },
  argTypes: {
    routerLink: {
      control: { type: 'text' },
      description: 'Link do roteador',
    },
    queryParams: {
      control: { type: 'object' },
      description: 'Parâmetros de query',
    },
    fragment: {
      control: { type: 'text' },
      description: 'Fragmento da URL',
    },
    icon: {
      control: { type: 'text' },
      description: 'Ícone (Font Awesome)',
    },
    badge: {
      control: { type: 'number' },
      description: 'Número do badge',
    },
    size: {
      control: { type: 'select' },
      options: ['small', 'medium', 'large'],
      description: 'Tamanho do item',
    },
    variant: {
      control: { type: 'select' },
      options: ['default', 'primary', 'secondary', 'accent'],
      description: 'Variante visual',
    },
    disabled: {
      control: { type: 'boolean' },
      description: 'Item desabilitado',
    },
    active: {
      control: { type: 'boolean' },
      description: 'Item ativo',
    },
    ariaLabel: {
      control: { type: 'text' },
      description: 'Label de acessibilidade',
    },
    itemClick: {
      action: 'itemClick',
      description: 'Evento de clique no item',
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<OsNavigationItemComponent>;

export const Default: Story = {
  args: {
    routerLink: '/dashboard',
    icon: 'fa fa-home',
    badge: 0,
    size: 'medium',
    variant: 'default',
    disabled: false,
    active: false,
    ariaLabel: 'Dashboard',
  },
  render: (args) => ({
    props: args,
    template: `
      <os-navigation-item 
        [routerLink]="routerLink"
        [queryParams]="queryParams"
        [fragment]="fragment"
        [icon]="icon"
        [badge]="badge"
        [size]="size"
        [variant]="variant"
        [disabled]="disabled"
        [active]="active"
        [ariaLabel]="ariaLabel"
        (itemClick)="itemClick($event)"
      >
        Dashboard
      </os-navigation-item>
    `,
  }),
};

export const Variants: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 16px;">
        <div>
          <h4>Default</h4>
          <os-navigation-item routerLink="/dashboard" icon="fa fa-home" variant="default">
            Dashboard
          </os-navigation-item>
        </div>
        
        <div>
          <h4>Primary</h4>
          <os-navigation-item routerLink="/dashboard" icon="fa fa-home" variant="primary">
            Dashboard
          </os-navigation-item>
        </div>
        
        <div>
          <h4>Secondary</h4>
          <os-navigation-item routerLink="/dashboard" icon="fa fa-home" variant="secondary">
            Dashboard
          </os-navigation-item>
        </div>
        
        <div>
          <h4>Accent</h4>
          <os-navigation-item routerLink="/dashboard" icon="fa fa-home" variant="accent">
            Dashboard
          </os-navigation-item>
        </div>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Todas as variantes disponíveis do item de navegação.',
      },
    },
  },
};

export const Sizes: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 16px;">
        <div>
          <h4>Small</h4>
          <os-navigation-item routerLink="/dashboard" icon="fa fa-home" size="small">
            Dashboard
          </os-navigation-item>
        </div>
        
        <div>
          <h4>Medium</h4>
          <os-navigation-item routerLink="/dashboard" icon="fa fa-home" size="medium">
            Dashboard
          </os-navigation-item>
        </div>
        
        <div>
          <h4>Large</h4>
          <os-navigation-item routerLink="/dashboard" icon="fa fa-home" size="large">
            Dashboard
          </os-navigation-item>
        </div>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Todos os tamanhos disponíveis do item de navegação.',
      },
    },
  },
};

export const WithIcons: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 12px;">
        <os-navigation-item routerLink="/dashboard" icon="fa fa-home">
          Dashboard
        </os-navigation-item>
        
        <os-navigation-item routerLink="/transactions" icon="fa fa-list">
          Transações
        </os-navigation-item>
        
        <os-navigation-item routerLink="/budgets" icon="fa fa-chart-pie">
          Orçamentos
        </os-navigation-item>
        
        <os-navigation-item routerLink="/goals" icon="fa fa-target">
          Metas
        </os-navigation-item>
        
        <os-navigation-item routerLink="/reports" icon="fa fa-chart-bar">
          Relatórios
        </os-navigation-item>
        
        <os-navigation-item routerLink="/settings" icon="fa fa-cog">
          Configurações
        </os-navigation-item>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Itens de navegação com diferentes ícones.',
      },
    },
  },
};

export const WithBadges: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 12px;">
        <os-navigation-item routerLink="/dashboard" icon="fa fa-home" [badge]="0">
          Dashboard
        </os-navigation-item>
        
        <os-navigation-item routerLink="/transactions" icon="fa fa-list" [badge]="5">
          Transações
        </os-navigation-item>
        
        <os-navigation-item routerLink="/notifications" icon="fa fa-bell" [badge]="12">
          Notificações
        </os-navigation-item>
        
        <os-navigation-item routerLink="/messages" icon="fa fa-envelope" [badge]="99">
          Mensagens
        </os-navigation-item>
        
        <os-navigation-item routerLink="/alerts" icon="fa fa-exclamation-triangle" [badge]="150">
          Alertas
        </os-navigation-item>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Itens de navegação com badges de notificação.',
      },
    },
  },
};

export const States: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 12px;">
        <div>
          <h4>Normal</h4>
          <os-navigation-item routerLink="/dashboard" icon="fa fa-home">
            Dashboard
          </os-navigation-item>
        </div>
        
        <div>
          <h4>Ativo</h4>
          <os-navigation-item routerLink="/dashboard" icon="fa fa-home" [active]="true">
            Dashboard
          </os-navigation-item>
        </div>
        
        <div>
          <h4>Desabilitado</h4>
          <os-navigation-item routerLink="/dashboard" icon="fa fa-home" [disabled]="true">
            Dashboard
          </os-navigation-item>
        </div>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Diferentes estados do item de navegação.',
      },
    },
  },
};

export const WithQueryParams: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 12px;">
        <os-navigation-item 
          routerLink="/transactions" 
          icon="fa fa-list"
          [queryParams]="{ filter: 'income' }"
        >
          Receitas
        </os-navigation-item>
        
        <os-navigation-item 
          routerLink="/transactions" 
          icon="fa fa-list"
          [queryParams]="{ filter: 'expense' }"
        >
          Despesas
        </os-navigation-item>
        
        <os-navigation-item 
          routerLink="/reports" 
          icon="fa fa-chart-bar"
          [queryParams]="{ period: 'month', year: '2024' }"
        >
          Relatório Mensal
        </os-navigation-item>
        
        <os-navigation-item 
          routerLink="/settings" 
          icon="fa fa-cog"
          [fragment]="'notifications'"
        >
          Configurações
        </os-navigation-item>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Itens de navegação com parâmetros de query e fragmentos.',
      },
    },
  },
};

export const ButtonMode: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 12px;">
        <os-navigation-item icon="fa fa-search" (itemClick)="onSearchClick($event)">
          Buscar
        </os-navigation-item>
        
        <os-navigation-item icon="fa fa-plus" (itemClick)="onAddClick($event)">
          Adicionar
        </os-navigation-item>
        
        <os-navigation-item icon="fa fa-download" (itemClick)="onDownloadClick($event)">
          Exportar
        </os-navigation-item>
        
        <os-navigation-item icon="fa fa-print" (itemClick)="onPrintClick($event)">
          Imprimir
        </os-navigation-item>
      </div>
    `,
    methods: {
      onSearchClick: () => console.log('Buscar clicado'),
      onAddClick: () => console.log('Adicionar clicado'),
      onDownloadClick: () => console.log('Exportar clicado'),
      onPrintClick: () => console.log('Imprimir clicado'),
    },
  }),
  parameters: {
    docs: {
      description: {
        story: 'Itens de navegação em modo botão (sem routerLink).',
      },
    },
  },
};

export const NavigationMenu: Story = {
  render: () => ({
    template: `
      <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; max-width: 300px;">
        <h3 style="margin: 0 0 16px 0; color: #333;">Menu Principal</h3>
        
        <div style="display: flex; flex-direction: column; gap: 4px;">
          <os-navigation-item routerLink="/dashboard" icon="fa fa-home" [active]="true">
            Dashboard
          </os-navigation-item>
          
          <os-navigation-item routerLink="/transactions" icon="fa fa-list" [badge]="3">
            Transações
          </os-navigation-item>
          
          <os-navigation-item routerLink="/budgets" icon="fa fa-chart-pie">
            Orçamentos
          </os-navigation-item>
          
          <os-navigation-item routerLink="/goals" icon="fa fa-target">
            Metas
          </os-navigation-item>
          
          <os-navigation-item routerLink="/reports" icon="fa fa-chart-bar">
            Relatórios
          </os-navigation-item>
          
          <div style="height: 1px; background: #dee2e6; margin: 8px 0;"></div>
          
          <os-navigation-item routerLink="/settings" icon="fa fa-cog">
            Configurações
          </os-navigation-item>
          
          <os-navigation-item routerLink="/help" icon="fa fa-question-circle">
            Ajuda
          </os-navigation-item>
        </div>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Exemplo de uso em um menu de navegação completo.',
      },
    },
  },
};

export const Interactive: Story = {
  args: {
    routerLink: '/dashboard',
    icon: 'fa fa-home',
    badge: 0,
    size: 'medium',
    variant: 'default',
    disabled: false,
    active: false,
    ariaLabel: 'Dashboard',
  },
  render: (args) => ({
    props: args,
    template: `
      <os-navigation-item 
        [routerLink]="routerLink"
        [queryParams]="queryParams"
        [fragment]="fragment"
        [icon]="icon"
        [badge]="badge"
        [size]="size"
        [variant]="variant"
        [disabled]="disabled"
        [active]="active"
        [ariaLabel]="ariaLabel"
        (itemClick)="itemClick($event)"
      >
        Item Interativo
      </os-navigation-item>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Item de navegação interativo com controles para testar todas as propriedades.',
      },
    },
  },
};

