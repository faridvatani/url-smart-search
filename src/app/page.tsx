import Loading from "@/components/loading";
import RecipeList from "@/components/recipeList";
import SearchBar from "@/components/searchBar";
import { Suspense } from "react";

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function Home({ searchParams }: Props) {
  const query = (await searchParams).q as string;

  return (
    <main className="min-h-screen py-12 px-16 max-w-6xl mx-auto bg-white">
      <h1 className="text-4xl text-center font-bold mb-3 text-indigo-500">
        Food Recipe Suggester
      </h1>
      <p className="text-gray-600 max-w-2xl mx-auto mb-8 text-center">
        Discover delicious recipes tailored to your taste. Search by
        ingredients, cuisine, or dietary preferences. Let&apos;s get cooking!
      </p>

      <Suspense>
        <SearchBar />
      </Suspense>

      <Suspense key={query} fallback={<Loading />}>
        <RecipeList query={query} />
      </Suspense>
    </main>
  );
}
