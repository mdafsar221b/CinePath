// src/components/layout/Header.tsx
"use client";

import Link from "next/link";
import { GlobalSearchDialog } from "@/components/modals/GlobalSearchDialog";
import { DetailsDialog } from "@/components/modals/DetailsDialog";
import { DetailedContent } from "@/lib/types";
import { useState } from "react";

interface HeaderProps {
  onWatchlistUpdate?: () => void;
}

export const Header = ({ onWatchlistUpdate }: HeaderProps) => {
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedContent, setSelectedContent] = useState<DetailedContent | null>(null);

  const handleSelectContent = async (id: string, type: 'movie' | 'tv') => {
    try {
      const res = await fetch(`/api/details?id=${id}&type=${type === 'tv' ? 'series' : 'movie'}`);
      if (!res.ok) throw new Error("Failed to fetch details");
      
      const details = await res.json();
      setSelectedContent(details);
      setDetailsOpen(true);
    } catch (error) {
      console.error("Error fetching details:", error);
    }
  };

  const handleAddToWatchlist = async (item: any) => {
    try {
      console.log("Adding to watchlist:", item);
      
      const res = await fetch('/api/watchlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item),
      });

      const responseData = await res.json();
      console.log("Watchlist API response:", responseData);

      if (res.status === 409) {
        alert(responseData.error);
        return;
      }

      if (!res.ok) {
        console.error("Failed to add to watchlist:", responseData);
        throw new Error("Failed to add to watchlist");
      }
      
      alert(`${item.title} added to watchlist!`);
      
      // Refresh the watchlist on the main page
      if (onWatchlistUpdate) {
        onWatchlistUpdate();
      }
    } catch (error) {
      console.error("Error adding to watchlist:", error);
      alert("Failed to add to watchlist");
    }
  };

  return (
    <>
      <header className="p-4 md:p-8 border-b border-muted/50 bg-background">
        <div className="container mx-auto flex items-center justify-between">
          <Link href="/" className="text-2xl font-light tracking-tight text-foreground hover:text-primary transition-colors duration-200">
            CinePath 🎬
          </Link>
          <div className="flex items-center gap-4">
            <GlobalSearchDialog 
              onSelectContent={handleSelectContent} 
              onAddToWatchlist={handleAddToWatchlist}
            />
            <nav className="hidden md:flex space-x-4 text-sm">
            </nav>
          </div>
        </div>
      </header>
      <DetailsDialog 
        open={detailsOpen} 
        onOpenChange={setDetailsOpen} 
        content={selectedContent} 
      />
    </>
  );
};