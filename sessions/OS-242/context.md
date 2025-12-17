# Padronizar páginas de listagem - Contexto de Desenvolvimento

# OS-242

## 🎯 Objetivo

Padronizar todas as páginas de listagem do sistema para seguir um padrão consistente, garantindo que:

- Todas tenham botão "Novo [Entidade]" no header da página
- O botão navegue para uma página de criação dedicada (não modal)
- Formulários de criação e edição sejam páginas próprias, melhorando a experiência do usuário e permitindo URLs compartilháveis
- Criar versões sem modal dos componentes de formulário para uso em páginas
- Criar testes unitários para todas as novas páginas
- Manter funcionalidades existentes que não sejam relacionadas à criação/edição

## 📋 Requisitos Funcionais

### Funcionalidades Principais

1. **Padronização de Navegação**: Todas as páginas de listagem devem ter botão "Novo" no header que navega para página de criação
2. **Conversão de Modais para Páginas**: Formulários de criação e edição que atualmente são modais devem ser convertidos para páginas próprias
3. **Componentes de Formulário**: Criar versões sem wrapper de modal dos componentes de formulário para uso em páginas
4. **Manutenção de Funcionalidades**: Ações secundárias existentes (como "Transferir" em Contas) devem ser mantidas
5. **Consistência Visual**: Todas as páginas devem seguir o padrão visual estabelecido em Orçamentos
6. **Testes Unitários**: Criar testes unitários para todas as novas páginas de criação e edição

### Comportamentos Esperados

- **Botão "Novo" no Header**: Deve estar presente em todas as páginas de listagem, usando `os-page-header` com actions
- **Navegação**: Ao clicar no botão "Novo", o usuário deve ser redirecionado para uma página dedicada de criação
- **Páginas de Criação e Edição**: Devem seguir o padrão de `budget-create.page.ts` com breadcrumbs, formulário usando `os-form-template` e navegação de volta
- **Componentes de Formulário**: Criar versões sem wrapper de modal que podem ser reutilizadas em páginas
- **Filtros**: Manter filtros existentes onde já estão implementados (não adicionar onde não existem)
- **Rotas**: Atualizar rotas para apontar para páginas de criação e edição em vez de modais
- **Testes**: Criar testes unitários completos para todas as novas páginas

## 🏗️ Considerações Técnicas

### Arquitetura

- **Padrão de Referência**: `budget-list.page.ts` e `budget-create.page.ts`
- **Componentes Principais**:
  - `os-page`: Container principal da página
  - `os-page-header`: Header com título, subtítulo e ações
  - `os-form-template`: Template para formulários de criação
  - `os-filter-bar`: Barra de filtros (onde já existe)

### Tecnologias e Dependências

- **Angular Router**: Para navegação entre páginas
- **Reactive Forms**: Para formulários de criação
- **Signals**: Para gerenciamento de estado reativo
- **Change Detection**: OnPush para otimização de performance

### Padrões a Seguir

1. **Estrutura de Página de Listagem**:

   ```typescript
   - os-page
     - os-page-header (com actions)
     - os-filter-bar (se existir)
     - os-entity-list ou conteúdo da lista
     - Modais apenas para confirmações (ex: delete)
   ```

2. **Estrutura de Página de Criação**:

   ```typescript
   - os-page
     - os-page-header (com breadcrumbs)
     - os-form-template
       - Formulário reativo
   ```

3. **Rotas**:
   ```typescript
   {
     path: 'new',
     loadComponent: () => import('./pages/[entity]-create/[entity]-create.page').then(m => m.[Entity]CreatePage),
     title: 'Novo [Entidade]'
   }
   ```

## 🧪 Estratégia de Testes

### Testes Necessários

- **Testes Unitários de Páginas**: Testar inicialização, validação, submissão e navegação de todas as páginas de criação e edição
- **Testes de Navegação**: Verificar que botões "Novo" e "Editar" navegam corretamente
- **Testes de Rotas**: Validar que rotas de criação e edição estão configuradas corretamente
- **Testes de Formulários**: Garantir que formulários de criação e edição funcionam como esperado
- **Testes de Validação**: Testar todas as validações de formulários
- **Testes de Integração**: Testar fluxo completo de criação/edição e retorno à listagem
- **Testes de Regressão**: Verificar que funcionalidades existentes não foram quebradas

### Critérios de Aceitação

- [ ] Todas as páginas de listagem têm botão "Novo [Entidade]" no header
- [ ] Botão "Novo" navega para página de criação (implementar ação de navegação)
- [ ] Formulários de criação são páginas próprias (não modais)
- [ ] Formulários de edição são páginas próprias (não modais)
- [ ] Criar versões sem modal dos componentes de formulário
- [ ] Remover lógica de modal de criação e edição das páginas de listagem
- [ ] Atualizar rotas para incluir páginas de criação e edição quando necessário
- [ ] Padronizar estrutura visual seguindo o padrão de Orçamentos
- [ ] Criar testes unitários para todas as novas páginas
- [ ] Manter filtros existentes (não adicionar onde não existem)
- [ ] Manter ações secundárias existentes (ex: Transferir em Contas)

## 🔗 Dependências e Impactos

### Sistemas Afetados

1. **Orçamentos** (`budget-list.page.ts`, `budget.routes.ts`)

   - Converter modal de criação para página
   - Atualizar rota `/budgets/new`

2. **Contas** (`accounts.page.ts`, `accounts.routes.ts`)

   - Criar `accounts-create.page.ts`
   - Atualizar rota para usar página
   - Manter ação "Transferir"

3. **Cartões de Crédito** (`credit-cards.page.ts`, `credit-cards.routes.ts`)

   - Criar `credit-cards-create.page.ts`
   - Atualizar rota para usar página

4. **Transações** (`transactions.page.ts`, `transactions.routes.ts`)

   - Criar `transactions-create.page.ts`
   - Remover lógica de modal
   - Adicionar rota de criação

5. **Categorias** (`categories-page.component.ts`, `categories.routes.ts`)

   - Criar `categories-create.page.ts`
   - Atualizar botão para navegar para página

6. **Envelopes** (`envelopes.page.ts`, `envelopes.routes.ts`)
   - Verificar navegação do botão (já tem página de criação)

### Integrações Necessárias

- **Formulários Existentes**: Criar versões sem modal dos componentes de formulário existentes (`AccountFormComponent`, `CreditCardFormComponent`, etc.) para uso em páginas
- **Estados**: Integrar com estados existentes (`AccountState`, `CreditCardState`, etc.)
- **Navegação**: Usar Angular Router para navegação entre páginas
- **Testes**: Criar testes unitários usando Vitest e Angular Testing Library

## 🚧 Restrições e Considerações

### Limitações Técnicas

- Não adicionar filtros onde não existem atualmente
- Manter compatibilidade com funcionalidades existentes
- Não alterar comportamento de ações secundárias (ex: Transferir)

### Riscos

- **Quebra de Funcionalidades**: Risco de quebrar funcionalidades existentes ao remover modais
- **Inconsistência**: Risco de criar páginas inconsistentes se não seguir o padrão
- **Migração de Dados**: Não há migração de dados necessária

### Mitigações

- Testar cada página individualmente após mudanças
- Seguir rigorosamente o padrão estabelecido em `budget-create.page.ts`
- Manter testes existentes e adicionar novos quando necessário

## 📚 Referências

- Issue: [OS-242](https://orca-sonhos.atlassian.net/browse/OS-242)
- Padrão de Referência: `src/app/features/budget/pages/budget-list/budget-list.page.ts`
- Padrão de Criação: `src/app/features/budget/pages/budget-create/budget-create.page.ts`
- Componentes UI: `src/app/shared/ui-components/`

## 📝 Estado Atual das Páginas

### Orçamentos

- ✅ Botão no header
- ✅ Filtros
- ⚠️ Usa modal para criação (precisa converter)
- ⚠️ Usa modal para edição (precisa converter)

### Metas

- ✅ Botão no header
- ✅ Filtros
- ✅ Página de criação

### Contas

- ✅ Botão no header
- ❌ Sem filtros (manter assim)
- ⚠️ Usa modal para criação (precisa converter)
- ⚠️ Usa modal para edição (precisa converter)
- ✅ Ação "Transferir" (manter)

### Cartões de Crédito

- ✅ Botão no header
- ❌ Sem filtros (manter assim)
- ⚠️ Usa modal para criação (precisa converter)
- ⚠️ Usa modal para edição (precisa converter)

### Transações

- ✅ Botão no header
- ✅ Filtros
- ⚠️ Usa modal para criação (precisa converter)
- ⚠️ Usa modal para edição (precisa converter)

### Categorias

- ✅ Botão no header
- ❌ Sem filtros (manter assim)
- ⚠️ Usa componente interno (precisa criar página)
- ⚠️ Edição via componente interno (precisa criar página)

### Envelopes

- ✅ Botão no header
- ❌ Sem filtros (manter assim)
- ✅ Página de criação (verificar navegação)
- ✅ Página de edição (verificar se está correta)
