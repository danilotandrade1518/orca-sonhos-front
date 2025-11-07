# Relatórios Financeiros Simples - MVP - Contexto de Desenvolvimento

# OS-232

## 🎯 Objetivo

Implementar uma feature de relatórios financeiros simples que permita aos usuários visualizar análises básicas dos seus orçamentos, transações e gastos por categoria. Esta feature deve fornecer insights visuais essenciais para tomada de decisão financeira, mantendo simplicidade e foco no MVP.

**Escopo MVP (simples):**

- Relatórios básicos de gastos por categoria
- Visualizações gráficas simples (gráfico de pizza, barras)
- Filtros básicos de período (mês atual, mês anterior, últimos 3 meses)
- Visualização de receitas vs despesas
- Integração com dados existentes (transações, orçamentos, categorias)

**Fora do escopo MVP (pós-MVP):**

- Exportação de dados (PDF/Excel)
- Relatórios personalizáveis avançados
- Gráficos de tendências complexos
- Análises preditivas
- Comparações entre períodos múltiplos

## 📋 Requisitos Funcionais

### Funcionalidades Principais

- **Página de Relatórios**: Nova rota `/reports` acessível pelo menu principal
- **Gráfico de Gastos por Categoria**: Visualização em gráfico de pizza ou barras mostrando distribuição de gastos
- **Gráfico de Receitas vs Despesas**: Comparação visual entre receitas e despesas no período selecionado
- **Filtros de Período**: Seleção de período (mês atual, mês anterior, últimos 3 meses)
- **Filtro por Orçamento**: Quando usuário tem múltiplos orçamentos, permitir filtrar por orçamento específico
- **Resumo Numérico**: Valores totais e percentuais para cada categoria

### Comportamentos Esperados

- **Performance**: Cálculos eficientes mesmo com volume moderado de transações
- **Responsividade**: Interface adaptável para mobile e desktop
- **Acessibilidade**: Conformidade com WCAG 2.1 AA (ARIA labels, navegação por teclado)
- **Loading States**: Feedback visual durante carregamento de dados
- **Empty States**: Mensagens apropriadas quando não há dados para exibir
- **Integração**: Utiliza dados já disponíveis no sistema (transações, orçamentos, categorias)

## 🏗️ Considerações Técnicas

### Arquitetura

- **Feature-Based Architecture**: Seguir padrão das outras features (budget, transactions, goals)
- **DTO-First Architecture**: Usar DTOs para transferência de dados entre camadas
- **Angular Signals**: Usar signals para estado reativo
- **Standalone Components**: Todos os componentes devem ser standalone
- **Lazy Loading**: Feature deve ser carregada sob demanda

### Tecnologias e Dependências

**Biblioteca de Gráficos (A DEFINIR):**

- Necessário escolher entre: ngx-charts, ng2-charts, ng-apexcharts, ou ag-charts-angular
- Critérios de escolha:
  - Compatibilidade com Angular 20+
  - Suporte a gráficos de pizza e barras
  - Performance adequada
  - Bundle size razoável
  - Facilidade de customização
  - Suporte a acessibilidade
  - Documentação e comunidade ativa

**Dependências Existentes:**

- Angular Material (já instalado)
- Angular Signals (já disponível)
- Services existentes: TransactionService, BudgetService, CategoryService

### Padrões a Seguir

- **Padrão de Features**: Seguir estrutura de `src/app/features/[feature-name]/`
  - `components/`: Componentes específicos da feature
  - `pages/`: Páginas da feature
  - `services/`: Serviços específicos da feature
  - `state/`: Gerenciamento de estado com signals
  - `[feature].routes.ts`: Rotas da feature
- **Padrão de Componentes**: Usar `input()`, `output()`, `computed()`, `signal()`
- **Padrão de Serviços**: Usar `inject()` ao invés de constructor injection
- **Padrão de Testes**: Testes unitários com vitest, cobertura > 80%

## 🧪 Estratégia de Testes

### Testes Necessários

- **Testes Unitários**: Componentes, serviços, computed properties
- **Testes de Integração**: Integração com TransactionService, BudgetService
- **Testes de Acessibilidade**: Validação de ARIA attributes e navegação por teclado
- **Testes de Performance**: Validação de cálculos com volume moderado de dados

### Critérios de Aceitação

- [ ] Usuário pode acessar página de relatórios via rota `/reports`
- [ ] Exibe relatório de gastos por categoria com valores e percentuais
- [ ] Visualiza distribuição de gastos em gráfico de pizza ou barras
- [ ] Filtra relatórios por período (mês atual, mês anterior, últimos 3 meses)
- [ ] Mostra resumo de receitas vs despesas no período selecionado
- [ ] Permite filtrar por orçamento específico (quando usuário tem múltiplos)
- [ ] Interface responsiva e acessível
- [ ] Dados são calculados a partir das transações existentes
- [ ] Performance adequada mesmo com volume moderado de transações
- [ ] Testes unitários com cobertura > 80%

## 🔗 Dependências e Impactos

### Sistemas Afetados

- **Roteamento**: Adicionar rota `/reports` em `app.routes.ts`
- **Menu Principal**: Adicionar item de menu para "Relatórios"
- **TransactionService**: Utilizar para buscar transações filtradas por período
- **BudgetService**: Utilizar para buscar orçamentos e categorias
- **Design System**: Reutilizar componentes existentes (cards, badges, etc.)

### Integrações Necessárias

- **APIs Existentes**:
  - Endpoint de transações (já existe)
  - Endpoint de orçamentos (já existe)
  - Endpoint de categorias (já existe)
- **Biblioteca de Gráficos**: Nova dependência a ser instalada

## 🚧 Restrições e Considerações

### Limitações Técnicas

- **Performance**: Cálculos devem ser eficientes mesmo com volume moderado de transações
- **Bundle Size**: Biblioteca de gráficos não deve aumentar significativamente o bundle
- **SSR**: Considerar compatibilidade com Server-Side Rendering (se aplicável)

### Riscos

- **Escolha de Biblioteca**: Escolha inadequada pode impactar performance ou bundle size
- **Complexidade de Cálculos**: Cálculos de agregação podem ser custosos com muitos dados
- **Acessibilidade**: Garantir que gráficos sejam acessíveis pode ser desafiador

### Mitigações

- **Análise Comparativa**: Realizar análise detalhada das bibliotecas antes de escolher
- **Otimização**: Considerar cache de resultados quando apropriado
- **Testes de Performance**: Validar performance com dados reais antes de deploy
- **Acessibilidade**: Escolher biblioteca com bom suporte a ARIA ou implementar camada de acessibilidade

## 📚 Referências

- Issue/Card: [OS-232](https://orca-sonhos.atlassian.net/browse/OS-232)
- Projeto: Orça Sonhos
- Fase: Fase 3 - Features de Suporte
- Card Original: Card 13 do backlog-features-incremental.md
- Alinhamento: Segue escopo MVP conforme definido em mvp-scope.md
