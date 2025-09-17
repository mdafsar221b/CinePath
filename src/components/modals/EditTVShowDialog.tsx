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
import { Toggle } from "@/components/ui/toggle";
import { Checkbox } from "@/components/ui/checkbox";


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
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (show) {
      setMyRating(show.myRating || null);
      setPersonalNotes(show.personalNotes || "");
      setIsFavorite(show.isFavorite || false);
    }
  }, [show]);

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!show) return;

    setLoading(true);
    const updatedShow = {
      _id: show._id,
      myRating,
      personalNotes,
      isFavorite,
    };

    try {
      await fetch("/api/tv-shows", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedShow),
      });
      onEditTVShow(updatedShow as TVShow);
      onOpenChange(false);
    } catch (error) {
      console.error("Error updating TV show:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddSeason = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!show || !newSeasonNumber || newEpisodeCount === null) return;

    setLoading(true);

    const newWatchedSeason: WatchedSeason = {
        season: newSeasonNumber,
        watchedEpisodes: Array.from({ length: newEpisodeCount }, (_, i) => i + 1)
    };

    try {
        await fetch("/api/tv-shows", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                title: show.title,
                seasonsWatched: [newWatchedSeason],
            }),
        });

        onEditTVShow({
          ...show,
          seasonsWatched: [...(show.seasonsWatched || []), newWatchedSeason]
        });
        
        setNewSeasonNumber(null);
        setNewEpisodeCount(null);
    } catch (error) {
        console.error("Error adding new season:", error);
    } finally {
        setLoading(false);
    }
  };

  if (!show) return null;

  const totalEpisodes = show.seasonsWatched.reduce((sum, season) => sum + (season.watchedEpisodes?.length || 0), 0);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-card border-border/50 text-foreground max-w-2xl rounded-2xl">
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
              <label
                htmlFor="isFavorite"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Mark as Favorite
              </label>
            </div>
          <div className="space-y-2">
            <h4 className="text-sm font-semibold">Watched Seasons:</h4>
            <div className="flex flex-wrap gap-2">
                {show.seasonsWatched.map(season => (
                    <Badge key={season.season} variant="outline" className="text-sm">
                        S{season.season}: {season.watchedEpisodes?.length || 0} Episodes
                    </Badge>
                ))}
                {show.seasonsWatched.length === 0 && <p className="text-muted-foreground text-sm">No seasons tracked yet.</p>}
            </div>
            <p className="text-sm text-muted-foreground mt-2">Total Watched: {show.seasonsWatched.length} Seasons, {totalEpisodes} Episodes</p>
          </div>
          <div className="flex gap-3 pt-4">
            <Button type="submit" className="flex-1 rounded-xl" disabled={loading}>
              {loading ? "Saving..." : "Save Personal Details"}
            </Button>
          </div>
        </form>

        <div className="mt-4 border-t border-border/50 pt-4">
            <h4 className="text-xl font-semibold mb-2">Add New Season</h4>
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
                <Button type="submit" className="w-full rounded-xl" disabled={loading}>
                    Add Season
                </Button>
            </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};