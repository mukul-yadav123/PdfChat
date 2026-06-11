import { Document } from "@langchain/core/documents";
import { OpenAIEmbeddings } from "@langchain/openai";
import { QdrantVectorStore } from "@langchain/qdrant";
import { readFileSync } from "node:fs";
import { PDFParse } from "pdf-parse";
import "dotenv/config";

export async function loadPdfPages(filePath) {
  const parser = new PDFParse({
    data: new Uint8Array(readFileSync(filePath)),
  });
  try {
    const { pages } = await parser.getText();
    return pages.map(
      (page) =>
        new Document({
          pageContent: page.text,
          metadata: { source: filePath, page: page.num - 1 },
        })
    );
  } finally {
    await parser.destroy();
  }
}
  export const embeddings = new OpenAIEmbeddings({
  model: 'text-embedding-3-small',
  apiKey: process.env.OPENAI_API_KEY
})

  export const vectorStore = await QdrantVectorStore.fromExistingCollection(embeddings, {
  url: 'http://localhost:6333',
  collectionName: "pdf-docs",
  });
