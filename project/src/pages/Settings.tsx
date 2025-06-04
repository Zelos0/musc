import { useState } from 'react';
import { useAppSelector, useAppDispatch } from '../hooks/redux';
import { connectService, disconnectService, Service } from '../store/slices/authSlice';
import { setCrossfade } from '../store/slices/playerSlice';

const Settings = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector(state => state.auth);
  const { crossfadeSeconds } = useAppSelector(state => state.player);
  const [theme, setTheme] = useState('dark');
  const [quality, setQuality] = useState('high');
  const [connectingService, setConnectingService] = useState<string | null>(null);

  const handleConnectService = async (serviceName: 'spotify' | 'soundcloud' | 'deezer') => {
    setConnectingService(serviceName);
    
    // Simulate OAuth flow
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Create mock service connection
      const service: Service = {
        id: `${serviceName}-${Date.now()}`,
        name: serviceName,
        connected: true,
        token: 'mock-token',
        refreshToken: 'mock-refresh-token',
        expiresAt: Date.now() + 3600000
      };
      
      dispatch(connectService(service));
    } finally {
      setConnectingService(null);
    }
  };
  
  const handleDisconnectService = (serviceId: string) => {
    dispatch(disconnectService(serviceId));
  };
  
  const handleCrossfadeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setCrossfade(parseInt(e.target.value)));
  };

  if (!user) {
    return (
      <div className="p-6 text-center">
        <p>Please log in to access settings.</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto fade-in">
      <h1 className="text-3xl font-bold mb-6">Settings</h1>
      
      <div className="space-y-8">
        {/* Account Section */}
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <div className="p-4 bg-card border-b border-border">
            <h2 className="text-lg font-semibold">Account</h2>
          </div>
          
          <div className="p-6">
            <div className="flex items-center space-x-4">
              <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-medium text-lg">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="font-medium">{user.name}</p>
                <p className="text-muted-foreground">{user.email}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-1">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={user.email}
                  readOnly
                  className="w-full px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-1">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={user.name}
                  readOnly
                  className="w-full px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
            
            <div className="mt-6">
              <button className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors">
                Edit Account
              </button>
            </div>
          </div>
        </div>
        
        {/* Connected Services Section */}
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <div className="p-4 bg-card border-b border-border">
            <h2 className="text-lg font-semibold">Connected Services</h2>
          </div>
          
          <div className="p-6 space-y-6">
            {/* Spotify */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 rounded-full bg-[#1DB954] flex items-center justify-center">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2ZM16.75 16.75C16.5 17 16 17 15.75 16.75C13.25 15.25 10 15 6.75 15.75C6.5 15.75 6 15.5 6 15C6 14.75 6.25 14.5 6.75 14.25C10.5 13.5 14 13.75 16.75 15.5C17 15.75 17 16.5 16.75 16.75ZM18 13.75C17.75 14 17.25 14 17 13.75C14 12 9.75 11.5 6.75 12.5C6.5 12.5 6 12.25 6 11.75C6 11.5 6.25 11.25 6.75 11C10.25 10 15 10.5 18.25 12.5C18.5 12.5 18.5 13.5 18 13.75ZM19.25 10.75C16 8.75 10.75 8.5 7 9.5C6.75 9.5 6.25 9.25 6.25 8.75C6.25 8.25 6.5 8 7 7.75C11.25 6.75 17 7 20.5 9.25C21 9.5 21 9.75 20.75 10.25C20.5 10.5 20 10.75 19.25 10.75Z" fill="white"/>
                  </svg>
                </div>
                <div>
                  <p className="font-medium">Spotify</p>
                  <p className="text-sm text-muted-foreground">
                    {user.services.find(s => s.name === 'spotify' && s.connected)
                      ? 'Connected'
                      : 'Not connected'}
                  </p>
                </div>
              </div>
              
              {user.services.find(s => s.name === 'spotify' && s.connected) ? (
                <button 
                  onClick={() => {
                    const service = user.services.find(s => s.name === 'spotify' && s.connected);
                    if (service) handleDisconnectService(service.id);
                  }}
                  className="px-4 py-2 border border-input rounded-md hover:bg-secondary transition-colors"
                >
                  Disconnect
                </button>
              ) : (
                <button 
                  onClick={() => handleConnectService('spotify')}
                  disabled={!!connectingService}
                  className="px-4 py-2 bg-[#1DB954] text-white rounded-md hover:bg-[#1DB954]/90 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {connectingService === 'spotify' ? 'Connecting...' : 'Connect'}
                </button>
              )}
            </div>
            
            {/* SoundCloud */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 rounded-full bg-[#FF5500] flex items-center justify-center">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M11.5 4C8 4 5 7 5 10.5V16H18.5C20.5 16 22 14.5 22 12.5C22 10.5 20.5 9 18.5 9C18 9 17.5 9.1 17 9.2C16.2 6.2 14 4 11.5 4ZM4 10.6V16H5V10.6C4.9 10.6 4.5 10.7 4 10.6ZM3 11.1V16H4V11.1C3.9 11.1 3.5 11.2 3 11.1ZM2 12.3V16H3V12.3C2.9 12.3 2.5 12.4 2 12.3ZM1 13.7V16H2V13.7C1.9 13.7 1.5 13.8 1 13.7ZM0 15.6V16H1V15.6C0.4 15.6 0.5 15.7 0 15.6Z" fill="white"/>
                  </svg>
                </div>
                <div>
                  <p className="font-medium">SoundCloud</p>
                  <p className="text-sm text-muted-foreground">
                    {user.services.find(s => s.name === 'soundcloud' && s.connected)
                      ? 'Connected'
                      : 'Not connected'}
                  </p>
                </div>
              </div>
              
              {user.services.find(s => s.name === 'soundcloud' && s.connected) ? (
                <button 
                  onClick={() => {
                    const service = user.services.find(s => s.name === 'soundcloud' && s.connected);
                    if (service) handleDisconnectService(service.id);
                  }}
                  className="px-4 py-2 border border-input rounded-md hover:bg-secondary transition-colors"
                >
                  Disconnect
                </button>
              ) : (
                <button 
                  onClick={() => handleConnectService('soundcloud')}
                  disabled={!!connectingService}
                  className="px-4 py-2 bg-[#FF5500] text-white rounded-md hover:bg-[#FF5500]/90 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {connectingService === 'soundcloud' ? 'Connecting...' : 'Connect'}
                </button>
              )}
            </div>
            
            {/* Deezer */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 rounded-full bg-[#FF0092] flex items-center justify-center">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M15.5 2H19.5V6H15.5V2ZM10.5 2H14.5V6H10.5V2ZM5.5 2H9.5V6H5.5V2ZM15.5 7H19.5V11H15.5V7ZM10.5 7H14.5V11H10.5V7ZM5.5 7H9.5V11H5.5V7ZM15.5 12H19.5V16H15.5V12ZM10.5 12H14.5V16H10.5V12ZM5.5 12H9.5V16H5.5V12ZM15.5 17H19.5V21H15.5V17ZM10.5 17H14.5V21H10.5V17ZM5.5 17H9.5V21H5.5V17Z" fill="white"/>
                  </svg>
                </div>
                <div>
                  <p className="font-medium">Deezer</p>
                  <p className="text-sm text-muted-foreground">
                    {user.services.find(s => s.name === 'deezer' && s.connected)
                      ? 'Connected'
                      : 'Not connected'}
                  </p>
                </div>
              </div>
              
              {user.services.find(s => s.name === 'deezer' && s.connected) ? (
                <button 
                  onClick={() => {
                    const service = user.services.find(s => s.name === 'deezer' && s.connected);
                    if (service) handleDisconnectService(service.id);
                  }}
                  className="px-4 py-2 border border-input rounded-md hover:bg-secondary transition-colors"
                >
                  Disconnect
                </button>
              ) : (
                <button 
                  onClick={() => handleConnectService('deezer')}
                  disabled={!!connectingService}
                  className="px-4 py-2 bg-[#FF0092] text-white rounded-md hover:bg-[#FF0092]/90 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {connectingService === 'deezer' ? 'Connecting...' : 'Connect'}
                </button>
              )}
            </div>
          </div>
        </div>
        
        {/* Preferences Section */}
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <div className="p-4 bg-card border-b border-border">
            <h2 className="text-lg font-semibold">Preferences</h2>
          </div>
          
          <div className="p-6 space-y-6">
            {/* Theme */}
            <div>
              <label className="block text-sm font-medium mb-2">Theme</label>
              <div className="flex space-x-2">
                <button 
                  onClick={() => setTheme('light')}
                  className={`px-4 py-2 rounded-md transition-colors ${
                    theme === 'light' 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-secondary text-secondary-foreground'
                  }`}
                >
                  Light
                </button>
                <button 
                  onClick={() => setTheme('dark')}
                  className={`px-4 py-2 rounded-md transition-colors ${
                    theme === 'dark' 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-secondary text-secondary-foreground'
                  }`}
                >
                  Dark
                </button>
                <button 
                  onClick={() => setTheme('system')}
                  className={`px-4 py-2 rounded-md transition-colors ${
                    theme === 'system' 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-secondary text-secondary-foreground'
                  }`}
                >
                  System
                </button>
              </div>
            </div>
            
            {/* Audio Quality */}
            <div>
              <label className="block text-sm font-medium mb-2">Audio Quality</label>
              <div className="flex space-x-2">
                <button 
                  onClick={() => setQuality('low')}
                  className={`px-4 py-2 rounded-md transition-colors ${
                    quality === 'low' 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-secondary text-secondary-foreground'
                  }`}
                >
                  Low (96kbps)
                </button>
                <button 
                  onClick={() => setQuality('medium')}
                  className={`px-4 py-2 rounded-md transition-colors ${
                    quality === 'medium' 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-secondary text-secondary-foreground'
                  }`}
                >
                  Medium (128kbps)
                </button>
                <button 
                  onClick={() => setQuality('high')}
                  className={`px-4 py-2 rounded-md transition-colors ${
                    quality === 'high' 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-secondary text-secondary-foreground'
                  }`}
                >
                  High (320kbps)
                </button>
              </div>
            </div>
            
            {/* Crossfade */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Crossfade Between Songs: {crossfadeSeconds} seconds
              </label>
              <input
                type="range"
                min="0"
                max="12"
                step="1"
                value={crossfadeSeconds}
                onChange={handleCrossfadeChange}
                className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>Off</span>
                <span>12s</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Storage & Data */}
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <div className="p-4 bg-card border-b border-border">
            <h2 className="text-lg font-semibold">Storage & Data</h2>
          </div>
          
          <div className="p-6 space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <p className="font-medium">Cache Size</p>
                <p>512 MB</p>
              </div>
              <div className="h-2 bg-secondary rounded-full overflow-hidden">
                <div className="h-full bg-primary w-1/3"></div>
              </div>
              <p className="text-sm text-muted-foreground mt-1">170 MB used of 512 MB</p>
            </div>
            
            <button className="px-4 py-2 border border-input rounded-md hover:bg-secondary transition-colors">
              Clear Cache
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;