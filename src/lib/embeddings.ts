"use server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// function to get embeddings from OpenAI
export async function getEmbeddings(text: string): Promise<number[]> {
  try {
    const response = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: text,
    });

    // Extract the embedding vector from the response
    return response.data[0].embedding;
  } catch (error) {
    console.error("Failed to generate embeddings:", error);
    throw new Error("Embedding generation failed");
  }
}
