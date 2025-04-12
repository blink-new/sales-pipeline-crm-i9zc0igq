
import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useCrm } from '../context/CrmContext';
import { ContactDialog } from '../components/contacts/ContactDialog';
import { DeleteContactDialog } from '../components/contacts/DeleteContactDialog';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { 
  User, 
  Mail, 
  Phone, 
  Building, 
  Calendar, 
  Edit, 
  Trash, 
  ArrowLeft,
  Plus
} from 'lucide-react';
import { formatDistanceToNow, format } from 'date-fns';
import { toast } from 'sonner';

export function ContactDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getContactById, deleteContact, deals, activities, addDeal } = useCrm();
  
  const [isEditContactOpen, setIsEditContactOpen] = useState(false);
  const [isDeleteContactOpen, setIsDeleteContactOpen] = useState(false);
  
  const contact = getContactById(id!);
  
  if (!contact) {
    return (
      <div className="flex h-full flex-col items-center justify-center">
        <h2 className="text-2xl font-bold">Contact not found</h2>
        <p className="text-muted-foreground">The contact you're looking for doesn't exist.</p>
        <Button asChild className="mt-4">
          <Link to="/contacts">Back to Contacts</Link>
        </Button>
      </div>
    );
  }
  
  // Get deals for this contact
  const contactDeals = deals.filter(deal => deal.contactId === contact.id);
  
  // Get activities related to this contact
  const contactActivities = activities.filter(
    activity => activity.relatedTo.type === 'contact' && activity.relatedTo.id === contact.id
  );
  
  const handleDeleteContact = () => {
    deleteContact(contact.id);
    toast.success('Contact deleted successfully');
    navigate('/contacts');
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'lead':
        return 'bg-blue-500';
      case 'customer':
        return 'bg-green-500';
      case 'lost':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };
  
  const handleAddDeal = () => {
    const newDeal = addDeal({
      name: `New deal for ${contact.name}`,
      contactId: contact.id,
    });
    
    navigate(`/deals/${newDeal.id}`);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="outline" size="sm" asChild>
          <Link to="/contacts">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Contacts
          </Link>
        </Button>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setIsEditContactOpen(true)}>
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
          <Button variant="destructive" size="sm" onClick={() => setIsDeleteContactOpen(true)}>
            <Trash className="mr-2 h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>
      
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-1">
          <CardHeader className="flex flex-row items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={contact.avatar} alt={contact.name} />
              <AvatarFallback>
                <User className="h-8 w-8" />
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle>{contact.name}</CardTitle>
              <CardDescription>{contact.position}</CardDescription>
              <Badge 
                variant="outline" 
                className="mt-1 flex w-fit items-center gap-1 capitalize"
              >
                <span 
                  className={`h-2 w-2 rounded-full ${getStatusColor(contact.status)}`} 
                />
                {contact.status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <a 
                  href={`mailto:${contact.email}`} 
                  className="text-muted-foreground hover:text-foreground"
                >
                  {contact.email}
                </a>
              </div>
              
              <div className="flex items-center gap-2 text-sm">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <a 
                  href={`tel:${contact.phone}`} 
                  className="text-muted-foreground hover:text-foreground"
                >
                  {contact.phone}
                </a>
              </div>
              
              <div className="flex items-center gap-2 text-sm">
                <Building className="h-4 w-4 text-muted-foreground" />
                <span>{contact.company}</span>
              </div>
              
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>
                  Last contacted {formatDistanceToNow(new Date(contact.lastContacted), { addSuffix: true })}
                </span>
              </div>
              
              <div className="pt-4">
                <h3 className="mb-2 text-sm font-medium">Notes</h3>
                <p className="text-sm text-muted-foreground">
                  {contact.notes || 'No notes available.'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className="md:col-span-2">
          <Tabs defaultValue="deals">
            <TabsList>
              <TabsTrigger value="deals">Deals</TabsTrigger>
              <TabsTrigger value="activities">Activities</TabsTrigger>
            </TabsList>
            
            <TabsContent value="deals" className="mt-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium">Deals</h3>
                <Button size="sm" onClick={handleAddDeal}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Deal
                </Button>
              </div>
              
              {contactDeals.length > 0 ? (
                <div className="space-y-4">
                  {contactDeals.map(deal => (
                    <Card key={deal.id}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <Link 
                              to={`/deals/${deal.id}`}
                              className="text-base font-medium hover:underline"
                            >
                              {deal.name}
                            </Link>
                            <p className="text-sm text-muted-foreground">
                              {deal.stage.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())} · 
                              ${deal.value.toLocaleString()} · 
                              {deal.probability}% probability
                            </p>
                          </div>
                          <Badge variant="outline">
                            Expected close: {format(new Date(deal.expectedCloseDate), 'MMM d, yyyy')}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center p-6">
                    <p className="mb-4 text-center text-muted-foreground">
                      No deals associated with this contact yet.
                    </p>
                    <Button size="sm" onClick={handleAddDeal}>
                      <Plus className="mr-2 h-4 w-4" />
                      Create a Deal
                    </Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
            
            <TabsContent value="activities" className="mt-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium">Activities</h3>
                <Button size="sm">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Activity
                </Button>
              </div>
              
              {contactActivities.length > 0 ? (
                <div className="space-y-4">
                  {contactActivities.map(activity => (
                    <Card key={activity.id}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="text-base font-medium">{activity.title}</h4>
                            <p className="text-sm text-muted-foreground">
                              {activity.type.charAt(0).toUpperCase() + activity.type.slice(1)} · 
                              {formatDistanceToNow(new Date(activity.createdAt), { addSuffix: true })}
                            </p>
                            <p className="mt-2 text-sm">{activity.description}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center p-6">
                    <p className="mb-4 text-center text-muted-foreground">
                      No activities recorded for this contact yet.
                    </p>
                    <Button size="sm">
                      <Plus className="mr-2 h-4 w-4" />
                      Add Activity
                    </Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      <ContactDialog 
        isOpen={isEditContactOpen} 
        onClose={() => setIsEditContactOpen(false)} 
        contact={contact}
      />
      
      <DeleteContactDialog 
        isOpen={isDeleteContactOpen}
        onClose={() => setIsDeleteContactOpen(false)}
        onConfirm={handleDeleteContact}
      />
    </div>
  );
}