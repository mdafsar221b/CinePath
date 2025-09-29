// src/lib/auth-utils.ts

import { getServerSession, type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import clientPromise from "@/lib/mongodb";
import { compare } from "bcryptjs";
import { ObjectId } from "mongodb";

declare module "next-auth" {
    interface Session {
        user: {
            id: string;
            email: string;
            name?: string; 
        } & import("next-auth/core/types").DefaultSession["user"];
    }

    interface JWT {
        name?: string;
    }
    

    interface User {
        name?: string;
    }
}


export const authOptions: NextAuthOptions = {
    session: {
        strategy: "jwt",
    },
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials.password) return null;

                const client = await clientPromise;
                const db = client.db("cinepath");
                const user = await db.collection("users").findOne({ email: credentials.email.toLowerCase() });

                if (!user || !user.passwordHash) return null;

                const isValid = await compare(credentials.password, user.passwordHash);

                if (!isValid) return null;

                // UPDATED: Return the user's name
                return {
                    id: user._id.toString(),
                    email: user.email,
                    name: user.name || user.email.split("@")[0], 
                };
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.email = user.email;
                token.name = user.name; 
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string;
                session.user.email = token.email as string;
                session.user.name = token.name as string; 
            }
            return session;
        },
    },
    pages: {
        signIn: '/',
    }
};


export async function getUserIdFromSession() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        throw new Error("User not authenticated.");
    }
    return session.user.id;
}