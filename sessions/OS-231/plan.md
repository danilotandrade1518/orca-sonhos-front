# Compartilhamento Familiar - Colaboração - Plano de Implementação

> **Instruções**: Mantenha este arquivo atualizado conforme o progresso. Marque tarefas como concluídas ✅, em progresso ⏰ ou não iniciadas ⏳.

## 📋 Resumo Executivo

Implementar sistema de compartilhamento familiar simplificado para orçamentos, permitindo adicionar participantes diretamente sem necessidade de convites ou aprovações. O sistema inclui busca de usuários, adição/remoção de participantes, dashboard de visualização e sincronização em tempo real via polling. A implementação segue Clean Architecture, DTO-First, e utiliza Angular Signals para gerenciamento de estado reativo.

## 🎯 Objetivos

- Implementar adição direta de participantes aos orçamentos (sem convites/aprovações)
- Criar sistema de busca de usuários por email/telefone
- Implementar dashboard de visualização de participantes
- Adicionar funcionalidade de remoção de participantes (exceto criador)
- Implementar sincronização em tempo real via polling
- Garantir responsividade mobile-first e acessibilidade WCAG 2.1 AA
- Alcançar cobertura de testes > 80%

---

## 📅 FASE 1: DTOs e Serviços Base [Status: ⏳]

### 🎯 Objetivo

Estabelecer contratos de dados (DTOs) e serviços base para operações de compartilhamento, criando a fundação para os componentes de UI.

### 📋 Tarefas

#### Criar DTOs de Compartilhamento [⏳]

**Descrição**: Criar DTOs para requisições e respostas de compartilhamento seguindo padrão DTO-First Architecture.

**Arquivos a criar**:

- `src/dtos/budget/add-participant-request-dto.ts`
- `src/dtos/budget/add-participant-response-dto.ts`
- `src/dtos/budget/remove-participant-request-dto.ts`
- `src/dtos/budget/remove-participant-response-dto.ts`
- `src/dtos/budget/search-user-request-dto.ts`
- `src/dtos/budget/search-user-response-dto.ts`

**Critério de Conclusão**:

- Todos os DTOs criados e exportados em `src/dtos/budget/index.ts`
- Tipos alinhados com endpoints do backend (`/api/budget/add-participant`, `/api/budget/remove-participant`, `/api/users/search`)
- Interfaces tipadas corretamente (userId, budgetId, participantId, query, etc.)

**Dependências**: Nenhuma

#### Criar SharingService [⏳]

**Descrição**: Implementar serviço para operações de compartilhamento (adicionar, remover participantes, buscar usuários) usando ApiService.

**Arquivo**: `src/app/core/services/sharing/sharing.service.ts`

**Métodos a implementar**:

- `addParticipant(budgetId: string, participantId: string): Observable<boolean>`
- `removeParticipant(budgetId: string, participantId: string): Observable<boolean>`
- `searchUsers(query: string): Observable<SearchUserResponseDto[]>`
- Signals para `loading` e `error` (seguindo padrão do BudgetService)

**Critério de Conclusão**:

- Serviço criado com métodos funcionais
- Integração com ApiService e AuthService
- Signals de loading/error implementados
- Tratamento de erros adequado

**Dependências**: DTOs criados

#### Criar SharingState [⏳]

**Descrição**: Implementar estado reativo com signals para gerenciar participantes e operações de compartilhamento.

**Arquivo**: `src/app/core/services/sharing/sharing.state.ts`

**Signals a implementar**:

- `participants: Signal<BudgetParticipantDto[]>`
- `loading: Signal<boolean>`
- `error: Signal<string | null>`
- `computed` para `hasParticipants`, `participantsCount`, `isCreator(userId)`

**Métodos a implementar**:

- `loadParticipants(budgetId: string): void`
- `addParticipant(budgetId: string, participantId: string): void`
- `removeParticipant(budgetId: string, participantId: string): void`
- `clearParticipants(): void`

**Critério de Conclusão**:

- Estado criado com signals reativos
- Métodos de atualização implementados
- Integração com SharingService
- Computed signals funcionando

**Dependências**: SharingService criado

#### Adicionar Handlers MSW para Busca de Usuários [⏳]

**Descrição**: Criar handler MSW para endpoint de busca de usuários (`/api/users/search`).

**Arquivo**: `src/app/core/mocks/handlers/sharing.handlers.ts` (novo) ou adicionar em `budgets.handlers.ts`

**Handler a implementar**:

- `GET /api/users/search?query=...` - Retorna lista de usuários filtrados por email/telefone

**Critério de Conclusão**:

- Handler criado e exportado em `handlers/index.ts`
- Mock de dados de usuários para busca
- Validação de query e retorno de resultados filtrados

**Dependências**: Nenhuma

#### Testes Unitários para Serviços [⏳]

**Descrição**: Criar testes unitários para SharingService e SharingState.

**Arquivos**:

- `src/app/core/services/sharing/sharing.service.spec.ts`
- `src/app/core/services/sharing/sharing.state.spec.ts`

**Critério de Conclusão**:

- Cobertura > 80% para ambos os arquivos
- Testes de sucesso e erro para cada método
- Testes de signals e computed signals
- Mocks adequados de ApiService e AuthService

**Dependências**: SharingService e SharingState criados

### 🧪 Critérios de Validação

- [ ] DTOs criados e exportados corretamente
- [ ] SharingService com métodos funcionais (testado manualmente ou via testes)
- [ ] SharingState com signals reativos funcionando
- [ ] Handler MSW retornando dados mockados corretamente
- [ ] Testes unitários passando com cobertura > 80%

### 📝 Comentários da Fase

_[Espaço para anotações durante desenvolvimento]_

---

## 📅 FASE 2: Componentes de UI Base [Status: ⏳]

### 🎯 Objetivo

Criar os três componentes principais de UI (UserInviteComponent, ShareBudgetComponent, CollaborationDashboardComponent) seguindo especificações de layout e design system.

### 📋 Tarefas

#### Implementar UserInviteComponent [⏳]

**Descrição**: Componente de busca e seleção de usuários para adicionar ao orçamento, integrando com os-search-box.

**Arquivos**:

- `src/app/features/budget/components/user-invite/user-invite.component.ts`
- `src/app/features/budget/components/user-invite/user-invite.component.scss`
- `src/app/features/budget/components/user-invite/user-invite.component.spec.ts`

**Funcionalidades**:

- Integração com `os-search-box` para busca de usuários
- Debounce de 300ms na busca
- Validação de email/telefone
- Estados: loading, error, success, empty
- Feedback visual quando usuário é encontrado
- Acessibilidade: ARIA labels, keyboard navigation, role="combobox"

**Critério de Conclusão**:

- Componente standalone com OnPush change detection
- Integração com SharingService.searchUsers()
- Estados visuais implementados (loading, error, success, empty)
- Acessibilidade WCAG 2.1 AA (keyboard navigation, ARIA)
- Responsivo (mobile-first)

**Dependências**: SharingService criado (Fase 1)

#### Implementar CollaborationDashboardComponent [⏳]

**Descrição**: Dashboard para visualizar todos os participantes do orçamento com ações de remoção.

**Arquivos**:

- `src/app/features/budget/components/collaboration-dashboard/collaboration-dashboard.component.ts`
- `src/app/features/budget/components/collaboration-dashboard/collaboration-dashboard.component.scss`
- `src/app/features/budget/components/collaboration-dashboard/collaboration-dashboard.component.spec.ts`

**Funcionalidades**:

- Grid responsivo de cards de participantes (1 col mobile, 2 tablet, 3 desktop)
- Exibição de avatar/inicial, nome, email
- Badge "Criador" para o criador do orçamento
- Botão remover (não exibido para criador)
- Estados: empty, loading, error
- Modal de confirmação para remoção (opcional, pode ser inline)
- Acessibilidade: role="list", ARIA labels, keyboard navigation

**Critério de Conclusão**:

- Componente standalone com OnPush change detection
- Grid responsivo funcionando (mobile/tablet/desktop)
- Integração com SharingState para lista de participantes
- Ações de remoção funcionando (exceto criador)
- Estados visuais implementados
- Acessibilidade WCAG 2.1 AA

**Dependências**: SharingState criado (Fase 1)

#### Implementar ShareBudgetComponent [⏳]

**Descrição**: Modal completo para gerenciar participantes do orçamento, integrando UserInviteComponent e CollaborationDashboardComponent.

**Arquivos**:

- `src/app/features/budget/components/share-budget/share-budget.component.ts`
- `src/app/features/budget/components/share-budget/share-budget.component.scss`
- `src/app/features/budget/components/share-budget/share-budget.component.spec.ts`

**Funcionalidades**:

- Integração com `os-modal-template` para estrutura do modal
- Header com título "Gerenciar Participantes" e subtítulo (nome do orçamento)
- Seção de busca: UserInviteComponent integrado
- Seção de participantes: CollaborationDashboardComponent integrado
- Gerenciamento de estado do modal (aberto/fechado)
- Focus trap e keyboard navigation (Esc para fechar)
- Estados: loading overlay, error toast, success feedback

**Critério de Conclusão**:

- Componente standalone com OnPush change detection
- Modal funcionando com os-modal-template
- Integração de UserInviteComponent e CollaborationDashboardComponent
- Gerenciamento de estado e eventos do modal
- Focus management (focus no input ao abrir, retorna ao botão ao fechar)
- Acessibilidade WCAG 2.1 AA (role="dialog", aria-modal, focus trap)

**Dependências**: UserInviteComponent e CollaborationDashboardComponent criados

#### Configurar Responsividade [⏳]

**Descrição**: Implementar breakpoints e estilos responsivos para todos os componentes.

**Breakpoints**:

- Mobile (0-575px): Stack vertical, modal quase full screen, touch targets >= 44px
- Tablet (576-991px): Grid 2 colunas, modal 80% width
- Desktop (992px+): Grid 3 colunas, modal max-width 600px centralizado

**Critério de Conclusão**:

- Breakpoints funcionais em todos os componentes
- Layout responsivo testado em diferentes resoluções
- Touch targets >= 44px em mobile
- Sem scroll horizontal em nenhuma resolução
- Hover states funcionando em desktop

**Dependências**: Componentes criados

#### Implementar Acessibilidade [⏳]

**Descrição**: Garantir conformidade WCAG 2.1 AA em todos os componentes.

**Requisitos**:

- Keyboard navigation completa (Tab, Enter, Esc, Arrow keys)
- ARIA attributes corretos (labels, roles, live regions)
- Focus visible em elementos interativos (2px solid ring)
- Focus trap no modal
- Screen reader support
- Contraste adequado (>= 4.5:1)

**Critério de Conclusão**:

- Navegação por teclado funcionando em todos os componentes
- ARIA attributes implementados corretamente
- Focus management funcionando
- Testado com screen reader (ou validado manualmente)
- Contraste verificado

**Dependências**: Componentes criados

#### Testes Unitários para Componentes [⏳]

**Descrição**: Criar testes unitários para os três componentes.

**Arquivos**:

- `user-invite.component.spec.ts`
- `collaboration-dashboard.component.spec.ts`
- `share-budget.component.spec.ts`

**Critério de Conclusão**:

- Cobertura > 80% para cada componente
- Testes de renderização
- Testes de interações do usuário
- Testes de estados (loading, error, success, empty)
- Testes de acessibilidade (keyboard navigation, ARIA)

**Dependências**: Componentes criados

### 🔄 Dependências

- ✅ Fase 1 completada (DTOs, SharingService, SharingState)

### 🧪 Critérios de Validação

- [ ] UserInviteComponent funcionando com busca de usuários
- [ ] CollaborationDashboardComponent exibindo participantes corretamente
- [ ] ShareBudgetComponent abrindo como modal e integrando componentes
- [ ] Responsividade funcionando em mobile/tablet/desktop
- [ ] Acessibilidade WCAG 2.1 AA implementada
- [ ] Testes unitários passando com cobertura > 80%

### 📝 Comentários da Fase

_[Observações sobre decisões tomadas]_

---

## 📅 FASE 3: Integração e Sincronização [Status: ⏳]

### 🎯 Objetivo

Integrar componentes na BudgetDetailPage, implementar polling de sincronização e atualizar BudgetState quando participantes mudam.

### 📋 Tarefas

#### Integrar ShareBudgetComponent na BudgetDetailPage [⏳]

**Descrição**: Adicionar seção de colaboração na BudgetDetailPage com botão "Gerenciar Participantes" que abre o modal.

**Arquivo**: `src/app/features/budget/pages/budget-detail/budget-detail.page.ts`

**Funcionalidades**:

- Nova seção "Colaboração" após seção "Contas do Orçamento"
- Botão "Gerenciar Participantes" que abre ShareBudgetComponent como modal
- Exibição de contador de participantes (se aplicável)
- Integração com SharingState para obter lista de participantes

**Critério de Conclusão**:

- Seção de colaboração adicionada na página
- Botão funcionando e abrindo modal
- Modal integrado corretamente
- Lista de participantes atualizada quando modal fecha

**Dependências**: ShareBudgetComponent criado (Fase 2)

#### Implementar Polling de Sincronização [⏳]

**Descrição**: Implementar mecanismo de polling para sincronizar participantes em tempo real (interval de 30s).

**Arquivo**: `src/app/core/services/sharing/sharing.state.ts` (adicionar método)

**Funcionalidades**:

- Polling automático quando BudgetDetailPage está ativa
- Interval de 30 segundos
- Desabilitar polling quando página não está ativa (usando visibility API ou destroy)
- Comparar participantes atuais com novos e atualizar apenas se houver mudanças
- Integração com BudgetState para atualizar BudgetOverviewDto

**Critério de Conclusão**:

- Polling funcionando com interval de 30s
- Atualização automática de participantes quando mudanças ocorrem
- Polling desabilitado quando página não está ativa
- Sem chamadas desnecessárias (comparação antes de atualizar)

**Dependências**: SharingState criado (Fase 1), BudgetDetailPage integrada

#### Atualizar BudgetState quando Participantes Mudam [⏳]

**Descrição**: Sincronizar BudgetState com mudanças de participantes para manter BudgetOverviewDto atualizado.

**Arquivo**: `src/app/core/services/budget/budget.state.ts` (adicionar método)

**Funcionalidades**:

- Método para atualizar participantes no BudgetOverviewDto
- Integração com SharingState para escutar mudanças
- Atualização automática quando participante é adicionado/removido
- Manter consistência entre SharingState e BudgetState

**Critério de Conclusão**:

- BudgetState atualizado quando participantes mudam
- BudgetOverviewDto sempre sincronizado
- Sem inconsistências entre estados

**Dependências**: BudgetState existente, SharingState criado (Fase 1)

#### Implementar Validações e Tratamento de Erros [⏳]

**Descrição**: Adicionar validações (usuário já participante, remoção do criador) e tratamento de erros adequado.

**Validações**:

- Impedir adicionar usuário já participante
- Impedir remover criador do orçamento
- Validar email/telefone na busca
- Mensagens de erro claras e acionáveis

**Tratamento de Erros**:

- Toast/notificação para erros de API
- Mensagens de erro específicas por tipo de erro
- Estados de erro visuais nos componentes
- Recovery actions quando possível

**Critério de Conclusão**:

- Validações implementadas e funcionando
- Mensagens de erro claras e acionáveis
- Estados de erro visuais implementados
- Tratamento de erros robusto

**Dependências**: Componentes criados (Fase 2)

#### Testes de Integração [⏳]

**Descrição**: Criar testes de integração para fluxos completos.

**Testes a implementar**:

- Fluxo completo de adição de participante (busca → seleção → adição → atualização)
- Fluxo completo de remoção de participante (confirmação → remoção → atualização)
- Sincronização com polling (mudanças refletidas automaticamente)
- Integração com BudgetState (atualização quando participantes mudam)
- Validações (usuário já participante, remoção do criador)

**Critério de Conclusão**:

- Testes de integração passando
- Fluxos completos testados
- Cobertura de casos de sucesso e erro

**Dependências**: Todas as integrações implementadas

### 🔄 Dependências

- ✅ Fase 1 completada
- ✅ Fase 2 completada

### 🧪 Critérios de Validação

- [ ] ShareBudgetComponent integrado na BudgetDetailPage
- [ ] Polling de sincronização funcionando (30s interval)
- [ ] BudgetState atualizado quando participantes mudam
- [ ] Validações implementadas e funcionando
- [ ] Tratamento de erros robusto
- [ ] Testes de integração passando

### 📝 Comentários da Fase

_[Observações sobre decisões tomadas]_

---

## 📅 FASE 4: Refinamentos e Finalização [Status: ⏳]

### 🎯 Objetivo

Refinar implementação, garantir qualidade, acessibilidade e cobertura de testes, preparando para PR.

### 📋 Tarefas

#### Refinar Feedback Visual [⏳]

**Descrição**: Melhorar feedback visual em todas as ações (loading, success, error).

**Melhorias**:

- Loading states consistentes em todos os componentes
- Animações suaves de transição (200-300ms)
- Feedback visual imediato ao adicionar/remover participante
- Toast/notificações para ações importantes
- Estados empty bem projetados

**Critério de Conclusão**:

- Feedback visual consistente e claro
- Animações suaves implementadas
- Estados visuais bem projetados

**Dependências**: Componentes criados (Fase 2)

#### Revisar e Melhorar Acessibilidade [⏳]

**Descrição**: Revisão final de acessibilidade e correção de problemas encontrados.

**Checklist**:

- [ ] Keyboard navigation completa e lógica
- [ ] ARIA attributes corretos e completos
- [ ] Focus management funcionando perfeitamente
- [ ] Screen reader friendly (testado ou validado)
- [ ] Contraste adequado em todos os elementos
- [ ] Touch targets >= 44px em mobile
- [ ] Respeita `prefers-reduced-motion`

**Critério de Conclusão**:

- Conformidade WCAG 2.1 AA verificada
- Problemas de acessibilidade corrigidos
- Testado com ferramentas de acessibilidade (opcional)

**Dependências**: Componentes criados (Fase 2)

#### Otimizar Performance [⏳]

**Descrição**: Otimizar performance dos componentes e sincronização.

**Otimizações**:

- Lazy loading dos componentes de compartilhamento
- Debounce na busca (já implementado, verificar)
- Memoização de computed signals
- Desabilitar polling quando página não está ativa (já implementado, verificar)
- Limitar sugestões de busca a 5 itens (já implementado, verificar)

**Critério de Conclusão**:

- Performance otimizada
- Lazy loading implementado
- Sem chamadas desnecessárias à API

**Dependências**: Componentes criados (Fase 2)

#### Aumentar Cobertura de Testes [⏳]

**Descrição**: Garantir cobertura de testes > 80% em todos os arquivos.

**Arquivos a revisar**:

- SharingService e SharingState (Fase 1)
- Componentes de UI (Fase 2)
- Integrações (Fase 3)

**Critério de Conclusão**:

- Cobertura > 80% em todos os arquivos
- Testes de casos edge implementados
- Testes de erros e validações completos

**Dependências**: Todos os arquivos criados

#### Documentação e Comentários [⏳]

**Descrição**: Adicionar documentação e comentários no código.

**Documentação**:

- Comentários JSDoc em métodos públicos
- Comentários explicativos em lógica complexa
- README ou documentação de uso (se necessário)

**Critério de Conclusão**:

- Código bem documentado
- Comentários claros e úteis
- Documentação de uso (se aplicável)

**Dependências**: Código implementado

#### Revisão Final e Preparação para PR [⏳]

**Descrição**: Revisão final do código, verificação de padrões e preparação para Pull Request.

**Checklist**:

- [ ] Código segue padrões do projeto (Clean Architecture, DTO-First, Signals)
- [ ] Nenhum console.log ou código de debug
- [ ] Imports organizados
- [ ] Nomenclatura consistente
- [ ] Sem código comentado desnecessário
- [ ] Linter passando sem erros
- [ ] Todos os testes passando
- [ ] Build funcionando sem erros

**Critério de Conclusão**:

- Código revisado e limpo
- Pronto para PR
- Checklist completo

**Dependências**: Todas as fases anteriores completadas

### 🔄 Dependências

- ✅ Fase 1 completada
- ✅ Fase 2 completada
- ✅ Fase 3 completada

### 🧪 Critérios de Validação

- [ ] Feedback visual refinado e consistente
- [ ] Acessibilidade WCAG 2.1 AA verificada e corrigida
- [ ] Performance otimizada
- [ ] Cobertura de testes > 80% em todos os arquivos
- [ ] Código documentado
- [ ] Revisão final completa
- [ ] Pronto para PR

### 📝 Comentários da Fase

_[Observações sobre decisões tomadas]_

---

## 🏁 Entrega Final

### Checklist de Entrega

- [ ] Todas as fases completadas
- [ ] Todos os testes passando (unitários e integração)
- [ ] Cobertura de testes > 80%
- [ ] Acessibilidade WCAG 2.1 AA verificada
- [ ] Responsividade funcionando (mobile/tablet/desktop)
- [ ] Performance otimizada
- [ ] Código revisado e limpo
- [ ] Documentação atualizada
- [ ] Linter passando sem erros
- [ ] Build funcionando sem erros
- [ ] Pronto para Pull Request

### Critérios de Aceitação (Requisitos Originais)

- [ ] Criar DTOs para Sharing (ShareBudgetDto, UserInviteDto, AddParticipantRequestDto, RemoveParticipantRequestDto)
- [ ] Implementar SharingService com métodos de colaboração (addParticipant, removeParticipant, searchUsers)
- [ ] Criar SharingState com signals para gerenciamento de estado
- [ ] Implementar ShareBudgetComponent (adicionar participantes)
- [ ] Implementar UserInviteComponent (buscar/convitar usuários)
- [ ] Implementar CollaborationDashboardComponent (visualizar participantes)
- [ ] Criar sistema de convites por email/telefone
- [ ] Implementar sincronização em tempo real (polling)
- [ ] Integrar com BudgetService e GoalService
- [ ] Implementar controle de permissões (remoção exceto criador)
- [ ] Configurar roteamento /sharing (opcional, pode ser modal)
- [ ] Implementar testes unitários com cobertura > 80%

### Próximos Passos Após Aprovação

1. **Implementação** (`/work`) - Execução das fases planejadas
2. **Revisões** (`/pre-pr`) - Validações de qualidade
3. **Pull Request** (`/pr`) - Submissão final

---

## 📚 Referências

- **Context**: `sessions/OS-231/context.md`
- **Architecture**: `sessions/OS-231/architecture.md`
- **Layout Specification**: `sessions/OS-231/layout-specification.md`
- **Issue**: [OS-231](https://orca-sonhos.atlassian.net/browse/OS-231)
- **Código Similar**:
  - `src/app/core/services/budget/budget.service.ts` - Padrão de serviço
  - `src/app/core/services/budget/budget.state.ts` - Padrão de estado com signals
  - `src/app/shared/ui-components/templates/os-modal-template/os-modal-template.component.ts` - Template de modal
  - `src/app/shared/ui-components/molecules/os-search-box/os-search-box.component.ts` - Componente de busca
