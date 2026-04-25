"use client";

import { useState, useRef } from "react";
import { Camera, Download, User, CheckCircle2 } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const CONSTITUENCIES = [
  "New Delhi (DL-01)", "Mumbai South (MH-31)", "Bangalore Central (KA-21)", 
  "Kolkata North (WB-12)", "Chennai Central (TN-04)", "Lucknow (UP-54)",
  "Patna Sahib (BR-30)", "Ahmedabad East (GJ-07)", "Hyderabad (TS-09)",
  "Jaipur (RJ-12)", "Amritsar (PB-03)", "Guwahati (AS-05)", "Bhopal (MP-19)",
  "Vijayawada (AP-16)", "Thiruvananthapuram (KL-10)", "Chandigarh (CH-01)"
];

export default function VoterIDCard() {
  const [name, setName] = useState("Your Name");
  const [constituency, setConstituency] = useState(CONSTITUENCIES[0]);
  const [image, setImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const downloadPDF = async () => {
    if (!cardRef.current) return;
    setIsGenerating(true);
    try {
      const canvas = await html2canvas(cardRef.current, { 
        scale: 2, 
        useCORS: true,
        backgroundColor: "#020617",
        removeContainer: true,
        logging: false,
      });
      
      const imgData = canvas.toDataURL("image/jpeg", 0.95);
      const pdf = new jsPDF("l", "mm", [canvas.width / 4, canvas.height / 4]);
      pdf.addImage(imgData, "JPEG", 0, 0, pdf.internal.pageSize.getWidth(), pdf.internal.pageSize.getHeight());
      pdf.save(`VoterID_${name.replace(/\s+/g, '_')}.pdf`);
    } catch (err) {
      console.error("PDF generation failed:", err);
      alert("System Error: Failed to render PDF. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };


  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center max-w-6xl mx-auto p-4">
      <div className="space-y-8">
        <div>
          <h2 className="text-4xl font-black text-white mb-4">Identity Simulator</h2>
          <p className="text-white/60 leading-relaxed">
            Generate your **Verified Digital Identity**. 
            Upload your photo and scan the QR code with **Google Lens** to verify your electoral manifest.
          </p>
        </div>
        
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-[#FF9933] font-bold">Full Name</label>
              <input 
                type="text" 
                maxLength={25}
                placeholder="Enter your name..."
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[#1e293b]/50 border border-white/10 p-4 rounded-xl text-sm focus:border-[#FF9933] outline-none transition-all text-white"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-[#FF9933] font-bold">Constituency</label>
              <select 
                value={constituency}
                onChange={(e) => setConstituency(e.target.value)}
                className="w-full bg-[#1e293b]/50 border border-white/10 p-4 rounded-xl text-sm focus:border-[#FF9933] outline-none transition-all text-white appearance-none"
              >
                {CONSTITUENCIES.map(c => <option key={c} value={c} className="bg-[#020617]">{c}</option>)}
              </select>
            </div>
          </div>

          <div className="flex flex-wrap gap-4">
            <label className="flex-1 flex items-center justify-center gap-3 bg-white/5 border border-dashed border-white/20 p-4 rounded-xl cursor-pointer hover:border-[#FF9933] transition-all group">
              <Camera size={20} className="text-white/40 group-hover:text-[#FF9933]" />
              <span className="text-xs font-bold text-white/60">Upload Photo</span>
              <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
            </label>
            <button 
              onClick={downloadPDF}
              disabled={isGenerating}
              className="flex-1 flex items-center justify-center gap-3 bg-[#FF9933] text-black p-4 rounded-xl font-bold hover:bg-white transition-all shadow-lg disabled:opacity-50"
            >
              <Download size={20} className={isGenerating ? "animate-bounce" : ""} /> 
              {isGenerating ? "Processing..." : "Export PDF"}
            </button>
          </div>
        </div>

        <div className="bg-[#10B981]/10 border border-[#10B981]/20 p-5 rounded-2xl flex items-start gap-4">
          <CheckCircle2 className="text-[#10B981] shrink-0" size={24} />
          <p className="text-xs text-[#10B981]/80 leading-relaxed">
            The QR code uses a **Standard Verification Protocol**. Scan it with any QR reader to see your encrypted digital manifest.
          </p>
        </div>
      </div>

      {/* ID Card - Using Inline CSS to bypass Tailwind oklab issues */}
      <div className="p-4" style={{ backgroundColor: 'transparent' }}>
        <div 
          ref={cardRef}
          style={{ 
            width: '100%',
            maxWidth: '520px',
            aspectRatio: '1.6/1',
            margin: '0 auto',
            background: 'linear-gradient(135deg, #0f172a 0%, #020617 100%)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '24px',
            padding: '32px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
            position: 'relative',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            color: 'white'
          }}
        >
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '40px' }}>
            <div>
              <h3 style={{ fontSize: '28px', fontWeight: '900', fontStyle: 'italic', margin: 0, letterSpacing: '-0.02em' }}>ELECTORAL IDENTITY</h3>
              <p style={{ fontSize: '10px', color: '#FF9933', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '4px', margin: '4px 0 0 0' }}>CYBER-SECURE PROTOCOL // 2026</p>
            </div>
            <div style={{ backgroundColor: 'white', padding: '10px', borderRadius: '12px', boxShadow: '0 0 20px rgba(255,153,51,0.2)' }}>
              <QRCodeSVG 
                value={`https://voters.eci.gov.in/verify?name=${encodeURIComponent(name)}&constituency=${encodeURIComponent(constituency)}&ref=ELECTRA_ID`} 
                size={80} 
                level="H" 
                includeMargin={false}
              />
            </div>
          </div>

          {/* Body */}
          <div style={{ display: 'flex', gap: '32px', marginTop: 'auto', alignItems: 'flex-end' }}>
            <div style={{ width: '120px', height: '120px', backgroundColor: '#020617', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.1)', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
              {image ? (
                <img src={image} alt="Voter" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <User size={60} color="rgba(255,255,255,0.05)" />
              )}
            </div>
            
            <div style={{ flex: 1, borderLeft: '2px solid #FF9933', paddingLeft: '16px' }}>
              <div style={{ marginBottom: '16px' }}>
                <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', fontWeight: 'bold', margin: '0 0 4px 0' }}>Voter Name</p>
                <p style={{ fontSize: '20px', fontWeight: 'bold', margin: 0 }}>{name || "YOUR NAME"}</p>
              </div>
              <div style={{ display: 'flex', gap: '24px' }}>
                <div>
                  <p style={{ fontSize: '9px', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', fontWeight: 'bold', margin: '0 0 4px 0' }}>Region</p>
                  <p style={{ fontSize: '12px', fontWeight: 'bold', color: '#FF9933', margin: 0 }}>{constituency.split(' (')[0].toUpperCase()}</p>
                </div>
                <div>
                  <p style={{ fontSize: '9px', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', fontWeight: 'bold', margin: '0 0 4px 0' }}>Status</p>
                  <p style={{ fontSize: '12px', fontWeight: 'bold', color: '#10B981', margin: 0 }}>VERIFIED</p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Decoration */}
          <div style={{ position: 'absolute', bottom: '0', left: '0', width: '100%', height: '4px', background: 'linear-gradient(90deg, #FF9933, #10B981)' }}></div>
        </div>
      </div>
    </div>
  );
}
