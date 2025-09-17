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
import { TVShow } from "@/lib/types";
import { Textarea } from "@/components/ui/textarea";

interface EditTVShowDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  show: TVShow | null;
  onEditTVShow: (updatedShow: TVShow) => void;
}

export const EditTVShowDialog = ({ open, onOpenChange, show, onEditTVShow }: EditTVShowDialogProps) => {
  const [myRating, setMyRating] = useState<number | null>(null);
  const [personalNotes, setPersonalNotes] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (show) {
      setMyRating(show.myRating || null);
      setPersonalNotes(show.personalNotes || "");
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

  if (!show) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-card border-border/50 text-foreground max-w-2xl rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Edit {show.title}</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Update your personal details for this TV show.
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