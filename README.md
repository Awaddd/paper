# Paper

RAG system for research papers. Feed it PDFs, ask it questions, get answers with source references.

## Setup

```bash
pnpm install
docker compose up -d  # starts Qdrant
```

You'll need a `.env` file:

```
REPLICATE_API_TOKEN=your_token
```

## Usage

```bash
# Extract markdown from PDF
pnpm --filter @paper/main dev pdf paper.pdf

# Ingest into vector store
pnpm --filter @paper/main dev ingest paper.md

# Search chunks
pnpm --filter @paper/main dev search "attention mechanism"

# Ask questions
pnpm --filter @paper/main dev ask "how does the transformer handle long sequences?"
```

## How it works

1. **PDF → Markdown** via Marker on Replicate
2. **Chunk** with LangChain's MarkdownTextSplitter
3. **Embed** with Qwen3 (1024 dims) on Replicate
4. **Store** in Qdrant
5. **Generate** answers with Claude

## Stack

- TypeScript
- pnpm workspaces
- Qdrant (vector store)
- Replicate (embeddings, PDF extraction)
- Biome (lint/format)
- Zod (validation)
