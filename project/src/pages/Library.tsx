import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { setPlaylists } from '../store/slices/playlistSlice';
import { Plus, Music, MoreVertical } from 'lucide-react';
import mockData from '../utils/mockData';

const Library = () => {
  const dispatch = useAppDispatch();
  const { playlists } = useAppSelector(state => state.playlists);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [activeTab, setActiveTab] = useState<'playlists' | 'tracks' | 'albums'>('playlists');

  useEffect(() => {
    // Simulate loading playlists
    dispatch(setPlaylists(mockData.playlists));
  }, [dispatch]);

  const handleCreatePlaylist = () => {
    // Create a new playlist with a unique ID
    const newPlaylist = {
      id: `custom-${Date.now()}`,
      name: newPlaylistName || 'New Playlist',
      owner: 'You',
      tracks: [],
      serviceName: 'harmonized' as const,
      isPublic: false,
      isCollaborative: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    dispatch(setPlaylists([newPlaylist, ...playlists]));
    setShowCreateModal(false);
    setNewPlaylistName('');
  };

  return (
    <div className="p-6 fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h1 className="text-3xl font-bold">Your Library</h1>
        <button 
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
        >
          <Plus size={18} />
          <span>Create Playlist</span>
        </button>
      </div>

      <div className="mb-6">
        <div className="flex border-b border-border">
          <button 
            onClick={() => setActiveTab('playlists')}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'playlists' 
                ? 'border-primary text-foreground' 
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            Playlists
          </button>
          <button 
            onClick={() => setActiveTab('tracks')}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'tracks' 
                ? 'border-primary text-foreground' 
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            Liked Tracks
          </button>
          <button 
            onClick={() => setActiveTab('albums')}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'albums' 
                ? 'border-primary text-foreground' 
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            Albums
          </button>
        </div>
      </div>

      {activeTab === 'playlists' && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {playlists.map((playlist) => (
            <Link 
              key={playlist.id}
              to={`/playlist/${playlist.id}`}
              className="bg-card border border-border rounded-md overflow-hidden hover:bg-card/80 transition-colors group"
            >
              <div className="relative">
                <img 
                  src={playlist.coverArt || 'https://via.placeholder.com/200x200?text=Playlist'} 
                  alt={playlist.name} 
                  className="w-full aspect-square object-cover" 
                />
                {playlist.serviceName && (
                  <div className={`absolute top-2 right-2 px-1.5 py-0.5 text-xs rounded-full capitalize ${
                    playlist.serviceName === 'spotify'
                      ? 'service-indicator-spotify'
                      : playlist.serviceName === 'soundcloud'
                      ? 'service-indicator-soundcloud'
                      : playlist.serviceName === 'deezer'
                      ? 'service-indicator-deezer'
                      : 'bg-primary text-primary-foreground'
                  }`}>
                    {playlist.serviceName}
                  </div>
                )}
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="h-8 w-8 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center">
                    <MoreVertical size={16} />
                  </button>
                </div>
              </div>
              <div className="p-3">
                <h3 className="font-medium text-sm truncate">{playlist.name}</h3>
                <p className="text-muted-foreground text-xs truncate">
                  {playlist.tracks.length} tracks • {playlist.owner}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}

      {activeTab === 'tracks' && (
        <div className="bg-card border border-border rounded-md p-4">
          <div className="flex items-center justify-center py-10 flex-col">
            <Music className="h-12 w-12 text-muted-foreground opacity-30 mb-4" />
            <h3 className="text-lg font-medium">No liked tracks yet</h3>
            <p className="text-muted-foreground mt-1">Start listening and like songs to add them here</p>
          </div>
        </div>
      )}

      {activeTab === 'albums' && (
        <div className="bg-card border border-border rounded-md p-4">
          <div className="flex items-center justify-center py-10 flex-col">
            <Music className="h-12 w-12 text-muted-foreground opacity-30 mb-4" />
            <h3 className="text-lg font-medium">No saved albums yet</h3>
            <p className="text-muted-foreground mt-1">Save albums to add them to your library</p>
          </div>
        </div>
      )}

      {/* Create Playlist Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-card border border-border rounded-lg max-w-md w-full p-6 scale-in">
            <h2 className="text-xl font-bold mb-4">Create Playlist</h2>
            <div className="mb-4">
              <label htmlFor="playlist-name" className="block text-sm font-medium mb-1">
                Playlist Name
              </label>
              <input
                id="playlist-name"
                type="text"
                value={newPlaylistName}
                onChange={(e) => setNewPlaylistName(e.target.value)}
                placeholder="My New Playlist"
                className="w-full px-3 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 border border-input rounded-md hover:bg-secondary transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreatePlaylist}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Library;