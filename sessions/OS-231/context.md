# Compartilhamento Familiar - Colaboração - Contexto de Desenvolvimento

# OS-231

## 🎯 Objetivo

Implementar o sistema de compartilhamento familiar simplificado, permitindo que usuários colaborem em orçamentos e metas de forma direta e intuitiva. O sistema permite adicionar participantes diretamente aos orçamentos sem necessidade de convites ou aprovações, com acesso total para todos os participantes e sincronização em tempo real das mudanças.

## 📋 Requisitos Funcionais

### Funcionalidades Principais

- **Adição Direta de Participantes**: Qualquer participante pode adicionar outros usuários ao orçamento sem necessidade de convites ou aprovações
- **Acesso Total**: Todo usuário adicionado tem acesso completo ao orçamento (sem níveis de permissão)
- **Remoção de Participantes**: Participantes podem ser removidos do orçamento (exceto o criador)
- **Busca de Usuários**: Sistema de busca para encontrar usuários por email ou telefone
- **Visualização de Participantes**: Dashboard para visualizar todos os participantes do orçamento
- **Sincronização em Tempo Real**: Mudanças feitas por um participante devem ser refletidas imediatamente para os outros participantes

### Comportamentos Esperados

- **Fluxo de Adição**: Usuário busca outro usuário por email/telefone → Seleciona → Adiciona ao orçamento → Participante recebe acesso imediato
- **Fluxo de Remoção**: Participante (exceto criador) pode ser removido → Acesso é revogado imediatamente
- **Colaboração**: Todos os participantes podem lançar transações, gerenciar metas e visualizar dados do orçamento
- **Feedback Visual**: Indicadores de loading, mensagens de sucesso/erro, confirmações para ações destrutivas
- **Validações**: Impedir adicionar usuário já participante, validar email/telefone, proteger remoção do criador

## 🏗️ Considerações Técnicas

### Arquitetura

- **DTO-First**: Seguir padrão DTO-First Architecture, usando DTOs como contratos principais
- **Clean Architecture**: Manter separação de camadas (Models, Application, Infrastructure)
- **Signals**: Usar Angular Signals para gerenciamento de estado reativo
- **Standalone Components**: Todos os componentes devem ser standalone
- **OnPush Change Detection**: Otimizar performance com ChangeDetectionStrategy.OnPush

### Tecnologias e Dependências

- **Angular 20+**: Framework base
- **RxJS**: Para operações assíncronas e streams
- **Angular Material**: Componentes de UI (se necessário)
- **MSW**: Mocks para desenvolvimento
- **ApiService**: Serviço HTTP existente para comunicação com backend

### Padrões a Seguir

- **Service Pattern**: Serviços para lógica de negócio e comunicação com API
- **State Pattern**: Estados com signals para gerenciamento de estado reativo
- **Component Pattern**: Componentes pequenos e focados em responsabilidade única
- **Either Pattern**: Tratamento de erros funcional (se aplicável)
- **Factory Pattern**: Para criação de DTOs e entidades

## 🧪 Estratégia de Testes

### Testes Necessários

- **Testes Unitários**: Serviços, componentes, estados (cobertura > 80%)
- **Testes de Integração**: Fluxos completos de adição/remoção de participantes
- **Testes de UI**: Interações do usuário, validações de formulários
- **Mocks**: Handlers MSW para endpoints de compartilhamento

### Critérios de Aceitação

- [ ] Criar DTOs para Sharing (ShareBudgetDto, UserInviteDto, AddParticipantRequestDto, RemoveParticipantRequestDto)
- [ ] Implementar SharingService com métodos de colaboração (addParticipant, removeParticipant, searchUsers)
- [ ] Criar SharingState com signals para gerenciamento de estado
- [ ] Implementar ShareBudgetComponent (adicionar participantes)
- [ ] Implementar UserInviteComponent (buscar/convitar usuários)
- [ ] Implementar CollaborationDashboardComponent (visualizar participantes)
- [ ] Criar sistema de convites por email/telefone
- [ ] Implementar sincronização em tempo real (polling ou WebSocket)
- [ ] Integrar com BudgetService e GoalService
- [ ] Implementar controle de permissões (remoção exceto criador)
- [ ] Configurar roteamento /sharing
- [ ] Implementar testes unitários com cobertura > 80%

## 🔗 Dependências e Impactos

### Sistemas Afetados

- **BudgetService**: Extensão para métodos de compartilhamento
- **BudgetState**: Atualização de estado quando participantes são adicionados/removidos
- **BudgetDetailPage**: Integração com componentes de compartilhamento
- **GoalService**: Metas compartilhadas entre participantes (já existe estrutura)
- **AuthService**: Identificação do usuário atual para validações

### Integrações Necessárias

- **Backend API**: Endpoints `/api/budget/add-participant` e `/api/budget/remove-participant` (já existem)
- **Backend API**: Endpoint de busca de usuários (a ser criado ou verificado)
- **Backend API**: Sistema de notificações para novos participantes (opcional)
- **Real-time Sync**: Mecanismo de sincronização (polling inicial, WebSocket futuro)

## 🚧 Restrições e Considerações

### Limitações Técnicas

- **Modelo Simplificado**: NÃO implementar níveis de permissão complexos. Todos os participantes têm acesso total
- **Sincronização**: Inicialmente usar polling, considerar WebSocket em fase futura
- **Busca de Usuários**: Pode ser limitada a email/telefone, sem busca por nome completo inicialmente

### Riscos

- **Performance**: Múltiplos participantes podem impactar performance de sincronização
- **Conflitos**: Mudanças simultâneas podem causar conflitos (resolver com last-write-wins ou otimistic locking)
- **Segurança**: Validação adequada de permissões no backend (não confiar apenas no frontend)

## 📚 Referências

- **Issue/Card**: [OS-231](https://orca-sonhos.atlassian.net/browse/OS-231)
- **Meta Specs**: `/home/danilo/workspace/projeto-orca-sonhos/orca-sonhos-meta-specs/business/product-vision/core-concepts.md` - Compartilhamento Simplificado
- **Meta Specs**: `/home/danilo/workspace/projeto-orca-sonhos/orca-sonhos-meta-specs/business/product-vision/use-cases.md` - Jornada 2: Gestão Familiar
- **Backlog**: `temp/backlog-features-incremental.md` - Card 15
- **Código Existente**:
  - `src/app/core/services/budget/budget.service.ts`
  - `src/dtos/budget/budget-types.ts` (BudgetParticipantDto já existe)
  - `src/app/core/mocks/handlers/budgets.handlers.ts` (endpoints mockados)

## 💡 Persona Principal

**Ana - A Organizadora Familiar** (32 anos, casada, 2 filhos)

- Gerencia as finanças da casa e quer envolver o marido no controle
- Valoriza compartilhamento e colaboração familiar
- Precisa de simplicidade e clareza
- Não quer processos complexos de convite/aprovação

## 🎯 Prioridade e Estimativa

- **Prioridade**: Média - Feature importante para o MVP, mas não bloqueante para funcionalidades core individuais
- **Estimativa**: 4-5 story points - Feature completa com múltiplos componentes e integrações


