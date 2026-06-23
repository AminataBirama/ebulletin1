import { Injectable } from '@angular/core';
import { Student } from '../models';

@Injectable({
  providedIn: 'root'
})
export class StudentService {

  private readonly STORAGE_KEY = 'ebulletin_students';

  constructor() { }

  // Retourner tous les élèves
  getAll(): Student[] {
    const data = localStorage.getItem(this.STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  }

  // Retourner un élève par son id
  getById(id: number): Student | undefined {
    return this.getAll().find(student => student.id === id);
  }

  // Ajouter un élève
  add(student: Omit<Student, 'id'>): Student {

    const students = this.getAll();

    const newStudent: Student = {
      id: Date.now(),
      ...student
    };

    students.push(newStudent);

    this.save(students);

    return newStudent;
  }

  // Modifier
  update(student: Student): void {

    const students = this.getAll();

    const index = students.findIndex(s => s.id === student.id);

    if (index !== -1) {

      students[index] = student;

      this.save(students);

    }

  }

  // Supprimer
  delete(id: number): void {

    const students = this.getAll().filter(s => s.id !== id);

    this.save(students);

  }

  // Recherche
  search(query: string): Student[] {

    const q = query.toLowerCase();

    return this.getAll().filter(student =>

      student.nom.toLowerCase().includes(q) ||

      student.prenom.toLowerCase().includes(q) ||

      student.matricule.toLowerCase().includes(q) ||

      student.classe.toLowerCase().includes(q)

    );

  }

  // Sauvegarde
  private save(students: Student[]): void {

    localStorage.setItem(

      this.STORAGE_KEY,

      JSON.stringify(students)

    );

  }

}