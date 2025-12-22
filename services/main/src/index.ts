import { readFile } from "node:fs/promises";
import { program } from "commander";
import { chunkMarkdown } from "./chunk.js";
import { embedText } from "./embed.js";
import { extractMarkdown } from "./pdf.js";

program
  .name("paper")
  .description("RAG system for research papers")
  .version("0.0.1");

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
  .description("Ingest a PDF file")
  .action(async (file: string) => {
    console.log(`Ingesting: ${file}`);
    // TODO: extract → chunk → embed → store
  });

program
  .command("search <query>")
  .description("Search for relevant chunks")
  .option("-l, --limit <number>", "Number of results", "3")
  .action(async (query: string, options: { limit: string }) => {
    console.log(`Searching: "${query}" (limit: ${options.limit})`);
    // TODO: implement
  });

program
  .command("ask <question>")
  .description("Ask a question (RAG)")
  .option("-l, --limit <number>", "Number of context chunks", "3")
  .action(async (question: string, options: { limit: string }) => {
    console.log(`Asking: "${question}" (limit: ${options.limit})`);
    // TODO: implement
  });

program.parse();
