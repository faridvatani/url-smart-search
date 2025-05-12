"use client";

import React, { startTransition, useEffect, useRef, useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { X } from "lucide-react";
import AutoCompleteBox from "./AutoCompleteBox";
import { useDebounce } from "@/hooks/useDebounce";
import { useClickOutside } from "@/hooks/useClickOutside";

export default function SearchBar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") ?? "";

  const [inputValue, setInputValue] = useState<string>(initialQuery);
  const [suggestions, setSuggestions] = useState<
    Array<{ id: string; title: string }>
  >([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
  const formRef = useRef<HTMLFormElement>(null);
  const debouncedSearchTerm = useDebounce(inputValue, 300);

  // Close suggestions when clicking outside the form
  useClickOutside(formRef, () => setShowSuggestions(false));

  // Update the query parameter in the URL
  const updateSearchParam = (q: string) => {
    const params = new URLSearchParams();
    if (q) params.set("q", q);

    const url = pathname + (params.toString() ? `?${params.toString()}` : "");

    startTransition(() => {
      router.replace(url, { scroll: false });
    });
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSearchParam(inputValue);
    setShowSuggestions(false);
  };

  // Reset the search input and suggestions
  const resetSearch = () => {
    setInputValue("");
    setSuggestions([]);
    setShowSuggestions(false);
    router.replace(pathname, { scroll: false });
  };

  // Fetch autocomplete suggestions when the debounced input value changes
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

  // Handle selecting a suggestion
  const handleSelectSuggestion = (title: string) => {
    setInputValue(title);
    updateSearchParam(title);
    setShowSuggestions(false);
  };

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    setShowSuggestions(true);
  };

  // Handle input focus
  const handleInputFocus = () => {
    if (inputValue.length >= 2) {
      setShowSuggestions(true);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      role="search"
      className="relative mb-16 w-full max-w-xl mx-auto"
      ref={formRef}
    >
      <div className="relative flex items-center gap-2 rounded-xl focus-within:rounded-b-none bg-white border-2 border-black/40 focus-within:border-indigo-500 focus-within:ring-indigo-500 transition-all duration-300 shadow-lg">
        <input
          type="text"
          name="search"
          value={inputValue}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          placeholder="Search for recipes..."
          aria-label="Search recipes"
          className="flex-1 px-3 py-5 border-none focus:outline-none focus:ring-0 text-lg text-gray-700 placeholder:text-zinc-400"
        />
        {inputValue && (
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
