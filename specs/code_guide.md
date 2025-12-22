# Code Guide

## Imports

Use `.js` extensions for local imports (required for ESM):

```typescript
import { extractMarkdown } from "./pdf.js";
import { env, replicate } from "./config.js";
```

## Configuration

Centralize config in `config.ts`. Validate env vars with Zod at startup:

```typescript
import dotenv from "dotenv";
import { z } from "zod";

dotenv.config({ path: "../../.env" });

const EnvSchema = z.object({
  REPLICATE_API_TOKEN: z.string(),
});

export const env = EnvSchema.parse(process.env);
```

## Validation

Use Zod for API responses. Infer types from schemas:

```typescript
const OutputSchema = z.object({
  markdown: z.string(),
  pages: z.number(),
});

type Output = z.infer<typeof OutputSchema>;

const result = OutputSchema.parse(apiResponse);
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
└── pdf.ts      # Domain logic (PDF processing)
```

## Naming

- Files: lowercase, kebab-case for multi-word (`text-splitter.ts`)
- Functions: camelCase, verb-first (`extractMarkdown`, `callMarker`)
- Types/Schemas: PascalCase (`MarkerOutput`, `EnvSchema`)
