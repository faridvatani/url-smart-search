"use client";

import React, { startTransition, useEffect, useRef, useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { X } from "lucide-react";
import AutoCompleteBox from "./AutoCompleteBox";
import { useDebounce } from "@/hooks/useDebounce";

export default function SearchBar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") ?? "";
  const [query, setQuery] = useState<string>(initialQuery);
  const [suggestions, setSuggestions] = useState<
    Array<{ id: string; title: string }>
  >([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState<string>(initialQuery);
  const formRef = useRef<HTMLFormElement>(null);
  const debouncedSearchTerm = useDebounce(query, 300);

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

  // Fetch autocomplete suggestions when debounced input value changes
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (debouncedSearchTerm.length < 2) {
        setSuggestions([]);
        return;
      }

      setIsLoading(true);

      try {
        const response = await fetch(
          `/api/autocomplete?q=${encodeURIComponent(debouncedSearchTerm)}`,
        );
        const data = await response.json();
        setSuggestions(data.suggestions || []);
      } catch (error) {
        console.error("Error fetching suggestions:", error);
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSuggestions();
  }, [debouncedSearchTerm]);

  const submitSearch = (searchValue: string) => {
    const params = new URLSearchParams();
    if (searchValue) {
      params.set("q", searchValue);
    } else {
      params.delete("q");
    }

    setShowSuggestions(false);
    router.replace(
      pathname + (params.toString() ? `?${params.toString()}` : ""),
      { scroll: false },
    );
  };

  const handleSelectSuggestion = (title: string) => {
    setInputValue(title);
    submitSearch(title);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    setShowSuggestions(true);
  };

  const handleInputFocus = () => {
    if (inputValue.length >= 2) {
      setShowSuggestions(true);
    }
  };

  // Click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (formRef.current && !formRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <form
      onSubmit={handleSubmit}
      role="search"
      className="relative mb-16 w-full max-w-xl mx-auto "
    >
      <div
        className="relative flex items-center gap-2 rounded-xl focus-within:rounded-b-none bg-white border-2 border-black/40 focus-within:border-indigo-500  focus-within:ring-indigo-500 transition-all duration-300 ${
          "
      >
        <input
          type="text"
          name="search"
          // value={query}
          value={inputValue}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
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
          className="max-w-full bg-gradient-to-r from-indigo-500 to-indigo-600 text-white px-8 py-4 font-semibold hover:from-indigo-600 hover:to-indigo-700 transition-all duration-300 hover:shadow-inner m-1 rounded-lg cursor-pointer"
        >
          Search
        </button>
      </div>
      <AutoCompleteBox
        suggestions={suggestions}
        isLoading={isLoading}
        onSelect={handleSelectSuggestion}
        visible={showSuggestions}
      />
    </form>
  );
}
