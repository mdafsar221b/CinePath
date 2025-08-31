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
import { Movie } from "@/lib/types";
import { v4 as uuidv4 } from "uuid";

interface AddMovieDialogProps {
  onAddMovie: (movie: Movie) => void;
}

export const AddMovieDialog = ({ onAddMovie }: AddMovieDialogProps) => {
  const [title, setTitle] = useState("");
  const [year, setYear] = useState<number | null>(null);
  const [open, setOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title && year) {
      onAddMovie({
        id: uuidv4(),
        title,
        year,
        addedAt: Date.now(),
      });
      setTitle("");
      setYear(null);
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="text-sm font-light px-4 py-2 border-primary hover:bg-muted/50 transition-colors duration-200">
          + Add Movie
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-card border border-border text-foreground">
        <DialogHeader>
          <DialogTitle>Add New Movie</DialogTitle>
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
            <Label htmlFor="year" className="text-right">
              Year
            </Label>
            <Input
              id="year"
              type="number"
              value={year ?? ""}
              onChange={(e) => setYear(Number(e.target.value))}
              className="col-span-3 bg-background border-border"
            />
          </div>
          <Button type="submit" className="w-full mt-4 bg-primary text-primary-foreground hover:bg-muted transition-colors duration-200">
            Add Movie
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};