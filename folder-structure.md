# AI Platform — Complete Folder Structure

> Every file listed with its purpose. `[D]` = directory, `[F]` = file.

---

## Root

```
ai-platform/                              [D] Monorepo root
├── apps/                                 [D] Deployable applications
│   ├── api/                              [D] NestJS + Fastify backend server
│   └── web/                              [D] React + Vite frontend SPA
├── packages/                             [D] Shared internal libraries
│   ├── shared-types/                     [D] All shared TypeScript types & enums
│   ├── shared-config/                    [D] Zod-validated env config schemas
│   ├── ai-core/                          [D] AI provider abstraction (OpenAI/Anthropic)
│   ├── vector-db/                        [D] pgvector abstraction layer
│   ├── prompt-manager/                   [D] Versioned prompt template registry
│   ├── agent-core/                       [D] LangGraph agent orchestration
│   ├── logger/                           [D] Pino structured logger factory
│   └── ui/                               [D] Shared React component library
├── infra/                                [D] Infrastructure-as-code
│   ├── docker/                           [D] Per-service Dockerfiles
│   └── k8s/                              [D] Kubernetes manifests
├── .github/                              [D] GitHub Actions CI/CD workflows
│   └── workflows/
│       └── ci.yml                        [F] Typecheck → lint → test → build → push
├── docker-compose.yml                    [F] Local dev: postgres+pgvector, redis, api, web
├── docker-compose.prod.yml               [F] Production-like compose (no volume mounts)
├── pnpm-workspace.yaml                   [F] Declares apps/* and packages/* as workspaces
├── package.json                          [F] Root scripts: dev, build, lint, typecheck, test
├── tsconfig.base.json                    [F] Shared TS compiler options inherited by all packages
├── .eslintrc.base.js                     [F] Shared ESLint rules (extended per package)
├── .prettierrc                           [F] Formatting rules
├── .env.example                          [F] All env vars with descriptions — committed to git
├── .env                                  [F] Actual secrets — gitignored
└── README.md                             [F] Monorepo overview, setup, and dev guide
```

---

## `packages/shared-types`

```
shared-types/
├── src/
│   ├── ai/
│   │   ├── provider.types.ts             [F] ModelProvider enum, ChatOptions, AIResponse
│   │   ├── stream.types.ts               [F] StreamChunk, StreamStatus, StreamEvent
│   │   └── embedding.types.ts            [F] EmbeddingRequest, EmbeddingResponse
│   ├── agents/
│   │   ├── agent.types.ts                [F] AgentState, AgentStep, AgentConfig
│   │   ├── graph.types.ts                [F] GraphNode, GraphEdge, WorkflowDefinition
│   │   └── tool.types.ts                 [F] ToolDefinition, ToolCall, ToolResult
│   ├── auth/
│   │   ├── jwt.types.ts                  [F] JWTPayload, RefreshTokenPayload
│   │   ├── user.types.ts                 [F] UserRole enum, UserProfile
│   │   └── session.types.ts              [F] Session, AuthTokens
│   ├── chat/
│   │   ├── conversation.types.ts         [F] Conversation, ConversationStatus
│   │   ├── message.types.ts              [F] Message, Role enum, MessageMetadata
│   │   └── chat-request.types.ts         [F] ChatRequest, ChatResponse DTOs
│   ├── rag/
│   │   ├── document.types.ts             [F] Document, DocumentChunk, ChunkMetadata
│   │   └── retrieval.types.ts            [F] RetrievalQuery, RetrievalResult
│   ├── jobs/
│   │   └── job.types.ts                  [F] JobPayload, JobStatus, QueueName enum
│   ├── common/
│   │   ├── api.types.ts                  [F] ApiResponse<T>, PaginatedResult<T>
│   │   ├── error.types.ts                [F] AppError, ErrorCode enum
│   │   └── pagination.types.ts           [F] PaginationParams, PaginationMeta
│   └── index.ts                          [F] Re-exports everything
├── package.json                          [F] name: @ai-platform/shared-types
└── tsconfig.json                         [F] Extends tsconfig.base.json
```

---

## `packages/shared-config`

```
shared-config/
├── src/
│   ├── env/
│   │   ├── api.env.ts                    [F] Zod schema for all API env vars
│   │   └── web.env.ts                    [F] Zod schema for frontend env vars (VITE_*)
│   ├── constants/
│   │   ├── ai.constants.ts               [F] Model names, max tokens, temperature defaults
│   │   ├── redis.constants.ts            [F] Key prefixes, TTL values
│   │   ├── queue.constants.ts            [F] Queue names, retry configs, concurrency limits
│   │   └── app.constants.ts              [F] API version, pagination defaults, rate limits
│   └── index.ts
├── package.json                          [F] name: @ai-platform/shared-config
└── tsconfig.json
```

---

## `packages/ai-core`

```
ai-core/
├── src/
│   ├── interfaces/
│   │   ├── ai-provider.interface.ts      [F] IAIProvider: chat(), stream(), embed()
│   │   └── stream-handler.interface.ts   [F] IStreamHandler: onChunk(), onDone(), onError()
│   ├── providers/
│   │   ├── base.provider.ts              [F] Abstract class implementing shared retry logic
│   │   ├── openai.provider.ts            [F] OpenAI SDK implementation of IAIProvider
│   │   └── anthropic.provider.ts         [F] Anthropic SDK implementation of IAIProvider
│   ├── factories/
│   │   └── provider.factory.ts           [F] Registry map + createProvider(name) factory fn
│   ├── middleware/
│   │   ├── retry.middleware.ts           [F] Exponential backoff for provider failures
│   │   └── token-counter.middleware.ts   [F] Counts tokens before/after requests
│   └── index.ts
├── package.json                          [F] name: @ai-platform/ai-core
└── tsconfig.json
```

---

## `packages/vector-db`

```
vector-db/
├── src/
│   ├── interfaces/
│   │   └── vector-db.interface.ts        [F] IVectorDB: upsert(), query(), delete()
│   ├── providers/
│   │   ├── base.vector-db.ts             [F] Abstract base with shared validation
│   │   └── pgvector.provider.ts          [F] Prisma $queryRaw HNSW similarity search
│   ├── utils/
│   │   └── similarity.ts                 [F] cosineDistance(), l2Distance() helpers
│   └── index.ts
├── package.json                          [F] name: @ai-platform/vector-db
└── tsconfig.json
```

---

## `packages/prompt-manager`

```
prompt-manager/
├── src/
│   ├── templates/
│   │   ├── chat.prompts.ts               [F] General chat system/user prompt templates
│   │   ├── rag.prompts.ts                [F] RAG context injection templates
│   │   ├── agent.prompts.ts              [F] Agent planning & reflection prompts
│   │   └── sql.prompts.ts                [F] SQL agent query-generation prompts
│   ├── registry/
│   │   └── prompt.registry.ts            [F] Map<name+version, PromptTemplate> singleton
│   ├── interfaces/
│   │   └── prompt.interface.ts           [F] PromptTemplate, CompiledPrompt interfaces
│   └── index.ts
├── package.json                          [F] name: @ai-platform/prompt-manager
└── tsconfig.json
```

---

## `packages/agent-core`

```
agent-core/
├── src/
│   ├── interfaces/
│   │   ├── agent.interface.ts            [F] IAgent: run(), stream(), getState()
│   │   └── tool.interface.ts             [F] ITool: name, description, schema, execute()
│   ├── graphs/
│   │   ├── base.graph.ts                 [F] Abstract LangGraph StateGraph wrapper
│   │   └── research.graph.ts             [F] Example: plan → search → synthesize graph
│   ├── nodes/
│   │   ├── llm.node.ts                   [F] Calls IAIProvider.chat() as a graph node
│   │   ├── tool.node.ts                  [F] Executes ITool, writes result to state
│   │   └── retriever.node.ts             [F] Calls IVectorDB.query(), injects context
│   ├── tools/
│   │   ├── base.tool.ts                  [F] Abstract tool with Zod input validation
│   │   └── web-search.tool.ts            [F] Tavily/Serper API web search tool
│   ├── state/
│   │   └── agent.state.ts                [F] AgentState annotation for LangGraph
│   └── index.ts
├── package.json                          [F] name: @ai-platform/agent-core
└── tsconfig.json
```

---

## `packages/logger`

```
logger/
├── src/
│   ├── logger.factory.ts                 [F] createLogger(context) → Pino instance
│   ├── logger.config.ts                  [F] JSON in prod, pino-pretty in dev
│   └── index.ts
├── package.json                          [F] name: @ai-platform/logger
└── tsconfig.json
```

---

## `packages/ui`

```
ui/
├── src/
│   ├── components/
│   │   ├── chat/
│   │   │   ├── ChatWindow.tsx            [F] Full chat UI with message list + input
│   │   │   ├── MessageBubble.tsx         [F] Single message with role-based styling
│   │   │   └── StreamingText.tsx         [F] Typewriter animation for streamed tokens
│   │   └── common/
│   │       ├── Spinner.tsx               [F] Loading spinner component
│   │       └── ErrorBoundary.tsx         [F] React error boundary wrapper
│   └── index.ts
├── package.json                          [F] name: @ai-platform/ui
└── tsconfig.json
```

---

## `apps/api`

```
api/
├── src/
│   ├── main.ts                           [F] Bootstrap: NestFactory with FastifyAdapter
│   ├── app.module.ts                     [F] Root module importing all feature modules
│   │
│   ├── modules/                          [D] NestJS feature modules (Application layer)
│   │   ├── auth/
│   │   │   ├── auth.module.ts            [F] Imports PassportModule, JwtModule
│   │   │   ├── auth.controller.ts        [F] POST /auth/login, /auth/refresh, /auth/logout
│   │   │   ├── auth.service.ts           [F] validateUser(), generateTokens(), revokeToken()
│   │   │   ├── strategies/
│   │   │   │   ├── jwt.strategy.ts       [F] Validates Bearer JWT, extracts payload
│   │   │   │   └── local.strategy.ts     [F] email+password validation strategy
│   │   │   └── dto/
│   │   │       ├── login.dto.ts          [F] LoginDto with class-validator decorators
│   │   │       └── refresh.dto.ts        [F] RefreshTokenDto
│   │   │
│   │   ├── chat/
│   │   │   ├── chat.module.ts            [F] Imports AIModule, imports QueuesModule
│   │   │   ├── chat.controller.ts        [F] POST /api/v1/chat, GET /api/v1/conversations
│   │   │   ├── chat.service.ts           [F] Orchestrates AIService + ConversationRepo
│   │   │   └── dto/
│   │   │       ├── create-chat.dto.ts    [F] ChatRequest shape with validation
│   │   │       └── conversation.dto.ts   [F] ConversationDto response shape
│   │   │
│   │   ├── ai/
│   │   │   ├── ai.module.ts              [F] Provides AIService, StreamingGateway
│   │   │   ├── ai.service.ts             [F] Delegates to ai-core ProviderFactory
│   │   │   └── streaming.gateway.ts      [F] @WebSocketGateway Socket.IO events
│   │   │
│   │   ├── rag/
│   │   │   ├── rag.module.ts             [F] Imports VectorDBModule, DocumentModule
│   │   │   ├── rag.service.ts            [F] ingestDocument(), retrieveContext()
│   │   │   ├── ingestion.service.ts      [F] Chunks documents, generates embeddings
│   │   │   └── retrieval.service.ts      [F] Queries pgvector, re-ranks results
│   │   │
│   │   ├── documents/
│   │   │   ├── documents.module.ts       [F] Document upload + storage module
│   │   │   ├── documents.controller.ts   [F] POST /api/v1/documents (multipart)
│   │   │   └── documents.service.ts      [F] Saves file, enqueues ingestion job
│   │   │
│   │   ├── jobs/
│   │   │   ├── jobs.module.ts            [F] Registers all BullMQ queues
│   │   │   ├── producers/
│   │   │   │   ├── inference.producer.ts [F] Enqueues heavy LLM inference jobs
│   │   │   │   ├── embedding.producer.ts [F] Enqueues embedding generation jobs
│   │   │   │   └── ingestion.producer.ts [F] Enqueues document processing jobs
│   │   │   └── processors/
│   │   │       ├── inference.processor.ts[F] BullMQ worker: processes LLM jobs
│   │   │       ├── embedding.processor.ts[F] BullMQ worker: calls embed(), upserts pgvector
│   │   │       └── ingestion.processor.ts[F] BullMQ worker: PDF parse → chunk → embed
│   │   │
│   │   └── health/
│   │       ├── health.module.ts          [F] Terminus health module
│   │       └── health.controller.ts      [F] GET /api/v1/health (DB + Redis checks)
│   │
│   ├── domain/                           [D] Pure domain layer — no framework dependencies
│   │   ├── entities/
│   │   │   ├── user.entity.ts            [F] User domain entity (plain class)
│   │   │   ├── conversation.entity.ts    [F] Conversation aggregate root
│   │   │   ├── message.entity.ts         [F] Message value object
│   │   │   └── document.entity.ts        [F] Document aggregate with chunks
│   │   ├── repositories/
│   │   │   ├── user.repository.ts        [F] IUserRepository interface
│   │   │   ├── conversation.repository.ts[F] IConversationRepository interface
│   │   │   └── document.repository.ts    [F] IDocumentRepository interface
│   │   └── events/
│   │       ├── chat-started.event.ts     [F] Domain event: conversation created
│   │       ├── message-created.event.ts  [F] Domain event: new message saved
│   │       └── document-ingested.event.ts[F] Domain event: RAG pipeline complete
│   │
│   ├── infrastructure/                   [D] External system adapters
│   │   ├── database/
│   │   │   ├── prisma.service.ts         [F] PrismaClient singleton NestJS service
│   │   │   ├── prisma.module.ts          [F] Global Prisma module
│   │   │   └── repositories/
│   │   │       ├── user.prisma-repo.ts   [F] Implements IUserRepository via Prisma
│   │   │       ├── conversation.prisma-repo.ts [F] Implements IConversationRepository
│   │   │       └── document.prisma-repo.ts     [F] Implements IDocumentRepository
│   │   ├── cache/
│   │   │   ├── redis.service.ts          [F] ioredis client wrapper with typed methods
│   │   │   └── redis.module.ts           [F] Global Redis module
│   │   ├── queue/
│   │   │   └── bullmq.module.ts          [F] Registers 4 queues with Redis connection
│   │   └── websocket/
│   │       └── socket-io.adapter.ts      [F] NestJS custom adapter for Socket.IO + Fastify
│   │
│   └── common/                           [D] Cross-cutting concerns
│       ├── guards/
│       │   ├── jwt-auth.guard.ts         [F] Extends AuthGuard('jwt')
│       │   ├── roles.guard.ts            [F] Checks UserRole from JWT payload
│       │   └── rate-limit.guard.ts       [F] Redis sliding-window rate limiter
│       ├── filters/
│       │   └── global-exception.filter.ts[F] Maps all errors to ApiResponse<never>
│       ├── interceptors/
│       │   ├── logging.interceptor.ts    [F] Logs request/response with requestId
│       │   └── transform.interceptor.ts  [F] Wraps responses in ApiResponse<T>
│       ├── decorators/
│       │   ├── current-user.decorator.ts [F] @CurrentUser() param decorator
│       │   └── roles.decorator.ts        [F] @Roles(UserRole.ADMIN) decorator
│       └── pipes/
│           └── zod-validation.pipe.ts    [F] Validates DTOs with Zod schemas
│
├── prisma/
│   ├── schema.prisma                     [F] All models: User, Conversation, Message, Document, Embedding
│   ├── migrations/                       [D] Prisma migration history
│   └── seed.ts                           [F] Dev seed data (admin user, sample conversation)
│
├── test/
│   ├── unit/                             [D] Unit tests per module
│   └── e2e/                              [D] End-to-end API tests (supertest)
│
├── Dockerfile                            [F] Multi-stage: builder → runner (node:20-alpine)
├── package.json                          [F] API dependencies + scripts
└── tsconfig.json                         [F] Extends tsconfig.base.json, includes paths
```

---

## `apps/web`

```
web/
├── src/
│   ├── app/
│   │   ├── main.tsx                      [F] React DOM root render
│   │   ├── Router.tsx                    [F] TanStack Router route definitions
│   │   └── providers.tsx                 [F] QueryClientProvider + SocketProvider
│   │
│   ├── features/                         [D] Feature-sliced architecture
│   │   ├── auth/
│   │   │   ├── components/
│   │   │   │   ├── LoginForm.tsx         [F] Email/password form with Zod validation
│   │   │   │   └── AuthGuard.tsx         [F] Redirects unauthenticated users
│   │   │   ├── hooks/
│   │   │   │   └── useAuth.ts            [F] TanStack Query mutations for login/logout
│   │   │   └── store/
│   │   │       └── auth.store.ts         [F] Zustand: tokens, user, isAuthenticated
│   │   │
│   │   ├── chat/
│   │   │   ├── components/
│   │   │   │   ├── ChatWindow.tsx        [F] Full chat layout: sidebar + message pane
│   │   │   │   ├── MessageList.tsx       [F] Virtualized message list (TanStack Virtual)
│   │   │   │   ├── MessageInput.tsx      [F] Textarea + send button + model selector
│   │   │   │   └── StreamingMessage.tsx  [F] Renders streaming tokens as they arrive
│   │   │   ├── hooks/
│   │   │   │   ├── useChat.ts            [F] Manages send + stream lifecycle
│   │   │   │   └── useConversations.ts   [F] TanStack Query: list/create conversations
│   │   │   └── store/
│   │   │       └── chat.store.ts         [F] Zustand: activeConversationId, streamBuffer
│   │   │
│   │   └── dashboard/
│   │       ├── components/
│   │       │   └── DashboardLayout.tsx   [F] Sidebar nav + main content area
│   │       └── pages/
│   │           └── DashboardPage.tsx     [F] Overview stats + recent conversations
│   │
│   ├── lib/
│   │   ├── api/
│   │   │   ├── client.ts                 [F] Axios instance with auth interceptors
│   │   │   └── endpoints.ts              [F] Typed API endpoint constants
│   │   └── socket/
│   │       └── socket.client.ts          [F] Socket.IO client singleton + event types
│   │
│   └── assets/                           [D] Static images, fonts
│
├── index.html                            [F] Vite HTML entry point with meta tags
├── vite.config.ts                        [F] Vite config: aliases, plugins, proxy
├── tailwind.config.ts                    [F] Tailwind + shadcn/ui theme tokens
├── Dockerfile                            [F] Multi-stage: build → nginx:alpine
├── package.json
└── tsconfig.json
```

---

## `infra/docker`

```
infra/docker/
├── api/
│   └── Dockerfile                        [F] Production Dockerfile for NestJS API
└── web/
    └── Dockerfile                        [F] Production Dockerfile: Vite build → nginx
```

---

## `infra/k8s`

```
infra/k8s/
├── namespace.yaml                        [F] ai-platform namespace
├── configmaps/
│   └── api-config.yaml                   [F] Non-secret env vars as ConfigMap
├── secrets/
│   └── api-secrets.yaml                  [F] Secret template (values from CI/CD)
├── deployments/
│   ├── api-deployment.yaml               [F] API: 2 replicas, resource limits, liveness probe
│   └── web-deployment.yaml               [F] Web: 2 replicas, nginx container
├── services/
│   ├── api-service.yaml                  [F] ClusterIP service for API pods
│   └── web-service.yaml                  [F] ClusterIP service for web pods
└── ingress/
    └── ingress.yaml                      [F] NGINX Ingress: api.domain.com + app.domain.com
```

---

## Root Config Files

```
docker-compose.yml                        [F] Services: pgvector, redis, api, web, bull-board
.env.example
├── # Database
│   DATABASE_URL=                         postgresql://...?schema=public
│   POSTGRES_USER=
│   POSTGRES_PASSWORD=
│   POSTGRES_DB=
├── # Redis
│   REDIS_URL=                            redis://localhost:6379
├── # Auth
│   JWT_SECRET=
│   JWT_EXPIRY=                           15m
│   REFRESH_TOKEN_EXPIRY=                 7d
├── # AI Providers
│   OPENAI_API_KEY=
│   ANTHROPIC_API_KEY=
│   DEFAULT_AI_PROVIDER=                  openai
│   DEFAULT_MODEL=                        gpt-4o
├── # App
│   NODE_ENV=                             development
│   API_PORT=                             3000
│   WEB_PORT=                             5173
│   API_VERSION=                          v1
└── # Observability
    SENTRY_DSN=                           (optional)
    LOG_LEVEL=                            info
```
