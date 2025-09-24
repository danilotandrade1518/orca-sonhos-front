# Implementar Camada Application para Budget - Arquitetura Técnica

## 🏗️ Visão Geral da Implementação

### Estado Atual

O projeto possui apenas:
- **Domain Models** implementados (Budget, Money, Uuid, Either)
- **UI Angular** conectando diretamente aos models via path alias `@models/*`
- **Either pattern** já implementado em `src/shared/core/either/either.ts`
- **Testing patterns** estabelecidos (describe/it, Arrange/Act/Assert)

### Mudanças Propostas

Criação completa da estrutura `/src/application/` com:
- **5 Use Cases** para operações de comando via HTTP direto
- **2 Query Handlers** para consultas de Budget (outras entities em fase futura)
- **Ports por operação** seguindo Interface Segregation Principle
- **DTOs e Mappers** para conversão entre camadas
- **Error handling** customizado por camada

### Impactos

- **UI Components** receberão Use Cases via Dependency Injection
- **Domain Models** serão consumidos via Application layer
- **Future Infrastructure** implementará os ports definidos
- **Testing Strategy** seguirá padrões existentes com 100% coverage

## 🔧 Componentes e Estrutura

### Novos Arquivos a Criar

#### 1. Base Infrastructure
```
src/application/errors/
├── application-error.ts                 # Base error class
├── budget-not-found-error.ts           # Specific domain errors
├── validation-error.ts                 # Input validation errors
└── network-error.ts                    # Network operation errors

src/application/types/
├── pagination.types.ts                 # Common pagination interfaces
└── network-status.types.ts             # Network status types
```

#### 2. DTOs Structure
```
src/application/dtos/
├── request/
│   ├── create-budget-request.dto.ts    # Input for budget creation
│   ├── update-budget-request.dto.ts    # Input for budget updates
│   └── add-participant-request.dto.ts  # Input for participant management
├── response/
│   ├── budget-response.dto.ts          # Budget API response format
│   ├── budget-list-response.dto.ts     # Paginated budget list response
│   └── budget-overview-response.dto.ts # Detailed budget overview
```

#### 3. Ports (Interfaces)
```
src/application/ports/
├── create-budget.port.ts               # ICreateBudgetPort
├── update-budget.port.ts               # IUpdateBudgetPort
├── delete-budget.port.ts               # IDeleteBudgetPort
├── add-participant-to-budget.port.ts   # IAddParticipantToBudgetPort
├── remove-participant-from-budget.port.ts # IRemoveParticipantFromBudgetPort
├── list-budgets.port.ts                # IListBudgetsPort
└── budget-overview.port.ts             # IBudgetOverviewPort
```

#### 4. Mappers
```
src/application/mappers/
├── budget-request-mapper/
│   ├── budget-request-mapper.ts        # Domain ↔ Request DTOs
│   ├── budget-request-mapper.spec.ts   # Unit tests
│   └── index.ts                        # Export
├── budget-response-mapper/
│   ├── budget-response-mapper.ts       # Response DTOs ↔ Domain
│   ├── budget-response-mapper.spec.ts  # Unit tests
│   └── index.ts                        # Export
```

#### 5. Use Cases (Commands)
```
src/application/use-cases/
├── create-budget-use-case/
│   ├── create-budget-use-case.ts       # Command implementation
│   ├── create-budget-use-case.spec.ts  # Unit tests with mocks
│   └── index.ts                        # Export
├── update-budget-use-case/
├── delete-budget-use-case/
├── add-participant-to-budget-use-case/
└── remove-participant-from-budget-use-case/
```

#### 6. Query Handlers
```
src/application/queries/
├── list-budgets-query-handler/
│   ├── list-budgets-query-handler.ts   # Query implementation
│   ├── list-budgets-query-handler.spec.ts # Unit tests
│   └── index.ts                        # Export
└── budget-overview-query-handler/
    ├── budget-overview-query-handler.ts
    ├── budget-overview-query-handler.spec.ts
    └── index.ts
```

### Estrutura de Diretórios Completa

```
src/application/
├── use-cases/                  # Command operations via HTTP
├── queries/                    # Query operations via HTTP
├── mappers/                    # Domain ↔ DTO conversions
├── ports/                      # Interface definitions per operation
├── dtos/                       # Data Transfer Objects
│   ├── request/               # Input DTOs
│   └── response/              # Output DTOs
├── errors/                     # Application-specific errors
└── types/                      # Common type definitions
```

## 🏛️ Padrões Arquiteturais

### Padrões Seguidos

#### Either Pattern (Existing)
```typescript
// Utilizando implementação existente em src/shared/core/either/either.ts
const result = await useCase.execute(dto);
if (result.hasError) {
  // Handle errors
} else {
  // Use result.data
}
```

#### Testing Pattern (Existing)
```typescript
// Seguindo padrão existente: Arrange/Act/Assert
describe('CreateBudgetUseCase', () => {
  it('should create budget via backend when online', () => {
    // Arrange
    const props = { /* test data */ };

    // Act
    const result = useCase.execute(props);

    // Assert
    expect(result.hasData).toBe(true);
  });
});
```

### Decisões Arquiteturais

#### **Decisão**: Granularidade de Ports por Operação
- **Alternativas**: Port único IBudgetServicePort com todos os métodos
- **Justificativa**: Interface Segregation Principle, máximo 5 métodos por port
- **Implementação**: ICreateBudgetPort, IUpdateBudgetPort, etc.

#### **Decisão**: Comunicação HTTP Direta nos Use Cases
- **Alternativas**: Service dedicado para abstração
- **Justificativa**: Simplicidade do MVP, comunicação direta mais previsível
- **Implementação**: Use Cases comunicam diretamente com ports HTTP

#### **Decisão**: Error Hierarchy ServiceError → ApplicationError → DomainError
- **Alternativas**: Error codes simples
- **Justificativa**: Melhor contexto e debugging, mapeamento claro entre camadas
- **Implementação**: Classes específicas herdando de ApplicationError

#### **Decisão**: DTOs Separados por Contexto
- **Alternativas**: DTOs únicos para request/response
- **Justificativa**: Flexibilidade para evolução de API, contratos bem definidos
- **Implementação**: request/, response/ separados

## 📦 Dependências e Integrações

### Dependências Existentes

```typescript
// Imports utilizando path aliases já configurados
import { Either } from '@either';
import { Budget } from '@models/budget';
import { Money } from '@models/shared/value-objects/money';
import { Uuid } from '@models/shared/value-objects/uuid';
```

### Novas Dependências

**Nenhuma dependência externa adicional** - Mantém projeto limpo usando apenas:
- TypeScript stdlib
- Either pattern existente
- Domain models existentes

### Integrações

#### **Application → Domain**
```typescript
// Use Case utilizando Domain Model
const budgetResult = Budget.create({
  name: dto.name,
  limitInCents: dto.limitInCents,
  ownerId: dto.ownerId
});
```

#### **Future UI → Application**
```typescript
// Component injetando Use Case (implementação futura)
@Component({...})
export class CreateBudgetComponent {
  private createBudgetUseCase = inject(CreateBudgetUseCase);
}
```

## 🔄 Fluxo de Dados

### Command Flow (Use Cases)
```
[UI Component]
    ↓ (CreateBudgetRequestDto)
[CreateBudgetUseCase]
    ↓ (HTTP port)
[ICreateBudgetPort]
    ↓ (success/error)
[Either<ApplicationError, void>]
    ↓ (result)
[UI Component]
```

### Query Flow (HTTP Direct)
```
[UI Component]
    ↓ (BudgetListQuery)
[ListBudgetsQueryHandler]
    ↓ (HTTP port)
[IListBudgetsPort]
    ↓ (HTTP response)
[Either<ApplicationError, BudgetListResponseDto>]
    ↓ (mapped)
[Budget[] Domain Models]
    ↓ (result)
[UI Component]
```

## 🧪 Considerações de Teste

### Testes Unitários

#### **Use Cases Testing Strategy**
```typescript
describe('CreateBudgetUseCase', () => {
  let mockHttpPort: jest.Mocked<ICreateBudgetPort>;

  beforeEach(() => {
    mockHttpPort = {
      createBudget: jest.fn()
    };
  });

  it('should create budget via HTTP successfully', async () => {
    // Arrange
    mockHttpPort.createBudget.mockResolvedValue(Either.success(undefined));

    // Act & Assert
    const result = await useCase.execute(validDto);
    expect(result.hasData).toBe(true);
    expect(mockHttpPort.createBudget).toHaveBeenCalled();
  });

  it('should handle HTTP errors properly', async () => {
    // Arrange
    mockHttpPort.createBudget.mockResolvedValue(Either.error(new NetworkError('Connection failed')));

    // Act & Assert
    const result = await useCase.execute(validDto);
    expect(result.hasError).toBe(true);
    expect(result.errors).toContain('Connection failed');
  });
});
```

### Mocks e Fixtures

#### **Test Data Factory**
```typescript
// test/factories/budget-test-factory.ts
export class BudgetTestFactory {
  static createValidRequestDto(): CreateBudgetRequestDto {
    return {
      name: 'Test Budget',
      limitInCents: 100000,
      ownerId: 'user-123'
    };
  }

  static createHttpPortMock(): jest.Mocked<ICreateBudgetPort> {
    return {
      createBudget: jest.fn()
    };
  }
}
```

## ⚖️ Trade-offs e Riscos

### Trade-offs Aceitos

#### **Boilerplate vs Flexibilidade**
- **Trade-off**: Mais código devido à granularidade dos ports
- **Benefício**: Máxima flexibilidade para implementações específicas
- **Mitigação**: Index files para imports limpos

#### **Complexity vs Maintainability**
- **Trade-off**: Múltiplas camadas de mapeamento
- **Benefício**: Evolução independente de API, Storage e Domain
- **Mitigação**: Mappers bem testados e documentados

### Riscos Identificados

#### **Port Proliferation**
- **Risco**: Muitos ports pequenos podem aumentar boilerplate
- **Mitigação**: Organizar em namespaces por contexto, factory patterns

#### **Test Complexity**
- **Risco**: Mockar comportamento HTTP pode ser complexo
- **Mitigação**: Test factories reutilizáveis, cenários bem definidos

## 📋 Lista de Implementação

### Fase 1: Base Infrastructure
- [ ] Criar estrutura de diretórios base
- [ ] Implementar ApplicationError hierarchy
- [ ] Definir tipos comuns (Pagination, ConnectionStatus)

### Fase 2: DTOs e Contracts
- [ ] Criar DTOs para Request/Response/Internal
- [ ] Definir Ports por operação
- [ ] Implementar Mappers com testes

### Fase 3: Use Cases (Commands)
- [ ] CreateBudgetUseCase com comunicação HTTP direta
- [ ] UpdateBudgetUseCase
- [ ] DeleteBudgetUseCase
- [ ] AddParticipantToBudgetUseCase
- [ ] RemoveParticipantFromBudgetUseCase

### Fase 4: Query Handlers
- [ ] ListBudgetsQueryHandler
- [ ] BudgetOverviewQueryHandler

### Fase 5: Testing & Integration
- [ ] 100% unit test coverage
- [ ] Integration tests com Domain Models
- [ ] Test factories e mocks reutilizáveis

## 📚 Referências

- **Domain Models**: `src/models/budget/budget.ts`
- **Either Pattern**: `src/shared/core/either/either.ts`
- **Test Patterns**: `src/models/budget/budget.spec.ts`
- **Meta Specs**: Clean Architecture + Dependency Rules
- **Path Aliases**: `tsconfig.json` - `@application/*`