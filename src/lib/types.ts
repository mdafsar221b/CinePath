export type NewMovie = {
  title: string;
  year: number;
  poster_path?: string | null;
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
};