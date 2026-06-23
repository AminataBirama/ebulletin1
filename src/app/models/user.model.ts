export type UserRole = 'admin' | 'enseignant' | 'eleve';

export interface User {
  id: number;
  username: string;
  password: string;
  role: UserRole;
  nom: string;
  prenom: string;
  studentId?: number;
}