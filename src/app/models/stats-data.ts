export interface StatsData {
  [key: string]: StatsPeriode | undefined; // Signature d'index
  semaine: StatsPeriode;
  mois: StatsPeriode;
  total: StatsPeriode;
}

interface StatsPeriode {
  moyenne_entrainements: number;
  moyenne_examens: number;
  meilleure_note: number;
  nombre_entrainements: number;
  nombre_examens: number;
  entrainements?: { date: string; score: number }[]; // Ajout optionnel pour les données du graphique
  examens?: { date: string; score: number }[]; // Ajout optionnel pour les données du graphique
}