
import { useState } from 'react';
import { useCrm } from '../context/CrmContext';
import { PipelineColumn } from '../components/pipeline/PipelineColumn';
import { AddDealDialog } from '../components/pipeline/AddDealDialog';
import { Button } from '../components/ui/button';
import { Plus, Filter } from 'lucide-react';
import { 
  DndContext, 
  DragOverlay, 
  closestCorners, 
  KeyboardSensor, 
  PointerSensor, 
  useSensor, 
  useSensors, 
  DragStartEvent, 
  DragEndEvent 
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { Deal } from '../types';
import { DealCard } from '../components/pipeline/DealCard';

export function Pipeline() {
  const { pipelineStages, deals, getDealById, updateDealStage } = useCrm();
  
  const [isAddDealOpen, setIsAddDealOpen] = useState(false);
  const [initialStage, setInitialStage] = useState<string | undefined>();
  const [activeDealId, setActiveDealId] = useState<string | null>(null);
  
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
  
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      const dealId = active.id as string;
      const newStage = over.id as string;
      
      updateDealStage(dealId, newStage);
    }
    
    setActiveDealId(null);
  };
  
  const handleAddDeal = (stageId?: string) => {
    setInitialStage(stageId);
    setIsAddDealOpen(true);
  };
  
  const activeDeal = activeDealId ? getDealById(activeDealId) : null;
  
  return (
    <div className="space-y-6">
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
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
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
            {activeDeal ? <DealCard deal={activeDeal as Deal} /> : null}
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