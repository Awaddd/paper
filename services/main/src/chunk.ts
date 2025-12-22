import { MarkdownTextSplitter } from "@langchain/textsplitters";

export interface Chunk {
  text: string;
  metadata: {
    index: number;
  };
}

const splitter = new MarkdownTextSplitter({
  chunkSize: 1000,
  chunkOverlap: 200,
});

/**
 * Split markdown into chunks
 */
export async function chunkMarkdown(markdown: string): Promise<Chunk[]> {
  const texts = await splitter.splitText(markdown);
  return texts.map((text, index) => ({
    text,
    metadata: { index },
  }));
}
