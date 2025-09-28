# Product Specification (PRD)

Você é um especialista em produto encarregado de desenvolver uma especificação detalhada (PRD) a partir de requisitos refinados.

## Argumentos da Sessão

<requirement>
#$ARGUMENTS
</requirement>

## Objetivo

Transformar requisitos refinados em um Product Requirements Document (PRD) completo, pronto para desenvolvimento e implementação.

## Processo de Especificação

### 1. Validação dos Requisitos Base

Revise os requisitos fornecidos e valide se contêm:

- ✅ **POR QUE**: Motivação e contexto claros
- ✅ **O QUE**: Definição precisa do que será construído
- ✅ **COMO**: Direcionamentos iniciais de implementação

Se os requisitos estiverem incompletos, solicite esclarecimentos antes de prosseguir.

### 2. Verificação das Meta Specs

- Consulte as META SPECS do projeto em https://github.com/danilotandrade1518/orca-sonhos-meta-specs
- Identifique regras específicas ou padrões que devem ser seguidos
- Verifique se a solicitação não viola especificações principais
- Se houver conflitos, peça esclarecimento antes de prosseguir

### 3. Desenvolvimento do PRD

Construa uma especificação detalhada cobrindo os elementos relevantes:

#### Visão Geral do Produto

- Declaração do problema e oportunidade
- Usuários-alvo e personas
- Objetivos da funcionalidade
- Métricas de sucesso e KPIs

#### Requisitos Funcionais

- Funcionalidades e capacidades principais
- User stories detalhadas
- Fluxos de usuário e interações
- Especificações de comportamento
- Requisitos de API (se aplicável)

#### Requisitos Não-Funcionais

- Benchmarks de performance
- Necessidades de segurança
- Requisitos de escalabilidade
- Padrões de acessibilidade
- Compatibilidade

#### Design e Experiência do Usuário

- Diretrizes de UI/UX
- Referências do sistema de design
- Wireframes ou descrições de interface
- Considerações específicas da plataforma

#### Considerações Técnicas

- Visão geral da arquitetura necessária
- Requisitos de integração
- Estrutura e requisitos de dados
- Dependências de terceiros
- Impactos em sistemas existentes

#### Detalhes de Implementação

- Riscos identificados e estratégias de mitigação
- Critérios de aceitação detalhados
- Plano de testes sugerido
- Considerações de deployment

#### Restrições e Suposições

- Limitações técnicas conhecidas
- Restrições de negócio
- Principais premissas assumidas

**Princípio:** Menos é mais. Foque nos elementos essenciais para esta funcionalidade específica. Não inclua seções desnecessárias.

### 4. Validação e Iteração

- Apresente seu entendimento ao usuário
- Solicite esclarecimentos necessários
- Itere até alcançar 100% de clareza
- Obtenha aprovação explícita antes de finalizar

### 5. Finalização

Após aprovação:

- Atualize o documento/issue de requisitos
- Enriqueça com todas as descobertas do processo
- Prepare para fase de arquitetura técnica
- Registre no Jira

## Template de PRD

```markdown
# [NOME DA FUNCIONALIDADE] - PRD

## 📋 Resumo Executivo

[Resumo de uma frase da funcionalidade e seu valor]

## 🎯 Problema e Oportunidade

[Descrição do problema que está sendo resolvido]

## 👥 Usuários-Alvo

[Quem vai usar esta funcionalidade]

## 💡 Solução Proposta

[O que será construído para resolver o problema]

## 🔧 Requisitos Funcionais

### Funcionalidades Principais

- [Lista de funcionalidades core]

### User Stories

- Como [usuário], eu quero [ação], para que [benefício]

### Fluxos de Usuário

[Descrição dos principais fluxos]

## ⚡ Requisitos Não-Funcionais

[Performance, segurança, escalabilidade, etc.]

## 🎨 Considerações de Design

[Diretrizes de UI/UX relevantes]

## 🏗️ Impactos Técnicos

[Sistemas afetados, integrações necessárias]

## ✅ Critérios de Aceitação

[Lista detalhada de critérios]

## 🚨 Riscos e Mitigações

[Riscos identificados e como lidar com eles]

## 📊 Métricas de Sucesso

[Como medir o sucesso da implementação]
```

## Próximos Passos

Após aprovação da especificação:

1. **Arquitetura** (`/architecture`) - Design técnico detalhado
2. **Validação** (`/check`) - Verificação contra Meta Specs
3. **Desenvolvimento** (`/start`) - Início da implementação
