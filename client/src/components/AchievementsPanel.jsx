import { useGame } from '@/contexts/GameContext';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';
import { Trophy, Lock } from 'lucide-react';

export function AchievementsPanel() {
  const { badges } = useGame();
  const { isEngaged } = useTheme();
  const unlockedCount = badges.filter(b => b.unlocked).length;

  return (
    <div className={cn(
      "rounded-2xl p-5 transition-all duration-300",
      isEngaged ? "bg-card border border-border/50 shadow-lg shadow-primary/5" : "bg-card border border-border shadow-md"
    )}>
      <div className="flex items-center gap-2 mb-4">
        <Trophy className={cn("w-5 h-5", isEngaged ? "text-xp animate-float" : "text-xp")} />
        <h2 className="font-display font-semibold text-lg">
          {isEngaged ? 'Achievements' : 'Badges'}
          <span className="ml-2 text-muted-foreground font-normal text-sm">({unlockedCount}/{badges.length})</span>
        </h2>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {badges.map((badge) => (
          <div
            key={badge.id}
            className={cn(
              "relative flex flex-col items-center p-4 rounded-xl text-center transition-all duration-300",
              badge.unlocked
                ? isEngaged
                  ? "bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/30 hover:scale-105"
                  : "bg-secondary hover:bg-secondary/80"
                : isEngaged
                  ? "bg-muted/30 border border-border/30"
                  : "bg-muted/50"
            )}
          >
            <div className={cn(
              "text-3xl mb-2 transition-all duration-300",
              badge.unlocked ? (isEngaged && "animate-float") : "grayscale opacity-50"
            )}>
              {badge.unlocked ? badge.icon : <Lock className="w-6 h-6 text-muted-foreground" />}
            </div>
            <p className={cn("font-medium text-xs", badge.unlocked ? "text-foreground" : "text-muted-foreground")}>
              {badge.name}
            </p>
            {badge.unlocked && isEngaged && (
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary/5 to-accent/5 shimmer pointer-events-none" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
