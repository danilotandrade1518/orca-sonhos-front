# Implementar Modelos Frontend (Domain Layer) - Arquitetura Técnica

## 🏗️ Visão Geral da Implementação

### Estado Atual

Frontend OrçaSonhos com estrutura básica:
- **TypeScript strict mode** ativo e configurado
- **Path aliases** já configurados (`@models/*`, `@application/*`, etc.)
- **Estrutura de diretórios** parcialmente criada (`src/models/`, `src/shared/`)
- **Pastas de entities** criadas mas vazias (budget, account, transaction, etc.)
- **Either pattern** ainda não implementado

### Mudanças Propostas

Implementar a **camada Models (Domain)** completa com:
- **Either pattern** copiado do backend para tratamento de erros
- **8 Entities principais** com factory methods e validações
- **Value Objects fundamentais** (Money, Uuid, Email)
- **Enums necessários** para tipos de domínio
- **Barrel files** para organização dos exports

### Impactos

- **Path alias `@either`** será adicionado para facilitar imports do Either
- **Estrutura `/src/shared/core/`** conterá o Either pattern
- **Estrutura `/src/models/`** será populada com todas as entidades e value objects
- **Validações básicas** para UI/UX implementadas nas entities

## 🔧 Componentes e Estrutura

### Arquivos Principais a Modificar

- **`tsconfig.json`**: Adicionar path alias `@either` para imports limpos
- **`tsconfig.app.json`**: Garantir que types MSW estão corretos

### Novos Arquivos a Criar

#### Core Infrastructure
- **`src/shared/core/either.ts`**: Either pattern copiado do backend
- **`src/shared/core/index.ts`**: Barrel file para exports

#### Value Objects
- **`src/models/shared/value-objects/money.ts`**: Operações monetárias básicas
- **`src/models/shared/value-objects/uuid.ts`**: Identificadores únicos validados
- **`src/models/shared/value-objects/email.ts`**: Validação de formato de email
- **`src/models/shared/value-objects/index.ts`**: Barrel file

#### Enums
- **`src/models/shared/enums/transaction-type.ts`**: Tipos de transação (income/expense)
- **`src/models/shared/enums/account-type.ts`**: Tipos de conta (checking/savings/etc)
- **`src/models/shared/enums/category-type.ts`**: Tipos de categoria (income/expense)
- **`src/models/shared/enums/index.ts`**: Barrel file

#### Entities (8 Agregados)
- **`src/models/budget/budget.ts`**: Aggregate Budget com validações
- **`src/models/account/account.ts`**: Aggregate Account com validações
- **`src/models/transaction/transaction.ts`**: Aggregate Transaction
- **`src/models/category/category.ts`**: Aggregate Category
- **`src/models/credit-card/credit-card.ts`**: Aggregate CreditCard
- **`src/models/credit-card-bill/credit-card-bill.ts`**: Aggregate CreditCardBill
- **`src/models/envelope/envelope.ts`**: Aggregate Envelope
- **`src/models/goal/goal.ts`**: Aggregate Goal
- **`src/models/index.ts`**: Barrel file principal

### Estrutura de Diretórios Final

```
/src
  /shared
    /core
      either.ts
      index.ts
  /models
    /budget
      budget.ts
    /account
      account.ts
    /transaction
      transaction.ts
    /category
      category.ts
    /credit-card
      credit-card.ts
    /credit-card-bill
      credit-card-bill.ts
    /envelope
      envelope.ts
    /goal
      goal.ts
    /shared
      /value-objects
        money.ts
        uuid.ts
        email.ts
        index.ts
      /enums
        transaction-type.ts
        account-type.ts
        category-type.ts
        index.ts
    index.ts
```

## 🏛️ Padrões Arquiteturais

### Padrões Seguidos

- **Clean Architecture**: Domain layer puro, sem dependências externas
- **Either Pattern**: `Either<Error, Data>` para tratamento de resultados
- **Factory Pattern**: Métodos `Entity.create()` para criação segura
- **Immutability**: Value Objects completamente imutáveis
- **Validation-First**: Validação obrigatória na criação

### Decisões Arquiteturais

#### Either Pattern Implementation
- **Decisão**: Copiar exatamente a implementação do backend
- **Alternativas**: Adaptar ou criar nova implementação
- **Justificativa**: Manter consistência entre frontend e backend, pattern já testado

#### Relacionamentos entre Agregados
- **Decisão**: Usar IDs string para referenciar outros agregados
- **Alternativas**: Value Objects tipados (AccountId, BudgetId)
- **Justificativa**: Simplicidade inicial, pode evoluir para VOs tipados

#### Validações de UI
- **Decisão**: Apenas validações importantes para UI/UX
- **Alternativas**: Validações completas de domínio
- **Justificativa**: Regras de negócio complexas ficam no backend

#### Nomenclatura e Idioma
- **Decisão**: Todo código em inglês seguindo meta-specs
- **Alternativas**: Português ou misto
- **Justificativa**: Padrão definido no projeto, consistência profissional

## 📦 Dependências e Integrações

### Dependências Existentes

- **TypeScript**: Já configurado com strict mode
- **Angular**: Framework principal (não usado na camada Models)
- **Path Aliases**: Já configurados no tsconfig.json

### Novas Dependências

- **Nenhuma**: Implementação usa apenas TypeScript puro
- **Zero External Dependencies**: Seguindo princípios de Clean Architecture

### Integrações

- **Path Alias `@either`**: Para imports limpos do Either pattern
- **Barrel Files**: Organização via index.ts em todas as pastas
- **Export Strategy**: Exports principais via `/src/models/index.ts`

## 🔄 Fluxo de Dados

### Criação de Entities

```typescript
// Factory pattern with validation
const budgetResult = Budget.create({
  name: 'Budget Casa',
  limitInCents: 150000, // R$ 1.500,00
  ownerId: 'user-123'
});

if (budgetResult.hasError) {
  // Handle validation errors
  console.error(budgetResult.errors);
} else {
  // Use validated budget
  const budget = budgetResult.data!;
  console.log(budget.id, budget.name);
}
```

### Value Objects Operations

```typescript
// Money operations
const amount1 = Money.fromReais(100.50);
const amount2 = Money.fromCents(5000);
const total = amount1.add(amount2);

console.log(total.formatBRL()); // "R$ 150,50"
```

### Error Handling

```typescript
// Either pattern usage
const validateEmail = (email: string): Either<string, Email> => {
  const emailResult = Email.create(email);

  if (emailResult.hasError) {
    return Either.error('Invalid email format');
  }

  return Either.success(emailResult.data!);
};
```

## 🧪 Considerações de Teste

### Testes Unitários

- **Value Objects**: 100% cobertura para Money, Uuid, Email
- **Entities**: Factory methods, validações e getters
- **Either Pattern**: Success/error scenarios

### Testes de Integração

- **Serialização**: toJSON/fromJSON para todas as entities
- **Validações**: Edge cases e cenários de erro
- **Operações**: Money calculations, UUID generation

### Mocks e Fixtures

- **Valid Data**: Objetos válidos para testes
- **Invalid Data**: Cenários de erro para validações
- **Edge Cases**: Valores limites e casos especiais

## ⚖️ Trade-offs e Riscos

### Trade-offs Aceitos

1. **Simplicidade vs Tipagem**
   - Usar `string` para IDs vs Value Objects tipados
   - Benefício: Implementação mais rápida
   - Custo: Menor type safety

2. **Validações Limitadas**
   - Apenas validações importantes para UI vs validações completas
   - Benefício: Performance e simplicidade
   - Custo: Possível inconsistência com backend

3. **Imutabilidade Parcial**
   - Value Objects imutáveis, Entities com estado mutável
   - Benefício: Flexibilidade para operações
   - Custo: Possível inconsistência de estado

### Riscos Identificados

1. **Divergência com Backend**
   - **Risco**: Models podem ficar inconsistentes com backend
   - **Mitigação**: Validar alinhamento durante desenvolvimento

2. **Performance**
   - **Risco**: Criação de muitos objetos pode impactar performance
   - **Mitigação**: Implementar object pooling se necessário

3. **Complexidade Crescente**
   - **Risco**: Camada pode crescer em complexidade
   - **Mitigação**: Manter foco em regras de UI apenas

## 📋 Lista de Implementação

### Fase 1 - Setup Base
- [ ] Adicionar path alias `@either` no tsconfig.json
- [ ] Implementar Either pattern em `/src/shared/core/either.ts`
- [ ] Criar barrel file `/src/shared/core/index.ts`

### Fase 2 - Value Objects
- [ ] Implementar `Money` com operações básicas
- [ ] Implementar `Uuid` com validação de formato
- [ ] Implementar `Email` com validação de formato
- [ ] Criar barrel file para value objects

### Fase 3 - Enums
- [ ] Implementar `TransactionType` enum
- [ ] Implementar `AccountType` enum
- [ ] Implementar `CategoryType` enum
- [ ] Criar barrel file para enums

### Fase 4 - Entities Core
- [ ] Implementar `Budget` aggregate
- [ ] Implementar `Account` aggregate
- [ ] Testar criação e validações básicas

### Fase 5 - Entities Transacionais
- [ ] Implementar `Transaction` aggregate
- [ ] Implementar `Category` aggregate
- [ ] Validar relacionamentos via IDs

### Fase 6 - Entities Avançadas
- [ ] Implementar `CreditCard` aggregate
- [ ] Implementar `CreditCardBill` aggregate
- [ ] Implementar `Envelope` aggregate
- [ ] Implementar `Goal` aggregate

### Fase 7 - Integração Final
- [ ] Criar barrel file principal `/src/models/index.ts`
- [ ] Validar todos os exports
- [ ] Testar imports via path aliases
- [ ] Documentar API pública

## 📚 Referências

- **Meta Specs**: `/orca-sonhos-meta-specs/technical/frontend-architecture/`
  - `directory-structure.md` - Organização de pastas
  - `layer-responsibilities.md` - Responsabilidades da camada Models
  - `naming-conventions.md` - Convenções de nomenclatura em inglês
- **Backend Reference**: `/orca-sonhos-back/src/shared/core/either.ts`
- **TypeScript Config**: Path aliases já configurados em `tsconfig.json`
- **Issue Jira**: OS-13 com critérios de aceite detalhados