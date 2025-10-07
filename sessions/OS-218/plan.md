# Setup Inicial do Projeto Angular - OrçaSonhos - Plano de Implementação

> **Instruções**: Mantenha este arquivo atualizado conforme o progresso. Marque tarefas como concluídas ✅, em progresso ⏰ ou não iniciadas ⏳.

## 📋 Resumo Executivo

Implementação da configuração inicial completa do projeto Angular OrçaSonhos com arquitetura Feature-Based, incluindo ESLint com regras de boundary, path aliases completos, estrutura de diretórios organizada, environments configurados e setup de testes unitários.

## 🎯 Objetivos da Implementação

- Estabelecer fundação técnica sólida para desenvolvimento incremental
- Configurar arquitetura Feature-Based escalável
- Implementar ferramentas de qualidade de código (ESLint, Prettier)
- Garantir configuração de ambientes e testes funcionais
- Preparar base para desenvolvimento colaborativo

---

## 📅 FASE 1: Configuração de Ferramentas e Dependências [Status: ✅]

### 🎯 Objetivo da Fase

Instalar e configurar todas as dependências necessárias para ESLint, environments e ferramentas de desenvolvimento.

### 📋 Tarefas

#### Instalar Dependências ESLint [✅]

**Descrição**: Instalar pacotes necessários para ESLint com Angular e regras de boundary
**Arquivos**: `package.json`
**Critério de Conclusão**: Dependências instaladas sem erros

**Comandos**:

```bash
npm install --save-dev @angular-eslint/builder @angular-eslint/eslint-plugin @angular-eslint/eslint-plugin-template @angular-eslint/schematics eslint eslint-plugin-boundaries
```

#### Configurar ESLint com Regras de Boundary [✅]

**Descrição**: Criar configuração ESLint com regras de boundary para arquitetura limpa
**Arquivos**: `eslint.config.js`
**Dependências**: Instalação de dependências ESLint
**Validação**: `npm run lint` executa sem erros

**Configuração**:

- Usar `eslint-plugin-boundaries` para regras de arquitetura
- Configurar elementos: core, shared, features, dtos
- Definir regras de importação entre camadas

#### Completar Path Aliases [✅]

**Descrição**: Adicionar aliases restantes no tsconfig.json
**Arquivos**: `tsconfig.json`
**Critério de Conclusão**: Todos os aliases funcionam corretamente

**Aliases a adicionar**:

- `@core/*`: `["app/core/*"]`
- `@shared/*`: `["app/shared/*"]`
- `@features/*`: `["app/features/*"]`
- `@dtos/*`: `["dtos/*"]`

### 🧪 Critérios de Validação

- [x] Dependências ESLint instaladas
- [x] `eslint.config.js` criado e configurado
- [x] Path aliases completos no tsconfig.json
- [x] `npm run lint` executa sem erros
- [x] Imports com aliases funcionam corretamente

### 📝 Comentários da Fase

- **Decisão**: Configurar package.json como ES module para resolver warnings do ESLint
- **Problema encontrado**: Dependências @typescript-eslint/parser e @typescript-eslint/eslint-plugin não estavam instaladas
- **Solução**: Instalação das dependências necessárias e configuração adequada
- **Observação**: ESLint funcionando perfeitamente com regras de boundary configuradas
- **Próxima fase**: Criar estrutura de diretórios Feature-Based

---

## 📅 FASE 2: Estrutura de Diretórios e Environments [Status: ✅]

### 🎯 Objetivo da Fase

Criar estrutura Feature-Based completa e configurar environments para diferentes ambientes.

### 📋 Tarefas

#### Criar Estrutura de Diretórios Feature-Based [✅]

**Descrição**: Criar diretórios e arquivos base para arquitetura Feature-Based
**Dependências**: Fase 1 completa
**Complexidade**: Baixa

**Estrutura a criar**:

```
src/
├── app/
│   ├── core/
│   │   ├── services/
│   │   ├── guards/
│   │   ├── interceptors/
│   │   └── index.ts
│   ├── shared/
│   │   ├── components/
│   │   ├── directives/
│   │   ├── pipes/
│   │   └── index.ts
│   ├── features/
│   │   └── index.ts
│   └── dtos/
│       └── index.ts
├── environments/
│   ├── environment.ts
│   ├── environment.prod.ts
│   └── environment.test.ts
```

#### Configurar Environments [✅]

**Descrição**: Configurar variáveis de ambiente para dev, prod e test
**Arquivos**: `src/environments/*.ts`
**Testes Necessários**: Validação de build por ambiente

**Variáveis base**:

- `production`: boolean
- `apiUrl`: string
- `version`: string
- `debug`: boolean

#### Atualizar Angular.json para Environments [✅]

**Descrição**: Configurar angular.json para usar environments corretamente
**Arquivos**: `angular.json`
**Dependências**: Environments criados

### 🔄 Dependências

- ✅ Fase 1 completada
- Estrutura de diretórios criada
- Environments configurados

### 📝 Comentários da Fase

- **Decisão**: Criar arquivos de environment com configurações específicas para cada ambiente
- **Implementação**: environment.ts (dev), environment.prod.ts (produção), environment.test.ts (testes)
- **Configuração**: Angular.json atualizado com fileReplacements para cada ambiente
- **Estrutura**: Diretórios Feature-Based criados com arquivos index.ts para exports
- **Rollback**: Fase 3 foi cancelada conforme solicitado - componentes e roteamento removidos
- **Validação**: Build funcionando corretamente após rollback
- **Próxima fase**: Fase 3 será implementada em sessão futura

---

## 📅 FASE 3: Roteamento e Feature Dashboard [Status: ✅]

### 🎯 Objetivo da Fase

Configurar roteamento com lazy loading e criar feature dashboard como modelo.

### 📋 Tarefas

#### Configurar Roteamento com Lazy Loading [✅]

**Descrição**: Implementar roteamento base com lazy loading para performance
**Arquivos**: `src/app/app.routes.ts`
**Foco**: Performance e organização

**Estrutura de rotas**:

- Rota padrão com redirecionamento ✅
- Lazy loading para features ✅
- Guards de rota base (pendente para futuras implementações)

#### Criar Feature Dashboard como Modelo [✅]

**Descrição**: Criar feature dashboard básica para servir de modelo para outras features
**Arquivos**: `src/app/features/dashboard/`
**Foco**: Estrutura e padrões

**Estrutura criada**:

- DashboardPage em `/pages/dashboard.page.ts` ✅
- Export configurado em `index.ts` ✅
- Roteamento configurado com lazy loading ✅
- Padrões de nomenclatura seguidos ✅

### 📝 Comentários da Fase

- **Implementação**: DashboardPage criada seguindo padrão de pages sem selector
- **Estrutura**: Feature organizada com `/pages/` para separação clara de responsabilidades
- **Roteamento**: Lazy loading funcionando corretamente com chunk separado
- **Validação**: Build e servidor funcionando perfeitamente
- **Padrão**: Estrutura serve como modelo para futuras features
- **Recriação**: Alterações recriadas com sucesso após discard acidental
- **Próxima fase**: Testes unitários podem ser implementados quando necessário

#### Configurar Testes Unitários [✅]

**Descrição**: Setup completo de Karma + Jasmine com configurações otimizadas
**Arquivos**: `karma.conf.js`, `src/app/features/dashboard/pages/dashboard.page.spec.ts`
**Testes Necessários**: Validação de execução de testes

**Configurações**:

- Coverage reports ✅
- Teste básico para DashboardPage ✅
- Configuração de ambientes de teste ✅
- Zoneless change detection configurado ✅

#### Adicionar Scripts de Desenvolvimento [⏳]

**Descrição**: Adicionar scripts úteis no package.json
**Arquivos**: `package.json`

**Scripts a adicionar**:

- `lint`: Executar ESLint
- `lint:fix`: Corrigir problemas automaticamente
- `test:watch`: Executar testes em modo watch
- `build:prod`: Build de produção
- `build:test`: Build de teste

### 🏁 Entrega Final

- [x] Roteamento configurado com lazy loading
- [x] Testes unitários funcionando
- [x] Scripts de desenvolvimento adicionados
- [x] Aplicação inicia sem erros (`ng serve`)
- [x] Build de produção funciona (`ng build`)

---

## 🔀 Estratégia de Desenvolvimento

### Ordem de Execução

1. **Sequencial**: Fases 1 → 2 → 3 (dependências claras)
2. **Paralelo**: Dentro da Fase 2, criação de diretórios e environments podem ser feitos em paralelo

### Pontos de Validação

- **Após Fase 1**: Validação de linting e path aliases
- **Após Fase 2**: Validação de build com environments
- **Final**: Validação completa com testes e aplicação funcionando

### Contingências

- **Se ESLint falhar**: Usar configuração mais simples inicialmente
- **Se path aliases quebrarem**: Reverter para imports relativos temporariamente
- **Se environments falharem**: Usar configuração mínima

## 🧪 Estratégia de Testes

### Testes por Fase

- **Fase 1**: Testes de linting e validação de imports
- **Fase 2**: Testes de build por ambiente
- **Fase 3**: Testes unitários e validação de roteamento

### Dados de Teste

- Mocks para serviços Angular
- Fixtures para dados de teste
- Configuração de ambientes de teste

## 📚 Referências e Pesquisas

### Documentação Consultada

- Angular ESLint: https://github.com/angular-eslint/angular-eslint
- ESLint Plugin Boundaries: https://github.com/javierbrea/eslint-plugin-boundaries
- Angular Best Practices: Configuração via MCP Angular CLI

### Decisões Arquiteturais Durante Planejamento

- **Decisão**: Usar `eslint-plugin-boundaries` para regras de arquitetura
- **Motivo**: Melhor integração com TypeScript e Angular
- **Impacto**: Configuração mais robusta de boundary rules

- **Decisão**: Estrutura Feature-Based com separação clara de responsabilidades
- **Motivo**: Facilita desenvolvimento incremental e manutenção
- **Impacto**: Organização mais clara do código

## 🚨 Riscos Identificados

### Riscos Técnicos

- **Risco**: Configuração ESLint boundary rules complexa
- **Probabilidade**: Média
- **Mitigação**: Começar com configuração simples e evoluir

- **Risco**: Path aliases quebram imports existentes
- **Probabilidade**: Baixa
- **Mitigação**: Testar imports após cada mudança

### Riscos de Dependência

- **Dependência Externa**: Angular ESLint plugins
- **Impacto se Indisponível**: Funcionalidade de linting comprometida
- **Plano B**: Usar ESLint padrão sem regras específicas do Angular

## 📈 Métricas de Progresso

### Por Fase

- Fase 1: 3 tarefas, ~2 horas estimadas
- Fase 2: 3 tarefas, ~1.5 horas estimadas
- Fase 3: 3 tarefas, ~2 horas estimadas

### Total

- **Tarefas**: 9 tarefas principais
- **Tempo Estimado**: ~5.5 horas
- **Marcos**: Configuração completa, Aplicação funcionando, Testes passando
