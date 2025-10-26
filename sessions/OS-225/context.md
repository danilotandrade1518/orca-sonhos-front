# Extrair header do Dashboard para  e criar layout global - Contexto de Desenvolvimento

# OS-225

## 🎯 Objetivo
Padronizar o layout da aplicação criando  (Material Design M3) e , aplicados via , removendo header e sidebar do  e permitindo ações contextuais e seletor de tema dark/light.

## 📋 Requisitos Funcionais

### Funcionalidades Principais
- : branding, slot de ações, menu para sidebar, variantes (small/center/medium/large), comportamentos de scroll, pesquisa/notificações/usuário, seletor dark/light.
- : itens padrão, variantes permanente/persistente/modal, rail colapsado, breakpoints, persistência de colapso.
- : orquestra app bar + sidebar + router-outlet, slot de ações contextuais.
- Rotas: aplicar layout às features; remover header/sidebar do Dashboard.

### Comportamentos Esperados
- App bar controla abertura/colapso do sidebar; responsivo em todos os breakpoints.
- Tema alternável com persistência e respeito a prefers-color-scheme.
- Acessibilidade: roles/ARIA mínimos, foco visível, teclado.

## 🏗️ Considerações Técnicas

### Arquitetura
- Angular 20+ standalone, sinais, OnPush; Clean Architecture preservada.
- App bar e sidebar desacoplados de features; comunicação via inputs/outputs.

### Tecnologias e Dependências
- Tokens/tema atuais; localStorage para preferências.

### Padrões a Seguir
- Material Design M3: Top App Bar, Navigation Drawer/Rail, Theming/Dark.
- Diretrizes do repositório (CLAUDE.md): standalone, signals, OnPush, NgOptimizedImage, etc.

## 🧪 Estratégia de Testes

### Testes Necessários
- Unidade e integração de componentes (render, variantes, eventos, responsividade básica).
- Acessibilidade mínima (roles/ARIA, foco, teclado).

### Critérios de Aceitação
- Conforme definidos na issue OS-225.

## 🔗 Dependências e Impactos

### Sistemas Afetados
- , rotas, tema global, Storybook.

### Integrações Necessárias
- Router para item ativo; localStorage.

## 🚧 Restrições e Considerações
- Não usar HostBinding/HostListener; usar host no decorator.
- Evitar dependências de features dentro do layout.

## 📚 Referências
- Issue: OS-225
- Material Design M3 docs
- CLAUDE.md
