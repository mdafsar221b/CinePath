
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

  return null;
};