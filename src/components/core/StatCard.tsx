"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface StatCardProps {
  title: string;
  value: number | string;
}

export const StatCard = ({ title, value }: StatCardProps) => {
  return (
    <Card className="glass-card hover-lift rounded-2xl p-6 group cursor-default">
      <CardHeader className="p-0 pb-4">
        <CardTitle className="text-sm font-medium text-muted-foreground group-hover:text-primary transition-colors duration-300">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="text-3xl md:text-4xl font-bold bg-gradient-to-br from-foreground to-primary bg-clip-text text-transparent">
          {value}
        </div>
      </CardContent>
    </Card>
  );
};