export type CuratedCinemaSeed = {
  kind: "movie" | "tv";
  query: string;
  label: string;
};

export const curatedCinemaSeeds: CuratedCinemaSeed[] = [
  { kind: "movie", query: "Dune", label: "Epic Sci-Fi" },
  { kind: "movie", query: "Oppenheimer", label: "Prestige Drama" },
  { kind: "movie", query: "The Batman", label: "Noir Blockbuster" },
  { kind: "movie", query: "Interstellar", label: "Modern Classic" },
  { kind: "tv", query: "Breaking Bad", label: "Essential Series" },
  { kind: "tv", query: "The Last of Us", label: "Apocalyptic TV" },
  { kind: "tv", query: "Stranger Things", label: "Binge Favorite" },
  { kind: "tv", query: "The Bear", label: "Critics Pick" },
];

export const editorialSignals = [
  {
    label: "Track in context",
    title: "Your archive should feel like a library wall, not a plain list.",
    copy:
      "Posters stay visible across discovery, logging, and review, so every title keeps its identity while you audit what you watched.",
  },
  {
    label: "Audit with speed",
    title: "See queue pressure, yearly output, and series progress without digging.",
    copy:
      "The product should surface what is half-finished, what is trending, and what deserves a rewatch in a single scan.",
  },
  {
    label: "Built for TV and film",
    title: "Movies get cinematic shelves. Series get structured progress.",
    copy:
      "A real tracking app needs both poster-led discovery and disciplined episode progress, not one generic card system forced onto everything.",
  },
];
