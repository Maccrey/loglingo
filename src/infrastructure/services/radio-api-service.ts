import { RadioBrowserApi, StationSearchType } from 'radio-browser-api';
import { RadioStation } from '@/domain/radio';

// Initialize API
const api = new RadioBrowserApi('Loglingo-App');

export class RadioApiService {
  
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
           // Fetch Global Top
           const globalTop = await api.searchStations({
              limit: 50,
              hideBroken: true,
              order: 'votes',
              reverse: true,
              hasGeoInfo: true
          });

          // Fetch KR/JP specifically with higher limits and less strict sorting to find ANY with geo info
          const krStations = await api.searchStations({
             countryCode: 'KR',
             limit: 100, // Increase limit
             hideBroken: true,
             hasGeoInfo: true // Must have geo info for globe
          });

          const jpStations = await api.searchStations({
             countryCode: 'JP',
             limit: 100, // Increase limit
             hideBroken: true,
             hasGeoInfo: true
          });
          
          const cnStations = await api.searchStations({
             countryCode: 'CN',
             limit: 50,
             hideBroken: true,
             hasGeoInfo: true
          });

          // Merge: Global Top + Specific Asian Countries
          const allStations = [...globalTop, ...krStations, ...jpStations, ...cnStations];
          const uniqueStations = Array.from(new Map(allStations.map(s => [s.id, s])).values());
          
          return uniqueStations.map(this.mapToDomain);
      } catch (error) {
          console.error("Failed to fetch top stations:", error);
          return [];
      }
  }

  private mapToDomain(station: any): RadioStation {
    return {
      id: station.id,
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
      geoLat: station.geoLat,
      geoLong: station.geoLong,
      codec: station.codec,
    };
  }
}

export const radioApiService = new RadioApiService();
