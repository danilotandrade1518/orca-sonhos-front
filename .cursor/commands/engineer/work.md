# Engineer Work

Este é o comando para executar o desenvolvimento de uma funcionalidade seguindo o planejamento estabelecido.

## Argumentos da Sessão

<folder>
#$ARGUMENTS
</folder>

## Objetivo

Implementar a funcionalidade seguindo o plano faseado, com foco na qualidade, padrões do projeto e aprovação entre etapas.

## Processo de Desenvolvimento

### 0. Execução Automática Inicial

**OBRIGATÓRIO**: Execute estas ações automaticamente no início:

#### Passo 1: Verificação e Criação de Branch

```bash
# Verificar branch atual
git branch --show-current

# Se não estiver em feature branch, criar uma
# Formato: feature-{nome-da-pasta-da-sessao}
```

Se não estiver em uma feature branch:

1. Pergunte ao usuário: "Posso criar a feature branch `feature-{folder-name}`?"
2. Após confirmação, execute: `git checkout -b feature-{folder-name}`

#### Passo 2: Busca e Atualização do Jira

**_Este passo só deve ser feito se o trabaho ainda não iniciou. Verifique o status do plano para esta informação. Caso o plano já esteja em andamento, ou seja, se alguma fase já iniciou, ignore este passo._**

**Fluxo Automático**:

1. **Buscar Task**: Use `mcp__atlassian__search` com o nome da pasta da sessão
2. **Identificar Transições**: Use `mcp__atlassian__getTransitionsForJiraIssue` para encontrar transição "Em Progresso"
3. **Atualizar Status**: Use `mcp__atlassian__transitionJiraIssue` para fazer a transição
4. **Confirmar**: Informe ao usuário: "✅ Task {KEY} atualizada para 'Em Progresso'"

**Tratamento de Erros**:

- Se não encontrar a task: Pergunte ao usuário qual task deve ser atualizada
- Se não encontrar transição: Informe quais transições estão disponíveis
- Se der erro de permissão: Informe que o usuário deve atualizar manualmente

**Exemplo de Execução**:

```typescript
// 1. Buscar cloudId
const resources = await mcp__atlassian__getAccessibleAtlassianResources();

// 2. Buscar task baseada na pasta da sessão
const searchResults = await mcp__atlassian__search({
  query: '{folder-name}',
});

// 3. Se encontrou, fazer transição
if (searchResults.issues?.length > 0) {
  const issue = searchResults.issues[0];
  const transitions = await mcp__atlassian__getTransitionsForJiraIssue({
    cloudId: resources[0].id,
    issueIdOrKey: issue.key,
  });

  // Encontrar transição para "Em Progresso" / "In Progress"
  const inProgressTransition = transitions.find(
    (t) => t.name.includes('Progress') || t.name.includes('Progresso')
  );

  if (inProgressTransition) {
    await mcp__atlassian__transitionJiraIssue({
      cloudId: resources[0].id,
      issueIdOrKey: issue.key,
      transition: { id: inProgressTransition.id },
    });
  }
}
```

### 1. Preparação da Sessão

#### Análise dos Documentos

Leia todos os arquivos markdown na pasta da sessão:

- **context.md**: Entendimento dos requisitos
- **architecture.md**: Design técnico detalhado
- **plan.md**: Plano faseado de implementação

### 2. Identificação da Fase Atual

- Revise o **plan.md** para identificar qual fase está atualmente em progresso
- Revise o **work-log.md**(caso exista) para entender o que foi feito até agora
- Se nenhuma fase estiver marcada como \"Em Progresso ⏰\", comece pela primeira fase não iniciada
- Apresente ao usuário um plano claro para abordar a próxima fase

### 3. Inicialização do Work Log

Crie o arquivo `sessions/<folder>/work-log.md` se não existir:

## Template do Work-Log.md

```markdown
# [NOME DA FUNCIONALIDADE] - Log de Desenvolvimento

> **Propósito**: Registrar detalhadamente o progresso do desenvolvimento, linha de pensamento, decisões tomadas, problemas encontrados e soluções aplicadas durante as sessões de trabalho.

## 📅 Resumo do Projeto

- **Início**: [Data]
- **Status Atual**: [Em progresso/Pausado/Finalizado]
- **Fase Atual**: [Nome da fase do plan.md]
- **Última Sessão**: [Data da última sessão]

---

## 📋 Sessões de Trabalho

### 🗓️ Sessão [DATA] - [DURAÇÃO]

**Fase**: [Nome da fase trabalhada]
**Objetivo da Sessão**: [O que pretendia alcançar]

#### ✅ Trabalho Realizado

- [Tarefa específica completada]
- [Funcionalidade implementada]
- [Arquivo modificado]: [Tipo de mudança]

#### 🤔 Decisões Técnicas

- **Decisão**: [Escolha feita]
- **Alternativas**: [Outras opções consideradas]
- **Justificativa**: [Razão da decisão]

#### 🚧 Problemas Encontrados

- **Problema**: [Descrição do problema]
- **Solução**: [Como foi resolvido]
- **Lição Aprendida**: [O que aprendeu]

#### 🧪 Testes Realizados

- [Teste 1]: [Resultado]
- [Validação executada]: [Status]

#### 📝 Commits Relacionados

- [hash-commit]: [Descrição do commit]

#### ⏭️ Próximos Passos

- [Próxima tarefa a executar]
- [Item pendente para próxima sessão]

#### 💭 Observações

[Anotações gerais, insights, lembretes]

---

### 🗓️ Sessão [PRÓXIMA DATA] - [DURAÇÃO]

[Template para próxima sessão]

---

## 📊 Resumo de Progresso

### Por Fase

- **Fase 1**: [Status - Completa ✅ / Em progresso ⏰ / Pendente ⏳]
  - Sessões: [Número de sessões]
  - Tempo total: [Horas]
  - Principais realizações: [Lista]

### Métricas Gerais

- **Total de Sessões**: [Número]
- **Tempo Total Investido**: [Horas]
- **Arquivos Modificados**: [Número]
- **Commits Realizados**: [Número]

### Decisões Arquiteturais Importantes

- [Decisão importante 1]: [Resumo e impacto]
- [Decisão importante 2]: [Resumo e impacto]

### Lições Aprendidas

- [Lição 1]: [Descrição]
- [Lição 2]: [Descrição]

## 🔄 Estado de Recovery

### Para Continuação

**Se interrompido, para retomar:**

1. [Passo específico para continuar]
2. [Contexto importante para relembrar]
3. [Arquivos que estavam sendo modificados]

### Contexto Atual

**Branch**: [Nome da branch]
**Última modificação**: [Arquivo e descrição]
**Testes passando**: [Sim/Não - quais falhando]
**Próxima tarefa específica**: [Descrição detalhada]
```

### 4. Execução por Fases

Para cada fase do desenvolvimento:

#### Antes de Começar

- Marque a fase como \"Em Progresso ⏰\" no plan.md
- **Inicie nova sessão** no work-log.md com timestamp
- Revise os critérios de conclusão da fase
- Confirme entendimento das tarefas com o usuário

#### Durante a Implementação

**Princípios de Qualidade:**

- **Código Limpo**: Sem comentários ou instruções temporárias no código final
- **Padrões**: Siga as convenções estabelecidas no projeto
- **Segurança**: Implemente tratamento adequado de erros e validações
- **Manutenibilidade**: Código legível e bem estruturado

**Processo de Revisão Contínua:**
Apply continuous code review seguindo as prioridades:

1. **🎯 Correção** - O código funciona para o caso de uso?
2. **🔒 Segurança** - Há vulnerabilidades ou bugs óbvios?
3. **📖 Clareza** - O código é legível e manutenível?
4. **⚖️ Adequação** - A complexidade está apropriada?

#### Após Completar Tarefas da Fase

**🛑 PAUSE OBRIGATÓRIA**: Solicite validação do usuário antes de prosseguir

- **Atualize work-log.md** com trabalho realizado na sessão
- Apresente o código implementado
- Aguarde aprovação explícita do usuário
- Faça ajustes necessários baseados no feedback
- **Registre decisões/problemas** no work-log.md
- Apenas prossiga após aprovação clara

### 4. Padrões de Code Review

#### Template de Auto-Review

```markdown
## 🔍 Resumo da Implementação

**Fase Completada**: [Nome da fase]
**Arquivos Modificados**: [Lista de arquivos]

### ✅ O que Foi Implementado

- [Funcionalidade 1]: [Descrição do que foi feito]
- [Funcionalidade 2]: [Detalhes da implementação]

### 🧪 Testes Realizados

- [Teste 1]: [Resultado]
- [Teste 2]: [Validação]

### ❗ Pontos de Atenção

- [Decisão técnica importante]
- [Trade-off realizado]

**Status**: Pronto para revisão
```

#### Categorias de Problemas a Identificar

**🚨 Críticos (Sempre corrigir):**

- Bugs funcionais
- Vulnerabilidades de segurança
- Vazamentos de recursos
- Breaking changes não intencionais

**⚠️ Importantes (Corrigir se significativo):**

- Tratamento de erro ausente
- Problemas de performance óbvios
- Legibilidade comprometida
- Over-engineering

**💡 Melhorias (Opcional):**

- Pequenas otimizações
- Consistências de estilo menores

### 5. Estratégia de Testes

#### Princípios Fundamentais

1. **Teste comportamento, não implementação**
2. **Foque em problemas reais, não perfeição teórica**
3. **Teste o código como está, não modifique para se adequar aos testes**

#### Tipos de Testes (por prioridade)

**Testes de Caminho Feliz** (Sempre incluir):

- Casos de uso principais com entradas típicas
- Verificação de saídas esperadas
- Funcionalidade central funcionando

**Testes de Casos Extremos** (Quando relevante):

- Condições de limite (vazios, valores máximos)
- Casos extremos do domínio
- Entradas null/undefined

**Testes de Condições de Erro** (Se existir tratamento):

- Entradas inválidas
- Exceções apropriadas
- Mensagens de erro úteis

### 6. Atualização do Plano

Após completar cada fase:

#### Marcar Conclusão

- Atualize o **plan.md** marcando tarefas como \"Completada ✅\"
- Adicione comentários úteis sobre decisões tomadas
- Documente questões encontradas e como foram resolvidas
- **Finalize sessão** no work-log.md com resumo da fase

#### Exemplo de Atualização

```markdown
## 📅 FASE 1: Configuração Base [Completada ✅]

### 📝 Comentários da Fase

- **Decisão**: Optamos por usar biblioteca X ao invés de Y devido à melhor performance
- **Problema encontrado**: API Z retornava dados em formato inesperado, adicionamos parser
- **Observação**: Testes da Fase 2 dependem da fixture criada aqui
```

### 7. Fluxo de Aprovação Entre Fases

#### Para Cada Fase Completada:

1. **🛑 PAUSE**: Apresente resultados ao usuário
2. **📋 Review**: Solicite validação do código e approach
3. **🔄 Iterate**: Faça ajustes baseados no feedback
4. **✅ Approve**: Aguarde aprovação explícita
5. **📝 Update**: Atualize plan.md com status e comentários
6. **▶️ Next**: Apenas então inicie próxima fase

#### Template de Solicitação de Aprovação

```markdown
## 🎯 Fase [X] Completada - Solicitação de Aprovação

### ✅ Implementado Nesta Fase

[Lista do que foi desenvolvido]

### 🧪 Validações Realizadas

[Testes executados e resultados]

### 📋 Próximos Passos

[O que será abordado na próxima fase]

**Posso prosseguir para a Fase [X+1]?**
```

### 8. Gestão de Branch e Git

#### Branches

- Uma feature branch por funcionalidade: `feature-[slug-da-funcionalidade]`
- Commits frequentes com mensagens descritivas
- Não fazer merge até aprovação final

#### Commits

- Commits por tarefa/subtarefa completada
- Mensagens no formato: `feat: implementa [funcionalidade específica]`
- Inclua referência à fase no commit se útil

### 9. Ferramentas de Apoio

- **Linting/Formatação**: Execute conforme configuração do projeto
- **Testes Automatizados**: Execute suite de testes após cada implementação
- **Code Analysis**: Use ferramentas MCP para análise de qualidade
- **Documentation**: Consulte Context7 para APIs de bibliotecas

### 10. Finalização da Implementação

Quando todas as fases estiverem completas:

#### Verificação Final

- [ ] Todos os critérios de aceitação atendidos
- [ ] Testes passando completamente
- [ ] Código segue padrões do projeto
- [ ] Documentação atualizada se necessário
- [ ] Plan.md completamente atualizado

#### Preparação para PR

- Limpe commits se necessário (squash relacionados)
- Verifique que não há código temporário ou debug
- Confirme que branch está atualizada
- Execute validações finais (lint, test, build)

#### Handoff

- Atualize status no Jira para \"Ready for Review\"
- Prepare summary das mudanças implementadas
- Informe ao usuário que está pronto para `/pre-pr`

## Princípios de Trabalho

1. **🔄 Iterativo**: Trabalhe em pequenas etapas com validação constante
2. **🎯 Focado**: Siga o plano estabelecido, não se desvie sem discussão
3. **🤝 Colaborativo**: Sempre busque aprovação antes de prosseguir
4. **🔍 Qualidade**: Code review contínuo durante desenvolvimento
5. **📝 Documentado**: Mantenha registros claros de decisões e progresso

## Próximos Passos

Após completar toda implementação:

1. **Pre-PR** (`/pre-pr`) - Revisões automatizadas de qualidade
2. **Pull Request** (`/pr`) - Criação e submissão do PR

---

## ⚠️ LEMBRETE IMPORTANTE

**SEMPRE execute a "Execução Automática Inicial" (Seção 0) ANTES de começar qualquer trabalho:**

1. ✅ Verificar/criar feature branch
2. ✅ Buscar e atualizar task no Jira para "Em Progresso"

**NÃO pule estes passos** - eles são essenciais para o fluxo de trabalho adequado.
