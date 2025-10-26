# Extrair header do Dashboard para e criar layout global - Arquitetura Técnica

## 🏗️ Visão Geral da Implementação

### Estado Atual

- Header e sidebar estão definidos no .

### Mudanças Propostas

- Criar e em .
- Criar para compor os dois + .
- Atualizar para aplicar o layout nas features.
- Remover header/sidebar do e projetar ações contextuais via slot.

### Impactos

- Padronização de layout; melhoria de UX e acessibilidade; suporte a dark mode.

## 🔧 Componentes e Estrutura

### Arquivos Principais a Modificar

- : remover header/sidebar; usar slot no layout.
- : aplicar às rotas de features.

### Novos Arquivos a Criar

-
-
-

### Estrutura de Diretórios

- Seguir padrões existentes de e .

## 🏛️ Padrões Arquiteturais

- Standalone components, signals, OnPush, clean architecture.
- Seguir estritamente Material Design M3 (Top App Bar, Navigation Drawer/Rail, Theming/Dark).

## 📦 Dependências e Integrações

- Router para navegação e item ativo; localStorage para preferências (tema/colapso).

## 🔄 Fluxo de Dados

- orquestra o estado (signals) e repassa para app bar/side bar.

## 🧪 Considerações de Teste

- Testes unitários dos componentes (render, variantes, eventos, responsividade básica).
- Testes de acessibilidade mínimos: roles/ARIA, foco visível, navegação por teclado.

## 📚 Stories do Storybook

- Criar/atualizar stories para:
  - : variantes (small/center/medium/large), comportamentos (fixed/elevate/hide-on-scroll), dark/light, overflow de ações.
  - : variantes (permanente/persistente/modal), rail colapsado, tooltips, breakpoints, item ativo.
  - : composição app bar + sidebar + conteúdo mock com projeção de ações.
- Agrupar em e conforme padrões do projeto.

## ⚖️ Trade-offs e Riscos

- Complexidade de estados em breakpoints; mitigar com signals e separação de responsabilidades.
- Integração tema/dark com SSR: evitar flash usando estratégia SSR-safe para classe/atributo de tema.

## 🎨 UI Components and Layout

### Design System Integration

- Reutilizar `os-header`, `os-sidebar`, `os-navigation`, `os-page-header`, `os-button`, `os-icon`, `os-toggle`.
- Templates de referência: `os-dashboard-template`, `os-list-template`, `os-detail-template`.

### New Components Required

- `AppShellTemplate` (template que orquestra header + sidebar + `router-outlet`) com slots para ações contextuais e seletor de orçamento.

### Layout Architecture

- App Shell global aplicado via rotas; remove header/sidebar locais do `Dashboard`.
- Drawer: modal (<768), persistente (≥768), permanente (≥992) com colapso (rail) e persistência de estado.
- Header: sticky, integra seletor de orçamento (via serviço) e alternância de tema (toggle com tokens do DS).

### Performance Considerations

- OnPush em todos os componentes; lazy loading nas features; evitar FOUC ao alternar tema.

**Detalhes completos em:** `sessions/OS-225/layout-specification.md`

## 📋 Lista de Implementação

### UI Components

- [ ] Criar `AppShellTemplate` conforme layout-specification
- [ ] Integrar `os-header` com seletor de orçamento e ações contextuais
- [ ] Configurar `os-sidebar` com itens de navegação e colapso persistente
- [ ] Aplicar responsividade (mobile/tablet/desktop) no shell
- [ ] Implementar acessibilidade (landmarks, ARIA, keyboard, skip links)

### Rotas

- [ ] Atualizar `app.routes.ts` para usar App Shell (lazy + children)
- [ ] Remover header/sidebar do `Dashboard` e consumir slots do shell

### Tema

- [ ] Adicionar `os-toggle` para modo light/dark com persistência

### Storybook

- [ ] Criar stories para App Shell e variações (tema, colapso, breakpoints)

### Testes

- [ ] Unidade e a11y mínima (roles/ARIA, foco, navegação por teclado)

## 📚 Referências

- Meta Specs, Material Design M3, CLAUDE.md
- `sessions/OS-225/layout-specification.md`
