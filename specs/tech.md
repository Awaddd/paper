# Tech Stack

## Core

- **Language:** TypeScript (ES2022, strict mode)
- **Runtime:** Node.js
- **Module System:** ES Modules
- **Package Manager:** pnpm workspaces

## Dependencies

| Purpose | Library |
|---------|---------|
| CLI | commander |
| Validation | zod |
| PDF to Markdown | replicate (Marker API) |
| Text Chunking | @langchain/textsplitters |
| Vector Store | @qdrant/js-client-rest |
| Env Config | dotenv |

## Dev Tools

| Purpose | Tool |
|---------|------|
| Linting/Formatting | biome |
| TypeScript Executor | tsx |
| Compiler | tsc |

## External Services

- **Replicate** — ML model inference (Marker for PDF conversion)
- **Qdrant** — Vector database for embeddings
