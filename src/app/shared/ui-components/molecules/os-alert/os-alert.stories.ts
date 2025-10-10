import type { Meta, StoryObj } from '@storybook/angular';
import { OsAlertComponent } from './os-alert.component';

const meta: Meta<OsAlertComponent> = {
  title: 'Design System/Molecules/Alert',
  component: OsAlertComponent,
  parameters: {
    docs: {
      description: {
        component:
          'Alerta do Design System Orca Sonhos com 4 tipos, 3 tamanhos e suporte a dismiss.',
      },
    },
  },
  argTypes: {
    type: {
      control: { type: 'select' },
      options: ['success', 'warning', 'error', 'info'],
      description: 'Tipo do alerta',
    },
    size: {
      control: { type: 'select' },
      options: ['small', 'medium', 'large'],
      description: 'Tamanho do alerta',
    },
    title: {
      control: { type: 'text' },
      description: 'Título do alerta',
    },
    showIcon: {
      control: { type: 'boolean' },
      description: 'Exibir ícone',
    },
    dismissible: {
      control: { type: 'boolean' },
      description: 'Permitir fechar',
    },
    dismiss: {
      action: 'dismiss',
      description: 'Evento de fechar alerta',
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<OsAlertComponent>;

export const Default: Story = {
  args: {
    type: 'info',
    size: 'medium',
    title: 'Informação',
    showIcon: true,
    dismissible: false,
  },
  render: (args) => ({
    props: args,
    template: `
      <os-alert 
        [type]="type"
        [size]="size"
        [title]="title"
        [showIcon]="showIcon"
        [dismissible]="dismissible"
        (dismiss)="dismiss($event)"
      >
        Este é um alerta padrão com informações importantes.
      </os-alert>
    `,
  }),
};

export const Types: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 16px;">
        <os-alert type="success" title="Sucesso" [showIcon]="true">
          Operação realizada com sucesso! Seus dados foram salvos.
        </os-alert>
        
        <os-alert type="warning" title="Atenção" [showIcon]="true">
          Verifique as informações antes de continuar.
        </os-alert>
        
        <os-alert type="error" title="Erro" [showIcon]="true">
          Ocorreu um erro ao processar sua solicitação.
        </os-alert>
        
        <os-alert type="info" title="Informação" [showIcon]="true">
          Esta é uma informação importante para você.
        </os-alert>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Todos os tipos de alerta disponíveis.',
      },
    },
  },
};

export const Sizes: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 16px;">
        <os-alert type="info" size="small" title="Pequeno" [showIcon]="true">
          Alerta pequeno para informações breves.
        </os-alert>
        
        <os-alert type="info" size="medium" title="Médio" [showIcon]="true">
          Alerta médio para informações padrão.
        </os-alert>
        
        <os-alert type="info" size="large" title="Grande" [showIcon]="true">
          Alerta grande para informações importantes ou detalhadas.
        </os-alert>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Todos os tamanhos disponíveis do alerta.',
      },
    },
  },
};

export const WithDismiss: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 16px;">
        <os-alert type="success" title="Sucesso" [showIcon]="true" [dismissible]="true" (dismiss)="onDismiss($event)">
          Operação realizada com sucesso! Você pode fechar este alerta.
        </os-alert>
        
        <os-alert type="warning" title="Atenção" [showIcon]="true" [dismissible]="true" (dismiss)="onDismiss($event)">
          Verifique as informações antes de continuar. Clique no X para fechar.
        </os-alert>
        
        <os-alert type="error" title="Erro" [showIcon]="true" [dismissible]="true" (dismiss)="onDismiss($event)">
          Ocorreu um erro. Você pode fechar este alerta e tentar novamente.
        </os-alert>
      </div>
    `,
    methods: {
      onDismiss: () => {
        console.log('Alerta fechado!');
      },
    },
  }),
  parameters: {
    docs: {
      description: {
        story: 'Alertas que podem ser fechados pelo usuário.',
      },
    },
  },
};

export const WithoutIcon: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 16px;">
        <os-alert type="success" title="Sucesso" [showIcon]="false">
          Operação realizada com sucesso sem ícone.
        </os-alert>
        
        <os-alert type="warning" title="Atenção" [showIcon]="false">
          Verifique as informações sem ícone.
        </os-alert>
        
        <os-alert type="error" title="Erro" [showIcon]="false">
          Ocorreu um erro sem ícone.
        </os-alert>
        
        <os-alert type="info" title="Informação" [showIcon]="false">
          Informação importante sem ícone.
        </os-alert>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Alertas sem ícones para um visual mais limpo.',
      },
    },
  },
};

export const WithoutTitle: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 16px;">
        <os-alert type="success" [showIcon]="true">
          Operação realizada com sucesso! Seus dados foram salvos.
        </os-alert>
        
        <os-alert type="warning" [showIcon]="true">
          Verifique as informações antes de continuar.
        </os-alert>
        
        <os-alert type="error" [showIcon]="true">
          Ocorreu um erro ao processar sua solicitação.
        </os-alert>
        
        <os-alert type="info" [showIcon]="true">
          Esta é uma informação importante para você.
        </os-alert>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Alertas sem título, apenas com mensagem.',
      },
    },
  },
};

export const LongContent: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 16px;">
        <os-alert type="info" title="Política de Privacidade Atualizada" [showIcon]="true" [dismissible]="true">
          <p>Informamos que nossa política de privacidade foi atualizada em 15 de janeiro de 2024.</p>
          <p>As principais mudanças incluem:</p>
          <ul>
            <li>Novos procedimentos para coleta de dados</li>
            <li>Atualização dos termos de uso</li>
            <li>Melhorias na segurança da informação</li>
          </ul>
          <p>Para mais informações, consulte nossa <a href="#">política completa</a>.</p>
        </os-alert>
        
        <os-alert type="warning" title="Manutenção Programada" [showIcon]="true" [dismissible]="true">
          <p>O sistema passará por manutenção programada no dia 20 de janeiro de 2024, das 02:00 às 06:00.</p>
          <p>Durante este período, alguns serviços podem estar indisponíveis. Pedimos desculpas pelo inconveniente.</p>
        </os-alert>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Alertas com conteúdo longo e formatação HTML.',
      },
    },
  },
};

export const Interactive: Story = {
  args: {
    type: 'info',
    size: 'medium',
    title: 'Alerta Interativo',
    showIcon: true,
    dismissible: false,
  },
  render: (args) => ({
    props: args,
    template: `
      <os-alert 
        [type]="type"
        [size]="size"
        [title]="title"
        [showIcon]="showIcon"
        [dismissible]="dismissible"
        (dismiss)="dismiss($event)"
      >
        Este é um alerta interativo com controles para testar todas as propriedades.
      </os-alert>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Alerta interativo com controles para testar todas as propriedades.',
      },
    },
  },
};

