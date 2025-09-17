# Engineer Start

Este é o comando para iniciar o desenvolvimento de uma funcionalidade baseada em especificações e arquitetura aprovadas.

## Argumentos da Sessão

<feature_slug>
#$ARGUMENTS
</feature_slug>

## Objetivo

Estabelecer o contexto inicial de desenvolvimento, criar documentação de sessão e preparar o ambiente para implementação estruturada.
<feature_slug> se refere ao identificador único da funcionalidade, usado para organizar arquivos e pastas.
Você deve buscar a task correspondente no Jira via MCP para obter os detalhes.
Caso não encontre, páre e informe ao usuário.

## ⚠️ AÇÃO IMEDIATA OBRIGATÓRIA

**ANTES DE QUALQUER COISA**: Execute automaticamente a criação da feature branch (Seção 0)

## Processo de Inicialização

### 0. Execução Automática Inicial - PRIMEIRA AÇÃO OBRIGATÓRIA

**CRÍTICO**: Execute IMEDIATAMENTE estas ações no início, antes de qualquer outra operação:

#### Passo 1: Verificação e Criação Automática de Branch

**EXECUTE AUTOMATICAMENTE - NÃO PERGUNTE AO USUÁRIO:**

```bash
# 1. Verificar branch atual
git branch --show-current

# 2. Verificar se está em master/main
git status
```

**REGRA DE CRIAÇÃO DE BRANCH:**
- Se estiver em `master` ou `main`: **CRIAR AUTOMATICAMENTE** a feature branch
- Se já estiver em branch com prefixo `feature-`: **CONTINUAR** na branch atual
- Se estiver em outra branch: **INFORMAR** ao usuário e pedir orientação

**EXECUÇÃO AUTOMÁTICA:**
```bash
# Se estiver em master/main, executar AUTOMATICAMENTE:
git checkout -b feature-<feature_slug>
```

**FORMATO DA BRANCH:** `feature-<feature_slug>` (onde feature_slug é o argumento da sessão)

**NÃO PERGUNTE** - Execute diretamente. Apenas informe: "Criando feature branch `feature-<feature_slug>`"

#### Exemplos de Execução:

**Cenário 1 - Em master/main:**
```bash
# Branch atual: master
git checkout -b feature-user-authentication
# Informa: "Criando feature branch `feature-user-authentication`"
```

**Cenário 2 - Já em feature branch:**
```bash
# Branch atual: feature-user-authentication
# Informa: "Continuando na feature branch `feature-user-authentication`"
```

**Cenário 3 - Em outra branch:**
```bash
# Branch atual: develop ou hotfix-xxx
# Informa: "Você está na branch `develop`. Deseja continuar aqui ou criar uma feature branch?"
```

### 1. Configuração da Sessão

- Crie a pasta `.claude/sessions/<feature_slug>` se não existir
- Solicite ao usuário o input desta sessão (issues, cards, especificações)
- Organize os materiais de referência necessários

### 2. Análise dos Requisitos

Analise os materiais fornecidos e construa entendimento sobre:

#### Contexto e Motivação

- **Por que** esta funcionalidade está sendo desenvolvida?
- Qual problema está sendo resolvido?
- Qual o valor esperado?

#### Escopo e Definição

- **O que** exatamente deve ser desenvolvido?
- Quais são os requisitos funcionais?
- Que comportamentos são esperados?

#### Abordagem Técnica

- **Como** deve ser implementado?
- Que padrões arquiteturais seguir?
- Quais tecnologias e bibliotecas usar?

#### Critérios de Sucesso

- Como validar que a implementação está correta?
- Que testes são necessários?
- Quais são os critérios de aceitação?

#### Dependências e Restrições

- Que outros sistemas são afetados?
- Existem limitações técnicas?
- Há dependências externas?

### 3. Esclarecimentos Estratégicos

Formule **3-5 perguntas críticas** para esclarecer aspectos não cobertos:

- Detalhes de implementação ambíguos
- Decisões arquiteturais necessárias
- Trade-offs que precisam ser considerados
- Integrações com sistemas existentes

**IMPORTANTE**: Aguarde as respostas antes de prosseguir.

### 4. Validação do Entendimento

Após obter esclarecimentos, documente seu entendimento no arquivo `.claude/sessions/<feature_slug>/context.md`:

## Template do Context.md

```markdown
# [NOME DA FUNCIONALIDADE] - Contexto de Desenvolvimento

## 🎯 Objetivo

[Descrição clara do que será desenvolvido e por quê]

## 📋 Requisitos Funcionais

### Funcionalidades Principais

- [Funcionalidade 1]: [Descrição]
- [Funcionalidade 2]: [Descrição]

### Comportamentos Esperados

- [Comportamento 1]: [Descrição]
- [Comportamento 2]: [Descrição]

## 🏗️ Considerações Técnicas

### Arquitetura

[Abordagem arquitetural definida]

### Tecnologias e Dependências

- [Tecnologia/Lib]: [Uso específico]

### Padrões a Seguir

[Convenções e padrões do projeto]

## 🧪 Estratégia de Testes

### Testes Necessários

- [Tipo de teste]: [Escopo]

### Critérios de Aceitação

- [ ] [Critério 1]
- [ ] [Critério 2]

## 🔗 Dependências e Impactos

### Sistemas Afetados

[Lista de componentes impactados]

### Integrações Necessárias

[APIs, serviços, módulos]

## 🚧 Restrições e Considerações

### Limitações Técnicas

[Restrições identificadas]

### Riscos

[Possíveis problemas e mitigações]

## 📚 Referências

- Issue/Card: [Link ou identificador]
- Especificação: [Localização]
- Arquitetura: [Documentos relacionados]
```

**Solicite revisão e aprovação** do usuário antes de continuar.

### 5. Atualização de Requisitos

Se a análise revelar necessidade de ajustes:

- Solicite permissão para editar requisitos/especificações
- Faça ajustes estruturais ou adicione esclarecimentos
- Atualize no sistema de gestão de tarefas configurado

### 6. Preparação para Arquitetura

Com o contexto aprovado, proceda ao desenvolvimento da arquitetura técnica detalhada.

#### Análise do Código Existente

- Examine arquivos relevantes no projeto
- Identifique padrões e estruturas similares
- Analise implementações de referência

#### Consulta às Meta Specs

- Revise diretrizes técnicas em **{META_SPECS_REPOSITORY}**
- Confirme alinhamento com padrões arquiteturais
- Identifique convenções obrigatórias

#### Pesquisa de Dependências

- Use **Context7** para documentação de bibliotecas
- Consulte **Web Search** para melhores práticas
- Valide APIs e integrações necessárias

### 7. Documentação da Arquitetura

Crie o arquivo `.claude/sessions/<feature_slug>/architecture.md`:

## Template do Architecture.md

```markdown
# [NOME DA FUNCIONALIDADE] - Arquitetura Técnica

## 🏗️ Visão Geral da Implementação

### Estado Atual

[Como o sistema está hoje]

### Mudanças Propostas

[O que será modificado/adicionado]

### Impactos

[Sistemas e componentes afetados]

## 🔧 Componentes e Estrutura

### Arquivos Principais a Modificar

- `[arquivo.ext]`: [Tipo de mudança e justificativa]

### Novos Arquivos a Criar

- `[novo_arquivo.ext]`: [Propósito e responsabilidade]

### Estrutura de Diretórios

[Organização proposta se relevante]

## 🏛️ Padrões Arquiteturais

### Padrões Seguidos

[Convenções do projeto mantidas]

### Decisões Arquiteturais

- **Decisão**: [Escolha técnica]
- **Alternativas**: [Outras opções]
- **Justificativa**: [Razão da escolha]

## 📦 Dependências e Integrações

### Dependências Existentes

[Bibliotecas já utilizadas]

### Novas Dependências

- **[Biblioteca]**: [Uso e justificativa]

### Integrações

- **[Sistema/API]**: [Como integrar]

## 🔄 Fluxo de Dados

[Como os dados fluem pela implementação]

## 🧪 Considerações de Teste

### Testes Unitários

[Componentes que precisam de testes]

### Testes de Integração

[Integrações a validar]

### Mocks e Fixtures

[Dados de teste necessários]

## ⚖️ Trade-offs e Riscos

### Trade-offs Aceitos

[Compromissos técnicos]

### Riscos Identificados

[Possíveis problemas e mitigações]

## 📋 Lista de Implementação

- [ ] [Tarefa técnica específica]
- [ ] [Outra tarefa]

## 📚 Referências

- [Meta Specs]: [Links relevantes]
- [Documentação]: [APIs, bibliotecas]
- [Exemplos]: [Código similar no projeto]
```

**Solicite aprovação** da arquitetura antes de finalizar.

### 8. Finalização

Após todas as aprovações:

- Confirme que ambos os arquivos estão completos e aprovados
- Atualize o status no sistema de gestão de tarefas
- Informe ao usuário que está pronto para o próximo passo: **planejamento** (`/plan`)

## Ferramentas de Pesquisa

- **MCP Code Understanding**: Para análise de repositórios
- **Context7**: Para documentação de bibliotecas
- **Web Search**: Para melhores práticas e exemplos
- **GitHub MCP**: Para análise de código e issues

## Próximos Passos

Após completion do `/start`:

1. **Planejamento** (`/plan`) - Quebra em etapas de implementação
2. **Desenvolvimento** (`/work`) - Execução das etapas
3. **Revisão** (`/pre-pr`) - Validações antes do PR
4. **Pull Request** (`/pr`) - Finalização e submissão
