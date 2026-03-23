import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db/db';
import { ScrollText, Calendar, Trash2, ImagePlus, X, Maximimize, FileImage } from 'lucide-react';
import { useState, useRef } from 'react';

export default function LogbookScreen() {
  const logs = useLiveQuery(() => db.logs.orderBy('date').reverse().toArray());
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [activeLogId, setActiveLogId] = useState<string | null>(null);
  const [fullScreenImage, setFullScreenImage] = useState<string | null>(null);

  const handleDeleteLog = async (id: string) => {
    if (confirm("이 기록을 삭제하시겠습니까? (이 동작은 되돌릴 수 없습니다)")) {
      await db.logs.delete(id);
    }
  };

  const formatDate = (ms: number) => {
    const d = new Date(ms);
    return d.toLocaleString('ko-KR', { 
      year: 'numeric', month: '2-digit', day: '2-digit', 
      hour: '2-digit', minute: '2-digit' 
    });
  };

  const processFileToCompressedBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const URL = window.webkitURL || window.URL;
      img.src = URL.createObjectURL(file);
      
      img.onload = () => {
        const MAX_WIDTH = 1200;
        const MAX_HEIGHT = 1200;
        let w = img.width;
        let h = img.height;

        if (w > h) {
          if (w > MAX_WIDTH) { h = Math.round((h * MAX_WIDTH) / w); w = MAX_WIDTH; }
        } else {
          if (h > MAX_HEIGHT) { w = Math.round((w * MAX_HEIGHT) / h); h = MAX_HEIGHT; }
        }

        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        if (!ctx) return reject('context fail');

        ctx.drawImage(img, 0, 0, w, h);
        
        // Convert to WebP format for maximum compression while maintaining decent quality
        const dataUrl = canvas.toDataURL('image/webp', 0.85); 
        resolve(dataUrl);
      };
      img.onerror = reject;
    });
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!activeLogId || !e.target.files) return;
    
    const files = Array.from(e.target.files);
    
    // Process files sequentially
    const compressedImages: string[] = [];
    for (const file of files) {
      if (!file.type.startsWith('image/')) continue;
      try {
        const base64 = await processFileToCompressedBase64(file);
        compressedImages.push(base64);
      } catch (err) {
        console.error("Compression failed", err);
      }
    }

    if (compressedImages.length > 0) {
      const log = await db.logs.get(activeLogId);
      if (log) {
        const existingScans = log.scans || [];
        await db.logs.update(activeLogId, { scans: [...existingScans, ...compressedImages] });
      }
    }

    if (fileInputRef.current) fileInputRef.current.value = "";
    setActiveLogId(null);
  };

  const removeScan = async (logId: string, scanIndex: number) => {
    const log = await db.logs.get(logId);
    if (!log || !log.scans) return;
    
    if (confirm("이 스캔 이미지를 기록에서 지우시겠습니까?")) {
      const newScans = [...log.scans];
      newScans.splice(scanIndex, 1);
      await db.logs.update(logId, { scans: newScans });
    }
  };

  return (
    <div className="flex flex-col h-[100dvh] bg-[var(--bg-primary)] text-[var(--text-primary)] relative">
      <input 
        type="file" 
        multiple 
        accept="image/*" 
        ref={fileInputRef} 
        onChange={handleFileSelect} 
        className="hidden" 
      />

      {/* Lightbox Modal */}
      {fullScreenImage && (
        <div className="absolute inset-0 z-50 bg-black/95 flex items-center justify-center p-4 backdrop-blur-md animate-in fade-in zoom-in duration-200" onClick={() => setFullScreenImage(null)}>
          <button className="absolute top-6 right-6 p-3 bg-white/10 hover:bg-white/30 rounded-full text-white transition-all backdrop-blur" onClick={(e) => { e.stopPropagation(); setFullScreenImage(null); }}>
             <X size={28} />
          </button>
          <img src={fullScreenImage} className="max-w-full max-h-full object-contain rounded-md shadow-2xl ring-1 ring-white/10" alt="Full screen scan" />
        </div>
      )}

      {/* Header */}
      <div className="p-4 border-b border-[var(--border)] shrink-0 bg-[var(--bg-primary)] z-10 sticky top-0 shadow-sm">
        <div className="flex items-center gap-2 mb-2">
          <ScrollText className="text-[var(--accent)]" size={24} />
          <h2 className="text-2xl font-bold tracking-tighter uppercase relative">
            Dev Logbook
            <span className="absolute -top-1 -right-8 w-2 h-2 bg-[var(--success)] rounded-full animate-pulse shadow-[0_0_8px_var(--success)]"></span>
          </h2>
        </div>
        <p className="text-[var(--text-secondary)] text-[11px] font-medium leading-relaxed tracking-wide opacity-80 break-keep">과거의 현상 데이터와 스캔 결과물을 영구 보존하는 개인용 오프라인 아카이브입니다.</p>
      </div>

      <div className="flex-1 overflow-y-auto w-full p-4 pb-28">
        {!logs || logs.length === 0 ? (
          <div className="card text-center p-8 flex flex-col items-center justify-center gap-4 text-[var(--text-secondary)] h-full opacity-60">
            <Calendar size={60} strokeWidth={1} />
            <p className="text-sm font-bold mt-2 tracking-wide uppercase">No development records yet.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-6 w-full">
            {logs.map(log => (
              <div key={log.id} className="card p-0 flex flex-col relative group hover:border-[var(--accent)] transition-all overflow-hidden bg-[var(--bg-primary)] shadow-md">
                {/* Header (Date & Delete) */}
                <div className="flex justify-between items-center bg-[var(--bg-secondary)] px-4 py-3 border-b border-[var(--border)]">
                  <span className="text-[11px] text-[var(--text-secondary)] uppercase font-extrabold tracking-widest bg-[var(--bg-primary)] px-2 py-1 rounded shadow-inner whitespace-nowrap">{formatDate(log.date)}</span>
                  <button onClick={() => handleDeleteLog(log.id)} className="p-2 text-[var(--text-secondary)] hover:text-[var(--danger)] hover:bg-[var(--danger)]/10 rounded-full transition-all opacity-40 group-hover:opacity-100 flex-shrink-0">
                    <Trash2 size={16} />
                  </button>
                </div>

                {/* Body (Recipe Data) */}
                <div className="p-4 flex flex-col gap-4 relative z-10">
                  <h3 className="font-black text-[22px] tracking-tight text-[var(--accent)] leading-none truncate">{log.recipe_name}</h3>
                  <div className="flex gap-4 p-3 bg-[var(--bg-secondary)] rounded-xl border border-[var(--border)]">
                    <div className="flex flex-col flex-shrink-0">
                      <span className="text-[10px] uppercase font-black opacity-60 tracking-widest mb-1 text-[var(--text-secondary)]">Dev Temp</span>
                      <span className="font-mono font-bold text-lg text-[var(--text-primary)]">{log.actual_temp_c ? `${log.actual_temp_c.toFixed(1)}°C` : 'N/A'}</span>
                    </div>
                    <div className="w-px bg-[var(--border)] my-1"></div>
                    <div className="flex flex-col flex-1 truncate">
                      <span className="text-[10px] uppercase font-black opacity-60 tracking-widest mb-1 text-[var(--text-secondary)]">Notes</span>
                      <span className="text-[12px] text-[var(--text-primary)] font-medium leading-snug whitespace-pre-line">{log.notes || "Clean run. No manual interventions reported."}</span>
                    </div>
                  </div>
                </div>

                {/* Scans Gallery */}
                <div className="px-4 pb-4">
                  <div className="flex items-center justify-between mb-3 border-t border-[var(--border)] pt-4 border-dashed">
                    <span className="text-[11px] font-black uppercase tracking-widest text-[var(--text-primary)] flex items-center gap-1.5 opacity-80">
                       <FileImage size={14} className="text-[var(--accent)]"/> 
                       Scanned Output Image ({log.scans?.length || 0})
                    </span>
                    <button 
                      onClick={() => { setActiveLogId(log.id); fileInputRef.current?.click(); }}
                      className="text-[10px] font-bold text-[var(--accent)] border border-[var(--accent)] px-3 py-1.5 rounded-lg flex items-center gap-1.5 hover:bg-[var(--accent)] hover:text-white transition-colors active:scale-95"
                    >
                      <ImagePlus size={14} /> 스캔 사진 업로드
                    </button>
                  </div>

                  {log.scans && log.scans.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 border-[var(--border)] border p-2 rounded-xl bg-[var(--bg-secondary)] shadow-inner">
                      {log.scans.map((scan, i) => (
                        <div key={i} className="relative group/scan rounded-lg overflow-hidden border border-[var(--border)] aspect-[3/2] sm:aspect-square bg-black shadow cursor-pointer transition-transform hover:z-10 hover:scale-[1.03]" onClick={() => setFullScreenImage(scan)}>
                          <img src={scan} alt={`Scan ${i+1}`} className="w-full h-full object-cover transition-all duration-500 group-hover/scan:opacity-80" />
                          <button 
                            onClick={(e) => { e.stopPropagation(); removeScan(log.id, i); }} 
                            className="absolute top-1 right-1 bg-black/60 text-white p-1.5 rounded-full opacity-0 group-hover/scan:opacity-100 hover:bg-[var(--danger)] transition-all transform scale-75 hover:scale-100"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="h-16 border border-dashed border-[var(--border)] rounded-xl flex items-center justify-center text-[var(--text-secondary)] text-xs font-medium cursor-pointer hover:bg-[var(--bg-secondary)] hover:border-[var(--accent)] transition-all bg-black/5" onClick={() => { setActiveLogId(log.id); fileInputRef.current?.click(); }}>
                       아직 첨부된 필름 스캔 결과물이 없습니다.
                    </div>
                  )}
                </div>

              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
