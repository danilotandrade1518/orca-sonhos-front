# Visão Arquitetural do Frontend

## 1. Visão Geral

Este documento descreve a arquitetura do frontend do projeto OrçaSonhos. O aplicativo será uma SPA em Angular (TypeScript) estruturada em camadas no estilo Clean/Hexagonal aplicadas ao frontend, com foco em:

- Isolamento do core domain (regras de negócio em TypeScript puro, sem dependências de framework)
- Baixo vendor lock-in (UI como detalhe; Design System entregue via Web Components)
- Alinhamento com o backend (DDD, CQRS e estilo de endpoints orientado a comando)

Arquitetura selecionada (combinação):
- Monólito Modular em Camadas no Front (Domain, Application, Infra, UI)
- Design System com Web Components vanilla (com wrappers finos para Angular quando necessário)

Escopo inicial: CSR (client-side rendering). SSR/SEO poderá ser reavaliado futuramente.

---

## 2. Organização dos Diretórios

Estrutura proposta (evolutiva), mantendo o projeto Angular atual e adicionando camadas puras ao lado de `src/app` e um pacote de Design System:

```
/src
  /domain                 # Regras de negócio puras (TS), entities, value objects, policies
  /application            # Use cases (orquestração), queries, DTOs, mapeadores
  /infra                  # Adapters (HTTP, storage, auth), implementação de ports
  /app                    # Angular UI (componentes, páginas, rotas, DI)
    /features             # Páginas/fluxos por contexto de negócio (lazy-loaded)
    /shared               # Wrappers Angular para DS, pipes, directives, guards, layouts

/packages
  /design-system          # Web Components (vanilla), tokens de design, estilos
  /ui-angular             # (opcional) Wrappers Angular finos para componentes do DS
```

Observações:
- `domain` e `application` não importam Angular. `infra` não importa `app`.
- `app` depende de `application` via interfaces (ports) e injeta adapters de `infra`.
- O Design System (DS) vive em `/packages/design-system` e expõe Custom Elements. Wrappers Angular (quando necessários) ficam em `/packages/ui-angular`.

---

## 3. Responsabilidades das Camadas

- Domain (puro TS)
  - Entities, Value Objects, políticas e validações.
  - Sem dependências externas (frameworks, runtime web). Fácil de testar.

- Application (puro TS)
  - Use Cases (commands) e Query Handlers (reads) do front.
  - Define Ports (interfaces) para serviços externos (ex.: `IBudgetServicePort`, `ITransactionServicePort`).
  - Não conhece Angular nem detalhes de HTTP.

- Infra
  - Adapters concretos para Ports (HTTP via fetch/HttpClient, storage, auth token provider).
  - Mapeia DTOs de/para o backend (alinhado ao contrato de API).

- UI (Angular)
  - Componentes, páginas e roteamento. Consome Application via serviços injetados.
  - Estado local via Angular Signals. Evitar store global até necessidade comprovada.
  - Usa componentes do DS (Custom Elements) com ou sem wrappers Angular.

- Design System (Web Components)
  - Biblioteca de componentes base, acessibilidade, tokens de design (CSS custom properties) e temas.
  - Sem dependência em Angular. Wrappers são opcionais e finos.

---

## 4. Fluxos de Dados e Interação

### 4.1. Mutação (Commands)

```
[UI Angular] → [UseCase (Application)] → [Port] → [Adapter (Infra)] → [HTTP POST /<context>/<action>]
                                                   ↓
                                              [Mapeamento DTO]
                                                   ↓
                                                [Resposta]
```

- UI dispara um caso de uso específico (ex.: `CreateTransactionUseCase`).
- Application usa Ports. Infra provê Adapter que chama o endpoint de comando (POST) definido pelo backend.
- Respostas de erro/sucesso são mapeadas para Result/Either no Application.

### 4.2. Consulta (Queries)

```
[UI Angular] → [Query Handler (Application)] → [Port] → [Adapter (Infra)] → [HTTP GET/Query]
```

- UI solicita dados via Query Handler. Application continua sem saber de HTTP.
- Infra executa chamada e devolve modelos próprios de leitura (ViewModel/DTO).

### 4.3. Estado no Cliente

- Estado por página/feature com Angular Signals (`signal`, `computed`, `effect`).
- Cache leve em Application para dados de uso imediato quando fizer sentido (memória).
- Nada global por padrão. Elevar a compartilhado (ex.: usuário autenticado) somente se necessário.

---

## 5. Integração com Backend (Contratos e Estilo de API)

- Alinhado ao padrão do backend (Seção 14 do documento do back): mutações via POST orientado a comandos (`/<context>/<action-name>`), consultas por GET ou endpoints específicos de query.
- Geração de cliente tipado por OpenAPI é desejável (quando o contrato estiver disponível). Enquanto isso, manter tipos e mapeadores explícitos.
- Portas exemplo (Application):
  - `IBudgetServicePort`, `ITransactionServicePort`, `IAccountServicePort`, `ICreditCardServicePort`, `ICreditCardBillServicePort`.
- Adapters exemplo (Infra):
  - `HttpBudgetServiceAdapter`, `HttpTransactionServiceAdapter`, etc.
- Interceptores HTTP (app):
  - Anexar `Authorization: Bearer <token>` em requisições autenticadas.
  - Mapear erros para tipos conhecidos (ex.: `AuthMissing`, `AuthInvalid`).

---

## 6. Autenticação (SPA PKCE)

- Fluxo Authorization Code + PKCE direto com o IdP (ex.: Azure AD B2C, conforme back Seção 15).
- Armazenamento de tokens: somente em memória (serviço Angular singleton), evitando `localStorage`.
- Renovação: tentativa de silent auth ou refresh rotativo se política permitir. Se falhar → redirecionar para login.
- UI deve lidar com estados: `authenticated`, `unauthenticated`, `refreshing`.
- Guardas de rota baseados em sinal de auth. Interceptor injeta Bearer token.

Trade-offs: recarregar a página perde tokens (por design). OK para MVP; reavaliar caso seja necessário persistir sessão.

---

### 6.1. Wiring Frontend (Azure AD B2C)

- Discovery/Config (env):
  - `VITE_B2C_TENANT`, `VITE_B2C_POLICY` (User Flow/Custom Policy), `VITE_B2C_CLIENT_ID`, `VITE_B2C_AUTHORITY` (ex.: `https://{tenant}.b2clogin.com/{tenant}.onmicrosoft.com/{policy}`), `VITE_B2C_SCOPES` (API scopes), `VITE_B2C_REDIRECT_URI`, `VITE_B2C_LOGOUT_REDIRECT_URI`.
  - Usar `/.well-known/openid-configuration` do B2C para descobrir `authorization_endpoint` e `token_endpoint`.

- Serviço de Auth (Angular): responsabilidades
  - Gerar `code_verifier`/`code_challenge` (S256) e iniciar `authorize` (redirect/popup).
  - Trocar `code` por tokens no `token_endpoint` (frontend → B2C) e manter `access_token` apenas em memória.
  - Expor sinais/computed: `isAuthenticated`, `accessToken`, `user` (claims básicas).
  - Renovação: tentar silent auth (prompt=none) ou refresh rotativo se política permitir; senão, reautenticar.

- Interceptor HTTP:
  - Anexar `Authorization: Bearer <access_token>` quando disponível.
  - Em `401/403` por expiração: tentar 1 renovação e reenviar; falhando, iniciar login.

- Guardas de rota:
  - Bloquear rotas protegidas quando `isAuthenticated` for falso; encaminhar para login.

- Logout:
  - Limpar tokens em memória e redirecionar para `end_session_endpoint` com `post_logout_redirect_uri`.

- Operacional e segurança:
  - Config por ambiente (DEV/QA/PRD) via variáveis. Nunca persistir tokens em `localStorage`/`sessionStorage`.
  - Tratar estados de carregamento e erros de handshake; logs mínimos sem dados sensíveis.

---

## 7. Design System (Web Components)

### 7.1. Princípios

- Padrões da Web (Custom Elements + Shadow DOM) para baixo lock-in.
- Tokens de design via CSS custom properties; temas por `data-theme`/:root.
- Acessibilidade first: roles/ARIA, foco e navegação por teclado.

### 7.2. Implementação

- Tecnologia: Web Components vanilla (sem Lit). Decisão tomada para manter o lock-in mínimo e máxima portabilidade entre frameworks.
- Build do DS: bundle ESM + CSS isolado. Publicação interna como pacote (`@app/design-system`).
- Integração Angular: uso direto dos elementos no template ou wrappers finos em `@app/ui-angular` quando necessário (ex.: `ControlValueAccessor`).

Nota: caso, no futuro, a equipe precise de ergonomia adicional (templates, reatividade), poderá ser avaliado o uso de Lit sem quebrar o contrato público (Custom Elements), mantendo o DS consumível em qualquer framework.

### 7.3. Guidelines

- Naming dos elementos: prefixo `os-` (ex.: `<os-button>`, `<os-input>`).
- Eventos custom: `osChange`, `osSelect`, etc. Documentados e tipados.
- Estilos: expor variáveis (`--os-color-primary`, `--os-radius-sm`, etc.).

---

## 8. Módulos/Features (UI)

- Organização por contexto de negócio (lazy): `budgets`, `transactions`, `accounts`, `credit-cards`, `goals`, `dashboard`.
- Tipos de componentes:
  - Pages: roteáveis, composição de widgets.
  - Widgets: blocos reutilizáveis de UI/feature.
  - Presentational: consomem DS, sem lógica de domínio.
- Rotas e carregamento preguiçoso para reduzir bundle inicial.

---

## 9. Convenções de Nomenclatura

- Código em Inglês.
- Classes: PascalCase (`CreateTransactionUseCase`)
- Arquivos: kebab-case para UI Angular (`create-transaction.page.ts`), PascalCase para Domain/Application (`CreateTransactionUseCase.ts`).
- Interfaces: prefixo `I` para Ports (`ITransactionServicePort`).
- Pastas: kebab-case (`use-cases`, `queries`, `adapters`, `features`).
- Web Components: prefixo `os-`.

---

## 10. Regras de Dependência (Boundaries)

- `domain`: depende de nada interno.
- `application`: depende de `domain` e tipos utilitários. Define Ports.
- `infra`: depende de `application` (para implementar Ports) e utilitários.
- `app` (Angular): depende de `application` e eventualmente de `infra` via injeção (providers); nunca o inverso.
- `packages/design-system`: independente de Angular. `ui-angular` pode depender do DS.

Ferramentas:
- ESLint com regras de import para impedir violações (ex.: `domain` não pode importar `infra`/`app`).
- TypeScript path aliases para clareza entre camadas.

---

## 11. Testes

- Unitários (Domain/Application): Jest/Vitest, próximos aos arquivos (`*.spec.ts`).
- Componentes Angular: Testing Library + Jest (ou runner padrão do Angular), foco em comportamento.
- Web Components (DS): @web/test-runner ou Jest com JSDOM.
- Integração (Infra + Adapters): testes contra mocks de HTTP.
- E2E: Playwright (recomendado) para fluxos críticos.

Estrutura espelha a de produção (testes próximos aos arquivos).

---

## 12. Performance e Build

- Angular com rotas lazy e divisão de chunks por feature.
- DS com bundle ESM e CSS escopado; carregamento por import dinâmico quando aplicável.
- Preferir signals e detecção de mudanças por padrão (evitar estados globais pesados).

---

## 13. i18n e Formatação

- i18n com mensagens no nível de UI; Domain/Application devem permanecer neutros.
- Formatação de números/datas via Intl APIs na camada de UI.

---

## 14. Acessibilidade

- Requisitos a11y aplicados no DS e verificados nas páginas.
- Testes de teclado e foco; contrastes garantidos por tokens de design.

---

## 15. Evoluções Futuras

- SSR/SEO para páginas públicas (se necessário) com Angular Universal.
- Extração das camadas para workspaces/pacotes independentes (pnpm workspaces/Nx) quando volume crescer.
- State management global somente com demanda real (ex.: NgRx Signals Store) e mantendo Domain/Application isolados.

---

## 16. Offline First e Sincronização

### 16.1. Objetivos

- Funcionamento essencial do app sem conexão (leitura e operações enfileiradas).
- Experiência consistente com atualização e sincronização transparente quando a rede voltar.
- Baixo acoplamento: lógica de sync fora da UI, e ports dedicados na camada Application.

### 16.2. Armazenamento Local

- IndexedDB via adapter em `infra` (ex.: `LocalStoreAdapter`) implementando ports `ILocalStorePort`.
- Estruturas mínimas: `entities` (por agregado), `queries-cache` (snapshots e metadados), `commands-queue`.
- Política de expiração configurável por consulta.

### 16.3. Leitura (Queries)

- Estratégia: stale-while-revalidate.
  - Passo 1: Query Handler consulta cache local e entrega imediatamente (se existir).
  - Passo 2: Dispara revalidação em background (HTTP GET). Se mudar, atualiza cache e sinaliza a UI.
- Fallback: se nada em cache e offline, exibir estado offline + CTA para tentar novamente.

### 16.4. Escrita (Commands)

- Fluxo otimista:
  - UI → Use Case → enfileira comando no `commands-queue` (IndexedDB) com `idempotencyKey`, `createdAt`, `entityVersion`/`etag` e payload.
  - UI aplica atualização otimista no estado local (reversível em caso de falha definitiva).
- Processamento:
  - Service Worker (Background Sync quando disponível) ou um scheduler no app processa a fila quando online.
  - Cada comando é enviado para os endpoints de comando (`POST /<context>/<action>`).
  - Sucesso: remove item da fila e reconcilia estado com resposta do servidor.
  - Falha temporária (rede/5xx): re-tentativas com backoff exponencial.
  - Falha de conflito (409/412): resolver conforme 16.5.

### 16.5. Resolução de Conflitos

- Versão por entidade (campo `version` ou ETag) enviada nos comandos.
- Padrão inicial: last-write-wins autorizado pelo servidor; na detecção de conflito, UI oferece opções de mesclagem ou refetch.
- Para cenários críticos (ex.: transferências), evitar otimista e exigir confirmação do servidor antes de refletir na UI.

### 16.6. Service Worker e Cache

- PWA habilitada com Service Worker:
  - Assets estáticos: cache-first com versionamento.
  - GET de API: stale-while-revalidate (quando aplicável).
  - POST de API: não cachear; usar fila de comandos + Background Sync (`SyncManager`) quando disponível.
- Tela de fallback offline para rotas não essenciais.

### 16.7. Segurança

- Tokens continuam apenas em memória. Itens da fila não armazenam o token; apenas URL, payload e metadados.
- Se o usuário perder o token (reload), o processamento da fila aguarda reautenticação.
- Sanitização de payload e criptografia de dados sensíveis em repouso (opcional, dependendo do risco).

### 16.8. Telemetria e Observabilidade

- Métricas: tamanho da fila, taxa de sucesso, número de conflitos, tempo médio de sincronização.
- Logs de erro resumidos (sem dados sensíveis) para diagnóstico.

### 16.9. Edge Cases

- Mudança de relógio do sistema: preferir timestamps do servidor quando relevantes.
- Itens órfãos ou com schema antigo: rotina de migração/limpeza no boot.
- Multi-aba: coordenação via `BroadcastChannel` para evitar processamento duplicado.

---

## 17. Mobile First e Responsividade

### 17.1. Princípios

- Layouts projetados primeiro para telas pequenas; progressivamente aprimorados para telas maiores.
- Conteúdo essencial acima da dobra; navegação clara e acessível.

### 17.2. Design System e Tokens

- Escalas de espaçamento e tipografia orientadas ao mobile (tokens CSS no DS).
- Alvos de toque mínimos de 44×44px; foco visível e estados ativos acessíveis.

### 17.3. Componentes e Padrões de UI

- Preferir listas/cards a tabelas complexas em telas pequenas; tabelas responsivas com colunas colapsáveis quando necessário.
- Gestos e rolagem naturais sem bloquear scroll; respeitar `prefers-reduced-motion`.

### 17.4. Imagens e Mídia

- `NgOptimizedImage` para imagens estáticas; `srcset/sizes` para responsividade; lazy-loading por padrão.
- Evitar base64 inline em conjunto com `NgOptimizedImage` (não suportado).

### 17.5. Performance em Rede Móvel

- Divisão de código por feature (rotas lazy) e import dinâmico de widgets pesados.
- Paginação/infinite scroll em consultas grandes; payloads compactos.
- Feedback rápido: skeletons e placeholders, nunca bloquear pintura inicial.

### 17.6. Formulários

- Tipos de input corretos (`tel`, `email`, `number`), validação em tempo real e mensagens claras.
- Wrappers Angular para integrar Custom Elements ao Reactive Forms quando necessário.

---

## 18. Status

Ativo. Implementação incremental a partir do esqueleto atual do projeto.

> Este documento deve ser atualizado conforme a arquitetura evoluir, mantendo alinhamento com as decisões do backend.
