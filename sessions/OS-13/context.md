# Implementar Modelos Frontend (Domain Layer) - Contexto de Desenvolvimento

## 🎯 Objetivo

Implementar todos os 8 agregados do domain model como classes TypeScript puras na camada Models (Domain), seguindo a arquitetura Clean Architecture definida no projeto OrçaSonhos. Estabelecer a fundação sólida para desenvolvimento futuro com Value Objects fundamentais focados em representação de dados e regras específicas de UI.

## 📋 Requisitos Funcionais

### Funcionalidades Principais

#### Value Objects Base
- **Money**: Operações monetárias básicas (soma, subtração, formatação)
- **Uuid**: Identificadores únicos com validação de formato
- **Email**: Validação de formato de email
- **Enums**: Tipos enumerados necessários (TransactionType, CategoryType, etc.)

#### Entities (8 Agregados)
- **Budget**: Propriedades básicas (id, name, participants, settings)
- **Account**: Propriedades básicas (id, name, balance, type)
- **Transaction**: Propriedades básicas (id, amount, description, date, type)
- **Category**: Propriedades básicas (id, name, type, color, active)
- **CreditCard**: Propriedades básicas (id, name, limit, closingDate)
- **CreditCardBill**: Propriedades básicas (id, amount, period, status)
- **Envelope**: Propriedades básicas (id, categoryId, balance, limit)
- **Goal**: Propriedades básicas (id, targetAmount, currentAmount, deadline)

### Comportamentos Esperados

- **Validação na Criação**: Todos os objetos validados obrigatoriamente via factory methods
- **Immutabilidade**: Value Objects completamente imutáveis
- **Encapsulamento**: Getters readonly para proteger estado interno
- **Tratamento de Erros**: Either pattern para resultados e validações
- **UI Helpers**: Métodos de conveniência para formatação e status computados

## 🏗️ Considerações Técnicas

### Arquitetura

**Clean Architecture** com separação clara de camadas:
- Camada Models (Domain) como core da aplicação
- Zero dependências externas (TypeScript puro)
- Relacionamentos via referências de ID entre agregados
- Regras de negócio complexas ficam no backend

### Tecnologias e Dependências

- **TypeScript**: Strict mode ativo, tipagem forte
- **Either Pattern**: Baseado na implementação do backend
- **Path Aliases**: @models/* e @either para imports limpos
- **Factory Pattern**: Métodos estáticos create() para criação segura

### Padrões a Seguir

- **Validation-First**: Validação obrigatória na criação de objetos
- **Immutability**: Especialmente nos Value Objects
- **Factory Pattern**: Criação segura via métodos estáticos
- **Either Pattern**: `Either<Error, T>` para tratamento de resultados
- **Nomenclatura**: Convenções em inglês definidas no projeto

## 🧪 Estratégia de Testes

### Testes Necessários

- **Unitários**: 100% cobertura para Value Objects e Entities
- **Validação**: Factory methods e constraints
- **Serialização**: toJSON/fromJSON para todas as entidades
- **Edge Cases**: Valores limites e cenários de erro

### Critérios de Aceitação

- [ ] Money - Operações monetárias básicas implementadas
- [ ] Uuid - Identificadores únicos com validação
- [ ] Email - Validação de formato correto
- [ ] Enums necessários (TransactionType, CategoryType, etc.)
- [ ] Budget - Aggregate com propriedades básicas
- [ ] Account - Aggregate com propriedades básicas
- [ ] Transaction - Aggregate com propriedades básicas
- [ ] Category - Aggregate com propriedades básicas
- [ ] CreditCard - Aggregate com propriedades básicas
- [ ] CreditCardBill - Aggregate com propriedades básicas
- [ ] Envelope - Aggregate com propriedades básicas
- [ ] Goal - Aggregate com propriedades básicas
- [ ] Zero dependências externas (TypeScript puro)
- [ ] Immutabilidade nos Value Objects
- [ ] Métodos factory para criação segura
- [ ] Validações básicas com Either<Error, T>
- [ ] Getters readonly para encapsulamento
- [ ] Métodos de conveniência para UI
- [ ] Estrutura organizacional em /src/models/
- [ ] Exports organizados via barrel files

## 🔗 Dependências e Impactos

### Sistemas Afetados

- **Estrutura de Diretórios**: Nova organização `/src/models/` e `/src/shared/core/`
- **TypeScript Config**: Path aliases para imports limpos
- **Padrões de Código**: Either pattern e factory methods em todo o projeto

### Integrações Necessárias

- **Either Pattern**: Copiado da implementação do backend
- **Path Aliases**: Configuração no tsconfig.app.json
- **Barrel Files**: index.ts para exports organizados

## 🚧 Restrições e Considerações

### Limitações Técnicas

- **Zero Dependências**: Apenas TypeScript puro, sem frameworks
- **UI Focus**: Validações básicas de formato/tipo, não regras de negócio complexas
- **Imutabilidade**: Value Objects devem ser completamente imutáveis
- **Testabilidade**: 100% testável para facilitar testes unitários futuros

### Riscos

- **Complexidade**: Manter simplicidade sem perder funcionalidade
- **Consistência**: Seguir padrões uniformes em todas as entities
- **Performance**: Garantir que immutabilidade não impacte performance

## 📚 Referências

- **Issue/Card**: OS-13 - Implementar Modelos Frontend (Domain Layer)
- **Arquitetura**: Comentário no Jira com arquitetura aprovada
- **Meta Specs**: Diretrizes em `/orca-sonhos-meta-specs/`
- **Backend Reference**: Either pattern e estruturas similares