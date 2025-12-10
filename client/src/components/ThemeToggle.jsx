import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';
import { Sparkles, Leaf } from 'lucide-react';

export function ThemeToggle() {
  const { mode, toggleMode, isEngaged } = useTheme();

  return (
    <button
      onClick={toggleMode}
      className={cn(
        "relative flex items-center gap-2 px-4 py-2 rounded-full font-medium text-sm transition-all duration-300",
        isEngaged
          ? "bg-gradient-to-r from-primary/20 to-accent/20 border border-primary/30 text-foreground hover:border-primary/50"
          : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
      )}
    >
      <span className={cn(
        "flex items-center gap-1.5 transition-opacity duration-200",
        isEngaged ? "opacity-50" : "opacity-100"
      )}>
        <Leaf className="w-4 h-4" />
        Minimal
      </span>

      <div className={cn(
        "relative w-12 h-6 rounded-full transition-all duration-300",
        isEngaged 
          ? "bg-gradient-to-r from-primary to-accent" 
          : "bg-muted-foreground/20"
      )}>
        <div className={cn(
          "absolute top-1 w-4 h-4 rounded-full transition-all duration-300 shadow-md",
          isEngaged 
            ? "left-7 bg-foreground" 
            : "left-1 bg-background"
        )} />
      </div>

      <span className={cn(
        "flex items-center gap-1.5 transition-opacity duration-200",
        isEngaged ? "opacity-100" : "opacity-50"
      )}>
        <Sparkles className={cn("w-4 h-4", isEngaged && "animate-float")} />
        Engaged
      </span>
    </button>
  );
}
