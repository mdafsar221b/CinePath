import Link from "next/link";

export const Header = () => {
  return (
    <header className="p-4 md:p-8 border-b border-muted/50 bg-background">
      <div className="container mx-auto flex items-center justify-between">
        <Link href="/" className="text-2xl font-light tracking-tight text-foreground hover:text-primary transition-colors duration-200">
          CinePath 🎬
        </Link>
        {/* Navigation links could go here if needed */}
        <nav className="hidden md:flex space-x-4 text-sm">
          {/* <Link href="/movies" className="text-muted-foreground hover:text-foreground transition-colors">Movies</Link> */}
          {/* <Link href="/tv-shows" className="text-muted-foreground hover:text-foreground transition-colors">TV Shows</Link> */}
        </nav>
      </div>
    </header>
  );
};