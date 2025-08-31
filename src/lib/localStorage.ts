import { Movie, TVShow } from "./types";

const MOVIE_KEY = "cinepath-movies";
const TV_SHOW_KEY = "cinepath-tv-shows";

export const getMovies = (): Movie[] => {
  if (typeof window === "undefined") return [];
  const movies = localStorage.getItem(MOVIE_KEY);
  return movies ? JSON.parse(movies) : [];
};

export const saveMovies = (movies: Movie[]) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(MOVIE_KEY, JSON.stringify(movies));
  }
};

export const getTVShows = (): TVShow[] => {
  if (typeof window === "undefined") return [];
  const tvShows = localStorage.getItem(TV_SHOW_KEY);
  return tvShows ? JSON.parse(tvShows) : [];
};

export const saveTVShows = (tvShows: TVShow[]) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(TV_SHOW_KEY, JSON.stringify(tvShows));
  }
};