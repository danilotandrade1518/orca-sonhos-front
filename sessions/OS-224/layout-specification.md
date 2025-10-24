# OS-224 - Layout Specification (Padronização de Ícones com `os-icon`)

## 🎯 Layout Overview

### Objetivo Visual

Unificar a linguagem visual de ícones usando `os-icon`, mantendo consistência com Material Design, garantindo legibilidade, alinhamento e estados visuais consistentes em formulários e inputs.

### Tipo de Layout

- Form Controls (Inputs e Date Inputs) – ajustes localizados em templates existentes

### Público-Alvo

- Universal (mobile-first)

### Persona Primária

- Ana (Organizadora Familiar) – precisa de clareza visual e consistência ao usar inputs em mobile

### Contexto de Uso

- Fluxos de formulário e entradas de dados (texto, moeda, data)

### Funcionalidades Core Relacionadas

- Sistema de Metas SMART, Múltiplos Orçamentos, Transações Temporalmente Flexíveis

### Considerações da Jornada do Usuário

- Primeiro uso e Engajamento Inicial: inputs simples, previsíveis e consistentes

## 📱 Responsive Strategy

### Breakpoints Definidos

- Mobile (0-575px): ícones alinhados verticalmente ao centro, touch targets ≥ 44px
- Tablet (576-991px): duas colunas possíveis, consistência de alinhamento
- Desktop (992px+): alinhamento fluido em `mat-form-field`

### Mobile-First Approach

- Garantir que ícones em `prefix`/`suffix` não reduzam o touch target do campo

### Touch Interactions

- Botão clear com `os-icon` preserva área de toque do `mat-icon-button`

## 🎨 Design System Integration

### Componentes Existentes (Reutilização)

- Atoms: `os-icon`, `os-input`, `os-date-input`, `os-money-input`, `os-button`
- Molecules: `os-form-field`

### Novos Componentes

- Não são necessários novos componentes; apenas migração de uso de ícones

## 🏗️ Layout Structure (alvos da migração)

- `os-input`: substituir `<mat-icon matPrefix>`/`matSuffix` e `<mat-icon>close</mat-icon>` por `os-icon`
- `os-money-input`: substituir `<mat-icon matPrefix>attach_money</mat-icon>` por `os-icon name="attach_money"`
- `os-date-input`: substituir prefix/suffix por `os-icon`; manter `matDatepickerToggleIcon` como exceção se a diretiva não suportar `os-icon`

## ♿ Accessibility Specifications

- Ícones decorativos com `aria-hidden="true"` quando aplicável via `os-icon` role="decorative"
- Botão clear com `aria-label` descritivo preservado
- Datepicker toggle mantém acessibilidade nativa do Angular Material

## 🎭 States and Interactions

- Hover/Focus/Active devem permanecer inalterados; `os-icon` herda classes atuais

## 📐 Visual Specifications

- Tamanho padrão dos ícones nos inputs: equivalente ao Material (md); ajustar via `size` do `os-icon` se necessário
- Espaçamento entre ícone e campo preservado pelas classes existentes

## 🔄 Architecture Impact

### Modificações

- `os-input`: trocar `<mat-icon>` por `<os-icon>` nos slots prefix, suffix e clear button
- `os-money-input`: trocar `<mat-icon matPrefix>` por `<os-icon name="attach_money" matPrefix>`
- `os-date-input`: trocar prefix/suffix por `<os-icon>`; avaliar viabilidade do toggle

### Dependências de UI

- Remover `MatIconModule` onde não for mais necessário (se `os-icon` for o único consumidor)

### Impacto em Performance

- Redução de importações diretas de `MatIconModule` em components; centralização via `os-icon`

## 🧪 Layout Validation Criteria

### Design System Compliance

- [ ] `os-icon` utilizado em todos os lugares mapeados (exceto toggle do datepicker, se necessário)

### Responsiveness

- [ ] Touch targets mantidos (≥ 44px) em mobile
- [ ] Sem desalinhamentos visuais pós-migração

### Accessibility

- [ ] Ícones decorativos com `aria-hidden="true"`
- [ ] Botão clear com `aria-label` correto

### Visual Quality

- [ ] Spacing e alinhamento consistentes no `mat-form-field`

## 📚 References

- `OsIconComponent` (`src/app/shared/ui-components/atoms/os-icon/os-icon.component.ts`)
- `os-input`, `os-money-input`, `os-date-input`
- Meta Specs: Responsive Design, Accessibility, UI System
