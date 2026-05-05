"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { SearchResult } from "@/lib/types";
import { curatedCinemaSeeds, editorialSignals } from "@/lib/cinema-curation";
import { ChartNoAxesColumn, Film, Radar, Tv } from "lucide-react";

const signalIcons = [Film, Tv, Radar];

export const CinematicShowcaseSection = () => {
  const [curatedPosters, setCuratedPosters] = useState<SearchResult[]>([]);

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
        console.error("Failed to load cinematic showcase posters:", error);
      }
    };

    loadCuratedPosters();
  }, []);

  const leadPosters = useMemo(() => curatedPosters.slice(0, 5), [curatedPosters]);
  const backgroundPosters = useMemo(() => curatedPosters.slice(0, 8), [curatedPosters]);

  return (
    <section className="space-y-8 py-8 md:py-12">
      <div className="section-shell p-0">
        <div className="poster-stage">
          <div className="poster-stage__background">
            {backgroundPosters.map((item, index) =>
              item.poster_path ? (
                <div
                  key={item.id}
                  className="poster-stage__tile"
                  style={{
                    left: `${index * 12.5}%`,
                    animationDelay: `${index * 1.2}s`,
                  }}
                >
                  <Image
                    src={item.poster_path}
                    alt={`${item.title} poster`}
                    fill
                    sizes="18vw"
                    className="object-cover"
                  />
                </div>
              ) : null
            )}
          </div>

          <div className="relative z-10 grid gap-8 px-5 py-8 sm:px-8 sm:py-10 xl:grid-cols-[1.15fr_0.85fr]">
            <div className="space-y-6">
              <div className="flex flex-wrap items-center gap-3">
                <Badge>cinematic system</Badge>
                <Badge variant="outline">poster-rich landing flow</Badge>
              </div>

              <div className="max-w-3xl space-y-4">
                <h2 className="font-display text-5xl text-primary sm:text-6xl xl:text-7xl">
                  A homepage that feels alive, not assembled from default cards.
                </h2>
                <p className="text-sm leading-7 text-muted-foreground sm:text-base">
                  Posters should not live inside a few isolated cards. They should shape the atmosphere, define hierarchy, and make every screen feel closer to a streaming product than a dashboard template.
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                {editorialSignals.map((signal, index) => {
                  const Icon = signalIcons[index];

                  return (
                    <Card key={signal.title} className="panel-card border-white/10 p-5">
                      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                        <Icon className="h-5 w-5" />
                      </div>
                      <p className="text-[0.68rem] uppercase tracking-[0.24em] text-muted-foreground">
                        {signal.label}
                      </p>
                      <h3 className="mt-3 text-xl font-semibold text-white">{signal.title}</h3>
                      <p className="mt-3 text-sm leading-7 text-muted-foreground">{signal.copy}</p>
                    </Card>
                  );
                })}
              </div>
            </div>

            <div className="space-y-4">
              <Card className="panel-card overflow-hidden border-white/10">
                <div className="grid gap-3 p-4 sm:grid-cols-[1.1fr_0.9fr]">
                  <div className="relative overflow-hidden rounded-[1.4rem] border border-white/10 bg-black/20">
                    {leadPosters[0]?.poster_path ? (
                      <Image
                        src={leadPosters[0].poster_path}
                        alt={`${leadPosters[0].title} poster`}
                        width={420}
                        height={620}
                        className="h-[20rem] w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-[20rem] items-center justify-center bg-white/6 text-sm text-muted-foreground">
                        Poster loading
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-[rgba(4,8,16,0.96)] via-transparent to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 p-4">
                      <p className="text-xs uppercase tracking-[0.24em] text-white/60">Primary spotlight</p>
                      <p className="mt-2 text-2xl font-semibold text-white">
                        {leadPosters[0]?.title || "Featured title"}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-1">
                    {leadPosters.slice(1, 5).map((item) => (
                      <div
                        key={item.id}
                        className="relative overflow-hidden rounded-[1.15rem] border border-white/10 bg-black/25"
                      >
                        {item.poster_path ? (
                          <Image
                            src={item.poster_path}
                            alt={`${item.title} poster`}
                            width={260}
                            height={390}
                            className="h-[9.35rem] w-full object-cover"
                          />
                        ) : null}
                        <div className="absolute inset-0 bg-gradient-to-t from-[rgba(4,8,16,0.92)] to-transparent" />
                        <div className="absolute inset-x-0 bottom-0 p-3">
                          <p className="line-clamp-1 text-xs uppercase tracking-[0.18em] text-white/75">
                            {item.type === "movie" ? "movie" : "series"}
                          </p>
                          <p className="line-clamp-1 text-sm font-semibold text-white">{item.title}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>

              <div className="grid gap-4 md:grid-cols-3">
                <Card className="panel-card border-white/10 p-5">
                  <p className="text-[0.68rem] uppercase tracking-[0.24em] text-muted-foreground">Discovery mood</p>
                  <p className="mt-3 font-display text-4xl text-primary">Poster Walls</p>
                  <p className="mt-2 text-sm leading-7 text-muted-foreground">
                    Background rails, foreground features, and layered art instead of empty gradients.
                  </p>
                </Card>
                <Card className="panel-card border-white/10 p-5">
                  <p className="text-[0.68rem] uppercase tracking-[0.24em] text-muted-foreground">Audit focus</p>
                  <p className="mt-3 font-display text-4xl text-primary">Series Progress</p>
                  <p className="mt-2 text-sm leading-7 text-muted-foreground">
                    Movie shelves stay cinematic while TV stays structured and practical.
                  </p>
                </Card>
                <Card className="panel-card border-white/10 p-5">
                  <div className="flex items-center gap-2">
                    <ChartNoAxesColumn className="h-4 w-4 text-primary" />
                    <p className="text-[0.68rem] uppercase tracking-[0.24em] text-muted-foreground">Command view</p>
                  </div>
                  <p className="mt-3 font-display text-4xl text-primary">Review Faster</p>
                  <p className="mt-2 text-sm leading-7 text-muted-foreground">
                    Audit what was watched, what stalled, and what needs a rewatch without losing visual context.
                  </p>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
