# Testes E2E - Metas

Este diretório contém os testes end-to-end (E2E) para a funcionalidade de metas usando Playwright.

## 📋 Estrutura

```
e2e/
├── helpers/
│   ├── auth.helper.ts          # Helper para autenticação
│   └── goal.helper.ts          # Helper para interações com metas
├── goal-crud.e2e.spec.ts      # Testes de CRUD de metas
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

# Apenas testes de CRUD de metas
npx playwright test goal-crud
```

## 📝 Testes Implementados

### Testes de CRUD (`goal-crud.e2e.spec.ts`)

- ✅ Criar meta
- ✅ Editar meta existente
- ✅ Deletar meta existente
- ✅ Cancelar exclusão de meta
- ✅ Validar campos obrigatórios
- ✅ Validar nome muito curto (min 2 caracteres)
- ✅ Validar nome muito longo (max 50 caracteres)
- ✅ Exibir lista vazia
- ✅ Buscar metas por nome
- ✅ Navegar para detalhes ao clicar no card
- ✅ Navegar para edição ao clicar no botão Editar
- ✅ Validar data no passado
- ✅ Adicionar aporte a uma meta
- ✅ Remover aporte de uma meta
- ✅ Validar que não é possível remover mais do que o valor acumulado
- ✅ Adicionar aporte via botão na página de detalhes
- ✅ Remover aporte via botão na página de detalhes

## 🔧 Helpers

### AuthHelper

Helper para gerenciar autenticação nos testes:

```typescript
const authHelper = new AuthHelper(page);
await authHelper.login();
await authHelper.logout();
const isAuth = await authHelper.isAuthenticated();
```

### GoalHelper

Helper para interações com a página de metas:

```typescript
const goalHelper = new GoalHelper(page);
await goalHelper.navigateToGoalList();
await goalHelper.clickCreateGoal();
await goalHelper.fillGoalForm('Nome da Meta', '1000.00');
await goalHelper.saveGoalForm();
await goalHelper.expectSuccessNotification();
await goalHelper.expectGoalInList('Nome da Meta');

// Adicionar aporte
await goalHelper.navigateToAddAmount(goalId);
await goalHelper.fillAmountForm('100.00');
await goalHelper.saveAmountForm();
await goalHelper.expectSuccessNotification(/aporte adicionado com sucesso/i);

// Remover aporte
await goalHelper.navigateToRemoveAmount(goalId);
await goalHelper.fillAmountForm('50.00');
await goalHelper.saveAmountForm();
await goalHelper.expectSuccessNotification(/aporte removido com sucesso/i);
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

