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
import React from "react"; 

interface LoginDialogProps {
    children?: React.ReactNode; 
}

export const LoginDialog = ({ children }: LoginDialogProps) => {
    const [open, setOpen] = useState(false);

    const Trigger = children || (
        <Button className="px-4 py-2 rounded-xl font-medium">
            Log In / Sign Up
        </Button>
    );

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {Trigger} 
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