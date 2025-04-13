
import { useCrm } from '../../context/CrmContext';
import { Deal } from '../../types';
import { Card, CardContent } from '../ui/card';
import { formatDistanceToNow } from 'date-fns';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { cn } from '../../lib/utils';
import { useNavigate } from 'react-router-dom';

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
  
  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="touch-manipulation"
    >
      <Card 
        onClick={handleClick}
        className={cn(
          "mb-2 cursor-pointer border-l-4 hover:bg-accent",
          isCurrentlyDragging ? "opacity-50" : "opacity-100",
          deal.probability >= 70 ? "border-l-green-500" : 
          deal.probability >= 40 ? "border-l-yellow-500" : "border-l-red-500"
        )}
      >
        <CardContent className="p-3">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="font-medium line-clamp-1">{deal.name}</h3>
              <span className="rounded-full bg-primary/10 px-2 py-1 text-xs font-medium">
                ${deal.value.toLocaleString()}
              </span>
            </div>
            
            <div className="text-xs text-muted-foreground">
              <p className="line-clamp-1">{contactName}</p>
              <div className="flex items-center justify-between pt-1">
                <span>{deal.probability}% probability</span>
                <span>
                  {formatDistanceToNow(new Date(deal.expectedCloseDate), { addSuffix: true })}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}