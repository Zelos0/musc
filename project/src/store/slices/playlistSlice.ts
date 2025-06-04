import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Track } from './playerSlice';

export interface Playlist {
  id: string;
  name: string;
  description?: string;
  coverArt?: string;
  owner: string;
  tracks: Track[];
  serviceName?: 'spotify' | 'soundcloud' | 'deezer' | 'harmonized';
  isPublic: boolean;
  isCollaborative: boolean;
  createdAt: string;
  updatedAt: string;
}

interface PlaylistState {
  playlists: Playlist[];
  currentPlaylist: Playlist | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: PlaylistState = {
  playlists: [],
  currentPlaylist: null,
  isLoading: false,
  error: null,
};

const playlistSlice = createSlice({
  name: 'playlists',
  initialState,
  reducers: {
    setPlaylists: (state, action: PayloadAction<Playlist[]>) => {
      state.playlists = action.payload;
    },
    addPlaylist: (state, action: PayloadAction<Playlist>) => {
      state.playlists.push(action.payload);
    },
    updatePlaylist: (state, action: PayloadAction<Playlist>) => {
      const index = state.playlists.findIndex(p => p.id === action.payload.id);
      if (index !== -1) {
        state.playlists[index] = action.payload;
      }
      if (state.currentPlaylist?.id === action.payload.id) {
        state.currentPlaylist = action.payload;
      }
    },
    removePlaylist: (state, action: PayloadAction<string>) => {
      state.playlists = state.playlists.filter(p => p.id !== action.payload);
      if (state.currentPlaylist?.id === action.payload) {
        state.currentPlaylist = null;
      }
    },
    setCurrentPlaylist: (state, action: PayloadAction<Playlist | null>) => {
      state.currentPlaylist = action.payload;
    },
    addTrackToPlaylist: (state, action: PayloadAction<{ playlistId: string, track: Track }>) => {
      const { playlistId, track } = action.payload;
      const playlist = state.playlists.find(p => p.id === playlistId);
      
      if (playlist) {
        playlist.tracks.push(track);
        playlist.updatedAt = new Date().toISOString();
      }
      
      if (state.currentPlaylist?.id === playlistId) {
        state.currentPlaylist.tracks.push(track);
        state.currentPlaylist.updatedAt = new Date().toISOString();
      }
    },
    removeTrackFromPlaylist: (state, action: PayloadAction<{ playlistId: string, trackId: string }>) => {
      const { playlistId, trackId } = action.payload;
      const playlist = state.playlists.find(p => p.id === playlistId);
      
      if (playlist) {
        playlist.tracks = playlist.tracks.filter(t => t.id !== trackId);
        playlist.updatedAt = new Date().toISOString();
      }
      
      if (state.currentPlaylist?.id === playlistId) {
        state.currentPlaylist.tracks = state.currentPlaylist.tracks.filter(t => t.id !== trackId);
        state.currentPlaylist.updatedAt = new Date().toISOString();
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  setPlaylists,
  addPlaylist,
  updatePlaylist,
  removePlaylist,
  setCurrentPlaylist,
  addTrackToPlaylist,
  removeTrackFromPlaylist,
  setLoading,
  setError,
} = playlistSlice.actions;

export default playlistSlice.reducer;