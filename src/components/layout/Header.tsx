// mdafsar221b/cinepath/CinePath-171babe307d46bb864042c512eef13a22b0b192f/src/components/layout/Header.tsx (UPDATED)
"use client";

import Link from "next/link";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { AuthButtons } from "@/components/auth/AuthButtons"; // ADDED

export const Header = () => {
  return (
    <>
      <header className="sticky top-0 z-50 bg-background/50 border-b border-border/50 backdrop-blur-xl">
        <div className="container mx-auto px-4 md:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2 group">
              <span className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent transition-transform duration-300">
                CinePath
              </span>
            </Link>
            <div className="flex items-center gap-4">
              <AuthButtons /> 
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>
    </>
  );
};