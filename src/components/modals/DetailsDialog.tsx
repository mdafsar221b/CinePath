"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Movie, TVShow } from "@/lib/types";

interface DetailsDialogProps {
  id: string | null;
  type: "movie" | "tv-show";
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const DetailsDialog = ({
  id,
  type,
  open,
  onOpenChange,
}: DetailsDialogProps) => {
  const [details, setDetails] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDetails = async () => {
      if (!id) return;
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/details?id=${id}`);
        if (!res.ok) {
          throw new Error("Failed to fetch details");
        }
        const data = await res.json();
        setDetails(data);
      } catch (e: any) {
        console.error("Details fetch error:", e);
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    if (open) {
      fetchDetails();
    } else {
      setDetails(null);
    }
  }, [id, open]);

  if (!details && !loading) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border border-border text-foreground max-w-2xl">
        {loading ? (
          <p className="text-center text-muted-foreground">
            Loading details...
          </p>
        ) : error ? (
          <p className="text-center text-destructive">{error}</p>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>{details.title}</DialogTitle>
              <DialogDescription>{details.plot}</DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="relative h-[200px] w-full sm:h-[300px] sm:w-[200px] mx-auto sm:mx-0">
                {details.poster_path ? (
                  <Image
                    src={details.poster_path}
                    alt={`${details.title} poster`}
                    fill
                    className="rounded-lg object-contain"
                    sizes="(max-width: 640px) 100vw, 50vw"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center rounded-lg bg-muted-foreground/20 text-center text-xs text-muted-foreground">
                    Poster Not Available
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <p>
                  <span className="font-semibold">Year:</span> {details.year}
                </p>
                <p>
                  <span className="font-semibold">Genre:</span> {details.genre}
                </p>
                <p>
                  <span className="font-semibold">IMDb Rating:</span>{" "}
                  {details.imdbRating} / 10
                </p>
                <p>
                  <span className="font-semibold">Director:</span>{" "}
                  {details.director}
                </p>
                <p>
                  <span className="font-semibold">Actors:</span>{" "}
                  {details.actors}
                </p>
                <p>
                  <span className="font-semibold">Runtime:</span>{" "}
                  {details.runtime}
                </p>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};
