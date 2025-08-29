import { useState } from "react";
import ParticleBackground from "@/components/ParticleBackground";
import PomodoroTimer from "@/components/PomodoroTimer";
import AmbientAudioMixer from "@/components/AmbientAudioMixer";
import DailyProgress from "@/components/DailyProgress";
import SpotifyIntegration from "@/components/SpotifyIntergration";
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
    console.log(`Mode changed to: ${mode}, Timer active: ${isActive}`);
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
    <div className="min-h-screen relative overflow-hidden bg-background text-foreground">
      {/* Particle Background */}
      <ParticleBackground />
      
      {/* Main Content */}
      <div className="relative z-10 min-h-screen p-4 flex flex-col max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 animate-fade-in">
          <div className="flex items-center space-x-3 group">
            <Sparkles className="w-8 h-8 text-primary transform transition-all duration-500 group-hover:scale-110 group-hover:rotate-12 group-hover:drop-shadow-[0_0_15px_rgba(240,220,130,0.6)]" />
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary via-primary-glow to-accent bg-clip-text text-transparent transform transition-all duration-500 group-hover:scale-105">
              Cosmic Focus
            </h1>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Current Mode Indicator */}
            <div className="flex items-center space-x-2">
              <Badge 
                variant="secondary" 
                className={`
                  px-3 py-1 text-sm font-medium transition-all duration-500
                  ${modeInfo.color} border-primary/20 bg-primary/10
                  hover:bg-primary/20 hover:scale-105 hover:shadow-glow-primary
                `}
              >
                {modeInfo.icon}
                <span className="ml-1">{modeInfo.title}</span>
              </Badge>
              
              {isTimerActive && (
                <Badge 
                  variant="outline" 
                  className="px-2 py-1 text-xs animate-pulse-glow border-primary/30 bg-primary/5"
                >
                  <div className="w-2 h-2 rounded-full bg-primary animate-pulse mr-1" />
                  Active
                </Badge>
              )}
            </div>

            {/* User Menu */}
            {user ? (
              <Button 
                variant="ghost" 
                className="flex items-center space-x-2 transition-all duration-300 hover:bg-primary/10 hover:scale-105 hover:shadow-glow-primary"
              >
                <User className="w-4 h-4" />
                <span className="hidden sm:inline">{user.name}</span>
              </Button>
            ) : (
              <Button 
                onClick={() => setShowAuthModal(true)}
                variant="outline"
                className="flex items-center space-x-2 transition-all duration-300 hover:bg-primary/10 hover:scale-105 hover:shadow-glow-primary border-primary/30"
              >
                <LogIn className="w-4 h-4" />
                <span className="hidden sm:inline">Sign In</span>
              </Button>
            )}
          </div>
        </div>

        {/* Main Layout */}
        <div className="grid lg:grid-cols-4 gap-8 flex-grow">
          {/* Left Sidebar - Progress & Stats */}
          <div className="lg:col-span-1 space-y-6">
            <div className="animate-fade-in" style={{ animationDelay: "0.2s" }}>
              <DailyProgress user={user} completedSessions={completedSessions} />
            </div>
          </div>

          {/* Center - Timer */}
          <div className="lg:col-span-2 space-y-8">
            <div className="animate-fade-in" style={{ animationDelay: "0.4s" }}>
              <PomodoroTimer 
                onModeChange={handleModeChange}
                onSessionComplete={handleSessionComplete}
              />
            </div>
            
            {/* Mode Description */}
            <Card className="p-6 bg-card/70 backdrop-blur-lg border-primary/20 text-center animate-fade-in hover:shadow-glow-primary transition-all duration-500 hover:scale-[1.02]" style={{ animationDelay: "0.6s" }}>
              <p className="text-sm text-muted-foreground font-medium">
                {modeInfo.description}
              </p>
            </Card>

            {/* Enhanced Features Tabs */}
            <div className="animate-fade-in" style={{ animationDelay: "0.8s" }}>
              <Tabs defaultValue="audio" className="w-full">
                <TabsList className="grid w-full grid-cols-3 bg-card/50 backdrop-blur-sm border-border/30">
                  <TabsTrigger value="audio" className="flex items-center space-x-2 transition-all duration-300 hover:bg-primary/10 data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
                    <Headphones className="w-4 h-4" />
                    <span className="hidden sm:inline">Audio</span>
                  </TabsTrigger>
                  <TabsTrigger value="music" className="flex items-center space-x-2 transition-all duration-300 hover:bg-primary/10 data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
                    <Music className="w-4 h-4" />
                    <span className="hidden sm:inline">Music</span>
                  </TabsTrigger>
                  <TabsTrigger value="settings" className="flex items-center space-x-2 transition-all duration-300 hover:bg-primary/10 data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
                    <Settings className="w-4 h-4" />
                    <span className="hidden sm:inline">Settings</span>
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="audio" className="mt-6">
                  <AmbientAudioMixer />
                </TabsContent>
                
                <TabsContent value="music" className="mt-6">
                  <SpotifyIntegration />
                </TabsContent>
                
                <TabsContent value="settings" className="mt-6">
                  <SettingsPanel completedSessions={completedSessions} />
                </TabsContent>
              </Tabs>
            </div>
          </div>

          {/* Right Sidebar - Additional Features */}
          <div className="lg:col-span-1 space-y-6">
            {/* Tips Card */}
            <Card className="p-6 bg-card/60 backdrop-blur-lg border-primary/20 animate-fade-in hover:shadow-glow-primary transition-all duration-500 hover:scale-[1.02]" style={{ animationDelay: "1s" }}>
              <div className="flex items-start space-x-4">
                <Sparkles className="w-6 h-6 text-primary mt-0.5 flex-shrink-0" />
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold text-foreground">Productivity Tips</h4>
                  <ul className="text-xs text-muted-foreground space-y-2">
                    <li className="flex items-start">
                      <span className="text-primary mr-2">•</span>
                      <span>Set daily focus goals</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary mr-2">•</span>
                      <span>Use ambient sounds for concentration</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary mr-2">•</span>
                      <span>Take regular breaks</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary mr-2">•</span>
                      <span>Track your progress</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary mr-2">•</span>
                      <span>Share achievements</span>
                    </li>
                  </ul>
                </div>
              </div>
            </Card>

            {/* Quick Stats */}
            <Card className="p-6 bg-card/60 backdrop-blur-lg border-primary/20 animate-fade-in hover:shadow-glow-primary transition-all duration-500 hover:scale-[1.02]" style={{ animationDelay: "1.2s" }}>
              <div className="space-y-4">
                <h4 className="text-sm font-semibold flex items-center">
                  <BarChart3 className="w-5 h-5 mr-3 text-primary" />
                  Today's Stats
                </h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Focus Time</span>
                    <span className="font-semibold text-primary">{completedSessions * 25}m</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Sessions</span>
                    <span className="font-semibold text-primary">{completedSessions}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Productivity</span>
                    <span className="font-semibold text-primary">
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
