export const Footer = () => {
  return (
    <footer className="p-4 md:p-8 border-t border-muted/50 bg-background text-muted-foreground text-center text-sm">
      <div className="container mx-auto">
        <p>&copy; {new Date().getFullYear()} CinePath. All rights reserved.</p>
        <p className="mt-1">
          Built with <span className="text-primary">Next.js</span>, <span className="text-primary">TypeScript</span>, and <span className="text-primary">Tailwind CSS</span>.
        </p>
      </div>
    </footer>
  );
};