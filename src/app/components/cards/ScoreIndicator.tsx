'use client';

interface ScoreIndicatorProps {
  label: string;
  score: number;
  maxScore?: number;
}

export function ScoreIndicator({ 
  label, 
  score, 
  maxScore = 100 
}: ScoreIndicatorProps) {
  const percentage = (score / maxScore) * 100;
  
  return (
    <div className="flex flex-col gap-1">
      <div className="flex justify-between text-sm">
        <span className="text-gray-600 dark:text-gray-400">{label}</span>
        <span className="font-medium">{score}</span>
      </div>
      <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
