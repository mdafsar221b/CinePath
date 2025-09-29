

import { StatCard } from "@/components/core/StatCard";

import { Film, MonitorPlay, ListVideo, Tv2 } from "lucide-react"; 

interface StatsSectionProps {
  moviesWatchedCount: number;
  tvShowsWatchedCount: number;
  seasonsWatchedCount: number;
  episodesWatchedCount: number;
}

export const StatsSection = ({ moviesWatchedCount, tvShowsWatchedCount, seasonsWatchedCount, episodesWatchedCount }: StatsSectionProps) => {
  return (
    
    <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-16">
      
    
      <div className="grid grid-cols-2 gap-6">
        <StatCard 
          title="Movies Watched" 
          value={moviesWatchedCount} 
          icon={<Film className="h-6 w-6" />}
        />
        <StatCard 
          title="TV Shows Watched" 
          value={tvShowsWatchedCount} 
          icon={<MonitorPlay className="h-6 w-6" />}
        />
      </div>

   
      <div className="grid grid-cols-2 gap-6">
        <StatCard 
          title="Seasons Watched" 
          value={seasonsWatchedCount} 
          icon={<Tv2 className="h-6 w-6" />}
        />
        <StatCard 
          title="Episodes Watched" 
          value={episodesWatchedCount} 
          icon={<ListVideo className="h-6 w-6" />}
        />
      </div>
    </section>
  );
};