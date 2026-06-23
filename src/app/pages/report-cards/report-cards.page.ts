import { Component, OnInit } from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

/* ==========================================================
   IMPORTATION DES COMPOSANTS IONIC
   ========================================================== */

import {

  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,

  IonButtons,
  IonMenuButton,

  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,

  IonItem,
  IonLabel,

  IonSelect,
  IonSelectOption,

  IonButton,

  IonList,

  IonGrid,
  IonRow,
  IonCol

} from '@ionic/angular/standalone';

/* ==========================================================
   IMPORTATION DES MODÈLES
   ========================================================== */

import {

  Student,
  ReportCard

} from '../../models';

/* ==========================================================
   IMPORTATION DES SERVICES
   ========================================================== */

import { StudentService } from '../../services/student.service';

import { ReportCardService } from '../../services/report-card.service';

/* ==========================================================
   COMPOSANT
   ========================================================== */

@Component({

  selector: 'app-report-cards',

  standalone: true,

  templateUrl: './report-cards.page.html',

  styleUrls: ['./report-cards.page.scss'],

  imports: [

    CommonModule,

    FormsModule,

    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,

    IonButtons,
    IonMenuButton,

    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,

    IonItem,
    IonLabel,

    IonSelect,
    IonSelectOption,

    IonButton,

    IonList,

    IonGrid,
    IonRow,
    IonCol

  ]

})

export class ReportCardsPage implements OnInit {

  /* ==========================================================
     LISTE DES ÉLÈVES
     ========================================================== */

  students: Student[] = [];

  /* ==========================================================
     BULLETIN GÉNÉRÉ
     ========================================================== */

  reportCard: ReportCard | null = null;

  /* ==========================================================
     ÉLÈVE SÉLECTIONNÉ
     ========================================================== */

  selectedStudent = 0;

  /* ==========================================================
     PÉRIODE
     ========================================================== */

  selectedPeriode = 'Trimestre 1';

  periodes = [

    'Trimestre 1',

    'Trimestre 2',

    'Trimestre 3'

  ];

  /* ==========================================================
     CONSTRUCTEUR
     ========================================================== */

  constructor(

    private studentService: StudentService,

    private reportCardService: ReportCardService

  ) { }

  /* ==========================================================
     INITIALISATION
     ========================================================== */

  ngOnInit(): void {

    this.students =

      this.studentService.getAll();

  }
  /* ==========================================================
   GÉNÉRATION DU BULLETIN
   ========================================================== */

  /**
   * Génère le bulletin de l'élève sélectionné
   * pour la période choisie.
   */
  generateReportCard(): void {

    if (!this.selectedStudent) {

      this.reportCard = null;

      return;

    }

    this.reportCard = this.reportCardService.generate(

      this.selectedStudent,

      this.selectedPeriode

    );

    // Calcul du rang
    if (this.reportCard) {

      const student = this.studentService.getById(

        this.selectedStudent

      );

      if (student) {

        const ranks = this.reportCardService.getRanks(

          student.classe,

          this.selectedPeriode

        );

        this.reportCard.rang =

          ranks.get(student.id);

      }

    }

  }

  /* ==========================================================
     RÉINITIALISER
     ========================================================== */

  /**
   * Vide le bulletin affiché.
   */
  clearReportCard(): void {

    this.reportCard = null;

    this.selectedStudent = 0;

    this.selectedPeriode = 'Trimestre 1';

  }

  /* ==========================================================
     IMPRESSION
     ========================================================== */

  /**
   * Impression du bulletin.
   */
  printReportCard(): void {

    window.print();

  }
  /* ==========================================================
   EXPORT PDF
   ========================================================== */

  /**
   * Fonction préparée pour un futur export PDF.
   */
  downloadPdf(): void {

    console.log(

      'Export PDF à implémenter.'

    );

  }

  /* ==========================================================
     NOM DE L'ÉLÈVE
     ========================================================== */

  /**
   * Retourne le nom complet d'un élève.
   */
  getStudentName(id: number): string {

    const student = this.students.find(

      s => s.id === id

    );

    return student

      ? `${student.prenom} ${student.nom}`

      : '';

  }

  /* ==========================================================
     CLASSE DE L'ÉLÈVE
     ========================================================== */

  /**
   * Retourne la classe d'un élève.
   */
  getStudentClass(id: number): string {

    const student = this.students.find(

      s => s.id === id

    );

    return student

      ? student.classe

      : '';

  }

}