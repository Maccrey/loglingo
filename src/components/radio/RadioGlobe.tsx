"use client";

import { useEffect, useRef, useState } from "react";
import Globe, { GlobeMethods } from "react-globe.gl";
import { useTheme } from "next-themes";
import { radioApiService } from "@/infrastructure/services/radio-api-service";
import { RadioStation } from "@/domain/radio";

interface RadioGlobeProps {
  onStationClick?: (station: RadioStation) => void;
  currentStationId?: string | null;
}

export default function RadioGlobe({ onStationClick, currentStationId }: RadioGlobeProps) {
  const globeEl = useRef<GlobeMethods | undefined>(undefined);
  const { theme } = useTheme();
  const [stations, setStations] = useState<RadioStation[]>([]);
  const [isRotating, setIsRotating] = useState(false); // Default to FALSE as requested by user ("too hard to select")

  useEffect(() => {
    // Initial controls setup
    if (globeEl.current) {
        globeEl.current.controls().autoRotate = isRotating;
        globeEl.current.controls().autoRotateSpeed = 0.5;
        globeEl.current.pointOfView({ lat: 36, lng: 127, altitude: 2.0 }); 
    }
  }, [isRotating]);

  useEffect(() => {
    // Fetch initial stations
    const loadStations = async () => {
      const topStations = await radioApiService.getTopStations();
      setStations(topStations);
    };
    loadStations();
  }, []);

  const toggleRotation = () => {
    setIsRotating(prev => !prev);
    if (globeEl.current) {
      globeEl.current.controls().autoRotate = !isRotating;
    }
  };

  return (
    <div className="relative w-full h-full group">
      <div className="absolute inset-0 cursor-move z-0">
        <Globe
          ref={globeEl}
          globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
          backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
          pointsData={[...stations]} 
          pointLat="geoLat"
          pointLng="geoLong"
          pointColor={(point: any) => point.id === currentStationId ? "#f97316" : "#ffcc00"}
          pointAltitude={(point: any) => point.id === currentStationId ? 0.3 : 0.1} 
          pointRadius={(point: any) => point.id === currentStationId ? 1.0 : 0.5}
          onPointClick={(point) => onStationClick?.(point as unknown as RadioStation)}
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
