import Dexie, { type Table } from 'dexie';
import { z } from 'zod';

export const stepSchema = z.object({
  name: z.string(),
  duration_sec: z.number().min(0),
  agitation_interval_sec: z.number().min(0),
  agitation_duration_sec: z.number().min(0),
  agitation_type: z.enum(['inversion', 'continuous', 'tray_shuffle']).optional().default('inversion')
});

export const recipeSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.enum(['standard', 'large_format', 'alternative']),
  film_type: z.enum(['B&W', 'C-41', 'E-6']),
  iso_shot: z.number(),
  base_temp_c: z.number(),
  compensation_coefficient: z.number().optional().default(1.0),
  steps: z.array(stepSchema),
  linked_tips: z.array(z.string()).optional()
});

export type Recipe = z.infer<typeof recipeSchema>;
export type Step = z.infer<typeof stepSchema>;

export interface Log {
  id?: string;
  recipe_id: string;
  timestamp: string;
  actual_temp_c: number;
  adjusted_dev_time_sec?: number;
  tags: string[];
  notes: string;
  agitation_misses: number; // For QA tracking in logs
}

export class FilmDevDB extends Dexie {
  recipes!: Table<Recipe, string>;
  logs!: Table<Log, string>;

  constructor() {
    super('FilmDevTimerDB');
    this.version(1).stores({
      recipes: 'id, type, film_type',
      logs: '++id, recipe_id, timestamp'
    });
  }
}

export const db = new FilmDevDB();
