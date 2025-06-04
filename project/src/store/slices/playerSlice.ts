import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Track {
  id: string;
  title: string;
  artist: string;
  album?: string;
  duration: number;
  coverArt: string;
  serviceId: string;
  serviceName: 'spotify' | 'soundcloud' | 'deezer';
  streamUrl?: string;
}

interface PlayerState {
  currentTrack: Track | null;
  queue: Track[];
  isPlaying: boolean;
  volume: number;
  position: number;
  duration: number;
  repeat: 'off' | 'all' | 'one';
  shuffle: boolean;
  crossfadeSeconds: number;
}

const initialState: PlayerState = {
  currentTrack: null,
  queue: [],
  isPlaying: false,
  volume: 1,
  position: 0,
  duration: 0,
  repeat: 'off',
  shuffle: false,
  crossfadeSeconds: 0,
};

const playerSlice = createSlice({
  name: 'player',
  initialState,
  reducers: {
    setCurrentTrack: (state, action: PayloadAction<Track | null>) => {
      state.currentTrack = action.payload;
      if (action.payload) {
        state.duration = action.payload.duration;
      }
    },
    setQueue: (state, action: PayloadAction<Track[]>) => {
      state.queue = action.payload;
    },
    addToQueue: (state, action: PayloadAction<Track>) => {
      state.queue.push(action.payload);
    },
    removeFromQueue: (state, action: PayloadAction<string>) => {
      state.queue = state.queue.filter(track => track.id !== action.payload);
    },
    clearQueue: (state) => {
      state.queue = [];
    },
    setIsPlaying: (state, action: PayloadAction<boolean>) => {
      state.isPlaying = action.payload;
    },
    setVolume: (state, action: PayloadAction<number>) => {
      state.volume = action.payload;
    },
    setPosition: (state, action: PayloadAction<number>) => {
      state.position = action.payload;
    },
    setRepeat: (state, action: PayloadAction<'off' | 'all' | 'one'>) => {
      state.repeat = action.payload;
    },
    setShuffle: (state, action: PayloadAction<boolean>) => {
      state.shuffle = action.payload;
    },
    setCrossfade: (state, action: PayloadAction<number>) => {
      state.crossfadeSeconds = action.payload;
    },
    playNext: (state) => {
      if (state.queue.length > 0) {
        state.currentTrack = state.queue.shift() || null;
        state.position = 0;
      } else {
        state.isPlaying = false;
      }
    },
    playPrevious: (state) => {
      if (state.currentTrack) {
        state.queue.unshift(state.currentTrack);
      }
      if (state.queue.length > 0) {
        state.currentTrack = state.queue.shift() || null;
        state.position = 0;
      }
    },
  },
});

export const {
  setCurrentTrack,
  setQueue,
  addToQueue,
  removeFromQueue,
  clearQueue,
  setIsPlaying,
  setVolume,
  setPosition,
  setRepeat,
  setShuffle,
  setCrossfade,
  playNext,
  playPrevious,
} = playerSlice.actions;

export default playerSlice.reducer;