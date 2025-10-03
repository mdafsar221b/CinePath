
import * as React from 'react';
import Image from "next/image";
import { Card } from "@/components/ui/card"; 
import { Badge } from "@/components/ui/badge"; 


export const LoggedOutFeatureShowcase = () => (
    <div className="container mx-auto px-4 md:px-8 py-16 space-y-20">
        <h2 className="text-3xl md:text-5xl font-bold text-center bg-gradient-to-r from-primary via-foreground to-primary bg-clip-text text-transparent">
            Your Cinema Journey, Tracked.
        </h2>

        {/* Feature 1: Movie Tracking */}
        <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1 space-y-4">
                <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                    Movies Watched
                </Badge>
                <h3 className="text-2xl md:text-4xl font-bold">
                    Log Your Movie History
                </h3>
                <p className="text-lg text-muted-foreground">
                    Easily search for any film from the IMDb database and log it with the year, rating, and your personal notes. Never forget what you've seen.
                </p>
            </div>
            <Card className="order-1 md:order-2 overflow-hidden border-border/50 shadow-2xl">
                <Image
                    src="/Screenshot 2025-10-01 004655.png" // Desktop Movie List
                    alt="Movie tracking screenshot"
                    width={800}
                    height={500}
                    className="object-cover w-full h-auto"
                />
            </Card>
        </div>

        {/* Feature 2: TV Show Tracking */}
        <div className="grid md:grid-cols-2 gap-12 items-center">
            <Card className="overflow-hidden border-border/50 shadow-2xl">
                <Image
                    src="/episode-tracking.png" // Desktop TV Show List
                    alt="TV show tracking screenshot"
                    width={800}
                    height={500}
                    className="object-cover w-full h-auto"
                />
            </Card>
            <div className="space-y-4">
                <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                    TV Show Progress
                </Badge>
                <h3 className="text-2xl md:text-4xl font-bold">
                    Track Season & Episode Progress
                </h3>
                <p className="text-lg text-muted-foreground">
                    CinePath automatically fetches the entire series structure. Mark episodes as watched, track seasons, and mark your favorite episodes.
                </p>
            </div>
        </div>
        
        {/* Feature 3: Statistics Dashboard */}
        <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1 space-y-4">
                <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                    Insights
                </Badge>
                <h3 className="text-2xl md:text-4xl font-bold">
                    Analyze Your Viewing Habits
                </h3>
                <p className="text-lg text-muted-foreground">
                    Get a clear dashboard showing your total movies watched, episodes tracked, and yearly progress. Understand your history at a glance.
                </p>
            </div>
            <Card className="order-1 md:order-2 overflow-hidden border-border/50 shadow-2xl">
                <Image
                    src="/Screenshot 2025-10-01 004837.png" 
                    alt="Dashboard statistics screenshot"
                    width={800}
                    height={500}
                    className="object-cover w-full h-auto"
                />
            </Card>
        </div>
        
    </div>
);