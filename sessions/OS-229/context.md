# Accounts - Gestão de Contas (CRUD, tipos, saldo, transfer e reconcile) - Contexto de Desenvolvimento

# OS-229

## 🎯 Objetivo

Implementar no front web a gestão de contas financeiras (onde o dinheiro está) alinhada ao backend já disponível, permitindo CRUD de contas, visualização de saldo, transferência entre contas e reconciliação de saldo, além de integrações de navegação com áreas existentes. Manter consistência entre orçamento atual e contas, e atualizar saldos de forma reativa (signals) sem reload.

## 📋 Requisitos Funcionais

### Funcionalidades Principais

- CRUD de contas (criar, listar, editar, excluir)
- Tipagem de contas: corrente, poupança, carteira (física/digital), investimento, outros
- Exibição/controle de saldo
- Transferência entre contas
- Reconciliação de conta (ajuste com transação de ajuste)
- Listagem por orçamento atual
- Integrações de navegação (Dashboard, Budgets, Transactions, Goals, menu)

### Comportamentos Esperados

- Formulários com validações: `name` obrigatório; `type` obrigatório; `initialBalance >= 0`
- Exclusão: manter apenas "Excluir" (sem arquivamento). Exclusão é bloqueada quando houver transações vinculadas (regra do backend)
- Consistência: `accountId` deve pertencer ao `budgetId` atual
- Transferência: contas devem pertencer ao mesmo orçamento; validação de saldo suficiente no origem; sem taxas nem campos obrigatórios adicionais
- Reconciliação: front envia valor final esperado em centavos; backend calcula delta e cria transação de ajuste
- Atualização reativa de saldos após transfer/reconcile sem reload

## 🏗️ Considerações Técnicas

### Arquitetura

- Seguir Clean Architecture do projeto
- Entidades/DTOs alinhados aos contratos do backend (DTO-first)
- Use cases na camada de aplicação; ports/adapters para integração HTTP
- Estado reativo com signals e derivados com `computed()`

### Tecnologias e Dependências

- Angular 20+, Standalone Components, SCSS, Angular Material
- Signals para estado local; async pipe para observáveis
- Integração HTTP seguindo padrões existentes do projeto

### Padrões a Seguir

- DDD para modelos/domain
- Either pattern para tratamento de erros na aplicação (`@either`)
- Componentes com `ChangeDetectionStrategy.OnPush`
- Inputs/outputs via funções `input()`/`output()`

## 🧪 Estratégia de Testes

### Testes Necessários

- Unitários de serviços/estado (fetch/list, create/update/delete, transfer, reconcile)
- Unitários de componentes: formulários, validações e interações
- Mocks de HTTP para cenários de sucesso/erro e regras (bloqueio de exclusão; orçamento consistente)

### Critérios de Aceitação

- [ ] Lista contas do orçamento atual com id, nome, tipo e saldo
- [ ] Cria/edita/exclui contas, com bloqueio de exclusão quando houver transações
- [ ] Executa transferência entre contas com validações (mesmo orçamento; saldo suficiente)
- [ ] Executa reconciliação com cálculo de diferença e geração de transação de ajuste (valor final em centavos)
- [ ] Atualiza saldos visíveis após transfer/reconcile sem reload (signals)
- [ ] Integrações de navegação adicionadas (Dashboard, Budgets, Transactions, Goals, menu)
- [ ] Cobertura de testes > 80% e mensagens de erro/empty states adequadas

## 🔗 Dependências e Impactos

### Sistemas Afetados

- Dashboard (card “Contas” e ações rápidas)
- Budgets (seção “Contas do orçamento” + CTA)
- Transactions (filtro por conta e campo obrigatório em criação/edição)
- Goals (links de navegação relevantes)
- Menu/side-nav (rota `/accounts`)

### Integrações Necessárias

- GET `/accounts?budgetId=...`
- POST `/account/create-account`
- POST `/account/update-account`
- POST `/account/delete-account`
- POST `/account/reconcile-account`
- POST `/account/transfer-between-accounts`

## 🚧 Restrições e Considerações

### Limitações Técnicas

- Sem arquivamento neste momento (somente exclusão)
- Reconciliação: enviar valor final em centavos; backend executa o cálculo e cria ajuste
- Transferência: sem taxas/memo obrigatórios; somente mesma budgetId
- Tipagem simples (sem subtipos) e ícones/cores podem ser tratados de forma básica inicialmente

### Riscos

- Consistência entre orçamento atual e contas/transferências
- Concorrência com criação de transações alterando saldos durante operações
- UX de bloqueio de exclusão quando houver transações (mensagens claras)

## 📚 Referências

- Issue/Card: OS-229 (Jira)
- Especificação: descrição detalhada no ticket
- Arquitetura/meta-specs: ver `meta_specs_path` configurado em `ai.properties.md`





