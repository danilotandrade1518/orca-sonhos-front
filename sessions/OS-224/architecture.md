# OS-224 - Arquitetura Técnica

## 🏗️ Visão Geral da Implementação

### Estado Atual

- Alguns componentes utilizam `<mat-icon>` diretamente em templates.
- `OsIconComponent` existe e renderiza via Material Icons, mas há uso direto fora dele.

### Mudanças Propostas

- Substituir usos diretos de `<mat-icon>` por `os-icon`, exceto quando a diretiva exigir elemento específico (ex.: `matDatepickerToggleIcon`).
- Ajustar imports: reduzir dependências diretas de `MatIconModule` em componentes que passarem a usar apenas `os-icon`.

### Impactos

- Componentes de entrada e formulários podem ter ajustes de classes e alinhamento.

## 🎨 UI Components and Layout

### Design System Integration

- Reutilização de `os-icon` como fachada única para ícones.
- Ajustes locais em `os-input`, `os-money-input`, `os-date-input` conforme `layout-specification.md`.

### New Components Required

- Nenhum novo componente. Apenas migração de marcação para `os-icon`.

### Layout Architecture

- Impacto limitado a templates de form fields; não altera fluxo de dados.
- Exceção: `matDatepickerToggleIcon` pode permanecer com `<mat-icon>` caso a diretiva não aceite `os-icon`.

### Performance Considerations

- Possível remoção de `MatIconModule` em componentes que passarem a depender apenas de `os-icon`.
- Centralização favorece tree-shaking.

> Detalhes completos em: `sessions/OS-224/layout-specification.md`

## 🔧 Componentes e Estrutura

### Arquivos Principais a Modificar

- `src/app/shared/ui-components/atoms/os-input/os-input.component.ts`: migrar prefix/suffix e botão clear para `os-icon`.
- `src/app/shared/ui-components/atoms/os-money-input/os-money-input.component.ts`: migrar ícone `attach_money` para `os-icon` com `matPrefix`.
- `src/app/shared/ui-components/atoms/os-date-input/os-date-input.component.ts`: migrar prefix/suffix para `os-icon`. Avaliar `matDatepickerToggleIcon`.

### Novos Arquivos a Criar

- N/A

### Estrutura de Diretórios

- Sem mudanças.

## 🏛️ Padrões Arquiteturais

### Decisões

- **Usar `os-icon` como única fachada de ícones**: evita dispersão e facilita manutenção.
- **Exceção controlada**: manter `<mat-icon matDatepickerToggleIcon>` se `os-icon` não suportar a diretiva.

## 📦 Dependências e Integrações

### Dependências Existentes

- Angular Material (Icon, FormField, Button, Datepicker).

### Novas Dependências

- Nenhuma.

## 🔄 Fluxo de Dados

- Sem mudanças de dados; apenas camada de apresentação.

## 🧪 Considerações de Teste

### Testes Unitários

- Atualizar snapshots/expectativas de renderização nos specs existentes.

### Testes de Integração

- Verificar funcionamento do botão clear e toggles de datepicker.

## ⚖️ Trade-offs e Riscos

- Possível diferença mínima de sizing entre `<mat-icon>` e `os-icon`; revisar SCSS de `os-icon` se necessário.

## 📋 Lista de Implementação

- [ ] Migrar ícones em `os-input.component.ts` para `os-icon`.
- [ ] Migrar ícone em `os-money-input.component.ts` para `os-icon`.
- [ ] Migrar ícones em `os-date-input.component.ts` para `os-icon` e avaliar `matDatepickerToggleIcon`.
- [ ] Atualizar imports removendo `MatIconModule` quando possível.
- [ ] Rodar testes e ajustar expectativas.

## 📚 Referências

- Meta Specs: `meta_specs_path` em `ai.properties.md`.
- Documentação: Angular Material Icon, Datepicker.
- Exemplos: `OsIconComponent` em `src/app/shared/ui-components/atoms/os-icon/os-icon.component.ts`.
