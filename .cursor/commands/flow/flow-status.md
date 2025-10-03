# Flow Status

Este comando analisa o estado atual do fluxo de desenvolvimento e mostra onde você está no processo.

## Configuração de IA

Antes de executar este comando, leia o arquivo `ai.properties.md` na raiz do projeto para obter configurações locais.

Se o arquivo não existir ou não estiver configurado, use a URL padrão do GitHub.

## Uso

```
/flow status [task-name]
```

Se `task-name` não for fornecido, usa a sessão ativa atual.

## Fluxo Completo

### Produto (6 etapas)

1. **warm-up** - Preparação e revisão de specs
2. **collect** - Coleta de requisitos e criação de issues no Jira
3. **refine** - Refinamento dos requisitos
4. **spec** - Criação do PRD final
5. **architecture** - Definição da arquitetura
6. **check** - Validação final

### Engenharia (5 etapas)

1. **start** - Análise inicial e criação de context.md
2. **plan** - Planejamento detalhado em fases (plan.md)
3. **work** - Desenvolvimento incremental com atualizações no plan.md
4. **pre-pr** - Preparação para PR
5. **pr** - Finalização e pull request

## Funcionamento

Você é um especialista em gestão de fluxo de desenvolvimento. Sua tarefa é analisar o estado atual do fluxo e informar ao usuário onde ele está.
Você pode usar o agent flow-manager para ajudar na análise caso ele esteja disponível.

### Processo de Análise

1. **Identificar a task/sessão**:

   - Use o argumento fornecido ou detecte a sessão ativa
   - Procure por pasta `sessions/{TASK_NAME}`

2. **Analisar arquivos existentes**:

   - Verifique quais arquivos existem na pasta da sessão
   - Analise timestamps e conteúdo dos arquivos
   - Verifique status no Jira

3. **Detectar etapa atual**:

   - **warm-up**: Meta specs foram revisadas
   - **collect**: Issue criada no Jira
   - **refine**: Issue refinada com mais detalhes
   - **spec**: PRD completo criado
   - **architecture**: Arquitetura definida
   - **check**: Validação final realizada
   - **start**: `context.md` existe
   - **plan**: `plan.md` existe
   - **work**: `plan.md` tem fases marcadas como completadas e `work-log.md` existe
   - **pre-pr**: Código finalizado, testes passando
   - **pr**: PR criado

4. **Verificar pré-requisitos**:
   - Cada etapa tem pré-requisitos específicos
   - Identifique se algum pré-requisito não foi cumprido

### Formato da Resposta

```
## Status do Fluxo - {TASK_NAME}

**Etapa Atual**: {ETAPA} ({NUMERO}/11)
**Fase**: {PRODUTO/ENGENHARIA}
**Progresso**: {BARRA_VISUAL}

### Arquivos Existentes
- ✅ context.md (criado em DD/MM/YYYY)
- ✅ plan.md (atualizado em DD/MM/YYYY)
- ⏳ Próximo: pre-pr

### Próximo Passo
{DESCRIÇÃO_DO_PRÓXIMO_PASSO}

### Validações
- ✅ Pré-requisito 1 cumprido
- ❌ Pré-requisito 2 pendente
```

### Argumentos

```
<task-name>
#$ARGUMENTS
</task-name>
```

## Casos Especiais

- **Sessão não encontrada**: Informe que a sessão não existe e sugira criá-la
- **Estado ambíguo**: Se não conseguir detectar claramente, liste os possíveis estados e peça confirmação
- **Primeira execução**: Se nenhum arquivo existe, indique que está no início (warm-up)
