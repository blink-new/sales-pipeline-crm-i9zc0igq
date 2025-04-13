
import { useCrm } from '../../context/CrmContext';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { cn } from '../../lib/utils';
import { useState } from 'react';
import { Button } from '../ui/button';
import { useTheme } from '../../context/ThemeContext';

// Define color mapping for dark mode
const colorMapping = {
  'bg-blue-500': {
    light: 'rgba(59, 130, 246, 0.8)',
    dark: 'rgba(96, 165, 250, 0.8)'
  },
  'bg-purple-500': {
    light: 'rgba(168, 85, 247, 0.8)',
    dark: 'rgba(192, 132, 252, 0.8)'
  },
  'bg-yellow-500': {
    light: 'rgba(234, 179, 8, 0.8)',
    dark: 'rgba(250, 204, 21, 0.8)'
  },
  'bg-orange-500': {
    light: 'rgba(249, 115, 22, 0.8)',
    dark: 'rgba(251, 146, 60, 0.8)'
  },
  'bg-green-500': {
    light: 'rgba(34, 197, 94, 0.8)',
    dark: 'rgba(74, 222, 128, 0.8)'
  },
  'bg-red-500': {
    light: 'rgba(239, 68, 68, 0.8)',
    dark: 'rgba(248, 113, 113, 0.8)'
  }
};

export function SalesChart() {
  const { deals, pipelineStages } = useCrm();
  const [chartType, setChartType] = useState<'value' | 'count'>('value');
  const { theme } = useTheme();
  
  // Determine if we're in dark mode
  const isDarkMode = theme === 'dark' || 
    (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
  
  // Calculate data for each stage
  const stageData = pipelineStages.map(stage => {
    const stageDeals = deals.filter(deal => deal.stage === stage.id);
    const totalValue = stageDeals.reduce((sum, deal) => sum + deal.value, 0);
    const count = stageDeals.length;
    
    return {
      name: stage.name,
      value: totalValue,
      count: count,
      color: stage.color,
    };
  });
  
  // Custom tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="rounded-lg border bg-background p-3 shadow-md">
          <p className="text-sm font-medium">{data.name}</p>
          <p className="text-sm text-muted-foreground">
            {chartType === 'value' 
              ? `$${data.value.toLocaleString()}`
              : `${data.count} deal${data.count !== 1 ? 's' : ''}`
            }
          </p>
        </div>
      );
    }
    
    return null;
  };
  
  return (
    <Card className="col-span-2 h-full overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle>Pipeline Overview</CardTitle>
        <div className="flex space-x-2">
          <Button 
            variant={chartType === 'value' ? "default" : "outline"} 
            size="sm"
            onClick={() => setChartType('value')}
            className="h-8 text-xs"
          >
            Value
          </Button>
          <Button 
            variant={chartType === 'count' ? "default" : "outline"} 
            size="sm"
            onClick={() => setChartType('count')}
            className="h-8 text-xs"
          >
            Count
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full animate-fade-in">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={stageData} margin={{ top: 10, right: 10, left: 10, bottom: 30 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
              <XAxis 
                dataKey="name" 
                tick={{ fontSize: 12 }} 
                tickLine={false}
                axisLine={false}
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis 
                tickFormatter={(value) => 
                  chartType === 'value' 
                    ? `$${value / 1000}k` 
                    : value.toString()
                }
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
                width={60}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey={chartType}
                radius={[4, 4, 0, 0]}
              >
                {stageData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={colorMapping[entry.color as keyof typeof colorMapping]?.[isDarkMode ? 'dark' : 'light'] || '#8884d8'}
                    className="transition-opacity hover:opacity-100"
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}