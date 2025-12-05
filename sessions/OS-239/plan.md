# Finalizar Implementação do Componente Budget Detail Page - Plano de Implementação

> **Instruções**: Mantenha este arquivo atualizado conforme o progresso. Marque tarefas como concluídas ✅, em progresso ⏰ ou não iniciadas ⏳.

## 📋 Resumo Executivo

Finalizar a implementação do componente `budget-detail.page.ts` substituindo placeholders por funcionalidades reais e melhorando o layout e a experiência do usuário. O plano divide o trabalho em 6 fases incrementais, cada uma completável em ~2 horas, permitindo desenvolvimento incremental e validação contínua.

## 🎯 Objetivos

- Substituir placeholder da seção "Visão Geral" por widgets de dashboard reais
- Corrigir carregamento de recursos (contas e participantes)
- Melhorar visualização de participantes usando componente `collaboration-dashboard`
- Melhorar layout da listagem de contas com estilos adequados ou componente `os-account-card`
- Garantir responsividade e acessibilidade (WCAG 2.1 AA)
- Validar todos os estados (loading, error, empty, success)

---

## 📅 FASE 1: Correção de Carregamento de Recursos [Status: ✅ Completada]

### 🎯 Objetivo

Garantir que recursos (contas e participantes) sejam carregados corretamente quando o orçamento estiver disponível, usando `effect()` para reatividade com signals e evitando race conditions.

### 📋 Tarefas

#### 1.1. Adicionar BudgetSelectionService [✅]

**Descrição**:

- Importar e injetar `BudgetSelectionService` no componente
- Adicionar computed property para `selectedBudgetId` do serviço

**Critério de Conclusão**:

- `BudgetSelectionService` injetado e disponível
- Computed property `selectedBudgetId` criada

**Código de Referência**:

- Ver `src/app/features/goals/pages/goals/goals.page.ts` (linhas 162-178) para exemplo de uso de `effect()` com `BudgetSelectionService`

#### 1.2. Garantir Seleção de Orçamento [✅]

**Descrição**:

- Modificar `ngOnInit()` para garantir que orçamento seja selecionado no `BudgetSelectionService`
- Usar `budgetState.selectBudget(id)` ou `budgetSelectionService.setSelectedBudget(budget)`
- Verificar se orçamento existe antes de selecionar

**Critério de Conclusão**:

- Orçamento é selecionado no `BudgetSelectionService` quando componente inicializa
- Funciona tanto quando orçamentos já estão carregados quanto quando precisam ser carregados

**Dependências**: Tarefa 1.1

**Implementação**: Adicionado effect no construtor que detecta quando orçamentos são carregados e seleciona automaticamente o orçamento da rota.

#### 1.3. Implementar Effect para Carregamento de Recursos [✅]

**Descrição**:

- Adicionar `effect()` no construtor para detectar quando `selectedBudgetId` está disponível
- Usar `untracked()` para evitar loops infinitos
- Chamar `loadResources()` quando orçamento estiver selecionado e ainda não carregado
- Verificar flag `resourcesLoaded` para evitar carregamentos duplicados

**Critério de Conclusão**:

- `effect()` detecta mudanças em `selectedBudgetId`
- `loadResources()` é chamado automaticamente quando orçamento está disponível
- Não há carregamentos duplicados

**Dependências**: Tarefas 1.1, 1.2

**Código de Referência**:

- Ver `src/app/features/goals/pages/goals/goals.page.ts` (linhas 162-178) para padrão de `effect()` com `untracked()`

**Implementação**: Effect implementado seguindo o padrão de `goals.page.ts`, usando `untracked()` para evitar loops e verificando flag `resourcesLoaded`.

#### 1.4. Melhorar Método loadResources [✅]

**Descrição**:

- Garantir que `loadResources()` verifica se orçamento está selecionado antes de carregar
- Adicionar verificação de `selectedBudgetId` do `BudgetSelectionService`
- Manter verificação de flag `resourcesLoaded`
- Melhorar tratamento de erros

**Critério de Conclusão**:

- Método verifica condições antes de carregar
- Tratamento de erros adequado
- Flag `resourcesLoaded` funciona corretamente

**Dependências**: Tarefa 1.3

**Implementação**: Método `loadResources()` agora verifica se `selectedBudgetId` corresponde ao ID passado antes de carregar recursos.

### 🧪 Critérios de Validação

- [x] Orçamento é selecionado no `BudgetSelectionService` ao inicializar componente
- [x] `effect()` detecta quando `selectedBudgetId` muda
- [x] `loadResources()` é chamado automaticamente quando orçamento está disponível
- [x] Contas são carregadas via `accountState.loadAccounts()`
- [x] Participantes são carregados via `sharingState.loadParticipants(id)`
- [x] Polling de participantes é iniciado via `sharingState.startPolling(id)`
- [x] Não há carregamentos duplicados (flag `resourcesLoaded` funciona)
- [x] Recursos são carregados mesmo quando orçamentos precisam ser carregados primeiro

### 📝 Comentários da Fase

**Implementação Realizada**:

1. **BudgetSelectionService adicionado**: Serviço injetado e computed property `selectedBudgetId` criada
2. **Effect para seleção de orçamento**: Adicionado effect que detecta quando orçamentos são carregados e seleciona automaticamente o orçamento da rota
3. **Effect para carregamento de recursos**: Implementado effect seguindo padrão de `goals.page.ts` que detecta mudanças em `selectedBudgetId` e chama `loadResources()` automaticamente
4. **Método loadResources melhorado**: Agora verifica se `selectedBudgetId` corresponde ao ID antes de carregar, evitando race conditions

**Decisões Técnicas**:

- Uso de dois effects separados: um para seleção de orçamento e outro para carregamento de recursos, seguindo o padrão de separação de responsabilidades
- Uso de `untracked()` para evitar loops infinitos nos effects
- Verificação de `selectedBudgetId` no método `loadResources()` para garantir que o orçamento correto está selecionado antes de carregar recursos

---

## 📅 FASE 2: Implementação da Seção "Visão Geral" [Status: ⏳]

### 🎯 Objetivo

Substituir placeholder da seção "Visão Geral" por componente `os-dashboard-widgets` com widget `budget-summary` exibindo resumo financeiro real do orçamento.

### 📋 Tarefas

#### 2.1. Importar OsDashboardWidgetsComponent [⏳]

**Descrição**:

- Adicionar import de `OsDashboardWidgetsComponent` no array de imports do componente
- Verificar se componente está disponível e acessível

**Critério de Conclusão**:

- `OsDashboardWidgetsComponent` importado e disponível no template

**Código de Referência**:

- Ver `src/app/shared/ui-components/organisms/os-dashboard-widgets/os-dashboard-widgets.component.ts`

#### 2.2. Criar Computed Property para Widgets [⏳]

**Descrição**:

- Criar computed property `dashboardWidgets()` que retorna array de widgets
- Configurar widget do tipo `budget-summary` com dados do orçamento
- Calcular ou obter: saldo total, receitas mensais, despesas mensais
- Considerar usar `ReportsState` se necessário para dados financeiros

**Critério de Conclusão**:

- Computed property retorna array de widgets configurado
- Widget `budget-summary` tem dados corretos do orçamento

**Dependências**: Tarefa 2.1

**Nota**: Avaliar se `ReportsState.loadReports()` é necessário ou se dados podem ser calculados localmente a partir de contas

#### 2.3. Substituir Placeholder no Template [⏳]

**Descrição**:

- Remover placeholder da seção "Visão Geral"
- Adicionar componente `<os-dashboard-widgets>` no template
- Passar `[widgets]="dashboardWidgets()"` como input
- Manter botão "Ver Transações" funcional

**Critério de Conclusão**:

- Placeholder removido
- `os-dashboard-widgets` renderizado com dados corretos
- Botão "Ver Transações" mantido e funcional

**Dependências**: Tarefas 2.1, 2.2

#### 2.4. Integrar Indicadores de Saúde Financeira (Opcional) [⏳]

**Descrição**:

- Se `ReportsState` tiver indicadores de saúde financeira disponíveis, integrar
- Adicionar widget adicional ou configurar widget existente
- Verificar disponibilidade de dados antes de exibir

**Critério de Conclusão**:

- Indicadores exibidos quando disponíveis
- Não quebra quando dados não estão disponíveis

**Dependências**: Tarefa 2.3

### 🔄 Dependências

- ✅ Fase 1 completada (recursos carregados)

### 🧪 Critérios de Validação

- [ ] `os-dashboard-widgets` é renderizado na seção "Visão Geral"
- [ ] Widget `budget-summary` exibe dados corretos (saldo total, receitas, despesas)
- [ ] Dados são atualizados quando orçamento muda
- [ ] Botão "Ver Transações" funciona corretamente
- [ ] Indicadores de saúde financeira são exibidos quando disponíveis
- [ ] Componente não quebra quando dados não estão disponíveis

### 📝 Comentários da Fase

_[Observações sobre decisões tomadas]_

---

## 📅 FASE 3: Melhoria da Visualização de Participantes [Status: ⏳]

### 🎯 Objetivo

Substituir apenas contagem de participantes por componente `collaboration-dashboard` completo, exibindo lista completa com nome, email e papel de cada participante.

### 📋 Tarefas

#### 3.1. Importar CollaborationDashboardComponent [⏳]

**Descrição**:

- Adicionar import de `CollaborationDashboardComponent` no array de imports
- Verificar caminho correto: `@features/budget/components/collaboration-dashboard/`

**Critério de Conclusão**:

- `CollaborationDashboardComponent` importado e disponível

**Código de Referência**:

- Ver `src/app/features/budget/components/collaboration-dashboard/collaboration-dashboard.component.ts`

#### 3.2. Criar Computed Property para CreatorId [⏳]

**Descrição**:

- Criar computed property `creatorId()` que retorna ID do criador do orçamento
- Pode usar `currentUser().id` ou buscar do objeto `budget()` se tiver informação
- Retornar `null` se não disponível

**Critério de Conclusão**:

- Computed property retorna ID do criador ou `null`

**Dependências**: Tarefa 3.1

#### 3.3. Substituir Contagem por Componente no Template [⏳]

**Descrição**:

- Remover seção que exibe apenas contagem de participantes
- Adicionar `<os-collaboration-dashboard>` no template
- Passar `[budgetId]="budgetId()"` e `[creatorId]="creatorId()"` como inputs
- Manter botão "Gerenciar Participantes" no header do card

**Critério de Conclusão**:

- Contagem removida
- `collaboration-dashboard` renderizado com lista completa
- Botão "Gerenciar Participantes" mantido e funcional

**Dependências**: Tarefas 3.1, 3.2

#### 3.4. Tratar Evento participantRemoved (Opcional) [⏳]

**Descrição**:

- Se `collaboration-dashboard` emitir evento `participantRemoved`, tratar
- Atualizar estado se necessário
- Verificar se há necessidade de recarregar dados

**Critério de Conclusão**:

- Evento tratado adequadamente (se aplicável)
- Estado atualizado quando participante é removido

**Dependências**: Tarefa 3.3

### 🔄 Dependências

- ✅ Fase 1 completada (participantes carregados)

### 🧪 Critérios de Validação

- [ ] `collaboration-dashboard` é renderizado na seção "Colaboração"
- [ ] Lista completa de participantes é exibida (nome, email, papel)
- [ ] Criador é identificado corretamente (badge "Criador")
- [ ] Botão "Gerenciar Participantes" abre modal corretamente
- [ ] Componente funciona quando não há participantes (empty state)
- [ ] Componente funciona durante loading

### 📝 Comentários da Fase

_[Observações sobre decisões tomadas]_

---

## 📅 FASE 4: Melhoria do Layout de Contas [Status: ⏳]

### 🎯 Objetivo

Melhorar visualização da listagem de contas, decidindo entre usar componente `os-account-card` (recomendado) ou adicionar estilos CSS para lista existente.

### 📋 Tarefas

#### 4.1. Decisão: os-account-card vs Estilos CSS [⏳]

**Descrição**:

- Avaliar se `os-account-card` atende às necessidades
- Verificar se componente tem todas as informações necessárias
- Decidir entre reutilização (os-account-card) ou customização (estilos CSS)

**Critério de Conclusão**:

- Decisão tomada e documentada
- Justificativa clara

**Recomendação**: Usar `os-account-card` para consistência visual

#### 4.2a. Opção A: Implementar os-account-card [⏳]

**Descrição**:

- Importar `AccountCardComponent` no array de imports
- Substituir lista simples por loop de `<os-account-card>`
- Passar `[account]="account"` para cada card
- Configurar `[actions]` se necessário (edit, delete)
- Manter estados de loading e empty

**Critério de Conclusão**:

- Lista substituída por cards
- Cards exibem informações corretas
- Estados de loading e empty mantidos

**Dependências**: Tarefa 4.1 (se escolhida opção A)

#### 4.2b. Opção B: Adicionar Estilos CSS [⏳]

**Descrição**:

- Adicionar estilos para todas as classes faltantes:
  - `.budget-detail-page__card-header`
  - `.budget-detail-page__accounts-list`
  - `.budget-detail-page__account-item`
  - `.budget-detail-page__account-info`
  - `.budget-detail-page__account-name`
  - `.budget-detail-page__account-type`
  - `.budget-detail-page__account-balance`
  - `.budget-detail-page__accounts-loading`
  - `.budget-detail-page__accounts-empty`
  - `.budget-detail-page__accounts-actions`
- Melhorar espaçamento e hierarquia visual
- Garantir responsividade

**Critério de Conclusão**:

- Todas as classes têm estilos definidos
- Layout visualmente melhorado
- Responsivo em diferentes tamanhos de tela

**Dependências**: Tarefa 4.1 (se escolhida opção B)

#### 4.3. Adicionar Estilos para Estados [⏳]

**Descrição**:

- Estilizar estado de loading (`.budget-detail-page__accounts-loading`)
- Estilizar estado vazio (`.budget-detail-page__accounts-empty`)
- Estilizar estado de lista (`.budget-detail-page__accounts-list`)
- Garantir consistência visual entre estados

**Critério de Conclusão**:

- Todos os estados têm estilos adequados
- Transições suaves entre estados

**Dependências**: Tarefa 4.2a ou 4.2b

#### 4.4. Garantir Responsividade [⏳]

**Descrição**:

- Testar layout em mobile (0-575px)
- Testar layout em tablet (576-991px)
- Testar layout em desktop (992px+)
- Ajustar estilos conforme necessário
- Garantir que cards/lista se adaptam corretamente

**Critério de Conclusão**:

- Layout responsivo em todos os breakpoints
- Sem scroll horizontal
- Touch targets >= 44px em mobile

**Dependências**: Tarefa 4.3

### 🔄 Dependências

- ✅ Fase 1 completada (contas carregadas)

### 🧪 Critérios de Validação

- [ ] Listagem de contas tem layout melhorado (cards ou lista estilizada)
- [ ] Informações são claras e legíveis (nome, tipo, saldo)
- [ ] Estados de loading, empty e list funcionam corretamente
- [ ] Layout é responsivo em mobile, tablet e desktop
- [ ] Botão "Criar Nova Conta" funciona
- [ ] Botão "Ver Todas as Contas" funciona

### 📝 Comentários da Fase

_[Observações sobre decisões tomadas]_

---

## 📅 FASE 5: Estilos e Ajustes Finais [Status: ⏳]

### 🎯 Objetivo

Adicionar todos os estilos CSS faltantes, melhorar espaçamento e hierarquia visual, garantir acessibilidade e validar responsividade completa.

### 📋 Tarefas

#### 5.1. Adicionar Estilos Faltantes no SCSS [⏳]

**Descrição**:

- Adicionar estilos para classes que ainda não têm:
  - `.budget-detail-page__card-header` (se não adicionado na Fase 4)
  - `.budget-detail-page__actions-section`
  - `.budget-detail-page__participants-loading`
  - `.budget-detail-page__participants-empty`
  - `.budget-detail-page__participants-info`
- Usar design tokens (`--os-*`) para consistência
- Seguir padrão BEM para nomenclatura

**Critério de Conclusão**:

- Todas as classes usadas no template têm estilos definidos
- Estilos usam design tokens do sistema

#### 5.2. Melhorar Espaçamento e Hierarquia Visual [⏳]

**Descrição**:

- Revisar espaçamento entre seções (gap entre cards)
- Revisar padding interno dos cards
- Garantir hierarquia visual clara (H1 → H2 → conteúdo)
- Melhorar contraste e legibilidade

**Critério de Conclusão**:

- Espaçamento consistente usando escala (8px, 12px, 16px, 20px, 24px)
- Hierarquia visual clara
- Contraste adequado (>= 4.5:1)

**Dependências**: Tarefa 5.1

#### 5.3. Garantir Acessibilidade (ARIA) [⏳]

**Descrição**:

- Revisar todos os elementos interativos e garantir `aria-label` adequados
- Verificar `role` attributes em listas e seções
- Garantir `aria-live` em estados de loading
- Verificar navegação por teclado (Tab order)

**Critério de Conclusão**:

- Todos os elementos interativos têm `aria-label`
- Listas têm `role="list"` e `aria-label`
- Estados de loading têm `aria-live="polite"`
- Navegação por teclado funciona corretamente

**Dependências**: Tarefa 5.2

#### 5.4. Validar Responsividade Completa [⏳]

**Descrição**:

- Testar em mobile (0-575px): stack vertical, touch targets >= 44px
- Testar em tablet (576-991px): grid 2 colunas onde aplicável
- Testar em desktop (992px+): grid 3 colunas, hover states
- Verificar que não há scroll horizontal
- Testar zoom até 200%

**Critério de Conclusão**:

- Layout funciona corretamente em todos os breakpoints
- Sem scroll horizontal
- Touch targets adequados em mobile
- Hover states funcionam em desktop

**Dependências**: Tarefa 5.3

### 🔄 Dependências

- ✅ Fase 4 completada

### 🧪 Critérios de Validação

- [ ] Todos os estilos faltantes foram adicionados
- [ ] Espaçamento é consistente e usa design tokens
- [ ] Hierarquia visual é clara
- [ ] Acessibilidade WCAG 2.1 AA compliant
- [ ] Responsividade funciona em todos os breakpoints
- [ ] Sem scroll horizontal em nenhuma resolução
- [ ] Touch targets >= 44px em mobile

### 📝 Comentários da Fase

_[Observações sobre decisões tomadas]_

---

## 📅 FASE 6: Testes e Validação Final [Status: ⏳]

### 🎯 Objetivo

Validar que todas as funcionalidades estão funcionando corretamente, todos os estados são tratados adequadamente e o componente está pronto para PR.

### 📋 Tarefas

#### 6.1. Testar Fluxo Completo de Carregamento [⏳]

**Descrição**:

- Testar navegação para página de detalhes
- Verificar que orçamento é carregado corretamente
- Verificar que recursos (contas e participantes) são carregados
- Verificar que todos os dados são exibidos corretamente

**Critério de Conclusão**:

- Fluxo completo funciona sem erros
- Todos os dados são exibidos corretamente

#### 6.2. Testar Todos os Estados [⏳]

**Descrição**:

- Testar estado de loading (skeletons exibidos)
- Testar estado de error (mensagem de erro exibida)
- Testar estado vazio (sem contas, sem participantes)
- Testar estado success (dados exibidos)

**Critério de Conclusão**:

- Todos os estados são tratados adequadamente
- Mensagens são claras e acionáveis

**Dependências**: Tarefa 6.1

#### 6.3. Testar Interações e Navegação [⏳]

**Descrição**:

- Testar botão "Ver Transações" (navegação)
- Testar botão "Criar Nova Conta" (navegação)
- Testar botão "Ver Todas as Contas" (navegação)
- Testar botão "Gerenciar Participantes" (abre modal)
- Testar botões "Editar" e "Excluir" no header

**Critério de Conclusão**:

- Todas as interações funcionam corretamente
- Navegação funciona como esperado
- Modais abrem e fecham corretamente

**Dependências**: Tarefa 6.2

#### 6.4. Validar Acessibilidade Completa [⏳]

**Descrição**:

- Testar navegação por teclado (Tab, Enter, Space, Esc)
- Verificar contraste de cores (>= 4.5:1)
- Testar com screen reader (se possível)
- Verificar que todos os elementos têm labels adequados

**Critério de Conclusão**:

- Navegação por teclado funciona completamente
- Contraste adequado
- Screen reader friendly

**Dependências**: Tarefa 6.3

#### 6.5. Atualizar Testes Unitários (Se Necessário) [⏳]

**Descrição**:

- Revisar testes existentes em `budget-detail.page.spec.ts`
- Atualizar testes que podem ter quebrado
- Adicionar testes para novas funcionalidades (se necessário)
- Garantir que todos os testes passam

**Critério de Conclusão**:

- Testes atualizados e passando
- Cobertura adequada das novas funcionalidades

**Dependências**: Tarefa 6.4

### 🔄 Dependências

- ✅ Todas as fases anteriores completadas

### 🧪 Critérios de Validação

- [ ] Fluxo completo de carregamento funciona
- [ ] Todos os estados (loading, error, empty, success) são tratados
- [ ] Todas as interações e navegações funcionam
- [ ] Acessibilidade WCAG 2.1 AA compliant
- [ ] Testes unitários passam
- [ ] Componente está pronto para PR

### 🏁 Entrega Final

- [ ] Todos os testes passando
- [ ] Documentação atualizada (se necessário)
- [ ] Código revisado e limpo
- [ ] Pronto para PR

### 📝 Comentários da Fase

_[Observações sobre decisões tomadas]_

---

## 📊 Rastreabilidade com Requisitos

### Requisitos Funcionais Atendidos

- ✅ **RF1 - Seção "Visão Geral"**: Fase 2
- ✅ **RF2 - Carregamento de Recursos**: Fase 1
- ✅ **RF3 - Visualização de Participantes**: Fase 3
- ✅ **RF4 - Layout de Contas**: Fase 4

### Critérios de Aceitação Atendidos

- ✅ Seção "Visão Geral" exibe dados reais: Fase 2
- ✅ Widgets de dashboard integrados: Fase 2
- ✅ Método `loadResources()` chamado: Fase 1
- ✅ Contas carregadas e exibidas: Fase 1, 4
- ✅ Participantes carregados e exibidos: Fase 1, 3
- ✅ Layout de contas com estilos adequados: Fase 4
- ✅ Estados tratados adequadamente: Fase 5, 6
- ✅ Navegação e ações funcionam: Fase 6
- ✅ Acessibilidade implementada: Fase 5, 6
- ✅ Responsividade validada: Fase 4, 5, 6

## 🔗 Referências

- **Context**: `sessions/OS-239/context.md`
- **Architecture**: `sessions/OS-239/architecture.md`
- **Layout Specification**: `sessions/OS-239/layout-specification.md`
- **Componente Atual**: `src/app/features/budget/pages/budget-detail/budget-detail.page.ts`
- **Exemplos de Effect**: `src/app/features/goals/pages/goals/goals.page.ts` (linhas 162-178)
