export interface MDCRecord {
  id: string;
  film_brand: string;
  film_name: string;
  iso: number;
  developer: string;
  dilution: string;
  temp_c: number;
  dev_time_mins: number;
  dev_time_secs: number;
  notes?: string;
}

// A curated offline subset mimicking the Massive Dev Chart
export const mdcDatabase: MDCRecord[] = [
  // --- KODAK ---
  { id: 'k-tx-d76-1', film_brand: 'Kodak', film_name: 'Tri-X 400', iso: 400, developer: 'D-76', dilution: 'Stock', temp_c: 20, dev_time_mins: 6, dev_time_secs: 45 },
  { id: 'k-tx-d76-2', film_brand: 'Kodak', film_name: 'Tri-X 400', iso: 400, developer: 'D-76', dilution: '1+1', temp_c: 20, dev_time_mins: 9, dev_time_secs: 45 },
  { id: 'k-tx-hc110', film_brand: 'Kodak', film_name: 'Tri-X 400', iso: 400, developer: 'HC-110', dilution: 'Dil B', temp_c: 20, dev_time_mins: 4, dev_time_secs: 30 },
  { id: 'k-tx-rod', film_brand: 'Kodak', film_name: 'Tri-X 400', iso: 400, developer: 'Rodinal', dilution: '1+50', temp_c: 20, dev_time_mins: 13, dev_time_secs: 0 },
  
  { id: 'k-tm4-tmd', film_brand: 'Kodak', film_name: 'T-Max 400', iso: 400, developer: 'T-MAX Dev', dilution: '1+4', temp_c: 20, dev_time_mins: 6, dev_time_secs: 0 },
  { id: 'k-tm4-d76', film_brand: 'Kodak', film_name: 'T-Max 400', iso: 400, developer: 'D-76', dilution: '1+1', temp_c: 20, dev_time_mins: 10, dev_time_secs: 15 },
  { id: 'k-tm1-d76', film_brand: 'Kodak', film_name: 'T-Max 100', iso: 100, developer: 'D-76', dilution: '1+1', temp_c: 20, dev_time_mins: 9, dev_time_secs: 30 },
  
  // --- ILFORD ---
  { id: 'i-hp5-ilf', film_brand: 'Ilford', film_name: 'HP5 Plus', iso: 400, developer: 'Ilfosol 3', dilution: '1+9', temp_c: 20, dev_time_mins: 6, dev_time_secs: 30 },
  { id: 'i-hp5-hc110', film_brand: 'Ilford', film_name: 'HP5 Plus', iso: 400, developer: 'HC-110', dilution: 'Dil B', temp_c: 20, dev_time_mins: 5, dev_time_secs: 0 },
  { id: 'i-hp5-ddx', film_brand: 'Ilford', film_name: 'HP5 Plus', iso: 400, developer: 'Ilfotec DD-X', dilution: '1+4', temp_c: 20, dev_time_mins: 9, dev_time_secs: 0 },
  { id: 'i-hp5-id11', film_brand: 'Ilford', film_name: 'HP5 Plus', iso: 400, developer: 'ID-11', dilution: 'Stock', temp_c: 20, dev_time_mins: 7, dev_time_secs: 30 },
  
  { id: 'i-fp4-id11', film_brand: 'Ilford', film_name: 'FP4 Plus', iso: 125, developer: 'ID-11', dilution: '1+1', temp_c: 20, dev_time_mins: 11, dev_time_secs: 0 },
  { id: 'i-fp4-rod', film_brand: 'Ilford', film_name: 'FP4 Plus', iso: 125, developer: 'Rodinal', dilution: '1+25', temp_c: 20, dev_time_mins: 9, dev_time_secs: 0 },

  // --- FOMAPAN ---
  { id: 'f-100-rod', film_brand: 'Foma', film_name: 'Fomapan 100', iso: 100, developer: 'Rodinal', dilution: '1+50', temp_c: 20, dev_time_mins: 8, dev_time_secs: 0, notes: 'Foma 100 responds brilliantly to Rodinal.' },
  { id: 'f-400-hc110', film_brand: 'Foma', film_name: 'Fomapan 400', iso: 400, developer: 'HC-110', dilution: 'Dil B', temp_c: 20, dev_time_mins: 5, dev_time_secs: 30 },
  { id: 'f-400-d76', film_brand: 'Foma', film_name: 'Fomapan 400', iso: 400, developer: 'D-76', dilution: 'Stock', temp_c: 20, dev_time_mins: 7, dev_time_secs: 0 },

  // --- KENTMERE ---
  { id: 'ke-400-d76', film_brand: 'Kentmere', film_name: 'Pan 400', iso: 400, developer: 'D-76', dilution: 'Stock', temp_c: 20, dev_time_mins: 8, dev_time_secs: 0 },
  { id: 'ke-100-rod-st', film_brand: 'Kentmere', film_name: 'Pan 100', iso: 100, developer: 'Rodinal', dilution: '1+100', temp_c: 20, dev_time_mins: 60, dev_time_secs: 0, notes: 'Stand Development: Initial agitation for 30s, then leave completely still for 59 mins.' },
  
  // --- AGFA ---
  { id: 'a-apx-rod', film_brand: 'Agfa', film_name: 'APX 100 (New)', iso: 100, developer: 'Rodinal', dilution: '1+50', temp_c: 20, dev_time_mins: 13, dev_time_secs: 0 },
  { id: 'a-apx-hc', film_brand: 'Agfa', film_name: 'APX 400 (New)', iso: 400, developer: 'HC-110', dilution: 'Dil B', temp_c: 20, dev_time_mins: 7, dev_time_secs: 0 },

  // --- C-41 COLOR STANDARD (Universal) ---
  { id: 'color-k-por-400', film_brand: 'Kodak / C-41', film_name: 'Portra 400', iso: 400, developer: 'C-41 Kit', dilution: 'Standard', temp_c: 39, dev_time_mins: 3, dev_time_secs: 15, notes: 'C-41 is standardized. Developer must be exactly 39C.' },
  { id: 'color-f-sup-400', film_brand: 'Fuji / C-41', film_name: 'Superia X-TRA 400', iso: 400, developer: 'C-41 Kit', dilution: 'Standard', temp_c: 39, dev_time_mins: 3, dev_time_secs: 15, notes: 'C-41 is standardized. Developer must be exactly 39C.' },
  { id: 'color-c-800t-push1', film_brand: 'Cinestill / C-41', film_name: '800T', iso: 1600, developer: 'C-41 Kit (+1 Push)', dilution: 'Standard', temp_c: 39, dev_time_mins: 4, dev_time_secs: 15, notes: 'Push 1 Stop in C-41 (+1:00 min)' },

]
