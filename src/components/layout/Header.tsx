"use client";

import Link from "next/link";
import { ThemeToggle } from "@/components/ui/theme-toggle";

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
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>
    </>
  );
};