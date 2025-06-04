import { useState, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  VolumeX, 
  Repeat, 
  Repeat1, 
  Shuffle, 
  ListMusic 
} from 'lucide-react';
import { useAppSelector, useAppDispatch } from '../../hooks/redux';
import { 
  setIsPlaying, 
  setVolume, 
  setPosition, 
  setRepeat, 
  setShuffle,
  playNext,
  playPrevious
} from '../../store/slices/playerSlice';

const Player = () => {
  const dispatch = useAppDispatch();
  const { 
    currentTrack, 
    isPlaying, 
    volume, 
    position, 
    duration, 
    repeat, 
    shuffle,
    queue
  } = useAppSelector((state) => state.player);
  
  const [showQueue, setShowQueue] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [prevVolume, setPrevVolume] = useState(1);

  // Format time in MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Handle play/pause
  const handlePlayPause = () => {
    dispatch(setIsPlaying(!isPlaying));
  };

  // Handle volume change
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    dispatch(setVolume(value));
    if (value === 0) {
      setIsMuted(true);
    } else {
      setIsMuted(false);
    }
  };

  // Handle mute toggle
  const handleMuteToggle = () => {
    if (isMuted) {
      dispatch(setVolume(prevVolume));
      setIsMuted(false);
    } else {
      setPrevVolume(volume);
      dispatch(setVolume(0));
      setIsMuted(true);
    }
  };

  // Handle seek
  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    dispatch(setPosition(value));
  };

  // Handle repeat toggle
  const handleRepeatToggle = () => {
    if (repeat === 'off') dispatch(setRepeat('all'));
    else if (repeat === 'all') dispatch(setRepeat('one'));
    else dispatch(setRepeat('off'));
  };

  // Handle shuffle toggle
  const handleShuffleToggle = () => {
    dispatch(setShuffle(!shuffle));
  };

  // Handle queue toggle
  const handleQueueToggle = () => {
    setShowQueue(!showQueue);
  };

  // Update position every second when playing
  useEffect(() => {
    let interval: number;
    if (isPlaying && currentTrack) {
      interval = window.setInterval(() => {
        const newPosition = position + 1;
        if (newPosition >= duration) {
          // End of track
          dispatch(playNext());
        } else {
          dispatch(setPosition(newPosition));
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, position, duration, dispatch]);

  // If no track is playing, render a minimized player
  if (!currentTrack) {
    return (
      <div className="fixed bottom-0 left-0 right-0 h-20 bg-card border-t border-border flex items-center justify-center p-4 backdrop-blur-md bg-opacity-95">
        <p className="text-muted-foreground">No track selected</p>
      </div>
    );
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border backdrop-blur-md bg-opacity-95">
      {showQueue && (
        <div className="border-t border-border p-4 max-h-80 overflow-y-auto">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-medium">Queue</h3>
            <button 
              onClick={handleQueueToggle}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <ListMusic size={18} />
            </button>
          </div>
          {queue.length > 0 ? (
            <ul className="space-y-2">
              {queue.map((track, index) => (
                <li key={`${track.id}-${index}`} className="flex items-center space-x-3 p-2 hover:bg-secondary rounded-md transition-colors">
                  <img src={track.coverArt} alt={track.title} className="h-10 w-10 rounded-md object-cover" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{track.title}</p>
                    <p className="text-xs text-muted-foreground truncate">{track.artist}</p>
                  </div>
                  <div className={`px-2 py-1 text-xs rounded-full capitalize ${
                    track.serviceName === 'spotify'
                      ? 'service-indicator-spotify'
                      : track.serviceName === 'soundcloud'
                      ? 'service-indicator-soundcloud'
                      : 'service-indicator-deezer'
                  }`}>
                    {track.serviceName}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted-foreground text-sm">Queue is empty</p>
          )}
        </div>
      )}

      <div className="flex flex-col md:flex-row items-center p-3 md:p-4">
        <div className="flex items-center space-x-3 w-full md:w-1/3">
          <img src={currentTrack.coverArt} alt={currentTrack.title} className="h-12 w-12 rounded-md object-cover" />
          <div className="min-w-0">
            <p className="font-medium truncate">{currentTrack.title}</p>
            <div className="flex items-center space-x-2">
              <p className="text-sm text-muted-foreground truncate">{currentTrack.artist}</p>
              <div className={`px-1.5 py-0.5 text-xs rounded-full capitalize ${
                currentTrack.serviceName === 'spotify'
                  ? 'service-indicator-spotify'
                  : currentTrack.serviceName === 'soundcloud'
                  ? 'service-indicator-soundcloud'
                  : 'service-indicator-deezer'
              }`}>
                {currentTrack.serviceName}
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col w-full md:w-1/3 space-y-2 my-3 md:my-0">
          <div className="flex items-center justify-center space-x-4">
            <button
              onClick={() => dispatch(playPrevious())}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <SkipBack size={20} />
            </button>
            <button
              onClick={handlePlayPause}
              className="h-8 w-8 flex items-center justify-center bg-primary text-primary-foreground rounded-full hover:bg-primary/80 transition-colors"
            >
              {isPlaying ? <Pause size={18} /> : <Play size={18} className="ml-0.5" />}
            </button>
            <button
              onClick={() => dispatch(playNext())}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <SkipForward size={20} />
            </button>
          </div>
          <div className="flex items-center space-x-2 w-full px-4">
            <span className="text-xs text-muted-foreground w-8 text-right">
              {formatTime(position)}
            </span>
            <input
              type="range"
              min="0"
              max={duration}
              value={position}
              onChange={handleSeek}
              className="flex-1 h-1 bg-secondary rounded-lg appearance-none cursor-pointer"
            />
            <span className="text-xs text-muted-foreground w-8">
              {formatTime(duration)}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-end space-x-3 w-full md:w-1/3">
          <button
            onClick={handleRepeatToggle}
            className={`text-muted-foreground transition-colors ${
              repeat !== 'off' ? 'text-primary' : 'hover:text-foreground'
            }`}
          >
            {repeat === 'one' ? <Repeat1 size={18} /> : <Repeat size={18} />}
          </button>
          <button
            onClick={handleShuffleToggle}
            className={`text-muted-foreground transition-colors ${
              shuffle ? 'text-primary' : 'hover:text-foreground'
            }`}
          >
            <Shuffle size={18} />
          </button>
          <button
            onClick={handleQueueToggle}
            className={`text-muted-foreground hover:text-foreground transition-colors ${
              showQueue ? 'text-primary' : ''
            }`}
          >
            <ListMusic size={18} />
          </button>
          <div className="flex items-center space-x-1 w-32">
            <button
              onClick={handleMuteToggle}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={handleVolumeChange}
              className="flex-1 h-1 bg-secondary rounded-lg appearance-none cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Player;