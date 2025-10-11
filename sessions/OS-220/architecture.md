# Core Services e Autenticação - Arquitetura Técnica

## 🏗️ Visão Geral da Implementação

### Estado Atual

O projeto possui uma estrutura básica de Angular 20 com:

- **Core Module**: Estrutura vazia (services/, interceptors/, guards/ vazios)
- **Design System**: Componentes implementados (os-alert, os-spinner, os-button)
- **App Config**: Configuração básica com zoneless change detection
- **Routes**: Roteamento simples sem proteção
- **Dependências**: Angular Material instalado, sem Firebase ou MSW

### Mudanças Propostas

- **Implementação completa** dos serviços core (ApiService, AuthService, ConfigService)
- **Interceptors** para autenticação e tratamento de erros
- **AuthGuard** para proteção de rotas (preparado para uso futuro)
- **MSW Setup** para desenvolvimento independente
- **Integração** com Firebase Auth
- **Configuração** de providers no app.config.ts

### Impactos

- **Core Module**: Nova estrutura de serviços e interceptors
- **App Config**: Adição de providers para Firebase e HTTP
- **Routes**: **NÃO MODIFICAR** - Apenas preparar AuthGuard para uso futuro
- **Design System**: Integração com os-alert e os-spinner
- **Dependências**: Adição de @angular/fire e msw

## 🔧 Componentes e Estrutura

### Arquivos Principais a Modificar

- `src/app/app.config.ts`: Adicionar providers para Firebase, HTTP e interceptors
- `src/app/app.routes.ts`: **NÃO MODIFICAR** - Usar rota atual como modelo de configuração
- `src/app/core/index.ts`: Exportar novos serviços e guards

### Novos Arquivos a Criar

- `src/app/core/services/api.service.ts`: Serviço HTTP centralizado
- `src/app/core/services/auth.service.ts`: Gerenciamento de autenticação Firebase
- `src/app/core/services/config.service.ts`: Configurações de ambiente
- `src/app/core/interceptors/auth.interceptor.ts`: Adiciona tokens JWT
- `src/app/core/interceptors/error.interceptor.ts`: Tratamento de erros
- `src/app/core/guards/auth.guard.ts`: Proteção de rotas (preparado para uso futuro)
- `src/app/core/mocks/handlers/`: MSW handlers para 30+ endpoints
- `src/app/core/mocks/browser.ts`: Configuração MSW para browser
- `src/app/core/mocks/server.ts`: Configuração MSW para testes

### Estrutura de Diretórios

```
src/app/core/
├── services/
│   ├── api.service.ts
│   ├── auth.service.ts
│   └── config.service.ts
├── interceptors/
│   ├── auth.interceptor.ts
│   └── error.interceptor.ts
├── guards/
│   └── auth.guard.ts
├── mocks/
│   ├── handlers/
│   │   ├── auth.handlers.ts
│   │   ├── budgets.handlers.ts
│   │   ├── accounts.handlers.ts
│   │   ├── transactions.handlers.ts
│   │   ├── goals.handlers.ts
│   │   └── categories.handlers.ts
│   ├── browser.ts
│   └── server.ts
└── index.ts
```

## ⚠️ Considerações Importantes

### Registro de Rotas

**NÃO iremos registrar novas rotas neste momento**. A rota atual (`/dashboard`) será mantida como está e servirá apenas como modelo de configuração para demonstrar como o AuthGuard funcionará no futuro.

**Quando as rotas serão registradas?**

- As rotas serão registradas de fato quando avançarmos na criação das pages
- O AuthGuard será implementado e testado, mas não aplicado às rotas existentes
- Esta abordagem permite preparar toda a infraestrutura sem modificar o roteamento atual

## 🏛️ Padrões Arquiteturais

### Padrões Seguidos

- **Standalone Services**: Usar `inject()` function e `providedIn: 'root'`
- **Signals**: Estado reativo com `signal()` e `computed()`
- **OnPush Strategy**: Otimização de performance
- **TypeScript Strict**: Tipagem rigorosa sem `any`
- **Angular Moderno**: Control flow nativo, standalone components

### Decisões Arquiteturais

- **Decisão**: Usar AngularFire para autenticação Firebase
- **Alternativas**: Firebase SDK direto, Auth0, Supabase
- **Justificativa**: Integração nativa com Angular, suporte a signals, melhor DX

- **Decisão**: MSW para mocks de API
- **Alternativas**: JSON Server, MirageJS, Backend real
- **Justificativa**: Interceptação de rede real, desenvolvimento independente, testes

- **Decisão**: Interceptors para tratamento global
- **Alternativas**: Middleware customizado, decorators
- **Justificativa**: Padrão Angular, reutilização, manutenibilidade

## 📦 Dependências e Integrações

### Dependências Existentes

- **@angular/material**: Base para componentes de UI
- **@angular/cdk**: Funcionalidades avançadas
- **rxjs**: Programação reativa

### Novas Dependências

- **@angular/fire**: Integração Firebase com Angular
- **firebase**: SDK Firebase para autenticação
- **msw**: Mock Service Worker para desenvolvimento
- **@types/node**: Tipos para Node.js (já instalado)

### Integrações

- **Firebase Auth**: Autenticação de usuários com Google/Email
- **Backend API**: 30+ endpoints mapeados com MSW
- **Design System**: os-alert, os-spinner, os-button
- **Angular Router**: Proteção de rotas com AuthGuard (preparado para uso futuro)

## 🔄 Fluxo de Dados

### Fluxo de Autenticação

1. **Login**: Firebase Auth → Token JWT → Armazenamento local
2. **Requisições**: AuthInterceptor adiciona token automaticamente
3. **Proteção**: AuthGuard preparado para verificar autenticação (não aplicado ainda)
4. **Logout**: Limpa token e redireciona para login

### Fluxo de Requisições HTTP

1. **Componente** → **ApiService** → **AuthInterceptor** → **Backend/MSW**
2. **Resposta** → **ErrorInterceptor** → **os-alert** (se erro) → **Componente**
3. **Loading** → **os-spinner** durante requisições

### Fluxo de Estados

1. **AuthService**: Gerencia estado de autenticação com signals
2. **ApiService**: Gerencia estados de loading com signals
3. **ErrorInterceptor**: Gerencia notificações de erro com os-alert

## 🧪 Considerações de Teste

### Testes Unitários

- **ApiService**: Mock HttpClient, testar métodos HTTP
- **AuthService**: Mock Firebase Auth, testar login/logout
- **Interceptors**: Mock HttpRequest/HttpResponse, testar transformações
- **AuthGuard**: Mock Router, testar redirecionamentos (preparado para uso futuro)

### Testes de Integração

- **Fluxo completo**: Login → Requisição → Resposta → Logout
- **MSW**: Verificar mocks funcionando corretamente
- **Error Handling**: Testar diferentes tipos de erro

### Mocks e Fixtures

- **MSW Handlers**: Dados realistas para 30+ endpoints
- **Firebase Auth**: Mock para desenvolvimento
- **HttpClient**: Interceptação com MSW

## ⚖️ Trade-offs e Riscos

### Trade-offs Aceitos

- **MSW apenas desenvolvimento**: Backend real em produção
- **Firebase dependency**: Vendor lock-in vs facilidade de uso
- **Interceptors globais**: Performance vs funcionalidade

### Riscos Identificados

- **Token expirado**: Implementar refresh automático
- **Erro de rede**: Tratamento adequado de timeouts
- **Performance**: Otimização com OnPush e signals
- **Firebase quota**: Limitações de uso gratuito

## 📋 Lista de Implementação

### Fase 1: Configuração Base

- [ ] Instalar dependências (@angular/fire, msw)
- [ ] Configurar Firebase no app.config.ts
- [ ] Configurar MSW para desenvolvimento
- [ ] Criar estrutura de diretórios

### Fase 2: Serviços Core

- [ ] Implementar ConfigService
- [ ] Implementar AuthService com Firebase
- [ ] Implementar ApiService com HttpClient
- [ ] Configurar interceptors no app.config.ts

### Fase 3: Interceptors e Guards

- [ ] Implementar AuthInterceptor
- [ ] Implementar ErrorInterceptor
- [ ] Implementar AuthGuard (preparado para uso futuro)
- [ ] Integrar com Design System (os-alert, os-spinner)

### Fase 4: MSW e Mocks

- [ ] Criar handlers para autenticação
- [ ] Criar handlers para budgets
- [ ] Criar handlers para accounts
- [ ] Criar handlers para transactions
- [ ] Criar handlers para goals
- [ ] Criar handlers para categories

### Fase 5: Testes e Validação

- [ ] Testes unitários para serviços
- [ ] Testes unitários para interceptors
- [ ] Testes unitários para guards
- [ ] Testes de integração
- [ ] Validação de cobertura > 80%

### Fase 6: Integração e Documentação

- [ ] **NÃO INTEGRAR** com rotas existentes (apenas preparar AuthGuard)
- [ ] Documentar APIs dos serviços
- [ ] Validar funcionamento completo
- [ ] Preparar para próximas fases (registro de rotas será feito quando criar as pages)

## 🌐 Contratos da API Backend

### 🔍 **QUERIES (GET)**

#### **1. GET /budgets**

- **Descrição**: Lista orçamentos do usuário autenticado
- **Headers**: `Authorization: Bearer <token>`
- **Response**:

```typescript
{
  data: {
    id: string;
    name: string;
    type: 'PERSONAL' | 'SHARED';
    participantsCount: number;
  }
  [];
  meta: {
    count: number;
  }
}
```

#### **2. GET /budget/:budgetId/overview**

- **Descrição**: Resumo detalhado do orçamento
- **Headers**: `Authorization: Bearer <token>`
- **Params**: `budgetId` (UUID)
- **Response**:

```typescript
{
  data: {
    id: string;
    name: string;
    type: 'PERSONAL' | 'SHARED';
    participants: {
      id: string;
    }
    [];
    totals: {
      accountsBalance: number;
      monthIncome: number;
      monthExpense: number;
      netMonth: number;
    }
    accounts: {
      id: string;
      name: string;
      type: string;
      balance: number;
    }
    [];
  }
}
```

#### **3. GET /me**

- **Descrição**: Informações do usuário autenticado
- **Headers**: `Authorization: Bearer <token>` (opcional)
- **Response**:

```typescript
// Se autenticado:
{
  userId: string;
}
// Se não autenticado:
{
  anonymous: true;
}
```

#### **4. GET /accounts**

- **Descrição**: Lista contas do orçamento
- **Headers**: `Authorization: Bearer <token>`
- **Query Params**: `budgetId` (UUID, obrigatório)
- **Response**:

```typescript
{
  data: {
    id: string;
    name: string;
    type: 'CHECKING_ACCOUNT' |
      'SAVINGS_ACCOUNT' |
      'PHYSICAL_WALLET' |
      'DIGITAL_WALLET' |
      'INVESTMENT_ACCOUNT' |
      'OTHER';
    balance: number;
  }
  [];
  meta: {
    count: number;
  }
}
```

#### **5. GET /transactions**

- **Descrição**: Lista transações com filtros e paginação
- **Headers**: `Authorization: Bearer <token>`
- **Query Params**:
  - `budgetId` (UUID, obrigatório)
  - `accountId` (UUID, opcional)
  - `categoryId` (UUID, opcional)
  - `dateFrom` (date, opcional)
  - `dateTo` (date, opcional)
  - `page` (number, opcional, padrão: 1)
  - `pageSize` (number, opcional, padrão: 20, máx: 100)
- **Response**:

```typescript
{
  data: {
    id: string;
    date: string;
    description: string;
    amount: number;
    direction: 'INCOME' | 'EXPENSE' | 'TRANSFER';
    accountId: string;
    categoryId: string;
  }
  [];
  meta: {
    page: number;
    pageSize: number;
    hasNext: boolean;
  }
}
```

#### **6. GET /envelopes**

- **Descrição**: Lista envelopes do orçamento
- **Headers**: `Authorization: Bearer <token>`
- **Query Params**: `budgetId` (UUID, obrigatório)
- **Response**: Estrutura similar a accounts

#### **7. GET /goals**

- **Descrição**: Lista metas do orçamento
- **Headers**: `Authorization: Bearer <token>`
- **Query Params**: `budgetId` (UUID, obrigatório)
- **Response**: Estrutura similar a accounts

#### **8. GET /categories**

- **Descrição**: Lista categorias
- **Headers**: `Authorization: Bearer <token>`
- **Query Params**: `budgetId` (UUID, opcional)
- **Response**:

```typescript
{
  data: {
    id: string;
    name: string;
    type: 'INCOME' | 'EXPENSE' | 'TRANSFER';
  }
  [];
}
```

#### **9. GET /health**

- **Descrição**: Health check
- **Response**:

```typescript
{
  status: 'ok';
  traceId: string;
}
```

#### **10. GET /ready**

- **Descrição**: Readiness check
- **Response**: Similar ao health

---

### 🔧 **MUTATIONS (POST)**

#### **BUDGETS**

#### **11. POST /budget/create-budget**

- **Headers**: `Authorization: Bearer <token>`
- **Body**:

```typescript
{
  name: string;
  ownerId: string;
  participantIds?: string[];
  type: 'PERSONAL' | 'SHARED';
}
```

- **Response**: `{ id: string }` (201)

#### **12. POST /budget/update-budget**

- **Headers**: `Authorization: Bearer <token>`
- **Body**:

```typescript
{
  userId: string;
  budgetId: string;
  name: string;
}
```

- **Response**: `{ success: true }` (200)

#### **13. POST /budget/delete-budget**

- **Headers**: `Authorization: Bearer <token>`
- **Body**:

```typescript
{
  userId: string;
  budgetId: string;
}
```

- **Response**: `{ success: true }` (200)

#### **14. POST /budget/add-participant**

- **Headers**: `Authorization: Bearer <token>`
- **Body**:

```typescript
{
  userId: string;
  budgetId: string;
  participantId: string;
}
```

- **Response**: `{ success: true }` (200)

#### **15. POST /budget/remove-participant**

- **Headers**: `Authorization: Bearer <token>`
- **Body**:

```typescript
{
  userId: string;
  budgetId: string;
  participantId: string;
}
```

- **Response**: `{ success: true }` (200)

#### **ACCOUNTS**

#### **16. POST /account/create-account**

- **Headers**: `Authorization: Bearer <token>`
- **Body**:

```typescript
{
  userId: string;
  name: string;
  type: 'CHECKING_ACCOUNT' | 'SAVINGS_ACCOUNT' | 'PHYSICAL_WALLET' | 'DIGITAL_WALLET' | 'INVESTMENT_ACCOUNT' | 'OTHER';
  budgetId: string;
  initialBalance?: number;
  description?: string;
}
```

- **Response**: `{ id: string }` (201)

#### **17. POST /account/update-account**

- **Headers**: `Authorization: Bearer <token>`
- **Body**:

```typescript
{
  id: string;
  userId: string;
  name?: string;
  description?: string;
  initialBalance?: number;
}
```

- **Response**: `{ success: true }` (200)

#### **18. POST /account/delete-account**

- **Headers**: `Authorization: Bearer <token>`
- **Body**:

```typescript
{
  userId: string;
  accountId: string;
}
```

- **Response**: `{ success: true }` (200)

#### **19. POST /account/reconcile-account**

- **Headers**: `Authorization: Bearer <token>`
- **Body**:

```typescript
{
  userId: string;
  budgetId: string;
  accountId: string;
  realBalance: number;
}
```

- **Response**: `{ success: true }` (200)

#### **20. POST /account/transfer-between-accounts**

- **Headers**: `Authorization: Bearer <token>`
- **Body**:

```typescript
{
  userId: string;
  fromAccountId: string;
  toAccountId: string;
  amount: number;
  description?: string;
}
```

- **Response**: `{ success: true }` (200)

#### **TRANSACTIONS**

#### **21. POST /transaction/create-transaction**

- **Headers**: `Authorization: Bearer <token>`
- **Body**:

```typescript
{
  userId: string;
  description: string;
  amount: number;
  type: 'INCOME' | 'EXPENSE' | 'TRANSFER';
  accountId: string;
  categoryId: string;
  budgetId: string;
  transactionDate?: string; // ISO date string
}
```

- **Response**: `{ id: string }` (201)

#### **22. POST /transaction/update-transaction**

- **Headers**: `Authorization: Bearer <token>`
- **Body**:

```typescript
{
  userId: string;
  id: string;
  description?: string;
  amount?: number;
  type?: 'INCOME' | 'EXPENSE' | 'TRANSFER';
  accountId?: string;
  categoryId?: string;
  transactionDate?: string;
}
```

- **Response**: `{ success: true }` (200)

#### **23. POST /transaction/delete-transaction**

- **Headers**: `Authorization: Bearer <token>`
- **Body**:

```typescript
{
  id: string;
  userId: string;
}
```

- **Response**: `{ success: true }` (200)

#### **24. POST /transaction/cancel-scheduled-transaction**

- **Headers**: `Authorization: Bearer <token>`
- **Body**:

```typescript
{
  userId: string;
  budgetId: string;
  transactionId: string;
  cancellationReason: string;
}
```

- **Response**: `{ success: true }` (200)

#### **25. POST /transaction/mark-transaction-late**

- **Headers**: `Authorization: Bearer <token>`
- **Body**:

```typescript
{
  transactionId: string;
  lateDate?: string; // ISO date string
}
```

- **Response**: `{ success: true }` (200)

#### **ENVELOPES**

#### **26. POST /envelope/create-envelope**

- **Headers**: `Authorization: Bearer <token>`
- **Body**:

```typescript
{
  name: string;
  monthlyLimit: number;
  budgetId: string;
  categoryId: string;
  userId: string;
}
```

- **Response**: `{ id: string }` (201)

#### **27. POST /envelope/update-envelope**

- **Headers**: `Authorization: Bearer <token>`
- **Body**:

```typescript
{
  envelopeId: string;
  userId: string;
  budgetId: string;
  name?: string;
  monthlyLimit?: number;
}
```

- **Response**: `{ success: true }` (200)

#### **28. POST /envelope/delete-envelope**

- **Headers**: `Authorization: Bearer <token>`
- **Body**:

```typescript
{
  envelopeId: string;
  userId: string;
  budgetId: string;
}
```

- **Response**: `{ success: true }` (200)

#### **29. POST /envelope/add-amount-envelope**

- **Headers**: `Authorization: Bearer <token>`
- **Body**:

```typescript
{
  envelopeId: string;
  userId: string;
  budgetId: string;
  amount: number;
}
```

- **Response**: `{ success: true }` (200)

#### **30. POST /envelope/remove-amount-envelope**

- **Headers**: `Authorization: Bearer <token>`
- **Body**:

```typescript
{
  envelopeId: string;
  userId: string;
  budgetId: string;
  amount: number;
}
```

- **Response**: `{ success: true }` (200)

#### **31. POST /envelope/transfer-between-envelopes**

- **Headers**: `Authorization: Bearer <token>`
- **Body**:

```typescript
{
  sourceEnvelopeId: string;
  targetEnvelopeId: string;
  userId: string;
  budgetId: string;
  amount: number;
}
```

- **Response**: `{ success: true }` (200)

#### **GOALS**

#### **32. POST /goal/create-goal**

- **Headers**: `Authorization: Bearer <token>`
- **Body**:

```typescript
{
  name: string;
  totalAmount: number;
  accumulatedAmount?: number;
  deadline?: string; // ISO date string
  budgetId: string;
}
```

- **Response**: `{ id: string }` (201)

#### **33. POST /goal/update-goal**

- **Headers**: `Authorization: Bearer <token>`
- **Body**:

```typescript
{
  id: string;
  name: string;
  totalAmount: number;
  deadline?: string;
}
```

- **Response**: `{ success: true }` (200)

#### **34. POST /goal/delete-goal**

- **Headers**: `Authorization: Bearer <token>`
- **Body**:

```typescript
{
  id: string;
}
```

- **Response**: `{ success: true }` (200)

#### **35. POST /goal/add-amount-goal**

- **Headers**: `Authorization: Bearer <token>`
- **Body**:

```typescript
{
  id: string;
  amount: number;
}
```

- **Response**: `{ success: true }` (200)

#### **CREDIT CARDS**

#### **36. POST /credit-card/create-credit-card**

- **Headers**: `Authorization: Bearer <token>`
- **Body**:

```typescript
{
  name: string;
  limit: number;
  closingDay: number; // 1-31
  dueDay: number; // 1-31
  budgetId: string;
}
```

- **Response**: `{ id: string }` (201)

#### **37. POST /credit-card/update-credit-card**

- **Headers**: `Authorization: Bearer <token>`
- **Body**:

```typescript
{
  id: string;
  name: string;
  limit: number;
  closingDay: number;
  dueDay: number;
}
```

- **Response**: `{ success: true }` (200)

#### **38. POST /credit-card/delete-credit-card**

- **Headers**: `Authorization: Bearer <token>`
- **Body**:

```typescript
{
  id: string;
}
```

- **Response**: `{ success: true }` (200)

#### **CREDIT CARD BILLS**

#### **39. POST /credit-card-bill/create-credit-card-bill**

- **Headers**: `Authorization: Bearer <token>`
- **Body**:

```typescript
{
  creditCardId: string;
  closingDate: string; // ISO date string
  dueDate: string; // ISO date string
  amount: number;
}
```

- **Response**: `{ id: string }` (201)

#### **40. POST /credit-card-bill/update-credit-card-bill**

- **Headers**: `Authorization: Bearer <token>`
- **Body**:

```typescript
{
  id: string;
  closingDate: string;
  dueDate: string;
  amount: number;
}
```

- **Response**: `{ success: true }` (200)

#### **41. POST /credit-card-bill/delete-credit-card-bill**

- **Headers**: `Authorization: Bearer <token>`
- **Body**:

```typescript
{
  id: string;
}
```

- **Response**: `{ success: true }` (200)

#### **42. POST /credit-card-bill/pay-credit-card-bill**

- **Headers**: `Authorization: Bearer <token>`
- **Body**:

```typescript
{
  creditCardBillId: string;
  accountId: string;
  userId: string;
  budgetId: string;
  amount: number;
  paymentCategoryId: string;
  paidAt?: string; // ISO date string
}
```

- **Response**: `{ success: true }` (200)

#### **43. POST /credit-card-bill/reopen-credit-card-bill**

- **Headers**: `Authorization: Bearer <token>`
- **Body**:

```typescript
{
  creditCardBillId: string;
  userId: string;
  budgetId: string;
  justification: string;
}
```

- **Response**: `{ success: true }` (200)

---

### 🔐 **Autenticação e Autorização**

- **Todos os endpoints** (exceto `/me`, `/health`, `/ready`) requerem `Authorization: Bearer <token>`
- **Middleware de autorização**: Verifica acesso ao orçamento para endpoints que requerem `budgetId`
- **Códigos de erro**:
  - `401`: Não autenticado
  - `403`: Sem acesso ao orçamento
  - `400`: Erro de validação
  - `500`: Erro interno

### 📊 **Paginação e Filtros**

- **Transações**: Suporte completo a paginação (`page`, `pageSize`) e filtros (`accountId`, `categoryId`, `dateFrom`, `dateTo`)
- **Outros endpoints**: Retornam todos os itens (sem paginação)

### 💰 **Tipos de Dados**

- **Valores monetários**: Sempre em centavos (number)
- **Datas**: ISO string format
- **UUIDs**: String format
- **Enums**: Valores específicos conforme documentado

## 📚 Referências

- **Meta Specs**: /home/danilo/workspace/projeto-orca-sonhos/orca-sonhos-meta-specs
- **AngularFire**: /angular/angularfire - Autenticação Firebase
- **MSW**: /mswjs/msw - Mock Service Worker
- **Angular Best Practices**: /avivharuzi/angular-best-practices
- **Design System**: Componentes já implementados no projeto
- **Firebase Auth**: Documentação oficial Firebase
- **Angular HttpClient**: Documentação oficial Angular
