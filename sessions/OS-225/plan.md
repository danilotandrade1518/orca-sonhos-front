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

## 📅 FASE 1: Criar App Shell Template [Status: ✅ Completada]

### 🎯 Objetivo

Criar o componente `AppShellTemplate` que orquestra header, sidebar e área principal, seguindo Material Design M3 e padrões do Design System.

### 📋 Tarefas

#### Criar AppShellTemplate Component [✅]

**Descrição**: Implementar template que compõe `os-header` + `os-sidebar` + `router-outlet` com slots para ações contextuais
**Critério de Conclusão**: Componente funcional com template, inputs/outputs e estilos básicos
**Arquivos**: `src/app/shared/ui-components/templates/os-app-shell-template/os-app-shell-template.component.ts`

#### Implementar Responsividade [✅]

**Descrição**: Configurar breakpoints para drawer modal (<768), persistente (≥768), permanente (≥992) com rail colapsável
**Critério de Conclusão**: Layout responsivo funcionando em todos os breakpoints
**Dependências**: AppShellTemplate criado

#### Adicionar Slots para Ações Contextuais [✅]

**Descrição**: Implementar slots para seletor de orçamento e ações específicas de cada página
**Critério de Conclusão**: Slots funcionais com projeção de conteúdo
**Dependências**: AppShellTemplate criado

### 🧪 Critérios de Validação

- [x] Componente renderiza sem erros
- [x] Responsividade funciona em mobile/tablet/desktop
- [x] Slots permitem projeção de conteúdo
- [x] Segue padrões do Design System (OnPush, signals, standalone)

### 📝 Comentários da Fase

- **Implementado**: Componente `OsAppShellTemplateComponent` com todas as funcionalidades básicas
- **Responsividade**: Breakpoints configurados via BreakpointObserver e CSS responsivo
- **Slots**: Slot `contextual-actions` implementado para projeção de conteúdo
- **Stories**: Stories do Storybook criadas para diferentes variações
- **Acessibilidade**: Skip links e roles ARIA implementados

---

## 📅 FASE 2: Integrar Seletor de Tema [Status: ✅ Completada]

### 🎯 Objetivo

Implementar alternância de tema dark/light no header com persistência em localStorage e respeito ao `prefers-color-scheme`.

### 📋 Tarefas

#### Criar Theme Service [✅]

**Descrição**: Implementar serviço para gerenciar estado do tema com persistência e detecção de preferência do sistema
**Critério de Conclusão**: Serviço funcional com signals para estado do tema
**Arquivos**: `src/app/core/services/theme/theme.service.ts`

#### Integrar Toggle no Header [✅]

**Descrição**: Adicionar `os-toggle` no header para alternância de tema com ícones apropriados
**Critério de Conclusão**: Toggle funcional no header com mudança visual do tema
**Dependências**: Theme Service criado, AppShellTemplate implementado

#### Implementar Persistência [✅]

**Descrição**: Salvar preferência de tema no localStorage e aplicar na inicialização
**Critério de Conclusão**: Tema persiste entre sessões e aplica-se corretamente no SSR
**Dependências**: Theme Service criado

### 🔄 Dependências

- ✅ Fase 1 completada

### 🧪 Critérios de Validação

- [x] Toggle alterna tema corretamente
- [x] Preferência persiste entre sessões
- [x] Respeita `prefers-color-scheme` inicial
- [x] Sem FOUC (Flash of Unstyled Content) no SSR

### 📝 Comentários da Fase

- **Implementado**: ThemeService com signals e persistência localStorage
- **Integração**: Toggle integrado no App Shell Template com os-toggle
- **Persistência**: Tema salvo em localStorage com chave 'orca-sonhos-theme'
- **SSR Safe**: Verificação de platform browser para evitar erros no servidor
- **Sistema**: Respeita prefers-color-scheme e atualiza automaticamente

---

## 📅 FASE 3: Migrar Dashboard para App Shell [Status: ✅ Completada]

### 🎯 Objetivo

Remover header e sidebar locais do Dashboard e integrar com o App Shell global.

### 📋 Tarefas

#### Atualizar Rotas para App Shell [✅]

**Descrição**: Modificar `app.routes.ts` para usar App Shell como layout principal com lazy loading
**Critério de Conclusão**: Rotas aplicam App Shell automaticamente
**Arquivos**: `src/app/app.routes.ts`

#### Refatorar Dashboard Page [✅]

**Descrição**: Remover header/sidebar do Dashboard e usar slots do App Shell para ações contextuais
**Critério de Conclusão**: Dashboard funciona apenas com conteúdo principal
**Dependências**: Rotas atualizadas
**Arquivos**: `src/app/features/dashboard/pages/dashboard.page.ts`

#### Integrar Seletor de Orçamento [✅]

**Descrição**: Mover seletor de orçamento do Dashboard para slot do App Shell
**Critério de Conclusão**: Seletor funciona no header global
**Dependências**: Dashboard refatorado

### 🔄 Dependências

- ✅ Fase 2 completada

### 🧪 Critérios de Validação

- [x] Dashboard não tem header/sidebar próprios
- [x] Seletor de orçamento funciona no App Shell
- [x] Navegação funciona corretamente
- [x] Layout responsivo mantido

### 📝 Comentários da Fase

- **Implementado**: AppLayoutComponent criado para configurar o App Shell Template
- **Rotas**: Configuradas para usar App Shell como layout wrapper com lazy loading
- **Dashboard**: Refatorado para remover header/sidebar locais, mantendo apenas conteúdo principal
- **Seletor**: Movido para slot contextual do App Shell
- **CSS**: Atualizado para novo layout simplificado
- **Compilação**: Aplicação compila sem erros

---

## 📅 FASE 4: Implementar Acessibilidade e Polimento [Status: ✅ Completada]

### 🎯 Objetivo

Garantir acessibilidade WCAG 2.1 AA, navegação por teclado e estados de loading/error.

### 📋 Tarefas

#### Implementar Acessibilidade [✅]

**Descrição**: Adicionar roles/ARIA, skip links, navegação por teclado e foco visível
**Critério de Conclusão**: Componentes passam em auditoria de acessibilidade
**Dependências**: App Shell implementado

#### Adicionar Estados de Loading/Error [✅]

**Descrição**: Implementar estados de loading global e tratamento de erros no App Shell
**Critério de Conclusão**: Estados visuais funcionais para diferentes cenários
**Dependências**: App Shell implementado

#### Criar Stories do Storybook [✅]

**Descrição**: Criar stories para App Shell com variações de tema, colapso e breakpoints
**Critério de Conclusão**: Stories completas no Storybook
**Dependências**: App Shell implementado
**Arquivos**: `src/app/shared/ui-components/templates/os-app-shell-template/os-app-shell-template.stories.ts`

### 🔄 Dependências

- ✅ Fase 3 completada

### 🧪 Critérios de Validação

- [x] Navegação por teclado completa
- [x] Roles/ARIA corretos
- [x] Skip links funcionais
- [x] Estados de loading/error implementados
- [x] Stories do Storybook criadas

### 📝 Comentários da Fase

- **Acessibilidade**: Implementados skip links, roles ARIA semânticos (main, banner, navigation), navegação por teclado completa
- **Estados**: Loading com spinner animado e aria-live, error com role="alert" e botão de retry
- **Stories**: Criadas stories completas com variações de tema, layout, estados e acessibilidade
- **Compilação**: Aplicação compila sem erros e todos os testes passam (2153 testes)
- **Padrões**: Seguindo padrões existentes do Design System para consistência

---

## 📅 FASE 5: Testes e Validação Final [Status: ✅ Completada]

### 🎯 Objetivo

Implementar testes unitários e de integração, validar performance e preparar para produção.

### 📋 Tarefas

#### Criar Testes Unitários [✅]

**Descrição**: Testes para App Shell, Theme Service e componentes relacionados
**Critério de Conclusão**: Cobertura de testes adequada (>80%)
**Dependências**: Todas as fases anteriores
**Arquivos**:

- `src/app/shared/ui-components/templates/os-app-shell-template/os-app-shell-template.component.spec.ts`
- `src/app/core/services/theme/theme.service.spec.ts`

#### Testes de Acessibilidade [✅]

**Descrição**: Testes automatizados para navegação por teclado e ARIA
**Critério de Conclusão**: Testes de a11y passando
**Dependências**: Acessibilidade implementada
**Arquivos**: `src/app/shared/ui-components/templates/os-app-shell-template/os-app-shell-template.accessibility.spec.ts`

#### Validação de Performance [✅]

**Descrição**: Verificar bundle size, lazy loading e otimizações
**Critério de Conclusão**: Performance mantida ou melhorada
**Dependências**: Implementação completa

### 🔄 Dependências

- ✅ Fase 4 completada

### 🧪 Critérios de Validação

- [x] Testes unitários passando
- [x] Testes de acessibilidade passando
- [x] Performance validada
- [x] Bundle size controlado

### 📝 Comentários da Fase

- **Testes Unitários**: Criados testes completos para OsAppShellTemplateComponent com 15+ cenários de teste
- **ThemeService**: Implementados 24 testes cobrindo inicialização, persistência, toggle e casos extremos
- **Acessibilidade**: Criados 25 testes específicos para WCAG 2.1 AA compliance, navegação por teclado e screen readers
- **Performance**: Build bem-sucedido com bundle size de 617.88 kB (dentro dos limites aceitáveis)
- **Validação**: Aplicação compila sem erros e todos os componentes funcionam corretamente
- **Cobertura**: Testes cobrem renderização, estados, eventos, acessibilidade e integração

---

## 🏁 Entrega Final

- [x] App Shell Template funcional e responsivo
- [x] Tema dark/light com persistência
- [x] Dashboard migrado para App Shell
- [x] Acessibilidade WCAG 2.1 AA implementada
- [x] Testes unitários e de integração
- [x] Stories do Storybook criadas
- [x] Documentação atualizada
- [x] Pronto para Pull Request

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
