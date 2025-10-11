# Dashboard Básico com Seleção de Orçamento - Contexto de Desenvolvimento

# OS-221

## 🎯 Objetivo

Implementar um dashboard básico com funcionalidade de seleção de orçamento, criando a primeira interface visual completa do OrçaSonhos. Esta funcionalidade estabelece o layout principal da aplicação e demonstra as capacidades da ferramenta através de widgets reativos e navegação intuitiva.

## 📋 Requisitos Funcionais

### Funcionalidades Principais

- **Layout Principal**: Header, sidebar e footer usando Design System existente
- **Seletor de Orçamento**: Dropdown simples na AppBar com nome do orçamento e ação "Criar Novo"
- **Dashboard Reativo**: Atualização automática dos widgets ao trocar orçamento
- **Widgets de Métricas**: Resumo básico do orçamento selecionado
- **Ações Rápidas**: Botões para criar orçamento, meta, transação
- **Navegação**: Sistema completo entre seções com sidebar
- **Dados Mockados**: Cenário completo com 1 orçamento e dados realistas usando MSW existente

### Comportamentos Esperados

- **Seleção de Orçamento**: Dropdown na AppBar permite alternar entre orçamentos disponíveis
- **Reatividade**: Todos os widgets atualizam automaticamente ao trocar orçamento
- **Responsividade**: Layout adapta-se a diferentes tamanhos de tela, especialmente mobile
- **Navegação**: Sidebar funcional para navegar entre seções da aplicação
- **Loading States**: Indicadores de carregamento durante mudanças de orçamento
- **Breadcrumbs**: Navegação contextual na página atual

## 🏗️ Considerações Técnicas

### Arquitetura

- **Angular Signals**: Estado reativo para orçamento selecionado e dados do dashboard
- **Feature-Based**: Implementação na feature `dashboard` existente
- **Design System**: Utilização dos componentes `os-*` já implementados
- **Template Reutilizável**: Uso do `OsDashboardTemplateComponent` existente

### Tecnologias e Dependências

- **Angular Signals**: Gerenciamento de estado reativo
- **MSW**: Dados mockados usando handlers existentes
- **Design System**: Componentes `os-*` para UI
- **Angular Material**: Base para componentes de seleção
- **SCSS**: Estilização responsiva

### Padrões a Seguir

- Convenções do projeto OrçaSonhos mantidas
- Feature-Based Architecture
- DTO-First com dados mockados
- Mobile-first responsivo
- OnPush change detection

## 🧪 Estratégia de Testes

### Testes Necessários

- **Testes Unitários**: Componentes de dashboard e seletor de orçamento
- **Testes de Integração**: Fluxo completo de seleção de orçamento
- **Testes de Responsividade**: Layout em diferentes breakpoints
- **Testes de Estado**: Reatividade dos widgets com Angular Signals

### Critérios de Aceitação

- [ ] Seletor de orçamento na AppBar funcional
- [ ] Dashboard reativo à mudança de orçamento
- [ ] Widgets exibem dados do orçamento selecionado
- [ ] Ações rápidas funcionais
- [ ] Navegação entre seções operacional
- [ ] Layout responsivo em mobile
- [ ] Loading states implementados
- [ ] Breadcrumbs funcionais
- [ ] Dados mockados realistas exibidos

## 🔗 Dependências e Impactos

### Sistemas Afetados

- **Feature Dashboard**: Implementação principal da funcionalidade
- **Design System**: Utilização de componentes existentes
- **MSW Handlers**: Uso dos handlers de budget existentes
- **App Layout**: Integração com layout principal da aplicação

### Integrações Necessárias

- **MSW**: Handlers existentes para dados de orçamento
- **Design System**: Componentes `os-*` para UI
- **Angular Router**: Navegação entre seções
- **Estado Global**: Serviço para orçamento selecionado

## 🚧 Restrições e Considerações

### Limitações Técnicas

- Dependência dos componentes do Design System existentes
- Necessidade de dados mockados realistas
- Responsividade deve funcionar em mobile

### Riscos

- **Performance**: Múltiplos widgets reativos podem impactar performance
- **Estado**: Sincronização entre seletor e widgets
- **Responsividade**: Complexidade do layout em diferentes telas

## 📚 Referências

- Issue/Card: OS-221 - Dashboard Básico com Seleção de Orçamento
- Especificação: Jira - Orça Sonhos
- Arquitetura: Meta Specs do projeto
- Design System: Componentes já implementados
