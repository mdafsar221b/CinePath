export const Footer = () => {
  return (
    <footer className="border-t border-border/30 bg-background/80 backdrop-blur-sm">
      <div className="container mx-auto px-4 md:px-8 py-8">
        <div className="text-center space-y-3">
          <p className="text-muted-foreground">
            &copy; {new Date().getFullYear()} CinePath. Crafted with passion for cinema.
          </p>
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <span>Built with</span>
            <span className="text-primary font-medium">Next.js</span>
            <span>•</span>
            <span className="text-primary font-medium">TypeScript</span>
            <span>•</span>
            <span className="text-primary font-medium">Tailwind CSS</span>
          </div>
        </div>
      </div>
    </footer>
  );
};