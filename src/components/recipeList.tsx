import { prisma } from "@/lib/db";
import { Prisma } from "@prisma/client";

export default async function RecipeList({ query }: { query: string }) {
  // Build the pipeline dynamically
  const pipeline = [];

  if (query && query.trim() !== "") {
    pipeline.push({
      $search: {
        index: "default",
        text: {
          query,
          path: ["title", "description"],
          fuzzy: {
            maxEdits: 2, // allows up to 2 typos
            prefixLength: 1, // first char must catch exactly
          },
        },
      },
    });
  }

  pipeline.push(
    { $limit: 16 },
    {
      $project: {
        _id: 1,
        title: 1,
        description: 1,
        score: { $meta: "searchScore" },
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
