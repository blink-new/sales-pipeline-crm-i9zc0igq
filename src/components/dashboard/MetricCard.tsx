
import { Card, CardContent } from "../ui/card";
import { cn } from "../../lib/utils";
import { ArrowDownIcon, ArrowUpIcon } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: number;
  change: number;
  icon: React.ReactNode;
  prefix?: string;
  suffix?: string;
}

export function MetricCard({
  title,
  value,
  change,
  icon,
  prefix = "",
  suffix = "",
}: MetricCardProps) {
  const isPositive = change >= 0;
  const formattedValue = value.toLocaleString();
  const formattedChange = Math.abs(change).toFixed(1);

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <CardContent className="p-0">
        <div className="flex flex-col">
          <div className="flex items-center justify-between border-b p-4">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <div className="rounded-full bg-primary/10 p-2 text-primary">
              {icon}
            </div>
          </div>
          
          <div className="space-y-2 p-4">
            <div className="flex items-baseline">
              <span className="text-2xl font-bold tracking-tight">
                {prefix}
                {formattedValue}
                {suffix}
              </span>
            </div>
            
            <div className="flex items-center gap-1">
              <div
                className={cn(
                  "flex items-center text-xs font-medium",
                  isPositive ? "text-green-500" : "text-red-500"
                )}
              >
                {isPositive ? (
                  <ArrowUpIcon className="mr-1 h-3 w-3" />
                ) : (
                  <ArrowDownIcon className="mr-1 h-3 w-3" />
                )}
                {formattedChange}%
              </div>
              <p className="text-xs text-muted-foreground">vs last period</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}