import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { setQuery, setResults, setLoading, toggleServiceFilter, toggleTypeFilter } from '../store/slices/searchSlice';
import { setCurrentTrack, setIsPlaying, addToQueue } from '../store/slices/playerSlice';
import { Search as SearchIcon, Play, Plus, Filter } from 'lucide-react';
import mockData from '../utils/mockData';

const Search = () => {
  const dispatch = useAppDispatch();
  const { query, results, isLoading, filters } = useAppSelector(state => state.search);
  const { currentTrack, isPlaying } = useAppSelector(state => state.player);
  const [showFilters, setShowFilters] = useState(false);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    dispatch(setLoading(true));
    
    // Simulate search API call
    setTimeout(() => {
      // Filter mock results based on query and active filters
      const filteredTracks = mockData.tracks.filter(track => 
        (track.title.toLowerCase().includes(query.toLowerCase()) || 
         track.artist.toLowerCase().includes(query.toLowerCase())) &&
        filters.services[track.serviceName]
      );
      
      dispatch(setResults({
        tracks: filteredTracks,
        artists: [],
        albums: [],
        playlists: [],
      }));
      dispatch(setLoading(false));
    }, 500);
  };

  const handlePlayTrack = (track: any) => {
    if (currentTrack?.id === track.id) {
      dispatch(setIsPlaying(!isPlaying));
    } else {
      dispatch(setCurrentTrack(track));
      dispatch(setIsPlaying(true));
    }
  };

  const handleAddToQueue = (track: any, event: React.MouseEvent) => {
    event.stopPropagation();
    dispatch(addToQueue(track));
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  return (
    <div className="p-6">
      <div className="mb-6 fade-in">
        <h1 className="text-3xl font-bold mb-4">Search</h1>
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <form onSubmit={handleSearch} className="flex-1">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <SearchIcon className="h-5 w-5 text-muted-foreground" />
              </div>
              <input
                type="text"
                placeholder="Search across your music services..."
                value={query}
                onChange={e => dispatch(setQuery(e.target.value))}
                className="w-full pl-10 pr-4 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </form>
          <button
            onClick={toggleFilters}
            className="flex items-center gap-2 px-4 py-2 bg-secondary rounded-md hover:bg-secondary/80 transition-colors"
          >
            <Filter size={16} />
            <span>Filters</span>
          </button>
        </div>
        
        {showFilters && (
          <div className="mt-4 p-4 bg-card border border-border rounded-md slide-up">
            <div className="flex flex-col md:flex-row md:items-center gap-6">
              <div>
                <h3 className="text-sm font-medium mb-2">Services</h3>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => dispatch(toggleServiceFilter('spotify'))}
                    className={`px-3 py-1 text-sm rounded-full transition-colors ${
                      filters.services.spotify 
                        ? 'service-indicator-spotify' 
                        : 'bg-secondary text-secondary-foreground'
                    }`}
                  >
                    Spotify
                  </button>
                  <button
                    onClick={() => dispatch(toggleServiceFilter('soundcloud'))}
                    className={`px-3 py-1 text-sm rounded-full transition-colors ${
                      filters.services.soundcloud 
                        ? 'service-indicator-soundcloud' 
                        : 'bg-secondary text-secondary-foreground'
                    }`}
                  >
                    SoundCloud
                  </button>
                  <button
                    onClick={() => dispatch(toggleServiceFilter('deezer'))}
                    className={`px-3 py-1 text-sm rounded-full transition-colors ${
                      filters.services.deezer 
                        ? 'service-indicator-deezer' 
                        : 'bg-secondary text-secondary-foreground'
                    }`}
                  >
                    Deezer
                  </button>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium mb-2">Types</h3>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => dispatch(toggleTypeFilter('tracks'))}
                    className={`px-3 py-1 text-sm rounded-full transition-colors ${
                      filters.types.tracks 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-secondary text-secondary-foreground'
                    }`}
                  >
                    Tracks
                  </button>
                  <button
                    onClick={() => dispatch(toggleTypeFilter('artists'))}
                    className={`px-3 py-1 text-sm rounded-full transition-colors ${
                      filters.types.artists 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-secondary text-secondary-foreground'
                    }`}
                  >
                    Artists
                  </button>
                  <button
                    onClick={() => dispatch(toggleTypeFilter('albums'))}
                    className={`px-3 py-1 text-sm rounded-full transition-colors ${
                      filters.types.albums 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-secondary text-secondary-foreground'
                    }`}
                  >
                    Albums
                  </button>
                  <button
                    onClick={() => dispatch(toggleTypeFilter('playlists'))}
                    className={`px-3 py-1 text-sm rounded-full transition-colors ${
                      filters.types.playlists 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-secondary text-secondary-foreground'
                    }`}
                  >
                    Playlists
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : results.tracks.length > 0 ? (
        <div className="space-y-6 slide-up">
          <h2 className="text-xl font-semibold">Tracks</h2>
          <div className="grid grid-cols-1 gap-2">
            {results.tracks.map((track) => (
              <div 
                key={track.id}
                className="flex items-center space-x-3 p-3 rounded-md bg-card border border-border hover:bg-card/80 transition-colors cursor-pointer group"
                onClick={() => handlePlayTrack(track)}
              >
                <div className="relative">
                  <img 
                    src={track.coverArt} 
                    alt={track.title} 
                    className="h-12 w-12 rounded-md object-cover" 
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                      {currentTrack?.id === track.id && isPlaying ? (
                        <div className="w-3 h-3 flex items-center justify-center space-x-0.5">
                          <span className="w-0.5 h-3 bg-white animate-[soundbar_0.5s_ease-in-out_infinite_alternate]"></span>
                          <span className="w-0.5 h-2 bg-white animate-[soundbar_0.5s_ease-in-out_0.1s_infinite_alternate]"></span>
                          <span className="w-0.5 h-3 bg-white animate-[soundbar_0.5s_ease-in-out_0.2s_infinite_alternate]"></span>
                        </div>
                      ) : (
                        <Play size={14} className="ml-0.5" />
                      )}
                    </button>
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium truncate">{track.title}</h3>
                  <p className="text-sm text-muted-foreground truncate">{track.artist}</p>
                </div>
                <div className="flex items-center space-x-3">
                  <div className={`px-2 py-1 text-xs rounded-full capitalize ${
                    track.serviceName === 'spotify'
                      ? 'service-indicator-spotify'
                      : track.serviceName === 'soundcloud'
                      ? 'service-indicator-soundcloud'
                      : 'service-indicator-deezer'
                  }`}>
                    {track.serviceName}
                  </div>
                  <button 
                    onClick={(e) => handleAddToQueue(track, e)}
                    className="h-8 w-8 rounded-full hover:bg-secondary flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : query ? (
        <div className="text-center py-12 text-muted-foreground">
          <p>No results found for "{query}"</p>
          <p className="text-sm mt-2">Try adjusting your search term or filters</p>
        </div>
      ) : (
        <div className="text-center py-12 text-muted-foreground">
          <SearchIcon className="h-12 w-12 mx-auto mb-4 opacity-20" />
          <p>Search for songs, artists, albums, or playlists</p>
          <p className="text-sm mt-2">Unified search across all your connected music services</p>
        </div>
      )}
    </div>
  );
};

export default Search;