import { useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Volume2, VolumeX, Cloud, Waves, Wind, TreePine, Coffee, Zap } from "lucide-react";

interface AudioTrack {
  id: string;
  name: string;
  icon: React.ReactNode;
  url: string;
  audio?: HTMLAudioElement;
}

const AmbientAudioMixer = () => {
  const [masterVolume, setMasterVolume] = useState([70]);
  const [isGlobalMuted, setIsGlobalMuted] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const masterGainNodeRef = useRef<GainNode | null>(null);

  const [tracks, setTracks] = useState<AudioTrack[]>([
    {
      id: "rain",
      name: "Rain",
      icon: <Cloud className="w-4 h-4" />,
      url: "https://www.soundjay.com/misc/sounds/rain-01.wav", // Placeholder - you'd want real audio files
    },
    {
      id: "ocean",
      name: "Ocean Waves",
      icon: <Waves className="w-4 h-4" />,
      url: "https://www.soundjay.com/misc/sounds/ocean-waves.wav", // Placeholder
    },
    {
      id: "wind",
      name: "Forest Wind",
      icon: <Wind className="w-4 h-4" />,
      url: "https://www.soundjay.com/misc/sounds/wind.wav", // Placeholder
    },
    {
      id: "forest",
      name: "Forest",
      icon: <TreePine className="w-4 h-4" />,
      url: "https://www.soundjay.com/misc/sounds/forest.wav", // Placeholder
    },
    {
      id: "cafe",
      name: "Coffee Shop",
      icon: <Coffee className="w-4 h-4" />,
      url: "https://www.soundjay.com/misc/sounds/cafe.wav", // Placeholder
    },
    {
      id: "whitenoise",
      name: "White Noise",
      icon: <Zap className="w-4 h-4" />,
      url: "https://www.soundjay.com/misc/sounds/whitenoise.wav", // Placeholder
    },
  ]);

  const [trackVolumes, setTrackVolumes] = useState<Record<string, number>>({});
  const [trackMuted, setTrackMuted] = useState<Record<string, boolean>>({});
  const gainNodesRef = useRef<Record<string, GainNode>>({});

  // Initialize Web Audio API
  useEffect(() => {
const initAudio = async () => {
    // Resume the AudioContext on user interaction
    const resumeAudioContext = () => {
        if (audioContextRef.current) {
            audioContextRef.current.resume().then(() => {
                console.log("AudioContext resumed");
            });
            window.removeEventListener("click", resumeAudioContext);
        }
    };

    window.addEventListener("click", resumeAudioContext);
    // Resume the AudioContext on user interaction
    const resumeAudioContext = () => {
        if (audioContextRef.current) {
            audioContextRef.current.resume().then(() => {
                console.log("AudioContext resumed");
            });
            window.removeEventListener("click", resumeAudioContext);
        }
    };

    window.addEventListener("click", resumeAudioContext);
      try {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        masterGainNodeRef.current = audioContextRef.current.createGain();
        masterGainNodeRef.current.connect(audioContextRef.current.destination);
        
        // Set initial master volume
        masterGainNodeRef.current.gain.value = masterVolume[0] / 100;
      } catch (error) {
        console.warn("Web Audio API not supported:", error);
      }
    };

    initAudio();

    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, [masterVolume]);

  // Create simple oscillator-based ambient sounds (since we can't use external files easily)
  const createAmbientSound = (type: string): HTMLAudioElement | null => {
    if (!audioContextRef.current || !masterGainNodeRef.current) return null;

    try {
      // Create a simple noise generator for demo purposes
      const gainNode = audioContextRef.current.createGain();
      gainNode.connect(masterGainNodeRef.current);
      gainNodesRef.current[type] = gainNode;

      // Create different types of ambient sounds using oscillators and noise
      const oscillator = audioContextRef.current.createOscillator();
      const filter = audioContextRef.current.createBiquadFilter();
      
      // Configure based on sound type
      switch (type) {
        case "rain":
          // High-frequency filtered noise for rain
          filter.type = "bandpass";
          filter.frequency.value = 2000;
          filter.Q.value = 0.5;
          break;
        case "ocean":
          // Low-frequency filtered noise for ocean
          filter.type = "lowpass";
          filter.frequency.value = 500;
          break;
        case "wind":
          // Mid-frequency filtered noise for wind
          filter.type = "bandpass";
          filter.frequency.value = 800;
          filter.Q.value = 0.3;
          break;
        case "forest":
          // Multiple frequency noise for forest
          filter.type = "bandpass";
          filter.frequency.value = 1200;
          filter.Q.value = 0.4;
          break;
        case "cafe":
          // Mid-range noise for cafe ambience
          filter.type = "bandpass";
          filter.frequency.value = 600;
          filter.Q.value = 0.6;
          break;
        case "whitenoise":
          // Full spectrum for white noise
          filter.type = "allpass";
          break;
      }

      oscillator.type = "sawtooth";
      oscillator.frequency.value = 100;
      oscillator.connect(filter);
      filter.connect(gainNode);
      
      gainNode.gain.value = 0; // Start muted
      oscillator.start();

      // Create a dummy audio element for interface consistency
      const dummyAudio = new Audio();
      dummyAudio.loop = true;
      return dummyAudio;
    } catch (error) {
      console.warn("Failed to create ambient sound:", error);
      return null;
    }
  };

  // Initialize track volumes and audio
  useEffect(() => {
    const initialVolumes: Record<string, number> = {};
    const initialMuted: Record<string, boolean> = {};

    tracks.forEach((track) => {
      initialVolumes[track.id] = 0;
      initialMuted[track.id] = true;
      
      // Create ambient sound for each track
      const audio = createAmbientSound(track.id);
      if (audio) {
        track.audio = audio;
      }
    });

    setTrackVolumes(initialVolumes);
    setTrackMuted(initialMuted);
  }, []);

  const updateMasterVolume = (value: number[]) => {
    setMasterVolume(value);
    if (masterGainNodeRef.current) {
      masterGainNodeRef.current.gain.value = isGlobalMuted ? 0 : value[0] / 100;
    }
  };

  const updateTrackVolume = (trackId: string, volume: number) => {
    setTrackVolumes(prev => ({ ...prev, [trackId]: volume }));
    
    if (gainNodesRef.current[trackId]) {
      const gainValue = trackMuted[trackId] ? 0 : volume / 100 * 0.3; // Scale down for pleasant mixing
      gainNodesRef.current[trackId].gain.value = gainValue;
    }
  };

  const toggleTrackMute = (trackId: string) => {
    const newMutedState = !trackMuted[trackId];
    setTrackMuted(prev => ({ ...prev, [trackId]: newMutedState }));
    
    if (gainNodesRef.current[trackId]) {
      const gainValue = newMutedState ? 0 : trackVolumes[trackId] / 100 * 0.3;
      gainNodesRef.current[trackId].gain.value = gainValue;
    }
  };

  const toggleGlobalMute = () => {
    const newMutedState = !isGlobalMuted;
    setIsGlobalMuted(newMutedState);
    
    if (masterGainNodeRef.current) {
      masterGainNodeRef.current.gain.value = newMutedState ? 0 : masterVolume[0] / 100;
    }
  };

  return (
    <Card className="p-6 bg-card/80 backdrop-blur-sm border-border/50">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground">Ambient Sounds</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleGlobalMute}
            className="text-muted-foreground hover:text-foreground"
          >
            {isGlobalMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </Button>
        </div>

        {/* Master Volume */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-foreground">Master Volume</span>
            <span className="text-xs text-muted-foreground">{masterVolume[0]}%</span>
          </div>
          <Slider
            value={masterVolume}
            onValueChange={updateMasterVolume}
            max={100}
            step={1}
            className="w-full"
          />
        </div>

        {/* Individual Tracks */}
        <div className="space-y-4">
          <div className="text-sm font-medium text-foreground">Sound Layers</div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {tracks.map((track) => (
              <div key={track.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleTrackMute(track.id)}
                      className={`
                        p-1 h-auto transition-colors duration-200
                        ${trackMuted[track.id] 
                          ? 'text-muted-foreground' 
                          : 'text-primary'
                        }
                      `}
                    >
                      {track.icon}
                    </Button>
                    <span className="text-sm text-foreground">{track.name}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {trackMuted[track.id] ? '0' : trackVolumes[track.id] || 0}%
                  </span>
                </div>
                
                <Slider
                  value={[trackVolumes[track.id] || 0]}
                  onValueChange={(value) => updateTrackVolume(track.id, value[0])}
                  max={100}
                  step={1}
                  className="w-full"
                  disabled={trackMuted[track.id]}
                />
              </div>
            ))}
          </div>
        </div>
        
        <div className="pt-4 border-t border-border/30">
          <p className="text-xs text-muted-foreground text-center">
            Layer different ambient sounds to create your perfect focus environment
          </p>
        </div>
      </div>
    </Card>
  );
};

export default AmbientAudioMixer;