
import { Bell, Search } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useCrm } from "../../context/CrmContext";
import { ThemeToggle } from "./ThemeToggle";
import { useIsMobile } from "../../hooks/use-mobile";

export function Header() {
  const { currentUser } = useCrm();
  const isMobile = useIsMobile();
  
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background px-4 md:px-6">
      {!isMobile && (
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search..."
            className="w-full rounded-full bg-muted pl-8 md:w-[300px]"
          />
        </div>
      )}
      
      <div className={`flex items-center gap-4 ${isMobile ? 'ml-auto' : ''}`}>
        <ThemeToggle />
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-primary"></span>
        </Button>
        
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8 border">
            <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
            <AvatarFallback>{currentUser.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="hidden md:block">
            <p className="text-sm font-medium leading-none">{currentUser.name}</p>
            <p className="text-xs text-muted-foreground">{currentUser.role}</p>
          </div>
        </div>
      </div>
    </header>
  );
}