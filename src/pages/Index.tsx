import { useState } from "react";
import ParticleBackground from "@/components/ParticleBackground";
import PomodoroTimer from "@/components/PomodoroTimer";
import AmbientAudioMixer from "@/components/AmbientAudioMixer";
import DailyProgress from "@/components/DailyProgress";
import SpotifyIntegration from "@/components/SpotifyIntegration";
import SettingsPanel from "@/components/SettingsPanel";
import AuthModal from "@/components/AuthModal";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock, Headphones, Sparkles, User, Settings, Music, BarChart3, LogIn } from "lucide-react";

type TimerMode = "focus" | "shortBreak" | "longBreak";

const Index = () => {
  const [currentMode, setCurrentMode] = useState<TimerMode>("focus");
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [completedSessions, setCompletedSessions] = useState(0);
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleModeChange = (mode: TimerMode, isActive: boolean) => {
    setCurrentMode(mode);
    setIsTimerActive(isActive);
  };

  const handleSessionComplete = (sessions: number) => {
    setCompletedSessions(sessions);
  };

  const handleAuth = (userData: { name: string; email: string }) => {
    setUser(userData);
    setShowAuthModal(false);
  };

  const getCurrentModeInfo = () => {
    switch (currentMode) {
      case "focus":
        return {
          title: "Focus Time",
          description: "Deep work session in progress",
          icon: <Clock className="w-4 h-4" />,
          color: "text-timer-focus",
        };
      case "shortBreak":
        return {
          title: "Short Break",
          description: "Take a quick breather",
          icon: <Sparkles className="w-4 h-4" />,
          color: "text-timer-break",
        };
      case "longBreak":
        return {
          title: "Long Break",
          description: "Well-deserved rest time",
          icon: <Sparkles className="w-4 h-4" />,
          color: "text-timer-break",
        };
    }
  };

  const modeInfo = getCurrentModeInfo();

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Particle Background */}
      <ParticleBackground />
      
      {/* Main Content */}
      <div className="relative z-10 min-h-screen p-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6 animate-fade-in">
            <div className="flex items-center space-x-3">
              <Sparkles className="w-8 h-8 text-primary" />
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-stellar bg-clip-text text-transparent">
                Cosmic Focus
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Current Mode Indicator */}
              <div className="flex items-center space-x-2">
                <Badge 
                  variant="secondary" 
                  className={`
                    px-3 py-1 text-sm font-medium transition-all duration-300
                    ${modeInfo.color}
                  `}
                >
                  {modeInfo.icon}
                  <span className="ml-1">{modeInfo.title}</span>
                </Badge>
                
                {isTimerActive && (
                  <Badge variant="outline" className="px-2 py-1 text-xs animate-pulse">
                    Active
                  </Badge>
                )}
              </div>

              {/* User Menu */}
              {user ? (
                <Button variant="ghost" className="flex items-center space-x-2">
                  <User className="w-4 h-4" />
                  <span className="hidden sm:inline">{user.name}</span>
                </Button>
              ) : (
                <Button 
                  onClick={() => setShowAuthModal(true)}
                  variant="outline"
                  className="flex items-center space-x-2"
                >
                  <LogIn className="w-4 h-4" />
                  <span className="hidden sm:inline">Sign In</span>
                </Button>
              )}
            </div>
          </div>

          {/* Main Layout */}
          <div className="grid lg:grid-cols-4 gap-6">
            {/* Left Sidebar - Progress & Stats */}
            <div className="lg:col-span-1 space-y-4">
              <div className="animate-fade-in" style={{ animationDelay: "0.2s" }}>
                <DailyProgress user={user} completedSessions={completedSessions} />
              </div>
            </div>

            {/* Center - Timer */}
            <div className="lg:col-span-2 space-y-6">
              <div className="animate-fade-in" style={{ animationDelay: "0.4s" }}>
                <PomodoroTimer 
                  onModeChange={handleModeChange}
                  onSessionComplete={handleSessionComplete}
                />
              </div>
              
              {/* Mode Description */}
              <Card className="p-4 bg-card/60 backdrop-blur-sm border-border/30 text-center animate-fade-in" style={{ animationDelay: "0.6s" }}>
                <p className="text-sm text-muted-foreground">
                  {modeInfo.description}
                </p>
              </Card>

              {/* Enhanced Features Tabs */}
              <div className="animate-fade-in" style={{ animationDelay: "0.8s" }}>
                <Tabs defaultValue="audio" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="audio" className="flex items-center space-x-2">
                      <Headphones className="w-4 h-4" />
                      <span className="hidden sm:inline">Audio</span>
                    </TabsTrigger>
                    <TabsTrigger value="music" className="flex items-center space-x-2">
                      <Music className="w-4 h-4" />
                      <span className="hidden sm:inline">Music</span>
                    </TabsTrigger>
                    <TabsTrigger value="settings" className="flex items-center space-x-2">
                      <Settings className="w-4 h-4" />
                      <span className="hidden sm:inline">Settings</span>
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="audio" className="mt-4">
                    <AmbientAudioMixer />
                  </TabsContent>
                  
                  <TabsContent value="music" className="mt-4">
                    <SpotifyIntegration />
                  </TabsContent>
                  
                  <TabsContent value="settings" className="mt-4">
                    <SettingsPanel completedSessions={completedSessions} />
                  </TabsContent>
                </Tabs>
              </div>
            </div>

            {/* Right Sidebar - Additional Features */}
            <div className="lg:col-span-1 space-y-4">
              {/* Tips Card */}
              <Card className="p-4 bg-card/40 backdrop-blur-sm border-border/20 animate-fade-in" style={{ animationDelay: "1s" }}>
                <div className="flex items-start space-x-3">
                  <Sparkles className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-foreground">Productivity Tips</h4>
                    <ul className="text-xs text-muted-foreground space-y-1">
                      <li>• Set daily focus goals</li>
                      <li>• Use ambient sounds for concentration</li>
                      <li>• Take regular breaks</li>
                      <li>• Track your progress</li>
                      <li>• Share achievements</li>
                    </ul>
                  </div>
                </div>
              </Card>

              {/* Quick Stats */}
              <Card className="p-4 bg-card/40 backdrop-blur-sm border-border/20 animate-fade-in" style={{ animationDelay: "1.2s" }}>
                <div className="space-y-3">
                  <h4 className="text-sm font-medium flex items-center">
                    <BarChart3 className="w-4 h-4 mr-2 text-primary" />
                    Today's Stats
                  </h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Focus Time</span>
                      <span className="font-medium">{completedSessions * 25}m</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Sessions</span>
                      <span className="font-medium">{completedSessions}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Productivity</span>
                      <span className="font-medium text-primary">
                        {Math.min(100, Math.round((completedSessions / 8) * 100))}%
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center mt-12 animate-fade-in" style={{ animationDelay: "1.4s" }}>
            <p className="text-xs text-muted-foreground/60">
              Built for deep focus and productivity • Inspired by the cosmos • Enhanced with Wonderspace features
            </p>
          </div>
        </div>
      </div>
      
      {/* Ambient overlay for focus mode */}
      {isTimerActive && currentMode === "focus" && (
        <div className="fixed inset-0 bg-background/20 backdrop-blur-[0.5px] z-0 transition-opacity duration-1000" />
      )}

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onAuth={handleAuth}
      />
    </div>
  );
};

export default Index;