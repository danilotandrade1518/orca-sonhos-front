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

## 📅 FASE 3: Migração no `os-date-input` [Status: ⏳]

### 🎯 Objetivo

Substituir prefix/suffix por `os-icon` e avaliar o `matDatepickerToggleIcon`.

### 📋 Tarefas

#### Migrar prefix/suffix [⏳]

**Descrição**: Trocar `<mat-icon matPrefix|matSuffix>` por `<os-icon>` mantendo classes.
**Critério de Conclusão**: Paridade visual e funcional.

#### Avaliar e decidir sobre `matDatepickerToggleIcon` [⏳]

**Descrição**: Verificar se a diretiva aceita `os-icon`. Se não, manter exceção documentada.
**Critério de Conclusão**: Toggle funciona e está documentado.

#### Ajustar imports (se possível) [⏳]

**Descrição**: Remover `MatIconModule` se não houver mais uso direto.
**Critério de Conclusão**: Build ok.

### 🧪 Critérios de Validação

- [ ] Prefix/suffix com `os-icon` sem regressões
- [ ] Toggle do datepicker funcional e acessível
- [ ] Tests do componente passando

### 📝 Comentários da Fase

\_

---

## 📅 FASE 4: Testes e Documentação [Status: ⏳]

### 🎯 Objetivo

Garantir qualidade, acessibilidade e atualização de documentos.

### 📋 Tarefas

#### Atualizar/Adicionar testes unitários [⏳]

**Descrição**: Ajustar snapshots e validar a11y (aria-hidden, aria-label).
**Critério de Conclusão**: `ng test`/vitest passando.

#### Revisão visual e responsiva [⏳]

**Descrição**: Verificar alinham. e touch targets em breakpoints principais.
**Critério de Conclusão**: Sem desalinhamentos.

#### Atualizar `architecture.md` se houver decisões finais [⏳]

**Descrição**: Registrar exceções (toggle) e remoções de imports.
**Critério de Conclusão**: Documento atualizado.

### 🏁 Entrega Final

- [ ] Todos os testes passando
- [ ] Documentação atualizada
- [ ] Pronto para PR
