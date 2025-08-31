import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Input from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Music, Play, Pause, SkipBack, SkipForward, Volume2, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const SpotifyIntegration = () => {
  const [spotifyUrl, setSpotifyUrl] = useState("");
  const [currentTrack, setCurrentTrack] = useState({
    name: "Late night lofi 🎷",
    artist: "WonderSpace Lofi",
    album: "ICARUS",
    isPlaying: false,
    playlist: true,
  });
  const [isConnected, setIsConnected] = useState(false);
  const { toast } = useToast();

  const handleSpotifyConnect = () => {
    if (!spotifyUrl.includes('spotify.com')) {
      toast({
        title: "Invalid Spotify Link",
        description: "Please enter a valid Spotify playlist or track URL",
        variant: "destructive",
      });
      return;
    }

    setIsConnected(true);
    toast({
      title: "Spotify Connected! 🎵",
      description: "Your playlist is now ready to play",
    });
  };

  const togglePlayback = () => {
    setCurrentTrack(prev => ({ ...prev, isPlaying: !prev.isPlaying }));
    toast({
      title: currentTrack.isPlaying ? "Music Paused" : "Music Playing",
      description: `${currentTrack.name} • ${currentTrack.artist}`,
    });
  };

  const openSpotify = () => {
    window.open('https://open.spotify.com/playlist/1buR1viIOgrYIWWX4j14gL', '_blank');
  };

  return (
    <Card className="p-4 bg-card/80 backdrop-blur-sm border-border/50">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h4 className="font-medium flex items-center">
            <Music className="w-4 h-4 mr-2 text-accent" />
            Spotify Integration
          </h4>
          {isConnected && (
            <Badge variant="secondary" className="text-xs">
              Connected
            </Badge>
          )}
        </div>

        {!isConnected ? (
          /* Spotify URL Input */
          <div className="space-y-3">
            <Input
              placeholder="Paste Spotify playlist or track URL..."
              value={spotifyUrl}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSpotifyUrl(e.target.value)}
              className="text-sm"
            />
            <Button 
              onClick={handleSpotifyConnect}
              className="w-full"
              disabled={!spotifyUrl}
            >
              Connect Spotify
            </Button>
            <p className="text-xs text-muted-foreground text-center">
              Connect your Spotify to play focus music
            </p>
          </div>
        ) : (
          /* Music Player */
          <div className="space-y-4">
            {/* Current Track Info */}
            <div className="bg-muted/30 rounded-lg p-3 space-y-2">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <h5 className="font-medium text-sm truncate">{currentTrack.name}</h5>
                  <p className="text-xs text-muted-foreground truncate">
                    {currentTrack.artist}
                  </p>
                  {currentTrack.album && (
                    <p className="text-xs text-muted-foreground/80">
                      {currentTrack.album}
                    </p>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={openSpotify}
                  className="p-1 h-auto"
                >
                  <ExternalLink className="w-3 h-3" />
                </Button>
              </div>

              {/* Playback Progress */}
              <div className="w-full bg-border/30 rounded-full h-1">
                <div className="bg-accent h-1 rounded-full w-1/3 transition-all duration-1000 animate-pulse" />
              </div>
            </div>

            {/* Player Controls */}
            <div className="flex items-center justify-center space-x-4">
              <Button variant="ghost" size="sm" className="p-2">
                <SkipBack className="w-4 h-4" />
              </Button>
              
              <Button
                onClick={togglePlayback}
                className="p-3 rounded-full"
                size="sm"
              >
                {currentTrack.isPlaying ? (
                  <Pause className="w-4 h-4" />
                ) : (
                  <Play className="w-4 h-4" />
                )}
              </Button>
              
              <Button variant="ghost" size="sm" className="p-2">
                <SkipForward className="w-4 h-4" />
              </Button>
              
              <Button variant="ghost" size="sm" className="p-2">
                <Volume2 className="w-4 h-4" />
              </Button>
            </div>

            {/* Quick Actions */}
            <div className="flex space-x-2 text-xs">
              <Button variant="outline" size="sm" onClick={openSpotify}>
                Play on Spotify
              </Button>
              <Button variant="outline" size="sm">
                Save Playlist
              </Button>
            </div>
          </div>
        )}

        {/* Suggested Playlists */}
        <div className="pt-3 border-t border-border/30">
          <p className="text-xs text-muted-foreground mb-2">Quick Connect:</p>
          <div className="space-y-1">
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start text-xs h-auto p-2"
              onClick={() => {
                setSpotifyUrl('https://open.spotify.com/playlist/1buR1viIOgrYIWWX4j14gL');
                setIsConnected(true);
              }}
            >
              🎷 Late Night Lofi - WonderSpace
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start text-xs h-auto p-2"
              onClick={() => {
                setSpotifyUrl('https://open.spotify.com/playlist/focus');
                setIsConnected(true);
              }}
            >
              🎵 Deep Focus Instrumentals
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default SpotifyIntegration;