import { program } from "commander";
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
