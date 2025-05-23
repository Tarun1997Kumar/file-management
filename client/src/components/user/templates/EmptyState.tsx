export default function EmptyState() {
  return (
    <div className="px-6 py-12 text-center">
      <svg
        className="mx-auto h-12 w-12 text-gray-400 animate-bounce"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H9a2 2 0 00-2 2v5a2 2 0 01-2 2z"
        />
      </svg>
      <h3 className="mt-2 text-sm font-medium text-gray-900">
        No files or folders
      </h3>
      <p className="mt-1 text-sm text-gray-500">
        Get started by creating a new folder or uploading a file.
      </p>
    </div>
  );
}
