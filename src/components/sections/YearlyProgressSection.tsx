
import { Badge } from "@/components/ui/badge";

interface YearlyProgressSectionProps {
  moviesByYear: Record<string, number>;
}

export const YearlyProgressSection = ({ moviesByYear }: YearlyProgressSectionProps) => {
  if (Object.keys(moviesByYear).length === 0) return null;

  return (
    <section className="mb-16">
      <h2 className="text-2xl md:text-3xl font-semibold mb-8 flex items-center gap-3">
        Yearly Progress
      </h2>
      <div className="flex flex-wrap gap-3">
        {Object.entries(moviesByYear).sort(([yearA], [yearB]) => Number(yearB) - Number(yearA)).map(([year, count]) => (
          <Badge
            key={year}
            className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 transition-colors px-6 py-2 text-sm font-medium cursor-default"
          >
            {year}: {count}
          </Badge>
        ))}
      </div>
    </section>
  );
};