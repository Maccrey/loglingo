import { RadioStation } from '@/domain/radio';

// Curated, reliable stations to backfill countries that return too few results
const CURATED_STATIONS: Record<string, RadioStation[]> = {
  AU: [
    {
      id: 'bridge-au-abc-rn',
      name: 'ABC Radio National',
      url: 'https://live-radio01.mediahubaustralia.com/2RNW/mp3/',
      urlResolved: 'https://live-radio01.mediahubaustralia.com/2RNW/mp3/',
      homepage: 'https://www.abc.net.au/listen/live/abcrn',
      favicon: 'https://www.abc.net.au/cm/rimage/10041560-3x2-xlarge.png',
      tags: ['news', 'talk', 'culture'],
      country: 'Australia',
      countryCode: 'AU',
      language: ['en'],
      votes: 1200,
      geoLat: -33.8688,
      geoLong: 151.2093,
      codec: 'MP3',
    },
    {
      id: 'bridge-au-triplej',
      name: 'triple j',
      url: 'https://live-radio01.mediahubaustralia.com/2TJW/mp3/',
      urlResolved: 'https://live-radio01.mediahubaustralia.com/2TJW/mp3/',
      homepage: 'https://www.abc.net.au/triplej',
      favicon: 'https://www.abc.net.au/cm/rimage/13133596-3x2-xlarge.png',
      tags: ['alternative', 'indie', 'hits'],
      country: 'Australia',
      countryCode: 'AU',
      language: ['en'],
      votes: 1500,
      geoLat: -33.8688,
      geoLong: 151.2093,
      codec: 'MP3',
    },
    {
      id: 'bridge-au-doublej',
      name: 'Double J',
      url: 'https://live-radio01.mediahubaustralia.com/DJDW/mp3/',
      urlResolved: 'https://live-radio01.mediahubaustralia.com/DJDW/mp3/',
      homepage: 'https://www.abc.net.au/doublej',
      favicon: 'https://www.abc.net.au/cm/rimage/8717640-3x2-xlarge.png',
      tags: ['classic', 'alternative'],
      country: 'Australia',
      countryCode: 'AU',
      language: ['en'],
      votes: 900,
      geoLat: -33.8688,
      geoLong: 151.2093,
      codec: 'MP3',
    },
  ],
  RU: [
    {
      id: 'bridge-ru-radiorecord',
      name: 'Radio Record',
      url: 'https://radiorecord.hostingradio.ru/rr_main128.mp3',
      urlResolved: 'https://radiorecord.hostingradio.ru/rr_main128.mp3',
      homepage: 'https://www.radiorecord.ru/',
      favicon: 'https://www.radiorecord.ru/favicon-32x32.png',
      tags: ['dance', 'electronic'],
      country: 'Russia',
      countryCode: 'RU',
      language: ['ru'],
      votes: 1800,
      geoLat: 59.9311,
      geoLong: 30.3609,
      codec: 'MP3',
    },
    {
      id: 'bridge-ru-europaplus',
      name: 'Europa Plus Moscow',
      url: 'https://emgregion.hostingradio.ru:8064/moscow.europaplus.mp3',
      urlResolved: 'https://emgregion.hostingradio.ru:8064/moscow.europaplus.mp3',
      homepage: 'https://www.europaplus.ru/',
      favicon: 'https://www.europaplus.ru/favicon-32x32.png',
      tags: ['pop', 'top40'],
      country: 'Russia',
      countryCode: 'RU',
      language: ['ru'],
      votes: 1700,
      geoLat: 55.7558,
      geoLong: 37.6176,
      codec: 'MP3',
    },
    {
      id: 'bridge-ru-retrofm',
      name: 'Retro FM',
      url: 'https://retro.hostingradio.ru/retro256.mp3',
      urlResolved: 'https://retro.hostingradio.ru/retro256.mp3',
      homepage: 'https://retrofm.ru/',
      favicon: 'https://retrofm.ru/favicon-32x32.png',
      tags: ['oldies', 'hits'],
      country: 'Russia',
      countryCode: 'RU',
      language: ['ru'],
      votes: 1300,
      geoLat: 55.7558,
      geoLong: 37.6176,
      codec: 'MP3',
    },
    {
      id: 'bridge-ru-nashe',
      name: 'Nashe Radio',
      url: 'https://nashe1.hostingradio.ru/nashe-256',
      urlResolved: 'https://nashe1.hostingradio.ru/nashe-256',
      homepage: 'https://www.nashe.ru/',
      favicon: 'https://www.nashe.ru/assets/icons/favicon-32x32.png',
      tags: ['rock', 'alternative'],
      country: 'Russia',
      countryCode: 'RU',
      language: ['ru'],
      votes: 1250,
      geoLat: 55.7558,
      geoLong: 37.6176,
      codec: 'MP3',
    },
    {
      id: 'bridge-ru-dfm',
      name: 'DFM Moscow',
      url: 'https://dfm.hostingradio.ru/dfm256.mp3',
      urlResolved: 'https://dfm.hostingradio.ru/dfm256.mp3',
      homepage: 'https://dfm.ru/',
      favicon: 'https://dfm.ru/favicon-32x32.png',
      tags: ['dance', 'top40'],
      country: 'Russia',
      countryCode: 'RU',
      language: ['ru'],
      votes: 1200,
      geoLat: 55.7558,
      geoLong: 37.6176,
      codec: 'MP3',
    },
    {
      id: 'bridge-ru-maximum',
      name: 'Radio Maximum',
      url: 'https://maximum.hostingradio.ru/maximum128.mp3',
      urlResolved: 'https://maximum.hostingradio.ru/maximum128.mp3',
      homepage: 'https://www.maximum.ru/',
      favicon: 'https://www.maximum.ru/favicon-32x32.png',
      tags: ['rock', 'hits'],
      country: 'Russia',
      countryCode: 'RU',
      language: ['ru'],
      votes: 1100,
      geoLat: 55.7558,
      geoLong: 37.6176,
      codec: 'MP3',
    },
    {
      id: 'bridge-ru-dorognoe',
      name: 'Dorozhnoe Radio',
      url: 'https://dorognoe.hostingradio.ru/dorognoe256.mp3',
      urlResolved: 'https://dorognoe.hostingradio.ru/dorognoe256.mp3',
      homepage: 'https://dorognoe.ru/',
      favicon: 'https://dorognoe.ru/local/templates/main/img/favicon/favicon-32x32.png',
      tags: ['pop', 'soft'],
      country: 'Russia',
      countryCode: 'RU',
      language: ['ru'],
      votes: 1150,
      geoLat: 59.9311,
      geoLong: 30.3609,
      codec: 'MP3',
    },
  ],
};

const normalizeCountryKey = (station: RadioStation) =>
  (station.countryCode || station.country || '').toUpperCase();

/**
 * Ensures countries with curated coverage have at least `minStationsPerCountry` stations
 * by merging in trusted fallbacks when the API returns too few.
 */
export const bridgeRadioStations = (
  stations: RadioStation[],
  minStationsPerCountry = 5
): RadioStation[] => {
  const existingByCountry = stations.reduce((map, station) => {
    const key = normalizeCountryKey(station);
    if (!key) return map;
    const list = map.get(key) ?? [];
    list.push(station);
    map.set(key, list);
    return map;
  }, new Map<string, RadioStation[]>());

  const merged = [...stations];

  Object.entries(CURATED_STATIONS).forEach(([countryCode, curated]) => {
    const key = countryCode.toUpperCase();
    const existing = existingByCountry.get(key) ?? [];

    // Always include curated stations (deduped), but ensure at least `min` overall
    const dedupedCurated = curated.filter((candidate) =>
      !merged.some((station) => station.id === candidate.id)
    );

    const targetCount = Math.max(minStationsPerCountry, existing.length + dedupedCurated.length);
    const missingCount = targetCount - existing.length;

    // Add curated stations first
    merged.push(...dedupedCurated);

    // If still below minimum, duplicate-safe fill (in case dedupedCurated was empty)
    if (missingCount > dedupedCurated.length) {
      const stillMissing = missingCount - dedupedCurated.length;
      merged.push(...curated.slice(0, stillMissing));
    }
  });

  // Final de-duplication just in case
  return Array.from(new Map(merged.map((s) => [s.id, s])).values());
};
