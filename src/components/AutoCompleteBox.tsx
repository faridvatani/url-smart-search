type AutoCompleteBoxProps = {
  suggestions: Array<{ id: string; title: string }>;
  isLoading: boolean;
  onSelect: (title: string) => void;
  visible: boolean;
};
export default function AutoCompleteBox({
  suggestions,
  isLoading,
  onSelect,
  visible,
}: AutoCompleteBoxProps) {
  if (!visible) return null;

  return (
    <div className="absolute w-full max-h-64 bg-white -bottom-11 border-t-none border-2 border-black/40 rounded-b-xl shadow-lg overflow-auto z-10">
      {isLoading ? (
        <p className="px-4 py-2 text-gray-500">Loading suggestions</p>
      ) : suggestions.length > 0 ? (
        <ul>
          {suggestions.map((suggestion) => (
            <li
              key={suggestion.id}
              className="px-4 py-2 text-gray-700 hover:text-gray-500 cursor-pointer"
              onClick={() => onSelect(suggestion.title)}
            >
              {suggestion.title}
            </li>
          ))}
        </ul>
      ) : (
        <p className="px-4 py-2 text-gray-500">No suggestions founds</p>
      )}
    </div>
  );
}
