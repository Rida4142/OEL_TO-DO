// API configuration and base functions
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export interface Task {
  _id?: string;
  text: string;
  day?: string;
  reminder?: boolean;
  completed?: boolean;
  points?: number;
  dueDate?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface Settings {
  _id?: string;
  appMode: 'minimal' | 'engaging';
  gamificationEnabled: boolean;
}

export interface Stats {
  total: number;
  completed: number;
  totalPoints: number;
}

// Generic fetch wrapper
async function apiCall<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Unknown error' }));
    throw new Error(error.message || `API error: ${response.statusText}`);
  }

  return response.json();
}

// Task endpoints
export const taskAPI = {
  // Get all tasks
  getAllTasks: (filter?: { completed?: boolean; sortBy?: string; order?: 'asc' | 'desc'; limit?: number }) => {
    const params = new URLSearchParams();
    if (filter?.completed !== undefined) params.append('completed', String(filter.completed));
    if (filter?.sortBy) params.append('sortBy', filter.sortBy);
    if (filter?.order) params.append('order', filter.order);
    if (filter?.limit) params.append('limit', String(filter.limit));
    
    const query = params.toString();
    return apiCall<Task[]>(`/tasks${query ? `?${query}` : ''}`);
  },

  // Get single task
  getTask: (id: string) =>
    apiCall<Task>(`/tasks/${id}`),

  // Create task
  createTask: (task: Omit<Task, '_id' | 'createdAt' | 'updatedAt'>) =>
    apiCall<Task>('/tasks', {
      method: 'POST',
      body: JSON.stringify(task),
    }),

  // Update task
  updateTask: (id: string, updates: Partial<Task>) =>
    apiCall<Task>(`/tasks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    }),

  // Mark task complete
  completeTask: (id: string, awardPoints?: number) =>
    apiCall<{ task: Task; awarded?: number; message?: string }>(`/tasks/${id}/complete`, {
      method: 'PATCH',
      body: JSON.stringify({ awardPoints: awardPoints ?? 10 }),
    }),

  // Toggle reminder
  toggleReminder: (id: string, reminder: boolean) =>
    apiCall<Task>(`/tasks/${id}/reminder`, {
      method: 'PATCH',
      body: JSON.stringify({ reminder }),
    }),

  // Delete task
  deleteTask: (id: string) =>
    apiCall<{ message: string }>(`/tasks/${id}`, {
      method: 'DELETE',
    }),
};

// Settings endpoints
export const settingsAPI = {
  // Get settings
  getSettings: () =>
    apiCall<Settings>('/settings'),

  // Update settings
  updateSettings: (updates: Partial<Settings>) =>
    apiCall<Settings>('/settings', {
      method: 'PUT',
      body: JSON.stringify(updates),
    }),
};

// Stats endpoints
export const statsAPI = {
  // Get stats
  getStats: () =>
    apiCall<Stats>('/stats'),
};
