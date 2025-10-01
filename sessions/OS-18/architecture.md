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
- **TypeScript Config**: Adição de path alias @dtos/*
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
    - Money.ts
    - DateString.ts
    - BaseEntity.ts
    - TransactionType.ts
    - BudgetStatus.ts
    - AccountType.ts
    - CategoryType.ts
    - GoalStatus.ts
    - index.ts
  /budget/                    # Contexto: Budget Management (7 arquivos)
    /request/
      - CreateBudgetRequestDto.ts
      - UpdateBudgetRequestDto.ts
      - AddParticipantRequestDto.ts
      - RemoveParticipantRequestDto.ts
    /response/
      - BudgetResponseDto.ts
      - BudgetListResponseDto.ts
      - BudgetSummaryResponseDto.ts
    - index.ts
  /transaction/               # Contexto: Transaction Management (8 arquivos)
    /request/
      - CreateTransactionRequestDto.ts
      - UpdateTransactionRequestDto.ts
      - DeleteTransactionRequestDto.ts
      - CancelScheduledTransactionRequestDto.ts
      - MarkTransactionLateRequestDto.ts
    /response/
      - TransactionResponseDto.ts
      - TransactionListResponseDto.ts
      - TransactionSummaryResponseDto.ts
    - index.ts
  # ... outras entidades
  - index.ts                  # Re-exports globais
```

## 🏛️ Padrões Arquiteturais

### Padrões Seguidos

- **DTO-First Architecture**: DTOs como cidadãos de primeira classe
- **Backend como Fonte da Verdade**: Todas as regras de negócio no backend
- **Simplicidade sobre Abstração**: Evitar mappers complexos desnecessários
- **Alinhamento Total com API**: Contratos bem definidos entre frontend e backend

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

- **Path Aliases**: Funcionamento dos @dtos/*
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

- [ ] Configurar path alias @dtos/* no TypeScript
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
