"use client";

import * as React from "react";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {
    onClose: () => void;
}

export function UserAuthForm({ onClose, className, ...props }: UserAuthFormProps) {
    const [isLoading, setIsLoading] = React.useState<boolean>(false);
    const [email, setEmail] = React.useState<string>("");
    const [password, setPassword] = React.useState<string>("");
  
    const [name, setName] = React.useState<string>("");
    const [isSignUp, setIsSignUp] = React.useState<boolean>(false);

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            if (isSignUp) {
               
                const signUpRes = await fetch("/api/register", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    
                    body: JSON.stringify({ email, password, name }), // Removed favoriteGenre from payload
                });

                if (signUpRes.ok) {
                    alert("Account created successfully! You can now log in.");
                    setIsSignUp(false); 
                   
                    setName("");
                } else {
                    const errorData = await signUpRes.json();
                    alert(errorData.error || "Sign up failed.");
                }

            } else {
               
                const signInResult = await signIn("credentials", {
                    redirect: false,
                    email,
                    password,
                });

                if (signInResult?.ok) {
                    onClose();
                } else {
                    alert("Login failed. Check your email and password.");
                }
            }
        } catch (error) {
            console.error(error);
            alert("An error occurred. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={className} {...props}>
            <form onSubmit={onSubmit} className="space-y-6">
                {/* Name Field - Only visible during Sign Up */}
                {isSignUp && (
                    <div className="grid gap-2">
                        <Label htmlFor="name">Name</Label>
                        <Input
                            id="name"
                            placeholder="Your Name"
                            type="text"
                            autoCapitalize="words"
                            autoComplete="name"
                            autoCorrect="off"
                            disabled={isLoading}
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="glass-card border-border/50 rounded-xl"
                            required={isSignUp}
                        />
                    </div>
                )}
                {/* Email Field */}
                <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                        id="email"
                        placeholder="name@example.com"
                        type="email"
                        autoCapitalize="none"
                        autoComplete="email"
                        autoCorrect="off"
                        disabled={isLoading}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="glass-card border-border/50 rounded-xl"
                        required
                    />
                </div>
                {/* Password Field */}
                <div className="grid gap-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                        id="password"
                        placeholder="••••••••"
                        type="password"
                        disabled={isLoading}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="glass-card border-border/50 rounded-xl"
                        required
                    />
                </div>
                {/* Removed Favorite Genre Field */}
                
                <Button disabled={isLoading} className="w-full">
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {isSignUp ? "Sign Up" : "Log In"}
                </Button>
            </form>
            <Button
                variant="outline"
                type="button"
                disabled={isLoading}
                onClick={() => {
                    setIsSignUp(!isSignUp);
                    if (isSignUp) {
                        setName("");
                    }
                }}
                className="w-full mt-6 glass-card"
            >
                {isSignUp ? "Switch to Log In" : "Switch to Sign Up"}
            </Button>
        </div>
    );
}