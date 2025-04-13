
import { useState } from 'react';
import { useCrm } from '../context/CrmContext';
import { PipelineColumn } from '../components/pipeline/PipelineColumn';
import { AddDealDialog } from '../components/pipeline/AddDealDialog';
import { Button } from '../components/ui/button';
import { Plus, Filter } from 'lucide-react';
import { 
  DndContext, 
  DragOverlay, 
  closestCenter,
  KeyboardSensor, 
  PointerSensor, 
  useSensor, 
  useSensors, 
  DragStartEvent, 
  DragEndEvent,
  DragOverEvent
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { Deal } from '../types';
import { DealCard } from '../components/pipeline/DealCard';
import { toast } from 'sonner';

export function Pipeline() {
  const { pipelineStages, deals, getDealById, updateDealStage } = useCrm();
  
  const [isAddDealOpen, setIsAddDealOpen] = useState(false);
  const [initialStage, setInitialStage] = useState<string | undefined>();
  const [activeDealId, setActiveDealId] = useState<string | null>(null);
  const [activeDroppableId, setActiveDroppableId] = useState<string | null>(null);
  
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );
  
  const handleDragStart = (event: DragStartEvent) => {
    setActiveDealId(event.active.id as string);
  };
  
  const handleDragOver = (event: DragOverEvent) => {
    const { over } = event;
    if (over) {
      // Check if we're over a stage
      const isStage = pipelineStages.some(stage => stage.id === over.id);
      if (isStage) {
        setActiveDroppableId(over.id as string);
      }
    }
  };
  
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over) {
      const dealId = active.id as string;
      let targetStageId = over.id as string;
      
      // Check if we're dropping on a deal or a stage
      const isDroppedOnDeal = deals.some(deal => deal.id === targetStageId);
      
      if (isDroppedOnDeal) {
        // If dropped on a deal, find the stage that contains this deal
        const targetDeal = getDealById(targetStageId);
        if (targetDeal) {
          targetStageId = targetDeal.stage;
        }
      }
      
      // If we have a valid stage ID from either direct drop or from activeDroppableId
      if (pipelineStages.some(stage => stage.id === targetStageId)) {
        const deal = getDealById(dealId);
        const oldStage = pipelineStages.find(stage => stage.id === deal?.stage);
        const newStage = pipelineStages.find(stage => stage.id === targetStageId);
        
        updateDealStage(dealId, targetStageId);
        
        if (oldStage && newStage && oldStage.id !== newStage.id) {
          toast.success(`Deal moved to ${newStage.name} stage`);
        }
      } else if (activeDroppableId) {
        // Fallback to the last known droppable area
        updateDealStage(dealId, activeDroppableId);
      }
    }
    
    // Reset states
    setActiveDealId(null);
    setActiveDroppableId(null);
  };
  
  const handleAddDeal = (stageId?: string) => {
    setInitialStage(stageId);
    setIsAddDealOpen(true);
  };
  
  const activeDeal = activeDealId ? getDealById(activeDealId) : null;
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Pipeline</h1>
          <p className="text-muted-foreground">
            Manage your deals through the sales pipeline
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
          <Button size="sm" onClick={() => handleAddDeal()}>
            <Plus className="mr-2 h-4 w-4" />
            Add Deal
          </Button>
        </div>
      </div>
      
      <div className="h-[calc(100vh-220px)] overflow-x-auto pb-4">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          <div className="flex h-full gap-4">
            {pipelineStages.map((stage) => (
              <PipelineColumn 
                key={stage.id} 
                stage={stage} 
                onAddDeal={handleAddDeal}
              />
            ))}
          </div>
          
          <DragOverlay>
            {activeDeal ? <DealCard deal={activeDeal} isDragging={true} /> : null}
          </DragOverlay>
        </DndContext>
      </div>
      
      <AddDealDialog 
        isOpen={isAddDealOpen} 
        onClose={() => setIsAddDealOpen(false)} 
        initialStage={initialStage}
      />
    </div>
  );
}