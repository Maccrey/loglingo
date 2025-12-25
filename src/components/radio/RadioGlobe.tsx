"use client";

import { useEffect, useRef, useState } from "react";
import Globe, { GlobeMethods } from "react-globe.gl";
import { useTheme } from "next-themes";
import { radioApiService } from "@/infrastructure/services/radio-api-service";
import { RadioStation } from "@/domain/radio";

interface RadioGlobeProps {
  onStationClick?: (station: RadioStation) => void;
  currentStationId?: string | null;
  onLoadComplete?: () => void;
  stations?: RadioStation[];
}

export default function RadioGlobe({ onStationClick, currentStationId, onLoadComplete, stations: externalStations }: RadioGlobeProps) {
  const globeEl = useRef<GlobeMethods | undefined>(undefined);
  const { theme } = useTheme();
  const [stations, setStations] = useState<RadioStation[]>(externalStations ?? []);
  const [isRotating, setIsRotating] = useState(true); // Auto-rotate by default
  const [mounted, setMounted] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    setMounted(true);
    
    const updateDimensions = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };
    
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  useEffect(() => {
    if (mounted && globeEl.current && dimensions.width > 0) {
        const isMobile = dimensions.width < 640;
        globeEl.current.controls().autoRotate = isRotating;
        globeEl.current.controls().autoRotateSpeed = 0.3;
        globeEl.current.pointOfView({ 
          lat: 20, 
          lng: 100, 
          altitude: isMobile ? 2.8 : 1.8 
        }); 
    }
  }, [isRotating, mounted, dimensions.width]);

  const loadedRef = useRef(false);

  useEffect(() => {
    // If the parent hands us stations, use them instead of self-fetching
    if (externalStations && externalStations.length > 0) {
      setStations(externalStations);
      if (!loadedRef.current) {
        loadedRef.current = true;
        onLoadComplete?.();
      }
      return;
    }

    const loadStations = async () => {
      // Only load if not already loaded
      if (loadedRef.current) return;
      
      const topStations = await radioApiService.getTopStations();
      setStations(topStations);
      
      // Mark as loaded and notify parent
      if (topStations.length > 0) {
        loadedRef.current = true;
        if (onLoadComplete) {
          onLoadComplete();
        }
      }
    };
    // Only self-fetch when no external stations were provided
    if (!externalStations) {
      loadStations();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [externalStations, onLoadComplete]);

  const toggleRotation = () => {
    setIsRotating(prev => !prev);
    if (globeEl.current) {
      globeEl.current.controls().autoRotate = !isRotating;
    }
  };

  const handlePointHover = (point: any) => {
    if (!globeEl.current) return;
    const shouldPause = Boolean(point);
    globeEl.current.controls().autoRotate = shouldPause ? false : isRotating;
  };

  if (!mounted || dimensions.width === 0) return null;

  const isMobile = dimensions.width < 640; // sm breakpoint

  return (
    <div className="relative w-full h-full group">
      <div className="absolute inset-0 cursor-move z-0">
        <Globe
          ref={globeEl}
          width={dimensions.width}
          height={dimensions.height}
          rendererConfig={{ alpha: true, antialias: true }}
          globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
          backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
          pointsData={stations} 
          pointLat="geoLat"
          pointLng="geoLong"
          pointColor={(point: any) => point.id === currentStationId ? "#f97316" : "#ffcc00"}
          pointAltitude={(point: any) => point.id === currentStationId ? 0.3 : 0.03} 
          pointRadius={(point: any) => {
            const baseRadius = isMobile ? 0.08 : 0.06;
            const activeRadius = isMobile ? 0.75 : 0.5;
            return point.id === currentStationId ? activeRadius : baseRadius;
          }}
          onPointClick={(point) => {
            console.log('🎯 Station clicked:', point);
            const station = point as unknown as RadioStation;
            console.log('🎯 Station data:', {
              name: station.name,
              url: station.url,
              urlResolved: station.urlResolved,
              hasAllData: !!(station.name && (station.url || station.urlResolved))
            });
            if (onStationClick) {
              onStationClick(station);
            }
          }}
          onPointHover={(point) => handlePointHover(point)}
          atmosphereColor="#3a228a"
          atmosphereAltitude={0.2}
          pointLabel={(point: any) => `
            <div style="background: rgba(0,0,0,0.8); color: white; padding: 4px 8px; border-radius: 4px; font-size: 12px;">
              <b>${point.name}</b><br/>
              ${point.country}
            </div>
          `}
        />
      </div>
    
      {/* Rotation Control Button */}
      <div className="absolute top-[4.5rem] sm:top-20 right-2 sm:right-4 z-50">
         <button 
           onClick={toggleRotation}
           className="bg-black/60 backdrop-blur text-white/80 px-2 py-1 sm:p-2 rounded-lg border border-white/10 hover:bg-white/10 text-[10px] sm:text-xs font-medium transition"
         >
           {isRotating ? '⏸ Pause Rotation' : '▶ Auto-Rotate'}
         </button>
      </div>
    </div>
  );
}
