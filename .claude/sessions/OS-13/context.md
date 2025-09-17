# Implementar Modelos Frontend (Domain Layer) - Contexto de Desenvolvimento

## 🎯 Objetivo

Implementar a camada Models (Domain Layer) do frontend OrçaSonhos seguindo Clean Architecture, criando 8 agregados principais como classes TypeScript puras com Value Objects fundamentais e pattern Either para tratamento de resultados/erros.

## 📋 Requisitos Funcionais

### Funcionalidades Principais

- **Value Objects Básicos**: Money, Uuid, Email com validações e imutabilidade
- **Enumerações**: TransactionType, AccountType, CategoryType, BudgetType, BillStatus
- **8 Entities (Agregados)**: Budget, Account, Transaction, Category, CreditCard, CreditCardBill, Envelope, Goal
- **Either Pattern**: Implementação para tratamento de resultados e erros baseada no backend

### Comportamentos Esperados

- **Factory Methods**: Cada entity tem método estático `create()` para criação segura
- **Validações UI/UX**: Validações mínimas focadas em interface, não regras de negócio complexas
- **Serialização**: Métodos `toJSON()` e `fromJSON()` para integração com API
- **Immutabilidade**: Value Objects completamente imutáveis
- **Zero Dependências**: TypeScript puro sem dependências externas

## 🏗️ Considerações Técnicas

### Arquitetura

- **Clean Architecture**: Camada Models independente de frameworks
- **Relacionamentos**: Agregados relacionados via IDs (strings), não referências diretas
- **Organização**: Estrutura `/src/models/` com separação clara por tipo

### Tecnologias e Dependências

- **TypeScript**: Strict mode, puro sem dependências externas
- **Either Pattern**: Copiado do backend para consistência
- **Path Aliases**: `@models/*` e `@either` para imports limpos

### Padrões a Seguir

- **Immutability**: Especialmente em Value Objects
- **Factory Pattern**: `Entity.create()` para criação com validação
- **Validation-First**: Validação obrigatória na criação de objetos
- **Encapsulamento**: Getters readonly, propriedades privadas

## 🧪 Estratégia de Testes

### Testes Necessários

- **Testes Unitários**: 100% cobertura para Value Objects e Entities
- **Testes de Serialização**: Validar toJSON/fromJSON para todas as entities
- **Testes de Validação**: Factory methods e constraints

### Critérios de Aceitação

- [ ] Value Objects (Money, Uuid, Email) implementados e testados
- [ ] Enums (TransactionType, AccountType, CategoryType, BudgetType, BillStatus) implementados
- [ ] Budget entity com propriedades: id, name, ownerId, participantIds, type
- [ ] Account entity com propriedades: id, name, type, budgetId, balance, description
- [ ] Transaction entity com propriedades: id, amount, description, date, type, accountId, categoryId
- [ ] Category entity com propriedades: id, name, type, color, budgetId, active
- [ ] CreditCard entity com propriedades: id, name, limit, closingDay, budgetId
- [ ] CreditCardBill entity com propriedades: id, creditCardId, amount, period, status
- [ ] Envelope entity com propriedades: id, categoryId, balance, limit, budgetId
- [ ] Goal entity com propriedades: id, targetAmount, currentAmount, deadline, accountId, budgetId
- [ ] Either pattern implementado e funcional
- [ ] Path aliases configurados no tsconfig
- [ ] Barrel files com exports organizados
- [ ] Zero dependências externas mantido

## 🔗 Dependências e Impactos

### Sistemas Afetados

- **Frontend Angular**: Nova camada Models como base para toda aplicação
- **tsconfig.app.json**: Novos path aliases para imports limpos
- **Estrutura de Diretórios**: Nova organização `/src/models/` e `/src/shared/core/`

### Integrações Necessárias

- **Either Pattern**: Copiado exatamente do backend para consistência
- **API Serialization**: Métodos toJSON/fromJSON compatíveis com backend DTOs
- **Future Ports/Adapters**: Base para implementação futura de ports HTTP

## 🚧 Restrições e Considerações

### Limitações Técnicas

- **TypeScript Puro**: Zero dependências externas para máxima testabilidade
- **Validações Simples**: Apenas validações de UI/UX, não regras de negócio complexas
- **Money em Centavos**: Valores monetários sempre como inteiros (centavos)
- **Datas ISO**: Serialização de datas como strings ISO para API

### Riscos

- **Sincronização com Backend**: Manter consistência entre models frontend/backend
- **Evolução dos Modelos**: Mudanças futuras precisam manter compatibilidade
- **Complexidade Value Objects**: Balance entre simplicidade e funcionalidade

## 📚 Referências

- **Issue/Card**: OS-13 (Jira)
- **Arquitetura Aprovada**: Comentário no card com arquitetura detalhada
- **Backend Models**: `/home/danilo/workspace/projeto-orca-sonhos/orca-sonhos-back/src/domain/`
- **Either Pattern**: `/home/danilo/workspace/projeto-orca-sonhos/orca-sonhos-back/src/shared/core/either.ts`