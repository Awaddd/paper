import { readFile } from "node:fs/promises";
import { program } from "commander";
import { chunkMarkdown } from "./chunk.js";
import { embedText, embedTexts } from "./embed.js";
import { generateAnswer } from "./generate.js";
import { extractMarkdown } from "./pdf.js";
import { ensureCollection, upsertChunk, searchChunks } from "./store.js";

const EMBED_BATCH_SIZE = 32;

program.name("paper").description("RAG system for research papers").version("0.0.1");

// Temporary command for testing PDF extraction
program
	.command("pdf <file>")
	.description("Extract markdown from PDF (test)")
	.action(async (file: string) => {
		const markdown = await extractMarkdown(file);
		console.log("\n--- Extracted Markdown ---\n");
		console.log(markdown);
	});

// Temporary command for testing chunking (reads .md directly)
program
	.command("chunk <file>")
	.description("Chunk a markdown file (test)")
	.action(async (file: string) => {
		const markdown = await readFile(file, "utf-8");
		const chunks = await chunkMarkdown(markdown);
		console.log(`\n--- ${chunks.length} Chunks ---\n`);
		for (const chunk of chunks) {
			console.log(`[${chunk.metadata.index}] ${chunk.text.slice(0, 100)}...`);
			console.log("---");
		}
	});

// Temporary command for testing embeddings
program
	.command("embed <text>")
	.description("Generate embedding for text (test)")
	.action(async (text: string) => {
		console.log(`Embedding: "${text.slice(0, 50)}..."`);
		const vector = await embedText(text);
		console.log(`\nVector (${vector.length} dims): [${vector.slice(0, 5).join(", ")}, ...]`);
	});

program
	.command("ingest <file>")
	.description("Ingest a markdown file")
	.action(async (file: string) => {
		console.log(`Ingesting: ${file}`);

		await ensureCollection();

		const markdown = await readFile(file, "utf-8");
		const chunks = await chunkMarkdown(markdown);
		console.log(`Chunked into ${chunks.length} pieces`);

		// Batch embed in groups of 32
		for (let i = 0; i < chunks.length; i += EMBED_BATCH_SIZE) {
			const batch = chunks.slice(i, i + EMBED_BATCH_SIZE);
			const batchNum = Math.floor(i / EMBED_BATCH_SIZE) + 1;
			const totalBatches = Math.ceil(chunks.length / EMBED_BATCH_SIZE);

			console.log(`  Batch ${batchNum}/${totalBatches}: Embedding ${batch.length} chunks...`);
			const vectors = await embedTexts(batch.map((c) => c.text));

			for (let j = 0; j < batch.length; j++) {
				await upsertChunk(batch[j], vectors[j]);
			}
			console.log(`  Batch ${batchNum}/${totalBatches}: Stored`);
		}

		console.log(`\nIngested ${chunks.length} chunks`);
	});

program
	.command("search <query>")
	.description("Search for relevant chunks")
	.option("-l, --limit <number>", "Number of results", "3")
	.action(async (query: string, options: { limit: string }) => {
		const queryVector = await embedText(query);
		const results = await searchChunks(queryVector, parseInt(options.limit));

		console.log(`\n--- ${results.length} Results ---\n`);
		for (const { chunk, score } of results) {
			console.log(`[${chunk.metadata.index}] (${score.toFixed(3)}) ${chunk.text.slice(0, 100)}...`);
			console.log("---");
		}
	});

program
	.command("ask <question>")
	.description("Ask a question (RAG)")
	.option("-l, --limit <number>", "Number of context chunks", "3")
	.action(async (question: string, options: { limit: string }) => {
		console.log(`Asking: "${question}"\n`);

		// Search for relevant context
		const queryVector = await embedText(question);
		const results = await searchChunks(queryVector, parseInt(options.limit));

		console.log(`Found ${results.length} relevant chunks\n`);

		// Generate answer
		const answer = await generateAnswer(question, results);
		console.log("--- Answer ---\n");
		console.log(answer);
	});

program.parse();
