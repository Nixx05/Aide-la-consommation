// Couleurs et tailles utilisées dans toute l'application.
// Les changer ici les change partout (équivalent de style.css dans le projet web).

export const colors = {
  primary: '#1F8A4C', // vert NutriChoix
  primaryDark: '#14633A',
  primaryLight: '#E7F5EC',
  background: '#F6F7F5',
  white: '#FFFFFF',
  text: '#1B1F1C',
  textMuted: '#6A726C',
  border: '#E2E5E1',
  red: '#C6372D',
  redLight: '#FDECEA',
  orange: '#E08A00',
};

// Couleurs officielles du Nutri-Score
export const nutriScoreColors = {
  a: '#038141',
  b: '#85BB2F',
  c: '#FECB02',
  d: '#EE8100',
  e: '#E63E11',
};

// Couleurs du groupe NOVA (1 = brut, 4 = ultra-transformé)
export const novaColors = {
  1: '#00AA00',
  2: '#FFCC00',
  3: '#FF6600',
  4: '#FF0000',
};

// Largeur max du contenu sur ordinateur (sinon tout est étiré)
export const MAX_WIDTH = 760;

// Ombre légère pour les cartes
export const shadow = {
  shadowColor: '#000',
  shadowOpacity: 0.06,
  shadowRadius: 8,
  shadowOffset: { width: 0, height: 2 },
  elevation: 2,
};
