import type { Meta, StoryObj } from '@storybook/angular';
import { OsDropdownComponent } from './os-dropdown.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

const meta: Meta<OsDropdownComponent> = {
  title: 'Design System/Molecules/Dropdown',
  component: OsDropdownComponent,
  parameters: {
    docs: {
      description: {
        component:
          'Dropdown do Design System Orca Sonhos com 4 variantes, 3 tamanhos e suporte a ícones e divisores.',
      },
    },
  },
  argTypes: {
    options: {
      control: { type: 'object' },
      description: 'Lista de opções do dropdown',
    },
    placeholder: {
      control: { type: 'text' },
      description: 'Texto placeholder quando nenhuma opção está selecionada',
    },
    selectedValue: {
      control: { type: 'text' },
      description: 'Valor da opção selecionada',
    },
    variant: {
      control: { type: 'select' },
      options: ['default', 'primary', 'secondary', 'accent'],
      description: 'Variante visual do dropdown',
    },
    size: {
      control: { type: 'select' },
      options: ['small', 'medium', 'large'],
      description: 'Tamanho do dropdown',
    },
    disabled: {
      control: { type: 'boolean' },
      description: 'Dropdown desabilitado',
    },
    icon: {
      control: { type: 'text' },
      description: 'Ícone do dropdown',
    },
    showChevron: {
      control: { type: 'boolean' },
      description: 'Mostrar seta de expansão',
    },
    alignment: {
      control: { type: 'select' },
      options: ['start', 'center', 'end'],
      description: 'Alinhamento do menu',
    },
    ariaLabel: {
      control: { type: 'text' },
      description: 'Rótulo para acessibilidade',
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<OsDropdownComponent>;

const sampleOptions = [
  { value: 'option1', label: 'Opção 1' },
  { value: 'option2', label: 'Opção 2' },
  { value: 'option3', label: 'Opção 3' },
  { value: 'option4', label: 'Opção 4' },
];

const optionsWithIcons = [
  { value: 'home', label: 'Início', icon: 'home' },
  { value: 'profile', label: 'Perfil', icon: 'person' },
  { value: 'settings', label: 'Configurações', icon: 'settings' },
  { value: 'logout', label: 'Sair', icon: 'logout' },
];

const optionsWithDividers = [
  { value: 'option1', label: 'Opção 1' },
  { value: 'option2', label: 'Opção 2' },
  { divider: true },
  { value: 'option3', label: 'Opção 3' },
  { value: 'option4', label: 'Opção 4' },
  { divider: true },
  { value: 'option5', label: 'Opção 5' },
];

export const Default: Story = {
  args: {
    options: sampleOptions,
    placeholder: 'Selecionar opção',
    selectedValue: null,
    variant: 'default',
    size: 'medium',
    disabled: false,
    icon: '',
    showChevron: true,
    alignment: 'start',
    ariaLabel: 'Selecionar opção',
  },
  render: (args) => ({
    props: args,
    template: `
      <os-dropdown
        [options]="options"
        [placeholder]="placeholder"
        [selectedValue]="selectedValue"
        [variant]="variant"
        [size]="size"
        [disabled]="disabled"
        [icon]="icon"
        [showChevron]="showChevron"
        [alignment]="alignment"
        [ariaLabel]="ariaLabel"
        (valueChange)="valueChange($event)"
        (optionSelect)="optionSelect($event)"
        (menuOpen)="menuOpen()"
        (menuClose)="menuClose()"
      ></os-dropdown>
    `,
  }),
};

export const Variants: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 24px;">
        <div>
          <h4>Default</h4>
          <os-dropdown
            [options]="sampleOptions"
            placeholder="Selecionar opção"
            variant="default"
          ></os-dropdown>
        </div>

        <div>
          <h4>Primary</h4>
          <os-dropdown
            [options]="sampleOptions"
            placeholder="Selecionar opção"
            variant="primary"
          ></os-dropdown>
        </div>

        <div>
          <h4>Secondary</h4>
          <os-dropdown
            [options]="sampleOptions"
            placeholder="Selecionar opção"
            variant="secondary"
          ></os-dropdown>
        </div>

        <div>
          <h4>Accent</h4>
          <os-dropdown
            [options]="sampleOptions"
            placeholder="Selecionar opção"
            variant="accent"
          ></os-dropdown>
        </div>
      </div>
    `,
    props: {
      sampleOptions,
    },
  }),
  parameters: {
    docs: {
      description: {
        story: 'Todas as variantes disponíveis do dropdown.',
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
          <os-dropdown
            [options]="sampleOptions"
            placeholder="Selecionar opção"
            size="small"
          ></os-dropdown>
        </div>

        <div>
          <h4>Medium</h4>
          <os-dropdown
            [options]="sampleOptions"
            placeholder="Selecionar opção"
            size="medium"
          ></os-dropdown>
        </div>

        <div>
          <h4>Large</h4>
          <os-dropdown
            [options]="sampleOptions"
            placeholder="Selecionar opção"
            size="large"
          ></os-dropdown>
        </div>
      </div>
    `,
    props: {
      sampleOptions,
    },
  }),
  parameters: {
    docs: {
      description: {
        story: 'Todos os tamanhos disponíveis do dropdown.',
      },
    },
  },
};

export const WithIcons: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 24px;">
        <div>
          <h4>Com Ícone no Trigger</h4>
          <os-dropdown
            [options]="sampleOptions"
            placeholder="Selecionar opção"
            icon="settings"
          ></os-dropdown>
        </div>

        <div>
          <h4>Com Ícones nas Opções</h4>
          <os-dropdown
            [options]="optionsWithIcons"
            placeholder="Selecionar opção"
          ></os-dropdown>
        </div>

        <div>
          <h4>Com Ícone no Trigger e nas Opções</h4>
          <os-dropdown
            [options]="optionsWithIcons"
            placeholder="Selecionar opção"
            icon="menu"
          ></os-dropdown>
        </div>
      </div>
    `,
    props: {
      sampleOptions,
      optionsWithIcons,
    },
  }),
  parameters: {
    docs: {
      description: {
        story: 'Dropdown com ícones no trigger e nas opções.',
      },
    },
  },
};

export const WithDividers: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 24px;">
        <div>
          <h4>Com Divisores</h4>
          <os-dropdown
            [options]="optionsWithDividers"
            placeholder="Selecionar opção"
          ></os-dropdown>
        </div>

        <div>
          <h4>Com Divisores e Ícones</h4>
          <os-dropdown
            [options]="optionsWithDividers"
            placeholder="Selecionar opção"
            icon="more_vert"
          ></os-dropdown>
        </div>
      </div>
    `,
    props: {
      optionsWithDividers,
    },
  }),
  parameters: {
    docs: {
      description: {
        story: 'Dropdown com divisores para agrupar opções.',
      },
    },
  },
};

export const WithDisabledOptions: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 24px;">
        <div>
          <h4>Com Opções Desabilitadas</h4>
          <os-dropdown
            [options]="[
              { value: 'option1', label: 'Opção 1' },
              { value: 'option2', label: 'Opção 2', disabled: true },
              { value: 'option3', label: 'Opção 3' },
              { value: 'option4', label: 'Opção 4', disabled: true }
            ]"
            placeholder="Selecionar opção"
          ></os-dropdown>
        </div>

        <div>
          <h4>Dropdown Desabilitado</h4>
          <os-dropdown
            [options]="sampleOptions"
            placeholder="Selecionar opção"
            [disabled]="true"
          ></os-dropdown>
        </div>
      </div>
    `,
    props: {
      sampleOptions,
    },
  }),
  parameters: {
    docs: {
      description: {
        story: 'Dropdown com opções desabilitadas e dropdown desabilitado.',
      },
    },
  },
};

export const WithSelectedValue: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 24px;">
        <div>
          <h4>Com Valor Selecionado</h4>
          <os-dropdown
            [options]="sampleOptions"
            placeholder="Selecionar opção"
            selectedValue="option2"
          ></os-dropdown>
        </div>

        <div>
          <h4>Com Valor Selecionado e Ícone</h4>
          <os-dropdown
            [options]="optionsWithIcons"
            placeholder="Selecionar opção"
            selectedValue="profile"
            icon="person"
          ></os-dropdown>
        </div>
      </div>
    `,
    props: {
      sampleOptions,
      optionsWithIcons,
    },
  }),
  parameters: {
    docs: {
      description: {
        story: 'Dropdown com valor pré-selecionado.',
      },
    },
  },
};

export const Alignments: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 24px;">
        <div>
          <h4>Alinhamento Start</h4>
          <os-dropdown
            [options]="sampleOptions"
            placeholder="Selecionar opção"
            alignment="start"
          ></os-dropdown>
        </div>

        <div>
          <h4>Alinhamento Center</h4>
          <os-dropdown
            [options]="sampleOptions"
            placeholder="Selecionar opção"
            alignment="center"
          ></os-dropdown>
        </div>

        <div>
          <h4>Alinhamento End</h4>
          <os-dropdown
            [options]="sampleOptions"
            placeholder="Selecionar opção"
            alignment="end"
          ></os-dropdown>
        </div>
      </div>
    `,
    props: {
      sampleOptions,
    },
  }),
  parameters: {
    docs: {
      description: {
        story: 'Diferentes alinhamentos do menu dropdown.',
      },
    },
  },
};

export const WithoutChevron: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 24px;">
        <div>
          <h4>Sem Seta de Expansão</h4>
          <os-dropdown
            [options]="sampleOptions"
            placeholder="Selecionar opção"
            [showChevron]="false"
          ></os-dropdown>
        </div>

        <div>
          <h4>Sem Seta com Ícone</h4>
          <os-dropdown
            [options]="sampleOptions"
            placeholder="Selecionar opção"
            [showChevron]="false"
            icon="more_vert"
          ></os-dropdown>
        </div>
      </div>
    `,
    props: {
      sampleOptions,
    },
  }),
  parameters: {
    docs: {
      description: {
        story: 'Dropdown sem seta de expansão.',
      },
    },
  },
};

export const Interactive: Story = {
  args: {
    options: sampleOptions,
    placeholder: 'Selecionar opção',
    selectedValue: null,
    variant: 'default',
    size: 'medium',
    disabled: false,
    icon: '',
    showChevron: true,
    alignment: 'start',
    ariaLabel: 'Selecionar opção',
  },
  render: (args) => ({
    props: args,
    template: `
      <os-dropdown
        [options]="options"
        [placeholder]="placeholder"
        [selectedValue]="selectedValue"
        [variant]="variant"
        [size]="size"
        [disabled]="disabled"
        [icon]="icon"
        [showChevron]="showChevron"
        [alignment]="alignment"
        [ariaLabel]="ariaLabel"
        (valueChange)="valueChange($event)"
        (optionSelect)="optionSelect($event)"
        (menuOpen)="menuOpen()"
        (menuClose)="menuClose()"
      ></os-dropdown>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Dropdown interativo com controles para testar todas as propriedades.',
      },
    },
  },
};
