// mdafsar221b/cinepath/CinePath-8b5b9760d0bd1328fe99387f613f7cf7af56ed45/src/components/layout/Header.tsx

"use client";

import Link from "next/link";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { AuthButtons } from "@/components/auth/AuthButtons"; 
import React from "react"; 
import { Sidebar } from "@/components/layout/Sidebar"; // <--- UPDATED IMPORT

interface HeaderProps {
  dashboardButton?: React.ReactNode; 
}

export const Header = ({ dashboardButton }: HeaderProps) => { 
  return (
    <>
      <header className="sticky top-0 z-50 border-b border-white/8 bg-[rgba(4,8,16,0.72)] backdrop-blur-2xl">
        <div className="container mx-auto px-4 md:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="group flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 text-primary shadow-[0_10px_30px_rgba(255,186,73,0.16)]">
                <span className="font-display text-2xl leading-none">C</span>
              </div>
              <div>
                <span className="font-display text-4xl leading-none text-primary">
                  CinePath
                </span>
                <p className="hidden text-[0.7rem] uppercase tracking-[0.28em] text-muted-foreground sm:block">
                  Track. Discover. Rewatch.
                </p>
              </div>
            </Link>
            
            <div className="hidden items-center gap-3 sm:flex">
              {dashboardButton} 
              <AuthButtons /> 
              <ThemeToggle />
            </div>
            
            <div className="sm:hidden">
              <Sidebar dashboardButton={dashboardButton} />
            </div>

          </div>
        </div>
      </header>
    </>
  );
};
