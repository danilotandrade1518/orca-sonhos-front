# Implementar Camada Application para Budget - Contexto de Desenvolvimento

## 🎯 Objetivo

Implementar completamente a camada Application para gestão de orçamentos (Budget) seguindo Clean Architecture com padrão Ports & Adapters. Esta camada estabelecerá a base arquitetural para todo o sistema de gestão de orçamentos, desacoplando a UI Angular da comunicação HTTP direta com foco no MVP.

## 📋 Requisitos Funcionais

### Funcionalidades Principais

#### Use Cases (Commands)
- **CreateBudgetUseCase**: Criação de novos orçamentos com validação de domínio via HTTP
- **UpdateBudgetUseCase**: Atualização de dados de orçamento existente
- **DeleteBudgetUseCase**: Remoção de orçamentos com validações apropriadas
- **AddParticipantToBudgetUseCase**: Adição de participantes a orçamentos compartilhados
- **RemoveParticipantFromBudgetUseCase**: Remoção de participantes de orçamentos

#### Query Handlers (Queries)
- **ListBudgetsQueryHandler**: Listagem paginada de orçamentos do usuário via HTTP
- **BudgetOverviewQueryHandler**: Visão geral detalhada de um orçamento específico

**Nota**: Queries de Accounts, Transactions, Envelopes e Goals serão implementadas em fase futura.

### Comportamentos Esperados

#### Estratégia HTTP Direta
- **Commands (Use Cases)**: Comunicação direta com backend via HTTP
- **Queries**: Comunicação direta com backend via HTTP
- **Error Handling**: Tratamento de erros de rede e validação usando Either pattern

#### Granularidade de Ports
- **Por Operação**: `ICreateBudgetPort`, `IUpdateBudgetPort`, `IDeleteBudgetPort`, etc.
- **Segregação de Interface**: Máximo 5 métodos por port, responsabilidade única
- **HTTP Only**: Ports para comunicação com backend HTTP

## 🏗️ Considerações Técnicas

### Arquitetura

**Clean Architecture + Ports & Adapters**
```
Components → Application Layer → [Ports/Interfaces]
                   ↓
           [Infra será implementada posteriormente]
```

### Tecnologias e Dependências

**Existentes no Projeto:**
- Either pattern para error handling
- Budget domain model
- Value Objects (Money, Uuid)
- Path aliases TypeScript configurados

**Nenhuma Nova Dependência Externa:** TypeScript puro na Application layer

### Padrões a Seguir

- **Framework Agnostic**: TypeScript puro, sem dependências Angular
- **CQRS**: Separação clara entre Commands (Use Cases) e Queries
- **Either Pattern**: Error handling consistente
- **Dependency Injection**: Via constructor
- **Ports por Operação**: Interface segregation principle

## 🧪 Estratégia de Testes

### Testes Necessários

- **Unit Tests**: 100% cobertura obrigatória na camada Application
- **Mocking Strategy**: Mockar falha do HTTP port para ativar fallback offline
- **Error Flow Tests**: Validar hierarchy ServiceError → ApplicationError → DomainError

### Critérios de Aceitação

- [ ] Todos os Use Cases implementados com interfaces bem definidas
- [ ] Query Handlers de Budget implementados
- [ ] Lógica de fallback HTTP → offline funcional nos Use Cases
- [ ] Ports definidas por operação (ICreateBudgetPort, etc.)
- [ ] DTOs criados para Request/Response/Internal
- [ ] Mappers para conversão Domain ↔ DTOs
- [ ] 100% cobertura de testes unitários com mocks
- [ ] Error handling usando padrão Either consistentemente
- [ ] 0 violações de dependency rules (Application não conhece Angular/Infra)

## 🔗 Dependências e Impactos

### Sistemas Afetados

- **Domain Layer**: Utilizará Budget model e Value Objects existentes
- **UI Layer**: Receberá novos Use Cases para injeção de dependência
- **Future Infrastructure**: Implementará os ports definidos

### Integrações Necessárias

**Nesta Fase (Apenas Interfaces):**
- `ICreateBudgetPort`, `IUpdateBudgetPort`, `IDeleteBudgetPort`
- `IAddParticipantToBudgetPort`, `IRemoveParticipantFromBudgetPort`
- `IListBudgetsPort`, `IBudgetOverviewPort`

**Fase Futura:**
- HTTP adapters implementando os ports

## 🚧 Restrições e Considerações

### Limitações Técnicas

- **Escopo Limitado**: Apenas Budget entities nesta fase
- **Sem Infraestrutura**: Implementação de adapters HTTP fica para feature futura
- **Framework Agnostic**: Application layer não pode conhecer Angular
- **Interface Only**: Ports definem apenas contratos, sem implementação

### Riscos

- **Query Dependencies**: ListBudgets pode precisar de dados de outras entities não implementadas
- **Test Complexity**: Mockar comportamento HTTP requer estratégia cuidadosa
- **Port Proliferation**: Muitos ports pequenos podem aumentar boilerplate

**Mitigações:**
- Implementar apenas queries essenciais de Budget
- Factory pattern para mocks HTTP reutilizáveis
- Organizar ports em namespaces por contexto

## 📚 Referências

- **Issue**: OS-15 - Implementar Camada Application para Budget
- **Especificação**: PRD e Arquitetura aprovados no Jira
- **Meta Specs**: Clean Architecture + HTTP Strategy
- **Dependency Rules**: Application layer boundaries