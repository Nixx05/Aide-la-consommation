import type { NovaGroup, NutriScore } from '../types/product';
import type { Level } from '../utils/nutrition';

export const colors = {
  primary: '#1F8A4C',
  primaryLight: '#E7F5EC',
  background: '#F6F7F5',
  surface: '#FFFFFF',
  text: '#1B1F1C',
  textMuted: '#6A726C',
  border: '#E2E5E1',
  danger: '#C6372D',
  warning: '#E08A00',
};

/** Couleurs officielles du Nutri-Score */
export const nutriScoreColors: Record<NutriScore, string> = {
  a: '#038141',
  b: '#85BB2F',
  c: '#FECB02',
  d: '#EE8100',
  e: '#E63E11',
};

export const novaColors: Record<NovaGroup, string> = {
  1: '#00AA00',
  2: '#FFCC00',
  3: '#FF6600',
  4: '#FF0000',
};

export const levelColors: Record<Level, string> = {
  low: '#1F8A4C',
  moderate: '#E08A00',
  high: '#C6372D',
};

export const spacing = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24 };
export const radius = { sm: 6, md: 12, lg: 20 };
