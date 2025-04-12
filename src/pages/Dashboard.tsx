
import { useCrm } from '../context/CrmContext';
import { MetricCard } from '../components/dashboard/MetricCard';
import { RecentActivities } from '../components/dashboard/RecentActivities';
import { DealsForecast } from '../components/dashboard/DealsForecast';
import { SalesChart } from '../components/dashboard/SalesChart';
import { RecentContacts } from '../components/dashboard/RecentContacts';
import { DollarSign, Users, BarChart3, TrendingUp } from 'lucide-react';

export function Dashboard() {
  const { salesMetrics } = useCrm();
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of your sales performance and activities
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
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <SalesChart />
        <RecentActivities />
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
        <DealsForecast />
        <RecentContacts />
      </div>
    </div>
  );
}