
import { useState, useEffect } from 'react';
import { useCrm } from '../../context/CrmContext';
import { Contact } from '../../types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Textarea } from '../ui/textarea';

interface AddDealDialogProps {
  isOpen: boolean;
  onClose: () => void;
  initialStage?: string;
}

export function AddDealDialog({ isOpen, onClose, initialStage }: AddDealDialogProps) {
  const { contacts, addDeal } = useCrm();
  
  const [name, setName] = useState('');
  const [value, setValue] = useState('');
  const [contactId, setContactId] = useState('');
  const [probability, setProbability] = useState('50');
  const [expectedCloseDate, setExpectedCloseDate] = useState('');
  const [notes, setNotes] = useState('');
  const [stage, setStage] = useState(initialStage || 'lead');
  
  // Reset form when dialog opens
  useEffect(() => {
    if (isOpen) {
      setName('');
      setValue('');
      setContactId('');
      setProbability('50');
      setExpectedCloseDate('');
      setNotes('');
      setStage(initialStage || 'lead');
    }
  }, [isOpen, initialStage]);
  
  // Set default close date to 30 days from now
  useEffect(() => {
    const date = new Date();
    date.setDate(date.getDate() + 30);
    setExpectedCloseDate(date.toISOString().split('T')[0]);
  }, []);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newDeal = {
      name,
      value: parseFloat(value) || 0,
      stage,
      contactId,
      probability: parseInt(probability) || 50,
      expectedCloseDate: new Date(expectedCloseDate).toISOString(),
      notes,
    };
    
    addDeal(newDeal);
    onClose();
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Deal</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Deal Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
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
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
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
                  value={probability}
                  onChange={(e) => setProbability(e.target.value)}
                  placeholder="50"
                  min="0"
                  max="100"
                  required
                />
              </div>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="contact">Contact</Label>
              <Select value={contactId} onValueChange={setContactId} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select a contact" />
                </SelectTrigger>
                <SelectContent>
                  {contacts.map((contact: Contact) => (
                    <SelectItem key={contact.id} value={contact.id}>
                      {contact.name} ({contact.company})
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
                value={expectedCloseDate}
                onChange={(e) => setExpectedCloseDate(e.target.value)}
                required
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add any notes about this deal"
                rows={3}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Add Deal</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}