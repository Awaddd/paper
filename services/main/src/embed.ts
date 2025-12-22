import { z } from "zod";
import { replicate } from "./config.js";

const EMBED_MODEL =
  "lucataco/qwen3-embedding-8b:42d968487820032a1535d81ea20df16f442ea308ec5abae6b5d6cf4675eb3e2f";

const EmbedOutputSchema = z.object({
  embeddings: z.array(z.array(z.number())),
});

/**
 * Generate embeddings for a batch of texts
 * Returns 1024-dimensional vectors
 */
export async function embedTexts(texts: string[]): Promise<number[][]> {
  const output = await replicate.run(EMBED_MODEL, {
    input: {
      text: texts,
    },
  });

  return EmbedOutputSchema.parse(output).embeddings;
}

/**
 * Generate embedding for a single text (convenience wrapper)
 */
export async function embedText(text: string): Promise<number[]> {
  const embeddings = await embedTexts([text]);
  return embeddings[0];
}
