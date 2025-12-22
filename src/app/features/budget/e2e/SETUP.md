# Setup de Testes E2E - Orçamentos

## ⚠️ Status Atual

Os testes E2E foram criados e estão parcialmente funcionais. Alguns ajustes ainda são necessários para que todos os testes passem completamente.

## 📋 Pré-requisitos

### 1. Back-end deve estar rodando

**IMPORTANTE**: Os testes E2E conectam ao back-end real, então o back-end precisa estar rodando na porta 3000.

```bash
# Opção 1: Via Docker Compose (recomendado)
cd /home/danilo/workspace/projeto-orca-sonhos
docker-compose up backend db

# Opção 2: Manualmente
cd orca-sonhos-back
npm run dev
```

### 2. Front-end deve estar rodando

```bash
cd orca-sonhos-front
npm start
```

### 3. Instalar dependências do Playwright

```bash
cd orca-sonhos-front
npm install --legacy-peer-deps
npx playwright install
```

## 🐛 Problemas Conhecidos e Soluções

### Problema 1: Botão "Criar" permanece desabilitado após preencher formulário

**Causa**: O Angular pode não estar detectando mudanças no input quando preenchido via Playwright.

**Solução Temporária**: 
- Os helpers foram ajustados para usar `page.evaluate()` para disparar eventos manualmente
- Aguardar validação com `waitForFunction()` antes de clicar

**Solução Definitiva** (a implementar):
- Verificar se o `os-input` está propagando eventos corretamente
- Considerar usar `page.fill()` com eventos customizados
- Verificar se há problemas com Change Detection (OnPush)

### Problema 2: Navegação não funciona ao clicar no botão "Novo Orçamento"

**Causa**: O componente `os-button` pode não estar propagando o evento `buttonClick` corretamente.

**Solução Temporária**:
- Helper navega diretamente para `/budgets/new` quando necessário

**Solução Definitiva** (a implementar):
- Verificar se o evento `(clicked)` está sendo emitido corretamente no `os-page-header`
- Verificar se há problemas com event propagation

### Problema 3: Seletores não encontram elementos

**Causa**: Componentes Angular customizados podem não expor seletores padrão.

**Soluções Aplicadas**:
- Uso de seletores mais específicos (`os-form-field`, `os-input`, etc.)
- Aguardar elementos aparecerem antes de interagir
- Usar `waitForFunction()` quando necessário

## ✅ O que está funcionando

- ✅ Navegação para `/budgets/new` funciona
- ✅ Formulário aparece corretamente
- ✅ Input de nome pode ser preenchido
- ✅ Estrutura de testes está correta
- ✅ Helpers criados e organizados

## 🔧 Ajustes Necessários

### 1. Melhorar preenchimento de formulário

O formulário precisa detectar mudanças corretamente. Opções:

```typescript
// Opção A: Usar eventos do Angular diretamente
await page.evaluate(() => {
  const input = document.querySelector('input[type="text"]');
  if (input) {
    Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')?.set?.call(input, 'Nome');
    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.dispatchEvent(new Event('change', { bubbles: true }));
  }
});

// Opção B: Usar FormControl diretamente via Angular
await page.evaluate(() => {
  // Acessar componente Angular e atualizar FormControl
});
```

### 2. Verificar se back-end está respondendo

Os testes podem estar falhando porque o back-end não está rodando ou não está respondendo corretamente.

```bash
# Verificar se back-end está rodando
curl http://localhost:3000/health

# Verificar logs do back-end para erros
```

### 3. Ajustar timeouts

Alguns testes podem precisar de timeouts maiores se o back-end estiver lento.

## 📝 Como Executar Testes

### Executar todos os testes

```bash
cd orca-sonhos-front
npm run test:e2e
```

### Executar teste específico

```bash
npx playwright test budget-crud.e2e.spec.ts:17
```

### Executar com UI (recomendado para debug)

```bash
npm run test:e2e:ui
```

### Ver trace de erro

```bash
npx playwright show-trace test-results/[caminho-do-trace]/trace.zip
```

## 🎯 Próximos Passos

1. **Verificar back-end**: Garantir que está rodando e respondendo corretamente
2. **Ajustar preenchimento de formulário**: Garantir que Angular detecta mudanças
3. **Corrigir navegação**: Fazer botão "Novo Orçamento" funcionar corretamente
4. **Executar todos os testes**: Validar que todos os 16 testes passam
5. **Ajustar seletores**: Refinar seletores para serem mais robustos

## 📚 Referências

- [Playwright Best Practices](https://playwright.dev/docs/best-practices)
- [Angular Testing with Playwright](https://playwright.dev/docs/test-angular)
