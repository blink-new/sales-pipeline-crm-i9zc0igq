
import { useCrm } from '../context/CrmContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  LineChart,
  Line
} from 'recharts';
import { format, subMonths, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';
import { MetricCard } from '../components/dashboard/MetricCard';
import { DollarSign, BarChart3, TrendingUp, Users } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

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

// Enhanced colors for charts
const CHART_COLORS = {
  light: {
    primary: '#6366f1',
    secondary: '#22c55e',
    accent1: '#f59e0b',
    accent2: '#ec4899',
    accent3: '#8b5cf6',
    accent4: '#06b6d4'
  },
  dark: {
    primary: '#818cf8',
    secondary: '#4ade80',
    accent1: '#fbbf24',
    accent2: '#f472b6',
    accent3: '#a78bfa',
    accent4: '#22d3ee'
  }
};

export function Analytics() {
  const { deals, pipelineStages, salesMetrics, contacts } = useCrm();
  const { theme } = useTheme();
  
  // Determine if we're in dark mode
  const isDarkMode = theme === 'dark' || 
    (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
  
  // Get the appropriate color set based on theme
  const colors = isDarkMode ? CHART_COLORS.dark : CHART_COLORS.light;
  
  // Calculate total value for each stage
  const stageData = pipelineStages.map(stage => {
    const stageDeals = deals.filter(deal => deal.stage === stage.id);
    const totalValue = stageDeals.reduce((sum, deal) => sum + deal.value, 0);
    const count = stageDeals.length;
    
    return {
      name: stage.name,
      value: totalValue,
      count,
      color: stage.color,
    };
  });
  
  // Calculate deal size distribution
  const dealSizeRanges = [
    { name: '< $10k', min: 0, max: 10000 },
    { name: '$10k - $50k', min: 10000, max: 50000 },
    { name: '$50k - $100k', min: 50000, max: 100000 },
    { name: '> $100k', min: 100000, max: Infinity },
  ];
  
  const dealSizeData = dealSizeRanges.map(range => {
    const dealsInRange = deals.filter(
      deal => deal.value >= range.min && deal.value < range.max
    );
    
    return {
      name: range.name,
      count: dealsInRange.length,
      value: dealsInRange.reduce((sum, deal) => sum + deal.value, 0),
    };
  });
  
  // Generate monthly trend data for the last 6 months
  const generateMonthlyData = () => {
    const months = [];
    const today = new Date();
    
    for (let i = 5; i >= 0; i--) {
      const month = subMonths(today, i);
      const monthStart = startOfMonth(month);
      const monthEnd = endOfMonth(month);
      
      const monthDeals = deals.filter(deal => {
        const dealDate = new Date(deal.createdAt);
        return dealDate >= monthStart && dealDate <= monthEnd;
      });
      
      const wonDeals = monthDeals.filter(deal => deal.stage === 'closed-won');
      
      months.push({
        name: format(month, 'MMM yyyy'),
        deals: monthDeals.length,
        value: monthDeals.reduce((sum, deal) => sum + deal.value, 0),
        won: wonDeals.reduce((sum, deal) => sum + deal.value, 0),
      });
    }
    
    return months;
  };
  
  const monthlyData = generateMonthlyData();
  
  // Custom tooltip for charts
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-lg border bg-background p-2 shadow-sm">
          <p className="text-sm font-medium">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm text-muted-foreground">
              {entry.name}: ${entry.value.toLocaleString()}
            </p>
          ))}
        </div>
      );
    }
    
    return null;
  };
  
  // Calculate contact acquisition over time
  const contactAcquisitionData = () => {
    const months = [];
    const today = new Date();
    
    for (let i = 5; i >= 0; i--) {
      const month = subMonths(today, i);
      const monthStart = startOfMonth(month);
      const monthEnd = endOfMonth(month);
      
      const newContacts = contacts.filter(contact => {
        const contactDate = new Date(contact.createdAt);
        return contactDate >= monthStart && contactDate <= monthEnd;
      });
      
      months.push({
        name: format(month, 'MMM yyyy'),
        contacts: newContacts.length,
      });
    }
    
    return months;
  };
  
  const contactData = contactAcquisitionData();
  
  // COLORS for pie chart - using our enhanced colors
  const PIE_COLORS = [
    colors.primary,
    colors.secondary,
    colors.accent1,
    colors.accent2,
    colors.accent3,
    colors.accent4
  ];
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
        <p className="text-muted-foreground">
          Analyze your sales performance and trends
        </p>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Total Pipeline Value"
          value={salesMetrics[0].value}
          change={salesMetrics[0].change}
          icon={<DollarSign className="h-4 w-4" />}
          prefix="$"
        />
        <MetricCard
          title="Deals Won"
          value={salesMetrics[1].value}
          change={salesMetrics[1].change}
          icon={<TrendingUp className="h-4 w-4" />}
          prefix="$"
        />
        <MetricCard
          title="Win Rate"
          value={salesMetrics[2].value}
          change={salesMetrics[2].change}
          icon={<BarChart3 className="h-4 w-4" />}
          suffix="%"
        />
        <MetricCard
          title="Average Deal Size"
          value={salesMetrics[3].value}
          change={salesMetrics[3].change}
          icon={<Users className="h-4 w-4" />}
          prefix="$"
        />
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Pipeline Value by Stage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
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
                    tickFormatter={(value) => `$${value / 1000}k`}
                    tick={{ fontSize: 12 }}
                    tickLine={false}
                    axisLine={false}
                    width={60}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar 
                    dataKey="value" 
                    radius={[4, 4, 0, 0]}
                  >
                    {stageData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={colorMapping[entry.color as keyof typeof colorMapping]?.[isDarkMode ? 'dark' : 'light'] || colors.primary}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Deal Distribution by Stage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stageData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    dataKey="count"
                    label={({ name, percent }) => 
                      `${name}: ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {stageData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Legend />
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Monthly Sales Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={monthlyData}
                  margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                  <XAxis 
                    dataKey="name" 
                    tick={{ fontSize: 12 }} 
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis 
                    tickFormatter={(value) => `$${value / 1000}k`}
                    tick={{ fontSize: 12 }}
                    tickLine={false}
                    axisLine={false}
                    width={60}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    name="Pipeline Value" 
                    stroke={colors.primary}
                    activeDot={{ r: 8 }} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="won" 
                    name="Won Deals" 
                    stroke={colors.secondary}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Deal Size Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={dealSizeData}
                  margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                  <XAxis 
                    dataKey="name" 
                    tick={{ fontSize: 12 }} 
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis 
                    yAxisId="left"
                    orientation="left"
                    tickFormatter={(value) => `${value}`}
                    tick={{ fontSize: 12 }}
                    tickLine={false}
                    axisLine={false}
                    width={30}
                  />
                  <YAxis 
                    yAxisId="right"
                    orientation="right"
                    tickFormatter={(value) => `$${value / 1000}k`}
                    tick={{ fontSize: 12 }}
                    tickLine={false}
                    axisLine={false}
                    width={60}
                  />
                  <Tooltip />
                  <Legend />
                  <Bar 
                    yAxisId="left"
                    dataKey="count" 
                    name="Number of Deals" 
                    fill={colors.primary}
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar 
                    yAxisId="right"
                    dataKey="value" 
                    name="Total Value" 
                    fill={colors.secondary}
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Contact Acquisition</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={contactData}
                  margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                  <XAxis 
                    dataKey="name" 
                    tick={{ fontSize: 12 }} 
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis 
                    tickFormatter={(value) => `${value}`}
                    tick={{ fontSize: 12 }}
                    tickLine={false}
                    axisLine={false}
                    width={30}
                  />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="contacts" 
                    name="New Contacts" 
                    stroke={colors.accent1}
                    activeDot={{ r: 8 }} 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}