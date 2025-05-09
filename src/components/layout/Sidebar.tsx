
import { Link, useLocation } from 'react-router-dom';
import { cn } from '../../lib/utils';
import { 
  LayoutDashboard, 
  Users, 
  PieChart, 
  Settings, 
  ListFilter,
  Menu,
  X,
  Briefcase
} from 'lucide-react';
import { Button } from '../ui/button';
import { useState } from 'react';
import { useIsMobile } from '../../hooks/use-mobile';

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  to: string;
  active: boolean;
}

const SidebarItem = ({ icon, label, to, active }: SidebarItemProps) => {
  return (
    <Link to={to}>
      <div
        className={cn(
          'flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-all',
          active 
            ? 'bg-primary text-primary-foreground' 
            : 'text-muted-foreground hover:bg-muted hover:text-foreground'
        )}
      >
        {icon}
        <span>{label}</span>
      </div>
    </Link>
  );
};

export function Sidebar() {
  const location = useLocation();
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const sidebarItems = [
    {
      icon: <LayoutDashboard size={18} />,
      label: 'Dashboard',
      to: '/',
    },
    {
      icon: <ListFilter size={18} />,
      label: 'Pipeline',
      to: '/pipeline',
    },
    {
      icon: <Users size={18} />,
      label: 'Contacts',
      to: '/contacts',
    },
    {
      icon: <PieChart size={18} />,
      label: 'Analytics',
      to: '/analytics',
    },
    {
      icon: <Settings size={18} />,
      label: 'Settings',
      to: '/settings',
    },
  ];

  const sidebarContent = (
    <div className="flex h-full flex-col gap-2">
      <div className="px-3 py-4">
        <div className="mb-6 flex items-center gap-2 px-4">
          <Briefcase className="h-6 w-6 text-primary" />
          <h2 className="text-xl font-semibold tracking-tight">
            Sales CRM
          </h2>
        </div>
        <div className="space-y-1">
          {sidebarItems.map((item) => (
            <SidebarItem
              key={item.to}
              icon={item.icon}
              label={item.label}
              to={item.to}
              active={location.pathname === item.to}
            />
          ))}
        </div>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <>
        <Button
          variant="ghost"
          size="icon"
          className="fixed left-4 top-4 z-50 md:hidden"
          onClick={toggleSidebar}
        >
          <Menu size={20} />
        </Button>

        {isOpen && (
          <div className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm" onClick={toggleSidebar} />
        )}

        <div
          className={cn(
            "fixed inset-y-0 left-0 z-50 w-64 transform border-r bg-background p-4 shadow-lg transition-transform duration-200 ease-in-out",
            isOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <div className="flex justify-end">
            <Button variant="ghost" size="icon" onClick={toggleSidebar}>
              <X size={20} />
            </Button>
          </div>
          {sidebarContent}
        </div>
      </>
    );
  }

  return (
    <div className="hidden h-screen w-64 border-r bg-background md:block">
      {sidebarContent}
    </div>
  );
}