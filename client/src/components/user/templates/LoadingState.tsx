export default function LoadingState() {
  return (
    <div className="flex-1 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="animate-pulse space-y-6">
          {/* Action buttons skeleton */}
          <div className="flex gap-4">
            <div className="h-10 w-32 bg-gray-200 rounded-md"></div>
            <div className="h-10 w-32 bg-gray-200 rounded-md"></div>
          </div>

          {/* Breadcrumb skeleton */}
          <div className="h-8 w-96 bg-gray-200 rounded-md"></div>

          {/* Files list skeleton */}
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-4 space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="h-5 w-5 bg-gray-200 rounded"></div>
                  <div className="h-4 w-48 bg-gray-200 rounded"></div>
                  <div className="h-4 w-16 bg-gray-200 rounded ml-auto"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
