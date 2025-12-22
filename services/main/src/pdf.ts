import { readFile } from "node:fs/promises";
import { z } from "zod";
import { replicate } from "./config.js";

const MARKER_MODEL = "datalab-to/marker";

const MarkerOutputSchema = z.object({
  markdown: z.string(),
  images: z.record(z.string(), z.string()),
  metadata: z.object({
    pages: z.number(),
    table_of_contents: z.array(
      z.object({
        title: z.string(),
        level: z.number(),
        page: z.number(),
      })
    ),
  }),
});

type MarkerOutput = z.infer<typeof MarkerOutputSchema>;

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
  const output = await replicate.run(MARKER_MODEL, {
    input: {
      file: fileUri,
    },
  });

  return MarkerOutputSchema.parse(output);
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
