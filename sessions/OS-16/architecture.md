# Implementar Camada Application para Entidades Restantes do Domínio - Arquitetura Técnica

## 🏗️ Visão Geral da Implementação

### Estado Atual

O projeto possui apenas a camada Application implementada para a entidade Budget, seguindo padrões de Clean Architecture com:

- Use Cases para operações de comando
- Query Handlers para consultas
- Ports para interfaces de comunicação
- DTOs para contratos de entrada/saída
- Mappers para conversão entre camadas
- Either pattern para tratamento de erros

### Mudanças Propostas

Implementação da camada Application completa para 6 entidades restantes:

- **Account**: Contas financeiras
- **Category**: Categorias de transações
- **CreditCard**: Cartões de crédito
- **Envelope**: Envelopes de orçamento
- **Goal**: Metas financeiras
- **Transaction**: Transações financeiras

### Impactos

- **Estrutura de Diretórios**: Criação de novos diretórios seguindo padrão de Budget
- **Index Files**: Atualização de exports em todos os níveis
- **Padrões Arquiteturais**: Manutenção de consistência com implementação existente
- **Preparação para UI**: Base sólida para futuras implementações de interface

## 🔧 Componentes e Estrutura

### Arquivos Principais a Modificar

- `src/application/index.ts`: Adicionar exports das novas entidades
- `src/application/dtos/index.ts`: Exportar novos DTOs
- `src/application/ports/index.ts`: Exportar novos ports
- `src/application/queries/index.ts`: Exportar novos query handlers
- `src/application/use-cases/index.ts`: Exportar novos use cases
- `src/application/mappers/index.ts`: Exportar novos mappers

### Novos Arquivos a Criar

#### Estrutura por Entidade (exemplo: Account)

```
src/application/
├── dtos/
│   └── account/
│       ├── index.ts
│       ├── request/
│       │   ├── create-account-request.dto.ts
│       │   ├── update-account-request.dto.ts
│       │   ├── delete-account-request.dto.ts
│       │   └── index.ts
│       └── response/
│           ├── account-response.dto.ts
│           ├── list-accounts-query-response.dto.ts
│           └── index.ts
├── ports/
│   └── account/
│       ├── create-account.port.ts
│       ├── update-account.port.ts
│       ├── delete-account.port.ts
│       ├── list-accounts.port.ts
│       ├── get-account-by-id.port.ts
│       └── index.ts
├── queries/
│   └── account/
│       ├── list-accounts-query-handler/
│       │   ├── list-accounts-query-handler.ts
│       │   ├── list-accounts-query-handler.spec.ts
│       │   └── index.ts
│       ├── get-account-by-id-query-handler/
│       │   ├── get-account-by-id-query-handler.ts
│       │   ├── get-account-by-id-query-handler.spec.ts
│       │   └── index.ts
│       └── index.ts
├── use-cases/
│   └── account/
│       ├── create-account-use-case/
│       │   ├── create-account-use-case.ts
│       │   ├── create-account-use-case.spec.ts
│       │   └── index.ts
│       ├── update-account-use-case/
│       │   ├── update-account-use-case.ts
│       │   ├── update-account-use-case.spec.ts
│       │   └── index.ts
│       ├── delete-account-use-case/
│       │   ├── delete-account-use-case.ts
│       │   ├── delete-account-use-case.spec.ts
│       │   └── index.ts
│       └── index.ts
└── mappers/
    └── account/
        ├── account-request-mapper/
        │   ├── account-request-mapper.ts
        │   ├── account-request-mapper.spec.ts
        │   └── index.ts
        └── index.ts
```

### Estrutura de Diretórios

**Padrão Consistente**: Cada entidade seguirá exatamente a mesma estrutura de Budget, garantindo:

- Organização clara e previsível
- Facilidade de manutenção
- Consistência arquitetural
- Reutilização de padrões

## 🏛️ Padrões Arquiteturais

### Padrões Seguidos

**Clean Architecture**:

- Separação clara de responsabilidades
- Independência de frameworks
- Testabilidade
- Flexibilidade

**CQRS (Command Query Responsibility Segregation)**:

- Commands (Use Cases) para modificações
- Queries (Query Handlers) para consultas
- Separação clara de responsabilidades

**Ports & Adapters**:

- Ports como interfaces abstratas
- Adapters para implementações concretas
- Inversão de dependência

### Decisões Arquiteturais

- **Decisão**: TypeScript puro na camada Application
- **Alternativas**: Usar Angular services, RxJS
- **Justificativa**: Manter independência de frameworks e facilitar testes

- **Decisão**: Either pattern para tratamento de erros
- **Alternativas**: Exceptions, Result pattern
- **Justificativa**: Tratamento explícito e type-safe de erros

- **Decisão**: Interface Segregation Principle (máximo 5 métodos por Port)
- **Alternativas**: Interfaces grandes com muitos métodos
- **Justificativa**: Facilita manutenção e testabilidade

- **Decisão**: Mappers centralizados por entidade
- **Alternativas**: Mappers distribuídos, conversão inline
- **Justificativa**: Reutilização e manutenção centralizada

## 📦 Dependências e Integrações

### Dependências Existentes

- **Domain Models**: `@models/*` - Entidades do domínio
- **Either Pattern**: `@either` - Tratamento de erros
- **Value Objects**: `@models/shared/value-objects` - Money, Uuid, Email
- **Enums**: `@models/shared/enums` - Tipos específicos

### Novas Dependências

- **Nenhuma dependência externa adicional**
- **TypeScript puro** na camada Application
- **Reutilização** de infraestrutura existente

### Integrações

- **Futuras Implementações de UI**: Via Dependency Injection
- **Infrastructure Layer**: Implementação futura dos Ports
- **Backend HTTP APIs**: Comunicação via Ports (não implementada nesta fase)

## 🔄 Fluxo de Dados

### Padrão de Fluxo por Operação

1. **Request DTO** → Validação de entrada
2. **Mapper** → Conversão para Domain Model
3. **Use Case/Query Handler** → Lógica de negócio
4. **Port** → Interface para camada externa
5. **Response DTO** → Contrato de saída

### Exemplo: Create Account

```
CreateAccountRequestDto
    ↓ (validação)
AccountRequestMapper.fromCreateRequestToAccount()
    ↓ (conversão)
Account.create()
    ↓ (validação de domínio)
CreateAccountUseCase.execute()
    ↓ (orquestração)
ICreateAccountPort.createAccount()
    ↓ (comunicação externa)
AccountResponse
```

## 🧪 Considerações de Teste

### Testes Unitários

**Use Cases**:

- Validação de entrada
- Lógica de negócio
- Tratamento de erros
- Integração com Ports

**Query Handlers**:

- Recuperação de dados
- Filtros e paginação
- Tratamento de erros
- Integração com Ports

**Mappers**:

- Conversão DTO → Domain Model
- Validação de dados
- Tratamento de erros
- Casos extremos

### Testes de Integração

- **Comunicação entre camadas**
- **Fluxo completo de dados**
- **Tratamento de erros end-to-end**

### Mocks e Fixtures

**Factories de Dados**:

- `AccountFactory` - Criação de contas de teste
- `CategoryFactory` - Criação de categorias de teste
- `TransactionFactory` - Criação de transações de teste
- `MockPorts` - Implementações mock dos Ports

## ⚖️ Trade-offs e Riscos

### Trade-offs Aceitos

- **Duplicação de Estrutura**: Muitos arquivos similares
- **Complexidade de Testes**: Muitos componentes para testar
- **Tempo de Implementação**: Implementação extensa

### Riscos Identificados

- **Inconsistência Arquitetural**: Desvio dos padrões estabelecidos
- **Duplicação de Código**: Repetição de lógica similar
- **Manutenibilidade**: Muitos arquivos para manter

### Mitigações

- **Templates e Padrões**: Reutilizar estruturas de Budget
- **Validação Contínua**: Verificar consistência durante implementação
- **Testes Automatizados**: Garantir qualidade
- **Code Review**: Revisão de padrões e qualidade

## 📋 Lista de Implementação

### Fase 1: Estrutura Base

- [ ] Criar diretórios para todas as entidades
- [ ] Implementar DTOs (Request/Response)
- [ ] Definir Ports por operação
- [ ] Criar Mappers básicos

### Fase 2: Use Cases

- [ ] Create{Entity}UseCase para todas as entidades
- [ ] Update{Entity}UseCase para todas as entidades
- [ ] Delete{Entity}UseCase para todas as entidades
- [ ] Testes unitários para todos os Use Cases

### Fase 3: Query Handlers

- [ ] List{Entity}QueryHandler para todas as entidades
- [ ] Get{Entity}ByIdQueryHandler para todas as entidades
- [ ] Testes unitários para todos os Query Handlers

### Fase 4: Integração e Validação

- [ ] Atualizar index files
- [ ] Testes de integração
- [ ] Validação arquitetural
- [ ] Documentação final

## 📚 Referências

- **Meta Specs**: https://github.com/danilotandrade1518/orca-sonhos-meta-specs
- **Implementação Budget**: `/src/application/use-cases/budget/`
- **Domain Models**: `/src/models/`
- **Either Pattern**: `/src/shared/core/either/`
- **Clean Architecture**: Princípios e padrões estabelecidos

## 🎯 Entidades e Operações Detalhadas

### 1. ACCOUNT

#### Use Cases (Commands)

**1.1 CreateAccountUseCase**

```typescript
// Request DTO
interface CreateAccountRequestDto {
  userId: string;
  name: string;
  type: AccountType;
  budgetId: string;
  initialBalance?: number;
  description?: string;
}

// Response DTO
interface CreateAccountResponseDto {
  id: string;
}

// Port
interface ICreateAccountPort {
  createAccount(
    request: CreateAccountRequestDto
  ): Promise<Either<ApplicationError, CreateAccountResponseDto>>;
}
```

**1.2 UpdateAccountUseCase**

```typescript
// Request DTO
interface UpdateAccountRequestDto {
  id: string;
  userId: string;
  name?: string;
  description?: string;
  initialBalance?: number;
}

// Response DTO
interface UpdateAccountResponseDto {
  id: string;
}

// Port
interface IUpdateAccountPort {
  updateAccount(
    request: UpdateAccountRequestDto
  ): Promise<Either<ApplicationError, UpdateAccountResponseDto>>;
}
```

**1.3 DeleteAccountUseCase**

```typescript
// Request DTO
interface DeleteAccountRequestDto {
  id: string;
  userId: string;
}

// Response DTO
interface DeleteAccountResponseDto {
  id: string;
}

// Port
interface IDeleteAccountPort {
  deleteAccount(
    request: DeleteAccountRequestDto
  ): Promise<Either<ApplicationError, DeleteAccountResponseDto>>;
}
```

**1.4 ReconcileAccountUseCase**

```typescript
// Request DTO
interface ReconcileAccountRequestDto {
  userId: string;
  budgetId: string;
  accountId: string;
  realBalance: number;
}

// Response DTO
interface ReconcileAccountResponseDto {
  accountId: string;
  reconciledBalance: number;
}

// Port
interface IReconcileAccountPort {
  reconcileAccount(
    request: ReconcileAccountRequestDto
  ): Promise<Either<ApplicationError, ReconcileAccountResponseDto>>;
}
```

**1.5 TransferBetweenAccountsUseCase**

```typescript
// Request DTO
interface TransferBetweenAccountsRequestDto {
  userId: string;
  fromAccountId: string;
  toAccountId: string;
  amount: number;
  description?: string;
}

// Response DTO
interface TransferBetweenAccountsResponseDto {
  fromAccountId: string;
  toAccountId: string;
  amount: number;
  transferId: string;
}

// Port
interface ITransferBetweenAccountsPort {
  transferBetweenAccounts(
    request: TransferBetweenAccountsRequestDto
  ): Promise<Either<ApplicationError, TransferBetweenAccountsResponseDto>>;
}
```

#### Query Handlers

**1.6 ListAccountsQueryHandler**

```typescript
// Request DTO
interface ListAccountsQueryRequestDto {
  budgetId: string;
  userId: string;
}

// Response DTO
interface ListAccountsQueryResponseDto {
  accounts: AccountSummaryDto[];
}

interface AccountSummaryDto {
  id: string;
  name: string;
  type: AccountType;
  balance: MoneyDto;
  description: string;
  isActive: boolean;
  createdAt: string;
}

// Port
interface IListAccountsPort {
  listAccounts(
    request: ListAccountsQueryRequestDto
  ): Promise<Either<ApplicationError, ListAccountsQueryResponseDto>>;
}
```

**1.7 GetAccountByIdQueryHandler**

```typescript
// Request DTO
interface GetAccountByIdQueryRequestDto {
  accountId: string;
  userId: string;
}

// Response DTO
interface GetAccountByIdQueryResponseDto {
  account: AccountDetailDto;
}

interface AccountDetailDto {
  id: string;
  name: string;
  type: AccountType;
  balance: MoneyDto;
  budgetId: string;
  description: string;
  isActive: boolean;
  createdAt: string;
  transactionCount: number;
  lastTransactionDate?: string;
}

// Port
interface IGetAccountByIdPort {
  getAccountById(
    request: GetAccountByIdQueryRequestDto
  ): Promise<Either<ApplicationError, GetAccountByIdQueryResponseDto>>;
}
```

### 2. CATEGORY

#### Use Cases (Commands)

**2.1 CreateCategoryUseCase**

```typescript
// Request DTO
interface CreateCategoryRequestDto {
  name: string;
  type: CategoryType;
  budgetId: string;
  description?: string;
  color?: string;
  icon?: string;
}

// Response DTO
interface CreateCategoryResponseDto {
  id: string;
}

// Port
interface ICreateCategoryPort {
  createCategory(
    request: CreateCategoryRequestDto
  ): Promise<Either<ApplicationError, CreateCategoryResponseDto>>;
}
```

**2.2 UpdateCategoryUseCase**

```typescript
// Request DTO
interface UpdateCategoryRequestDto {
  id: string;
  name?: string;
  description?: string;
  color?: string;
  icon?: string;
}

// Response DTO
interface UpdateCategoryResponseDto {
  id: string;
}

// Port
interface IUpdateCategoryPort {
  updateCategory(
    request: UpdateCategoryRequestDto
  ): Promise<Either<ApplicationError, UpdateCategoryResponseDto>>;
}
```

**2.3 DeleteCategoryUseCase**

```typescript
// Request DTO
interface DeleteCategoryRequestDto {
  id: string;
  budgetId: string;
}

// Response DTO
interface DeleteCategoryResponseDto {
  id: string;
}

// Port
interface IDeleteCategoryPort {
  deleteCategory(
    request: DeleteCategoryRequestDto
  ): Promise<Either<ApplicationError, DeleteCategoryResponseDto>>;
}
```

#### Query Handlers

**2.4 ListCategoriesQueryHandler**

```typescript
// Request DTO
interface ListCategoriesQueryRequestDto {
  budgetId?: string;
  type?: CategoryType;
}

// Response DTO
interface ListCategoriesQueryResponseDto {
  categories: CategorySummaryDto[];
}

interface CategorySummaryDto {
  id: string;
  name: string;
  type: CategoryType;
  budgetId: string;
  description: string;
  color: string;
  icon: string;
  isActive: boolean;
  createdAt: string;
  transactionCount: number;
}

// Port
interface IListCategoriesPort {
  listCategories(
    request: ListCategoriesQueryRequestDto
  ): Promise<Either<ApplicationError, ListCategoriesQueryResponseDto>>;
}
```

**2.5 GetCategoryByIdQueryHandler**

```typescript
// Request DTO
interface GetCategoryByIdQueryRequestDto {
  categoryId: string;
}

// Response DTO
interface GetCategoryByIdQueryResponseDto {
  category: CategoryDetailDto;
}

interface CategoryDetailDto {
  id: string;
  name: string;
  type: CategoryType;
  budgetId: string;
  description: string;
  color: string;
  icon: string;
  isActive: boolean;
  createdAt: string;
  transactionCount: number;
  totalAmount: MoneyDto;
  lastTransactionDate?: string;
}

// Port
interface IGetCategoryByIdPort {
  getCategoryById(
    request: GetCategoryByIdQueryRequestDto
  ): Promise<Either<ApplicationError, GetCategoryByIdQueryResponseDto>>;
}
```

### 3. CREDIT CARD

#### Use Cases (Commands)

**3.1 CreateCreditCardUseCase**

```typescript
// Request DTO
interface CreateCreditCardRequestDto {
  name: string;
  limit: number;
  closingDay: number;
  dueDay: number;
  budgetId: string;
  brand?: string;
  lastFourDigits?: string;
}

// Response DTO
interface CreateCreditCardResponseDto {
  id: string;
}

// Port
interface ICreateCreditCardPort {
  createCreditCard(
    request: CreateCreditCardRequestDto
  ): Promise<Either<ApplicationError, CreateCreditCardResponseDto>>;
}
```

**3.2 UpdateCreditCardUseCase**

```typescript
// Request DTO
interface UpdateCreditCardRequestDto {
  id: string;
  name?: string;
  limit?: number;
  closingDay?: number;
  dueDay?: number;
  brand?: string;
  lastFourDigits?: string;
}

// Response DTO
interface UpdateCreditCardResponseDto {
  id: string;
}

// Port
interface IUpdateCreditCardPort {
  updateCreditCard(
    request: UpdateCreditCardRequestDto
  ): Promise<Either<ApplicationError, UpdateCreditCardResponseDto>>;
}
```

**3.3 DeleteCreditCardUseCase**

```typescript
// Request DTO
interface DeleteCreditCardRequestDto {
  id: string;
}

// Response DTO
interface DeleteCreditCardResponseDto {
  id: string;
}

// Port
interface IDeleteCreditCardPort {
  deleteCreditCard(
    request: DeleteCreditCardRequestDto
  ): Promise<Either<ApplicationError, DeleteCreditCardResponseDto>>;
}
```

#### Query Handlers

**3.4 ListCreditCardsQueryHandler**

```typescript
// Request DTO
interface ListCreditCardsQueryRequestDto {
  budgetId: string;
}

// Response DTO
interface ListCreditCardsQueryResponseDto {
  creditCards: CreditCardSummaryDto[];
}

interface CreditCardSummaryDto {
  id: string;
  name: string;
  limit: MoneyDto;
  budgetId: string;
  closingDay: number;
  dueDay: number;
  brand: string;
  lastFourDigits: string;
  isActive: boolean;
  createdAt: string;
  currentBalance: MoneyDto;
  availableLimit: MoneyDto;
}

// Port
interface IListCreditCardsPort {
  listCreditCards(
    request: ListCreditCardsQueryRequestDto
  ): Promise<Either<ApplicationError, ListCreditCardsQueryResponseDto>>;
}
```

**3.5 GetCreditCardByIdQueryHandler**

```typescript
// Request DTO
interface GetCreditCardByIdQueryRequestDto {
  creditCardId: string;
}

// Response DTO
interface GetCreditCardByIdQueryResponseDto {
  creditCard: CreditCardDetailDto;
}

interface CreditCardDetailDto {
  id: string;
  name: string;
  limit: MoneyDto;
  budgetId: string;
  closingDay: number;
  dueDay: number;
  brand: string;
  lastFourDigits: string;
  isActive: boolean;
  createdAt: string;
  currentBalance: MoneyDto;
  availableLimit: MoneyDto;
  nextClosingDate: string;
  nextDueDate: string;
  billCount: number;
}

// Port
interface IGetCreditCardByIdPort {
  getCreditCardById(
    request: GetCreditCardByIdQueryRequestDto
  ): Promise<Either<ApplicationError, GetCreditCardByIdQueryResponseDto>>;
}
```

### 4. ENVELOPE

#### Use Cases (Commands)

**4.1 CreateEnvelopeUseCase**

```typescript
// Request DTO
interface CreateEnvelopeRequestDto {
  name: string;
  monthlyLimit: number;
  budgetId: string;
  categoryId: string;
  userId: string;
  description?: string;
}

// Response DTO
interface CreateEnvelopeResponseDto {
  id: string;
}

// Port
interface ICreateEnvelopePort {
  createEnvelope(
    request: CreateEnvelopeRequestDto
  ): Promise<Either<ApplicationError, CreateEnvelopeResponseDto>>;
}
```

**4.2 UpdateEnvelopeUseCase**

```typescript
// Request DTO
interface UpdateEnvelopeRequestDto {
  envelopeId: string;
  userId: string;
  budgetId: string;
  name?: string;
  monthlyLimit?: number;
}

// Response DTO
interface UpdateEnvelopeResponseDto {
  id: string;
}

// Port
interface IUpdateEnvelopePort {
  updateEnvelope(
    request: UpdateEnvelopeRequestDto
  ): Promise<Either<ApplicationError, UpdateEnvelopeResponseDto>>;
}
```

**4.3 DeleteEnvelopeUseCase**

```typescript
// Request DTO
interface DeleteEnvelopeRequestDto {
  envelopeId: string;
  userId: string;
  budgetId: string;
}

// Response DTO
interface DeleteEnvelopeResponseDto {
  id: string;
}

// Port
interface IDeleteEnvelopePort {
  deleteEnvelope(
    request: DeleteEnvelopeRequestDto
  ): Promise<Either<ApplicationError, DeleteEnvelopeResponseDto>>;
}
```

**4.4 AddAmountToEnvelopeUseCase**

```typescript
// Request DTO
interface AddAmountToEnvelopeRequestDto {
  envelopeId: string;
  userId: string;
  budgetId: string;
  amount: number;
}

// Response DTO
interface AddAmountToEnvelopeResponseDto {
  envelopeId: string;
  amount: number;
  newBalance: number;
}

// Port
interface IAddAmountToEnvelopePort {
  addAmountToEnvelope(
    request: AddAmountToEnvelopeRequestDto
  ): Promise<Either<ApplicationError, AddAmountToEnvelopeResponseDto>>;
}
```

**4.5 RemoveAmountFromEnvelopeUseCase**

```typescript
// Request DTO
interface RemoveAmountFromEnvelopeRequestDto {
  envelopeId: string;
  userId: string;
  budgetId: string;
  amount: number;
}

// Response DTO
interface RemoveAmountFromEnvelopeResponseDto {
  envelopeId: string;
  amount: number;
  newBalance: number;
}

// Port
interface IRemoveAmountFromEnvelopePort {
  removeAmountFromEnvelope(
    request: RemoveAmountFromEnvelopeRequestDto
  ): Promise<Either<ApplicationError, RemoveAmountFromEnvelopeResponseDto>>;
}
```

**4.6 TransferBetweenEnvelopesUseCase**

```typescript
// Request DTO
interface TransferBetweenEnvelopesRequestDto {
  sourceEnvelopeId: string;
  targetEnvelopeId: string;
  userId: string;
  budgetId: string;
  amount: number;
}

// Response DTO
interface TransferBetweenEnvelopesResponseDto {
  sourceEnvelopeId: string;
  targetEnvelopeId: string;
  amount: number;
  transferId: string;
}

// Port
interface ITransferBetweenEnvelopesPort {
  transferBetweenEnvelopes(
    request: TransferBetweenEnvelopesRequestDto
  ): Promise<Either<ApplicationError, TransferBetweenEnvelopesResponseDto>>;
}
```

#### Query Handlers

**4.7 ListEnvelopesQueryHandler**

```typescript
// Request DTO
interface ListEnvelopesQueryRequestDto {
  budgetId: string;
  categoryId?: string;
}

// Response DTO
interface ListEnvelopesQueryResponseDto {
  envelopes: EnvelopeSummaryDto[];
}

interface EnvelopeSummaryDto {
  id: string;
  name: string;
  limit: MoneyDto;
  currentBalance: MoneyDto;
  categoryId: string;
  budgetId: string;
  description: string;
  isActive: boolean;
  createdAt: string;
  remainingAmount: MoneyDto;
  usagePercentage: number;
  status: string;
}

// Port
interface IListEnvelopesPort {
  listEnvelopes(
    request: ListEnvelopesQueryRequestDto
  ): Promise<Either<ApplicationError, ListEnvelopesQueryResponseDto>>;
}
```

**4.8 GetEnvelopeByIdQueryHandler**

```typescript
// Request DTO
interface GetEnvelopeByIdQueryRequestDto {
  envelopeId: string;
}

// Response DTO
interface GetEnvelopeByIdQueryResponseDto {
  envelope: EnvelopeDetailDto;
}

interface EnvelopeDetailDto {
  id: string;
  name: string;
  limit: MoneyDto;
  currentBalance: MoneyDto;
  categoryId: string;
  budgetId: string;
  description: string;
  isActive: boolean;
  createdAt: string;
  remainingAmount: MoneyDto;
  usagePercentage: number;
  status: string;
  isOverLimit: boolean;
  isNearLimit: boolean;
  transactionCount: number;
}

// Port
interface IGetEnvelopeByIdPort {
  getEnvelopeById(
    request: GetEnvelopeByIdQueryRequestDto
  ): Promise<Either<ApplicationError, GetEnvelopeByIdQueryResponseDto>>;
}
```

### 5. GOAL

#### Use Cases (Commands)

**5.1 CreateGoalUseCase**

```typescript
// Request DTO
interface CreateGoalRequestDto {
  name: string;
  totalAmount: number;
  accumulatedAmount?: number;
  deadline?: string;
  budgetId: string;
  description?: string;
}

// Response DTO
interface CreateGoalResponseDto {
  id: string;
}

// Port
interface ICreateGoalPort {
  createGoal(
    request: CreateGoalRequestDto
  ): Promise<Either<ApplicationError, CreateGoalResponseDto>>;
}
```

**5.2 UpdateGoalUseCase**

```typescript
// Request DTO
interface UpdateGoalRequestDto {
  id: string;
  name?: string;
  totalAmount?: number;
  deadline?: string;
  description?: string;
}

// Response DTO
interface UpdateGoalResponseDto {
  id: string;
}

// Port
interface IUpdateGoalPort {
  updateGoal(
    request: UpdateGoalRequestDto
  ): Promise<Either<ApplicationError, UpdateGoalResponseDto>>;
}
```

**5.3 DeleteGoalUseCase**

```typescript
// Request DTO
interface DeleteGoalRequestDto {
  id: string;
}

// Response DTO
interface DeleteGoalResponseDto {
  id: string;
}

// Port
interface IDeleteGoalPort {
  deleteGoal(
    request: DeleteGoalRequestDto
  ): Promise<Either<ApplicationError, DeleteGoalResponseDto>>;
}
```

**5.4 AddAmountToGoalUseCase**

```typescript
// Request DTO
interface AddAmountToGoalRequestDto {
  id: string;
  amount: number;
}

// Response DTO
interface AddAmountToGoalResponseDto {
  id: string;
  amount: number;
  newAccumulatedAmount: number;
  progressPercentage: number;
}

// Port
interface IAddAmountToGoalPort {
  addAmountToGoal(
    request: AddAmountToGoalRequestDto
  ): Promise<Either<ApplicationError, AddAmountToGoalResponseDto>>;
}
```

**5.5 RemoveAmountFromGoalUseCase**

```typescript
// Request DTO
interface RemoveAmountFromGoalRequestDto {
  id: string;
  amount: number;
}

// Response DTO
interface RemoveAmountFromGoalResponseDto {
  id: string;
  amount: number;
  newAccumulatedAmount: number;
  progressPercentage: number;
}

// Port
interface IRemoveAmountFromGoalPort {
  removeAmountFromGoal(
    request: RemoveAmountFromGoalRequestDto
  ): Promise<Either<ApplicationError, RemoveAmountFromGoalResponseDto>>;
}
```

#### Query Handlers

**5.6 ListGoalsQueryHandler**

```typescript
// Request DTO
interface ListGoalsQueryRequestDto {
  budgetId: string;
  status?: GoalStatus;
}

// Response DTO
interface ListGoalsQueryResponseDto {
  goals: GoalSummaryDto[];
}

interface GoalSummaryDto {
  id: string;
  name: string;
  targetAmount: MoneyDto;
  currentAmount: MoneyDto;
  budgetId: string;
  targetDate?: string;
  description: string;
  status: GoalStatus;
  createdAt: string;
  remainingAmount: MoneyDto;
  progressPercentage: number;
  isCompleted: boolean;
  isOverdue: boolean;
}

// Port
interface IListGoalsPort {
  listGoals(
    request: ListGoalsQueryRequestDto
  ): Promise<Either<ApplicationError, ListGoalsQueryResponseDto>>;
}
```

**5.7 GetGoalByIdQueryHandler**

```typescript
// Request DTO
interface GetGoalByIdQueryRequestDto {
  goalId: string;
}

// Response DTO
interface GetGoalByIdQueryResponseDto {
  goal: GoalDetailDto;
}

interface GoalDetailDto {
  id: string;
  name: string;
  targetAmount: MoneyDto;
  currentAmount: MoneyDto;
  budgetId: string;
  targetDate?: string;
  description: string;
  status: GoalStatus;
  createdAt: string;
  remainingAmount: MoneyDto;
  progressPercentage: number;
  isCompleted: boolean;
  isOverdue: boolean;
  daysUntilTarget?: number;
  monthlyTargetAmount?: MoneyDto;
}

// Port
interface IGetGoalByIdPort {
  getGoalById(
    request: GetGoalByIdQueryRequestDto
  ): Promise<Either<ApplicationError, GetGoalByIdQueryResponseDto>>;
}
```

### 6. TRANSACTION

#### Use Cases (Commands)

**6.1 CreateTransactionUseCase**

```typescript
// Request DTO
interface CreateTransactionRequestDto {
  userId: string;
  description: string;
  amount: number;
  type: TransactionType;
  accountId: string;
  categoryId: string;
  budgetId: string;
  transactionDate?: string;
}

// Response DTO
interface CreateTransactionResponseDto {
  id: string;
}

// Port
interface ICreateTransactionPort {
  createTransaction(
    request: CreateTransactionRequestDto
  ): Promise<Either<ApplicationError, CreateTransactionResponseDto>>;
}
```

**6.2 UpdateTransactionUseCase**

```typescript
// Request DTO
interface UpdateTransactionRequestDto {
  userId: string;
  id: string;
  description?: string;
  amount?: number;
  type?: TransactionType;
  accountId?: string;
  categoryId?: string;
  transactionDate?: string;
}

// Response DTO
interface UpdateTransactionResponseDto {
  id: string;
}

// Port
interface IUpdateTransactionPort {
  updateTransaction(
    request: UpdateTransactionRequestDto
  ): Promise<Either<ApplicationError, UpdateTransactionResponseDto>>;
}
```

**6.3 DeleteTransactionUseCase**

```typescript
// Request DTO
interface DeleteTransactionRequestDto {
  id: string;
  userId: string;
}

// Response DTO
interface DeleteTransactionResponseDto {
  id: string;
}

// Port
interface IDeleteTransactionPort {
  deleteTransaction(
    request: DeleteTransactionRequestDto
  ): Promise<Either<ApplicationError, DeleteTransactionResponseDto>>;
}
```

**6.4 CancelScheduledTransactionUseCase**

```typescript
// Request DTO
interface CancelScheduledTransactionRequestDto {
  userId: string;
  budgetId: string;
  transactionId: string;
  cancellationReason: string;
}

// Response DTO
interface CancelScheduledTransactionResponseDto {
  transactionId: string;
  cancellationReason: string;
  cancelledAt: string;
}

// Port
interface ICancelScheduledTransactionPort {
  cancelScheduledTransaction(
    request: CancelScheduledTransactionRequestDto
  ): Promise<Either<ApplicationError, CancelScheduledTransactionResponseDto>>;
}
```

**6.5 MarkTransactionLateUseCase**

```typescript
// Request DTO
interface MarkTransactionLateRequestDto {
  transactionId: string;
  lateDate?: string;
}

// Response DTO
interface MarkTransactionLateResponseDto {
  transactionId: string;
  lateDate: string;
}

// Port
interface IMarkTransactionLatePort {
  markTransactionLate(
    request: MarkTransactionLateRequestDto
  ): Promise<Either<ApplicationError, MarkTransactionLateResponseDto>>;
}
```

#### Query Handlers

**6.6 ListTransactionsQueryHandler**

```typescript
// Request DTO
interface ListTransactionsQueryRequestDto {
  budgetId: string;
  accountId?: string;
  categoryId?: string;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  pageSize?: number;
}

// Response DTO
interface ListTransactionsQueryResponseDto {
  transactions: TransactionSummaryDto[];
  pagination: PaginationDto;
}

interface TransactionSummaryDto {
  id: string;
  amount: MoneyDto;
  type: TransactionType;
  accountId: string;
  categoryId: string;
  description: string;
  executedAt: string;
  isRecurring: boolean;
  createdAt: string;
  accountName: string;
  categoryName: string;
}

interface PaginationDto {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

// Port
interface IListTransactionsPort {
  listTransactions(
    request: ListTransactionsQueryRequestDto
  ): Promise<Either<ApplicationError, ListTransactionsQueryResponseDto>>;
}
```

**6.7 GetTransactionByIdQueryHandler**

```typescript
// Request DTO
interface GetTransactionByIdQueryRequestDto {
  transactionId: string;
}

// Response DTO
interface GetTransactionByIdQueryResponseDto {
  transaction: TransactionDetailDto;
}

interface TransactionDetailDto {
  id: string;
  amount: MoneyDto;
  type: TransactionType;
  accountId: string;
  categoryId: string;
  description: string;
  executedAt: string;
  isRecurring: boolean;
  createdAt: string;
  accountName: string;
  categoryName: string;
  budgetId: string;
  isLate: boolean;
  lateDate?: string;
}

// Port
interface IGetTransactionByIdPort {
  getTransactionById(
    request: GetTransactionByIdQueryRequestDto
  ): Promise<Either<ApplicationError, GetTransactionByIdQueryResponseDto>>;
}
```

## 📊 Resumo de Componentes

### Use Cases (42 total)

- **Account**: 5 Use Cases
- **Category**: 3 Use Cases
- **CreditCard**: 3 Use Cases
- **Envelope**: 6 Use Cases
- **Goal**: 5 Use Cases
- **Transaction**: 5 Use Cases

### Query Handlers (18 total)

- **Account**: 2 Query Handlers
- **Category**: 2 Query Handlers
- **CreditCard**: 2 Query Handlers
- **Envelope**: 2 Query Handlers
- **Goal**: 2 Query Handlers
- **Transaction**: 2 Query Handlers

### Ports (60 total)

- **Account**: 10 Ports
- **Category**: 6 Ports
- **CreditCard**: 6 Ports
- **Envelope**: 12 Ports
- **Goal**: 10 Ports
- **Transaction**: 10 Ports

### DTOs (120+ total)

- Request DTOs para cada Use Case
- Response DTOs para cada Query Handler
- DTOs de apoio (MoneyDto, PaginationDto, etc.)

### Mappers (6 total)

- 1 Mapper por entidade para conversão Domain ↔ DTO
