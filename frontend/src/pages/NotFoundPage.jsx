import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-3">404</h1>
        <p className="mb-4">The page you’re looking for does not exist.</p>
        <Link to="/" className="text-blue-600 hover:underline">
          Go back home
        </Link>
      </div>
    </div>
  );
}
