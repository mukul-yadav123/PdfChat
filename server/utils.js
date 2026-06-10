import { Document } from "@langchain/core/documents";
import { readFileSync } from "node:fs";
import { PDFParse } from "pdf-parse";

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