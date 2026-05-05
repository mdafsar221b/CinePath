export const Footer = () => {
  return (
    <footer className="border-t border-white/8 bg-[rgba(4,8,16,0.86)] backdrop-blur-xl">
      <div className="container mx-auto px-4 py-8 md:px-8">
        <div className="space-y-3 text-center">
          <p className="font-display text-3xl text-primary">CinePath</p>
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} CinePath, by Afsar. Crafted for people who actually care about what they watch.
          </p>
          <div className="flex items-center justify-center gap-2 text-xs uppercase tracking-[0.24em] text-muted-foreground">
            <span>Built with</span>
            <span className="font-medium text-primary">Next.js</span>
            <span>&bull;</span>
            <span className="font-medium text-primary">TypeScript</span>
            <span>&bull;</span>
            <span className="font-medium text-primary">Tailwind CSS</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
