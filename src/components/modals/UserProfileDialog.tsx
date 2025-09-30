"use client";

import { useSession } from "next-auth/react";
import { User } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

export const UserProfileDialog = () => {
  const { data: session } = useSession();
  const user = session?.user;

  if (!user) return null;

  const rawName = user.name || user.email;
  const firstName = rawName.split(' ')[0].split('@')[0];
  
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="icon" 
          className="glass-card hover:bg-muted/20 transition-all duration-300 rounded-xl"
          aria-label="View User Profile"
        >
          <User className="w-5 h-5" />
        </Button>
      </DialogTrigger>
      
      <DialogContent className="glass-card border-border/50 text-foreground max-w-sm rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Hello, {firstName}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Your account information and settings.
          </DialogDescription>
        </DialogHeader>

        <Card className="glass-card border-border/50 bg-background/50">
            <CardContent className="pt-6 space-y-4">
                <div className="space-y-1">
                    <Label className="text-sm font-medium text-primary">Name</Label>
                    <p className="text-lg font-semibold">{user.name || "N/A"}</p>
                </div>
                <div className="space-y-1">
                    <Label className="text-sm font-medium text-primary">Email</Label>
                    <p className="text-sm text-muted-foreground break-all">{user.email}</p>
                </div>
                
                {/* Future Expansion: Add settings or favorite genre here */}
                {/* <div className="space-y-1">
                    <Label className="text-sm font-medium text-primary">Favorite Genre</Label>
                    <p className="text-sm text-muted-foreground">Sci-Fi (Placeholder)</p>
                </div> */}
                <p className="text-xs text-muted-foreground pt-4">
                    User ID: {user.id.substring(0, 8)}...
                </p>
            </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
};