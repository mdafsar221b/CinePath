"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface StatCardProps {
  title: string;
  value: number | string;
}

export const StatCard = ({ title, value }: StatCardProps) => {
  return (
    <Card className="bg-card border border-border rounded-lg p-4 transition-all duration-300 hover:scale-[1.02]">
      <CardHeader className="p-0 pb-2">
        <CardTitle className="text-sm font-light text-muted-foreground">{title}</CardTitle>
      </CardHeader>
      <CardContent className="p-0 text-3xl font-bold tracking-tight">
        {value}
      </CardContent>
    </Card>
  );
};