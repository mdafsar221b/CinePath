"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SearchInput } from "@/components/core/SearchInput";
import { LoginDialog } from "@/components/auth/LoginDialog";
import { SearchResult, TmdbDetailedContent } from "@/lib/types";
import { Eye, Flame, Play, Plus, Search, Sparkles, Star } from "lucide-react";
import heroPosterStack from "@/app/hero-img.png";
import { curatedCinemaSeeds } from "@/lib/cinema-curation";

interface HeroSectionProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  setSearchResults: (value: SearchResult[]) => void;
  searchResults: SearchResult[];
  loading: boolean;
  addingToWatchlist: string | null;
  onSearchSubmit: (e: React.FormEvent) => void;
  onAddMovie: (movie: any) => void;
  onAddTVShow: (id: string, title: string, poster_path: string | null) => void;
  onSelectContent: (result: SearchResult) => void;
  onAddToWatchlist: (item: SearchResult) => Promise<void>;
  isLoggedIn: boolean;
}

const fallbackHighlight = {
  title: "Build a personal cinema command center",
  subtitle: "Track what you love, discover what is trending, and give your collection the presentation it deserves.",
};

export const HeroSection = ({
  searchTerm,
  setSearchTerm,
  setSearchResults,
  searchResults,
  loading,
  addingToWatchlist,
  onSearchSubmit,
  onSelectContent,
  onAddToWatchlist,
  isLoggedIn,
}: HeroSectionProps) => {
  const { data: session } = useSession();
  const [cinemaFeed, setCinemaFeed] = useState<TmdbDetailedContent[]>([]);
  const [curatedPosters, setCuratedPosters] = useState<SearchResult[]>([]);

  const rawName = session?.user?.name || session?.user?.email || "Viewer";
  const firstName = rawName.split(" ")[0].split("@")[0];

  useEffect(() => {
    const loadCinemaFeed = async () => {
      try {
        const response = await fetch("/api/tmdb/trending");
        if (!response.ok) return;
        const data = (await response.json()) as TmdbDetailedContent[];
        setCinemaFeed(data.filter((item) => item.poster_path));
      } catch (error) {
        console.error("Failed to load hero cinema feed:", error);
      }
    };

    loadCinemaFeed();
  }, []);

  useEffect(() => {
    const loadCuratedPosters = async () => {
      try {
        const responses = await Promise.all(
          curatedCinemaSeeds.map(async (seed) => {
            const route = seed.kind === "movie" ? "/api/search/movies" : "/api/search/tv-shows";
            const response = await fetch(`${route}?query=${encodeURIComponent(seed.query)}`);
            if (!response.ok) return null;
            const results = (await response.json()) as SearchResult[];
            const firstPoster = results.find((item) => item.poster_path);
            return firstPoster ? { ...firstPoster, title: seed.query } : null;
          })
        );

        setCuratedPosters(responses.filter(Boolean) as SearchResult[]);
      } catch (error) {
        console.error("Failed to load curated posters:", error);
      }
    };

    loadCuratedPosters();
  }, []);

  const spotlight = cinemaFeed[0];
  const posterWall = useMemo(
    () => (cinemaFeed.length > 0 ? cinemaFeed.slice(0, 8) : curatedPosters.slice(0, 8)),
    [cinemaFeed, curatedPosters]
  );
  const posterRail = useMemo(
    () => (curatedPosters.length > 0 ? curatedPosters : posterWall.map((item) => ({
      id: item.id,
      title: item.title,
      year: "N/A",
      poster_path: item.poster_path,
      type: item.type,
    })) as SearchResult[]),
    [curatedPosters, posterWall]
  );

  const handleClearResults = () => {
    setSearchTerm("");
    setSearchResults([]);
  };

  const handleSelectContentAndClear = (result: SearchResult) => {
    onSelectContent(result);
    handleClearResults();
  };

  const handleAddToWatchlistAndFeedback = async (result: SearchResult) => {
    try {
      await onAddToWatchlist(result);
    } finally {
      handleClearResults();
    }
  };

  return (
    <section className="relative overflow-hidden">
      {posterWall.length > 0 ? (
        <div className="pointer-events-none absolute inset-0 hidden overflow-hidden xl:block">
          <div className="absolute inset-y-0 right-[-8%] flex gap-4 opacity-25">
            {posterWall.slice(0, 5).map((item, index) =>
              item.poster_path ? (
                <div
                  key={item.id}
                  className="relative w-[12rem] overflow-hidden rounded-[1.5rem] border border-white/10 poster-shadow"
                  style={{
                    marginTop: `${index % 2 === 0 ? 24 : 86}px`,
                    transform: `rotate(${index % 2 === 0 ? -6 : 6}deg)`,
                  }}
                >
                  <Image
                    src={item.poster_path}
                    alt={`${item.title} poster`}
                    width={320}
                    height={480}
                    className="h-[24rem] w-full object-cover"
                  />
                </div>
              ) : null
            )}
          </div>
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(5,8,16,1),rgba(5,8,16,0.84),rgba(5,8,16,0.92))]" />
        </div>
      ) : null}

      {spotlight?.backdrop_path ? (
        <div className="absolute inset-0">
          <Image
            src={spotlight.backdrop_path}
            alt={`${spotlight.title} backdrop`}
            fill
            priority
            className="object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(4,8,16,0.96),rgba(4,8,16,0.68),rgba(4,8,16,0.95))]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,195,74,0.18),transparent_32%)]" />
        </div>
      ) : null}

      <div className="container relative mx-auto px-4 pb-20 pt-10 md:px-8 md:pb-28 md:pt-16">
        <div className="story-grid items-center gap-y-10">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="col-span-12 xl:col-span-7"
          >
            <div className="section-shell">
              <div className="relative z-10 space-y-6">
                <div className="flex flex-wrap items-center gap-3">
                  <Badge>
                    <Flame className="mr-1 h-3.5 w-3.5" />
                    cinematic tracking
                  </Badge>
                  <Badge variant="outline">
                    <Sparkles className="mr-1 h-3.5 w-3.5" />
                    production-grade discovery
                  </Badge>
                </div>

                <div className="space-y-4">
                  <h1 className="font-display text-[3.5rem] uppercase leading-[0.88] text-primary sm:text-[4.75rem] lg:text-[6.5rem]">
                    {isLoggedIn ? `Welcome Back, ${firstName}` : "Your Watchlist Deserves A Better Stage"}
                  </h1>
                  <p className="max-w-2xl text-base leading-8 text-muted-foreground sm:text-lg">
                    {isLoggedIn
                      ? "Search fast, add instantly, and run your collection like a real streaming command center with posters, progress, ratings, and discovery in one place."
                      : "CinePath is built to feel like a modern entertainment product, not a spreadsheet with cards. Discover trending titles, track what you finish, and keep every poster in play."}
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="glass-card rounded-[1.5rem] p-4">
                    <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Live Discovery</p>
                    <p className="mt-2 font-display text-4xl text-primary">{cinemaFeed.length || 20}+</p>
                    <p className="text-sm text-muted-foreground">Trending and popular picks ready to explore.</p>
                  </div>
                  <div className="glass-card rounded-[1.5rem] p-4">
                    <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Poster-First</p>
                    <p className="mt-2 font-display text-4xl text-primary">HD</p>
                    <p className="text-sm text-muted-foreground">Backdrops, posters, and immersive surfaces across the app.</p>
                  </div>
                  <div className="glass-card rounded-[1.5rem] p-4">
                    <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Personal Library</p>
                    <p className="mt-2 font-display text-4xl text-primary">1</p>
                    <p className="text-sm text-muted-foreground">One place for movies, TV progress, and your next queue.</p>
                  </div>
                </div>

                {posterRail.length > 0 ? (
                  <div className="rounded-[1.45rem] border border-white/8 bg-black/18 p-3">
                    <div className="mb-3 flex items-center gap-2 text-xs uppercase tracking-[0.24em] text-muted-foreground">
                      <Play className="h-3.5 w-3.5 text-primary" />
                      Featured poster lineup
                    </div>
                    <div className="grid grid-cols-4 gap-3 lg:grid-cols-5">
                      {posterRail.slice(0, 5).map((item, index) => (
                        <div
                          key={`${item.id}-${index}`}
                          className={`relative overflow-hidden rounded-[1rem] border border-white/8 bg-black/25 ${index === 4 ? "hidden lg:block" : ""}`}
                        >
                          {item.poster_path ? (
                            <Image
                              src={item.poster_path}
                              alt={`${item.title} poster`}
                              width={240}
                              height={360}
                              className="h-[8.8rem] w-full object-cover"
                            />
                          ) : (
                            <Image
                              src={heroPosterStack}
                              alt="Cinematic poster collage"
                              className="h-[8.8rem] w-full object-cover"
                            />
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-[rgba(5,8,16,0.95)] to-transparent" />
                          <div className="absolute inset-x-0 bottom-0 p-2.5">
                            <p className="line-clamp-1 text-[0.65rem] uppercase tracking-[0.18em] text-white/70">
                              {item.type === "movie" ? "movie" : "series"}
                            </p>
                            <p className="line-clamp-1 text-sm font-semibold text-white">{item.title}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null}

                {isLoggedIn ? (
                  <div className="space-y-4">
                    <SearchInput
                      searchTerm={searchTerm}
                      onSearchChange={setSearchTerm}
                      onSearchSubmit={onSearchSubmit}
                      onClear={handleClearResults}
                      loading={loading}
                    />

                    {searchResults.length > 0 ? (
                      <div className="cinema-scrollbar glass-card max-h-[34rem] space-y-4 overflow-y-auto rounded-[1.5rem] p-4 sm:p-5">
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Search results</p>
                            <h3 className="font-display text-3xl text-primary">Pick Your Next Entry</h3>
                          </div>
                          <Button variant="outline" size="sm" onClick={handleClearResults}>
                            Clear
                          </Button>
                        </div>

                        <div className="space-y-3">
                          {searchResults.map((result) => (
                            <div
                              key={result.id}
                              className="group rounded-[1.5rem] border border-white/8 bg-white/5 p-3 transition-all duration-300 hover:border-primary/20 hover:bg-white/8"
                            >
                              <div className="flex gap-4">
                                <div className="relative h-[9.5rem] w-[6.5rem] flex-shrink-0 overflow-hidden rounded-[1.15rem] poster-shadow">
                                  {result.poster_path ? (
                                    <Image
                                      src={result.poster_path}
                                      alt={`${result.title} poster`}
                                      fill
                                      sizes="104px"
                                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                                    />
                                  ) : (
                                    <div className="flex h-full items-center justify-center bg-white/6 text-center text-xs text-muted-foreground">
                                      No Poster
                                    </div>
                                  )}
                                </div>

                                <div className="min-w-0 flex-1 space-y-3">
                                  <div className="flex flex-wrap items-center gap-2">
                                    <Badge variant="outline">{result.year}</Badge>
                                    <Badge className={result.type === "movie" ? "bg-sky-500/15 text-sky-300 border-sky-400/20" : "bg-fuchsia-500/15 text-fuchsia-300 border-fuchsia-400/20"}>
                                      {result.type === "movie" ? "movie" : "tv show"}
                                    </Badge>
                                    {result.imdbRating && result.imdbRating !== "N/A" ? (
                                      <Badge variant="outline">
                                        <Star className="mr-1 h-3 w-3 fill-current" />
                                        {result.imdbRating}
                                      </Badge>
                                    ) : null}
                                  </div>

                                  <div>
                                    <h4 className="text-xl font-semibold text-foreground">{result.title}</h4>
                                    {result.plot ? (
                                      <p className="mt-2 line-clamp-3 text-sm leading-6 text-muted-foreground">
                                        {result.plot}
                                      </p>
                                    ) : null}
                                  </div>

                                  <div className="flex flex-wrap gap-2">
                                    <Button variant="outline" size="sm" onClick={() => handleSelectContentAndClear(result)}>
                                      <Eye className="mr-2 h-4 w-4" />
                                      Details
                                    </Button>
                                    <Button
                                      size="sm"
                                      onClick={() => handleAddToWatchlistAndFeedback(result)}
                                      disabled={addingToWatchlist === result.id}
                                    >
                                      <Plus className="mr-2 h-4 w-4" />
                                      {addingToWatchlist === result.id ? "Adding..." : "Add to Watchlist"}
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : null}
                  </div>
                ) : (
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                    <LoginDialog />
                    <div className="flex items-center gap-3 rounded-2xl border border-white/8 bg-white/6 px-4 py-3 text-sm text-muted-foreground">
                      <Search className="h-4 w-4 text-primary" />
                      Sign in to search, track, rate, and build your own screen-ready archive.
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.12 }}
            className="col-span-12 xl:col-span-5"
          >
            <div className="section-shell p-5 sm:p-6">
              <div className="relative z-10 space-y-5">
                <div>
                  <p className="text-xs uppercase tracking-[0.26em] text-muted-foreground">Now spotlighting</p>
                  <h2 className="font-display text-4xl text-primary">
                    {spotlight?.title || fallbackHighlight.title}
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {spotlight?.overview || fallbackHighlight.subtitle}
                  </p>
                </div>

                {posterWall.length > 0 ? (
                  <>
                    <div className="grid grid-cols-6 gap-3">
                      <div className="relative col-span-4 overflow-hidden rounded-[1.5rem] border border-white/10 bg-black/20">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,193,86,0.2),transparent_46%)]" />
                        {posterWall[0]?.poster_path ? (
                          <Image
                            src={posterWall[0].poster_path}
                            alt={`${posterWall[0].title} poster`}
                            width={600}
                            height={900}
                            className="h-[25rem] w-full object-cover object-top"
                          />
                        ) : (
                          <Image
                            src={heroPosterStack}
                            alt="Cinematic poster collage"
                            className="h-[25rem] w-full object-cover"
                            priority
                          />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-[rgba(5,8,16,0.98)] via-[rgba(5,8,16,0.18)] to-transparent" />
                        <div className="absolute inset-x-0 bottom-0 p-4">
                          <Badge variant="outline">Featured pick</Badge>
                          <p className="mt-3 text-2xl font-semibold text-white">
                            {posterWall[0]?.title || "Editorial Spotlight"}
                          </p>
                          <p className="mt-1 text-sm text-white/70">
                            {spotlight?.year || "Streaming now"}
                          </p>
                        </div>
                      </div>

                      <div className="col-span-2 space-y-3">
                        {posterWall.slice(1, 4).map((item, index) => (
                          <div
                            key={item.id}
                            className={`
                              relative overflow-hidden rounded-[1.2rem] border border-white/10 bg-black/20
                              ${index === 0 ? "translate-x-2" : ""}
                              ${index === 1 ? "-translate-x-1" : ""}
                            `}
                          >
                            {item.poster_path ? (
                              <Image
                                src={item.poster_path}
                                alt={`${item.title} poster`}
                                width={300}
                                height={450}
                                className="h-[7.8rem] w-full object-cover"
                              />
                            ) : null}
                            <div className="absolute inset-0 bg-gradient-to-t from-[rgba(5,8,16,0.95)] to-transparent" />
                            <div className="absolute inset-x-0 bottom-0 p-2">
                              <p className="line-clamp-1 text-xs font-semibold uppercase tracking-[0.16em] text-white">
                                {item.title}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="rounded-[1.4rem] border border-white/8 bg-black/15 p-3">
                      <div className="mb-3 flex items-center gap-2 text-xs uppercase tracking-[0.24em] text-muted-foreground">
                        <Play className="h-3.5 w-3.5 text-primary" />
                        Poster lane
                      </div>
                      <div className="grid grid-cols-4 gap-3">
                        {posterRail.slice(0, 4).map((item) => (
                          <div key={item.id} className="relative overflow-hidden rounded-[1rem] border border-white/8 bg-black/20">
                            {item.poster_path ? (
                              <Image
                                src={item.poster_path}
                                alt={`${item.title} poster`}
                                width={260}
                                height={390}
                                className="h-[8.5rem] w-full object-cover"
                              />
                            ) : (
                              <Image
                                src={heroPosterStack}
                                alt="Cinematic poster collage"
                                className="h-[8.5rem] w-full object-cover"
                              />
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-[rgba(5,8,16,0.95)] to-transparent" />
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="glass-card overflow-hidden rounded-[1.5rem] p-4">
                    <Image
                      src={heroPosterStack}
                      alt="Cinematic poster collage"
                      className="mx-auto w-full max-w-md object-contain"
                      priority
                    />
                    <p className="mt-4 text-center text-sm leading-6 text-muted-foreground">
                      Even without a live TMDb feed, the interface keeps a poster-first feel instead of falling back to empty placeholders.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
