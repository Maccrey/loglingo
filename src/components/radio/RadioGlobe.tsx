"use client";

import { useEffect, useRef, useState } from "react";
import Globe, { GlobeMethods } from "react-globe.gl";
import { useTheme } from "next-themes";
import { radioApiService } from "@/infrastructure/services/radio-api-service";
import { RadioStation } from "@/domain/radio";

interface RadioGlobeProps {
  onStationClick?: (station: RadioStation) => void;
}

export default function RadioGlobe({ onStationClick }: RadioGlobeProps) {
  const globeEl = useRef<GlobeMethods | undefined>(undefined);
  const { theme } = useTheme();
  const [stations, setStations] = useState<RadioStation[]>([]);

  useEffect(() => {
    // Initial camera position
    if (globeEl.current) {
        globeEl.current.controls().autoRotate = true;
        globeEl.current.controls().autoRotateSpeed = 0.5;
        // set initial POV
        globeEl.current.pointOfView({ lat: 20, lng: 0, altitude: 2.5 });
    }

    // Fetch initial stations (e.g., top stations globally)
    const loadStations = async () => {
      const topStations = await radioApiService.getTopStations();
      setStations(topStations);
    };
    loadStations();

  }, []);

  return (
    <Globe
      ref={globeEl}
      globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
      backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
      pointsData={stations}
      pointLat="geoLat"
      pointLng="geoLong"
      pointColor={() => "#ffcc00"}
      pointAltitude={0.1}
      pointRadius={0.5}
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
  );
}
