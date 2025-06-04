import { Link, useLocation } from 'react-router-dom';
import { Home, Search, Library, Settings, LogOut } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { logout } from '../../store/slices/authSlice';

const Sidebar = () => {
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const connectedServices = user?.services.filter(s => s.connected) || [];

  const handleLogout = () => {
    dispatch(logout());
  };

  const navItems = [
    { path: '/', label: 'Home', icon: <Home size={20} /> },
    { path: '/search', label: 'Search', icon: <Search size={20} /> },
    { path: '/library', label: 'Library', icon: <Library size={20} /> },
    { path: '/settings', label: 'Settings', icon: <Settings size={20} /> },
  ];

  return (
    <aside className="w-64 hidden md:flex flex-col bg-card border-r border-border h-full">
      <div className="p-5">
        <div className="flex items-center space-x-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
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
          <h1 className="text-xl font-bold">HarmonyStream</h1>
        </div>
      </div>

      <nav className="mt-2 flex-1">
        <ul className="space-y-1 px-2">
          {navItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`flex items-center space-x-3 px-3 py-2 rounded-md transition-colors ${
                  location.pathname === item.path
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-secondary hover:text-secondary-foreground'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-4 border-t border-border">
        <h3 className="text-sm font-medium text-muted-foreground mb-2">
          Connected Services
        </h3>
        <div className="flex flex-wrap gap-2">
          {connectedServices.length > 0 ? (
            connectedServices.map((service) => (
              <div
                key={service.id}
                className={`px-2 py-1 text-xs rounded-full capitalize ${
                  service.name === 'spotify'
                    ? 'service-indicator-spotify'
                    : service.name === 'soundcloud'
                    ? 'service-indicator-soundcloud'
                    : 'service-indicator-deezer'
                }`}
              >
                {service.name}
              </div>
            ))
          ) : (
            <div className="text-sm text-muted-foreground">
              No services connected
            </div>
          )}
        </div>
      </div>

      <div className="p-4 border-t border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-medium">
              {user?.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-sm font-medium">{user?.name}</p>
              <p className="text-xs text-muted-foreground">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;