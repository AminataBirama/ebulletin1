import { Injectable } from '@angular/core';
import { Grade } from '../models';

@Injectable({
  providedIn: 'root'
})
export class GradeService {

  /**
   * Clé utilisée pour stocker les notes
   * dans le LocalStorage.
   */
  private readonly STORAGE_KEY = 'ebulletin_grades';

  constructor() { }

  // =====================================================
  // RÉCUPÉRER TOUTES LES NOTES
  // =====================================================

  /**
   * Retourne toutes les notes enregistrées.
   * Si aucune note n'existe, retourne un tableau vide.
   */
  getAll(): Grade[] {

    const data = localStorage.getItem(this.STORAGE_KEY);

    return data ? JSON.parse(data) : [];

  }

  // =====================================================
  // RECHERCHE
  // =====================================================

  /**
   * Retourne une note à partir de son identifiant.
   */
  getById(id: number): Grade | undefined {

    return this.getAll().find(

      grade => grade.id === id

    );

  }

  /**
   * Retourne toutes les notes
   * d'un élève.
   */
  getByStudent(studentId: number): Grade[] {

    return this.getAll().filter(

      grade => grade.studentId === studentId

    );

  }

  /**
   * Retourne toutes les notes
   * d'un élève pour une période.
   */
  getByStudentAndPeriode(

    studentId: number,

    periode: string

  ): Grade[] {

    return this.getAll().filter(

      grade =>

        grade.studentId === studentId &&

        grade.periode === periode

    );

  }

  /**
   * Recherche une note.
   * Ici la recherche se fait sur la période.
   * (Exemple : Semestre 1, Trimestre 2...)
   */
  search(term: string): Grade[] {

    term = term.trim().toLowerCase();

    if (!term) {

      return this.getAll();

    }

    return this.getAll().filter(

      grade =>

        grade.periode.toLowerCase().includes(term)

    );

  }

  // =====================================================
  // AJOUT
  // =====================================================

  /**
   * Ajoute une nouvelle note.
   * Un identifiant unique est généré automatiquement.
   */
  add(grade: Omit<Grade, 'id'>): Grade {

    const grades = this.getAll();

    const newGrade: Grade = {

      id: Date.now(),

      ...grade

    };

    grades.push(newGrade);

    this.save(grades);

    return newGrade;

  }

  // =====================================================
  // MODIFICATION
  // =====================================================

  /**
   * Modifie une note existante.
   */
  update(grade: Grade): void {

    const grades = this.getAll();

    const index = grades.findIndex(

      g => g.id === grade.id

    );

    if (index !== -1) {

      grades[index] = grade;

      this.save(grades);

    }

  }

  // =====================================================
  // SUPPRESSION
  // =====================================================

  /**
   * Supprime une note.
   */
  delete(id: number): void {

    const grades = this.getAll().filter(

      grade => grade.id !== id

    );

    this.save(grades);

  }

  // =====================================================
  // RÉINITIALISATION
  // =====================================================

  /**
   * Supprime toutes les notes.
   * Très pratique pendant les tests.
   */
  reset(): void {

    localStorage.removeItem(this.STORAGE_KEY);

  }

  // =====================================================
  // SAUVEGARDE
  // =====================================================

  /**
   * Sauvegarde les données
   * dans le LocalStorage.
   */
  private save(grades: Grade[]): void {

    localStorage.setItem(

      this.STORAGE_KEY,

      JSON.stringify(grades)

    );

  }

}