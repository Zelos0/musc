import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../hooks/redux';
import { setUser } from '../store/slices/authSlice';

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock user data for demo
      const mockUser = {
        id: '123456',
        email,
        name: 'Demo User',
        services: [
          {
            id: 'spotify-1',
            name: 'spotify',
            connected: true,
            token: 'mock-token',
            refreshToken: 'mock-refresh-token',
            expiresAt: Date.now() + 3600000
          },
          {
            id: 'soundcloud-1',
            name: 'soundcloud',
            connected: false
          },
          {
            id: 'deezer-1',
            name: 'deezer',
            connected: false
          }
        ]
      };
      
      dispatch(setUser(mockUser));
      navigate('/');
    } catch (err) {
      setError('Invalid credentials. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock user data for demo
      const mockUser = {
        id: '123456',
        email: 'demo@example.com',
        name: 'Demo User',
        services: [
          {
            id: 'spotify-1',
            name: 'spotify' as const,
            connected: true,
            token: 'mock-token',
            refreshToken: 'mock-refresh-token',
            expiresAt: Date.now() + 3600000
          },
          {
            id: 'soundcloud-1',
            name: 'soundcloud' as const,
            connected: true,
            token: 'mock-token',
            refreshToken: 'mock-refresh-token',
            expiresAt: Date.now() + 3600000
          },
          {
            id: 'deezer-1',
            name: 'deezer' as const,
            connected: true,
            token: 'mock-token',
            refreshToken: 'mock-refresh-token',
            expiresAt: Date.now() + 3600000
          }
        ]
      };
      
      dispatch(setUser(mockUser));
      navigate('/');
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-background to-background/80">
      <div className="w-full max-w-md space-y-8 scale-in">
        <div className="text-center">
          <div className="flex justify-center mb-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="40"
              height="40"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-primary"
            >
              <path d="M9 18V5l12-2v13"></path>
              <circle cx="6" cy="18" r="3"></circle>
              <circle cx="18" cy="16" r="3"></circle>
            </svg>
          </div>
          <h2 className="text-3xl font-bold tracking-tight">HarmonyStream</h2>
          <p className="mt-2 text-muted-foreground">
            Your music, unified across platforms
          </p>
        </div>

        <div className="bg-card border border-border rounded-lg shadow-sm p-6">
          {error && (
            <div className="bg-destructive/10 text-destructive p-3 rounded-md mb-4 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="you@example.com"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-1">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="••••••••"
                required
              />
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-70 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? 'Signing in...' : 'Sign in'}
              </button>
            </div>
          </form>

          <div className="mt-4 flex items-center">
            <div className="flex-grow h-px bg-border"></div>
            <span className="px-2 text-xs text-muted-foreground">OR</span>
            <div className="flex-grow h-px bg-border"></div>
          </div>

          <button
            onClick={handleDemoLogin}
            disabled={isLoading}
            className="mt-4 w-full flex justify-center items-center py-2 px-4 border border-input rounded-md shadow-sm text-sm font-medium text-foreground bg-secondary hover:bg-secondary/80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-70 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? 'Loading...' : 'Try Demo Account'}
          </button>
        </div>

        <div className="flex justify-between text-sm">
          <div className="flex space-x-2">
            <div className="px-2 py-1 rounded-full text-xs service-indicator-spotify">Spotify</div>
            <div className="px-2 py-1 rounded-full text-xs service-indicator-soundcloud">SoundCloud</div>
            <div className="px-2 py-1 rounded-full text-xs service-indicator-deezer">Deezer</div>
          </div>
          <p className="text-muted-foreground">HarmonyStream © 2025</p>
        </div>
      </div>
    </div>
  );
};

export default Login;