import type { Chunk } from "./chunk.js";
import { embedTexts } from "./embed.js";
import { ensureCollection, upsertChunk } from "./store.js";

const BATCH_SIZE = 32;

/**
 * Ingest chunks into vector store with batched embedding
 */
export async function ingestChunks(chunks: Chunk[]): Promise<number> {
	await ensureCollection();

	for (let i = 0; i < chunks.length; i += BATCH_SIZE) {
		const batch = chunks.slice(i, i + BATCH_SIZE);
		const vectors = await embedTexts(batch.map((c) => c.text));

		for (let j = 0; j < batch.length; j++) {
			await upsertChunk(batch[j], vectors[j]);
		}

		// Rate limit delay between batches
		if (i + BATCH_SIZE < chunks.length) {
			await new Promise((resolve) => setTimeout(resolve, 12000));
		}
	}

	return chunks.length;
}
