import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';
import { Check, Trash2, Sword, Edit2 } from 'lucide-react';

export function TaskCard({ task, onComplete, onDelete, onEdit, index }) {
  const { isEngaged } = useTheme();

  return (
    <div
      className={cn(
        "group slide-up",
        isEngaged ? "task-card-engaged" : "task-card-minimal"
      )}
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div className="flex items-start gap-4">
        {/* Checkbox */}
        <button
          onClick={() => !task.completed && onComplete(task.id)}
          disabled={task.completed}
          className={cn(
            "flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300",
            task.completed
              ? isEngaged
                ? "bg-gradient-to-br from-primary to-accent border-transparent"
                : "bg-primary border-primary"
              : isEngaged
                ? "border-primary/50 hover:border-primary hover:bg-primary/10 hover:scale-110"
                : "border-muted-foreground/30 hover:border-primary"
          )}
        >
          {task.completed && <Check className="w-3.5 h-3.5 text-primary-foreground bounce-in" />}
        </button>

        {/* Task content */}
        <div className="flex-1 min-w-0 space-y-1">
          <p className={cn(
            "font-medium transition-all duration-200",
            task.completed ? "line-through text-muted-foreground" : "text-foreground"
          )}>
            {task.text}
          </p>

          {/* Date & Time */}
          {(task.date || task.time) && (
            <p className="text-xs text-muted-foreground">
              {task.date && new Date(task.date).toLocaleDateString()}{" "}
              {task.time}
            </p>
          )}

          {isEngaged && !task.completed && (
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <Sword className="w-3 h-3" /> +10 XP on completion
            </p>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex flex-col items-end gap-2">
          {onEdit && (
            <button
              onClick={() => onEdit(task)}
              className="p-2 rounded-lg opacity-0 group-hover:opacity-100 text-blue-500 hover:bg-blue-100 hover:scale-110 transition-all duration-200"
            >
              <Edit2 className="w-4 h-4" />
            </button>
          )}

          <button
            onClick={() => onDelete(task.id)}
            className={cn(
              "p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200",
              isEngaged
                ? "text-destructive hover:bg-destructive/10 hover:scale-110"
                : "text-muted-foreground hover:text-destructive hover:bg-destructive/10"
            )}
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
