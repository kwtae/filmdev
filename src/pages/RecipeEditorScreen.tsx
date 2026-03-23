import { useState, useEffect } from 'react';
import { ChevronLeft, Plus, MoveUp, MoveDown, Trash2, Save, X, Search, Database } from 'lucide-react';
import { db, Recipe, ProcessStep } from '../db/db';
import { v4 as uuidv4 } from 'uuid';
import { mdcDatabase, MDCRecord } from '../data/mdc';

interface Props {
  recipeId?: string; // null if creating a new recipe
  onBack: () => void;
}

export default function RecipeEditorScreen({ recipeId, onBack }: Props) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [filmType, setFilmType] = useState('B&W');
  const [iso, setIso] = useState<number | ''>('');
  const [tempC, setTempC] = useState<number>(20); // Default D-76 / B&W Temp
  
  const [steps, setSteps] = useState<ProcessStep[]>([]);
  const [showMdcModal, setShowMdcModal] = useState(false);
  const [mdcSearch, setMdcSearch] = useState('');

  useEffect(() => {
    async function fetchRecipe() {
      if (recipeId) {
        const recipe = await db.recipes.get(recipeId);
        if (recipe) {
          setName(recipe.name);
          setDescription(recipe.description || '');
          setFilmType(recipe.film_type || 'B&W');
          setIso(recipe.iso || '');
          setTempC(recipe.target_temp_c || 20);
          setSteps(recipe.steps);
        }
      } else {
        // default empty steps
        setSteps([
          { id: uuidv4(), name: 'Developer', duration_mins: 5, duration_secs: 0, 
            agitation_type: 'Inversion', agitation_interval_secs: 60, agitation_duration_secs: 10 }
        ]);
      }
    }
    fetchRecipe();
  }, [recipeId]);

  const addStep = () => {
    setSteps([...steps, { 
      id: uuidv4(), name: 'New Step', duration_mins: 1, duration_secs: 0, 
      agitation_type: 'None', agitation_interval_secs: 0, agitation_duration_secs: 0 
    }]);
  };

  const removeStep = (id: string) => {
    setSteps(steps.filter(s => s.id !== id));
  };

  const moveStep = (index: number, direction: 'up'|'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === steps.length - 1) return;
    
    const newSteps = [...steps];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    [newSteps[index], newSteps[targetIndex]] = [newSteps[targetIndex], newSteps[index]];
    setSteps(newSteps);
  };

  const updateStep = (id: string, field: keyof ProcessStep, value: any) => {
    setSteps(steps.map(s => s.id === id ? { ...s, [field]: value } : s));
  };

  const saveRecipe = async () => {
    if (!name.trim() || steps.length === 0) {
      alert("Please provide a name and at least one step.");
      return;
    }

    const payload: Omit<Recipe, 'id' | 'created_at' | 'updated_at'> = {
      name,
      description,
      film_type: filmType as any,
      iso: iso === '' ? undefined : Number(iso),
      target_temp_c: tempC,
      steps
    };

    if (recipeId) {
      await db.recipes.update(recipeId, { ...payload, updated_at: Date.now() });
    } else {
      await db.recipes.add({
        id: uuidv4(),
        ...payload,
        created_at: Date.now(),
        updated_at: Date.now()
      });
    }
    onBack();
  };

  const loadFromMdc = (record: MDCRecord) => {
    // Overwrite the header info safely
    setName(`${record.film_name} @ ${record.developer}`);
    setDescription(`Dilution: ${record.dilution} | ${record.notes || ''}`);
    setIso(record.iso);
    setTempC(record.temp_c);
    if (record.film_brand.includes('C-41')) {
      setFilmType('Color Negative (C-41)');
    } else {
      setFilmType('B&W');
    }

    // Adapt the first 'Developer' step magically
    const newSteps = [...steps];
    if (newSteps.length === 0) {
      newSteps.push({ id: uuidv4(), name: 'Developer', duration_mins: record.dev_time_mins, duration_secs: record.dev_time_secs, agitation_type: 'Inversion', agitation_interval_secs: 60, agitation_duration_secs: 10 });
    } else {
      newSteps[0].name = 'Developer';
      newSteps[0].duration_mins = record.dev_time_mins;
      newSteps[0].duration_secs = record.dev_time_secs;
    }

    // Auto append Stop/Fixer intelligently if they don't exist
    if (newSteps.length === 1) {
      if (record.film_brand.includes('C-41')) {
         newSteps.push({ id: uuidv4(), name: 'Blix', duration_mins: 6, duration_secs: 30, agitation_type: 'Inversion', agitation_interval_secs: 30, agitation_duration_secs: 10 });
         newSteps.push({ id: uuidv4(), name: 'Wash', duration_mins: 3, duration_secs: 0, agitation_type: 'Running Water', agitation_interval_secs: 0, agitation_duration_secs: 0 });
      } else {
         newSteps.push({ id: uuidv4(), name: 'Stop Bath', duration_mins: 1, duration_secs: 0, agitation_type: 'Continuous', agitation_interval_secs: 0, agitation_duration_secs: 0 });
         newSteps.push({ id: uuidv4(), name: 'Fixer', duration_mins: 5, duration_secs: 0, agitation_type: 'Inversion', agitation_interval_secs: 60, agitation_duration_secs: 10 });
         newSteps.push({ id: uuidv4(), name: 'Wash', duration_mins: 10, duration_secs: 0, agitation_type: 'Running Water', agitation_interval_secs: 0, agitation_duration_secs: 0 });
      }
    }

    setSteps(newSteps);
    setShowMdcModal(false);
  };

  const filteredMdc = mdcDatabase.filter(r => 
    r.film_name.toLowerCase().includes(mdcSearch.toLowerCase()) || 
    r.developer.toLowerCase().includes(mdcSearch.toLowerCase()) ||
    r.film_brand.toLowerCase().includes(mdcSearch.toLowerCase())
  );

  return (
    <div className="flex flex-col h-[100dvh] bg-[var(--bg-primary)] overflow-y-auto pb-24 text-[var(--text-primary)] relative">
      <div className="sticky top-0 z-20 bg-[var(--bg-primary)] border-b border-[var(--border)] p-4 flex items-center justify-between pointer-events-auto">
        <button onClick={onBack} className="p-2 -ml-2 hover:bg-[var(--bg-secondary)] rounded-full transition-colors">
          <ChevronLeft size={24} />
        </button>
        <h2 className="font-bold text-lg">{recipeId ? 'Edit Recipe' : 'New Recipe'}</h2>
        <button onClick={saveRecipe} className="flex items-center gap-1 text-[var(--success)] font-bold px-3 py-1.5 rounded bg-[var(--success)]/10 hover:bg-[var(--success)]/20 transition-colors">
          <Save size={18} /> Save
        </button>
      </div>

      {showMdcModal && (
        <div className="absolute inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[var(--bg-primary)] w-full max-w-md h-[80vh] rounded-2xl border border-[var(--border)] flex flex-col shadow-2xl overflow-hidden relative">
            <div className="p-4 border-b border-[var(--border)] flex justify-between items-center bg-[var(--bg-secondary)]">
              <div className="flex items-center gap-2 text-[var(--accent)] font-bold">
                 <Database size={20} /> MDC Library
              </div>
              <button className="p-1 hover:bg-black/10 rounded-full text-[var(--text-secondary)]" onClick={() => setShowMdcModal(false)}><X size={24}/></button>
            </div>
            <div className="p-4 border-b border-[var(--border)]">
              <div className="relative">
                <Search size={16} className="absolute left-3 top-2.5 text-[var(--text-secondary)] opacity-50" />
                <input 
                  type="text" 
                  placeholder="Search Film or Developer..." 
                  value={mdcSearch} 
                  onChange={e => setMdcSearch(e.target.value)} 
                  className="w-full bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg py-2 pl-9 pr-3 text-sm focus:border-[var(--accent)] outline-none" 
                />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
              {filteredMdc.map(record => (
                <button 
                  key={record.id} 
                  onClick={() => loadFromMdc(record)}
                  className="w-full text-left p-4 card hover:border-[var(--accent)] transition-colors bg-[var(--bg-secondary)] border border-[var(--border)] flex items-center justify-between group"
                >
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase font-black tracking-widest text-[var(--text-secondary)] mb-1">{record.film_brand}</span>
                    <span className="font-extrabold text-[#eee] text-sm group-hover:text-[var(--accent)]">{record.film_name} (ISO {record.iso})</span>
                    <span className="text-[11px] font-bold mt-1 text-[var(--success)]">{record.developer} @ {record.dilution}</span>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="font-mono text-[14px] font-black">{record.dev_time_mins}m {record.dev_time_secs}s</span>
                    <span className="text-xs bg-black/20 px-2 py-0.5 mt-1 rounded text-[var(--accent)] font-bold shadow-inner">{record.temp_c}°C</span>
                  </div>
                </button>
              ))}
              {filteredMdc.length === 0 && <span className="text-center text-xs opacity-50 mt-10 uppercase tracking-widest font-bold">No Match Found</span>}
            </div>
          </div>
        </div>
      )}

      <div className="p-4 max-w-2xl mx-auto w-full flex flex-col gap-6 animate-in slide-in-from-bottom-4 duration-300">
        
        {!recipeId && (
          <button onClick={() => setShowMdcModal(true)} className="w-full bg-gradient-to-r from-[var(--bg-secondary)] to-[var(--bg-primary)] border border-dashed border-[var(--accent)] p-4 rounded-xl flex items-center justify-center gap-3 hover:bg-[var(--accent)]/5 hover:border-solid hover:shadow-[0_0_15px_var(--accent)_inset] transition-all group">
            <div className="bg-[var(--accent)] p-2 rounded-full text-[var(--bg-primary)] group-hover:scale-110 transition-transform">
              <Database size={16} />
            </div>
            <div className="flex flex-col items-start text-left">
               <span className="font-black text-sm text-[var(--accent)] tracking-wide">Import from Massive Dev Chart</span>
               <span className="text-[10px] text-[var(--text-secondary)] font-bold tracking-widest uppercase">클라우드 템플릿(MDC) 불러오기</span>
            </div>
          </button>
        )}

        {/* Global Recipe Info */}
        <div className="card p-5 border-[var(--border)]">
          <h3 className="text-xs font-black uppercase text-[var(--accent)] tracking-widest mb-4 border-b border-[var(--border)] pb-2">Recipe Meta</h3>
          <div className="flex flex-col gap-4">
            <label className="flex flex-col gap-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-secondary)] pl-1">Name</span>
              <input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Kodak Tri-X @ D76" className="input-field" />
            </label>
            <div className="flex gap-4">
              <label className="flex flex-col gap-1.5 flex-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-secondary)] pl-1">Type</span>
                <select value={filmType} onChange={e => setFilmType(e.target.value)} className="input-field">
                  <option>B&W</option>
                  <option>Color Negative (C-41)</option>
                  <option>Color Reversal (E-6)</option>
                  <option>C-41 B&W</option>
                </select>
              </label>
              <label className="flex flex-col gap-1.5 w-24">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-secondary)] pl-1">ISO</span>
                <input type="number" value={iso} onChange={e => setIso(e.target.value === '' ? '' : Number(e.target.value))} placeholder="400" className="input-field font-mono" />
              </label>
              <label className="flex flex-col gap-1.5 w-24">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-secondary)] pl-1">°C</span>
                <input type="number" step="0.5" value={tempC} onChange={e => setTempC(Number(e.target.value))} placeholder="20" className="input-field font-mono text-[var(--accent)]" />
              </label>
            </div>
            <label className="flex flex-col gap-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-secondary)] pl-1">Description</span>
              <input value={description} onChange={e => setDescription(e.target.value)} placeholder="Push +1, Dilution B etc." className="input-field" />
            </label>
          </div>
        </div>

        {/* Process Steps */}
        <div className="flex flex-col gap-3">
          <h3 className="text-xs font-black uppercase text-[var(--accent)] tracking-widest mb-1 border-b border-[var(--border)] pb-2 flex justify-between items-center">
            Process Timeline
            <span className="bg-[var(--bg-secondary)] text-[10px] px-2 py-0.5 rounded shadow-inner">{steps.length} steps</span>
          </h3>
          
          {steps.map((step, index) => (
            <div key={step.id} className="card p-0 flex flex-col relative group border-[var(--border)] hover:border-[var(--text-secondary)] transition-colors overflow-hidden">
              <div className="absolute top-0 left-0 bottom-0 w-1.5 bg-gradient-to-b from-[var(--bg-secondary)] to-[var(--border)] group-hover:from-[var(--accent)] transition-colors"></div>
              
              <div className="flex justify-between items-center bg-[var(--bg-secondary)] px-3 py-2 border-b border-[var(--border)]">
                <span className="font-mono text-xs font-bold text-[var(--text-secondary)]"># {index + 1}</span>
                <div className="flex gap-1">
                  <button onClick={() => moveStep(index, 'up')} disabled={index===0} className="p-1.5 hover:bg-[var(--bg-primary)] rounded disabled:opacity-20 transition-colors"><MoveUp size={14} /></button>
                  <button onClick={() => moveStep(index, 'down')} disabled={index===steps.length-1} className="p-1.5 hover:bg-[var(--bg-primary)] rounded disabled:opacity-20 transition-colors"><MoveDown size={14} /></button>
                  <button onClick={() => removeStep(step.id)} className="p-1.5 hover:bg-[var(--danger)]/20 hover:text-[var(--danger)] rounded ml-2 transition-colors"><Trash2 size={14} /></button>
                </div>
              </div>

              <div className="p-4 pl-5 flex flex-col gap-4">
                <input value={step.name} onChange={e => updateStep(step.id, 'name', e.target.value)} placeholder="Step Name (e.g. Developer)" className="w-full bg-transparent text-lg font-bold outline-none placeholder-[var(--text-secondary)] border-b border-transparent focus:border-[var(--accent)] transition-colors" />
                
                <div className="flex gap-4 bg-[var(--bg-secondary)] p-3 rounded-xl border border-[var(--border)]">
                   <div className="flex flex-col flex-1">
                      <span className="text-[10px] uppercase font-bold tracking-widest text-[var(--text-secondary)] mb-1">Time</span>
                      <div className="flex items-center gap-1 font-mono">
                        <input type="number" min="0" value={step.duration_mins} onChange={e => updateStep(step.id, 'duration_mins', Number(e.target.value))} className="w-12 bg-[var(--bg-primary)] border border-[var(--border)] rounded text-center py-1 text-sm focus:border-[var(--accent)] outline-none" />
                        <span className="text-[var(--text-secondary)] text-xs">m</span>
                        <input type="number" min="0" max="59" value={step.duration_secs} onChange={e => updateStep(step.id, 'duration_secs', Number(e.target.value))} className="w-12 bg-[var(--bg-primary)] border border-[var(--border)] rounded text-center py-1 text-sm focus:border-[var(--accent)] outline-none" />
                        <span className="text-[var(--text-secondary)] text-xs">s</span>
                      </div>
                   </div>

                   <div className="flex flex-col flex-1 pl-3 border-l border-[var(--border)]">
                      <span className="text-[10px] uppercase font-bold tracking-widest text-[var(--text-secondary)] mb-1">Agitation</span>
                      <select value={step.agitation_type} onChange={e => updateStep(step.id, 'agitation_type', e.target.value)} className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded py-1 px-2 text-[12px] focus:border-[var(--accent)] outline-none">
                        <option>None</option>
                        <option>Inversion</option>
                        <option>Continuous</option>
                        <option>Running Water</option>
                      </select>
                   </div>
                </div>

                {step.agitation_type !== 'None' && step.agitation_type !== 'Continuous' && step.agitation_type !== 'Running Water' && (
                  <div className="flex gap-4 p-3 border border-[var(--border)] rounded-xl bg-black/10">
                    <label className="flex flex-col gap-1 flex-1">
                      <span className="text-[10px] uppercase font-bold tracking-widest text-[var(--text-secondary)]">Interval (s)</span>
                      <input type="number" min="0" value={step.agitation_interval_secs} onChange={e => updateStep(step.id, 'agitation_interval_secs', Number(e.target.value))} className="input-field py-1 px-2 text-sm font-mono h-8" />
                    </label>
                    <label className="flex flex-col gap-1 flex-1">
                      <span className="text-[10px] uppercase font-bold tracking-widest text-[var(--text-secondary)]">Duration (s)</span>
                      <input type="number" min="0" value={step.agitation_duration_secs} onChange={e => updateStep(step.id, 'agitation_duration_secs', Number(e.target.value))} className="input-field py-1 px-2 text-sm font-mono h-8" />
                    </label>
                  </div>
                )}
              </div>
            </div>
          ))}

          <button onClick={addStep} className="flex items-center justify-center gap-2 p-4 border border-[var(--border)] border-dashed rounded-xl text-[var(--text-secondary)] hover:text-[var(--accent)] hover:border-[var(--accent)] hover:bg-[var(--accent)]/5 transition-all w-full card mt-2">
            <Plus size={20} />
            <span className="font-bold text-sm tracking-wide">Add Processing Step</span>
          </button>
        </div>
        
      </div>
    </div>
  );
}
