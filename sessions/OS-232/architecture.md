# Relatórios Financeiros Simples - MVP - Arquitetura Técnica

## 🏗️ Visão Geral da Implementação

### Estado Atual

O projeto atualmente possui:

- **Gráficos CSS Customizados**: Componentes `os-budget-summary` e `os-budget-tracker` usam gráficos simples implementados com CSS puro (pie chart e bar chart básicos)
- **Sem Biblioteca de Gráficos**: Não há biblioteca de gráficos instalada no projeto
- **Features Estruturadas**: Features seguem padrão feature-based com estrutura organizada
- **Angular 20+**: Projeto usa Angular 20 com standalone components e signals

### Mudanças Propostas

- **Nova Feature**: Criar feature `reports` seguindo padrão das outras features
- **Biblioteca de Gráficos**: Instalar e integrar biblioteca de gráficos escolhida
- **Camada de Abstração**: Criar wrapper sobre ng2-charts para facilitar futuras migrações
- **Componentes de Gráficos**: Criar componentes reutilizáveis para gráficos de pizza e barras
- **Serviços de Relatórios**: Criar serviços para cálculo e agregação de dados
- **Roteamento**: Adicionar rota `/reports` com lazy loading

### Impactos

- **Bundle Size**: Aumento devido à biblioteca de gráficos escolhida
- **Performance**: Cálculos de agregação podem impactar performance se não otimizados
- **Manutenibilidade**: Nova feature adiciona complexidade ao projeto

## 📊 Análise Comparativa de Bibliotecas de Gráficos

### Opções Analisadas

#### 1. ngx-charts (@swimlane/ngx-charts)

**Características:**

- Framework declarativo para Angular
- Renderiza SVG usando Angular e D3
- Amplo conjunto de tipos de gráficos
- Trust Score: 9/10
- Code Snippets: 84

**Vantagens:**

- ✅ Nativo Angular (não é wrapper)
- ✅ Declarativo e reativo
- ✅ Bom suporte a acessibilidade
- ✅ Animações suaves
- ✅ Customização via templates Angular
- ✅ Compatível com Angular 20+

**Desvantagens:**

- ❌ Dependência do D3 (aumenta bundle size)
- ❌ Bundle size maior (~200KB+)
- ❌ Curva de aprendizado para D3
- ❌ Pode ser overkill para gráficos simples

**Instalação:**

```bash
npm install @swimlane/ngx-charts --save
```

**Uso:**

```typescript
import { NgxChartsModule } from '@swimlane/ngx-charts';

@Component({
  imports: [NgxChartsModule],
  template: `
    <ngx-charts-pie-chart
      [results]="chartData"
      [scheme]="colorScheme">
    </ngx-charts-pie-chart>
  `
})
```

---

#### 2. ng2-charts (Chart.js wrapper)

**Características:**

- Wrapper Angular para Chart.js
- Baseado em Canvas (não SVG)
- Chart.js é muito popular e bem documentado
- Trust Score: 8.1/10
- Code Snippets: 23

**Vantagens:**

- ✅ Chart.js é muito popular e estável
- ✅ Bundle size menor que ngx-charts (~150KB)
- ✅ Performance boa com Canvas
- ✅ Suporte a standalone components (Angular 20+)
- ✅ Boa documentação
- ✅ Fácil customização

**Desvantagens:**

- ❌ É um wrapper (pode ter limitações)
- ❌ Canvas não é tão acessível quanto SVG
- ❌ Menos flexível que SVG para customizações complexas
- ❌ Precisa configurar providers para standalone

**Instalação:**

```bash
npm install ng2-charts chart.js --save
```

**Uso:**

```typescript
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  standalone: true,
  imports: [BaseChartDirective],
  providers: [provideCharts(withDefaultRegisterables())],
  template: `
    <canvas baseChart
      [data]="chartData"
      [options]="chartOptions"
      type="pie">
    </canvas>
  `
})
```

---

#### 3. ng-apexcharts (ApexCharts wrapper)

**Características:**

- Wrapper Angular para ApexCharts.js
- Baseado em SVG
- Gráficos modernos e interativos
- Trust Score: 7.2/10
- Code Snippets: 18

**Vantagens:**

- ✅ Gráficos muito bonitos e modernos
- ✅ Boa performance com SVG
- ✅ Interatividade avançada
- ✅ Responsivo por padrão
- ✅ Suporte a temas

**Desvantagens:**

- ❌ Bundle size grande (~300KB+)
- ❌ É um wrapper (pode ter limitações)
- ❌ Menos popular que Chart.js
- ❌ Configuração mais complexa
- ❌ Requer script no angular.json

**Instalação:**

```bash
npm install apexcharts ng-apexcharts --save
```

**Uso:**

```typescript
import { NgApexchartsModule } from 'ng-apexcharts';

@Component({
  imports: [NgApexchartsModule],
  template: `
    <apx-chart
      [series]="series"
      [chart]="chart"
      [labels]="labels">
    </apx-chart>
  `
})
```

---

#### 4. ag-charts-angular (AG Charts wrapper)

**Características:**

- Wrapper Angular para AG Charts
- Baseado em Canvas
- Desenvolvido pela equipe do AG Grid
- Trust Score: 9.8/10
- Code Snippets: 874

**Vantagens:**

- ✅ Muito alta qualidade (AG Grid team)
- ✅ Excelente performance
- ✅ TypeScript-first
- ✅ Suporte a Angular 17-20
- ✅ Standalone components
- ✅ Sem dependências externas

**Desvantagens:**

- ❌ Menos popular que outras opções
- ❌ Documentação pode ser menos completa
- ❌ Pode ser mais complexo para casos simples
- ❌ Bundle size moderado (~180KB)

**Instalação:**

```bash
npm install ag-charts-angular ag-charts-community --save
```

**Uso:**

```typescript
import { AgCharts } from 'ag-charts-angular';

@Component({
  standalone: true,
  imports: [AgCharts],
  template: `
    <ag-charts [options]="chartOptions"></ag-charts>
  `
})
```

---

### 📊 Comparação Resumida

| Biblioteca        | Bundle Size | Performance | Acessibilidade | Facilidade | Popularidade | Angular Nativo |
| ----------------- | ----------- | ----------- | -------------- | ---------- | ------------ | -------------- |
| **ngx-charts**    | ~200KB+     | ⭐⭐⭐⭐    | ⭐⭐⭐⭐⭐     | ⭐⭐⭐     | ⭐⭐⭐⭐     | ✅ Sim         |
| **ng2-charts**    | ~150KB      | ⭐⭐⭐⭐⭐  | ⭐⭐⭐         | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐   | ❌ Wrapper     |
| **ng-apexcharts** | ~300KB+     | ⭐⭐⭐⭐    | ⭐⭐⭐⭐       | ⭐⭐⭐     | ⭐⭐⭐       | ❌ Wrapper     |
| **ag-charts**     | ~180KB      | ⭐⭐⭐⭐⭐  | ⭐⭐⭐         | ⭐⭐⭐⭐   | ⭐⭐⭐       | ❌ Wrapper     |

### 🎯 Recomendação

**RECOMENDAÇÃO PRINCIPAL: ng2-charts (Chart.js)**

**Justificativa:**

1. **Balance Ideal**: Combina boa performance, bundle size razoável e facilidade de uso
2. **Chart.js é Maduro**: Chart.js é uma das bibliotecas mais populares e estáveis
3. **Suporte Standalone**: Tem suporte oficial para Angular standalone components
4. **Documentação Excelente**: Chart.js tem documentação muito completa
5. **Comunidade Ativa**: Grande comunidade e muitos exemplos disponíveis
6. **Customização**: Fácil customizar cores, estilos e comportamentos
7. **Performance**: Canvas oferece boa performance mesmo com muitos dados

**Alternativa (se precisar de mais flexibilidade):**

- **ngx-charts**: Se precisar de mais controle e customização, ou se SVG for preferível

---

## 🛡️ Camada de Abstração de Gráficos

### Visão Geral

Para facilitar futuras migrações de biblioteca de gráficos e manter o código desacoplado, será criada uma **camada de abstração** sobre o ng2-charts. Esta camada encapsula toda a lógica específica da biblioteca, permitindo que os componentes da aplicação trabalhem com interfaces genéricas.

### Arquitetura da Camada de Abstração

```
┌─────────────────────────────────────────┐
│   Componentes da Aplicação              │
│   (spending-chart, revenue-expense)     │
└──────────────┬──────────────────────────┘
               │
               │ Usa interfaces genéricas
               │
┌──────────────▼──────────────────────────┐
│   Camada de Abstração                   │
│   (ChartAdapter, ChartConfig)          │
└──────────────┬──────────────────────────┘
               │
               │ Implementa com ng2-charts
               │
┌──────────────▼──────────────────────────┐
│   ng2-charts (Chart.js)                │
│   (Implementação específica)           │
└─────────────────────────────────────────┘
```

### Componentes da Camada de Abstração

#### 1. Interfaces e Tipos (`src/shared/charts/interfaces/`)

**Interfaces genéricas que definem o contrato dos gráficos:**

- `ChartData<T>`: Interface genérica para dados de gráfico
- `ChartConfig`: Configuração genérica de gráfico (cores, legendas, tooltips)
- `ChartType`: Enum com tipos de gráfico suportados ('pie', 'bar', 'line', etc.)
- `ChartOptions`: Opções genéricas de gráfico (responsivo, animações, etc.)

#### 2. Serviço de Adaptação (`src/shared/charts/chart-adapter/`)

**Serviço que adapta dados genéricos para o formato do ng2-charts:**

- `ChartAdapterService`: Converte dados genéricos para formato ng2-charts
- `ChartConfigMapper`: Mapeia configurações genéricas para opções do Chart.js
- `ChartDataTransformer`: Transforma dados da aplicação para formato do gráfico

#### 3. Componentes Base (`src/shared/charts/components/`)

**Componentes base que encapsulam ng2-charts:**

- `BaseChartComponent`: Componente base abstrato para gráficos
- `PieChartComponent`: Implementação específica de gráfico de pizza
- `BarChartComponent`: Implementação específica de gráfico de barras

### Estrutura de Diretórios da Camada de Abstração

```
src/shared/charts/
├── interfaces/
│   ├── chart-data.interface.ts
│   ├── chart-config.interface.ts
│   ├── chart-options.interface.ts
│   └── chart-type.enum.ts
├── chart-adapter/
│   ├── chart-adapter.service.ts
│   ├── chart-config-mapper.service.ts
│   └── chart-data-transformer.service.ts
├── components/
│   ├── base-chart/
│   │   ├── base-chart.component.ts
│   │   └── base-chart.component.html
│   ├── pie-chart/
│   │   ├── pie-chart.component.ts
│   │   ├── pie-chart.component.html
│   │   └── pie-chart.component.scss
│   └── bar-chart/
│       ├── bar-chart.component.ts
│       ├── bar-chart.component.html
│       └── bar-chart.component.scss
└── providers/
    └── chart-providers.ts
```

### Benefícios da Camada de Abstração

1. **Desacoplamento**: Componentes da aplicação não dependem diretamente do ng2-charts
2. **Facilita Migração**: Trocar biblioteca requer apenas atualizar a camada de abstração
3. **Testabilidade**: Mais fácil mockar e testar componentes isoladamente
4. **Manutenibilidade**: Mudanças na biblioteca ficam isoladas em um único lugar
5. **Flexibilidade**: Permite suportar múltiplas bibliotecas simultaneamente (se necessário)

### Exemplo de Uso

**Antes (dependência direta):**

```typescript
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration } from 'chart.js';

@Component({
  imports: [BaseChartDirective],
  providers: [provideCharts(withDefaultRegisterables())],
  template: `<canvas baseChart [data]="chartData" [options]="chartOptions" type="pie"></canvas>`,
})
export class SpendingChartComponent {
  chartData: ChartConfiguration<'pie'>['data'] = {
    /* ... */
  };
  chartOptions: ChartConfiguration<'pie'>['options'] = {
    /* ... */
  };
}
```

**Depois (com camada de abstração):**

```typescript
import { PieChartComponent } from '@shared/charts/components/pie-chart';
import { ChartData, ChartConfig } from '@shared/charts/interfaces';

@Component({
  imports: [PieChartComponent],
  template: `<os-pie-chart [data]="chartData" [config]="chartConfig"></os-pie-chart>`,
})
export class SpendingChartComponent {
  chartData: ChartData = {
    /* dados genéricos */
  };
  chartConfig: ChartConfig = {
    /* configuração genérica */
  };
}
```

### Migração Futura

Quando necessário migrar para outra biblioteca (ex: ngx-charts, ag-charts), o processo será:

1. Criar nova implementação dos componentes base usando a nova biblioteca
2. Atualizar `ChartAdapterService` para converter para o novo formato
3. Componentes da aplicação **não precisam ser alterados**

### Trade-offs

**Vantagens:**

- ✅ Facilita migração futura
- ✅ Melhor testabilidade
- ✅ Código mais limpo e organizado

**Desvantagens:**

- ❌ Adiciona uma camada extra de complexidade
- ❌ Pode limitar acesso a features específicas da biblioteca
- ❌ Requer manutenção adicional da camada de abstração

**Decisão**: Os benefícios superam os custos, especialmente considerando que migrações de biblioteca são comuns em projetos de longo prazo.

---

## 🔧 Componentes e Estrutura

### Arquivos Principais a Modificar

- `src/app/app.routes.ts`: Adicionar rota `/reports` com lazy loading
- `src/app/core/layout/app-layout.component.ts`: Adicionar item de menu "Relatórios" (se aplicável)

### Novos Arquivos a Criar

**Camada de Abstração de Gráficos (Shared):**

```
src/shared/charts/
├── interfaces/
│   ├── chart-data.interface.ts
│   ├── chart-config.interface.ts
│   ├── chart-options.interface.ts
│   └── chart-type.enum.ts
├── chart-adapter/
│   ├── chart-adapter.service.ts
│   ├── chart-config-mapper.service.ts
│   └── chart-data-transformer.service.ts
├── components/
│   ├── base-chart/
│   │   ├── base-chart.component.ts
│   │   ├── base-chart.component.html
│   │   └── base-chart.component.spec.ts
│   ├── pie-chart/
│   │   ├── pie-chart.component.ts
│   │   ├── pie-chart.component.html
│   │   ├── pie-chart.component.scss
│   │   └── pie-chart.component.spec.ts
│   └── bar-chart/
│       ├── bar-chart.component.ts
│       ├── bar-chart.component.html
│       ├── bar-chart.component.scss
│       └── bar-chart.component.spec.ts
└── providers/
    └── chart-providers.ts
```

**Feature Structure:**

```
src/app/features/reports/
├── components/
│   ├── spending-chart/
│   │   ├── spending-chart.component.ts
│   │   ├── spending-chart.component.html
│   │   ├── spending-chart.component.scss
│   │   └── spending-chart.component.spec.ts
│   ├── revenue-expense-chart/
│   │   ├── revenue-expense-chart.component.ts
│   │   ├── revenue-expense-chart.component.html
│   │   ├── revenue-expense-chart.component.scss
│   │   └── revenue-expense-chart.component.spec.ts
│   └── report-filters/
│       ├── report-filters.component.ts
│       ├── report-filters.component.html
│       ├── report-filters.component.scss
│       └── report-filters.component.spec.ts
├── pages/
│   └── reports/
│       ├── reports.page.ts
│       ├── reports.page.html
│       └── reports.page.scss
├── services/
│   ├── reports-api/
│   │   └── reports-api.service.ts
│   └── reports-calculator/
│       └── reports-calculator.service.ts
├── state/
│   └── reports-state/
│       └── reports.state.ts
├── types/
│   └── reports.types.ts
└── reports.routes.ts
```

**DTOs:**

```
src/dtos/report/
├── report-request.dto.ts
├── report-response.dto.ts
├── category-spending.dto.ts
└── revenue-expense.dto.ts
```

### Estrutura de Diretórios

A feature seguirá o padrão estabelecido pelas outras features:

- `components/`: Componentes reutilizáveis da feature
- `pages/`: Páginas da feature
- `services/`: Serviços específicos da feature
- `state/`: Gerenciamento de estado com signals
- `types/`: Tipos TypeScript específicos da feature
- `[feature].routes.ts`: Rotas da feature

## 🏛️ Padrões Arquiteturais

### Padrões Seguidos

- **Feature-Based Architecture**: Cada feature é auto-contida
- **DTO-First Architecture**: DTOs para transferência de dados
- **Signal-Based State**: Estado reativo usando Angular Signals
- **Standalone Components**: Todos os componentes são standalone
- **Dependency Injection**: Usar `inject()` ao invés de constructor injection
- **Computed Properties**: Usar `computed()` para valores derivados

### Decisões Arquiteturais

- **Decisão**: Usar ng2-charts (Chart.js wrapper)
- **Alternativas**: ngx-charts, ng-apexcharts, ag-charts
- **Justificativa**:

  - Balance ideal entre performance, bundle size e facilidade
  - Chart.js é maduro e bem documentado
  - Suporte oficial para Angular standalone components

- **Decisão**: Criar camada de abstração sobre ng2-charts
- **Alternativas**: Usar ng2-charts diretamente nos componentes
- **Justificativa**:

  - Facilita migração futura para outra biblioteca
  - Desacopla componentes da aplicação da biblioteca específica
  - Melhora testabilidade (mais fácil mockar)
  - Centraliza lógica de adaptação em um único lugar
  - Permite evoluir a abstração sem impactar componentes da aplicação

- **Decisão**: Criar serviços separados para cálculos
- **Alternativas**: Fazer cálculos diretamente nos componentes
- **Justificativa**:

  - Separação de responsabilidades
  - Facilita testes unitários
  - Permite reutilização

- **Decisão**: Usar signals para estado da feature
- **Alternativas**: RxJS observables, serviços com BehaviorSubject
- **Justificativa**:
  - Angular Signals é o padrão moderno do Angular
  - Melhor integração com computed properties
  - Performance otimizada

## 🎨 UI Components and Layout

### Design System Integration

A feature de relatórios utiliza extensivamente componentes do Design System OrçaSonhos para manter consistência visual e reutilização máxima:

**Componentes Reutilizados:**

- **os-card**: Container para gráficos e cards de resumo
- **os-button**: Ações secundárias e refresh de dados
- **os-select**: Filtros de período
- **os-budget-selector**: Filtro de orçamento (quando múltiplos orçamentos)
- **os-page-header**: Cabeçalho da página
- **os-icon**: Ícones decorativos (chart, filter, trending-up/down)
- **os-label**: Labels de filtros e títulos de seções

**Padrões de Layout:**

- Grid responsivo: 12 colunas (desktop), 8 colunas (tablet), 1 coluna (mobile)
- Mobile-first approach com progressive enhancement
- Breakpoints: Mobile (< 576px), Tablet (576-991px), Desktop (>= 992px)
- Spacing consistente usando design tokens (--os-spacing-\*)

### New Components Required

**Novos Componentes do Design System:**

1. **os-chart-container** (Molecule)

   - Container padronizado para gráficos da camada de abstração
   - Estados: loading, error, empty
   - Integração com componentes da camada de abstração (PieChartComponent/BarChartComponent)
   - Responsivo e acessível

2. **os-report-summary-card** (Molecule)
   - Card de resumo numérico (Total Gastos, Receitas, Diferença)
   - Variants: positive, negative, neutral
   - Responsivo (grid adaptativo)

**Componentes da Feature:**

1. **spending-chart** (Component)

   - Gráfico de pizza usando camada de abstração (PieChartComponent)
   - Dados de gastos por categoria
   - Integração com os-chart-container
   - Não depende diretamente do ng2-charts

2. **revenue-expense-chart** (Component)

   - Gráfico de barras usando camada de abstração (BarChartComponent)
   - Comparação receitas vs despesas
   - Integração com os-chart-container
   - Não depende diretamente do ng2-charts

3. **report-filters** (Component)
   - Filtros de período e orçamento
   - Integração com os-select e os-budget-selector
   - Barra sticky após scroll

**Detalhes completos em:** `layout-specification.md`

### Layout Architecture

**Estrutura da Página:**

```
ReportsPage
├── Header (os-page-header)
│   └── Título e subtítulo
├── Filters Bar (sticky)
│   ├── os-select (Período)
│   └── os-budget-selector (Orçamento)
└── Main Content (Grid Responsivo)
    ├── Summary Cards (Grid 3/2/1 colunas)
    │   ├── os-report-summary-card (Total Gastos)
    │   ├── os-report-summary-card (Receitas)
    │   └── os-report-summary-card (Diferença)
    ├── Spending Chart (Full width)
    │   └── os-chart-container > spending-chart
    └── Revenue Expense Chart (Full width)
        └── os-chart-container > revenue-expense-chart
```

**Responsividade:**

- **Mobile**: Stack vertical completo, gráficos com altura mínima 250px
- **Tablet**: Grid 2 colunas para cards, gráficos full width com altura 300px
- **Desktop**: Grid 3 colunas para cards, gráficos full width com altura 400px+

**Estados de UI:**

- **Loading**: Skeleton screens para gráficos e cards
- **Error**: Mensagens de erro com botão retry
- **Empty**: Mensagens apropriadas quando não há dados
- **Success**: Atualização automática após filtros

### Performance Considerations

**Bundle Size Impact:**

- **ng2-charts**: ~50KB (gzipped)
- **chart.js**: ~100KB (gzipped)
- **Total**: ~150KB adicional
- **Mitigação**: Lazy loading da feature completa

**Otimizações de UI:**

- **Lazy Loading**: Feature carregada apenas quando acessada (`loadChildren`)
- **OnPush Change Detection**: Todos componentes com `ChangeDetectionStrategy.OnPush`
- **Computed Signals**: Dados derivados calculados apenas quando necessário
- **Debounce**: Filtros com debounce para evitar recálculos excessivos
- **Cache**: Resultados de relatórios em cache (localStorage ou service)

**Critical Rendering Path:**

- Estilos críticos de layout inline ou no bundle inicial
- Estilos de gráficos podem ser lazy loaded
- Gráficos renderizados apenas quando visíveis (futuro: Intersection Observer)

### Accessibility Integration

**WCAG 2.1 AA Compliance:**

- **Keyboard Navigation**: Tab order lógico, focus visible
- **ARIA**: Landmarks, labels, descriptions adequados
- **Screen Readers**: Tabelas alternativas abaixo dos gráficos
- **Contraste**: >= 4.5:1 para texto, >= 3:1 para UI
- **Chart.js Accessibility**: ARIA via plugins, role="img" nos canvas

**Detalhes completos em:** `layout-specification.md` (seção Accessibility Specifications)

## 📦 Dependências e Integrações

### Dependências Existentes

- `@angular/core`: ^20.2.0
- `@angular/material`: ^20.2.3
- `rxjs`: ~7.8.0

### Novas Dependências

- **ng2-charts**: Wrapper Angular para Chart.js
  - **Uso**: Componentes de gráficos
  - **Justificativa**: Biblioteca escolhida para gráficos
- **chart.js**: Biblioteca de gráficos base
  - **Uso**: Renderização de gráficos
  - **Justificativa**: Dependência peer do ng2-charts

### Integrações

- **TransactionService**: Buscar transações filtradas por período
- **BudgetService**: Buscar orçamentos e categorias
- **CategoryService**: Buscar informações de categorias

## 🔄 Fluxo de Dados

```
1. Usuário acessa /reports
   ↓
2. ReportsPage carrega e inicializa ReportsState
   ↓
3. ReportsState busca dados via ReportsApiService
   ↓
4. ReportsApiService chama TransactionService/BudgetService
   ↓
5. Dados retornam e são processados por ReportsCalculatorService
   ↓
6. ReportsState atualiza signals com dados calculados
   ↓
7. Componentes da feature (spending-chart, revenue-expense-chart) recebem dados
   ↓
8. Componentes convertem dados para formato genérico (ChartData, ChartConfig)
   ↓
9. Componentes passam dados para camada de abstração (PieChartComponent/BarChartComponent)
   ↓
10. Camada de abstração adapta dados via ChartAdapterService para formato ng2-charts
   ↓
11. Componentes base da camada de abstração renderizam gráficos usando ng2-charts
   ↓
12. Usuário altera filtros (período/orçamento)
   ↓
13. ReportsState recalcula dados baseado nos filtros
   ↓
14. Gráficos são atualizados automaticamente via signals e camada de abstração
```

## 🧪 Considerações de Teste

### Testes Unitários

- **ChartAdapterService**: Testar conversão de dados genéricos para formato ng2-charts
- **ChartConfigMapper**: Testar mapeamento de configurações genéricas
- **ChartDataTransformer**: Testar transformação de dados
- **PieChartComponent/BarChartComponent**: Testar componentes base da camada de abstração
- **ReportsCalculatorService**: Testar cálculos de agregação
- **ReportsState**: Testar gerenciamento de estado
- **Componentes de Gráficos**: Testar renderização e interações (usando mocks da camada de abstração)
- **ReportFiltersComponent**: Testar filtros e eventos

### Testes de Integração

- **Integração com TransactionService**: Validar busca de transações
- **Integração com BudgetService**: Validar busca de orçamentos
- **Integração com Camada de Abstração**: Validar adaptação de dados e renderização
- **Integração com ng2-charts**: Validar renderização de gráficos através da camada de abstração

### Mocks e Fixtures

- **Dados de Transações**: Fixtures para diferentes cenários
- **Dados de Orçamentos**: Fixtures para múltiplos orçamentos
- **Dados de Categorias**: Fixtures para categorias diversas

## ⚖️ Trade-offs e Riscos

### Trade-offs Aceitos

- **Bundle Size**: Aumento de ~150KB é aceitável para funcionalidade de relatórios
- **Complexidade**: Adicionar biblioteca externa aumenta complexidade, mas traz benefícios
- **Performance**: Cálculos de agregação podem ser custosos, mas serão otimizados

### Riscos Identificados

- **Escolha de Biblioteca**: Se ng2-charts não atender, migração pode ser necessária
- **Performance de Cálculos**: Cálculos podem ser lentos com muitos dados
- **Acessibilidade**: Canvas pode ter limitações de acessibilidade
- **Complexidade da Camada de Abstração**: Adiciona complexidade inicial ao projeto

### Mitigações

- **Análise Prévia**: Análise detalhada antes de escolher biblioteca
- **Camada de Abstração**: Facilita migração futura sem impactar componentes da aplicação
- **Otimização**: Implementar cache e otimizações de cálculo
- **Acessibilidade**: Adicionar ARIA labels e alternativas textuais
- **Documentação**: Documentar bem a camada de abstração para facilitar manutenção

## 📋 Lista de Implementação

### Setup e Dependências

- [ ] Instalar ng2-charts e chart.js
- [ ] Configurar providers para standalone components (`provideCharts`)
- [ ] Criar estrutura de diretórios da camada de abstração (`src/shared/charts/`)
- [ ] Criar estrutura de diretórios da feature reports

### Camada de Abstração de Gráficos

- [ ] Criar interfaces genéricas (`chart-data.interface.ts`, `chart-config.interface.ts`, `chart-options.interface.ts`, `chart-type.enum.ts`)
- [ ] Implementar `ChartAdapterService` (conversão de dados genéricos para ng2-charts)
- [ ] Implementar `ChartConfigMapper` (mapeamento de configurações)
- [ ] Implementar `ChartDataTransformer` (transformação de dados)
- [ ] Criar `BaseChartComponent` (componente base abstrato)
- [ ] Implementar `PieChartComponent` (wrapper de gráfico de pizza)
- [ ] Implementar `BarChartComponent` (wrapper de gráfico de barras)
- [ ] Criar `chart-providers.ts` (providers centralizados)
- [ ] Implementar testes unitários para serviços da camada de abstração
- [ ] Implementar testes unitários para componentes da camada de abstração

### DTOs e Serviços

- [ ] Criar DTOs de relatórios (`report-request.dto.ts`, `report-response.dto.ts`, `category-spending.dto.ts`, `revenue-expense.dto.ts`)
- [ ] Implementar ReportsCalculatorService (cálculos de agregação)
- [ ] Implementar ReportsApiService (integração com APIs)
- [ ] Implementar ReportsState (gerenciamento de estado com signals)

### UI Components - Design System

- [ ] Criar componente `os-chart-container` (Molecule) conforme layout-specification.md
- [ ] Criar componente `os-report-summary-card` (Molecule) conforme layout-specification.md
- [ ] Implementar estados (loading, error, empty) nos novos componentes
- [ ] Implementar responsividade (mobile, tablet, desktop)
- [ ] Implementar acessibilidade (ARIA, keyboard navigation)

### UI Components - Feature

- [ ] Criar componente `spending-chart` (gráfico de pizza usando PieChartComponent da camada de abstração)
- [ ] Criar componente `revenue-expense-chart` (gráfico de barras usando BarChartComponent da camada de abstração)
- [ ] Criar componente `report-filters` (filtros de período e orçamento)
- [ ] Integrar componentes com camada de abstração (não diretamente com ng2-charts)
- [ ] Implementar integração com os-chart-container
- [ ] Implementar tooltips e interatividade nos gráficos

### Página e Roteamento

- [ ] Criar ReportsPage com layout responsivo conforme layout-specification.md
- [ ] Implementar grid responsivo (mobile/tablet/desktop)
- [ ] Implementar barra de filtros sticky
- [ ] Adicionar rota `/reports` com lazy loading
- [ ] Adicionar item de menu "Relatórios" (se aplicável)

### Testes

- [ ] Implementar testes unitários para ChartAdapterService
- [ ] Implementar testes unitários para ChartConfigMapper
- [ ] Implementar testes unitários para ChartDataTransformer
- [ ] Implementar testes unitários para PieChartComponent e BarChartComponent
- [ ] Implementar testes unitários para ReportsCalculatorService
- [ ] Implementar testes unitários para ReportsState
- [ ] Implementar testes unitários para componentes de gráficos (usando mocks da camada de abstração)
- [ ] Implementar testes unitários para ReportFiltersComponent
- [ ] Implementar testes de integração com TransactionService
- [ ] Implementar testes de integração com BudgetService
- [ ] Implementar testes de integração da camada de abstração com ng2-charts
- [ ] Implementar testes de acessibilidade (ARIA, keyboard)

### Validação e Qualidade

- [ ] Validar acessibilidade (WCAG 2.1 AA)
- [ ] Validar responsividade (mobile, tablet, desktop)
- [ ] Validar performance (bundle size, lazy loading)
- [ ] Validar integração da camada de abstração com ng2-charts
- [ ] Validar que componentes da feature não dependem diretamente do ng2-charts
- [ ] Validar estados (loading, error, empty)
- [ ] Validar filtros e atualização de dados
- [ ] Validar que a camada de abstração funciona corretamente em diferentes cenários

## 📚 Referências

- [Meta Specs]: /home/danilo/workspace/projeto-orca-sonhos/orca-sonhos-meta-specs
- [Layout Specification]: `sessions/OS-232/layout-specification.md` - Especificação detalhada de UI/UX e layout
- [ng2-charts Docs]: https://github.com/valor-software/ng2-charts
- [Chart.js Docs]: https://www.chartjs.org/
- [Angular Signals]: https://angular.dev/guide/signals
- [Jira Issue]: OS-232
