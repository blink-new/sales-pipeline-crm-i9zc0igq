
import { useState } from 'react';
import { useCrm } from '../context/CrmContext';
import { PipelineColumn } from '../components/pipeline/PipelineColumn';
import { AddDealDialog } from '../components/pipeline/AddDealDialog';
import { Button } from '../components/ui/button';
import { Plus, Filter, SlidersHorizontal } from 'lucide-react';
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Label } from '../components/ui/label';
import { Input } from '../components/ui/input';
import { Checkbox } from '../components/ui/checkbox';

export function Pipeline() {
  const { pipelineStages, deals, getDealById, updateDealStage } = useCrm();
  
  const [isAddDealOpen, setIsAddDealOpen] = useState(false);
  const [initialStage, setInitialStage] = useState<string | undefined>();
  const [activeDealId, setActiveDealId] = useState<string | null>(null);
  const [activeDroppableId, setActiveDroppableId] = useState<string | null>(null);
  const [filteredStages, setFilteredStages] = useState<string[]>(pipelineStages.map(stage => stage.id));
  const [minValue, setMinValue] = useState<string>("");
  const [maxValue, setMaxValue] = useState<string>("");
  
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
  
  const handleFilterStages = (stageId: string) => {
    setFilteredStages(prev => {
      if (prev.includes(stageId)) {
        return prev.filter(id => id !== stageId);
      } else {
        return [...prev, stageId];
      }
    });
  };
  
  const handleApplyFilters = () => {
    toast.success("Filters applied");
  };
  
  const handleResetFilters = () => {
    setFilteredStages(pipelineStages.map(stage => stage.id));
    setMinValue("");
    setMaxValue("");
    toast.success("Filters reset");
  };
  
  const activeDeal = activeDealId ? getDealById(activeDealId) : null;
  
  // Filter stages based on selection
  const visibleStages = pipelineStages.filter(stage => 
    filteredStages.includes(stage.id)
  );
  
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
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm">
                <Filter className="mr-2 h-4 w-4" />
                Filter
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="space-y-4">
                <h4 className="font-medium leading-none">Filter Pipeline</h4>
                <div className="space-y-2">
                  <Label>Stages</Label>
                  <div className="space-y-2">
                    {pipelineStages.map(stage => (
                      <div key={stage.id} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`stage-${stage.id}`} 
                          checked={filteredStages.includes(stage.id)}
                          onCheckedChange={() => handleFilterStages(stage.id)}
                        />
                        <Label htmlFor={`stage-${stage.id}`} className="flex items-center">
                          <div className={`mr-2 h-3 w-3 rounded-full ${stage.color}`} />
                          {stage.name}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Deal Value</Label>
                  <div className="flex items-center gap-2">
                    <Input 
                      placeholder="Min" 
                      type="number" 
                      value={minValue}
                      onChange={(e) => setMinValue(e.target.value)}
                    />
                    <span>to</span>
                    <Input 
                      placeholder="Max" 
                      type="number" 
                      value={maxValue}
                      onChange={(e) => setMaxValue(e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="flex justify-between">
                  <Button variant="outline" size="sm" onClick={handleResetFilters}>
                    Reset
                  </Button>
                  <Button size="sm" onClick={handleApplyFilters}>
                    Apply Filters
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
          
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
            {visibleStages.map((stage) => (
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