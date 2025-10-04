// src/lib/types.ts
export type NewMovie = {
  title: string;
  tmdbId: number; 
  imdbId?: string;
  year: number;
  poster_path?: string | null;
  genre?: string;
  plot?: string;
  rating?: string;
  actors?: string;
  director?: string;
  imdbRating?: string;
};

// --- Updated SearchResult ---
export type SearchResult = {
  tmdbId: number; 
  title: string;
  year: string;
  poster_path: string | null;
  type: 'movie' | 'tv';
  // ADDED DETAIL FIELDS FOR ENRICHMENT STATUS CHECKING
  genre?: string;
  plot?: string;
  rating?: string;
  actors?: string;
  director?: string;
  imdbRating?: string;
}

export type Movie = {
  _id: string;
  tmdbId: number; 
  imdbId?: string; 
  title: string;
  year: number;
  addedAt: number;
  poster_path?: string | null;
  genre?: string;
  plot?: string;
  rating?: string;
  actors?: string;
  director?: string;
  imdbRating?: string;
  myRating?: number; 
  personalNotes?: string; 
  userId: string; 
};

export type TVShow = {
  _id: string;
  tmdbId: number; 
  imdbId?: string; 
  title: string;
  watchedEpisodeIds: string[]; 
  favoriteEpisodeIds: string[]; 
  totalEpisodes?: number; 
  trackedSeasonCount?: number; 
  addedAt: number;
  poster_path?: string | null;
  genre?: string;
  plot?: string;
  rating?: string;
  actors?: string;
  imdbRating?: string;
  myRating?: number; 
  personalNotes?: string; 
  isFavorite?: boolean; 
  userId: string; 
  
};

export type DetailedContent = {
  tmdbId: number;
  imdbId?: string;
  title: string;
  year: number;
  poster_path: string | null;
  genre: string;
  plot: string;
  rating: string;
  actors: string;
  director?: string;
  imdbRating: string;
  type: 'movie' | 'tv';
};

// --- Updated WatchlistItem ---
export type WatchlistItem = {
  _id: string;
  tmdbId: number;
  imdbId?: string;
  title: string;
  year?: string;
  poster_path?: string | null;
  type: 'movie' | 'tv';
  // ADDED DETAIL FIELDS FOR ENRICHMENT STATUS CHECKING
  genre?: string;
  plot?: string;
  rating?: string;
  actors?: string;
  director?: string;
  imdbRating?: string;
  addedAt: Date;
  userId: string; 
};

export type SortOption =
  | "addedAt_desc"
  | "addedAt_asc"
  | "title_asc"
  | "title_desc"
  | "imdbRating_desc"
  | "imdbRating_asc"
  | "year_desc"
  | "year_asc";