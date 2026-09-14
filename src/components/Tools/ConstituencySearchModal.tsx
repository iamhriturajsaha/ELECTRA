"use client";

import { useState, useMemo } from "react";
import { Search, MapPin, X, Target, Info } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const MOCK_CONSTITUENCIES = [
  { id: "DL-01", name: "New Delhi", state: "Delhi", type: "General" },
  { id: "MH-31", name: "Mumbai South", state: "Maharashtra", type: "General" },
  { id: "KA-21", name: "Bangalore Central", state: "Karnataka", type: "General" },
  { id: "WB-12", name: "Kolkata North", state: "West Bengal", type: "General" },
  { id: "TN-04", name: "Chennai Central", state: "Tamil Nadu", type: "General" },
  { id: "UP-54", name: "Lucknow", state: "Uttar Pradesh", type: "General" },
  { id: "GJ-07", name: "Ahmedabad East", state: "Gujarat", type: "General" },
  { id: "PB-03", name: "Amritsar", state: "Punjab", type: "General" },
  { id: "RJ-12", name: "Jaipur", state: "Rajasthan", type: "General" },
  { id: "BR-30", name: "Patna Sahib", state: "Bihar", type: "General" },
  { id: "AP-16", name: "Vijayawada", state: "Andhra Pradesh", type: "General" },
  { id: "TS-09", name: "Hyderabad", state: "Telangana", type: "General" },
  { id: "KL-10", name: "Thiruvananthapuram", state: "Kerala", type: "General" },
  { id: "AS-05", name: "Guwahati", state: "Assam", type: "General" },
  { id: "OD-18", name: "Bhubaneswar", state: "Odisha", type: "General" },
  { id: "MP-19", name: "Bhopal", state: "Madhya Pradesh", type: "General" },
  { id: "HR-01", name: "Ambala", state: "Haryana", type: "SC Reserved" },
  { id: "CH-01", name: "Chandigarh", state: "Chandigarh", type: "General" },
];

export default function ConstituencySearchModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    if (!query) return [];
    return MOCK_CONSTITUENCIES.filter(c => 
      c.name.toLowerCase().includes(query.toLowerCase()) || 
      c.state.toLowerCase().includes(query.toLowerCase())
    );
  }, [query]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
          />
          
          <motion.div 
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-2xl glass-panel cyber-border p-1 shadow-[0_0_50px_rgba(255,153,51,0.2)]"
          >
            <div className="bg-slate-950 p-8 rounded-none">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h3 className="text-3xl font-black text-saffron italic tracking-tight">Electoral Directory</h3>
                  <p className="text-[10px] text-white/40 uppercase font-bold tracking-widest">National Constituency Database</p>
                </div>
                <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg text-white/40 hover:text-white transition-all">
                  <X size={24} />
                </button>
              </div>

              <div className="relative mb-8">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-saffron" size={20} />
                <input 
                  autoFocus
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Enter Constituency or State name..."
                  className="w-full bg-white/5 border border-white/10 pl-12 pr-4 py-4 text-sm focus:border-saffron outline-none transition-all rounded-xl text-white"
                />
              </div>

              <div className="space-y-4 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
                {query && filtered.length === 0 && (
                  <div className="text-center py-12 text-white/20">
                    <Info size={48} className="mx-auto mb-4 opacity-10" />
                    <p className="text-sm font-medium">No records found for your search</p>
                  </div>
                )}
                
                {!query && (
                  <div className="text-center py-12 text-white/20 border border-dashed border-white/10 rounded-2xl">
                    <Target size={32} className="mx-auto mb-4 opacity-10" />
                    <p className="text-[10px] uppercase font-bold tracking-[0.2em]">Start typing to search all Indian States</p>
                  </div>
                )}

                {filtered.map((item) => (
                  <motion.div 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    key={item.id} 
                    className="p-5 bg-white/5 border border-white/10 rounded-2xl hover:border-saffron/50 transition-all flex items-center justify-between group cursor-pointer"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-saffron/10 rounded-xl text-saffron group-hover:bg-saffron group-hover:text-black transition-all">
                        <MapPin size={24} />
                      </div>
                      <div>
                        <h4 className="font-bold text-white text-lg">{item.name}</h4>
                        <p className="text-xs text-white/40 font-medium">{item.state} • {item.id}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-[9px] bg-white/10 text-white px-3 py-1 rounded-full font-bold uppercase tracking-widest group-hover:bg-saffron group-hover:text-black transition-all">
                        {item.type}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="mt-8 pt-8 border-t border-white/5 text-[9px] font-medium text-white/20 uppercase tracking-[0.3em] flex justify-between">
                <span>Database Sync: Live 2026</span>
                <span>Official Election Resource</span>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
