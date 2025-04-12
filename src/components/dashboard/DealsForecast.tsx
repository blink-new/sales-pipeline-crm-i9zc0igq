
import { useCrm } from '../../context/CrmContext';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Progress } from '../ui/progress';
import { formatDistanceToNow } from 'date-fns';

export function DealsForecast() {
  const { deals, getContactName } = useCrm();
  
  // Get deals that are in progress (not closed)
  const activeDeals = deals.filter(
    deal => deal.stage !== 'closed-won' && deal.stage !== 'closed-lost'
  );
  
  // Sort by probability (highest first)
  const sortedDeals = [...activeDeals]
    .sort((a, b) => b.probability - a.probability)
    .slice(0, 5);
  
  return (
    <Card className="col-span-1 h-full">
      <CardHeader>
        <CardTitle>Deals Forecast</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {sortedDeals.length > 0 ? (
            sortedDeals.map((deal) => (
              <div key={deal.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{deal.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {getContactName(deal.contactId)} · ${deal.value.toLocaleString()}
                    </p>
                  </div>
                  <div className="text-sm font-medium">{deal.probability}%</div>
                </div>
                <Progress value={deal.probability} className="h-2" />
                <p className="text-xs text-muted-foreground">
                  Expected to close {formatDistanceToNow(new Date(deal.expectedCloseDate), { addSuffix: true })}
                </p>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">No active deals</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}