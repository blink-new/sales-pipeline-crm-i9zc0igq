
import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useCrm } from '../context/CrmContext';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { 
  ArrowLeft,
  Edit,
  Trash,
  Calendar,
  DollarSign,
  BarChart3,
  User,
  Plus,
  MessageSquare,
  Mail,
  Phone,
  CheckSquare
} from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';
import { toast } from 'sonner';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from '../components/ui/dialog';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../components/ui/alert-dialog';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Activity } from '../types';

export function DealDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { 
    getDealById, 
    updateDeal, 
    deleteDeal, 
    pipelineStages, 
    getContactById,
    activities,
    addActivity
  } = useCrm();
  
  const [isEditDealOpen, setIsEditDealOpen] = useState(false);
  const [isDeleteDealOpen, setIsDeleteDealOpen] = useState(false);
  const [isAddActivityOpen, setIsAddActivityOpen] = useState(false);
  
  const deal = getDealById(id!);
  
  if (!deal) {
    return (
      <div className="flex h-full flex-col items-center justify-center">
        <h2 className="text-2xl font-bold">Deal not found</h2>
        <p className="text-muted-foreground">The deal you're looking for doesn't exist.</p>
        <Button asChild className="mt-4">
          <Link to="/pipeline">Back to Pipeline</Link>
        </Button>
      </div>
    );
  }
  
  const contact = getContactById(deal.contactId);
  const stage = pipelineStages.find(s => s.id === deal.stage);
  
  // Get activities related to this deal
  const dealActivities = activities.filter(
    activity => activity.relatedTo.type === 'deal' && activity.relatedTo.id === deal.id
  );
  
  const handleDeleteDeal = () => {
    deleteDeal(deal.id);
    toast.success('Deal deleted successfully');
    navigate('/pipeline');
  };
  
  // Edit Deal Form State
  const [editName, setEditName] = useState(deal.name);
  const [editValue, setEditValue] = useState(deal.value.toString());
  const [editStage, setEditStage] = useState(deal.stage);
  const [editProbability, setEditProbability] = useState(deal.probability.toString());
  const [editExpectedCloseDate, setEditExpectedCloseDate] = useState(
    new Date(deal.expectedCloseDate).toISOString().split('T')[0]
  );
  const [editNotes, setEditNotes] = useState(deal.notes);
  
  // Add Activity Form State
  const [activityType, setActivityType] = useState<Activity['type']>('note');
  const [activityTitle, setActivityTitle] = useState('');
  const [activityDescription, setActivityDescription] = useState('');
  
  const handleEditDeal = (e: React.FormEvent) => {
    e.preventDefault();
    
    updateDeal(deal.id, {
      name: editName,
      value: parseFloat(editValue) || 0,
      stage: editStage,
      probability: parseInt(editProbability) || 0,
      expectedCloseDate: new Date(editExpectedCloseDate).toISOString(),
      notes: editNotes,
    });
    
    setIsEditDealOpen(false);
    toast.success('Deal updated successfully');
  };
  
  const handleAddActivity = (e: React.FormEvent) => {
    e.preventDefault();
    
    addActivity({
      type: activityType,
      title: activityTitle,
      description: activityDescription,
      relatedTo: {
        type: 'deal',
        id: deal.id,
      },
    });
    
    setIsAddActivityOpen(false);
    toast.success('Activity added successfully');
    
    // Reset form
    setActivityType('note');
    setActivityTitle('');
    setActivityDescription('');
  };
  
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
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="outline" size="sm" asChild>
          <Link to="/pipeline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Pipeline
          </Link>
        </Button>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setIsEditDealOpen(true)}>
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
          <Button variant="destructive" size="sm" onClick={() => setIsDeleteDealOpen(true)}>
            <Trash className="mr-2 h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>
      
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>{deal.name}</CardTitle>
            {stage && (
              <Badge 
                variant="outline" 
                className="mt-1 flex w-fit items-center gap-1 capitalize"
              >
                <span 
                  className={`h-2 w-2 rounded-full ${stage.color}`} 
                />
                {stage.name}
              </Badge>
            )}
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">${deal.value.toLocaleString()}</span>
              </div>
              
              <div className="flex items-center gap-2 text-sm">
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
                <span>{deal.probability}% probability</span>
              </div>
              
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>
                  Expected to close on {format(new Date(deal.expectedCloseDate), 'MMMM d, yyyy')}
                </span>
              </div>
              
              <div className="flex items-center gap-2 text-sm">
                <User className="h-4 w-4 text-muted-foreground" />
                {contact ? (
                  <Link 
                    to={`/contacts/${contact.id}`}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    {contact.name} ({contact.company})
                  </Link>
                ) : (
                  <span>Unknown Contact</span>
                )}
              </div>
              
              <div className="pt-4">
                <h3 className="mb-2 text-sm font-medium">Notes</h3>
                <p className="text-sm text-muted-foreground">
                  {deal.notes || 'No notes available.'}
                </p>
              </div>
              
              <div className="pt-2 text-xs text-muted-foreground">
                <p>Created {formatDistanceToNow(new Date(deal.createdAt), { addSuffix: true })}</p>
                <p>Last updated {formatDistanceToNow(new Date(deal.updatedAt), { addSuffix: true })}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className="md:col-span-2">
          <Tabs defaultValue="activities">
            <TabsList>
              <TabsTrigger value="activities">Activities</TabsTrigger>
            </TabsList>
            
            <TabsContent value="activities" className="mt-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium">Activities</h3>
                <Button size="sm" onClick={() => setIsAddActivityOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Activity
                </Button>
              </div>
              
              {dealActivities.length > 0 ? (
                <div className="space-y-4">
                  {dealActivities.map(activity => (
                    <Card key={activity.id}>
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                            {getActivityIcon(activity.type)}
                          </div>
                          <div className="space-y-1">
                            <div className="flex items-center justify-between">
                              <h4 className="text-base font-medium">{activity.title}</h4>
                              <span className="text-xs text-muted-foreground">
                                {formatDistanceToNow(new Date(activity.createdAt), { addSuffix: true })}
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {activity.type.charAt(0).toUpperCase() + activity.type.slice(1)}
                            </p>
                            <p className="text-sm">{activity.description}</p>
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
                      No activities recorded for this deal yet.
                    </p>
                    <Button size="sm" onClick={() => setIsAddActivityOpen(true)}>
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
      
      {/* Edit Deal Dialog */}
      <Dialog open={isEditDealOpen} onOpenChange={setIsEditDealOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Deal</DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleEditDeal} className="space-y-4 py-4">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Deal Name</Label>
                <Input
                  id="name"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="Enter deal name"
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="value">Value ($)</Label>
                  <Input
                    id="value"
                    type="number"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    placeholder="0"
                    min="0"
                    required
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="probability">Probability (%)</Label>
                  <Input
                    id="probability"
                    type="number"
                    value={editProbability}
                    onChange={(e) => setEditProbability(e.target.value)}
                    placeholder="50"
                    min="0"
                    max="100"
                    required
                  />
                </div>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="stage">Stage</Label>
                <Select value={editStage} onValueChange={setEditStage} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a stage" />
                  </SelectTrigger>
                  <SelectContent>
                    {pipelineStages.map((stage) => (
                      <SelectItem key={stage.id} value={stage.id}>
                        {stage.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="expectedCloseDate">Expected Close Date</Label>
                <Input
                  id="expectedCloseDate"
                  type="date"
                  value={editExpectedCloseDate}
                  onChange={(e) => setEditExpectedCloseDate(e.target.value)}
                  required
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  placeholder="Add any notes about this deal"
                  rows={3}
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsEditDealOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Save Changes</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
      {/* Delete Deal Dialog */}
      <AlertDialog open={isDeleteDealOpen} onOpenChange={setIsDeleteDealOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this deal and all associated activities.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteDeal} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      {/* Add Activity Dialog */}
      <Dialog open={isAddActivityOpen} onOpenChange={setIsAddActivityOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add Activity</DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleAddActivity} className="space-y-4 py-4">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="activityType">Activity Type</Label>
                <Select 
                  value={activityType} 
                  onValueChange={(value) => setActivityType(value as Activity['type'])}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select activity type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="note">Note</SelectItem>
                    <SelectItem value="call">Call</SelectItem>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="meeting">Meeting</SelectItem>
                    <SelectItem value="task">Task</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="activityTitle">Title</Label>
                <Input
                  id="activityTitle"
                  value={activityTitle}
                  onChange={(e) => setActivityTitle(e.target.value)}
                  placeholder="Enter activity title"
                  required
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="activityDescription">Description</Label>
                <Textarea
                  id="activityDescription"
                  value={activityDescription}
                  onChange={(e) => setActivityDescription(e.target.value)}
                  placeholder="Add details about this activity"
                  rows={3}
                  required
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsAddActivityOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Add Activity</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}