# OS-224 - Padronização de Ícones (migração para `os-icon`)

# OS-224

## 🎯 Objetivo

Padronizar o uso de ícones na aplicação migrando o consumo direto de `<mat-icon>` para o componente `os-icon`, garantindo consistência visual, manutenção simplificada e aderência ao design system.

## 📋 Requisitos Funcionais

### Funcionalidades Principais

- Substituir ícones usados diretamente por `os-icon` nos componentes existentes.
- Manter paridade visual com Material Icons e compatibilidade com temas claro/escuro.

### Comportamentos Esperados

- Ícones devem renderizar via `os-icon` com nomes válidos do Material Icons.
- Prefixos/sufixos (`matPrefix`, `matSuffix`) e integrações com Angular Material devem continuar funcionando.

## 🏗️ Considerações Técnicas

### Arquitetura

- Angular 20+ com componentes standalone e design system próprio.
- `OsIconComponent` centraliza a renderização de ícones com Angular Material.

### Tecnologias e Dependências

- Angular Material (MatIcon, FormField, Datepicker).
- `OsIconComponent` como fachada para ícones.

### Padrões a Seguir

- Seguir `CLAUDE.md` (standalone, signals, OnPush, bindings em `host`).
- Evitar uso direto de `<mat-icon>` fora do `os-icon`.

## 🧪 Estratégia de Testes

### Testes Necessários

- Testes de renderização dos componentes alterados (ícone visível, classes e posições corretas).
- Testes de acessibilidade (aria-label/aria-hidden quando aplicável).

### Critérios de Aceitação

- [ ] Todos os ícones diretos identificados foram migrados para `os-icon`.
- [ ] Sem regressão visual nas áreas afetadas.
- [ ] Funcionamento correto com `matPrefix`/`matSuffix` (quando aplicável).
- [ ] Documentação/arquitetura atualizada listando componentes afetados.

## 🔗 Dependências e Impactos

### Sistemas Afetados

- Componentes de formulário/entrada que utilizam ícones como prefixo/sufixo ou toggles.

### Integrações Necessárias

- Angular Material (icon e datepicker toggle).

## 🚧 Restrições e Considerações

### Limitações Técnicas

- `matDatepickerToggleIcon` exige um elemento com a diretiva; avaliar uso de `os-icon` diretamente com a diretiva ou manter exceção local se necessário.

### Riscos

- Pequenas regressões visuais em tamanhos/alinhamento; mitigar com validação visual rápida.

## 📚 Referências

- Issue/Card: OS-224 (Jira) – Padronizar os ícones da aplicação (Migração para Material Icons).
- Especificação: Descrição da task no Jira.
- Arquitetura: `sessions/OS-224/architecture.md`.
