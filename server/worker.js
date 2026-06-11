import { Worker } from "bullmq";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { loadPdfPages, vectorStore } from "./utils.js";
import { OpenAIEmbeddings } from "@langchain/openai";
import { QdrantVectorStore } from "@langchain/qdrant";

console.log("Worker booting...");

const worker = new Worker(
  "file-upload-queue",
  async (job) => {
    console.log("Job received:", job.id, job.data);

    const data =
      typeof job.data === "string" ? JSON.parse(job.data) : job.data;

    const docs = await loadPdfPages(data.path);
  
    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 300,
      chunkOverlap: 50,
    });
    
    const allSplits = await textSplitter.splitDocuments(docs);
    await vectorStore.addDocuments(docs)
    console.log('All docs added to vector store')

  },
  {
    concurrency: 2,
    connection: {
      host: "localhost",
      port: 6379,
    },
  }
);

worker.on("ready", () => {
  console.log("Worker connected to Redis and ready");
});

worker.on("active", (job) => {
  console.log("Job started:", job.id);
});

worker.on("completed", (job, result) => {
  console.log("Job completed:", job.id, result);
});

worker.on("failed", (job, err) => {
  console.error("Job failed:", job?.id, err);
});

worker.on("error", (err) => {
  console.error("Worker error:", err);
});