// src/app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Footer } from "@/components/layout/Footer";
import { ThemeProvider } from "next-themes";
import { AuthProviders } from "@/components/auth/AuthProviders";
import { Toaster } from 'react-hot-toast';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CinePath",
  description: "A personal movie and TV show tracker.",
  icons:{
    icon: "/icons.svg",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className}`}>
        <AuthProviders> 
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <div className="flex flex-col min-h-screen bg-background text-foreground">
              <main className="flex-grow">
                {children}
              </main>
              <Footer />
            </div>
         
            <Toaster 
              position="bottom-center"
              toastOptions={{
                style: {
                  background: 'var(--card)', 
                  color: 'var(--foreground)', 
                  border: '1px solid var(--border)', 
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.5)', 
                  minWidth: '250px',
                  zIndex: 9999,
                },
                success: {
                    iconTheme: {
                        primary: 'var(--primary)',
                        secondary: 'var(--card)', 
                    },
                },
                error: {
                    iconTheme: {
                        primary: 'var(--destructive)',
                        secondary: 'var(--card)',
                    },
                },
              }}
            />
          </ThemeProvider>
        </AuthProviders> 
      </body>
    </html>
  );
}