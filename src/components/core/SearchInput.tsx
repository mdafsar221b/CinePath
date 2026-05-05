"use client";

import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface SearchInputProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onSearchSubmit: (e: React.FormEvent) => void;
  onClear: () => void;
  loading: boolean;
}

export const SearchInput = ({ searchTerm, onSearchChange, onSearchSubmit, onClear, loading }: SearchInputProps) => {
  return (
    <div className="glass-card rounded-[1.75rem] p-3 sm:p-4">
      <form onSubmit={onSearchSubmit} className="flex items-center gap-3">
        <Input
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search movies, TV shows, actors, directors..."
          className="h-14 flex-1 rounded-2xl border-0 bg-transparent text-base shadow-none focus-visible:ring-0"
        />
        {searchTerm && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onClear}
            className="rounded-full text-muted-foreground hover:bg-white/8"
          >
            <X className="w-4 h-4" />
          </Button>
        )}
        <Button type="submit" size="icon" disabled={loading} className="h-12 w-12 rounded-2xl">
          <Search className="w-4 h-4" />
        </Button>
      </form>
    </div>
  );
};
