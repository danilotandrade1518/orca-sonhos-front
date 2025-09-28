# Pre-PR Review

Este comando executa revisões automatizadas de qualidade antes da criação do Pull Request.

## Objetivo

Garantir que o código desenvolvido está alinhado com as especificações, padrões de qualidade e documentação do projeto antes da submissão para revisão humana.

## Processo de Revisão

### 1. Preparação

- Confirme que toda implementação planejada foi completada
- Verifique que o **plan.md** está atualizado com todas as fases marcadas como concluídas
- Execute testes locais para garantir funcionamento básico

### 2. Execução dos Agentes de Revisão

Execute os seguintes agentes especializados na ordem indicada:

#### 🎯 Product Review Specialist

- **Objetivo**: Verificar alinhamento com Meta Specs do projeto
- **Foco**: Validação contra requisitos de produto e objetivos estratégicos
- **Ação**: Invoque o agente para analisar se a implementação atende às especificações

#### 🔍 Code Review Specialist

- **Objetivo**: Revisão técnica da implementação
- **Foco**: Qualidade, padrões, segurança e manutenibilidade do código
- **Ação**: Invoque o agente para análise completa do código desenvolvido

#### 📚 Meta Spec Review Specialist

- **Objetivo**: Atualização e consistência da documentação
- **Foco**: Verificar se mudanças requerem atualizações nas Meta Specs
- **Ação**: Invoque o agente para avaliar impactos na documentação

### 3. Processamento do Feedback

Para cada agente executado:

#### Análise dos Comentários

- Categorize feedback em: **Crítico**, **Importante**, **Sugestão**
- Identifique ações necessárias vs. opcionais
- Priorize correções por impacto

#### Implementação de Correções

- **Críticos**: Corrija imediatamente todos os problemas identificados
- **Importantes**: Avalie necessidade e implemente correções relevantes
- **Sugestões**: Considere implementar se agregar valor significativo

#### Validação das Correções

- Re-execute testes após cada correção
- Confirme que correções não introduziram novos problemas
- Documente mudanças realizadas

### 4. Checklist de Qualidade Final

Antes de prosseguir, confirme:

#### Funcionalidade

- [ ] Todos os requisitos implementados
- [ ] Casos de teste passando
- [ ] Integração funcionando corretamente

#### Código

- [ ] Padrões do projeto seguidos
- [ ] Código limpo (sem comentários/debug temporário)
- [ ] Tratamento adequado de erros
- [ ] Performance aceitável

#### Segurança

- [ ] Validação de entradas implementada
- [ ] Sem vazamentos de informações sensíveis
- [ ] Autenticação/autorização adequadas (se aplicável)

#### Documentação

- [ ] Comentários necessários adicionados
- [ ] README atualizado se necessário
- [ ] API docs atualizadas (se aplicável)

### 5. Relatório de Revisão

Compile um relatório final:

## Template de Relatório Pre-PR

```markdown
# 🔍 Relatório Pre-PR - [Nome da Funcionalidade]

## 📋 Resumo da Revisão

- **Data**: [Data da revisão]
- **Branch**: [Nome da branch]
- **Commit**: [Hash do último commit]

## 🤖 Agentes Executados

### Product Review Specialist ✅

- **Status**: [Aprovado/Com Ressalvas/Rejeitado]
- **Principais Comentários**:
  - [Feedback 1]
  - [Feedback 2]
- **Ações Tomadas**: [Correções implementadas]

### Code Review Specialist ✅

- **Status**: [Aprovado/Com Ressalvas/Rejeitado]
- **Problemas Críticos**: [Nenhum/Lista]
- **Melhorias Implementadas**: [Lista de correções]
- **Sugestões Pendentes**: [Melhorias não implementadas]

### Meta Spec Review Specialist ✅

- **Status**: [Aprovado/Atualização Necessária]
- **Documentação Atualizada**: [Sim/Não/N/A]
- **Impactos Identificados**: [Lista de impactos nas specs]

## ✅ Checklist de Qualidade Final

- [x] Funcionalidade completa e testada
- [x] Código limpo e seguindo padrões
- [x] Segurança verificada
- [x] Documentação atualizada
- [x] Performance adequada

## 📊 Métricas de Qualidade

- **Cobertura de Testes**: [Porcentagem]
- **Problemas Críticos**: [Número - deve ser 0]
- **Technical Debt**: [Baixo/Médio/Alto]

## 🎯 Recomendação Final

- **Status**: ✅ PRONTO PARA PR / ⚠️ CORREÇÕES NECESSÁRIAS / ❌ NECESSITA REVISÃO MAIOR
- **Próximas Ações**: [Lista de ações se necessário]

## 📝 Observações Adicionais

[Comentários sobre decisões técnicas, trade-offs, etc.]
```

### 6. Aprovação para PR

Após completar todas as revisões e correções:

#### Validação Final

- Execute suite completa de testes
- Confirme build sem erros
- Verifique que branch está atualizada

#### Solicitação de Aprovação

```markdown
## 🎯 Pre-PR Review Completada

### ✅ Status da Revisão

Todas as verificações automatizadas foram executadas e feedback implementado.

### 🔧 Correções Realizadas

- [Lista das principais correções]

### 🧪 Validações Finais

- [x] Testes passando
- [x] Build sem erros
- [x] Feedback dos agentes implementado
- [x] Documentação atualizada

**Posso prosseguir com a criação do Pull Request?**
```

**🛑 IMPORTANTE**: Aguarde aprovação explícita do usuário antes de prosseguir para `/pr`.

### 7. Preparação dos Artefatos

Prepare para o PR:

#### Documentação da Implementação

- Summary das funcionalidades implementadas
- Lista de arquivos modificados/criados
- Notas sobre decisões técnicas importantes

#### Configuração de Metadados

- Labels apropriados para o PR
- Reviewers sugeridos
- Links para issues/cards relacionados

## Ferramentas de Apoio

- **Agentes Especializados**: Product, Code e Meta Spec Review
- **Testes Automatizados**: Suite completa do projeto
- **Análise de Código**: Linting, formatação, análise estática
- **Validação de Build**: Confirmar que projeto compila sem erros

## Princípios da Revisão

1. **Qualidade**: Nunca comprometa padrões por velocidade
2. **Completude**: Todos os agentes devem ser executados
3. **Correção**: Implemente feedback crítico obrigatoriamente
4. **Documentação**: Mantenha rastreabilidade das mudanças
5. **Aprovação**: Sempre aguarde autorização antes de prosseguir

## Próximos Passos

Após aprovação do Pre-PR:

1. **Pull Request** (`/pr`) - Criação e submissão do PR
2. **Aguardar Review** - Processo de revisão humana
3. **Deploy** - Após merge e aprovação final
