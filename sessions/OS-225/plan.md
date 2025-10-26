# Extrair header do Dashboard para e criar layout global - Plano de Implementação

> **Instruções**: Mantenha este arquivo atualizado conforme o progresso. Marque tarefas como concluídas ✅, em progresso ⏰ ou não iniciadas ⏳.

## 📋 Resumo Executivo

Implementar um App Shell global (Material Design M3) que padronize o layout da aplicação, removendo header e sidebar do Dashboard e criando um sistema de layout reutilizável com suporte a tema dark/light, responsividade e acessibilidade.

## 🎯 Objetivos

- Criar App Shell Template que orquestra header + sidebar + router-outlet
- Remover header/sidebar locais do Dashboard e migrar para shell global
- Implementar seletor de tema dark/light com persistência
- Garantir responsividade em todos os breakpoints (mobile/tablet/desktop)
- Manter acessibilidade WCAG 2.1 AA e navegação por teclado
- Aplicar layout às rotas de features via lazy loading

---

## 📅 FASE 1: Criar App Shell Template [Status: ⏳]

### 🎯 Objetivo

Criar o componente `AppShellTemplate` que orquestra header, sidebar e área principal, seguindo Material Design M3 e padrões do Design System.

### 📋 Tarefas

#### Criar AppShellTemplate Component [⏳]

**Descrição**: Implementar template que compõe `os-header` + `os-sidebar` + `router-outlet` com slots para ações contextuais
**Critério de Conclusão**: Componente funcional com template, inputs/outputs e estilos básicos
**Arquivos**: `src/app/shared/ui-components/templates/os-app-shell-template/os-app-shell-template.component.ts`

#### Implementar Responsividade [⏳]

**Descrição**: Configurar breakpoints para drawer modal (<768), persistente (≥768), permanente (≥992) com rail colapsável
**Critério de Conclusão**: Layout responsivo funcionando em todos os breakpoints
**Dependências**: AppShellTemplate criado

#### Adicionar Slots para Ações Contextuais [⏳]

**Descrição**: Implementar slots para seletor de orçamento e ações específicas de cada página
**Critério de Conclusão**: Slots funcionais com projeção de conteúdo
**Dependências**: AppShellTemplate criado

### 🧪 Critérios de Validação

- [ ] Componente renderiza sem erros
- [ ] Responsividade funciona em mobile/tablet/desktop
- [ ] Slots permitem projeção de conteúdo
- [ ] Segue padrões do Design System (OnPush, signals, standalone)

### 📝 Comentários da Fase

_[Espaço para anotações durante desenvolvimento]_

---

## 📅 FASE 2: Integrar Seletor de Tema [Status: ⏳]

### 🎯 Objetivo

Implementar alternância de tema dark/light no header com persistência em localStorage e respeito ao `prefers-color-scheme`.

### 📋 Tarefas

#### Criar Theme Service [⏳]

**Descrição**: Implementar serviço para gerenciar estado do tema com persistência e detecção de preferência do sistema
**Critério de Conclusão**: Serviço funcional com signals para estado do tema
**Arquivos**: `src/app/core/services/theme/theme.service.ts`

#### Integrar Toggle no Header [⏳]

**Descrição**: Adicionar `os-toggle` no header para alternância de tema com ícones apropriados
**Critério de Conclusão**: Toggle funcional no header com mudança visual do tema
**Dependências**: Theme Service criado, AppShellTemplate implementado

#### Implementar Persistência [⏳]

**Descrição**: Salvar preferência de tema no localStorage e aplicar na inicialização
**Critério de Conclusão**: Tema persiste entre sessões e aplica-se corretamente no SSR
**Dependências**: Theme Service criado

### 🔄 Dependências

- ✅ Fase 1 completada

### 🧪 Critérios de Validação

- [ ] Toggle alterna tema corretamente
- [ ] Preferência persiste entre sessões
- [ ] Respeita `prefers-color-scheme` inicial
- [ ] Sem FOUC (Flash of Unstyled Content) no SSR

### 📝 Comentários da Fase

_[Observações sobre decisões tomadas]_

---

## 📅 FASE 3: Migrar Dashboard para App Shell [Status: ⏳]

### 🎯 Objetivo

Remover header e sidebar locais do Dashboard e integrar com o App Shell global.

### 📋 Tarefas

#### Atualizar Rotas para App Shell [⏳]

**Descrição**: Modificar `app.routes.ts` para usar App Shell como layout principal com lazy loading
**Critério de Conclusão**: Rotas aplicam App Shell automaticamente
**Arquivos**: `src/app/app.routes.ts`

#### Refatorar Dashboard Page [⏳]

**Descrição**: Remover header/sidebar do Dashboard e usar slots do App Shell para ações contextuais
**Critério de Conclusão**: Dashboard funciona apenas com conteúdo principal
**Dependências**: Rotas atualizadas
**Arquivos**: `src/app/features/dashboard/pages/dashboard.page.ts`

#### Integrar Seletor de Orçamento [⏳]

**Descrição**: Mover seletor de orçamento do Dashboard para slot do App Shell
**Critério de Conclusão**: Seletor funciona no header global
**Dependências**: Dashboard refatorado

### 🔄 Dependências

- ✅ Fase 2 completada

### 🧪 Critérios de Validação

- [ ] Dashboard não tem header/sidebar próprios
- [ ] Seletor de orçamento funciona no App Shell
- [ ] Navegação funciona corretamente
- [ ] Layout responsivo mantido

### 📝 Comentários da Fase

_[Observações sobre migração]_

---

## 📅 FASE 4: Implementar Acessibilidade e Polimento [Status: ⏳]

### 🎯 Objetivo

Garantir acessibilidade WCAG 2.1 AA, navegação por teclado e estados de loading/error.

### 📋 Tarefas

#### Implementar Acessibilidade [⏳]

**Descrição**: Adicionar roles/ARIA, skip links, navegação por teclado e foco visível
**Critério de Conclusão**: Componentes passam em auditoria de acessibilidade
**Dependências**: App Shell implementado

#### Adicionar Estados de Loading/Error [⏳]

**Descrição**: Implementar estados de loading global e tratamento de erros no App Shell
**Critério de Conclusão**: Estados visuais funcionais para diferentes cenários
**Dependências**: App Shell implementado

#### Criar Stories do Storybook [⏳]

**Descrição**: Criar stories para App Shell com variações de tema, colapso e breakpoints
**Critério de Conclusão**: Stories completas no Storybook
**Dependências**: App Shell implementado
**Arquivos**: `src/app/shared/ui-components/templates/os-app-shell-template/os-app-shell-template.stories.ts`

### 🔄 Dependências

- ✅ Fase 3 completada

### 🧪 Critérios de Validação

- [ ] Navegação por teclado completa
- [ ] Roles/ARIA corretos
- [ ] Skip links funcionais
- [ ] Estados de loading/error implementados
- [ ] Stories do Storybook criadas

### 📝 Comentários da Fase

_[Observações sobre acessibilidade]_

---

## 📅 FASE 5: Testes e Validação Final [Status: ⏳]

### 🎯 Objetivo

Implementar testes unitários e de integração, validar performance e preparar para produção.

### 📋 Tarefas

#### Criar Testes Unitários [⏳]

**Descrição**: Testes para App Shell, Theme Service e componentes relacionados
**Critério de Conclusão**: Cobertura de testes adequada (>80%)
**Dependências**: Todas as fases anteriores

#### Testes de Acessibilidade [⏳]

**Descrição**: Testes automatizados para navegação por teclado e ARIA
**Critério de Conclusão**: Testes de a11y passando
**Dependências**: Acessibilidade implementada

#### Validação de Performance [⏳]

**Descrição**: Verificar bundle size, lazy loading e otimizações
**Critério de Conclusão**: Performance mantida ou melhorada
**Dependências**: Implementação completa

### 🔄 Dependências

- ✅ Fase 4 completada

### 🧪 Critérios de Validação

- [ ] Testes unitários passando
- [ ] Testes de acessibilidade passando
- [ ] Performance validada
- [ ] Bundle size controlado

### 📝 Comentários da Fase

_[Observações sobre testes]_

---

## 🏁 Entrega Final

- [ ] App Shell Template funcional e responsivo
- [ ] Tema dark/light com persistência
- [ ] Dashboard migrado para App Shell
- [ ] Acessibilidade WCAG 2.1 AA implementada
- [ ] Testes unitários e de integração
- [ ] Stories do Storybook criadas
- [ ] Documentação atualizada
- [ ] Pronto para Pull Request

## 📚 Referências Técnicas

- **Componentes Base**: `os-header`, `os-sidebar`, `os-toggle`, `os-navigation-item`
- **Templates**: `os-dashboard-template` (referência de composição)
- **Serviços**: `BudgetSelectionService`, `ConfigService` (padrões)
- **Padrões**: Material Design M3, Clean Architecture, Angular 20+ standalone
- **Documentação**: `sessions/OS-225/layout-specification.md`, `CLAUDE.md`

## 🔧 Ferramentas e Dependências

- **Angular**: 20+ com standalone components
- **Material**: Angular Material (Slide Toggle)
- **Design System**: Tokens existentes (`--os-*`)
- **Testes**: vitest, Angular Testing Library
- **Storybook**: Stories para componentes
- **Acessibilidade**: axe-core, lighthouse

## ⚠️ Riscos e Mitigações

- **Complexidade de Estados**: Usar signals para gerenciamento de estado
- **FOUC no SSR**: Implementar estratégia SSR-safe para tema
- **Performance**: Manter lazy loading e OnPush
- **Acessibilidade**: Testes automatizados e auditoria manual
