/**
 * Loading State Component
 * 
 * Provides a minimalist loading state that matches the site's
 * Scandinavian design principles with subtle animations
 */
export default function Loading() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="space-y-4 text-center">
        <div className="w-16 h-16 mx-auto">
          {/* Simple animated loading indicator */}
          <svg
            className="animate-spin text-gray-400"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="3"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        </div>
        <p className="text-gray-600 font-light text-lg">Loading...</p>
      </div>
    </div>
  );
}