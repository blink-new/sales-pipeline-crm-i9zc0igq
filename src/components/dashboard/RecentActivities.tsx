
import { useCrm } from '../../context/CrmContext';
import { formatDistanceToNow } from 'date-fns';
import { 
  Calendar, 
  Mail, 
  MessageSquare, 
  Phone, 
  CheckSquare 
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Activity } from '../../types';

export function RecentActivities() {
  const { activities, getContactName, getDealById } = useCrm();
  
  // Sort activities by date (newest first)
  const sortedActivities = [...activities]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);
  
  const getActivityIcon = (type: Activity['type']) => {
    switch (type) {
      case 'call':
        return <Phone className="h-4 w-4" />;
      case 'email':
        return <Mail className="h-4 w-4" />;
      case 'meeting':
        return <Calendar className="h-4 w-4" />;
      case 'note':
        return <MessageSquare className="h-4 w-4" />;
      case 'task':
        return <CheckSquare className="h-4 w-4" />;
      default:
        return <MessageSquare className="h-4 w-4" />;
    }
  };
  
  const getRelatedName = (activity: Activity) => {
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
      <CardContent>
        <div className="space-y-4">
          {sortedActivities.length > 0 ? (
            sortedActivities.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                  {getActivityIcon(activity.type)}
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {activity.title}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {activity.type.charAt(0).toUpperCase() + activity.type.slice(1)} with {getRelatedName(activity)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(activity.createdAt), { addSuffix: true })}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">No recent activities</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}