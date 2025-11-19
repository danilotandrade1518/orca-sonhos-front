# Implementar Funcionalidade de Registro de Usuários com Google OAuth - Arquitetura Técnica

## 🏗️ Visão Geral da Implementação

### Estado Atual

O projeto possui:

- **AuthService** implementado com signals para gerenciamento de estado
- **FirebaseAuthServiceAdapter** com método `signIn` (email/senha - não usado ainda)
- **ExternalAuthServiceAdapter** interface definida
- **Sistema de guards e interceptors** configurado
- **Firebase** já configurado no `app.config.ts`
- **MSW** configurado com handlers básicos de autenticação
- **Design System** completo com componentes `os-*` disponíveis
- **Nenhuma funcionalidade de login ou registro** existente no sistema

### Mudanças Propostas

- **Novas Páginas**: Criar páginas `/register` e `/register/complete-profile`
- **Novos Métodos no Adapter**: Implementar `signInWithGoogle()`, tratamento de `getRedirectResult()`, e `updateUserProfile()`
- **Novos Métodos no AuthService**: Expor métodos para Google OAuth e completar perfil
- **Novas Rotas**: Adicionar rotas de registro no `app.routes.ts`
- **Handlers MSW**: Criar handlers para simular autenticação Google
- **Atualização de Interface**: Estender `ExternalAuthServiceAdapter` se necessário

### Impactos

- **Core Services**: `AuthService` terá novos métodos públicos
- **Firebase Adapter**: `FirebaseAuthServiceAdapter` terá implementação completa de Google OAuth
- **Mock Adapter**: `MockAuthServiceAdapter` precisará simular fluxo Google
- **Routes**: Novas rotas públicas de registro
- **MSW**: Novos handlers para desenvolvimento

## 🔧 Componentes e Estrutura

### Arquivos Principais a Modificar

- `src/infra/firebase/firebase-auth-service.adapter.ts`:

  - Adicionar método `signInWithGoogle()` usando `signInWithRedirect`
  - Adicionar método `getRedirectResult()` para tratar redirect após autenticação
  - Adicionar método `updateUserProfile(name: string)` usando `updateProfile` do Firebase

- `src/app/core/adapters/external-auth-service.adapter.ts`:

  - Verificar se interface precisa ser estendida para suportar Google OAuth
  - Adicionar métodos `signInWithGoogle()`, `getRedirectResult()`, `updateUserProfile()` se necessário

- `src/app/core/services/auth/auth.service.ts`:

  - Adicionar método `signInWithGoogle()` que chama adapter
  - Adicionar método `completeProfile(name: string)` para atualizar perfil
  - Adicionar lógica para tratar redirect result e detectar primeiro acesso

- `src/app/app.routes.ts`:

  - Adicionar rota `/register` apontando para `RegisterPage`
  - Adicionar rota `/register/complete-profile` apontando para `CompleteProfilePage`

- `src/infra/mock/mock-auth-service-adapter.ts`:

  - Implementar métodos de Google OAuth simulados
  - Simular fluxo de primeiro acesso vs usuário existente

- `src/app/core/mocks/handlers/auth.handlers.ts`:
  - Adicionar handlers para simular autenticação Google
  - Handler para primeiro acesso (displayName vazio)
  - Handler para usuário existente
  - Handler para erros

### Novos Arquivos a Criar

- `src/app/features/auth/pages/register/register.page.ts`:

  - Página de registro com botão "Entrar com Google"
  - Link para login
  - Estados de loading e erro
  - Lógica para iniciar fluxo de autenticação Google

- `src/app/features/auth/pages/register/register.page.scss`:

  - Estilos da página de registro seguindo design system

- `src/app/features/auth/pages/register/register.page.spec.ts`:

  - Testes unitários da página de registro

- `src/app/features/auth/pages/register/complete-profile/complete-profile.page.ts`:

  - Página para completar perfil com campo de nome
  - Formulário reativo com validação (2-100 caracteres)
  - Botão "Continuar" habilitado apenas quando válido
  - Lógica para atualizar perfil e redirecionar

- `src/app/features/auth/pages/register/complete-profile/complete-profile.page.scss`:

  - Estilos da página de completar perfil

- `src/app/features/auth/pages/register/complete-profile/complete-profile.page.spec.ts`:
  - Testes unitários da página de completar perfil

### Estrutura de Diretórios

```
src/app/features/auth/
├── pages/
│   └── register/
│       ├── register.page.ts
│       ├── register.page.scss
│       ├── register.page.spec.ts
│       └── complete-profile/
│           ├── complete-profile.page.ts
│           ├── complete-profile.page.scss
│           └── complete-profile.page.spec.ts
└── auth.routes.ts (opcional, se houver mais rotas de auth)
```

## 🏛️ Padrões Arquiteturais

### Padrões Seguidos

- **Clean Architecture**: Manter separação de camadas
- **Adapter Pattern**: Usar `ExternalAuthServiceAdapter` para abstrair Firebase
- **Signal-based State**: Usar signals no `AuthService`
- **Standalone Components**: Componentes standalone do Angular 20+
- **Reactive Forms**: Formulários reativos para validação

### Decisões Arquiteturais

- **Decisão**: Usar `signInWithRedirect` ao invés de `signInWithPopup`
- **Alternativas**: `signInWithPopup` (mais simples, mas pode ser bloqueado)
- **Justificativa**: Especificação explícita requer redirect-based, melhor compatibilidade com bloqueadores de popup

- **Decisão**: Detectar primeiro acesso verificando `displayName` vazio
- **Alternativas**: Flag customizada no Firestore, verificar metadata de criação
- **Justificativa**: Mais simples, não requer acesso ao Firestore, `displayName` é campo padrão do Firebase

- **Decisão**: Criar páginas separadas para registro e completar perfil
- **Alternativas**: Página única com lógica condicional
- **Justificativa**: Melhor separação de responsabilidades, UX mais clara, mais fácil de testar

- **Decisão**: Usar reactive forms para formulário de nome
- **Alternativas**: Template-driven forms
- **Justificativa**: Melhor controle de validação, alinhado com padrões do projeto

## 📦 Dependências e Integrações

### Dependências Existentes

- **@angular/fire/auth**: Já instalado e configurado
- **firebase**: SDK Firebase já configurado
- **msw**: Já configurado para desenvolvimento
- **Design System**: Componentes `os-*` disponíveis

### Novas Dependências

- **Nenhuma**: Todas as dependências necessárias já estão instaladas

### Integrações

- **Firebase Authentication**:

  - Configurar Google OAuth no Firebase Console
  - Habilitar método Google
  - Configurar domínios autorizados
  - Configurar OAuth consent screen

- **Design System**:
  - `os-button` para botão "Entrar com Google"
  - `os-input` para campo de nome
  - `os-label` para labels
  - `os-form-field` para campo de formulário
  - `os-spinner` para loading
  - `os-alert` para mensagens de erro/sucesso

## 🎨 UI Components and Layout

### Design System Integration

A feature de Registro utiliza extensivamente os componentes do Design System OrçaSonhos, seguindo o padrão Atomic Design:

**Atoms Reutilizados:**

- `os-button` - Botão "Entrar com Google" e botão "Continuar"
  - Variant: `primary` para ações principais
  - Size: `large` para mobile, `medium` para desktop
  - Loading state integrado durante autenticação
- `os-input` - Campo de texto para nome completo
  - Type: `text`
  - Size: `medium`
  - Integrado com reactive forms para validação
- `os-label` - Labels de formulário
  - Size: `medium`
  - Variant: `default`
- `os-icon` - Ícones decorativos e do Google
  - Size: `medium`
  - Uso: Ícone no botão Google
- `os-spinner` - Estados de loading
  - Size: `small` (dentro do botão)
- `os-alert` - Mensagens de erro e sucesso
  - Variant: `error` para erros, `success` para sucesso

**Molecules Reutilizadas:**

- `os-form-field` - Campo de formulário completo com validação
  - Label: "Nome completo"
  - Placeholder: "Digite seu nome"
  - Required: true
  - Validation: 2-100 caracteres
  - Helper text: "Mínimo 2 caracteres, máximo 100 caracteres"
  - Error handling integrado
- `os-card` - Container para conteúdo das páginas
  - Variant: `default` ou `elevated`
  - Size: `medium`
  - Centralizado verticalmente e horizontalmente

**Templates Reutilizados:**

- `os-form-template` - Template base para páginas de formulário
  - Size: `small` (páginas compactas)
  - Variant: `compact` (menos padding)
  - Show header: `true` (título e subtítulo)
  - Show progress: `false` (não aplicável)
  - Show actions: `true` (botão continuar)
  - Customizações:
    - Card centralizado verticalmente e horizontalmente
    - Largura máxima: 500px desktop, 600px tablet, 100% mobile
    - Background: Gradiente sutil ou cor sólida do tema

### New Components Required

**Nenhum componente novo necessário** - Todos os componentes necessários já existem no Design System. O botão Google pode ser implementado usando `os-button` com ícone Google e customizações via CSS se necessário.

### Layout Architecture

**Estrutura das Páginas:**

1. **Página de Registro (`/register`)**:

   - Usa `os-form-template` como container base
   - Card centralizado com título, subtítulo, botão Google e link de login
   - Estados: idle, loading, error
   - Responsivo: Mobile-first com breakpoints otimizados

2. **Página Completar Perfil (`/register/complete-profile`)**:
   - Usa `os-form-template` como container base
   - Card centralizado com título, subtítulo, campo de nome e botão continuar
   - Formulário reativo com validação em tempo real
   - Estados: form ready, form invalid, form valid, loading, success, error

**Responsividade:**

- Mobile (< 576px): Stack vertical, botão full width, padding reduzido
- Tablet (576-991px): Card centralizado 600px, botão largura fixa 400px
- Desktop (>= 992px): Card centralizado 500px, botão largura fixa 350px

**Acessibilidade:**

- WCAG 2.1 AA compliance
- Keyboard navigation completa
- ARIA attributes corretos
- Screen reader friendly
- Contraste adequado (>= 4.5:1)
- Focus visible em elementos interativos
- Respeita `prefers-reduced-motion`

### Performance Considerations

- **OnPush Change Detection**: Todos os componentes usam `ChangeDetectionStrategy.OnPush`
- **Lazy Loading**: Rotas de registro podem ser lazy loaded (rotas públicas)
- **Bundle Size**: Impacto mínimo - componentes já existentes no Design System
- **Computed Signals**: Validação e estados derivados usando `computed()`
- **Critical CSS**: Estilos críticos inline para above-the-fold content

**Detalhes completos em:** `layout-specification.md`

## 🔄 Fluxo de Dados

### Fluxo de Autenticação Google

1. **Usuário acessa `/register`**

   - `RegisterPage` renderiza botão "Entrar com Google"
   - Usuário clica no botão

2. **Início da Autenticação**

   - `RegisterPage` chama `AuthService.signInWithGoogle()`
   - `AuthService` chama `FirebaseAuthServiceAdapter.signInWithGoogle()`
   - Adapter chama `signInWithRedirect(auth, googleProvider)`
   - Usuário é redirecionado para Google

3. **Autenticação no Google**

   - Usuário seleciona conta e autoriza
   - Google redireciona de volta para `/register`

4. **Tratamento do Redirect Result**

   - `RegisterPage` detecta redirect (via `getRedirectResult` no `ngOnInit` ou guard)
   - Chama `AuthService.handleRedirectResult()`
   - `AuthService` chama `FirebaseAuthServiceAdapter.getRedirectResult()`
   - Adapter retorna `UserCredential` ou `null`

5. **Detecção de Primeiro Acesso**

   - Se `userCredential.user.displayName` está vazio/null:
     - Redireciona para `/register/complete-profile`
   - Se `displayName` preenchido:
     - Atualiza `AuthService` com usuário
     - Redireciona para `/dashboard`

6. **Completar Perfil (Primeiro Acesso)**

   - `CompleteProfilePage` exibe formulário com nome pré-preenchido
   - Usuário pode editar nome
   - Validação: 2-100 caracteres
   - Botão "Continuar" habilitado quando válido

7. **Atualização de Perfil**
   - Usuário clica em "Continuar"
   - `CompleteProfilePage` chama `AuthService.completeProfile(name)`
   - `AuthService` chama `FirebaseAuthServiceAdapter.updateUserProfile(name)`
   - Adapter chama `updateProfile(user, { displayName: name })`
   - Após sucesso: atualiza `AuthService` e redireciona para `/dashboard`

### Fluxo de Estados

```
RegisterPage:
  - Estado inicial: idle
  - Clicou em Google: loading
  - Redirect detectado: processing
  - Primeiro acesso: redirecting to complete-profile
  - Usuário existente: redirecting to dashboard
  - Erro: error state

CompleteProfilePage:
  - Estado inicial: form ready
  - Nome inválido: form invalid
  - Nome válido: form valid
  - Submetendo: loading
  - Sucesso: success → redirect to dashboard
  - Erro: error state
```

## 🧪 Considerações de Teste

### Testes Unitários

**FirebaseAuthServiceAdapter:**

- `signInWithGoogle()` deve chamar `signInWithRedirect` com `GoogleAuthProvider`
- `getRedirectResult()` deve retornar `UserCredential` ou `null`
- `updateUserProfile()` deve chamar `updateProfile` com nome correto
- Tratamento de erros em cada método

**AuthService:**

- `signInWithGoogle()` deve chamar adapter e tratar erros
- `handleRedirectResult()` deve detectar primeiro acesso corretamente
- `completeProfile()` deve atualizar perfil e estado
- Estados de loading e erro devem ser atualizados corretamente

**RegisterPage:**

- Deve renderizar botão "Entrar com Google"
- Deve iniciar fluxo ao clicar no botão
- Deve tratar redirect result no `ngOnInit`
- Deve redirecionar corretamente baseado em primeiro acesso

**CompleteProfilePage:**

- Deve pré-preencher nome do Google
- Deve validar nome (2-100 caracteres)
- Deve habilitar botão apenas quando válido
- Deve atualizar perfil ao submeter
- Deve redirecionar para dashboard após sucesso

### Testes de Integração

- Fluxo completo: registro → Google → redirect → completar perfil → dashboard
- Fluxo usuário existente: registro → Google → redirect → dashboard direto
- Tratamento de erros em cada etapa
- Estados de loading durante operações assíncronas

### Mocks e Fixtures

**MSW Handlers:**

- Handler para simular `signInWithRedirect` (não aplicável diretamente, mas simular estado)
- Handler para simular `getRedirectResult` com primeiro acesso
- Handler para simular `getRedirectResult` com usuário existente
- Handler para simular `updateProfile`
- Handler para simular erros

**Fixtures:**

- Mock `UserCredential` com `displayName` vazio (primeiro acesso)
- Mock `UserCredential` com `displayName` preenchido (usuário existente)
- Mock `User` do Firebase com diferentes estados

## ⚖️ Trade-offs e Riscos

### Trade-offs Aceitos

- **Redirect vs Popup**: Redirect é mais confiável mas requer tratamento mais complexo
- **Verificação de Primeiro Acesso**: Usar `displayName` é simples mas pode falhar se usuário deletar nome manualmente
- **Páginas Separadas**: Mais arquivos mas melhor separação de responsabilidades

### Riscos Identificados

- **Redirect Loop**: Se `getRedirectResult` não for tratado corretamente, pode causar loop

  - **Mitigação**: Verificar redirect apenas uma vez, usar flag ou guard

- **Estado Perdido**: Estado pode ser perdido durante redirect do Google

  - **Mitigação**: Usar `getRedirectResult` que persiste estado do Firebase

- **Concorrência**: Múltiplas tentativas simultâneas podem causar problemas

  - **Mitigação**: Desabilitar botão durante loading, tratar erros adequadamente

- **Configuração Firebase**: Erros na configuração podem impedir autenticação

  - **Mitigação**: Documentar configuração necessária, validar em desenvolvimento

- **SSR**: Redirect pode não funcionar corretamente em SSR
  - **Mitigação**: Verificar comportamento em SSR, ajustar se necessário

## 📋 Lista de Implementação

### Backend/Adapter

- [ ] Estender interface `ExternalAuthServiceAdapter` se necessário
- [ ] Implementar `signInWithGoogle()` no `FirebaseAuthServiceAdapter`
- [ ] Implementar `getRedirectResult()` no `FirebaseAuthServiceAdapter`
- [ ] Implementar `updateUserProfile()` no `FirebaseAuthServiceAdapter`
- [ ] Adicionar métodos no `AuthService` para Google OAuth
- [ ] Implementar lógica de detecção de primeiro acesso

### UI Components

- [ ] Criar `RegisterPage` seguindo `layout-specification.md`
  - [ ] Usar `os-form-template` como container base
  - [ ] Implementar botão "Entrar com Google" usando `os-button`
  - [ ] Adicionar link "Já tem conta? Faça login"
  - [ ] Implementar estados de loading e erro
  - [ ] Implementar tratamento de redirect result
- [ ] Criar `CompleteProfilePage` seguindo `layout-specification.md`
  - [ ] Usar `os-form-template` como container base
  - [ ] Implementar campo de nome usando `os-form-field`
  - [ ] Implementar validação reativa (2-100 caracteres)
  - [ ] Implementar botão "Continuar" com estado disabled quando inválido
  - [ ] Implementar pré-preenchimento com nome do Google
  - [ ] Implementar atualização de perfil e redirecionamento
- [ ] Implementar responsividade mobile-first
  - [ ] Breakpoints: mobile (< 576px), tablet (576-991px), desktop (>= 992px)
  - [ ] Touch targets >= 44px em mobile
  - [ ] Card centralizado verticalmente e horizontalmente
- [ ] Implementar acessibilidade WCAG 2.1 AA
  - [ ] ARIA attributes corretos
  - [ ] Keyboard navigation completa
  - [ ] Screen reader support
  - [ ] Contraste adequado (>= 4.5:1)
  - [ ] Focus visible em elementos interativos

### Routing

- [ ] Adicionar rotas `/register` e `/register/complete-profile`
- [ ] Configurar guards se necessário (rotas públicas)

### Testing

- [ ] Implementar handlers MSW para Google OAuth
- [ ] Adicionar testes unitários para adapters
- [ ] Adicionar testes unitários para serviços
- [ ] Adicionar testes unitários para páginas
- [ ] Adicionar testes de integração do fluxo completo
- [ ] Adicionar testes de acessibilidade

### Documentation

- [ ] Documentar configuração Firebase necessária
- [ ] Validar comportamento em SSR

## 📚 Referências

- [Meta Specs]: `/home/danilo/workspace/projeto-orca-sonhos/orca-sonhos-meta-specs`
- [Firebase Auth]: [@angular/fire/auth documentation](https://github.com/angular/angularfire)
- [Google OAuth]: [Firebase Google Sign-In](https://firebase.google.com/docs/auth/web/google-signin)
- [Design System]: Componentes `os-*` no projeto
- [Angular Best Practices]: CLAUDE.md
- [Issue]: [OS-234](https://orca-sonhos.atlassian.net/browse/OS-234)
