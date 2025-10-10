import type { Meta, StoryObj } from '@storybook/angular';
import { OsFilterBarComponent } from './os-filter-bar.component';

const meta: Meta<OsFilterBarComponent> = {
  title: 'Design System/Molecules/Filter Bar',
  component: OsFilterBarComponent,
  parameters: {
    docs: {
      description: {
        component:
          'Barra de filtros do Design System Orca Sonhos com 3 variantes, 3 tamanhos e suporte a ações personalizadas.',
      },
    },
  },
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['default', 'compact', 'expanded'],
      description: 'Variante visual da barra de filtros',
    },
    size: {
      control: { type: 'select' },
      options: ['small', 'medium', 'large'],
      description: 'Tamanho da barra de filtros',
    },
    showActions: {
      control: { type: 'boolean' },
      description: 'Mostrar área de ações',
    },
    showClearButton: {
      control: { type: 'boolean' },
      description: 'Mostrar botão de limpar',
    },
    showApplyButton: {
      control: { type: 'boolean' },
      description: 'Mostrar botão de aplicar',
    },
    clearButtonText: {
      control: { type: 'text' },
      description: 'Texto do botão de limpar',
    },
    applyButtonText: {
      control: { type: 'text' },
      description: 'Texto do botão de aplicar',
    },
    hasActiveFilters: {
      control: { type: 'boolean' },
      description: 'Indica se há filtros ativos',
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<OsFilterBarComponent>;

export const Default: Story = {
  args: {
    variant: 'default',
    size: 'medium',
    showActions: true,
    showClearButton: true,
    showApplyButton: true,
    clearButtonText: 'Limpar',
    applyButtonText: 'Aplicar',
    hasActiveFilters: false,
  },
  render: (args) => ({
    props: args,
    template: `
      <os-filter-bar 
        [variant]="variant"
        [size]="size"
        [showActions]="showActions"
        [showClearButton]="showClearButton"
        [showApplyButton]="showApplyButton"
        [clearButtonText]="clearButtonText"
        [applyButtonText]="applyButtonText"
        [hasActiveFilters]="hasActiveFilters"
        (clear)="clear()"
        (apply)="apply()"
      >
        <os-input placeholder="Buscar..." size="medium"></os-input>
        <os-select 
          placeholder="Categoria" 
          [options]="[
            { value: 'all', label: 'Todas' },
            { value: 'active', label: 'Ativas' },
            { value: 'inactive', label: 'Inativas' }
          ]"
          size="medium"
        ></os-select>
      </os-filter-bar>
    `,
  }),
};

export const Variants: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 24px;">
        <div>
          <h4>Default</h4>
          <os-filter-bar variant="default">
            <os-input placeholder="Buscar..." size="medium"></os-input>
            <os-select 
              placeholder="Categoria" 
              [options]="[
                { value: 'all', label: 'Todas' },
                { value: 'active', label: 'Ativas' },
                { value: 'inactive', label: 'Inativas' }
              ]"
              size="medium"
            ></os-select>
          </os-filter-bar>
        </div>
        
        <div>
          <h4>Compact</h4>
          <os-filter-bar variant="compact">
            <os-input placeholder="Buscar..." size="small"></os-input>
            <os-select 
              placeholder="Categoria" 
              [options]="[
                { value: 'all', label: 'Todas' },
                { value: 'active', label: 'Ativas' },
                { value: 'inactive', label: 'Inativas' }
              ]"
              size="small"
            ></os-select>
          </os-filter-bar>
        </div>
        
        <div>
          <h4>Expanded</h4>
          <os-filter-bar variant="expanded">
            <os-input placeholder="Buscar..." size="large"></os-input>
            <os-select 
              placeholder="Categoria" 
              [options]="[
                { value: 'all', label: 'Todas' },
                { value: 'active', label: 'Ativas' },
                { value: 'inactive', label: 'Inativas' }
              ]"
              size="large"
            ></os-select>
            <os-date-input placeholder="Data" size="large"></os-date-input>
          </os-filter-bar>
        </div>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Todas as variantes disponíveis da barra de filtros.',
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
          <os-filter-bar size="small">
            <os-input placeholder="Buscar..." size="small"></os-input>
            <os-select 
              placeholder="Categoria" 
              [options]="[
                { value: 'all', label: 'Todas' },
                { value: 'active', label: 'Ativas' },
                { value: 'inactive', label: 'Inativas' }
              ]"
              size="small"
            ></os-select>
          </os-filter-bar>
        </div>
        
        <div>
          <h4>Medium</h4>
          <os-filter-bar size="medium">
            <os-input placeholder="Buscar..." size="medium"></os-input>
            <os-select 
              placeholder="Categoria" 
              [options]="[
                { value: 'all', label: 'Todas' },
                { value: 'active', label: 'Ativas' },
                { value: 'inactive', label: 'Inativas' }
              ]"
              size="medium"
            ></os-select>
          </os-filter-bar>
        </div>
        
        <div>
          <h4>Large</h4>
          <os-filter-bar size="large">
            <os-input placeholder="Buscar..." size="large"></os-input>
            <os-select 
              placeholder="Categoria" 
              [options]="[
                { value: 'all', label: 'Todas' },
                { value: 'active', label: 'Ativas' },
                { value: 'inactive', label: 'Inativas' }
              ]"
              size="large"
            ></os-select>
          </os-filter-bar>
        </div>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Todos os tamanhos disponíveis da barra de filtros.',
      },
    },
  },
};

export const WithActiveFilters: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 24px;">
        <div>
          <h4>Sem Filtros Ativos</h4>
          <os-filter-bar [hasActiveFilters]="false">
            <os-input placeholder="Buscar..." size="medium"></os-input>
            <os-select 
              placeholder="Categoria" 
              [options]="[
                { value: 'all', label: 'Todas' },
                { value: 'active', label: 'Ativas' },
                { value: 'inactive', label: 'Inativas' }
              ]"
              size="medium"
            ></os-select>
          </os-filter-bar>
        </div>
        
        <div>
          <h4>Com Filtros Ativos</h4>
          <os-filter-bar [hasActiveFilters]="true">
            <os-input placeholder="Buscar..." size="medium" value="exemplo"></os-input>
            <os-select 
              placeholder="Categoria" 
              [options]="[
                { value: 'all', label: 'Todas' },
                { value: 'active', label: 'Ativas' },
                { value: 'inactive', label: 'Inativas' }
              ]"
              size="medium"
              value="active"
            ></os-select>
          </os-filter-bar>
        </div>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Barra de filtros com e sem filtros ativos.',
      },
    },
  },
};

export const WithoutActions: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 24px;">
        <div>
          <h4>Sem Ações</h4>
          <os-filter-bar [showActions]="false">
            <os-input placeholder="Buscar..." size="medium"></os-input>
            <os-select 
              placeholder="Categoria" 
              [options]="[
                { value: 'all', label: 'Todas' },
                { value: 'active', label: 'Ativas' },
                { value: 'inactive', label: 'Inativas' }
              ]"
              size="medium"
            ></os-select>
          </os-filter-bar>
        </div>
        
        <div>
          <h4>Apenas Botão Limpar</h4>
          <os-filter-bar [showApplyButton]="false">
            <os-input placeholder="Buscar..." size="medium"></os-input>
            <os-select 
              placeholder="Categoria" 
              [options]="[
                { value: 'all', label: 'Todas' },
                { value: 'active', label: 'Ativas' },
                { value: 'inactive', label: 'Inativas' }
              ]"
              size="medium"
            ></os-select>
          </os-filter-bar>
        </div>
        
        <div>
          <h4>Apenas Botão Aplicar</h4>
          <os-filter-bar [showClearButton]="false">
            <os-input placeholder="Buscar..." size="medium"></os-input>
            <os-select 
              placeholder="Categoria" 
              [options]="[
                { value: 'all', label: 'Todas' },
                { value: 'active', label: 'Ativas' },
                { value: 'inactive', label: 'Inativas' }
              ]"
              size="medium"
            ></os-select>
          </os-filter-bar>
        </div>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Barra de filtros com diferentes configurações de ações.',
      },
    },
  },
};

export const CustomButtonTexts: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 24px;">
        <div>
          <h4>Textos Personalizados</h4>
          <os-filter-bar 
            clearButtonText="Resetar"
            applyButtonText="Filtrar"
            [hasActiveFilters]="true"
          >
            <os-input placeholder="Buscar..." size="medium"></os-input>
            <os-select 
              placeholder="Categoria" 
              [options]="[
                { value: 'all', label: 'Todas' },
                { value: 'active', label: 'Ativas' },
                { value: 'inactive', label: 'Inativas' }
              ]"
              size="medium"
            ></os-select>
          </os-filter-bar>
        </div>
        
        <div>
          <h4>Textos em Inglês</h4>
          <os-filter-bar 
            clearButtonText="Clear"
            applyButtonText="Apply"
            [hasActiveFilters]="true"
          >
            <os-input placeholder="Search..." size="medium"></os-input>
            <os-select 
              placeholder="Category" 
              [options]="[
                { value: 'all', label: 'All' },
                { value: 'active', label: 'Active' },
                { value: 'inactive', label: 'Inactive' }
              ]"
              size="medium"
            ></os-select>
          </os-filter-bar>
        </div>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Barra de filtros com textos personalizados nos botões.',
      },
    },
  },
};

export const ComplexFilters: Story = {
  render: () => ({
    template: `
      <div style="max-width: 800px;">
        <h3>Filtros Avançados</h3>
        <os-filter-bar variant="expanded" size="large">
          <os-input placeholder="Buscar por nome..." size="large"></os-input>
          <os-select 
            placeholder="Status" 
            [options]="[
              { value: 'all', label: 'Todos' },
              { value: 'active', label: 'Ativos' },
              { value: 'inactive', label: 'Inativos' },
              { value: 'pending', label: 'Pendentes' }
            ]"
            size="large"
          ></os-select>
          <os-select 
            placeholder="Categoria" 
            [options]="[
              { value: 'all', label: 'Todas' },
              { value: 'premium', label: 'Premium' },
              { value: 'standard', label: 'Standard' },
              { value: 'basic', label: 'Básico' }
            ]"
            size="large"
          ></os-select>
          <os-date-input placeholder="Data de início" size="large"></os-date-input>
          <os-date-input placeholder="Data de fim" size="large"></os-date-input>
        </os-filter-bar>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Exemplo de barra de filtros complexa com múltiplos campos.',
      },
    },
  },
};

export const Interactive: Story = {
  args: {
    variant: 'default',
    size: 'medium',
    showActions: true,
    showClearButton: true,
    showApplyButton: true,
    clearButtonText: 'Limpar',
    applyButtonText: 'Aplicar',
    hasActiveFilters: false,
  },
  render: (args) => ({
    props: args,
    template: `
      <os-filter-bar 
        [variant]="variant"
        [size]="size"
        [showActions]="showActions"
        [showClearButton]="showClearButton"
        [showApplyButton]="showApplyButton"
        [clearButtonText]="clearButtonText"
        [applyButtonText]="applyButtonText"
        [hasActiveFilters]="hasActiveFilters"
        (clear)="clear()"
        (apply)="apply()"
      >
        <os-input placeholder="Buscar..." [size]="size"></os-input>
        <os-select 
          placeholder="Categoria" 
          [options]="[
            { value: 'all', label: 'Todas' },
            { value: 'active', label: 'Ativas' },
            { value: 'inactive', label: 'Inativas' }
          ]"
          [size]="size"
        ></os-select>
      </os-filter-bar>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Barra de filtros interativa com controles para testar todas as propriedades.',
      },
    },
  },
};

