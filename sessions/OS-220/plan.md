# Core Services e Autenticação - Plano de Implementação

> **Instruções**: Mantenha este arquivo atualizado conforme o progresso. Marque tarefas como concluídas ✅, em progresso ⏰ ou não iniciadas ⏳.

## 📋 Resumo Executivo

Implementação da infraestrutura essencial de serviços HTTP, autenticação Firebase e interceptors para estabelecer a base de comunicação com o backend. Esta funcionalidade é crítica pois todas as próximas camadas da aplicação dependem desta implementação.

**Status Atual**: Fases 1 e 2 completadas com sucesso. Fase 3 em progresso.

## 🎯 Objetivos da Implementação

- **ApiService**: Serviço HTTP centralizado com HttpClient para comunicação com backend
- **AuthService**: Gerenciamento de autenticação com Firebase Auth (login, logout, estado)
- **Interceptors**: AuthInterceptor e ErrorInterceptor para tratamento automático
- **AuthGuard**: Proteção de rotas (preparado para uso futuro)
- **MSW Setup**: Mocks completos para 30+ endpoints do backend
- **Integração**: Design System (os-alert, os-spinner) para UX

---

## 📅 FASE 1: Configuração Base e Dependências [Status: ✅ Completada]

### 🎯 Objetivo da Fase

Configurar o ambiente de desenvolvimento com todas as dependências necessárias e estrutura base dos serviços.

### 📋 Tarefas

#### Instalar Dependências [✅]

**Descrição**: Instalar @angular/fire, firebase e msw
**Arquivos**: `package.json`
**Comandos**:

```bash
npm install @angular/fire firebase
npm install -D msw
```

#### Configurar Firebase [✅]

**Descrição**: Configurar Firebase no app.config.ts
**Arquivos**: `src/app/app.config.ts`
**Dependências**: Dependência anterior
**Critério de Conclusão**: Firebase configurado e providers registrados

#### Configurar MSW [✅]

**Descrição**: Configurar Mock Service Worker para desenvolvimento
**Arquivos**:

- `src/app/core/mocks/browser.ts`
- `src/app/core/mocks/server.ts`
- `src/main.ts` (modificação)
  **Dependências**: Dependência anterior
  **Critério de Conclusão**: MSW funcionando em desenvolvimento

#### Criar Estrutura de Diretórios [✅]

**Descrição**: Criar estrutura completa de diretórios para serviços, interceptors e guards
**Arquivos**:

- `src/app/core/services/`
- `src/app/core/interceptors/`
- `src/app/core/guards/`
- `src/app/core/mocks/handlers/`
  **Critério de Conclusão**: Todos os diretórios criados e index.ts atualizados

### 🧪 Critérios de Validação

- [x] Dependências instaladas sem erros
- [x] Firebase configurado no app.config.ts
- [x] MSW funcionando em desenvolvimento
- [x] Estrutura de diretórios criada
- [x] Aplicação inicia sem erros

### 📝 Comentários da Fase

- **Decisão**: Interface Environment criada para tipagem consistente entre ambientes
- **Implementação**: Firebase configurado com providers no app.config.ts
- **MSW**: Configurado para desenvolvimento com handlers preparados
- **Estrutura**: Diretórios criados seguindo padrões do projeto
- **Build**: Aplicação compila perfeitamente após correções de TypeScript

---

## 📅 FASE 2: Serviços Core [Status: ✅ Completada]

### 🎯 Objetivo da Fase

Implementar os serviços fundamentais: ConfigService, AuthService e ApiService.

### 📋 Tarefas

#### Implementar ConfigService [✅]

**Descrição**: Serviço para gerenciar configurações de ambiente
**Arquivos**: `src/app/core/services/config.service.ts`
**Funcionalidades**:

- Gerenciar configurações de ambiente
- URLs de API
- Configurações do Firebase
- Flags de desenvolvimento

#### Implementar AuthService [✅]

**Descrição**: Serviço de autenticação com Firebase Auth
**Arquivos**: `src/app/core/services/auth.service.ts`
**Dependências**: ConfigService
**Funcionalidades**:

- Login/logout com Firebase
- Gerenciamento de estado com signals
- Token JWT
- Persistência de sessão

#### Implementar ApiService [✅]

**Descrição**: Serviço HTTP centralizado
**Arquivos**: `src/app/core/services/api.service.ts`
**Dependências**: ConfigService
**Funcionalidades**:

- Métodos HTTP (GET, POST, PUT, DELETE)
- Estados de loading com signals
- Integração com HttpClient
- Tratamento de URLs base

#### Atualizar Core Index [✅]

**Descrição**: Exportar todos os serviços no core/index.ts
**Arquivos**: `src/app/core/index.ts`
**Dependências**: Todos os serviços implementados
**Critério de Conclusão**: Todos os serviços exportados e importáveis

### 🔄 Dependências

- ✅ Fase 1 completada
- ConfigService deve ser implementado primeiro

### 📝 Comentários da Fase

- **ConfigService**: Implementado com signals para estado reativo, interface Environment para tipagem
- **AuthService**: Integração completa com Firebase Auth, gerenciamento de estado com signals
- **ApiService**: Serviço HTTP robusto com retry, timeout, tratamento de erros
- **Core Index**: Exports organizados para todos os serviços
- **Padrões**: Seguindo Angular moderno (standalone, signals, OnPush)
- **Build**: Todos os serviços compilam sem erros

---

## 📅 FASE 3: Interceptors e Guards [Status: ⏰ Em Progresso]

### 🎯 Objetivo da Fase

Implementar interceptors para autenticação e tratamento de erros, além do AuthGuard.

### 📋 Tarefas

#### Implementar AuthInterceptor [⏳]

**Descrição**: Adiciona automaticamente tokens JWT nas requisições
**Arquivos**: `src/app/core/interceptors/auth.interceptor.ts`
**Dependências**: AuthService
**Funcionalidades**:

- Interceptar requisições HTTP
- Adicionar Authorization header
- Tratar tokens expirados
- Integração com AuthService

#### Implementar ErrorInterceptor [⏳]

**Descrição**: Tratamento centralizado de erros HTTP
**Arquivos**: `src/app/core/interceptors/error.interceptor.ts`
**Dependências**: os-alert component
**Funcionalidades**:

- Interceptar respostas de erro
- Exibir notificações com os-alert
- Tratar diferentes tipos de erro (401, 403, 500, etc.)
- Log de erros para debugging

#### Implementar AuthGuard [⏳]

**Descrição**: Proteção de rotas baseada em autenticação
**Arquivos**: `src/app/core/guards/auth.guard.ts`
**Dependências**: AuthService
**Funcionalidades**:

- Verificar estado de autenticação
- Redirecionar para login se necessário
- Preparado para uso futuro (não aplicado às rotas ainda)

#### Configurar Interceptors no App Config [⏳]

**Descrição**: Registrar interceptors no app.config.ts
**Arquivos**: `src/app/app.config.ts`
**Dependências**: Todos os interceptors implementados
**Critério de Conclusão**: Interceptors funcionando globalmente

### 🔄 Dependências

- ✅ Fase 2 completada
- AuthService deve estar implementado

### 📝 Comentários da Fase

_[Observações sobre decisões tomadas]_

---

## 📅 FASE 4: MSW e Mocks [Status: ⏳]

### 🎯 Objetivo da Fase

Implementar mocks completos para todos os 30+ endpoints do backend usando MSW.

### 📋 Tarefas

#### Criar Handlers de Autenticação [⏳]

**Descrição**: Mocks para endpoints de autenticação
**Arquivos**: `src/app/core/mocks/handlers/auth.handlers.ts`
**Endpoints**:

- GET /me
- Health checks (/health, /ready)

#### Criar Handlers de Budgets [⏳]

**Descrição**: Mocks para endpoints de orçamentos
**Arquivos**: `src/app/core/mocks/handlers/budgets.handlers.ts`
**Endpoints**:

- GET /budgets
- GET /budget/:id/overview
- POST /budget/create-budget
- POST /budget/update-budget
- POST /budget/delete-budget
- POST /budget/add-participant
- POST /budget/remove-participant

#### Criar Handlers de Accounts [⏳]

**Descrição**: Mocks para endpoints de contas
**Arquivos**: `src/app/core/mocks/handlers/accounts.handlers.ts`
**Endpoints**:

- GET /accounts
- POST /account/create-account
- POST /account/update-account
- POST /account/delete-account
- POST /account/reconcile-account
- POST /account/transfer-between-accounts

#### Criar Handlers de Transactions [⏳]

**Descrição**: Mocks para endpoints de transações
**Arquivos**: `src/app/core/mocks/handlers/transactions.handlers.ts`
**Endpoints**:

- GET /transactions (com filtros e paginação)
- POST /transaction/create-transaction
- POST /transaction/update-transaction
- POST /transaction/delete-transaction
- POST /transaction/cancel-scheduled-transaction
- POST /transaction/mark-transaction-late

#### Criar Handlers de Goals [⏳]

**Descrição**: Mocks para endpoints de metas
**Arquivos**: `src/app/core/mocks/handlers/goals.handlers.ts`
**Endpoints**:

- GET /goals
- POST /goal/create-goal
- POST /goal/update-goal
- POST /goal/delete-goal
- POST /goal/add-amount-goal

#### Criar Handlers de Categories [⏳]

**Descrição**: Mocks para endpoints de categorias
**Arquivos**: `src/app/core/mocks/handlers/categories.handlers.ts`
**Endpoints**:

- GET /categories

#### Criar Handlers de Envelopes [⏳]

**Descrição**: Mocks para endpoints de envelopes
**Arquivos**: `src/app/core/mocks/handlers/envelopes.handlers.ts`
**Endpoints**:

- GET /envelopes
- POST /envelope/create-envelope
- POST /envelope/update-envelope
- POST /envelope/delete-envelope
- POST /envelope/add-amount-envelope
- POST /envelope/remove-amount-envelope
- POST /envelope/transfer-between-envelopes

#### Criar Handlers de Credit Cards [⏳]

**Descrição**: Mocks para endpoints de cartões de crédito
**Arquivos**: `src/app/core/mocks/handlers/credit-cards.handlers.ts`
**Endpoints**:

- POST /credit-card/create-credit-card
- POST /credit-card/update-credit-card
- POST /credit-card/delete-credit-card
- POST /credit-card-bill/create-credit-card-bill
- POST /credit-card-bill/update-credit-card-bill
- POST /credit-card-bill/delete-credit-card-bill
- POST /credit-card-bill/pay-credit-card-bill
- POST /credit-card-bill/reopen-credit-card-bill

#### Configurar MSW Handlers [⏳]

**Descrição**: Integrar todos os handlers no MSW
**Arquivos**:

- `src/app/core/mocks/browser.ts`
- `src/app/core/mocks/server.ts`
  **Dependências**: Todos os handlers criados
  **Critério de Conclusão**: MSW funcionando com todos os endpoints

### 🔄 Dependências

- ✅ Fase 3 completada
- Todos os handlers podem ser criados em paralelo

### 📝 Comentários da Fase

_[Observações sobre decisões tomadas]_

---

## 📅 FASE 5: Testes e Validação [Status: ⏳]

### 🎯 Objetivo da Fase

Implementar testes unitários e de integração para garantir qualidade e cobertura > 80%.

### 📋 Tarefas

#### Testes Unitários - Serviços [⏳]

**Descrição**: Testes para todos os serviços
**Arquivos**:

- `src/app/core/services/*.spec.ts`
  **Cobertura**: ConfigService, AuthService, ApiService
  **Critério de Conclusão**: Cobertura > 80% para serviços

#### Testes Unitários - Interceptors [⏳]

**Descrição**: Testes para interceptors
**Arquivos**:

- `src/app/core/interceptors/*.spec.ts`
  **Cobertura**: AuthInterceptor, ErrorInterceptor
  **Critério de Conclusão**: Cobertura > 80% para interceptors

#### Testes Unitários - Guards [⏳]

**Descrição**: Testes para guards
**Arquivos**:

- `src/app/core/guards/*.spec.ts`
  **Cobertura**: AuthGuard
  **Critério de Conclusão**: Cobertura > 80% para guards

#### Testes de Integração [⏳]

**Descrição**: Testes de fluxo completo
**Arquivos**:

- `src/app/core/integration/*.spec.ts`
  **Cobertura**: Fluxo de autenticação, requisições HTTP, tratamento de erros
  **Critério de Conclusão**: Todos os fluxos principais testados

#### Validação de MSW [⏳]

**Descrição**: Testar mocks funcionando corretamente
**Arquivos**:

- `src/app/core/mocks/*.spec.ts`
  **Cobertura**: Todos os handlers MSW
  **Critério de Conclusão**: Mocks retornando dados corretos

### 🔄 Dependências

- ✅ Fase 4 completada
- Todos os componentes implementados

### 📝 Comentários da Fase

_[Observações sobre decisões tomadas]_

---

## 📅 FASE 6: Integração e Documentação [Status: ⏳]

### 🎯 Objetivo da Fase

Finalizar integração, documentação e preparar para próximas fases.

### 📋 Tarefas

#### Integração com Design System [⏳]

**Descrição**: Garantir integração perfeita com os-alert e os-spinner
**Arquivos**:

- ErrorInterceptor (os-alert)
- ApiService (os-spinner)
  **Critério de Conclusão**: UX funcionando perfeitamente

#### Documentação de APIs [⏳]

**Descrição**: Documentar todos os serviços e métodos
**Arquivos**:

- Comentários JSDoc em todos os serviços
- README para uso dos serviços
  **Critério de Conclusão**: Documentação completa e clara

#### Validação Final [⏳]

**Descrição**: Teste completo de toda a funcionalidade
**Critério de Conclusão**:

- Todos os testes passando
- Cobertura > 80%
- MSW funcionando
- Integração com Design System
- Performance otimizada

#### Preparação para Próximas Fases [⏳]

**Descrição**: Preparar infraestrutura para registro de rotas futuras
**Arquivos**:

- AuthGuard pronto para uso
- Documentação de como usar
  **Critério de Conclusão**: Infraestrutura preparada

### 🏁 Entrega Final

- [ ] Todos os testes passando
- [ ] Cobertura > 80%
- [ ] MSW funcionando com 30+ endpoints
- [ ] Integração com Design System
- [ ] Documentação completa
- [ ] Performance otimizada
- [ ] Pronto para próximas fases

---

## 🔀 Estratégia de Desenvolvimento

### Ordem de Execução

1. **Sequencial**: Fases 1 → 2 → 3 → 4 → 5 → 6 (dependências claras)
2. **Paralelo**: Handlers MSW podem ser criados em paralelo na Fase 4

### Pontos de Validação

- **Após Fase 1**: Aplicação inicia sem erros
- **Após Fase 2**: Serviços funcionando individualmente
- **Após Fase 3**: Interceptors funcionando globalmente
- **Após Fase 4**: MSW funcionando com todos os endpoints
- **Após Fase 5**: Cobertura de testes > 80%
- **Final**: Funcionalidade completa e integrada

### Contingências

- **Se Firebase falhar**: Usar mock de autenticação temporário
- **Se MSW falhar**: Implementar fallback para desenvolvimento
- **Se testes falharem**: Focar em cobertura crítica primeiro

## 🧪 Estratégia de Testes

### Testes por Fase

- **Fase 2**: Testes unitários para serviços
- **Fase 3**: Testes unitários para interceptors e guards
- **Fase 4**: Testes de integração para MSW
- **Fase 5**: Testes de integração completos
- **Fase 6**: Testes end-to-end

### Dados de Teste

- **MSW Handlers**: Dados realistas para todos os endpoints
- **Firebase Auth**: Mock para desenvolvimento
- **HttpClient**: Interceptação com MSW

## 📚 Referências e Pesquisas

### Documentação Consultada

- **AngularFire**: Documentação oficial para autenticação Firebase
- **MSW**: Documentação oficial para Mock Service Worker
- **Angular HttpClient**: Documentação oficial Angular
- **Design System**: Componentes os-alert e os-spinner já implementados

### Decisões Arquiteturais Durante Planejamento

- **Decisão**: Usar AngularFire para autenticação Firebase
- **Motivo**: Integração nativa com Angular, suporte a signals, melhor DX
- **Impacto**: Facilita implementação e manutenção

- **Decisão**: MSW para mocks de API
- **Motivo**: Interceptação de rede real, desenvolvimento independente, testes
- **Impacto**: Permite desenvolvimento sem backend

- **Decisão**: Interceptors para tratamento global
- **Motivo**: Padrão Angular, reutilização, manutenibilidade
- **Impacto**: Tratamento consistente em toda aplicação

## 🚨 Riscos Identificados

### Riscos Técnicos

- **Risco**: Token expirado não tratado adequadamente
- **Probabilidade**: Média
- **Mitigação**: Implementar refresh automático no AuthInterceptor

- **Risco**: Performance com interceptors globais
- **Probabilidade**: Baixa
- **Mitigação**: Otimização com OnPush e signals

- **Risco**: Firebase quota excedida
- **Probabilidade**: Baixa
- **Mitigação**: Monitoramento e fallback para desenvolvimento

### Riscos de Dependência

- **Dependência Externa**: Firebase Auth
- **Impacto se Indisponível**: Autenticação não funciona
- **Plano B**: Mock de autenticação para desenvolvimento

- **Dependência Externa**: Backend API
- **Impacto se Indisponível**: Dados não carregam
- **Plano B**: MSW para desenvolvimento independente

## 📈 Métricas de Progresso

### Por Fase

- Fase 1: 4 tarefas, ~2 horas estimadas ✅ **COMPLETADA**
- Fase 2: 4 tarefas, ~3 horas estimadas ✅ **COMPLETADA**
- Fase 3: 4 tarefas, ~2 horas estimadas ⏰ **EM PROGRESSO**
- Fase 4: 8 tarefas, ~4 horas estimadas ⏳ **PENDENTE**
- Fase 5: 5 tarefas, ~3 horas estimadas ⏳ **PENDENTE**
- Fase 6: 4 tarefas, ~2 horas estimadas ⏳ **PENDENTE**

### Total

- **Tarefas**: 29 tarefas
- **Tempo Estimado**: ~16 horas
- **Marcos**: 6 fases principais

## 🎯 Critérios de Sucesso

### Funcionais

- [x] **ApiService** faz requisições HTTP corretamente
- [ ] **AuthInterceptor** adiciona tokens automaticamente
- [ ] **ErrorInterceptor** trata erros adequadamente
- [x] **AuthService** gerencia estado de autenticação
- [ ] **AuthGuard** protege rotas corretamente (preparado)
- [x] **MSW** funciona em desenvolvimento
- [ ] **Integração** com Design System funcionando

### Técnicos

- [ ] **Cobertura de testes** > 80%
- [x] **Performance** otimizada com OnPush
- [x] **TypeScript Strict** sem uso de `any`
- [x] **Angular Moderno** com standalone components
- [x] **Signals** para estado reativo

### Qualidade

- [x] **Código limpo** e bem documentado
- [x] **Padrões** do projeto seguidos
- [ ] **Testes** abrangentes e confiáveis
- [x] **Documentação** clara e completa
