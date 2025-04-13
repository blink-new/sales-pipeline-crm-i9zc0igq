
import { useState } from 'react';
import { useCrm } from '../context/CrmContext';
import { Contact } from '../types';
import { ContactsTable } from '../components/contacts/ContactsTable';
import { ContactDialog } from '../components/contacts/ContactDialog';
import { DeleteContactDialog } from '../components/contacts/DeleteContactDialog';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Plus, Search, Filter, UserPlus, SlidersHorizontal } from 'lucide-react';
import { toast } from 'sonner';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../components/ui/popover";
import { Label } from '../components/ui/label';
import { Checkbox } from '../components/ui/checkbox';

export function Contacts() {
  const { contacts, deleteContact } = useCrm();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isAddContactOpen, setIsAddContactOpen] = useState(false);
  const [isDeleteContactOpen, setIsDeleteContactOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState<Contact | undefined>();
  const [contactToDelete, setContactToDelete] = useState<string | null>(null);
  
  // Additional filters
  const [companyFilter, setCompanyFilter] = useState<string[]>([]);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  
  // Get unique companies for filtering
  const companies = Array.from(new Set(contacts.map(contact => contact.company)));
  
  const filteredContacts = contacts.filter((contact) => {
    const matchesSearch = searchQuery === '' || 
      contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.phone.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || contact.status === statusFilter;
    
    const matchesCompany = companyFilter.length === 0 || 
      companyFilter.includes(contact.company);
    
    return matchesSearch && matchesStatus && matchesCompany;
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
  
  const toggleCompanyFilter = (company: string) => {
    setCompanyFilter(prev => {
      if (prev.includes(company)) {
        return prev.filter(c => c !== company);
      } else {
        return [...prev, company];
      }
    });
  };
  
  const handleApplyFilters = () => {
    toast.success("Filters applied");
    setShowAdvancedFilters(false);
  };
  
  const handleResetFilters = () => {
    setCompanyFilter([]);
    setStatusFilter('all');
    setSearchQuery('');
    toast.success("Filters reset");
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
          
          <Popover open={showAdvancedFilters} onOpenChange={setShowAdvancedFilters}>
            <PopoverTrigger asChild>
              <Button variant="outline">
                <Filter className="mr-2 h-4 w-4" />
                More Filters
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="space-y-4">
                <h4 className="font-medium leading-none">Advanced Filters</h4>
                
                <div className="space-y-2">
                  <Label>Companies</Label>
                  <div className="max-h-40 overflow-y-auto space-y-2">
                    {companies.map(company => (
                      <div key={company} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`company-${company}`} 
                          checked={companyFilter.includes(company)}
                          onCheckedChange={() => toggleCompanyFilter(company)}
                        />
                        <Label htmlFor={`company-${company}`}>{company}</Label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="flex justify-between">
                  <Button variant="outline" size="sm" onClick={handleResetFilters}>
                    Reset All
                  </Button>
                  <Button size="sm" onClick={handleApplyFilters}>
                    Apply Filters
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
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