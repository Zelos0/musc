import { Link } from 'react-router-dom';
import { Music } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] p-6 text-center">
      <Music className="h-16 w-16 text-muted-foreground opacity-20 mb-4" />
      <h1 className="text-4xl font-bold mb-2">404</h1>
      <p className="text-xl mb-6">Page not found</p>
      <p className="text-muted-foreground max-w-md mb-6">
        The page you're looking for doesn't exist or has been moved to another URL.
      </p>
      <Link
        to="/"
        className="px-6 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
      >
        Back to Home
      </Link>
    </div>
  );
};

export default NotFound;