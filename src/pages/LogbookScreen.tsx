import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db/db';
import { ScrollText, Calendar, Trash2 } from 'lucide-react';

export default function LogbookScreen() {
  // Fetch logs sorted by date descending
  const logs = useLiveQuery(() => db.logs.orderBy('date').reverse().toArray());

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

  return (
    <div className="p-4 flex flex-col gap-4 text-[var(--text-primary)] pb-24 h-full relative overflow-y-auto">
      <div className="flex items-center gap-2 mb-2 border-b border-[var(--border)] pb-4 shrink-0">
        <ScrollText className="text-[var(--accent)]" size={24} />
        <h2 className="text-2xl font-bold tracking-tighter uppercase">Dev Logbook</h2>
      </div>

      <p className="text-[var(--text-secondary)] text-sm mb-2">과거에 완료한 모든 현상 작업의 기록과 시간 데이터가 안전하게 누적됩니다.</p>

      {!logs || logs.length === 0 ? (
        <div className="card text-center p-8 flex flex-col items-center gap-4 text-[var(--text-secondary)] mt-8">
          <Calendar size={48} className="opacity-20" />
          <p>아직 현상을 완료한 기록이 없습니다.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {logs.map(log => (
            <div key={log.id} className="card p-4 flex flex-col gap-2 relative group hover:border-[var(--accent)] transition-all">
              <div className="flex justify-between items-start border-b border-[var(--border)] border-dashed pb-2">
                <div className="flex flex-col">
                  <span className="text-[10px] text-[var(--text-secondary)] uppercase font-bold">{formatDate(log.date)}</span>
                  <span className="font-bold text-lg text-[var(--accent)]">{log.recipe_name}</span>
                </div>
                <button onClick={() => handleDeleteLog(log.id)} className="p-2 text-[var(--text-secondary)] hover:text-[var(--danger)] hover:bg-[var(--danger)]/10 rounded-full transition-colors opacity-60 hover:opacity-100">
                  <Trash2 size={18} />
                </button>
              </div>
              <div className="flex gap-4 mt-1 text-sm text-[var(--text-secondary)]">
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase font-bold opacity-60">Tested Temp</span>
                  <span className="font-mono">{log.actual_temp_c ? `${log.actual_temp_c.toFixed(1)}°C` : 'N/A'}</span>
                </div>
                <div className="flex flex-col flex-1 pl-4 border-l border-[var(--border)]">
                  <span className="text-[10px] uppercase font-bold opacity-60">Notes</span>
                  <span className="text-xs">{log.notes || "Clean run. No specific notes."}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
