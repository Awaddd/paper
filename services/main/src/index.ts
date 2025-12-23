import { readFile } from "node:fs/promises";
import { program } from "commander";
import { chunkMarkdown } from "./chunk.js";
import { embedText } from "./embed.js";
import { generateAnswer } from "./generate.js";
import { ingestChunks } from "./ingest.js";
import { extractMarkdown } from "./pdf.js";
import { searchChunks } from "./store.js";

program.name("paper").description("RAG system for research papers").version("0.0.1");

program
	.command("pdf <file>")
	.description("Extract markdown from PDF")
	.action(async (file: string) => {
		const markdown = await extractMarkdown(file);
		console.log(markdown);
	});

program
	.command("chunk <file>")
	.description("Chunk a markdown file")
	.action(async (file: string) => {
		const markdown = await readFile(file, "utf-8");
		const chunks = await chunkMarkdown(markdown);
		console.log(`${chunks.length} chunks`);
	});

program
	.command("embed <text>")
	.description("Generate embedding for text")
	.action(async (text: string) => {
		const vector = await embedText(text);
		console.log(`${vector.length} dims`);
	});

program
	.command("ingest <file>")
	.description("Ingest a markdown file")
	.action(async (file: string) => {
		const markdown = await readFile(file, "utf-8");
		const chunks = await chunkMarkdown(markdown);
		const count = await ingestChunks(chunks);
		console.log(`Ingested ${count} chunks`);
	});

program
	.command("search <query>")
	.description("Search for relevant chunks")
	.option("-l, --limit <number>", "Number of results", "3")
	.action(async (query: string, options: { limit: string }) => {
		const queryVector = await embedText(query);
		const results = await searchChunks(queryVector, Number.parseInt(options.limit));

		for (const { chunk, score } of results) {
			console.log(`[${chunk.metadata.index}] (${score.toFixed(3)}) ${chunk.text.slice(0, 100)}...`);
		}
	});

program
	.command("ask <question>")
	.description("Ask a question (RAG)")
	.option("-l, --limit <number>", "Number of context chunks", "5")
	.action(async (question: string, options: { limit: string }) => {
		const queryVector = await embedText(question);
		const results = await searchChunks(queryVector, Number.parseInt(options.limit));

		await new Promise((resolve) => setTimeout(resolve, 12000));

		const answer = await generateAnswer(question, results);
		console.log(answer);
	});

program.parse();
