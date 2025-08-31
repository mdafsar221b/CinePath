export type Movie = {
  id: string;
  title: string;
  year: number;
  addedAt: number;
};

export type WatchedSeason = {
  season: number;
  episodes: number;
};

export type TVShow = {
  id: string;
  title: string;
  seasonsWatched: WatchedSeason[];
  addedAt: number;
};