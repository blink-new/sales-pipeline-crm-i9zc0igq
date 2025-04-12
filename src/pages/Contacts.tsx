
import { useState } from 'react';
import { useCrm } from '../context/CrmContext';
import { Contact } from '../types';
import { ContactsTable } from '../components/contacts/ContactsTable';
import { ContactDialog } from '../components/contacts/ContactDialog';
import { DeleteContactDialog } from '../components/contacts/DeleteContactDialog';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Plus, Search, Filter } from 'lucide-react';
import { toast } from 'sonner';

export function Contacts() {
  const { contacts, deleteContact } = useCrm();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddContactOpen, setIsAddContactOpen] = useState(false);
  const [isDeleteContactOpen, setIsDeleteContactOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState<Contact | undefined>();
  const [contactToDelete, setContactToDelete] = useState<string | null>(null);
  
  const filteredContacts = contacts.filter((contact) => {
    const query = searchQuery.toLowerCase();
    return (
      contact.name.toLowerCase().includes(query) ||
      contact.email.toLowerCase().includes(query) ||
      contact.company.toLowerCase().includes(query) ||
      contact.phone.toLowerCase().includes(query)
    );
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Contacts</h1>
          <p className="text-muted-foreground">
            Manage your contacts and leads
          </p>
        </div>
        
        <Button onClick={handleAddContact}>
          <Plus className="mr-2 h-4 w-4" />
          Add Contact
        </Button>
      </div>
      
      <div className="flex items-center gap-2">
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
        
        <Button variant="outline">
          <Filter className="mr-2 h-4 w-4" />
          Filter
        </Button>
      </div>
      
      <ContactsTable 
        contacts={filteredContacts} 
        onEdit={handleEditContact}
        onDelete={handleDeleteContact}
      />
      
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