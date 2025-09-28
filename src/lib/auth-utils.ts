// src/lib/auth-utils.ts (NEW)
import { getServerSession, type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import clientPromise from "@/lib/mongodb";
import { compare } from "bcryptjs";
import { ObjectId } from "mongodb";

// Extend session type for user ID (Required for TypeScript safety)
declare module "next-auth" {
    interface Session {
        user: {
            id: string;
            email: string;
        } & import("next-auth/core/types").DefaultSession["user"];
    }
}

// NextAuth Configuration
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
                // Note: Ensure you have a 'users' collection with email and passwordHash
                const user = await db.collection("users").findOne({ email: credentials.email.toLowerCase() });

                if (!user || !user.passwordHash) return null;

                const isValid = await compare(credentials.password, user.passwordHash);

                if (!isValid) return null;

                // Return user object, which will be available in the JWT
                return {
                    id: user._id.toString(), // Important: Must be a string
                    email: user.email,
                };
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.email = user.email;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string;
                session.user.email = token.email as string;
            }
            return session;
        },
    },
    pages: {
        signIn: '/', // Use the home page for sign-in/up
    }
};

// Helper function to use in API routes to get the current user's ID
export async function getUserIdFromSession() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        throw new Error("User not authenticated.");
    }
    return session.user.id;
}