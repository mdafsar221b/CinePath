// src/lib/types.ts
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
};

export type WatchedSeason = {
  season: number;
  episodes: number;
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
};

export type DetailedContent = {
  id: string;
  title: string;
  year: string;
  poster_path: string | null;
  genre: string;
  plot: string;
  rating: string;
  actors: string;
  director?: string;
  imdbRating: string;
  type: 'movie' | 'tv';
};