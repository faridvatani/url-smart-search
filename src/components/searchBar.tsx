"use client";

import React, { startTransition, useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { X } from "lucide-react";

export default function SearchBar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [query, setQuery] = useState<string>(searchParams.get("q") ?? "");

  const updateSearchParam = (q: string) => {
    const params = new URLSearchParams();
    if (q) params.set("q", q);

    const url = pathname + (params.toString() ? `?${params.toString()}` : "");

    startTransition(() => {
      router.replace(url, { scroll: false });
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSearchParam(query);
  };

  const resetSearch = () => {
    setQuery("");
    router.replace(pathname, { scroll: false });
  };

  return (
    <form onSubmit={handleSubmit} role="search">
      <div className="mb-16 max-w-xl mx-auto relative flex items-center gap-2 rounded-xl bg-white border-2 border-black/40 focus-within:border-indigo-500">
        <input
          type="text"
          name="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for recipes..."
          aria-label="Search recipes"
          className="flex-1 px-3 py-5 border-none focus:outline-none focus:ring-0 text-lg text-gray-700 placeholder:text-zinc-400"
        />
        {query && (
          <button
            type="button"
            onClick={resetSearch}
            className="relative right-0 p-1 text-gray-500 hover:text-gray-700 transition-all duration-300 cursor-pointer"
            aria-label="Clear search input"
          >
            <X />
          </button>
        )}
        <button
          type="submit"
          className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white px-8 py-4 font-semibold hover:from-indigo-600 hover:to-indigo-700 transition-all duration-300 hover:shadow-inner m-1 rounded-lg cursor-pointer"
        >
          Search
        </button>
      </div>
    </form>
  );
}
