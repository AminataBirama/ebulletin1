import { Injectable } from '@angular/core';
import { Subject } from '../models';

@Injectable({
  providedIn: 'root'
})
export class SubjectService {

  private readonly STORAGE_KEY = 'ebulletin_subjects';

  constructor() {}

  // ============================
  // Récupérer toutes les matières
  // ============================
  getAll(): Subject[] {

    const data = localStorage.getItem(this.STORAGE_KEY);

    if (data) {

      return JSON.parse(data);

    }

    const defaults = this.getDefaults();

    this.save(defaults);

    return defaults;

  }

  // ============================
  // Récupérer une matière par ID
  // ============================
  getById(id: number): Subject | undefined {

    return this.getAll().find(subject => subject.id === id);

  }

  // ============================
  // Ajouter une matière
  // ============================
  add(subject: Omit<Subject, 'id'>): Subject {

    const subjects = this.getAll();

    const newSubject: Subject = {

      id: Date.now(),

      ...subject

    };

    subjects.push(newSubject);

    this.save(subjects);

    return newSubject;

  }

  // ============================
  // Modifier une matière
  // ============================
  update(subject: Subject): void {

    const subjects = this.getAll();

    const index = subjects.findIndex(s => s.id === subject.id);

    if (index !== -1) {

      subjects[index] = subject;

      this.save(subjects);

    }

  }

  // ============================
  // Supprimer une matière
  // ============================
  delete(id: number): void {

    const subjects = this.getAll().filter(s => s.id !== id);

    this.save(subjects);

  }

  // ============================
  // Rechercher une matière
  // ============================
  search(term: string): Subject[] {

    term = term.trim().toLowerCase();

    if (!term) {

      return this.getAll();

    }

    return this.getAll().filter(subject =>

      subject.code.toLowerCase().includes(term) ||

      subject.libelle.toLowerCase().includes(term)

    );

  }

  // ============================
  // Réinitialiser les données
  // ============================
  reset(): void {

    this.save(this.getDefaults());

  }

  // ============================
  // Sauvegarder dans LocalStorage
  // ============================
  private save(subjects: Subject[]): void {

    localStorage.setItem(

      this.STORAGE_KEY,

      JSON.stringify(subjects)

    );

  }

  // ============================
  // Données par défaut
  // ============================
  private getDefaults(): Subject[] {

    return [

      {
        id: 1,
        code: 'MATH',
        libelle: 'Mathématiques',
        coefficient: 4
      },

      {
        id: 2,
        code: 'PHYS',
        libelle: 'Physique-Chimie',
        coefficient: 3
      },

      {
        id: 3,
        code: 'FRAN',
        libelle: 'Français',
        coefficient: 4
      },

      {
        id: 4,
        code: 'HIST',
        libelle: 'Histoire-Géographie',
        coefficient: 2
      },

      {
        id: 5,
        code: 'ANGL',
        libelle: 'Anglais',
        coefficient: 3
      },

      {
        id: 6,
        code: 'SVT',
        libelle: 'Sciences de la Vie et de la Terre',
        coefficient: 2
      }

    ];

  }

}