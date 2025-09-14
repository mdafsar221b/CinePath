export type NewMovie = {
  title: string;
  year: number;
  poster_path?: string | null;
  imdbID?: string;
  genre?: string;
  imdbRating?: string;
};

export type NewTVShow = {
  title: string;
  poster_path?: string | null;
  seasonsWatched: WatchedSeason[];
  imdbID?: string;
  genre?: string;
  imdbRating?: string;
};

export type Movie = {
  _id: string;
  imdbID?: string;
  title: string;
  year: number;
  addedAt: number;
  poster_path?: string | null;
  genre?: string;
  imdbRating?: string;
};

export type WatchedSeason = {
  season: number;
  episodes: number;
};

export type TVShow = {
  _id: string;
  imdbID?: string;
  title: string;
  seasonsWatched: WatchedSeason[];
  addedAt: number;
  poster_path?: string | null;
  genre?: string;
  imdbRating?: string;
};