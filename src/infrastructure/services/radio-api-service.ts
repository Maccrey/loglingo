import { RadioBrowserApi, StationSearchType } from 'radio-browser-api';
import { RadioStation } from '@/domain/radio';
import { bridgeRadioStations } from './radio-channel-bridge';

// Initialize API
const api = new RadioBrowserApi('Loglingo-App');

// Country centroids (approx) for stations missing geo coords
const COUNTRY_CENTERS: Record<string, { lat: number; lng: number }> = {
  KR: { lat: 36.5, lng: 127.9 },
  JP: { lat: 36.2, lng: 138.2 },
  CN: { lat: 35.8, lng: 104.2 },
  US: { lat: 39.8, lng: -98.6 },
  GB: { lat: 54.5, lng: -3.4 },
  FR: { lat: 46.2, lng: 2.2 },
  DE: { lat: 51.1, lng: 10.4 },
  ES: { lat: 40.4, lng: -3.7 },
  AU: { lat: -25.3, lng: 133.8 },
  RU: { lat: 61.5, lng: 105.3 },
  CA: { lat: 56.1, lng: -106.3 },
  BR: { lat: -14.2, lng: -51.9 },
  AR: { lat: -38.4, lng: -63.6 },
  MX: { lat: 23.6, lng: -102.5 },
  IN: { lat: 20.6, lng: 78.9 },
  ID: { lat: -0.8, lng: 113.9 },
  TH: { lat: 15.9, lng: 101.0 },
  VN: { lat: 14.1, lng: 108.3 },
  PH: { lat: 12.9, lng: 121.8 },
  ZA: { lat: -30.6, lng: 22.9 },
  EG: { lat: 26.8, lng: 30.8 },
  MA: { lat: 31.8, lng: -7.1 },
  NG: { lat: 9.1, lng: 8.7 },
  TR: { lat: 38.9, lng: 35.2 },
  NZ: { lat: -40.9, lng: 174.9 },
};

// Known broken/geo-restricted stations to exclude from list
const BLOCKED_STATION_NAMES = new Set([
  '500 çin altın şarkısı',
]);

export class RadioApiService {
  private async safeSearchStations(params: any): Promise<any[]> {
    try {
      return await api.searchStations(params);
    } catch (error) {
      console.warn('🔁 Falling back (searchStations failed)', error);
      return [];
    }
  }
  
  async searchStationsByLocation(lat: number, long: number, radiusKm: number = 100): Promise<RadioStation[]> {
    // Note: radio-browser-api library might not expose 'byLocation' directly if it's older version,
    // but looking at docs/types usually it supports geo search via searchStations({ lat, long, offset, limit })
    // If exact method is missing, we use searchStations with geo parameters.
    
    // In many implementations, searchStations takes a filter object.
    // Let's assume standard usage.
    
    try {
        const stations = await api.searchStations({
            limit: 50,
            offset: 0,
            hasGeoInfo: true,
            // @ts-ignore - The library types might be slightly different depending on version, generic permissive search
            lat: lat,
            long: long,
            hideBroken: true,
            order: 'votes', // or 'clickcount'
            reverse: true
        });

        return stations.map(this.mapToDomain);
    } catch (error) {
        console.error("Failed to fetch radio stations by location:", error);
        return [];
    }
  }

  async searchStationsByCountry(countryCode: string): Promise<RadioStation[]> {
      try {
          const stations = await api.searchStations({
              countryCode: countryCode,
              limit: 50,
              hideBroken: true,
              order: 'votes',
              reverse: true,
              hasGeoInfo: true
          });
          return stations.map(this.mapToDomain);
      } catch (error) {
          console.error("Failed to fetch radio stations by country:", error);
          return [];
      }
  }
  
  async getTopStations(): Promise<RadioStation[]> {
      try {
           // Parallel fetch for better performance
           const results = await Promise.all([
             // 1. Global Top
             this.safeSearchStations({
               limit: 100,
               hideBroken: true,
               order: 'votes',
               reverse: true,
               // hasGeoInfo: true // Allow non-geo stations (use fallback)
             }),
             // 2. East Asia (High Priority)
             this.safeSearchStations({ countryCode: 'KR', limit: 200, hideBroken: true }),
             this.safeSearchStations({ countryCode: 'JP', limit: 500, hideBroken: true }), // Increased signifanctly
             this.safeSearchStations({ countryCode: 'CN', limit: 500, hideBroken: true }), // Increased signifanctly

             // 3. Major Western Countries
             this.safeSearchStations({ countryCode: 'US', limit: 150, hideBroken: true, order: 'votes', reverse: true }),
             this.safeSearchStations({ countryCode: 'GB', limit: 100, hideBroken: true }),
             this.safeSearchStations({ countryCode: 'FR', limit: 100, hideBroken: true }),
             this.safeSearchStations({ countryCode: 'DE', limit: 100, hideBroken: true }),
             this.safeSearchStations({ countryCode: 'ES', limit: 100, hideBroken: true }),
             this.safeSearchStations({ countryCode: 'IT', limit: 100, hideBroken: true }), 

             // 4. Underrepresented Regions (South America, Africa, SE Asia, Oceania) - targeting ~30 top stations each
             this.safeSearchStations({ countryCode: 'BR', limit: 40, hideBroken: true, order: 'votes', reverse: true }), 
             this.safeSearchStations({ countryCode: 'AR', limit: 30, hideBroken: true, order: 'votes', reverse: true }), 
             this.safeSearchStations({ countryCode: 'MX', limit: 30, hideBroken: true, order: 'votes', reverse: true }), 
             this.safeSearchStations({ countryCode: 'CL', limit: 20, hideBroken: true, order: 'votes', reverse: true }), 
             this.safeSearchStations({ countryCode: 'CO', limit: 20, hideBroken: true, order: 'votes', reverse: true }), 
             
             this.safeSearchStations({ countryCode: 'IN', limit: 40, hideBroken: true, order: 'votes', reverse: true }), 
             this.safeSearchStations({ countryCode: 'ID', limit: 30, hideBroken: true, order: 'votes', reverse: true }), 
             this.safeSearchStations({ countryCode: 'TH', limit: 30, hideBroken: true, order: 'votes', reverse: true }), 
             this.safeSearchStations({ countryCode: 'VN', limit: 30, hideBroken: true, order: 'votes', reverse: true }), 
             this.safeSearchStations({ countryCode: 'PH', limit: 30, hideBroken: true, order: 'votes', reverse: true }), 
             this.safeSearchStations({ countryCode: 'TR', limit: 40, hideBroken: true, order: 'votes', reverse: true }), 

             this.safeSearchStations({ countryCode: 'ZA', limit: 30, hideBroken: true, order: 'votes', reverse: true }), 
             this.safeSearchStations({ countryCode: 'EG', limit: 20, hideBroken: true, order: 'votes', reverse: true }), 
             this.safeSearchStations({ countryCode: 'MA', limit: 20, hideBroken: true, order: 'votes', reverse: true }), 
             this.safeSearchStations({ countryCode: 'NG', limit: 20, hideBroken: true, order: 'votes', reverse: true }), 
             
             this.safeSearchStations({ countryCode: 'AU', limit: 40, hideBroken: true, order: 'votes', reverse: true }), 
             this.safeSearchStations({ countryCode: 'NZ', limit: 30, hideBroken: true, order: 'votes', reverse: true }), 
           ]);

          // Flatten and merge
          const allStations = results.flat();
          
          // Remove duplicates using changeId
          const uniqueStations = Array.from(new Map(allStations.map((s: any) => [s.changeId || s.stationuuid || s.id, s])).values());
          
          // Only include stations with valid stream URLs
          const workingStations = uniqueStations.filter(s => 
            s.urlResolved && s.urlResolved.trim() !== '' && 
            (s.urlResolved.startsWith('http://') || s.urlResolved.startsWith('https://'))
          );
          
          const domainStations = workingStations.map(this.mapToDomain);
          const filteredStations = domainStations.filter((s) => {
            const name = (s.name || '').toLowerCase();
            return !BLOCKED_STATION_NAMES.has(name);
          });
          const bridgedStations = bridgeRadioStations(filteredStations);

          // Only plot stations with valid coordinates
          const withCoordinates = bridgedStations.filter((s) => 
            typeof s.geoLat === 'number' && typeof s.geoLong === 'number'
          );

          const missingCoordinates = bridgedStations.length - withCoordinates.length;
          if (missingCoordinates > 0) {
            console.warn(`📻 Skipped ${missingCoordinates} stations without coordinates`);
          }

          console.log(`📻 Loaded ${withCoordinates.length} stations after bridge (from ${domainStations.length} working / ${uniqueStations.length} total)`);
          
          // Fallback: if nothing usable, return curated bridge stations so UI still works
          if (withCoordinates.length === 0) {
            const curatedOnly = bridgeRadioStations([]).filter((s) => s.geoLat !== null && s.geoLong !== null);
            console.warn('📻 Using curated fallback (no stations from API)');
            return curatedOnly;
          }

          return withCoordinates;
      } catch (error) {
          console.error("Failed to fetch top stations:", error);
          // Final fallback: curated bridge stations only
          const curatedOnly = bridgeRadioStations([]).filter((s) => s.geoLat !== null && s.geoLong !== null);
          return curatedOnly;
      }
  }

  private mapToDomain(station: any): RadioStation {
    const countryCode = (station.countryCode || station.country || '').toUpperCase();
    const fallbackGeo = countryCode && COUNTRY_CENTERS[countryCode];

    // Use hash of ID to make jitter deterministic for same station
    let lat = station.geoLat;
    let long = station.geoLong;

    // Simple deterministic hash
    let hash = 0;
    const str = station.id || station.name;
    for (let i = 0; i < str.length; i++) {
        hash = ((hash << 5) - hash) + str.charCodeAt(i);
        hash |= 0;
    }
    const pseudoRandom1 = (Math.abs(hash) % 1000) / 1000; // 0..1
    const pseudoRandom2 = (Math.abs(hash >> 10) % 1000) / 1000; // 0..1

    if ((lat === null || lat === undefined) && fallbackGeo) {
       // Moderate jitter for fallback: spread across "region" (±5.0 degrees)
       lat = fallbackGeo.lat + (pseudoRandom1 * 10 - 5);
       long = fallbackGeo.lng + (pseudoRandom2 * 10 - 5);
    } else if (lat !== null && long !== null) {
       // Micro jitter for existing coords: prevent exact stacking in same city (±0.05 degrees)
       lat = lat + (pseudoRandom1 * 0.1 - 0.05);
       long = long + (pseudoRandom2 * 0.1 - 0.05);
    }

    return {
      // Prefer stable UUID fields; fall back to changeId when needed
      id: station.id || station.stationuuid || station.changeId,
      name: station.name,
      url: station.url,
      urlResolved: station.urlResolved,
      homepage: station.homepage,
      favicon: station.favicon,
      tags: station.tags,
      country: station.country,
      countryCode: station.countryCode,
      language: station.language,
      votes: station.votes,
      geoLat: lat ?? null,
      geoLong: long ?? null,
      codec: station.codec,
    };
  }
}

export const radioApiService = new RadioApiService();
