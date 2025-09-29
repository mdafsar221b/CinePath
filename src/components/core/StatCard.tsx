
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ReactNode } from "react"; 

interface StatCardProps {
  title: string;
  value: number | string;
  icon: ReactNode;
}

export const StatCard = ({ title, value, icon }: StatCardProps) => {
  return (
   
    <Card className="glass-card hover-lift rounded-xl p-4 group cursor-default">
      <CardHeader className="p-0 pb-2 flex flex-row items-center justify-between space-y-0"> 
        <CardTitle className="text-xs font-medium text-muted-foreground group-hover:text-primary transition-colors duration-300"> 
          {title}
        </CardTitle>
        <div className="text-primary/70 group-hover:text-primary transition-colors duration-300">{icon}</div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="text-2xl md:text-3xl font-bold bg-gradient-to-br from-foreground to-primary bg-clip-text text-transparent">
          {value}
        </div>
      </CardContent>
    </Card>
  );
};