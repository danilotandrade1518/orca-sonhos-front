# Implementar Funcionalidade de Registro de Usuários com Google OAuth - Contexto de Desenvolvimento

# OS-234

## 🎯 Objetivo

Implementar funcionalidade completa de registro de novos usuários no OrçaSonhos utilizando Firebase Authentication com Google OAuth (método redirect-based). Esta é a primeira funcionalidade de autenticação do sistema, permitindo que novos usuários autentiquem com Google primeiro e, após autenticação bem-sucedida, coletar/confirmar o **Nome de usuário** (pré-preenchido com nome do Google, mas editável). Após confirmação do nome, o usuário deve ser redirecionado para o dashboard.

## 📋 Requisitos Funcionais

### Funcionalidades Principais

- **Página de Registro (`/register`)**: Criar página seguindo design system da aplicação com botão "Entrar com Google" e link para login
- **Autenticação Google OAuth**: Implementar fluxo redirect-based com Firebase Authentication
- **Coleta/Confirmação de Nome**: Criar página `/register/complete-profile` para primeiro acesso onde usuário confirma/edita nome do Google
- **Atualização de Perfil**: Implementar atualização do `displayName` no Firebase após confirmação
- **Detecção de Primeiro Acesso**: Verificar se `displayName` está vazio para determinar se é primeiro acesso
- **Redirecionamento Inteligente**: Redirecionar para `/register/complete-profile` (primeiro acesso) ou `/dashboard` (usuário existente)

### Comportamentos Esperados

- Usuário acessa `/register` e clica em "Entrar com Google"
- É redirecionado para página de autenticação do Google
- Após autorizar, Google redireciona de volta para `/register`
- Sistema detecta redirect result usando `getRedirectResult`
- Firebase cria conta automaticamente (primeiro acesso)
- Se `displayName` vazio: redireciona para `/register/complete-profile` com nome pré-preenchido
- Se `displayName` preenchido: atualiza estado do `AuthService` e redireciona para `/dashboard`
- Na página de completar perfil: usuário pode editar nome, validação (2-100 caracteres), botão "Continuar" habilitado apenas quando válido
- Após atualização: exibe mensagem de sucesso e redireciona para `/dashboard`
- Estados de loading e erro devem ser tratados adequadamente

## 🏗️ Considerações Técnicas

### Arquitetura

- **Clean Architecture**: Manter separação de camadas (Models, Application, Core)
- **Adapter Pattern**: Usar `ExternalAuthServiceAdapter` para abstrair Firebase
- **Signal-based State**: `AuthService` já utiliza signals para gerenciamento de estado
- **Standalone Components**: Angular 20+ com componentes standalone
- **Reactive Forms**: Usar reactive forms para formulário de nome

### Tecnologias e Dependências

- **Firebase Authentication**: `@angular/fire/auth` com `signInWithRedirect` e `getRedirectResult`
- **GoogleAuthProvider**: Provider do Firebase para autenticação Google
- **updateProfile**: Função do Firebase para atualizar `displayName`
- **Design System**: Componentes `os-button`, `os-input`, `os-label`, `os-form-field`, `os-spinner`, `os-alert`
- **MSW**: Handlers para simular autenticação Google em desenvolvimento

### Padrões a Seguir

- Seguir convenções do projeto (CLAUDE.md): standalone components, signals, OnPush change detection
- Usar `inject()` ao invés de constructor injection
- Implementar métodos no `FirebaseAuthServiceAdapter` seguindo interface `ExternalAuthServiceAdapter`
- Criar métodos no `AuthService` para expor funcionalidades de Google OAuth
- Manter consistência com estrutura de features existentes
- Usar guards para proteger rotas quando necessário

## 🧪 Estratégia de Testes

### Testes Necessários

- **Testes Unitários**:

  - `FirebaseAuthServiceAdapter.signInWithGoogle()` e `getRedirectResult()`
  - `FirebaseAuthServiceAdapter.updateUserProfile()`
  - `AuthService.signInWithGoogle()` e `completeProfile()`
  - Componentes de página (`RegisterPage`, `CompleteProfilePage`)
  - Validação de formulário de nome (2-100 caracteres)

- **Testes de Integração**:

  - Fluxo completo de autenticação Google
  - Detecção de primeiro acesso vs usuário existente
  - Redirecionamentos corretos

- **Testes MSW**:
  - Handler para simular autenticação Google
  - Handler para primeiro acesso (displayName vazio)
  - Handler para usuário existente
  - Handler para erros

### Critérios de Aceitação

- [ ] Criar página de registro (`/register`) seguindo design system da aplicação
- [ ] Botão "Entrar com Google" com ícone do Google
- [ ] Link "Já tem conta? Faça login" apontando para `/login`
- [ ] Estados de loading e erro na página de registro
- [ ] Criar página/componente `/register/complete-profile`
- [ ] Campo "Nome completo" pré-preenchido com nome do Google
- [ ] Campo editável pelo usuário
- [ ] Validação: mínimo 2 caracteres, máximo 100 caracteres
- [ ] Botão "Continuar" habilitado apenas quando nome válido
- [ ] Atualização do perfil Firebase após confirmação
- [ ] Mensagem de sucesso e redirecionamento para `/dashboard`
- [ ] Implementar `signInWithGoogle()` no `FirebaseAuthServiceAdapter`
- [ ] Implementar tratamento de `getRedirectResult`
- [ ] Implementar `updateUserProfile(name: string)` para atualizar `displayName`
- [ ] Detecção de primeiro acesso (verificar `displayName` vazio)
- [ ] Criar handlers MSW para simular autenticação Google
- [ ] Handler para primeiro acesso (displayName vazio)
- [ ] Handler para usuário existente
- [ ] Handler para erros

## 🔗 Dependências e Impactos

### Sistemas Afetados

- **Core Services**: `AuthService` precisa de novos métodos para Google OAuth
- **Firebase Adapter**: `FirebaseAuthServiceAdapter` precisa implementar métodos de Google OAuth
- **Mock Adapter**: `MockAuthServiceAdapter` precisa simular fluxo Google OAuth
- **Routes**: Adicionar rotas `/register` e `/register/complete-profile`
- **Guards**: Possivelmente ajustar `authGuard` para permitir acesso a páginas de registro

### Integrações Necessárias

- **Firebase Console**: Habilitar método Google no Firebase Console
- **Firebase Config**: Configurar domínios autorizados e OAuth consent screen
- **MSW Handlers**: Criar handlers para desenvolvimento local
- **Design System**: Integrar componentes `os-button`, `os-input`, `os-form-field`, etc.

## 🚧 Restrições e Considerações

### Limitações Técnicas

- **Redirect-based OAuth**: Usar redirect ao invés de popup (conforme especificação)
- **Primeiro Acesso**: Necessário detectar primeiro acesso verificando `displayName` vazio
- **Firebase Console**: Configuração manual necessária no Firebase Console
- **SSR**: Considerar impacto do SSR no fluxo de redirect

### Riscos

- **Configuração Firebase**: Erros na configuração podem impedir autenticação
- **Redirect Loop**: Possível loop se redirecionamento não for tratado corretamente
- **Estado Perdido**: Estado pode ser perdido durante redirect do Google
- **Concorrência**: Múltiplas tentativas simultâneas podem causar problemas

## 📚 Referências

- Issue/Card: [OS-234](https://orca-sonhos.atlassian.net/browse/OS-234)
- Firebase Auth: [@angular/fire/auth documentation](https://github.com/angular/angularfire)
- Design System: Componentes `os-*` no projeto
- Arquitetura: Clean Architecture e padrões do projeto (CLAUDE.md)
- Meta Specs: `/home/danilo/workspace/projeto-orca-sonhos/orca-sonhos-meta-specs`










