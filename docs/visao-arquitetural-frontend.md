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

Mock de API em desenvolvimento e testes: MSW (Mock Service Worker) com handlers por contexto e inicialização controlada por flag de ambiente.

---

## 2. Organização dos Diretórios

Estrutura proposta (evolutiva), mantendo o projeto Angular atual e adicionando camadas puras ao lado de `src/app` e um pacote de Design System:

```
/src
  /models                 # Regras de negócio puras (TS), entities/models, value objects, policies
  /application            # Use cases (orquestração), queries, DTOs, mapeadores
  /infra                  # Adapters (HTTP, storage, auth), implementação de ports
  /app                    # Angular UI (componentes, páginas, rotas, DI)
    /features             # Páginas/fluxos por contexto de negócio (lazy-loaded)
    /shared               # Wrappers Angular para DS, pipes, directives, guards, layouts

  /mocks                  # MSW: worker setup e handlers por contexto (ex.: envelopeHandlers)
    /context              # Handlers organizados por contexto de negócio
  test-setup.ts           # Bootstrap do MSW no ambiente de testes (Karma)

/packages
  /design-system          # Web Components (vanilla), tokens de design, estilos
  /ui-angular             # (opcional) Wrappers Angular finos para componentes do DS
```

Observações:

- `models` e `application` não importam Angular. `infra` não importa `app`.
- `app` depende de `application` via interfaces (ports) e injeta adapters de `infra`.
- O Design System (DS) vive em `/packages/design-system` e expõe Custom Elements. Wrappers Angular (quando necessários) ficam em `/packages/ui-angular`.
- Assets do MSW: o script do service worker reside em `public/mockServiceWorker.js` e é servido junto com o app e com o ambiente de testes.

---

## 3. Responsabilidades das Camadas

- Models (puro TS)

  - Models/Entities, Value Objects, políticas e validações.
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
- HttpClient custom (Infra):
  - Implementação atual: `FetchHttpClient` (em `src/adapters/FetchHttpClient.ts`).
  - Anexa `Authorization: Bearer <token>` quando há token disponível (fornecido por função `getAccessToken`).
  - Lança erro em respostas não OK; trata `204 No Content` como `void` e lida com corpo vazio de `200 OK` sem quebrar (retorna `undefined`).
  - Base de API padrão: `/api`.

Notas práticas do projeto:

- Valores monetários trafegam em centavos (inteiro). No front, usar o VO `Money` e mapeadores (`MoneyMapper`) para converter de/para API.
- Exemplo de consulta vigente: `GET /envelope/list` via adapter HTTP conectado a um Port de Query.

Status atual de contratos implementados (Frontend):

- Ports de Envelopes: `IEnvelopeQueriesPort` e `IEnvelopeMutationsPort` implementados via `HttpEnvelopeQueriesPort` e `HttpEnvelopeMutationsPort`.
- Estilo de comandos: `POST /envelope/<action>` (create/update/delete/add/remove/transfer) conforme CQRS.

---

## 6. Autenticação (Firebase Auth)

- Provedor: Firebase Authentication (Google; fluxo por redirect).
- Tokens somente em memória: recuperar ID Token via listener (`onIdTokenChanged`) e fornecer sob demanda para o HttpClient custom (injeção de `getAccessToken`).
- Persistência: sessão (`browserSessionPersistence`) para evitar loops; sem `localStorage`.
- Estados esperados na UI: `authenticated`, `unauthenticated`, `redirecting`.
- Guardas de rota usam um sinal de auth; bypass controlado por feature flag de desenvolvimento.
- Interceptor/HttpClient: anexa `Authorization: Bearer <id_token>` quando disponível.

Trade-offs: recarregar a página limpa o token. OK para MVP; reavaliar mais tarde se persistência for necessária.

### 6.1. Configuração Firebase

- Config (env): `firebaseConfig` (apiKey, authDomain, projectId, appId, etc.).
- Provedor Google habilitado no console; domínio do app adicionado em Authorized Domains.
- Fluxo: `signInWithRedirect` (sem popup por restrições de COOP), `getRedirectResult` opcional; estado final por `onIdTokenChanged`.
- Feature flag DEV: `AUTH_DISABLED` para desativar auth temporariamente e injetar um token fake, destravando o desenvolvimento.

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
- Arquivos: kebab-case para UI Angular (`create-transaction.page.ts`), PascalCase para Models/Application (`CreateTransactionUseCase.ts`).
- Interfaces: prefixo `I` para Ports (`ITransactionServicePort`).
- Pastas: kebab-case (`use-cases`, `queries`, `adapters`, `features`).
- Web Components: prefixo `os-`.

---

## 10. Regras de Dependência (Boundaries)

- `models`: depende de nada interno.
- `application`: depende de `models` e tipos utilitários. Define Ports.
- `infra`: depende de `application` (para implementar Ports) e utilitários.
- `app` (Angular): depende de `application` e eventualmente de `infra` via injeção (providers); nunca o inverso.
- `packages/design-system`: independente de Angular. `ui-angular` pode depender do DS.

Ferramentas:

- ESLint com regras de import para impedir violações (ex.: `models` não pode importar `infra`/`app`).
- TypeScript path aliases para clareza entre camadas (`@models`, `@application`, `@infra`, `@app`).

---

## 11. Testes

- Unitários (Models/Application/Infra): Jasmine + Karma (ChromeHeadless), próximos aos arquivos (`*.spec.ts`).
- Mocks de API: MSW intercepta `fetch` no browser de testes; worker inicializado em `src/test-setup.ts` e servido a partir de `public/mockServiceWorker.js`.
- Cobertura: thresholds globais mínimos de 80% (statements, branches, functions, lines) com relatórios `html`, `text`, `text-summary` e `json-summary`.
- Componentes Angular: TestBed + Signals; foco em comportamento observável.
- Web Components (DS): @web/test-runner ou Jasmine/Karma com JSDOM quando aplicável.
- Integração (Infra + Adapters): testes com mocks de HTTP.
- E2E: Playwright recomendado para fluxos críticos.

Estrutura espelha a de produção (testes próximos aos arquivos). Script CI: `npm run test:ci`.

---

## 12. Performance e Build

- Angular com rotas lazy e divisão de chunks por feature.
- DS com bundle ESM e CSS escopado; carregamento por import dinâmico quando aplicável.
- Preferir signals e detecção de mudanças por padrão (evitar estados globais pesados).

Padrões Angular do projeto:

- Componentes standalone por padrão; evitar NgModules.
- Não declarar `standalone: true` no decorator (padrão assumido).
- `ChangeDetectionStrategy.OnPush` em todos os componentes.
- Usar `input()`/`output()` functions ao invés de decorators.
- Usar `computed()` para estado derivado; `update`/`set` para mutações (evitar `mutate`).
- Control flow nativo em templates (`@if`, `@for`, `@switch`).
- Evitar `ngClass`/`ngStyle`; preferir bindings de `class`/`style`.
- Serviços com `providedIn: 'root'` e `inject()` ao invés de injeção por construtor.
- `NgOptimizedImage` para imagens estáticas (exceto base64 inline).

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

---

## 19. MSW (Mock Service Worker)

- Objetivo: mockar a API de forma realista (nível de rede) tanto em desenvolvimento quanto em testes.
- Organização: handlers por contexto em `src/mocks/context` (ex.: `envelopeHandlers.ts`), agregados em `src/mocks/handlers.ts`.
- Inicialização:
  - App: bootstrap condicional em `main.ts` via flag `MSW_ENABLED` para registrar o worker (`/mockServiceWorker.js`).
  - Testes (Karma): `src/test-setup.ts` inicia o worker antes dos specs.
- Asset do worker: `public/mockServiceWorker.js` (gerado via `msw init`).
- Convenções:
  - Base de API `/api` em toda a suíte.
  - Handlers retornam payloads alinhados aos DTOs do domínio e aos mapeadores (ex.: valores monetários em centavos).

## 20. Variáveis de Ambiente e Flags

- `API_BASE_URL`: string (padrão `/api`). Usada pelo `FetchHttpClient` para compor URLs.
- `AUTH_DISABLED`: boolean (DEV). Quando verdadeiro, a UI ignora o fluxo de Firebase Auth e pode usar um token simulado.
- `MSW_ENABLED`: boolean (DEV). Habilita o registro do service worker do MSW no app para desenvolvimento.
