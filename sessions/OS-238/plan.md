# Padronização de Modais e Componentes de Confirmação no Design System - Plano de Implementação

> **Instruções**: Mantenha este arquivo atualizado conforme o progresso. Marque tarefas como concluídas ✅, em progresso ⏰ ou não iniciadas ⏳.

## 📋 Resumo Executivo

Implementar um componente genérico de confirmação (`os-confirm-dialog`) no Design System e um serviço (`ConfirmDialogService`) para substituir 3 modais duplicados e o uso de `confirm()` nativo. Em seguida, migrar 5 formulários de modais para páginas dedicadas, melhorando UX com URLs próprias e navegação.

**Escopo Total:**

- **Fase 1**: 1 componente novo + 1 serviço + 4 substituições
- **Fase 2**: 5 páginas novas + 5 rotas + remoção de 5 modais

**Estimativa Total**: ~16-20 horas de desenvolvimento

## 🎯 Objetivos

- Eliminar duplicação de código (3 modais idênticos)
- Padronizar confirmações no Design System
- Melhorar UX migrando formulários para páginas dedicadas
- Manter 100% de compatibilidade funcional
- Garantir acessibilidade WCAG 2.1 AA

---

## 📅 FASE 1: Componente e Serviço Base [Status: ⏳]

### 🎯 Objetivo

Criar o componente `os-confirm-dialog` e o serviço `ConfirmDialogService` como base para todas as confirmações do sistema.

### 📋 Tarefas

#### Criar Estrutura de Diretórios [⏳]

**Descrição**: Criar estrutura de pastas para o componente e serviço
**Arquivos**:

- `src/app/shared/ui-components/organisms/os-confirm-dialog/`
- `src/app/core/services/confirm-dialog/`
  **Critério de Conclusão**: Diretórios criados e index.ts preparados

#### Implementar os-confirm-dialog.component.ts [⏳]

**Descrição**: Criar componente standalone com:

- Inputs: `title`, `message`, `variant` (danger/warning/info), `confirmText`, `cancelText`
- Outputs: `confirmed`, `cancelled`
- Integração com `os-modal-template`
- Suporte a variantes visuais (cores, ícones)
- ARIA attributes completos
  **Dependências**: Estrutura de diretórios criada
  **Critério de Conclusão**: Componente renderiza corretamente com todas as variantes

#### Implementar Estilos (os-confirm-dialog.component.scss) [⏳]

**Descrição**: Criar estilos para:

- Variantes (danger, warning, info) com cores do design system
- Responsividade mobile-first
- Animações suaves (300ms)
- Alerta visual com background colorido
  **Dependências**: Componente criado
  **Critério de Conclusão**: Estilos aplicados corretamente em todas as variantes e breakpoints

#### Implementar ConfirmDialogService [⏳]

**Descrição**: Criar serviço com:

- Método `open(config): Promise<boolean>`
- Integração com `MatDialog`
- Configuração de dados via `MatDialogConfig`
- Retorno de Promise baseado em `afterClosed()`
- Interface `ConfirmDialogConfig` tipada
  **Dependências**: Componente criado
  **Critério de Conclusão**: Serviço abre modal e retorna Promise corretamente

#### Implementar Exports (index.ts) [⏳]

**Descrição**: Criar arquivos index.ts para exports públicos
**Arquivos**:

- `src/app/shared/ui-components/organisms/os-confirm-dialog/index.ts`
- `src/app/core/services/confirm-dialog/index.ts`
  **Dependências**: Componente e serviço criados
  **Critério de Conclusão**: Exports funcionando, componentes importáveis

### 🧪 Critérios de Validação

- [ ] Componente renderiza com todas as variantes (danger, warning, info)
- [ ] Serviço abre modal corretamente via MatDialog
- [ ] Promise resolve com `true` ao confirmar e `false` ao cancelar
- [ ] Estilos responsivos funcionam (mobile, tablet, desktop)
- [ ] ARIA attributes presentes e corretos
- [ ] Keyboard navigation funciona (Tab, Enter, Esc)

### 📝 Comentários da Fase

_[Espaço para anotações durante desenvolvimento]_

---

## 📅 FASE 2: Testes e Acessibilidade [Status: ⏳]

### 🎯 Objetivo

Garantir qualidade e acessibilidade do componente e serviço através de testes abrangentes.

### 📋 Tarefas

#### Testes Unitários do Componente [⏳]

**Descrição**: Criar testes para:

- Renderização com diferentes variantes
- Textos customizáveis (título, mensagem, botões)
- Eventos de confirmação e cancelamento
- ARIA attributes
- Keyboard navigation
  **Arquivo**: `os-confirm-dialog.component.spec.ts`
  **Dependências**: Fase 1 completa
  **Critério de Conclusão**: Todos os testes passando (>80% coverage)

#### Testes Unitários do Serviço [⏳]

**Descrição**: Criar testes para:

- Abertura do diálogo com MatDialog
- Retorno de Promise<boolean> correto
- Configuração de dados passada ao componente
- Fechamento do diálogo
  **Arquivo**: `confirm-dialog.service.spec.ts`
  **Dependências**: Fase 1 completa
  **Critério de Conclusão**: Todos os testes passando (>80% coverage)

#### Validação de Acessibilidade [⏳]

**Descrição**: Validar:

- WCAG 2.1 AA compliance
- Screen reader (NVDA/JAWS)
- Keyboard navigation completa
- Focus trap no modal
- Contraste de cores (>= 4.5:1)
  **Dependências**: Fase 1 completa
  **Critério de Conclusão**: Acessibilidade validada e documentada

### 🧪 Critérios de Validação

- [ ] Todos os testes unitários passando
- [ ] Coverage > 80% para componente e serviço
- [ ] Acessibilidade validada com screen reader
- [ ] Keyboard navigation testada manualmente
- [ ] Contraste validado com ferramentas

### 📝 Comentários da Fase

_[Observações sobre testes e acessibilidade]_

---

## 📅 FASE 3: Substituição de Modais Duplicados [Status: ⏳]

### 🎯 Objetivo

Substituir os 3 modais duplicados e o `confirm()` nativo pelo novo serviço.

### 📋 Tarefas

#### Substituir confirm() no os-category-manager [⏳]

**Descrição**:

- Localizar uso de `confirm()` na linha 680
- Substituir por `ConfirmDialogService.open()`
- Configurar mensagem apropriada para exclusão de categoria
- Manter comportamento idêntico
  **Arquivo**: `src/app/shared/ui-components/organisms/os-category-manager/os-category-manager.component.ts`
  **Dependências**: Fase 2 completa
  **Critério de Conclusão**: `confirm()` removido, serviço funcionando

#### Substituir Modal de Exclusão de Envelopes [⏳]

**Descrição**:

- Localizar uso de `ConfirmDeleteEnvelopeModalComponent`
- Substituir por `ConfirmDialogService.open()`
- Configurar mensagem específica para envelope
- Testar exclusão completa
  **Arquivos**:
- `src/app/features/envelopes/pages/envelopes/envelopes.page.ts`
- Remover: `src/app/features/envelopes/components/confirm-delete-modal/`
  **Dependências**: Fase 2 completa
  **Critério de Conclusão**: Modal antigo removido, serviço funcionando

#### Substituir Modal de Exclusão de Accounts [⏳]

**Descrição**:

- Localizar uso de `ConfirmDeleteModalComponent` (accounts)
- Substituir por `ConfirmDialogService.open()`
- Configurar mensagem específica para conta
- Testar exclusão completa
  **Arquivos**:
- Página que usa o modal (verificar onde é usado)
- Remover: `src/app/features/accounts/components/confirm-delete-modal/`
  **Dependências**: Fase 2 completa
  **Critério de Conclusão**: Modal antigo removido, serviço funcionando

#### Substituir Modal de Exclusão de Credit Cards [⏳]

**Descrição**:

- Localizar uso de `ConfirmDeleteCreditCardModalComponent`
- Substituir por `ConfirmDialogService.open()`
- Configurar mensagem específica para cartão
- Testar exclusão completa
  **Arquivos**:
- Página que usa o modal (verificar onde é usado)
- Remover: `src/app/features/credit-cards/components/confirm-delete-modal/`
  **Dependências**: Fase 2 completa
  **Critério de Conclusão**: Modal antigo removido, serviço funcionando

#### Limpeza e Validação Final [⏳]

**Descrição**:

- Remover imports não utilizados
- Verificar que nenhum componente antigo está sendo usado
- Validar que todas as exclusões funcionam
- Executar testes de integração
  **Dependências**: Todas as substituições anteriores
  **Critério de Conclusão**: Código limpo, todos os testes passando

### 🧪 Critérios de Validação

- [ ] `confirm()` nativo removido
- [ ] 3 modais duplicados removidos
- [ ] Todas as exclusões funcionando corretamente
- [ ] Nenhum import quebrado
- [ ] Testes de integração passando

### 📝 Comentários da Fase

_[Observações sobre substituições e problemas encontrados]_

---

## 📅 FASE 4: Migração - Envelope Form [Status: ⏳]

### 🎯 Objetivo

Migrar `envelope-form` de modal para páginas dedicadas `/envelopes/new` e `/envelopes/:id/edit`.

### 📋 Tarefas

#### Criar Página envelope-form.page.ts [⏳]

**Descrição**:

- Criar página standalone usando `os-page` e `os-form-template`
- Migrar lógica do `envelope-form.component.ts`
- Manter validação, loading e tratamento de erros
- Suportar modo create e edit via rota
  **Arquivo**: `src/app/features/envelopes/pages/envelope-form/envelope-form.page.ts`
  **Dependências**: Fase 3 completa
  **Critério de Conclusão**: Página criada e funcional

#### Implementar Estilos da Página [⏳]

**Descrição**:

- Criar estilos responsivos
- Mobile-first approach
- Usar design tokens do sistema
  **Arquivo**: `src/app/features/envelopes/pages/envelope-form/envelope-form.page.scss`
  **Dependências**: Página criada
  **Critério de Conclusão**: Estilos aplicados e responsivos

#### Adicionar Rotas [⏳]

**Descrição**:

- Adicionar rota `/envelopes/new` para criar
- Adicionar rota `/envelopes/:id/edit` para editar
- Configurar lazy loading
- Adicionar títulos apropriados
  **Arquivo**: `src/app/features/envelopes/envelopes.routes.ts`
  **Dependências**: Página criada
  **Critério de Conclusão**: Rotas funcionando, navegação correta

#### Atualizar Navegação [⏳]

**Descrição**:

- Atualizar botões/links que abrem modal para navegar para rotas
- Adicionar breadcrumbs se necessário
- Testar navegação de volta
  **Arquivos**: Páginas que usam envelope-form
  **Dependências**: Rotas criadas
  **Critério de Conclusão**: Navegação funcionando corretamente

#### Remover Componente Modal Antigo [⏳]

**Descrição**:

- Remover `envelope-form.component.ts` (modal)
- Limpar imports não utilizados
- Validar que nada quebrou
  **Arquivo**: `src/app/features/envelopes/components/envelope-form/`
  **Dependências**: Página funcionando
  **Critério de Conclusão**: Componente antigo removido, tudo funcionando

### 🧪 Critérios de Validação

- [ ] Página cria envelope corretamente
- [ ] Página edita envelope corretamente
- [ ] Validação funcionando
- [ ] Loading states funcionando
- [ ] Tratamento de erros funcionando
- [ ] Navegação funcionando (voltar, histórico)
- [ ] Responsividade validada

### 📝 Comentários da Fase

_[Observações sobre migração do envelope-form]_

---

## 📅 FASE 5: Migração - Pay Bill Modal [Status: ⏳]

### 🎯 Objetivo

Migrar `pay-bill-modal` para página dedicada `/credit-cards/bills/:id/pay`.

### 📋 Tarefas

#### Criar Página pay-bill.page.ts [⏳]

**Descrição**:

- Criar página standalone
- Migrar lógica do `pay-bill-modal.component.ts`
- Manter integração com CreditCardState
- Suportar parâmetro `:id` da fatura
  **Arquivo**: `src/app/features/credit-cards/pages/pay-bill/pay-bill.page.ts`
  **Dependências**: Fase 4 completa
  **Critério de Conclusão**: Página criada e funcional

#### Implementar Estilos [⏳]

**Descrição**: Estilos responsivos para página
**Arquivo**: `src/app/features/credit-cards/pages/pay-bill/pay-bill.page.scss`
**Dependências**: Página criada
**Critério de Conclusão**: Estilos aplicados

#### Adicionar Rota [⏳]

**Descrição**: Adicionar rota `/credit-cards/bills/:id/pay` com lazy loading
**Arquivo**: `src/app/features/credit-cards/credit-cards.routes.ts`
**Dependências**: Página criada
**Critério de Conclusão**: Rota funcionando

#### Atualizar Navegação e Remover Modal [⏳]

**Descrição**: Atualizar links e remover componente modal antigo
**Dependências**: Rota criada
**Critério de Conclusão**: Navegação funcionando, modal removido

### 🧪 Critérios de Validação

- [ ] Página paga fatura corretamente
- [ ] Validação funcionando
- [ ] Navegação funcionando
- [ ] Responsividade validada

### 📝 Comentários da Fase

_[Observações sobre migração do pay-bill-modal]_

---

## 📅 FASE 6: Migração - Goal Amount Modal [Status: ⏳]

### 🎯 Objetivo

Migrar `goal-amount-modal` para páginas `/goals/:id/add-amount` e `/goals/:id/remove-amount`.

### 📋 Tarefas

#### Criar Página goal-amount.page.ts [⏳]

**Descrição**:

- Criar página standalone
- Migrar lógica do `goal-amount-modal.component.ts`
- Suportar modo `add` e `remove` via rota
- Manter validação e cálculos
  **Arquivo**: `src/app/features/goals/pages/goal-amount/goal-amount.page.ts`
  **Dependências**: Fase 5 completa
  **Critério de Conclusão**: Página criada e funcional

#### Implementar Estilos [⏳]

**Descrição**: Estilos responsivos
**Arquivo**: `src/app/features/goals/pages/goal-amount/goal-amount.page.scss`
**Dependências**: Página criada
**Critério de Conclusão**: Estilos aplicados

#### Adicionar Rotas [⏳]

**Descrição**: Adicionar rotas `/goals/:id/add-amount` e `/goals/:id/remove-amount`
**Arquivo**: `src/app/features/goals/goals.routes.ts`
**Dependências**: Página criada
**Critério de Conclusão**: Rotas funcionando

#### Atualizar Navegação e Remover Modal [⏳]

**Descrição**: Atualizar links e remover componente modal antigo
**Dependências**: Rotas criadas
**Critério de Conclusão**: Navegação funcionando, modal removido

### 🧪 Critérios de Validação

- [ ] Página adiciona aporte corretamente
- [ ] Página remove aporte corretamente
- [ ] Validação funcionando
- [ ] Cálculos corretos
- [ ] Navegação funcionando
- [ ] Responsividade validada

### 📝 Comentários da Fase

_[Observações sobre migração do goal-amount-modal]_

---

## 📅 FASE 7: Migração - Transfer Modal [Status: ⏳]

### 🎯 Objetivo

Migrar `transfer-modal` para página dedicada `/accounts/transfer`.

### 📋 Tarefas

#### Criar Página transfer.page.ts [⏳]

**Descrição**:

- Criar página standalone
- Migrar lógica do `transfer-modal.component.ts`
- Manter integração com AccountState
- Usar `transfer-form` component existente
  **Arquivo**: `src/app/features/accounts/pages/transfer/transfer.page.ts`
  **Dependências**: Fase 6 completa
  **Critério de Conclusão**: Página criada e funcional

#### Implementar Estilos [⏳]

**Descrição**: Estilos responsivos
**Arquivo**: `src/app/features/accounts/pages/transfer/transfer.page.scss`
**Dependências**: Página criada
**Critério de Conclusão**: Estilos aplicados

#### Adicionar Rota [⏳]

**Descrição**: Adicionar rota `/accounts/transfer` com lazy loading
**Arquivo**: `src/app/features/accounts/accounts.routes.ts`
**Dependências**: Página criada
**Critério de Conclusão**: Rota funcionando

#### Atualizar Navegação e Remover Modal [⏳]

**Descrição**: Atualizar links e remover componente modal antigo
**Dependências**: Rota criada
**Critério de Conclusão**: Navegação funcionando, modal removido

### 🧪 Critérios de Validação

- [ ] Página realiza transferência corretamente
- [ ] Validação funcionando
- [ ] Navegação funcionando
- [ ] Responsividade validada

### 📝 Comentários da Fase

_[Observações sobre migração do transfer-modal]_

---

## 📅 FASE 8: Migração - Reconcile Modal [Status: ⏳]

### 🎯 Objetivo

Migrar `reconcile-modal` para página dedicada `/accounts/:id/reconcile`.

### 📋 Tarefas

#### Criar Página reconcile.page.ts [⏳]

**Descrição**:

- Criar página standalone
- Migrar lógica do `reconcile-modal.component.ts`
- Manter integração com AccountState
- Suportar parâmetro `:id` da conta
- Usar `reconcile-form` component existente
  **Arquivo**: `src/app/features/accounts/pages/reconcile/reconcile.page.ts`
  **Dependências**: Fase 7 completa
  **Critério de Conclusão**: Página criada e funcional

#### Implementar Estilos [⏳]

**Descrição**: Estilos responsivos
**Arquivo**: `src/app/features/accounts/pages/reconcile/reconcile.page.scss`
**Dependências**: Página criada
**Critério de Conclusão**: Estilos aplicados

#### Adicionar Rota [⏳]

**Descrição**: Adicionar rota `/accounts/:id/reconcile` com lazy loading
**Arquivo**: `src/app/features/accounts/accounts.routes.ts`
**Dependências**: Página criada
**Critério de Conclusão**: Rota funcionando

#### Atualizar Navegação e Remover Modal [⏳]

**Descrição**: Atualizar links e remover componente modal antigo
**Dependências**: Rota criada
**Critério de Conclusão**: Navegação funcionando, modal removido

### 🧪 Critérios de Validação

- [ ] Página reconcilia conta corretamente
- [ ] Validação funcionando
- [ ] Navegação funcionando
- [ ] Responsividade validada

### 📝 Comentários da Fase

_[Observações sobre migração do reconcile-modal]_

---

## 📅 FASE 9: Validação Final e Limpeza [Status: ⏳]

### 🎯 Objetivo

Validar toda a implementação, garantir qualidade e fazer limpeza final.

### 📋 Tarefas

#### Testes de Integração [⏳]

**Descrição**:

- Testar todas as substituições de modais
- Testar todas as migrações de formulários
- Validar navegação entre páginas
- Verificar que nenhuma funcionalidade foi quebrada
  **Dependências**: Todas as fases anteriores
  **Critério de Conclusão**: Todos os testes de integração passando

#### Validação de Responsividade [⏳]

**Descrição**:

- Testar em mobile (0-575px)
- Testar em tablet (576-991px)
- Testar em desktop (992px+)
- Verificar touch targets em mobile
- Validar layouts em todas as resoluções
  **Dependências**: Todas as fases anteriores
  **Critério de Conclusão**: Responsividade validada em todas as resoluções

#### Validação de Acessibilidade Final [⏳]

**Descrição**:

- Revalidar WCAG 2.1 AA
- Testar com screen reader
- Validar keyboard navigation em todas as páginas
- Verificar contraste de cores
  **Dependências**: Todas as fases anteriores
  **Critério de Conclusão**: Acessibilidade validada e documentada

#### Limpeza de Código [⏳]

**Descrição**:

- Remover imports não utilizados
- Remover comentários temporários
- Verificar que nenhum componente antigo está sendo usado
- Validar que não há código morto
  **Dependências**: Todas as fases anteriores
  **Critério de Conclusão**: Código limpo e otimizado

#### Documentação [⏳]

**Descrição**:

- Atualizar README se necessário
- Documentar uso do ConfirmDialogService
- Adicionar exemplos de uso
  **Dependências**: Todas as fases anteriores
  **Critério de Conclusão**: Documentação atualizada

### 🧪 Critérios de Validação

- [ ] Todos os testes passando (unitários e integração)
- [ ] Responsividade validada em todas as resoluções
- [ ] Acessibilidade WCAG 2.1 AA validada
- [ ] Código limpo e otimizado
- [ ] Documentação atualizada
- [ ] Nenhum componente antigo em uso
- [ ] Nenhum import quebrado

### 📝 Comentários da Fase

_[Observações finais sobre validação e limpeza]_

---

## 🏁 Entrega Final

### Checklist de Conclusão

- [ ] Fase 1: Componente e Serviço Base ✅
- [ ] Fase 2: Testes e Acessibilidade ✅
- [ ] Fase 3: Substituição de Modais Duplicados ✅
- [ ] Fase 4: Migração - Envelope Form ✅
- [ ] Fase 5: Migração - Pay Bill Modal ✅
- [ ] Fase 6: Migração - Goal Amount Modal ✅
- [ ] Fase 7: Migração - Transfer Modal ✅
- [ ] Fase 8: Migração - Reconcile Modal ✅
- [ ] Fase 9: Validação Final e Limpeza ✅

### Critérios de Aceitação

- [ ] Componente `os-confirm-dialog` criado com variantes (danger, warning, info)
- [ ] Serviço `ConfirmDialogService` criado e funcionando
- [ ] 3 modais duplicados removidos e substituídos
- [ ] Uso de `confirm()` nativo removido
- [ ] 5 formulários migrados para páginas
- [ ] Rotas configuradas corretamente
- [ ] Navegação funcionando (voltar, histórico)
- [ ] Todos os testes passando
- [ ] Acessibilidade validada (WCAG 2.1 AA)
- [ ] Responsividade validada (mobile, tablet, desktop)
- [ ] Código limpo e documentado

### Próximos Passos

Após conclusão:

1. **Revisão** (`/pre-pr`) - Validações antes do PR
2. **Pull Request** (`/pr`) - Finalização e submissão

---

## 📊 Progresso Geral

**Fases Completas**: 0/9
**Tarefas Completas**: 0/45
**Status Geral**: ⏳ Não Iniciado

---

## 🔗 Referências

- **Context**: `sessions/OS-238/context.md`
- **Architecture**: `sessions/OS-238/architecture.md`
- **Layout Specification**: `sessions/OS-238/layout-specification.md`
- **Issue Jira**: [OS-238](https://orca-sonhos.atlassian.net/browse/OS-238)
