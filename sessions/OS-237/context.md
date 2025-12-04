# Sistema de Envelopes - Contexto de Desenvolvimento

## Issue: [OS-237](https://orca-sonhos.atlassian.net/browse/OS-237)

---

## 🎯 Objetivo

Implementar o sistema completo de envelopes (limite de gastos por categoria) dentro de um orçamento, permitindo:

- Definição de limites mensais de gastos por categoria
- Monitoramento automático de gastos vs. limites (calculado pelo backend)
- Alertas visuais quando limites são excedidos
- Integração com Dashboard para indicadores de saúde financeira

Este sistema é fundamental para o **Dashboard Centrado em Progresso** e para o cálculo do indicador **"Uso de Orçamento e Envelopes"** definido em `financial-health.md`.

---

## 📋 Requisitos Funcionais

### Funcionalidades Principais

- **CRUD de Envelopes**: Criar, listar, editar e excluir envelopes
- **Vinculação com Categorias**: Cada envelope está vinculado a uma categoria (relacionamento 1:1)
- **Limite de Gastos**: Definir limite mensal para cada categoria
- **Cálculo Automático de Uso**: O backend calcula `currentUsage` baseado nas transações de despesa da categoria
- **Alertas de Excedentes**: Notificações visuais quando o uso excede o limite

### Comportamentos Esperados

- **Envelope Persistente**: Uma vez criado, o envelope vale para todos os meses subsequentes
- **Uso Calculado**: O `currentUsage` é calculado pelo backend a partir das transações de despesa do mês atual
- **Percentual de Uso**: `usagePercentage = (currentUsage / limit) × 100`
- **Regra 1:1**: Cada categoria pode ter no máximo um envelope (validado no backend)
- **Estouro Permitido**: O uso pode exceder o limite (indica estouro do orçamento)

### Endpoints da API

| Método | Endpoint                    | Descrição                     |
| ------ | --------------------------- | ----------------------------- |
| GET    | `/envelopes?budgetId=xxx`   | Listar envelopes do orçamento |
| POST   | `/envelope/create-envelope` | Criar envelope                |
| POST   | `/envelope/update-envelope` | Atualizar envelope            |
| POST   | `/envelope/delete-envelope` | Excluir envelope              |

> **Nota**: Os endpoints `/envelope/add-amount-envelope`, `/envelope/remove-amount-envelope` e `/envelope/transfer-between-envelopes` foram removidos do backend. Os handlers MSW correspondentes devem ser removidos.
>
> **Motivo**: Como o `currentUsage` é calculado (não armazenado), não há "saldo" para transferir entre envelopes. Para ajustar limites, basta editar cada envelope individualmente.

---

## 🏗️ Considerações Técnicas

### Arquitetura

- **Clean Architecture + DTO-First**: Seguir padrões existentes no projeto
- **Estado Reativo**: Usar signals como em `AccountState`
- **Feature-based Organization**: Criar feature em `src/app/features/envelopes/`

### DTOs (Data Transfer Objects)

**EnvelopeDto** (resposta da API):

```typescript
interface EnvelopeDto {
  id: string;
  budgetId: string;
  categoryId: string;
  categoryName: string; // Para exibição
  name: string; // Nome do envelope
  limit: number; // Limite em centavos
  currentUsage: number; // Calculado pelo backend (centavos)
  usagePercentage: number; // Calculado pelo backend
  active: boolean;
  createdAt: string;
  updatedAt: string;
}
```

> **Convenção**: Valores monetários são sempre em centavos. Não usar sufixo `InCents`.

### Design da UI

- **Referência**: Sistema de Contas (`AccountsPage`)
- **Layout**: Grid de cards com informações do envelope
- **Componentes**: Seguir padrões de `os-entity-list`, `os-page`, `os-page-header`

### Tecnologias e Dependências

- **Angular 20+**: Standalone components, signals
- **Angular Material**: Componentes de UI
- **MSW**: Mock Service Worker para handlers de API
- **Vitest**: Testes unitários

### Padrões a Seguir

- Signals para estado local e computeds para derivações
- `input()` e `output()` em vez de decorators
- `ChangeDetectionStrategy.OnPush` em todos os componentes
- Reactive forms para formulários
- Native control flow (`@if`, `@for`, `@switch`)

---

## 🧪 Estratégia de Testes

### Testes Necessários

- **Unitários**: DTOs, EnvelopeState, EnvelopesApiService, EnvelopeCalculationService
- **Componentes**: EnvelopeListComponent, EnvelopeFormComponent, ConfirmDeleteModalComponent
- **Integração**: Fluxos completos de CRUD

### Critérios de Aceitação

- [ ] CRUD completo de envelopes funcionando
- [ ] Envelopes vinculados a categorias (1:1)
- [ ] Cálculo de uso (`currentUsage`) exibido corretamente
- [ ] Percentual de uso com indicadores visuais (verde/amarelo/vermelho)
- [ ] Alertas de excedentes funcionando
- [ ] Integração com Dashboard funcionando
- [ ] UI responsiva em mobile, tablet e desktop
- [ ] Acessibilidade WCAG 2.1 AA
- [ ] Testes unitários com cobertura > 80%
- [ ] Dados expostos para `FinancialHealthIndicatorComponent`

---

## 🔗 Dependências e Impactos

### Sistemas Afetados

- **Dashboard**: Integração com `CategorySpendingWidgetComponent` e `FinancialHealthIndicatorComponent`
- **Categorias**: Vinculação de envelopes a categorias existentes
- **Transações**: Base para cálculo de `currentUsage`
- **Menu/Navegação**: Nova rota `/envelopes`

### Integrações Necessárias

- **CategoriesApiService**: Para seleção de categoria no formulário
- **BudgetSelectionService**: Para contexto do orçamento selecionado
- **NotificationService**: Para alertas de excedentes
- **CategorySpendingWidgetComponent**: Atualizar para usar dados de envelopes

### Dependências Externas

- Sistema de Categorias (OS-236) - já implementado

---

## 🚧 Restrições e Considerações

### Decisões Técnicas

| Decisão                                | Justificativa                                         |
| -------------------------------------- | ----------------------------------------------------- |
| `currentUsage` calculado pelo backend  | Garante consistência com transações reais             |
| Envelope persistente (não por período) | Simplifica modelo - envelope vale para todos os meses |
| Relacionamento 1:1 Category ↔ Envelope | Validação no backend - evita duplicação               |
| Valores sempre em centavos             | Convenção do projeto - sem sufixo `InCents`           |

### Riscos e Mitigações

| Risco                            | Mitigação                                       |
| -------------------------------- | ----------------------------------------------- |
| Performance com muitos envelopes | Paginação no backend se necessário              |
| Inconsistência de dados          | Backend como fonte da verdade                   |
| UX confusa em estouros           | Alertas visuais claros e mensagens explicativas |

---

## 📚 Referências

- **Issue Jira**: [OS-237](https://orca-sonhos.atlassian.net/browse/OS-237)
- **Meta Specs**: `/home/danilo/workspace/projeto-orca-sonhos/orca-sonhos-meta-specs/`
  - `technical/backend-architecture/domain-model.md` - Modelo de Envelope
  - `business/financial-health.md` - Indicadores de saúde financeira
  - `domain-glossary.md` - Definição de Envelope
  - `business/product-vision/core-concepts.md` - Conceitos de negócio
- **Código de Referência**:
  - `src/app/features/accounts/` - Padrão de estrutura de feature
  - `src/app/core/services/account/account-state/` - Padrão de estado
  - `src/dtos/account/` - Padrão de DTOs
  - `src/app/core/mocks/handlers/envelopes.handlers.ts` - Handlers MSW existentes
