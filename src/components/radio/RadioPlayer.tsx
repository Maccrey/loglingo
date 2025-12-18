"use client";

import { useEffect, useRef, useState } from "react";
import { RadioStation } from "@/domain/radio";
import { Play, Pause, Volume2, VolumeX, Heart, Loader2 } from "lucide-react";
import { useRadioFavoritesContext } from "@/application/radio/RadioFavoritesProvider";
import { useRadioTracker } from "@/hooks/useRadioTracker";
import { cn } from "@/lib/utils"; // Assuming utils exists, if not use standard className

interface RadioPlayerProps {
  station: RadioStation | null;
  autoPlay?: boolean;
}

export default function RadioPlayer({ station, autoPlay = true }: RadioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const { isFavorite, toggleFavorite } = useRadioFavoritesContext();
  
  // Track listening time
  useRadioTracker(
    isPlaying, 
    station?.language?.[0], 
    60 
  );

  useEffect(() => {
    // Cleanup previous HLS if any
    const hls = (window as any).__hls_instance;
    if (hls) {
      hls.destroy();
      (window as any).__hls_instance = null;
    }

    if (station && audioRef.current) {
      setError(false);
      setLoading(true);
      
      const streamUrl = station.urlResolved || station.url;
      const isHls = streamUrl.includes('.m3u8') || station.codec === 'HLS';

      // Dynamic import Hls.js to avoid SSR issues if package not strictly client-side friendly or just to be safe
      const loadStream = async () => {
        if (isHls) {
           const Hls = (await import('hls.js')).default;
           if (Hls.isSupported()) {
             const hls = new Hls();
             (window as any).__hls_instance = hls;
             hls.loadSource(streamUrl);
             hls.attachMedia(audioRef.current!);
             hls.on(Hls.Events.MANIFEST_PARSED, () => {
                if (autoPlay) {
                  audioRef.current?.play()
                    .then(() => setIsPlaying(true))
                    .catch(e => {
                      console.error("HLS Playback failed", e);
                      setIsPlaying(false);
                    });
                }
             });
             hls.on(Hls.Events.ERROR, (event, data) => {
                if (data.fatal) {
                   console.error("HLS Fatal Error", data);
                   setLoading(false);
                   setError(true);
                   setIsPlaying(false);
                   hls.destroy();
                }
             });
             return;
           }
        }
        
        // Fallback or Standard Audio
        audioRef.current!.src = streamUrl;
        audioRef.current!.load();
        
        if (autoPlay) {
          audioRef.current!.play()
            .then(() => setIsPlaying(true))
            .catch(e => {
              // NotSupportedError often happens here if format is native HLS but browser doesn't support, 
              // or if it's really unsupported.
              console.error("Playback failed (Standard)", e);
              setIsPlaying(false);
              // Check if it's a NotSupportedError and we haven't tried HLS yet?
              // The isHls check above should cover most.
            });
        }
      };

      loadStream();

    } else {
      setIsPlaying(false);
    }
    
    return () => {
      const hls = (window as any).__hls_instance;
      if (hls) {
        hls.destroy();
        (window as any).__hls_instance = null;
      }
    }
  }, [station, autoPlay]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const togglePlay = () => {
    if (!audioRef.current || !station) return;
    
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().catch(() => setError(true));
      setIsPlaying(true);
    }
  };

  if (!station) return null;

  return (
    <div className="fixed bottom-20 sm:bottom-16 md:bottom-12 left-2 z-[9999] w-[calc(100%-1rem)] md:w-[480px] bg-black/80 backdrop-blur-xl border border-white/10 rounded-2xl p-3 sm:p-4 shadow-2xl flex items-center gap-2 sm:gap-4 transition-all">
      <audio
        ref={audioRef}
        onWaiting={() => setLoading(true)}
        onPlaying={() => {
          setLoading(false);
          setIsPlaying(true);
          setError(false);
        }}
        onError={() => {
          setLoading(false);
          setError(true);
          setIsPlaying(false);
        }}
      />

      {/* Station Info */}
      <div className="flex-1 min-w-0">
        <h3 className="text-white font-medium truncat text-shadow-sm flex items-center gap-2">
           {station.name}
           {station.countryCode && <span className="text-xs px-1.5 py-0.5 bg-white/10 rounded text-gray-300">{station.countryCode}</span>}
        </h3>
        <p className="text-white/60 text-xs truncate">
           {loading ? 'Buffering...' : error ? 'Stream unavailable' : 'Live Radio'}
        </p>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-4">
        {/* Favorite Button */}
        <button 
           onClick={() => toggleFavorite(station)}
           className={cn("p-2 rounded-full transition hover:bg-white/10", isFavorite(station.id) ? "text-red-500" : "text-white/40")}
        >
          <Heart className={cn("w-4 h-4 sm:w-5 sm:h-5", isFavorite(station.id) && "fill-current")} />
        </button>

        {/* Play/Pause */}
        <button
          onClick={togglePlay}
          disabled={loading && !isPlaying} // allow pause while loading? usually ok.
          className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 transition active:scale-95 shadow-lg shadow-white/10"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
          ) : isPlaying ? (
            <Pause className="w-4 h-4 sm:w-5 sm:h-5 fill-current" />
          ) : (
             <Play className="w-4 h-4 sm:w-5 sm:h-5 fill-current ml-0.5" />
          )}
        </button>

        {/* Volume - Desktop only mostly */}
        <div className="hidden md:flex items-center gap-2 group">
           <button onClick={() => setIsMuted(!isMuted)} className="text-white/60 hover:text-white">
             {isMuted || volume === 0 ? <VolumeX className="w-4 h-4 sm:w-5 sm:h-5"/> : <Volume2 className="w-4 h-4 sm:w-5 sm:h-5"/>}
           </button>
           <input
             type="range"
             min="0"
             max="1"
             step="0.05"
             value={isMuted ? 0 : volume}
             onChange={(e) => {
               setVolume(parseFloat(e.target.value));
               setIsMuted(false);
             }}
             className="w-20 h-1 bg-white/20 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
           />
        </div>
      </div>
    </div>
  );
}
