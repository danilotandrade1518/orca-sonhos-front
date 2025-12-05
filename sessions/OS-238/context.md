# Padronização de Modais e Componentes de Confirmação no Design System - Contexto de Desenvolvimento

# OS-238

## 🎯 Objetivo

Padronizar e consolidar os componentes de modal de confirmação espalhados pelas features, eliminando duplicação de código e criando uma solução reutilizável no Design System. Além disso, migrar formulários que estão em modais para páginas dedicadas, melhorando a UX com URLs próprias, histórico de navegação e botão de voltar.

## 📋 Requisitos Funcionais

### Fase 1: Modal de Confirmação no Design System

#### Funcionalidades Principais

- **Criar `os-confirm-dialog.component.ts`**: Componente genérico de confirmação com variantes (danger, warning, info)
- **Criar `ConfirmDialogService`**: Serviço para abertura programática do diálogo de confirmação
- **Suportar textos customizáveis**: Título, mensagem e textos dos botões devem ser configuráveis
- **Substituir implementações duplicadas**: Remover os 3 modais de confirmação de exclusão duplicados
- **Substituir `confirm()` nativo**: Remover uso de `confirm()` no `os-category-manager.component.ts`

#### Comportamentos Esperados

- O serviço deve retornar `Promise<boolean>` (true para confirmar, false para cancelar)
- O componente deve suportar variantes visuais (danger, warning, info) que afetam apenas estilos
- Os textos dos botões permanecem os mesmos ("Confirmar" e "Cancelar" por padrão)
- O componente deve ser acessível (ARIA labels, foco, teclado)
- Deve funcionar com Angular Material Dialog (MatDialog)

### Fase 2: Migração de Formulários para Páginas

#### Funcionalidades Principais

- **Migrar `envelope-form`**: De modal para páginas `/envelopes/new` e `/envelopes/:id/edit`
- **Migrar `pay-bill-modal`**: De modal para página `/credit-cards/bills/:id/pay`
- **Migrar `goal-amount-modal`**: De modal para páginas `/goals/:id/add-amount` e `/goals/:id/remove-amount`
- **Migrar `transfer-modal`**: De modal para página `/accounts/transfer`
- **Migrar `reconcile-modal`**: De modal para página `/accounts/:id/reconcile`

#### Comportamentos Esperados

- Cada formulário deve ter sua própria rota com URL dedicada
- Deve suportar navegação com botão voltar do navegador
- Deve manter toda funcionalidade existente (validação, loading, erros)
- Deve seguir o padrão de rotas lazy loading do projeto
- Deve usar os templates de página existentes (os-form-template, os-page-template)

## 🏗️ Considerações Técnicas

### Arquitetura

- **Design System**: Componentes em `src/app/shared/ui-components/`
- **Serviços**: Serviços em `src/app/shared/services/` ou `src/app/core/services/`
- **Rotas**: Seguir padrão lazy loading com arquivos `*.routes.ts` em cada feature
- **Padrão de Componentes**: Standalone components com signals e OnPush change detection

### Tecnologias e Dependências

- **Angular Material Dialog**: Usar `MatDialog` para abertura programática do diálogo
- **OsModalTemplateComponent**: Base existente que pode ser reutilizada
- **OsModalComponent**: Componente base genérico já existente
- **Signals**: Para gerenciamento de estado reativo
- **Promise**: Para retorno assíncrono do serviço (mais simples que Observable)

### Padrões a Seguir

- **Standalone Components**: Todos os componentes devem ser standalone
- **Signals**: Usar signals para estado local
- **OnPush Change Detection**: Todos os componentes devem usar OnPush
- **Injeção de Dependências**: Usar `inject()` ao invés de constructor injection
- **TypeScript Strict**: Manter tipagem estrita
- **Acessibilidade**: ARIA labels, foco gerenciado, suporte a teclado

## 🧪 Estratégia de Testes

### Testes Necessários

- **Testes Unitários**: 
  - `os-confirm-dialog.component.spec.ts`: Testar variantes, textos customizáveis, eventos
  - `confirm-dialog.service.spec.ts`: Testar abertura do diálogo, retorno de Promise
- **Testes de Integração**: 
  - Verificar substituição dos modais duplicados
  - Verificar substituição do `confirm()` nativo
  - Verificar migração dos formulários para páginas

### Critérios de Aceitação

#### Fase 1:
- [ ] Componente `os-confirm-dialog` criado com variantes (danger, warning, info)
- [ ] Serviço `ConfirmDialogService` criado e funcionando
- [ ] 3 modais duplicados removidos e substituídos pelo novo componente
- [ ] Uso de `confirm()` nativo removido do `os-category-manager`
- [ ] Todos os testes passando
- [ ] Acessibilidade validada

#### Fase 2:
- [ ] `envelope-form` migrado para páginas `/envelopes/new` e `/envelopes/:id/edit`
- [ ] `pay-bill-modal` migrado para página `/credit-cards/bills/:id/pay`
- [ ] `goal-amount-modal` migrado para páginas `/goals/:id/add-amount` e `/goals/:id/remove-amount`
- [ ] `transfer-modal` migrado para página `/accounts/transfer`
- [ ] `reconcile-modal` migrado para página `/accounts/:id/reconcile`
- [ ] Funcionalidade preservada em todos os formulários
- [ ] Rotas configuradas corretamente
- [ ] Navegação funcionando (voltar, histórico)

## 🔗 Dependências e Impactos

### Sistemas Afetados

**Fase 1:**
- `src/app/features/envelopes/components/confirm-delete-modal/` - **REMOVER**
- `src/app/features/accounts/components/confirm-delete-modal/` - **REMOVER**
- `src/app/features/credit-cards/components/confirm-delete-modal/` - **REMOVER**
- `src/app/shared/ui-components/organisms/os-category-manager/` - **MODIFICAR**
- `src/app/shared/ui-components/organisms/os-modal/` - **REUTILIZAR**
- `src/app/shared/ui-components/templates/os-modal-template/` - **REUTILIZAR**

**Fase 2:**
- `src/app/features/envelopes/components/envelope-form/` - **MIGRAR PARA PÁGINA**
- `src/app/features/credit-cards/components/pay-bill-modal/` - **MIGRAR PARA PÁGINA**
- `src/app/features/goals/components/goal-amount-modal/` - **MIGRAR PARA PÁGINA**
- `src/app/features/accounts/components/transfer-modal/` - **MIGRAR PARA PÁGINA**
- `src/app/features/accounts/components/reconcile-modal/` - **MIGRAR PARA PÁGINA**
- Rotas de cada feature - **ADICIONAR NOVAS ROTAS**

### Integrações Necessárias

- **Angular Material Dialog**: Configurar MatDialogModule se ainda não estiver configurado globalmente
- **Rotas**: Adicionar novas rotas seguindo padrão lazy loading
- **Templates de Página**: Reutilizar `os-form-template` e `os-page-template` existentes

## 🚧 Restrições e Considerações

### Limitações Técnicas

- O componente de confirmação deve retornar apenas `true/false`, não gerenciar loading/erros
- Os formulários migrados devem manter compatibilidade com os States existentes
- As rotas devem seguir o padrão lazy loading já estabelecido

### Riscos

- **Breaking Changes**: Substituição dos modais pode quebrar funcionalidades se não testado adequadamente
- **Migração de Formulários**: Pode haver lógica de estado complexa que precisa ser preservada
- **Rotas**: Adicionar novas rotas pode conflitar com rotas existentes se não planejado

### Mitigações

- Testes abrangentes antes de remover código antigo
- Manter código antigo comentado temporariamente durante migração
- Validar cada migração de formulário individualmente
- Revisar todas as rotas antes de adicionar novas

## 📚 Referências

- **Issue Jira**: [OS-238](https://orca-sonhos.atlassian.net/browse/OS-238)
- **Componentes Base**: 
  - `src/app/shared/ui-components/organisms/os-modal/`
  - `src/app/shared/ui-components/templates/os-modal-template/`
- **Padrão de Rotas**: Verificar `src/app/features/*/routes.ts`
- **Angular Material Dialog**: [Documentação oficial](https://material.angular.io/components/dialog)


