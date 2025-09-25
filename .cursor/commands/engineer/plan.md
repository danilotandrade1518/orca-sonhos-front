# Engineer Planning

Este é o comando para criar um planejamento detalhado de implementação de uma funcionalidade.

## Argumentos da Sessão

<arguments>
#$ARGUMENTS
</arguments>

## Objetivo

Transformar o contexto e arquitetura definidos em um plano de implementação faseado, permitindo desenvolvimento incremental e manejo de sessões interrompidas.

## Processo de Planejamento

### 1. Análise dos Documentos Base

Leia os seguintes arquivos na pasta `sessions/<feature_slug>`:

- **context.md**: Entendimento dos requisitos e objetivos
- **architecture.md**: Design técnico e decisões arquiteturais

### 2. Desenvolvimento do Plano

Crie um plano de implementação que divida o trabalho em fases gerenciáveis:

#### Critérios para Fases

- **Duração**: Cada fase deve ser completável em ~2 horas de trabalho
- **Testabilidade**: Cada fase deve produzir algo verificável
- **Incrementalidade**: Fases devem construir sobre as anteriores
- **Independência**: Falhas em uma fase não devem bloquear outras

#### Considerações Técnicas

Durante o planejamento, realize pesquisas adicionais se necessário:

- **Análise de Código**: Use ferramentas MCP para examinar implementações similares
- **Documentação**: Consulte Context7 para APIs de bibliotecas
- **Melhores Práticas**: Use Web Search para padrões e convenções

### 3. Estrutura do Plano

Crie o arquivo `sessions/<feature_slug>/plan.md` usando o template:

## Template do Plan.md

```markdown
# [NOME DA FUNCIONALIDADE] - Plano de Implementação

> **Instruções**: Mantenha este arquivo atualizado conforme o progresso. Marque tarefas como concluídas ✅, em progresso ⏰ ou não iniciadas ⏳.

## 📋 Resumo Executivo

[Descrição breve do que será implementado]

## 🎯 Objetivos da Implementação

- [Objetivo principal]
- [Objetivo secundário]
- [Critérios de sucesso]

---

## 📅 FASE 1: [NOME DA FASE] [Status: ⏳]

### 🎯 Objetivo da Fase

[O que esta fase alcançará]

### 📋 Tarefas

#### [Nome da Tarefa] [⏳]

**Descrição**: [O que precisa ser feito]
**Arquivos**: [Lista de arquivos afetados]
**Critério de Conclusão**: [Como saber que está completo]

#### [Outra Tarefa] [⏳]

**Descrição**: [Detalhes da implementação]
**Dependências**: [Tarefas que devem ser completadas antes]
**Validação**: [Como testar]

### 🧪 Critérios de Validação

- [ ] [Critério 1]
- [ ] [Critério 2]

### 📝 Comentários da Fase

_[Espaço para anotações durante desenvolvimento]_

---

## 📅 FASE 2: [NOME DA FASE] [Status: ⏳]

### 🎯 Objetivo da Fase

[Próximo conjunto de funcionalidades]

### 📋 Tarefas

#### [Nome da Tarefa] [⏳]

**Descrição**: [Implementação específica]
**Dependências**: [Fase 1 completa]
**Complexidade**: [Alta/Média/Baixa]

#### [Outra Tarefa] [⏳]

**Descrição**: [Detalhes técnicos]
**Testes Necessários**: [Tipos de teste]

### 🔄 Dependências

- ✅ Fase 1 completada
- [Outras dependências externas]

### 📝 Comentários da Fase

_[Observações sobre decisões tomadas]_

---

## 📅 FASE 3: [NOME DA FASE] [Status: ⏳]

### 🎯 Objetivo da Fase

[Finalização e polimento]

### 📋 Tarefas

#### [Tarefa Final] [⏳]

**Descrição**: [Últimos ajustes]
**Foco**: [Qualidade, performance, docs]

### 🏁 Entrega Final

- [ ] Todos os testes passando
- [ ] Documentação atualizada
- [ ] Code review interno realizado
- [ ] Pronto para PR

---

## 🔀 Estratégia de Desenvolvimento

### Ordem de Execução

1. **Sequencial**: Fases 1 → 2 → 3 (dependências claras)
2. **Paralelo**: [Tarefas que podem ser feitas simultaneamente]

### Pontos de Validação

- **Após Fase 1**: [Validação específica]
- **Após Fase 2**: [Teste de integração]
- **Final**: [Validação completa]

### Contingências

- **Se Fase X falhar**: [Plano alternativo]
- **Se dependência atrasar**: [Como contornar]

## 🧪 Estratégia de Testes

### Testes por Fase

- **Fase 1**: [Tipos de teste específicos]
- **Fase 2**: [Testes de integração]
- **Fase 3**: [Testes end-to-end]

### Dados de Teste

[Fixtures, mocks ou dados necessários]

## 📚 Referências e Pesquisas

### Documentação Consultada

- [API/Biblioteca]: [Link ou fonte]
- [Padrão/Convenção]: [Referência]

### Decisões Arquiteturais Durante Planejamento

- **Decisão**: [Escolha feita]
- **Motivo**: [Justificativa baseada em pesquisa]
- **Impacto**: [Como afeta o plano]

## 🚨 Riscos Identificados

### Riscos Técnicos

- **Risco**: [Possível problema]
- **Probabilidade**: [Alta/Média/Baixa]
- **Mitigação**: [Como lidar]

### Riscos de Dependência

- **Dependência Externa**: [Sistema/API]
- **Impacto se Indisponível**: [Consequências]
- **Plano B**: [Alternativa]

## 📈 Métricas de Progresso

### Por Fase

- Fase 1: [X tarefas, ~Y horas estimadas]
- Fase 2: [X tarefas, ~Y horas estimadas]
- Fase 3: [X tarefas, ~Y horas estimadas]

### Total

- **Tarefas**: [Número total]
- **Tempo Estimado**: [Horas totais]
- **Marcos**: [Principais entregas]
```

### 4. Validação e Refinamento

#### Revisão Técnica

- Verifique se todas as tarefas são implementáveis
- Confirme que as dependências estão corretas
- Valide estimativas de tempo

#### Pesquisa Complementar

Se durante o planejamento surgirem dúvidas:

- Use **Context7** para documentação de bibliotecas
- Consulte **Web Search** para melhores práticas
- Analise código similar no projeto com ferramentas MCP

#### Atualização de Documentos

Se o planejamento revelar necessidade de ajustes:

- Atualize **architecture.md** se necessário
- Revise **context.md** para esclarecimentos
- Documente mudanças e justificativas

### 5. Aprovação Final

- Apresente o plano completo ao usuário
- Solicite feedback sobre a abordagem faseada
- Ajuste baseado em comentários
- Obtenha aprovação explícita para prosseguir

### 6. Atualização de Status

Após aprovação:

- Atualize status no sistema de gestão de tarefas
- Marque contexto e arquitetura como aprovados
- Prepare para início da implementação (`/work`)

## Ferramentas de Apoio

- **Code Understanding**: Para análise de implementações similares
- **Context7**: Para documentação de bibliotecas e APIs
- **Web Search**: Para melhores práticas e padrões
- **GitHub**: Para análise de issues e PRs relacionados

## Princípios do Planejamento

1. **Incrementalidade**: Cada fase deve agregar valor
2. **Testabilidade**: Sempre considere como validar
3. **Flexibilidade**: Permita ajustes durante implementação
4. **Rastreabilidade**: Mantenha ligação com requisitos originais
5. **Realismo**: Estimativas baseadas em complexidade real

## Próximos Passos

Após aprovação do plano:

1. **Implementação** (`/work`) - Execução das fases planejadas
2. **Revisões** (`/pre-pr`) - Validações de qualidade
3. **Pull Request** (`/pr`) - Submissão final
