import { useState } from 'react';
import { db, type Recipe } from '../db/db';
import { useNavigate } from 'react-router-dom';
import { Save } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

export default function RecipeEditorScreen() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [baseTemp, setBaseTemp] = useState(20);
  const [iso, setIso] = useState(400);

  const handleSave = async () => {
    if (!name.trim()) return;

    // Standard default template (could be expanded to full step builder later)
    const newRecipe: Recipe = {
      id: uuidv4(),
      name,
      type: "standard",
      film_type: "B&W",
      iso_shot: iso,
      base_temp_c: baseTemp,
      compensation_coefficient: 1.0,
      steps: [
        { name: "Developer", duration_sec: 480, agitation_interval_sec: 60, agitation_duration_sec: 10, agitation_type: "inversion" },
        { name: "Stop Bath", duration_sec: 60, agitation_interval_sec: 0, agitation_duration_sec: 0, agitation_type: "continuous" },
        { name: "Fixer", duration_sec: 300, agitation_interval_sec: 60, agitation_duration_sec: 10, agitation_type: "inversion" },
        { name: "Wash", duration_sec: 600, agitation_interval_sec: 0, agitation_duration_sec: 0, agitation_type: "continuous" }
      ]
    };

    await db.recipes.put(newRecipe);
    navigate('/');
  };

  return (
    <div className="p-4 flex flex-col gap-6 pb-24 h-full">
      <h2 className="text-2xl font-bold border-b border-[var(--border)] pb-2">Create Recipe</h2>

      <div className="flex flex-col gap-4">
        <label className="flex flex-col gap-1">
          <span className="text-sm font-bold text-[var(--text-secondary)] uppercase">Recipe Name</span>
          <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="e.g., Ilford HP5+ in LC29" 
            className="p-3 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--text-primary)] outline-none focus:border-[var(--accent)]" />
        </label>
        
        <div className="flex gap-4">
          <label className="flex flex-col gap-1 flex-1">
            <span className="text-sm font-bold text-[var(--text-secondary)] uppercase">Box ISO</span>
            <input type="number" value={iso} onChange={e => setIso(Number(e.target.value))} 
              className="p-3 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--text-primary)] outline-none focus:border-[var(--accent)]" />
          </label>
          <label className="flex flex-col gap-1 flex-1">
            <span className="text-sm font-bold text-[var(--text-secondary)] uppercase">Target Temp (°C)</span>
            <input type="number" step="0.5" value={baseTemp} onChange={e => setBaseTemp(Number(e.target.value))} 
               className="p-3 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--text-primary)] outline-none focus:border-[var(--accent)]" />
          </label>
        </div>

        <p className="text-xs text-[var(--text-secondary)] mt-4 p-3 border border-[var(--border)] rounded bg-black/20">
          * Currently using a standard 4-step template (Dev, Stop, Fix, Wash). Manual step configuration will be available in the Advanced editor.
        </p>
      </div>

      <div className="mt-auto">
        <button onClick={handleSave} disabled={!name} className="btn btn-primary w-full disabled:opacity-50 flex gap-2">
          <Save size={20} /> Save Recipe
        </button>
        <button onClick={() => navigate('/')} className="btn btn-secondary w-full mt-2">Cancel</button>
      </div>
    </div>
  );
}
