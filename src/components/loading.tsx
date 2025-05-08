export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center gap-2">
      <div className="flex space-x-1 justify-center items-center">
        <div className="size-4 bg-indigo-700 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
        <div className="size-4 bg-indigo-700 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
        <div className="size-4 bg-indigo-700 rounded-full animate-bounce"></div>
      </div>
      <p className="text-gray-500">Loading recipes...</p>
    </div>
  );
}
