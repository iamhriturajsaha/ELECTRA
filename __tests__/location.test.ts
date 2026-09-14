import { describe, it, expect } from 'vitest';

// ---------------------------------------------------------------
// Tests for LocationFinder filtering and station data integrity
// Mirrors the logic in src/components/Tools/LocationFinder.tsx
// ---------------------------------------------------------------

interface Station {
  id: number;
  name: string;
  address: string;
  type: string;
  pin: string;
  city: string;
}

const STATIONS: Station[] = [
  { id: 1,  name: "District Election Office",    address: "12, Civic Center, New Delhi",  type: "Office",  pin: "110001", city: "Delhi" },
  { id: 2,  name: "Mumbai West Hub",              address: "Municipal Building, Andheri",  type: "Hub",     pin: "400053", city: "Mumbai" },
  { id: 3,  name: "Bangalore Central Station",    address: "City Library, MG Road",        type: "Station", pin: "560001", city: "Bangalore" },
  { id: 4,  name: "Lucknow Registration Hub",     address: "Gomti Nagar Civil Hall",       type: "Hub",     pin: "226010", city: "Lucknow" },
  { id: 5,  name: "Chennai South Office",         address: "Adyar Civic Center",           type: "Office",  pin: "600020", city: "Chennai" },
  { id: 6,  name: "Patna North Station",          address: "Railway Colony School",        type: "Station", pin: "800001", city: "Patna" },
  { id: 7,  name: "Jaipur Civic Hub",             address: "Man Singh Road Center",        type: "Hub",     pin: "302001", city: "Jaipur" },
  { id: 8,  name: "Amritsar Polling Station",     address: "Golden Plaza Hall",            type: "Station", pin: "143001", city: "Amritsar" },
  { id: 9,  name: "Hyderabad Tech Hub",           address: "Hitech City Civic Hall",      type: "Hub",     pin: "500081", city: "Hyderabad" },
  { id: 10, name: "Bhopal Central Office",        address: "Arera Hills Block B",          type: "Office",  pin: "462011", city: "Bhopal" },
  { id: 11, name: "Guwahati East Station",        address: "Dispur Civic Center",          type: "Station", pin: "781005", city: "Guwahati" },
  { id: 12, name: "Chandigarh Hub",               address: "Sector 17 Admin Block",        type: "Hub",     pin: "160017", city: "Chandigarh" },
];

function filterStations(query: string): Station[] {
  if (!query) return STATIONS.slice(0, 3);
  const lowQuery = query.toLowerCase();
  return STATIONS.filter(s =>
    s.pin.startsWith(query) ||
    s.city.toLowerCase().includes(lowQuery) ||
    s.name.toLowerCase().includes(lowQuery)
  );
}

function buildMapsUrl(station: Station): string {
  return `https://www.google.com/maps/search/${encodeURIComponent(station.name + " " + station.address)}`;
}

describe('LocationFinder — Default View', () => {
  it('returns first 3 stations when query is empty', () => {
    expect(filterStations("").length).toBe(3);
  });

  it('first default result is District Election Office', () => {
    expect(filterStations("")[0].name).toBe("District Election Office");
  });

  it('default results do not include station 4 or higher', () => {
    const ids = filterStations("").map(s => s.id);
    expect(ids).not.toContain(4);
  });
});

describe('LocationFinder — City Search', () => {
  it('finds Delhi by city name (case-insensitive)', () => {
    const results = filterStations("delhi");
    expect(results.some(s => s.city === "Delhi")).toBe(true);
  });

  it('finds Mumbai by city name', () => {
    const results = filterStations("mumbai");
    expect(results.some(s => s.city === "Mumbai")).toBe(true);
  });

  it('finds Bangalore by partial name', () => {
    const results = filterStations("banga");
    expect(results.length).toBeGreaterThan(0);
  });

  it('finds Chennai correctly', () => {
    const results = filterStations("Chennai");
    expect(results.some(s => s.city === "Chennai")).toBe(true);
  });

  it('returns empty for unknown city', () => {
    const results = filterStations("zzzunknowncity");
    expect(results.length).toBe(0);
  });

  it('uppercase query works the same as lowercase', () => {
    const lower = filterStations("delhi");
    const upper = filterStations("DELHI");
    expect(lower.length).toBe(upper.length);
  });
});

describe('LocationFinder — PIN Code Search', () => {
  it('finds station by exact PIN code', () => {
    const results = filterStations("110001");
    expect(results.some(s => s.pin === "110001")).toBe(true);
  });

  it('finds station by PIN prefix', () => {
    const results = filterStations("4000");
    expect(results.some(s => s.pin.startsWith("4000"))).toBe(true);
  });

  it('returns empty for non-existent PIN', () => {
    const results = filterStations("999999");
    expect(results.length).toBe(0);
  });
});

describe('LocationFinder — Station Data Integrity', () => {
  it('has exactly 12 stations', () => {
    expect(STATIONS.length).toBe(12);
  });

  it('all station IDs are unique', () => {
    const ids = STATIONS.map(s => s.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('all station PIN codes are 6 digits', () => {
    STATIONS.forEach(s => {
      expect(s.pin).toMatch(/^\d{6}$/);
    });
  });

  it('all stations have a non-empty city', () => {
    STATIONS.forEach(s => {
      expect(s.city.length).toBeGreaterThan(0);
    });
  });

  it('all stations have a non-empty address', () => {
    STATIONS.forEach(s => {
      expect(s.address.length).toBeGreaterThan(0);
    });
  });

  it('station types are one of Office, Hub, or Station', () => {
    const validTypes = ['Office', 'Hub', 'Station'];
    STATIONS.forEach(s => {
      expect(validTypes).toContain(s.type);
    });
  });

  it('all station names are unique', () => {
    const names = STATIONS.map(s => s.name);
    expect(new Set(names).size).toBe(names.length);
  });
});

describe('LocationFinder — Google Maps URL', () => {
  it('builds a valid Google Maps URL', () => {
    const url = buildMapsUrl(STATIONS[0]);
    expect(url).toContain('https://www.google.com/maps/search/');
  });

  it('URL encodes the station name', () => {
    const url = buildMapsUrl(STATIONS[0]);
    expect(url).toContain(encodeURIComponent("District Election Office"));
  });

  it('URL includes station address', () => {
    const url = buildMapsUrl(STATIONS[0]);
    expect(url).toContain("Civic");
  });

  it('different stations produce different URLs', () => {
    const url1 = buildMapsUrl(STATIONS[0]);
    const url2 = buildMapsUrl(STATIONS[1]);
    expect(url1).not.toBe(url2);
  });
});
