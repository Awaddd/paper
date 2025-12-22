import Replicate from "replicate";
import { readFile } from "node:fs/promises";

const replicate = new Replicate();

const MARKER_MODEL = "datalab-to/marker";

interface MarkerOutput {
  markdown: string;
  images: Record<string, string>;
  metadata: {
    pages: number;
    table_of_contents: Array<{ title: string; level: number; page: number }>;
  };
}

/**
 * Convert a local PDF file to base64 data URI
 */
async function pdfToDataUri(pdfPath: string): Promise<string> {
  // TODO: Read file and convert to base64 data URI
  // Format: "data:application/pdf;base64,<base64-encoded-content>"
  const buffer = await readFile(pdfPath);
  const base64 = Buffer.from(buffer).toString("base64");
  return `data:application/pdf;base64,${base64}`;
}

/**
 * Call Marker API to extract markdown from PDF
 */
async function callMarker(fileUri: string): Promise<MarkerOutput> {
  // TODO: Call replicate.run() with MARKER_MODEL
  // Input: { file: fileUri }
  // Returns: MarkerOutput
  const output = replicate.run("datalab-to/marker", {
    input: {
      file: fileUri,
    },
  });
  throw new Error("Not implemented");
}

/**
 * Extract markdown from a PDF file
 */
export async function extractMarkdown(pdfPath: string): Promise<string> {
  console.log(`Processing: ${pdfPath}`);

  // Step 1: Convert PDF to data URI
  const fileUri = await pdfToDataUri(pdfPath);
  console.log("Converted to data URI");

  // Step 2: Call Marker API
  console.log("Calling Marker API...");
  const output = await callMarker(fileUri);
  console.log(`Extracted ${output.metadata.pages} pages`);

  return output.markdown;
}
