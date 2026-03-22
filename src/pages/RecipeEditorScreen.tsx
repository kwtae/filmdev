import { useState } from 'react';
import { db, type Recipe, type Step } from '../db/db';
import { useNavigate, useLocation } from 'react-router-dom';
import { Save, Plus, Trash2, ArrowLeft, GripVertical } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

export default function RecipeEditorScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // If editing an existing recipe, it is passed via router state
  const editTarget = location.state?.recipe as Recipe | undefined;

  const [name, setName] = useState(editTarget?.name || '');
  const [baseTemp, setBaseTemp] = useState(editTarget?.base_temp_c || 20);
  const [iso, setIso] = useState(editTarget?.iso_shot || 400);
  const [filmType, setFilmType] = useState<Recipe['film_type']>(editTarget?.film_type || 'B&W');
  const [recipeType, setRecipeType] = useState<Recipe['type']>(editTarget?.type || 'standard');

  const defaultStep: Step = { name: "New Step", duration_sec: 60, agitation_interval_sec: 60, agitation_duration_sec: 10, agitation_type: "inversion" };
  const [steps, setSteps] = useState<Step[]>(editTarget?.steps || [{...defaultStep, name: "Developer"}]);

  const addStep = () => setSteps([...steps, { ...defaultStep, name: `Step ${steps.length + 1}` }]);
  const removeStep = (idx: number) => {
    if (steps.length <= 1) return;
    setSteps(steps.filter((_, i) => i !== idx));
  };
  
  const updateStep = (idx: number, field: keyof Step, value: any) => {
    const newSteps = [...steps];
    newSteps[idx] = { ...newSteps[idx], [field]: value };
    setSteps(newSteps);
  };

  const parseTimeInput = (mins: number, secs: number) => (mins * 60) + secs;

  const handleSave = async () => {
    if (!name.trim()) return;
    const recipeData: Recipe = {
      id: editTarget?.id || uuidv4(),
      name,
      type: recipeType,
      film_type: filmType,
      iso_shot: iso,
      base_temp_c: baseTemp,
      compensation_coefficient: editTarget?.compensation_coefficient || 1.0,
      steps
    };
    await db.recipes.put(recipeData);
    navigate('/');
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-3 p-4 border-b border-[var(--border)] shrink-0 z-10 sticky top-0 bg-[var(--bg-primary)]">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)]"><ArrowLeft size={24} /></button>
        <h2 className="text-2xl font-bold">{editTarget ? 'Edit Recipe' : 'Build Custom Recipe'}</h2>
      </div>

      <div className="p-4 flex flex-col gap-6 overflow-y-auto pb-32">
        <div className="card flex flex-col gap-4">
          <label className="flex flex-col gap-1">
            <span className="text-sm font-bold text-[var(--accent)] uppercase">Recipe Name</span>
            <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Kodak Portra 400 + C41" 
              className="p-3 rounded-lg bg-[var(--bg-primary)] border border-[var(--border)] text-[var(--text-primary)] outline-none focus:border-[var(--accent)] font-semibold" />
          </label>
          
          <div className="grid grid-cols-2 gap-4">
            <label className="flex flex-col gap-1">
              <span className="text-xs font-bold text-[var(--text-secondary)] uppercase">Process Type</span>
              <select value={recipeType} onChange={e => setRecipeType(e.target.value as any)} className="p-3 rounded-lg bg-[var(--bg-primary)] border border-[var(--border)] outline-none text-sm">
                <option value="standard">Standard (Tank)</option>
                <option value="large_format">Large Format</option>
                <option value="alternative">Alternative / Plate</option>
              </select>
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-xs font-bold text-[var(--text-secondary)] uppercase">Film Type</span>
              <select value={filmType} onChange={e => setFilmType(e.target.value as any)} className="p-3 rounded-lg bg-[var(--bg-primary)] border border-[var(--border)] outline-none text-sm">
                <option value="B&W">B&W</option>
                <option value="C-41">C-41 (Color Neg)</option>
                <option value="E-6">E-6 (Slide)</option>
              </select>
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-xs font-bold text-[var(--text-secondary)] uppercase">Box ISO</span>
              <input type="number" value={iso} onChange={e => setIso(Number(e.target.value))} className="p-3 rounded-lg bg-[var(--bg-primary)] border border-[var(--border)] font-mono" />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-xs font-bold text-[var(--text-secondary)] uppercase">Base Temp (°C)</span>
              <input type="number" step="0.5" value={baseTemp} onChange={e => setBaseTemp(Number(e.target.value))} className="p-3 rounded-lg bg-[var(--bg-primary)] border border-[var(--border)] font-mono" />
            </label>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center border-b border-[var(--border)] pb-2">
            <h3 className="font-bold text-lg">Process Hierarchy</h3>
            <span className="text-xs bg-[var(--bg-secondary)] px-2 py-1 rounded text-[var(--text-secondary)]">Total: {steps.length}</span>
          </div>
          
          {steps.map((step, idx) => {
            const mins = Math.floor(step.duration_sec / 60);
            const secs = step.duration_sec % 60;
            return (
              <div key={idx} className="card p-4 relative group border-[var(--border)] hover:border-[var(--accent)] transition-all">
                <div className="absolute left-2 top-4 opacity-30 group-hover:opacity-100 cursor-grab"><GripVertical size={20} /></div>
                <div className="pl-6 flex flex-col gap-3">
                  <div className="flex justify-between items-center">
                    <input type="text" value={step.name} onChange={e => updateStep(idx, 'name', e.target.value)}
                      className="text-lg font-bold bg-transparent border-b border-dashed border-[var(--border)] focus:border-[var(--accent)] outline-none text-[var(--text-primary)] w-3/4 pb-1" />
                    {steps.length > 1 && (
                      <button onClick={() => removeStep(idx)} className="text-[var(--danger)] p-2 active:scale-90 opacity-60 hover:opacity-100"><Trash2 size={18} /></button>
                    )}
                  </div>
                  
                  <div className="flex items-end gap-2 mt-2">
                    <label className="flex flex-col flex-1">
                      <span className="text-[10px] text-[var(--text-secondary)] font-bold uppercase mb-1">Time (Min)</span>
                      <input type="number" min="0" value={mins} onChange={e => updateStep(idx, 'duration_sec', parseTimeInput(Number(e.target.value), secs))}
                        className="p-2 rounded bg-[var(--bg-primary)] border border-[var(--border)] font-mono text-center" />
                    </label>
                    <span className="pb-2 font-black">:</span>
                    <label className="flex flex-col flex-1">
                      <span className="text-[10px] text-[var(--text-secondary)] font-bold uppercase mb-1">Time (Sec)</span>
                      <input type="number" min="0" max="59" value={secs} onChange={e => updateStep(idx, 'duration_sec', parseTimeInput(mins, Number(e.target.value)))}
                        className="p-2 rounded bg-[var(--bg-primary)] border border-[var(--border)] font-mono text-center" />
                    </label>
                  </div>
                  
                  <div className="flex items-center gap-2 mt-2 pt-3 border-t border-[var(--border)]">
                    <label className="flex flex-col flex-1">
                      <span className="text-[9px] text-[var(--text-secondary)] font-bold uppercase mb-1">Agitation</span>
                      <select value={step.agitation_type} onChange={e => updateStep(idx, 'agitation_type', e.target.value)} className="p-2 rounded bg-[var(--bg-primary)] border border-[var(--border)] text-xs">
                        <option value="inversion">Inversion (Tank)</option>
                        <option value="continuous">Continuous (Rotary)</option>
                        <option value="tray_shuffle">Tray Shuffle</option>
                      </select>
                    </label>
                    <label className="flex flex-col w-20">
                      <span className="text-[9px] text-[var(--text-secondary)] font-bold uppercase mb-1">Every (Sec)</span>
                      <input type="number" value={step.agitation_interval_sec} onChange={e => updateStep(idx, 'agitation_interval_sec', Number(e.target.value))} className="p-2 rounded bg-[var(--bg-primary)] border border-[var(--border)] text-xs text-center font-mono" />
                    </label>
                  </div>
                </div>
              </div>
            );
          })}
          
          <button onClick={addStep} className="card border-dashed border-2 flex items-center justify-center gap-2 text-[var(--text-secondary)] hover:text-[var(--accent)] hover:border-[var(--accent)] p-6 transition-all font-bold">
            <Plus size={20} /> Add New Step
          </button>
        </div>
      </div>

      <div className="absolute bottom-16 left-0 w-full p-4 bg-gradient-to-t from-[var(--bg-primary)] from-70% to-transparent pointer-events-none">
        <button onClick={handleSave} disabled={!name} className="btn btn-primary w-full disabled:opacity-50 shadow-[0_0_20px_var(--accent)] pointer-events-auto h-14">
          <Save size={20} className="mr-2"/> {editTarget ? 'Update Recipe' : 'Save & Publish'}
        </button>
      </div>
    </div>
  );
}
