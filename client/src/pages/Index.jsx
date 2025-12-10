import { Header } from '@/components/Header';
import { TaskInput } from '@/components/TaskInput';
import { TaskList } from '@/components/TaskList';
import { AchievementsPanel } from '@/components/AchievementsPanel';
import { Confetti } from '@/components/Confetti';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { GameProvider } from '@/contexts/GameContext';

const Index = () => {
  return (
    <ThemeProvider>
      <GameProvider>
        <div className="min-h-screen bg-background transition-colors duration-300">
          <Confetti />
          <Header />
          
          <main className="container mx-auto px-4 py-8">
            <div className="max-w-3xl mx-auto space-y-8">
              {/* Task Input */}
              <TaskInput />
              
              {/* Task List */}
              <TaskList />
              
              {/* Achievements */}
              <AchievementsPanel />
            </div>
          </main>

          {/* Footer */}
          <footer className="border-t border-border mt-16 py-6">
            <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
              <p>Complete tasks to earn XP, level up, and unlock achievements!</p>
            </div>
          </footer>
        </div>
      </GameProvider>
    </ThemeProvider>
  );
};

export default Index;
