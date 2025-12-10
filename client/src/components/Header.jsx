import { useTheme } from '@/contexts/ThemeContext';
import { useGame } from '@/contexts/GameContext';
import { ThemeToggle } from './ThemeToggle';
import { cn } from '@/lib/utils';
import { Star, Flame, Trophy } from 'lucide-react';

export function Header() {
  const { isEngaged } = useTheme();
  const { xp, level, streak, getXpForNextLevel, getXpProgress } = useGame();

  return (
    <header className={cn(
      "sticky top-0 z-50 w-full border-b backdrop-blur-md transition-all duration-300",
      isEngaged 
        ? "bg-background/80 border-border/50" 
        : "bg-background/95 border-border"
    )}>
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={cn(
              "w-10 h-10 rounded-xl flex items-center justify-center font-display font-bold text-lg transition-all duration-300",
              isEngaged 
                ? "bg-gradient-to-br from-primary to-accent text-primary-foreground glow-purple" 
                : "bg-primary text-primary-foreground"
            )}>
              {isEngaged ? '⚡' : '✓'}
            </div>
            <h1 className={cn(
              "font-display font-bold text-xl transition-all duration-300",
              isEngaged && "bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent"
            )}>
              Taskit
            </h1>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            <div className={cn(
              "flex items-center gap-2 px-3 py-1.5 rounded-full transition-all duration-300",
              isEngaged ? "bg-xp/10 border border-xp/30" : "bg-secondary"
            )}>
              <Star className={cn("w-4 h-4", isEngaged ? "text-xp animate-float" : "text-xp")} />
              <span className={cn("font-semibold text-sm", isEngaged ? "text-xp" : "text-foreground")}>{xp} XP</span>
            </div>

            <div className={cn(
              "flex items-center gap-2 px-3 py-1.5 rounded-full transition-all duration-300",
              isEngaged ? "bg-primary/10 border border-primary/30" : "bg-secondary"
            )}>
              <Trophy className={cn("w-4 h-4", isEngaged ? "text-primary animate-float" : "text-level")} />
              <span className={cn("font-semibold text-sm", isEngaged ? "text-primary" : "text-foreground")}>Lvl {level}</span>
            </div>

            <div className={cn(
              "flex items-center gap-2 px-3 py-1.5 rounded-full transition-all duration-300",
              isEngaged ? "bg-streak/10 border border-streak/30 pulse-glow" : "bg-secondary"
            )}>
              <Flame className={cn("w-4 h-4", isEngaged ? "text-streak animate-float" : "text-streak")} />
              <span className={cn("font-semibold text-sm", isEngaged ? "text-streak" : "text-foreground")}>{streak} days</span>
            </div>
          </div>

          <ThemeToggle />
        </div>

        <div className="mt-4">
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-1.5">
            <span>Level {level}</span>
            <span>{xp} / {getXpForNextLevel()} XP</span>
            <span>Level {level + 1}</span>
          </div>
          <div className={cn("w-full h-2 rounded-full overflow-hidden transition-all duration-300", isEngaged ? "bg-muted/50" : "bg-muted")}>
            <div 
              className={cn("h-full rounded-full transition-all duration-500 ease-out", isEngaged ? "progress-glow" : "bg-primary")}
              style={{ width: `${getXpProgress()}%` }}
            />
          </div>
        </div>
      </div>
    </header>
  );
}
