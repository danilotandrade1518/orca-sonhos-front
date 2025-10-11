# Dashboard Básico com Seleção de Orçamento - Arquitetura Técnica

## 🏗️ Visão Geral da Implementação

### Estado Atual

O projeto possui uma estrutura básica de Angular 20 com:

- **Dashboard Page**: Página simples com template básico
- **Design System**: Componentes `os-*` implementados (header, sidebar, footer, widgets)
- **Dashboard Template**: Componente `OsDashboardTemplateComponent` completo e funcional
- **MSW Handlers**: Handlers de budget já implementados com dados mockados
- **Feature Structure**: Estrutura de features preparada mas não utilizada

### Mudanças Propostas

- **Implementação completa** do dashboard usando `OsDashboardTemplateComponent`
- **Seletor de Orçamento**: Dropdown na AppBar do header para alternar entre orçamentos
- **Estado Global**: Serviço para gerenciar orçamento selecionado com Angular Signals
- **Widgets Reativos**: Integração de widgets que respondem à mudança de orçamento
- **Dados Mockados**: Uso dos handlers MSW existentes para dados realistas
- **Layout Responsivo**: Implementação mobile-first com sidebar colapsável

### Impactos

- **Dashboard Feature**: Implementação completa da funcionalidade
- **Header Component**: Adição do seletor de orçamento na AppBar
- **Estado Global**: Novo serviço para gerenciamento de orçamento selecionado
- **MSW Integration**: Uso dos handlers existentes para dados
- **Responsividade**: Melhorias no layout para mobile

## 🔧 Componentes e Estrutura

### Arquivos Principais a Modificar

- `src/app/features/dashboard/pages/dashboard.page.ts`: Implementação completa do dashboard
- `src/app/shared/ui-components/organisms/os-header/os-header.component.ts`: Adição do seletor de orçamento

### Novos Arquivos a Criar

- `src/app/core/services/budget-selection/budget-selection.service.ts`: Serviço para gerenciar orçamento selecionado
- `src/app/features/dashboard/components/budget-selector/budget-selector.component.ts`: Componente de seleção de orçamento
- `src/app/features/dashboard/components/dashboard-widgets/dashboard-widgets.component.ts`: Container dos widgets do dashboard
- `src/app/features/dashboard/services/dashboard-data.service.ts`: Serviço para dados do dashboard
- `src/app/features/dashboard/types/dashboard.types.ts`: Tipos específicos do dashboard

### Estrutura de Diretórios

```
src/app/features/dashboard/
├── components/
│   ├── budget-selector/
│   │   ├── budget-selector.component.ts
│   │   ├── budget-selector.component.html
│   │   ├── budget-selector.component.scss
│   │   └── budget-selector.component.spec.ts
│   └── dashboard-widgets/
│       ├── dashboard-widgets.component.ts
│       ├── dashboard-widgets.component.html
│       ├── dashboard-widgets.component.scss
│       └── dashboard-widgets.component.spec.ts
├── services/
│   └── dashboard-data.service.ts
├── types/
│   └── dashboard.types.ts
├── pages/
│   └── dashboard.page.ts (modificado)
└── dashboard.module.ts
```

## 🏛️ Padrões Arquiteturais

### Padrões Seguidos

- **Feature-Based Architecture**: Implementação na feature dashboard
- **Angular Signals**: Estado reativo para orçamento selecionado e dados
- **Design System**: Uso dos componentes `os-*` existentes
- **DTO-First**: Dados mockados seguindo contratos de API
- **OnPush Strategy**: Otimização de performance

### Decisões Arquiteturais

- **Decisão**: Usar `OsDashboardTemplateComponent` existente
- **Alternativas**: Criar template customizado, usar layout básico
- **Justificativa**: Componente já implementado e funcional, evita duplicação

- **Decisão**: Seletor de orçamento no header
- **Alternativas**: Sidebar, modal, página dedicada
- **Justificativa**: Acesso rápido e sempre visível, padrão UX comum

- **Decisão**: Estado global com Angular Signals
- **Alternativas**: NgRx, serviço singleton, estado local
- **Justificativa**: Simplicidade, reatividade nativa, alinhamento com Angular moderno

## 📦 Dependências e Integrações

### Dependências Existentes

- **Angular Material**: Base para componentes de seleção
- **MSW**: Handlers de budget já implementados
- **Design System**: Componentes `os-*` disponíveis
- **Angular Signals**: Para estado reativo

### Novas Dependências

- **Nenhuma**: Utilizando apenas dependências existentes

### Integrações

- **MSW Handlers**: Uso dos handlers de budget existentes
- **Design System**: Integração com componentes `os-*`
- **Angular Router**: Navegação entre seções
- **Estado Global**: Serviço para orçamento selecionado

## 🔄 Fluxo de Dados

### Fluxo de Seleção de Orçamento

1. **Usuário seleciona orçamento** → **BudgetSelectorComponent**
2. **BudgetSelectorComponent** → **BudgetSelectionService** (updateSelectedBudget)
3. **BudgetSelectionService** → **Angular Signals** (selectedBudget signal)
4. **DashboardWidgetsComponent** → **reage ao signal** (atualiza widgets)
5. **Widgets** → **DashboardDataService** (busca dados do orçamento)
6. **DashboardDataService** → **MSW Handlers** (dados mockados)

### Fluxo de Dados do Dashboard

1. **DashboardDataService** → **MSW** (GET /budgets, GET /budget/:id/overview)
2. **MSW** → **retorna dados mockados** (budgets, overview)
3. **DashboardDataService** → **processa dados** (transforma para widgets)
4. **DashboardWidgetsComponent** → **exibe widgets** (budget-summary, goal-progress, etc.)

### Fluxo de Estado

1. **BudgetSelectionService**: Gerencia orçamento selecionado
2. **DashboardDataService**: Gerencia dados do dashboard
3. **Angular Signals**: Propagação reativa de mudanças
4. **Componentes**: Reagem automaticamente às mudanças

## 🧪 Considerações de Teste

### Testes Unitários

- **BudgetSelectionService**: Estado e métodos de seleção
- **DashboardDataService**: Busca e processamento de dados
- **BudgetSelectorComponent**: Interação e eventos
- **DashboardWidgetsComponent**: Renderização de widgets

### Testes de Integração

- **Fluxo completo**: Seleção de orçamento → atualização de widgets
- **MSW Integration**: Dados mockados funcionando corretamente
- **Responsividade**: Layout em diferentes breakpoints

### Mocks e Fixtures

- **MSW Handlers**: Dados mockados já implementados
- **Budget Data**: Cenário com 1 orçamento e dados realistas
- **Widget Data**: Dados específicos para cada tipo de widget

## ⚖️ Trade-offs e Riscos

### Trade-offs Aceitos

- **Template Existente**: Usar `OsDashboardTemplateComponent` vs criar customizado
- **Estado Global**: Simplicidade vs complexidade de gerenciamento
- **Dados Mockados**: Desenvolvimento independente vs dados reais

### Riscos Identificados

- **Performance**: Múltiplos widgets reativos podem impactar performance
- **Estado**: Sincronização entre seletor e widgets
- **Responsividade**: Complexidade do layout em diferentes telas

## 📋 Lista de Implementação

### Fase 1: Serviços e Estado

- [ ] Criar `BudgetSelectionService` com Angular Signals
- [ ] Criar `DashboardDataService` para dados do dashboard
- [ ] Implementar tipos TypeScript para dashboard

### Fase 2: Componentes

- [ ] Criar `BudgetSelectorComponent` para seleção de orçamento
- [ ] Criar `DashboardWidgetsComponent` para container dos widgets
- [ ] Integrar seletor no `OsHeaderComponent`

### Fase 3: Dashboard Page

- [ ] Implementar `DashboardPage` usando `OsDashboardTemplateComponent`
- [ ] Configurar widgets do dashboard
- [ ] Implementar navegação e breadcrumbs

### Fase 4: Integração e Dados

- [ ] Integrar com MSW handlers existentes
- [ ] Implementar loading states
- [ ] Configurar dados mockados realistas

### Fase 5: Responsividade e Testes

- [ ] Implementar layout responsivo
- [ ] Configurar sidebar colapsável em mobile
- [ ] Implementar testes unitários e de integração

## 📚 Referências

- **Meta Specs**: /home/danilo/workspace/projeto-orca-sonhos/orca-sonhos-meta-specs
- **Design System**: Componentes `os-*` implementados
- **MSW Handlers**: Handlers de budget existentes
- **Angular Signals**: Documentação oficial Angular
- **Feature-Based Architecture**: Padrões do projeto
