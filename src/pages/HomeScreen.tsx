import { useLiveQuery } from 'dexie-react-hooks';
import { db, type Recipe } from '../db/db';
import { useNavigate } from 'react-router-dom';
import { FileText, PlusCircle, DatabaseZap, Share2 } from 'lucide-react';
import { useTimerStore } from '../store/timerStore';
import { useLangStore } from '../store/langStore';

export default function HomeScreen() {
  const recipes = useLiveQuery(() => db.recipes.toArray());
  const navigate = useNavigate();
  const startPrep = useTimerStore(state => state.startPrep);
  const t = useLangStore(state => state.t);

  const injectSeedData = async () => {
    const seeds: Recipe[] = [
      {
        id: "seed_kodak_d76",
        name: "Kodak Tri-X 400 (D-76 1:1)",
        type: "standard", film_type: "B&W", iso_shot: 400, base_temp_c: 20, compensation_coefficient: 1.0,
        steps: [
          { name: "Developer", duration_sec: 585, agitation_interval_sec: 60, agitation_duration_sec: 10, agitation_type: "inversion" },
          { name: "Stop Bath", duration_sec: 30, agitation_interval_sec: 0, agitation_duration_sec: 30, agitation_type: "continuous" },
          { name: "Fixer", duration_sec: 300, agitation_interval_sec: 60, agitation_duration_sec: 10, agitation_type: "inversion" },
          { name: "Wash", duration_sec: 600, agitation_interval_sec: 0, agitation_duration_sec: 0, agitation_type: "continuous" }
        ]
      },
      {
        id: "seed_hp5_hc110",
        name: "Ilford HP5+ (Ilfotec HC 1:31)",
        type: "standard", film_type: "B&W", iso_shot: 400, base_temp_c: 20, compensation_coefficient: 1.0,
        steps: [
          { name: "Developer", duration_sec: 390, agitation_interval_sec: 60, agitation_duration_sec: 10, agitation_type: "inversion" },
          { name: "Stop Bath", duration_sec: 30, agitation_interval_sec: 0, agitation_duration_sec: 30, agitation_type: "continuous" },
          { name: "Fixer", duration_sec: 240, agitation_interval_sec: 60, agitation_duration_sec: 10, agitation_type: "inversion" },
          { name: "Wash", duration_sec: 300, agitation_interval_sec: 0, agitation_duration_sec: 0, agitation_type: "continuous" }
        ]
      },
      {
        id: "seed_c41_portra",
        name: "Kodak Portra 400 (C-41 Standard)",
        type: "standard", film_type: "C-41", iso_shot: 400, base_temp_c: 39, compensation_coefficient: 1.0,
        steps: [
          { name: "Pre-Wash (39°C)", duration_sec: 60, agitation_interval_sec: 0, agitation_duration_sec: 60, agitation_type: "continuous" },
          { name: "Developer (C-41)", duration_sec: 210, agitation_interval_sec: 30, agitation_duration_sec: 5, agitation_type: "inversion" },
          { name: "Blix (Bleach/Fix)", duration_sec: 480, agitation_interval_sec: 30, agitation_duration_sec: 5, agitation_type: "inversion" },
          { name: "Wash", duration_sec: 180, agitation_interval_sec: 0, agitation_duration_sec: 0, agitation_type: "continuous" },
          { name: "Stabilizer", duration_sec: 60, agitation_interval_sec: 0, agitation_duration_sec: 60, agitation_type: "continuous" }
        ]
      },
      {
        id: "seed_foma_rodinal",
        name: "Fomapan 100 (Rodinal 1:50)",
        type: "standard", film_type: "B&W", iso_shot: 100, base_temp_c: 20, compensation_coefficient: 1.0,
        steps: [
          { name: "Developer", duration_sec: 540, agitation_interval_sec: 60, agitation_duration_sec: 10, agitation_type: "inversion" },
          { name: "Stop Bath", duration_sec: 30, agitation_interval_sec: 0, agitation_duration_sec: 30, agitation_type: "continuous" },
          { name: "Fixer", duration_sec: 300, agitation_interval_sec: 60, agitation_duration_sec: 10, agitation_type: "inversion" },
          { name: "Wash", duration_sec: 600, agitation_interval_sec: 0, agitation_duration_sec: 0, agitation_type: "continuous" }
        ]
      },
      {
        id: "seed_kentmere_hc",
        name: "Kentmere 400 (HC-110 Dil B)",
        type: "standard", film_type: "B&W", iso_shot: 400, base_temp_c: 20, compensation_coefficient: 1.0,
        steps: [
          { name: "Developer", duration_sec: 300, agitation_interval_sec: 60, agitation_duration_sec: 10, agitation_type: "inversion" },
          { name: "Stop Bath", duration_sec: 30, agitation_interval_sec: 0, agitation_duration_sec: 30, agitation_type: "continuous" },
          { name: "Fixer", duration_sec: 240, agitation_interval_sec: 60, agitation_duration_sec: 10, agitation_type: "inversion" },
          { name: "Wash", duration_sec: 300, agitation_interval_sec: 0, agitation_duration_sec: 0, agitation_type: "continuous" }
        ]
      },
      {
        id: "seed_vision3_ecl",
        name: "Cinestill 800T (C-41 Push +1)",
        type: "standard", film_type: "C-41", iso_shot: 800, base_temp_c: 39, compensation_coefficient: 1.0,
        steps: [
          { name: "Pre-Wash", duration_sec: 60, agitation_interval_sec: 0, agitation_duration_sec: 60, agitation_type: "continuous" },
          { name: "Developer (+1 Stop)", duration_sec: 255, agitation_interval_sec: 30, agitation_duration_sec: 5, agitation_type: "inversion" },
          { name: "Blix", duration_sec: 480, agitation_interval_sec: 30, agitation_duration_sec: 5, agitation_type: "inversion" },
          { name: "Wash", duration_sec: 180, agitation_interval_sec: 0, agitation_duration_sec: 0, agitation_type: "continuous" }
        ]
      }
    ];
    await db.recipes.bulkPut(seeds);
  };

  const handleStartProcess = (recipe: Recipe) => {
    startPrep(recipe);
    navigate('/timer');
  };

  const handleEditRecipe = (e: React.MouseEvent, recipe: Recipe) => {
    e.stopPropagation();
    navigate('/editor', { state: { recipe } });
  };

  return (
    <div className="p-4 flex flex-col gap-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">{t('myRecipes')}</h2>
        <button 
          onClick={() => navigate('/editor')}
          className="flex items-center gap-1 text-[var(--accent)] hover:text-[var(--accent-hover)] font-medium active:scale-95 transition-transform"
        >
          <PlusCircle size={20} /> {t('new')}
        </button>
      </div>

      {!recipes || recipes.length === 0 ? (
        <div className="card text-center p-8 flex flex-col items-center gap-4 text-[var(--text-secondary)]">
          <DatabaseZap size={48} className="opacity-50" />
          <p>{t('noRecipes')}</p>
          <button onClick={injectSeedData} className="btn btn-primary w-full max-w-[200px] mt-4">
            {t('loadPreset')}
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-3 pb-24">
          {recipes.map(r => (
            <div key={r.id} className="card cursor-pointer hover:border-[var(--accent)] transition-all active:scale-[0.98]" onClick={() => handleStartProcess(r)}>
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-[var(--text-primary)] text-lg">{r.name}</h3>
                  <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)] mt-1 font-mono">
                    <span className="uppercase border border-[var(--border)] px-1 rounded text-[10px] bg-black/20">{r.film_type}</span>
                    <span>ISO {r.iso_shot}</span>
                    <span className="text-[var(--accent)]">{r.base_temp_c}°C</span>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button 
                    onClick={async (e) => {
                      e.stopPropagation();
                      const txt = `💡 FilmDev Recipe:\n[${r.name}]\nISO:${r.iso_shot} | Temp:${r.base_temp_c}°C\nSteps: ${r.steps.map(s => s.name).join(' > ')}`;
                      if (navigator.share) {
                        try { await navigator.share({ title: r.name, text: txt }); } catch (err) {}
                      } else {
                        await navigator.clipboard.writeText(txt);
                        alert("레시피 텍스트가 클립보드에 복사되었습니다. (클라우드 파싱 URL 지원 예정)");
                      }
                    }}
                    className="p-2 text-[var(--text-secondary)] hover:text-[var(--accent)] hover:bg-[var(--bg-primary)] rounded-full transition-colors"
                  >
                    <Share2 size={18} />
                  </button>
                  <button 
                    onClick={(e) => handleEditRecipe(e, r)} 
                    className="p-2 text-[var(--text-secondary)] hover:text-[var(--accent)] hover:bg-[var(--bg-primary)] rounded-full transition-colors"
                    aria-label="Edit Recipe"
                  >
                    <FileText size={20} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
