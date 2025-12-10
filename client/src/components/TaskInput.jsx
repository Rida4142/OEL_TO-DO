import { useState, useEffect } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { useGame } from '@/contexts/GameContext';
import { cn } from '@/lib/utils';
import { Plus, Sparkles } from 'lucide-react';

export function TaskInput({ editingTask, setEditingTask }) {
  const [text, setText] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const { isEngaged } = useTheme();
  const { addTask, updateTask } = useGame();

  // Prefill form if editing
  useEffect(() => {
    if (editingTask) {
      setText(editingTask.text);
      setDate(editingTask.date || '');
      setTime(editingTask.time || '');
    } else {
      setText('');
      setDate('');
      setTime('');
    }
  }, [editingTask]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    const newTask = {
      text: text.trim(),
      date: date || null,
      time: time || null
    };

    if (editingTask) {
      updateTask(editingTask.id, newTask);
      setEditingTask(null);
    } else {
      addTask(newTask);
    }

    setText('');
    setDate('');
    setTime('');
  };

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-2">
      <div
        className={cn(
          "flex gap-3 p-2 rounded-2xl transition-all duration-300",
          isEngaged
            ? "bg-card border border-border/50 shadow-lg shadow-primary/5"
            : "bg-card border border-border shadow-md"
        )}
      >
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={isEngaged ? "✨ What quest will you conquer today?" : "Add a new task..."}
          className={cn(
            "flex-1 px-4 py-3 bg-transparent rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none transition-all duration-200",
            isEngaged && "focus:ring-2 focus:ring-primary/30"
          )}
        />
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="px-3 py-2 border rounded-xl text-sm"
        />
        <input
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          className="px-3 py-2 border rounded-xl text-sm"
        />
        <button
          type="submit"
          disabled={!text.trim()}
          className={cn(
            "flex items-center gap-2 px-5 py-3 rounded-xl font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed",
            isEngaged
              ? "btn-neon text-primary-foreground"
              : "bg-primary text-primary-foreground hover:bg-primary/90"
          )}
        >
          {isEngaged ? <><Sparkles className="w-4 h-4" />{editingTask ? 'Update Quest' : 'Add Quest'}</>
                     : <><Plus className="w-4 h-4" />{editingTask ? 'Update Task' : 'Add Task'}</>}
        </button>
      </div>
    </form>
  );
}
