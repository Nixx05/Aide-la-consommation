// Couleurs utilisées dans toute l'application (équivalent de style.css dans le projet web).

export const colors = {
  green: '#1F8A4C', // vert NutriChoix
  darkGreen: '#14633A',
  lightGreen: '#E7F5EC',
  background: '#F6F7F5',
  white: '#FFFFFF',
  text: '#1B1F1C',
  grey: '#6A726C',
  border: '#E2E5E1',
  red: '#C6372D',
};

// Couleurs officielles du Nutri-Score (comme .nutriscore[data-score="a"] dans style.css)
export const nutriScoreColors: { [score: string]: string } = {
  a: '#038141',
  b: '#85BB2F',
  c: '#FECB02',
  d: '#EE8100',
  e: '#E63E11',
};
