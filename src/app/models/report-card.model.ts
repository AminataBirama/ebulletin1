/* ==========================================================
   LIGNE DU BULLETIN
   Représente une matière dans le bulletin
   ========================================================== */

export interface ReportCardLine {

  // Nom de la matière
  subject: string;

  // Code de la matière
  code: string;

  // Coefficient
  coefficient: number;

  // Note obtenue
  note: number;

  // Note × coefficient
  noteCoeff: number;

  // Appréciation de la matière
  appreciation: string;

}

/* ==========================================================
   BULLETIN SCOLAIRE
   ========================================================== */

export interface ReportCard {

  // Élève
  student: string;

  // Matricule
  matricule: string;

  // Classe
  classe: string;

  // Période
  periode: string;

  // Liste des matières
  lines: ReportCardLine[];

  // Somme des coefficients
  totalCoefficient: number;

  // Somme des notes pondérées
  totalPoints: number;

  // Moyenne générale
  moyenne: number;

  // Mention
  mention: string;

  // Décision
  decision: string;

  // Rang de l'élève
  rang?: number;

}