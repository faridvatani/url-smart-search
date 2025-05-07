import Link from "next/link";
import results from "@/data/recipes.json";

export default async function RecipeList() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {results.map((recipe) => (
        <Link
          href={`/recipes/${recipe.title}`}
          key={recipe.title + recipe.description}
          className="bg-white border-2 border-gray-400 rounded-xl overflow-hidden transition-all duration-300 transform flex flex-col hover:scale-105 shadow-lg hover:shadow-xl hover:shadow-indigo-200 hover:border-indigo-500"
        >
          <div className="p-5 border-b border-gray-100">
            <h2 className="text-2xl font-bold text-gray-800">{recipe.title}</h2>
          </div>

          <div className="p-5 flex-grow">
            <p className="text-gray-600 mb-4 line-clamp-5">
              {recipe.description}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
}
