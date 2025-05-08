import { getEmbeddings } from "@/lib/embeddings";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function generateEmbeddings() {
  console.log("Starting to generate embeddings...");

  try {
    // Get all recipes without embeddings
    const recipes = await prisma.recipe.findMany();
    console.log(`Found ${recipes.length} recipes to process`);

    // Process recipes in batches to avoid rate limiting
    const batchSize = 5; // Adjust based on OpenAI's rate limits
    for (let i = 0; i < recipes.length; i += batchSize) {
      const batch = recipes.slice(i, i + batchSize);
      console.log(
        `Processing batch ${i / batchSize + 1} of ${Math.ceil(
          recipes.length / batchSize,
        )}`,
      );

      // Process each recipe in the batch
      const updates = batch.map(async (recipe) => {
        try {
          // Generate embeddings
          const embeddings = await getEmbeddings(recipe.description);

          // Update the recipe with embeddings
          await prisma.recipe.update({
            where: { id: recipe.id },
            data: { embeddings },
          });

          console.log(`Generated embeddings for recipe: ${recipe.title}`);
        } catch (error) {
          console.error(`Error processing recipe ${recipe.id}:`, error);
        }
      });

      // wait for all updates in this batch to complete
      await Promise.all(updates);

      // Add a small delay between batches to avoid rate limits
      if (i + batchSize < recipes.length) {
        console.log("Waiting before processing next batch...");
        await new Promise((resolve) => setTimeout(resolve, 2000)); // 2-second delay
      }
    }
    console.log("All recipes processed successfully.");
  } catch (error) {
    console.error(`Error generating embeddings:`, error);
    throw new Error("Embedding generation failed.");
  }
}

async function main() {
  try {
    await generateEmbeddings();
  } catch (err) {
    console.error("Fatal error:", err);
  } finally {
    await prisma.$disconnect();
  }
}

main();
