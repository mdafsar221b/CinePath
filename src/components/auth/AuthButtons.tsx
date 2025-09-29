

"use client";

import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { LoginDialog } from "./LoginDialog";

export const AuthButtons = () => {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div className="h-10 w-24 rounded-xl bg-muted/50 animate-pulse" />;
  }

  if (session?.user?.email) {
   
    const rawName = session.user.name || session.user.email;
    const displayName = rawName.split(' ')[0].split('@')[0]; 
    return (
      <div className="flex items-center gap-4">
        <span className="text-sm font-medium text-primary hidden sm:block whitespace-nowrap">
          Welcome, {displayName}
        </span>
        <Button
          variant="outline"
          onClick={() => signOut({ callbackUrl: "/" })}
          className="glass-card rounded-xl"
        >
          Logout
        </Button>
      </div>
    );
  }

  return <LoginDialog />;
};