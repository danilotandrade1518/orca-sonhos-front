# Implementar Modelos Frontend (Domain Layer) - Plano de Implementação

> **Instruções**: Mantenha este arquivo atualizado conforme o progresso. Marque tarefas como concluídas ✅, em progresso ⏰ ou não iniciadas ⏳.

## 📋 Resumo Executivo

Implementar todos os 8 agregados do domain model como classes TypeScript puras na camada Models (Domain), seguindo a arquitetura Clean Architecture. Estabelecer fundação sólida com Value Objects fundamentais (Money, Uuid, Email) e Either pattern para tratamento de erros, criando a base para todo desenvolvimento futuro do frontend OrçaSonhos.

## 🎯 Objetivos da Implementação

- Implementar 8 entities principais do domínio (Budget, Account, Transaction, Category, CreditCard, CreditCardBill, Envelope, Goal)
- Criar Value Objects essenciais (Money, Uuid, Email) com validações básicas
- Estabelecer Either pattern para tratamento consistente de erros
- Configurar estrutura organizacional com barrel files para exports limpos
- Garantir zero dependências externas (TypeScript puro)
- Implementar factory methods com validações para criação segura
- Estabelecer base sólida para testes unitários futuros

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

## 📅 FASE 2: Value Objects Fundamentais [Status: ⏳]

### 🎯 Objetivo da Fase

Implementar Value Objects essenciais (Money, Uuid, Email) com validações básicas e operações necessárias para UI/UX.

### 📋 Tarefas

#### Implementar Money Value Object [⏳]

**Descrição**: Criar classe Money com operações monetárias básicas (soma, subtração, formatação)
**Arquivos**: `src/models/shared/value-objects/money.ts`
**Dependências**: Either pattern funcionando
**Complexidade**: Média (operações matemáticas e formatação)

#### Implementar Uuid Value Object [⏳]

**Descrição**: Criar classe Uuid com validação de formato e geração
**Arquivos**: `src/models/shared/value-objects/uuid.ts`
**Dependências**: Either pattern funcionando
**Testes Necessários**: Validação de formato UUID v4

#### Implementar Email Value Object [⏳]

**Descrição**: Criar classe Email com validação básica de formato
**Arquivos**: `src/models/shared/value-objects/email.ts`
**Dependências**: Either pattern funcionando
**Validação**: Regex básico para formato de email

#### Criar Barrel File Value Objects [⏳]

**Descrição**: Organizar exports dos Value Objects via index.ts
**Arquivos**: `src/models/shared/value-objects/index.ts`
**Dependências**: Todos os Value Objects implementados

### 🔄 Dependências

- ✅ Fase 1 completada (Either pattern disponível)
- Either<Error, ValueObject> para factory methods

### 📝 Comentários da Fase

_Value Objects devem ser completamente imutáveis. Money é o mais complexo por envolver operações matemáticas e formatação brasileira._

---

## 📅 FASE 3: Enums de Domínio [Status: ⏳]

### 🎯 Objetivo da Fase

Implementar enums necessários para tipagem forte dos domínios (TransactionType, AccountType, CategoryType).

### 📋 Tarefas

#### Implementar TransactionType Enum [⏳]

**Descrição**: Enum para tipos de transação (INCOME, EXPENSE)
**Arquivos**: `src/models/shared/enums/transaction-type.ts`
**Foco**: Valores alinhados com backend

#### Implementar AccountType Enum [⏳]

**Descrição**: Enum para tipos de conta (CHECKING, SAVINGS, INVESTMENT)
**Arquivos**: `src/models/shared/enums/account-type.ts`
**Validação**: Valores consistentes com regras de negócio

#### Implementar CategoryType Enum [⏳]

**Descrição**: Enum para tipos de categoria (INCOME, EXPENSE)
**Arquivos**: `src/models/shared/enums/category-type.ts`
**Critério**: Alinhamento com TransactionType

#### Criar Barrel File Enums [⏳]

**Descrição**: Organizar exports dos enums via index.ts
**Arquivos**: `src/models/shared/enums/index.ts`
**Dependências**: Todos os enums implementados

### 🧪 Critérios de Validação

- [ ] TransactionType com valores INCOME e EXPENSE
- [ ] AccountType com tipos de conta relevantes
- [ ] CategoryType alinhado com TransactionType
- [ ] Barrel file exportando todos os enums
- [ ] Imports limpos via @models/shared/enums

### 📝 Comentários da Fase

_Enums devem seguir convenções em inglês e valores alinhados com backend para consistência._

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

## 🔀 Estratégia de Desenvolvimento

### Ordem de Execução

1. **Sequencial**: Fases 1 → 2 → 3 (dependências claras)
2. **Paralelo após Fase 3**: Entities podem ser implementadas simultaneamente nas Fases 4-6
3. **Final**: Fase 7 após todas as entities prontas

### Pontos de Validação

- **Após Fase 1**: Either pattern funcionando, path alias configurado
- **Após Fase 3**: Todos os building blocks prontos para entities
- **Após Fase 6**: Todas as entities implementadas
- **Final**: API pública completa e documentada

### Contingências

- **Se Fase 1 falhar**: Usar relative imports temporariamente
- **Se Value Object complexo**: Implementar versão simplificada primeiro
- **Se Entity muito complexa**: Focar em propriedades básicas primeiro

## 🧪 Estratégia de Testes

### Testes por Fase

- **Fase 1**: Either pattern success/error scenarios
- **Fase 2**: Value Objects operations (Money math, Uuid format, Email validation)
- **Fases 4-6**: Factory methods e validações básicas
- **Fase 7**: Imports e exports

### Dados de Teste

- **Valid Data**: Objetos válidos para cada entity
- **Invalid Data**: Cenários de erro para validações
- **Edge Cases**: Money com zero, UUIDs malformados, emails inválidos

## 📚 Referências e Pesquisas

### Documentação Consultada

- **Backend Either**: `/orca-sonhos-back/src/shared/core/either.ts` - Implementação de referência
- **Meta Specs**: Convenções de nomenclatura e estrutura
- **TypeScript**: Configurações strict mode e path aliases

### Decisões Arquiteturais Durante Planejamento

- **Either Pattern**: Copiado exatamente do backend para consistência
- **Relacionamentos**: IDs string em vez de Value Objects tipados (simplicidade inicial)
- **Validações**: Foco em UI/UX, não regras de negócio complexas

## 🚨 Riscos Identificados

### Riscos Técnicos

- **Complexidade Money**: Operações matemáticas podem ter edge cases
- **Probabilidade**: Média
- **Mitigação**: Implementar operações básicas primeiro, expandir depois

### Riscos de Dependência

- **Path Aliases**: Configuração pode não funcionar corretamente
- **Impacto se Falhar**: Usar relative imports como fallback
- **Plano B**: Implementar sem path aliases inicialmente

## 📈 Métricas de Progresso

### Por Fase

- Fase 1: 3 tarefas, ~2 horas estimadas
- Fase 2: 4 tarefas, ~3 horas estimadas
- Fase 3: 4 tarefas, ~1 hora estimada
- Fase 4: 3 tarefas, ~2 horas estimadas
- Fase 5: 3 tarefas, ~2 horas estimadas
- Fase 6: 4 tarefas, ~3 horas estimadas
- Fase 7: 3 tarefas, ~1 hora estimada

### Total

- **Tarefas**: 24 tarefas principais
- **Tempo Estimado**: ~14 horas totais
- **Marcos**: Fase 3 (building blocks), Fase 6 (entities completas), Fase 7 (API final)