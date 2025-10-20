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
    debounceTime: {
      control: { type: 'number' },
      description: 'Tempo de debounce em ms',
    },
    role: {
      control: { type: 'select' },
      options: ['searchbox', 'combobox', 'textbox'],
      description: 'Role ARIA do componente',
    },
    ariaLabel: {
      control: { type: 'text' },
      description: 'Label ARIA personalizado',
    },
    enableHighlight: {
      control: { type: 'boolean' },
      description: 'Habilitar destaque de termos de busca',
    },
    enableKeyboardNavigation: {
      control: { type: 'boolean' },
      description: 'Habilitar navegação por teclado',
    },
    enableAdvancedFilters: {
      control: { type: 'boolean' },
      description: 'Habilitar filtros avançados',
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
    debouncedSearch: {
      action: 'debouncedSearch',
      description: 'Evento de busca com debounce',
    },
    suggestionHover: {
      action: 'suggestionHover',
      description: 'Evento de hover em sugestão',
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<OsSearchBoxComponent>;

const sampleSuggestions: OsSearchSuggestion[] = [
  { id: '1', text: 'Angular', category: 'Framework' },
  { id: '2', text: 'React', category: 'Framework' },
  { id: '3', text: 'Vue.js', category: 'Framework' },
  { id: '4', text: 'TypeScript', category: 'Linguagem' },
  { id: '5', text: 'JavaScript', category: 'Linguagem' },
  { id: '6', text: 'Node.js', category: 'Runtime' },
  { id: '7', text: 'Express', category: 'Framework' },
  { id: '8', text: 'MongoDB', category: 'Banco de Dados' },
  { id: '9', text: 'PostgreSQL', category: 'Banco de Dados' },
  { id: '10', text: 'Docker', category: 'DevOps' },
];

export const Default: Story = {
  args: {
    value: '',
    placeholder: 'Buscar...',
    size: 'medium',
    variant: 'default',
    disabled: false,
    showSuggestions: true,
    suggestions: sampleSuggestions,
    maxSuggestions: 5,
    debounceTime: 300,
    role: 'searchbox',
    enableHighlight: true,
    enableKeyboardNavigation: true,
    enableAdvancedFilters: false,
  },
};

export const WithHighlight: Story = {
  args: {
    ...Default.args,
    value: 'ang',
    enableHighlight: true,
  },
};

export const WithCategories: Story = {
  args: {
    ...Default.args,
    suggestions: sampleSuggestions,
    maxSuggestions: 8,
  },
};

export const LargeSize: Story = {
  args: {
    ...Default.args,
    size: 'large',
    suggestions: sampleSuggestions,
  },
};

export const OutlinedVariant: Story = {
  args: {
    ...Default.args,
    variant: 'outlined',
    suggestions: sampleSuggestions,
  },
};

export const FilledVariant: Story = {
  args: {
    ...Default.args,
    variant: 'filled',
    suggestions: sampleSuggestions,
  },
};

export const Disabled: Story = {
  args: {
    ...Default.args,
    disabled: true,
    value: 'Busca desabilitada',
  },
};

export const WithoutSuggestions: Story = {
  args: {
    ...Default.args,
    showSuggestions: false,
  },
};

export const WithDebounce: Story = {
  args: {
    ...Default.args,
    debounceTime: 500,
    suggestions: sampleSuggestions,
  },
  parameters: {
    docs: {
      description: {
        story: 'Componente com debounce de 500ms para demonstração de performance.',
      },
    },
  },
};

export const KeyboardNavigation: Story = {
  args: {
    ...Default.args,
    suggestions: sampleSuggestions,
    enableKeyboardNavigation: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Use as setas do teclado para navegar pelas sugestões, Enter para selecionar e Escape para fechar.',
      },
    },
  },
};

export const NoResults: Story = {
  args: {
    ...Default.args,
    value: 'xyz123',
    suggestions: sampleSuggestions,
  },
  parameters: {
    docs: {
      description: {
        story: 'Estado quando não há sugestões que correspondem ao termo de busca.',
      },
    },
  },
};

export const MobileOptimized: Story = {
  args: {
    ...Default.args,
    suggestions: sampleSuggestions,
    size: 'large',
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    docs: {
      description: {
        story: 'Otimizado para dispositivos móveis com sugestões em modal bottom sheet.',
      },
    },
  },
};

export const Accessibility: Story = {
  args: {
    ...Default.args,
    suggestions: sampleSuggestions,
    role: 'combobox',
    ariaLabel: 'Buscar por tecnologias',
  },
  parameters: {
    docs: {
      description: {
        story: 'Exemplo com atributos ARIA completos para acessibilidade WCAG 2.1 AA.',
      },
    },
  },
};
