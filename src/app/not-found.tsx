/**
 * Custom 404 Page
 * 
 * Provides a minimalist, user-friendly error page that matches
 * the Scandinavian design aesthetic of the main site
 */
export default function NotFound() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <h1 className="text-4xl font-light text-gray-900 mb-4">
          Page not found
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <a
          href="/"
          className="inline-block px-8 py-3 rounded-full bg-gray-900 text-white hover:bg-gray-800 transition-colors"
        >
          Return home
        </a>
      </div>
    </div>
  );
}