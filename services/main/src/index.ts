import { program } from "commander";
import "dotenv/config";

program
  .name("paper")
  .description("RAG system for research papers")
  .version("0.0.1");

program
  .command("ingest <file>")
  .description("Ingest a PDF file")
  .action(async (file: string) => {
    console.log(`Ingesting: ${file}`);
    // TODO: implement
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
