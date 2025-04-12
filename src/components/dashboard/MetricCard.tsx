
import { ArrowDownIcon, ArrowUpIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { cn } from '../../lib/utils';

interface MetricCardProps {
  title: string;
  value: string | number;
  change: number;
  icon?: React.ReactNode;
  prefix?: string;
  suffix?: string;
}

export function MetricCard({ title, value, change, icon, prefix, suffix }: MetricCardProps) {
  const isPositive = change >= 0;
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon && <div className="h-4 w-4 text-muted-foreground">{icon}</div>}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {prefix}{typeof value === 'number' ? value.toLocaleString() : value}{suffix}
        </div>
        <p className="flex items-center text-xs text-muted-foreground">
          <span
            className={cn(
              "mr-1 flex items-center",
              isPositive ? "text-green-500" : "text-red-500"
            )}
          >
            {isPositive ? <ArrowUpIcon className="h-3 w-3" /> : <ArrowDownIcon className="h-3 w-3" />}
            <span className="ml-1">{Math.abs(change)}%</span>
          </span>
          <span>from last period</span>
        </p>
      </CardContent>
    </Card>
  );
}