# Flow Next

Este comando sugere o próximo passo no fluxo de desenvolvimento baseado no estado atual.

## Uso
```
/flow next [task-name]
```

Se `task-name` não for fornecido, usa a sessão ativa atual.

## Funcionamento

Você é um especialista em gestão de fluxo de desenvolvimento. Sua tarefa é analisar o estado atual e sugerir o próximo passo apropriado.
Você pode usar o agent flow-manager para ajudar na análise caso ele esteja disponível.

### Processo

1. **Detectar estado atual**:
   - Use a mesma lógica do `/flow status`
   - Identifique em qual etapa está (1-11)

2. **Validar pré-requisitos**:
   - Verifique se a etapa atual foi realmente completada
   - Identifique pré-requisitos pendentes

3. **Sugerir próximo passo**:
   - Se etapa atual está completa: sugira próxima etapa
   - Se etapa atual está incompleta: sugira como completá-la
   - Se há pré-requisitos pendentes: priorize-os

### Mapeamento de Próximos Passos

#### Produto
- **warm-up** → `/product collect` - Coletar requisitos
- **collect** → `/product refine` - Refinar requisitos
- **refine** → `/product spec` - Criar PRD
- **spec** → `/product architecture` - Definir arquitetura
- **architecture** → `/product check` - Validação final
- **check** → `/engineer start` - Iniciar desenvolvimento

#### Engenharia
- **start** → `/engineer plan` - Criar plano de implementação
- **plan** → `/engineer work` - Iniciar desenvolvimento
- **work** → `/engineer pre-pr` - Preparar PR
- **pre-pr** → `/engineer pr` - Criar PR
- **pr** → ✅ Fluxo completo

### Validações Específicas

#### Pré-requisitos por Etapa
- **collect**: Warm-up realizado, meta specs revisadas
- **refine**: Issue criada no task manager
- **spec**: Requisitos refinados
- **architecture**: PRD aprovado
- **check**: Arquitetura definida
- **start**: Check aprovado, issue do task manager identificada
- **plan**: context.md criado e aprovado
   - **work**: `plan.md` tem fases marcadas como completadas e `work-log.md` existe
- **pre-pr**: Todas as fases do plan.md completadas
- **pr**: Código revisado, testes passando

### Formato da Resposta

```
## Próximo Passo - {TASK_NAME}

### Estado Atual
**Etapa**: {ETAPA_ATUAL} ({NUMERO}/11)
**Status**: {COMPLETA/INCOMPLETA/PENDENTE}

### Próxima Ação
**Comando**: `/product collect` ou `/engineer start`
**Descrição**: {DESCRIÇÃO_DETALHADA}

### Pré-requisitos
- ✅ Requisito cumprido
- ❌ Requisito pendente: {DESCRIÇÃO}

### Contexto
{CONTEXTO_ADICIONAL_SOBRE_O_PRÓXIMO_PASSO}
```

### Casos Especiais

1. **Etapa atual incompleta**:
   ```
   ⚠️ **Etapa atual não finalizada**

   Antes de avançar para a próxima etapa, complete:
   - [ ] Ação pendente 1
   - [ ] Ação pendente 2
   ```

2. **Pré-requisitos não cumpridos**:
   ```
   ❌ **Pré-requisitos pendentes**

   Execute primeiro:
   1. {PASSO_1}
   2. {PASSO_2}
   ```

3. **Fluxo completo**:
   ```
   🎉 **Fluxo Completo!**

   Todas as etapas foram concluídas. A feature está pronta!
   ```

### Argumentos
```
<task-name>
#$ARGUMENTS
</task-name>
```

### Integrações

- **Task Manager**: Verificar status da issue
- **Git**: Verificar branch e commits
- **Arquivos**: Analisar arquivos da sessão (.claude/sessions/{TASK_NAME})
- **Plan.md**: Verificar progresso das fases

### Sugestões Contextuais

O comando deve fornecer sugestões específicas baseadas no contexto:

- **Arquivos faltando**: "Crie o arquivo context.md antes de prosseguir"
- **Issue não refinada**: "Refine a issue no task manager com mais detalhes"
- **Fases incompletas**: "Complete a Fase 2 do plan.md antes de prosseguir"
- **Testes falhando**: "Execute os testes e corrija falhas antes do PR"