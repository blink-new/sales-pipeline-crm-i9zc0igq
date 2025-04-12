
import { useCrm } from '../../context/CrmContext';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { formatDistanceToNow } from 'date-fns';
import { User } from 'lucide-react';
import { Link } from 'react-router-dom';

export function RecentContacts() {
  const { contacts } = useCrm();
  
  // Sort contacts by last contacted date (most recent first)
  const recentContacts = [...contacts]
    .sort((a, b) => new Date(b.lastContacted).getTime() - new Date(a.lastContacted).getTime())
    .slice(0, 5);
  
  return (
    <Card className="col-span-1 h-full">
      <CardHeader>
        <CardTitle>Recent Contacts</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentContacts.map((contact) => (
            <Link 
              key={contact.id} 
              to={`/contacts/${contact.id}`}
              className="flex items-center space-x-3 rounded-md p-2 transition-colors hover:bg-muted"
            >
              <Avatar className="h-10 w-10">
                <AvatarImage src={contact.avatar} alt={contact.name} />
                <AvatarFallback>
                  <User className="h-5 w-5" />
                </AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">{contact.name}</p>
                <p className="text-xs text-muted-foreground">{contact.company}</p>
                <p className="text-xs text-muted-foreground">
                Last contacted {formatDistanceToNow(new Date(contact.lastContacted), { addSuffix: true })}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}