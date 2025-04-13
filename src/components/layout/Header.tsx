
import { Bell, Search } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useCrm } from "../../context/CrmContext";
import { ThemeToggle } from "./ThemeToggle";
import { useIsMobile } from "../../hooks/use-mobile";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "../ui/dropdown-menu";
import { toast } from "sonner";

export function Header() {
  const { currentUser, deals, contacts } = useCrm();
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchQuery.trim()) return;
    
    // Search for contacts
    const foundContact = contacts.find(contact => 
      contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    // Search for deals
    const foundDeal = deals.find(deal => 
      deal.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    if (foundContact) {
      navigate(`/contacts/${foundContact.id}`);
      toast.success(`Found contact: ${foundContact.name}`);
    } else if (foundDeal) {
      navigate(`/deals/${foundDeal.id}`);
      toast.success(`Found deal: ${foundDeal.name}`);
    } else {
      toast.error("No matching contacts or deals found");
    }
    
    setSearchQuery("");
  };
  
  const notifications = [
    { id: 1, title: "New lead assigned", time: "5 minutes ago" },
    { id: 2, title: "Deal moved to Negotiation", time: "1 hour ago" },
    { id: 3, title: "Meeting reminder: Tech Innovate", time: "Tomorrow, 10:00 AM" }
  ];
  
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background px-4 md:px-6">
      {!isMobile && (
        <form onSubmit={handleSearch} className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search contacts or deals..."
            className="w-full rounded-full bg-muted pl-8 md:w-[300px]"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </form>
      )}
      
      <div className={`flex items-center gap-4 ${isMobile ? 'ml-auto' : ''}`}>
        <ThemeToggle />
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-primary"></span>
              <span className="sr-only">Notifications</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {notifications.map(notification => (
              <DropdownMenuItem key={notification.id} className="cursor-pointer flex flex-col items-start py-2">
                <span className="font-medium">{notification.title}</span>
                <span className="text-xs text-muted-foreground">{notification.time}</span>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer justify-center font-medium">
              View all notifications
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex items-center gap-2 cursor-pointer">
              <Avatar className="h-8 w-8 border">
                <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
                <AvatarFallback>{currentUser.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="hidden md:block">
                <p className="text-sm font-medium leading-none">{currentUser.name}</p>
                <p className="text-xs text-muted-foreground">{currentUser.role}</p>
              </div>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => navigate("/settings")}>
              Profile Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => toast.info("Logged out successfully")}>
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}