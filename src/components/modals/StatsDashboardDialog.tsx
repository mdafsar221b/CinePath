

"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart3, Film, MonitorPlay, Tv2, ListVideo, Calendar } from "lucide-react";
import { Movie } from "@/lib/types";
import React from "react";
import { useSession } from "next-auth/react"; 

interface StatsDashboardDialogProps {
  movies: Movie[];
  moviesByYear: Record<string, number>;
  totalEpisodesWatched: number; 
  totalTVShowsTracked: number; 
  totalSeasonsTracked: number; // NEW PROP
}

export const StatsDashboardDialog = ({ movies, moviesByYear, totalEpisodesWatched, totalTVShowsTracked, totalSeasonsTracked }: StatsDashboardDialogProps) => {
  
  const { data: session } = useSession();
  const rawName = session?.user?.name || session?.user?.email || "Viewer";
  const firstName = rawName.split(' ')[0].split('@')[0];

  const moviesWatchedCount = movies.length;
  const tvShowsTrackedCount = totalTVShowsTracked;
  const seasonsWatchedCount = totalSeasonsTracked; // Corrected field
  const episodesWatchedCount = totalEpisodesWatched;
  
  const sortedYears = Object.entries(moviesByYear).sort(([yearA], [yearB]) => Number(yearB) - Number(yearA));

  
  const StatCard = ({ title, value, icon }: { title: string, value: number | string, icon: React.ReactNode }) => (
   
    <Card className="glass-card rounded-xl p-3 sm:p-4 flex flex-col justify-between h-full hover:bg-muted/20 transition-colors"> 
      <CardHeader className="p-0 pb-1 flex-row items-center justify-between space-y-0">
       
        <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <div className="text-primary/70">{icon}</div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="text-2xl sm:text-3xl font-bold bg-gradient-to-br from-foreground to-primary bg-clip-text text-transparent">
          {value}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="icon" 
          className="glass-card hover:bg-muted/20 transition-all duration-300 rounded-xl"
          aria-label="View Dashboard Statistics"
        >
          <BarChart3 className="w-5 h-5" />
        </Button>
      </DialogTrigger>
      
      <DialogContent className="glass-card border-border/50 text-foreground max-w-lg sm:max-w-xl md:max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl">
        <DialogHeader>
         
          <DialogTitle className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent whitespace-normal">
            {firstName}'s Viewing Dashboard
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            A comprehensive breakdown of your tracked content and progress.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-8 py-2">
          
         
          <div>
            <h3 className="text-lg sm:text-xl font-semibold mb-4 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-primary" />
                Overall Statistics
            </h3>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
              <StatCard title="Movies Watched" value={moviesWatchedCount} icon={<Film className="h-4 w-4 sm:h-5 sm:w-5" />} />
              {/* FIX: Renamed TV Shows card title */}
              <StatCard title="TV Shows Tracked" value={tvShowsTrackedCount} icon={<MonitorPlay className="h-4 w-4 sm:h-5 sm:w-5" />} />
              {/* FIX: Using the more accurate Seasons Tracked count */}
              <StatCard title="Seasons Tracked" value={seasonsWatchedCount} icon={<Tv2 className="h-4 w-4 sm:h-5 sm:w-5" />} />
              <StatCard title="Episodes Watched" value={episodesWatchedCount} icon={<ListVideo className="h-4 w-4 sm:h-5 sm:w-5" />} />
            </div>
          </div>
          
         
          {sortedYears.length > 0 && (
            <div>
              <h3 className="text-lg sm:text-xl font-semibold mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                Yearly Movie Progress
              </h3>
              <div className="flex flex-wrap gap-2 sm:gap-3">
                {sortedYears.map(([year, count]) => (
                  <Badge
                    key={year}
                    className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 transition-colors px-3 py-1.5 sm:px-4 text-xs sm:text-sm font-medium cursor-default"
                  >
                    {year}: {count} Movies
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
        
      </DialogContent>
    </Dialog>
  );
};