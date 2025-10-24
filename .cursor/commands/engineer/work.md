# Engineer Work

Este é o comando para executar o desenvolvimento de uma funcionalidade seguindo o planejamento estabelecido.

## Configuração de IA

Antes de executar este comando, leia o arquivo `ai.properties.md` na raiz do projeto para obter configurações locais.

Se o arquivo não existir ou não estiver configurado, use a URL padrão do GitHub.

## Argumentos da Sessão

<folder>
#$ARGUMENTS
</folder>

## Modos de Execução (Otimizador de Contexto)

### Modos Pré-definidos (Sem Parâmetros)

**Modo Lite (≤25k tokens)**:

- `plan.md`: somente fase atual (bloco), número/status + 3 próximos passos
- TL;DR: Angular Best Practices, Code Standards (index), Frontend Architecture (index)
- Sem docs longos, sem Top-3 trechos, sem Jira
- Respeita Ignore List

**Modo Standard (≤60k tokens)**:

- TL;DR adicionais: `angular-modern-patterns`, `design-system-patterns`, `ui-system`, `testing-strategy`
- Para a fase atual, carregar apenas seções relevantes via âncoras (Top-3 trechos curtos por doc)
- Resumo enxuto (≤10 bullets) com links/âncoras; sem colar trechos longos

**Modo Full (≤100k tokens)**:

- Apenas por configuração explícita do sistema
- Igual ao Standard, podendo incluir +1–2 seções ancoradas por doc crítico
- Nunca imprimir documentos inteiros

### Seleção Automática de Modo

- **Fases iniciais** (1-2): Lite (elevar p/ Standard se complexidade ≥ média)
- **Fases de desenvolvimento** (3 até penúltima): Standard
- **Fase final** (testes/validação): Standard; elevar p/ Full somente se reescrever estratégia de testes
- **Fase pós-entrega**: Lite
- Se a projeção exceder o teto do modo: degradar automaticamente p/ modo inferior

### Hard Cap e Contabilização

- Estimar custo antes de ler: TL;DR (baixo), Top-3 (médio), bloco da fase (baixo)
- Interromper carregamentos ao atingir 95% do teto; registrar itens diferidos
- **TETO ABSOLUTO**: 100.000 tokens (nunca exceder)

### Ignore List (não ler/imprimir)

- `documentation.json`, `storybook-static/**`, `.storybook/**`, `coverage/**`, `dist/**`, `sessions/*/work-log.md`, `public/mockServiceWorker.js`, `temp/*-context-inventory.md`

## Objetivo

Implementar a funcionalidade seguindo o plano faseado, com foco na qualidade, padrões do projeto e aprovação entre etapas.
Você possui o MCP angular-cli do Angular que te fornece boas práticas, use ele sempre que for trabalhar.

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

#### Passo 2: Preparação da Sessão (OBRIGATÓRIO)

**SEMPRE execute este passo ANTES do Context Loading**:

– Leia os documentos da sessão para entender a demanda específica.
– Identifique a fase atual e necessidades específicas.
– Com base na demanda, direcione o Context Loading para documentos relevantes.

##### 2.1: Análise dos Documentos da Sessão

**Leia automaticamente se existirem**:

1. **context.md**: Requisitos e contexto da funcionalidade
2. **architecture.md**: Design técnico detalhado
3. **layout-specification.md**: Especificações de UI/UX e layout ⭐ NOVO
4. **plan.md**: Plano faseado de implementação (se já existir)

– Extraia apenas a seção marcada como "Em Progresso ⏰" ou a próxima pendente do `plan.md`.

##### 2.2: Identificação da Fase Atual

Algoritmo de detecção robusto (regex + normalização):

```typescript
// 1) Ler apenas o arquivo do plano da sessão atual
const planPath = `sessions/${folder}/plan.md`;
const planContent = await read_file({ target_file: planPath });

// 2) Extrair fases pelos headings formais
// Formato esperado: "## 📅 FASE X: Título [Status: ...]"
const phaseRegex = /^##\s*📅\s*FASE\s*(\d+)\s*:.*?\[\s*Status\s*:\s*([^\]]+)\]/gim;
type PhaseStatus = 'completed' | 'in_progress' | 'pending' | 'unknown';

function normalizeStatus(raw: string): PhaseStatus {
  const s = raw.toLowerCase();
  if (s.includes('⏰') || s.includes('em progresso') || s.includes('in progress'))
    return 'in_progress';
  if (s.includes('✅') || s.includes('conclu') || s.includes('completed') || s.includes('100%'))
    return 'completed';
  if (s.includes('⏳') || s.includes('pendente') || s.includes('pending')) return 'pending';
  return 'unknown';
}

interface PhaseInfo {
  num: number;
  status: PhaseStatus;
  headingIndex: number;
}
const phases: PhaseInfo[] = [];
let match: RegExpExecArray | null;
while ((match = phaseRegex.exec(planContent)) !== null) {
  const num = Number(match[1]);
  const status = normalizeStatus(match[2] ?? '');
  phases.push({ num, status, headingIndex: match.index });
}

// 3) Seleção da fase atual
// Regra:
// - Se existir alguma com status in_progress → escolha a de menor número (ou única)
// - Senão, escolha a primeira fase "pendente" imediatamente após a última "concluída"
// - Se todas concluídas, considere a última como finalizado
phases.sort((a, b) => a.num - b.num);
let current: PhaseInfo | undefined = phases.find((p) => p.status === 'in_progress');
if (!current) {
  const lastCompleted = [...phases].reverse().find((p) => p.status === 'completed');
  if (lastCompleted) {
    current = phases.find((p) => p.num > lastCompleted.num && p.status !== 'completed');
  }
  if (!current) {
    current = phases.find((p) => p.status === 'pending' || p.status === 'unknown') ?? phases.at(-1);
  }
}

// 4) Extração parcial do conteúdo da fase atual (quando enabled)
let currentPhaseMarkdown = '';
if (current) {
  if (work.partialReads?.planCurrentPhaseOnly) {
    const nextHeading = phases.find((p) => p.num > current!.num);
    const start = current.headingIndex;
    const end = nextHeading ? nextHeading.headingIndex : planContent.length;
    currentPhaseMarkdown = planContent.slice(start, end);
  } else {
    currentPhaseMarkdown = planContent;
  }
}

// 5) Fallback opcional: ignorar seções como "Atualizações Recentes" para não confundir status
// O algoritmo acima considera apenas headings formais de fase.

return {
  currentPhaseNumber: current?.num,
  currentPhaseStatus: current?.status,
  currentPhaseMarkdown,
};
```

##### 2.3: Seleção de Modo Baseada na Fase

**Seleção Automática de Modo**:

- Fases 1–2: Lite (elevar p/ Standard se complexidade ≥ média)
- Fases 3–7: Standard
- Fase 8 (testes/validação): Standard; elevar p/ Full somente se reescrever estratégia de testes
- Fase 9: Lite
- Se a projeção exceder o teto do modo: degradar automaticamente p/ modo inferior

#### Passo 3: Context Loading Inteligente (OBRIGATÓRIO)

**SEMPRE execute este passo APÓS entender a demanda**:

– Metaspecs e Angular Best Practices são lidos via cache por hash/TTL; se inalterados, reutilize TL;DR em `temp/context-cache/`.
– **NOVO**: Com base na fase identificada, carregar apenas documentos/seções relevantes.

##### 3.1: Análise de Contexto Automática

**Execute automaticamente com CONTABILIZAÇÃO DE TOKENS**:

```typescript
// CONTABILIZAÇÃO DE TOKENS - Hard Cap 100k
let tokenCount = 0;
const HARD_CAP = 100000;
const INTERRUPT_THRESHOLD = 95000; // 95% do teto

function estimateTokens(content: string): number {
  // Estimativa: ~4 chars por token
  return Math.ceil(content.length / 4);
}

function checkTokenLimit(): boolean {
  if (tokenCount >= INTERRUPT_THRESHOLD) {
    console.log(`⚠️ Token limit atingido: ${tokenCount}/${HARD_CAP}. Interrompendo carregamentos.`);
    return false;
  }
  return true;
}
```

1. **Busca Contextual Inteligente Guiada por Demanda**:

   ```typescript
   // Use codebase_search para encontrar documentos relevantes baseado na fase atual
   const contextQuery = `funcionalidade ${folder - name} arquitetura padrões frontend`;
   const contextResults = await codebase_search({
     query: contextQuery,
     target_directories: [leia meta_specs_path do arquivo ai.properties.md na raiz do projeto],
   });

   // Contabilizar tokens
   tokenCount += estimateTokens(contextResults.content);
   if (!checkTokenLimit()) return;
   ```

- Limite buscas a Top 5 resultados e gere apenas resumo curto.
- **NOVO**: Com base na fase identificada, direcione a busca para seções específicas (ex: fase de testes → testes, acessibilidade, performance).
- **HARD CAP**: Interromper carregamentos ao atingir 95% do teto (95k tokens).

2. **Geração de Context Summary**:

   ```typescript
   // Analise os resultados da busca
   const summary = generateContextSummary(contextResults);
   tokenCount += estimateTokens(summary);
   if (!checkTokenLimit()) return;
   ```

   - Analise os resultados da busca
   - Identifique documentos mais relevantes
   - Gere summary automático dos padrões encontrados
   - Identifique gaps de conhecimento

3. **Cache de Contexto**:
   ```typescript
   // Verifique se contexto similar já foi carregado
   const cachedContext = await checkCache();
   if (cachedContext) {
     tokenCount += estimateTokens(cachedContext);
     if (!checkTokenLimit()) return;
   }
   ```
   - Verifique se contexto similar já foi carregado
   - Reutilize informações de sessões anteriores quando aplicável
   - Atualize cache com novas descobertas

##### 3.2: Navegação Inteligente das Meta Specs

**🧠 SISTEMA DE NAVEGAÇÃO AUTOMÁTICA GUIADA POR DEMANDA**:

Use os próprios índices das Meta Specs para navegação inteligente, direcionada pela fase atual:

```typescript
// 1. Ler ai.properties.md para obter meta_specs_path
const aiProperties = await read_file({ target_file: 'ai.properties.md' });
tokenCount += estimateTokens(aiProperties);
if (!checkTokenLimit()) return;

const metaSpecsPath = extractMetaSpecsPath(aiProperties);

// 2. Ler índice principal das Meta Specs
const metaSpecsIndex = await read_file({
  target_file: `${metaSpecsPath}/index.md`,
});
tokenCount += estimateTokens(metaSpecsIndex);
if (!checkTokenLimit()) return;

// 3. NAVEGAÇÃO INTELIGENTE - Use os índices para descobrir estrutura
const codeStandardsIndex = await read_file({
  target_file: `${metaSpecsPath}/technical/code-standards/index.md`,
});
tokenCount += estimateTokens(codeStandardsIndex);
if (!checkTokenLimit()) return;

const frontendArchIndex = await read_file({
  target_file: `${metaSpecsPath}/technical/frontend-architecture/index.md`,
});
tokenCount += estimateTokens(frontendArchIndex);
if (!checkTokenLimit()) return;

// 4. NOVO: Seleção Guiada por Fase
// Com base na fase atual identificada, carregar apenas seções relevantes:

function getRelevantSectionsForPhase(
  phaseNumber: number,
  phaseStatus: string,
  totalPhases: number
): string[] {
  const sections: string[] = [];

  // Sempre incluir bases
  sections.push('index.md', 'code-standards/index.md', 'frontend-architecture/index.md');

  // Fases específicas baseadas no status e posição
  if (phaseStatus === 'testes' || phaseStatus === 'validação' || phaseNumber === totalPhases) {
    sections.push('technical/04_estrategia_testes.md');
    sections.push('technical/code-standards/design-system-patterns.md'); // Acessibilidade
    sections.push('technical/frontend-architecture/ui-system.md'); // Performance
  }

  // Fases de desenvolvimento (meio do plano)
  if (phaseNumber >= 3 && phaseNumber < totalPhases) {
    sections.push('technical/code-standards/angular-modern-patterns.md');
    sections.push('technical/code-standards/design-system-patterns.md');
    sections.push('technical/frontend-architecture/ui-system.md');
  }

  // Fases iniciais
  if (phaseNumber <= 2) {
    sections.push('technical/code-standards/angular-modern-patterns.md');
  }

  return sections;
}

const relevantSections = getRelevantSectionsForPhase(
  currentPhaseNumber,
  currentPhaseStatus,
  phases.length
);

// 5. OBRIGATÓRIO: Obter melhores práticas Angular via MCP
const angularBestPractices = await mcp_angular_cli_get_best_practices();
tokenCount += estimateTokens(angularBestPractices);
if (!checkTokenLimit()) return;

// 6. Carregar apenas seções relevantes com contabilização
for (const section of relevantSections) {
  const content = await read_file({ target_file: `${metaSpecsPath}/${section}` });
  tokenCount += estimateTokens(content);
  if (!checkTokenLimit()) {
    console.log(
      `⚠️ Limite de tokens atingido. Seções restantes: ${relevantSections.slice(
        relevantSections.indexOf(section)
      )}`
    );
    break;
  }
}

// 5. ANÁLISE CONTEXTUAL INTELIGENTE
await performIntelligentAnalysis({
  metaSpecsIndex: metaSpecsIndex,
  codeStandardsIndex: codeStandardsIndex,
  frontendArchIndex: frontendArchIndex,
  featureContext: featureAnalysis,
  angularBestPractices: angularBestPractices,
});
```

- Cacheie o TL;DR das Best Practices em `temp/context-cache/angular-best-practices.tldr.md` (TTL configurável) e referencie-o sem imprimir conteúdo completo.

**🎯 PRINCÍPIOS DA NAVEGAÇÃO INTELIGENTE**:

1. **Use os índices como mapa**: Cada `index.md` contém a estrutura e navegação
2. **Análise contextual automática**: Baseada no tipo de funcionalidade
3. **Descoberta dinâmica**: A IA descobre quais documentos são relevantes
4. **Manutenção zero**: Mudanças nas Meta Specs não afetam o work.md

**🔧 INTEGRAÇÃO COM MCP ANGULAR-CLI**:

**SEMPRE execute antes de qualquer implementação Angular**:

```typescript
// 1. Obter melhores práticas Angular
const bestPractices = (await mcp_angular) - cli_get_best_practices();

// 2. Buscar documentação específica se necessário
const angularDocs =
  (await mcp_angular) -
  cli_search_documentation({
    query: 'standalone components signals inject',
  });

// 3. Aplicar práticas no contexto da funcionalidade
const contextualPractices = await applyAngularPractices({
  bestPractices: bestPractices,
  featureContext: featureAnalysis,
  existingPatterns: similarFeatures,
});
```

**📋 ANÁLISE INTELIGENTE BASEADA EM ÍNDICES**:

A IA deve:

- [ ] **Analisar o índice principal** para entender a estrutura geral
- [ ] **Navegar pelos índices** de code-standards e frontend-architecture
- [ ] **Identificar seções relevantes** baseado no tipo de funcionalidade
- [ ] **Ler documentos específicos** conforme identificado pelos índices
- [ ] **Aplicar padrões identificados** no contexto da funcionalidade
- [ ] **Validar consistência** com padrões existentes no codebase

##### 2.2.1: Navegação Explícita em Code Standards

**🎯 NAVEGAÇÃO OBRIGATÓRIA EM CODE-STANDARDS**:

A IA deve navegar explicitamente pelo índice de code-standards e ler documentos relevantes

```typescript
// 1. Ler índice de code-standards
const codeStandardsIndex = await read_file({
  target_file: `${metaSpecsPath}/technical/code-standards/index.md`,
});

// 2. NAVEGAÇÃO EXPLÍCITA - Identificar seções relevantes
const codeStandardsSections = await identifyRelevantSections({
  index: codeStandardsIndex,
  featureContext: featureAnalysis,
});

// 3. LEITURA CONTEXTUAL - Ler documentos identificados
for (const section of codeStandardsSections) {
  const content = await read_file({ target_file: section.path });
  await analyzeCodeStandards({
    document: content,
    section: section.name,
    context: featureAnalysis,
    angularBestPractices: angularBestPractices,
  });
}
```

**📋 CHECKLIST DE NAVEGAÇÃO EM CODE-STANDARDS**:

- [ ] **Ler índice completo** de code-standards
- [ ] **Identificar seções relevantes** baseado no contexto da funcionalidade
- [ ] **Ler documentos específicos** conforme identificado
- [ ] **Mapear convenções de nomenclatura** específicas
- [ ] **Identificar padrões do Design System** (os-\*)
- [ ] **Extrair guidelines de performance** e otimização
- [ ] **Mapear padrões de error handling** (Either pattern)

##### 2.5: Documentos Contextuais Adicionais

**Baseado na análise automática, leia adicionalmente**:

- Documentos identificados pela busca contextual
- ADRs relevantes para a funcionalidade específica
- Especificações de domínio relacionadas
- Documentação técnica específica do contexto

**Localização**: [leia meta_specs_path do arquivo ai.properties.md na raiz do projeto, ou use 'https://github.com/danilotandrade1518/orca-sonhos-meta-specs' se não configurado]

##### 2.6: Descoberta Inteligente de Padrões Existentes

**🔍 BUSCA CONTEXTUAL INTELIGENTE**:

Use busca semântica para descobrir padrões existentes de forma inteligente:

```typescript
// 1. Análise contextual da funcionalidade
const featureContext = await analyzeFeatureContext({
  featureName: folderName,
  complexity: await estimateComplexity(),
  domain: await identifyDomain(),
  uiComponents: await identifyUIComponents(),
  backendIntegration: await identifyBackendNeeds(),
});

// 2. BUSCA INTELIGENTE - Use termos contextuais para encontrar padrões
const searchQueries = await generateContextualSearchQueries(featureContext);

const similarFeatures = await codebase_search({
  query: searchQueries.featurePatterns,
  target_directories: ['src/app/features/'],
});

const similarComponents = await codebase_search({
  query: searchQueries.componentPatterns,
  target_directories: ['src/app/shared/ui-components/'],
});

const architecturalPatterns = await codebase_search({
  query: searchQueries.architecturalPatterns,
  target_directories: ['src/'],
});

// 3. ANÁLISE DE DECISÕES ANTERIORES
const previousDecisions = await analyzeDecisionHistory({
  featureType: featureContext.type,
  domain: featureContext.domain,
  similarFeatures: similarFeatures,
});
```

- Mantenha o resumo em no máximo 10 bullets e inclua apenas referências (caminhos/âncoras), evitando colar conteúdo integral de documentos.

**🧠 PRINCÍPIOS DA DESCOBERTA DE PADRÕES**:

1. **Busca semântica**: Use termos relacionados ao contexto da funcionalidade
2. **Análise contextual**: Identifique padrões baseados no tipo de funcionalidade
3. **Priorização inteligente**: Foque nos padrões mais relevantes
4. **Aprendizado contínuo**: Use decisões anteriores para melhorar buscas futuras

**📋 PROCESSO DE DESCOBERTA DE PADRÕES**:

A IA deve:

- [ ] **Gerar termos de busca** baseados no contexto da funcionalidade
- [ ] **Buscar implementações similares** usando busca semântica
- [ ] **Analisar padrões encontrados** para identificar reutilização
- [ ] **Mapear decisões anteriores** para evitar anti-padrões
- [ ] **Identificar oportunidades** de reutilização de código
- [ ] **Documentar padrões** para futuras referências

##### 2.7: Context Summary Inteligente

**Após carregar contexto via navegação inteligente, gere automaticamente**:

```markdown
## 🧠 Context Summary

**Funcionalidade**: [Nome da funcionalidade]
**Complexidade Estimada**: [Baixa/Média/Alta]
**Documentos Analisados**: [Lista de documentos descobertos e lidos]
**Padrões Identificados**: [Padrões extraídos dos documentos analisados]
**Arquitetura Aplicável**: [Componentes e estruturas relevantes]
**Padrões Existentes**: [Implementações similares encontradas no codebase]
**Gaps de Conhecimento**: [Áreas que precisam de mais contexto]
**Decisões Arquiteturais**: [Decisões anteriores aplicáveis]
**Melhores Práticas Angular**: [Práticas obtidas via MCP angular-cli]
**Padrões de Design System**: [Padrões os-* identificados]
**Navegação Utilizada**: [Como a IA navegou pelos índices para descobrir documentos]
**Code Standards Analisados**: [Seções específicas de code-standards navegadas]
**Estratégia de Testes**: [Documentos de teste analisados e padrões identificados]
```

##### 2.8: Aplicação Contextual do Conhecimento

**🧠 SISTEMA DE APLICAÇÃO INTELIGENTE**:

Após carregar toda a documentação, execute aplicação contextual:

```typescript
// 1. Aplicar padrões identificados
const appliedPatterns = await applyIdentifiedPatterns({
  codeStandards: codeStandardsAnalysis,
  frontendArch: frontendArchAnalysis,
  angularBestPractices: angularBestPractices,
  existingPatterns: similarFeatures,
  featureContext: featureAnalysis,
});

// 2. Gerar guidelines específicas para a funcionalidade
const featureGuidelines = await generateFeatureGuidelines({
  featureType: featureAnalysis.type,
  complexity: featureAnalysis.complexity,
  patterns: appliedPatterns,
  constraints: featureAnalysis.constraints,
});

// 3. Validar consistência com padrões existentes
const consistencyCheck = await validateConsistency({
  proposedImplementation: featureGuidelines,
  existingCodebase: similarFeatures,
  architecturalRules: frontendArchAnalysis,
});
```

**📋 CHECKLIST DE APLICAÇÃO CONTEXTUAL**:

**Padrões de Código**:

- [ ] Aplicar convenções de nomenclatura identificadas
- [ ] Seguir estrutura de classes definida
- [ ] Usar padrões de import corretos
- [ ] Implementar error handling com Either pattern
- [ ] Aplicar padrões Angular modernos (signals, inject, standalone)

**Arquitetura**:

- [ ] Seguir Feature-Based Architecture
- [ ] Respeitar responsabilidades das camadas
- [ ] Implementar comunicação entre features conforme padrão
- [ ] Aplicar estratégias de state management identificadas
- [ ] Seguir padrões de integração com backend

**Design System**:

- [ ] Usar componentes os-\* conforme especificado
- [ ] Aplicar padrões de responsividade
- [ ] Implementar acessibilidade conforme guidelines
- [ ] Seguir padrões de tema e design tokens

**Estratégia de Testes**:

- [ ] Aplicar padrões de teste identificados na documentação
- [ ] Implementar testes unitários conforme guidelines
- [ ] Configurar mocks e factories conforme padrões
- [ ] Aplicar estratégias de cobertura identificadas
- [ ] Implementar testes de acessibilidade quando aplicável
- [ ] Seguir padrões de teste de componentes Angular

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

### 4. Implementação da Funcionalidade

**Após completar o Context Loading Inteligente, prossiga com a implementação**:

- ADRs (Architecture Decision Records) em `/adr/` se aplicável
- Especificações de domínio em `/business/` quando relevante
- Outros arquivos que possam ser necessários para o contexto específico

**Documentos da Sessão**:

Leia todos os arquivos markdown na pasta da sessão:

- **context.md**: Entendimento dos requisitos
- **architecture.md**: Design técnico detalhado
- **plan.md**: Plano faseado de implementação
- **layout-specification.md**: Especificações de layout

### 2. Análise de Complexidade e Estratégia Adaptativa

### 3. Inicialização do Work Log

Crie o arquivo `sessions/<folder>/work-log.md` se não existir:

Observação: não imprimir o template no output; apenas criar/atualizar o arquivo.

## Template do Work-Log.md

```markdown
# [NOME DA FUNCIONALIDADE] - Log de Desenvolvimento

> **Propósito**: Registrar progresso essencial, decisões técnicas e próximos passos.

## 📋 Sessões de Trabalho

### 🗓️ Sessão [DATA] - [DURAÇÃO]

**Fase**: [Nome da fase trabalhada]
**Objetivo**: [O que pretendia alcançar]

#### ✅ Trabalho Realizado

- [Tarefa específica completada]
- [Funcionalidade implementada]

#### 🤔 Decisões/Problemas

- **Decisão**: [Escolha feita] - **Motivo**: [Razão]
- **Problema**: [Descrição] - **Solução**: [Como resolvido]

#### 🧪 Validações

- [Teste 1]: [Resultado]
- [Teste 2]: [Resultado]

#### ⏭️ Próximos Passos

- [Próxima tarefa específica]
- [Item pendente]

---

## 🔄 Estado Atual

**Branch**: [Nome da branch]
**Fase Atual**: [Nome da fase do plan.md]
**Última Modificação**: [Arquivo e descrição]
**Próxima Tarefa**: [Descrição específica]
```

### 5.5. Validações de Layout

@if (layoutSpecificationExists) {

**Durante implementação de componentes de UI, valide:**

#### Design System Compliance

- [ ] Componentes os-\* utilizados conforme especificado
- [ ] Design tokens (--os-\*) aplicados corretamente
- [ ] Nomenclatura consistente com padrões
- [ ] Variantes e tamanhos corretos

#### Responsividade

- [ ] Breakpoints implementados (mobile, tablet, desktop)
- [ ] Touch targets >= 44px em mobile
- [ ] Layout mobile-first
- [ ] Sem scroll horizontal
- [ ] Media queries conforme especificação

#### Acessibilidade

- [ ] ARIA attributes conforme layout-specification
- [ ] Keyboard navigation funcional
- [ ] Focus visible em elementos interativos
- [ ] Screen reader friendly
- [ ] Contraste >= 4.5:1

#### Visual Quality

- [ ] Spacing conforme grid system
- [ ] Estados (loading, error, empty) implementados
- [ ] Micro-interactions conforme especificado
- [ ] Hierarquia visual correta

**Referência:** Consulte `layout-specification.md` para detalhes completos

}

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
- [ ] **🚨 CRÍTICO**: Nenhum comentário no código final
- [ ] **🚨 CRÍTICO**: Nenhum console.log, debugger ou código de debug
- [ ] **🚨 CRÍTICO**: Nenhum código comentado ou "morto"
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

1. **📚 Contexto Inteligente**: Use Context Loading para carregar documentos relevantes (context, architecture, layout-specification)
2. **🧠 Memória Contextual**: Aplique padrões existentes e histórico
3. **⚡ Estratégia Adaptativa**: Use análise de complexidade
4. **🎨 Layout Compliant**: Siga especificações do layout-specification.md quando existir ⭐ NOVO
5. **🔄 Iterativo**: Trabalhe em pequenas etapas com validação
6. **🎯 Focado**: Siga o plano estabelecido, não se desvie sem discussão
7. **🤝 Colaborativo**: Sempre busque aprovação antes de prosseguir
8. **🔍 Qualidade**: Code review contínuo durante desenvolvimento
9. **📝 Documentado**: Mantenha registros claros de decisões e progresso
10. **🎓 Aprendizado Contínuo**: Atualize sistema de memória com cada implementação para melhorar futuras decisões

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
