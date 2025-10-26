# OS-224 - Plano de Implementação

> **Instruções**: Mantenha este arquivo atualizado conforme o progresso. Marque tarefas como concluídas ✅, em progresso ⏰ ou não iniciadas ⏳.

## 📋 Resumo Executivo

Migrar usos diretos de `<mat-icon>` para `os-icon` nos componentes mapeados (`os-input`, `os-money-input`, `os-date-input`), preservando responsividade, acessibilidade e paridade visual, com exceção controlada do `matDatepickerToggleIcon` se necessário.

## 🎯 Objetivos

- Padronizar ícones com `os-icon` em formulários/inputs
- Manter UX/A11y e responsividade intactas

---

## 📅 FASE 1: Migração no `os-input` [Status: ✅]

### 🎯 Objetivo

Substituir ícones de prefixo, sufixo e botão clear para usar `os-icon`.

### 📋 Tarefas

#### Migrar prefix/suffix para `os-icon` [✅]

**Descrição**: Trocar `<mat-icon matPrefix|matSuffix>` por `<os-icon>` mantendo classes.
**Critério de Conclusão**: Renderização idêntica e testes passando.

#### Migrar botão clear para `os-icon` [✅]

**Descrição**: Trocar `<mat-icon>close</mat-icon>` por `<os-icon name="close">` dentro do `mat-icon-button`.
**Critério de Conclusão**: Acessibilidade preservada (`aria-label`), função clear ok.

#### Ajustar imports (se possível) [✅]

**Descrição**: Remover `MatIconModule` se não houver mais uso direto.
**Critério de Conclusão**: Build sem quebras.

### 🧪 Critérios de Validação

- [x] Ícones renderizando corretamente (prefix/suffix/clear)
- [x] Sem regressão visual ou funcional
- [x] Tests do componente passando

### 📝 Comentários da Fase

- **Migração concluída**: Todos os usos de `<mat-icon>` foram substituídos por `<os-icon>` no `os-input`
- **Testes atualizados**: Ajustados para usar nomes de ícones ao invés de emojis diretos
- **Ícones adicionados**: Adicionado suporte ao ícone `eye` no `os-icon`
- **Funcionalidade preservada**: Prefix, suffix e clear button funcionando corretamente
- **Acessibilidade mantida**: `aria-label` do botão clear preservado

---

## 📅 FASE 2: Migração no `os-money-input` [Status: ✅]

### 🎯 Objetivo

Substituir ícone de moeda `attach_money` para `os-icon` com `matPrefix`.

### 📋 Tarefas

#### Migrar ícone de moeda [✅]

**Descrição**: Trocar `<mat-icon matPrefix>attach_money</mat-icon>` por `<os-icon name="attach_money" matPrefix>`.
**Critério de Conclusão**: Paridade visual, alinhamento e acessibilidade.

#### Ajustar imports (se possível) [✅]

**Descrição**: Remover `MatIconModule` se não houver mais uso direto.
**Critério de Conclusão**: Build ok.

### 🧪 Critérios de Validação

- [x] Ícone de moeda idêntico e bem alinhado
- [x] Sem regressão de layout
- [x] Tests do componente passando

### 📝 Comentários da Fase

- **Migração concluída**: Ícone `attach_money` migrado para `os-icon` com `matPrefix`
- **Ícone adicionado**: Suporte ao ícone `attach_money` adicionado ao `os-icon`
- **Teste atualizado**: Ajustado para verificar emoji "💰" ao invés de texto "attach_money"
- **Funcionalidade preservada**: Ícone de moeda renderizando corretamente
- **Todos os testes passando**: 41 testes executados com sucesso

---

## 📅 FASE 3: Migração no `os-date-input` [Status: ✅]

### 🎯 Objetivo

Substituir prefix/suffix por `os-icon` e avaliar o `matDatepickerToggleIcon`.

### 📋 Tarefas

#### Migrar prefix/suffix [✅]

**Descrição**: Trocar `<mat-icon matPrefix|matSuffix>` por `<os-icon>` mantendo classes.
**Critério de Conclusão**: Paridade visual e funcional.

#### Avaliar e decidir sobre `matDatepickerToggleIcon` [✅]

**Descrição**: Verificar se a diretiva aceita `os-icon`. Se não, manter exceção documentada.
**Critério de Conclusão**: Toggle funciona e está documentado.

#### Ajustar imports (se possível) [✅]

**Descrição**: Remover `MatIconModule` se não houver mais uso direto.
**Critério de Conclusão**: Build ok.

### 🧪 Critérios de Validação

- [x] Prefix/suffix com `os-icon` sem regressões
- [x] Toggle do datepicker funcional e acessível
- [x] Tests do componente passando

### 📝 Comentários da Fase

- **Migração concluída**: Prefix e suffix migrados para `os-icon` com sucesso
- **Toggle avaliado**: `matDatepickerToggleIcon` funciona perfeitamente com `os-icon`
- **Ícones adicionados**: Suporte ao ícone `calendar_today` adicionado ao `os-icon`
- **Testes atualizados**: Ajustados para usar `os-icon` ao invés de `mat-icon`
- **Funcionalidade preservada**: Datepicker toggle funcionando corretamente
- **Todos os testes passando**: 38 testes executados com sucesso

---

## 📅 FASE 4: Testes e Documentação [Status: ✅]

### 🎯 Objetivo

Garantir qualidade, acessibilidade e atualização de documentos.

### 📋 Tarefas

#### Atualizar/Adicionar testes unitários [✅]

**Descrição**: Ajustar snapshots e validar a11y (aria-hidden, aria-label).
**Critério de Conclusão**: `ng test`/vitest passando.

#### Revisão visual e responsiva [✅]

**Descrição**: Verificar alinham. e touch targets em breakpoints principais.
**Critério de Conclusão**: Sem desalinhamentos.

#### Atualizar `architecture.md` se houver decisões finais [✅]

**Descrição**: Registrar exceções (toggle) e remoções de imports.
**Critério de Conclusão**: Documento atualizado.

### 🏁 Entrega Final

- [x] Todos os testes passando
- [x] Documentação atualizada
- [x] Pronto para PR

### 📝 Comentários da Fase

- **Testes finais executados**: Todos os 132 testes passando (53 + 41 + 38)
- **Build validado**: Build funcionando sem erros
- **Documentação atualizada**: `architecture.md` atualizado com decisões finais
- **Imports otimizados**: `MatIconModule` removido de todos os componentes migrados
- **Ícones expandidos**: 3 novos ícones adicionados ao `os-icon` (`eye`, `attach_money`, `calendar_today`)
- **Funcionalidade preservada**: Todos os componentes funcionando corretamente
- **Acessibilidade mantida**: `aria-label` e `aria-hidden` preservados
- **Responsividade validada**: Touch targets e alinhamento mantidos

---

## 📅 FASE 5: Atualização do Storybook [Status: ✅]

### 🎯 Objetivo

Atualizar o storybook story do `os-icon` para refletir as melhorias e novos ícones adicionados na migração.

### 📋 Tarefas

#### Atualizar descrição do componente [✅]

**Descrição**: Corrigir descrição para mencionar Material Icons ao invés de Font Awesome.
**Critério de Conclusão**: Descrição precisa e atualizada.

#### Adicionar nova story FormIcons [✅]

**Descrição**: Criar story específica para demonstrar ícones de formulário incluindo os novos ícones (`eye`, `attach_money`, `calendar_today`).
**Critério de Conclusão**: Story funcional com documentação adequada.

#### Atualizar story CommonIcons [✅]

**Descrição**: Incluir os novos ícones adicionados na migração OS-224 na demonstração de ícones comuns.
**Critério de Conclusão**: Todos os novos ícones representados.

### 🧪 Critérios de Validação

- [x] Storybook stories funcionando corretamente
- [x] Novos ícones visíveis nas stories
- [x] Documentação atualizada
- [x] Todos os testes passando (2153 testes)

### 📝 Comentários da Fase

- **Descrição corrigida**: Atualizada para mencionar Material Icons corretamente
- **Nova story FormIcons**: Criada para demonstrar ícones específicos de formulário
- **CommonIcons atualizada**: Incluídos os novos ícones `eye`, `attach_money`, `calendar_today`, `close`
- **Documentação melhorada**: Descrições mais precisas e informativas
- **Testes validados**: Todos os 2153 testes passando sem regressões
- **Storybook funcional**: Stories renderizando corretamente com os novos ícones
