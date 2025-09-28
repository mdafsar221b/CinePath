// src/components/auth/LoginDialog.tsx (NEW)
"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { UserAuthForm } from "./UserAuthForm";

export const LoginDialog = () => {
    const [open, setOpen] = useState(false);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="px-4 py-2 rounded-xl font-medium">
                    Log In / Sign Up
                </Button>
            </DialogTrigger>
            <DialogContent className="glass-card border-border/50 text-foreground max-w-md rounded-2xl">
                <DialogHeader>
                    <DialogTitle className="text-xl font-semibold">
                        Access CinePath
                    </DialogTitle>
                    <DialogDescription className="text-muted-foreground">
                        Log in or create an account to start tracking.
                    </DialogDescription>
                </DialogHeader>
                <UserAuthForm onClose={() => setOpen(false)} />
            </DialogContent>
        </Dialog>
    );
};