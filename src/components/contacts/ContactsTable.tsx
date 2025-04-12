
import { useState } from 'react';
import { useCrm } from '../../context/CrmContext';
import { Contact } from '../../types';
import { Link } from 'react-router-dom';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '../ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { 
  ChevronDown, 
  MoreHorizontal, 
  User, 
  Mail, 
  Phone, 
  Trash, 
  Edit, 
  Eye 
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface ContactsTableProps {
  contacts: Contact[];
  onEdit: (contact: Contact) => void;
  onDelete: (id: string) => void;
}

export function ContactsTable({ contacts, onEdit, onDelete }: ContactsTableProps) {
  const [sortField, setSortField] = useState<keyof Contact>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  
  const handleSort = (field: keyof Contact) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };
  
  const sortedContacts = [...contacts].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];
    
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortDirection === 'asc'
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }
    
    return 0;
  });
  
  const getStatusColor = (status: Contact['status']) => {
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
  
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[250px]">
              <Button 
                variant="ghost" 
                className="flex items-center gap-1 p-0 font-medium"
                onClick={() => handleSort('name')}
              >
                Name
                {sortField === 'name' && (
                  <ChevronDown 
                    className={`h-4 w-4 transition-transform ${
                      sortDirection === 'desc' ? 'rotate-180' : ''
                    }`} 
                  />
                )}
              </Button>
            </TableHead>
            <TableHead>
              <Button 
                variant="ghost" 
                className="flex items-center gap-1 p-0 font-medium"
                onClick={() => handleSort('company')}
              >
                Company
                {sortField === 'company' && (
                  <ChevronDown 
                    className={`h-4 w-4 transition-transform ${
                      sortDirection === 'desc' ? 'rotate-180' : ''
                    }`} 
                  />
                )}
              </Button>
            </TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Last Contacted</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedContacts.length > 0 ? (
            sortedContacts.map((contact) => (
              <TableRow key={contact.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={contact.avatar} alt={contact.name} />
                      <AvatarFallback>
                        <User className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{contact.name}</div>
                      <div className="text-xs text-muted-foreground">{contact.position}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{contact.company}</TableCell>
                <TableCell>
                  <a 
                    href={`mailto:${contact.email}`} 
                    className="flex items-center gap-1 text-muted-foreground hover:text-foreground"
                  >
                    <Mail className="h-3 w-3" />
                    <span className="text-xs">{contact.email}</span>
                  </a>
                </TableCell>
                <TableCell>
                  <a 
                    href={`tel:${contact.phone}`} 
                    className="flex items-center gap-1 text-muted-foreground hover:text-foreground"
                  >
                    <Phone className="h-3 w-3" />
                    <span className="text-xs">{contact.phone}</span>
                  </a>
                </TableCell>
                <TableCell>
                  <Badge 
                    variant="outline" 
                    className="flex w-fit items-center gap-1 capitalize"
                  >
                    <span 
                      className={`h-2 w-2 rounded-full ${getStatusColor(contact.status)}`} 
                    />
                    {contact.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(contact.lastContacted), { addSuffix: true })}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link to={`/contacts/${contact.id}`} className="flex items-center">
                          <Eye className="mr-2 h-4 w-4" />
                          View
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onEdit(contact)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => onDelete(contact.id)}
                        className="text-destructive focus:text-destructive"
                      >
                        <Trash className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={7} className="h-24 text-center">
                No contacts found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}