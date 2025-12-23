import { z } from "zod";
import { replicate } from "./config.js";
import type { SearchResult } from "./store.js";

const HAIKU_MODEL = "anthropic/claude-4.5-haiku";

const GenerateOutputSchema = z.union([z.string(), z.array(z.string())]);

/**
 * Format search results as context for the prompt
 */
function formatContext(results: SearchResult[]): string {
	return results.map((chunk) => `${chunk.chunk.metadata.index} ${chunk.chunk.text}`).join("\n\n");
}

/**
 * Generate an answer using Claude Haiku via Replicate
 */
export async function generateAnswer(
	query: string,
	context: SearchResult[],
): Promise<string | string[]> {
	if (context.length === 0) {
		return "No relevant context found to answer the question.";
	}

	const contextStr = formatContext(context);
	const prompt = `Based on the following context, answer the question. Cite relevant sections by number.

Context:
${contextStr}

Question: ${query}`;

	const output = await replicate.run(HAIKU_MODEL, {
		input: { prompt, max_tokens: 1024 },
	});

	const result = GenerateOutputSchema.parse(output);

	if (typeof result === "string") {
		return result;
	}

	return result.join(" ");
}
