import { useState } from 'react';
import { useGame } from '@/contexts/GameContext';
import { useTheme } from '@/contexts/ThemeContext';
import { TaskCard } from './TaskCard';
import { TaskInput } from './TaskInput';
import { cn } from '@/lib/utils';
import { CheckCircle2, ListTodo } from 'lucide-react';

export function TaskList() {
  const { tasks, completeTask, deleteTask } = useGame();
  const { isEngaged } = useTheme();
  const [editingTask, setEditingTask] = useState(null);

  // Sort tasks by nearest date
  const sortedTasks = [...tasks].sort((a, b) => {
    if (!a.date) return 1;
    if (!b.date) return -1;
    return new Date(a.date) - new Date(b.date);
  });

  const pendingTasks = sortedTasks.filter(t => !t.completed);
  const completedTasks = sortedTasks.filter(t => t.completed);

  return (
    <div className="space-y-6">
      <TaskInput editingTask={editingTask} setEditingTask={setEditingTask} />

      {/* Pending Tasks */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <ListTodo className={cn("w-5 h-5", isEngaged ? "text-accent" : "text-primary")} />
          <h2 className="font-display font-semibold text-lg">
            {isEngaged ? 'Active Quests' : 'Tasks'} 
            <span className="ml-2 text-muted-foreground font-normal text-sm">
              ({pendingTasks.length})
            </span>
          </h2>
        </div>

        {pendingTasks.length === 0 ? (
          <div className={cn("text-center py-12 rounded-2xl border-2 border-dashed transition-all duration-300",
            isEngaged ? "border-primary/20 bg-primary/5" : "border-muted bg-muted/30"
          )}>
            <div className={cn("w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center",
              isEngaged ? "bg-gradient-to-br from-primary/20 to-accent/20" : "bg-secondary"
            )}>
              <CheckCircle2 className={cn("w-8 h-8", isEngaged ? "text-primary" : "text-muted-foreground")} />
            </div>
            <p className="text-muted-foreground font-medium">
              {isEngaged ? 'All quests completed! Add a new one.' : 'No tasks yet. Add one above!'}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {pendingTasks.map((task, index) => (
              <TaskCard
                key={task.id}
                task={task}
                onComplete={completeTask}
                onDelete={deleteTask}
                onEdit={setEditingTask} // Pass callback
                index={index}
              />
            ))}
          </div>
        )}
      </div>

      {/* Completed Tasks */}
      {completedTasks.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle2 className="w-5 h-5 text-success" />
            <h2 className="font-display font-semibold text-lg text-muted-foreground">
              {isEngaged ? 'Conquered Quests' : 'Completed'}
              <span className="ml-2 font-normal text-sm">({completedTasks.length})</span>
            </h2>
          </div>

          <div className="space-y-3 opacity-70">
            {completedTasks.map((task, index) => (
              <TaskCard
                key={task.id}
                task={task}
                onComplete={completeTask}
                onDelete={deleteTask}
                index={index}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
