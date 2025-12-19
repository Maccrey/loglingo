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
           // Fetch Global Top stations with higher limit
          const globalTop = await this.safeSearchStations({
             limit: 100, // Increased from 50
             hideBroken: true,
             order: 'votes',
             reverse: true,
             hasGeoInfo: true
         });

         // Korean stations
         const krStations = await this.safeSearchStations({
            countryCode: 'KR',
            limit: 150, // Increased from 100
            hideBroken: true,
            hasGeoInfo: true
         });

         // Japanese stations
         const jpStations = await this.safeSearchStations({
            countryCode: 'JP',
            limit: 150, // Increased from 100
            hideBroken: true,
            hasGeoInfo: true
         });
         
         // Chinese stations
         const cnStations = await this.safeSearchStations({
            countryCode: 'CN',
            limit: 100, // Increased from 50
            hideBroken: true,
            hasGeoInfo: true
         });
         
         // United States stations
         const usStations = await this.safeSearchStations({
            countryCode: 'US',
            limit: 150,
            hideBroken: true,
            hasGeoInfo: true,
            order: 'votes',
            reverse: true
         });
         
         // United Kingdom stations
         const ukStations = await this.safeSearchStations({
            countryCode: 'GB',
            limit: 100,
            hideBroken: true,
            hasGeoInfo: true
         });
         
         // French stations
         const frStations = await this.safeSearchStations({
            countryCode: 'FR',
            limit: 100,
            hideBroken: true,
            hasGeoInfo: true
         });
         
         // German stations
         const deStations = await this.safeSearchStations({
            countryCode: 'DE',
            limit: 100,
            hideBroken: true,
            hasGeoInfo: true
         });
         
         // Spanish stations
         const esStations = await this.safeSearchStations({
            countryCode: 'ES',
            limit: 100,
            hideBroken: true,
            hasGeoInfo: true
         });

          // Merge all stations
          const allStations = [
            ...globalTop, 
            ...krStations, 
            ...jpStations, 
            ...cnStations,
            ...usStations,
            ...ukStations,
            ...frStations,
            ...deStations,
            ...esStations
          ];
          
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
      geoLat: station.geoLat ?? fallbackGeo?.lat ?? null,
      geoLong: station.geoLong ?? fallbackGeo?.lng ?? null,
      codec: station.codec,
    };
  }
}

export const radioApiService = new RadioApiService();
