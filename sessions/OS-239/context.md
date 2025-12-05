# Finalizar Implementação do Componente Budget Detail Page - Contexto de Desenvolvimento

# OS-239

## 🎯 Objetivo

Finalizar a implementação do componente `budget-detail.page.ts`, substituindo placeholders por funcionalidades reais e melhorando o layout e a experiência do usuário. O componente atualmente possui uma estrutura básica, mas falta implementação de várias seções e melhorias visuais.

**Localização:** `src/app/features/budget/pages/budget-detail/budget-detail.page.ts`

## 📋 Requisitos Funcionais

### Funcionalidades Principais

1. **Seção "Visão Geral"**: Substituir placeholder por dados reais do orçamento
   - Exibir resumo financeiro (saldo total, receitas mensais, despesas mensais)
   - Integrar com widgets de dashboard existentes (`os-dashboard-widgets`)
   - Mostrar indicadores de saúde financeira quando disponíveis
   - Manter botão "Ver Transações" funcional

2. **Corrigir Carregamento de Recursos**: Garantir que recursos sejam carregados corretamente
   - Chamar método `loadResources()` quando o orçamento for carregado com sucesso
   - Garantir que contas sejam carregadas via `accountState.loadAccounts()`
   - Garantir que participantes sejam carregados via `sharingState.loadParticipants(id)`
   - Iniciar polling de participantes quando necessário
   - Evitar carregamentos duplicados (verificar flag `resourcesLoaded`)

3. **Melhorar Visualização de Participantes**: Substituir apenas contagem por lista completa
   - Exibir informações básicas: nome, email, papel (criador/participante)
   - Considerar reutilizar componente `collaboration-dashboard` existente
   - Manter funcionalidade de gerenciar participantes via modal

4. **Melhorar Layout da Listagem de Contas**: Adicionar estilos CSS adequados
   - Estilos para classes: `account-item`, `accounts-list`, `account-info`, `account-name`, `account-type`, `account-balance`
   - Melhorar espaçamento e hierarquia visual
   - Considerar usar componente `os-account-card` existente para consistência
   - Adicionar estilos para estados: loading, empty, list
   - Garantir responsividade em diferentes tamanhos de tela
   - Adicionar estilos para `card-header` e `accounts-actions`
   - Melhorar legibilidade e organização visual

### Comportamentos Esperados

- **Estado de Carregamento**: Exibir skeletons/loading states apropriados durante carregamento
- **Estado Vazio**: Mensagens claras quando não há dados (contas, participantes)
- **Navegação**: Botões de navegação funcionais (Ver Transações, Criar Conta, etc.)
- **Responsividade**: Layout adaptável para mobile, tablet e desktop
- **Acessibilidade**: ARIA labels e roles apropriados em todos os elementos interativos

## 🏗️ Considerações Técnicas

### Arquitetura

O componente segue o padrão **Clean Architecture** do projeto:
- **Presentation Layer**: Componente Angular standalone
- **State Management**: Uso de signals e serviços de estado (`BudgetState`, `AccountState`, `SharingState`, `ReportsState`)
- **Componentes Reutilizáveis**: Integração com componentes existentes do design system

### Tecnologias e Dependências

- **Angular 20+**: Standalone components, signals, computed properties
- **Angular Material**: Para componentes de UI (se necessário)
- **Componentes Existentes**:
  - `os-dashboard-widgets`: Widgets de dashboard com resumo financeiro
  - `os-account-card`: Componente de card de conta com layout profissional
  - `collaboration-dashboard`: Componente para exibir lista de participantes
- **Serviços de Estado**:
  - `BudgetState`: Gerencia estado dos orçamentos
  - `AccountState`: Gerencia estado das contas (método `accountsByBudgetId()`)
  - `SharingState`: Gerencia participantes e compartilhamento
  - `ReportsState`: Pode fornecer dados de relatórios financeiros

### Padrões a Seguir

- **Change Detection**: `OnPush` strategy
- **Signals**: Uso de signals para estado reativo
- **Computed Properties**: Para valores derivados
- **Error Handling**: Tratamento de erros com mensagens apropriadas
- **Loading States**: Estados de carregamento claros e informativos
- **Acessibilidade**: ARIA labels, roles e navegação por teclado

## 🧪 Estratégia de Testes

### Testes Necessários

- **Testes Unitários**: 
  - Verificar carregamento de recursos quando orçamento é selecionado
  - Validar chamadas corretas aos serviços de estado
  - Testar estados de loading, error e success
  - Validar navegação e ações do usuário

- **Testes de Integração**:
  - Integração com `os-dashboard-widgets`
  - Integração com `os-account-card`
  - Integração com `collaboration-dashboard`
  - Validação de fluxo completo de carregamento

### Critérios de Aceitação

- [ ] Seção "Visão Geral" exibe dados reais do orçamento
- [ ] Widgets de dashboard são integrados corretamente
- [ ] Método `loadResources()` é chamado quando orçamento é carregado
- [ ] Contas são carregadas e exibidas corretamente
- [ ] Participantes são carregados e exibidos em lista completa
- [ ] Layout de contas possui estilos adequados e responsivos
- [ ] Todos os estados (loading, empty, error) são tratados adequadamente
- [ ] Navegação e ações funcionam corretamente
- [ ] Acessibilidade está implementada (ARIA labels, roles)
- [ ] Componente é responsivo em diferentes tamanhos de tela

## 🔗 Dependências e Impactos

### Sistemas Afetados

- **Budget Detail Page**: Componente principal sendo modificado
- **AccountState**: Usado para carregar e exibir contas
- **SharingState**: Usado para carregar e exibir participantes
- **ReportsState**: Potencialmente usado para dados financeiros
- **BudgetSelectionService**: Usado para selecionar orçamento atual

### Integrações Necessárias

- **os-dashboard-widgets**: Integração para exibir resumo financeiro
- **os-account-card**: Opcional, para melhorar visualização de contas
- **collaboration-dashboard**: Integração para exibir lista de participantes
- **APIs de Backend**: Já disponíveis via serviços de estado

## 🚧 Restrições e Considerações

### Limitações Técnicas

- **AccountState.accountsByBudgetId()**: Retorna contas baseado no `selectedBudgetId` do `BudgetSelectionService`
- **Necessidade de Selecionar Orçamento**: Antes de carregar recursos, o orçamento deve ser selecionado no `BudgetSelectionService`
- **Polling de Participantes**: Deve ser iniciado e parado corretamente no ciclo de vida do componente

### Riscos

- **Carregamento Duplicado**: Flag `resourcesLoaded` deve prevenir carregamentos múltiplos
- **Sincronização de Estado**: Garantir que orçamento seja selecionado antes de carregar recursos
- **Performance**: Evitar re-renderizações desnecessárias com `OnPush` strategy

### Problemas Identificados

1. **Método `loadResources()` não está sendo chamado**: Existe mas não é invocado em `ngOnInit()` ou quando orçamento é carregado
2. **Classes CSS faltantes**: Várias classes usadas no template não têm estilos definidos no SCSS
3. **Seleção de Orçamento**: Necessário garantir que orçamento seja selecionado no `BudgetSelectionService` antes de carregar recursos

## 📚 Referências

- **Issue Jira**: OS-239
- **Componente Atual**: `src/app/features/budget/pages/budget-detail/budget-detail.page.ts`
- **Componentes Disponíveis**:
  - `os-dashboard-widgets`: `src/app/shared/ui-components/organisms/os-dashboard-widgets/`
  - `os-account-card`: `src/app/shared/ui-components/molecules/account-card/`
  - `collaboration-dashboard`: `src/app/features/budget/components/collaboration-dashboard/`
- **Serviços de Estado**:
  - `BudgetState`: `src/app/core/services/budget/budget.state.ts`
  - `AccountState`: `src/app/core/services/account/account-state/account.state.ts`
  - `SharingState`: `src/app/core/services/sharing/sharing.state.ts`
  - `ReportsState`: `src/app/features/reports/state/reports-state/reports.state.ts`

