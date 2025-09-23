
import { StatCard } from "@/components/core/StatCard";

interface StatsSectionProps {
  moviesWatchedCount: number;
  tvShowsWatchedCount: number;
  seasonsWatchedCount: number;
  episodesWatchedCount: number;
}

export const StatsSection = ({ moviesWatchedCount, tvShowsWatchedCount, seasonsWatchedCount, episodesWatchedCount }: StatsSectionProps) => {
  return (
    <section className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
      <StatCard title="Movies Watched" value={moviesWatchedCount} />
      <StatCard title="TV Shows Watched" value={tvShowsWatchedCount} />
      <StatCard title="Seasons Watched" value={seasonsWatchedCount} />
      <StatCard title="Episodes Watched" value={episodesWatchedCount} />
    </section>
  );
};