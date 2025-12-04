# Padronização de Modais e Componentes de Confirmação no Design System - Arquitetura Técnica

## 🏗️ Visão Geral da Implementação

### Estado Atual

**Problemas Identificados:**

1. **Duplicação de Código**: 3 implementações idênticas de modal de confirmação de exclusão:
   - `src/app/features/envelopes/components/confirm-delete-modal/`
   - `src/app/features/accounts/components/confirm-delete-modal/`
   - `src/app/features/credit-cards/components/confirm-delete-modal/`

2. **Uso de `confirm()` nativo**: `os-category-manager.component.ts` usa `confirm()` do navegador

3. **Formulários em Modais**: 5 formulários que deveriam ser páginas:
   - `envelope-form` (criar/editar envelope)
   - `pay-bill-modal` (pagar fatura)
   - `goal-amount-modal` (adicionar/remover aporte)
   - `transfer-modal` (transferência entre contas)
   - `reconcile-modal` (reconciliar saldo)

**Componentes Base Existentes:**
- `os-modal.component.ts` - Componente base genérico
- `os-modal-template.component.ts` - Template wrapper com configuração
- Angular Material Dialog (`MatDialog`) já importado no projeto

### Mudanças Propostas

**Fase 1:**
- Criar `os-confirm-dialog.component.ts` no Design System
- Criar `ConfirmDialogService` para abertura programática
- Substituir 3 modais duplicados pelo novo componente
- Substituir `confirm()` nativo pelo serviço

**Fase 2:**
- Migrar 5 formulários de modais para páginas dedicadas
- Adicionar rotas seguindo padrão lazy loading
- Manter toda funcionalidade existente

### Impactos

**Componentes Afetados:**
- Design System: Novo componente e serviço
- Features: Remoção de 3 componentes duplicados, migração de 5 modais
- Rotas: Adição de novas rotas em 4 features (envelopes, credit-cards, goals, accounts)

## 🔧 Componentes e Estrutura

### Arquivos Principais a Modificar

**Fase 1:**
- `src/app/shared/ui-components/organisms/os-category-manager/os-category-manager.component.ts` (linha 680) - Substituir `confirm()` por serviço
- `src/app/features/envelopes/components/confirm-delete-modal/` - **REMOVER** (substituir por serviço)
- `src/app/features/accounts/components/confirm-delete-modal/` - **REMOVER** (substituir por serviço)
- `src/app/features/credit-cards/components/confirm-delete-modal/` - **REMOVER** (substituir por serviço)

**Fase 2:**
- `src/app/features/envelopes/envelopes.routes.ts` - Adicionar rotas `/new` e `/:id/edit`
- `src/app/features/credit-cards/credit-cards.routes.ts` - Adicionar rota `/bills/:id/pay`
- `src/app/features/goals/goals.routes.ts` - Adicionar rotas `/:id/add-amount` e `/:id/remove-amount`
- `src/app/features/accounts/accounts.routes.ts` - Adicionar rotas `/transfer` e `/:id/reconcile`

### Novos Arquivos a Criar

**Fase 1:**
- `src/app/shared/ui-components/organisms/os-confirm-dialog/os-confirm-dialog.component.ts` - Componente de confirmação
- `src/app/shared/ui-components/organisms/os-confirm-dialog/os-confirm-dialog.component.scss` - Estilos
- `src/app/shared/ui-components/organisms/os-confirm-dialog/os-confirm-dialog.component.spec.ts` - Testes
- `src/app/shared/ui-components/organisms/os-confirm-dialog/index.ts` - Exports
- `src/app/core/services/confirm-dialog/confirm-dialog.service.ts` - Serviço para abertura programática
- `src/app/core/services/confirm-dialog/confirm-dialog.service.spec.ts` - Testes do serviço
- `src/app/core/services/confirm-dialog/index.ts` - Exports

**Fase 2:**
- `src/app/features/envelopes/pages/envelope-form/envelope-form.page.ts` - Página de criar/editar envelope
- `src/app/features/envelopes/pages/envelope-form/envelope-form.page.scss` - Estilos
- `src/app/features/credit-cards/pages/pay-bill/pay-bill.page.ts` - Página de pagar fatura
- `src/app/features/credit-cards/pages/pay-bill/pay-bill.page.scss` - Estilos
- `src/app/features/goals/pages/goal-amount/goal-amount.page.ts` - Página de adicionar/remover aporte
- `src/app/features/goals/pages/goal-amount/goal-amount.page.scss` - Estilos
- `src/app/features/accounts/pages/transfer/transfer.page.ts` - Página de transferência
- `src/app/features/accounts/pages/transfer/transfer.page.scss` - Estilos
- `src/app/features/accounts/pages/reconcile/reconcile.page.ts` - Página de reconciliar
- `src/app/features/accounts/pages/reconcile/reconcile.page.scss` - Estilos

### Estrutura de Diretórios

```
src/app/
├── shared/
│   └── ui-components/
│       └── organisms/
│           └── os-confirm-dialog/
│               ├── os-confirm-dialog.component.ts
│               ├── os-confirm-dialog.component.scss
│               ├── os-confirm-dialog.component.spec.ts
│               └── index.ts
├── core/
│   └── services/
│       └── confirm-dialog/
│           ├── confirm-dialog.service.ts
│           ├── confirm-dialog.service.spec.ts
│           └── index.ts
└── features/
    ├── envelopes/
    │   ├── pages/
    │   │   └── envelope-form/
    │   │       ├── envelope-form.page.ts
    │   │       └── envelope-form.page.scss
    │   └── envelopes.routes.ts (modificar)
    ├── credit-cards/
    │   ├── pages/
    │   │   └── pay-bill/
    │   │       ├── pay-bill.page.ts
    │   │       └── pay-bill.page.scss
    │   └── credit-cards.routes.ts (modificar)
    ├── goals/
    │   ├── pages/
    │   │   └── goal-amount/
    │   │       ├── goal-amount.page.ts
    │   │       └── goal-amount.page.scss
    │   └── goals.routes.ts (modificar)
    └── accounts/
        ├── pages/
        │   ├── transfer/
        │   │   ├── transfer.page.ts
        │   │   └── transfer.page.scss
        │   └── reconcile/
        │       ├── reconcile.page.ts
        │       └── reconcile.page.scss
        └── accounts.routes.ts (modificar)
```

## 🏛️ Padrões Arquiteturais

### Padrões Seguidos

- **Standalone Components**: Todos os componentes standalone
- **Signals**: Estado reativo com `signal()` e `computed()`
- **OnPush Change Detection**: Otimização de performance
- **Injeção de Dependências**: Usar `inject()` ao invés de constructor
- **TypeScript Strict**: Tipagem rigorosa
- **Angular Material Dialog**: Usar `MatDialog` para abertura programática
- **Promise-based API**: Serviço retorna `Promise<boolean>` (mais simples que Observable)

### Decisões Arquiteturais

#### Decisão 1: Usar MatDialog para abertura programática

**Alternativas:**
1. Usar MatDialog (Angular Material)
2. Criar serviço customizado sem MatDialog
3. Usar componente diretamente no template

**Justificativa:**
- Angular Material Dialog é padrão da indústria
- Já está importado no projeto (`os-modal.component.ts` usa `MatDialogRef`)
- Facilita gerenciamento de overlay, foco e acessibilidade
- Suporta Promise nativamente via `afterClosed()`

#### Decisão 2: Retornar Promise<boolean> ao invés de Observable

**Alternativas:**
1. `Promise<boolean>` - Simples e direto
2. `Observable<boolean>` - Mais reativo, mas mais complexo

**Justificativa:**
- Promise é mais simples para casos de uso único (confirmação)
- Não precisa de unsubscribe
- Mais aderente às boas práticas do Angular moderno para diálogos
- Padrão comum em serviços de diálogo (ex: SweetAlert2)

#### Decisão 3: Variantes apenas visuais (danger, warning, info)

**Alternativas:**
1. Variantes afetam apenas estilos
2. Variantes afetam textos e estilos

**Justificativa:**
- Textos customizáveis via parâmetros do serviço
- Variantes visuais são suficientes para diferenciação
- Mantém API simples e flexível

#### Decisão 4: Componente não gerencia loading/erros

**Alternativas:**
1. Componente retorna apenas confirmação (true/false)
2. Componente gerencia loading e erros internamente

**Justificativa:**
- Separação de responsabilidades (SRP)
- Consumidor tem controle total sobre o fluxo
- Mais flexível para diferentes casos de uso
- Alinhado com decisão de retornar apenas confirmação

## 📦 Dependências e Integrações

### Dependências Existentes

- **Angular Material Dialog**: `@angular/material/dialog` - Já importado
- **OsModalComponent**: Componente base genérico
- **OsModalTemplateComponent**: Template wrapper
- **OsButtonComponent**: Botões do design system
- **Signals**: `@angular/core` - Para estado reativo

### Novas Dependências

**Nenhuma** - Todas as dependências necessárias já estão no projeto

### Integrações

- **MatDialog**: Usar `MatDialog.open()` para abertura programática
- **OsModalComponent**: Reutilizar como base para o diálogo
- **Rotas**: Integrar com sistema de rotas lazy loading existente
- **Templates de Página**: Reutilizar `os-form-template` e `os-page-template`

## 🎨 UI Components and Layout

### Design System Integration

**Componentes Reutilizados:**

- **Atoms**: `os-button`, `os-icon`, `os-label`, `os-input`, `os-select`, `os-money-input`
- **Molecules**: `os-form-field`, `os-alert`, `os-card`
- **Organisms**: `os-modal`, `os-modal-template`, `os-page`, `os-page-header`
- **Templates**: `os-form-template`, `os-page-template` (se existir)

**Design Tokens Utilizados:**

- Spacing: `--os-spacing-sm` (12px), `--os-spacing-md` (16px), `--os-spacing-lg` (24px)
- Colors: `--os-color-error`, `--os-color-warning`, `--os-color-info` (variantes)
- Typography: `--os-font-size-sm`, `--os-font-size-md`, `--os-font-size-lg`
- Border-radius: `--os-radius-sm` (4px), `--os-radius-md` (8px)

### New Components Required

**os-confirm-dialog (Organism):**

- **Localização**: `src/app/shared/ui-components/organisms/os-confirm-dialog/`
- **Variantes**: `danger`, `warning`, `info` (apenas visuais)
- **Tamanhos**: `small` (400px max-width)
- **Responsividade**: Mobile-first, adapta para tablet/desktop
- **Acessibilidade**: WCAG 2.1 AA compliant, keyboard navigation, ARIA completo

**Detalhes completos em:** `layout-specification.md`

### Layout Architecture

**Fase 1 - Modal de Confirmação:**

- Overlay sobre interface atual
- Centralizado vertical e horizontalmente
- Backdrop com blur e opacity
- Animações suaves de entrada/saída (300ms)
- Focus trap e gerenciamento de foco

**Fase 2 - Páginas de Formulário:**

- Páginas dedicadas com URLs próprias
- Layout usando `os-page` e `os-form-template`
- Navegação via Router com histórico
- Responsivo: mobile-first, adapta para tablet/desktop
- Breadcrumbs e botão voltar quando aplicável

### Performance Considerations

**Modal de Confirmação:**

- Componente pequeno (~5KB)
- Carregado sob demanda via serviço
- Sem impacto no bundle inicial
- Animações otimizadas (GPU-accelerated)

**Páginas de Formulário:**

- Lazy loaded via rotas (~10-15KB cada)
- OnPush change detection
- Computed signals para derivações
- Sem memory leaks (unsubscribe adequado)

**Impacto Total:**

- Bundle size: +~80KB (todas as páginas lazy loaded)
- Performance: Sem impacto no carregamento inicial
- Runtime: Otimizado com OnPush e signals

### Responsive Strategy

- **Mobile (0-575px)**: Modal full-width, formulários em coluna única
- **Tablet (576-991px)**: Modal centralizado 400px, formulários em 2 colunas quando aplicável
- **Desktop (992px+)**: Modal centralizado, formulários em grid completo

**Detalhes completos em:** `layout-specification.md`

## 🔄 Fluxo de Dados

### Fase 1: ConfirmDialogService

```
Componente Consumidor
    ↓
ConfirmDialogService.open(config)
    ↓
MatDialog.open(OsConfirmDialogComponent, { data: config })
    ↓
OsConfirmDialogComponent exibe diálogo
    ↓
Usuário confirma ou cancela
    ↓
MatDialogRef.close(true | false)
    ↓
Promise<boolean> resolve
    ↓
Componente Consumidor executa ação
```

### Fase 2: Migração de Formulários

```
Usuário clica em ação (ex: "Criar Envelope")
    ↓
Router.navigate(['/envelopes/new'])
    ↓
Página carregada via lazy loading
    ↓
Componente de página renderiza formulário
    ↓
Usuário preenche e submete
    ↓
State executa ação (create/update)
    ↓
Router.navigate(['/envelopes']) - Volta para lista
```

## 🧪 Considerações de Teste

### Testes Unitários

**OsConfirmDialogComponent:**
- Renderização com diferentes variantes (danger, warning, info)
- Textos customizáveis (título, mensagem, botões)
- Eventos de confirmação e cancelamento
- Acessibilidade (ARIA labels, foco)

**ConfirmDialogService:**
- Abertura do diálogo com MatDialog
- Retorno de Promise<boolean> correto
- Configuração de dados passada ao componente
- Fechamento do diálogo

### Testes de Integração

- Substituição dos 3 modais duplicados
- Substituição do `confirm()` nativo
- Migração de cada formulário para página
- Navegação entre páginas
- Preservação de funcionalidade

### Mocks e Fixtures

- Mock de `MatDialog` e `MatDialogRef`
- Fixtures de dados para testes de formulários
- Mock de `Router` para testes de navegação

## ⚖️ Trade-offs e Riscos

### Trade-offs Aceitos

1. **Promise vs Observable**: Escolhemos Promise por simplicidade, mas perdemos capacidade de cancelamento
2. **Componente simples vs rico**: Componente retorna apenas confirmação, consumidor gerencia o resto
3. **Migração gradual vs completa**: Faremos migração completa de uma vez para evitar estado intermediário

### Riscos Identificados

1. **Breaking Changes**: Substituição dos modais pode quebrar funcionalidades
   - **Mitigação**: Testes abrangentes antes de remover código

2. **Migração de Formulários**: Lógica complexa pode ser perdida
   - **Mitigação**: Migrar um formulário por vez, validar cada um

3. **Rotas Conflitantes**: Novas rotas podem conflitar com existentes
   - **Mitigação**: Revisar todas as rotas antes de adicionar

4. **Estado de Loading**: Consumidor precisa gerenciar loading manualmente
   - **Mitigação**: Documentar padrão de uso do serviço

### Mitigações

- Manter código antigo comentado temporariamente
- Testes de regressão para cada substituição
- Validação manual de cada migração
- Documentação clara de uso do novo serviço

## 📋 Lista de Implementação

### Fase 1: Modal de Confirmação

- [ ] Criar `os-confirm-dialog.component.ts` com variantes
- [ ] Criar estilos para variantes (danger, warning, info)
- [ ] Criar `ConfirmDialogService` com método `open()`
- [ ] Implementar testes unitários do componente
- [ ] Implementar testes unitários do serviço
- [ ] Implementar responsividade (mobile/tablet/desktop)
- [ ] Implementar acessibilidade (ARIA, keyboard, focus trap)
- [ ] Substituir `confirm()` nativo no `os-category-manager`
- [ ] Substituir modal de exclusão de envelopes
- [ ] Substituir modal de exclusão de accounts
- [ ] Substituir modal de exclusão de credit-cards
- [ ] Remover componentes duplicados
- [ ] Validar acessibilidade (WCAG 2.1 AA)

### Fase 2: Migração de Formulários

- [ ] Criar página `envelope-form.page.ts` (criar/editar)
- [ ] Adicionar rotas `/envelopes/new` e `/envelopes/:id/edit`
- [ ] Migrar lógica do `envelope-form.component.ts`
- [ ] Implementar layout responsivo para envelope-form
- [ ] Criar página `pay-bill.page.ts`
- [ ] Adicionar rota `/credit-cards/bills/:id/pay`
- [ ] Migrar lógica do `pay-bill-modal.component.ts`
- [ ] Implementar layout responsivo para pay-bill
- [ ] Criar página `goal-amount.page.ts` (adicionar/remover)
- [ ] Adicionar rotas `/goals/:id/add-amount` e `/goals/:id/remove-amount`
- [ ] Migrar lógica do `goal-amount-modal.component.ts`
- [ ] Implementar layout responsivo para goal-amount
- [ ] Criar página `transfer.page.ts`
- [ ] Adicionar rota `/accounts/transfer`
- [ ] Migrar lógica do `transfer-modal.component.ts`
- [ ] Implementar layout responsivo para transfer
- [ ] Criar página `reconcile.page.ts`
- [ ] Adicionar rota `/accounts/:id/reconcile`
- [ ] Migrar lógica do `reconcile-modal.component.ts`
- [ ] Implementar layout responsivo para reconcile
- [ ] Remover componentes de modal migrados
- [ ] Validar navegação e funcionalidade
- [ ] Validar responsividade em todas as resoluções

## 📚 Referências

- **Meta Specs**: `/home/danilo/workspace/projeto-orca-sonhos/orca-sonhos-meta-specs`
- **Angular Material Dialog**: [Documentação oficial](https://material.angular.io/components/dialog)
- **Componentes Base**: 
  - `src/app/shared/ui-components/organisms/os-modal/`
  - `src/app/shared/ui-components/templates/os-modal-template/`
- **Padrão de Rotas**: Verificar `src/app/features/*/routes.ts`
- **Angular Best Practices**: Consultar `mcp_angular-cli_get_best_practices`

