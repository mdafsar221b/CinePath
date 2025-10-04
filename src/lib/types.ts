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

export type TrendingContent = SearchResult;

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


export type WatchedEpisode = {
  id: string; 
  title: string;
  episode: string;
  rating: string;
  released: string;
};

export type OMDBSingleSeason = {
  Season: string;
  Episodes: WatchedEpisode[];
};

export type OMDBSummary = {
  totalSeasons: string;
  imdbID: string;
};

export type TVShow = {
  _id: string;
  id: string; 
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