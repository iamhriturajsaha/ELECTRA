"use client";

import { useState, useMemo, useCallback } from "react";
import { MapPin, Search, Navigation, Info, ExternalLink } from "lucide-react";
import { trackEvent } from "@/lib/analytics";
import { logLocationSearch } from "@/lib/firestore-service";

/** Polling station record */
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

export default function LocationFinder() {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    if (!query) return STATIONS.slice(0, 3);
    const lowQuery = query.toLowerCase();
    const results = STATIONS.filter(s =>
      s.pin.startsWith(query) ||
      s.city.toLowerCase().includes(lowQuery) ||
      s.name.toLowerCase().includes(lowQuery)
    );
    // Google Analytics + Firestore: log non-empty searches
    if (query.length >= 2) {
      trackEvent("location", "station_search", query, results.length);
      logLocationSearch({ query, resultsFound: results.length }).catch(() => {});
    }
    return results;
  }, [query]);

  const activeStation = filtered[0];

  const launchExternalMap = useCallback(() => {
    if (!activeStation) return;
    trackEvent("location", "open_google_maps", activeStation.name);
    const mapUrl = `https://www.google.com/maps/search/${encodeURIComponent(activeStation.name + " " + activeStation.address)}`;
    window.open(mapUrl, '_blank');
  }, [activeStation]);

  return (
    <div className="glass-panel rounded-[2.5rem] overflow-hidden h-full flex flex-col border border-white/10 shadow-2xl">
      {/* Header */}
      <div className="p-8 border-b border-white/10 bg-white/5">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-2xl font-black text-white italic flex items-center gap-3">
            <MapPin className="text-saffron" /> Directory Link
          </h3>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-emerald rounded-full animate-ping"></span>
            <span className="text-[10px] text-emerald font-black uppercase tracking-widest">Live Feed</span>
          </div>
        </div>
        <p className="text-xs text-white/40 uppercase font-bold tracking-widest">National Polling Station Registry</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 flex-1">
        {/* Search & Results */}
        <div className="p-8 flex flex-col bg-black/40 border-r border-white/10">
          <div className="relative mb-8">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-saffron" />
            <input 
              type="text" 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search City or Pincode..."
              className="w-full pl-12 pr-4 py-5 bg-white/5 border border-white/10 rounded-2xl text-sm text-white focus:border-saffron outline-none transition-all placeholder:text-white/20 font-mono"
            />
          </div>

          <div className="space-y-4 overflow-y-auto max-h-[400px] pr-2 custom-scrollbar">
            {filtered.length === 0 && (
              <div className="text-center py-12 text-white/20">
                <p className="text-xs font-black uppercase tracking-widest">No local stations found</p>
              </div>
            )}
            {filtered.map((loc) => (
              <div 
                key={loc.id} 
                className="bg-white/5 p-5 rounded-2xl border border-white/10 hover:border-saffron/30 transition-all group cursor-pointer shadow-lg"
              >
                <div className="flex items-start justify-between">
                  <div className="flex gap-4">
                    <div className="bg-saffron/10 p-3 rounded-xl text-saffron group-hover:bg-saffron group-hover:text-black transition-all h-12 w-12 flex items-center justify-center">
                      <MapPin size={24} />
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-base leading-none mb-2">{loc.name}</h4>
                      <p className="text-[10px] text-white/40 uppercase font-bold">{loc.pin} • {loc.city}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => window.open(`https://www.google.com/maps/search/${encodeURIComponent(loc.name + " " + loc.address)}`, '_blank')}
                    className="p-3 text-white/20 hover:text-saffron transition-all"
                    title="Navigate"
                  >
                    <Navigation size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Map Preview */}
        <div className="relative min-h-[400px] bg-slate-900 overflow-hidden">
          <iframe
            src={`https://www.google.com/maps?q=${activeStation ? encodeURIComponent(activeStation.name + " " + activeStation.address) : "India"}&output=embed&t=m&z=15`}
            className="absolute inset-0 w-full h-full grayscale opacity-60 invert"
            style={{ border: 0, filter: 'grayscale(1) invert(0.9) contrast(1.2)' }}
            allowFullScreen={false}
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent pointer-events-none" />
          <div className="absolute bottom-4 left-4 right-4 p-4 glass-panel border border-white/10 rounded-2xl z-10 shadow-lg">
             <div className="flex items-center gap-3">
                <Info size={16} className="text-saffron shrink-0" />
                <p className="text-[10px] text-white/80 font-bold uppercase tracking-widest leading-relaxed">
                  {activeStation ? `Direct link to ${activeStation.name} established. Use search to filter nationwide hubs.` : "Search by City or Pincode to initialize satellite uplink."}
                </p>
             </div>
          </div>
        </div>
      </div>

      <div className="p-6 bg-saffron/5 border-t border-white/10 flex justify-between items-center">
        <span className="text-[8px] font-mono text-white/20 uppercase tracking-[0.4em]">Node: Polling Registry v2 // Secure Assets</span>
        <button 
          onClick={launchExternalMap}
          className="text-[9px] font-black uppercase text-saffron hover:text-white flex items-center gap-2 transition-all group"
        >
          Launch Full Navigation <ExternalLink size={12} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </button>
      </div>
    </div>
  );
}
