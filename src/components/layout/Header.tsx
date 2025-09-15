// src/components/layout/Header.tsx
"use client";

import Link from "next/link";
import { GlobalSearchDialog } from "@/components/modals/GlobalSearchDialog";
import { DetailsDialog } from "@/components/modals/DetailsDialog";
import { DetailedContent } from "@/lib/types";
import { useState } from "react";

export const Header = () => {
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

  return (
    <>
      <header className="p-4 md:p-8 border-b border-muted/50 bg-background">
        <div className="container mx-auto flex items-center justify-between">
          <Link href="/" className="text-2xl font-light tracking-tight text-foreground hover:text-primary transition-colors duration-200">
            CinePath 🎬
          </Link>
          <div className="flex items-center gap-4">
            <GlobalSearchDialog onSelectContent={handleSelectContent} />
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