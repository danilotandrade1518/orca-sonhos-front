# Relatórios Financeiros Simples - MVP - Plano de Implementação

> **Instruções**: Mantenha este arquivo atualizado conforme o progresso. Marque tarefas como concluídas ✅, em progresso ⏰ ou não iniciadas ⏳.

## 📋 Resumo Executivo

Implementação da feature de Relatórios Financeiros Simples (MVP) que permite aos usuários visualizar análises básicas dos seus orçamentos, transações e gastos por categoria através de gráficos interativos. A feature utiliza uma **camada de abstração sobre ng2-charts** (Chart.js wrapper) para facilitar futuras migrações, seguindo a arquitetura feature-based do projeto com componentes standalone, signals e DTOs.

**Biblioteca escolhida**: ng2-charts (Chart.js wrapper)
**Camada de abstração**: Wrapper customizado em `src/shared/charts/` para desacoplar componentes da biblioteca
**Bundle size estimado**: ~150KB (ng2-charts + chart.js)
**Tempo estimado total**: ~14-16 horas (7-8 fases de ~2h cada)

## 🎯 Objetivos

- Implementar página de relatórios financeiros acessível via rota `/reports`
- Exibir gráfico de pizza com gastos por categoria
- Exibir gráfico de barras comparando receitas vs despesas
- Implementar filtros de período (mês atual, mês anterior, últimos 3 meses)
- Implementar filtro por orçamento (quando usuário tem múltiplos)
- Exibir cards de resumo numérico (Total Gastos, Receitas, Diferença)
- Garantir responsividade mobile-first e acessibilidade WCAG 2.1 AA
- Implementar testes unitários com cobertura > 80%

---

## 📅 FASE 1: Setup e Instalação da Biblioteca ng2-charts [Status: ✅ Completada]

### 🎯 Objetivo

Instalar e configurar ng2-charts e chart.js no projeto, garantindo que a biblioteca esteja pronta para uso em componentes standalone.

### 📋 Tarefas

#### 1.1. Instalar dependências [✅]

**Descrição**: Instalar ng2-charts e chart.js via npm
**Comando**:

```bash
npm install ng2-charts chart.js --save
```

**Critério de Conclusão**: Dependências aparecem no `package.json` e `package-lock.json`
**Status**: ✅ Instalado - ng2-charts ^8.0.0, chart.js ^4.5.1

#### 1.2. Verificar compatibilidade de versões [✅]

**Descrição**: Verificar versões compatíveis de ng2-charts e chart.js com Angular 20+
**Critério de Conclusão**: Versões instaladas são compatíveis (ng2-charts ^5.0.0, chart.js ^4.4.0)
**Status**: ✅ Versões instaladas são compatíveis com Angular 20+ (ng2-charts ^8.0.0, chart.js ^4.5.1)

#### 1.3. Configurar providers no app.config.ts [✅]

**Descrição**: Adicionar `provideCharts(withDefaultRegisterables())` no `app.config.ts` para configuração global
**Arquivo**: `src/app/app.config.ts`
**Código esperado**:

```typescript
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';

export const appConfig: ApplicationConfig = {
  providers: [
    // ... providers existentes
    provideCharts(withDefaultRegisterables()),
  ],
};
```

**Critério de Conclusão**: Providers configurados corretamente, sem erros de compilação
**Status**: ✅ Providers configurados em `app.config.ts`, sem erros de compilação

#### 1.4. Criar componente de teste simples [✅]

**Descrição**: Criar componente de teste para validar instalação e configuração
**Arquivo**: `src/app/features/reports/components/chart-test/chart-test.component.ts`
**Critério de Conclusão**: Componente renderiza gráfico simples sem erros
**Status**: ✅ Componente criado com gráfico de pizza básico, seguindo padrões do projeto (OnPush, signals)

### 🧪 Critérios de Validação

- [x] Dependências instaladas corretamente
- [x] `app.config.ts` atualizado com providers
- [x] Componente de teste renderiza gráfico básico
- [x] Sem erros de compilação ou runtime
- [x] Bundle size verificado (chart.js adiciona ~150KB conforme esperado)

### 📝 Comentários da Fase

- **Decisão**: Versões instaladas (ng2-charts ^8.0.0, chart.js ^4.5.1) são superiores às mínimas especificadas e totalmente compatíveis com Angular 20+
- **Implementação**: Componente de teste criado seguindo padrões do projeto:
  - `ChangeDetectionStrategy.OnPush`
  - Signals para dados reativos
  - Standalone component
  - Template inline
- **Validação**: Build compilado com sucesso, sem erros de compilação ou runtime
- **Bundle Size**: Chart.js adiciona aproximadamente 150KB ao bundle conforme esperado

---

## 📅 FASE 2: Estrutura Base da Feature, Camada de Abstração e DTOs [Status: ✅ Completada]

### 🎯 Objetivo

Criar estrutura de diretórios da feature reports e da camada de abstração de gráficos, além de implementar DTOs e interfaces genéricas necessárias.

### 📋 Tarefas

#### 2.1. Criar estrutura de diretórios da feature [✅]

**Descrição**: Criar estrutura completa de diretórios da feature
**Estrutura**:

```
src/app/features/reports/
├── components/
├── pages/
├── services/
├── state/
├── types/
└── reports.routes.ts
```

**Critério de Conclusão**: Todos os diretórios criados
**Status**: ✅ Criado - Estrutura completa criada

#### 2.2. Criar estrutura da camada de abstração de gráficos [✅]

**Descrição**: Criar estrutura de diretórios da camada de abstração sobre ng2-charts
**Estrutura**:

```
src/shared/charts/
├── interfaces/
├── chart-adapter/
├── components/
└── providers/
```

**Critério de Conclusão**: Estrutura de diretórios criada conforme architecture.md
**Status**: ✅ Criado - Estrutura completa criada

#### 2.3. Criar interfaces genéricas da camada de abstração [✅]

**Descrição**: Criar interfaces genéricas que definem o contrato dos gráficos
**Arquivos**:

- `src/shared/charts/interfaces/chart-data.interface.ts`
- `src/shared/charts/interfaces/chart-config.interface.ts`
- `src/shared/charts/interfaces/chart-options.interface.ts`
- `src/shared/charts/interfaces/chart-type.enum.ts`
  **Critério de Conclusão**: Interfaces criadas com tipos genéricos, sem dependência direta do ng2-charts
  **Status**: ✅ Criado - Todas as interfaces criadas sem dependência direta do ng2-charts

#### 2.4. Criar DTOs de relatórios [✅]

**Descrição**: Criar DTOs para request e response de relatórios
**Arquivos**:

- `src/dtos/report/report-request.dto.ts`
- `src/dtos/report/report-response.dto.ts`
- `src/dtos/report/category-spending.dto.ts`
- `src/dtos/report/revenue-expense.dto.ts`
  **Critério de Conclusão**: DTOs criados com tipos TypeScript corretos, seguindo padrão dos outros DTOs do projeto
  **Status**: ✅ Criado - DTOs criados seguindo padrão do projeto

#### 2.5. Criar tipos TypeScript da feature [✅]

**Descrição**: Criar tipos específicos da feature (enums, interfaces)
**Arquivo**: `src/app/features/reports/types/reports.types.ts`
**Tipos esperados**:

- `ReportPeriod` enum (CURRENT_MONTH, LAST_MONTH, LAST_3_MONTHS)
- `ReportFilters` interface
  **Nota**: Interfaces de gráficos agora estão na camada de abstração (`ChartData`, `ChartConfig`)
  **Critério de Conclusão**: Tipos criados e exportados corretamente
  **Status**: ✅ Criado - Tipos criados com enum ReportPeriod e interface ReportFilters

#### 2.6. Criar arquivo de rotas básico [✅]

**Descrição**: Criar arquivo de rotas da feature (placeholder inicial)
**Arquivo**: `src/app/features/reports/reports.routes.ts`
**Critério de Conclusão**: Arquivo criado com estrutura básica de rotas
**Status**: ✅ Criado - Arquivo de rotas criado com lazy loading

### 🔄 Dependências

- ✅ Fase 1 completada

### 🧪 Critérios de Validação

- [x] Estrutura de diretórios da feature criada
- [x] Estrutura da camada de abstração criada
- [x] Interfaces genéricas criadas (sem dependência direta do ng2-charts)
- [x] DTOs seguem padrão do projeto
- [x] Tipos TypeScript sem erros de compilação
- [x] Arquivo de rotas criado

### 📝 Comentários da Fase

- **Decisão**: Interfaces genéricas criadas sem dependência direta do ng2-charts, facilitando futuras migrações
- **Implementação**: DTOs seguem padrão estabelecido no projeto (interfaces TypeScript simples)
- **Estrutura**: Camada de abstração organizada em interfaces/, chart-adapter/, components/ e providers/
- **Validação**: Todos os arquivos criados sem erros de compilação ou lint

---

## 📅 FASE 3: Camada de Abstração de Gráficos [Status: ⏰ Em Progresso]

### 🎯 Objetivo

Implementar a camada de abstração sobre ng2-charts, incluindo serviços de adaptação e componentes base que encapsulam a biblioteca.

### 📋 Tarefas

#### 3.1. Implementar ChartAdapterService [✅]

**Descrição**: Criar serviço que converte dados genéricos para formato ng2-charts
**Arquivo**: `src/shared/charts/chart-adapter/chart-adapter.service.ts`
**Funcionalidades**:

- Converter `ChartData` genérico para formato Chart.js
- Converter `ChartConfig` genérico para opções Chart.js
- Tratamento de erros de conversão
  **Critério de Conclusão**: Serviço implementado com métodos de conversão, usando `inject()` e `providedIn: 'root'`

#### 3.2. Implementar ChartConfigMapper [✅]

**Descrição**: Criar serviço para mapear configurações genéricas para opções do Chart.js
**Arquivo**: `src/shared/charts/chart-adapter/chart-config-mapper.service.ts`
**Funcionalidades**:

- Mapear cores, legendas, tooltips genéricos para Chart.js
- Configurar opções de responsividade e animações
  **Critério de Conclusão**: Serviço implementado com mapeamento completo de configurações

#### 3.3. Implementar ChartDataTransformer [✅]

**Descrição**: Criar serviço para transformar dados da aplicação para formato genérico
**Arquivo**: `src/shared/charts/chart-adapter/chart-data-transformer.service.ts`
**Funcionalidades**:

- Transformar DTOs de relatórios em `ChartData` genérico
- Normalizar dados para formato padronizado
  **Critério de Conclusão**: Serviço implementado com transformações necessárias

#### 3.4. Criar BaseChartComponent [✅]

**Descrição**: Criar componente base abstrato para gráficos
**Arquivo**: `src/shared/charts/components/base-chart/base-chart.component.ts`
**Funcionalidades**:

- Componente base que encapsula ng2-charts
- Inputs genéricos (`ChartData`, `ChartConfig`)
- Integração com ChartAdapterService
  **Critério de Conclusão**: Componente base criado como classe abstrata, sem dependências diretas expostas

#### 3.5. Implementar PieChartComponent [✅]

**Descrição**: Criar componente wrapper para gráfico de pizza usando a camada de abstração
**Arquivo**: `src/shared/charts/components/pie-chart/pie-chart.component.ts`
**Funcionalidades**:

- Estende BaseChartComponent
- Inputs: `data: ChartData`, `config: ChartConfig`
- Renderiza gráfico de pizza via ng2-charts internamente
- Acessibilidade (ARIA labels)
  **Critério de Conclusão**: Componente renderiza gráfico de pizza usando camada de abstração

#### 3.6. Implementar BarChartComponent [✅]

**Descrição**: Criar componente wrapper para gráfico de barras usando a camada de abstração
**Arquivo**: `src/shared/charts/components/bar-chart/bar-chart.component.ts`
**Funcionalidades**:

- Estende BaseChartComponent
- Inputs: `data: ChartData`, `config: ChartConfig`
- Renderiza gráfico de barras via ng2-charts internamente
- Acessibilidade (ARIA labels)
  **Critério de Conclusão**: Componente renderiza gráfico de barras usando camada de abstração

#### 3.7. Criar chart-providers.ts [✅]

**Descrição**: Criar arquivo centralizado com providers da camada de abstração
**Arquivo**: `src/shared/charts/providers/chart-providers.ts`
**Funcionalidades**:

- Exportar providers necessários (ChartAdapterService, etc.)
- Configurar providers do ng2-charts
  **Critério de Conclusão**: Providers centralizados e exportados corretamente

#### 3.8. Criar testes unitários da camada de abstração [⏳]

**Descrição**: Implementar testes unitários para serviços e componentes da camada
**Arquivos**: `*.spec.ts` correspondentes
**Critério de Conclusão**: Testes implementados com cobertura > 80%, validando conversão e renderização

### 🔄 Dependências

- ✅ Fase 1 completada (ng2-charts instalado)
- ✅ Fase 2 completada (interfaces genéricas criadas)

### 🧪 Critérios de Validação

- [ ] ChartAdapterService implementado e testado
- [ ] ChartConfigMapper implementado e testado
- [ ] ChartDataTransformer implementado e testado
- [ ] BaseChartComponent criado como classe abstrata
- [ ] PieChartComponent renderiza gráfico corretamente
- [ ] BarChartComponent renderiza gráfico corretamente
- [ ] Providers centralizados criados
- [ ] Testes unitários passando com cobertura adequada
- [ ] Componentes não expõem dependências diretas do ng2-charts

### 📝 Comentários da Fase

_[Observações sobre implementação da camada de abstração]_

---

## 📅 FASE 4: Serviços e Estado (API e Cálculos) [Status: ⏳]

### 🎯 Objetivo

Implementar serviços de API e cálculos, além do gerenciamento de estado com signals para a feature de relatórios.

### 📋 Tarefas

#### 3.1. Implementar ReportsApiService [⏳]

**Descrição**: Criar serviço de API para buscar dados de transações filtradas
**Arquivo**: `src/app/features/reports/services/reports-api/reports-api.service.ts`
**Funcionalidades**:

- Buscar transações por período e orçamento
- Integração com `TransactionService` ou `ApiService`
- Tratamento de erros
  **Critério de Conclusão**: Serviço implementado com métodos para buscar dados, usando `inject()` e seguindo padrão dos outros serviços

#### 3.2. Implementar ReportsCalculatorService [⏳]

**Descrição**: Criar serviço para cálculos de agregação (gastos por categoria, receitas vs despesas)
**Arquivo**: `src/app/features/reports/services/reports-calculator/reports-calculator.service.ts`
**Funcionalidades**:

- Calcular gastos por categoria
- Calcular receitas vs despesas
- Calcular totais e percentuais
  **Critério de Conclusão**: Serviço implementado com métodos de cálculo, testável e sem dependências de UI

#### 3.3. Implementar ReportsState [⏳]

**Descrição**: Criar estado da feature usando signals
**Arquivo**: `src/app/features/reports/state/reports-state/reports.state.ts`
**Funcionalidades**:

- Signals para dados de relatórios
- Signals para filtros (período, orçamento)
- Signals para loading e error
- Computed properties para dados derivados
- Métodos para carregar dados e atualizar filtros
  **Critério de Conclusão**: Estado implementado com signals, seguindo padrão de `BudgetState` ou `AccountState`

#### 3.4. Criar testes unitários para serviços [⏳]

**Descrição**: Implementar testes unitários para ReportsApiService e ReportsCalculatorService
**Arquivos**: `*.spec.ts` correspondentes
**Critério de Conclusão**: Testes implementados com cobertura > 80%, usando vitest

### 🔄 Dependências

- ✅ Fase 2 completada
- ✅ Fase 3 completada (camada de abstração pronta)

### 🧪 Critérios de Validação

- [ ] ReportsApiService implementado e testado
- [ ] ReportsCalculatorService implementado e testado
- [ ] ReportsState implementado com signals
- [ ] Testes unitários passando com cobertura adequada
- [ ] Integração com serviços existentes funcionando

### 📝 Comentários da Fase

_[Observações sobre cálculos e otimizações]_

---

## 📅 FASE 5: Componentes do Design System (os-chart-container e os-report-summary-card) [Status: ⏳]

### 🎯 Objetivo

Criar componentes reutilizáveis do Design System para suportar a feature de relatórios: container de gráficos e card de resumo numérico.

### 📋 Tarefas

#### 4.1. Criar componente os-chart-container [⏳]

**Descrição**: Criar componente Molecule para container padronizado de gráficos
**Arquivo**: `src/app/shared/ui-components/molecules/chart-container/chart-container.component.ts`
**Funcionalidades**:

- Container com título e subtítulo
- Estados: loading, error, empty
- Integração com componentes da camada de abstração (PieChartComponent/BarChartComponent)
- Responsividade (mobile, tablet, desktop)
- Acessibilidade (ARIA labels, role="region")
  **Critério de Conclusão**: Componente criado seguindo padrão dos outros molecules, com todos os estados implementados, usando componentes da camada de abstração

#### 4.2. Criar componente os-report-summary-card [⏳]

**Descrição**: Criar componente Molecule para card de resumo numérico
**Arquivo**: `src/app/shared/ui-components/molecules/report-summary-card/report-summary-card.component.ts`
**Funcionalidades**:

- Exibir label e valor
- Variants: positive, negative, neutral
- Responsividade (grid adaptativo)
- Acessibilidade (ARIA labels, role="article")
  **Critério de Conclusão**: Componente criado com variants e responsividade implementada

#### 4.3. Implementar estilos SCSS [⏳]

**Descrição**: Implementar estilos seguindo design tokens do projeto
**Arquivos**: `*.component.scss` correspondentes
**Critério de Conclusão**: Estilos implementados usando tokens `--os-*`, responsivos e acessíveis

#### 4.4. Criar testes unitários [⏳]

**Descrição**: Implementar testes unitários para os novos componentes
**Arquivos**: `*.spec.ts` correspondentes
**Critério de Conclusão**: Testes implementados validando renderização, estados e acessibilidade

### 🔄 Dependências

- ✅ Fase 1 completada (ng2-charts instalado)
- ✅ Fase 2 completada (tipos criados)
- ✅ Fase 3 completada (camada de abstração implementada)

### 🧪 Critérios de Validação

- [ ] os-chart-container criado e funcional
- [ ] os-report-summary-card criado e funcional
- [ ] Estados (loading, error, empty) implementados
- [ ] Responsividade testada (mobile, tablet, desktop)
- [ ] Acessibilidade validada (ARIA, keyboard navigation)
- [ ] Testes unitários passando

### 📝 Comentários da Fase

_[Observações sobre design e acessibilidade]_

---

## 📅 FASE 6: Componentes de Gráficos da Feature [Status: ⏳]

### 🎯 Objetivo

Implementar componentes específicos da feature para gráficos de pizza (gastos por categoria) e barras (receitas vs despesas) usando a camada de abstração de gráficos.

### 📋 Tarefas

#### 6.1. Criar componente spending-chart [⏳]

**Descrição**: Criar componente para gráfico de pizza de gastos por categoria
**Arquivo**: `src/app/features/reports/components/spending-chart/spending-chart.component.ts`
**Funcionalidades**:

- Usa PieChartComponent da camada de abstração (não ng2-charts diretamente)
- Converte dados de ReportsState para formato genérico (ChartData, ChartConfig)
- Integração com os-chart-container
- Dados vindos de ReportsState
- Tooltips e legendas configuradas via ChartConfig
- Acessibilidade (ARIA, tabela alternativa)
  **Critério de Conclusão**: Componente renderiza gráfico de pizza corretamente usando camada de abstração, integrado com os-chart-container

#### 6.2. Criar componente revenue-expense-chart [⏳]

**Descrição**: Criar componente para gráfico de barras comparando receitas vs despesas
**Arquivo**: `src/app/features/reports/components/revenue-expense-chart/revenue-expense-chart.component.ts`
**Funcionalidades**:

- Usa BarChartComponent da camada de abstração (não ng2-charts diretamente)
- Converte dados de ReportsState para formato genérico (ChartData, ChartConfig)
- Integração com os-chart-container
- Dados vindos de ReportsState
- Tooltips e legendas configuradas via ChartConfig
- Acessibilidade (ARIA, tabela alternativa)
  **Critério de Conclusão**: Componente renderiza gráfico de barras corretamente usando camada de abstração

#### 6.3. Criar componente report-filters [⏳]

**Descrição**: Criar componente para filtros de período e orçamento
**Arquivo**: `src/app/features/reports/components/report-filters/report-filters.component.ts`
**Funcionalidades**:

- Filtro de período (os-select)
- Filtro de orçamento (os-budget-selector, quando múltiplos)
- Barra sticky após scroll
- Integração com ReportsState
- Debounce para evitar recálculos excessivos
  **Critério de Conclusão**: Componente implementado com filtros funcionais e integração com estado

#### 6.4. Implementar conversão de dados para formato genérico [⏳]

**Descrição**: Criar funções/helpers para converter DTOs em formato genérico da camada de abstração (ChartData, ChartConfig)
**Arquivo**: `src/app/features/reports/utils/chart-data.utils.ts` (ou similar)
**Nota**: Não converte diretamente para Chart.js, mas sim para o formato genérico da camada de abstração
**Critério de Conclusão**: Funções de conversão criadas e testadas, retornando ChartData e ChartConfig genéricos

#### 6.5. Criar testes unitários [⏳]

**Descrição**: Implementar testes unitários para componentes de gráficos (usando mocks da camada de abstração)
**Arquivos**: `*.spec.ts` correspondentes
**Critério de Conclusão**: Testes implementados validando renderização e interações, sem dependência direta do ng2-charts

### 🔄 Dependências

- ✅ Fase 4 completada (serviços e estado)
- ✅ Fase 5 completada (componentes do Design System)
- ✅ Fase 3 completada (camada de abstração implementada)

### 🧪 Critérios de Validação

- [ ] spending-chart renderiza gráfico de pizza corretamente usando camada de abstração
- [ ] revenue-expense-chart renderiza gráfico de barras corretamente usando camada de abstração
- [ ] report-filters implementado e funcional
- [ ] Conversão de dados para formato genérico funcionando
- [ ] Integração com ReportsState funcionando
- [ ] Componentes não dependem diretamente do ng2-charts
- [ ] Testes unitários passando (usando mocks da camada de abstração)

### 📝 Comentários da Fase

_[Observações sobre uso da camada de abstração e conversão de dados]_

---

## 📅 FASE 7: Página de Relatórios e Roteamento [Status: ⏳]

### 🎯 Objetivo

Criar página principal de relatórios com layout responsivo e integrar com roteamento da aplicação.

### 📋 Tarefas

#### 7.1. Criar ReportsPage [⏳]

**Descrição**: Criar página principal de relatórios
**Arquivo**: `src/app/features/reports/pages/reports/reports.page.ts`
**Funcionalidades**:

- Layout responsivo conforme layout-specification.md
- Integração com ReportsState
- Grid responsivo (3/2/1 colunas conforme breakpoint)
- Cards de resumo numérico (Total Gastos, Receitas, Diferença)
- Gráficos integrados (usando componentes da feature que usam camada de abstração)
- Barra de filtros sticky
- Estados (loading, error, empty)
  **Critério de Conclusão**: Página criada com layout completo conforme especificação

#### 7.2. Implementar layout responsivo [⏳]

**Descrição**: Implementar estilos SCSS responsivos seguindo breakpoints definidos
**Arquivo**: `src/app/features/reports/pages/reports/reports.page.scss`
**Breakpoints**:

- Mobile: < 576px (stack vertical)
- Tablet: 576-991px (grid 2 colunas)
- Desktop: >= 992px (grid 3 colunas)
  **Critério de Conclusão**: Layout responsivo implementado e testado em diferentes resoluções

#### 7.3. Configurar rotas da feature [⏳]

**Descrição**: Configurar rotas da feature com lazy loading
**Arquivo**: `src/app/features/reports/reports.routes.ts`
**Rota**: `/reports` → ReportsPage
**Critério de Conclusão**: Rota configurada com lazy loading

#### 7.4. Adicionar rota no app.routes.ts [⏳]

**Descrição**: Adicionar rota `/reports` no roteamento principal
**Arquivo**: `src/app/app.routes.ts`
**Critério de Conclusão**: Rota adicionada e funcionando

#### 7.5. Adicionar item de menu (se aplicável) [⏳]

**Descrição**: Adicionar item "Relatórios" no menu principal (se houver componente de menu)
**Arquivo**: Verificar onde está o menu principal
**Critério de Conclusão**: Item de menu adicionado (se aplicável)

#### 7.6. Implementar empty states e error handling [⏳]

**Descrição**: Implementar estados vazios e tratamento de erros na página
**Critério de Conclusão**: Empty states e error handling implementados conforme layout-specification.md

### 🔄 Dependências

- ✅ Fase 6 completada (componentes de gráficos)

### 🧪 Critérios de Validação

- [ ] ReportsPage criada e funcional
- [ ] Layout responsivo implementado e testado
- [ ] Rota `/reports` funcionando com lazy loading
- [ ] Item de menu adicionado (se aplicável)
- [ ] Empty states e error handling implementados
- [ ] Integração completa funcionando

### 📝 Comentários da Fase

_[Observações sobre layout e UX]_

---

## 📅 FASE 8: Testes, Validação e Polimento Final [Status: ⏳]

### 🎯 Objetivo

Finalizar implementação com testes completos, validação de acessibilidade, performance e qualidade do código.

### 📋 Tarefas

#### 7.1. Completar testes unitários [⏳]

**Descrição**: Garantir cobertura de testes > 80% em todos os componentes e serviços, incluindo camada de abstração
**Checklist**:

- [ ] Testes da camada de abstração (ChartAdapterService, ChartConfigMapper, ChartDataTransformer)
- [ ] Testes dos componentes base (PieChartComponent, BarChartComponent)
- [ ] Testes dos serviços da feature (ReportsApiService, ReportsCalculatorService)
- [ ] Testes do estado (ReportsState)
- [ ] Testes dos componentes da feature (spending-chart, revenue-expense-chart, report-filters)
- [ ] Testes dos componentes do Design System (os-chart-container, os-report-summary-card)
      **Critério de Conclusão**: Todos os testes passando, cobertura > 80%

#### 7.2. Validar acessibilidade WCAG 2.1 AA [⏳]

**Descrição**: Validar conformidade com WCAG 2.1 AA
**Checklist**:

- [ ] Keyboard navigation completa
- [ ] ARIA attributes corretos
- [ ] Screen reader friendly (tabelas alternativas para gráficos)
- [ ] Contraste adequado (>= 4.5:1 para texto)
- [ ] Focus visible em elementos interativos
- [ ] Gráficos com descrições textuais
      **Critério de Conclusão**: Validação de acessibilidade completa

#### 7.3. Validar responsividade [⏳]

**Descrição**: Testar em diferentes resoluções e dispositivos
**Resoluções**:

- Mobile: < 576px
- Tablet: 576-991px
- Desktop: >= 992px
  **Critério de Conclusão**: Layout responsivo funcionando em todas as resoluções

#### 7.4. Validar performance [⏳]

**Descrição**: Validar performance e bundle size
**Checklist**:

- [ ] Bundle size verificado (~150KB adicional)
- [ ] Lazy loading funcionando
- [ ] OnPush change detection em todos componentes
- [ ] Computed signals para derivações
- [ ] Debounce em filtros funcionando
      **Critério de Conclusão**: Performance validada e otimizada

#### 7.5. Validar integração da camada de abstração [⏳]

**Descrição**: Validar integração completa da camada de abstração com ng2-charts
**Checklist**:

- [ ] Camada de abstração funciona corretamente
- [ ] Componentes da feature não dependem diretamente do ng2-charts
- [ ] Gráficos renderizam corretamente através da camada de abstração
- [ ] Tooltips funcionais
- [ ] Legendas configuradas adequadamente
- [ ] Responsividade dos gráficos funcionando
- [ ] Acessibilidade dos gráficos (ARIA, tabelas alternativas)
- [ ] Conversão de dados genéricos para ng2-charts funcionando corretamente
      **Critério de Conclusão**: Integração da camada de abstração validada

#### 7.6. Revisar código e documentação [⏳]

**Descrição**: Revisar código seguindo padrões do projeto e atualizar documentação se necessário
**Critério de Conclusão**: Código revisado e documentação atualizada

#### 7.7. Validar critérios de aceitação [⏳]

**Descrição**: Validar todos os critérios de aceitação do context.md
**Checklist**:

- [ ] Usuário pode acessar página de relatórios via rota `/reports`
- [ ] Exibe relatório de gastos por categoria com valores e percentuais
- [ ] Visualiza distribuição de gastos em gráfico de pizza ou barras
- [ ] Filtra relatórios por período (mês atual, mês anterior, últimos 3 meses)
- [ ] Mostra resumo de receitas vs despesas no período selecionado
- [ ] Permite filtrar por orçamento específico (quando usuário tem múltiplos)
- [ ] Interface responsiva e acessível
- [ ] Dados são calculados a partir das transações existentes
- [ ] Performance adequada mesmo com volume moderado de transações
- [ ] Testes unitários com cobertura > 80%
      **Critério de Conclusão**: Todos os critérios de aceitação validados

### 🔄 Dependências

- ✅ Fase 7 completada (página e roteamento)

### 🧪 Critérios de Validação

- [ ] Todos os testes passando com cobertura > 80%
- [ ] Acessibilidade WCAG 2.1 AA validada
- [ ] Responsividade validada em todas as resoluções
- [ ] Performance validada e otimizada
- [ ] Integração da camada de abstração validada
- [ ] Componentes da feature não dependem diretamente do ng2-charts
- [ ] Código revisado e documentado
- [ ] Todos os critérios de aceitação atendidos

### 📝 Comentários da Fase

_[Observações finais e melhorias futuras]_

---

## 🏁 Entrega Final

### Checklist de Entrega

- [ ] Todas as fases completadas
- [ ] Todos os testes passando
- [ ] Cobertura de testes > 80%
- [ ] Acessibilidade WCAG 2.1 AA validada
- [ ] Responsividade validada
- [ ] Performance validada
- [ ] Documentação atualizada
- [ ] Código revisado e seguindo padrões do projeto
- [ ] Pronto para Pull Request

### Próximos Passos Após Entrega

1. **Code Review**: Submeter PR para revisão
2. **QA Testing**: Testes de QA em ambiente de staging
3. **Deploy**: Deploy em produção após aprovação
4. **Monitoramento**: Monitorar performance e erros em produção

### Melhorias Futuras (Pós-MVP)

- Exportação de dados (PDF/Excel)
- Relatórios personalizáveis avançados
- Gráficos de tendências complexos
- Análises preditivas
- Comparações entre períodos múltiplos
- Gráficos adicionais (linha temporal, etc.)

---

## 📚 Referências

- [Context]: `sessions/OS-232/context.md` - Requisitos e objetivos
- [Architecture]: `sessions/OS-232/architecture.md` - Design técnico e decisões arquiteturais
- [Layout Specification]: `sessions/OS-232/layout-specification.md` - Especificações de UI/UX
- [Chart Libraries Analysis]: `sessions/OS-232/chart-libraries-analysis.md` - Análise de bibliotecas
- [ng2-charts Docs]: https://github.com/valor-software/ng2-charts
- [Chart.js Docs]: https://www.chartjs.org/
- [Angular Signals]: https://angular.dev/guide/signals
- [Jira Issue]: OS-232

---

**Última atualização**: 2025-01-24
**Status geral**: ⏳ Não iniciado
