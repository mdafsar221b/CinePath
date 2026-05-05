import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ChartColumnBig, Clapperboard, TvMinimalPlay } from "lucide-react";

const showcaseItems = [
  {
    icon: Clapperboard,
    badge: "Movie archive",
    title: "Log films with poster-rich library views",
    copy:
      "Every movie entry should feel collectible. Posters lead, metadata supports, and the page reads like a premium catalog instead of a utility grid.",
    image: "/Screenshot 2025-10-01 004655.png",
    alt: "Movie tracking screenshot",
  },
  {
    icon: TvMinimalPlay,
    badge: "Episode tracking",
    title: "Track series progress with real structure",
    copy:
      "Season and episode tracking stays readable, visual, and fast to scan so long-running shows do not collapse into a wall of form fields.",
    image: "/episode-tracking.png",
    alt: "TV show tracking screenshot",
  },
  {
    icon: ChartColumnBig,
    badge: "Viewer insights",
    title: "Give stats and habits a proper stage",
    copy:
      "Progress, yearly totals, and personal patterns belong inside a cinematic dashboard that feels intentional, not tacked on.",
    image: "/Screenshot 2025-10-01 004837.png",
    alt: "Dashboard statistics screenshot",
  },
];

export const LoggedOutFeatureShowcase = () => (
  <section className="space-y-8">
    <div className="section-shell">
      <div className="relative z-10 space-y-4">
        <Badge>feature reel</Badge>
        <h2 className="font-display text-5xl text-primary sm:text-6xl">
          A Better-Looking Tracking Experience
        </h2>
        <p className="max-w-3xl text-sm leading-7 text-muted-foreground sm:text-base">
          The logged-out experience now previews the product like a launch page for an entertainment app: product shots, strong hierarchy, and enough atmosphere to sell the idea before sign-in.
        </p>
      </div>
    </div>

    <div className="grid gap-6 xl:grid-cols-[0.92fr_1.08fr]">
      <Card className="section-shell overflow-hidden p-0">
        <div className="relative h-full min-h-[32rem]">
          <Image
            src={showcaseItems[0].image}
            alt={showcaseItems[0].alt}
            fill
            className="object-cover object-top opacity-80"
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(4,8,16,0.2),rgba(4,8,16,0.88)_62%,rgba(4,8,16,0.98))]" />
          <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
            <Badge variant="outline">{showcaseItems[0].badge}</Badge>
            <h3 className="mt-4 font-display text-4xl text-primary sm:text-5xl">{showcaseItems[0].title}</h3>
            <p className="mt-4 max-w-lg text-sm leading-7 text-muted-foreground">{showcaseItems[0].copy}</p>
          </div>
        </div>
      </Card>

      <div className="grid gap-6">
        <div className="grid gap-6 md:grid-cols-2">
          {showcaseItems.slice(1).map(({ icon: Icon, badge, title, copy, image, alt }) => (
            <Card key={title} className="hover-lift overflow-hidden border-white/10">
              <div className="relative h-64">
                <Image src={image} alt={alt} fill className="object-cover object-top" />
                <div className="absolute inset-0 bg-gradient-to-t from-[rgba(4,8,16,0.98)] via-[rgba(4,8,16,0.32)] to-transparent" />
              </div>
              <div className="space-y-4 p-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <Badge variant="outline">{badge}</Badge>
                </div>
                <div>
                  <h3 className="text-2xl font-semibold text-white">{title}</h3>
                  <p className="mt-3 text-sm leading-7 text-muted-foreground">{copy}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <Card className="panel-card border-white/10 p-6 sm:p-7">
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <p className="text-[0.68rem] uppercase tracking-[0.24em] text-muted-foreground">Poster-led UX</p>
              <p className="mt-3 font-display text-4xl text-primary">Discovery</p>
            </div>
            <div>
              <p className="text-[0.68rem] uppercase tracking-[0.24em] text-muted-foreground">Tracking discipline</p>
              <p className="mt-3 font-display text-4xl text-primary">Audit</p>
            </div>
            <div>
              <p className="text-[0.68rem] uppercase tracking-[0.24em] text-muted-foreground">Collection atmosphere</p>
              <p className="mt-3 font-display text-4xl text-primary">CinePath</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  </section>
);
