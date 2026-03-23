import Dexie, { type Table } from 'dexie';

export interface Step {
  name: string;
  duration_sec: number;
  agitation_interval_sec: number;
  agitation_duration_sec: number;
  agitation_type: 'inversion' | 'continuous' | 'tray_shuffle';
}

export interface Recipe {
  id: string;
  name: string;
  type: 'standard' | 'large_format' | 'alternative';
  film_type: 'B&W' | 'C-41' | 'E-6';
  iso_shot: number;
  base_temp_c: number;
  compensation_coefficient: number;
  steps: Step[];
  linked_tips?: string[];
}

export interface DevLog {
  id: string;
  date: number;
  recipe_id: string;
  recipe_name: string;
  actual_temp_c: number | null;
  notes: string;
  scans?: string[]; // Base64 encoded WebP/JPEG images
}

export class FilmDevDB extends Dexie {
  recipes!: Table<Recipe, string>;
  logs!: Table<DevLog, string>;

  constructor() {
    super('FilmDevDB');
    // Bumped version to 2 to support logbook
    this.version(2).stores({
      recipes: 'id, name, film_type, type',
      logs: 'id, date, recipe_id'
    });
  }
}

export const db = new FilmDevDB();
