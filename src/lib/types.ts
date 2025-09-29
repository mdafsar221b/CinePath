
export type NewMovie = {
  title: string;
  year: number;
  poster_path?: string | null;
  genre?: string;
  plot?: string;
  rating?: string;
  actors?: string;
  director?: string;
  imdbRating?: string;
};

export type NewTVShow = {
  title: string;
  poster_path?: string | null;
  seasonsWatched: WatchedSeason[];
};


export type SearchResult = {
  id: string;
  title: string;
  year: string;
  poster_path: string | null;
  type: 'movie' | 'tv';
  genre?: string;
  plot?: string;
  rating?: string;
  actors?: string;
  director?: string;
  imdbRating?: string;
}

export type Movie = {
  _id: string;
  id?: string;
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

export type WatchedSeason = {
  season: number;
  watchedEpisodes: number[]|null;
};

export type TVShow = {
  _id: string;
  id?: string;
  title: string;
  seasonsWatched: WatchedSeason[];
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
  id: string;
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


export type WatchlistItem = {
  _id: string;
  id: string;
  title: string;
  year?: string;
  poster_path?: string | null;
  type: 'movie' | 'tv';
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