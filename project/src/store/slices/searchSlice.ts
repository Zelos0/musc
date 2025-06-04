import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Track } from './playerSlice';

export interface Artist {
  id: string;
  name: string;
  image?: string;
  serviceName: 'spotify' | 'soundcloud' | 'deezer';
}

export interface Album {
  id: string;
  title: string;
  artist: string;
  coverArt: string;
  year?: number;
  tracks: Track[];
  serviceName: 'spotify' | 'soundcloud' | 'deezer';
}

export interface SearchResults {
  tracks: Track[];
  artists: Artist[];
  albums: Album[];
  playlists: {
    id: string;
    name: string;
    coverArt?: string;
    owner: string;
    trackCount: number;
    serviceName: 'spotify' | 'soundcloud' | 'deezer';
  }[];
}

interface SearchState {
  query: string;
  results: SearchResults;
  isLoading: boolean;
  error: string | null;
  filters: {
    services: {
      spotify: boolean;
      soundcloud: boolean;
      deezer: boolean;
    };
    types: {
      tracks: boolean;
      artists: boolean;
      albums: boolean;
      playlists: boolean;
    };
  };
}

const initialState: SearchState = {
  query: '',
  results: {
    tracks: [],
    artists: [],
    albums: [],
    playlists: [],
  },
  isLoading: false,
  error: null,
  filters: {
    services: {
      spotify: true,
      soundcloud: true,
      deezer: true,
    },
    types: {
      tracks: true,
      artists: true,
      albums: true,
      playlists: true,
    },
  },
};

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setQuery: (state, action: PayloadAction<string>) => {
      state.query = action.payload;
    },
    setResults: (state, action: PayloadAction<SearchResults>) => {
      state.results = action.payload;
    },
    clearResults: (state) => {
      state.results = {
        tracks: [],
        artists: [],
        albums: [],
        playlists: [],
      };
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    toggleServiceFilter: (state, action: PayloadAction<'spotify' | 'soundcloud' | 'deezer'>) => {
      state.filters.services[action.payload] = !state.filters.services[action.payload];
    },
    toggleTypeFilter: (state, action: PayloadAction<'tracks' | 'artists' | 'albums' | 'playlists'>) => {
      state.filters.types[action.payload] = !state.filters.types[action.payload];
    },
    resetFilters: (state) => {
      state.filters = {
        services: {
          spotify: true,
          soundcloud: true,
          deezer: true,
        },
        types: {
          tracks: true,
          artists: true,
          albums: true,
          playlists: true,
        },
      };
    },
  },
});

export const {
  setQuery,
  setResults,
  clearResults,
  setLoading,
  setError,
  toggleServiceFilter,
  toggleTypeFilter,
  resetFilters,
} = searchSlice.actions;

export default searchSlice.reducer;