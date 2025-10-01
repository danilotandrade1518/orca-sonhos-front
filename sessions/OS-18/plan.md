# Implementar Camada Completa de DTOs para Todas as Entidades do Domínio - Plano de Implementação

> **Instruções**: Mantenha este arquivo atualizado conforme o progresso. Marque tarefas como concluídas ✅, em progresso ⏰ ou não iniciadas ⏳.

## 📋 Resumo Executivo

Implementação da camada completa de Data Transfer Objects (DTOs) para todas as entidades do domínio OrçaSonhos, seguindo 100% os princípios da DTO-First Architecture. O trabalho será dividido em 10 fases, uma para cada entidade, mais fases de configuração e testes.

## 🎯 Objetivos da Implementação

- **Base Sólida**: Estabelecer DTOs como cidadãos de primeira classe para comunicação frontend-backend
- **Type Safety**: 100% de verificação de tipos em tempo de compilação
- **Alinhamento Total**: DTOs espelham exatamente a estrutura do backend
- **Organização Clara**: Estrutura intuitiva por contexto de negócio
- **Cobertura Completa**: 100% de cobertura de testes obrigatória

---

## 📅 FASE 1: Configuração Base e Tipos Compartilhados [Status: ✅]

### 🎯 Objetivo da Fase

Estabelecer a base técnica para todos os DTOs: configuração de path aliases, tipos compartilhados e estrutura de diretórios.

### 📋 Tarefas

#### Configurar Path Alias @dtos/\* [✅]

**Descrição**: Adicionar configuração de path alias no TypeScript para imports simplificados
**Arquivos**: `tsconfig.json`
**Critério de Conclusão**: Imports `@dtos/*` funcionando corretamente
**Status**: ✅ **JÁ CONFIGURADO** - Path alias @dtos/\* já existia no tsconfig.json

#### Implementar Tipos Compartilhados [✅]

**Descrição**: Criar Money, DateString, BaseEntity e todos os enums do domínio
**Arquivos**:

- `src/dtos/shared/Money.ts` ✅
- `src/dtos/shared/DateString.ts` ✅
- `src/dtos/shared/BaseEntity.ts` ✅
- `src/dtos/shared/TransactionType.ts` ✅
- `src/dtos/shared/BudgetStatus.ts` ✅
- `src/dtos/shared/AccountType.ts` ✅
- `src/dtos/shared/CategoryType.ts` ✅
- `src/dtos/shared/GoalStatus.ts` ✅
- `src/dtos/shared/index.ts` ✅

**Critério de Conclusão**: Todos os tipos compartilhados implementados e testados
**Status**: ✅ **COMPLETO** - Todos os tipos implementados com helpers e 100% de cobertura de testes

#### Configurar Estrutura de Diretórios [✅]

**Descrição**: Criar estrutura de diretórios para todas as entidades
**Arquivos**: Diretórios `request/` e `response/` para cada entidade
**Critério de Conclusão**: Estrutura completa criada
**Status**: ✅ **JÁ CRIADA** - Estrutura de diretórios já existia no projeto

### 🧪 Critérios de Validação

- [x] Path alias `@dtos/*` configurado e funcionando
- [x] Todos os tipos compartilhados implementados
- [x] Estrutura de diretórios criada
- [x] Build do projeto sem erros
- [x] Testes unitários para tipos compartilhados passando

### 📝 Comentários da Fase

**Descobertas Importantes**:

- Path alias `@dtos/*` já estava configurado no tsconfig.json
- Estrutura de diretórios já existia no projeto
- Either pattern já implementado pode ser útil para validações futuras

**Implementações Realizadas**:

- 9 tipos compartilhados implementados com helpers completos
- 100% de cobertura de testes (30 testes passando)
- Build do projeto funcionando sem erros
- Padrões DTO-First Architecture seguidos rigorosamente

**Decisões Técnicas**:

- Money como `number` em centavos para evitar problemas de precisão
- DateString como ISO 8601 para compatibilidade JSON
- Enums como string literals para type safety e tree-shaking
- Helpers extensivos para facilitar uso dos tipos

---

## 📅 FASE 2: DTOs de Budget [Status: ✅]

### 🎯 Objetivo da Fase

Implementar todos os DTOs relacionados ao contexto de Budget Management.

### 📋 Tarefas

#### Implementar Request DTOs de Budget [✅]

**Descrição**: Criar DTOs de entrada para operações de budget
**Arquivos**:

- `src/dtos/budget/request/CreateBudgetRequestDto.ts`
- `src/dtos/budget/request/UpdateBudgetRequestDto.ts`
- `src/dtos/budget/request/AddParticipantRequestDto.ts`
- `src/dtos/budget/request/RemoveParticipantRequestDto.ts`

**Dependências**: Fase 1 completa
**Critério de Conclusão**: Todos os request DTOs implementados e testados

#### Implementar Response DTOs de Budget [✅]

**Descrição**: Criar DTOs de saída para operações de budget
**Arquivos**:

- `src/dtos/budget/response/BudgetResponseDto.ts`
- `src/dtos/budget/response/BudgetListResponseDto.ts`
- `src/dtos/budget/response/BudgetSummaryResponseDto.ts`

**Dependências**: Request DTOs implementados
**Critério de Conclusão**: Todos os response DTOs implementados e testados

#### Configurar Re-exports de Budget [✅]

**Descrição**: Criar index.ts para centralizar exports do contexto budget
**Arquivos**: `src/dtos/budget/index.ts`
**Critério de Conclusão**: Re-exports funcionando corretamente

### 🧪 Critérios de Validação

- [x] Todos os DTOs de Budget implementados
- [x] Testes unitários com 100% de cobertura
- [x] Re-exports funcionando
- [x] Alinhamento com contratos do backend validado

### 📝 Comentários da Fase

**Implementações Realizadas**:

- 4 Request DTOs implementados com helpers completos
- 3 Response DTOs implementados com helpers completos
- 1 BudgetType criado e adicionado ao shared
- Re-exports configurados para centralização
- 106 testes unitários implementados com 100% de cobertura

**Decisões Técnicas**:

- BudgetType criado como string literal para type safety
- Helpers implementados seguindo padrão existente no projeto
- Validações robustas com tratamento de casos extremos
- Testes abrangentes cobrindo todos os cenários

**Problemas Resolvidos**:

- Correção de erros de linting relacionados a index signatures
- Ajuste de testes para propriedades opcionais
- Import correto de BudgetResponseDtoHelper no BudgetListResponseDto

---

## 📅 FASE 3: DTOs de Transaction [Status: ⏳]

### 🎯 Objetivo da Fase

Implementar todos os DTOs relacionados ao contexto de Transaction Management.

### 📋 Tarefas

#### Implementar Request DTOs de Transaction [⏳]

**Descrição**: Criar DTOs de entrada para operações de transação
**Arquivos**:

- `src/dtos/transaction/request/CreateTransactionRequestDto.ts`
- `src/dtos/transaction/request/UpdateTransactionRequestDto.ts`
- `src/dtos/transaction/request/DeleteTransactionRequestDto.ts`
- `src/dtos/transaction/request/CancelScheduledTransactionRequestDto.ts`
- `src/dtos/transaction/request/MarkTransactionLateRequestDto.ts`

**Dependências**: Fase 1 completa
**Critério de Conclusão**: Todos os request DTOs implementados e testados

#### Implementar Response DTOs de Transaction [⏳]

**Descrição**: Criar DTOs de saída para operações de transação
**Arquivos**:

- `src/dtos/transaction/response/TransactionResponseDto.ts`
- `src/dtos/transaction/response/TransactionListResponseDto.ts`
- `src/dtos/transaction/response/TransactionSummaryResponseDto.ts`

**Dependências**: Request DTOs implementados
**Critério de Conclusão**: Todos os response DTOs implementados e testados

#### Configurar Re-exports de Transaction [⏳]

**Descrição**: Criar index.ts para centralizar exports do contexto transaction
**Arquivos**: `src/dtos/transaction/index.ts`
**Critério de Conclusão**: Re-exports funcionando corretamente

### 🧪 Critérios de Validação

- [ ] Todos os DTOs de Transaction implementados
- [ ] Testes unitários com 100% de cobertura
- [ ] Re-exports funcionando
- [ ] Alinhamento com contratos do backend validado

### 📝 Comentários da Fase

_[Observações sobre decisões tomadas]_

---

## 📅 FASE 4: DTOs de Account [Status: ⏳]

### 🎯 Objetivo da Fase

Implementar todos os DTOs relacionados ao contexto de Account Management.

### 📋 Tarefas

#### Implementar Request DTOs de Account [⏳]

**Descrição**: Criar DTOs de entrada para operações de conta
**Arquivos**:

- `src/dtos/account/request/CreateAccountRequestDto.ts`
- `src/dtos/account/request/UpdateAccountRequestDto.ts`
- `src/dtos/account/request/DeleteAccountRequestDto.ts`
- `src/dtos/account/request/TransferBetweenAccountsRequestDto.ts`
- `src/dtos/account/request/ReconcileAccountRequestDto.ts`

**Dependências**: Fase 1 completa
**Critério de Conclusão**: Todos os request DTOs implementados e testados

#### Implementar Response DTOs de Account [⏳]

**Descrição**: Criar DTOs de saída para operações de conta
**Arquivos**:

- `src/dtos/account/response/AccountResponseDto.ts`
- `src/dtos/account/response/AccountListResponseDto.ts`

**Dependências**: Request DTOs implementados
**Critério de Conclusão**: Todos os response DTOs implementados e testados

#### Configurar Re-exports de Account [⏳]

**Descrição**: Criar index.ts para centralizar exports do contexto account
**Arquivos**: `src/dtos/account/index.ts`
**Critério de Conclusão**: Re-exports funcionando corretamente

### 🧪 Critérios de Validação

- [ ] Todos os DTOs de Account implementados
- [ ] Testes unitários com 100% de cobertura
- [ ] Re-exports funcionando
- [ ] Alinhamento com contratos do backend validado

### 📝 Comentários da Fase

_[Observações sobre decisões tomadas]_

---

## 📅 FASE 5: DTOs de Goal [Status: ⏳]

### 🎯 Objetivo da Fase

Implementar todos os DTOs relacionados ao contexto de Goal Management.

### 📋 Tarefas

#### Implementar Request DTOs de Goal [⏳]

**Descrição**: Criar DTOs de entrada para operações de meta
**Arquivos**:

- `src/dtos/goal/request/CreateGoalRequestDto.ts`
- `src/dtos/goal/request/UpdateGoalRequestDto.ts`
- `src/dtos/goal/request/DeleteGoalRequestDto.ts`
- `src/dtos/goal/request/AddAmountToGoalRequestDto.ts`
- `src/dtos/goal/request/RemoveAmountFromGoalRequestDto.ts`

**Dependências**: Fase 1 completa
**Critério de Conclusão**: Todos os request DTOs implementados e testados

#### Implementar Response DTOs de Goal [⏳]

**Descrição**: Criar DTOs de saída para operações de meta
**Arquivos**:

- `src/dtos/goal/response/GoalResponseDto.ts`
- `src/dtos/goal/response/GoalListResponseDto.ts`

**Dependências**: Request DTOs implementados
**Critério de Conclusão**: Todos os response DTOs implementados e testados

#### Configurar Re-exports de Goal [⏳]

**Descrição**: Criar index.ts para centralizar exports do contexto goal
**Arquivos**: `src/dtos/goal/index.ts`
**Critério de Conclusão**: Re-exports funcionando corretamente

### 🧪 Critérios de Validação

- [ ] Todos os DTOs de Goal implementados
- [ ] Testes unitários com 100% de cobertura
- [ ] Re-exports funcionando
- [ ] Alinhamento com contratos do backend validado

### 📝 Comentários da Fase

_[Observações sobre decisões tomadas]_

---

## 📅 FASE 6: DTOs de Category [Status: ⏳]

### 🎯 Objetivo da Fase

Implementar todos os DTOs relacionados ao contexto de Category Management.

### 📋 Tarefas

#### Implementar Request DTOs de Category [⏳]

**Descrição**: Criar DTOs de entrada para operações de categoria
**Arquivos**:

- `src/dtos/category/request/CreateCategoryRequestDto.ts`
- `src/dtos/category/request/UpdateCategoryRequestDto.ts`
- `src/dtos/category/request/DeleteCategoryRequestDto.ts`

**Dependências**: Fase 1 completa
**Critério de Conclusão**: Todos os request DTOs implementados e testados

#### Implementar Response DTOs de Category [⏳]

**Descrição**: Criar DTOs de saída para operações de categoria
**Arquivos**:

- `src/dtos/category/response/CategoryResponseDto.ts`
- `src/dtos/category/response/CategoryListResponseDto.ts`

**Dependências**: Request DTOs implementados
**Critério de Conclusão**: Todos os response DTOs implementados e testados

#### Configurar Re-exports de Category [⏳]

**Descrição**: Criar index.ts para centralizar exports do contexto category
**Arquivos**: `src/dtos/category/index.ts`
**Critério de Conclusão**: Re-exports funcionando corretamente

### 🧪 Critérios de Validação

- [ ] Todos os DTOs de Category implementados
- [ ] Testes unitários com 100% de cobertura
- [ ] Re-exports funcionando
- [ ] Alinhamento com contratos do backend validado

### 📝 Comentários da Fase

_[Observações sobre decisões tomadas]_

---

## 📅 FASE 7: DTOs de CreditCard [Status: ⏳]

### 🎯 Objetivo da Fase

Implementar todos os DTOs relacionados ao contexto de CreditCard Management.

### 📋 Tarefas

#### Implementar Request DTOs de CreditCard [⏳]

**Descrição**: Criar DTOs de entrada para operações de cartão de crédito
**Arquivos**:

- `src/dtos/credit-card/request/CreateCreditCardRequestDto.ts`
- `src/dtos/credit-card/request/UpdateCreditCardRequestDto.ts`
- `src/dtos/credit-card/request/DeleteCreditCardRequestDto.ts`

**Dependências**: Fase 1 completa
**Critério de Conclusão**: Todos os request DTOs implementados e testados

#### Implementar Response DTOs de CreditCard [⏳]

**Descrição**: Criar DTOs de saída para operações de cartão de crédito
**Arquivos**:

- `src/dtos/credit-card/response/CreditCardResponseDto.ts`
- `src/dtos/credit-card/response/CreditCardListResponseDto.ts`

**Dependências**: Request DTOs implementados
**Critério de Conclusão**: Todos os response DTOs implementados e testados

#### Configurar Re-exports de CreditCard [⏳]

**Descrição**: Criar index.ts para centralizar exports do contexto credit-card
**Arquivos**: `src/dtos/credit-card/index.ts`
**Critério de Conclusão**: Re-exports funcionando corretamente

### 🧪 Critérios de Validação

- [ ] Todos os DTOs de CreditCard implementados
- [ ] Testes unitários com 100% de cobertura
- [ ] Re-exports funcionando
- [ ] Alinhamento com contratos do backend validado

### 📝 Comentários da Fase

_[Observações sobre decisões tomadas]_

---

## 📅 FASE 8: DTOs de CreditCardBill [Status: ⏳]

### 🎯 Objetivo da Fase

Implementar todos os DTOs relacionados ao contexto de CreditCardBill Management.

### 📋 Tarefas

#### Implementar Request DTOs de CreditCardBill [⏳]

**Descrição**: Criar DTOs de entrada para operações de fatura de cartão
**Arquivos**:

- `src/dtos/credit-card-bill/request/CreateCreditCardBillRequestDto.ts`
- `src/dtos/credit-card-bill/request/UpdateCreditCardBillRequestDto.ts`
- `src/dtos/credit-card-bill/request/DeleteCreditCardBillRequestDto.ts`
- `src/dtos/credit-card-bill/request/PayCreditCardBillRequestDto.ts`
- `src/dtos/credit-card-bill/request/ReopenCreditCardBillRequestDto.ts`

**Dependências**: Fase 1 completa
**Critério de Conclusão**: Todos os request DTOs implementados e testados

#### Implementar Response DTOs de CreditCardBill [⏳]

**Descrição**: Criar DTOs de saída para operações de fatura de cartão
**Arquivos**:

- `src/dtos/credit-card-bill/response/CreditCardBillResponseDto.ts`
- `src/dtos/credit-card-bill/response/CreditCardBillListResponseDto.ts`

**Dependências**: Request DTOs implementados
**Critério de Conclusão**: Todos os response DTOs implementados e testados

#### Configurar Re-exports de CreditCardBill [⏳]

**Descrição**: Criar index.ts para centralizar exports do contexto credit-card-bill
**Arquivos**: `src/dtos/credit-card-bill/index.ts`
**Critério de Conclusão**: Re-exports funcionando corretamente

### 🧪 Critérios de Validação

- [ ] Todos os DTOs de CreditCardBill implementados
- [ ] Testes unitários com 100% de cobertura
- [ ] Re-exports funcionando
- [ ] Alinhamento com contratos do backend validado

### 📝 Comentários da Fase

_[Observações sobre decisões tomadas]_

---

## 📅 FASE 9: DTOs de Envelope [Status: ⏳]

### 🎯 Objetivo da Fase

Implementar todos os DTOs relacionados ao contexto de Envelope Management.

### 📋 Tarefas

#### Implementar Request DTOs de Envelope [⏳]

**Descrição**: Criar DTOs de entrada para operações de envelope
**Arquivos**:

- `src/dtos/envelope/request/CreateEnvelopeRequestDto.ts`
- `src/dtos/envelope/request/UpdateEnvelopeRequestDto.ts`
- `src/dtos/envelope/request/DeleteEnvelopeRequestDto.ts`
- `src/dtos/envelope/request/AddAmountToEnvelopeRequestDto.ts`
- `src/dtos/envelope/request/RemoveAmountFromEnvelopeRequestDto.ts`
- `src/dtos/envelope/request/TransferBetweenEnvelopesRequestDto.ts`

**Dependências**: Fase 1 completa
**Critério de Conclusão**: Todos os request DTOs implementados e testados

#### Implementar Response DTOs de Envelope [⏳]

**Descrição**: Criar DTOs de saída para operações de envelope
**Arquivos**:

- `src/dtos/envelope/response/EnvelopeResponseDto.ts`
- `src/dtos/envelope/response/EnvelopeListResponseDto.ts`

**Dependências**: Request DTOs implementados
**Critério de Conclusão**: Todos os response DTOs implementados e testados

#### Configurar Re-exports de Envelope [⏳]

**Descrição**: Criar index.ts para centralizar exports do contexto envelope
**Arquivos**: `src/dtos/envelope/index.ts`
**Critério de Conclusão**: Re-exports funcionando corretamente

### 🧪 Critérios de Validação

- [ ] Todos os DTOs de Envelope implementados
- [ ] Testes unitários com 100% de cobertura
- [ ] Re-exports funcionando
- [ ] Alinhamento com contratos do backend validado

### 📝 Comentários da Fase

_[Observações sobre decisões tomadas]_

---

## 📅 FASE 10: Re-exports Globais e Validação Final [Status: ⏳]

### 🎯 Objetivo da Fase

Finalizar a implementação com re-exports globais, validação completa e documentação.

### 📋 Tarefas

#### Configurar Re-exports Globais [⏳]

**Descrição**: Criar index.ts global para centralizar todos os exports
**Arquivos**: `src/dtos/index.ts`
**Dependências**: Todas as fases anteriores completas
**Critério de Conclusão**: Re-exports globais funcionando

#### Validação de Alinhamento com Backend [⏳]

**Descrição**: Validar que todos os DTOs estão alinhados com contratos do backend
**Arquivos**: Testes de contrato
**Critério de Conclusão**: 100% de alinhamento validado

#### Documentação Final [⏳]

**Descrição**: Atualizar documentação e criar guias de uso
**Arquivos**: README.md e documentação de DTOs
**Critério de Conclusão**: Documentação completa e atualizada

### 🧪 Critérios de Validação

- [ ] Re-exports globais funcionando
- [ ] Alinhamento com backend 100% validado
- [ ] Documentação completa
- [ ] Todos os testes passando
- [ ] Build sem erros
- [ ] Cobertura de testes 100%

### 📝 Comentários da Fase

_[Observações sobre decisões tomadas]_

---

## 🔀 Estratégia de Desenvolvimento

### Ordem de Execução

1. **Sequencial**: Fases 1 → 2 → 3 → 4 → 5 → 6 → 7 → 8 → 9 → 10
2. **Paralelo**: Dentro de cada fase, request e response DTOs podem ser implementados em paralelo

### Pontos de Validação

- **Após Fase 1**: Validação de configuração base e tipos compartilhados
- **Após cada fase de entidade**: Validação de DTOs específicos e testes
- **Final**: Validação completa de alinhamento com backend

### Contingências

- **Se Fase 1 falhar**: Revisar configuração de TypeScript e Angular
- **Se DTOs não alinharem**: Ajustar baseado nos contratos reais do backend
- **Se testes falharem**: Revisar implementação e ajustar conforme necessário

## 🧪 Estratégia de Testes

### Testes por Fase

- **Fase 1**: Testes de tipos compartilhados e configuração
- **Fases 2-9**: Testes unitários para cada entidade (100% cobertura)
- **Fase 10**: Testes de integração e validação de contratos

### Dados de Teste

- **Factories**: Criar factories para cada DTO
- **Mocks**: Dados de exemplo para testes
- **Fixtures**: Dados de teste padronizados

## 📚 Referências e Pesquisas

### Documentação Consultada

- **Meta Specs**: DTO-First Architecture principles
- **Schema**: entities.yaml para estrutura das entidades
- **Backend**: Contratos de API mapeados na issue OS-18

### Decisões Arquiteturais Durante Planejamento

- **Decisão**: Money como `number` em centavos
- **Motivo**: Evitar problemas de precisão de ponto flutuante
- **Impacto**: Simplicidade e compatibilidade com JSON

- **Decisão**: Enums como string literals
- **Motivo**: Type-safe, serialização JSON, tree-shaking
- **Impacto**: Melhor performance e compatibilidade

## 🚨 Riscos Identificados

### Riscos Técnicos

- **Risco**: Desalinhamento com contratos do backend
- **Probabilidade**: Média
- **Mitigação**: Validação contínua e testes de contrato

- **Risco**: Performance com muitos DTOs
- **Probabilidade**: Baixa
- **Mitigação**: Tree shaking e estrutura otimizada

### Riscos de Dependência

- **Dependência Externa**: Contratos do backend
- **Impacto se Indisponível**: DTOs podem ficar desatualizados
- **Plano B**: Implementar baseado na documentação e ajustar posteriormente

## 📈 Métricas de Progresso

### Por Fase

- Fase 1: 4 tarefas, ~2 horas estimadas
- Fases 2-9: 3 tarefas cada, ~1.5 horas cada (12 horas total)
- Fase 10: 3 tarefas, ~2 horas estimadas

### Total

- **Tarefas**: 34 tarefas
- **Tempo Estimado**: 16 horas
- **Marcos**: 10 fases de implementação

## 🏁 Entrega Final

- [ ] Todos os DTOs implementados (48 arquivos)
- [ ] Path aliases configurados e funcionando
- [ ] Re-exports centralizados
- [ ] 100% de cobertura de testes
- [ ] Alinhamento com backend validado
- [ ] Documentação completa
- [ ] Build sem erros
- [ ] Pronto para PR
