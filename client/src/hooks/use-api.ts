import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { taskAPI, settingsAPI, statsAPI, Task, Settings, Stats } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

// Task hooks
export function useGetTasks(filter?: { completed?: boolean; sortBy?: string; order?: 'asc' | 'desc'; limit?: number }) {
  return useQuery({
    queryKey: ['tasks', filter],
    queryFn: () => taskAPI.getAllTasks(filter),
    staleTime: 1000 * 30, // 30 seconds
  });
}

export function useGetTask(id: string | null) {
  return useQuery({
    queryKey: ['task', id],
    queryFn: () => (id ? taskAPI.getTask(id) : Promise.reject('No ID provided')),
    enabled: !!id,
  });
}

export function useCreateTask() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (task: Omit<Task, '_id' | 'createdAt' | 'updatedAt'>) =>
      taskAPI.createTask(task),
    onSuccess: (newTask) => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['stats'] });
      toast({ description: 'Task created!' });
    },
    onError: (error: Error) => {
      toast({ description: `Error: ${error.message}`, variant: 'destructive' });
    },
  });
}

export function useUpdateTask() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Task> }) =>
      taskAPI.updateTask(id, updates),
    onSuccess: (updatedTask) => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.setQueryData(['task', updatedTask._id], updatedTask);
    },
    onError: (error: Error) => {
      toast({ description: `Error: ${error.message}`, variant: 'destructive' });
    },
  });
}

export function useCompleteTask() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, awardPoints }: { id: string; awardPoints?: number }) =>
      taskAPI.completeTask(id, awardPoints),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['stats'] });
      if (data.awarded && data.awarded > 0) {
        toast({ description: `+${data.awarded} XP earned!` });
      }
    },
    onError: (error: Error) => {
      toast({ description: `Error: ${error.message}`, variant: 'destructive' });
    },
  });
}

export function useToggleReminder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, reminder }: { id: string; reminder: boolean }) =>
      taskAPI.toggleReminder(id, reminder),
    onSuccess: (updatedTask) => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.setQueryData(['task', updatedTask._id], updatedTask);
    },
  });
}

export function useDeleteTask() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: string) => taskAPI.deleteTask(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['stats'] });
      toast({ description: 'Task deleted!' });
    },
    onError: (error: Error) => {
      toast({ description: `Error: ${error.message}`, variant: 'destructive' });
    },
  });
}

// Settings hooks
export function useGetSettings() {
  return useQuery({
    queryKey: ['settings'],
    queryFn: () => settingsAPI.getSettings(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useUpdateSettings() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (updates: Partial<Settings>) =>
      settingsAPI.updateSettings(updates),
    onSuccess: (updatedSettings) => {
      queryClient.setQueryData(['settings'], updatedSettings);
      toast({ description: 'Settings updated!' });
    },
    onError: (error: Error) => {
      toast({ description: `Error: ${error.message}`, variant: 'destructive' });
    },
  });
}

// Stats hooks
export function useGetStats() {
  return useQuery({
    queryKey: ['stats'],
    queryFn: () => statsAPI.getStats(),
    staleTime: 1000 * 30, // 30 seconds
  });
}
