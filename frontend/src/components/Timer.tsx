import React, { useState } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';

interface TimerProps {
  onTimeChange: (hours: number) => void;
  initialHours?: number;
}

export const Timer: React.FC<TimerProps> = ({ onTimeChange, initialHours = 0 }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [seconds, setSeconds] = useState(initialHours * 3600);

  React.useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning) {
      interval = setInterval(() => {
        setSeconds((s) => s + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  React.useEffect(() => {
    onTimeChange(seconds / 3600);
  }, [seconds, onTimeChange]);

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  const handleReset = () => {
    setIsRunning(false);
    setSeconds(0);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="text-5xl font-bold font-mono text-blue-600 dark:text-blue-400">
        {String(hours).padStart(2, '0')}:{String(minutes).padStart(2, '0')}:
        {String(secs).padStart(2, '0')}
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => setIsRunning(!isRunning)}
          className="p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          {isRunning ? <Pause size={24} /> : <Play size={24} />}
        </button>
        <button
          onClick={handleReset}
          className="p-3 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-50 rounded-lg hover:bg-gray-300 transition-colors"
        >
          <RotateCcw size={24} />
        </button>
      </div>
    </div>
  );
};
