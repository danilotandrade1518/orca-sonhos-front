# Implementar Camada Completa de DTOs para Todas as Entidades do Domínio - Arquitetura Técnica

## 🏗️ Visão Geral da Implementação

### Estado Atual

- **Estrutura de DTOs**: Diretórios criados mas vazios (`/src/dtos/`)
- **Path Aliases**: Configurados para outras camadas, mas não para DTOs
- **TypeScript**: Configurado com strict mode e path aliases existentes
- **Angular**: Configurado para reconhecer path aliases

### Mudanças Propostas

- **Implementação Completa**: Todos os DTOs mapeados na issue OS-18
- **Path Alias @dtos**: Adicionar configuração para imports simplificados
- **Estrutura Organizada**: Organização por contexto de negócio
- **Re-exports**: Centralização de exports com index.ts
- **Testes**: 100% de cobertura de testes

### Impactos

- **Frontend**: Nova camada de DTOs para comunicação com backend
- **TypeScript Config**: Adição de path alias @dtos/\*
- **Angular Config**: Reconhecimento do novo alias
- **Testes**: Estrutura de testes para DTOs

## 🔧 Componentes e Estrutura

### Arquivos Principais a Modificar

- `tsconfig.json`: Adicionar path alias `@dtos/*`
- `tsconfig.app.json`: Herdar configuração do tsconfig.json
- `angular.json`: Já configurado para reconhecer aliases

### Novos Arquivos a Criar

#### Tipos Compartilhados (9 arquivos)

- `src/dtos/shared/Money.ts`: Tipo para valores monetários
- `src/dtos/shared/DateString.ts`: Tipo para datas ISO 8601
- `src/dtos/shared/BaseEntity.ts`: Interface base para entidades
- `src/dtos/shared/TransactionType.ts`: Enum para tipos de transação
- `src/dtos/shared/BudgetStatus.ts`: Enum para status de orçamento
- `src/dtos/shared/AccountType.ts`: Enum para tipos de conta
- `src/dtos/shared/CategoryType.ts`: Enum para tipos de categoria
- `src/dtos/shared/GoalStatus.ts`: Enum para status de metas
- `src/dtos/shared/index.ts`: Re-exports centralizados

#### DTOs de Budget (7 arquivos)

- `src/dtos/budget/request/CreateBudgetRequestDto.ts`
- `src/dtos/budget/request/UpdateBudgetRequestDto.ts`
- `src/dtos/budget/request/AddParticipantRequestDto.ts`
- `src/dtos/budget/request/RemoveParticipantRequestDto.ts`
- `src/dtos/budget/response/BudgetResponseDto.ts`
- `src/dtos/budget/response/BudgetListResponseDto.ts`
- `src/dtos/budget/response/BudgetSummaryResponseDto.ts`

#### DTOs de Transaction (8 arquivos)

- `src/dtos/transaction/request/CreateTransactionRequestDto.ts`
- `src/dtos/transaction/request/UpdateTransactionRequestDto.ts`
- `src/dtos/transaction/request/DeleteTransactionRequestDto.ts`
- `src/dtos/transaction/request/CancelScheduledTransactionRequestDto.ts`
- `src/dtos/transaction/request/MarkTransactionLateRequestDto.ts`
- `src/dtos/transaction/response/TransactionResponseDto.ts`
- `src/dtos/transaction/response/TransactionListResponseDto.ts`
- `src/dtos/transaction/response/TransactionSummaryResponseDto.ts`

#### DTOs de Account (7 arquivos)

- `src/dtos/account/request/CreateAccountRequestDto.ts`
- `src/dtos/account/request/UpdateAccountRequestDto.ts`
- `src/dtos/account/request/DeleteAccountRequestDto.ts`
- `src/dtos/account/request/TransferBetweenAccountsRequestDto.ts`
- `src/dtos/account/request/ReconcileAccountRequestDto.ts`
- `src/dtos/account/response/AccountResponseDto.ts`
- `src/dtos/account/response/AccountListResponseDto.ts`

#### DTOs de Goal (7 arquivos)

- `src/dtos/goal/request/CreateGoalRequestDto.ts`
- `src/dtos/goal/request/UpdateGoalRequestDto.ts`
- `src/dtos/goal/request/DeleteGoalRequestDto.ts`
- `src/dtos/goal/request/AddAmountToGoalRequestDto.ts`
- `src/dtos/goal/request/RemoveAmountFromGoalRequestDto.ts`
- `src/dtos/goal/response/GoalResponseDto.ts`
- `src/dtos/goal/response/GoalListResponseDto.ts`

#### DTOs de Category (5 arquivos)

- `src/dtos/category/request/CreateCategoryRequestDto.ts`
- `src/dtos/category/request/UpdateCategoryRequestDto.ts`
- `src/dtos/category/request/DeleteCategoryRequestDto.ts`
- `src/dtos/category/response/CategoryResponseDto.ts`
- `src/dtos/category/response/CategoryListResponseDto.ts`

#### DTOs de CreditCard (5 arquivos)

- `src/dtos/credit-card/request/CreateCreditCardRequestDto.ts`
- `src/dtos/credit-card/request/UpdateCreditCardRequestDto.ts`
- `src/dtos/credit-card/request/DeleteCreditCardRequestDto.ts`
- `src/dtos/credit-card/response/CreditCardResponseDto.ts`
- `src/dtos/credit-card/response/CreditCardListResponseDto.ts`

#### DTOs de CreditCardBill (8 arquivos)

- `src/dtos/credit-card-bill/request/CreateCreditCardBillRequestDto.ts`
- `src/dtos/credit-card-bill/request/UpdateCreditCardBillRequestDto.ts`
- `src/dtos/credit-card-bill/request/DeleteCreditCardBillRequestDto.ts`
- `src/dtos/credit-card-bill/request/PayCreditCardBillRequestDto.ts`
- `src/dtos/credit-card-bill/request/ReopenCreditCardBillRequestDto.ts`
- `src/dtos/credit-card-bill/response/CreditCardBillResponseDto.ts`
- `src/dtos/credit-card-bill/response/CreditCardBillListResponseDto.ts`

#### DTOs de Envelope (8 arquivos)

- `src/dtos/envelope/request/CreateEnvelopeRequestDto.ts`
- `src/dtos/envelope/request/UpdateEnvelopeRequestDto.ts`
- `src/dtos/envelope/request/DeleteEnvelopeRequestDto.ts`
- `src/dtos/envelope/request/AddAmountToEnvelopeRequestDto.ts`
- `src/dtos/envelope/request/RemoveAmountFromEnvelopeRequestDto.ts`
- `src/dtos/envelope/request/TransferBetweenEnvelopesRequestDto.ts`
- `src/dtos/envelope/response/EnvelopeResponseDto.ts`
- `src/dtos/envelope/response/EnvelopeListResponseDto.ts`

#### Re-exports (9 arquivos)

- `src/dtos/budget/index.ts`
- `src/dtos/transaction/index.ts`
- `src/dtos/account/index.ts`
- `src/dtos/goal/index.ts`
- `src/dtos/category/index.ts`
- `src/dtos/credit-card/index.ts`
- `src/dtos/credit-card-bill/index.ts`
- `src/dtos/envelope/index.ts`
- `src/dtos/index.ts`

### Estrutura de Diretórios

```
/src/dtos/
  /shared/                    # Tipos compartilhados (9 arquivos)
    /money/
      - Money.ts
      - Money.spec.ts
    /date-string/
      - DateString.ts
      - DateString.spec.ts
    /base-entity/
      - BaseEntity.ts
      - BaseEntity.spec.ts
    /transaction-type/
      - TransactionType.ts
      - TransactionType.spec.ts
    /budget-status/
      - BudgetStatus.ts
      - BudgetStatus.spec.ts
    /account-type/
      - AccountType.ts
      - AccountType.spec.ts
    /category-type/
      - CategoryType.ts
      - CategoryType.spec.ts
    /goal-status/
      - GoalStatus.ts
      - GoalStatus.spec.ts
    - index.ts
  /budget/                    # Contexto: Budget Management (7 DTOs)
    /create-budget-request/
      - CreateBudgetRequestDto.ts
      - CreateBudgetRequestDto.spec.ts
    /update-budget-request/
      - UpdateBudgetRequestDto.ts
      - UpdateBudgetRequestDto.spec.ts
    /add-participant-request/
      - AddParticipantRequestDto.ts
      - AddParticipantRequestDto.spec.ts
    /remove-participant-request/
      - RemoveParticipantRequestDto.ts
      - RemoveParticipantRequestDto.spec.ts
    /budget-response/
      - BudgetResponseDto.ts
      - BudgetResponseDto.spec.ts
    /budget-list-response/
      - BudgetListResponseDto.ts
      - BudgetListResponseDto.spec.ts
    /budget-summary-response/
      - BudgetSummaryResponseDto.ts
      - BudgetSummaryResponseDto.spec.ts
    - index.ts
  /transaction/               # Contexto: Transaction Management (8 DTOs)
    /create-transaction-request/
      - CreateTransactionRequestDto.ts
      - CreateTransactionRequestDto.spec.ts
    /update-transaction-request/
      - UpdateTransactionRequestDto.ts
      - UpdateTransactionRequestDto.spec.ts
    /delete-transaction-request/
      - DeleteTransactionRequestDto.ts
      - DeleteTransactionRequestDto.spec.ts
    /cancel-scheduled-transaction-request/
      - CancelScheduledTransactionRequestDto.ts
      - CancelScheduledTransactionRequestDto.spec.ts
    /mark-transaction-late-request/
      - MarkTransactionLateRequestDto.ts
      - MarkTransactionLateRequestDto.spec.ts
    /transaction-response/
      - TransactionResponseDto.ts
      - TransactionResponseDto.spec.ts
    /transaction-list-response/
      - TransactionListResponseDto.ts
      - TransactionListResponseDto.spec.ts
    /transaction-summary-response/
      - TransactionSummaryResponseDto.ts
      - TransactionSummaryResponseDto.spec.ts
    - index.ts
  # ... outras entidades seguem o mesmo padrão
  - index.ts                  # Re-exports globais
```

## 🏛️ Padrões Arquiteturais

### Padrões Seguidos

- **DTO-First Architecture**: DTOs como cidadãos de primeira classe
- **Backend como Fonte da Verdade**: Todas as regras de negócio no backend
- **Simplicidade sobre Abstração**: Evitar mappers complexos desnecessários
- **Alinhamento Total com API**: Contratos bem definidos entre frontend e backend

### 🗂️ Padrão de Organização de DTOs

#### Estrutura Individual por DTO

Cada DTO possui seu próprio diretório contendo:

- **Arquivo principal**: `{DtoName}.ts` - Interface e Helper
- **Arquivo de teste**: `{DtoName}.spec.ts` - Testes unitários
- **Nomenclatura**: Diretório em kebab-case baseado no nome do DTO

#### Exemplo de Estrutura

```
/src/dtos/budget/
  /create-budget-request/
    - CreateBudgetRequestDto.ts
    - CreateBudgetRequestDto.spec.ts
  /update-budget-request/
    - UpdateBudgetRequestDto.ts
    - UpdateBudgetRequestDto.spec.ts
  /budget-response/
    - BudgetResponseDto.ts
    - BudgetResponseDto.spec.ts
  - index.ts
```

#### Vantagens do Padrão

1. **Isolamento**: Cada DTO é independente e autocontido
2. **Manutenibilidade**: Fácil localização e modificação de DTOs específicos
3. **Testabilidade**: Testes sempre próximos ao código que testam
4. **Escalabilidade**: Estrutura clara para crescimento do projeto
5. **Colocação**: Princípio de proximidade - código relacionado fica junto
6. **Imports Limpos**: Imports relativos claros e organizados

#### Convenções de Nomenclatura

- **Diretórios**: kebab-case (ex: `create-budget-request`)
- **Arquivos**: PascalCase (ex: `CreateBudgetRequestDto.ts`)
- **Testes**: Sufixo `.spec.ts` (ex: `CreateBudgetRequestDto.spec.ts`)
- **Imports**: Relativos quando possível, absolutos via `@dtos/*` quando necessário

### Decisões Arquiteturais

- **Decisão**: Money como `number` em centavos
- **Alternativas**: Usar `decimal.js` ou `bigint`
- **Justificativa**: Simplicidade, performance e compatibilidade com JSON

- **Decisão**: DateString como `string` ISO 8601
- **Alternativas**: Usar `Date` objects
- **Justificativa**: Serialização JSON, compatibilidade com APIs

- **Decisão**: Enums como string literals
- **Alternativas**: Usar `enum` TypeScript tradicional
- **Justificativa**: Type-safe, serialização JSON, tree-shaking

- **Decisão**: Organização por contexto de negócio
- **Alternativas**: Organização por tipo técnico (request/response)
- **Justificativa**: Facilita manutenção e descoberta de DTOs

## 📋 Detalhamento Completo dos DTOs - Campos e Tipos

### 🎯 Resumo

Mapeamento detalhado de todos os DTOs identificados no backend, incluindo campos, tipos e relacionamentos para implementação no frontend.

### 🔧 Tipos Compartilhados (Shared Types)

#### Money

```typescript
export type Money = number; // Valores em centavos
```

#### DateString

```typescript
export type DateString = string; // Formato ISO 8601
```

#### BaseEntity

```typescript
export interface BaseEntityDto {
  readonly id: string;
  readonly createdAt: DateString;
  readonly updatedAt: DateString;
}
```

#### Enums

```typescript
// TransactionType
export type TransactionType = 'INCOME' | 'EXPENSE' | 'TRANSFER';

// BudgetType
export type BudgetType = 'PERSONAL' | 'SHARED';

// CategoryType
export type CategoryType = 'INCOME' | 'EXPENSE' | 'TRANSFER';

// AccountType (baseado no schema)
export type AccountType =
  | 'checking'
  | 'savings'
  | 'cash'
  | 'digital_wallet'
  | 'credit_card'
  | 'investment'
  | 'other';

// GoalStatus (baseado no schema)
export type GoalStatus = 'active' | 'completed' | 'paused' | 'cancelled';

// TransactionStatus (baseado no schema)
export type TransactionStatus = 'scheduled' | 'completed' | 'overdue' | 'cancelled';
```

### 📦 DTOs por Entidade

#### 1. Budget DTOs

**CreateBudgetRequestDto**

```typescript
export interface CreateBudgetRequestDto {
  readonly name: string;
  readonly ownerId: string;
  readonly participantIds?: string[];
  readonly type?: BudgetType;
}
```

**UpdateBudgetRequestDto**

```typescript
export interface UpdateBudgetRequestDto {
  readonly userId: string;
  readonly budgetId: string;
  readonly name?: string;
}
```

**AddParticipantRequestDto**

```typescript
export interface AddParticipantRequestDto {
  readonly userId: string;
  readonly budgetId: string;
  readonly participantId: string;
}
```

**RemoveParticipantRequestDto**

```typescript
export interface RemoveParticipantRequestDto {
  readonly userId: string;
  readonly budgetId: string;
  readonly participantId: string;
}
```

**DeleteBudgetRequestDto**

```typescript
export interface DeleteBudgetRequestDto {
  readonly userId: string;
  readonly budgetId: string;
}
```

**BudgetResponseDto**

```typescript
export interface BudgetResponseDto extends BaseEntityDto {
  readonly name: string;
  readonly description?: string;
  readonly type: BudgetType;
  readonly ownerId: string;
  readonly participantIds: string[];
  readonly isActive: boolean;
}
```

**BudgetListResponseDto**

```typescript
export interface BudgetListResponseDto {
  readonly budgets: BudgetResponseDto[];
  readonly total: number;
  readonly page: number;
  readonly pageSize: number;
}
```

**BudgetSummaryResponseDto**

```typescript
export interface BudgetSummaryResponseDto {
  readonly totalBudgets: number;
  readonly activeBudgets: number;
  readonly totalParticipants: number;
  readonly totalTransactions: number;
}
```

#### 2. Transaction DTOs

**CreateTransactionRequestDto**

```typescript
export interface CreateTransactionRequestDto {
  readonly userId: string;
  readonly description: string;
  readonly amount: Money;
  readonly type: TransactionType;
  readonly accountId: string;
  readonly categoryId: string;
  readonly budgetId: string;
  readonly transactionDate?: DateString;
}
```

**UpdateTransactionRequestDto**

```typescript
export interface UpdateTransactionRequestDto {
  readonly userId: string;
  readonly id: string;
  readonly description?: string;
  readonly amount?: Money;
  readonly type?: TransactionType;
  readonly accountId?: string;
  readonly categoryId?: string;
  readonly transactionDate?: DateString;
}
```

**DeleteTransactionRequestDto**

```typescript
export interface DeleteTransactionRequestDto {
  readonly id: string;
  readonly userId: string;
}
```

**CancelScheduledTransactionRequestDto**

```typescript
export interface CancelScheduledTransactionRequestDto {
  readonly userId: string;
  readonly budgetId: string;
  readonly transactionId: string;
  readonly cancellationReason: string;
}
```

**MarkTransactionLateRequestDto**

```typescript
export interface MarkTransactionLateRequestDto {
  readonly transactionId: string;
  readonly lateDate?: DateString;
}
```

**TransactionResponseDto**

```typescript
export interface TransactionResponseDto extends BaseEntityDto {
  readonly userId: string;
  readonly description: string;
  readonly amount: Money;
  readonly type: TransactionType;
  readonly accountId: string;
  readonly categoryId: string;
  readonly budgetId: string;
  readonly transactionDate: DateString;
  readonly status: TransactionStatus;
  readonly paymentMethod?: string;
  readonly isRecurring: boolean;
  readonly recurrencePattern?: string;
}
```

**TransactionListResponseDto**

```typescript
export interface TransactionListResponseDto {
  readonly transactions: TransactionResponseDto[];
  readonly total: number;
  readonly page: number;
  readonly pageSize: number;
  readonly totalPages: number;
  readonly filters?: {
    readonly budgetId?: string;
    readonly accountId?: string;
    readonly categoryId?: string;
    readonly type?: TransactionType;
    readonly dateFrom?: DateString;
    readonly dateTo?: DateString;
  };
}
```

#### 3. Account DTOs

**CreateAccountRequestDto**

```typescript
export interface CreateAccountRequestDto {
  readonly userId: string;
  readonly name: string;
  readonly type: AccountType;
  readonly budgetId: string;
  readonly initialBalance?: Money;
  readonly description?: string;
}
```

**UpdateAccountRequestDto**

```typescript
export interface UpdateAccountRequestDto {
  readonly id: string;
  readonly userId: string;
  readonly name?: string;
  readonly description?: string;
  readonly initialBalance?: Money;
}
```

**DeleteAccountRequestDto**

```typescript
export interface DeleteAccountRequestDto {
  readonly userId: string;
  readonly accountId: string;
}
```

**TransferBetweenAccountsRequestDto**

```typescript
export interface TransferBetweenAccountsRequestDto {
  readonly userId: string;
  readonly fromAccountId: string;
  readonly toAccountId: string;
  readonly amount: Money;
  readonly description?: string;
}
```

**ReconcileAccountRequestDto**

```typescript
export interface ReconcileAccountRequestDto {
  readonly userId: string;
  readonly budgetId: string;
  readonly accountId: string;
  readonly realBalance: Money;
}
```

**AccountResponseDto**

```typescript
export interface AccountResponseDto extends BaseEntityDto {
  readonly userId: string;
  readonly name: string;
  readonly type: AccountType;
  readonly budgetId: string;
  readonly balance: Money;
  readonly creditLimit?: Money;
  readonly isActive: boolean;
  readonly institution?: string;
  readonly description?: string;
}
```

**AccountListResponseDto**

```typescript
export interface AccountListResponseDto {
  readonly accounts: AccountResponseDto[];
  readonly total: number;
  readonly page: number;
  readonly pageSize: number;
}
```

#### 4. Goal DTOs

**CreateGoalRequestDto**

```typescript
export interface CreateGoalRequestDto {
  readonly name: string;
  readonly totalAmount: Money;
  readonly accumulatedAmount?: Money;
  readonly deadline?: DateString;
  readonly budgetId: string;
  readonly sourceAccountId: string;
}
```

**UpdateGoalRequestDto**

```typescript
export interface UpdateGoalRequestDto {
  readonly id: string;
  readonly name: string;
  readonly totalAmount: Money;
  readonly deadline?: DateString;
}
```

**DeleteGoalRequestDto**

```typescript
export interface DeleteGoalRequestDto {
  readonly id: string;
}
```

**AddAmountToGoalRequestDto**

```typescript
export interface AddAmountToGoalRequestDto {
  readonly id: string;
  readonly amount: Money;
  readonly userId: string;
}
```

**RemoveAmountFromGoalRequestDto**

```typescript
export interface RemoveAmountFromGoalRequestDto {
  readonly id: string;
  readonly amount: Money;
  readonly userId: string;
}
```

**GoalResponseDto**

```typescript
export interface GoalResponseDto extends BaseEntityDto {
  readonly name: string;
  readonly description?: string;
  readonly totalAmount: Money;
  readonly currentAmount: Money;
  readonly deadline: DateString;
  readonly budgetId: string;
  readonly sourceAccountId: string;
  readonly status: GoalStatus;
  readonly priority: string;
  readonly category: string;
  readonly isSmartGoal: boolean;
  readonly monthlyContribution?: Money;
}
```

**GoalListResponseDto**

```typescript
export interface GoalListResponseDto {
  readonly goals: GoalResponseDto[];
  readonly total: number;
  readonly page: number;
  readonly pageSize: number;
}
```

#### 5. Category DTOs

**CreateCategoryRequestDto**

```typescript
export interface CreateCategoryRequestDto {
  readonly name: string;
  readonly type: CategoryType;
  readonly budgetId: string;
}
```

**UpdateCategoryRequestDto**

```typescript
export interface UpdateCategoryRequestDto {
  readonly id: string;
  readonly name: string;
  readonly type: CategoryType;
}
```

**DeleteCategoryRequestDto**

```typescript
export interface DeleteCategoryRequestDto {
  readonly id: string;
}
```

**CategoryResponseDto**

```typescript
export interface CategoryResponseDto extends BaseEntityDto {
  readonly name: string;
  readonly type: CategoryType;
  readonly budgetId: string;
  readonly isActive: boolean;
  readonly transactionCount: number;
}
```

**CategoryListResponseDto**

```typescript
export interface CategoryListResponseDto {
  readonly categories: CategoryResponseDto[];
  readonly total: number;
  readonly page: number;
  readonly pageSize: number;
}
```

#### 6. CreditCard DTOs

**CreateCreditCardRequestDto**

```typescript
export interface CreateCreditCardRequestDto {
  readonly name: string;
  readonly limit: Money;
  readonly closingDay: number;
  readonly dueDay: number;
  readonly budgetId: string;
}
```

**UpdateCreditCardRequestDto**

```typescript
export interface UpdateCreditCardRequestDto {
  readonly id: string;
  readonly name: string;
  readonly limit: Money;
  readonly closingDay: number;
  readonly dueDay: number;
}
```

**DeleteCreditCardRequestDto**

```typescript
export interface DeleteCreditCardRequestDto {
  readonly id: string;
}
```

**CreditCardResponseDto**

```typescript
export interface CreditCardResponseDto extends BaseEntityDto {
  readonly name: string;
  readonly limit: Money;
  readonly closingDay: number;
  readonly dueDay: number;
  readonly budgetId: string;
  readonly isActive: boolean;
  readonly currentBalance: Money;
  readonly availableLimit: Money;
}
```

**CreditCardListResponseDto**

```typescript
export interface CreditCardListResponseDto {
  readonly creditCards: CreditCardResponseDto[];
  readonly total: number;
  readonly page: number;
  readonly pageSize: number;
}
```

#### 7. CreditCardBill DTOs

**CreateCreditCardBillRequestDto**

```typescript
export interface CreateCreditCardBillRequestDto {
  readonly creditCardId: string;
  readonly closingDate: DateString;
  readonly dueDate: DateString;
  readonly amount: Money;
}
```

**UpdateCreditCardBillRequestDto**

```typescript
export interface UpdateCreditCardBillRequestDto {
  readonly id: string;
  readonly closingDate: DateString;
  readonly dueDate: DateString;
  readonly amount: Money;
}
```

**DeleteCreditCardBillRequestDto**

```typescript
export interface DeleteCreditCardBillRequestDto {
  readonly id: string;
}
```

**PayCreditCardBillRequestDto**

```typescript
export interface PayCreditCardBillRequestDto {
  readonly userId: string;
  readonly budgetId: string;
  readonly creditCardBillId: string;
  readonly accountId: string;
  readonly amount: Money;
  readonly paymentCategoryId: string;
  readonly paidAt?: DateString;
}
```

**ReopenCreditCardBillRequestDto**

```typescript
export interface ReopenCreditCardBillRequestDto {
  readonly userId: string;
  readonly budgetId: string;
  readonly creditCardBillId: string;
  readonly justification: string;
}
```

**CreditCardBillResponseDto**

```typescript
export interface CreditCardBillResponseDto extends BaseEntityDto {
  readonly creditCardId: string;
  readonly closingDate: DateString;
  readonly dueDate: DateString;
  readonly amount: Money;
  readonly status: string;
  readonly paidAmount: Money;
  readonly remainingAmount: Money;
  readonly isOverdue: boolean;
}
```

**CreditCardBillListResponseDto**

```typescript
export interface CreditCardBillListResponseDto {
  readonly bills: CreditCardBillResponseDto[];
  readonly total: number;
  readonly page: number;
  readonly pageSize: number;
}
```

#### 8. Envelope DTOs

**CreateEnvelopeRequestDto**

```typescript
export interface CreateEnvelopeRequestDto {
  readonly userId: string;
  readonly budgetId: string;
  readonly name: string;
  readonly monthlyLimit: Money;
  readonly categoryId: string;
}
```

**UpdateEnvelopeRequestDto**

```typescript
export interface UpdateEnvelopeRequestDto {
  readonly envelopeId: string;
  readonly userId: string;
  readonly budgetId: string;
  readonly name?: string;
  readonly monthlyLimit?: Money;
}
```

**DeleteEnvelopeRequestDto**

```typescript
export interface DeleteEnvelopeRequestDto {
  readonly envelopeId: string;
  readonly userId: string;
  readonly budgetId: string;
}
```

**AddAmountToEnvelopeRequestDto**

```typescript
export interface AddAmountToEnvelopeRequestDto {
  readonly envelopeId: string;
  readonly userId: string;
  readonly budgetId: string;
  readonly amount: Money;
}
```

**RemoveAmountFromEnvelopeRequestDto**

```typescript
export interface RemoveAmountFromEnvelopeRequestDto {
  readonly envelopeId: string;
  readonly userId: string;
  readonly budgetId: string;
  readonly amount: Money;
}
```

**TransferBetweenEnvelopesRequestDto**

```typescript
export interface TransferBetweenEnvelopesRequestDto {
  readonly sourceEnvelopeId: string;
  readonly targetEnvelopeId: string;
  readonly userId: string;
  readonly budgetId: string;
  readonly amount: Money;
}
```

**EnvelopeResponseDto**

```typescript
export interface EnvelopeResponseDto extends BaseEntityDto {
  readonly userId: string;
  readonly budgetId: string;
  readonly name: string;
  readonly monthlyLimit: Money;
  readonly categoryId: string;
  readonly currentAmount: Money;
  readonly isActive: boolean;
  readonly usagePercentage: number;
  readonly remainingAmount: Money;
}
```

**EnvelopeListResponseDto**

```typescript
export interface EnvelopeListResponseDto {
  readonly envelopes: EnvelopeResponseDto[];
  readonly total: number;
  readonly page: number;
  readonly pageSize: number;
}
```

### 📊 Resumo de Contagem

#### DTOs por Categoria

- **Request DTOs**: 32 arquivos
- **Response DTOs**: 16 arquivos
- **Total de DTOs**: 48 arquivos

#### Tipos Compartilhados

- **Value Objects**: 2 (Money, DateString)
- **Base Types**: 1 (BaseEntity)
- **Enums**: 6 (TransactionType, BudgetType, CategoryType, AccountType, GoalStatus, TransactionStatus)

#### Estrutura de Arquivos

```
/src/dtos/
  /shared/ (18 arquivos - 9 DTOs + 9 testes)
  /budget/ (15 arquivos - 7 DTOs + 7 testes + 1 index)
  /transaction/ (17 arquivos - 8 DTOs + 8 testes + 1 index)
  /account/ (15 arquivos - 7 DTOs + 7 testes + 1 index)
  /goal/ (15 arquivos - 7 DTOs + 7 testes + 1 index)
  /category/ (11 arquivos - 5 DTOs + 5 testes + 1 index)
  /credit-card/ (11 arquivos - 5 DTOs + 5 testes + 1 index)
  /credit-card-bill/ (17 arquivos - 8 DTOs + 8 testes + 1 index)
  /envelope/ (17 arquivos - 8 DTOs + 8 testes + 1 index)
  - index.ts (1 arquivo global)
```

**Total**: 138 arquivos (69 DTOs + 69 testes + 10 index.ts)

## 📦 Dependências e Integrações

### Dependências Existentes

- **TypeScript**: Para type safety e interfaces
- **Angular**: Framework frontend
- **Path Aliases**: Sistema de aliases já configurado

### Novas Dependências

- **Nenhuma**: Apenas TypeScript nativo

### Integrações

- **Backend API**: Contratos de API mapeados na issue OS-18
- **Meta Specs**: Alinhamento com diretrizes arquiteturais
- **Schema entities.yaml**: Entidades do domínio definidas

## 🔄 Fluxo de Dados

### Request Flow

1. **UI Component** → Cria DTO de request
2. **Application Service** → Recebe DTO de request
3. **Infrastructure Adapter** → Serializa DTO para JSON
4. **HTTP Client** → Envia para backend

### Response Flow

1. **HTTP Client** → Recebe JSON do backend
2. **Infrastructure Adapter** → Deserializa JSON para DTO
3. **Application Service** → Retorna DTO de response
4. **UI Component** → Usa DTO diretamente

## 🧪 Considerações de Teste

### Testes Unitários

- **DTOs**: Validação de estrutura e tipos
- **Factories**: Criação de dados de teste
- **Helpers**: Funções utilitárias para formatação

### Testes de Integração

- **Path Aliases**: Funcionamento dos @dtos/\*
- **Re-exports**: Funcionamento dos index.ts
- **Build**: Validação de build sem erros

### Mocks e Fixtures

- **DTO Factories**: Criação de DTOs para testes
- **Test Data**: Dados de exemplo para cada entidade
- **Validation Helpers**: Funções para validar DTOs

## ⚖️ Trade-offs e Riscos

### Trade-offs Aceitos

- **Simplicidade vs Flexibilidade**: DTOs simples vs mappers complexos
- **Performance vs Manutenibilidade**: Imports diretos vs abstrações
- **Type Safety vs Bundle Size**: Tipos explícitos vs código gerado

### Riscos Identificados

- **Desalinhamento com Backend**: Mudanças na API podem quebrar DTOs
- **Performance**: Muitos DTOs podem impactar bundle size
- **Manutenibilidade**: Estrutura complexa pode dificultar manutenção

### Mitigações

- **Validação de Contratos**: Testes de integração com backend
- **Tree Shaking**: Estrutura otimizada para eliminação de código não usado
- **Documentação**: Convenções claras e bem documentadas

## 📋 Lista de Implementação

- [ ] Configurar path alias @dtos/\* no TypeScript
- [ ] Implementar tipos compartilhados (Money, DateString, BaseEntity, Enums)
- [ ] Implementar DTOs de Budget (request e response)
- [ ] Implementar DTOs de Transaction (request e response)
- [ ] Implementar DTOs de Account (request e response)
- [ ] Implementar DTOs de Goal (request e response)
- [ ] Implementar DTOs de Category (request e response)
- [ ] Implementar DTOs de CreditCard (request e response)
- [ ] Implementar DTOs de CreditCardBill (request e response)
- [ ] Implementar DTOs de Envelope (request e response)
- [ ] Configurar re-exports centralizados (index.ts)
- [ ] Implementar testes unitários com 100% de cobertura
- [ ] Validar alinhamento com contratos do backend

## 📚 Referências

- [Meta Specs]: technical/frontend-architecture/dto-first-principles.md
- [Convenções]: technical/frontend-architecture/dto-conventions.md
- [Schema]: schemas/entities.yaml
- [Backend]: Contratos de API mapeados na issue OS-18
