# Implementar Modelos Frontend (Domain Layer) - Arquitetura Técnica

## 🏗️ Visão Geral da Implementação

### Estado Atual

Frontend OrçaSonhos em fase inicial:
- Configuração Angular básica com TypeScript strict mode
- Estrutura `/src/app/` básica sem camada de domínio
- Ausência de models ou patterns para tratamento de dados/erros

### Mudanças Propostas

Implementação completa da camada Models seguindo Clean Architecture:
- Nova estrutura `/src/models/` e `/src/shared/core/`
- Either pattern para tratamento de resultados/erros
- 8 agregados principais + Value Objects fundamentais
- Path aliases para imports limpos

### Impactos

- **Fundação Clean Architecture**: Base sólida para toda aplicação frontend
- **Consistência com Backend**: Models alinhados com domain layer do backend
- **Testabilidade**: TypeScript puro 100% testável

## 🔧 Componentes e Estrutura

### Novos Arquivos a Criar

#### Core Infrastructure
- `src/shared/core/either.ts`: Pattern para tratamento de resultados (copiado do backend)
- `src/shared/core/index.ts`: Barrel file para exports

#### Value Objects
- `src/models/shared/value-objects/money/Money.ts`: Operações monetárias básicas
- `src/models/shared/value-objects/uuid/Uuid.ts`: Identificadores únicos com validação
- `src/models/shared/value-objects/email/Email.ts`: Validação de formato de email
- `src/models/shared/value-objects/index.ts`: Barrel file

#### Enumerações
- `src/models/shared/enums/TransactionType.ts`: INCOME, EXPENSE, TRANSFER
- `src/models/shared/enums/AccountType.ts`: CHECKING_ACCOUNT, SAVINGS_ACCOUNT, etc.
- `src/models/shared/enums/CategoryType.ts`: INCOME, EXPENSE
- `src/models/shared/enums/BudgetType.ts`: PERSONAL, SHARED
- `src/models/shared/enums/BillStatus.ts`: PENDING, PAID, OVERDUE
- `src/models/shared/enums/index.ts`: Barrel file

#### Entities (8 Agregados)
- `src/models/budget/Budget.ts`: Entity principal do orçamento
- `src/models/account/Account.ts`: Contas do usuário
- `src/models/transaction/Transaction.ts`: Transações financeiras
- `src/models/category/Category.ts`: Categorias de transação
- `src/models/credit-card/CreditCard.ts`: Cartões de crédito
- `src/models/credit-card-bill/CreditCardBill.ts`: Faturas do cartão
- `src/models/envelope/Envelope.ts`: Envelopes de categoria
- `src/models/goal/Goal.ts`: Metas financeiras

#### Barrel Files e Exports
- `src/models/budget/index.ts`
- `src/models/account/index.ts`
- `src/models/transaction/index.ts`
- `src/models/category/index.ts`
- `src/models/credit-card/index.ts`
- `src/models/credit-card-bill/index.ts`
- `src/models/envelope/index.ts`
- `src/models/goal/index.ts`
- `src/models/index.ts`: Export geral

### Arquivos Principais a Modificar

- `tsconfig.app.json`: Adicionar path aliases `@models/*` e `@either`

### Estrutura de Diretórios

```
src/
├── shared/
│   └── core/
│       ├── either.ts
│       └── index.ts
└── models/
    ├── shared/
    │   ├── value-objects/
    │   │   ├── money/Money.ts
    │   │   ├── uuid/Uuid.ts
    │   │   ├── email/Email.ts
    │   │   └── index.ts
    │   └── enums/
    │       ├── TransactionType.ts
    │       ├── AccountType.ts
    │       ├── CategoryType.ts
    │       ├── BudgetType.ts
    │       ├── BillStatus.ts
    │       └── index.ts
    ├── budget/
    │   ├── Budget.ts
    │   └── index.ts
    ├── account/
    │   ├── Account.ts
    │   └── index.ts
    ├── transaction/
    │   ├── Transaction.ts
    │   └── index.ts
    ├── category/
    │   ├── Category.ts
    │   └── index.ts
    ├── credit-card/
    │   ├── CreditCard.ts
    │   └── index.ts
    ├── credit-card-bill/
    │   ├── CreditCardBill.ts
    │   └── index.ts
    ├── envelope/
    │   ├── Envelope.ts
    │   └── index.ts
    ├── goal/
    │   ├── Goal.ts
    │   └── index.ts
    └── index.ts
```

## 🏛️ Padrões Arquiteturais

### Padrões Seguidos

- **Clean Architecture**: Camada Models independente de frameworks
- **Either Pattern**: Tratamento de resultados idêntico ao backend
- **Factory Pattern**: Métodos `create()` estáticos para criação segura
- **Immutability**: Value Objects completamente imutáveis
- **Validation-First**: Validação obrigatória na criação

### Decisões Arquiteturais

- **Either vs Exceptions**: Either pattern para tratamento funcional de erros
  - **Alternativas**: Try/catch, Result types customizados
  - **Justificativa**: Consistência com backend, programação funcional, previsibilidade

- **TypeScript Puro**: Zero dependências externas
  - **Alternativas**: Usar bibliotecas como Lodash, Ramda
  - **Justificativa**: Máxima testabilidade, performance, controle total

- **IDs como Strings**: Relacionamentos via IDs simples
  - **Alternativas**: Value Objects para IDs, referências diretas
  - **Justificativa**: Simplicidade, compatibilidade com API, serialização fácil

- **Money em Centavos**: Valores monetários como inteiros
  - **Alternativas**: Decimal libraries, float numbers
  - **Justificativa**: Precisão, alinhamento com backend, evitar problemas de float

## 📦 Dependências e Integrações

### Dependências Existentes

Nenhuma - projeto mantém zero dependências externas na camada Models

### Novas Dependências

Nenhuma - implementação 100% TypeScript puro

### Integrações

- **Backend API**: Serialização via toJSON/fromJSON compatível com DTOs do backend
- **Angular Components**: Models consumidos via imports com path aliases
- **Future Ports**: Base para implementação futura de ports/adapters HTTP

## 🔄 Fluxo de Dados

### Criação de Entities
```
DTOs/API Data → Entity.create() → Either<Error, Entity> → Components
```

### Validação e Uso
```
User Input → Value Objects → Validation → Entity Creation → Either Result
```

### Serialização
```
Entity → toJSON() → API DTO
API DTO → Entity.fromJSON() → Entity
```

## 🧪 Considerações de Teste

### Testes Unitários

- **Value Objects**: Criação, validação, imutabilidade, equals
- **Entities**: Factory methods, business rules, serialização
- **Either Pattern**: Success/error flows, error aggregation

### Testes de Integração

- **Serialization Round-trip**: toJSON → fromJSON mantém integridade
- **Cross-boundary**: Models → Components integration

### Mocks e Fixtures

- **Entity Builders**: Factories para teste com dados válidos/inválidos
- **Either Matchers**: Custom matchers para assertions

## ⚖️ Trade-offs e Riscos

### Trade-offs Aceitos

- **Duplicação vs Consistência**: Aceitar alguma duplicação entre frontend/backend para manter independência
- **Simplicidade vs Flexibilidade**: Validações simples privilegiando performance e clareza
- **Type Safety vs Runtime Cost**: Preferir validações em tempo de criação

### Riscos Identificados

- **Drift Backend/Frontend**: Models podem divergir ao longo do tempo
  - **Mitigação**: Testes de integração, documentação compartilhada

- **Over-engineering**: Complexidade desnecessária para cases simples
  - **Mitigação**: Implementação incremental, feedback constante

- **Performance**: Validações em criação podem impactar performance
  - **Mitigação**: Benchmarks, otimizações pontuais se necessário

## 📋 Lista de Implementação

### Fase 1: Setup e Infraestrutura
- [ ] Configurar path aliases no tsconfig.app.json
- [ ] Implementar Either pattern em src/shared/core/either.ts
- [ ] Criar estrutura de diretórios base

### Fase 2: Value Objects Base
- [ ] Implementar Money value object
- [ ] Implementar Uuid value object
- [ ] Implementar Email value object
- [ ] Criar barrel files para value objects

### Fase 3: Enumerações
- [ ] Implementar TransactionType enum
- [ ] Implementar AccountType enum
- [ ] Implementar CategoryType enum
- [ ] Implementar BudgetType enum
- [ ] Implementar BillStatus enum
- [ ] Criar barrel files para enums

### Fase 4: Entities Core
- [ ] Implementar Budget entity
- [ ] Implementar Account entity
- [ ] Testes unitários para entities core

### Fase 5: Entities Transacionais
- [ ] Implementar Transaction entity
- [ ] Implementar Category entity
- [ ] Testes unitários para entities transacionais

### Fase 6: Entities Avançadas
- [ ] Implementar CreditCard entity
- [ ] Implementar CreditCardBill entity
- [ ] Implementar Envelope entity
- [ ] Implementar Goal entity
- [ ] Testes unitários para entities avançadas

### Fase 7: Integração e Finalização
- [ ] Implementar métodos toJSON/fromJSON para todas entities
- [ ] Criar barrel files finais
- [ ] Testes de integração e serialização
- [ ] Documentação de uso

## 📚 Referências

- **Backend Either**: `/home/danilo/workspace/projeto-orca-sonhos/orca-sonhos-back/src/shared/core/either.ts`
- **Backend Models**: `/home/danilo/workspace/projeto-orca-sonhos/orca-sonhos-back/src/domain/aggregates/`
- **Angular Best Practices**: Clean Architecture, TypeScript strict mode
- **Value Objects Pattern**: Domain-Driven Design principles