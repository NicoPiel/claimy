import axios from 'axios';
import type {
  User,
  Settlement,
  ResourceInventory,
  Task,
  LoginRequest,
  LoginResponse,
  TaskFilters,
  CreateTaskRequest,
  UpdateTaskRequest,
  UpdateResourceInventoryRequest,
  CreateSettlementRequest,
  CreatePlayerRequest,
  PaginatedResponse,
} from '../types';

// Create axios instance
const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use((config) => {
  const authData = localStorage.getItem('auth-storage');
  if (authData) {
    try {
      const { state } = JSON.parse(authData);
      if (state?.token) {
        config.headers.Authorization = `Bearer ${state.token}`;
      }
    } catch (error) {
      console.error('Error parsing auth token:', error);
    }
  }
  return config;
});

// Add response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear auth state on 401
      localStorage.removeItem('auth-storage');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authApi = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>('/auth/login', credentials);
    return response.data;
  },

  logout: async (): Promise<void> => {
    await api.post('/auth/logout');
  },

  getMe: async (): Promise<User> => {
    const response = await api.get<User>('/auth/me');
    return response.data;
  },
};

// Settlement API
export const settlementApi = {
  getAll: async (): Promise<Settlement[]> => {
    const response = await api.get<Settlement[]>('/settlements');
    return response.data;
  },

  getById: async (id: string): Promise<Settlement> => {
    const response = await api.get<Settlement>(`/settlements/${id}`);
    return response.data;
  },

  create: async (data: CreateSettlementRequest): Promise<Settlement> => {
    const response = await api.post<Settlement>('/settlements', data);
    return response.data;
  },

  update: async (id: string, data: Partial<CreateSettlementRequest>): Promise<Settlement> => {
    const response = await api.put<Settlement>(`/settlements/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/settlements/${id}`);
  },

  getResources: async (settlementId: string, category?: string): Promise<ResourceInventory[]> => {
    const params = category ? { category } : {};
    const response = await api.get<ResourceInventory[]>(`/settlements/${settlementId}/resources`, { params });
    return response.data;
  },

  updateResource: async (
    settlementId: string,
    resourceId: string,
    data: UpdateResourceInventoryRequest
  ): Promise<ResourceInventory> => {
    const response = await api.put<ResourceInventory>(
      `/settlements/${settlementId}/resources/${resourceId}`,
      data
    );
    return response.data;
  },
};

// Task API
export const taskApi = {
  getAll: async (filters?: TaskFilters): Promise<PaginatedResponse<Task>> => {
    const response = await api.get<PaginatedResponse<Task>>('/tasks', { params: filters });
    return response.data;
  },

  getMy: async (): Promise<Task[]> => {
    const response = await api.get<Task[]>('/tasks/my');
    return response.data;
  },

  create: async (data: CreateTaskRequest): Promise<Task> => {
    const response = await api.post<Task>('/tasks', data);
    return response.data;
  },

  update: async (id: string, data: UpdateTaskRequest): Promise<Task> => {
    const response = await api.put<Task>(`/tasks/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/tasks/${id}`);
  },
};

// Player API
export const playerApi = {
  getAll: async (): Promise<User[]> => {
    const response = await api.get<User[]>('/players');
    return response.data;
  },

  getById: async (id: string): Promise<User> => {
    const response = await api.get<User>(`/players/${id}`);
    return response.data;
  },

  create: async (data: CreatePlayerRequest): Promise<User> => {
    const response = await api.post<User>('/players', data);
    return response.data;
  },
};

export default api;