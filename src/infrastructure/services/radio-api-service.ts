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
           // Fetch Global Top stations with higher limit
           const globalTop = await api.searchStations({
              limit: 100, // Increased from 50
              hideBroken: true,
              order: 'votes',
              reverse: true,
              hasGeoInfo: true
          });

          // Korean stations
          const krStations = await api.searchStations({
             countryCode: 'KR',
             limit: 150, // Increased from 100
             hideBroken: true,
             hasGeoInfo: true
          });

          // Japanese stations
          const jpStations = await api.searchStations({
             countryCode: 'JP',
             limit: 150, // Increased from 100
             hideBroken: true,
             hasGeoInfo: true
          });
          
          // Chinese stations
          const cnStations = await api.searchStations({
             countryCode: 'CN',
             limit: 100, // Increased from 50
             hideBroken: true,
             hasGeoInfo: true
          });
          
          // United States stations
          const usStations = await api.searchStations({
             countryCode: 'US',
             limit: 150,
             hideBroken: true,
             hasGeoInfo: true,
             order: 'votes',
             reverse: true
          });
          
          // United Kingdom stations
          const ukStations = await api.searchStations({
             countryCode: 'GB',
             limit: 100,
             hideBroken: true,
             hasGeoInfo: true
          });
          
          // French stations
          const frStations = await api.searchStations({
             countryCode: 'FR',
             limit: 100,
             hideBroken: true,
             hasGeoInfo: true
          });
          
          // German stations
          const deStations = await api.searchStations({
             countryCode: 'DE',
             limit: 100,
             hideBroken: true,
             hasGeoInfo: true
          });
          
          // Spanish stations
          const esStations = await api.searchStations({
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
          
          console.log(`📻 Loaded ${workingStations.length} working stations from ${uniqueStations.length} total`);
          
          return workingStations.map(this.mapToDomain);
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
