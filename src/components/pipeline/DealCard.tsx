
import { useCrm } from '../../context/CrmContext';
import { Deal } from '../../types';
import { Card, CardContent } from '../ui/card';
import { Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { formatDistanceToNow } from 'date-fns';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { cn } from '../../lib/utils';
import { useNavigate } from 'react-router-dom';
import { Calendar, DollarSign, User } from 'lucide-react';

interface DealCardProps {
  deal: Deal;
  isDragging?: boolean;
}

export function DealCard({ deal, isDragging = false }: DealCardProps) {
  const { getContactName } = useCrm();
  const contactName = getContactName(deal.contactId);
  const navigate = useNavigate();
  
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({ id: deal.id });
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  
  const handleClick = (e: React.MouseEvent) => {
    // Only navigate if we're not dragging
    if (!isSortableDragging) {
      navigate(`/deals/${deal.id}`);
    }
  };
  
  // Use either the prop or the internal dragging state
  const isCurrentlyDragging = isDragging || isSortableDragging;
  
  // Determine probability color
  const getProbabilityColor = () => {
    if (deal.probability >= 70) return "bg-green-500";
    if (deal.probability >= 40) return "bg-yellow-500";
    return "bg-red-500";
  };
  
  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="touch-manipulation group"
    >
      <Card 
        onClick={handleClick}
        className={cn(
          "mb-2 cursor-pointer border-l-4 transition-all duration-200 hover:shadow-md",
          isCurrentlyDragging ? "opacity-50 scale-95" : "opacity-100",
          getProbabilityColor()
        )}
      >
        <CardContent className="p-3">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="font-medium line-clamp-1 group-hover:text-primary transition-colors">{deal.name}</h3>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                      ${deal.value.toLocaleString()}
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Deal value</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            
            <div className="text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <User className="h-3 w-3" />
                <p className="line-clamp-1">{contactName}</p>
              </div>
              
              <div className="mt-2 flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <span className="inline-block h-2 w-2 rounded-full bg-current" />
                  <span>{deal.probability}% probability</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  <span>
                    {formatDistanceToNow(new Date(deal.expectedCloseDate), { addSuffix: true })}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}