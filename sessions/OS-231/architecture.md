# Compartilhamento Familiar - Colaboração - Arquitetura Técnica

## 🏗️ Visão Geral da Implementação

### Estado Atual

- **BudgetService**: Existe e possui métodos básicos (getBudgets, getBudgetOverview, createBudget, updateBudget, deleteBudget)
- **BudgetState**: Gerencia estado de orçamentos com signals
- **BudgetParticipantDto**: Já definido em `src/dtos/budget/budget-types.ts`
- **Endpoints Backend**: `/api/budget/add-participant` e `/api/budget/remove-participant` já existem e estão mockados
- **BudgetDetailPage**: Página de detalhes do orçamento, mas não possui seção de participantes
- **Componentes de UI**: OsModal, OsModalTemplate, OsSearchBox, OsButton, OsCard disponíveis
- **Sincronização**: Não existe mecanismo de sincronização em tempo real implementado

### Mudanças Propostas

- **Novos DTOs**: Criar DTOs específicos para compartilhamento (AddParticipantRequestDto, RemoveParticipantRequestDto, SearchUserRequestDto, SearchUserResponseDto)
- **SharingService**: Novo serviço para gerenciar operações de compartilhamento
- **SharingState**: Novo estado com signals para gerenciar participantes e operações de compartilhamento
- **Novos Componentes**:
  - `ShareBudgetComponent`: Modal para adicionar participantes
  - `UserInviteComponent`: Componente de busca e seleção de usuários
  - `CollaborationDashboardComponent`: Visualização de participantes do orçamento
- **Extensões**: Estender BudgetService com métodos de compartilhamento ou criar SharingService separado
- **Integração**: Adicionar seção de compartilhamento na BudgetDetailPage
- **Sincronização**: Implementar polling inicial para sincronização (considerar WebSocket futuro)

### Impactos

- **BudgetDetailPage**: Adicionar seção de colaboração com botão para gerenciar participantes
- **BudgetState**: Atualizar quando participantes são adicionados/removidos
- **BudgetService**: Potencialmente estender ou criar SharingService separado
- **Rotas**: Adicionar rota `/budgets/:id/sharing` (opcional, pode ser modal)
- **MSW Handlers**: Adicionar handlers para busca de usuários

## 🔧 Componentes e Estrutura

### Arquivos Principais a Modificar

- `src/app/features/budget/pages/budget-detail/budget-detail.page.ts`: Adicionar seção de colaboração e botão para gerenciar participantes
- `src/app/core/services/budget/budget.service.ts`: Adicionar métodos `addParticipant()` e `removeParticipant()` OU criar SharingService separado
- `src/app/core/services/budget/budget.state.ts`: Adicionar métodos para atualizar participantes quando mudanças ocorrem
- `src/app/core/mocks/handlers/budgets.handlers.ts`: Adicionar handler para busca de usuários

### Novos Arquivos a Criar

#### DTOs (`src/dtos/budget/`)

- `add-participant-request-dto.ts`: Request para adicionar participante
- `add-participant-response-dto.ts`: Response da adição de participante
- `remove-participant-request-dto.ts`: Request para remover participante
- `remove-participant-response-dto.ts`: Response da remoção de participante
- `search-user-request-dto.ts`: Request para buscar usuários
- `search-user-response-dto.ts`: Response da busca de usuários

#### Serviços (`src/app/core/services/sharing/`)

- `sharing.service.ts`: Serviço para operações de compartilhamento
- `sharing.state.ts`: Estado com signals para gerenciar participantes
- `sharing.service.spec.ts`: Testes unitários
- `sharing.state.spec.ts`: Testes unitários

#### Componentes (`src/app/features/budget/components/`)

- `share-budget/share-budget.component.ts`: Modal para adicionar participantes
- `share-budget/share-budget.component.scss`: Estilos
- `share-budget/share-budget.component.spec.ts`: Testes
- `user-invite/user-invite.component.ts`: Componente de busca e seleção de usuários
- `user-invite/user-invite.component.scss`: Estilos
- `user-invite/user-invite.component.spec.ts`: Testes
- `collaboration-dashboard/collaboration-dashboard.component.ts`: Dashboard de participantes
- `collaboration-dashboard/collaboration-dashboard.component.scss`: Estilos
- `collaboration-dashboard/collaboration-dashboard.component.spec.ts`: Testes

### Estrutura de Diretórios

```
src/
├── dtos/
│   └── budget/
│       ├── add-participant-request-dto.ts
│       ├── add-participant-response-dto.ts
│       ├── remove-participant-request-dto.ts
│       ├── remove-participant-response-dto.ts
│       ├── search-user-request-dto.ts
│       └── search-user-response-dto.ts
├── app/
│   ├── core/
│   │   ├── services/
│   │   │   └── sharing/
│   │   │       ├── sharing.service.ts
│   │   │       ├── sharing.service.spec.ts
│   │   │       ├── sharing.state.ts
│   │   │       └── sharing.state.spec.ts
│   │   └── mocks/
│   │       └── handlers/
│   │           └── sharing.handlers.ts (novo)
│   └── features/
│       └── budget/
│           └── components/
│               ├── share-budget/
│               ├── user-invite/
│               └── collaboration-dashboard/
```

## 🏛️ Padrões Arquiteturais

### Padrões Seguidos

- **DTO-First Architecture**: DTOs como contratos principais entre frontend e backend
- **Service Pattern**: Lógica de negócio em serviços
- **State Pattern**: Estados com signals para gerenciamento reativo
- **Component Pattern**: Componentes pequenos e focados
- **Standalone Components**: Todos os componentes standalone
- **OnPush Change Detection**: Otimização de performance

### Decisões Arquiteturais

- **Decisão**: Criar SharingService separado ao invés de estender BudgetService
- **Alternativas**:
  1. Estender BudgetService com métodos de compartilhamento
  2. Criar SharingService separado
- **Justificativa**:

  - Separação de responsabilidades (SRP)
  - Facilita manutenção e testes
  - Permite evolução independente
  - BudgetService já tem muitas responsabilidades

- **Decisão**: Usar polling inicial para sincronização em tempo real
- **Alternativas**:
  1. WebSocket para sincronização em tempo real
  2. Polling com interval
  3. Event-driven com Server-Sent Events
- **Justificativa**:

  - Simplicidade de implementação inicial
  - Não requer infraestrutura adicional
  - Pode evoluir para WebSocket no futuro
  - Adequado para MVP

- **Decisão**: Modal para adicionar participantes ao invés de página dedicada
- **Alternativas**:
  1. Página dedicada `/budgets/:id/sharing`
  2. Modal sobre BudgetDetailPage
  3. Seção expandível na BudgetDetailPage
- **Justificativa**:
  - Melhor UX (não sai do contexto)
  - Mais rápido de implementar
  - Consistente com padrão de modais do projeto

## 📦 Dependências e Integrações

### Dependências Existentes

- **ApiService**: Para comunicação HTTP com backend
- **AuthService**: Para identificar usuário atual
- **BudgetService**: Para operações básicas de orçamento
- **BudgetState**: Para estado de orçamentos
- **OsModalTemplate**: Para modais
- **OsSearchBox**: Para busca de usuários
- **OsButton**: Para ações
- **OsCard**: Para cards

### Novas Dependências

- Nenhuma nova dependência externa necessária. Todas as dependências já existem no projeto.

### Integrações

- **Backend API**:
  - `POST /api/budget/add-participant` (já existe)
  - `POST /api/budget/remove-participant` (já existe)
  - `GET /api/users/search?query=...` (a ser criado ou verificado)
- **BudgetState**: Atualizar quando participantes mudam
- **BudgetDetailPage**: Integrar componentes de compartilhamento

## 🎨 UI Components and Layout

### Design System Integration

**Componentes Reutilizados do Design System:**

- **Atoms**:

  - `os-button`: Botões de ação (adicionar, remover, cancelar)
  - `os-input`: Campo de busca de usuários
  - `os-icon`: Ícones decorativos (users, add, remove, search, mail, phone)
  - `os-label`: Labels de formulário
  - `os-badge`: Indicadores de status (criador, participante)

- **Molecules**:

  - `os-search-box`: Busca de usuários com sugestões e debounce
  - `os-card`: Cards de participantes e resultados de busca
  - `os-form-field`: Campo de formulário com label e validação

- **Organisms**:

  - `os-modal`: Container do modal (via os-modal-template)

- **Templates**:
  - `os-modal-template`: Template base do ShareBudgetComponent com header, content e actions

**Design Tokens Utilizados:**

- Cores: `--os-color-primary`, `--os-color-background-primary`, `--os-color-text-primary`, `--os-color-border`
- Espaçamento: `--os-spacing-xs`, `--os-spacing-sm`, `--os-spacing-md`, `--os-spacing-lg`
- Tipografia: `--os-font-size-md`, `--os-font-size-lg`, `--os-font-weight-regular`
- Border-radius: `--os-border-radius`, `--os-border-radius-sm`, `--os-border-radius-lg`

### New Components Required

**Componentes novos necessários conforme layout-specification.md:**

1. **UserInviteComponent** (Molecule)

   - Busca de usuários por email/telefone
   - Integração com os-search-box
   - Validação e feedback visual
   - Localização: `src/app/features/budget/components/user-invite/`

2. **ShareBudgetComponent** (Organism)

   - Modal completo para gerenciar participantes
   - Integra UserInviteComponent e CollaborationDashboardComponent
   - Gerencia estado do modal e ações
   - Localização: `src/app/features/budget/components/share-budget/`

3. **CollaborationDashboardComponent** (Organism)
   - Dashboard de visualização de participantes
   - Grid responsivo de cards de participantes
   - Ações de remoção (exceto criador)
   - Localização: `src/app/features/budget/components/collaboration-dashboard/`

**Detalhes completos de design, responsividade e acessibilidade em:** `layout-specification.md`

### Layout Architecture

**Estrutura de Layout:**

```
BudgetDetailPage
└── Seção de Colaboração
    └── Botão "Gerenciar Participantes"
        └── ShareBudgetComponent (Modal)
            ├── Header (Título + Subtítulo)
            ├── UserInviteComponent (Busca)
            ├── CollaborationDashboardComponent (Lista)
            └── Actions (Cancelar/Confirmar)
```

**Responsividade:**

- **Mobile (< 576px)**: Modal quase full screen, stack vertical, touch targets >= 44px
- **Tablet (576-991px)**: Modal 80% width, grid 2 colunas para participantes
- **Desktop (>= 992px)**: Modal max-width 600px centralizado, grid 3 colunas, hover states

**Integração com BudgetDetailPage:**

- Nova seção "Colaboração" após seção "Contas do Orçamento"
- Botão "Gerenciar Participantes" abre ShareBudgetComponent como modal
- Lista de participantes atualizada em tempo real via signals

### Performance Considerations

**Impacto de UI na Performance:**

- **Bundle Size**: +15KB estimado (3 componentes novos)
- **Lazy Loading**: Componentes de compartilhamento devem ser lazy loaded
- **Change Detection**: OnPush em todos componentes
- **Signals**: Uso de computed signals para derivações reativas
- **Debounce**: 300ms na busca de usuários para reduzir chamadas API
- **Polling**: Interval de 30s para sincronização (desabilitar quando página inativa)

**Otimizações:**

- Modal só carrega quando aberto (lazy loading)
- Sugestões de busca limitadas a 5 itens
- Virtual scrolling para listas grandes (futuro)
- Memoização de computed signals

## 🔄 Fluxo de Dados

### Fluxo de Adição de Participante

```
1. Usuário clica em "Gerenciar Participantes" na BudgetDetailPage
   ↓
2. ShareBudgetComponent é aberto como modal
   ↓
3. Usuário digita email/telefone no UserInviteComponent
   ↓
4. SharingService.searchUsers() → API /api/users/search
   ↓
5. Resultados exibidos no UserInviteComponent
   ↓
6. Usuário seleciona participante
   ↓
7. SharingService.addParticipant() → API /api/budget/add-participant
   ↓
8. SharingState atualiza lista de participantes
   ↓
9. BudgetState atualiza BudgetOverviewDto
   ↓
10. BudgetDetailPage reflete mudanças
```

### Fluxo de Remoção de Participante

```
1. Usuário clica em "Remover" no CollaborationDashboardComponent
   ↓
2. Modal de confirmação é exibido
   ↓
3. Usuário confirma remoção
   ↓
4. SharingService.removeParticipant() → API /api/budget/remove-participant
   ↓
5. SharingState atualiza lista de participantes
   ↓
6. BudgetState atualiza BudgetOverviewDto
   ↓
7. BudgetDetailPage reflete mudanças
```

### Fluxo de Sincronização (Polling)

```
1. BudgetDetailPage carrega
   ↓
2. SharingState inicia polling (interval de 30s)
   ↓
3. SharingService.getParticipants(budgetId) → API /api/budget/:id/overview
   ↓
4. Compara participantes atuais com novos
   ↓
5. Se houver mudanças, atualiza SharingState
   ↓
6. BudgetDetailPage reflete mudanças automaticamente (signals)
   ↓
7. Repete a cada 30s enquanto página estiver ativa
```

## 🧪 Considerações de Teste

### Testes Unitários

- **SharingService**:
  - `addParticipant()` - sucesso e erro
  - `removeParticipant()` - sucesso e erro
  - `searchUsers()` - sucesso e erro
  - Validações de entrada
- **SharingState**:
  - Atualização de participantes
  - Estados de loading e error
  - Computed signals
- **Componentes**:
  - Renderização
  - Interações do usuário
  - Validações de formulário
  - Estados de loading

### Testes de Integração

- Fluxo completo de adição de participante
- Fluxo completo de remoção de participante
- Sincronização com polling
- Integração com BudgetState

### Mocks e Fixtures

- **MSW Handlers**:
  - `POST /api/budget/add-participant`
  - `POST /api/budget/remove-participant`
  - `GET /api/users/search`
- **Fixtures**:
  - Mock de usuários para busca
  - Mock de participantes
  - Mock de respostas de API

## ⚖️ Trade-offs e Riscos

### Trade-offs Aceitos

- **Polling vs WebSocket**: Polling inicial é mais simples, mas menos eficiente. Aceito para MVP.
- **Modal vs Página**: Modal é mais rápido, mas pode ser limitado para funcionalidades futuras.
- **SharingService separado**: Mais arquivos, mas melhor organização.

### Riscos Identificados

- **Performance**: Polling pode impactar performance com muitos participantes
  - **Mitigação**: Interval de 30s, desabilitar quando página não está ativa
- **Conflitos**: Mudanças simultâneas podem causar conflitos
  - **Mitigação**: Last-write-wins, validações no backend
- **Busca de Usuários**: Endpoint pode não existir
  - **Mitigação**: Verificar com backend, criar mock se necessário
- **Segurança**: Validações apenas no frontend
  - **Mitigação**: Backend deve validar todas as permissões

## 📋 Lista de Implementação

### Fase 1: DTOs e Serviços Base

- [ ] Criar DTOs de compartilhamento (`add-participant-request-dto.ts`, etc.)
- [ ] Criar `SharingService` com métodos básicos
- [ ] Criar `SharingState` com signals
- [ ] Adicionar handlers MSW para endpoints de compartilhamento
- [ ] Testes unitários para serviços

### Fase 2: Componentes de UI

#### UI Components

- [ ] Implementar `UserInviteComponent` conforme layout-specification.md
  - [ ] Integração com os-search-box
  - [ ] Validação de email/telefone
  - [ ] Estados de loading, error, success
  - [ ] Acessibilidade (ARIA, keyboard navigation)
- [ ] Implementar `ShareBudgetComponent` conforme layout-specification.md
  - [ ] Integração com os-modal-template
  - [ ] Integração de UserInviteComponent e CollaborationDashboardComponent
  - [ ] Gerenciamento de estado do modal
  - [ ] Focus trap e keyboard navigation
- [ ] Implementar `CollaborationDashboardComponent` conforme layout-specification.md
  - [ ] Grid responsivo de cards de participantes
  - [ ] Ações de remoção (exceto criador)
  - [ ] Estados empty, loading, error
  - [ ] Acessibilidade (ARIA labels, roles)
- [ ] Configurar responsividade (mobile/tablet/desktop)
  - [ ] Breakpoints funcionais
  - [ ] Touch targets >= 44px em mobile
  - [ ] Modal responsivo (full screen mobile, centralizado desktop)
- [ ] Implementar acessibilidade (ARIA, keyboard)
  - [ ] WCAG 2.1 AA compliance
  - [ ] Keyboard navigation completa
  - [ ] Screen reader support
  - [ ] Focus management no modal
- [ ] Testes unitários para componentes

### Fase 3: Integração

- [ ] Integrar componentes na `BudgetDetailPage`
- [ ] Adicionar botão "Gerenciar Participantes"
- [ ] Implementar polling de sincronização
- [ ] Atualizar `BudgetState` quando participantes mudam
- [ ] Testes de integração

### Fase 4: Refinamentos

- [ ] Validações e tratamento de erros
- [ ] Feedback visual (loading, sucesso, erro)
- [ ] Acessibilidade (ARIA labels, navegação por teclado)
- [ ] Documentação e comentários
- [ ] Cobertura de testes > 80%

## 📚 Referências

- **Meta Specs**: `/home/danilo/workspace/projeto-orca-sonhos/orca-sonhos-meta-specs/business/product-vision/core-concepts.md` - Compartilhamento Simplificado
- **Código Existente**:
  - `src/app/core/services/budget/budget.service.ts`
  - `src/app/core/services/budget/budget.state.ts`
  - `src/dtos/budget/budget-types.ts`
  - `src/app/features/budget/pages/budget-detail/budget-detail.page.ts`
  - `src/app/shared/ui-components/templates/os-modal-template/os-modal-template.component.ts`
  - `src/app/shared/ui-components/molecules/os-search-box/os-search-box.component.ts`
- **Sessões Anteriores**:
  - `sessions/OS-226/architecture.md` - Budgets
  - `sessions/OS-220/architecture.md` - Core Services
