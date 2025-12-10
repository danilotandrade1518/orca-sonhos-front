# Sistema de Categorias - Layout Specification

## 🎯 Layout Overview

### Objetivo Visual

Oferecer uma experiência de **gerenciamento de categorias clara, organizada e segura**, transmitindo controle e confiabilidade, sem sobrecarregar o usuário com detalhes técnicos. O layout deve:

- Facilitar o **cadastro e edição** de categorias com poucos passos.
- Tornar **busca, filtro e status (ativa/inativa, tipo)** rapidamente perceptíveis.
- Deixar evidente que categorias impactam **transações, dashboards e metas**.

### Tipo de Layout

- **Tipo principal**: Página de **Lista + Form/Manager** (management screen).
- Padrão: página de entidade, similar a `BudgetListPage`, com:
  - Cabeçalho de página + ações.
  - Barra de filtros e busca.
  - Lista (ou grid) de categorias.
  - Uso do organismo `os-category-manager` para edição/ordenação.

### Público-Alvo

- **Universal**, com foco forte em:
  - **Ana (Organizadora Familiar)**: precisa de controle organizado por categoria para entender onde vai o dinheiro familiar.
  - **Carlos (Jovem Planejador)**: está aprendendo a usar categorias nos primeiros dias (Engajamento Inicial).

### Persona Primária

- **Ana - A Organizadora Familiar**
  - Organizada, mas sobrecarregada.
  - Vem de planilhas; precisa de algo **mais simples, visual** e que economize tempo.
  - Precisa que categorias reflitam a realidade da família (mercado, escola, saúde, lazer).

**Características relevantes da persona:**

- Valoriza **clareza visual** e estrutura mais “tabela/lista” do que visual altamente abstrato.
- Precisa de **busca rápida** e filtros para encontrar categorias específicas.
- Usa principalmente em **desktop/notebook**, mas também pode acessar em mobile.

### Contexto de Uso

- Estágio da jornada: principalmente **Engajamento Inicial → Adoção**:
  - Depois de criar primeiro orçamento e primeiras transações, começa a **refinar categorias**.
  - Começa a perceber onde o dinheiro está indo e ajusta o modelo mental.
- Entradas principais:
  - Acesso via menu lateral “Categorias” ou atalho a partir de mensagens como “Configure categorias primeiro”.

### Funcionalidades Core Relacionadas

- **Múltiplos Orçamentos**: cada orçamento possui suas próprias categorias.
- **Transações Temporalmente Flexíveis**: categorias organizam lançamentos e análises.
- **Dashboard Centrado em Progresso**: gastos por categoria e saúde financeira se apoiam nessa estrutura.
- **Sistema de Metas SMART**: categorias ajudam a entender para onde vai o dinheiro que alimenta ou atrapalha metas.

### Considerações da Jornada do Usuário

- **Estágio da Jornada**:  
  - **Engajamento Inicial (D+1 a D+7)**: usuário começa a lançar transações e configurar categorias pessoais.  
  - **Adoção (D+7 a D+30)**: refinamento de categorias, ativação/remoção e ajustes finos.

**Objetivos do Usuário neste Estágio:**

- Entender **para onde vai o dinheiro** por categoria.
- Adaptar o sistema à sua realidade com **categorias customizadas**.
- Reduzir atrito na hora de **lançar transações** (lista de categorias enxuta e relevante).

**Touchpoints Críticos:**

- Primeira visita à página de categorias: deve ser **autoexplicativa**, com estado empty claro e CTA para “Criar Categoria”.
- Primeira exclusão/desativação: confirmar de forma segura o soft delete e explicar impacto.
- Busca/filtro: respostas rápidas, sem recarregamentos pesados.

## 📱 Responsive Strategy

### Breakpoints Definidos

- **Mobile (0–575px)**:
  - Layout em **coluna única**.
  - Header compacto (título + ação “Adicionar categoria”).
  - Filtros colapsáveis em um painel expansível (“Filtros”).
  - `os-category-manager` ocupa largura total; lista em formato de **cards empilhados**.
  - Touch targets ≥ `var(--os-touch-target-ideal)` (≥ 44px).

- **Tablet (576–991px)**:
  - Duas zonas principais:
    - Barra de filtros em linha (busca + tipo + status).
    - Lista de categorias em **grid 1–2 colunas**, dependendo da largura disponível.
  - `os-category-manager` pode abrir em uma coluna principal, mantendo lista abaixo.

- **Desktop (≥ 992px)**:
  - Layout com **estrutura de página**:
    - `os-page` com:
      - `os-page-header` (título, subtítulo, ações).
      - Seção de filtros (em linha).
      - Conteúdo principal:
        - Lista de categorias em grid/lista.
        - `os-category-manager` na mesma página (inline ou em modal/template, dependendo da implementação).
  - Uso confortável de largura até ~1200px de container.

### Mobile-First Approach

- Estruturar a página primeiro para **stack vertical simples**:
  - Header → CTA “Adicionar categoria” → Filtros (colapsáveis) → Lista de categorias (`os-category-manager` ou lista própria).
- Progressively enhance para tablet/desktop:
  - Expandir filtros em linha.
  - Ajustar densidade da lista (mais colunas, mais informações visíveis).

### Touch Interactions

- Botões e ícones com áreas de toque ampliadas.
- Ações principais:
  - Tap para editar categoria.
  - Tap longo ou botão de ação para desativar/excluir.
  - Drag & drop para reordenar (via `CdkDragDrop`) — **habilitado apenas em tamanhos suficientes** (ex.: tablet/desktop, ou mobile em contexto bem testado).

## 🎨 Design System Integration

### Componentes Existentes (Reutilização)

#### Templates / Page-level

- **`OsPageComponent` (`os-page`)**:
  - Variante: `variant="default"`, `size="medium"`.
  - Uso: container principal da página de categorias, com `ariaLabel="Página de categorias"`.

- **`OsPageHeaderComponent` (`os-page-header`)**:
  - Título: “Categorias”.
  - Subtítulo: “Organize como suas transações são agrupadas”.
  - Ações:
    - Botão primário “Nova Categoria” (`os-button` variant `primary`, icon `plus`).

- **`OsModalTemplateComponent` / `OsFormTemplateComponent`**:
  - Potencial uso para:
    - Confirmação de exclusão/desativação.
    - Fluxos de criação/edição caso se escolha modal em vez de inline.

#### Organisms

- **`OsCategoryManagerComponent` (`os-category-manager`)**:
  - Usado como **núcleo da UI** para:
    - Exibir lista de categorias com:
      - Nome, descrição, tipo (income/expense/transfer), cor, ícone, status (ativa/inativa).
      - Reordenar categorias via drag and drop (desktop/tablet).
    - Formulário inline para criação/edição (já existente no componente).
    - Filtros/busca:
      - Campo de busca (nome/descrição).
      - Filtro por tipo.
      - Filtro por status (ativa/inativa).

- **`OsEntityListComponent` / `OsAlertComponent`**:
  - `OsEntityList` pode ser usado para estados globais (lista vazia / loading) ao redor do `os-category-manager`, se fizer sentido.
  - `OsAlert` para exibir erros globais de carregamento de categorias.

#### Molecules

- **`OsFilterBarComponent` (`os-filter-bar`)**:
  - Encapsula filtros de:
    - Busca (input).
    - Tipo (select).
    - Status (select).
  - Ações: “Limpar filtros”, “Aplicar filtros” (se necessário).

- **`OsFormFieldComponent` (`os-form-field`)**:
  - Em uso interno pelo `os-category-manager` e pelos formulários adicionais que forem necessários.

- **`OsSelectComponent`**, **`OsInputComponent`**, **`OsBadgeComponent`**:
  - Inputs em filtros e formulários.
  - Badges para exibir tipo de categoria (Receita/Despesa/Transferência).

#### Atoms

- **`OsButtonComponent`**:
  - Ações principais:
    - “Nova Categoria” (primary).
    - “Editar”, “Desativar/Excluir”, “Duplicar”.
    - Ações de filtro (ex.: mostrar/ocultar filtros).

- **`OsIconComponent`**:
  - Representar ícones de categoria (usando biblioteca definida em `icon-library.md`).
  - Ícones para ações (editar, lixeira, filtro, busca, etc.).

### Novos Componentes (Especificação Detalhada)

No momento, **não são necessários novos componentes de design system**; a página pode ser montada com:

- `os-page` + `os-page-header`.
- `os-filter-bar` + `os-input` + `os-select`.
- `os-category-manager`.
- `os-alert`, `os-button`, `os-icon` conforme necessário.

Se em algum momento o `os-category-manager` se provar genérico demais para necessidades de categorias por orçamento, pode-se evoluir com:

- Uma **molecule** `os-category-filter-bar` especializada em filtros de categorias.
- Uma **template** `os-manager-page-template` para telas de gestão que combinam header + filtros + organismo.

## 🏗️ Layout Structure

### Grid System

- Baseado em tokens de breakpoint de `responsive-design.md`:
  - **Mobile**: 1 coluna.
  - **Tablet**: até 2 colunas para lista de categorias/filtros.
  - **Desktop**: grid 12-col com:
    - Filtros na parte superior.
    - Lista de categorias ocupando largura total da área de conteúdo.

### Sections

#### Header

- **Composição**:
  - `os-page-header` com:
    - Título: “Categorias”.
    - Subtítulo: “Organize como suas transações são agrupadas”.
    - Ação principal: botão “Nova Categoria”.
- **Altura**:
  - ~64px desktop, ~56px mobile (herdado do design system).
- **Sticky**:
  - Mantido fixo no topo dentro do `os-page` para facilitar acesso à ação “Nova Categoria” em listas longas (opcional, dependendo do comportamento padrão do `os-page`).

#### Filtros

- Seção logo abaixo do header:
  - Em desktop/tablet:
    - `os-filter-bar` com:
      - Input de busca (“Buscar categorias...”).
      - Select de tipo (Receita, Despesa, Transferência, Todos).
      - Select de status (Ativas, Inativas, Todas).
  - Em mobile:
    - `os-filter-bar` colapsável, com botão “Filtros” abrindo conteúdo via slide-down.

#### Main Content

- **Layout**:
  - `os-category-manager` ocupa a maior parte da área de conteúdo.
  - Estados globais (loading/error/empty) visíveis acima ou integrados ao próprio organismo.
- **Padding**:
  - Desktop: ~24px laterais, 24–32px entre seções.
  - Mobile: ~16px laterais, 16px entre seções.

#### Empty / Error

- **Empty**:
  - Ícone (ex.: `folder-open` ou `category`).
  - Título: “Nenhuma categoria encontrada”.
  - Texto:
    - Sem filtros: “Comece criando sua primeira categoria.”
    - Com filtros ativos: “Tente ajustar os filtros para encontrar mais categorias.”
  - CTA: botão “Criar Categoria”.

- **Error**:
  - `os-alert` type `error` com:
    - Título: “Erro ao carregar categorias”.
    - Mensagem técnica amigável.
    - Botão “Tentar novamente”.

### Spacing Strategy

- Usar escala de spacing do DS (`--os-spacing-sm/md/lg`):
  - Entre seções (header ↔ filtros ↔ conteúdo): `--os-spacing-lg`.
  - Entre elementos de formulário: `--os-spacing-md`.
  - Entre linhas da lista de categorias: `--os-spacing-sm`/`md` conforme densidade desejada.

### Visual Hierarchy

1. **Título da página + CTA “Nova Categoria”**.
2. **Filtros e busca** (para ajudar a “encontrar categorias” rápido).
3. **Lista de categorias** (nome, tipo, status, cor/ícone).
4. **Detalhes secundários** (descrição, datas de criação/atualização).

## ♿ Accessibility Specifications

### WCAG 2.1 AA Compliance

#### Keyboard Navigation

- Ordem de tabulação:
  1. Skip link (se presente).
  2. Header (título/ação principal).
  3. Filtros (busca → tipo → status).
  4. Lista de categorias (cada item e respectivos botões).
  5. Formulário de categoria (quando aberto).
- Foco visível em todos elementos interativos (usa `os-focusable` / tokens de focus).
- `Esc` fecha modais de confirmação (quando existirem).

#### ARIA Implementation

- Landmarks:
  - `os-page` mapeado para `<main role="main">`.
  - Seção de filtros com `role="search"` ou `role="region"` com `aria-label="Filtros de categorias"`.
  - Lista de categorias com:
    - `role="list"` / `role="grid"` conforme estrutura.
    - Itens com `role="listitem"` / `role="row"`.
- Ícones de ação decorativos com `aria-hidden="true"`.
- Botões de ação com `aria-label` descritivos (“Editar categoria Alimentação”, “Desativar categoria Saúde” etc.).

#### Visual Accessibility

- Contraste:
  - Texto/ícones com mínimo 4.5:1 em relação ao fundo.
  - Badges de tipo (Receita/Despesa/Transferência) com contraste ≥ 3:1.
- Tipografia:
  - Tamanho mínimo 14px para texto de corpo.
  - 16px ou mais para rótulos principais.

#### Screen Reader Support

- Mudanças relevantes (criar/editar/desativar categoria) podem ser anunciadas via serviço de screen reader (ex.: “Categoria ‘Alimentação’ criada com sucesso”).
- Mensagens de erro no formulário:
  - Associadas via `aria-describedby` aos inputs.
  - Usando `role="alert"` para leitura imediata.

## 🎭 States and Interactions

### Global States

- **Loading**:
  - Spinner ou skeleton na área de lista de categorias.
  - Botão “Nova Categoria” desabilitado durante carregamento inicial (opcional).

- **Empty**:
  - Mensagem clara + CTA.

- **Error**:
  - `os-alert` com descrição e botão de retry.

### Micro-interactions

- Hover e focus em itens de categoria:
  - Leve elevação/sombra.
  - Destaque da borda de cor da categoria.
- Ações:
  - Clique em “Editar” abre formulário preenchido.
  - Clique em “Excluir/Desativar” abre modal de confirmação com explicação de soft delete.

### Component-Specific Interactions

- **`os-category-manager`**:
  - `Adicionar Categoria` abre form inline na parte superior.
  - Edição preenche formulário com dados existentes.
  - Reordenar via drag & drop em desktop/tablet.
  - Filtros aplicados atualizam `filteredCategories()` reativamente.

## 📐 Visual Specifications (Wireframes)

### Mobile Layout (< 576px)

```text
┌──────────────────────────────┐
│ Header (os-page-header)      │
│  Título: Categorias          │
│  [Nova Categoria] (botão)    │
├──────────────────────────────┤
│ [Filtros ▾] (os-filter-bar)  │
│  - Busca                     │
│  - Tipo                      │
│  - Status                    │
├──────────────────────────────┤
│ Lista (os-category-manager)  │
│  [Card Categoria 1]          │
│  [Card Categoria 2]          │
│  ...                         │
└──────────────────────────────┘
```

### Tablet Layout (576–991px)

```text
┌──────────────────────────────────────────┐
│ Header                                   │
│  Categorias        [Nova Categoria]      │
├──────────────────────────────────────────┤
│ Filtros (linha única)                    │
│  [Buscar........] [Tipo v] [Status v]    │
├──────────────────────────────────────────┤
│ Lista (os-category-manager)              │
│  ┌───────────────┐  ┌───────────────┐   │
│  │ Categoria 1   │  │ Categoria 2   │   │
│  └───────────────┘  └───────────────┘   │
│  ┌───────────────┐  ┌───────────────┐   │
│  │ Categoria 3   │  │ Categoria 4   │   │
│  └───────────────┘  └───────────────┘   │
└──────────────────────────────────────────┘
```

### Desktop Layout (≥ 992px)

```text
┌────────────────────────────────────────────────────┐
│ Header                                             │
│  Categorias               [Nova Categoria]         │
│  Organize como suas transações são agrupadas       │
├────────────────────────────────────────────────────┤
│ Filtros                                            │
│  [Buscar......................] [Tipo v] [Status v]│
├────────────────────────────────────────────────────┤
│ Lista + Manager (os-category-manager)              │
│  [Form de categoria (quando aberto)]              │
│                                                    │
│  [Linha Categoria 1 .......... Ações]             │
│  [Linha Categoria 2 .......... Ações]             │
│  [Linha Categoria 3 .......... Ações]             │
└────────────────────────────────────────────────────┘
```

## 🔄 Architecture Impact

### Componentes de UI a Criar/Modificar

- **Novos**:
  - `CategoriesPage` (`features/categories/pages/categories-page/categories-page.component.ts`):
    - Usa `os-page`, `os-page-header`, `os-filter-bar`, `os-category-manager`.
    - Conecta com `CategoryState` e orquestra ações de CRUD.

- **Modificações**:
  - `os-category-manager`:
    - Garantir que props/outputs cubram:
      - Criar/editar/deletar categoria.
      - Filtros e busca integrados com state.
    - Pequenos ajustes de acessibilidade/ARIA se necessário.
  - Layout de navegação/menu:
    - Adicionar entrada “Categorias” apontando para `/categories`.

### Dependências de UI

- Reutilização de DS existente; sem novas dependências externas.

### Impacto em Performance

- Página relativamente leve (lista + form).
- Mitigar:
  - Uso de `ChangeDetectionStrategy.OnPush`.
  - Lazy load da rota `/categories`.
  - Drag & drop apenas quando necessário.

### Integration Points

- `CategoryState` provê dados para `CategoriesPage`/`os-category-manager`.
- Navegação a partir de outras telas (ex.: mensagem “Configure categorias primeiro” em `TransactionFormComponent`) pode linkar para `/categories`.

## 🧪 Layout Validation Criteria

### Design System Compliance

- [ ] Uso consistente de `os-page`, `os-page-header`, `os-filter-bar`, `os-category-manager`.
- [ ] Cores, espaçamentos e tipografia seguindo tokens (`_tokens.scss`).
- [ ] Nomenclatura de classes/seletores alinhada ao padrão `os-*`.

### Responsiveness

- [ ] Layout funcional em mobile, tablet e desktop (sem scroll horizontal).
- [ ] Filtros usáveis em mobile (colapsáveis).
- [ ] Touch targets adequados em mobile.

### Accessibility

- [ ] Navegação por teclado (`Tab`, `Shift+Tab`) funcionando de forma previsível.
- [ ] `aria-label`/`aria-describedby` adequados em filtros e ações.
- [ ] Foco visível em todos elementos interativos.
- [ ] Mensagens de erro/estado legíveis por leitores de tela.

### Performance

- [ ] Componentes com change detection OnPush.
- [ ] Rota `/categories` lazy-loaded.
- [ ] Lista performática mesmo com dezenas de categorias.

### Visual Quality

- [ ] Hierarquia visual clara (título → filtros → lista).
- [ ] Espaçamentos consistentes entre seções e elementos.
- [ ] Estados de loading, vazio e erro implementados de forma coerente.

## 📚 References

- Design System:
  - `src/app/shared/ui-components/atoms/`
  - `src/app/shared/ui-components/molecules/`
  - `src/app/shared/ui-components/organisms/`
  - `src/app/shared/ui-components/templates/`
- Meta Specs:
  - `business/customer-profile/personas.md`
  - `business/customer-profile/customer-journey.md`
  - `business/product-vision/core-concepts.md`
  - `business/03_funcionalidades_core.md`
  - `technical/frontend-architecture/responsive-design.md`
  - `technical/frontend-architecture/accessibility.md`
  - `technical/frontend-architecture/ui-system.md`








