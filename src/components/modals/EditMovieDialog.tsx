// src/components/modals/EditMovieDialog.tsx

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
import { Movie } from "@/lib/types";
import { Textarea } from "@/components/ui/textarea";
import toast from "react-hot-toast";

interface EditMovieDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  movie: Movie | null;
  onEditMovie: (updatedMovie: Movie) => void;
}

export const EditMovieDialog = ({ open, onOpenChange, movie, onEditMovie }: EditMovieDialogProps) => {
  const [myRating, setMyRating] = useState<number | null>(null);
  const [personalNotes, setPersonalNotes] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (movie) {
      setMyRating(movie.myRating || null);
      setPersonalNotes(movie.personalNotes || "");
    }
  }, [movie]);

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!movie) return;

    setLoading(true);
    const updatedMovie = {
      _id: movie._id,
      myRating,
      personalNotes,
    };

    try {
      await fetch("/api/movies", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedMovie),
      });
      onEditMovie(updatedMovie as Movie);
      onOpenChange(false);
      toast.success(`'${movie.title}' details saved!`);
    } catch (error) {
      console.error("Error updating movie:", error);
      toast.error("Failed to save movie details.");
    } finally {
      setLoading(false);
    }
  };

  if (!movie) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-card border-border/50 text-foreground max-w-2xl rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Edit {movie.title}</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Update your personal details for this movie.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleEdit} className="space-y-6">
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
          <div className="space-y-2">
            <Label htmlFor="personalNotes" className="text-sm font-medium">Personal Notes</Label>
            <Textarea
              id="personalNotes"
              value={personalNotes}
              onChange={(e) => setPersonalNotes(e.target.value)}
              className="glass-card border-border/50 rounded-xl"
              placeholder="Add your thoughts about the movie..."
            />
          </div>
          <div className="flex gap-3 pt-4">
            <Button type="submit" className="flex-1 rounded-xl" disabled={loading}>
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};