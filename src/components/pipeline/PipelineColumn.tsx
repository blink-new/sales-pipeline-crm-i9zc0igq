
import { useCrm } from '../../context/CrmContext';
import { PipelineStage } from '../../types';
import { DealCard } from './DealCard';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { cn } from '../../lib/utils';
import { Plus } from 'lucide-react';
import { Button } from '../ui/button';

interface PipelineColumnProps {
  stage: PipelineStage;
  onAddDeal: (stageId: string) => void;
}

export function PipelineColumn({ stage, onAddDeal }: PipelineColumnProps) {
  const { getDealsByStage } = useCrm();
  const deals = getDealsByStage(stage.id);
  
  const { setNodeRef, isOver } = useDroppable({
    id: stage.id,
  });
  
  const totalValue = deals.reduce((sum, deal) => sum + deal.value, 0);
  
  return (
    <div className="flex h-full min-w-[280px] flex-col rounded-md border bg-card shadow-sm transition-all duration-200 hover:shadow-md">
      <div className="flex items-center justify-between border-b p-3">
        <div className="flex items-center gap-2">
          <div className={cn("h-3 w-3 rounded-full", stage.color)} />
          <h3 className="font-medium">{stage.name}</h3>
          <span className="rounded-full bg-muted px-2 py-0.5 text-xs">
            {deals.length}
          </span>
        </div>
        <div className="text-sm font-medium">${totalValue.toLocaleString()}</div>
      </div>
      
      <div
        ref={setNodeRef}
        className={cn(
          "flex flex-1 flex-col gap-2 overflow-y-auto p-3 transition-colors duration-200",
          isOver && "bg-muted/50"
        )}
        data-stage-id={stage.id}
      >
        <SortableContext items={deals.map(deal => deal.id)} strategy={verticalListSortingStrategy}>
          {deals.map((deal) => (
            <DealCard key={deal.id} deal={deal} />
          ))}
        </SortableContext>
        
        {deals.length === 0 && (
          <div className="flex h-full flex-col items-center justify-center rounded-md border border-dashed p-4 text-center">
            <p className="text-sm text-muted-foreground">No deals in this stage</p>
          </div>
        )}
      </div>
      
      <div className="border-t p-2">
        <Button 
          variant="ghost" 
          className="w-full justify-start text-muted-foreground hover:text-foreground transition-colors"
          onClick={() => onAddDeal(stage.id)}
        >
          <Plus className="mr-1 h-4 w-4" />
          Add deal
        </Button>
      </div>
    </div>
  );
}