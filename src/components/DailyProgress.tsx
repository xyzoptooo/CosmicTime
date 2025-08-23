import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import Progress from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import Input from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Target, CheckCircle } from "lucide-react";

interface DailyProgressProps {
  user: { name: string; email: string } | null;
  completedSessions: number;
}

const DailyProgress = ({ user, completedSessions }: DailyProgressProps) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [is24Hour, setIs24Hour] = useState(false);
  const [dailyGoals, setDailyGoals] = useState([
    { id: 1, text: "Complete 4 focus sessions", completed: false, target: 4, current: completedSessions },
    { id: 2, text: "Review project notes", completed: false, target: 1, current: 0 },
    { id: 3, text: "Plan tomorrow's tasks", completed: false, target: 1, current: 0 },
  ]);
  const [newGoal, setNewGoal] = useState("");
  const [showAddGoal, setShowAddGoal] = useState(false);
  const [todayProgress, setTodayProgress] = useState(0);

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Update daily progress based on completed sessions
  useEffect(() => {
    setDailyGoals(prev => 
      prev.map(goal => 
        goal.id === 1 
          ? { ...goal, current: completedSessions, completed: completedSessions >= goal.target }
          : goal
      )
    );
  }, [completedSessions]);

  // Calculate overall progress
  useEffect(() => {
    const totalGoals = dailyGoals.length;
    const completedGoals = dailyGoals.filter(goal => goal.completed).length;
    setTodayProgress(totalGoals > 0 ? (completedGoals / totalGoals) * 100 : 0);
  }, [dailyGoals]);

  const formatTime = (date: Date) => {
    if (is24Hour) {
      return date.toLocaleTimeString('en-US', { 
        hour12: false, 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit' 
      });
    } else {
      return date.toLocaleTimeString('en-US', { 
        hour12: true, 
        hour: 'numeric', 
        minute: '2-digit', 
        second: '2-digit' 
      });
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      day: 'numeric',
      month: 'short',
      year: '2-digit'
    });
  };

  const addGoal = () => {
    if (!newGoal.trim()) return;
    
    const goal = {
      id: Date.now(),
      text: newGoal.trim(),
      completed: false,
      target: 1,
      current: 0,
    };
    
    setDailyGoals(prev => [...prev, goal]);
    setNewGoal("");
    setShowAddGoal(false);
  };

  const toggleGoal = (id: number) => {
    setDailyGoals(prev =>
      prev.map(goal =>
        goal.id === id ? { ...goal, completed: !goal.completed } : goal
      )
    );
  };

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="space-y-4">
      {/* Clock Display */}
      <Card className="p-4 bg-card/80 backdrop-blur-sm border-border/50 text-center">
        <Button
          variant="ghost"
          onClick={() => setIs24Hour(!is24Hour)}
          className="p-0 h-auto hover:bg-transparent"
        >
          <div className="space-y-1">
            <div className="text-3xl font-mono font-bold text-primary">
              {formatTime(currentTime)}
            </div>
            <div className="text-sm text-muted-foreground">
              {formatDate(currentTime)}
            </div>
            <div className="text-xs text-muted-foreground/60">
              Click to toggle between 24hr and 12hr clocks!
            </div>
          </div>
        </Button>
      </Card>

      {/* Welcome & Progress */}
      <Card className="p-4 bg-card/80 backdrop-blur-sm border-border/50">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">
                {user ? `${getGreeting()}, ${user.name}!` : `${getGreeting()}!`}
              </h3>
              <p className="text-sm text-muted-foreground">
                {Math.round(todayProgress)}% complete
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-primary">{completedSessions}</div>
              <div className="text-xs text-muted-foreground">sessions today</div>
            </div>
          </div>

          {/* Daily Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Your Day: 00:00-23:59</span>
              <span className="text-muted-foreground">Click bar to edit schedule</span>
            </div>
            <Progress value={todayProgress} className="h-2" />
          </div>
        </div>
      </Card>

      {/* Today's Focus Goals */}
      <Card className="p-4 bg-card/80 backdrop-blur-sm border-border/50">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium flex items-center">
              <Target className="w-4 h-4 mr-2 text-primary" />
              Today's Focus
            </h4>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowAddGoal(!showAddGoal)}
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>

          {/* Add New Goal */}
          {showAddGoal && (
            <div className="flex space-x-2">
              <Input
                placeholder="Add a focus goal..."
                value={newGoal}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewGoal(e.target.value)}
                onKeyPress={(e: React.KeyboardEvent<HTMLInputElement>) => e.key === 'Enter' && addGoal()}
                className="text-sm"
              />
              <Button size="sm" onClick={addGoal}>
                Add
              </Button>
            </div>
          )}

          {/* Goals List */}
          <div className="space-y-2">
            {dailyGoals.map((goal) => (
              <div
                key={goal.id}
                className={`
                  flex items-center space-x-3 p-2 rounded-lg transition-colors cursor-pointer
                  ${goal.completed 
                    ? 'bg-primary/10 text-primary' 
                    : 'hover:bg-muted/50'
                  }
                `}
                onClick={() => toggleGoal(goal.id)}
              >
                <CheckCircle 
                  className={`w-4 h-4 ${goal.completed ? 'text-primary' : 'text-muted-foreground'}`} 
                />
                <span className={`flex-1 text-sm ${goal.completed ? 'line-through' : ''}`}>
                  {goal.text}
                </span>
                {goal.target > 1 && (
                  <Badge variant="secondary" className="text-xs">
                    {goal.current}/{goal.target}
                  </Badge>
                )}
              </div>
            ))}
          </div>

          {dailyGoals.length === 0 && (
            <div className="text-center py-4 text-muted-foreground text-sm">
              No goals set for today. Add one to get started!
            </div>
          )}
        </div>
      </Card>

      {/* Quick Stats */}
      <Card className="p-4 bg-card/60 backdrop-blur-sm border-border/30">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-xl font-bold text-primary">{completedSessions}</div>
            <div className="text-xs text-muted-foreground">Sessions</div>
          </div>
          <div>
            <div className="text-xl font-bold text-timer-focus">{completedSessions * 25}</div>
            <div className="text-xs text-muted-foreground">Minutes</div>
          </div>
          <div>
            <div className="text-xl font-bold text-accent">{Math.round(todayProgress)}%</div>
            <div className="text-xs text-muted-foreground">Progress</div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default DailyProgress;
