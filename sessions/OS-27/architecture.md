# Configurar projeto Angular 18+ com standalone components - Arquitetura Técnica

## 🏗️ Visão Geral da Implementação

### Estado Atual

O projeto já possui:

- ✅ Angular 20+ funcionando com standalone components
- ✅ TypeScript strict mode configurado
- ✅ Testes unitários com 100% cobertura
- ✅ Estrutura de pastas com path mapping básico
- ✅ Angular Material configurado
- ✅ Prettier configurado

**Estrutura atual:**

```
src/
├── app/
│   ├── app.config.ts
│   ├── app.html
│   ├── app.routes.ts
│   ├── app.scss
│   ├── app.spec.ts
│   └── app.ts
├── shared/
│   └── core/
│       └── either/
└── styles.scss
```

### Mudanças Propostas

Reorganizar completamente para Feature-Based Architecture seguindo as Meta Specs:

```
src/
├── app/
│   ├── core/                 # Serviços singleton e configurações globais
│   │   ├── services/         # Auth, Config, etc.
│   │   ├── interceptors/     # HTTP interceptors globais
│   │   └── guards/           # Route guards globais
│   ├── shared/               # Componentes e utilitários compartilhados
│   │   ├── ui-components/    # Design System (abstração Angular Material)
│   │   │   ├── atoms/        # os-button, os-input, os-icon
│   │   │   ├── molecules/    # os-form-field, os-card, os-search-box
│   │   │   └── organisms/    # os-data-table, os-navigation, os-modal
│   │   ├── theme/            # Customizações de tema Material
│   │   ├── pipes/            # Custom pipes compartilhados
│   │   ├── directives/       # Custom directives compartilhadas
│   │   └── utils/            # Utilitários compartilhados
│   ├── features/             # Features standalone (lazy-loaded)
│   │   ├── dashboard/        # Dashboard principal
│   │   │   ├── components/   # Componentes da feature
│   │   │   ├── services/     # Serviços da feature
│   │   │   └── routes.ts     # Rotas da feature
│   │   ├── budgets/          # Gestão de orçamentos
│   │   ├── transactions/     # Gestão de transações
│   │   ├── goals/            # Gestão de metas
│   │   ├── accounts/         # Gestão de contas
│   │   ├── credit-cards/     # Gestão de cartões de crédito
│   │   ├── reports/          # Relatórios e análises
│   │   └── onboarding/       # Fluxo de onboarding
│   ├── layouts/              # Layouts da aplicação
│   │   ├── main-layout/      # Layout principal
│   │   └── auth-layout/      # Layout para autenticação
│   ├── dtos/                 # Contratos de API (DTO-First)
│   │   ├── budget/           # DTOs de orçamento
│   │   ├── transaction/      # DTOs de transação
│   │   ├── goal/             # DTOs de metas
│   │   ├── account/          # DTOs de contas
│   │   ├── credit-card/      # DTOs de cartões de crédito
│   │   └── shared/           # Types compartilhados
│   ├── services/             # Serviços de aplicação
│   │   ├── api/              # Serviços de API
│   │   ├── state/            # Gerenciamento de estado global
│   │   └── validation/       # Validações globais
│   ├── app.config.ts         # Configuração da aplicação
│   ├── app.routes.ts         # Rotas principais
│   ├── app.ts                # Componente raiz
│   └── app.html              # Template do componente raiz
├── environments/             # Configurações de ambiente
│   ├── environment.ts        # Desenvolvimento
│   ├── environment.prod.ts   # Produção
│   └── environment.test.ts   # Testes
└── mocks/                    # MSW mocks (desenvolvimento)
    ├── features/             # Handlers por feature
    └── handlers.ts           # Aggregated handlers
```

### Impactos

- **Reestruturação completa**: Migração de código existente para nova arquitetura
- **Path mapping**: Atualização de imports para usar aliases
- **Standalone Components**: Todas as features usando componentes standalone
- **Testes**: Adaptação dos testes para nova estrutura
- **Build**: Configuração de environments e CI/CD

## 🔧 Componentes e Estrutura

### Arquivos Principais a Modificar

- `tsconfig.json`: Adicionar path aliases para Feature-Based Architecture
- `angular.json`: Configurar environments e build options
- `package.json`: Adicionar ESLint e scripts de CI/CD
- `src/app/app.config.ts`: Configurar providers e interceptors globais
- `src/app/app.routes.ts`: Configurar lazy loading para features com `loadChildren()`
- `src/shared/core/either/`: Migrar para `src/app/shared/utils/`

### Novos Arquivos a Criar

- `eslint.config.js`: Configuração ESLint com regras Angular
- `src/environments/`: Arquivos de configuração de ambiente
- `src/app/core/`: Serviços globais, interceptors e guards
- `src/app/shared/`: Componentes standalone reutilizáveis
- `src/app/features/`: Estrutura de features standalone com lazy loading
- `src/app/features/*/routes.ts`: Rotas por feature
- `src/app/layouts/`: Layouts standalone da aplicação
- `src/app/dtos/`: DTOs para comunicação com API
- `src/app/services/`: Serviços de aplicação
- `src/mocks/`: MSW para desenvolvimento
- `.github/workflows/`: Pipeline CI/CD com GitHub Actions

### Estrutura de Diretórios

Seguir exatamente as Meta Specs com:

- **Feature-Based Organization**: Cada feature é uma coleção de componentes standalone independentes
- **DTO-First Architecture**: DTOs organizados por contexto de negócio
- **Clean Architecture**: Separação clara de responsabilidades
- **Atomic Design**: Componentes standalone organizados por complexidade
- **Lazy Loading**: Features carregadas sob demanda usando rotas standalone

## 🏛️ Padrões Arquiteturais

### Padrões Seguidos

- **Feature-Based Architecture**: Organização por funcionalidades de negócio
- **DTO-First**: Contratos de API definidos primeiro
- **Clean Architecture**: Separação de camadas e responsabilidades
- **Atomic Design**: Componentes organizados por complexidade
- **Command Pattern**: Para operações de mutação e consulta
- **Repository Pattern**: Para acesso a dados
- **Dependency Injection**: Para inversão de dependências

### Decisões Arquiteturais

- **Decisão**: Manter Angular 20+ (não fazer downgrade para 18+)
- **Alternativas**: Downgrade para Angular 18+ ou upgrade para 21+
- **Justificativa**: Angular 20+ já está funcionando e é a versão mais recente estável

- **Decisão**: Usar Standalone Components para todas as features
- **Alternativas**: NgModules para features
- **Justificativa**:

  - Alinhamento com boas práticas oficiais do Angular 20+
  - Simplifica arquitetura (menos boilerplate)
  - Lazy loading funciona perfeitamente com `loadComponent()` e `loadChildren()`
  - Melhor tree-shaking e performance
  - Elimina complexidade de módulos
  - Padrão recomendado pela equipe Angular

- **Decisão**: Implementar DTO-First Architecture
- **Alternativas**: Domain models ou ViewModels
- **Justificativa**: Alinhamento com backend e simplicidade de integração

## 📦 Dependências e Integrações

### Dependências Existentes

- **Angular 20+**: Framework principal
- **Angular Material**: Componentes UI
- **RxJS**: Programação reativa
- **TypeScript**: Linguagem com strict mode
- **Karma + Jasmine**: Testes unitários

### Novas Dependências

- **@angular-eslint/builder**: Para linting automático
- **@angular-eslint/eslint-plugin**: Regras ESLint para Angular
- **@angular-eslint/eslint-plugin-template**: Regras para templates
- **@angular-eslint/schematics**: Schematics para configuração
- **msw**: Para mocking de APIs em desenvolvimento
- **@types/node**: Para tipagem do Node.js

### Integrações

- **GitHub Actions**: Para pipeline CI/CD
- **Angular CLI**: Para comandos de desenvolvimento
- **ESLint**: Para validação de código
- **MSW**: Para simulação de APIs

## 🔄 Fluxo de Dados

### Fluxo Principal

1. **User Action** → Component
2. **Component** → Service (Command/Query)
3. **Service** → Port (Interface)
4. **Port** → Adapter (HTTP/API)
5. **Adapter** → Backend API
6. **Response** → DTO → State → Component

### Fluxo de Estado

1. **Feature State** → Signals para estado local
2. **Shared State** → Signals para estado global
3. **Event Bus** → Comunicação entre features
4. **Cache Service** → Cache inteligente com TTL

## 🧪 Considerações de Teste

### Testes Unitários

- **Componentes**: Testes de renderização e interação
- **Serviços**: Testes de lógica de negócio
- **Commands/Queries**: Testes de operações
- **DTOs**: Testes de validação e transformação

### Testes de Integração

- **Features**: Fluxos completos de features
- **API Integration**: Comunicação com backend
- **State Management**: Gerenciamento de estado

### Mocks e Fixtures

- **MSW Handlers**: Simulação de APIs
- **Test Data**: Dados de teste realistas
- **Component Fixtures**: Fixtures para componentes

## ⚖️ Trade-offs e Riscos

### Trade-offs Aceitos

- **Complexidade Inicial**: Estrutura mais complexa para melhor escalabilidade
- **Curva de Aprendizado**: Time precisa aprender novos padrões
- **Overhead**: Mais arquivos e estrutura para funcionalidades simples

### Riscos Identificados

- **Migração Complexa**: Código existente precisa ser migrado
- **Breaking Changes**: Mudanças podem quebrar funcionalidades existentes
- **Performance**: Lazy loading pode impactar performance inicial

## 📋 Lista de Implementação

### Fase 1: Configuração Base

- [ ] Configurar ESLint com regras Angular
- [ ] Criar arquivos de environment
- [ ] Configurar path aliases no tsconfig.json
- [ ] Atualizar angular.json para environments

### Fase 2: Estrutura de Pastas

- [ ] Criar estrutura de diretórios Feature-Based
- [ ] Migrar código existente para nova estrutura
- [ ] Configurar path mapping

### Fase 3: Core e Shared

- [ ] Implementar Core module com serviços globais
- [ ] Implementar Shared module com componentes reutilizáveis
- [ ] Configurar Design System base

### Fase 4: Features

- [ ] Criar estrutura de features (dashboard, budgets, etc.)
- [ ] Implementar lazy loading
- [ ] Configurar roteamento

### Fase 5: DTOs e Services

- [ ] Implementar DTOs para comunicação com API
- [ ] Implementar Command/Query pattern
- [ ] Configurar serviços de aplicação

### Fase 6: Testing e CI/CD

- [ ] Configurar MSW para desenvolvimento
- [ ] Implementar testes unitários
- [ ] Configurar pipeline CI/CD com GitHub Actions

### Fase 7: Documentação

- [ ] Documentar arquitetura implementada
- [ ] Criar guias de desenvolvimento
- [ ] Atualizar README

## 📚 Referências

- **Meta Specs**: https://github.com/danilotandrade1518/orca-sonhos-meta-specs
- **Angular Docs**: https://angular.dev
- **Angular Standalone Components**: https://angular.dev/guide/components/importing
- **ESLint Angular**: https://github.com/angular-eslint/angular-eslint
- **MSW**: https://mswjs.io
- **Feature-Based Architecture**: Meta Specs - frontend-architecture/directory-structure.md

---

## 📝 Changelog de Decisões Arquiteturais

### 2025-10-06: Decisão por Standalone Components

**Mudança**: Alterada decisão arquitetural de NgModules para Standalone Components

**Motivo**:

- Alinhamento com boas práticas oficiais do Angular 20+
- Análise de código revelou implementação já 100% standalone
- Simplificação da arquitetura
- Melhor performance e tree-shaking

**Impacto nas Fases**:

- ✅ **Fases 1-3**: Nenhuma mudança necessária (já implementadas com standalone)
- 📝 **Fase 4**: Criar `routes.ts` ao invés de `*-routing.module.ts` e `*.module.ts`
- 📝 **Fases 5-7**: Manter abordagem standalone em todos os componentes

**Aprovado por**: Equipe de desenvolvimento
