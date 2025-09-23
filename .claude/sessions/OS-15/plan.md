# Budget Application Layer - Plano de Implementação

> **Instruções**: Mantenha este arquivo atualizado conforme o progresso. Marque tarefas como concluídas ✅, em progresso ⏰ ou não iniciadas ⏳.

## 📋 Resumo Executivo

Implementação completa da camada Application para gestão de orçamentos (Budget) seguindo Clean Architecture com padrão Ports & Adapters. Esta implementação estabelecerá a base arquitetural para todo o sistema de gestão de orçamentos, desacoplando a UI Angular da comunicação HTTP direta e preparando o terreno para funcionalidade offline-first.

## 🎯 Objetivos da Implementação

- Implementar camada Application completa com 5 Use Cases e 2 Query Handlers
- Estabelecer padrão Ports & Adapters com segregação de interfaces por operação
- Criar sistema de fallback HTTP → offline nos Use Cases (Commands)
- Alcançar 100% de cobertura de testes unitários
- Manter framework agnostic (TypeScript puro, sem dependências Angular)

### Critérios de Sucesso

- [ ] Todos os Use Cases implementados com interfaces bem definidas
- [ ] Query Handlers de Budget implementados
- [ ] Lógica de fallback HTTP → offline funcional nos Use Cases
- [ ] Ports definidas por operação (máximo 5 métodos por port)
- [ ] DTOs criados para Request/Response/Internal
- [ ] Mappers para conversão Domain ↔ DTOs
- [ ] 100% cobertura de testes unitários com mocks
- [ ] Error handling usando padrão Either consistentemente
- [ ] 0 violações de dependency rules (Application não conhece Angular/Infra)

---

## 📅 FASE 1: INFRAESTRUTURA BASE [Status: ⏳]

### 🎯 Objetivo da Fase

Estabelecer a estrutura fundamental da camada Application com sistema de erros, tipos comuns e organização de diretórios.

### 📋 Tarefas

#### Criar Estrutura de Diretórios [⏳]

**Descrição**: Criar toda a estrutura de diretórios da camada Application seguindo organização proposta na arquitetura
**Arquivos**:
- `src/application/` (diretório raiz)
- `src/application/errors/`
- `src/application/types/`
- `src/application/dtos/request/`
- `src/application/dtos/response/`
- `src/application/dtos/internal/`
- `src/application/ports/`
- `src/application/mappers/`
- `src/application/use-cases/`
- `src/application/queries/`

**Critério de Conclusão**: Toda estrutura de diretórios criada e vazia, pronta para receber implementações

#### Implementar Sistema de Erros [⏳]

**Descrição**: Criar hierarchy de erros ApplicationError → specific domain errors
**Arquivos**:
- `src/application/errors/application-error.ts`
- `src/application/errors/budget-not-found-error.ts`
- `src/application/errors/validation-error.ts`
- `src/application/errors/offline-error.ts`
- `src/application/errors/index.ts`

**Dependências**: Estrutura de diretórios criada
**Validação**: Erros seguem hierarchy, estendem ApplicationError, usam Either pattern

#### Definir Tipos Comuns [⏳]

**Descrição**: Implementar interfaces compartilhadas para paginação e status de conexão
**Arquivos**:
- `src/application/types/pagination.types.ts`
- `src/application/types/connection-status.types.ts`
- `src/application/types/index.ts`

**Critério de Conclusão**: Tipos bem definidos e exportados via index, prontos para uso

### 🧪 Critérios de Validação

- [ ] Estrutura de diretórios completa e organizada conforme arquitetura
- [ ] Sistema de erros implementado com hierarchy correta
- [ ] Tipos comuns definidos e reutilizáveis
- [ ] Path alias `@application/*` funcionando corretamente
- [ ] Todos os arquivos com exports via index files

### 📝 Comentários da Fase

_[Espaço para anotações durante desenvolvimento - decisões sobre tipos, ajustes na estrutura, etc.]_

---

## 📅 FASE 2: DTOs E CONTRATOS [Status: ⏳]

### 🎯 Objetivo da Fase

Definir todos os contratos de dados (DTOs) e interfaces (Ports) que estabelecem a comunicação entre camadas.

### 📋 Tarefas

#### Implementar DTOs de Request [⏳]

**Descrição**: Criar DTOs para entrada de dados dos Use Cases
**Arquivos**:
- `src/application/dtos/request/create-budget-request.dto.ts`
- `src/application/dtos/request/update-budget-request.dto.ts`
- `src/application/dtos/request/add-participant-request.dto.ts`
- `src/application/dtos/request/index.ts`

**Dependências**: Fase 1 completada
**Complexidade**: Baixa
**Validação**: DTOs seguem interface BudgetProps do domain model

#### Implementar DTOs de Response [⏳]

**Descrição**: Criar DTOs para saída de dados das operações
**Arquivos**:
- `src/application/dtos/response/budget-response.dto.ts`
- `src/application/dtos/response/budget-list-response.dto.ts`
- `src/application/dtos/response/budget-overview-response.dto.ts`
- `src/application/dtos/response/index.ts`

**Dependências**: DTOs de Request implementados
**Critério de Conclusão**: DTOs alinhados com toJSON() do Budget domain model

#### Implementar DTOs Internos [⏳]

**Descrição**: Criar DTOs para storage offline e operações de sync
**Arquivos**:
- `src/application/dtos/internal/budget-storage.dto.ts`
- `src/application/dtos/internal/sync-operation.dto.ts`
- `src/application/dtos/internal/index.ts`

**Foco**: Otimização para IndexedDB e queue de sincronização

#### Definir Ports por Operação [⏳]

**Descrição**: Implementar interfaces segregadas seguindo padrão 1 port = 1 operação
**Arquivos**:
- `src/application/ports/create-budget.port.ts`
- `src/application/ports/update-budget.port.ts`
- `src/application/ports/delete-budget.port.ts`
- `src/application/ports/add-participant-to-budget.port.ts`
- `src/application/ports/remove-participant-from-budget.port.ts`
- `src/application/ports/list-budgets.port.ts`
- `src/application/ports/budget-overview.port.ts`
- `src/application/ports/budget-offline-storage.port.ts`
- `src/application/ports/index.ts`

**Complexidade**: Média (requires careful interface design)
**Testes Necessários**: Type checking, interface compliance

### 🔄 Dependências

- ✅ Fase 1 completada
- Domain Models (Budget, Money, Uuid) já existentes
- Either pattern já implementado

### 📝 Comentários da Fase

_[Observações sobre decisões de design dos DTOs, ajustes de interfaces durante implementação]_

---

## 📅 FASE 3: MAPPERS E CONVERSÕES [Status: ⏳]

### 🎯 Objetivo da Fase

Implementar camada de mapeamento entre Domain Models e DTOs com testes abrangentes.

### 📋 Tarefas

#### Implementar Budget Request Mapper [⏳]

**Descrição**: Mapper para conversão Domain Models ↔ Request DTOs
**Arquivos**:
- `src/application/mappers/budget-request-mapper/budget-request-mapper.ts`
- `src/application/mappers/budget-request-mapper/budget-request-mapper.spec.ts`
- `src/application/mappers/budget-request-mapper/index.ts`

**Dependências**: DTOs de Request e Domain Models
**Testes**: Conversões bidirecionais, validação de dados, error handling

#### Implementar Budget Response Mapper [⏳]

**Descrição**: Mapper para conversão Response DTOs ↔ Domain Models
**Arquivos**:
- `src/application/mappers/budget-response-mapper/budget-response-mapper.ts`
- `src/application/mappers/budget-response-mapper/budget-response-mapper.spec.ts`
- `src/application/mappers/budget-response-mapper/index.ts`

**Complexidade**: Média (utiliza toJSON() e fromJSON() do Budget)
**Validação**: Preserva integridade dos dados durante conversão

#### Implementar Budget Storage Mapper [⏳]

**Descrição**: Mapper para conversão Domain Models ↔ Storage DTOs (IndexedDB)
**Arquivos**:
- `src/application/mappers/budget-storage-mapper/budget-storage-mapper.ts`
- `src/application/mappers/budget-storage-mapper/budget-storage-mapper.spec.ts`
- `src/application/mappers/budget-storage-mapper/index.ts`

**Foco**: Otimização para storage offline, serialização eficiente

### 🧪 Critérios de Validação

- [ ] Todos os mappers implementados com conversões bidirecionais
- [ ] 100% cobertura de testes nos mappers
- [ ] Validação de integridade de dados durante conversões
- [ ] Error handling adequado para dados inválidos
- [ ] Performance otimizada para operações frequentes

### 📝 Comentários da Fase

_[Notas sobre decisões de performance, otimizações de serialização]_

---

## 📅 FASE 4: USE CASES (COMMANDS) [Status: ⏳]

### 🎯 Objetivo da Fase

Implementar todos os Use Cases com lógica de fallback HTTP → offline e error handling robusto.

### 📋 Tarefas

#### CreateBudgetUseCase [⏳]

**Descrição**: Implementar criação de orçamentos com fallback automático
**Arquivos**:
- `src/application/use-cases/create-budget-use-case/create-budget-use-case.ts`
- `src/application/use-cases/create-budget-use-case/create-budget-use-case.spec.ts`
- `src/application/use-cases/create-budget-use-case/index.ts`

**Dependências**: Mappers, Ports, DTOs implementados
**Complexidade**: Alta (lógica de fallback, validation, error handling)
**Lógica**: Try HTTP port → catch → fallback to offline port

#### UpdateBudgetUseCase [⏳]

**Descrição**: Implementar atualização de orçamentos existentes
**Arquivos**:
- `src/application/use-cases/update-budget-use-case/update-budget-use-case.ts`
- `src/application/use-cases/update-budget-use-case/update-budget-use-case.spec.ts`
- `src/application/use-cases/update-budget-use-case/index.ts`

**Validação**: Verificar existência do budget antes de atualizar

#### DeleteBudgetUseCase [⏳]

**Descrição**: Implementar remoção de orçamentos com validações
**Arquivos**:
- `src/application/use-cases/delete-budget-use-case/delete-budget-use-case.ts`
- `src/application/use-cases/delete-budget-use-case/delete-budget-use-case.spec.ts`
- `src/application/use-cases/delete-budget-use-case/index.ts`

**Testes**: Owner validation, business rules, cascade implications

#### AddParticipantToBudgetUseCase [⏳]

**Descrição**: Adicionar participantes a orçamentos compartilhados
**Arquivos**:
- `src/application/use-cases/add-participant-to-budget-use-case/add-participant-to-budget-use-case.ts`
- `src/application/use-cases/add-participant-to-budget-use-case/add-participant-to-budget-use-case.spec.ts`
- `src/application/use-cases/add-participant-to-budget-use-case/index.ts`

**Complexidade**: Média (validation of permissions, duplicate checking)

#### RemoveParticipantFromBudgetUseCase [⏳]

**Descrição**: Remover participantes de orçamentos
**Arquivos**:
- `src/application/use-cases/remove-participant-from-budget-use-case/remove-participant-from-budget-use-case.ts`
- `src/application/use-cases/remove-participant-from-budget-use-case/remove-participant-from-budget-use-case.spec.ts`
- `src/application/use-cases/remove-participant-from-budget-use-case/index.ts`

**Validação**: Cannot remove owner, participant exists validation

### 🧪 Critérios de Validação

- [ ] Todos os Use Cases implementados com fallback HTTP → offline
- [ ] 100% cobertura de testes incluindo cenários de falha
- [ ] Error handling consistente usando Either pattern
- [ ] Validation de business rules em cada Use Case
- [ ] Mocks apropriados para ports HTTP e offline

### 📝 Comentários da Fase

_[Decisões sobre fallback strategy, performance considerations, edge cases encontrados]_

---

## 📅 FASE 5: QUERY HANDLERS [Status: ⏳]

### 🎯 Objetivo da Fase

Implementar Query Handlers para consultas de Budget (gerenciadas via Service Worker).

### 📋 Tarefas

#### ListBudgetsQueryHandler [⏳]

**Descrição**: Implementar listagem paginada de orçamentos do usuário
**Arquivos**:
- `src/application/queries/list-budgets-query-handler/list-budgets-query-handler.ts`
- `src/application/queries/list-budgets-query-handler/list-budgets-query-handler.spec.ts`
- `src/application/queries/list-budgets-query-handler/index.ts`

**Dependências**: Response Mappers, List Budgets Port
**Funcionalidades**: Pagination, filtering, sorting
**Nota**: Service Worker gerencia cache automaticamente

#### BudgetOverviewQueryHandler [⏳]

**Descrição**: Visão geral detalhada de um orçamento específico
**Arquivos**:
- `src/application/queries/budget-overview-query-handler/budget-overview-query-handler.ts`
- `src/application/queries/budget-overview-query-handler/budget-overview-query-handler.spec.ts`
- `src/application/queries/budget-overview-query-handler/index.ts`

**Complexidade**: Média (aggregate data from multiple sources)
**Testes**: Budget not found, permission validation, data consistency

### 🔄 Dependências

- ✅ Fases 1-4 completadas
- Response DTOs e Mappers implementados
- Query Ports definidos

### 📝 Comentários da Fase

_[Notas sobre strategy de cache, otimizações de query, integration com Service Worker]_

---

## 📅 FASE 6: TESTING & INTEGRATION [Status: ⏳]

### 🎯 Objetivo da Fase

Garantir 100% de cobertura de testes, criar test factories reutilizáveis e validar integração completa.

### 📋 Tarefas

#### Criar Test Factories [⏳]

**Descrição**: Factory pattern para dados de teste reutilizáveis
**Arquivos**:
- `src/application/__tests__/factories/budget-test-factory.ts`
- `src/application/__tests__/factories/dto-test-factory.ts`
- `src/application/__tests__/factories/mock-ports-factory.ts`

**Foco**: Reduzir duplicação de código, mocks consistentes

#### Testes de Integração [⏳]

**Descrição**: Testes end-to-end da camada Application com Domain Models
**Arquivos**:
- `src/application/__tests__/integration/budget-application-integration.spec.ts`

**Cobertura**: Use Cases → Mappers → Domain Models flow completo
**Validação**: Dependency injection working, Either pattern consistency

#### Validação de Cobertura [⏳]

**Descrição**: Verificar 100% cobertura de testes unitários
**Testes Necessários**:
- Error scenarios em todos os Use Cases
- Mapper edge cases
- Port failure simulations
- Domain validation propagation

#### Validação de Dependency Rules [⏳]

**Descrição**: Garantir que Application layer não conhece Angular/Infra
**Foco**: Zero imports de @angular/*, zero dependências de bibliotecas externas
**Validação**: TypeScript strict mode, dependency analysis

### 🏁 Entrega Final

- [ ] 100% cobertura de testes unitários
- [ ] Test factories implementados e documentados
- [ ] Testes de integração passando
- [ ] Dependency rules respeitadas (zero violations)
- [ ] Error handling consistente em todo o sistema
- [ ] Performance otimizada para operações críticas

---

## 🔀 Estratégia de Desenvolvimento

### Ordem de Execução

1. **Sequencial Base**: Fases 1 → 2 → 3 (foundation dependencies)
2. **Paralelo Possível**:
   - Fase 4 (Use Cases) pode ser implementada em paralelo após Fase 3
   - Fase 5 (Queries) pode ser implementada em paralelo com Fase 4
3. **Sequencial Final**: Fase 6 (Testing) após todas as outras

### Pontos de Validação

- **Após Fase 1**: TypeScript compilation, path aliases working
- **Após Fase 2**: DTOs e Ports bem definidos, contracts claros
- **Após Fase 3**: Mappers funcionais, conversões sem perda de dados
- **Após Fase 4**: Use Cases com fallback working, Either pattern consistent
- **Após Fase 5**: Queries working, integration with existing patterns
- **Final**: 100% test coverage, zero dependency violations

### Contingências

- **Se mapping complexo**: Simplificar DTOs, usar toJSON/fromJSON do domain
- **Se ports proliferation**: Reorganizar em namespaces, consolidar similares
- **Se test complexity**: Usar factories, mock builders, test utilities

## 🧪 Estratégia de Testes

### Testes por Fase

- **Fase 1**: Type checking, module resolution
- **Fase 2**: Interface compliance, DTO validation
- **Fase 3**: Mapping accuracy, data integrity, performance
- **Fase 4**: Use Case business logic, fallback scenarios, error handling
- **Fase 5**: Query correctness, cache interaction, data consistency
- **Fase 6**: Integration tests, coverage validation, dependency analysis

### Dados de Teste

#### Test Data Strategy
```typescript
// Factory pattern para dados consistentes
BudgetTestFactory.createValidRequestDto()
BudgetTestFactory.createBudgetWithParticipants()
BudgetTestFactory.createHttpPortMock()
BudgetTestFactory.createOfflinePortMock()
```

#### Mock Strategy
- **HTTP Ports**: Mock com Either returns, simulate network failures
- **Offline Ports**: Mock IndexedDB operations, simulate storage errors
- **Domain Models**: Use real Budget.create() for validation accuracy

### Coverage Requirements

- **Unit Tests**: 100% statement, branch, function coverage
- **Integration Tests**: Critical paths, error propagation
- **Edge Cases**: Invalid data, network failures, storage limits

## 📚 Referências e Pesquisas

### Documentação Consultada

- **Domain Models**: `src/models/budget/budget.ts` - Interface e validation patterns
- **Either Pattern**: `src/shared/core/either/either.ts` - Error handling approach
- **Test Patterns**: `src/models/budget/budget.spec.ts` - Testing conventions
- **Path Aliases**: `tsconfig.json` - Module resolution strategy

### Decisões Arquiteturais Durante Planejamento

- **Decisão**: Manter TypeScript puro na Application layer
- **Motivo**: Framework agnostic, facilita testing, respeita dependency rules
- **Impacto**: Zero dependências Angular, imports apenas de domain e shared

- **Decisão**: Usar factories para test data
- **Motivo**: Reduzir boilerplate, manter consistência, facilitar manutenção
- **Impacto**: Setup mais complexo, mas testes mais limpos e reutilizáveis

- **Decisão**: Implementar fallback nos Use Cases vs Service separado
- **Motivo**: Queries gerenciadas via Service Worker, Commands precisam lógica específica
- **Impacto**: Use Cases mais complexos, mas controle fino do fallback

## 🚨 Riscos Identificados

### Riscos Técnicos

- **Risco**: Port proliferation pode aumentar boilerplate excessivamente
- **Probabilidade**: Média
- **Mitigação**: Organizar em namespaces, factory patterns, index files limpos

- **Risco**: Complexity nos mappers pode impactar performance
- **Probabilidade**: Baixa
- **Mitigação**: Usar toJSON/fromJSON do domain, benchmark critical paths

- **Risco**: Test mocking de fallback scenarios pode ser complexo
- **Probabilidade**: Alta
- **Mitigação**: Factory pattern para mocks, test utilities, cenários bem definidos

### Riscos de Dependência

- **Dependência Externa**: Domain Models (Budget, Money, Uuid)
- **Impacto se Mudarem**: Require changes em DTOs e Mappers
- **Plano B**: Versionamento de DTOs, backward compatibility

- **Dependência Externa**: Either pattern implementation
- **Impacto se Mudar**: Breaking changes em toda Application layer
- **Plano B**: Interface própria, adapter pattern

## 📈 Métricas de Progresso

### Por Fase

- **Fase 1**: 8 tarefas, ~3 horas estimadas (setup, infrastructure)
- **Fase 2**: 12 tarefas, ~5 horas estimadas (contracts, interfaces)
- **Fase 3**: 9 tarefas, ~4 horas estimadas (mappers, conversions)
- **Fase 4**: 15 tarefas, ~8 horas estimadas (use cases, complex logic)
- **Fase 5**: 6 tarefas, ~3 horas estimadas (queries, handlers)
- **Fase 6**: 12 tarefas, ~4 horas estimadas (testing, validation)

### Total

- **Tarefas**: 62 tarefas totais
- **Tempo Estimado**: ~27 horas total
- **Marcos**:
  - Fase 1-2: Foundation ready (~8h)
  - Fase 3-4: Core functionality (~12h)
  - Fase 5-6: Complete system (~7h)

### Critérios de Progresso

- **25%**: Infrastructure e DTOs implementados
- **50%**: Mappers e Use Cases principais funcionais
- **75%**: Queries implementados, testes em andamento
- **100%**: Sistema completo, 100% coverage, dependency rules validated