// mdafsar221b/cinepath/CinePath-171babe307d46bb864042c512eef13a22b0b192f/src/app/layout.tsx (UPDATED)
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Footer } from "@/components/layout/Footer";
import { ThemeProvider } from "next-themes";
import { AuthProviders } from "@/components/auth/AuthProviders"; // ADDED

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
          </ThemeProvider>
        </AuthProviders> 
      </body>
    </html>
  );
}