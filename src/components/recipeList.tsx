"use server";
import { prisma } from "@/lib/db";
import { getEmbeddings } from "@/lib/embeddings";
import { Prisma } from "@prisma/client";

export default async function RecipeList({ query }: { query: string }) {
  let queryEmbedding: number[] | null = null;

  if (query && query.trim() !== "") {
    queryEmbedding = await getEmbeddings(query);
  }

  // Build the pipeline dynamically
  const pipeline = [];

  if (queryEmbedding) {
    pipeline.push({
      $vectorSearch: {
        index: "vector_index",
        path: "embeddings",
        queryVector: queryEmbedding,
        numCandidates: 50, // Retrieve more candidates for better accuracy
        limit: 6, // Final limit for results
      },
    });
  }

  pipeline.push(
    {
      $sort: {
        score: -1, // Sort by relevance (higher score first)
      },
    },
    {
      $limit: 16, // Limit the number of results
    },
    {
      $project: {
        title: 1,
        description: 1,
        score: { $meta: "vectorSearchScore" },
      },
    },
  );

  try {
    const res = (await prisma.$runCommandRaw({
      aggregate: "recipes",
      pipeline,
      cursor: {},
    })) as {
      cursor: { firstBatch: Prisma.RecipeCreateInput[] };
    };

    const results = res.cursor.firstBatch;

    if (!results || results.length === 0) {
      return (
        <div className="text-center text-gray-500">
          No recipes found for your search.
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {results.map((recipe: Prisma.RecipeCreateInput, index: number) => (
          <article
            key={index}
            className="bg-white border-2 border-gray-400 rounded-xl overflow-hidden transition-all duration-300 transform flex flex-col hover:scale-105 shadow-lg hover:shadow-xl hover:shadow-indigo-200 hover:border-indigo-500"
          >
            <div className="p-5 border-b border-gray-100">
              <h2 className="text-2xl font-bold text-gray-800">
                {recipe.title}
              </h2>
            </div>

            <div className="p-5 flex-grow">
              <p className="text-gray-600 mb-4 line-clamp-5">
                {recipe.description}
              </p>
            </div>
          </article>
        ))}
      </div>
    );
  } catch (error) {
    console.error("Error fetching recipes:", error);
    return (
      <div className="text-center text-red-500">
        An error occurred while fetching recipes. Please try again later.
      </div>
    );
  }
}
