# Padronização de layout e UI com DS - Arquitetura Técnica

## 🏗️ Visão Geral da Implementação

### Estado Atual

- App Angular 20+ com componentes standalone, SCSS, SSR configurado e vitest.
- Inconsistências entre páginas (Dashboard, Orçamentos, Contas, Cartões, Metas, Transações, Relatórios, Configurações):
  - Espaçamentos/gaps/paddings diferentes (inclui `grid-area`/estilos inline no Dashboard).
  - Botões misturando `mat-*` e `os-button`.
  - Filtros sem padrão unificado.
  - Entidades com cartões/listas heterogêneas.
  - Estados de loading/vazio e alertas dispersos.
  - Formatação de moeda/datas divergente do locale `pt-BR`.
  - Regras de A11y variáveis.

### Mudanças Propostas

- Padronizar estrutura de páginas com `os-page` e `os-page-header`.
- Unificar grids/gaps/paddings com tokens de espaço e `os-grid/os-widget-grid`, removendo estilos inline.
- Migrar totalmente para `os-button` (variantes e tamanhos definidos).
- Padronizar filtros com `os-filter-bar` + campos (`os-input`, `os-select`, date range).
- Adotar `os-entity-card` + `os-entity-actions` e `os-entity-list` quando aplicável.
- Implementar `os-empty-state` e `os-skeleton`; consolidar `os-alert`/toasts com `aria-live` adequado.
- Centralizar formatação `pt-BR` (moeda e datas) e auditar Relatórios.
- Aplicar boas práticas de A11y (contraste AA, foco, aria-\*).

### Impactos

- Camada de apresentação: reestruturação de containers/headers, grids e componentes de ação.
- Remoção de dependências visuais de Angular Material para botões (e artefatos relacionados).
- Ajustes em pipes/serviços de formatação.
- Pequenas adequações de estilos para responsividade e SSR.

## 🔧 Componentes e Estrutura

### Arquivos Principais a Modificar

- Páginas de topo do app (containers de cada rota de menu): adotar `os-page`/`os-page-header`, substituir botões por `os-button`, alinhar grids com tokens.
- Componentes de listas/cards existentes: migrar para `os-entity-card`/`os-entity-actions`/`os-entity-list` conforme o caso.
- Componentes de filtros em Orçamentos e Metas: padronizar com `os-filter-bar` + campos DS.
- Relatórios e widgets do Dashboard: remover estilos inline (`grid-area`) e unificar espaçamentos com `os-grid`.
- Utilitários de formatação (datas/moeda): centralizar para `pt-BR` (pipe/serviço).

### Novos Arquivos a Criar

- `src/shared/ui/layout/os-page/` (se ainda não existir): container com espaçamentos verticais por breakpoint.
- `src/shared/ui/layout/os-page-header/`: título, descrição, ações (primary/secondary).
- `src/shared/ui/layout/os-grid/` e/ou `os-widget-grid/`: helpers de grid e tokens de gaps.
- `src/shared/ui/feedback/os-empty-state/` e `src/shared/ui/feedback/os-skeleton/`: estados vazio/loading.
- `src/shared/ui/feedback/os-alert/` (ou consolidação dos existentes): níveis, posição, `aria-live`.
- `src/shared/formatting/locale.service.ts` (ou pipe equivalente): centralização de `pt-BR` (moeda e datas).

Obs.: Se estes componentes `os-*` já existirem no DS local, apenas referenciar e integrar; não duplicar.

### Estrutura de Diretórios

- `src/shared/ui/**`: componentes base do DS consumidos pelo app.
- `src/features/**` (ou `src/app/pages/**` conforme padrão do repo): páginas aplicando os padrões acima.
- `src/shared/formatting/**`: serviços/pipes utilitários de locale.

## 🏛️ Padrões Arquiteturais

### Padrões Seguidos

- Standalone components (sem NgModules), ChangeDetection OnPush, sinais para estado local.
- Control flow nativo (`@if`, `@for`, `@switch`), bindings de `class`/`style` (sem `ngClass`/`ngStyle`).
- `input()`/`output()` functions, `inject()` em serviços, `providedIn: 'root'`.
- `NgOptimizedImage` para imagens estáticas.
- Sem `@HostBinding`/`@HostListener`; use `host` no decorator.

### Decisões Arquiteturais

- Decisão: substituir completamente botões Material por `os-button`.
  - Alternativas: manter parcialmente `mat-button` — rejeitada para consistência e manutenção.
  - Justificativa: unificar variantes/tamanhos/estilos, reduzir dívidas visuais.
- Decisão: centralizar locale `pt-BR` em serviço/pipe único.
  - Alternativas: aplicar formatação ad-hoc — rejeitada por risco de inconsistência.
  - Justificativa: padronização, fácil auditoria, testes previsíveis.
- Decisão: consolidar empty/loading/alertas em componentes DS.
  - Alternativas: múltiplos padrões — rejeitada por UX inconsistente.

## 📦 Dependências e Integrações

### Dependências Existentes

- Angular 20+, SSR, vitest, Material (parcial).

### Novas Dependências

- Não obrigatórias. Opcional em dev: ferramenta de a11y (ex.: `axe-core`) para apoio local.

### Integrações

- DS local via Storybook: fonte de verdade para `os-*` (variantes, tokens, exemplos).

## 🔄 Fluxo de Dados

- Fluxo permanece o mesmo (caso de uso → apresentação). Alterações são majoritariamente visuais/comportamentais na camada de UI.
- Serviços de formatação `pt-BR` consumidos por pipes/templates; eventos de UI seguem outputs existentes.

## 🧪 Considerações de Teste

### Testes Unitários

- Pipes/serviços de formatação (moeda/datas) para `pt-BR`.
- Comportamentos de componentes de lista/card (ex.: ações, estados vazios).
- Cabeçalho de página: presença de ações e acessibilidade mínima (foco).

### Testes de Integração

- Páginas com filtros padronizados (Orçamentos, Metas): integração entre `os-filter-bar` e a camada de dados.
- Relatórios: validação de formatação e estados de loading/vazio.

### Mocks e Fixtures

- Fixtures de entidades para listas/cards.
- Mocks de datas/moeda para validar `pt-BR`.

## ⚖️ Trade-offs e Riscos

### Trade-offs Aceitos

- Execução incremental por fundação → botões → filtros → entidades → locale → feedback → páginas: reduz risco de regressão ampla, mas exige coordenação.

### Riscos Identificados

- Regressões visuais durante migração; mitigar com validação visual por página.
- A11y: possíveis ajustes de contraste/foco em temas existentes; mitigar com checklist leve e revisão manual.
- SSR: garantir que novos componentes não quebrem hidratação; revisar warnings.

## 📋 Lista de Implementação

- [ ] Fundações: `os-page`, `os-page-header`, `os-grid` + tokens de espaço (remover inline styles em Dashboard).
- [ ] Botões: migrar tudo para `os-button` (primary/secondary/danger; tamanhos); remover `mat-*` em botões.
- [ ] Filtros: padronizar `os-filter-bar` em Orçamentos e Metas.
- [ ] Entidades: `os-entity-card` + `os-entity-actions` e `os-entity-list` quando aplicável.
- [ ] Locale: centralizar `pt-BR` (datas/moeda) e auditar Relatórios.
- [ ] Feedback: `os-empty-state`, `os-skeleton`, `os-alert`/toasts com `aria-live`.
- [ ] Páginas: aplicar padrões em Contas, Cartões, Metas, Transações, Relatórios, Configurações (após Dashboard/Orçamentos).
- [ ] A11y: foco visível, aria em botões icônicos, contrastes AA, associações para gráficos/tabelas.
- [ ] Testes: unitários para formatadores e casos de UI críticos; integração leve em filtros.

## 📚 Referências

- Meta Specs: repositório de meta-especificações do projeto (ou padrão) — confirmar `ai.properties.md`; fallback: `https://github.com/danilotandrade1518/orca-sonhos-meta-specs`
- Angular Best Practices (recuperado via ferramenta interna)
- DS local via Storybook (`os-*`)
- Convenções do projeto em `CLAUDE.md`

## 🎨 UI Components and Layout

### Design System Integration

- Reutilizar componentes existentes do DS:
  - Atoms: `os-button`, `os-input`, `os-icon`, `os-badge`, `os-progress-bar`, `os-spinner`
  - Molecules: `os-form-field`, `os-card`, `os-filter-bar`
  - Organisms: `os-page-header`, `os-entity-card`, `os-entity-list`, `os-alert`
  - Templates: `os-app-shell-template`, `os-dashboard-template`, `os-form-template`
- Aplicar `os-page`/`os-page-header` como base de páginas; unificar espaçamentos com tokens e `os-grid`.

### New Components Required

- Nenhum novo componente de DS necessário nesta fase. Ajustes são de integração/adaptação nos containers de páginas.

### Layout Architecture

- Mobile-first com breakpoints (mobile, tablet, desktop).
- Cabeçalho padronizado (`os-page-header`) com ações primária/secundária.
- Filtros padronizados (`os-filter-bar`) onde aplicável (Orçamentos e Metas).
- Cards/Listas unificados com `os-entity-card`/`os-entity-list` e `os-entity-actions`.
- Estados globais de UI com `os-empty-state`, `os-skeleton`, `os-alert`.
- Formatação centralizada `pt-BR` (datas/moeda).

### Performance Considerations

- Manter OnPush e signals.
- Reutilização de DS para evitar CSS/JS redundante.
- Garantir que estilos críticos do cabeçalho/grids sejam leves.

Detalhes completos em: `sessions/OS-233/layout-specification.md`
