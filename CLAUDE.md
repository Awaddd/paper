# Paper

TypeScript RAG system for research papers.

## Docker

```bash
docker compose up -d    # Start Qdrant (data persisted in volume)
docker compose down     # Stop
```

## Commands

```bash
pnpm --filter @paper/main dev pdf <file>     # Extract markdown from PDF
pnpm --filter @paper/main dev ingest <file>  # Ingest markdown file
pnpm --filter @paper/main dev search "query" # Search chunks
pnpm --filter @paper/main dev ask "question" # RAG (TODO)
```

## Architecture

1. **PDF → Markdown** - Marker via Replicate
2. **Chunk** - LangChain MarkdownTextSplitter
3. **Embed** - Qwen3 via Replicate (1024 dims)
4. **Store** - Qdrant (Docker, port 6333)
5. **Generate** - TBD

## Key decisions

- pnpm workspace with `services/main`
- Biome for formatting/linting
- Zod for API response validation
- Same embedding model as recall/ for consistency
