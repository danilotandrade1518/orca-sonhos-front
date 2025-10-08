# Design System Base - Atomic Design até Templates - Contexto de Desenvolvimento

# OS-219

## 🎯 Objetivo

Implementar Design System completo do OrçaSonhos seguindo metodologia Atomic Design até o nível de Templates. Estabelecer identidade visual única com paleta azul dominante, sistema de componentes escalável e base sólida para desenvolvimento rápido de todas as features subsequentes.

## 📋 Requisitos Funcionais

### Funcionalidades Principais

- **ATOMS (Componentes Básicos)**: Button, Input, Icon, Badge, Avatar, Spinner, Label, Chip, Money Input, Date Input, Select, Checkbox, Radio, Toggle, Slider, Progress Bar
- **MOLECULES (Componentes Compostos)**: Form Field, Card, Search Box, Data Table, Filter Bar, Navigation Item, Money Display, Date Picker, Dropdown, Form Group, Alert, Tooltip
- **ORGANISMS (Componentes Complexos)**: Header, Sidebar, Footer, Data Grid, Form Section, Navigation, Modal, Page Header, Goal Progress, Budget Summary, Transaction List, Category Manager
- **TEMPLATES (Layouts)**: Dashboard Layout, Form Layout, List Layout, Detail Layout, Auth Layout, Onboarding Layout, Sidebar Template, AppBar Template
- **Sistema de Tema**: Paleta azul dominante com roxo secundário, design tokens, tema claro/escuro

### Comportamentos Esperados

- **Responsividade** em todos os componentes
- **Acessibilidade** WCAG 2.1 AA
- **Performance** otimizada com OnPush
- **Tema claro/escuro** funcional
- **Estados** (hover, focus, disabled, loading)
- **Integração** com Angular Material como base
- **Abstração** sobre Material para API própria do OrçaSonhos

## 🏗️ Considerações Técnicas

### Arquitetura

**Estado Atual Identificado:**

- Angular 20.2.0 com standalone components ✅
- Angular Material 20.2.3 instalado ✅
- Estrutura Feature-Based configurada ✅
- Tema Material básico configurado ✅
- Path aliases configurados (@app, @core, @shared, @features, @dtos) ✅

**Mudanças Necessárias:**

- Criar estrutura completa de Design System em `/src/app/shared/ui-components/`
- Implementar sistema de tema customizado com tokens
- Configurar componentes seguindo Atomic Design
- Estabelecer padrões de nomenclatura com prefixo 'os-'
- Integrar com estrutura Feature-Based existente

### Tecnologias e Dependências

- **Angular Material 20+**: Base para componentes
- **Angular CDK**: Funcionalidades avançadas
- **SCSS**: Estilização com variáveis CSS
- **TypeScript 5+**: Tipagem rigorosa
- **RxJS**: Reatividade
- **Standalone Components**: Arquitetura moderna

### Padrões a Seguir

- **Atomic Design**: Atoms → Molecules → Organisms → Templates
- **Standalone Components** com signals
- **Prefixo 'os-'** para todos os componentes
- **API consistente** com input/output signals
- **CSS BEM** para nomenclatura de classes
- **OnPush** change detection
- **Lazy loading** para componentes pesados

## 🧪 Estratégia de Testes

### Testes Necessários

- **Testes Unitários**: Todos os componentes com Jest/Vitest
- **Testes de Integração**: Componentes compostos
- **Testes de Acessibilidade**: Validação WCAG 2.1 AA
- **Testes de Performance**: Bundle size e renderização
- **Storybook**: Documentação interativa

### Critérios de Aceitação

- [ ] Angular Material e CDK configurados
- [ ] Tema base com tokens de design implementado
- [ ] Sistema de cores azul dominante aplicado
- [ ] Tipografia Roboto configurada
- [ ] Responsividade em todos os níveis
- [ ] 15+ ATOMS implementados com 4 variantes cada
- [ ] 12+ MOLECULES implementados
- [ ] 12+ ORGANISMS implementados
- [ ] 8+ TEMPLATES implementados
- [ ] Testes unitários para todos os componentes
- [ ] Documentação completa do Design System
- [ ] Acessibilidade validada
- [ ] Performance otimizada
- [ ] Bundle size < 50KB para componentes base

## 🔗 Dependências e Impactos

### Sistemas Afetados

- **Dashboard**: Migração para novos componentes
- **Formulários**: Padronização com Form Field
- **Navegação**: Implementação de Sidebar/AppBar
- **Tabelas**: Migração para Data Grid
- **Todas as features**: Base para desenvolvimento futuro

### Integrações Necessárias

- **Angular Material**: Camada de abstração
- **Sistema de Roteamento**: Integração com layouts
- **Sistema de Tema**: Integração com Angular Material
- **Feature-Based**: Integração com estrutura existente

## 🚧 Restrições e Considerações

### Limitações Técnicas

- **Compatibilidade** com Angular 20+
- **Acessibilidade** WCAG 2.1 AA obrigatória
- **Performance** < 100ms para interações
- **Bundle size** < 50KB para componentes base
- **Suporte** a navegadores modernos

### Riscos

- **Complexidade**: Muitos componentes para implementar
- **Performance**: Bundle size pode crescer
- **Manutenção**: Muitos componentes para manter
- **Migração**: Impacto em features existentes

**Mitigações:**

- Implementação incremental por nível (Atoms → Molecules → Organisms → Templates)
- Lazy loading para componentes pesados
- Tree shaking otimizado
- Testes abrangentes
- Documentação detalhada

## 📚 Referências

- Issue/Card: OS-219 - Design System Base - Atomic Design até Templates
- Especificação: Jira OS-219 (detalhada)
- Arquitetura: Estrutura Feature-Based existente
- Meta Specs: /home/danilo/workspace/projeto-orca-sonhos/orca-sonhos-meta-specs
- Angular Material: https://material.angular.dev/
- Atomic Design: https://bradfrost.com/blog/post/atomic-web-design/
