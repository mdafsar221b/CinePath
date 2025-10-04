"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect, useMemo } from "react";
// IMPORTED TVShowCategory
import { TVShow, TVShowCategory } from "@/lib/types"; 
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, ChevronDown, ChevronUp, Heart } from "lucide-react"; 
import { cn } from "@/lib/utils"; 
import toast from "react-hot-toast";
import { // ADDED
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"; 

// NEW CONSTANT
const TV_SHOW_CATEGORIES: TVShowCategory[] = ['Regular Series', 'Miniseries', 'Hindi Tv shows']; 

// NOTE: Since Collapsible is not provided as a separate UI component,
// this custom wrapper is used to provide the required functionality.
const CollapsibleWrapper = ({ title, children, defaultOpen = false, totalEpisodes, watchedEpisodes }: { title: string, children: React.ReactNode, defaultOpen?: boolean, totalEpisodes: number, watchedEpisodes: number }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);
    const progress = totalEpisodes > 0 ? `${watchedEpisodes}/${totalEpisodes} Episodes` : 'Loading...';
    return (
        <div className="border border-border/50 rounded-xl glass-card">
            <div 
                className="flex justify-between items-center p-4 cursor-pointer hover:bg-muted/10 transition-colors rounded-t-xl"
                onClick={() => setIsOpen(!isOpen)}
            >
                <h4 className="font-semibold text-lg flex items-center gap-2">
                    {title} 
                    <Badge variant="outline" className="text-xs bg-muted/20 border-muted/30">{progress}</Badge>
                </h4>
                {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </div>
            {isOpen && (
                <div className="p-4 border-t border-border/50 space-y-3">
                    {children}
                </div>
            )}
        </div>
    );
};


interface SeasonDetail {
    seasonNumber: number;
    episodes: {
        id: string; // IMDb ID of the episode
        title: string;
        episodeNumber: number;
        rating: string;
        released: string;
    }[];
}

interface EditTVShowDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  show: TVShow | null;
  onEditTVShow: (updatedShow: TVShow) => void;
}

export const EditTVShowDialog = ({ open, onOpenChange, show, onEditTVShow }: EditTVShowDialogProps) => {
  const [myRating, setMyRating] = useState<number | null>(null);
  const [personalNotes, setPersonalNotes] = useState("");
  const [isFavorite, setIsFavorite] = useState(false);
  const [userCategory, setUserCategory] = useState<TVShowCategory | null>(null); // NEW STATE
  const [watchedIds, setWatchedIds] = useState<string[]>([]);
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]); 
  
  const [isSaving, setIsSaving] = useState(false); // Unified saving state
  
  const [seriesStructure, setSeriesStructure] = useState<{ totalSeasons: number; seasons: SeasonDetail[] } | null>(null);
  const [loadingStructure, setLoadingStructure] = useState(false);

  // Sync local state with prop state when dialog opens or show changes
  useEffect(() => {
    if (show) {
      setMyRating(show.myRating || null);
      setPersonalNotes(show.personalNotes || "");
      setIsFavorite(show.isFavorite || false);
      // NEW: Set initial category state, defaulting to 'Regular Series'
      setUserCategory(show.userCategory || 'Regular Series'); 
      setWatchedIds(show.watchedEpisodeIds || []);
      setFavoriteIds(show.favoriteEpisodeIds || []); 
      
      // Fetch full series structure when the dialog opens
      const fetchSeriesStructure = async () => {
        if (!show.id) return; 
        setLoadingStructure(true);
        try {
            // Updated API route to get series structure
            const res = await fetch(`/api/details/series/${show.id}`);
            if (!res.ok) throw new Error("Failed to fetch series structure");
            const data = await res.json();
            setSeriesStructure(data);
        } catch (error) {
            console.error("Error fetching series structure:", error);
            setSeriesStructure(null);
            toast.error("Failed to fetch episode details for tracking.");
        } finally {
            setLoadingStructure(false);
        }
      };
      fetchSeriesStructure();
    }
  }, [show]); 
  
  const allEpisodeIds = useMemo(() => {
    if (!seriesStructure) return [];
    return seriesStructure.seasons.flatMap(s => s.episodes.map(e => e.id));
  }, [seriesStructure]);
  
  const totalEpisodes = allEpisodeIds.length;
  const totalWatched = watchedIds.length;
  
  // HANDLER: COMBINES ALL SAVING INTO ONE FUNCTION
  const handleSaveChanges = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!show || !userCategory) return;

    setIsSaving(true);
    
    // 1. Calculate Episode/Season Counts
    const totalEpisodesPayload = seriesStructure ? seriesStructure.seasons.flatMap(s => s.episodes).length : show.totalEpisodes;
    
    // 2. Count how many seasons have at least one watched episode
    const trackedSeasonCount = seriesStructure 
        ? seriesStructure.seasons.filter(season => 
            season.episodes.some(episode => watchedIds.includes(episode.id))
          ).length
        : 0;

    // 3. Combine ALL fields into one payload
    const updatedShowPayload = {
      _id: show._id,
      myRating,
      personalNotes,
      isFavorite,
      userCategory, // ADDED
      watchedEpisodeIds: watchedIds, 
      favoriteEpisodeIds: favoriteIds, 
      totalEpisodes: totalEpisodesPayload, 
      trackedSeasonCount: trackedSeasonCount,
    };

    try {
      const res = await fetch("/api/tv-shows", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedShowPayload),
      });

      if (!res.ok) throw new Error("Failed to update TV show details.");

      // 4. Update the parent state immediately
      const updatedShow = {
        ...show,
        ...updatedShowPayload, 
      } as TVShow;
      onEditTVShow(updatedShow);
      
      toast.success("All changes saved!");
      onOpenChange(false); // Close dialog on success
      
    } catch (error) {
      console.error("Error saving TV show changes:", error);
      toast.error("Failed to save changes.");
    } finally {
      setIsSaving(false);
    }
  };


  const handleEpisodeCheck = (episodeId: string, checked: boolean) => {
    setWatchedIds(prev => {
        if (checked) {
            // Add if not present
            return Array.from(new Set([...prev, episodeId]));
        } else {
            // Remove if present
            return prev.filter(id => id !== episodeId);
        }
    });
  };
  
  // Handler for marking an episode as favorite
  const handleFavoriteCheck = (episodeId: string, checked: boolean) => {
    setFavoriteIds(prev => {
        if (checked) {
            return Array.from(new Set([...prev, episodeId]));
        } else {
            return prev.filter(id => id !== episodeId);
        }
    });
  };

  const handleSeasonCheck = (season: SeasonDetail, checked: boolean) => {
    const seasonEpisodeIds = season.episodes.map(e => e.id);
    setWatchedIds(prev => {
        let newIds = new Set(prev);
        if (checked) {
            seasonEpisodeIds.forEach(id => newIds.add(id));
        } else {
            seasonEpisodeIds.forEach(id => newIds.delete(id));
        }
        return Array.from(newIds);
    });
  };
  
  const handleMarkAllCheck = (checked: boolean) => {
    if (checked) {
      setWatchedIds(allEpisodeIds);
    } else {
      setWatchedIds([]);
    }
  };


  if (!show) return null;
  
  const totalSeasonsCount = seriesStructure?.totalSeasons || 0; 
  const allChecked = totalEpisodes > 0 && totalWatched === totalEpisodes;
  const isIndeterminate = totalWatched > 0 && totalWatched < totalEpisodes;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
    
      <DialogContent className="glass-card border-border/50 text-foreground max-w-lg sm:max-w-xl md:max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Edit {show.title}</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Update your personal details and track episode progress.
          </DialogDescription>
        </DialogHeader>

       
        {/* Personal Details Section */}
        <div className="space-y-6">
            <div className="space-y-2">
                <Label htmlFor="myRating" className="text-sm font-medium">My Rating (1-10)</Label>
                <Input
                id="myRating"
                type="number"
                value={myRating ?? ""}
                onChange={(e) => setMyRating(e.target.value === "" ? null : Number(e.target.value))}
                className="glass-card border-border/50 rounded-xl"
                min="1"
                max="10"
                />
            </div>
            
            {/* NEW: Category Selector */}
            <div className="space-y-2">
                <Label htmlFor="category-select" className="text-sm font-medium">Series Category</Label>
                <Select 
                    // Use a fallback value if userCategory is null for controlled component
                    value={userCategory || 'Regular Series'} 
                    onValueChange={(value: TVShowCategory) => setUserCategory(value)}
                >
                    <SelectTrigger className="glass-card border-border/50 rounded-xl">
                        <SelectValue placeholder="Select Category" />
                    </SelectTrigger>
                    <SelectContent>
                        {TV_SHOW_CATEGORIES.map((category) => (
                            <SelectItem key={category} value={category}>
                                {category}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            
            <div className="space-y-2">
                <Label htmlFor="personalNotes" className="text-sm font-medium">Personal Notes</Label>
                <Textarea
                id="personalNotes"
                value={personalNotes}
                onChange={(e) => setPersonalNotes(e.target.value)}
                className="glass-card border-border/50 rounded-xl"
                placeholder="Add your thoughts about the show..."
                />
            </div>
            <div className="flex items-center space-x-2">
                <Checkbox
                    id="isFavorite"
                    checked={isFavorite}
                    onCheckedChange={checked => setIsFavorite(checked === true)}
                />
                <Label
                    htmlFor="isFavorite"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                    Mark as Favorite
                </Label>
            </div>
        </div>

       
        {/* Episode Tracking Section */}
        <div className="mt-4 border-t border-border/50 pt-4">
            <h4 className="text-xl font-semibold mb-4 flex items-center gap-2">Episode Tracking</h4>
            
            {loadingStructure ? (
                <div className="text-center py-8">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
                    <p className="mt-4 text-muted-foreground">Fetching series structure...</p>
                </div>
            ) : seriesStructure && totalSeasonsCount > 0 ? (
                <>
                  <div className="flex justify-between items-center mb-4 p-4 glass-card rounded-xl border border-primary/20 bg-primary/5">
                      <div className="space-y-1">
                        <p className="text-sm font-medium">Total Progress</p>
                        <p className="text-2xl font-bold bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
                            {totalWatched} / {totalEpisodes}
                        </p>
                      </div>
                      <div className="flex flex-col items-end space-y-2">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="mark-all"
                            checked={allChecked}
                            onCheckedChange={handleMarkAllCheck}
                            disabled={totalEpisodes === 0}
                            className={cn(isIndeterminate && "data-[state=unchecked]:bg-primary")}
                          />
                          <Label htmlFor="mark-all" className="text-sm font-medium">
                            {isIndeterminate ? "Mark All Unwatched" : "Mark All Watched"}
                          </Label>
                        </div>
                      </div>
                  </div>
                  
                  <div className="space-y-3 max-h-[50vh] overflow-y-auto">
                    {seriesStructure.seasons.map(season => {
                        const seasonIds = season.episodes.map(e => e.id);
                        const watchedInSeason = seasonIds.filter(id => watchedIds.includes(id)).length;
                        const seasonAllChecked = watchedInSeason === season.episodes.length && season.episodes.length > 0;
                        
                        return (
                            <CollapsibleWrapper
                                key={season.seasonNumber}
                                title={`Season ${season.seasonNumber}`}
                                totalEpisodes={season.episodes.length}
                                watchedEpisodes={watchedInSeason}
                                defaultOpen={watchedInSeason > 0 && watchedInSeason < season.episodes.length}
                            >
                                <div className="flex justify-between items-center pb-2 border-b border-border/50 mb-3">
                                  <div className="flex items-center space-x-2">
                                    <Checkbox
                                      id={`season-${season.seasonNumber}-all`}
                                      checked={seasonAllChecked}
                                      onCheckedChange={(checked) => handleSeasonCheck(season, checked === true)}
                                      className={cn(watchedInSeason > 0 && !seasonAllChecked && "data-[state=unchecked]:bg-primary")}
                                      disabled={season.episodes.length === 0}
                                    />
                                    <Label htmlFor={`season-${season.seasonNumber}-all`} className="text-sm font-semibold">
                                      {seasonAllChecked ? "Unmark All Episodes" : "Mark All Episodes"}
                                    </Label>
                                  </div>
                                </div>
                                
                                {season.episodes.map(episode => (
                                    <div key={episode.id} className="flex items-center space-x-3 hover:bg-muted/10 p-2 rounded-lg transition-colors">
                                        <Checkbox
                                            id={episode.id}
                                            checked={watchedIds.includes(episode.id)}
                                            onCheckedChange={(checked) => handleEpisodeCheck(episode.id, checked === true)}
                                        />
                                        <Label htmlFor={episode.id} className="text-sm flex-1 cursor-pointer">
                                            E{episode.episodeNumber}: {episode.title}
                                        </Label>
                                        
                                        {/* Favorite Toggle */}
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => handleFavoriteCheck(episode.id, !favoriteIds.includes(episode.id))}
                                            className={cn(
                                                "rounded-full h-8 w-8 text-muted-foreground",
                                                favoriteIds.includes(episode.id) ? "text-red-500 hover:bg-red-500/10" : "hover:bg-muted/30"
                                            )}
                                        >
                                            <Heart className={cn("h-4 w-4", favoriteIds.includes(episode.id) && "fill-red-500")} />
                                        </Button>

                                        <Badge variant="outline" className="text-xs bg-muted/20 border-muted/30">
                                            ⭐ {episode.rating}
                                        </Badge>
                                    </div>
                                ))}
                            </CollapsibleWrapper>
                        );
                    })}
                  </div>
                </>
            ) : (
                <div className="text-center py-8">
                    <p className="text-muted-foreground">Could not fetch series information or it has no seasons.</p>
                </div>
            )}
        </div>
        
        {/* Unified Save Button in a sticky-like dialog footer style */}
        <div className="sticky bottom-0 bg-background/90 backdrop-blur-sm p-4 -mx-6 -mb-6 border-t border-border/50 rounded-b-2xl">
            <Button 
                onClick={handleSaveChanges} 
                disabled={isSaving}
                className="w-full"
            >
                {isSaving ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving Changes...</> : "Save Changes"}
            </Button>
        </div>
        
      </DialogContent>
    </Dialog>
  );
};