
import { v4 as uuidv4 } from 'uuid';
import { User, Contact, Deal, PipelineStage, Activity, SalesMetric } from '../types';

// Current user
export const currentUser: User = {
  id: '1',
  name: 'John Doe',
  email: 'john.doe@example.com',
  avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  role: 'Sales Manager'
};

// Pipeline stages
export const pipelineStages: PipelineStage[] = [
  { id: 'lead', name: 'Lead', color: 'bg-blue-500', order: 0 },
  { id: 'discovery', name: 'Discovery', color: 'bg-purple-500', order: 1 },
  { id: 'proposal', name: 'Proposal', color: 'bg-yellow-500', order: 2 },
  { id: 'negotiation', name: 'Negotiation', color: 'bg-orange-500', order: 3 },
  { id: 'closed-won', name: 'Closed Won', color: 'bg-green-500', order: 4 },
  { id: 'closed-lost', name: 'Closed Lost', color: 'bg-red-500', order: 5 }
];

// Contacts
export const contacts: Contact[] = [
  {
    id: '1',
    name: 'Alice Johnson',
    email: 'alice@techinnovate.com',
    phone: '(555) 123-4567',
    company: 'Tech Innovate',
    position: 'CTO',
    status: 'lead',
    notes: 'Met at TechCrunch conference. Interested in our enterprise solution.',
    lastContacted: '2023-06-15T10:30:00Z',
    createdAt: '2023-06-10T08:15:00Z',
    assignedTo: '1',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
  },
  {
    id: '2',
    name: 'Bob Smith',
    email: 'bob@globalcorp.com',
    phone: '(555) 987-6543',
    company: 'Global Corp',
    position: 'Procurement Manager',
    status: 'customer',
    notes: 'Current customer looking to upgrade their package.',
    lastContacted: '2023-06-18T14:45:00Z',
    createdAt: '2023-01-20T11:30:00Z',
    assignedTo: '1',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
  },
  {
    id: '3',
    name: 'Carol Martinez',
    email: 'carol@startupvision.co',
    phone: '(555) 234-5678',
    company: 'Startup Vision',
    position: 'CEO',
    status: 'lead',
    notes: 'Startup founder looking for scalable solutions.',
    lastContacted: '2023-06-12T09:15:00Z',
    createdAt: '2023-06-05T16:20:00Z',
    assignedTo: '1',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
  },
  {
    id: '4',
    name: 'David Wilson',
    email: 'david@megaretail.com',
    phone: '(555) 345-6789',
    company: 'Mega Retail',
    position: 'IT Director',
    status: 'lead',
    notes: 'Looking to modernize their CRM system.',
    lastContacted: '2023-06-17T11:00:00Z',
    createdAt: '2023-06-01T10:45:00Z',
    assignedTo: '1',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
  },
  {
    id: '5',
    name: 'Eva Brown',
    email: 'eva@financepro.org',
    phone: '(555) 456-7890',
    company: 'Finance Pro',
    position: 'CFO',
    status: 'customer',
    notes: 'Long-term customer with multiple contracts.',
    lastContacted: '2023-06-16T15:30:00Z',
    createdAt: '2022-11-15T09:30:00Z',
    assignedTo: '1',
    avatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
  }
];

// Deals
export const deals: Deal[] = [
  {
    id: '1',
    name: 'Tech Innovate Enterprise Package',
    value: 75000,
    stage: 'discovery',
    contactId: '1',
    probability: 60,
    expectedCloseDate: '2023-08-15T00:00:00Z',
    notes: 'Need to schedule a demo with their technical team.',
    createdAt: '2023-06-12T09:30:00Z',
    updatedAt: '2023-06-18T14:15:00Z',
    assignedTo: '1'
  },
  {
    id: '2',
    name: 'Global Corp Upgrade',
    value: 45000,
    stage: 'negotiation',
    contactId: '2',
    probability: 80,
    expectedCloseDate: '2023-07-20T00:00:00Z',
    notes: 'Negotiating final terms. They want additional user licenses.',
    createdAt: '2023-06-05T11:45:00Z',
    updatedAt: '2023-06-17T16:30:00Z',
    assignedTo: '1'
  },
  {
    id: '3',
    name: 'Startup Vision Initial Package',
    value: 15000,
    stage: 'proposal',
    contactId: '3',
    probability: 50,
    expectedCloseDate: '2023-08-05T00:00:00Z',
    notes: 'Sent proposal. Waiting for feedback.',
    createdAt: '2023-06-10T10:15:00Z',
    updatedAt: '2023-06-15T09:45:00Z',
    assignedTo: '1'
  },
  {
    id: '4',
    name: 'Mega Retail CRM Overhaul',
    value: 120000,
    stage: 'lead',
    contactId: '4',
    probability: 30,
    expectedCloseDate: '2023-09-30T00:00:00Z',
    notes: 'Initial discussions. Need to schedule a needs assessment meeting.',
    createdAt: '2023-06-08T14:30:00Z',
    updatedAt: '2023-06-14T11:20:00Z',
    assignedTo: '1'
  },
  {
    id: '5',
    name: 'Finance Pro Contract Renewal',
    value: 65000,
    stage: 'closed-won',
    contactId: '5',
    probability: 100,
    expectedCloseDate: '2023-06-10T00:00:00Z',
    notes: 'Contract signed for another year with 10% increase.',
    createdAt: '2023-05-15T09:00:00Z',
    updatedAt: '2023-06-10T15:45:00Z',
    assignedTo: '1'
  },
  {
    id: '6',
    name: 'Tech Innovate Training Package',
    value: 12000,
    stage: 'proposal',
    contactId: '1',
    probability: 70,
    expectedCloseDate: '2023-07-25T00:00:00Z',
    notes: 'Additional training services for their team.',
    createdAt: '2023-06-14T13:15:00Z',
    updatedAt: '2023-06-18T10:30:00Z',
    assignedTo: '1'
  }
];

// Activities
export const activities: Activity[] = [
  {
    id: '1',
    type: 'call',
    title: 'Initial discovery call',
    description: 'Discussed their needs and potential solutions.',
    createdAt: '2023-06-12T10:30:00Z',
    createdBy: '1',
    relatedTo: {
      type: 'deal',
      id: '1'
    }
  },
  {
    id: '2',
    type: 'email',
    title: 'Sent proposal',
    description: 'Emailed the detailed proposal with pricing options.',
    createdAt: '2023-06-15T14:45:00Z',
    createdBy: '1',
    relatedTo: {
      type: 'deal',
      id: '3'
    }
  },
  {
    id: '3',
    type: 'meeting',
    title: 'Contract negotiation',
    description: 'Met with their legal team to discuss contract terms.',
    createdAt: '2023-06-17T11:00:00Z',
    createdBy: '1',
    relatedTo: {
      type: 'deal',
      id: '2'
    }
  },
  {
    id: '4',
    type: 'note',
    title: 'Follow-up required',
    description: 'Need to check back next week about their decision.',
    createdAt: '2023-06-18T09:15:00Z',
    createdBy: '1',
    relatedTo: {
      type: 'contact',
      id: '4'
    }
  },
  {
    id: '5',
    type: 'task',
    title: 'Prepare demo',
    description: 'Set up customized demo for their technical team.',
    createdAt: '2023-06-16T15:30:00Z',
    createdBy: '1',
    relatedTo: {
      type: 'deal',
      id: '1'
    },
    completed: false,
    dueDate: '2023-06-22T10:00:00Z'
  }
];

// Sales metrics
export const salesMetrics: SalesMetric[] = [
  {
    id: '1',
    name: 'Total Pipeline Value',
    value: 332000,
    previousValue: 285000,
    change: 16.5,
    period: 'monthly'
  },
  {
    id: '2',
    name: 'Deals Won',
    value: 65000,
    previousValue: 48000,
    change: 35.4,
    period: 'monthly'
  },
  {
    id: '3',
    name: 'Win Rate',
    value: 35,
    previousValue: 32,
    change: 9.4,
    period: 'monthly'
  },
  {
    id: '4',
    name: 'Average Deal Size',
    value: 55333,
    previousValue: 51000,
    change: 8.5,
    period: 'monthly'
  }
];

// Function to generate a new contact
export const generateContact = (data: Partial<Contact>): Contact => {
  return {
    id: uuidv4(),
    name: '',
    email: '',
    phone: '',
    company: '',
    position: '',
    status: 'lead',
    notes: '',
    lastContacted: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    assignedTo: currentUser.id,
    ...data
  };
};

// Function to generate a new deal
export const generateDeal = (data: Partial<Deal>): Deal => {
  return {
    id: uuidv4(),
    name: '',
    value: 0,
    stage: 'lead',
    contactId: '',
    probability: 0,
    expectedCloseDate: new Date().toISOString(),
    notes: '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    assignedTo: currentUser.id,
    ...data
  };
};

// Function to generate a new activity
export const generateActivity = (data: Partial<Activity>): Activity => {
  return {
    id: uuidv4(),
    type: 'note',
    title: '',
    description: '',
    createdAt: new Date().toISOString(),
    createdBy: currentUser.id,
    relatedTo: {
      type: 'contact',
      id: ''
    },
    ...data
  };
};