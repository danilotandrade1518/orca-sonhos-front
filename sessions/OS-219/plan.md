# Design System Base - Atomic Design até Templates - Plano de Implementação

> **Instruções**: Mantenha este arquivo atualizado conforme o progresso. Marque tarefas como concluídas ✅, em progresso ⏰ ou não iniciadas ⏳.

## 📋 Resumo Executivo

Implementar Design System completo do OrçaSonhos seguindo metodologia Atomic Design, estabelecendo base sólida para desenvolvimento de todas as features futuras. O sistema incluirá 47+ componentes organizados em 4 níveis (Atoms, Molecules, Organisms, Templates) com sistema de tema customizado e integração com Angular Material.

## 🎯 Objetivos da Implementação

- **Objetivo Principal**: Estabelecer Design System escalável e consistente
- **Objetivo Secundário**: Criar identidade visual única do OrçaSonhos
- **Critérios de Sucesso**: 47+ componentes funcionais, acessibilidade WCAG 2.1 AA, performance otimizada

---

## 📅 FASE 1: Configuração Base e Sistema de Tema [Status: ✅ Completada]

### 🎯 Objetivo da Fase

Estabelecer fundação técnica com estrutura de diretórios, sistema de tema customizado e design tokens, preparando base para implementação dos componentes.

### 📋 Tarefas

#### Criar Estrutura de Diretórios [✅]

**Descrição**: Criar estrutura completa de pastas seguindo Atomic Design
**Arquivos**:

- `src/app/shared/ui-components/atoms/`
- `src/app/shared/ui-components/molecules/`
- `src/app/shared/ui-components/organisms/`
- `src/app/shared/ui-components/templates/`
- `src/app/shared/ui-components/theme/`

**Critério de Conclusão**: Todas as pastas criadas com arquivos index.ts

#### Implementar Design Tokens [✅]

**Descrição**: Criar sistema de design tokens com paleta azul dominante
**Arquivos**:

- `src/app/shared/ui-components/theme/_tokens.scss`
- `src/app/shared/ui-components/theme/_colors.scss`
- `src/app/shared/ui-components/theme/_typography.scss`
- `src/app/shared/ui-components/theme/_spacing.scss`

**Dependências**: Estrutura de diretórios criada
**Validação**: Tokens aplicados e visíveis no browser

#### Configurar Tema Material Customizado [✅]

**Descrição**: Integrar design tokens com Angular Material
**Arquivos**:

- `src/app/shared/ui-components/theme/_material-theme.scss`
- `src/app/shared/ui-components/theme/theme.scss`
- `src/styles.scss` (modificação)

**Dependências**: Design tokens implementados
**Validação**: Tema aplicado corretamente nos componentes Material

#### Configurar Exportações Standalone [✅]

**Descrição**: Configurar exportações para componentes standalone
**Arquivos**:

- `src/app/shared/ui-components/index.ts`
- `src/app/shared/index.ts` (modificação)

**Dependências**: Estrutura de diretórios criada
**Validação**: Exportações funcionando sem NgModule

### 🧪 Critérios de Validação

- [x] Estrutura de diretórios criada
- [x] Design tokens implementados e funcionais
- [x] Tema Material customizado aplicado
- [x] Exportações standalone configuradas
- [x] Build sem erros

### 📝 Comentários da Fase

**✅ FASE 1 COMPLETADA** - Sistema de tema e estrutura base implementados com sucesso:

- **Estrutura de diretórios**: Criada seguindo Atomic Design (atoms, molecules, organisms, templates, theme)
- **Design tokens**: Sistema completo implementado com paleta azul dominante e roxo secundário
- **Tema Material**: Integração customizada com Angular Material funcionando
- **Exportações standalone**: Configuradas seguindo padrões modernos do Angular
- **Validação**: Build funcionando sem erros, tema aplicado corretamente

**Próximo passo**: Iniciar Fase 2 - Implementação dos componentes ATOMS

---

## 📅 FASE 2: ATOMS - Componentes Básicos [Status: ✅ COMPLETO - 16/16 COMPLETO]

### 🎯 Objetivo da Fase

Implementar 16 componentes atômicos fundamentais que servirão como base para todos os outros componentes do sistema.

### 📋 Tarefas

#### Implementar os-button [✅ COMPLETO]

**Descrição**: Botão com 4 variantes (primary, secondary, tertiary, danger) e 3 tamanhos
**Arquivos**:

- `src/app/shared/ui-components/atoms/os-button/os-button.component.ts` ✅
- `src/app/shared/ui-components/atoms/os-button/os-button.component.scss` ✅
- `src/app/shared/ui-components/atoms/os-button/os-button.component.spec.ts` ✅

**Complexidade**: Média
**Validação**: 40 testes passando (100% cobertura)
**Status**: ✅ **COMPLETO** - 4 variantes × 3 tamanhos × estados (disabled/loading) implementados

#### Implementar os-input [✅ COMPLETO]

**Descrição**: Input com validação integrada e múltiplos tipos
**Arquivos**:

- `src/app/shared/ui-components/atoms/os-input/os-input.component.ts`
- `src/app/shared/ui-components/atoms/os-input/os-input.component.scss`
- `src/app/shared/ui-components/atoms/os-input/os-input.component.spec.ts`

**Complexidade**: Alta
**Validação**: Tipos text, email, password, number, tel funcionando

#### Implementar os-icon [✅ COMPLETO]

**Descrição**: Sistema de ícones próprio
**Arquivos**:

- `src/app/shared/ui-components/atoms/os-icon/os-icon.component.ts`
- `src/app/shared/ui-components/atoms/os-icon/os-icon.component.scss`
- `src/app/shared/ui-components/atoms/os-icon/os-icon.component.spec.ts`

**Complexidade**: Média
**Validação**: Ícones renderizando corretamente

#### Implementar os-badge [✅ COMPLETO]

**Descrição**: Indicadores de status
**Arquivos**:

- `src/app/shared/ui-components/atoms/os-badge/os-badge.component.ts`
- `src/app/shared/ui-components/atoms/os-badge/os-badge.component.scss`
- `src/app/shared/ui-components/atoms/os-badge/os-badge.component.spec.ts`

**Complexidade**: Baixa
**Validação**: Estados success, warning, error, info

#### Implementar os-avatar [✅ COMPLETO]

**Descrição**: Avatares de usuário
**Arquivos**:

- `src/app/shared/ui-components/atoms/os-avatar/os-avatar.component.ts`
- `src/app/shared/ui-components/atoms/os-avatar/os-avatar.component.scss`
- `src/app/shared/ui-components/atoms/os-avatar/os-avatar.component.spec.ts`

**Complexidade**: Baixa
**Validação**: Imagem, iniciais e placeholder funcionando

#### Implementar os-spinner [✅ COMPLETO]

**Descrição**: Indicadores de loading
**Arquivos**:

- `src/app/shared/ui-components/atoms/os-spinner/os-spinner.component.ts`
- `src/app/shared/ui-components/atoms/os-spinner/os-spinner.component.scss`
- `src/app/shared/ui-components/atoms/os-spinner/os-spinner.component.spec.ts`

**Complexidade**: Baixa
**Validação**: Animação funcionando

#### Implementar os-label [✅ COMPLETO]

**Descrição**: Labels de texto
**Arquivos**:

- `src/app/shared/ui-components/atoms/os-label/os-label.component.ts` ✅
- `src/app/shared/ui-components/atoms/os-label/os-label.component.scss` ✅
- `src/app/shared/ui-components/atoms/os-label/os-label.component.spec.ts` ✅

**Complexidade**: Baixa
**Validação**: 30 testes passando (100% cobertura)
**Status**: ✅ **COMPLETO** - Labels com variantes e tamanhos implementados

#### Implementar os-chip [✅ COMPLETO]

**Descrição**: Tags e filtros
**Arquivos**:

- `src/app/shared/ui-components/atoms/os-chip/os-chip.component.ts` ✅
- `src/app/shared/ui-components/atoms/os-chip/os-chip.component.scss` ✅
- `src/app/shared/ui-components/atoms/os-chip/os-chip.component.spec.ts` ✅

**Complexidade**: Média
**Validação**: 19 testes implementados, build funcionando
**Status**: ✅ **COMPLETO** - Chip com funcionalidade removível, 6 variantes e estados implementados

#### Implementar os-money-input [✅ COMPLETO]

**Descrição**: Input com formatação monetária brasileira
**Arquivos**:

- `src/app/shared/ui-components/atoms/os-money-input/os-money-input.component.ts` ✅
- `src/app/shared/ui-components/atoms/os-money-input/os-money-input.component.scss` ✅
- `src/app/shared/ui-components/atoms/os-money-input/os-money-input.component.spec.ts` ✅

**Complexidade**: Alta
**Validação**: Formatação R$ X.XXX,XX funcionando
**Status**: ✅ **COMPLETO** - Money input com formatação brasileira, 3 tamanhos e estados implementados

#### Implementar os-date-input [✅ COMPLETO]

**Descrição**: Input para seleção de datas
**Arquivos**:

- `src/app/shared/ui-components/atoms/os-date-input/os-date-input.component.ts` ✅
- `src/app/shared/ui-components/atoms/os-date-input/os-date-input.component.scss` ✅
- `src/app/shared/ui-components/atoms/os-date-input/os-date-input.component.spec.ts` ✅

**Complexidade**: Média
**Validação**: Date picker funcionando
**Status**: ✅ **COMPLETO** - Date input com formatação, min/max dates, ícones e 3 tamanhos implementados

#### Implementar os-select [✅ COMPLETO]

**Descrição**: Dropdowns
**Arquivos**:

- `src/app/shared/ui-components/atoms/os-select/os-select.component.ts` ✅
- `src/app/shared/ui-components/atoms/os-select/os-select.component.scss` ✅
- `src/app/shared/ui-components/atoms/os-select/os-select.component.spec.ts` ✅

**Complexidade**: Média
**Validação**: Seleção funcionando
**Status**: ✅ **COMPLETO** - Select com opções dinâmicas, placeholder, disabled options e 3 tamanhos implementados

#### Implementar os-checkbox [✅ COMPLETO]

**Descrição**: Seleção múltipla
**Arquivos**:

- `src/app/shared/ui-components/atoms/os-checkbox/os-checkbox.component.ts` ✅
- `src/app/shared/ui-components/atoms/os-checkbox/os-checkbox.component.scss` ✅
- `src/app/shared/ui-components/atoms/os-checkbox/os-checkbox.component.spec.ts` ✅

**Complexidade**: Baixa
**Validação**: 32 testes passando (100% cobertura)
**Status**: ✅ **COMPLETO** - Checkbox com ControlValueAccessor implementado

#### Implementar os-radio [✅ COMPLETO]

**Descrição**: Seleção única
**Arquivos**:

- `src/app/shared/ui-components/atoms/os-radio/os-radio.component.ts` ✅
- `src/app/shared/ui-components/atoms/os-radio/os-radio.component.scss` ✅
- `src/app/shared/ui-components/atoms/os-radio/os-radio.component.spec.ts` ✅

**Complexidade**: Baixa
**Validação**: 30 testes passando (100% cobertura)
**Status**: ✅ **COMPLETO** - Radio com ControlValueAccessor implementado

#### Implementar os-toggle [✅ COMPLETO]

**Descrição**: Switch on/off
**Arquivos**:

- `src/app/shared/ui-components/atoms/os-toggle/os-toggle.component.ts` ✅
- `src/app/shared/ui-components/atoms/os-toggle/os-toggle.component.scss` ✅
- `src/app/shared/ui-components/atoms/os-toggle/os-toggle.component.spec.ts` ✅

**Complexidade**: Baixa
**Validação**: 15 testes implementados, build funcionando
**Status**: ✅ **COMPLETO** - Toggle com 3 tamanhos, 5 variantes e estados implementados

#### Implementar os-slider [✅ COMPLETO]

**Descrição**: Controle de range
**Arquivos**:

- `src/app/shared/ui-components/atoms/os-slider/os-slider.component.ts` ✅
- `src/app/shared/ui-components/atoms/os-slider/os-slider.component.scss` ✅
- `src/app/shared/ui-components/atoms/os-slider/os-slider.component.spec.ts` ✅

**Complexidade**: Média
**Validação**: Range funcionando
**Status**: ✅ **COMPLETO** - Slider com min/max/step, value display, labels e 3 tamanhos implementados

#### Implementar os-progress-bar [✅ COMPLETO]

**Descrição**: Indicadores de progresso
**Arquivos**:

- `src/app/shared/ui-components/atoms/os-progress-bar/os-progress-bar.component.ts` ✅
- `src/app/shared/ui-components/atoms/os-progress-bar/os-progress-bar.component.scss` ✅
- `src/app/shared/ui-components/atoms/os-progress-bar/os-progress-bar.component.spec.ts` ✅

**Complexidade**: Baixa
**Validação**: 18 testes implementados, build funcionando
**Status**: ✅ **COMPLETO** - Progress bar com animações, listras e 5 variantes implementado

### 🔄 Dependências

- ✅ Fase 1 completada
- Design tokens implementados
- Tema Material configurado

### 🧪 Critérios de Validação

- [x] 16 componentes atoms implementados
- [x] Todos os componentes com testes unitários
- [x] Acessibilidade WCAG 2.1 AA validada
- [x] Responsividade em todos os componentes
- [x] Performance OnPush implementada

### 📝 Comentários da Fase

**✅ FASE 2 COMPLETADA** - Todos os 16 componentes atoms implementados com sucesso:

- **os-button**: 4 variantes × 3 tamanhos × estados (disabled/loading) - 40 testes
- **os-input**: Tipos text, email, password, number, tel com validação integrada
- **os-icon**: Sistema de ícones próprio com suporte a diferentes tamanhos
- **os-badge**: Estados success, warning, error, info com indicadores visuais
- **os-avatar**: Imagem, iniciais e placeholder com fallbacks
- **os-spinner**: Indicadores de loading com animações suaves
- **os-label**: Labels com variantes e tamanhos para diferentes contextos
- **os-chip**: Tags removíveis com 6 variantes e estados interativos
- **os-money-input**: Formatação monetária brasileira (R$ X.XXX,XX) com 3 tamanhos
- **os-date-input**: Seleção de datas com min/max, ícones e formatação
- **os-select**: Dropdowns com opções dinâmicas, placeholder e disabled options
- **os-checkbox**: Seleção múltipla com ControlValueAccessor implementado
- **os-radio**: Seleção única com ControlValueAccessor implementado
- **os-toggle**: Switch on/off com 3 tamanhos e 5 variantes
- **os-slider**: Controle de range com min/max/step, value display e labels
- **os-progress-bar**: Indicadores de progresso com animações e 5 variantes

**Características implementadas**:

- ✅ Todos os componentes seguem padrões Angular 20+ (standalone, signals, OnPush)
- ✅ Sistema de tema integrado com design tokens customizados
- ✅ Testes unitários abrangentes com provideZonelessChangeDetection()
- ✅ Acessibilidade WCAG 2.1 AA com ARIA attributes
- ✅ Responsividade completa em todos os componentes
- ✅ Integração com Angular Material como base com abstração própria

**Próximo passo**: Iniciar Fase 3 - Implementação dos componentes MOLECULES

---

## 📅 FASE 3: MOLECULES - Componentes Compostos [Status: ✅ COMPLETO - 12/12 COMPLETO - 100% Testes Passando]

### 🎯 Objetivo da Fase

Implementar 12 componentes moleculares que combinam atoms para criar funcionalidades mais complexas e reutilizáveis.

### 📋 Tarefas

#### Implementar os-form-field [✅ COMPLETO]

**Descrição**: Input + label + validation integrados
**Arquivos**:

- `src/app/shared/ui-components/molecules/os-form-field/os-form-field.component.ts` ✅
- `src/app/shared/ui-components/molecules/os-form-field/os-form-field.component.scss` ✅
- `src/app/shared/ui-components/molecules/os-form-field/os-form-field.component.spec.ts` ✅

**Dependências**: os-input, os-label implementados ✅
**Complexidade**: Alta
**Validação**: Validação integrada funcionando ✅
**Status**: Implementado com ControlValueAccessor, signals, OnPush, BEM, testes abrangentes

#### Implementar os-card [✅ COMPLETO]

**Descrição**: Containers de conteúdo
**Arquivos**:

- `src/app/shared/ui-components/molecules/os-card/os-card.component.ts` ✅
- `src/app/shared/ui-components/molecules/os-card/os-card.component.scss` ✅
- `src/app/shared/ui-components/molecules/os-card/os-card.component.spec.ts` ✅

**Complexidade**: Média
**Validação**: Header, content, actions funcionando ✅
**Status**: ✅ **COMPLETO** - Card com 4 variantes, 3 tamanhos, funcionalidade clickable, content projection e ARIA attributes implementado, 21 testes passando (100%)

#### Implementar os-search-box [✅ COMPLETO]

**Descrição**: Busca com sugestões
**Arquivos**:

- `src/app/shared/ui-components/molecules/os-search-box/os-search-box.component.ts` ✅
- `src/app/shared/ui-components/molecules/os-search-box/os-search-box.component.scss` ✅
- `src/app/shared/ui-components/molecules/os-search-box/os-search-box.component.spec.ts` ✅

**Dependências**: os-input, os-icon implementados ✅
**Complexidade**: Alta
**Validação**: Sugestões funcionando ✅
**Status**: ✅ **COMPLETO** - Search box com sugestões, 3 tamanhos, 3 variantes, integração com eventos e funcionalidade de busca implementado

#### Implementar os-data-table [✅ COMPLETO]

**Descrição**: Tabelas básicas
**Arquivos**:

- `src/app/shared/ui-components/molecules/os-data-table/os-data-table.component.ts` ✅
- `src/app/shared/ui-components/molecules/os-data-table/os-data-table.component.scss` ✅
- `src/app/shared/ui-components/molecules/os-data-table/os-data-table.component.spec.ts` ✅

**Complexidade**: Alta
**Validação**: Sorting, filtering funcionando ✅
**Status**: ✅ **COMPLETO** - Data table com colunas dinâmicas, paginação, ações, 3 tamanhos, 3 variantes e integração com Angular Material implementado

#### Implementar os-filter-bar [✅ COMPLETO]

**Descrição**: Filtros de dados
**Arquivos**:

- `src/app/shared/ui-components/molecules/os-filter-bar/os-filter-bar.component.ts` ✅
- `src/app/shared/ui-components/molecules/os-filter-bar/os-filter-bar.component.scss` ✅
- `src/app/shared/ui-components/molecules/os-filter-bar/os-filter-bar.component.spec.ts` ✅

**Dependências**: os-input, os-select, os-button implementados ✅
**Complexidade**: Média
**Validação**: Filtros aplicando corretamente ✅
**Status**: ✅ **COMPLETO** - Filter bar com ações customizáveis, 3 tamanhos, 3 variantes e responsividade implementado

#### Implementar os-navigation-item [✅ COMPLETO]

**Descrição**: Itens de navegação
**Arquivos**:

- `src/app/shared/ui-components/molecules/os-navigation-item/os-navigation-item.component.ts` ✅
- `src/app/shared/ui-components/molecules/os-navigation-item/os-navigation-item.component.scss` ✅
- `src/app/shared/ui-components/molecules/os-navigation-item/os-navigation-item.component.spec.ts` ✅

**Dependências**: os-icon implementado ✅
**Complexidade**: Média
**Validação**: Estados ativo/inativo funcionando ✅
**Status**: ✅ **COMPLETO** - Navigation item com 4 variantes, 3 tamanhos, suporte a routerLink/button, badge e ícones implementado, 30 testes passando (100%)

#### Implementar os-money-display [✅ COMPLETO]

**Descrição**: Formatação de valores monetários
**Arquivos**:

- `src/app/shared/ui-components/molecules/os-money-display/os-money-display.component.ts` ✅
- `src/app/shared/ui-components/molecules/os-money-display/os-money-display.component.scss` ✅
- `src/app/shared/ui-components/molecules/os-money-display/os-money-display.component.spec.ts` ✅

**Complexidade**: Média
**Validação**: Formatação brasileira funcionando ✅
**Status**: ✅ **COMPLETO** - Money display com múltiplas moedas, formatação brasileira, 5 variantes e 3 tamanhos implementado, 29 testes passando (100%)

#### Implementar os-date-picker [✅ COMPLETO]

**Descrição**: Seleção de datas avançada
**Arquivos**:

- `src/app/shared/ui-components/molecules/os-date-picker/os-date-picker.component.ts` ✅
- `src/app/shared/ui-components/molecules/os-date-picker/os-date-picker.component.scss` ✅
- `src/app/shared/ui-components/molecules/os-date-picker/os-date-picker.component.spec.ts` ✅

**Dependências**: os-date-input implementado ✅
**Complexidade**: Alta
**Validação**: Calendar funcionando ✅
**Status**: ✅ **COMPLETO** - Date picker com ControlValueAccessor, 3 tamanhos, 3 variantes, min/max dates e integração com Angular Material implementado

#### Implementar os-dropdown [✅ COMPLETO]

**Descrição**: Menus suspensos
**Arquivos**:

- `src/app/shared/ui-components/molecules/os-dropdown/os-dropdown.component.ts` ✅
- `src/app/shared/ui-components/molecules/os-dropdown/os-dropdown.component.scss` ✅
- `src/app/shared/ui-components/molecules/os-dropdown/os-dropdown.component.spec.ts` ✅

**Complexidade**: Média
**Validação**: Menu abrindo/fechando ✅
**Status**: ✅ **COMPLETO** - Dropdown com 4 variantes, 3 tamanhos, opções dinâmicas, ícones, dividers e placeholder implementado, 25 testes passando (100%)

#### Implementar os-form-group [✅ COMPLETO]

**Descrição**: Grupos de campos
**Arquivos**:

- `src/app/shared/ui-components/molecules/os-form-group/os-form-group.component.ts` ✅
- `src/app/shared/ui-components/molecules/os-form-group/os-form-group.component.scss` ✅
- `src/app/shared/ui-components/molecules/os-form-group/os-form-group.component.spec.ts` ✅

**Dependências**: os-form-field implementado ✅
**Complexidade**: Média
**Validação**: Agrupamento funcionando ✅
**Status**: ✅ **COMPLETO** - Form group com 3 variantes, 3 tamanhos, suporte a title/description/helper e content projection implementado

#### Implementar os-alert [✅ COMPLETO]

**Descrição**: Notificações
**Arquivos**:

- `src/app/shared/ui-components/molecules/os-alert/os-alert.component.ts` ✅
- `src/app/shared/ui-components/molecules/os-alert/os-alert.component.scss` ✅
- `src/app/shared/ui-components/molecules/os-alert/os-alert.component.spec.ts` ✅

**Dependências**: os-icon implementado ✅
**Complexidade**: Média
**Validação**: Tipos success, warning, error, info ✅
**Status**: ✅ **COMPLETO** - Alert com 4 tipos, 3 tamanhos, funcionalidade dismissible e ícones automáticos implementado, 26 testes passando (100%)

#### Implementar os-tooltip [✅ COMPLETO]

**Descrição**: Dicas contextuais
**Arquivos**:

- `src/app/shared/ui-components/molecules/os-tooltip/os-tooltip.component.ts` ✅
- `src/app/shared/ui-components/molecules/os-tooltip/os-tooltip.component.scss` ✅
- `src/app/shared/ui-components/molecules/os-tooltip/os-tooltip.component.spec.ts` ✅

**Complexidade**: Média
**Validação**: Tooltip aparecendo/desaparecendo ✅
**Status**: ✅ **COMPLETO** - Tooltip com 8 variantes, 3 tamanhos, 6 posições, integração MatTooltip, delays e touch gestures implementado, 20 testes passando (100%)

### 🔄 Dependências

- ✅ Fase 2 completada (atoms implementados)
- Componentes atoms funcionando

### 🧪 Critérios de Validação

- [ ] 12 componentes molecules implementados
- [ ] Integração com atoms funcionando
- [ ] Testes de integração passando
- [ ] Acessibilidade mantida
- [ ] Performance otimizada

### 📝 Comentários da Fase

**✅ FASE 3 COMPLETADA** - Todos os 12 componentes molecules implementados com sucesso:

- **os-form-field**: ControlValueAccessor com validação integrada - 1 componente
- **os-card**: Containers com 4 variantes, 3 tamanhos e funcionalidade clickable - 1 componente (21 testes)
- **os-money-display**: Formatação monetária com múltiplas moedas e formatação brasileira - 1 componente (29 testes)
- **os-alert**: Sistema de notificações com 4 tipos, dismissible e ícones automáticos - 1 componente (26 testes)
- **os-navigation-item**: Navegação com 4 variantes, 3 tamanhos, suporte routerLink/button, badge e ícones - 1 componente (30 testes)
- **os-dropdown**: Menu suspenso com 4 variantes, 3 tamanhos, opções dinâmicas, ícones e dividers - 1 componente (25 testes)
- **os-tooltip**: Dicas contextuais com 8 variantes, 3 tamanhos, 6 posições e integração MatTooltip - 1 componente (20 testes)
- **os-search-box**: Busca com sugestões, 3 tamanhos, 3 variantes e integração com eventos - 1 componente
- **os-data-table**: Tabelas com colunas dinâmicas, paginação, ações, 3 tamanhos e 3 variantes - 1 componente
- **os-filter-bar**: Filtros com ações customizáveis, 3 tamanhos, 3 variantes e responsividade - 1 componente
- **os-date-picker**: Seletor de datas com ControlValueAccessor, 3 tamanhos, 3 variantes e min/max dates - 1 componente
- **os-form-group**: Grupos de campos com 3 variantes, 3 tamanhos e suporte a title/description/helper - 1 componente

**Características implementadas**:

- ✅ Todos os componentes seguem padrões Angular 20+ (standalone, signals, OnPush)
- ✅ Sistema de variáveis SCSS implementado com `_variables.scss`
- ✅ Testes unitários abrangentes com `fixture.componentRef.setInput()` - 100% testes passando
- ✅ Acessibilidade WCAG 2.1 AA com ARIA attributes
- ✅ Responsividade completa em todos os componentes
- ✅ Integração com atoms funcionando perfeitamente
- ✅ Build funcionando sem erros
- ✅ Integração com Angular Material como base com abstração própria

**Próximo passo**: Iniciar Fase 4 - Implementação dos componentes ORGANISMS

---

## 📅 FASE 4: ORGANISMS - Componentes Complexos [Status: ⏰ Em Progresso - 7/12 COMPLETO]

### 🎯 Objetivo da Fase

Implementar 12 componentes complexos que combinam molecules e atoms para criar funcionalidades completas e específicas do domínio.

### 📋 Tarefas

#### Implementar os-header [⏳]

**Descrição**: Cabeçalho da aplicação
**Arquivos**:

- `src/app/shared/ui-components/organisms/os-header/os-header.component.ts`
- `src/app/shared/ui-components/organisms/os-header/os-header.component.scss`
- `src/app/shared/ui-components/organisms/os-header/os-header.component.spec.ts`

**Dependências**: os-button, os-avatar, os-navigation-item implementados
**Complexidade**: Alta
**Validação**: Responsividade funcionando

#### Implementar os-sidebar [⏳]

**Descrição**: Navegação lateral
**Arquivos**:

- `src/app/shared/ui-components/organisms/os-sidebar/os-sidebar.component.ts`
- `src/app/shared/ui-components/organisms/os-sidebar/os-sidebar.component.scss`
- `src/app/shared/ui-components/organisms/os-sidebar/os-sidebar.component.spec.ts`

**Dependências**: os-navigation-item implementado
**Complexidade**: Alta
**Validação**: Colapso/expansão funcionando

#### Implementar os-footer [✅ COMPLETO]

**Descrição**: Rodapé da aplicação
**Arquivos**:

- `src/app/shared/ui-components/organisms/os-footer/os-footer.component.ts` ✅
- `src/app/shared/ui-components/organisms/os-footer/os-footer.component.scss` ✅
- `src/app/shared/ui-components/organisms/os-footer/os-footer.component.spec.ts` ✅

**Complexidade**: Baixa
**Validação**: Links funcionando ✅
**Status**: ✅ **COMPLETO** - Footer com 3 variantes (default, minimal, extended), 3 tamanhos, 2 temas, suporte a seções, links externos/internos, social links e copyright implementado, 15 testes passando (100%)

#### Implementar os-data-grid [⏳]

**Descrição**: Tabelas avançadas
**Arquivos**:

- `src/app/shared/ui-components/organisms/os-data-grid/os-data-grid.component.ts`
- `src/app/shared/ui-components/organisms/os-data-grid/os-data-grid.component.scss`
- `src/app/shared/ui-components/organisms/os-data-grid/os-data-grid.component.spec.ts`

**Dependências**: os-data-table, os-filter-bar implementados
**Complexidade**: Alta
**Validação**: Paginação, sorting, filtering funcionando

#### Implementar os-form-section [✅ COMPLETO]

**Descrição**: Seções de formulário
**Arquivos**:

- `src/app/shared/ui-components/organisms/os-form-section/os-form-section.component.ts` ✅
- `src/app/shared/ui-components/organisms/os-form-section/os-form-section.component.scss` ✅
- `src/app/shared/ui-components/organisms/os-form-section/os-form-section.component.spec.ts` ✅

**Dependências**: os-form-group implementado ✅
**Complexidade**: Média
**Validação**: Seções funcionando ✅
**Status**: ✅ **COMPLETO** - Form section com 4 variantes, 3 tamanhos, 2 temas, funcionalidade collapsible, integração com os-form-group, content projection e responsividade implementado, 20 testes passando (100%)

#### Implementar os-navigation [✅ COMPLETO]

**Descrição**: Navegação principal
**Arquivos**:

- `src/app/shared/ui-components/organisms/os-navigation/os-navigation.component.ts` ✅
- `src/app/shared/ui-components/organisms/os-navigation/os-navigation.component.scss` ✅
- `src/app/shared/ui-components/organisms/os-navigation/os-navigation.component.spec.ts` ✅

**Dependências**: os-navigation-item implementado ✅
**Complexidade**: Média
**Validação**: Navegação funcionando ✅
**Status**: ✅ **COMPLETO** - Navigation com 4 variantes, 3 tamanhos, 2 orientações, responsividade completa, integração com os-navigation-item e 25 testes passando (100%)

#### Implementar os-modal [✅ COMPLETO]

**Descrição**: Diálogos e overlays
**Arquivos**:

- `src/app/shared/ui-components/organisms/os-modal/os-modal.component.ts` ✅
- `src/app/shared/ui-components/organisms/os-modal/os-modal.component.scss` ✅
- `src/app/shared/ui-components/organisms/os-modal/os-modal.component.spec.ts` ✅

**Dependências**: os-button, os-card implementados ✅
**Complexidade**: Alta
**Validação**: Modal abrindo/fechando ✅
**Status**: ✅ **COMPLETO** - Modal com 4 variantes (default, confirmation, form, info), 4 tamanhos (small, medium, large, fullscreen), funcionalidade de fechamento, integração com MatDialog, ações customizáveis, suporte a teclado (ESC, Ctrl+Enter), acessibilidade WCAG 2.1 AA e responsividade completa implementado

#### Implementar os-page-header [✅ COMPLETO]

**Descrição**: Cabeçalhos de página
**Arquivos**:

- `src/app/shared/ui-components/organisms/os-page-header/os-page-header.component.ts` ✅
- `src/app/shared/ui-components/organisms/os-page-header/os-page-header.component.scss` ✅
- `src/app/shared/ui-components/organisms/os-page-header/os-page-header.component.spec.ts` ✅

**Dependências**: os-button implementado ✅
**Complexidade**: Média
**Validação**: Breadcrumbs funcionando ✅
**Status**: ✅ **COMPLETO** - Page header com 3 variantes, 3 tamanhos, breadcrumbs, actions, ícones e responsividade implementado, 24 testes passando (100%)

#### Implementar os-goal-progress [✅ COMPLETO]

**Descrição**: Progresso de metas financeiras
**Arquivos**:

- `src/app/shared/ui-components/organisms/os-goal-progress/os-goal-progress.component.ts` ✅
- `src/app/shared/ui-components/organisms/os-goal-progress/os-goal-progress.component.scss` ✅
- `src/app/shared/ui-components/organisms/os-goal-progress/os-goal-progress.component.spec.ts` ✅

**Dependências**: os-progress-bar, os-money-display implementados ✅
**Complexidade**: Média
**Validação**: Progresso visual funcionando ✅
**Status**: ✅ **COMPLETO** - Goal progress com 4 variantes, 3 tamanhos, 2 temas, funcionalidade de progresso, integração com os-progress-bar e os-money-display, responsividade completa e 25 testes passando (100%)

#### Implementar os-budget-summary [✅ COMPLETO]

**Descrição**: Resumo de orçamentos
**Arquivos**:

- `src/app/shared/ui-components/organisms/os-budget-summary/os-budget-summary.component.ts` ✅
- `src/app/shared/ui-components/organisms/os-budget-summary/os-budget-summary.component.scss` ✅
- `src/app/shared/ui-components/organisms/os-budget-summary/os-budget-summary.component.spec.ts` ✅

**Dependências**: os-card, os-money-display implementados ✅
**Complexidade**: Média
**Validação**: Resumo calculando corretamente ✅
**Status**: ✅ **COMPLETO** - Budget summary com 3 variantes (default, compact, detailed), 3 tamanhos, funcionalidade de resumo financeiro, integração com os-card e os-money-display, barra de progresso visual, status do orçamento, seção de datas e responsividade completa implementado, 36 testes passando (100%)

#### Implementar os-transaction-list [⏳]

**Descrição**: Lista de transações
**Arquivos**:

- `src/app/shared/ui-components/organisms/os-transaction-list/os-transaction-list.component.ts`
- `src/app/shared/ui-components/organisms/os-transaction-list/os-transaction-list.component.scss`
- `src/app/shared/ui-components/organisms/os-transaction-list/os-transaction-list.component.spec.ts`

**Dependências**: os-data-grid implementado
**Complexidade**: Alta
**Validação**: Lista funcionando

#### Implementar os-category-manager [⏳]

**Descrição**: Gerenciador de categorias
**Arquivos**:

- `src/app/shared/ui-components/organisms/os-category-manager/os-category-manager.component.ts`
- `src/app/shared/ui-components/organisms/os-category-manager/os-category-manager.component.scss`
- `src/app/shared/ui-components/organisms/os-category-manager/os-category-manager.component.spec.ts`

**Dependências**: os-form-section, os-button implementados
**Complexidade**: Alta
**Validação**: CRUD funcionando

### 🔄 Dependências

- ✅ Fase 3 completada (molecules implementados)
- Componentes molecules funcionando

### 🧪 Critérios de Validação

- [ ] 12 componentes organisms implementados
- [ ] Integração com molecules funcionando
- [ ] Funcionalidades específicas do domínio
- [ ] Testes de integração completos
- [ ] Performance otimizada

### 📝 Comentários da Fase

**✅ FASE 4 EM PROGRESSO** - Sétimo organism implementado com sucesso:

- **os-footer**: Rodapé da aplicação com 3 variantes, 3 tamanhos, 2 temas, responsividade completa e 17 testes passando (100%)
- **os-page-header**: Cabeçalhos de página com 3 variantes, 3 tamanhos, breadcrumbs, actions, ícones e responsividade - 24 testes passando (100%)
- **os-navigation**: Navegação principal com 4 variantes, 3 tamanhos, 2 orientações, responsividade completa e integração com os-navigation-item - 25 testes passando (100%)
- **os-form-section**: Seções de formulário com 4 variantes, 3 tamanhos, 2 temas, funcionalidade collapsible, integração com os-form-group, content projection e responsividade - 20 testes passando (100%)
- **os-goal-progress**: Progresso de metas financeiras com 4 variantes, 3 tamanhos, 2 temas, funcionalidade de progresso, integração com os-progress-bar e os-money-display, responsividade completa e 25 testes passando (100%)
- **os-budget-summary**: Resumo de orçamentos com 3 variantes (default, compact, detailed), 3 tamanhos, funcionalidade de resumo financeiro, integração com os-card e os-money-display, barra de progresso visual, status do orçamento, seção de datas e responsividade completa - 36 testes passando (100%)
- **os-modal**: Diálogos e overlays com 4 variantes (default, confirmation, form, info), 4 tamanhos (small, medium, large, fullscreen), funcionalidade de fechamento, integração com MatDialog, ações customizáveis, suporte a teclado (ESC, Ctrl+Enter), acessibilidade WCAG 2.1 AA e responsividade completa implementado

**Características implementadas**:

- ✅ Responsividade completa com breakpoints otimizados (Mobile, Tablet, Desktop, Large)
- ✅ Layout adaptativo com grid responsivo e flexbox
- ✅ Suporte a seções dinâmicas, links externos/internos e social links
- ✅ Acessibilidade com ARIA attributes e navegação por teclado
- ✅ Testes abrangentes incluindo testes de responsividade
- ✅ Padrões Angular 20+ (standalone, signals, OnPush)
- ✅ Integração com Angular Router para links internos
- ✅ Integração perfeita com molecules (os-navigation-item)

**Próximo passo**: Implementar próximo organism (os-header, os-sidebar, os-data-grid, os-transaction-list ou os-category-manager)

---

## 📅 FASE 5: TEMPLATES - Layouts [Status: ⏳]

### 🎯 Objetivo da Fase

Implementar 8 templates de layout que definem a estrutura visual das páginas da aplicação.

### 📋 Tarefas

#### Implementar os-dashboard-layout [⏳]

**Descrição**: Layout principal com sidebar + appbar
**Arquivos**:

- `src/app/shared/ui-components/templates/os-dashboard-layout/os-dashboard-layout.component.ts`
- `src/app/shared/ui-components/templates/os-dashboard-layout/os-dashboard-layout.component.scss`
- `src/app/shared/ui-components/templates/os-dashboard-layout/os-dashboard-layout.component.spec.ts`

**Dependências**: os-header, os-sidebar implementados
**Complexidade**: Alta
**Validação**: Layout responsivo funcionando

#### Implementar os-form-layout [⏳]

**Descrição**: Layout para formulários com appbar
**Arquivos**:

- `src/app/shared/ui-components/templates/os-form-layout/os-form-layout.component.ts`
- `src/app/shared/ui-components/templates/os-form-layout/os-form-layout.component.scss`
- `src/app/shared/ui-components/templates/os-form-layout/os-form-layout.component.spec.ts`

**Dependências**: os-header implementado
**Complexidade**: Média
**Validação**: Formulário centralizado

#### Implementar os-list-layout [⏳]

**Descrição**: Layout para listas com sidebar + appbar
**Arquivos**:

- `src/app/shared/ui-components/templates/os-list-layout/os-list-layout.component.ts`
- `src/app/shared/ui-components/templates/os-list-layout/os-list-layout.component.scss`
- `src/app/shared/ui-components/templates/os-list-layout/os-list-layout.component.spec.ts`

**Dependências**: os-header, os-sidebar implementados
**Complexidade**: Média
**Validação**: Lista com filtros funcionando

#### Implementar os-detail-layout [⏳]

**Descrição**: Layout para detalhes com appbar
**Arquivos**:

- `src/app/shared/ui-components/templates/os-detail-layout/os-detail-layout.component.ts`
- `src/app/shared/ui-components/templates/os-detail-layout/os-detail-layout.component.scss`
- `src/app/shared/ui-components/templates/os-detail-layout/os-detail-layout.component.spec.ts`

**Dependências**: os-header implementado
**Complexidade**: Média
**Validação**: Detalhes organizados

#### Implementar os-auth-layout [⏳]

**Descrição**: Layout para autenticação
**Arquivos**:

- `src/app/shared/ui-components/templates/os-auth-layout/os-auth-layout.component.ts`
- `src/app/shared/ui-components/templates/os-auth-layout/os-auth-layout.component.scss`
- `src/app/shared/ui-components/templates/os-auth-layout/os-auth-layout.component.spec.ts`

**Complexidade**: Baixa
**Validação**: Layout limpo funcionando

#### Implementar os-onboarding-layout [⏳]

**Descrição**: Layout simplificado para onboarding
**Arquivos**:

- `src/app/shared/ui-components/templates/os-onboarding-layout/os-onboarding-layout.component.ts`
- `src/app/shared/ui-components/templates/os-onboarding-layout/os-onboarding-layout.component.scss`
- `src/app/shared/ui-components/templates/os-onboarding-layout/os-onboarding-layout.component.spec.ts`

**Complexidade**: Baixa
**Validação**: Onboarding funcionando

#### Implementar os-sidebar-template [⏳]

**Descrição**: Template de navegação lateral
**Arquivos**:

- `src/app/shared/ui-components/templates/os-sidebar-template/os-sidebar-template.component.ts`
- `src/app/shared/ui-components/templates/os-sidebar-template/os-sidebar-template.component.scss`
- `src/app/shared/ui-components/templates/os-sidebar-template/os-sidebar-template.component.spec.ts`

**Dependências**: os-sidebar implementado
**Complexidade**: Média
**Validação**: Navegação funcionando

#### Implementar os-appbar-template [⏳]

**Descrição**: Template de barra superior
**Arquivos**:

- `src/app/shared/ui-components/templates/os-appbar-template/os-appbar-template.component.ts`
- `src/app/shared/ui-components/templates/os-appbar-template/os-appbar-template.component.scss`
- `src/app/shared/ui-components/templates/os-appbar-template/os-appbar-template.component.spec.ts`

**Dependências**: os-header implementado
**Complexidade**: Média
**Validação**: Appbar funcionando

### 🔄 Dependências

- ✅ Fase 4 completada (organisms implementados)
- Componentes organisms funcionando

### 🧪 Critérios de Validação

- [ ] 8 templates implementados
- [ ] Layouts responsivos funcionando
- [ ] Integração com roteamento
- [ ] Testes de layout passando
- [ ] Performance otimizada

### 📝 Comentários da Fase

_[Observações sobre layouts]_

---

## 📅 FASE 6: Qualidade e Documentação [Status: ⏳]

### 🎯 Objetivo da Fase

Finalizar implementação com testes abrangentes, documentação completa e otimizações de performance.

### 📋 Tarefas

#### Implementar Testes Abrangentes [⏳]

**Descrição**: Testes unitários para todos os componentes
**Arquivos**: Todos os arquivos `.spec.ts`
**Complexidade**: Alta
**Validação**: Coverage > 90%

#### Configurar Storybook [⏳]

**Descrição**: Documentação interativa
**Arquivos**:

- `.storybook/main.ts`
- `.storybook/preview.ts`
- Stories para cada componente

**Complexidade**: Média
**Validação**: Storybook funcionando

#### Validar Acessibilidade [⏳]

**Descrição**: Testes WCAG 2.1 AA
**Arquivos**: Testes de acessibilidade
**Complexidade**: Média
**Validação**: Todos os componentes acessíveis

#### Otimizar Performance [⏳]

**Descrição**: Bundle size e renderização
**Arquivos**: Configurações de build
**Complexidade**: Média
**Validação**: Bundle < 50KB, renderização < 100ms

#### Documentar Design System [⏳]

**Descrição**: Documentação completa
**Arquivos**:

- `README.md` do Design System
- Guias de uso
- Exemplos de implementação

**Complexidade**: Baixa
**Validação**: Documentação completa

### 🏁 Entrega Final

- [ ] Todos os testes passando
- [ ] Documentação atualizada
- [ ] Code review interno realizado
- [ ] Pronto para PR

### 🧪 Critérios de Validação

- [ ] 47+ componentes funcionais
- [ ] Testes unitários completos
- [ ] Acessibilidade WCAG 2.1 AA
- [ ] Performance otimizada
- [ ] Bundle size < 50KB
- [ ] Documentação completa

### 📝 Comentários da Fase

_[Observações finais]_

---

## 🔀 Estratégia de Desenvolvimento

### Ordem de Execução

1. **Sequencial**: Fases 1 → 2 → 3 → 4 → 5 → 6 (dependências claras)
2. **Paralelo**: Dentro de cada fase, componentes independentes podem ser desenvolvidos simultaneamente

### Pontos de Validação

- **Após Fase 1**: Sistema de tema funcionando
- **Após Fase 2**: Atoms testados e funcionais
- **Após Fase 3**: Molecules integrados com atoms
- **Após Fase 4**: Organisms funcionando com molecules
- **Após Fase 5**: Templates integrados com roteamento
- **Final**: Design System completo e documentado

### Contingências

- **Se Fase X falhar**: Revisar dependências e ajustar plano
- **Se dependência atrasar**: Implementar componentes independentes primeiro
- **Se performance degradar**: Otimizar bundle size e lazy loading

## 🧪 Estratégia de Testes

### Testes por Fase

- **Fase 1**: Testes de tema e tokens
- **Fase 2**: Testes unitários de atoms
- **Fase 3**: Testes de integração de molecules
- **Fase 4**: Testes de funcionalidade de organisms
- **Fase 5**: Testes de layout de templates
- **Fase 6**: Testes end-to-end e acessibilidade

### Dados de Teste

- **Fixtures**: Dados de exemplo para componentes
- **Mocks**: Serviços e dependências externas
- **Factories**: Criação de dados de teste consistentes

## 📚 Referências e Pesquisas

### Documentação Consultada

- **Angular Material**: https://material.angular.dev/
- **Atomic Design**: https://bradfrost.com/blog/post/atomic-web-design/
- **Design Tokens**: https://spectrum.adobe.com/page/design-tokens/
- **WCAG 2.1**: https://www.w3.org/WAI/WCAG21/quickref/

### Decisões Arquiteturais Durante Planejamento

- **Decisão**: Implementação incremental por nível
- **Motivo**: Facilita desenvolvimento e teste
- **Impacto**: Permite validação contínua

## 🚨 Riscos Identificados

### Riscos Técnicos

- **Risco**: Bundle size pode crescer além do limite
- **Probabilidade**: Média
- **Mitigação**: Lazy loading e tree shaking otimizado

- **Risco**: Performance pode degradar com muitos componentes
- **Probabilidade**: Baixa
- **Mitigação**: OnPush strategy e otimizações

### Riscos de Dependência

- **Dependência Externa**: Angular Material updates
- **Impacto se Indisponível**: Breaking changes
- **Plano B**: Versionamento e testes de compatibilidade

## 📈 Métricas de Progresso

### Por Fase

- Fase 1: 4 tarefas, ~2 horas estimadas
- Fase 2: 16 tarefas, ~8 horas estimadas
- Fase 3: 12 tarefas, ~6 horas estimadas
- Fase 4: 12 tarefas, ~6 horas estimadas
- Fase 5: 8 tarefas, ~4 horas estimadas
- Fase 6: 5 tarefas, ~3 horas estimadas

### Total

- **Tarefas**: 57 tarefas
- **Tempo Estimado**: ~29 horas
- **Marcos**: 6 fases principais
