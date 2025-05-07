"use client";

import React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function SearchBar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("search")?.toString() || "";

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const inputSearchValue = formData.get("inputSearchValue") as string;

    const params = new URLSearchParams();
    if (inputSearchValue) {
      params.set("search", inputSearchValue);
    } else {
      params.delete("search");
    }

    router.replace(`${pathname}?${params.toString()}`);
  };

  return (
    <form onSubmit={handleSearch} className="mb-16 max-w-2xl mx-auto relative">
      <div className="flex items-center gap-2 rounded-xl overflow-hidden bg-white border-2 border-black/10 focus-within:border-indigo-500/50">
        <input
          type="text"
          name="inputSearchValue"
          defaultValue={initialQuery}
          placeholder="Search for recipes..."
          className="flex-1 px-3 py-5 border-none focus:outline-none focus:ring-0 text-lg text-gray-700 placeholder:text-zinc-400"
        />

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
