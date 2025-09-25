# Flow Resume

Este comando é usado para retomar o trabalho em uma task após uma interrupção (ex: mudança de dia, pausa longa).

## Uso

```
/flow resume [task-name]
```

Se `task-name` não for fornecido, usa a sessão ativa atual.

## Funcionamento

Você é um especialista em gestão de fluxo de desenvolvimento. Sua tarefa é analisar completamente onde o usuário parou e fornecer um resumo detalhado para retomar o trabalho.
Você pode usar o agent flow-manager para ajudar na análise caso ele esteja disponível.

### Processo Completo

1. **Análise Profunda do Estado**:

   - Examine todos os arquivos na sessão
   - Verifique timestamps para entender cronologia
   - Analise conteúdo para detectar progresso real
   - Verifique status no task manager

2. **Identificação do Contexto**:

   - O que foi feito na última sessão?
   - Quais decisões foram tomadas?
   - Que problemas foram encontrados?
   - Onde exatamente o trabalho parou?

3. **Validação de Consistência**:

   - Arquivos estão sincronizados?
   - Estado do task manager reflete arquivos locais?
   - Há conflitos ou inconsistências?

4. **Preparação para Retomada**:
   - Resumir contexto atual
   - Listar próximos passos específicos
   - Identificar possíveis bloqueios
   - Sugerir validações necessárias

### Análise por Tipo de Arquivo

#### Context.md

- Entendimento do problema
- Clarificações feitas
- Decisões arquiteturais

#### Plan.md

- Fases completadas vs pendentes
- Comentários deixados durante desenvolvimento
- Problemas encontrados e resolvidos

#### Architecture.md

- Decisões técnicas tomadas
- Padrões definidos
- Dependências identificadas

#### Código Fonte

- Arquivos modificados recentemente
- Features implementadas
- Testes escritos/passando

### Formato da Resposta

```
## Resumo da Sessão - {TASK_NAME}

### 📋 Estado Atual
**Última Atividade**: DD/MM/YYYY HH:mm
**Etapa**: {ETAPA} ({NUMERO}/11)
**Progresso Geral**: {PORCENTAGEM}% completo

### 🎯 Contexto da Task
**Objetivo**: {RESUMO_DO_OBJETIVO}
**Principais Decisões**:
- {DECISÃO_1}
- {DECISÃO_2}

### ✅ O que Foi Feito
- {ITEM_COMPLETO_1}
- {ITEM_COMPLETO_2}
- {ITEM_COMPLETO_3}

### 🔄 Estado Detalhado

#### Produto ({X}/6)
- ✅ warm-up: Concluído
- ✅ collect: Issue OS-123 criada
- ⏳ refine: Em progresso
- ⏸️ spec: Não iniciado

#### Engenharia ({Y}/5)
- ✅ start: context.md criado
- ⏳ plan: Fase 2/4 em andamento
- ⏸️ work: Aguardando
- ⏸️ pre-pr: Aguardando
- ⏸️ pr: Aguardando

### 🎯 Onde Você Parou
**Última ação**: {DESCRIÇÃO_DA_ÚLTIMA_AÇÃO}
**Status**: {STATUS_ATUAL}
**Próximo passo interrompido**: {PRÓXIMO_PASSO}

### ⚡ Para Retomar Agora

#### 1. Validações Rápidas
- [ ] Verificar se branch está atualizada
- [ ] Executar testes: `npm test`
- [ ] Revisar mudanças: `git status`

#### 2. Próxima Ação
**Comando**: `/engineer work` ou `/product refine`
**Foco**: {DESCRIÇÃO_ESPECÍFICA}

#### 3. Contexto para Retomada
{INFORMAÇÕES_IMPORTANTES_PARA_CONTINUAR}

### ⚠️ Atenções Especiais
- {PROBLEMA_OU_DECISÃO_PENDENTE_1}
- {PROBLEMA_OU_DECISÃO_PENDENTE_2}

### 📝 Notas Importantes
{OUTRAS_OBSERVAÇÕES_RELEVANTES}
```

### Casos Especiais

1. **Interrupção no meio de desenvolvimento**:

   - Verificar arquivos modificados mas não commitados
   - Identificar testes quebrados
   - Resumir onde parou na implementação

2. **Mudança de contexto longa**:

   - Fornecer contexto mais detalhado
   - Sugerir revisão dos requisitos
   - Validar se arquitetura ainda faz sentido

3. **Problemas detectados**:

   - Conflitos de merge pendentes
   - Testes falhando
   - Arquivos inconsistentes

4. **Primeiro uso**:
   - Se não há histórico, funciona como `/flow status`
   - Sugere inicialização do fluxo

### Argumentos

```
<task-name>
#$ARGUMENTS
</task-name>
```

### Integrações Avançadas

- **Git**: Analizar commits recentes, branch atual, status
- **Task Manager**: Verificar atualizações na issue do Jira
- **Arquivos**: Timestamps, modificações, conteúdo
- **Tests**: Status da última execução
- **Build**: Status do último build

### Dicas de Retomada

O comando deve incluir dicas práticas:

- "Releia o context.md para recuperar o contexto"
- "Verifique as decisões na seção 'Comentários' do plan.md"
- "Execute os testes antes de continuar: `npm test`"
- "Revise os últimos commits: `git log --oneline -5`"
- "Sincronize com a issue do task manager antes de prosseguir"
