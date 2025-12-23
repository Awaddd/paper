# Code Guide

## Imports

Use `.js` extensions for local imports (required for ESM).
Use `import type` for type-only imports:

```typescript
import { extractMarkdown } from "./pdf.js";
import type { Chunk } from "./chunk.js";
```

## Constants

Module-level constants in `SCREAMING_SNAKE_CASE`:

```typescript
const EMBED_MODEL = "lucataco/qwen3-embedding-8b:42d9...";
const VECTOR_SIZE = 1024;
```

## Configuration

Centralize config in `config.ts`. Validate env vars with Zod at startup:

```typescript
import dotenv from "dotenv";
import z from "zod";

dotenv.config({ path: "../../.env" });

const EnvSchema = z.object({
	REPLICATE_API_TOKEN: z.string(),
});

export const env = EnvSchema.parse(process.env);
```

## Module-Level Clients

Instantiate external clients at module level:

```typescript
const client = new QdrantClient({ host: "localhost", port: 6333 });

const splitter = new MarkdownTextSplitter({
	chunkSize: 1000,
	chunkOverlap: 200,
});
```

## Validation

Use Zod for external data (API responses, env vars).
Use plain TypeScript interfaces for internal data:

```typescript
// External: Zod schema + inferred type
const OutputSchema = z.object({
	markdown: z.string(),
	pages: z.number(),
});
type Output = z.infer<typeof OutputSchema>;

// Internal: plain interface
export interface Chunk {
	text: string;
	metadata: { index: number };
}
```

## Async

All I/O uses async/await:

```typescript
async function processFile(path: string): Promise<string> {
	const buffer = await readFile(path);
	const result = await callApi(buffer);
	return result.data;
}
```

## Function Composition

Extract small helpers. Keep data flow clear:

```typescript
async function extractMarkdown(pdfPath: string): Promise<string> {
	const dataUri = await pdfToDataUri(pdfPath);
	const output = await callMarker(dataUri);
	return output.markdown;
}
```

## File Organization

```
src/
├── index.ts    # CLI entry, command definitions
├── config.ts   # Env validation, service clients
└── *.ts        # Domain logic (one concern per file)
```

## Naming

- Files: lowercase (`chunk.ts`, `store.ts`)
- Constants: SCREAMING_SNAKE_CASE (`VECTOR_SIZE`, `EMBED_MODEL`)
- Functions: camelCase, verb-first (`embedText`, `searchChunks`)
- Types/Schemas: PascalCase (`MarkerOutput`, `ChunkPayloadSchema`)
- Interfaces: PascalCase, noun (`Chunk`, `SearchResult`)
