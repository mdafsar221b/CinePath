"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { WatchedSeason } from "@/lib/types";
import { v4 as uuidv4 } from "uuid";

interface AddTVShowDialogProps {
  onAddTVShow: (title: string, season: WatchedSeason) => void;
}

export const AddTVShowDialog = ({ onAddTVShow }: AddTVShowDialogProps) => {
  const [title, setTitle] = useState("");
  const [seasonNumber, setSeasonNumber] = useState<number | null>(null);
  const [episodeCount, setEpisodeCount] = useState<number | null>(null);
  const [open, setOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title && seasonNumber && episodeCount !== null) {
      onAddTVShow(title, { season: seasonNumber, episodes: episodeCount });
      setTitle("");
      setSeasonNumber(null);
      setEpisodeCount(null);
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="text-sm font-light px-4 py-2 border-primary hover:bg-muted/50 transition-colors duration-200">
          + Add TV Show
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-card border border-border text-foreground">
        <DialogHeader>
          <DialogTitle>Add New TV Show</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right">
              Title
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="col-span-3 bg-background border-border"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="season" className="text-right">
              Season
            </Label>
            <Input
              id="season"
              type="number"
              value={seasonNumber ?? ""}
              onChange={(e) => setSeasonNumber(Number(e.target.value))}
              className="col-span-3 bg-background border-border"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="episodes" className="text-right">
              Episodes
            </Label>
            <Input
              id="episodes"
              type="number"
              value={episodeCount ?? ""}
              onChange={(e) => setEpisodeCount(Number(e.target.value))}
              className="col-span-3 bg-background border-border"
            />
          </div>
          <Button type="submit" className="w-full mt-4 bg-primary text-primary-foreground hover:bg-muted transition-colors duration-200">
            Add TV Show
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};