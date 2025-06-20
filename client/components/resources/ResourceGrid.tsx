import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { settlementApi, taskApi } from '../../api/client';
import { useAuthStore } from '../../stores/authStore';
import { toast } from 'sonner';
import type { ResourceInventory, ResourceCategory } from '../../types';
import { Plus, Edit3, Users } from 'lucide-react';

interface ResourceGridProps {
  settlementId: string;
  settlementName: string;
}

const RESOURCE_CATEGORIES: ResourceCategory[] = [
  'Forestry', 'Carpentry', 'Hunting', 'Leatherworking',
  'Foraging', 'Mining', 'Tailoring', 'Masonry',
  'Smithing', 'Farming', 'Fishing', 'Cooking', 'Scholar'
];

export function ResourceGrid({ settlementId, settlementName }: ResourceGridProps) {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const [selectedCategory, setSelectedCategory] = useState<ResourceCategory>('Forestry');
  const [editingResource, setEditingResource] = useState<string | null>(null);
  const [quantities, setQuantities] = useState<Record<string, { needed: number; assigned: number; completed: number }>>({});

  const isLeader = user?.role === 'leader';

  const { data: resources = [], isLoading } = useQuery({
    queryKey: ['settlement-resources', settlementId, selectedCategory],
    queryFn: () => settlementApi.getResources(settlementId, selectedCategory),
    enabled: !!settlementId,
  });

  const updateResourceMutation = useMutation({
    mutationFn: ({ resourceId, data }: { resourceId: string; data: any }) =>
      settlementApi.updateResource(settlementId, resourceId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settlement-resources', settlementId] });
      toast.success('Resource updated successfully');
      setEditingResource(null);
    },
    onError: () => {
      toast.error('Failed to update resource');
    },
  });

  const createTaskMutation = useMutation({
    mutationFn: taskApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast.success('Task created successfully');
    },
    onError: () => {
      toast.error('Failed to create task');
    },
  });

  const handleQuantityChange = (resourceId: string, field: 'needed' | 'assigned' | 'completed', value: number) => {
    setQuantities(prev => ({
      ...prev,
      [resourceId]: {
        ...prev[resourceId],
        [field]: value,
      },
    }));
  };

  const handleSaveResource = (resource: ResourceInventory) => {
    const updatedQuantities = quantities[resource.id];
    if (updatedQuantities) {
      updateResourceMutation.mutate({
        resourceId: resource.id,
        data: {
          quantity_needed: updatedQuantities.needed,
          quantity_assigned: updatedQuantities.assigned,
          quantity_completed: updatedQuantities.completed,
        },
      });
    }
  };

  const startEditing = (resource: ResourceInventory) => {
    setEditingResource(resource.id);
    setQuantities({
      ...quantities,
      [resource.id]: {
        needed: resource.quantity_needed,
        assigned: resource.quantity_assigned,
        completed: resource.quantity_completed,
      },
    });
  };

  const getProgressPercentage = (completed: number, needed: number) => {
    if (needed === 0) return 0;
    return Math.min((completed / needed) * 100, 100);
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 100) return 'bg-green-500';
    if (percentage >= 75) return 'bg-blue-500';
    if (percentage >= 50) return 'bg-yellow-500';
    if (percentage >= 25) return 'bg-orange-500';
    return 'bg-red-500';
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading resources...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Category Selector */}
      <div className="flex flex-wrap gap-2">
        {RESOURCE_CATEGORIES.map((category) => (
          <Button
            key={category}
            variant={selectedCategory === category ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </Button>
        ))}
      </div>

      {/* Settlement Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">{settlementName} - {selectedCategory}</h2>
        {isLeader && (
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Resource
          </Button>
        )}
      </div>

      {/* Resources Grid */}
      <div className="grid gap-4">
        {resources.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-muted-foreground">No resources found for {selectedCategory}</p>
            </CardContent>
          </Card>
        ) : (
          resources.map((resource) => {
            const isEditing = editingResource === resource.id;
            const currentQuantities = quantities[resource.id] || {
              needed: resource.quantity_needed,
              assigned: resource.quantity_assigned,
              completed: resource.quantity_completed,
            };
            const progress = getProgressPercentage(currentQuantities.completed, currentQuantities.needed);

            return (
              <Card key={resource.id} className="overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg capitalize">{resource.resource_name}</CardTitle>
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary">{resource.category}</Badge>
                      {isLeader && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => isEditing ? handleSaveResource(resource) : startEditing(resource)}
                        >
                          <Edit3 className="h-4 w-4" />
                          {isEditing ? 'Save' : 'Edit'}
                        </Button>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Progress Bar */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{currentQuantities.completed}/{currentQuantities.needed}</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all ${getProgressColor(progress)}`}
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>

                  {/* Quantities Grid */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <label className="text-xs font-medium text-muted-foreground">Needed</label>
                      {isEditing && isLeader ? (
                        <Input
                          type="number"
                          value={currentQuantities.needed}
                          onChange={(e) => handleQuantityChange(resource.id, 'needed', parseInt(e.target.value) || 0)}
                          className="mt-1 text-center"
                          min="0"
                        />
                      ) : (
                        <div className="text-lg font-semibold mt-1">{currentQuantities.needed}</div>
                      )}
                    </div>

                    <div className="text-center">
                      <label className="text-xs font-medium text-muted-foreground">Assigned</label>
                      {isEditing && isLeader ? (
                        <Input
                          type="number"
                          value={currentQuantities.assigned}
                          onChange={(e) => handleQuantityChange(resource.id, 'assigned', parseInt(e.target.value) || 0)}
                          className="mt-1 text-center"
                          min="0"
                        />
                      ) : (
                        <div className="text-lg font-semibold mt-1">{currentQuantities.assigned}</div>
                      )}
                    </div>

                    <div className="text-center">
                      <label className="text-xs font-medium text-muted-foreground">Completed</label>
                      {isEditing ? (
                        <Input
                          type="number"
                          value={currentQuantities.completed}
                          onChange={(e) => handleQuantityChange(resource.id, 'completed', parseInt(e.target.value) || 0)}
                          className="mt-1 text-center"
                          min="0"
                        />
                      ) : (
                        <div className="text-lg font-semibold mt-1">{currentQuantities.completed}</div>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  {isLeader && !isEditing && (
                    <div className="flex space-x-2 pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => {
                          // TODO: Open task assignment modal
                          toast.info('Task assignment feature coming soon');
                        }}
                      >
                        <Users className="h-4 w-4 mr-2" />
                        Assign Task
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}