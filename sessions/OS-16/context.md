# Implementar Camada Application para Entidades Restantes do Domínio - Contexto de Desenvolvimento

# OS-16

## 🎯 Objetivo

Implementar a camada Application completa para as 6 entidades restantes do domínio (Account, Category, CreditCard, Envelope, Goal, Transaction) seguindo os mesmos padrões arquiteturais já estabelecidos para Budget, garantindo consistência e preparando a base para futuras implementações de UI.

## 📋 Requisitos Funcionais

### Funcionalidades Principais

- **Account Management**: Criação, atualização, listagem e remoção de contas financeiras
- **Category Management**: Gestão de categorias de transações (receitas e despesas)
- **CreditCard Management**: Administração de cartões de crédito vinculados a orçamentos
- **Envelope Management**: Gestão de envelopes de orçamento para categorias específicas
- **Goal Management**: Administração de metas financeiras vinculadas a orçamentos
- **Transaction Management**: Gestão de transações financeiras (receitas e despesas)

### Comportamentos Esperados

- **Padrão CQRS**: Separação clara entre Commands (Use Cases) e Queries (Query Handlers)
- **Either Pattern**: Tratamento consistente de erros em todas as operações
- **Validação de Entrada**: Validação robusta de DTOs antes do processamento
- **Mapeamento de Dados**: Conversão entre Domain Models e DTOs
- **Interface Segregation**: Ports específicos por operação (máximo 5 métodos)

## 🏗️ Considerações Técnicas

### Arquitetura

**Clean Architecture** com separação clara de responsabilidades:

- **Use Cases**: Lógica de negócio e orquestração
- **Query Handlers**: Consultas e recuperação de dados
- **Ports**: Interfaces para comunicação com camadas externas
- **DTOs**: Contratos de entrada e saída
- **Mappers**: Conversão entre camadas

### Tecnologias e Dependências

- **TypeScript Puro**: Sem dependências Angular na camada Application
- **Either Pattern**: Para tratamento de erros (`@either`)
- **Domain Models**: Entidades já existentes (`@models/*`)
- **Value Objects**: Money, Uuid, Email (`@models/shared/value-objects`)

### Padrões a Seguir

**Consistência com Budget**:

- Estrutura de diretórios idêntica
- Nomenclatura padronizada
- Padrões de validação
- Tratamento de erros
- Estratégia de testes

**Convenções Estabelecidas**:

- DTOs com sufixo `RequestDto` e `ResponseDto`
- Use Cases com sufixo `UseCase`
- Query Handlers com sufixo `QueryHandler`
- Ports com sufixo `Port`
- Mappers com sufixo `Mapper`

## 🧪 Estratégia de Testes

### Testes Necessários

- **Testes Unitários**: 100% cobertura para todos os Use Cases e Query Handlers
- **Testes de Mappers**: Validação de conversões entre DTOs e Domain Models
- **Testes de Validação**: Verificação de regras de negócio
- **Mocks Reutilizáveis**: Factories para criação de dados de teste

### Critérios de Aceitação

- [ ] 6 entidades com camada Application completa
- [ ] Padrão CQRS implementado (Commands e Queries separados)
- [ ] Either pattern para tratamento de erros
- [ ] 100% cobertura de testes unitários
- [ ] TypeScript puro (sem dependências Angular)
- [ ] Clean Architecture respeitada
- [ ] Ports & Adapters pattern
- [ ] Interface Segregation Principle
- [ ] Consistência com padrões de Budget
- [ ] Documentação de API pública
- [ ] Testes com mocks reutilizáveis
- [ ] Validação de entrada em todos os Use Cases

## 🔗 Dependências e Impactos

### Sistemas Afetados

- **Estrutura de Diretórios**: Criação de novos diretórios em `/src/application/`
- **Index Files**: Atualização de exports em todos os níveis
- **Domain Models**: Utilização das entidades existentes
- **Either Pattern**: Uso consistente do padrão de tratamento de erros

### Integrações Necessárias

- **Futuras Implementações de UI**: Preparação para injeção de dependência
- **Infrastructure Layer**: Implementação futura dos Ports
- **Backend HTTP APIs**: Comunicação via Ports (não implementada nesta fase)

## 🚧 Restrições e Considerações

### Limitações Técnicas

- **TypeScript Puro**: Nenhuma dependência externa adicional
- **Padrões Existentes**: Manter consistência com implementação de Budget
- **Domain Models**: Utilizar apenas entidades já existentes

### Riscos

- **Inconsistência Arquitetural**: Risco de desvio dos padrões estabelecidos
- **Duplicação de Código**: Necessidade de manter padrões consistentes
- **Complexidade de Testes**: Muitos componentes para testar

### Mitigações

- **Templates e Padrões**: Reutilizar estruturas de Budget como base
- **Validação Contínua**: Verificar consistência durante implementação
- **Testes Automatizados**: Garantir qualidade através de testes

## 📚 Referências

- **Issue Jira**: OS-16 - Implementar Camada Application para Entidades Restantes do Domínio
- **Implementação Budget**: `/src/application/use-cases/budget/`
- **Domain Models**: `/src/models/`
- **Either Pattern**: `/src/shared/core/either/`
- **Meta Specs**: https://github.com/danilotandrade1518/orca-sonhos-meta-specs

## 🎯 Entidades Alvo

### 1. Account

- **Propósito**: Contas financeiras (corrente, poupança, investimento, dinheiro)
- **Operações**: Create, Update, Delete, List, GetById
- **Relacionamentos**: Budget (obrigatório)

### 2. Category

- **Propósito**: Categorias de transações (receitas e despesas)
- **Operações**: Create, Update, Delete, List, GetById
- **Relacionamentos**: Budget (obrigatório)

### 3. CreditCard

- **Propósito**: Cartões de crédito vinculados a orçamentos
- **Operações**: Create, Update, Delete, List, GetById
- **Relacionamentos**: Budget (obrigatório)

### 4. Envelope

- **Propósito**: Envelopes de orçamento para categorias específicas
- **Operações**: Create, Update, Delete, List, GetById
- **Relacionamentos**: Budget (obrigatório), Category (obrigatório)

### 5. Goal

- **Propósito**: Metas financeiras vinculadas a orçamentos
- **Operações**: Create, Update, Delete, List, GetById
- **Relacionamentos**: Budget (obrigatório)

### 6. Transaction

- **Propósito**: Transações financeiras (receitas e despesas)
- **Operações**: Create, Update, Delete, List, GetById
- **Relacionamentos**: Account (obrigatório), Category (obrigatório)

## 📋 Ordem de Implementação

1. **Account** - Base para transações
2. **Category** - Necessária para transações
3. **Transaction** - Core do sistema financeiro
4. **Envelope** - Gestão de orçamento por categoria
5. **Goal** - Metas financeiras
6. **CreditCard** - Cartões de crédito
