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
}

export default function RadioGlobe({ onStationClick, currentStationId, onLoadComplete }: RadioGlobeProps) {
  const globeEl = useRef<GlobeMethods | undefined>(undefined);
  const { theme } = useTheme();
  const [stations, setStations] = useState<RadioStation[]>([]);
  const [isRotating, setIsRotating] = useState(true); // Auto-rotate by default
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && globeEl.current) {
        globeEl.current.controls().autoRotate = isRotating;
        globeEl.current.controls().autoRotateSpeed = 0.3;
        globeEl.current.pointOfView({ lat: 20, lng: 100, altitude: 1.8 }); 
    }
  }, [isRotating, mounted]);

  const loadedRef = useRef(false);

  useEffect(() => {
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
    loadStations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array - only run once

  const toggleRotation = () => {
    setIsRotating(prev => !prev);
    if (globeEl.current) {
      globeEl.current.controls().autoRotate = !isRotating;
    }
  };

  if (!mounted) return null;

  return (
    <div className="relative w-full h-full group">
      <div className="absolute inset-0 cursor-move z-0">
        <Globe
          ref={globeEl}
          rendererConfig={{ alpha: true, antialias: true }}
          globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
          backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
          pointsData={stations} 
          pointLat="geoLat"
          pointLng="geoLong"
          pointColor={(point: any) => point.id === currentStationId ? "#f97316" : "#ffcc00"}
          pointAltitude={(point: any) => point.id === currentStationId ? 0.3 : 0.1} 
          pointRadius={(point: any) => point.id === currentStationId ? 1.0 : 0.5}
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
      <div className="absolute top-20 right-4 z-50">
         <button 
           onClick={toggleRotation}
           className="bg-black/60 backdrop-blur text-white/80 p-2 rounded-lg border border-white/10 hover:bg-white/10 text-xs font-medium transition"
         >
           {isRotating ? '⏸ Pause Rotation' : '▶ Auto-Rotate'}
         </button>
      </div>
    </div>
  );
}
