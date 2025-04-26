export function LoadingState() {
  return (
    <div className="animate-pulse space-y-6">
      <div className="h-8 bg-gray-200 rounded w-48"></div>
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="bg-gray-200 p-4 rounded-lg">
            <div className="h-4 bg-gray-300 rounded w-1/4"></div>
            <div className="mt-3 h-3 bg-gray-300 rounded w-1/3"></div>
          </div>
        ))}
      </div>
    </div>
  );
}
