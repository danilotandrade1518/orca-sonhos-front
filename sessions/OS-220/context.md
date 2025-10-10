# Core Services e Autenticação - Contexto de Desenvolvimento

# OS-220

## 🎯 Objetivo

Implementar a infraestrutura essencial de serviços HTTP, autenticação e interceptors para estabelecer a base de comunicação com o backend e gerenciamento de estado de autenticação. Esta funcionalidade é crítica pois todas as próximas camadas da aplicação dependem desta implementação.

## 📋 Requisitos Funcionais

### Funcionalidades Principais

- **ApiService**: Serviço HTTP centralizado com HttpClient para comunicação com backend
- **AuthService**: Gerenciamento de autenticação com Firebase Auth (login, logout, estado)
- **AuthInterceptor**: Adiciona automaticamente tokens JWT nas requisições
- **ErrorInterceptor**: Tratamento centralizado de erros HTTP com notificações
- **AuthGuard**: Proteção de rotas baseada em estado de autenticação
- **ConfigService**: Gerenciamento de configurações de ambiente
- **MSW Setup**: Mocks completos para 30+ endpoints do backend

### Comportamentos Esperados

- **Autenticação automática**: Tokens adicionados automaticamente nas requisições
- **Tratamento de erros**: Notificações visuais usando os-alert para diferentes tipos de erro
- **Estados de loading**: Indicadores visuais usando os-spinner durante requisições
- **Proteção de rotas**: Redirecionamento automático para login quando não autenticado
- **Mocks funcionais**: Desenvolvimento independente com dados realistas
- **Cobertura de testes**: 80%+ de cobertura com testes unitários e de integração

### Endpoints Mapeados (30+)

**Queries (GET)**:

- `/budgets` - Lista orçamentos
- `/budget/{id}/overview` - Resumo do orçamento
- `/me` - Dados do usuário
- `/accounts` - Lista contas
- `/transactions` - Lista transações (com filtros/paginação)
- `/envelopes` - Lista envelopes
- `/goals` - Lista metas
- `/categories` - Lista categorias
- `/health`, `/ready` - Health checks

**Mutations (POST)**:

- Budgets: create, update, delete, add/remove participant
- Accounts: create, update, delete, reconcile, transfer
- Envelopes: create, update, delete, add/remove amount, transfer
- Goals: create, update, delete, add amount
- Credit Cards: create, update, delete
- Credit Card Bills: create, update, delete, pay, reopen
- Transactions: create, update, delete, cancel, mark late

### Integração com Design System

- **os-spinner**: Estados de loading em requisições HTTP
- **os-alert**: Notificações de erro, sucesso, warning e info
- **os-button**: Estados de loading em botões durante ações
- **Responsividade**: Todos os componentes seguem mobile-first

## 🏗️ Considerações Técnicas

### Arquitetura

- **Standalone Services**: Usar `inject()` function e `providedIn: 'root'`
- **Signals**: Estado reativo com `signal()` e `computed()`
- **OnPush Strategy**: Otimização de performance em todos os componentes
- **TypeScript Strict**: Tipagem rigorosa sem uso de `any`
- **Angular Moderno**: Control flow nativo, standalone components

### Tecnologias e Dependências

- **Firebase**: `@angular/fire` para autenticação
- **MSW**: `msw` para mocks de API
- **Angular Material**: Já instalado para base dos componentes
- **HttpClient**: Angular nativo para requisições HTTP

### Padrões a Seguir

- Convenções do projeto mantidas
- Design System Orca Sonhos
- Angular Best Practices (standalone, signals, OnPush)
- TypeScript strict mode

## 🧪 Estratégia de Testes

### Testes Necessários

- **Testes Unitários**: Todos os serviços, interceptors e guards
- **Testes de Integração**: Fluxo completo de autenticação e requisições
- **Mocks**: Dados realistas para desenvolvimento

### Critérios de Aceitação

- [ ] **ApiService** faz requisições HTTP corretamente
- [ ] **AuthInterceptor** adiciona tokens automaticamente
- [ ] **ErrorInterceptor** trata erros adequadamente
- [ ] **AuthService** gerencia estado de autenticação
- [ ] **AuthGuard** protege rotas corretamente
- [ ] **MSW** funciona em desenvolvimento
- [ ] **Cobertura de testes** > 80%
- [ ] **Integração** com Design System funcionando
- [ ] **Performance** otimizada com OnPush

## 🔗 Dependências e Impactos

### Sistemas Afetados

- **Core Module**: Nova estrutura de serviços e interceptors
- **App Config**: Configuração de providers
- **Routes**: Proteção com AuthGuard
- **Design System**: Integração com os-alert e os-spinner

### Integrações Necessárias

- **Firebase Auth**: Autenticação de usuários
- **Backend API**: 30+ endpoints mapeados
- **MSW**: Mocks para desenvolvimento
- **Design System**: Componentes de UI

## 🚧 Restrições e Considerações

### Limitações Técnicas

- Dependência do Firebase para autenticação
- Necessidade de configuração de ambiente
- MSW apenas para desenvolvimento

### Riscos

- **Token expirado**: Implementar refresh automático
- **Erro de rede**: Tratamento adequado de timeouts
- **Performance**: Otimização com OnPush e signals

## 📚 Referências

- Issue/Card: OS-220 - Card 3: Core Services e Autenticação
- Especificação: Jira - Orca Sonhos
- Arquitetura: Meta Specs do projeto
- Design System: Componentes já implementados
