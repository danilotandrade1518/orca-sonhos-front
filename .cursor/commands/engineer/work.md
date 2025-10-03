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

#### Passo 2: Context Loading Inteligente (OBRIGATÓRIO)

**SEMPRE execute este passo no início de cada sessão**:

##### 2.1: Análise de Contexto Automática

**Execute automaticamente**:

1. **Busca Contextual Inteligente**:

   ```typescript
   // Use codebase_search para encontrar documentos relevantes
   const contextQuery = `funcionalidade ${folder - name} arquitetura padrões frontend`;
   const contextResults = await codebase_search({
     query: contextQuery,
     target_directories: ['/home/danilo/workspace/projeto-orca-sonhos/orca-sonhos-meta-specs'],
   });
   ```

2. **Geração de Context Summary**:

   - Analise os resultados da busca
   - Identifique documentos mais relevantes
   - Gere summary automático dos padrões encontrados
   - Identifique gaps de conhecimento

3. **Cache de Contexto**:
   - Verifique se contexto similar já foi carregado
   - Reutilize informações de sessões anteriores quando aplicável
   - Atualize cache com novas descobertas

##### 2.2: Documentos Obrigatórios

**SEMPRE leia estes documentos**:

1. **index.md** (Meta Specs): Visão geral do projeto
2. **code-standards**: Padrões de código e boas práticas
3. **frontend-architecture**: Arquitetura específica do frontend

##### 2.3: Documentos Contextuais

**Baseado na análise automática, leia adicionalmente**:

- Documentos identificados pela busca contextual
- ADRs relevantes para a funcionalidade específica
- Especificações de domínio relacionadas
- Documentação técnica específica do contexto

**Localização**: `https://github.com/danilotandrade1518/orca-sonhos-meta-specs`

##### 2.4: Context Summary

**Após carregar contexto, gere automaticamente**:

```markdown
## 🧠 Context Summary

**Funcionalidade**: [Nome da funcionalidade]
**Complexidade Estimada**: [Baixa/Média/Alta]
**Padrões Identificados**: [Lista de padrões relevantes]
**Arquitetura Aplicável**: [Componentes e estruturas relevantes]
**Gaps de Conhecimento**: [Áreas que precisam de mais contexto]
```

#### Passo 3: Busca e Atualização do Jira

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

**PRIORIDADE MÁXIMA**: Leia os documentos fundamentais das Meta Specs antes de qualquer implementação:

**Documentos Obrigatórios das Meta Specs**:

- **index.md** (Meta Specs): Visão geral do projeto e contexto
- **code-standards**: Padrões de código e boas práticas
- **frontend-architecture**: Arquitetura específica do frontend

**Documentos Adicionais das Meta Specs** (conforme necessário):

- Documentação técnica relevante em `/technical/`
- ADRs (Architecture Decision Records) em `/adr/` se aplicável
- Especificações de domínio em `/business/` quando relevante
- Outros arquivos que possam ser necessários para o contexto específico

**Documentos da Sessão**:

Leia todos os arquivos markdown na pasta da sessão:

- **context.md**: Entendimento dos requisitos
- **architecture.md**: Design técnico detalhado
- **plan.md**: Plano faseado de implementação

### 2. Análise de Complexidade e Estratégia Adaptativa

#### 2.1: Análise Automática de Complexidade

**Execute automaticamente**:

1. **Avaliação de Complexidade**:

   ```typescript
   // Analise arquivos afetados, dependências e escopo
   const complexityFactors = {
     filesAffected: await countFilesInScope(),
     externalDependencies: await identifyExternalDeps(),
     architecturalImpact: await assessArchitecturalChanges(),
     testingRequirements: await estimateTestingScope(),
   };

   const complexityScore = calculateComplexityScore(complexityFactors);
   const strategy = selectExecutionStrategy(complexityScore);
   ```

2. **Classificação de Complexidade**:
   - **Baixa (0-30)**: Mudanças simples, poucos arquivos, sem impacto arquitetural
   - **Média (31-70)**: Mudanças moderadas, alguns arquivos, impacto limitado
   - **Alta (71-100)**: Mudanças complexas, muitos arquivos, impacto arquitetural significativo

#### 2.2: Seleção de Estratégia de Execução

**Baseado na complexidade, escolha automaticamente**:

**Estratégia SIMPLE** (Complexidade Baixa):

- Implementação incremental direta
- Aprovação automática para mudanças de estilo/formatação
- Work-log simplificado
- Testes básicos de caminho feliz

**Estratégia STANDARD** (Complexidade Média):

- Implementação faseada com validações
- Aprovação por micro-etapas
- Work-log detalhado
- Testes de caminho feliz + casos extremos

**Estratégia COMPLEX** (Complexidade Alta):

- Implementação com TDD/BDD
- Aprovação obrigatória por fase
- Work-log completo com justificativas
- Testes abrangentes + validações de segurança

#### 2.3: Identificação da Fase Atual

- Revise o **plan.md** para identificar qual fase está atualmente em progresso
- Revise o **work-log.md**(caso exista) para entender o que foi feito até agora
- Se nenhuma fase estiver marcada como \"Em Progresso ⏰\", comece pela primeira fase não iniciada
- **Aplique a estratégia selecionada** para abordar a próxima fase
- Apresente ao usuário um plano claro adaptado à complexidade identificada

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

### 4. Sistema de Memória Contextual e Execução Inteligente

#### 4.1: Context-Aware Decision Making

**Execute automaticamente antes de cada implementação**:

1. **Análise de Padrões Existentes**:

   ```typescript
   // Busque implementações similares no codebase
   const similarImplementations = await codebase_search({
     query: `funcionalidade similar ${featureType} padrão implementação`,
     target_directories: ['src/'],
   });

   // Analise padrões de decisão anteriores
   const decisionPatterns = await analyzeDecisionHistory();
   ```

2. **Sugestões Baseadas em Contexto**:

   - Identifique soluções similares já implementadas
   - Sugira padrões de código consistentes com o projeto
   - Aplique decisões arquiteturais anteriores quando aplicável
   - Evite anti-padrões identificados no histórico

3. **Learning from History**:
   - Consulte work-logs de funcionalidades similares
   - Aplique lições aprendidas de implementações anteriores
   - Use padrões de aprovação baseados em histórico de sucesso

#### 4.2: Execução por Fases Adaptativa

Para cada fase do desenvolvimento:

##### Antes de Começar

- **Análise Contextual**: Use sistema de memória para entender padrões aplicáveis
- Marque a fase como \"Em Progresso ⏰\" no plan.md
- **Inicie nova sessão** no work-log.md com timestamp e contexto aplicado
- Revise os critérios de conclusão da fase
- **Aplique estratégia selecionada** (SIMPLE/STANDARD/COMPLEX)
- Confirme entendimento das tarefas com o usuário

#### Durante a Implementação

**Sistema de Memória Contextual Ativo:**

1. **Pattern Matching Contínuo**:

   - Compare implementação atual com padrões existentes
   - Sugira melhorias baseadas em código similar
   - Identifique inconsistências com padrões do projeto
   - Aplique decisões arquiteturais comprovadas

2. **Decision Tree Navigation**:
   - Use histórico de decisões para guiar escolhas técnicas
   - Aplique soluções testadas para problemas similares
   - Evite caminhos que levaram a problemas anteriores
   - Documente novas decisões para futuras referências

**Princípios de Qualidade:**

- **Código Limpo**: Sem comentários ou instruções temporárias no código final
- **Padrões**: Siga as convenções estabelecidas no projeto (usando memória contextual)
- **Segurança**: Implemente tratamento adequado de erros e validações
- **Manutenibilidade**: Código legível e bem estruturado
- **Consistência**: Aplique padrões identificados em implementações similares

**Processo de Revisão Contínua:**
Apply continuous code review seguindo as prioridades:

1. **🎯 Correção** - O código funciona para o caso de uso?
2. **🔒 Segurança** - Há vulnerabilidades ou bugs óbvios?
3. **📖 Clareza** - O código é legível e manutenível?
4. **⚖️ Adequação** - A complexidade está apropriada?

#### Após Completar Tarefas da Fase

**Sistema de Memória Contextual - Atualização:**

1. **Documentação de Padrões**:

   - Registre novos padrões identificados durante implementação
   - Atualize decision tree com novas decisões tomadas
   - Documente soluções eficazes para futuras referências
   - Identifique anti-padrões a serem evitados

2. **Learning Update**:
   - Analise eficácia das decisões tomadas
   - Atualize scores de confiança para padrões aplicados
   - Registre lições aprendidas no contexto do projeto
   - Melhore sugestões baseadas em resultados obtidos

**🛑 PAUSE OBRIGATÓRIA**: Solicite validação do usuário antes de prosseguir

- **Atualize work-log.md** com trabalho realizado na sessão
- **Atualize sistema de memória** com novos padrões e decisões
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

1. **📚 Contexto Inteligente**: Use Context Loading Inteligente para carregar automaticamente documentos relevantes e gerar context summary
2. **🧠 Memória Contextual**: Aplique sistema de memória contextual para decisões baseadas em padrões existentes e histórico
3. **⚡ Estratégia Adaptativa**: Use análise de complexidade para selecionar automaticamente a melhor estratégia de execução
4. **🔄 Iterativo**: Trabalhe em pequenas etapas com validação constante
5. **🎯 Focado**: Siga o plano estabelecido, não se desvie sem discussão
6. **🤝 Colaborativo**: Sempre busque aprovação antes de prosseguir
7. **🔍 Qualidade**: Code review contínuo durante desenvolvimento
8. **📝 Documentado**: Mantenha registros claros de decisões e progresso
9. **🎓 Aprendizado Contínuo**: Atualize sistema de memória com cada implementação para melhorar futuras decisões

## Próximos Passos

Após completar toda implementação:

1. **Pre-PR** (`/pre-pr`) - Revisões automatizadas de qualidade
2. **Pull Request** (`/pr`) - Criação e submissão do PR

---

## ⚠️ LEMBRETE IMPORTANTE

**SEMPRE execute a "Execução Automática Inicial" (Seção 0) ANTES de começar qualquer trabalho:**

1. ✅ Verificar/criar feature branch
2. ✅ **Context Loading Inteligente** (busca automática + context summary)
3. ✅ **Análise de Complexidade** (seleção automática de estratégia)
4. ✅ **Sistema de Memória Contextual** (análise de padrões existentes)
5. ✅ Buscar e atualizar task no Jira para "Em Progresso"

**NÃO pule estes passos** - eles são essenciais para o fluxo de trabalho inteligente e garantem:

- Contexto adequado das boas práticas e arquitetura
- Estratégia de execução otimizada para a complexidade
- Decisões baseadas em padrões e histórico do projeto
- Aprendizado contínuo para futuras implementações
