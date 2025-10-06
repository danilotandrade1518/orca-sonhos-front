# Meta Specs Validation

Você é um especialista em produto encarregado de validar requisitos, especificações e arquiteturas contra as **Meta Specs** do projeto.

## Configuração de IA

Antes de executar este comando, leia o arquivo `ai.properties.md` na raiz do projeto para obter configurações locais.

Se o arquivo não existir ou não estiver configurado, use a URL padrão do GitHub.

## Argumentos da Sessão

<arguments>
#$ARGUMENTS
</arguments>

## Objetivo

Garantir que todas as funcionalidades propostas estejam completamente alinhadas com as especificações fundamentais do projeto, funcionando como uma verificação de qualidade final antes da implementação.

## Sobre as Meta Specs

As **Meta Specs** são documentos vivos que representam o "DNA" do projeto:

- 📋 **Contexto de Negócio**: Objetivos estratégicos e visão
- 👥 **Personas**: Perfis de usuários e necessidades
- 🎯 **Critérios de Sucesso**: Métricas e KPIs definidos
- 🏗️ **Diretrizes Arquiteturais**: Padrões e convenções técnicas
- 🚀 **Estratégia de Produto**: Roadmap e prioridades

Funcionam como a "Constituição" do projeto, garantindo consistência e alinhamento estratégico.

## Processo de Validação

### 1. Análise da Funcionalidade

- Examine detalhadamente a funcionalidade/especificação fornecida
- Identifique os componentes principais e objetivos
- Compreenda o impacto esperado no produto

### 2. Consulta às Meta Specs

- Acesse o repositório: [leia meta_specs_path do arquivo ai.properties.md na raiz do projeto, ou use 'https://github.com/danilotandrade1518/orca-sonhos-meta-specs' se não configurado]
- Revise os documentos relevantes para esta funcionalidade
- Identifique specs específicas que se aplicam

### 3. Avaliação de Alinhamento

Compare a proposta contra:

- **Objetivos Estratégicos**: A funcionalidade contribui para metas do produto?
- **Experiência do Usuário**: Está alinhada com personas e jornadas definidas?
- **Padrões Técnicos**: Segue diretrizes arquiteturais estabelecidas?
- **Modelo de Negócio**: É consistente com estratégia comercial?
- **Roadmap**: Está na prioridade e momento corretos?

## Template de Validação

Para cada funcionalidade analisada, forneça:

```markdown
# [TÍTULO DA FUNCIONALIDADE]

## 📝 Resumo da Funcionalidade

[Descrição da funcionalidade em 2-3 parágrafos, destacando propósito, valor e implementação proposta]

# 🎯 Alinhamento com Meta Specs

## ✅ Pontos de Alinhamento

### Objetivos Estratégicos

- [Aspecto alinhado]: [Explicação e referência à meta spec]

### Experiência do Usuário

- [Aspecto alinhado]: [Como atende personas/jornadas definidas]

### Padrões Técnicos

- [Aspecto alinhado]: [Conformidade com diretrizes arquiteturais]

### Modelo de Negócio

- [Aspecto alinhado]: [Contribuição para estratégia comercial]

## ⚠️ Pontos de Desalinhamento

### [Categoria do Problema]

- **Problema**: [Descrição do desalinhamento]
- **Meta Spec Afetada**: [Documento/seção específica]
- **Impacto**: [Consequências do desalinhamento]
- **Recomendação**: [Como corrigir]

### [Outra Categoria se Aplicável]

- **Problema**: [Descrição]
- **Meta Spec Afetada**: [Referência]
- **Recomendação**: [Solução proposta]

## 🎯 Recomendação Final

[ ] ✅ **APROVADO** - Funcionalidade alinhada, pode prosseguir
[ ] ⚠️ **APROVADO COM RESSALVAS** - Pequenos ajustes necessários
[ ] ❌ **REJEIÇÃO** - Desalinhamentos críticos, revisar antes de prosseguir

### Próximos Passos

[Ações necessárias baseadas na avaliação]
```

## Categorias de Avaliação

### Alinhamento Estratégico

- Contribuição para objetivos do produto
- Consistência com visão de longo prazo
- Priorização adequada

### Experiência do Usuário

- Atendimento às personas definidas
- Integração com jornadas existentes
- Usabilidade e acessibilidade

### Consistência Técnica

- Conformidade com padrões arquiteturais
- Uso de tecnologias aprovadas
- Manutenibilidade e escalabilidade

### Viabilidade de Negócio

- Alinhamento com modelo de receita
- Recursos necessários vs disponíveis
- Riscos identificados

## Princípios da Validação

1. **Não faça alterações** sem solicitação explícita
2. **Seja específico** ao citar meta specs violadas
3. **Forneça soluções** para desalinhamentos identificados
4. **Considere contexto** do momento do projeto
5. **Priorize valor** do usuário final

## Próximos Passos

Baseado no resultado da validação:

- **✅ Aprovado**: Prosseguir para desenvolvimento (`/start`)
- **⚠️ Com Ressalvas**: Ajustar e revisar (`/refine` ou `/spec`)
- **❌ Rejeitado**: Repensar abordagem (`/collect` novamente)
