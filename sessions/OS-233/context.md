# Padronização de layout e UI com DS - Contexto de Desenvolvimento

# OS-233

## 🎯 Objetivo

Padronizar a interface e o layout de todas as páginas acessíveis via menu do aplicativo utilizando o Design System (DS) `os-*`, garantindo consistência visual, usabilidade, acessibilidade (AA), responsividade e manutenção simplificada. Eliminar discrepâncias de espaçamento, grids, botões, filtros, cards/listas, estados de vazio/loading e formatação/locale pt-BR.

## 📋 Requisitos Funcionais

### Funcionalidades Principais

- Fundações de layout e containers com `os-page`, `os-page-header` e `os-grid/os-widget-grid`, aplicando tokens de espaçamento padrão.
- Migração total de botões para `os-button`, padronizando variantes (primary, secondary, danger) e tamanhos (page-header=medium, cards/listas=small), incluindo ícone-only com `aria-label`.
- Padronização de filtros com `os-filter-bar` e campos (`os-input`, `os-select`, date range); inicialmente em Orçamentos e Metas.
- Unificação de cards/listas com `os-entity-card` (slots: title, meta, metrics, actions) e `os-entity-actions` (“more”), além de listas `os-entity-list` quando aplicável.
- Implementação de `os-empty-state` e `os-skeleton` para estados vazio/loading; consolidação de alertas/toasts (`os-alert`) com níveis, posicionamento e `aria-live` corretos.
- Correção e centralização do locale `pt-BR` para moeda e datas, cobrindo Relatórios e demais páginas.
- Acessibilidade: foco visível, contrastes AA, `aria-label` em botões icônicos, `aria-describedby`/tabela associada para gráficos, etiquetas e navegação por teclado.

### Comportamentos Esperados

- Remoção de estilos inline (ex.: `grid-area` em widgets do Dashboard); gaps/paddings uniformes via tokens.
- Remoção de artefatos Material em botões (ex.: `mat-mdc-button-touch-target`), adotando apenas `os-button`.
- Consistência visual e de interação entre Dashboard, Orçamentos, Contas, Cartões de Crédito, Metas, Transações, Relatórios e Configurações.
- Formatação de moeda/datas conforme `pt-BR` em todo o app, especialmente em Relatórios.
- Responsividade preservada e compatível com SSR.

## 🏗️ Considerações Técnicas

### Arquitetura

- Angular 20+ com componentes standalone, ChangeDetection OnPush, sinais para estado local e Clean Architecture vigente.
- Manter separação por camadas (Models, Application, Shared Core) e padrões de imutabilidade e Either para erros onde aplicável.
- Seguir convenções do projeto (CLAUDE.md): usar control flow nativo, bindings de classe/estilo, `NgOptimizedImage` para imagens estáticas, evitar `HostBinding`/`HostListener` fora do `host` no decorator.

### Tecnologias e Dependências

- Design System local (storybook local) como fonte de verdade para `os-*`.
- Evitar Angular Material para botões (migração total para `os-button`); demais componentes Material somente quando necessário e alinhado ao DS.
- Internacionalização/formatadores centralizados para `pt-BR` (moeda e datas).

### Padrões a Seguir

- Tokens de espaço padronizados (ex.: 2/4/8/12/16/24/32).
- `os-page` e `os-page-header` como estrutura base de páginas (título, descrição, ações).
- `os-grid/os-widget-grid` para grid spacing; sem estilos inline de layout.
- `os-filter-bar` para filtros comuns; `os-entity-card`/`os-entity-list` para entidades.
- Acessibilidade AA (foco, aria, contraste) e SSR preservados.

## 🧪 Estratégia de Testes

### Testes Necessários

- Testes unitários dos adaptadores/containers (quando existirem) e validações de formatação/locale.
- Testes de acessibilidade automatizados básicos (ex.: axe) e verificação manual de foco/teclado em fluxos críticos.
- Testes de regressão visual podem ser considerados posteriormente (fora do escopo imediato, se não houver setup).

### Critérios de Aceitação

- [ ] Padronizar cabeçalhos com `os-page-header` (título, descrição, ações primária/secundária).
- [ ] Introduzir `os-page` (container e espaçamentos verticais consistentes por breakpoint).
- [ ] Unificar grid/gaps/paddings via tokens e `os-grid/os-widget-grid`; remover estilos inline (ex.: `grid-area`).
- [ ] Migrar todos os botões para `os-button` e padronizar variantes/tamanhos, incluindo ícone-only com `aria-label`.
- [ ] Padronizar filtros com `os-filter-bar` + `os-input`/`os-select`/date range (Orçamentos e Metas).
- [ ] Unificar entidades com `os-entity-card` + `os-entity-actions`; listas com cabeçalho/paginação/vazios.
- [ ] Implementar `os-empty-state` e `os-skeleton`; consolidar `os-alert`/toasts (níveis, posicionamento, `aria-live`).
- [ ] Corrigir locale global `pt-BR` (moeda/datas) e garantir consistência em Relatórios e demais páginas.
- [ ] Acessibilidade AA: foco visível, `aria-*` adequado, contrastes, associações para gráficos/tabelas.
- [ ] Cobrir todas as páginas do menu, mantendo responsividade e SSR.

## 🔗 Dependências e Impactos

### Sistemas Afetados

- Todas as páginas do menu: Dashboard, Orçamentos, Contas, Cartões de Crédito, Metas, Transações, Relatórios, Configurações.
- Camada de apresentação (estrutura de páginas, componentes visuais e utilitários de formatação).

### Integrações Necessárias

- Storybook local do DS (`os-*`) como referência de componentes/variantes.
- Serviços/utilitários de formatação de moeda e datas centralizados (pt-BR).

## 🚧 Restrições e Considerações

### Limitações Técnicas

- Apenas Storybook local disponível para o DS neste momento.
- Escopo amplo exige execução incremental e validação visual contínua.

### Riscos

- Regressões visuais/UX durante migração de múltiplas páginas.
- Inconsistências se tokens/estruturas não forem aplicados de forma uniforme.
- Cobertura de a11y pode demandar ajustes de contraste/foco em temas existentes.

## 📚 Referências

- Issue: OS-233 — Padronização de layout e UI com DS
- DS: Storybook local (referência de `os-*`)
- Convenções do projeto: `CLAUDE.md`

---

## Proposta de Execução (confirmada)
1. Fundações/Tokens + `os-page`, `os-page-header`, `os-grid`.
2. Migração total para `os-button`.
3. Filtros (`os-filter-bar`) em Orçamentos/Metas.
4. Cards/listas (`os-entity-card` + `os-entity-actions`/`os-entity-list`).
5. Locale pt-BR (moeda e datas).
6. Empty/loading/error (`os-empty-state`, `os-skeleton`, `os-alert`/toasts).
7. Ajustes por página (Dashboard → Orçamentos → Contas → Cartões → Metas → Transações → Relatórios → Configurações).


