// src/app/layout.tsx
import type { Metadata } from "next";
import { Bebas_Neue, Manrope } from "next/font/google";
import "./globals.css";
import { Footer } from "@/components/layout/Footer";
import { ThemeProvider } from "next-themes";
import { AuthProviders } from "@/components/auth/AuthProviders";
import { Toaster } from 'react-hot-toast';

const displayFont = Bebas_Neue({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-display",
});

const bodyFont = Manrope({
  subsets: ["latin"],
  variable: "--font-body",
});

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
      <body className={`${displayFont.variable} ${bodyFont.variable} font-body`}>
        <AuthProviders> 
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
            <div className="app-shell flex min-h-screen flex-col bg-background text-foreground">
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
