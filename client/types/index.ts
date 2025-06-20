export interface User {
  id: string;
  username: string;
  role: 'leader' | 'member';
  created_at: string;
}

export type ResourceCategory = 
  | 'Forestry' | 'Carpentry' | 'Hunting' | 'Leatherworking' 
  | 'Foraging' | 'Mining' | 'Tailoring' | 'Masonry' 
  | 'Smithing' | 'Farming' | 'Fishing' | 'Cooking' | 'Scholar';

export interface Settlement {
  id: string;
  name: string;
  tier: number;
  created_at: string;
  updated_at: string;
}

export interface Resource {
  id: string;
  name: string;
  category: ResourceCategory;
  description?: string;
}

export interface ResourceInventory {
  id: string;
  settlement_id: string;
  resource_id: string;
  resource_name: string;
  category: ResourceCategory;
  quantity_needed: number;
  quantity_assigned: number;
  quantity_completed: number;
  updated_at: string;
}

export type TaskStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled';

export interface Task {
  id: string;
  settlement_id: string;
  settlement_name: string;
  resource_id: string;
  resource_name: string;
  category: ResourceCategory;
  assigned_to: string;
  quantity_requested: number;
  quantity_completed: number;
  status: TaskStatus;
  deadline?: string;
  created_by: string;
  created_at: string;
  updated_at: string;
  notes?: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface ApiError {
  error: string;
  code?: string;
  details?: Record<string, unknown>;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
  };
}

export interface TaskFilters {
  assigned_to?: string;
  settlement_id?: string;
  category?: ResourceCategory;
  status?: TaskStatus;
  page?: number;
  limit?: number;
}

export interface CreateTaskRequest {
  settlement_id: string;
  resource_id: string;
  assigned_to: string;
  quantity_requested: number;
  deadline?: string;
  notes?: string;
}

export interface UpdateTaskRequest {
  assigned_to?: string;
  quantity_requested?: number;
  quantity_completed?: number;
  status?: TaskStatus;
  deadline?: string;
  notes?: string;
}

export interface UpdateResourceInventoryRequest {
  quantity_needed?: number;
  quantity_assigned?: number;
  quantity_completed?: number;
}

export interface CreateSettlementRequest {
  name: string;
  tier: number;
}

export interface CreatePlayerRequest {
  username: string;
  password: string;
  role: 'member' | 'leader';
}