# Implementar Modelos Frontend (Domain Layer) + Testes Automatizados - Plano de Implementação

> **Instruções**: Mantenha este arquivo atualizado conforme o progresso. Marque tarefas como concluídas ✅, em progresso ⏰ ou não iniciadas ⏳.

## 📋 Resumo Executivo

Implementar todos os 8 agregados do domain model como classes TypeScript puras na camada Models (Domain), seguindo a arquitetura Clean Architecture. Estabelecer fundação sólida com Value Objects fundamentais (Money, Uuid, Email) e Either pattern para tratamento de erros, criando a base para todo desenvolvimento futuro do frontend OrçaSonhos.

**EXTENSÃO**: Adicionar testes automatizados abrangentes para todos os models, VOs e Either pattern, garantindo 100% de cobertura e robustez da camada de domínio.

## 🎯 Objetivos da Implementação

- Implementar 8 entities principais do domínio (Budget, Account, Transaction, Category, CreditCard, CreditCardBill, Envelope, Goal)
- Criar Value Objects essenciais (Money, Uuid, Email) com validações básicas
- Estabelecer Either pattern para tratamento consistente de erros
- **NOVO**: Implementar testes automatizados completos com Jasmine/Karma
- **NOVO**: Garantir 100% cobertura de testes para toda camada Models
- **NOVO**: Estabelecer padrões de teste para factory patterns e Either monads
- Configurar estrutura organizacional com barrel files para exports limpos
- Garantir zero dependências externas (TypeScript puro)
- Implementar factory methods com validações para criação segura
- Estabelecer base sólida para desenvolvimento futuro

---

## 📅 FASE 1: Setup Base e Either Pattern [Status: ✅]

### 🎯 Objetivo da Fase

Configurar infraestrutura base e implementar Either pattern copiado do backend para tratamento consistente de erros em todo o frontend.

### 📋 Tarefas

#### Configurar Path Alias @either [✅]

**Descrição**: Adicionar path alias `@either` no tsconfig.json para imports limpos do Either pattern
**Arquivos**: `tsconfig.json`
**Critério de Conclusão**: Path alias configurado e funcionando para imports

#### Implementar Either Pattern [✅]

**Descrição**: Copiar e adaptar a implementação do Either do backend para o frontend
**Arquivos**: `src/shared/core/either.ts`
**Critério de Conclusão**: Either class funcionando com métodos success(), error() e errors()

#### Criar Barrel File Core [✅]

**Descrição**: Criar index.ts para exports organizados da pasta core
**Arquivos**: `src/shared/core/index.ts`
**Dependências**: Either pattern implementado
**Validação**: Import @either/either funciona corretamente

### 🧪 Critérios de Validação

- [x] Path alias @either configurado no tsconfig.json
- [x] Either pattern copiado e funcionando
- [x] Import `import { Either } from '@either'` funciona
- [x] Barrel file exportando Either corretamente
- [x] Zero dependências externas adicionadas

### 📝 Comentários da Fase

_Fase crítica que estabelece fundação para tratamento de erros em todo o projeto. Either pattern deve ser idêntico ao backend para consistência._

**✅ COMPLETADA**: Either pattern implementado com sucesso. Path alias @either configurado e funcionando. Compilação TypeScript passando sem erros.

---

## 📅 FASE 2: Value Objects Fundamentais [Status: ✅]

### 🎯 Objetivo da Fase

Implementar Value Objects essenciais (Money, Uuid, Email) com validações básicas e operações necessárias para UI/UX.

### 📋 Tarefas

#### Implementar Money Value Object [✅]

**Descrição**: Criar classe Money com operações monetárias básicas (soma, subtração, formatação)
**Arquivos**: `src/models/shared/value-objects/money/money.ts`
**Dependências**: Either pattern funcionando
**Complexidade**: Média (operações matemáticas e formatação)

#### Implementar Uuid Value Object [✅]

**Descrição**: Criar classe Uuid com validação de formato e geração
**Arquivos**: `src/models/shared/value-objects/uuid/uuid.ts`
**Dependências**: Either pattern funcionando
**Testes Necessários**: Validação de formato UUID v4

#### Implementar Email Value Object [✅]

**Descrição**: Criar classe Email com validação básica de formato
**Arquivos**: `src/models/shared/value-objects/email/email.ts`
**Dependências**: Either pattern funcionando
**Validação**: Regex básico para formato de email

#### Criar Barrel File Value Objects [✅]

**Descrição**: Organizar exports dos Value Objects via index.ts
**Arquivos**: `src/models/shared/value-objects/index.ts`
**Dependências**: Todos os Value Objects implementados

### 🔄 Dependências

- ✅ Fase 1 completada (Either pattern disponível)
- ✅ Either<Error, ValueObject> para factory methods

### 🧪 Critérios de Validação

- [x] Money com operações básicas (add, subtract, multiply, divide)
- [x] Money com formatação BRL e comparações
- [x] Uuid com validação de formato UUID v4
- [x] Email com validação básica de formato
- [x] Value Objects completamente imutáveis
- [x] Factory methods retornando Either<Error, ValueObject>
- [x] Estrutura organizacional com arquivos separados
- [x] Barrel files exportando corretamente
- [x] Zero dependências externas

### 📝 Comentários da Fase

_Value Objects devem ser completamente imutáveis. Money é o mais complexo por envolver operações matemáticas e formatação brasileira._

**✅ COMPLETADA**: Todos os Value Objects implementados com sucesso. Estrutura reorganizada para comportar testes futuros. Compilação TypeScript passando sem erros.

---

## 📅 FASE 3: Enums de Domínio [Status: ✅]

### 🎯 Objetivo da Fase

Implementar enums necessários para tipagem forte dos domínios (TransactionType, AccountType, CategoryType).

### 📋 Tarefas

#### Implementar TransactionType Enum [✅]

**Descrição**: Enum para tipos de transação (INCOME, EXPENSE)
**Arquivos**: `src/models/shared/enums/transaction-type/transaction-type.ts`
**Foco**: Valores alinhados com backend

#### Implementar AccountType Enum [✅]

**Descrição**: Enum para tipos de conta (CHECKING, SAVINGS, INVESTMENT, CASH)
**Arquivos**: `src/models/shared/enums/account-type/account-type.ts`
**Validação**: Valores consistentes com regras de negócio

#### Implementar CategoryType Enum [✅]

**Descrição**: Enum para tipos de categoria (INCOME, EXPENSE)
**Arquivos**: `src/models/shared/enums/category-type/category-type.ts`
**Critério**: Alinhamento com TransactionType

#### Criar Barrel File Enums [✅]

**Descrição**: Organizar exports dos enums via index.ts
**Arquivos**: `src/models/shared/enums/index.ts`
**Dependências**: Todos os enums implementados

### 🧪 Critérios de Validação

- [x] TransactionType com valores INCOME e EXPENSE
- [x] AccountType com tipos de conta relevantes (CHECKING, SAVINGS, INVESTMENT, CASH)
- [x] CategoryType alinhado com TransactionType
- [x] Barrel file exportando todos os enums
- [x] Helper functions (isValid*, get*Label) implementadas
- [x] Labels em português para UI
- [x] Estrutura organizacional com arquivos separados
- [x] Imports limpos via @models/shared/enums

### 📝 Comentários da Fase

_Enums devem seguir convenções em inglês e valores alinhados com backend para consistência._

**✅ COMPLETADA**: Todos os enums implementados com type safety e helper functions. Estrutura organizacional preparada para testes futuros. Compilação TypeScript passando sem erros.

---

## 📅 FASE 4: Entities Core (Budget e Account) [Status: ⏳]

### 🎯 Objetivo da Fase

Implementar os dois agregados mais fundamentais: Budget e Account, estabelecendo padrões para as demais entities.

### 📋 Tarefas

#### Implementar Budget Aggregate [⏳]

**Descrição**: Criar classe Budget com propriedades básicas e factory method
**Arquivos**: `src/models/budget/budget.ts`
**Dependências**: Value Objects e Either pattern
**Complexidade**: Alta (aggregate principal do sistema)

#### Implementar Account Aggregate [⏳]

**Descrição**: Criar classe Account com propriedades básicas e validações
**Arquivos**: `src/models/account/account.ts`
**Dependências**: Money, AccountType, Either pattern
**Validação**: Balance como Money, tipo como AccountType

#### Testar Factory Methods [⏳]

**Descrição**: Validar que factory methods funcionam com Either pattern
**Foco**: Budget.create() e Account.create() com validações básicas
**Critério**: Retorno Either<Error, Entity> funcionando

### 🔄 Dependências

- ✅ Fase 2 completada (Value Objects disponíveis)
- ✅ Fase 3 completada (Enums disponíveis)
- Money para balance de Account
- Uuid para IDs das entities

### 📝 Comentários da Fase

_Estas são as entities mais críticas. Budget é o aggregate root principal e Account é fundamental para transações._

---

## 📅 FASE 5: Entities Transacionais (Transaction e Category) [Status: ⏳]

### 🎯 Objetivo da Fase

Implementar agregados relacionados às transações financeiras, estabelecendo relacionamentos via IDs.

### 📋 Tarefas

#### Implementar Transaction Aggregate [⏳]

**Descrição**: Criar classe Transaction com propriedades básicas
**Arquivos**: `src/models/transaction/transaction.ts`
**Dependências**: Money, TransactionType, Either pattern
**Complexidade**: Média (relacionamentos com Account e Category)

#### Implementar Category Aggregate [⏳]

**Descrição**: Criar classe Category com propriedades básicas
**Arquivos**: `src/models/category/category.ts`
**Dependências**: CategoryType, Either pattern
**Validação**: Tipo e status ativo/inativo

#### Validar Relacionamentos via IDs [⏳]

**Descrição**: Testar que relacionamentos funcionam usando string IDs
**Foco**: Transaction referencia accountId e categoryId
**Critério**: IDs como strings, sem validação de existência (responsabilidade do backend)

### 🧪 Critérios de Validação

- [ ] Transaction com amount como Money
- [ ] Transaction com type como TransactionType
- [ ] Category com type como CategoryType
- [ ] Relacionamentos via string IDs funcionando
- [ ] Factory methods retornando Either<Error, Entity>

### 📝 Comentários da Fase

_Relacionamentos via IDs string são suficientes para frontend. Validação de existência fica no backend._

---

## 📅 FASE 6: Entities Avançadas (CreditCard, CreditCardBill, Envelope, Goal) [Status: ⏳]

### 🎯 Objetivo da Fase

Implementar agregados mais específicos do domínio financeiro, completando o conjunto de 8 entities.

### 📋 Tarefas

#### Implementar CreditCard Aggregate [⏳]

**Descrição**: Criar classe CreditCard com limite e datas importantes
**Arquivos**: `src/models/credit-card/credit-card.ts`
**Dependências**: Money para limite, Either pattern
**Complexidade**: Média (campos de data e limite)

#### Implementar CreditCardBill Aggregate [⏳]

**Descrição**: Criar classe CreditCardBill para faturas do cartão
**Arquivos**: `src/models/credit-card-bill/credit-card-bill.ts`
**Dependências**: Money, relacionamento com CreditCard
**Validação**: Status da fatura e período

#### Implementar Envelope Aggregate [⏳]

**Descrição**: Criar classe Envelope para envelope budgeting
**Arquivos**: `src/models/envelope/envelope.ts`
**Dependências**: Money, relacionamento com Category
**Foco**: Balance e limite do envelope

#### Implementar Goal Aggregate [⏳]

**Descrição**: Criar classe Goal para metas financeiras
**Arquivos**: `src/models/goal/goal.ts`
**Dependências**: Money para valores, Either pattern
**Validação**: Target amount e current amount

### 🔄 Dependências

- ✅ Fases 1-5 completadas
- Money para todos os valores monetários
- Relacionamentos via string IDs

### 📝 Comentários da Fase

_Entities mais específicas do domínio. CreditCard e Goal podem ter lógicas de UI mais complexas._

---

## 📅 FASE 7: Integração Final e Exports [Status: ⏳]

### 🎯 Objetivo da Fase

Organizar todos os exports via barrel files e validar que toda a API pública funciona corretamente.

### 📋 Tarefas

#### Criar Barrel File Principal [⏳]

**Descrição**: Criar index.ts principal exportando tudo de @models
**Arquivos**: `src/models/index.ts`
**Dependências**: Todas as entities implementadas
**Foco**: API pública limpa e organizada

#### Validar Imports via Path Aliases [⏳]

**Descrição**: Testar que todos os imports funcionam via @models/*
**Testes Necessários**: Import de cada entity e value object
**Critério**: Nenhum erro de compilação TypeScript

#### Documentar API Pública [⏳]

**Descrição**: Documentar principais exports e padrões de uso
**Foco**: Como usar factory methods e Either pattern
**Validação**: Exemplos funcionais para cada entity

### 🏁 Entrega Final

- [ ] Todas as 8 entities implementadas e funcionando
- [ ] Value Objects com operações básicas
- [ ] Either pattern integrado em todas as validações
- [ ] Barrel files organizando exports
- [ ] Zero dependências externas
- [ ] Path aliases funcionando
- [ ] API pública documentada
- [ ] Pronto para testes unitários futuros

---

## 📅 FASE 8: **NOVA** Testes do Either Pattern [Status: ⏳]

### 🎯 Objetivo da Fase

Implementar testes abrangentes para o Either pattern, estabelecendo padrões para testes de monads funcionais.

### 📋 Tarefas

#### Implementar Either Tests - Success Cases [⏳]

**Descrição**: Testar cenários de sucesso do Either pattern
**Arquivos**: `src/shared/core/either.spec.ts`
**Foco**: Either.success(), hasData, data getter
**Padrão**: Testes AAA (Arrange, Act, Assert)

#### Implementar Either Tests - Error Cases [⏳]

**Descrição**: Testar cenários de erro do Either pattern
**Foco**: Either.error(), Either.errors(), hasError, errors getter
**Validação**: Single error e multiple errors scenarios

#### Implementar Either Tests - Edge Cases [⏳]

**Descrição**: Testar casos extremos e invalid states
**Foco**: undefined data, null values, mixed states
**Critério**: 100% cobertura de branches

### 🧪 Critérios de Validação

- [ ] 100% cobertura dos métodos públicos do Either
- [ ] Testes para success/error/errors static methods
- [ ] Testes para getters hasData, hasError, data, errors
- [ ] Edge cases com undefined/null valores
- [ ] Documentação de exemplos de uso

### 📝 Comentários da Fase

_Either é a base de todo tratamento de erros. Testes devem ser extremamente robustos._

---

## 📅 FASE 9: **NOVA** Testes dos Value Objects [Status: ⏳]

### 🎯 Objetivo da Fase

Implementar testes completos para Money, Uuid e Email, focando em operações matemáticas, validações e imutabilidade.

### 📋 Tarefas

#### Implementar Money Tests [⏳]

**Descrição**: Testes completos para operações monetárias
**Arquivos**: `src/models/shared/value-objects/money.spec.ts`
**Foco**: Factory methods, operações aritméticas, formatação, comparações
**Complexidade**: Alta (muitas operações matemáticas)

#### Implementar Uuid Tests [⏳]

**Descrição**: Testes para validação e geração de UUIDs
**Arquivos**: `src/models/shared/value-objects/uuid.spec.ts`
**Foco**: create(), validate(), formato UUID v4, edge cases
**Validação**: Regex patterns, invalid formats

#### Implementar Email Tests [⏳]

**Descrição**: Testes para validação de formato de email
**Arquivos**: `src/models/shared/value-objects/email.spec.ts`
**Foco**: create(), validação regex, casos válidos/inválidos
**Edge Cases**: Emails complexos, Unicode, domínios especiais

#### Testes de Imutabilidade [⏳]

**Descrição**: Garantir que Value Objects são imutáveis
**Foco**: Operações não modificam instância original
**Critério**: Money.add() retorna nova instância, não modifica original

### 🧪 Critérios de Validação

- [ ] Money: 100% cobertura de operações (add, subtract, multiply, divide)
- [ ] Money: Testes de formatação (BRL, cents) e comparações
- [ ] Money: Edge cases (zero, valores grandes, precisão decimal)
- [ ] Uuid: Validação de formato UUID v4 correto
- [ ] Uuid: Rejeição de formatos inválidos
- [ ] Email: Validação de emails válidos/inválidos
- [ ] Imutabilidade garantida em todas as operações

### 📝 Comentários da Fase

_Value Objects são fundamentais. Money precisa de testes extensivos para operações matemáticas. Imutabilidade é crítica._

---

## 📅 FASE 10: **NOVA** Testes dos Enums [Status: ⏳]

### 🎯 Objetivo da Fase

Implementar testes para enums, garantindo valores corretos e consistência com backend.

### 📋 Tarefas

#### Implementar TransactionType Tests [⏳]

**Descrição**: Testes para enum TransactionType
**Arquivos**: `src/models/shared/enums/transaction-type.spec.ts`
**Foco**: Valores INCOME/EXPENSE, type safety

#### Implementar AccountType Tests [⏳]

**Descrição**: Testes para enum AccountType
**Arquivos**: `src/models/shared/enums/account-type.spec.ts`
**Foco**: Valores esperados, completude

#### Implementar CategoryType Tests [⏳]

**Descrição**: Testes para enum CategoryType
**Arquivos**: `src/models/shared/enums/category-type.spec.ts`
**Foco**: Alinhamento com TransactionType

### 🧪 Critérios de Validação

- [ ] Todos os valores de enum testados
- [ ] Consistência entre enums relacionados
- [ ] Type safety garantida
- [ ] Valores alinhados com backend

### 📝 Comentários da Fase

_Enums são simples mas críticos para type safety. Testes garantem consistência._

---

## 📅 FASE 11: **NOVA** Testes das Entities Core [Status: ⏳]

### 🎯 Objetivo da Fase

Implementar testes para Budget e Account, estabelecendo padrões para teste de entities com factory methods.

### 📋 Tarefas

#### Implementar Budget Tests [⏳]

**Descrição**: Testes completos para Budget aggregate
**Arquivos**: `src/models/budget/budget.spec.ts`
**Foco**: Factory methods, validações, getters, Either integration
**Complexidade**: Alta (aggregate principal)

#### Implementar Account Tests [⏳]

**Descrição**: Testes completos para Account aggregate
**Arquivos**: `src/models/account/account.spec.ts`
**Foco**: Factory methods, Money integration, AccountType validation
**Validação**: Balance operations, type constraints

#### Factory Pattern Test Utilities [⏳]

**Descrição**: Criar utilities para testes de factory methods
**Arquivos**: `src/test-utils/factory-test-helpers.ts`
**Foco**: Mock data generators, valid/invalid scenarios
**Reutilização**: Base para outras entities

### 🧪 Critérios de Validação

- [ ] Budget.create() success e error scenarios
- [ ] Account.create() success e error scenarios
- [ ] Validação de propriedades obrigatórias
- [ ] Integration com Money e enums
- [ ] Factory test utilities funcionais

### 📝 Comentários da Fase

_Entities core estabelecem padrões. Factory pattern é crítico para criação segura._

---

## 📅 FASE 12: **NOVA** Testes das Entities Transacionais [Status: ⏳]

### 🎯 Objetivo da Fase

Implementar testes para Transaction e Category, focando em relacionamentos e integração com Value Objects.

### 📋 Tarefas

#### Implementar Transaction Tests [⏳]

**Descrição**: Testes completos para Transaction aggregate
**Arquivos**: `src/models/transaction/transaction.spec.ts`
**Foco**: Money amount, TransactionType, relacionamentos via IDs
**Complexidade**: Média (relacionamentos múltiplos)

#### Implementar Category Tests [⏳]

**Descrição**: Testes completos para Category aggregate
**Arquivos**: `src/models/category/category.spec.ts`
**Foco**: CategoryType validation, active/inactive status
**Validação**: Business rules básicas

#### Testes de Relacionamentos [⏳]

**Descrição**: Validar relacionamentos via string IDs
**Foco**: Transaction ↔ Account, Transaction ↔ Category
**Critério**: IDs são strings válidas, não validação de existência

### 🧪 Critérios de Validação

- [ ] Transaction factory methods com validações
- [ ] Category factory methods com validações
- [ ] Relacionamentos via IDs funcionando
- [ ] Integration com Money e enums
- [ ] Business rules básicas implementadas

### 📝 Comentários da Fase

_Entities transacionais são core do sistema. Relacionamentos via IDs devem ser bem testados._

---

## 📅 FASE 13: **NOVA** Testes das Entities Avançadas [Status: ⏳]

### 🎯 Objetivo da Fase

Implementar testes para CreditCard, CreditCardBill, Envelope e Goal, completando cobertura de todas as entities.

### 📋 Tarefas

#### Implementar CreditCard Tests [⏳]

**Descrição**: Testes para CreditCard aggregate
**Arquivos**: `src/models/credit-card/credit-card.spec.ts`
**Foco**: Money limit, date fields, validações

#### Implementar CreditCardBill Tests [⏳]

**Descrição**: Testes para CreditCardBill aggregate
**Arquivos**: `src/models/credit-card-bill/credit-card-bill.spec.ts`
**Foco**: Money amount, status, period validation

#### Implementar Envelope Tests [⏳]

**Descrição**: Testes para Envelope aggregate
**Arquivos**: `src/models/envelope/envelope.spec.ts`
**Foco**: Money balance/limit, Category relationship

#### Implementar Goal Tests [⏳]

**Descrição**: Testes para Goal aggregate
**Arquivos**: `src/models/goal/goal.spec.ts`
**Foco**: Money amounts, progress calculation, deadline validation

### 🧪 Critérios de Validação

- [ ] CreditCard factory e validações
- [ ] CreditCardBill factory e validações
- [ ] Envelope factory e validações
- [ ] Goal factory e validações
- [ ] Todas integrations com Money testadas
- [ ] Business logic específica de cada entity

### 📝 Comentários da Fase

_Entities avançadas completam o domínio. Cada uma tem regras específicas importantes._

---

## 📅 FASE 14: **NOVA** Testes de Integração e Cobertura [Status: ⏳]

### 🎯 Objetivo da Fase

Implementar testes de integração, validar barrel files e garantir 100% de cobertura de código.

### 📋 Tarefas

#### Testes de Barrel Files [⏳]

**Descrição**: Testar que todos os exports funcionam
**Arquivos**: `src/models/index.spec.ts`, outros barrel tests
**Foco**: Imports via path aliases, API pública
**Validação**: Nenhum export quebrado

#### Testes de Integração Models [⏳]

**Descrição**: Testes cross-entity integration
**Foco**: Budget ↔ Accounts, Transaction ↔ Account/Category
**Critério**: Relacionamentos funcionam end-to-end

#### Cobertura de Código [⏳]

**Descrição**: Garantir 100% cobertura de tests
**Ferramentas**: ng test --code-coverage
**Meta**: 100% coverage em statements, branches, functions
**Validação**: Report de cobertura completo

#### Performance Tests [⏳]

**Descrição**: Testes de performance para operações Money
**Foco**: Operações matemáticas em larga escala
**Critério**: Performance aceitável para Money operations

### 🧪 Critérios de Validação

- [ ] 100% cobertura de código em toda camada Models
- [ ] Todos os barrel files funcionando
- [ ] Testes de integração passando
- [ ] Performance acceptable para operações críticas
- [ ] Zero quebras em imports via path aliases

### 📝 Comentários da Fase

_Fase final garante qualidade total. Cobertura 100% é mandatória para camada de domínio._

---

## 📅 FASE 15: **NOVA** Setup CI/CD e Documentação [Status: ⏳]

### 🎯 Objetivo da Fase

Configurar execução automatizada de testes e documentação final.

### 📋 Tarefas

#### Configurar Test Scripts [⏳]

**Descrição**: Scripts otimizados para execução de testes
**Package.json**: test:models, test:coverage, test:watch
**CI Integration**: Scripts para pipeline

#### Documentação de Testes [⏳]

**Descrição**: Documentar estratégia e padrões de teste
**Arquivos**: `docs/testing-strategy.md`
**Foco**: Padrões estabelecidos, como escrever novos testes

#### Test Data Management [⏳]

**Descrição**: Centralize test data e mock factories
**Arquivos**: `src/test-utils/`
**Organização**: Fixtures, mocks, helpers

### 🏁 Entrega Final Completa

- [ ] Todas as 8 entities implementadas e funcionando
- [ ] Value Objects com operações básicas
- [ ] Either pattern integrado em todas as validações
- [ ] **100% cobertura de testes** em toda camada Models
- [ ] **Testes automatizados** para todos componentes
- [ ] **Factory test patterns** estabelecidos
- [ ] **Either monad testing** patterns estabelecidos
- [ ] Barrel files organizando exports
- [ ] Zero dependências externas
- [ ] Path aliases funcionando
- [ ] API pública documentada
- [ ] **Test suite executando no CI/CD**
- [ ] Pronto para desenvolvimento futuro

---

## 🔀 Estratégia de Desenvolvimento

### Ordem de Execução

1. **Sequencial Base**: Fases 1 → 2 → 3 (dependências claras)
2. **Paralelo Entities**: Fases 4-7 podem ser feitas simultaneamente após Fase 3
3. **Sequencial Testes**: Fases 8-14 devem seguir ordem (Either → VOs → Enums → Entities)
4. **Final**: Fase 15 após todos testes implementados

### Pontos de Validação

- **Após Fase 1**: Either pattern funcionando, path alias configurado
- **Após Fase 3**: Todos os building blocks prontos para entities
- **Após Fase 7**: Todas entities implementadas
- **Após Fase 8**: Either testing patterns estabelecidos
- **Após Fase 11**: Entity testing patterns estabelecidos
- **Após Fase 14**: 100% cobertura alcançada
- **Final**: Testes automatizados completos

### Contingências

- **Se cobertura < 100%**: Identificar gaps e adicionar testes específicos
- **Se testes falharem**: Debug sistemático com isolamento de casos
- **Se performance ruim**: Otimizar operações Money ou usar object pooling

## 🧪 Estratégia de Testes Avançada

### Estrutura de Testes

```
/src
  /test-utils
    factory-helpers.ts
    mock-data.ts
    test-matchers.ts
  /shared/core
    either.spec.ts
  /models
    /shared
      /value-objects
        money.spec.ts
        uuid.spec.ts
        email.spec.ts
      /enums
        transaction-type.spec.ts
        account-type.spec.ts
        category-type.spec.ts
    /budget
      budget.spec.ts
    /account
      account.spec.ts
    # ... outras entities
    index.spec.ts
```

### Padrões de Teste

#### AAA Pattern (Arrange, Act, Assert)
```typescript
describe('Money operations', () => {
  it('should add two Money instances correctly', () => {
    // Arrange
    const money1 = Money.fromCents(100).data!;
    const money2 = Money.fromCents(200).data!;

    // Act
    const result = money1.add(money2);

    // Assert
    expect(result.valueInCents).toBe(300);
  });
});
```

#### Factory Test Pattern
```typescript
describe('Budget factory methods', () => {
  it('should create Budget with valid data', () => {
    // Arrange
    const validData = createValidBudgetData();

    // Act
    const result = Budget.create(validData);

    // Assert
    expect(result.hasData).toBe(true);
    expect(result.data!.name).toBe(validData.name);
  });
});
```

#### Either Testing Pattern
```typescript
describe('Either error handling', () => {
  it('should handle validation errors properly', () => {
    // Arrange
    const invalidData = { amount: -100 };

    // Act
    const result = Money.fromCents(invalidData.amount);

    // Assert
    expect(result.hasError).toBe(true);
    expect(result.errors).toContain('Value cannot be negative');
  });
});
```

### Test Data Management

- **Valid Fixtures**: Dados válidos para cada entity
- **Invalid Fixtures**: Dados inválidos para testes de erro
- **Edge Cases**: Valores limite e casos especiais
- **Mock Factories**: Geradores de dados de teste flexíveis

### Métricas de Qualidade

- **Cobertura**: 100% statements, branches, functions
- **Performance**: Operações Money < 1ms
- **Maintainability**: Testes legíveis e bem organizados
- **Reliability**: Testes determinísticos e rápidos

## 📚 Referências e Pesquisas

### Documentação Consultada

- **Angular Testing Guide**: Oficial Angular.dev testing documentation
- **TypeScript Best Practices 2025**: Modern TypeScript patterns
- **Jasmine/Karma**: Unit testing framework documentation
- **Either Monad Testing**: Functional programming test patterns
- **Factory Pattern Testing**: Design pattern test strategies

### Decisões Arquiteturais Durante Planejamento

- **Either Pattern**: Copiado exatamente do backend para consistência
- **Relacionamentos**: IDs string em vez de Value Objects tipados (simplicidade inicial)
- **Validações**: Foco em UI/UX, não regras de negócio complexas
- **Testes**: 100% cobertura obrigatória para camada de domínio
- **Test Patterns**: AAA pattern + Factory pattern + Either testing

## 🚨 Riscos Identificados

### Riscos Técnicos

- **Complexidade Money**: Operações matemáticas podem ter edge cases
- **Probabilidade**: Média
- **Mitigação**: Testes extensivos para todas operações matemáticas

- **Test Execution Time**: Muitos testes podem ser lentos
- **Probabilidade**: Baixa
- **Mitigação**: Testes unitários rápidos, evitar integration tests pesados

### Riscos de Dependência

- **Jasmine/Karma Setup**: Configuração pode falhar
- **Impacto se Falhar**: Usar Jest como alternativa
- **Plano B**: Configurar Jest se Karma apresentar problemas

## 📈 Métricas de Progresso

### Por Fase

- Fase 1: 3 tarefas, ~2 horas estimadas
- Fase 2: 4 tarefas, ~3 horas estimadas
- Fase 3: 4 tarefas, ~1 hora estimada
- Fase 4: 3 tarefas, ~2 horas estimadas
- Fase 5: 3 tarefas, ~2 horas estimadas
- Fase 6: 4 tarefas, ~3 horas estimadas
- Fase 7: 3 tarefas, ~1 hora estimada
- **Fase 8**: 3 tarefas, ~2 horas estimadas (Either tests)
- **Fase 9**: 4 tarefas, ~4 horas estimadas (VO tests)
- **Fase 10**: 3 tarefas, ~1 hora estimada (Enum tests)
- **Fase 11**: 3 tarefas, ~3 horas estimadas (Core entity tests)
- **Fase 12**: 3 tarefas, ~2 horas estimadas (Transaction entity tests)
- **Fase 13**: 4 tarefas, ~3 horas estimadas (Advanced entity tests)
- **Fase 14**: 4 tarefas, ~3 horas estimadas (Integration & coverage)
- **Fase 15**: 3 tarefas, ~2 horas estimadas (CI/CD & docs)

### Total

- **Tarefas**: 50 tarefas principais
- **Tempo Estimado**: ~35 horas totais
- **Marcos**: Fase 7 (entities completas), Fase 11 (test patterns), Fase 14 (100% coverage), Fase 15 (delivery final)

### Cobertura de Testes

- **Meta**: 100% coverage em statements, branches, functions
- **Escopo**: Toda camada /src/models/ e /src/shared/core/
- **Exclusões**: Apenas interfaces ou types puros (sem lógica)
- **Ferramentas**: Angular CLI test coverage reporting