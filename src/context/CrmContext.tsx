
import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { 
  User, 
  Contact, 
  Deal, 
  PipelineStage, 
  Activity, 
  SalesMetric 
} from '../types';
import { 
  currentUser as initialUser,
  contacts as initialContacts,
  deals as initialDeals,
  pipelineStages as initialPipelineStages,
  activities as initialActivities,
  salesMetrics as initialSalesMetrics,
  generateContact,
  generateDeal,
  generateActivity
} from '../data/mock-data';

interface CrmContextType {
  // Data
  currentUser: User;
  contacts: Contact[];
  deals: Deal[];
  pipelineStages: PipelineStage[];
  activities: Activity[];
  salesMetrics: SalesMetric[];
  
  // Contact operations
  addContact: (contact: Partial<Contact>) => Contact;
  updateContact: (id: string, contact: Partial<Contact>) => Contact;
  deleteContact: (id: string) => void;
  getContactById: (id: string) => Contact | undefined;
  
  // Deal operations
  addDeal: (deal: Partial<Deal>) => Deal;
  updateDeal: (id: string, deal: Partial<Deal>) => Deal;
  deleteDeal: (id: string) => void;
  getDealById: (id: string) => Deal | undefined;
  updateDealStage: (dealId: string, newStage: string) => Deal;
  
  // Activity operations
  addActivity: (activity: Partial<Activity>) => Activity;
  updateActivity: (id: string, activity: Partial<Activity>) => Activity;
  deleteActivity: (id: string) => void;
  
  // Pipeline operations
  getDealsByStage: (stageId: string) => Deal[];
  
  // Utility functions
  getContactName: (contactId: string) => string;
}

const CrmContext = createContext<CrmContextType | undefined>(undefined);

export const CrmProvider = ({ children }: { children: ReactNode }) => {
  // State for all data
  const [currentUser, setCurrentUser] = useState<User>(initialUser);
  const [contacts, setContacts] = useState<Contact[]>(initialContacts);
  const [deals, setDeals] = useState<Deal[]>(initialDeals);
  const [pipelineStages, setPipelineStages] = useState<PipelineStage[]>(initialPipelineStages);
  const [activities, setActivities] = useState<Activity[]>(initialActivities);
  const [salesMetrics, setSalesMetrics] = useState<SalesMetric[]>(initialSalesMetrics);

  // Load data from localStorage on initial render
  useEffect(() => {
    const storedContacts = localStorage.getItem('crm-contacts');
    const storedDeals = localStorage.getItem('crm-deals');
    const storedActivities = localStorage.getItem('crm-activities');

    if (storedContacts) setContacts(JSON.parse(storedContacts));
    if (storedDeals) setDeals(JSON.parse(storedDeals));
    if (storedActivities) setActivities(JSON.parse(storedActivities));
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('crm-contacts', JSON.stringify(contacts));
    localStorage.setItem('crm-deals', JSON.stringify(deals));
    localStorage.setItem('crm-activities', JSON.stringify(activities));
  }, [contacts, deals, activities]);

  // Contact operations
  const addContact = (contactData: Partial<Contact>): Contact => {
    const newContact = generateContact(contactData);
    setContacts(prev => [...prev, newContact]);
    return newContact;
  };

  const updateContact = (id: string, contactData: Partial<Contact>): Contact => {
    const updatedContact = { ...getContactById(id)!, ...contactData };
    setContacts(prev => prev.map(contact => contact.id === id ? updatedContact : contact));
    return updatedContact;
  };

  const deleteContact = (id: string): void => {
    setContacts(prev => prev.filter(contact => contact.id !== id));
    // Also delete related deals
    setDeals(prev => prev.filter(deal => deal.contactId !== id));
    // And related activities
    setActivities(prev => prev.filter(activity => 
      !(activity.relatedTo.type === 'contact' && activity.relatedTo.id === id)
    ));
  };

  const getContactById = (id: string): Contact | undefined => {
    return contacts.find(contact => contact.id === id);
  };

  // Deal operations
  const addDeal = (dealData: Partial<Deal>): Deal => {
    const newDeal = generateDeal(dealData);
    setDeals(prev => [...prev, newDeal]);
    return newDeal;
  };

  const updateDeal = (id: string, dealData: Partial<Deal>): Deal => {
    const updatedDeal = { ...getDealById(id)!, ...dealData, updatedAt: new Date().toISOString() };
    setDeals(prev => prev.map(deal => deal.id === id ? updatedDeal : deal));
    return updatedDeal;
  };

  const deleteDeal = (id: string): void => {
    setDeals(prev => prev.filter(deal => deal.id !== id));
    // Also delete related activities
    setActivities(prev => prev.filter(activity => 
      !(activity.relatedTo.type === 'deal' && activity.relatedTo.id === id)
    ));
  };

  const getDealById = (id: string): Deal | undefined => {
    return deals.find(deal => deal.id === id);
  };

  const updateDealStage = (dealId: string, newStage: string): Deal => {
    return updateDeal(dealId, { stage: newStage });
  };

  // Activity operations
  const addActivity = (activityData: Partial<Activity>): Activity => {
    const newActivity = generateActivity(activityData);
    setActivities(prev => [...prev, newActivity]);
    return newActivity;
  };

  const updateActivity = (id: string, activityData: Partial<Activity>): Activity => {
    const activity = activities.find(a => a.id === id);
    if (!activity) throw new Error(`Activity with id ${id} not found`);
    
    const updatedActivity = { ...activity, ...activityData };
    setActivities(prev => prev.map(a => a.id === id ? updatedActivity : a));
    return updatedActivity;
  };

  const deleteActivity = (id: string): void => {
    setActivities(prev => prev.filter(activity => activity.id !== id));
  };

  // Pipeline operations
  const getDealsByStage = (stageId: string): Deal[] => {
    return deals.filter(deal => deal.stage === stageId);
  };

  // Utility functions
  const getContactName = (contactId: string): string => {
    const contact = contacts.find(c => c.id === contactId);
    return contact ? contact.name : 'Unknown Contact';
  };

  const value = {
    currentUser,
    contacts,
    deals,
    pipelineStages,
    activities,
    salesMetrics,
    addContact,
    updateContact,
    deleteContact,
    getContactById,
    addDeal,
    updateDeal,
    deleteDeal,
    getDealById,
    updateDealStage,
    addActivity,
    updateActivity,
    deleteActivity,
    getDealsByStage,
    getContactName,
  };

  return <CrmContext.Provider value={value}>{children}</CrmContext.Provider>;
};

export const useCrm = () => {
  const context = useContext(CrmContext);
  if (context === undefined) {
    throw new Error('useCrm must be used within a CrmProvider');
  }
  return context;
};