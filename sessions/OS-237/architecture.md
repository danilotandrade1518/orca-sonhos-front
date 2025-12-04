# Sistema de Envelopes - Arquitetura Técnica

## Issue: [OS-237](https://orca-sonhos.atlassian.net/browse/OS-237)

---

## 🏗️ Visão Geral da Implementação

### Estado Atual

- **Backend**: Entidade Envelope implementada com `limit` e `currentUsage` calculado a partir das transações
- **Frontend**: Apenas handlers MSW parciais em `src/app/core/mocks/handlers/envelopes.handlers.ts`
- **Integração**: `CategorySpendingWidgetComponent` aguarda sistema de envelopes para mostrar % do planejado

### Mudanças Propostas

1. **DTOs**: Criar contratos em `src/dtos/envelope/`
2. **API Service**: Criar `EnvelopesApiService` em `src/app/core/services/envelope/`
3. **Estado Reativo**: Criar `EnvelopeState` seguindo padrão de `AccountState`
4. **Feature**: Criar feature completa em `src/app/features/envelopes/`
5. **MSW Handlers**: Atualizar handlers (remover operações add/remove amount e transfer)
6. **Integração**: Conectar com Dashboard e indicadores de saúde financeira

### Impactos

| Componente       | Impacto                                          |
| ---------------- | ------------------------------------------------ |
| Navegação        | Nova rota `/envelopes`                           |
| Dashboard        | Integração com `CategorySpendingWidgetComponent` |
| Categorias       | Seleção de categoria no formulário de envelope   |
| Saúde Financeira | Dados para `FinancialHealthIndicatorComponent`   |

---

## 🔧 Componentes e Estrutura

### Novos Arquivos a Criar

#### DTOs (`src/dtos/envelope/`)

```
src/dtos/envelope/
├── envelope-types.ts              # EnvelopeDto e tipos relacionados
├── create-envelope-request-dto.ts
├── update-envelope-request-dto.ts
├── delete-envelope-request-dto.ts
├── list-envelopes-response-dto.ts
└── index.ts                       # Re-exports
```

#### Serviços (`src/app/core/services/envelope/`)

```
src/app/core/services/envelope/
├── envelopes-api/
│   ├── envelopes-api.service.ts
│   └── envelopes-api.service.spec.ts
├── envelope-state/
│   ├── envelope.state.ts
│   └── envelope.state.spec.ts
└── envelope-calculation/
    ├── envelope-calculation.service.ts
    └── envelope-calculation.service.spec.ts
```

#### Feature (`src/app/features/envelopes/`)

```
src/app/features/envelopes/
├── envelopes.routes.ts
├── index.ts
├── components/
│   ├── envelope-form/
│   │   ├── envelope-form.component.ts
│   │   ├── envelope-form.component.scss
│   │   └── envelope-form.component.spec.ts
│   └── confirm-delete-modal/
│       ├── confirm-delete-modal.component.ts
│       ├── confirm-delete-modal.component.scss
│       └── confirm-delete-modal.component.spec.ts
└── pages/
    ├── envelopes/
    │   ├── envelopes.page.ts
    │   ├── envelopes.page.scss
    │   └── envelopes.page.spec.ts
    └── envelope-detail/
        ├── envelope-detail.page.ts
        └── envelope-detail.page.scss
```

#### Componentes Compartilhados (`src/app/shared/ui-components/molecules/`)

```
src/app/shared/ui-components/molecules/
└── envelope-card/
    ├── envelope-card.component.ts
    ├── envelope-card.component.scss
    ├── envelope-card.component.spec.ts
    └── index.ts
```

### Arquivos a Modificar

| Arquivo                                                           | Tipo de Mudança                  |
| ----------------------------------------------------------------- | -------------------------------- |
| `src/dtos/index.ts`                                               | Adicionar re-exports de envelope |
| `src/app/app.routes.ts`                                           | Adicionar rota `/envelopes`      |
| `src/app/core/mocks/handlers/envelopes.handlers.ts`               | Atualizar handlers MSW           |
| `src/app/core/mocks/handlers/index.ts`                            | Verificar exports                |
| `src/app/features/dashboard/components/category-spending-widget/` | Integrar com envelopes           |

---

## 🎨 UI Components and Layout

### Design System Integration

O sistema de envelopes reutiliza extensivamente componentes do Design System existente:

**Atoms:**

- `os-button` - Ações de criar, editar, excluir
- `os-progress-bar` - Indicador visual de uso do envelope
- `os-skeleton` - Loading states
- `os-edit-button`, `os-delete-button` - Ações padronizadas

**Molecules:**

- `os-card` - Container base do `EnvelopeCard`
- `os-money-display` - Formatação de valores monetários
- `os-form-field` - Campos do formulário
- `os-alert` - Mensagens de erro/sucesso
- `os-empty-state` - Estado vazio da lista

**Organisms:**

- `os-page`, `os-page-header` - Estrutura da página
- `os-entity-list` - Grid responsivo de cards
- `os-modal` - Modais de formulário e confirmação

### New Components Required

| Componente                            | Tipo              | Localização                                           | Descrição                                                              |
| ------------------------------------- | ----------------- | ----------------------------------------------------- | ---------------------------------------------------------------------- |
| `EnvelopeCardComponent`               | Molecule          | `shared/ui-components/molecules/envelope-card/`       | Card com progress bar e indicadores de status (verde/amarelo/vermelho) |
| `EnvelopeFormComponent`               | Feature Component | `features/envelopes/components/envelope-form/`        | Formulário reativo para criar/editar envelope                          |
| `ConfirmDeleteEnvelopeModalComponent` | Feature Component | `features/envelopes/components/confirm-delete-modal/` | Modal de confirmação de exclusão                                       |

### Layout Architecture

- **Tipo**: List (grid de cards)
- **Persona Primária**: Ana (Organizadora Familiar) - Mobile-first
- **Responsividade**:
  - Mobile (< 576px): 1 coluna
  - Tablet (576-991px): 2 colunas
  - Desktop (>= 992px): 3-4 colunas (auto-fill minmax 280px)
- **Acessibilidade**: WCAG 2.1 AA (contraste, keyboard nav, ARIA, screen reader)

### Performance Considerations

- **Change Detection**: `OnPush` em todos componentes
- **Lazy Loading**: Rota `/envelopes` carregada sob demanda
- **Computed Signals**: `progressVariant()`, `isOverBudget()`, `isNearLimit()`
- **Track by**: `envelope.id` em todos `@for` loops

**Detalhes completos em:** `layout-specification.md`

---

## 🏛️ Padrões Arquiteturais

### Padrões Seguidos

1. **DTO-First Architecture**: DTOs como contratos principais
2. **Estado Reativo com Signals**: Seguindo `AccountState` como referência
3. **Feature-based Organization**: Feature auto-contida em `features/envelopes/`
4. **Clean Architecture**: Separação clara de responsabilidades

### Decisões Arquiteturais

#### 1. EnvelopeDto com Dados Calculados

- **Decisão**: `currentUsage` e `usagePercentage` vêm do backend
- **Alternativas**: Calcular no frontend a partir das transações
- **Justificativa**: Backend é fonte da verdade; evita inconsistências; simplifica frontend

#### 2. Relacionamento 1:1 Category ↔ Envelope

- **Decisão**: Validação no backend; frontend exibe categorias disponíveis
- **Alternativas**: Validar também no frontend
- **Justificativa**: Backend já valida; evita duplicação de lógica

#### 3. Envelope Persistente (Não por Período)

- **Decisão**: Envelope criado uma vez vale para todos os meses
- **Alternativas**: Criar envelope específico por período
- **Justificativa**: Simplifica modelo; `currentUsage` é calculado para mês atual

#### 4. Sem Transferência entre Envelopes

- **Decisão**: Não implementar transferência entre envelopes
- **Alternativas**: Permitir mover "saldo" entre envelopes
- **Justificativa**: Como o `currentUsage` é **calculado** (não armazenado), não há "saldo" para transferir. Para ajustar limites, basta editar cada envelope individualmente. Alternativas: ajustar limites ou reclassificar transações.

---

## 📦 Definição dos DTOs

### EnvelopeDto

```typescript
// src/dtos/envelope/envelope-types.ts
export interface EnvelopeDto {
  id: string;
  budgetId: string;
  categoryId: string;
  categoryName: string; // Para exibição (vem do backend)
  name: string; // Nome do envelope
  limit: number; // Limite em centavos
  currentUsage: number; // Calculado pelo backend (centavos)
  usagePercentage: number; // Calculado pelo backend (0-100+)
  active: boolean;
  createdAt: string;
  updatedAt: string;
}
```

### Request DTOs

```typescript
// src/dtos/envelope/create-envelope-request-dto.ts
export interface CreateEnvelopeRequestDto {
  budgetId: string;
  categoryId: string;
  name: string;
  limit: number; // Em centavos
}

// src/dtos/envelope/update-envelope-request-dto.ts
export interface UpdateEnvelopeRequestDto {
  envelopeId: string;
  budgetId: string;
  name?: string;
  limit?: number; // Em centavos
}

// src/dtos/envelope/delete-envelope-request-dto.ts
export interface DeleteEnvelopeRequestDto {
  envelopeId: string;
  budgetId: string;
}
```

### Response DTOs

```typescript
// src/dtos/envelope/list-envelopes-response-dto.ts
export interface ListEnvelopesResponseDto {
  data: EnvelopeDto[];
  meta?: {
    count: number;
  };
}

export interface CreateEnvelopeResponseDto {
  id: string;
}

export interface UpdateEnvelopeResponseDto {
  success: boolean;
}

export interface DeleteEnvelopeResponseDto {
  success: boolean;
}
```

---

## 🔄 Fluxo de Dados

### Listagem de Envelopes

```
┌─────────────┐     ┌──────────────┐     ┌─────────────────┐     ┌─────────┐
│ EnvelopesPage│────▶│ EnvelopeState│────▶│ EnvelopesApiSvc │────▶│ Backend │
└─────────────┘     └──────────────┘     └─────────────────┘     └─────────┘
       │                   │                                           │
       │                   │◀──────────────────────────────────────────┘
       │                   │        EnvelopeDto[] (com currentUsage)
       │◀──────────────────┘
       │    envelopes()
       ▼
 ┌───────────────┐
 │ EnvelopeCard  │
 └───────────────┘
```

### Criação de Envelope

```
┌────────────────┐     ┌──────────────┐     ┌─────────────────┐
│ EnvelopeForm   │────▶│ EnvelopeState│────▶│ EnvelopesApiSvc │
│ (modal)        │     │ createEnv()  │     │ createEnvelope()│
└────────────────┘     └──────────────┘     └─────────────────┘
                              │                      │
                              │◀─────────────────────┘
                              │     id (success)
                              │
                              ▼
                       loadEnvelopes()
```

---

## 📋 EnvelopeState - Estrutura Proposta

```typescript
@Injectable({ providedIn: 'root' })
export class EnvelopeState {
  private readonly envelopesApi = inject(EnvelopesApiService);
  private readonly budgetSelectionService = inject(BudgetSelectionService);
  private readonly destroyRef = inject(DestroyRef);

  // Estado interno
  private readonly _envelopes = signal<EnvelopeDto[]>([]);
  private readonly _loading = signal<boolean>(false);
  private readonly _error = signal<string | null>(null);

  // Estado público (readonly)
  readonly envelopes = this._envelopes.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();

  // Computed signals
  readonly hasEnvelopes = computed(() => this._envelopes().length > 0);
  readonly envelopesCount = computed(() => this._envelopes().length);

  readonly envelopesByBudgetId = computed(() => {
    const budgetId = this.budgetSelectionService.selectedBudgetId();
    if (!budgetId) return [];
    return this._envelopes();
  });

  // Envelopes que excederam o limite
  readonly overBudgetEnvelopes = computed(() =>
    this._envelopes().filter((e) => e.usagePercentage > 100)
  );

  // Envelopes próximos do limite (80-100%)
  readonly nearLimitEnvelopes = computed(() =>
    this._envelopes().filter((e) => e.usagePercentage >= 80 && e.usagePercentage <= 100)
  );

  // Total alocado (soma dos limites)
  readonly totalAllocated = computed(() => this._envelopes().reduce((sum, e) => sum + e.limit, 0));

  // Total gasto (soma dos usos)
  readonly totalSpent = computed(() =>
    this._envelopes().reduce((sum, e) => sum + e.currentUsage, 0)
  );

  // Métodos de operação
  loadEnvelopes(force?: boolean): void {
    /* ... */
  }
  createEnvelope(dto: CreateEnvelopeRequestDto): void {
    /* ... */
  }
  updateEnvelope(dto: UpdateEnvelopeRequestDto): void {
    /* ... */
  }
  deleteEnvelope(dto: DeleteEnvelopeRequestDto): void {
    /* ... */
  }
  clearError(): void {
    /* ... */
  }
}
```

---

## 🎨 Componentes UI

### EnvelopeCard (Molécula)

Seguindo o padrão de `AccountCard`:

```typescript
@Component({
  selector: 'os-envelope-card',
  template: `
    <div class="envelope-card" [class.envelope-card--over-budget]="isOverBudget()">
      <header class="envelope-card__header">
        <h3 class="envelope-card__name">{{ envelope().name }}</h3>
        <span class="envelope-card__category">{{ envelope().categoryName }}</span>
      </header>

      <div class="envelope-card__progress">
        <os-progress-bar
          [value]="envelope().usagePercentage"
          [variant]="progressVariant()"
          [ariaLabel]="progressAriaLabel()"
        />
        <span class="envelope-card__percentage"
          >{{ envelope().usagePercentage | number : '1.0-1' }}%</span
        >
      </div>

      <div class="envelope-card__values">
        <div class="envelope-card__spent">
          <span class="envelope-card__label">Gasto</span>
          <os-money-display [value]="envelope().currentUsage" size="sm" />
        </div>
        <div class="envelope-card__limit">
          <span class="envelope-card__label">Limite</span>
          <os-money-display [value]="envelope().limit" size="sm" />
        </div>
      </div>

      <footer class="envelope-card__actions">
        <os-button variant="ghost" size="small" icon="edit" (buttonClick)="edit.emit(envelope())" />
        <os-button
          variant="ghost"
          size="small"
          icon="trash"
          (buttonClick)="delete.emit(envelope())"
        />
      </footer>
    </div>
  `,
})
export class EnvelopeCardComponent {
  readonly envelope = input.required<EnvelopeDto>();
  readonly edit = output<EnvelopeDto>();
  readonly delete = output<EnvelopeDto>();

  readonly isOverBudget = computed(() => this.envelope().usagePercentage > 100);

  readonly progressVariant = computed(() => {
    const pct = this.envelope().usagePercentage;
    if (pct > 100) return 'danger';
    if (pct >= 80) return 'warning';
    return 'success';
  });
}
```

### EnvelopesPage

Seguindo o padrão de `AccountsPage`:

```typescript
@Component({
  selector: 'os-envelopes-page',
  template: `
    <os-page variant="default" size="medium" ariaLabel="Página de envelopes">
      <os-page-header
        title="Envelopes"
        subtitle="Gerencie seus limites de gastos por categoria"
        [actions]="pageHeaderActions()"
        (actionClick)="onPageHeaderActionClick($event)"
      />

      @if (currentState() === 'error') {
      <os-alert type="error" [title]="'Erro ao carregar envelopes'">
        {{ errorMessage() }}
      </os-alert>
      }

      <os-entity-list
        layout="grid"
        size="medium"
        [isLoading]="currentState() === 'loading'"
        [isEmpty]="currentState() === 'empty'"
        loadingText="Carregando envelopes..."
        emptyTitle="Nenhum envelope cadastrado"
        emptyText="Crie seu primeiro envelope para controlar seus gastos por categoria"
        emptyIcon="wallet"
        [emptyAction]="!!selectedBudgetId()"
        emptyActionLabel="Criar primeiro envelope"
        (emptyActionClick)="openCreateModal()"
      >
        @for (envelope of envelopes(); track envelope.id) {
        <os-envelope-card
          [envelope]="envelope"
          (edit)="onEditEnvelope($event)"
          (delete)="onDeleteEnvelope($event)"
        />
        }
      </os-entity-list>

      <!-- Modais -->
      @if (showCreateModal()) {
      <os-envelope-form [mode]="'create'" (saved)="onFormSaved()" (cancelled)="onFormCancelled()" />
      } @if (showDeleteModal() && deletingEnvelope()) {
      <os-confirm-delete-modal [envelope]="deletingEnvelope()!" (closed)="closeDeleteModal()" />
      }
    </os-page>
  `,
})
export class EnvelopesPage {
  /* ... */
}
```

---

## 🧪 Considerações de Teste

### Testes Unitários

| Componente              | Testes Necessários                                                              |
| ----------------------- | ------------------------------------------------------------------------------- |
| `EnvelopeDto`           | Validação de estrutura                                                          |
| `EnvelopeState`         | loadEnvelopes, createEnvelope, updateEnvelope, deleteEnvelope, computed signals |
| `EnvelopesApiService`   | Chamadas HTTP, tratamento de erros                                              |
| `EnvelopeCardComponent` | Renderização, progressVariant, isOverBudget                                     |
| `EnvelopeFormComponent` | Validação de formulário, submit, cancel                                         |

### Testes de Integração

- Fluxo completo de CRUD
- Integração com BudgetSelectionService
- Integração com CategoriesApiService no formulário

### Mocks e Fixtures

```typescript
// Mock data para testes
export const mockEnvelopes: EnvelopeDto[] = [
  {
    id: 'envelope-1',
    budgetId: 'budget-1',
    categoryId: 'category-1',
    categoryName: 'Alimentação',
    name: 'Envelope Alimentação',
    limit: 80000, // R$ 800,00
    currentUsage: 45000, // R$ 450,00
    usagePercentage: 56.25,
    active: true,
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-12-03T00:00:00Z',
  },
  {
    id: 'envelope-2',
    budgetId: 'budget-1',
    categoryId: 'category-2',
    categoryName: 'Transporte',
    name: 'Envelope Transporte',
    limit: 30000, // R$ 300,00
    currentUsage: 35000, // R$ 350,00 (estouro!)
    usagePercentage: 116.67,
    active: true,
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-12-03T00:00:00Z',
  },
];
```

---

## ⚖️ Trade-offs e Riscos

### Trade-offs Aceitos

| Trade-off                   | Benefício              | Custo                                  |
| --------------------------- | ---------------------- | -------------------------------------- |
| `currentUsage` do backend   | Consistência garantida | Dependência de API                     |
| Envelope persistente        | Modelo simples         | Não permite limites diferentes por mês |
| Validação 1:1 só no backend | DRY, menos código      | UX de erro reativa                     |

### Riscos Identificados

| Risco                                  | Probabilidade | Impacto | Mitigação                          |
| -------------------------------------- | ------------- | ------- | ---------------------------------- |
| Backend não retornar `usagePercentage` | Baixa         | Alto    | Calcular no frontend se necessário |
| Performance com muitos envelopes       | Baixa         | Médio   | Paginação futura                   |
| Inconsistência categoria/envelope      | Baixa         | Médio   | Reload após operações              |

---

## 📋 Lista de Implementação

### Fase 1: Fundação (DTOs e Serviços)

- [ ] Criar DTOs em `src/dtos/envelope/`
- [ ] Criar `EnvelopesApiService`
- [ ] Criar `EnvelopeState`
- [ ] Atualizar MSW handlers (remover add/remove amount e transfer)
- [ ] Criar testes unitários para serviços

### Fase 2: Componentes UI

- [ ] Criar `EnvelopeCardComponent` (molécula) conforme `layout-specification.md`
  - [ ] Progress bar com variantes (success/warning/danger)
  - [ ] Indicador visual de status (border-left colorido)
  - [ ] Responsividade (mobile/tablet/desktop)
  - [ ] Acessibilidade (ARIA, keyboard nav)
- [ ] Criar `EnvelopeFormComponent`
  - [ ] Campos: nome, categoria (select), limite (money input)
  - [ ] Validação inline em cada campo
  - [ ] Modo criar/editar
- [ ] Criar `ConfirmDeleteModalComponent`
- [ ] Criar testes de componentes

### Fase 3: Páginas e Rotas

- [ ] Criar `EnvelopesPage` conforme `layout-specification.md`
  - [ ] `os-page` + `os-page-header` + `os-entity-list`
  - [ ] States: loading, empty, error, success
  - [ ] Grid responsivo (1/2/3-4 colunas)
- [ ] Criar `EnvelopeDetailPage` (opcional MVP)
- [ ] Configurar rotas em `envelopes.routes.ts` (lazy loading)
- [ ] Adicionar rota em `app.routes.ts`
- [ ] Adicionar link na navegação lateral

### Fase 4: Integrações e Alertas

- [ ] Criar `EnvelopeCalculationService` para exposição de dados
- [ ] Integrar com `CategorySpendingWidgetComponent`
- [ ] Integrar com `FinancialHealthIndicatorComponent`
- [ ] Implementar alertas de excedentes via `NotificationService`

### Fase 5: Polimento e Validação

- [ ] Testes de integração
- [ ] Validar acessibilidade (WCAG 2.1 AA)
  - [ ] Contraste >= 4.5:1
  - [ ] Keyboard navigation completa
  - [ ] Screen reader announcements
- [ ] Validar responsividade
  - [ ] Mobile < 576px (1 coluna)
  - [ ] Tablet 576-991px (2 colunas)
  - [ ] Desktop >= 992px (3-4 colunas)
- [ ] Validar Layout Specification Criteria (ver `layout-specification.md`)
- [ ] Code review e ajustes finais

---

## 📚 Referências

### Meta Specs

- `technical/backend-architecture/domain-model.md` - Modelo de Envelope
- `business/financial-health.md` - Indicadores de saúde financeira
- `technical/frontend-architecture/` - Padrões de arquitetura

### Código de Referência

- `src/app/features/accounts/` - Estrutura de feature
- `src/app/core/services/account/account-state/` - Padrão de estado
- `src/dtos/account/` - Padrão de DTOs
- `src/app/shared/ui-components/molecules/account-card/` - Padrão de card

### Documentação Angular

- [Signals](https://angular.dev/guide/signals)
- [Standalone Components](https://angular.dev/guide/standalone-components)
- [Reactive Forms](https://angular.dev/guide/forms/reactive-forms)
