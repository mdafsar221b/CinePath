// src/components/layout/Sidebar.tsx

"use client";

import * as React from "react";
import { Menu, X, LogOut, User as UserIcon, ListVideo, Film, Tv2, BarChart3, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogClose,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useSession, signOut } from "next-auth/react";
import { LoginDialog } from "@/components/auth/LoginDialog";
import { useRouter } from "next/navigation";
import Link from "next/link"; 
import { cn } from "@/lib/utils"; 
import { Card } from "@/components/ui/card";

interface SidebarProps {
  dashboardButton: React.ReactNode;
}

const SidebarNavLink = ({ text, icon: Icon, onClick, asChild, children }: { 
    text: string, 
    icon: React.ElementType, 
    onClick?: () => void, 
    asChild?: boolean, 
    children?: React.ReactNode 
}) => (
    <Button
        variant="ghost"
        onClick={onClick}
        className="w-full justify-start text-sm py-2 h-auto text-foreground/80 hover:bg-muted/50 rounded-xl"
        asChild={asChild}
    >
        {asChild ? children : (
            <div className="flex items-center gap-3">
                <Icon className="w-5 h-5 text-primary" />
                <span className="font-medium">{text}</span>
            </div>
        )}
    </Button>
);

export const Sidebar = ({ dashboardButton }: SidebarProps) => {
  const { data: session } = useSession();
  const [open, setOpen] = React.useState(false);
  const router = useRouter();

  const handleLogout = React.useCallback(() => {
    setOpen(false); 
    signOut({ redirect: false }).then(() => {
        router.push("/");
    });
  }, [router]);

  const loggedInUser = session?.user?.email ? { 
    name: session.user.name || session.user.email.split('@')[0],
    email: session.user.email
  } : null;

  const handleLinkClick = React.useCallback((hash: string) => {
    router.push(`/#${hash}`);
  }, [router]);

  const DashboardLink = React.useMemo(() => (
    dashboardButton ? (
      <DialogClose asChild>
          <SidebarNavLink text="Dashboard" icon={BarChart3} asChild>
              {React.cloneElement(dashboardButton as React.ReactElement, {
                  variant: 'ghost',
                  className: 'w-full justify-start text-sm py-2 h-auto text-foreground/80 hover:bg-muted/50 rounded-xl',
                  children: (
                      <div className="flex items-center gap-3">
                          <BarChart3 className="w-5 h-5 text-primary" />
                          <span className="font-medium">Dashboard</span>
                      </div>
                  )
              })}
          </SidebarNavLink>
      </DialogClose>
    ) : null
  ), [dashboardButton]);

  const LoggedInContent = React.useMemo(() => (
    <div className="flex flex-col space-y-6 flex-grow">
      
      <Card className="glass-card border-border/50 bg-background/50 cursor-pointer p-3 sm:p-4">
        <DialogClose asChild>
            <div className="flex items-center gap-4 min-w-0">
                <UserIcon className="w-6 h-6 text-primary flex-shrink-0" />
                <div className="min-w-0">
                    <p className="text-sm font-semibold truncate">{loggedInUser?.name}</p>
                    <p className="text-xs text-muted-foreground break-all">{loggedInUser?.email}</p>
                </div>
            </div>
        </DialogClose>
      </Card>
      
      <div className="flex flex-col space-y-1">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground px-3 pt-2">Library</h4>
        
        {DashboardLink}
        
        <DialogClose asChild>
            <SidebarNavLink text="Watchlist" icon={ListVideo} onClick={() => handleLinkClick("watchlist")} />
        </DialogClose>
        
        <DialogClose asChild>
            <SidebarNavLink text="Movies Watched" icon={Film} onClick={() => handleLinkClick("movies")} />
        </DialogClose>
        
        <DialogClose asChild>
            <SidebarNavLink text="TV Shows Watched" icon={Tv2} onClick={() => handleLinkClick("tv-shows")} />
        </DialogClose>
      </div>

      <div className="flex-grow" />
      
      <div className="pt-4 space-y-4">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground px-3">Settings</h4>
        
        <div className="flex justify-between items-center p-3 rounded-xl bg-card/50">
            <span className="text-sm font-medium text-foreground">Theme Mode</span>
            <ThemeToggle />
        </div>
        
        <Button
            variant="ghost"
            onClick={handleLogout}
            className="w-full justify-start text-sm py-2 h-auto text-red-400 hover:bg-red-500/10 rounded-xl"
        >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
        </Button>
      </div>
    </div>
  ), [loggedInUser, DashboardLink, handleLogout, handleLinkClick]);

  const LoggedOutContent = React.useMemo(() => (
    <div className="flex flex-col space-y-6 flex-grow pt-4">
      <div className="flex flex-col space-y-4">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground px-3">Account</h4>
        <DialogClose asChild>
            <LoginDialog>
                <Button 
                  variant="ghost"
                  className="w-full justify-start text-sm py-2 h-auto text-foreground hover:bg-muted/50 rounded-xl"
                  asChild
                >
                  <div className="flex items-center gap-3">
                      <LogIn className="w-5 h-5 text-primary" />
                      <span className="font-medium">Log In / Sign Up</span>
                  </div>
                </Button>
            </LoginDialog>
        </DialogClose>
      </div>
      
      <div className="flex-grow" />
      
      <div className="pt-4 space-y-4">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground px-3">Settings</h4>
        
        <div className="flex justify-between items-center p-3 rounded-xl bg-card/50">
            <span className="text-sm font-medium text-foreground">Theme Mode</span>
            <ThemeToggle />
        </div>
      </div>
    </div>
  ), []);
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild className="sm:hidden">
        <Button 
            variant="ghost" 
            size="icon" 
            className="glass-card hover:bg-muted/20 rounded-xl"
            aria-label="Open Menu"
        >
          <Menu className="w-5 h-5" />
        </Button>
      </DialogTrigger>
      
      <DialogContent 
        className={cn(
            "fixed inset-y-0 right-0 h-full w-full max-w-[80vw] sm:max-w-sm m-0 p-0 rounded-none",
            "!top-0 !left-auto !translate-x-0 !translate-y-0", 
            "data-[state=open]:slide-in-from-right-0 data-[state=closed]:slide-out-to-right-0 sm:hidden"
        )}
      >
        <DialogHeader className="flex flex-row items-center justify-between p-4 border-b border-border/50">
          <DialogTitle className="text-xl font-bold">
            <Link href="/" onClick={() => setOpen(false)}>CinePath</Link>
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col h-[calc(100%-65px)] overflow-y-auto p-4">
            {loggedInUser ? LoggedInContent : LoggedOutContent}
        </div>
      </DialogContent>
    </Dialog>
  );
};