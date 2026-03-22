import React, { useState } from 'react';
import { db, recipeSchema } from '../db/db';
import { z } from 'zod';
import { DownloadCloud, UploadCloud, Trash2 } from 'lucide-react';

export default function SettingsScreen() {
  const [msg, setMsg] = useState("");

  const handleExport = async () => {
    try {
      const recipes = await db.recipes.toArray();
      const logs = await db.logs.toArray();
      const dataStr = JSON.stringify({ recipes, logs }, null, 2);
      const blob = new Blob([dataStr], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement("a");
      link.href = url;
      link.download = `filmdev_backup_${new Date().toISOString().split('T')[0]}.json`;
      link.click();
      URL.revokeObjectURL(url);
      setMsg("Data exported securely!");
    } catch (e) {
      setMsg("Error exporting data.");
    }
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const rawJson = JSON.parse(text);

      if (rawJson.recipes && Array.isArray(rawJson.recipes)) {
        // Robust Validation leveraging Zod schema designed earlier (Security consideration)
        const parsedRecipes = z.array(recipeSchema).parse(rawJson.recipes);
        
        await db.transaction('rw', db.recipes, async () => {
          await db.recipes.bulkPut(parsedRecipes);
        });
        setMsg(`Imported ${parsedRecipes.length} recipes securely.`);
      } else {
        throw new Error("Invalid format.");
      }
    } catch (err) {
      console.error(err);
      setMsg("Import failed! Unrecognized or tampered data format.");
    }
    
    // reset input
    e.target.value = "";
  };

  const handleClearDb = async () => {
    if (confirm("Are you entirely sure you want to clear your local database? All custom recipes will be permanently lost.")) {
      await db.recipes.clear();
      await db.logs.clear();
      setMsg("Database fully cleared.");
    }
  }

  return (
    <div className="p-4 flex flex-col gap-6">
      <h2 className="text-xl font-bold mb-2">Settings & Data</h2>
      
      <div className="card flex flex-col gap-4">
        <h3 className="font-semibold text-lg text-[var(--accent)] border-b border-[var(--border)] pb-2 mb-2">Data Management</h3>
        
        <p className="text-sm text-[var(--text-secondary)]">Since this application runs entirely locally offline, your data belongs to you. Make sure to back it up before clearing cache.</p>
        
        <button onClick={handleExport} className="btn btn-secondary flex gap-2">
          <DownloadCloud /> Export Backup (.json)
        </button>
        
        <label className="btn btn-secondary flex gap-2 cursor-pointer items-center justify-center">
          <UploadCloud /> Import Backup
          <input type="file" accept=".json" onChange={handleImport} className="hidden" />
        </label>

        <button onClick={handleClearDb} className="btn flex gap-2 mt-4 bg-[var(--bg-primary)] border border-[var(--danger)] text-[var(--danger)] shadow-none">
          <Trash2 size={20} /> Clear Database
        </button>
      </div>

      {msg && (
        <div className="px-4 py-3 bg-[var(--bg-secondary)] border border-[var(--success)] text-[var(--success)] rounded-lg text-sm text-center transition-all animate-in fade-in zoom-in slide-in-from-bottom">
          {msg}
        </div>
      )}
    </div>
  );
}
