import { Movie, TVShow, WatchlistItem } from "@/lib/types";

type LibraryItem = Movie | TVShow;

type CountRow = {
  label: string;
  value: number;
};

type TopTitle = {
  id: string;
  title: string;
  type: "movie" | "tv";
  metric: string;
  poster_path?: string | null;
  score: number;
};

const isTVShow = (item: LibraryItem): item is TVShow => "watchedEpisodeIds" in item;

const splitGenres = (value?: string) =>
  (value || "")
    .split(",")
    .map((genre) => genre.trim())
    .filter((genre) => genre && genre !== "N/A");

const pushCount = (map: Map<string, number>, key: string, amount = 1) => {
  map.set(key, (map.get(key) || 0) + amount);
};

const getYearLabel = (year?: number | string) => {
  const parsed = Number(year);
  return Number.isFinite(parsed) && parsed > 0 ? String(parsed) : "Unknown";
};

const average = (values: number[]) =>
  values.length > 0 ? Number((values.reduce((sum, value) => sum + value, 0) / values.length).toFixed(1)) : 0;

const sortCountRows = (map: Map<string, number>) =>
  Array.from(map.entries())
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => b.value - a.value || a.label.localeCompare(b.label));

export const buildViewingAnalytics = ({
  movies,
  tvShows,
  watchlist,
}: {
  movies: Movie[];
  tvShows: TVShow[];
  watchlist: WatchlistItem[];
}) => {
  const library: LibraryItem[] = [...movies, ...tvShows];
  const ratedLibrary = library.filter((item) => typeof item.myRating === "number");
  const favoriteShows = tvShows.filter((show) => show.isFavorite);

  const yearMap = new Map<string, number>();
  const genreMap = new Map<string, number>();
  const actorMap = new Map<string, number>();
  const directorMap = new Map<string, number>();
  const formatMap = new Map<string, number>();

  movies.forEach((movie) => {
    pushCount(yearMap, getYearLabel(movie.year));
    pushCount(formatMap, "Movies");

    splitGenres(movie.genre).forEach((genre) => pushCount(genreMap, genre));

    (movie.actors || "")
      .split(",")
      .map((actor) => actor.trim())
      .filter(Boolean)
      .forEach((actor) => pushCount(actorMap, actor));

    if (movie.director?.trim() && movie.director !== "N/A") {
      movie.director
        .split(",")
        .map((director) => director.trim())
        .filter(Boolean)
        .forEach((director) => pushCount(directorMap, director));
    }
  });

  tvShows.forEach((show) => {
    pushCount(formatMap, "TV Shows");
    splitGenres(show.genre).forEach((genre) => pushCount(genreMap, genre));

    (show.actors || "")
      .split(",")
      .map((actor) => actor.trim())
      .filter(Boolean)
      .forEach((actor) => pushCount(actorMap, actor));
  });

  watchlist.forEach((item) => {
    pushCount(formatMap, item.type === "movie" ? "Queued Movies" : "Queued TV");
  });

  const years = sortCountRows(yearMap);
  const genres = sortCountRows(genreMap);
  const actors = sortCountRows(actorMap);
  const directors = sortCountRows(directorMap);
  const formats = sortCountRows(formatMap);

  const topRatedTitles: TopTitle[] = ratedLibrary
    .map((item) => ({
      id: item._id,
      title: item.title,
      type: (isTVShow(item) ? "tv" : "movie") as "tv" | "movie",
      metric: `${item.myRating}/10 personal rating`,
      poster_path: item.poster_path,
      score: item.myRating || 0,
    }))
    .sort((a, b) => b.score - a.score || a.title.localeCompare(b.title))
    .slice(0, 5);

  const mostWatchedSeries: TopTitle[] = tvShows
    .map((show) => ({
      id: show._id,
      title: show.title,
      type: "tv" as const,
      metric:
        show.totalEpisodes && show.totalEpisodes > 0
          ? `${show.watchedEpisodeIds?.length || 0}/${show.totalEpisodes} episodes`
          : `${show.watchedEpisodeIds?.length || 0} episodes`,
      poster_path: show.poster_path,
      score: show.watchedEpisodeIds?.length || 0,
    }))
    .sort((a, b) => b.score - a.score || a.title.localeCompare(b.title))
    .slice(0, 5);

  const movieRatings = movies.map((movie) => movie.myRating).filter((value): value is number => typeof value === "number");
  const showRatings = tvShows.map((show) => show.myRating).filter((value): value is number => typeof value === "number");

  const preferredFormat = formats[0]?.label || "Movies";
  const topGenre = genres[0]?.label || "Unclear";
  const topActor = actors[0]?.label || "Not enough cast data";
  const topDirector = directors[0]?.label || "Not enough director data";
  const totalTrackedEntries = movies.length + tvShows.length;
  const completionHeavyShows = tvShows.filter(
    (show) => (show.totalEpisodes || 0) > 0 && (show.watchedEpisodeIds?.length || 0) / (show.totalEpisodes || 1) >= 0.7
  ).length;

  return {
    years,
    genres,
    actors,
    directors,
    formats,
    topRatedTitles,
    mostWatchedSeries,
    insights: {
      preferredFormat,
      topGenre,
      topActor,
      topDirector,
      averageMovieRating: average(movieRatings),
      averageShowRating: average(showRatings),
      favoriteShowsCount: favoriteShows.length,
      ratedEntries: ratedLibrary.length,
      totalTrackedEntries,
      completionHeavyShows,
    },
  };
};
