
export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: string;
}

export interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  position: string;
  status: 'lead' | 'customer' | 'lost';
  notes: string;
  lastContacted: string;
  createdAt: string;
  assignedTo: string;
  avatar?: string;
}

export interface Deal {
  id: string;
  name: string;
  value: number;
  stage: string;
  contactId: string;
  probability: number;
  expectedCloseDate: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
  assignedTo: string;
}

export interface PipelineStage {
  id: string;
  name: string;
  color: string;
  order: number;
}

export interface Activity {
  id: string;
  type: 'note' | 'email' | 'call' | 'meeting' | 'task';
  title: string;
  description: string;
  createdAt: string;
  createdBy: string;
  relatedTo: {
    type: 'contact' | 'deal';
    id: string;
  };
  completed?: boolean;
  dueDate?: string;
}

export interface SalesMetric {
  id: string;
  name: string;
  value: number;
  previousValue: number;
  change: number;
  period: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
}