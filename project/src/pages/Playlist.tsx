import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { 
  setCurrentPlaylist, 
  removeTrackFromPlaylist 
} from '../store/slices/playlistSlice';
import { 
  setCurrentTrack, 
  setIsPlaying, 
  setQueue 
} from '../store/slices/playerSlice';
import { 
  Play, 
  MoreHorizontal, 
  Clock, 
  Music, 
  Heart, 
  Share2, 
  Download, 
  Trash2
} from 'lucide-react';
import mockData from '../utils/mockData';

const Playlist = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const { playlists, currentPlaylist } = useAppSelector(state => state.playlists);
  const { currentTrack, isPlaying } = useAppSelector(state => state.player);
  const [dropdownTrack, setDropdownTrack] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      const playlist = playlists.find(p => p.id === id);
      if (playlist) {
        dispatch(setCurrentPlaylist(playlist));
      } else {
        // If not found in Redux, try to find it in mock data
        const mockPlaylist = mockData.playlists.find(p => p.id === id);
        if (mockPlaylist) {
          dispatch(setCurrentPlaylist(mockPlaylist));
        }
      }
    }
    
    // Cleanup
    return () => {
      dispatch(setCurrentPlaylist(null));
    };
  }, [id, playlists, dispatch]);

  if (!currentPlaylist) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const handlePlayAll = () => {
    if (currentPlaylist.tracks.length > 0) {
      const firstTrack = currentPlaylist.tracks[0];
      const remainingTracks = currentPlaylist.tracks.slice(1);
      
      dispatch(setCurrentTrack(firstTrack));
      dispatch(setQueue(remainingTracks));
      dispatch(setIsPlaying(true));
    }
  };

  const handlePlayTrack = (track: any, index: number) => {
    if (currentTrack?.id === track.id) {
      dispatch(setIsPlaying(!isPlaying));
    } else {
      dispatch(setCurrentTrack(track));
      
      // Add remaining tracks to queue
      const remainingTracks = [
        ...currentPlaylist.tracks.slice(index + 1),
        ...currentPlaylist.tracks.slice(0, index)
      ];
      
      dispatch(setQueue(remainingTracks));
      dispatch(setIsPlaying(true));
    }
  };

  const handleRemoveTrack = (trackId: string) => {
    if (currentPlaylist) {
      dispatch(removeTrackFromPlaylist({
        playlistId: currentPlaylist.id,
        trackId
      }));
    }
    setDropdownTrack(null);
  };

  const toggleDropdown = (trackId: string) => {
    if (dropdownTrack === trackId) {
      setDropdownTrack(null);
    } else {
      setDropdownTrack(trackId);
    }
  };

  // Format time helper
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="p-6 fade-in">
      <div className="flex flex-col md:flex-row md:items-end gap-6 mb-8">
        <div className="w-48 h-48 shrink-0 rounded-md overflow-hidden shadow-lg">
          <img 
            src={currentPlaylist.coverArt || 'https://via.placeholder.com/200x200?text=Playlist'} 
            alt={currentPlaylist.name} 
            className="w-full h-full object-cover" 
          />
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium">PLAYLIST</span>
            {currentPlaylist.serviceName && (
              <div className={`px-2 py-0.5 text-xs rounded-full capitalize ${
                currentPlaylist.serviceName === 'spotify'
                  ? 'service-indicator-spotify'
                  : currentPlaylist.serviceName === 'soundcloud'
                  ? 'service-indicator-soundcloud'
                  : currentPlaylist.serviceName === 'deezer'
                  ? 'service-indicator-deezer'
                  : 'bg-primary text-primary-foreground'
              }`}>
                {currentPlaylist.serviceName}
              </div>
            )}
          </div>
          <h1 className="text-4xl font-bold my-2">{currentPlaylist.name}</h1>
          {currentPlaylist.description && (
            <p className="text-muted-foreground mb-2">{currentPlaylist.description}</p>
          )}
          <div className="flex items-center space-x-1 text-sm text-muted-foreground">
            <span>{currentPlaylist.owner}</span>
            <span>•</span>
            <span>{currentPlaylist.tracks.length} tracks</span>
          </div>
        </div>
      </div>

      <div className="mb-6 flex space-x-2">
        <button
          onClick={handlePlayAll}
          disabled={currentPlaylist.tracks.length === 0}
          className="flex items-center gap-2 px-6 py-2 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Play size={18} className="ml-0.5" />
          <span>Play</span>
        </button>
        <button className="p-2 text-muted-foreground hover:text-foreground transition-colors rounded-full">
          <Heart size={18} />
        </button>
        <button className="p-2 text-muted-foreground hover:text-foreground transition-colors rounded-full">
          <Share2 size={18} />
        </button>
        <button className="p-2 text-muted-foreground hover:text-foreground transition-colors rounded-full">
          <Download size={18} />
        </button>
      </div>

      {currentPlaylist.tracks.length > 0 ? (
        <div className="bg-card border border-border rounded-md overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="py-3 px-4 text-left font-medium text-muted-foreground w-10">#</th>
                <th className="py-3 px-4 text-left font-medium text-muted-foreground">TITLE</th>
                <th className="py-3 px-4 text-left font-medium text-muted-foreground hidden md:table-cell">ALBUM</th>
                <th className="py-3 px-4 text-right font-medium text-muted-foreground">
                  <Clock size={16} />
                </th>
                <th className="py-3 px-4 w-10"></th>
              </tr>
            </thead>
            <tbody>
              {currentPlaylist.tracks.map((track, index) => (
                <tr 
                  key={`${track.id}-${index}`}
                  className="border-b border-border hover:bg-secondary/20 transition-colors"
                >
                  <td 
                    className="py-3 px-4 text-muted-foreground"
                    onClick={() => handlePlayTrack(track, index)}
                  >
                    {currentTrack?.id === track.id && isPlaying ? (
                      <div className="w-4 h-4 flex items-center justify-center space-x-0.5 mx-auto">
                        <span className="w-1 h-4 bg-primary animate-[soundbar_0.5s_ease-in-out_infinite_alternate]"></span>
                        <span className="w-1 h-3 bg-primary animate-[soundbar_0.5s_ease-in-out_0.1s_infinite_alternate]"></span>
                        <span className="w-1 h-4 bg-primary animate-[soundbar_0.5s_ease-in-out_0.2s_infinite_alternate]"></span>
                      </div>
                    ) : (
                      <span>{index + 1}</span>
                    )}
                  </td>
                  <td 
                    className="py-3 px-4"
                    onClick={() => handlePlayTrack(track, index)}
                  >
                    <div className="flex items-center space-x-3">
                      <img 
                        src={track.coverArt} 
                        alt={track.title} 
                        className="w-10 h-10 rounded object-cover"
                      />
                      <div>
                        <p className="font-medium">{track.title}</p>
                        <p className="text-muted-foreground text-sm">{track.artist}</p>
                      </div>
                      <div className={`px-1.5 py-0.5 text-xs rounded-full capitalize ${
                        track.serviceName === 'spotify'
                          ? 'service-indicator-spotify'
                          : track.serviceName === 'soundcloud'
                          ? 'service-indicator-soundcloud'
                          : 'service-indicator-deezer'
                      }`}>
                        {track.serviceName}
                      </div>
                    </div>
                  </td>
                  <td 
                    className="py-3 px-4 text-muted-foreground hidden md:table-cell"
                    onClick={() => handlePlayTrack(track, index)}
                  >
                    {track.album || '-'}
                  </td>
                  <td 
                    className="py-3 px-4 text-right text-muted-foreground"
                    onClick={() => handlePlayTrack(track, index)}
                  >
                    {formatTime(track.duration)}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="relative">
                      <button
                        onClick={() => toggleDropdown(track.id)}
                        className="text-muted-foreground hover:text-foreground transition-colors p-1"
                      >
                        <MoreHorizontal size={16} />
                      </button>
                      
                      {dropdownTrack === track.id && (
                        <div className="absolute right-0 top-8 w-48 bg-popover border border-border rounded-md shadow-lg z-10">
                          <ul className="py-1">
                            <li className="px-4 py-2 hover:bg-secondary cursor-pointer flex items-center space-x-2">
                              <Heart size={16} />
                              <span>Like</span>
                            </li>
                            <li className="px-4 py-2 hover:bg-secondary cursor-pointer flex items-center space-x-2">
                              <Share2 size={16} />
                              <span>Share</span>
                            </li>
                            <li className="px-4 py-2 hover:bg-secondary cursor-pointer flex items-center space-x-2">
                              <Download size={16} />
                              <span>Download</span>
                            </li>
                            <li 
                              className="px-4 py-2 hover:bg-destructive hover:text-destructive-foreground cursor-pointer flex items-center space-x-2"
                              onClick={() => handleRemoveTrack(track.id)}
                            >
                              <Trash2 size={16} />
                              <span>Remove from playlist</span>
                            </li>
                          </ul>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-card border border-border rounded-md p-6 text-center">
          <Music className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-30" />
          <h3 className="text-lg font-medium mb-1">This playlist is empty</h3>
          <p className="text-muted-foreground">Search for tracks to add to this playlist</p>
        </div>
      )}
    </div>
  );
};

export default Playlist;