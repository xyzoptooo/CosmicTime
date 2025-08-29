import { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Play, Pause, RotateCcw, Sparkles } from "lucide-react";

type TimerMode = "focus" | "shortBreak" | "longBreak";

interface PomodoroTimerProps {
  onModeChange?: (mode: TimerMode, isActive: boolean) => void;
  onSessionComplete?: (sessions: number) => void;
}

const PomodoroTimer = ({ onModeChange, onSessionComplete }: PomodoroTimerProps) => {
  const [mode, setMode] = useState<TimerMode>("focus");
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds
  const [isActive, setIsActive] = useState(false);
  const [completedSessions, setCompletedSessions] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const timerRef = useRef<HTMLDivElement>(null);

  const durations = {
    focus: 25 * 60,
    shortBreak: 5 * 60,
    longBreak: 15 * 60,
  };

  const modeLabels = {
    focus: "Focus",
    shortBreak: "Short Break",
    longBreak: "Long Break",
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const switchMode = useCallback((newMode: TimerMode) => {
    setMode(newMode);
    setTimeLeft(durations[newMode]);
    setIsActive(false);
    onModeChange?.(newMode, false);
  }, [durations, onModeChange]);

  const handleComplete = useCallback(() => {
    setIsActive(false);
    
    if (mode === "focus") {
      const newCompletedSessions = completedSessions + 1;
      setCompletedSessions(newCompletedSessions);
      onSessionComplete?.(newCompletedSessions);
      
      // Show celebration effect
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 2000);
      
      // Auto-switch to break mode
      const nextMode = newCompletedSessions % 4 === 0 ? "longBreak" : "shortBreak";
      
      // Smooth mode transition
      setIsTransitioning(true);
      setTimeout(() => {
        switchMode(nextMode);
        setIsTransitioning(false);
      }, 500);
      
      // Show completion message in console
      console.log(`Focus session completed! Time for a ${nextMode === "longBreak" ? "long" : "short"} break.`);
    } else {
      // Smooth transition back to focus
      setIsTransitioning(true);
      setTimeout(() => {
        switchMode("focus");
        setIsTransitioning(false);
      }, 500);
      console.log("Break time's over! Ready to focus again?");
    }
  }, [mode, completedSessions, switchMode, onSessionComplete]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    onModeChange?.(mode, isActive);
  }, [mode, isActive, onModeChange]);

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(durations[mode]);
  };

  const progress = ((durations[mode] - timeLeft) / durations[mode]) * 100;

  return (
    <Card className={`
      relative p-8 bg-timer-bg border-border/50 backdrop-blur-sm
      transition-all duration-500
    `}>
      {/* Progress ring background */}
      <div className="absolute inset-0 rounded-lg">
        <svg className="w-full h-full" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="hsl(var(--border))"
            strokeWidth="0.5"
            className="opacity-20"
          />
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke={mode === 'focus' ? 'hsl(var(--focus-color))' : 'hsl(var(--break-color))'}
            strokeWidth="0.5"
            strokeLinecap="round"
            strokeDasharray={`${2 * Math.PI * 45}`}
            strokeDashoffset={`${2 * Math.PI * 45 * (1 - progress / 100)}`}
            className="transition-all duration-1000 opacity-60"
            style={{
              transform: 'rotate(-90deg)',
              transformOrigin: '50% 50%',
            }}
          />
        </svg>
      </div>

      <div className="relative z-10 text-center space-y-6">
        {/* Mode tabs */}
        <div className="flex justify-center space-x-2">
          {(Object.keys(modeLabels) as TimerMode[]).map((timerMode) => (
            <Button
              key={timerMode}
              variant={mode === timerMode ? "default" : "ghost"}
              size="sm"
              onClick={() => switchMode(timerMode)}
              disabled={isActive}
              className={`
                text-xs font-medium transition-all duration-300
                ${mode === timerMode 
                  ? 'bg-primary text-primary-foreground shadow-glow-primary' 
                  : 'text-muted-foreground hover:text-foreground'
                }
              `}
            >
              {modeLabels[timerMode]}
            </Button>
          ))}
        </div>

        {/* Timer display */}
        <div className="space-y-2">
          <div className={`
            text-6xl font-bold font-mono tracking-wider
            ${mode === 'focus' ? 'text-timer-focus' : 'text-timer-break'}
            transition-colors duration-500
          `}>
            {formatTime(timeLeft)}
          </div>
          
          {mode === 'focus' && (
            <Badge variant="secondary" className="text-xs">
              Session {completedSessions + 1}
            </Badge>
          )}
        </div>

        {/* Controls */}
        <div className="flex justify-center space-x-4">
          <Button
            onClick={toggleTimer}
            size="lg"
            className={`
              px-8 py-3 font-semibold transition-all duration-300
              ${isActive 
                ? 'bg-timer-pause text-background hover:bg-timer-pause/90' 
                : 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-glow-primary'
              }
            `}
          >
            {isActive ? (
              <>
                <Pause className="w-5 h-5 mr-2" />
                Pause
              </>
            ) : (
              <>
                <Play className="w-5 h-5 mr-2" />
                Start
              </>
            )}
          </Button>

          <Button
            onClick={resetTimer}
            variant="outline"
            size="lg"
            className="px-6 border-border/50 hover:border-border"
          >
            <RotateCcw className="w-5 h-5" />
          </Button>
        </div>

        {/* Stats */}
        {completedSessions > 0 && (
          <div className="pt-4 border-t border-border/30">
            <div className="text-sm text-muted-foreground">
              Completed sessions today: <span className="text-primary font-semibold">{completedSessions}</span>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default PomodoroTimer;
