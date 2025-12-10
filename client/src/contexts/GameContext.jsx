import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useGetTasks, useCreateTask, useUpdateTask, useCompleteTask, useDeleteTask, useToggleReminder, useGetStats } from '@/hooks/use-api';

const GameContext = createContext();

const initialBadges = [
  { id: 'rookie', name: 'Task Rookie', description: 'Complete your first task', icon: '🌱', unlocked: false },
  { id: 'master', name: 'Task Master', description: 'Complete 10 tasks', icon: '⚔️', unlocked: false },
  { id: 'legend', name: 'Streak Legend', description: 'Maintain a 7-day streak', icon: '🔥', unlocked: false },
  { id: 'productive', name: 'Productivity Pro', description: 'Complete 5 tasks in one day', icon: '🚀', unlocked: false },
  { id: 'centurion', name: 'Centurion', description: 'Earn 100 XP', icon: '💯', unlocked: false },
];

export function GameProvider({ children }) {
  // API hooks
  const { data: tasks = [], isLoading: tasksLoading } = useGetTasks();
  const { data: stats } = useGetStats();
  const createTaskMutation = useCreateTask();
  const updateTaskMutation = useUpdateTask();
  const completeTaskMutation = useCompleteTask();
  const deleteTaskMutation = useDeleteTask();
  const toggleReminderMutation = useToggleReminder();

  const [state, setState] = useState({
    xp: 0,
    level: 1,
    streak: 0,
    tasks: [],
    badges: initialBadges.map((b, i) => ({ ...b, unlocked: i < 2 })),
    showConfetti: false,
    isLoading: true,
  });

  // Sync stats to state
  useEffect(() => {
    if (stats) {
      // Calculate level and XP from total points
      const totalXp = stats.totalPoints;
      let level = 1;
      let xp = totalXp;
      const xpPerLevel = 50;
      
      while (xp >= level * xpPerLevel) {
        xp -= level * xpPerLevel;
        level += 1;
      }

      setState(prev => ({
        ...prev,
        xp,
        level,
      }));
    }
  }, [stats]);

  // Sync tasks from API to state - PROPERLY MAP DATABASE FIELDS TO UI FIELDS
  useEffect(() => {
    if (Array.isArray(tasks) && tasks.length >= 0) {
      const mappedTasks = tasks.map(t => {
        return {
          id: t._id,
          text: t.text,
          completed: t.completed || false,
          reminder: t.reminder || false,
          points: t.points || 0,
          day: t.day || '',
          date: t.dueDate ? new Date(t.dueDate).toISOString().split('T')[0] : undefined,
          time: t.time || '',
          createdAt: t.createdAt,
          updatedAt: t.updatedAt,
          _id: t._id,
        };
      });

      setState(prev => ({
        ...prev,
        tasks: mappedTasks,
        isLoading: tasksLoading,
      }));
    }
  }, [tasks, tasksLoading]);

  const getXpForNextLevel = useCallback(() => state.level * 50, [state.level]);
  const getXpProgress = useCallback(() => (state.xp / getXpForNextLevel()) * 100, [state.xp, getXpForNextLevel]);

  const triggerConfetti = useCallback(() => {
    setState(prev => ({ ...prev, showConfetti: true }));
    setTimeout(() => setState(prev => ({ ...prev, showConfetti: false })), 3000);
  }, []);

  // Add task via API - CONVERT UI FORMAT TO DATABASE FORMAT
  const addTask = useCallback((taskData) => {
    const dueDate = taskData.date ? new Date(`${taskData.date}T00:00:00Z`).toISOString() : null;
    
    createTaskMutation.mutate({
      text: taskData.text,
      day: taskData.day || '',
      reminder: taskData.reminder || false,
      completed: false,
      points: 0,
      dueDate: dueDate,
      time: taskData.time || '',
    });
  }, [createTaskMutation]);

  // Update task via API - CONVERT UI FORMAT TO DATABASE FORMAT
  const updateTask = useCallback((id, updatedTask) => {
    const updates = { ...updatedTask };
    
    if (updatedTask.date && typeof updatedTask.date === 'string') {
      updates.dueDate = new Date(`${updatedTask.date}T00:00:00Z`).toISOString();
      delete updates.date;
    }
    
    updateTaskMutation.mutate({
      id,
      updates,
    });
  }, [updateTaskMutation]);

  // Complete task via API
  const completeTask = useCallback((id) => {
    completeTaskMutation.mutate({
      id,
      awardPoints: 10,
    });

    // Show confetti
    setState(prev => ({ ...prev, showConfetti: true }));
    setTimeout(() => setState(prev => ({ ...prev, showConfetti: false })), 3000);
  }, [completeTaskMutation]);

  // Delete task via API
  const deleteTask = useCallback((id) => {
    deleteTaskMutation.mutate(id);
  }, [deleteTaskMutation]);

  // Toggle reminder via API
  const toggleTaskReminder = useCallback((id, reminder) => {
    toggleReminderMutation.mutate({ id, reminder });
  }, [toggleReminderMutation]);

  return (
    <GameContext.Provider value={{
      ...state,
      addTask,
      updateTask,
      completeTask,
      deleteTask,
      toggleTaskReminder,
      getXpForNextLevel,
      getXpProgress,
      triggerConfetti,
    }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) throw new Error('useGame must be used within a GameProvider');
  return context;
}
