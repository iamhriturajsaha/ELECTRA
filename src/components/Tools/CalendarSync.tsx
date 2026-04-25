"use client";

import { useCallback } from "react";
import { Calendar, Plus, Clock, ExternalLink, CheckCircle2 } from "lucide-react";
import { trackEvent } from "@/lib/analytics";
import { logCalendarSync } from "@/lib/firestore-service";

const UPCOMING_DATES = [
  { id: 1, event: "Voter Registration Deadline", date: "2026-05-15", time: "17:00", type: "Deadline" },
  { id: 2, event: "National Polling Day", date: "2026-06-01", time: "07:00", type: "Polling" },
  { id: 3, event: "Postal Ballot Submission", date: "2026-05-20", time: "18:00", type: "Submission" },
  { id: 4, event: "Final Result Declaration", date: "2026-06-05", time: "10:00", type: "Results" },
];

export default function CalendarSync() {
  const addToGoogleCalendar = useCallback(async (event: string, date: string, time: string) => {
    const start = date.replace(/-/g, '') + 'T' + time.replace(/:/g, '') + '00Z';
    const endHour = (parseInt(time.split(':')[0]) + 1).toString().padStart(2, '0');
    const end = date.replace(/-/g, '') + 'T' + endHour + time.split(':')[1] + '00Z';
    const url = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event)}&dates=${start}/${end}&details=${encodeURIComponent("Electoral Deadline - Electra Civic OS")}&location=India&sf=true&output=xml`;
    window.open(url, '_blank');

    // Google Analytics: track calendar add
    trackEvent("calendar", "add_to_google_calendar", event);

    // Firestore: log the sync event
    try {
      await logCalendarSync({ eventName: event, eventDate: date });
    } catch {
      // Non-blocking
    }
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between px-2">
        <h3 className="text-xl font-bold text-white flex items-center gap-3">
          <Calendar className="text-saffron" /> Critical Deadlines
        </h3>
        <span className="text-[10px] font-bold text-saffron uppercase tracking-widest bg-saffron/10 px-3 py-1 rounded-full border border-saffron/20">
          2026 Season
        </span>
      </div>

      <div className="grid gap-4">
        {UPCOMING_DATES.map((item) => (
          <div key={item.id} className="bg-white/5 border border-white/10 p-5 rounded-2xl group hover:border-saffron/50 transition-all shadow-xl">
            <div className="flex items-center justify-between">
              <div className="flex gap-4">
                <div className="bg-saffron/10 p-3 rounded-xl text-saffron group-hover:bg-saffron group-hover:text-black transition-colors flex items-center justify-center h-12 w-12">
                  <Clock size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-white text-base leading-none mb-2">{item.event}</h4>
                  <p className="text-xs text-white/40 font-mono uppercase">{item.date} {`//`} {item.time} IST</p>
                </div>
              </div>
              <button 
                onClick={() => addToGoogleCalendar(item.event, item.date, item.time)}
                className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-saffron hover:text-white transition-all border border-saffron/20 px-4 py-2 rounded-xl hover:bg-saffron hover:text-black shadow-lg"
              >
                <Plus size={14} /> Add to Life
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="glass-panel p-6 rounded-[2rem] border border-white/10 bg-gradient-to-br from-saffron/10 to-transparent shadow-2xl relative overflow-hidden group">
        <div className="absolute -right-8 -bottom-8 opacity-10 group-hover:scale-110 transition-transform">
          <CheckCircle2 size={120} className="text-saffron" />
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 bg-saffron rounded-lg flex items-center justify-center">
              <Plus size={18} className="text-black" />
            </div>
            <h4 className="font-bold text-white uppercase text-sm tracking-widest italic">Sync Interface</h4>
          </div>
          <p className="text-xs text-white/40 leading-relaxed mb-6 max-w-[280px]">
            Ensure 100% attendance. One-click synchronization for all critical electoral phases.
          </p>
          <button 
            onClick={() => window.open('https://voters.eci.gov.in/schedule', '_blank')}
            className="text-[10px] font-black uppercase text-saffron hover:text-white flex items-center gap-2 transition-colors border-b border-saffron/30 pb-1"
          >
            Launch Official Schedule <ExternalLink size={12} />
          </button>
        </div>
      </div>
    </div>
  );
}
