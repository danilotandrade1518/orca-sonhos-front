import type { Meta, StoryObj } from '@storybook/angular';
import { OsModalComponent } from './os-modal.component';

const meta: Meta<OsModalComponent> = {
  title: 'Design System/Organisms/Modal',
  component: OsModalComponent,
  parameters: {
    docs: {
      description: {
        component:
          'Modal do Design System Orca Sonhos com 4 variantes, 4 tamanhos e suporte a ações personalizadas.',
      },
    },
  },
  argTypes: {
    title: {
      control: { type: 'text' },
      description: 'Título do modal',
    },
    subtitle: {
      control: { type: 'text' },
      description: 'Subtítulo do modal',
    },
    variant: {
      control: { type: 'select' },
      options: ['default', 'confirmation', 'form', 'info'],
      description: 'Variante do modal',
    },
    size: {
      control: { type: 'select' },
      options: ['small', 'medium', 'large', 'fullscreen'],
      description: 'Tamanho do modal',
    },
    closable: {
      control: { type: 'boolean' },
      description: 'Modal pode ser fechado',
    },
    closeOnBackdrop: {
      control: { type: 'boolean' },
      description: 'Fechar ao clicar no fundo',
    },
    closeOnEscape: {
      control: { type: 'boolean' },
      description: 'Fechar ao pressionar Escape',
    },
    showDefaultActions: {
      control: { type: 'boolean' },
      description: 'Mostrar ações padrão (Confirmar/Cancelar)',
    },
    confirmText: {
      control: { type: 'text' },
      description: 'Texto do botão confirmar',
    },
    cancelText: {
      control: { type: 'text' },
      description: 'Texto do botão cancelar',
    },
    confirmDisabled: {
      control: { type: 'boolean' },
      description: 'Botão confirmar desabilitado',
    },
    confirmLoading: {
      control: { type: 'boolean' },
      description: 'Botão confirmar em loading',
    },
    fullHeight: {
      control: { type: 'boolean' },
      description: 'Modal com altura total',
    },
    centered: {
      control: { type: 'boolean' },
      description: 'Modal centralizado',
    },
    animated: {
      control: { type: 'boolean' },
      description: 'Animações habilitadas',
    },
    hapticFeedback: {
      control: { type: 'boolean' },
      description: 'Feedback háptico em dispositivos móveis',
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<OsModalComponent>;

const sampleActions = [
  {
    label: 'Salvar',
    variant: 'primary' as const,
    action: () => console.log('Salvar clicado'),
  },
  {
    label: 'Cancelar',
    variant: 'secondary' as const,
    action: () => console.log('Cancelar clicado'),
  },
];

export const Default: Story = {
  args: {
    title: 'Título do Modal',
    subtitle: 'Subtítulo do modal',
    variant: 'default',
    size: 'medium',
    closable: true,
    closeOnBackdrop: true,
    closeOnEscape: true,
    showDefaultActions: false,
    confirmText: 'Confirmar',
    cancelText: 'Cancelar',
    confirmDisabled: false,
    confirmLoading: false,
    fullHeight: false,
    centered: true,
    animated: true,
    hapticFeedback: true,
  },
  render: (args) => ({
    props: args,
    template: `
      <os-modal
        [title]="title"
        [subtitle]="subtitle"
        [variant]="variant"
        [size]="size"
        [closable]="closable"
        [closeOnBackdrop]="closeOnBackdrop"
        [closeOnEscape]="closeOnEscape"
        [showDefaultActions]="showDefaultActions"
        [confirmText]="confirmText"
        [cancelText]="cancelText"
        [confirmDisabled]="confirmDisabled"
        [confirmLoading]="confirmLoading"
        [fullHeight]="fullHeight"
        [centered]="centered"
        (closed)="closed()"
        (confirmed)="confirmed()"
        (backdropClicked)="backdropClicked()"
      >
        <p>Este é o conteúdo do modal. Aqui você pode colocar qualquer conteúdo que desejar.</p>
        <p>O modal suporta HTML, componentes Angular e qualquer outro conteúdo.</p>
      </os-modal>
    `,
  }),
};

export const Variants: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 24px;">
        <div>
          <h4>Default</h4>
          <os-modal title="Modal Padrão" subtitle="Este é um modal padrão" variant="default">
            <p>Conteúdo do modal padrão.</p>
          </os-modal>
        </div>

        <div>
          <h4>Confirmation</h4>
          <os-modal title="Confirmar Ação" subtitle="Tem certeza que deseja continuar?" variant="confirmation">
            <p>Esta ação não pode ser desfeita.</p>
          </os-modal>
        </div>

        <div>
          <h4>Form</h4>
          <os-modal title="Formulário" subtitle="Preencha os dados abaixo" variant="form">
            <p>Conteúdo do formulário aqui.</p>
          </os-modal>
        </div>

        <div>
          <h4>Info</h4>
          <os-modal title="Informação" subtitle="Informações importantes" variant="info">
            <p>Conteúdo informativo aqui.</p>
          </os-modal>
        </div>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Todas as variantes disponíveis do modal.',
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
          <os-modal title="Modal Pequeno" size="small">
            <p>Conteúdo do modal pequeno.</p>
          </os-modal>
        </div>

        <div>
          <h4>Medium</h4>
          <os-modal title="Modal Médio" size="medium">
            <p>Conteúdo do modal médio.</p>
          </os-modal>
        </div>

        <div>
          <h4>Large</h4>
          <os-modal title="Modal Grande" size="large">
            <p>Conteúdo do modal grande.</p>
          </os-modal>
        </div>

        <div>
          <h4>Fullscreen</h4>
          <os-modal title="Modal Tela Cheia" size="fullscreen">
            <p>Conteúdo do modal em tela cheia.</p>
          </os-modal>
        </div>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Todos os tamanhos disponíveis do modal.',
      },
    },
  },
};

export const WithDefaultActions: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 24px;">
        <div>
          <h4>Com Ações Padrão</h4>
          <os-modal
            title="Confirmar Ação"
            subtitle="Tem certeza que deseja continuar?"
            [showDefaultActions]="true"
            confirmText="Sim, continuar"
            cancelText="Não, cancelar"
          >
            <p>Esta ação não pode ser desfeita. Tem certeza que deseja continuar?</p>
          </os-modal>
        </div>

        <div>
          <h4>Com Botão Confirmar Desabilitado</h4>
          <os-modal
            title="Confirmar Ação"
            subtitle="Tem certeza que deseja continuar?"
            [showDefaultActions]="true"
            [confirmDisabled]="true"
            confirmText="Confirmar"
            cancelText="Cancelar"
          >
            <p>O botão confirmar está desabilitado.</p>
          </os-modal>
        </div>

        <div>
          <h4>Com Botão Confirmar em Loading</h4>
          <os-modal
            title="Processando"
            subtitle="Aguarde enquanto processamos sua solicitação"
            [showDefaultActions]="true"
            [confirmLoading]="true"
            confirmText="Processando..."
            cancelText="Cancelar"
          >
            <p>Por favor, aguarde enquanto processamos sua solicitação.</p>
          </os-modal>
        </div>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Modal com ações padrão (Confirmar/Cancelar).',
      },
    },
  },
};

export const WithCustomActions: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 24px;">
        <div>
          <h4>Com Ações Personalizadas</h4>
          <os-modal
            title="Ações Personalizadas"
            subtitle="Escolha uma ação"
            [actions]="sampleActions"
          >
            <p>Este modal tem ações personalizadas.</p>
          </os-modal>
        </div>

        <div>
          <h4>Com Múltiplas Ações</h4>
          <os-modal
            title="Múltiplas Ações"
            subtitle="Escolha uma das opções"
            [actions]="[
              { label: 'Salvar', variant: 'primary', action: () => console.log('Salvar') },
              { label: 'Salvar e Fechar', variant: 'secondary', action: () => console.log('Salvar e Fechar') },
              { label: 'Cancelar', variant: 'tertiary', action: () => console.log('Cancelar') }
            ]"
          >
            <p>Este modal tem múltiplas ações disponíveis.</p>
          </os-modal>
        </div>
      </div>
    `,
    props: {
      sampleActions,
    },
  }),
  parameters: {
    docs: {
      description: {
        story: 'Modal com ações personalizadas.',
      },
    },
  },
};

export const WithoutHeader: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 24px;">
        <div>
          <h4>Sem Título</h4>
          <os-modal [closable]="false">
            <p>Este modal não tem título nem subtítulo.</p>
          </os-modal>
        </div>

        <div>
          <h4>Sem Subtítulo</h4>
          <os-modal title="Apenas Título">
            <p>Este modal tem apenas o título.</p>
          </os-modal>
        </div>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Modal sem cabeçalho ou com cabeçalho parcial.',
      },
    },
  },
};

export const NonClosable: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 24px;">
        <div>
          <h4>Modal Não Fechável</h4>
          <os-modal
            title="Modal Não Fechável"
            subtitle="Este modal não pode ser fechado"
            [closable]="false"
            [closeOnBackdrop]="false"
            [closeOnEscape]="false"
            [showDefaultActions]="true"
          >
            <p>Este modal não pode ser fechado clicando no X, no fundo ou pressionando Escape.</p>
            <p>Use os botões de ação para interagir com o modal.</p>
          </os-modal>
        </div>

        <div>
          <h4>Modal com Fechamento Limitado</h4>
          <os-modal
            title="Modal com Fechamento Limitado"
            subtitle="Pode fechar clicando no fundo, mas não no X"
            [closable]="false"
            [closeOnBackdrop]="true"
            [closeOnEscape]="true"
          >
            <p>Este modal pode ser fechado clicando no fundo ou pressionando Escape, mas não tem o botão X.</p>
          </os-modal>
        </div>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Modal com diferentes configurações de fechamento.',
      },
    },
  },
};

export const FullHeight: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 24px;">
        <div>
          <h4>Modal com Altura Total</h4>
          <os-modal
            title="Modal com Altura Total"
            subtitle="Este modal ocupa toda a altura disponível"
            [fullHeight]="true"
            size="large"
          >
            <div style="height: 400px; background: #f5f5f5; padding: 20px; border-radius: 8px;">
              <p>Este é um modal com altura total.</p>
              <p>O conteúdo pode ser rolado se necessário.</p>
              <div style="height: 200px; background: #e0e0e0; margin: 20px 0; padding: 20px; border-radius: 4px;">
                <p>Área de conteúdo adicional</p>
              </div>
              <div style="height: 200px; background: #d0d0d0; margin: 20px 0; padding: 20px; border-radius: 4px;">
                <p>Mais conteúdo</p>
              </div>
            </div>
          </os-modal>
        </div>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Modal com altura total para conteúdo extenso.',
      },
    },
  },
};

export const FormModal: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 24px;">
        <div>
          <h4>Modal de Formulário</h4>
          <os-modal
            title="Criar Nova Transação"
            subtitle="Preencha os dados da transação"
            variant="form"
            size="large"
            [actions]="[
              { label: 'Salvar', variant: 'primary', action: () => console.log('Salvar') },
              { label: 'Cancelar', variant: 'secondary', action: () => console.log('Cancelar') }
            ]"
          >
            <div style="display: flex; flex-direction: column; gap: 16px;">
              <div>
                <label style="display: block; margin-bottom: 4px; font-weight: 500;">Descrição</label>
                <input type="text" placeholder="Digite a descrição" style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;">
              </div>
              <div>
                <label style="display: block; margin-bottom: 4px; font-weight: 500;">Valor</label>
                <input type="number" placeholder="Digite o valor" style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;">
              </div>
              <div>
                <label style="display: block; margin-bottom: 4px; font-weight: 500;">Categoria</label>
                <select style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;">
                  <option>Selecione uma categoria</option>
                  <option>Alimentação</option>
                  <option>Transporte</option>
                  <option>Lazer</option>
                  <option>Outros</option>
                </select>
              </div>
              <div>
                <label style="display: block; margin-bottom: 4px; font-weight: 500;">Data</label>
                <input type="date" style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;">
              </div>
            </div>
          </os-modal>
        </div>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Modal de formulário com campos de entrada.',
      },
    },
  },
};

export const Interactive: Story = {
  args: {
    title: 'Modal Interativo',
    subtitle: 'Teste todas as propriedades',
    variant: 'default',
    size: 'medium',
    closable: true,
    closeOnBackdrop: true,
    closeOnEscape: true,
    showDefaultActions: false,
    confirmText: 'Confirmar',
    cancelText: 'Cancelar',
    confirmDisabled: false,
    confirmLoading: false,
    fullHeight: false,
    centered: true,
    animated: true,
    hapticFeedback: true,
  },
  render: (args) => ({
    props: args,
    template: `
      <os-modal
        [title]="title"
        [subtitle]="subtitle"
        [variant]="variant"
        [size]="size"
        [closable]="closable"
        [closeOnBackdrop]="closeOnBackdrop"
        [closeOnEscape]="closeOnEscape"
        [showDefaultActions]="showDefaultActions"
        [confirmText]="confirmText"
        [cancelText]="cancelText"
        [confirmDisabled]="confirmDisabled"
        [confirmLoading]="confirmLoading"
        [fullHeight]="fullHeight"
        [centered]="centered"
        [animated]="animated"
        [hapticFeedback]="hapticFeedback"
        (closed)="closed()"
        (confirmed)="confirmed()"
        (backdropClicked)="backdropClicked()"
        (opened)="opened()"
        (animationEnd)="animationEnd($event)"
      >
        <p>Este é um modal interativo. Use os controles para testar todas as propriedades.</p>
        <p>Você pode alterar o título, subtítulo, variante, tamanho e outras propriedades.</p>
      </os-modal>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Modal interativo com controles para testar todas as propriedades.',
      },
    },
  },
};

export const WithAnimations: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 24px;">
        <div>
          <h4>Modal com Animações</h4>
          <os-modal
            title="Modal Animado"
            subtitle="Este modal tem animações suaves"
            [animated]="true"
            [hapticFeedback]="true"
            [showDefaultActions]="true"
          >
            <p>Este modal possui animações de entrada e saída suaves.</p>
            <p>Também inclui feedback háptico em dispositivos móveis.</p>
          </os-modal>
        </div>

        <div>
          <h4>Modal sem Animações</h4>
          <os-modal
            title="Modal Sem Animações"
            subtitle="Este modal não tem animações"
            [animated]="false"
            [hapticFeedback]="false"
            [showDefaultActions]="true"
          >
            <p>Este modal não possui animações, ideal para dispositivos com prefers-reduced-motion.</p>
          </os-modal>
        </div>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Modal com e sem animações para demonstrar as diferenças.',
      },
    },
  },
};
