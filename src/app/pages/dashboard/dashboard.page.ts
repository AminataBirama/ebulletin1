import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

/* =====================================================
   IMPORTATION DES COMPOSANTS IONIC
===================================================== */

import {

  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,

  IonButtons,
  IonMenuButton,

  IonGrid,
  IonRow,
  IonCol,

  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,

  IonList,
  IonItem,
  IonLabel,
  IonBadge,

  IonIcon

} from '@ionic/angular/standalone';

/* =====================================================
   IMPORTATION DES ICÔNES
===================================================== */

import { addIcons } from 'ionicons';

import {

  peopleOutline,
  bookOutline,
  documentTextOutline,
  filmOutline,
  schoolOutline,
  trophyOutline,
  statsChartOutline

} from 'ionicons/icons';

/* =====================================================
   IMPORTATION DES SERVICES
===================================================== */

import { StudentService } from '../../services/student.service';
import { SubjectService } from '../../services/subject.service';
import { GradeService } from '../../services/grade.service';
import { MovieService } from '../../services/movie.service';

/* =====================================================
   IMPORTATION DES MODÈLES
===================================================== */

import {

  Student,
  Grade

} from '../../models';

/* =====================================================
   COMPOSANT DASHBOARD
===================================================== */

@Component({

  selector: 'app-dashboard',

  standalone: true,

  templateUrl: './dashboard.page.html',

  styleUrls: ['./dashboard.page.scss'],

  imports: [

    CommonModule,

    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,

    IonButtons,
    IonMenuButton,

    IonGrid,
    IonRow,
    IonCol,

    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardSubtitle,
    IonCardContent,

    IonList,
    IonItem,
    IonLabel,
    IonBadge,

    IonIcon

  ]

})

export class DashboardPage implements OnInit {

  /* =====================================================
     STATISTIQUES
  ===================================================== */

  totalStudents = 0;

  totalSubjects = 0;

  totalGrades = 0;

  totalMovies = 0;

  totalReportCards = 0;

  averageGrade = 0;

  bestStudent = 'Aucun';

  bestAverage = 0;

  recentStudents: Student[] = [];

  /* =====================================================
     CONSTRUCTEUR
  ===================================================== */

  constructor(

    private studentService: StudentService,

    private subjectService: SubjectService,

    private gradeService: GradeService,

    private movieService: MovieService

  ) {

    addIcons({

      peopleOutline,

      bookOutline,

      documentTextOutline,

      filmOutline,

      schoolOutline,

      trophyOutline,

      statsChartOutline

    });

  }
  /* =====================================================
   INITIALISATION
===================================================== */

  ngOnInit(): void {

    this.loadDashboard();

  }

  /* =====================================================
     CHARGEMENT DES STATISTIQUES
  ===================================================== */

  loadDashboard(): void {

    const students = this.studentService.getAll();

    const grades = this.gradeService.getAll();

    this.totalStudents = students.length;

    this.totalSubjects = this.subjectService.getAll().length;

    this.totalGrades = grades.length;

    this.totalMovies = this.movieService.getAll().length;

    // un bulletin par élève
    this.totalReportCards = students.length;

    // derniers élèves ajoutés
    this.recentStudents = students.slice(-5).reverse();

    this.calculateAverage(grades);

    this.calculateBestStudent(students, grades);

  }
  /* =====================================================
     CALCUL DE LA MOYENNE GÉNÉRALE
  ===================================================== */

  private calculateAverage(grades: Grade[]): void {

    if (grades.length === 0) {

      this.averageGrade = 0;

      return;

    }

    const somme = grades.reduce(

      (total, grade) => total + grade.note,

      0

    );

    this.averageGrade = Number(

      (somme / grades.length).toFixed(2)

    );

  }

  /* =====================================================
     RECHERCHE DU MEILLEUR ÉLÈVE
  ===================================================== */

  private calculateBestStudent(

    students: Student[],

    grades: Grade[]

  ): void {

    let meilleureMoyenne = 0;

    students.forEach(student => {

      const notes = grades.filter(

        grade => grade.studentId === student.id

      );

      if (notes.length === 0) {

        return;

      }

      const moyenne =

        notes.reduce(

          (total, grade) => total + grade.note,

          0

        ) / notes.length;

      if (moyenne > meilleureMoyenne) {

        meilleureMoyenne = moyenne;

        this.bestAverage = Number(

          moyenne.toFixed(2)

        );

        this.bestStudent =

          `${student.prenom} ${student.nom}`;

      }

    });

  }

}