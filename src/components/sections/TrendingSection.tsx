// src/components/sections/TrendingSection.tsx
"use client";

import React, { useState, useEffect, useCallback } from "react";
import { TrendingContent, SearchResult } from "@/lib/types";
import { Card } from "@/components/ui/card";
import { Film, MonitorPlay, Loader2, Plus, TrendingUp, Flame, Star, Zap } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ContentSectionSkeleton } from "@/components/ui/SkeletonCard"; 

interface EnrichedTrendingContent extends TrendingContent {
    imdbRating?: string;
    imdbID?: string;
}

interface TrendingSectionProps {
    onSelectContent: (result: SearchResult) => void;
    onAddToWatchlist: (item: SearchResult) => Promise<void>;
    addingToWatchlist: string | null;
    isLoggedIn: boolean;
}

const TrendingCard = ({ 
    content, 
    onSelectContent, 
    onAddToWatchlist, 
    addingToWatchlist,
    isLoggedIn
}: { 
    content: EnrichedTrendingContent; 
    onSelectContent: (result: SearchResult) => void; 
    onAddToWatchlist: (item: SearchResult) => Promise<void>;
    addingToWatchlist: string | null;
    isLoggedIn: boolean;
}) => {
    
    const isAdding = addingToWatchlist === content.id;
    const isMovie = content.type === 'movie';
    const imdbRating = content.imdbRating && content.imdbRating !== "N/A" ? content.imdbRating : null;

    return (
        <Card 
            className="hover-lift rounded-2xl group border-border/50 relative overflow-hidden bg-secondary/30 cursor-pointer"
        >
            {/* Poster Area - Clickable to show details */}
            <div 
                className="relative w-full h-32 sm:h-[250px] overflow-hidden rounded-t-2xl cursor-pointer"
                onClick={() => onSelectContent(content)}
            >
                {content.poster_path ? (
                    <Image
                        src={content.poster_path}
                        alt={`${content.title} poster`}
                        fill
                        sizes="(max-width: 640px) 25vw, (max-width: 768px) 25vw, (max-width: 1024px) 20vw, 15vw"
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                ) : (
                    <div className="flex h-full items-center justify-center rounded-t-xl bg-muted/20 text-center text-xs text-muted-foreground">
                        No Poster
                    </div>
                )}
                
                {/* Watchlist Button on Poster */}
                {isLoggedIn && (
                    <div className="absolute top-2 right-2 transition-opacity duration-300">
                        <Button
                            size="icon"
                            onClick={(e) => {
                                e.stopPropagation(); // Prevent opening details dialog
                                onAddToWatchlist(content);
                            }}
                            className="rounded-full h-8 w-8 p-0 bg-primary/80 hover:bg-primary hover:scale-110 shadow-md"
                            disabled={isAdding}
                        >
                            {isAdding ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                        </Button>
                    </div>
                )}
                
                {/* Type Badge */}
                <Badge 
                    className={`absolute bottom-2 left-2 text-xs px-2 py-0.5 ${
                        isMovie 
                            ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' 
                            : 'bg-purple-500/20 text-purple-400 border-purple-500/30'
                    }`}
                >
                    {isMovie ? 'Movie' : 'TV'}
                </Badge>
                
            </div>
            
            {/* Details and Rating Area */}
            <div className="p-2 sm:p-4 flex flex-col items-center text-center">
                <h3 className="text-sm sm:text-lg font-semibold mb-0 truncate w-full" title={content.title}>{content.title}</h3>
                <p className="text-xs text-muted-foreground mb-1 sm:mb-3">{content.year}</p>
                
                {/* Rating Badge in place of old list button */}
                <div className="flex items-center justify-center gap-1 w-full h-5">
                    {imdbRating && (
                        <Badge 
                            variant="outline" 
                            className="text-xs px-1 py-0 bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                        >
                            <Star className="w-3 h-3 mr-1 fill-yellow-400" /> 
                            {imdbRating}
                        </Badge>
                    )}
                    {!imdbRating && <span className="text-xs text-muted-foreground">N/A Rating</span>}
                </div>
            </div>
        </Card>
    );
};


export const TrendingSection = ({ onSelectContent, onAddToWatchlist, addingToWatchlist, isLoggedIn }: TrendingSectionProps) => {
    // State to hold enriched data (with IMDb Rating)
    const [trending, setTrending] = useState<EnrichedTrendingContent[]>([]);
    const [popular, setPopular] = useState<EnrichedTrendingContent[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchTMDbData = useCallback(async () => {
        setLoading(true);
        try {
            const [trendingRes, popularRes] = await Promise.all([
                fetch("/api/tmdb/trending"),
                fetch("/api/tmdb/popular")
            ]);

            let trendingData: TrendingContent[] = trendingRes.ok ? await trendingRes.json() : [];
            let popularData: TrendingContent[] = popularRes.ok ? await popularRes.json() : [];
            
            // --- Client-side enrichment for IMDb Rating (Trade-off for performance vs. data) ---
            const enrichItems = async (items: TrendingContent[]) => {
                const results = await Promise.all(items.slice(0, 12).map(async (item: TrendingContent) => {
                    if (item.id) {
                         try {
                            // Re-use the multi-type detail fetch to get OMDb details (including rating/ID)
                            const detailsRes = await fetch(`/api/details?id=${item.id}&type=${item.type === 'movie' ? 'movie' : 'series'}`);
                            if (detailsRes.ok) {
                                const details = await detailsRes.json();
                                return {
                                    ...item,
                                    imdbRating: details.imdbRating,
                                    imdbID: details.id,
                                };
                            }
                         } catch (error) {
                             // This is expected for some TMDb-only items without direct OMDb matches
                         }
                    }
                    return item;
                }));
                return results as EnrichedTrendingContent[];
            };
            
            const [enrichedTrending, enrichedPopular] = await Promise.all([
                enrichItems(trendingData), 
                enrichItems(popularData)
            ]);
            // --- End Enrichment ---

            setTrending(enrichedTrending);
            setPopular(enrichedPopular);

        } catch (error) {
            console.error("Failed to fetch TMDb data:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchTMDbData();
    }, [fetchTMDbData]);
    
    const renderContent = (list: EnrichedTrendingContent[], title: string, Icon: React.ElementType) => {
        const displayList = list.filter(Boolean).slice(0, 12); 
        
        if (displayList.length === 0) return null;
        
        return (
            <div className="mb-12">
                <h2 className="text-2xl md:text-3xl font-semibold mb-6 flex items-center gap-3">
                    <Icon className="w-6 h-6 text-primary" /> {title}
                    <Badge variant="outline" className="text-sm font-medium ml-1">
                        {displayList.length}
                    </Badge>
                </h2>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4">
                    {displayList.map(content => (
                        <TrendingCard
                            key={content.id}
                            content={content}
                            onSelectContent={onSelectContent}
                            onAddToWatchlist={onAddToWatchlist}
                            addingToWatchlist={addingToWatchlist}
                            isLoggedIn={isLoggedIn}
                        />
                    ))}
                </div>
            </div>
        );
    }
    
    if (loading) {
        return (
            <div className="space-y-16 py-16">
                 <div className="mb-8 h-8 w-40 bg-muted/50 rounded-lg animate-pulse" />
                 <ContentSectionSkeleton />
            </div>
        );
    }
    
    if (trending.length === 0 && popular.length === 0) {
        return null;
    }

    return (
        <section id="trending-popular" className="pt-16">
            {renderContent(trending, "Trending Today", TrendingUp)}
            {renderContent(popular, "Popular Now", Flame)}
        </section>
    );
};