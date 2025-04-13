
import { useState } from 'react';
import { useCrm } from '../context/CrmContext';
import { Contact } from '../types';
import { ContactsTable } from '../components/contacts/ContactsTable';
import { ContactDialog } from '../components/contacts/ContactDialog';
import { DeleteContactDialog } from '../components/contacts/DeleteContactDialog';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Plus, Search, Filter, UserPlus } from 'lucide-react';
import { toast } from 'sonner';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';

export function Contacts() {
  const { contacts, deleteContact } = useCrm();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isAddContactOpen, setIsAddContactOpen] = useState(false);
  const [isDeleteContactOpen, setIsDeleteContactOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState<Contact | undefined>();
  const [contactToDelete, setContactToDelete] = useState<string | null>(null);
  
  const filteredContacts = contacts.filter((contact) => {
    const matchesSearch = searchQuery === '' || 
      contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.phone.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || contact.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });
  
  const handleAddContact = () => {
    setSelectedContact(undefined);
    setIsAddContactOpen(true);
  };
  
  const handleEditContact = (contact: Contact) => {
    setSelectedContact(contact);
    setIsAddContactOpen(true);
  };
  
  const handleDeleteContact = (id: string) => {
    setContactToDelete(id);
    setIsDeleteContactOpen(true);
  };
  
  const confirmDeleteContact = () => {
    if (contactToDelete) {
      deleteContact(contactToDelete);
      toast.success('Contact deleted successfully');
      setIsDeleteContactOpen(false);
      setContactToDelete(null);
    }
  };
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Contacts</h1>
          <p className="text-muted-foreground">
            Manage your contacts and leads
          </p>
        </div>
        
        <Button onClick={handleAddContact}>
          <UserPlus className="mr-2 h-4 w-4" />
          Add Contact
        </Button>
      </div>
      
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search contacts..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex items-center gap-2">
          <Select
            value={statusFilter}
            onValueChange={setStatusFilter}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="lead">Leads</SelectItem>
              <SelectItem value="customer">Customers</SelectItem>
              <SelectItem value="lost">Lost</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            More Filters
          </Button>
        </div>
      </div>
      
      <ContactsTable 
        contacts={filteredContacts} 
        onEdit={handleEditContact}
        onDelete={handleDeleteContact}
      />
      
      <div className="text-center text-sm text-muted-foreground">
        Showing {filteredContacts.length} of {contacts.length} contacts
      </div>
      
      <ContactDialog 
        isOpen={isAddContactOpen} 
        onClose={() => setIsAddContactOpen(false)} 
        contact={selectedContact}
      />
      
      <DeleteContactDialog 
        isOpen={isDeleteContactOpen}
        onClose={() => setIsDeleteContactOpen(false)}
        onConfirm={confirmDeleteContact}
      />
    </div>
  );
}