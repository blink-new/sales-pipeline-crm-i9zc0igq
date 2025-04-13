
import { useCrm } from '../../context/CrmContext';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { formatDistanceToNow } from 'date-fns';
import { Mail, Phone, Calendar, FileText, CheckSquare } from 'lucide-react';
import { cn } from '../../lib/utils';

export function RecentActivities() {
  const { activities, getContactName, getDealById } = useCrm();
  
  // Sort activities by date (newest first) and take the first 5
  const recentActivities = [...activities]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);
  
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'email':
        return <Mail className="h-4 w-4" />;
      case 'call':
        return <Phone className="h-4 w-4" />;
      case 'meeting':
        return <Calendar className="h-4 w-4" />;
      case 'note':
        return <FileText className="h-4 w-4" />;
      case 'task':
        return <CheckSquare className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };
  
  const getActivityColor = (type: string) => {
    switch (type) {
      case 'email':
        return 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400';
      case 'call':
        return 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400';
      case 'meeting':
        return 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400';
      case 'note':
        return 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'task':
        return 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400';
      default:
        return 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400';
    }
  };
  
  const getRelatedEntityName = (activity: any) => {
    if (activity.relatedTo.type === 'contact') {
      return getContactName(activity.relatedTo.id);
    } else {
      const deal = getDealById(activity.relatedTo.id);
      return deal ? deal.name : 'Unknown Deal';
    }
  };
  
  return (
    <Card className="col-span-1 h-full">
      <CardHeader>
        <CardTitle>Recent Activities</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {recentActivities.length > 0 ? (
          recentActivities.map((activity) => (
            <div key={activity.id} className="flex items-start space-x-3 animate-fade-in">
              <div className={cn('flex h-8 w-8 items-center justify-center rounded-full', getActivityColor(activity.type))}>
                {getActivityIcon(activity.type)}
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">{activity.title}</p>
                <p className="text-xs text-muted-foreground line-clamp-1">
                  {activity.description}
                </p>
                <div className="flex items-center text-xs text-muted-foreground">
                  <span className="font-medium">{getRelatedEntityName(activity)}</span>
                  <span className="mx-1">•</span>
                  <span>{formatDistanceToNow(new Date(activity.createdAt), { addSuffix: true })}</span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="flex h-[200px] items-center justify-center rounded-md border border-dashed">
            <p className="text-sm text-muted-foreground">No recent activities</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}