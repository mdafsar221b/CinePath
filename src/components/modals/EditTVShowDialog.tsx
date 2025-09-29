
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
import { useState, useEffect } from "react";
import { TVShow, WatchedSeason } from "@/lib/types";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2 } from "lucide-react"; 

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
  const [newSeasonNumber, setNewSeasonNumber] = useState<number | null>(null);
  const [newEpisodeCount, setNewEpisodeCount] = useState<number | null>(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [loadingSeason, setLoadingSeason] = useState(false);

  useEffect(() => {
    if (show) {
     
      setMyRating(show.myRating || null);
      setPersonalNotes(show.personalNotes || "");
      setIsFavorite(show.isFavorite || false);
      
      setNewSeasonNumber(null);
      setNewEpisodeCount(null);
    }
  }, [show, open]); 

  
  const getTotalEpisodes = (seasons: WatchedSeason[]) => {
    return seasons.reduce((sum, season) => sum + (season.watchedEpisodes?.length || 0), 0);
  };


  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!show) return;

    setLoadingDetails(true);
    const updatedShowPayload = {
      _id: show._id,
      myRating,
      personalNotes,
      isFavorite,
    };

    try {
      const res = await fetch("/api/tv-shows", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedShowPayload),
      });

      if (!res.ok) throw new Error("Failed to update TV show details.");

      
      onEditTVShow({
        ...show,
        ...updatedShowPayload,
      } as TVShow);
      
      onOpenChange(false); 
    } catch (error) {
      console.error("Error updating TV show details:", error);
    } finally {
      setLoadingDetails(false);
    }
  };

  const handleAddSeason = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!show || !newSeasonNumber || newEpisodeCount === null) return;
    if (newSeasonNumber < 1 || newEpisodeCount < 1) return;


    
    const existingSeason = show.seasonsWatched.find(s => s.season === newSeasonNumber);
    if (existingSeason) {
        alert(`Season ${newSeasonNumber} is already tracked. Please use an update feature if you need to modify its episodes (currently not supported).`);
        return;
    }


    setLoadingSeason(true);

    const newWatchedSeason: WatchedSeason = {
        season: newSeasonNumber,
       
        watchedEpisodes: Array.from({ length: newEpisodeCount }, (_, i) => i + 1)
    };

    try {
        const res = await fetch("/api/tv-shows", {
            method: "POST", 
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                title: show.title,
                seasonsWatched: [newWatchedSeason],
            }),
        });

        if (!res.ok) throw new Error("Failed to add new season.");
        
       
        const updatedSeasons = [...(show.seasonsWatched || []), newWatchedSeason].sort((a, b) => a.season - b.season);

        onEditTVShow({
          ...show,
          seasonsWatched: updatedSeasons
        });
        
       
        setNewSeasonNumber(null);
        setNewEpisodeCount(null);
    } catch (error) {
        console.error("Error adding new season:", error);
    } finally {
        setLoadingSeason(false);
    }
  };


  if (!show) return null;
  
  const totalEpisodes = getTotalEpisodes(show.seasonsWatched);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
    
      <DialogContent className="glass-card border-border/50 text-foreground max-w-lg sm:max-w-xl md:max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Edit {show.title}</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Update your personal details for this TV show and track seasons.
          </DialogDescription>
        </DialogHeader>

       
        <form onSubmit={handleEdit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="myRating" className="text-sm font-medium">My Rating (1-10)</Label>
            <Input
              id="myRating"
              type="number"
              value={myRating ?? ""}
              onChange={(e) => setMyRating(Number(e.target.value))}
              className="glass-card border-border/50 rounded-xl"
              min="1"
              max="10"
            />
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
          <div className="space-y-2">
            <h4 className="text-sm font-semibold">Watched Seasons:</h4>
            <div className="flex flex-wrap gap-2">
               
                {show.seasonsWatched.sort((a, b) => a.season - b.season).map(season => (
                    <Badge key={season.season} variant="outline" className="text-sm bg-primary/10 text-primary border-primary/20">
                        S{season.season}: {season.watchedEpisodes?.length || 0} Episodes
                    </Badge>
                ))}
                {show.seasonsWatched.length === 0 && <p className="text-muted-foreground text-sm">No seasons tracked yet.</p>}
            </div>
            <p className="text-sm text-muted-foreground mt-2">Total Watched: {show.seasonsWatched.length} Seasons, {totalEpisodes} Episodes</p>
          </div>
          <div className="flex gap-3 pt-4">
            <Button type="submit" className="flex-1 rounded-xl" disabled={loadingDetails}>
              {loadingDetails ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</> : "Save Personal Details"}
            </Button>
          </div>
        </form>

       
        <div className="mt-4 border-t border-border/50 pt-4">
            <h4 className="text-xl font-semibold mb-4">Add New Season</h4>
            <form onSubmit={handleAddSeason} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="newSeasonNumber" className="text-sm font-medium">Season *</Label>
                        <Input
                            id="newSeasonNumber"
                            type="number"
                            value={newSeasonNumber ?? ""}
                            onChange={(e) => setNewSeasonNumber(Number(e.target.value))}
                            className="glass-card border-border/50 rounded-xl"
                            min="1"
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="newEpisodeCount" className="text-sm font-medium">Episodes *</Label>
                        <Input
                            id="newEpisodeCount"
                            type="number"
                            value={newEpisodeCount ?? ""}
                            onChange={(e) => setNewEpisodeCount(Number(e.target.value))}
                            className="glass-card border-border/50 rounded-xl"
                            min="1"
                            required
                        />
                    </div>
                </div>
                <Button 
                    type="submit" 
                    className="w-full rounded-xl" 
                    disabled={loadingSeason || !newSeasonNumber || newEpisodeCount === null}
                >
                    {loadingSeason ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Adding Season...</> : "Add Season"}
                </Button>
            </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};