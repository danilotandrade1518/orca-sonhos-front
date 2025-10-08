# Setup Inicial do Projeto Angular - OrçaSonhos - Contexto de Desenvolvimento

# OS-218

## 🎯 Objetivo

Configurar a fundação técnica completa do projeto Angular OrçaSonhos com arquitetura Feature-Based, estabelecendo uma base sólida para desenvolvimento incremental de features. Este é um card crítico que bloqueia o desenvolvimento de todas as outras funcionalidades.

## 📋 Requisitos Funcionais

### Funcionalidades Principais

- **Configuração Angular 20+**: Setup completo com standalone components e arquitetura moderna
- **Arquitetura Feature-Based**: Estrutura de pastas organizada para desenvolvimento incremental
- **Sistema de Path Aliases**: Configuração de aliases (@app, @core, @shared, @features, @dtos) para organização
- **TypeScript Strict Mode**: Configuração rigorosa para type safety
- **ESLint com Boundary Rules**: Regras de arquitetura limpa para manter separação de responsabilidades
- **Roteamento com Lazy Loading**: Configuração base para performance otimizada
- **Testes Unitários**: Setup com Karma + Jasmine
- **Prettier**: Formatação consistente de código
- **Environments**: Configuração para dev, test e prod

### Comportamentos Esperados

- Aplicação inicia sem erros (`ng serve`)
- Build de produção funciona (`ng build`)
- Testes unitários executam corretamente
- Linting funciona com regras de boundary
- Path aliases funcionam corretamente
- Formatação automática com Prettier

## 🏗️ Considerações Técnicas

### Arquitetura

**Estado Atual Identificado:**

- Angular 20.2.0 já configurado com standalone components ✅
- TypeScript strict mode ativado ✅
- Prettier configurado ✅
- Estrutura básica de app criada ✅
- Path aliases parciais configurados (@app, @either) ⚠️

**Mudanças Necessárias:**

- Completar path aliases (@core, @shared, @features, @dtos)
- Configurar ESLint com regras de boundary
- Criar estrutura Feature-Based completa
- Configurar roteamento com lazy loading
- Configurar environments (dev, test, prod)
- Configurar testes unitários base

### Tecnologias e Dependências

- **Angular 20.2.0**: Framework principal (já instalado)
- **TypeScript 5.9.2**: Linguagem (já configurado)
- **Angular Material 20.2.3**: UI Components (já instalado)
- **ESLint**: Linting com regras de boundary (a configurar)
- **Karma + Jasmine**: Testes unitários (já instalado, configurar)
- **Prettier**: Formatação (já configurado)

### Padrões a Seguir

- Standalone components
- Feature-Based Architecture
- Path aliases para organização
- Strict TypeScript
- ESLint boundary rules
- Lazy loading para performance

## 🧪 Estratégia de Testes

### Testes Necessários

- **Testes Unitários Base**: Configuração do Karma + Jasmine
- **Validação de Build**: Testes de build para dev e prod
- **Validação de Linting**: Verificação de regras ESLint
- **Validação de Path Aliases**: Teste de importação com aliases

### Critérios de Aceitação

- [ ] Angular 20+ configurado com standalone components
- [ ] TypeScript strict mode ativado
- [ ] ESLint com regras de boundary configurado
- [ ] Path aliases configurados (@app, @core, @shared, @features, @dtos)
- [ ] Estrutura de pastas Feature-Based criada
- [ ] Roteamento base com lazy loading configurado
- [ ] Testes unitários base (Karma + Jasmine) funcionando
- [ ] Prettier e formatação de código configurados
- [ ] Configuração de environments (prod, dev, test) com variáveis específicas
- [ ] Validação de configurações por ambiente
- [ ] Documentação de variáveis de ambiente
- [ ] Aplicação inicia sem erros (`ng serve`)
- [ ] Build de produção funciona (`ng build`)

## 🔗 Dependências e Impactos

### Sistemas Afetados

- **Estrutura de Pastas**: Reorganização completa do src/
- **Configuração TypeScript**: Atualização de path aliases
- **Configuração Angular**: Adição de ESLint e environments
- **Package.json**: Possível adição de dependências de desenvolvimento

### Integrações Necessárias

- ESLint com regras de boundary
- Configuração de environments
- Setup de testes unitários

## 🚧 Restrições e Considerações

### Limitações Técnicas

- Deve manter compatibilidade com Angular 20+
- Deve seguir padrões de standalone components
- Deve manter TypeScript strict mode

### Riscos

- **Configuração Complexa**: ESLint boundary rules podem ser complexas
- **Path Aliases**: Configuração incorreta pode quebrar imports
- **Environments**: Configuração inadequada pode afetar builds

## 📚 Referências

- Issue/Card: OS-218 - Setup Inicial do Projeto Angular - OrçaSonhos
- Meta Specs: /home/danilo/workspace/projeto-orca-sonhos/orca-sonhos-meta-specs
- Angular Docs: https://angular.dev
- ESLint Angular Plugin: https://github.com/angular-eslint/angular-eslint
