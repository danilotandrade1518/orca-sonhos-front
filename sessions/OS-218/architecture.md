# Setup Inicial do Projeto Angular - OrçaSonhos - Arquitetura Técnica

## 🏗️ Visão Geral da Implementação

### Estado Atual

O projeto já possui uma base Angular 20.2.0 configurada com:

- ✅ Angular 20+ com standalone components
- ✅ TypeScript strict mode ativado
- ✅ Prettier configurado
- ✅ Estrutura básica de app criada
- ✅ Path aliases parciais (@app, @either)
- ✅ Angular Material instalado
- ✅ Karma + Jasmine instalados

### Mudanças Propostas

Completar a configuração inicial adicionando:

- Configuração completa de path aliases (@core, @shared, @features, @dtos)
- ESLint com regras de boundary para arquitetura limpa
- Estrutura Feature-Based completa
- Roteamento com lazy loading
- Configuração de environments (dev, test, prod)
- Setup de testes unitários base

### Impactos

- **Estrutura de Pastas**: Reorganização completa do src/ para Feature-Based
- **Configuração TypeScript**: Atualização de path aliases
- **Configuração Angular**: Adição de ESLint e environments
- **Package.json**: Adição de dependências de desenvolvimento

## 🔧 Componentes e Estrutura

### Arquivos Principais a Modificar

- `tsconfig.json`: Adicionar path aliases completos (@core, @shared, @features, @dtos)
- `angular.json`: Configurar environments e otimizações
- `package.json`: Adicionar scripts de lint e dependências ESLint
- `src/app/app.routes.ts`: Configurar roteamento base com lazy loading

### Novos Arquivos a Criar

- `eslint.config.js`: Configuração ESLint com regras de boundary
- `src/environments/environment.ts`: Configuração de desenvolvimento
- `src/environments/environment.prod.ts`: Configuração de produção
- `src/environments/environment.test.ts`: Configuração de testes
- `src/core/`: Diretório para serviços, guards, interceptors
- `src/shared/`: Diretório para componentes e utilitários compartilhados
- `src/features/`: Diretório para features independentes
- `src/dtos/`: Diretório para Data Transfer Objects

### Estrutura de Diretórios

```
src/
├── app/
│   ├── core/           # Serviços, guards, interceptors
│   ├── shared/         # Componentes e utilitários compartilhados
│   ├── features/       # Features independentes
│   ├── app.config.ts
│   ├── app.routes.ts
│   └── app.ts
├── environments/       # Configurações por ambiente
├── dtos/              # Data Transfer Objects
└── assets/            # Recursos estáticos
```

## 🏛️ Padrões Arquiteturais

### Padrões Seguidos

- **Standalone Components**: Uso exclusivo de standalone components
- **Feature-Based Architecture**: Organização por features independentes
- **Path Aliases**: Organização através de aliases de importação
- **Strict TypeScript**: Type safety rigoroso
- **ESLint Boundary Rules**: Separação de responsabilidades

### Decisões Arquiteturais

- **Decisão**: Usar ESLint com regras de boundary
- **Alternativas**: TSLint (deprecated), sem linting
- **Justificativa**: Manter arquitetura limpa e separação de responsabilidades

- **Decisão**: Estrutura Feature-Based
- **Alternativas**: Estrutura por tipo de arquivo, estrutura monolítica
- **Justificativa**: Facilita desenvolvimento incremental e manutenção

- **Decisão**: Path aliases para organização
- **Alternativas**: Imports relativos, imports absolutos longos
- **Justificativa**: Melhora legibilidade e facilita refatoração

## 📦 Dependências e Integrações

### Dependências Existentes

- Angular 20.2.0 (framework principal)
- TypeScript 5.9.2 (linguagem)
- Angular Material 20.2.3 (UI components)
- Karma + Jasmine (testes unitários)
- Prettier (formatação)

### Novas Dependências

- **@angular-eslint/builder**: Builder para ESLint no Angular
- **@angular-eslint/eslint-plugin**: Plugin ESLint para Angular
- **@angular-eslint/eslint-plugin-template**: Plugin para templates Angular
- **@angular-eslint/schematics**: Schematics para configuração automática
- **eslint**: Core do ESLint

### Integrações

- **ESLint + Angular**: Integração para linting de código TypeScript e templates
- **Environments**: Configuração de variáveis por ambiente
- **Path Aliases**: Integração com TypeScript para resolução de módulos

## 🔄 Fluxo de Dados

1. **Configuração Inicial**: ESLint e environments configurados
2. **Estrutura de Pastas**: Criação da estrutura Feature-Based
3. **Path Aliases**: Configuração no tsconfig.json
4. **Roteamento**: Configuração de lazy loading
5. **Validação**: Testes de build e linting

## 🧪 Considerações de Teste

### Testes Unitários

- Configuração base do Karma + Jasmine
- Testes de componentes standalone
- Testes de serviços
- Testes de guards e interceptors

### Testes de Integração

- Validação de path aliases
- Validação de roteamento
- Validação de environments

### Mocks e Fixtures

- Mocks para serviços Angular
- Fixtures para dados de teste
- Configuração de ambientes de teste

## ⚖️ Trade-offs e Riscos

### Trade-offs Aceitos

- **Complexidade Inicial**: Configuração mais complexa para benefícios futuros
- **Curva de Aprendizado**: Time precisa aprender ESLint boundary rules
- **Overhead**: Mais arquivos de configuração para manter

### Riscos Identificados

- **Configuração ESLint**: Regras de boundary podem ser complexas de configurar
- **Path Aliases**: Configuração incorreta pode quebrar imports
- **Environments**: Configuração inadequada pode afetar builds
- **Migração**: Mudança de estrutura pode quebrar código existente

## 📋 Lista de Implementação

- [ ] Instalar dependências ESLint
- [ ] Configurar ESLint com regras de boundary
- [ ] Completar path aliases no tsconfig.json
- [ ] Criar estrutura de diretórios Feature-Based
- [ ] Configurar environments (dev, test, prod)
- [ ] Configurar roteamento com lazy loading
- [ ] Configurar testes unitários base
- [ ] Validar configurações com build
- [ ] Documentar configurações
- [ ] Testar aplicação (`ng serve`)
- [ ] Testar build de produção (`ng build`)

## 📚 Referências

- Meta Specs: https://github.com/danilotandrade1518/orca-sonhos-meta-specs
- Angular Docs: https://angular.dev
- ESLint Angular Plugin: https://github.com/angular-eslint/angular-eslint
- Angular Best Practices: Configuração via MCP Angular CLI
