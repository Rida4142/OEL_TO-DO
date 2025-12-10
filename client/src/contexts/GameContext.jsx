import React, { createContext, useContext, useState, useCallback } from 'react';

const GameContext = createContext();

const initialBadges = [
  { id: 'rookie', name: 'Task Rookie', description: 'Complete your first task', icon: '🌱', unlocked: false },
  { id: 'master', name: 'Task Master', description: 'Complete 10 tasks', icon: '⚔️', unlocked: false },
  { id: 'legend', name: 'Streak Legend', description: 'Maintain a 7-day streak', icon: '🔥', unlocked: false },
  { id: 'productive', name: 'Productivity Pro', description: 'Complete 5 tasks in one day', icon: '🚀', unlocked: false },
  { id: 'centurion', name: 'Centurion', description: 'Earn 100 XP', icon: '💯', unlocked: false },
];

export function GameProvider({ children }) {
  const [state, setState] = useState({
    xp: 35,
    level: 3,
    streak: 4,
    tasks: [
      { id: '1', text: 'Review project requirements', completed: true, createdAt: new Date() },
      { id: '2', text: 'Design wireframes for new feature', completed: false, createdAt: new Date() },
      { id: '3', text: 'Set up development environment', completed: false, createdAt: new Date() },
    ],
    badges: initialBadges.map((b, i) => ({ ...b, unlocked: i < 2 })),
    showConfetti: false,
  });

  const getXpForNextLevel = useCallback(() => state.level * 50, [state.level]);
  const getXpProgress = useCallback(() => (state.xp / getXpForNextLevel()) * 100, [state.xp, getXpForNextLevel]);

  const triggerConfetti = useCallback(() => {
    setState(prev => ({ ...prev, showConfetti: true }));
    setTimeout(() => setState(prev => ({ ...prev, showConfetti: false })), 3000);
  }, []);

  const addTask = useCallback((task) => {
  const newTask = {
    id: Date.now().toString(),
    completed: false,
    createdAt: new Date(),
    ...task, // spread text, date, time
  };
  setState(prev => ({ ...prev, tasks: [newTask, ...prev.tasks] }));
}, []);

const updateTask = useCallback((id, updatedTask) => {
  setState(prev => ({
    ...prev,
    tasks: prev.tasks.map(t => t.id === id ? { ...t, ...updatedTask } : t)
  }));
}, []);


  const completeTask = useCallback((id) => {
    setState(prev => {
      const task = prev.tasks.find(t => t.id === id);
      if (!task || task.completed) return prev;

      const xpGain = 10;
      let newXp = prev.xp + xpGain;
      let newLevel = prev.level;
      const xpForNextLevel = prev.level * 50;

      if (newXp >= xpForNextLevel) {
        newLevel += 1;
        newXp -= xpForNextLevel;
      }

      const completedCount = prev.tasks.filter(t => t.completed).length + 1;

      const updatedBadges = prev.badges.map(badge => {
        if (badge.unlocked) return badge;
        if (badge.id === 'rookie' && completedCount >= 1) return { ...badge, unlocked: true, unlockedAt: new Date() };
        if (badge.id === 'master' && completedCount >= 10) return { ...badge, unlocked: true, unlockedAt: new Date() };
        if (badge.id === 'centurion' && prev.xp + xpGain >= 100) return { ...badge, unlocked: true, unlockedAt: new Date() };
        return badge;
      });

      return {
        ...prev,
        tasks: prev.tasks.map(t => (t.id === id ? { ...t, completed: true } : t)),
        xp: newXp,
        level: newLevel,
        badges: updatedBadges,
        showConfetti: true,
      };
    });

    setTimeout(() => setState(prev => ({ ...prev, showConfetti: false })), 3000);
  }, []);

  const deleteTask = useCallback((id) => {
    setState(prev => ({ ...prev, tasks: prev.tasks.filter(t => t.id !== id) }));
  }, []);

  return (
    <GameContext.Provider value={{
  ...state,
  addTask,
  updateTask, // add this
  completeTask,
  deleteTask,
  getXpForNextLevel,
  getXpProgress,
  triggerConfetti
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
