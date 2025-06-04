import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { setCurrentTrack, setIsPlaying, setQueue, addToQueue } from '../store/slices/playerSlice';
import { setPlaylists } from '../store/slices/playlistSlice';
import { Play, Plus } from 'lucide-react';
import mockData from '../utils/mockData';

const Home = () => {
  const dispatch = useAppDispatch();
  const { currentTrack, isPlaying } = useAppSelector(state => state.player);
  const { playlists } = useAppSelector(state => state.playlists);
  const { user } = useAppSelector(state => state.auth);

  useEffect(() => {
    // Simulate loading playlists
    dispatch(setPlaylists(mockData.playlists));
  }, [dispatch]);

  const handlePlayTrack = (track: any) => {
    if (currentTrack?.id === track.id) {
      dispatch(setIsPlaying(!isPlaying));
    } else {
      dispatch(setCurrentTrack(track));
      dispatch(setIsPlaying(true));
      
      // Add similar tracks to queue
      const similarTracks = mockData.tracks
        .filter(t => t.id !== track.id)
        .slice(0, 5);
      dispatch(setQueue(similarTracks));
    }
  };

  const handleAddToQueue = (track: any, event: React.MouseEvent) => {
    event.stopPropagation();
    dispatch(addToQueue(track));
  };

  return (
    <div className="p-6 fade-in">
      <div className="pb-6">
        <h1 className="text-3xl font-bold">Welcome back{user ? `, ${user.name.split(' ')[0]}` : ''}!</h1>
        <p className="text-muted-foreground">Your unified music experience</p>
      </div>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Recently Played</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {mockData.tracks.slice(0, 5).map((track) => (
            <div 
              key={track.id}
              className="bg-card border border-border rounded-md overflow-hidden hover:bg-card/80 transition-colors cursor-pointer group"
              onClick={() => handlePlayTrack(track)}
            >
              <div className="relative">
                <img 
                  src={track.coverArt} 
                  alt={track.title} 
                  className="w-full aspect-square object-cover" 
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button className="h-10 w-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg">
                    {currentTrack?.id === track.id && isPlaying ? (
                      <div className="w-4 h-4 flex items-center justify-center space-x-0.5">
                        <span className="w-1 h-4 bg-white animate-[soundbar_0.5s_ease-in-out_infinite_alternate]"></span>
                        <span className="w-1 h-3 bg-white animate-[soundbar_0.5s_ease-in-out_0.1s_infinite_alternate]"></span>
                        <span className="w-1 h-4 bg-white animate-[soundbar_0.5s_ease-in-out_0.2s_infinite_alternate]"></span>
                      </div>
                    ) : (
                      <Play size={18} className="ml-0.5" />
                    )}
                  </button>
                </div>
                <div className={`absolute top-2 right-2 px-1.5 py-0.5 text-xs rounded-full capitalize ${
                  track.serviceName === 'spotify'
                    ? 'service-indicator-spotify'
                    : track.serviceName === 'soundcloud'
                    ? 'service-indicator-soundcloud'
                    : 'service-indicator-deezer'
                }`}>
                  {track.serviceName}
                </div>
              </div>
              <div className="p-3">
                <h3 className="font-medium text-sm truncate">{track.title}</h3>
                <p className="text-muted-foreground text-xs truncate">{track.artist}</p>
              </div>
              <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={(e) => handleAddToQueue(track, e)}
                  className="h-6 w-6 rounded-full bg-primary/10 hover:bg-primary/20 text-primary flex items-center justify-center"
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Your Playlists</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {playlists.slice(0, 5).map((playlist) => (
            <div 
              key={playlist.id}
              className="bg-card border border-border rounded-md overflow-hidden hover:bg-card/80 transition-colors cursor-pointer group"
            >
              <div className="relative">
                <img 
                  src={playlist.coverArt || 'https://via.placeholder.com/200x200?text=Playlist'} 
                  alt={playlist.name} 
                  className="w-full aspect-square object-cover" 
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button className="h-10 w-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg">
                    <Play size={18} className="ml-0.5" />
                  </button>
                </div>
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
              </div>
              <div className="p-3">
                <h3 className="font-medium text-sm truncate">{playlist.name}</h3>
                <p className="text-muted-foreground text-xs truncate">
                  {playlist.tracks.length} tracks • {playlist.owner}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Recommended For You</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {mockData.tracks.slice(5, 11).map((track) => (
            <div 
              key={track.id}
              className="flex items-center space-x-3 p-2 rounded-md bg-card border border-border hover:bg-card/80 transition-colors cursor-pointer"
              onClick={() => handlePlayTrack(track)}
            >
              <div className="relative h-12 w-12 flex-shrink-0">
                <img 
                  src={track.coverArt} 
                  alt={track.title} 
                  className="h-12 w-12 rounded object-cover" 
                />
                <div className={`absolute -top-1 -right-1 h-4 w-4 rounded-full capitalize ${
                  track.serviceName === 'spotify'
                    ? 'service-indicator-spotify'
                    : track.serviceName === 'soundcloud'
                    ? 'service-indicator-soundcloud'
                    : 'service-indicator-deezer'
                }`}>
                </div>
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-medium text-sm truncate">{track.title}</h3>
                <p className="text-muted-foreground text-xs truncate">{track.artist}</p>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-xs text-muted-foreground">{formatTime(track.duration)}</span>
                <button 
                  onClick={(e) => handleAddToQueue(track, e)}
                  className="h-8 w-8 rounded-full hover:bg-secondary flex items-center justify-center"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

// Format time helper
const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
};

export default Home;