// mdafsar221b/cinepath/CinePath-8b5b9760d0bd1328fe99387f613f7cf7af56ed45/src/components/auth/AuthButtons.tsx (No change needed)

"use client";

import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { LoginDialog } from "./LoginDialog";
import { UserProfileDialog } from "@/components/modals/UserProfileDialog";

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
        <UserProfileDialog />
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