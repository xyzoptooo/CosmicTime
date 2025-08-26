import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { 
  Share2, 
  Twitter, 
  Facebook, 
  Linkedin, 
  MessageCircle,
  Copy,
  Settings,
  Volume2,
  Sparkles,
  Monitor,
  Moon,
  Sun
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SettingsPanelProps {
  completedSessions: number;
  onThemeChange?: (theme: string) => void;
}

const SettingsPanel = ({ completedSessions, onThemeChange }: SettingsPanelProps) => {
  const [settings, setSettings] = useState({
    soundEnabled: true,
    animationsEnabled: true,
    notificationsEnabled: true,
    autoStartBreaks: true,
    theme: 'cosmic',
  });
  const { toast } = useToast();

  const shareStats = {
    sessions: completedSessions,
    minutes: completedSessions * 25,
    productivity: Math.min(100, (completedSessions / 8) * 100),
  };

  const shareText = `🚀 Just completed ${shareStats.sessions} focus sessions (${shareStats.minutes} minutes) on Cosmic Focus! 
  
Boosting productivity with immersive Pomodoro sessions ✨

#productivity #focus #pomodoro`;

  const handleShare = (platform: string) => {
    const encodedText = encodeURIComponent(shareText);
    const url = encodeURIComponent(window.location.href);
    
    const shareUrls = {
      twitter: `https://twitter.com/intent/tweet?text=${encodedText}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${encodedText}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
      copy: shareText,
    };

    if (platform === 'copy') {
      navigator.clipboard.writeText(shareText);
      toast({
        title: "Copied to clipboard! 📋",
        description: "Share your progress anywhere",
      });
    } else {
      window.open(shareUrls[platform as keyof typeof shareUrls], '_blank', 'width=600,height=400');
    }
  };

  const updateSetting = (key: string, value: boolean | string) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    
    if (key === 'theme') {
      onThemeChange?.(value as string);
    }
    
    toast({
      title: "Settings updated",
      description: `${key.replace(/([A-Z])/g, ' $1').toLowerCase()} ${value ? 'enabled' : 'disabled'}`,
    });
  };

  return (
    <div className="space-y-4">
      {/* Share Progress */}
      <Card className="p-4 bg-card/80 backdrop-blur-sm border-border/50">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium flex items-center">
              <Share2 className="w-4 h-4 mr-2 text-accent" />
              Share Progress
            </h4>
            <Badge variant="secondary" className="text-xs">
              {shareStats.sessions} sessions
            </Badge>
          </div>

          {/* Stats Preview */}
          <div className="bg-gradient-nebula rounded-lg p-4 text-center space-y-2">
            <div className="text-2xl font-bold text-primary">{shareStats.sessions}</div>
            <div className="text-sm text-foreground">Focus sessions completed</div>
            <div className="text-xs text-muted-foreground">
              {shareStats.minutes} minutes • {Math.round(shareStats.productivity)}% daily goal
            </div>
          </div>

          {/* Share Buttons */}
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleShare('twitter')}
              className="flex items-center space-x-2"
            >
              <Twitter className="w-4 h-4" />
              <span>Twitter</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleShare('facebook')}
              className="flex items-center space-x-2"
            >
              <Facebook className="w-4 h-4" />
              <span>Facebook</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleShare('linkedin')}
              className="flex items-center space-x-2"
            >
              <Linkedin className="w-4 h-4" />
              <span>LinkedIn</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleShare('copy')}
              className="flex items-center space-x-2"
            >
              <Copy className="w-4 h-4" />
              <span>Copy</span>
            </Button>
          </div>
        </div>
      </Card>

      {/* Settings */}
      <Card className="p-4 bg-card/80 backdrop-blur-sm border-border/50">
        <div className="space-y-4">
          <h4 className="font-medium flex items-center">
            <Settings className="w-4 h-4 mr-2 text-primary" />
            Settings
          </h4>

          {/* Audio Settings */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Volume2 className="w-4 h-4 text-muted-foreground" />
                <Label htmlFor="sounds">Sounds</Label>
              </div>
              <Switch
                id="sounds"
                checked={settings.soundEnabled}
                onCheckedChange={(checked) => updateSetting('soundEnabled', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-muted-foreground" />
                <Label htmlFor="animations">Animations</Label>
              </div>
              <Switch
                id="animations"
                checked={settings.animationsEnabled}
                onCheckedChange={(checked) => updateSetting('animationsEnabled', checked)}
              />
            </div>
          </div>

          <Separator />

          {/* App Settings */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="notifications">Notifications</Label>
              <Switch
                id="notifications"
                checked={settings.notificationsEnabled}
                onCheckedChange={(checked) => updateSetting('notificationsEnabled', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="auto-breaks">Auto-start breaks</Label>
              <Switch
                id="auto-breaks"
                checked={settings.autoStartBreaks}
                onCheckedChange={(checked) => updateSetting('autoStartBreaks', checked)}
              />
            </div>
          </div>

          <Separator />

          {/* Theme Settings */}
          <div className="space-y-3">
            <Label>Theme</Label>
            <div className="grid grid-cols-3 gap-2">
              <Button
                variant={settings.theme === 'cosmic' ? 'default' : 'outline'}
                size="sm"
                onClick={() => updateSetting('theme', 'cosmic')}
                className="flex items-center space-x-1"
              >
                <Sparkles className="w-3 h-3" />
                <span className="text-xs">Cosmic</span>
              </Button>
              <Button
                variant={settings.theme === 'light' ? 'default' : 'outline'}
                size="sm"
                onClick={() => updateSetting('theme', 'light')}
                className="flex items-center space-x-1"
              >
                <Sun className="w-3 h-3" />
                <span className="text-xs">Light</span>
              </Button>
              <Button
                variant={settings.theme === 'dark' ? 'default' : 'outline'}
                size="sm"
                onClick={() => updateSetting('theme', 'dark')}
                className="flex items-center space-x-1"
              >
                <Moon className="w-3 h-3" />
                <span className="text-xs">Dark</span>
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Community Links */}
      <Card className="p-4 bg-card/60 backdrop-blur-sm border-border/30">
        <div className="space-y-3">
          <h4 className="font-medium text-sm">Community</h4>
          <div className="space-y-2">
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start text-xs"
              onClick={() => window.open('https://discord.gg/example', '_blank')}
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Join Discord Community
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default SettingsPanel;