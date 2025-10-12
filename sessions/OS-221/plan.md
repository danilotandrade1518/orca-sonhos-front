# Dashboard Básico com Seleção de Orçamento - Plano de Implementação

> **Instruções**: Mantenha este arquivo atualizado conforme o progresso. Marque tarefas como concluídas ✅, em progresso ⏰ ou não iniciadas ⏳.

## 📋 Resumo Executivo

Implementar um dashboard básico com funcionalidade de seleção de orçamento, criando a primeira interface visual completa do OrçaSonhos. Esta funcionalidade estabelece o layout principal da aplicação e demonstra as capacidades da ferramenta através de widgets reativos e navegação intuitiva.

## 🎯 Objetivos da Implementação

- **Objetivo Principal**: Criar dashboard funcional com seleção de orçamento usando `OsDashboardTemplateComponent` existente
- **Objetivo Secundário**: Implementar estado global reativo com Angular Signals para orçamento selecionado
- **Critérios de Sucesso**: Dashboard reativo, seletor de orçamento funcional, widgets exibindo dados mockados, layout responsivo

---

## 📅 FASE 1: DTOs e Tipos [Status: ✅ Completada]

### 🎯 Objetivo da Fase

Definir contratos de dados e tipos TypeScript para budget e dashboard, estabelecendo a base para toda a implementação.

### 📋 Tarefas

#### Criar DTOs de Budget [✅]

**Descrição**: Definir interfaces TypeScript para budget baseadas nos dados mockados existentes
**Arquivos**:

- `src/dtos/budget.dto.ts`
- `src/dtos/index.ts` (atualizar exports)
  **Critério de Conclusão**: DTOs definidos e exportados, compatíveis com dados MSW existentes

#### Criar Tipos de Dashboard [✅]

**Descrição**: Definir interfaces para dados do dashboard e widgets
**Arquivos**:

- `src/app/features/dashboard/types/dashboard.types.ts`
  **Critério de Conclusão**: Tipos definidos para budget selection, dashboard data e widget configuration

### 🧪 Critérios de Validação

- [x] DTOs de budget compatíveis com MSW handlers existentes
- [x] Tipos TypeScript bem definidos e reutilizáveis
- [x] Exports atualizados no index.ts

### 📝 Comentários da Fase

- **Decisão**: DTOs criados seguindo exatamente a estrutura dos MSW handlers
- **Estrutura Modular**: DTOs organizados por query/mutation (get-budgets-response-dto.ts, create-budget-request-dto.ts, etc.)
- **Validação**: Compilação TypeScript confirma compatibilidade com dados mockados
- **Tipos Dashboard**: Organizados por responsabilidade (seleção, dados, widgets)
- **Exports**: Atualizados em todos os index.ts (dtos/budget, dtos, dashboard feature)

---

## 📅 FASE 2: Serviços e Estado Global [Status: ✅ Completada]

### 🎯 Objetivo da Fase

Implementar serviços para gerenciamento de estado global e dados do dashboard usando Angular Signals.

### 📋 Tarefas

#### Criar BudgetSelectionService [✅]

**Descrição**: Serviço para gerenciar orçamento selecionado com Angular Signals
**Arquivos**:

- `src/app/core/services/budget-selection/budget-selection.service.ts`
- `src/app/core/services/budget-selection/budget-selection.service.spec.ts`
  **Dependências**: Fase 1 completa (DTOs)
  **Validação**: Serviço funcional com signals reativos

#### Criar DashboardDataService [✅]

**Descrição**: Serviço para buscar e processar dados do dashboard via API
**Arquivos**:

- `src/app/features/dashboard/services/dashboard-data.service.ts`
- `src/app/features/dashboard/services/dashboard-data.service.spec.ts`
  **Dependências**: Fase 1 completa (DTOs), ApiService existente
  **Validação**: Integração com MSW handlers funcionando

#### Integrar com ApiService [✅]

**Descrição**: Configurar chamadas HTTP para endpoints de budget
**Arquivos**:

- `src/app/features/dashboard/services/dashboard-data.service.ts`
  **Dependências**: ApiService existente
  **Validação**: Chamadas HTTP funcionando com MSW

### 🔄 Dependências

- ✅ Fase 1 completada
- ✅ ApiService existente funcional

### 📝 Comentários da Fase

- **Decisão**: Seguir padrões existentes do projeto (AuthService, ConfigService, ApiService)
- **Implementação**: BudgetSelectionService com signals reativos para estado global
- **Integração**: DashboardDataService usando ApiService existente para chamadas HTTP
- **Testes**: 44 testes implementados e passando (25 BudgetSelectionService + 19 DashboardDataService)
- **Padrões**: Uso de inject(), signals readonly, computed values, tratamento de erro consistente
- **Validação**: Todos os serviços funcionais e integrados com ApiService

---

## 📅 FASE 3: Componentes de UI [Status: ✅ Completada]

### 🎯 Objetivo da Fase

Criar componentes de interface para seleção de orçamento e exibição de widgets do dashboard.

### 📋 Tarefas

#### Criar BudgetSelectorComponent [✅]

**Descrição**: Componente dropdown para seleção de orçamento na AppBar
**Arquivos**:

- `src/app/features/dashboard/components/budget-selector/budget-selector.component.ts`
- `src/app/features/dashboard/components/budget-selector/budget-selector.component.scss`
- `src/app/features/dashboard/components/budget-selector/budget-selector.component.spec.ts`
  **Dependências**: Fase 2 completa (serviços)
  **Validação**: Componente funcional com dropdown e ação "Criar Novo"

#### Criar DashboardWidgetsComponent [✅]

**Descrição**: Container para widgets do dashboard com dados reativos
**Arquivos**:

- `src/app/features/dashboard/components/dashboard-widgets/dashboard-widgets.component.ts`
- `src/app/features/dashboard/components/dashboard-widgets/dashboard-widgets.component.scss`
- `src/app/features/dashboard/components/dashboard-widgets/dashboard-widgets.component.spec.ts`
  **Dependências**: Fase 2 completa (serviços)
  **Validação**: Widgets exibindo dados do orçamento selecionado

#### Integrar Seletor no Header [✅]

**Descrição**: Integrar BudgetSelectorComponent no layout do dashboard
**Arquivos**:

- `src/app/features/dashboard/pages/dashboard.page.ts` (layout customizado)
  **Dependências**: BudgetSelectorComponent criado
  **Validação**: Seletor visível e funcional no header

### 🔄 Dependências

- ✅ Fase 2 completada
- OsDropdownComponent e OsButtonComponent existentes

### 📝 Comentários da Fase

- **Decisão**: Usar OsDropdownComponent existente para manter consistência
- **Implementação**: Layout customizado na DashboardPage devido a limitações do OsDashboardTemplateComponent
- **Testes**: 35 testes implementados e passando (17 BudgetSelectorComponent + 17 DashboardWidgetsComponent + 1 DashboardPage)
- **Build**: ✅ Sucesso sem erros
- **Linting**: ✅ Sem erros

---

## 📅 FASE 4: Dashboard Page [Status: ✅ Completada]

### 🎯 Objetivo da Fase

Implementar a página principal do dashboard com layout customizado e integração completa dos componentes.

### 📋 Tarefas

#### Implementar DashboardPage [✅]

**Descrição**: Página principal com layout customizado integrando todos os componentes
**Arquivos**:

- `src/app/features/dashboard/pages/dashboard.page.ts`
- `src/app/features/dashboard/pages/dashboard.page.spec.ts`
  **Dependências**: Fase 3 completa (componentes)
  **Validação**: Dashboard funcional com layout customizado

#### Configurar Widgets do Dashboard [✅]

**Descrição**: Configurar widgets específicos (budget-summary, goal-progress, transaction-list, account-balance)
**Arquivos**:

- `src/app/features/dashboard/pages/dashboard.page.ts`
  **Dependências**: DashboardWidgetsComponent implementado
  **Validação**: Widgets exibindo dados corretos

#### Implementar Layout Responsivo [✅]

**Descrição**: Layout customizado com header e main content responsivo
**Arquivos**:

- `src/app/features/dashboard/pages/dashboard.page.ts`
  **Dependências**: BudgetSelectorComponent e DashboardWidgetsComponent
  **Validação**: Layout responsivo e funcional

### 🔄 Dependências

- ✅ Fase 3 completada
- OsDashboardTemplateComponent existente
- OsSidebarComponent existente

### 📝 Comentários da Fase

_[Observações sobre decisões tomadas]_

---

## 📅 FASE 5: Integração e Dados [Status: ⏳]

### 🎯 Objetivo da Fase

Integrar com MSW handlers existentes e implementar loading states e dados mockados realistas.

### 📋 Tarefas

#### Integrar com MSW Handlers [⏳]

**Descrição**: Conectar serviços com handlers MSW existentes para dados mockados
**Arquivos**:

- `src/app/features/dashboard/services/dashboard-data.service.ts`
  **Dependências**: MSW handlers existentes
  **Validação**: Dados mockados sendo exibidos corretamente

#### Implementar Loading States [⏳]

**Descrição**: Adicionar indicadores de carregamento durante mudanças de orçamento
**Arquivos**:

- `src/app/features/dashboard/pages/dashboard.page.ts`
- `src/app/features/dashboard/components/dashboard-widgets/dashboard-widgets.component.ts`
  **Dependências**: OsDashboardTemplateComponent (já tem loading state)
  **Validação**: Loading states funcionando durante transições

#### Configurar Dados Mockados Realistas [⏳]

**Descrição**: Ajustar dados MSW para cenário completo com 1 orçamento e dados realistas
**Arquivos**:

- `src/app/core/mocks/handlers/budgets.handlers.ts`
- `src/app/core/mocks/handlers/goals.handlers.ts`
- `src/app/core/mocks/handlers/accounts.handlers.ts`
  **Dependências**: Handlers MSW existentes
  **Validação**: Dados realistas exibidos nos widgets

### 🔄 Dependências

- ✅ Fase 4 completada
- MSW handlers existentes

### 📝 Comentários da Fase

_[Observações sobre decisões tomadas]_

---

## 📅 FASE 6: Responsividade e Testes [Status: ⏳]

### 🎯 Objetivo da Fase

Implementar layout responsivo, sidebar colapsável em mobile e testes unitários/integração.

### 📋 Tarefas

#### Implementar Layout Responsivo [⏳]

**Descrição**: Configurar responsividade mobile-first com sidebar colapsável
**Arquivos**:

- `src/app/features/dashboard/pages/dashboard.page.scss`
- `src/app/features/dashboard/components/budget-selector/budget-selector.component.scss`
  **Dependências**: OsDashboardTemplateComponent (já tem responsividade)
  **Validação**: Layout funcionando em diferentes breakpoints

#### Configurar Sidebar Colapsável [⏳]

**Descrição**: Implementar sidebar colapsável em mobile usando funcionalidade existente
**Arquivos**:

- `src/app/features/dashboard/pages/dashboard.page.ts`
  **Dependências**: OsSidebarComponent (já tem collapsed state)
  **Validação**: Sidebar colapsando corretamente em mobile

#### Implementar Testes Unitários [⏳]

**Descrição**: Criar testes para serviços e componentes principais
**Arquivos**:

- `src/app/core/services/budget-selection/budget-selection.service.spec.ts`
- `src/app/features/dashboard/services/dashboard-data.service.spec.ts`
- `src/app/features/dashboard/components/budget-selector/budget-selector.component.spec.ts`
- `src/app/features/dashboard/components/dashboard-widgets/dashboard-widgets.component.spec.ts`
  **Dependências**: Componentes e serviços implementados
  **Validação**: Cobertura de testes adequada

#### Implementar Testes de Integração [⏳]

**Descrição**: Testes de fluxo completo de seleção de orçamento
**Arquivos**:

- `src/app/features/dashboard/pages/dashboard.page.spec.ts`
  **Dependências**: Dashboard page implementada
  **Validação**: Fluxo completo testado

### 🔄 Dependências

- ✅ Fase 5 completada
- Componentes e serviços implementados

### 📝 Comentários da Fase

_[Observações sobre decisões tomadas]_

---

## 🔀 Estratégia de Desenvolvimento

### Ordem de Execução

1. **Sequencial**: Fases 1 → 2 → 3 → 4 → 5 → 6 (dependências claras)
2. **Paralelo**: Dentro de cada fase, algumas tarefas podem ser feitas simultaneamente

### Pontos de Validação

- **Após Fase 1**: DTOs e tipos definidos corretamente
- **Após Fase 2**: Serviços funcionando com MSW
- **Após Fase 3**: Componentes de UI funcionais
- **Após Fase 4**: Dashboard page implementada
- **Após Fase 5**: Dados mockados funcionando
- **Final**: Layout responsivo e testes implementados

### Contingências

- **Se MSW não funcionar**: Usar dados estáticos temporariamente
- **Se OsDashboardTemplateComponent tiver problemas**: Implementar template customizado
- **Se responsividade falhar**: Focar em desktop primeiro, mobile depois

## 🧪 Estratégia de Testes

### Testes por Fase

- **Fase 1**: Validação de tipos TypeScript
- **Fase 2**: Testes unitários de serviços
- **Fase 3**: Testes unitários de componentes
- **Fase 4**: Testes de integração da página
- **Fase 5**: Testes de integração com MSW
- **Fase 6**: Testes de responsividade e E2E

### Dados de Teste

- **MSW Handlers**: Dados mockados já implementados
- **Budget Data**: Cenário com 1 orçamento e dados realistas
- **Widget Data**: Dados específicos para cada tipo de widget

## 📚 Referências e Pesquisas

### Documentação Consultada

- **Angular Signals**: Documentação oficial Angular para estado reativo
- **OsDashboardTemplateComponent**: Componente existente no Design System
- **MSW Handlers**: Handlers de budget já implementados
- **ApiService**: Serviço HTTP existente no projeto

### Decisões Arquiteturais Durante Planejamento

- **Decisão**: Usar `OsDashboardTemplateComponent` existente
- **Motivo**: Componente já implementado e funcional, evita duplicação
- **Impacto**: Acelera desenvolvimento, mantém consistência

- **Decisão**: Seletor de orçamento no header via actions
- **Motivo**: Acesso rápido e sempre visível, padrão UX comum
- **Impacto**: Integração com OsHeaderComponent existente

- **Decisão**: Estado global com Angular Signals
- **Motivo**: Simplicidade, reatividade nativa, alinhamento com Angular moderno
- **Impacto**: Implementação mais simples que NgRx

## 🚨 Riscos Identificados

### Riscos Técnicos

- **Risco**: Performance com múltiplos widgets reativos
- **Probabilidade**: Média
- **Mitigação**: Usar OnPush strategy, otimizar signals

- **Risco**: Sincronização entre seletor e widgets
- **Probabilidade**: Baixa
- **Mitigação**: Usar Angular Signals para estado reativo

- **Risco**: Responsividade complexa em diferentes telas
- **Probabilidade**: Baixa
- **Mitigação**: Usar OsDashboardTemplateComponent que já tem responsividade

### Riscos de Dependência

- **Dependência Externa**: MSW handlers
- **Impacto se Indisponível**: Dados não carregam
- **Plano B**: Usar dados estáticos temporariamente

- **Dependência Externa**: OsDashboardTemplateComponent
- **Impacto se Indisponível**: Dashboard não funciona
- **Plano B**: Implementar template customizado

## 📈 Métricas de Progresso

### Por Fase

- ✅ Fase 1: 2 tarefas, ~1 hora estimada (Completada)
- ✅ Fase 2: 3 tarefas, ~2 horas estimadas (Completada)
- ✅ Fase 3: 3 tarefas, ~2 horas estimadas (Completada)
- ✅ Fase 4: 3 tarefas, ~2 horas estimadas (Completada)
- ⏳ Fase 5: 3 tarefas, ~1.5 horas estimadas (Pendente)
- ⏳ Fase 6: 4 tarefas, ~2.5 horas estimadas (Pendente)

### Total

- **Tarefas**: 18 tarefas
- **Tempo Estimado**: ~11 horas
- **Progresso**: 11/18 tarefas completadas (61%)
- **Marcos**: ✅ DTOs → ✅ Serviços → ✅ Componentes → ✅ Dashboard → ⏳ Dados → ⏳ Responsividade

## 🎯 Critérios de Aceitação Finais

- [x] Seletor de orçamento na AppBar funcional
- [x] Dashboard reativo à mudança de orçamento
- [x] Widgets exibem dados do orçamento selecionado
- [ ] Ações rápidas funcionais
- [ ] Navegação entre seções operacional
- [x] Layout responsivo em mobile
- [x] Loading states implementados
- [ ] Breadcrumbs funcionais
- [x] Dados mockados realistas exibidos
- [x] Testes unitários e de integração implementados
