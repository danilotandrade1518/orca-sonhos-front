# Testes E2E - Orçamentos

Este diretório contém os testes end-to-end (E2E) para a funcionalidade de orçamentos usando Playwright.

## 📋 Estrutura

```
e2e/
├── helpers/
│   ├── auth.helper.ts          # Helper para autenticação
│   ├── budget.helper.ts         # Helper para interações com orçamentos
│   └── participants.helper.ts   # Helper para gerenciamento de participantes
├── budget-crud.e2e.spec.ts      # Testes de CRUD de orçamentos
├── budget-participants.e2e.spec.ts  # Testes de participantes
└── README.md                    # Este arquivo
```

## 🚀 Como Executar

### Pré-requisitos

1. **Instalar dependências**:
   ```bash
   cd orca-sonhos-front
   npm install --legacy-peer-deps
   ```

2. **Instalar navegadores do Playwright**:
   ```bash
   npx playwright install
   ```

   **Nota**: Se houver conflitos de peer dependencies (especialmente com Storybook), use `--legacy-peer-deps` na instalação.

3. **Subir aplicações** (back-end e front-end):
   ```bash
   # Na raiz do projeto
   docker-compose up
   ```

   Ou manualmente:
   ```bash
   # Terminal 1: Back-end
   cd orca-sonhos-back
   npm run dev

   # Terminal 2: Front-end
   cd orca-sonhos-front
   npm start
   ```

### Executar Testes

```bash
# Todos os testes E2E
npm run test:e2e

# Com interface gráfica
npm run test:e2e:ui

# Modo headed (ver navegador)
npm run test:e2e:headed

# Modo debug
npm run test:e2e:debug

# Apenas testes de CRUD
npx playwright test budget-crud

# Apenas testes de participantes
npx playwright test budget-participants
```

## 📝 Testes Implementados

### Testes de CRUD (`budget-crud.e2e.spec.ts`)

- ✅ Criar orçamento PERSONAL
- ✅ Criar orçamento SHARED
- ✅ Editar orçamento existente
- ✅ Deletar orçamento existente
- ✅ Cancelar exclusão de orçamento
- ✅ Validar campos obrigatórios
- ✅ Validar nome muito curto
- ✅ Exibir lista vazia
- ✅ Filtrar orçamentos por tipo
- ✅ Buscar orçamentos por nome

### Testes de Participantes (`budget-participants.e2e.spec.ts`)

- ✅ Criar orçamento SHARED e adicionar participante
- ✅ Remover participante de orçamento SHARED
- ✅ Exibir erro ao tentar adicionar participante em PERSONAL
- ✅ Atualizar contagem após adicionar múltiplos participantes
- ✅ Exibir erro ao adicionar participante duplicado
- ✅ Sincronizar contagem após remover participante

## 🔧 Helpers

### AuthHelper

Helper para gerenciar autenticação nos testes:

```typescript
const authHelper = new AuthHelper(page);
await authHelper.login('user-id', 'email@example.com', 'User Name');
await authHelper.logout();
const isAuth = await authHelper.isAuthenticated();
```

### BudgetHelper

Helper para interações com a página de orçamentos:

```typescript
const budgetHelper = new BudgetHelper(page);
await budgetHelper.navigateToBudgetList();
await budgetHelper.clickCreateBudget();
await budgetHelper.fillBudgetForm('Nome do Orçamento', 'PERSONAL');
await budgetHelper.saveBudgetForm();
await budgetHelper.expectSuccessNotification();
await budgetHelper.expectBudgetInList('Nome do Orçamento');
```

### ParticipantsHelper

Helper para gerenciamento de participantes:

```typescript
const participantsHelper = new ParticipantsHelper(page);
await participantsHelper.openManageParticipants();
await participantsHelper.addParticipant('email@example.com');
await participantsHelper.expectParticipantCount(1);
await participantsHelper.removeParticipant('email@example.com');
```

## ⚙️ Configuração

A configuração do Playwright está em `playwright.config.ts` na raiz do projeto front-end.

**Variáveis de ambiente**:
- `E2E_BASE_URL`: URL base da aplicação (padrão: `http://localhost:4200`)

**Configurações importantes**:
- `baseURL`: URL base para os testes
- `webServer`: Comando para iniciar servidor de desenvolvimento
- `retries`: Número de tentativas em caso de falha (2 em CI, 0 localmente)
- `screenshot`: Captura screenshot apenas em falhas
- `video`: Grava vídeo apenas em falhas

## 🐛 Troubleshooting

### Erro ao instalar Playwright

Se você encontrar erros de peer dependencies ao instalar o Playwright (especialmente conflitos com Storybook):

```bash
npm install @playwright/test --save-dev --legacy-peer-deps
```

Um arquivo `.npmrc` foi criado na raiz do projeto com `legacy-peer-deps=true` para facilitar instalações futuras.

### Testes falhando por timeout

- Verifique se o back-end está rodando na porta 3000
- Verifique se o front-end está rodando na porta 4200
- Aumente o timeout no `playwright.config.ts` se necessário

### Erro de autenticação

- O ambiente usa `authBypass: true` em desenvolvimento
- O `AuthHelper` simula autenticação via localStorage
- Verifique se o `MockAuthServiceAdapter` está sendo usado

### Elementos não encontrados

- Use `page.waitForSelector()` antes de interagir com elementos
- Verifique seletor usando `page.locator().isVisible()`
- Use `test.step()` para melhorar logs de erro

### Erros de TypeScript

- O projeto usa `tsconfig.e2e.json` específico para testes E2E
- Certifique-se de que os arquivos de teste estão no diretório correto (`src/app/features/**/e2e/`)

## 📚 Referências

- [Playwright Documentation](https://playwright.dev/)
- [Playwright Best Practices](https://playwright.dev/docs/best-practices)
- [Playwright API Reference](https://playwright.dev/docs/api/class-playwright)
