import type { Meta, StoryObj } from '@storybook/angular';
import { OsSearchBoxComponent, OsSearchSuggestion } from './os-search-box.component';

const meta: Meta<OsSearchBoxComponent> = {
  title: 'Design System/Molecules/Search Box',
  component: OsSearchBoxComponent,
  parameters: {
    docs: {
      description: {
        component: 'Caixa de busca do Design System Orca Sonhos com sugestões, filtros e ações.',
      },
    },
  },
  argTypes: {
    value: {
      control: { type: 'text' },
      description: 'Valor da busca',
    },
    placeholder: {
      control: { type: 'text' },
      description: 'Placeholder da busca',
    },
    size: {
      control: { type: 'select' },
      options: ['small', 'medium', 'large'],
      description: 'Tamanho da caixa de busca',
    },
    variant: {
      control: { type: 'select' },
      options: ['default', 'outlined', 'filled'],
      description: 'Variante visual da caixa de busca',
    },
    disabled: {
      control: { type: 'boolean' },
      description: 'Caixa de busca desabilitada',
    },
    showSuggestions: {
      control: { type: 'boolean' },
      description: 'Exibir sugestões',
    },
    suggestions: {
      control: { type: 'object' },
      description: 'Lista de sugestões',
    },
    maxSuggestions: {
      control: { type: 'number' },
      description: 'Número máximo de sugestões',
    },
    valueChange: {
      action: 'valueChange',
      description: 'Evento de mudança de valor',
    },
    searchEvent: {
      action: 'searchEvent',
      description: 'Evento de busca',
    },
    suggestionSelect: {
      action: 'suggestionSelect',
      description: 'Evento de seleção de sugestão',
    },
    focusEvent: {
      action: 'focusEvent',
      description: 'Evento de foco',
    },
    blurEvent: {
      action: 'blurEvent',
      description: 'Evento de blur',
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<OsSearchBoxComponent>;

const sampleSuggestions: OsSearchSuggestion[] = [
  { id: '1', text: 'Usuários', category: 'Pessoas' },
  { id: '2', text: 'Produtos', category: 'Itens' },
  { id: '3', text: 'Relatórios', category: 'Documentos' },
  { id: '4', text: 'Configurações', category: 'Sistema' },
  { id: '5', text: 'Transações', category: 'Financeiro' },
];

export const Default: Story = {
  args: {
    value: '',
    placeholder: 'Digite para buscar...',
    size: 'medium',
    variant: 'default',
    disabled: false,
    showSuggestions: true,
    suggestions: sampleSuggestions,
    maxSuggestions: 5,
  },
  render: (args) => ({
    props: args,
    template: `
      <os-search-box
        [value]="value"
        [placeholder]="placeholder"
        [size]="size"
        [variant]="variant"
        [disabled]="disabled"
        [showSuggestions]="showSuggestions"
        [suggestions]="suggestions"
        [maxSuggestions]="maxSuggestions"
        (valueChange)="valueChange($event)"
        (searchEvent)="searchEvent($event)"
        (suggestionSelect)="suggestionSelect($event)"
        (focusEvent)="focusEvent($event)"
        (blurEvent)="blurEvent($event)"
      ></os-search-box>
    `,
  }),
};

export const Variants: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 16px;">
        <div>
          <h4>Default</h4>
          <os-search-box
            placeholder="Busca padrão"
            variant="default"
            [showSuggestions]="true"
            [suggestions]="suggestions"
          ></os-search-box>
        </div>

        <div>
          <h4>Outlined</h4>
          <os-search-box
            placeholder="Busca outlined"
            variant="outlined"
            [showSuggestions]="true"
            [suggestions]="suggestions"
          ></os-search-box>
        </div>

        <div>
          <h4>Filled</h4>
          <os-search-box
            placeholder="Busca filled"
            variant="filled"
            [showSuggestions]="true"
            [suggestions]="suggestions"
          ></os-search-box>
        </div>
      </div>
    `,
    props: {
      suggestions: sampleSuggestions,
    },
  }),
  parameters: {
    docs: {
      description: {
        story: 'Todas as variantes disponíveis da caixa de busca.',
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
          <os-search-box
            placeholder="Busca pequena"
            size="small"
            [showSuggestions]="true"
            [suggestions]="suggestions"
          ></os-search-box>
        </div>

        <div>
          <h4>Medium</h4>
          <os-search-box
            placeholder="Busca média"
            size="medium"
            [showSuggestions]="true"
            [suggestions]="suggestions"
          ></os-search-box>
        </div>

        <div>
          <h4>Large</h4>
          <os-search-box
            placeholder="Busca grande"
            size="large"
            [showSuggestions]="true"
            [suggestions]="suggestions"
          ></os-search-box>
        </div>
      </div>
    `,
    props: {
      suggestions: sampleSuggestions,
    },
  }),
  parameters: {
    docs: {
      description: {
        story: 'Todos os tamanhos disponíveis da caixa de busca.',
      },
    },
  },
};

export const WithSuggestions: Story = {
  render: () => ({
    template: `
      <os-search-box
        placeholder="Digite para ver sugestões..."
        [showSuggestions]="true"
        [suggestions]="suggestions"
        (suggestionClick)="onSuggestionClick($event)"
      ></os-search-box>
    `,
    props: {
      suggestions: sampleSuggestions,
    },
    methods: {
      onSuggestionClick: (suggestion: OsSearchSuggestion) => {
        console.log('Sugestão clicada:', suggestion);
      },
    },
  }),
  parameters: {
    docs: {
      description: {
        story: 'Caixa de busca com sugestões de busca.',
      },
    },
  },
};

export const WithMaxSuggestions: Story = {
  render: () => ({
    template: `
      <os-search-box
        placeholder="Busca com limite de sugestões..."
        [showSuggestions]="true"
        [suggestions]="suggestions"
        [maxSuggestions]="3"
        (suggestionSelect)="onSuggestionSelect($event)"
      ></os-search-box>
    `,
    props: {
      suggestions: sampleSuggestions,
    },
    methods: {
      onSuggestionSelect: (suggestion: OsSearchSuggestion) => {
        console.log('Sugestão selecionada:', suggestion);
      },
    },
  }),
  parameters: {
    docs: {
      description: {
        story: 'Caixa de busca com limite de sugestões.',
      },
    },
  },
};

export const WithEvents: Story = {
  render: () => ({
    template: `
      <os-search-box
        placeholder="Busca com eventos..."
        [showSuggestions]="true"
        [suggestions]="suggestions"
        (valueChange)="onValueChange($event)"
        (searchEvent)="onSearchEvent($event)"
        (suggestionSelect)="onSuggestionSelect($event)"
        (focusEvent)="onFocusEvent($event)"
        (blurEvent)="onBlurEvent($event)"
      ></os-search-box>
    `,
    props: {
      suggestions: sampleSuggestions,
    },
    methods: {
      onValueChange: (value: string) => {
        console.log('Valor alterado:', value);
      },
      onSearchEvent: (value: string) => {
        console.log('Busca realizada:', value);
      },
      onSuggestionSelect: (suggestion: OsSearchSuggestion) => {
        console.log('Sugestão selecionada:', suggestion);
      },
      onFocusEvent: (event: FocusEvent) => {
        console.log('Foco recebido:', event);
      },
      onBlurEvent: (event: FocusEvent) => {
        console.log('Blur recebido:', event);
      },
    },
  }),
  parameters: {
    docs: {
      description: {
        story: 'Caixa de busca com todos os eventos.',
      },
    },
  },
};

export const Complete: Story = {
  render: () => ({
    template: `
      <os-search-box
        placeholder="Busca completa com todos os recursos..."
        [showSuggestions]="true"
        [suggestions]="suggestions"
        [maxSuggestions]="5"
        (suggestionSelect)="onSuggestionSelect($event)"
        (searchEvent)="onSearchEvent($event)"
        (valueChange)="onValueChange($event)"
      ></os-search-box>
    `,
    props: {
      suggestions: sampleSuggestions,
    },
    methods: {
      onSuggestionSelect: (suggestion: OsSearchSuggestion) => {
        console.log('Sugestão selecionada:', suggestion);
      },
      onSearchEvent: (value: string) => {
        console.log('Busca realizada:', value);
      },
      onValueChange: (value: string) => {
        console.log('Valor alterado:', value);
      },
    },
  }),
  parameters: {
    docs: {
      description: {
        story: 'Caixa de busca completa com sugestões e eventos.',
      },
    },
  },
};

export const States: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 16px;">
        <div>
          <h4>Normal</h4>
          <os-search-box
            placeholder="Busca normal"
            [showSuggestions]="true"
            [suggestions]="suggestions"
          ></os-search-box>
        </div>

        <div>
          <h4>Com Valor</h4>
          <os-search-box
            value="termo de busca"
            placeholder="Busca com valor"
            [showSuggestions]="true"
            [suggestions]="suggestions"
          ></os-search-box>
        </div>

        <div>
          <h4>Desabilitada</h4>
          <os-search-box
            placeholder="Busca desabilitada"
            [disabled]="true"
          ></os-search-box>
        </div>
      </div>
    `,
    props: {
      suggestions: sampleSuggestions,
    },
  }),
  parameters: {
    docs: {
      description: {
        story: 'Diferentes estados da caixa de busca.',
      },
    },
  },
};

export const Interactive: Story = {
  args: {
    value: '',
    placeholder: 'Digite para buscar...',
    size: 'medium',
    variant: 'default',
    disabled: false,
    showSuggestions: true,
    suggestions: sampleSuggestions,
    maxSuggestions: 5,
  },
  render: (args) => ({
    props: args,
    template: `
      <os-search-box
        [value]="value"
        [placeholder]="placeholder"
        [size]="size"
        [variant]="variant"
        [disabled]="disabled"
        [showSuggestions]="showSuggestions"
        [suggestions]="suggestions"
        [maxSuggestions]="maxSuggestions"
        (valueChange)="valueChange($event)"
        (searchEvent)="searchEvent($event)"
        (suggestionSelect)="suggestionSelect($event)"
        (focusEvent)="focusEvent($event)"
        (blurEvent)="blurEvent($event)"
      ></os-search-box>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Caixa de busca interativa com controles para testar todas as propriedades.',
      },
    },
  },
};
