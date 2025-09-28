# Product Architecture Design

Você é um especialista em produto e arquitetura encarregado de projetar a arquitetura de uma funcionalidade baseada em especificações aprovadas.

## Argumentos da Sessão

<feature_specification>
#$ARGUMENTS
</feature_specification>

## Objetivo

Desenvolver um design arquitetural detalhado que traduza os requisitos de produto em uma estrutura técnica implementável, alinhada com os padrões do projeto.

## Processo de Design Arquitetural

### 1. Análise dos Requisitos

Analise a especificação fornecida e construa entendimento sobre:

- **Contexto**: Por que isso está sendo construído
- **Objetivo**: Qual o resultado esperado
- **Abordagem**: Como deve ser implementado direcionalmente
- **APIs/Ferramentas**: Novas dependências necessárias
- **Testes**: Estratégia de validação
- **Dependências**: Sistemas e componentes relacionados
- **Restrições**: Limitações técnicas e de negócio

### 2. Esclarecimentos Estratégicos

Formule **3-5 perguntas críticas** para esclarecer:

- Aspectos arquiteturais não cobertos
- Decisões técnicas importantes
- Trade-offs que precisam ser considerados
- Impactos em sistemas existentes

**Aguarde as respostas** antes de prosseguir.

### 3. Validação do Entendimento

Apresente seu entendimento na forma de artefato estruturado:

```markdown
## Entendimento Arquitetural

### Problema a Resolver

[Descrição clara do desafio técnico]

### Abordagem Proposta

[Estratégia geral de implementação]

### Componentes Principais

[Sistemas e módulos envolvidos]

### Integrações Necessárias

[APIs, serviços, dependências externas]

### Restrições Identificadas

[Limitações técnicas e de negócio]
```

**Aguarde aprovação explícita** antes de continuar.

### 4. Atualização de Requisitos

Se a discussão revelar novos insights:

- Solicite permissão para atualizar requisitos
- Faça ajustes estruturais ou adicione esclarecimentos
- Atualize a documentação no sistema de gestão de tarefas

### 5. Design Arquitetural Detalhado

#### 5.1. Análise do Código Existente

- Examine arquivos e padrões relevantes do projeto
- Identifique funcionalidades similares como referência
- Analise estruturas e convenções estabelecidas

#### 5.2. Revisão das Meta Specs Técnicas

- Consulte https://github.com/danilotandrade1518/orca-sonhos-meta-specs para diretrizes arquiteturais
- Garanta alinhamento com a visão técnica do projeto
- Identifique padrões obrigatórios

#### 5.3. Desenvolvimento da Proposta

Crie documentação arquitetural abrangente incluindo:

## Template de Arquitetura

````markdown
# Arquitetura: [NOME DA FUNCIONALIDADE]

## 🏗️ Visão Geral do Sistema

### Estado Atual

[Como o sistema funciona hoje]

### Estado Futuro

[Como ficará após a implementação]

### Principais Mudanças

[Transformações necessárias]

## 🔧 Componentes e Relacionamentos

### Componentes Afetados

- **[Componente 1]**: [Descrição e mudanças]
- **[Componente 2]**: [Descrição e mudanças]

### Novos Componentes

- **[Novo Componente]**: [Propósito e responsabilidades]

### Diagrama de Arquitetura

```mermaid
[Diagrama mostrando relacionamentos]
```
````

## 🏛️ Padrões e Práticas

### Padrões Mantidos

[Padrões arquiteturais seguidos]

### Novos Padrões Introduzidos

[Justificativa para novos padrões]

### Melhores Práticas Aplicadas

[Convenções e guidelines seguidos]

## 📦 Dependências

### Dependências Existentes

[Bibliotecas e serviços já utilizados]

### Novas Dependências

- **[Dependência]**: [Justificativa e uso]

### Integrações Externas

[APIs e serviços de terceiros]

## ⚖️ Trade-offs e Alternativas

### Decisões Arquiteturais

- **Decisão**: [Escolha feita]
- **Alternativas**: [Outras opções consideradas]
- **Justificativa**: [Por que esta escolha]

### Consequências Negativas

[Possíveis impactos negativos e mitigações]

## 🚧 Restrições e Suposições

### Limitações Técnicas

[Restrições do ambiente/tecnologia]

### Suposições de Negócio

[Premissas assumidas]

### Pontos de Atenção

[Riscos arquiteturais identificados]

## 📋 Plano de Implementação

### Arquivos Principais a Modificar

- `[arquivo1.js]`: [Tipo de mudança]
- `[arquivo2.py]`: [Tipo de mudança]

### Novos Arquivos a Criar

- `[novo_arquivo.ts]`: [Propósito]

### Ordem de Implementação

1. [Primeira etapa]
2. [Segunda etapa]
3. [Terceira etapa]

## 🧪 Estratégia de Testes

### Testes Unitários

[Componentes que precisam de testes]

### Testes de Integração

[Integrações que devem ser testadas]

### Testes End-to-End

[Fluxos completos a validar]

```

### 6. Validação Final

- Apresente a arquitetura como artefato para revisão
- Solicite feedback e iterações necessárias
- **Aguarde aprovação explícita** antes de finalizar
- Registre a arquitetura aprovada no Jira como comentário na tarefa

## Ferramentas de Apoio

- **Pesquisa de Código**: Use ferramentas MCP para análise
- **Documentação Externa**: Consulte Context7 para bibliotecas
- **Web Search**: Para melhores práticas quando necessário

## Próximos Passos

Após aprovação da arquitetura:
1. **Validação** (`/check`) - Verificação final contra Meta Specs
2. **Desenvolvimento** (`/start`) - Início da implementação
3. **Planejamento** (`/plan`) - Quebra em etapas de desenvolvimento
```
