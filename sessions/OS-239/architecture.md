# Finalizar Implementação do Componente Budget Detail Page - Arquitetura Técnica

## 🏗️ Visão Geral da Implementação

### Estado Atual

O componente `budget-detail.page.ts` possui:
- ✅ Estrutura básica implementada
- ✅ Seção de informações básicas (ID, tipo, participantes)
- ✅ Seção de contas do orçamento (com layout básico)
- ✅ Seção de colaboração (apenas contagem de participantes)
- ❌ Seção "Visão Geral" com placeholder
- ❌ Carregamento de recursos não está sendo executado
- ❌ Layout da listagem de contas sem estilos adequados
- ❌ Visualização de participantes limitada (apenas contagem)

### Mudanças Propostas

1. **Implementar Seção "Visão Geral"**:
   - Substituir placeholder por componente `os-dashboard-widgets`
   - Configurar widget `budget-summary` para exibir resumo financeiro
   - Integrar indicadores de saúde financeira quando disponíveis

2. **Corrigir Carregamento de Recursos**:
   - Adicionar chamada a `loadResources()` após orçamento ser selecionado
   - Garantir que `BudgetSelectionService` tenha orçamento selecionado antes de carregar
   - Usar `effect()` ou verificação reativa para detectar quando orçamento está disponível

3. **Melhorar Visualização de Participantes**:
   - Substituir contagem por componente `collaboration-dashboard`
   - Passar `budgetId` e `creatorId` como inputs

4. **Melhorar Layout da Listagem de Contas**:
   - Opção A: Adicionar estilos CSS para classes existentes
   - Opção B: Substituir por componente `os-account-card` (recomendado para consistência)
   - Adicionar estilos para todos os estados (loading, empty, list)

### Impactos

- **Componente Principal**: `budget-detail.page.ts` - modificações no template e lógica
- **Arquivo SCSS**: `budget-detail.page.scss` - adição de estilos faltantes
- **Serviços de Estado**: Uso correto de `BudgetSelectionService` para seleção de orçamento
- **Componentes Reutilizados**: Integração com componentes existentes do design system

## 🔧 Componentes e Estrutura

### Arquivos Principais a Modificar

- **`src/app/features/budget/pages/budget-detail/budget-detail.page.ts`**:
  - Adicionar imports de componentes reutilizáveis
  - Modificar template para substituir placeholders
  - Adicionar lógica de carregamento de recursos
  - Adicionar computed properties para dados financeiros

- **`src/app/features/budget/pages/budget-detail/budget-detail.page.scss`**:
  - Adicionar estilos para classes faltantes
  - Melhorar layout e responsividade
  - Adicionar estilos para estados (loading, empty, error)

### Novos Arquivos a Criar

Nenhum arquivo novo necessário - reutilização de componentes existentes.

### Estrutura de Diretórios

```
src/app/features/budget/pages/budget-detail/
├── budget-detail.page.ts      (modificar)
├── budget-detail.page.scss    (modificar)
└── budget-detail.page.spec.ts (atualizar testes se necessário)
```

## 🏛️ Padrões Arquiteturais

### Padrões Seguidos

- **Clean Architecture**: Separação de responsabilidades entre camadas
- **State Management com Signals**: Uso de signals para estado reativo
- **Component Composition**: Reutilização de componentes existentes
- **OnPush Change Detection**: Performance otimizada
- **Standalone Components**: Arquitetura moderna do Angular

### Decisões Arquiteturais

1. **Reutilização de Componentes vs. Implementação Customizada**:
   - **Decisão**: Reutilizar `os-dashboard-widgets`, `os-account-card` e `collaboration-dashboard`
   - **Alternativas**: Criar componentes customizados específicos para esta página
   - **Justificativa**: Consistência visual, menos código duplicado, manutenção facilitada

2. **Carregamento de Recursos**:
   - **Decisão**: Usar `effect()` para detectar quando orçamento está disponível e carregar recursos
   - **Alternativas**: Chamar diretamente em `ngOnInit()` ou usar subscription
   - **Justificativa**: Reatividade com signals, evita race conditions, mais declarativo

3. **Seleção de Orçamento**:
   - **Decisão**: Garantir que orçamento seja selecionado no `BudgetSelectionService` antes de carregar recursos
   - **Alternativas**: Passar `budgetId` diretamente para serviços
   - **Justificativa**: Consistência com padrão do projeto, outros componentes dependem do orçamento selecionado

4. **Layout de Contas**:
   - **Decisão**: Substituir lista simples por `os-account-card` para consistência
   - **Alternativas**: Adicionar apenas estilos CSS para lista existente
   - **Justificativa**: Melhor UX, consistência visual, reutilização de componente testado

## 🎨 UI Components and Layout

### Design System Integration

O layout utiliza componentes existentes do design system OrçaSonhos para garantir consistência visual e reutilização de código:

**Organisms:**
- `os-page`: Container principal da página (variant: default, size: medium)
- `os-page-header`: Cabeçalho com breadcrumbs, título e ações
- `os-dashboard-widgets`: Widgets de resumo financeiro para seção "Visão Geral"
- `collaboration-dashboard`: Lista completa de participantes do orçamento

**Molecules:**
- `os-account-card`: Cards de contas (opcional, mas recomendado para consistência)
- `os-alert`: Mensagens de erro e estados vazios
- `os-money-display`: Exibição de valores monetários

**Atoms:**
- `os-button`: Ações e navegação (variants: primary, secondary, danger)
- `os-skeleton`: Estados de loading
- `os-icon`: Indicadores visuais

### Layout Architecture

**Estrutura:**
- Layout tipo **Detail Page** com múltiplas seções em cards
- Stack vertical responsivo (mobile-first)
- Grid system: 1 coluna (mobile), 2 colunas (tablet), 3 colunas (desktop) para info-grid
- Max-width: 1200px centralizado (via `os-page`)

**Seções (ordem):**
1. Informações Básicas (ID, Tipo, Participantes)
2. Visão Geral (Dashboard widgets + botão Ver Transações)
3. Contas do Orçamento (Lista de contas + ações)
4. Colaboração (Lista de participantes + gerenciamento)

**Responsividade:**
- Mobile (0-575px): Stack completo, touch targets >= 44px, padding 16px
- Tablet (576-991px): Grid 2 colunas onde aplicável, padding 20px
- Desktop (992px+): Grid 3 colunas, hover states, padding 24px

### Performance Considerations

- **OnPush Change Detection**: Todos os componentes usam OnPush
- **Computed Signals**: Valores derivados via computed()
- **Lazy Loading**: Não necessário - componentes já no bundle
- **Bundle Size**: Impacto mínimo - apenas imports de componentes existentes

**Detalhes completos em:** `layout-specification.md`

## 📦 Dependências e Integrações

### Dependências Existentes

- `@angular/core`: Signals, computed, effect, inject
- `@angular/common`: CommonModule
- `@angular/router`: Router, ActivatedRoute
- `@core/services/*`: BudgetState, AccountState, SharingState, AuthService
- `@shared/ui-components/*`: Componentes do design system
- `@shared/formatting`: LocaleService

### Novas Dependências

Nenhuma nova dependência externa necessária. Apenas imports de componentes existentes:

- `OsDashboardWidgetsComponent`: Para seção "Visão Geral"
- `AccountCardComponent`: Para listagem de contas (opcional, mas recomendado)
- `CollaborationDashboardComponent`: Para visualização de participantes

### Integrações

1. **os-dashboard-widgets**:
   - **Inputs**: Configuração de widgets, dados financeiros
   - **Outputs**: Ações de widgets (se necessário)
   - **Uso**: Exibir resumo financeiro na seção "Visão Geral"

2. **os-account-card** (opcional):
   - **Inputs**: `account` (AccountDto), `actions` (opcional)
   - **Outputs**: `edit`, `delete` (se necessário)
   - **Uso**: Substituir lista simples de contas

3. **collaboration-dashboard**:
   - **Inputs**: `budgetId`, `creatorId`
   - **Outputs**: `participantRemoved`
   - **Uso**: Substituir contagem de participantes por lista completa

4. **BudgetSelectionService**:
   - **Método**: `setSelectedBudget()` ou `selectBudgetById()`
   - **Uso**: Garantir que orçamento esteja selecionado antes de carregar recursos

5. **ReportsState** (opcional):
   - **Método**: `loadReports()` para obter dados financeiros
   - **Computed**: `totals()`, `revenueExpense()` para resumo financeiro
   - **Uso**: Fornecer dados para widgets de dashboard

## 🔄 Fluxo de Dados

### Fluxo de Carregamento

```
1. Componente inicializa (ngOnInit)
   ↓
2. Obtém budgetId da rota
   ↓
3. Verifica se orçamentos já estão carregados
   ↓
4a. Se não: Carrega orçamentos via BudgetState.loadBudgets()
4b. Se sim: Seleciona orçamento via BudgetState.selectBudget(id)
   ↓
5. Effect detecta que orçamento está selecionado
   ↓
6. Chama loadResources(budgetId)
   ↓
7. loadResources():
   - accountState.loadAccounts() (usa selectedBudgetId do BudgetSelectionService)
   - sharingState.loadParticipants(id)
   - sharingState.startPolling(id)
   - resourcesLoaded.set(true)
   ↓
8. Componente reage a mudanças nos signals
   ↓
9. Template renderiza com dados carregados
```

### Fluxo de Dados Financeiros (Seção "Visão Geral")

```
1. BudgetSelectionService tem orçamento selecionado
   ↓
2. ReportsState.loadReports() (opcional, se necessário)
   ↓
3. OsDashboardWidgetsComponent recebe dados:
   - Budget summary (saldo total, receitas, despesas)
   - Indicadores de saúde financeira
   ↓
4. Widgets renderizam dados financeiros
```

### Fluxo de Participantes

```
1. SharingState.loadParticipants(budgetId)
   ↓
2. CollaborationDashboardComponent recebe:
   - participants (computed do SharingState)
   - creatorId (do currentUser ou budget)
   ↓
3. Componente renderiza lista de participantes
   ↓
4. Polling mantém lista atualizada
```

## 🧪 Considerações de Teste

### Testes Unitários

- **Carregamento de Recursos**:
  - Verificar que `loadResources()` é chamado quando orçamento está disponível
  - Validar que flag `resourcesLoaded` previne carregamentos duplicados
  - Testar que orçamento é selecionado no `BudgetSelectionService`

- **Integração com Componentes**:
  - Verificar que `os-dashboard-widgets` recebe dados corretos
  - Validar que `collaboration-dashboard` recebe `budgetId` e `creatorId`
  - Testar que `os-account-card` recebe contas corretas (se implementado)

- **Estados do Componente**:
  - Testar estado de loading
  - Testar estado de error
  - Testar estado vazio (sem contas, sem participantes)
  - Testar estado success com dados

### Testes de Integração

- **Fluxo Completo**:
  - Navegação para página de detalhes
  - Carregamento de orçamento
  - Carregamento de recursos
  - Renderização de todas as seções

- **Interações**:
  - Navegação para transações
  - Abertura de modal de compartilhamento
  - Criação de nova conta

### Mocks e Fixtures

- Mock de `BudgetState` com orçamentos
- Mock de `AccountState` com contas
- Mock de `SharingState` com participantes
- Mock de `ReportsState` com dados financeiros (se necessário)

## ⚖️ Trade-offs e Riscos

### Trade-offs Aceitos

1. **Reutilização vs. Customização**:
   - **Trade-off**: Menos controle sobre layout específico, mas maior consistência
   - **Benefício**: Código mais limpo, manutenção facilitada

2. **Carregamento Síncrono vs. Assíncrono**:
   - **Trade-off**: Usar `effect()` pode adicionar complexidade, mas é mais reativo
   - **Benefício**: Melhor sincronização com estado, menos race conditions

3. **Dados Financeiros**:
   - **Trade-off**: Carregar dados via `ReportsState` pode adicionar dependência
   - **Alternativa**: Calcular dados localmente a partir de contas e transações
   - **Decisão**: Avaliar se `ReportsState` já tem dados necessários ou se precisa carregar

### Riscos Identificados

1. **Race Condition no Carregamento**:
   - **Risco**: Recursos podem ser carregados antes do orçamento estar selecionado
   - **Mitigação**: Usar `effect()` para garantir ordem correta, verificar `selectedBudgetId` antes de carregar

2. **Performance com Muitos Dados**:
   - **Risco**: Renderização lenta com muitas contas/participantes
   - **Mitigação**: Usar `OnPush` strategy, virtual scrolling se necessário (futuro)

3. **Dependência de BudgetSelectionService**:
   - **Risco**: Se orçamento não estiver selecionado, recursos não carregam
   - **Mitigação**: Garantir seleção de orçamento antes de carregar recursos

4. **Estilos CSS Faltantes**:
   - **Risco**: Layout pode quebrar se estilos não forem adicionados
   - **Mitigação**: Adicionar todos os estilos necessários, testar em diferentes tamanhos de tela

## 📋 Lista de Implementação

### Fase 1: Correção de Carregamento de Recursos
- [ ] Adicionar `effect()` para detectar quando orçamento está disponível
- [ ] Garantir que orçamento seja selecionado no `BudgetSelectionService`
- [ ] Chamar `loadResources()` quando orçamento estiver disponível
- [ ] Testar que recursos são carregados corretamente

### Fase 2: Implementação da Seção "Visão Geral"
- [ ] Importar `OsDashboardWidgetsComponent`
- [ ] Configurar widget `budget-summary` com dados do orçamento
- [ ] Integrar indicadores de saúde financeira (se disponíveis)
- [ ] Substituir placeholder por componente
- [ ] Testar renderização e dados exibidos

### Fase 3: Melhoria da Visualização de Participantes
- [ ] Importar `CollaborationDashboardComponent`
- [ ] Substituir contagem por componente completo
- [ ] Passar `budgetId` e `creatorId` como inputs
- [ ] Testar renderização e interações

### Fase 4: Melhoria do Layout de Contas
- [ ] Decidir: usar `os-account-card` ou adicionar estilos CSS
- [ ] Se usar `os-account-card`: Substituir lista por cards
- [ ] Se adicionar estilos: Criar estilos para todas as classes faltantes
- [ ] Adicionar estilos para estados (loading, empty, list)
- [ ] Garantir responsividade
- [ ] Testar em diferentes tamanhos de tela

### Fase 5: Estilos e Ajustes Finais
- [ ] Adicionar estilos faltantes no SCSS
- [ ] Melhorar espaçamento e hierarquia visual
- [ ] Garantir acessibilidade (ARIA labels, roles)
- [ ] Testar todos os estados e interações
- [ ] Validar responsividade

### Fase 6: UI Components e Layout
- [ ] Integrar `os-dashboard-widgets` na seção "Visão Geral"
- [ ] Integrar `collaboration-dashboard` na seção "Colaboração"
- [ ] Implementar `os-account-card` ou estilizar lista de contas
- [ ] Aplicar estilos responsivos (mobile, tablet, desktop)
- [ ] Validar acessibilidade (WCAG 2.1 AA)
- [ ] Testar interações e micro-animações

## 📚 Referências

- **Meta Specs**: `/home/danilo/workspace/projeto-orca-sonhos/orca-sonhos-meta-specs` (configurado em `ai.properties.md`)
- **Componentes**:
  - `os-dashboard-widgets`: `src/app/shared/ui-components/organisms/os-dashboard-widgets/`
  - `os-account-card`: `src/app/shared/ui-components/molecules/account-card/`
  - `collaboration-dashboard`: `src/app/features/budget/components/collaboration-dashboard/`
- **Serviços**:
  - `BudgetState`: `src/app/core/services/budget/budget.state.ts`
  - `AccountState`: `src/app/core/services/account/account-state/account.state.ts`
  - `SharingState`: `src/app/core/services/sharing/sharing.state.ts`
  - `ReportsState`: `src/app/features/reports/state/reports-state/reports.state.ts`
  - `BudgetSelectionService`: `src/app/core/services/budget-selection/budget-selection.service.ts`
- **Documentação Angular**: Usar `angular-cli MCP` para melhores práticas

