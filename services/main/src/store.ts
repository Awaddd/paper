import { QdrantClient } from "@qdrant/js-client-rest";
import type { Chunk } from "./chunk.js";
import { v5 as uuidv5 } from "uuid";
import { z } from "zod";

const COLLECTION_NAME = "paper";
const VECTOR_SIZE = 1024;

const client = new QdrantClient({ host: "localhost", port: 6333 });

// Schemas
const ChunkPayloadSchema = z.object({
	text: z.string(),
	index: z.number(),
});

const QdrantSearchResultSchema = z.object({
	id: z.union([z.string(), z.number()]),
	version: z.number(),
	score: z.number(),
	payload: ChunkPayloadSchema.nullable(),
});

const SearchResponseSchema = z.array(QdrantSearchResultSchema);

// Types
export interface SearchResult {
	chunk: Chunk;
	score: number;
}

/**
 * Hash content for deduplication
 */
function hashContent(text: string): string {
	return uuidv5(text, uuidv5.URL);
}

/**
 * Ensure collection exists with correct config
 */
export async function ensureCollection(): Promise<void> {
	if (await client.collectionExists(COLLECTION_NAME)) {
		return;
	}

	await client.createCollection(COLLECTION_NAME, {
		vectors: { size: VECTOR_SIZE, distance: "Cosine" },
	});
}

/**
 * Upsert a chunk with its embedding
 */
export async function upsertChunk(chunk: Chunk, vector: number[]): Promise<string> {
	const id = hashContent(chunk.text);
	const response = await client.upsert(COLLECTION_NAME, {
		points: [{ id, vector, payload: { text: chunk.text, ...chunk.metadata } }],
	});
	return response.status;
}

/**
 * Search for similar chunks
 */
export async function searchChunks(queryVector: number[], limit = 3): Promise<SearchResult[]> {
	const response = await client.search(COLLECTION_NAME, {
		vector: queryVector,
		limit,
		with_payload: true,
	});

	const payload = SearchResponseSchema.parse(response);

	return payload
		.filter((r): r is typeof r & { payload: NonNullable<typeof r.payload> } => r.payload !== null)
		.map((r) => ({
			chunk: {
				text: r.payload.text,
				metadata: { index: r.payload.index },
			},
			score: r.score,
		}));
}
