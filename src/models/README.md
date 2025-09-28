# Models Layer - OrçaSonhos Frontend

## 📚 Public API Documentation

This document describes the public API of the Models layer, which implements the Domain layer of Clean Architecture for the OrçaSonhos application.

## 🏗️ Architecture Overview

The Models layer is built with:

- **Zero external dependencies** (TypeScript only)
- **Either pattern** for error handling
- **Factory methods** for safe object creation
- **Value Objects** for data integrity
- **Immutability** where appropriate

## 📦 Main Exports

### From `@models`

```typescript
// Import everything
import * from '@models';

// Or import specific entities
import { Budget, Account, Transaction, Category } from '@models';
import { CreditCard, CreditCardBill, Envelope, Goal } from '@models';

// Value Objects
import { Money, Uuid, Email } from '@models';

// Enums
import { TransactionType, AccountType, CategoryType } from '@models';

// Either pattern
import { Either } from '@either';
```

## 🏛️ Core Entities

### Budget

**The main aggregate for budget management**

```typescript
import { Budget } from '@models/budget';

// Create a new budget
const budgetResult = Budget.create({
  name: 'Budget Casa',
  limitInCents: 150000, // R$ 1.500,00
  ownerId: 'user-123',
  participantIds: ['user-456', 'user-789'],
  description: 'Orçamento familiar mensal',
  isActive: true,
});

if (budgetResult.hasData) {
  const budget = budgetResult.data!;
  console.log(budget.name); // 'Budget Casa'
  console.log(budget.formatLimit()); // 'R$ 1.500,00'
  console.log(budget.getParticipantCount()); // 3 (owner + 2 participants)
}
```

### Account

**Financial accounts (checking, savings, etc.)**

```typescript
import { Account } from '@models/account';
import { AccountType } from '@models/shared/enums/account-type';

const accountResult = Account.create({
  name: 'Conta Corrente Principal',
  balanceInCents: 50000, // R$ 500,00
  type: AccountType.CHECKING,
  budgetId: 'budget-123',
});

if (accountResult.hasData) {
  const account = accountResult.data!;
  console.log(account.hasPositiveBalance()); // true
  console.log(account.formatBalance()); // 'R$ 500,00'
  console.log(account.getTypeLabel()); // 'Conta Corrente'
}
```

### Transaction

**Financial transactions (income/expense)**

```typescript
import { Transaction } from '@models/transaction';
import { TransactionType } from '@models/shared/enums/transaction-type';

const transactionResult = Transaction.create({
  description: 'Salário',
  amountInCents: 500000, // R$ 5.000,00
  type: TransactionType.INCOME,
  accountId: 'account-123',
  categoryId: 'category-456',
  executedAt: new Date(),
});

if (transactionResult.hasData) {
  const transaction = transactionResult.data!;
  console.log(transaction.isIncome()); // true
  console.log(transaction.formatAmount()); // 'R$ 5.000,00'
  console.log(transaction.getTypeLabel()); // 'Receita'
}
```

## 💰 Value Objects

### Money

**Immutable monetary value representation**

```typescript
import { Money } from '@models/shared/value-objects/money';

// Create from different sources
const money1 = Money.fromMonetary(100.5).data!; // R$ 100,50
const money2 = Money.fromCents(10050).data!; // R$ 100,50
const money3 = Money.zero(); // R$ 0,00

// Operations (immutable)
const sum = money1.add(money2); // R$ 201,00
const difference = money1.subtract(money2); // Either<string, Money>
const product = money1.multiply(2); // Either<string, Money>
const quotient = money1.divide(2); // Either<string, Money>

// Comparisons
console.log(money1.isEqualTo(money2)); // true
console.log(money1.isGreaterThan(money3)); // true

// Formatting
console.log(money1.formatBRL()); // 'R$ 100,50'
console.log(money1.valueInCents); // 10050
console.log(money1.valueInMonetary); // 100.50
```

### Uuid

**UUID v4 validation and generation**

```typescript
import { Uuid } from '@models/shared/value-objects/uuid';

// Generate new UUID
const uuid = Uuid.generate();
console.log(uuid.value); // '123e4567-e89b-12d3-a456-426614174000'

// Validate existing UUID
const uuidResult = Uuid.create('123e4567-e89b-12d3-a456-426614174000');
if (uuidResult.hasData) {
  console.log('Valid UUID:', uuidResult.data!.value);
}
```

### Email

**Email format validation**

```typescript
import { Email } from '@models/shared/value-objects/email';

const emailResult = Email.create('user@example.com');
if (emailResult.hasData) {
  const email = emailResult.data!;
  console.log(email.value); // 'user@example.com'
  console.log(email.domain); // 'example.com'
  console.log(email.localPart); // 'user'
}
```

## 🎯 Enums

### TransactionType

```typescript
import { TransactionType } from '@models/shared/enums/transaction-type';

console.log(TransactionType.INCOME); // 'INCOME'
console.log(TransactionType.EXPENSE); // 'EXPENSE'

// Helper functions
console.log(getTransactionTypeLabel(TransactionType.INCOME)); // 'Receita'
console.log(isValidTransactionType('INCOME')); // true
```

### AccountType

```typescript
import { AccountType } from '@models/shared/enums/account-type';

console.log(AccountType.CHECKING); // 'CHECKING'
console.log(AccountType.SAVINGS); // 'SAVINGS'
console.log(AccountType.INVESTMENT); // 'INVESTMENT'
console.log(AccountType.CASH); // 'CASH'

// Helper functions
console.log(getAccountTypeLabel(AccountType.CHECKING)); // 'Conta Corrente'
```

## ⚡ Either Pattern

**Functional error handling without exceptions**

```typescript
import { Either } from '@either';

// Success case
const successResult = Either.success('Hello World');
console.log(successResult.hasData); // true
console.log(successResult.data); // 'Hello World'
console.log(successResult.hasError); // false

// Error case
const errorResult = Either.error('Something went wrong');
console.log(errorResult.hasError); // true
console.log(errorResult.errors); // ['Something went wrong']
console.log(errorResult.hasData); // false

// Multiple errors
const multiErrorResult = Either.errors(['Error 1', 'Error 2']);
console.log(multiErrorResult.errors); // ['Error 1', 'Error 2']
```

## 🏆 Best Practices

### 1. Always Use Factory Methods

```typescript
// ✅ Correct - uses validation
const moneyResult = Money.fromMonetary(100.5);
if (moneyResult.hasData) {
  const money = moneyResult.data!;
  // Use money safely
}

// ❌ Incorrect - no validation
// const money = new Money(10050); // Constructor is private
```

### 2. Handle Either Results

```typescript
// ✅ Correct - check for errors
const budgetResult = Budget.create(props);
if (budgetResult.hasError) {
  console.error('Validation failed:', budgetResult.errors);
  return;
}
const budget = budgetResult.data!;

// ❌ Incorrect - assume success
// const budget = Budget.create(props).data!; // May be null
```

### 3. Use Path Aliases

```typescript
// ✅ Correct - clean imports
import { Budget, Money } from '@models';
import { Either } from '@either';

// ❌ Incorrect - relative paths
// import { Budget } from './budget/budget';
// import { Money } from './shared/value-objects/money/money';
```

### 4. Leverage Immutability

```typescript
// ✅ Correct - Money operations are immutable
const original = Money.fromMonetary(100).data!;
const doubled = original.multiply(2).data!;
console.log(original.valueInMonetary); // 100 (unchanged)
console.log(doubled.valueInMonetary); // 200

// Value Objects never mutate
```

## 🔗 Advanced Usage

### Chaining Operations

```typescript
import { Money } from '@models';

const calculateTax = (amount: Money, rate: number) => {
  return amount.multiply(rate);
};

const applyDiscount = (amount: Money, discount: Money) => {
  return amount.subtract(discount);
};

// Chain operations with Either pattern
const originalAmount = Money.fromMonetary(1000).data!;
const taxResult = calculateTax(originalAmount, 0.1); // 10% tax

if (taxResult.hasData) {
  const tax = taxResult.data!;
  const totalResult = originalAmount.add(tax);

  const discountResult = Money.fromMonetary(50);
  if (discountResult.hasData) {
    const finalResult = applyDiscount(totalResult, discountResult.data!);
    // Handle final result...
  }
}
```

### Serialization

```typescript
// All entities support JSON serialization
const budget = Budget.create({...}).data!;
const json = budget.toJSON();

// Restore from JSON
const restoredResult = Budget.fromJSON(json);
if (restoredResult.hasData) {
  const restored = restoredResult.data!;
  // Budget restored with all validations
}
```

## 📊 Entity Relationships

```
Budget
├── Account (budgetId)
│   └── Transaction (accountId)
│       └── Category (categoryId)
├── Envelope (budgetId, categoryId)
├── Goal (budgetId)
└── CreditCard (budgetId)
    └── CreditCardBill (creditCardId)
```

**Note**: All relationships use string IDs. Validation of existence is handled by the backend.

## 🚀 Performance Considerations

- **Value Objects**: Lightweight and immutable
- **Factory Methods**: Minimal overhead with validation
- **Either Pattern**: No exception throwing overhead
- **Serialization**: Optimized JSON operations
- **Memory**: No memory leaks with immutable patterns

## 📝 TypeScript Integration

All entities provide full TypeScript support:

- **Strict typing** with no `any` types
- **Interface definitions** for all props
- **Generic Either types** for type safety
- **Readonly properties** where appropriate

```typescript
// TypeScript will catch these errors at compile time
const budget: Budget = Budget.create({
  name: 'Test',
  limitInCents: 'invalid', // ❌ Type error
  ownerId: 123, // ❌ Type error
}).data!;
```
