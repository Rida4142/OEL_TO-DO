import { useGame } from '@/contexts/GameContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useMemo } from 'react';

export function Confetti() {
  const { showConfetti } = useGame();
  const { isEngaged } = useTheme();

  const pieces = useMemo(() => {
    if (!showConfetti) return [];

    const colors = isEngaged 
      ? ['#a855f7', '#22d3ee', '#ec4899', '#f59e0b', '#22c55e']
      : ['#14b8a6', '#8b5cf6', '#f97316', '#06b6d4', '#ec4899'];

    return Array.from({ length: 50 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      color: colors[Math.floor(Math.random() * colors.length)],
      delay: Math.random() * 0.5,
      duration: 2 + Math.random() * 2,
      borderRadius: Math.random() > 0.5 ? '50%' : '2px',
      rotation: Math.random() * 360,
    }));
  }, [showConfetti, isEngaged]);

  if (!showConfetti || pieces.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden">
      {pieces.map((piece) => (
        <div
          key={piece.id}
          className="absolute w-3 h-3 animate-confetti"
          style={{
            left: `${piece.x}%`,
            top: '-20px',
            backgroundColor: piece.color,
            borderRadius: piece.borderRadius,
            animationDelay: `${piece.delay}s`,
            animationDuration: `${piece.duration}s`,
            transform: `rotate(${piece.rotation}deg)`, // rotation precomputed
          }}
        />
      ))}
    </div>
  );
}
