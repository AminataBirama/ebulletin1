import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

/* ==========================================================
   IMPORTATION DES COMPOSANTS IONIC
   ========================================================== */

import {

  AlertController,
  ToastController,

  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,

  IonButtons,
  IonMenuButton,

  IonButton,
  IonIcon,

  IonList,
  IonItem,
  IonLabel,

  IonSearchbar,

  IonFab,
  IonFabButton,

  IonModal,

  IonInput,

  IonSelect,
  IonSelectOption,

  /* ===== Nouveaux composants ===== */

  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,

  IonBadge

} from '@ionic/angular/standalone';

/* ==========================================================
   IMPORTATION DES ICÔNES
   ========================================================== */

import { addIcons } from 'ionicons';

import {

  addOutline,
  createOutline,
  trashOutline

} from 'ionicons/icons';

/* ==========================================================
   IMPORTATION DES MODÈLES
   ========================================================== */

import {

  Grade,
  Student,
  Subject

} from '../../models';

/* ==========================================================
   IMPORTATION DES SERVICES
   ========================================================== */

import { GradeService } from '../../services/grade.service';
import { StudentService } from '../../services/student.service';
import { SubjectService } from '../../services/subject.service';

/* ==========================================================
   DÉCLARATION DU COMPOSANT
   ========================================================== */

@Component({

  selector: 'app-grades',

  standalone: true,

  templateUrl: './grades.page.html',

  styleUrls: ['./grades.page.scss'],

  imports: [

    CommonModule,

    FormsModule,

    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,

    IonButtons,
    IonMenuButton,

    IonButton,
    IonIcon,

    IonList,
    IonItem,
    IonLabel,

    IonSearchbar,

    IonFab,
    IonFabButton,

    IonModal,

    IonInput,

    IonSelect,
    IonSelectOption,

    /* ===== Nouveaux composants ===== */

    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardSubtitle,
    IonCardContent,

    IonBadge

  ]

})

export class GradesPage implements OnInit {

  /* ==========================================================
     DONNÉES PRINCIPALES
     ========================================================== */

  // Toutes les notes enregistrées
  grades: Grade[] = [];

  // Liste filtrée utilisée pour la recherche
  filteredGrades: Grade[] = [];

  // Tous les élèves
  students: Student[] = [];

  // Toutes les matières
  subjects: Subject[] = [];

  /* ==========================================================
     INTERFACE UTILISATEUR
     ========================================================== */

  // Ouvre/Ferme la fenêtre Modale
  showModal = false;

  // Détermine si on modifie une note
  isEditing = false;

  // Objet utilisé par le formulaire
  form: Partial<Grade> = this.emptyForm();

  // Liste des périodes disponibles
  periodes = [

    'Trimestre 1',

    'Trimestre 2',

    'Trimestre 3'

  ];

  /* ==========================================================
     CONSTRUCTEUR
     ========================================================== */

  constructor(

    private gradeService: GradeService,

    private studentService: StudentService,

    private subjectService: SubjectService,

    private alertCtrl: AlertController,

    private toastCtrl: ToastController

  ) {

    // Enregistrement des icônes utilisées
    addIcons({

      addOutline,

      createOutline,

      trashOutline

    });

  }

  /* ==========================================================
     INITIALISATION DE LA PAGE
     ========================================================== */

  ngOnInit(): void {

    this.loadData();

  }

  /* ==========================================================
     CHARGEMENT DES DONNÉES
     ========================================================== */

  loadData(): void {

    // Chargement des élèves
    this.students = this.studentService.getAll();

    // Chargement des matières
    this.subjects = this.subjectService.getAll();

    // Chargement des notes
    this.grades = this.gradeService.getAll();

    // Tri décroissant (les plus récentes en premier)
    this.grades.sort(

      (a, b) => b.id - a.id

    );

    // Copie utilisée par la recherche
    this.filteredGrades = [...this.grades];

  }
    /* ==========================================================
     RECHERCHE DES NOTES
     ========================================================== */

  /**
   * Recherche une note par :
   * - Nom de l'élève
   * - Nom de la matière
   * - Période
   */
  onSearch(event: any): void {

    const value = event.detail.value?.trim().toLowerCase() || '';

    // Si le champ est vide, on réaffiche tout
    if (!value) {

      this.filteredGrades = [...this.grades];

      return;

    }

    this.filteredGrades = this.grades.filter(grade =>

      this.getStudentName(grade.studentId)
        .toLowerCase()
        .includes(value)

      ||

      this.getSubjectName(grade.subjectId)
        .toLowerCase()
        .includes(value)

      ||

      grade.periode
        .toLowerCase()
        .includes(value)

    );

  }

  /* ==========================================================
     FORMULAIRE VIDE
     ========================================================== */

  /**
   * Initialise un formulaire vide
   * avant l'ajout d'une nouvelle note.
   */
  emptyForm(): Partial<Grade> {

    return {

      id: Date.now(),

      studentId: 0,

      subjectId: 0,

      note: 0,

      periode: ''

    };

  }

  /* ==========================================================
     AJOUT D'UNE NOTE
     ========================================================== */

  /**
   * Ouvre le formulaire
   * en mode ajout.
   */
  openAdd(): void {

    this.form = this.emptyForm();

    this.isEditing = false;

    this.showModal = true;

  }

  /* ==========================================================
     MODIFICATION D'UNE NOTE
     ========================================================== */

  /**
   * Ouvre le formulaire
   * avec les données existantes.
   */
  openEdit(grade: Grade): void {

    this.form = {

      ...grade

    };

    this.isEditing = true;

    this.showModal = true;

  }

  /* ==========================================================
     FERMETURE DU MODAL
     ========================================================== */

  /**
   * Ferme la fenêtre
   * et réinitialise le formulaire.
   */
  closeModal(): void {

    this.showModal = false;

    this.form = this.emptyForm();

  }

  /* ==========================================================
     NOM COMPLET DE L'ÉLÈVE
     ========================================================== */

  /**
   * Retourne le nom complet
   * d'un élève à partir de son ID.
   */
  getStudentName(studentId: number): string {

    const student = this.students.find(

      s => s.id === studentId

    );

    return student

      ? `${student.nom} ${student.prenom}`

      : 'Élève inconnu';

  }

  /* ==========================================================
     NOM DE LA MATIÈRE
     ========================================================== */

  /**
   * Retourne le nom
   * d'une matière à partir de son ID.
   */
  getSubjectName(subjectId: number): string {

    const subject = this.subjects.find(

      s => s.id === subjectId

    );

    return subject

      ? subject.libelle

      : 'Matière inconnue';

  }
  /* ==========================================================
     ENREGISTRER UNE NOTE
     ========================================================== */

  /**
   * Ajoute ou modifie une note.
   * Cette méthode effectue toutes les validations
   * avant l'enregistrement.
   */
  save(): void {

    /* =============================
       Vérification des champs
       ============================= */

    if (

      !this.form.studentId ||

      !this.form.subjectId ||

      this.form.note === undefined ||

      !this.form.periode

    ) {

      this.presentToast(

        'Veuillez remplir tous les champs.',

        'warning'

      );

      return;

    }

    /* =============================
       Vérification numérique
       ============================= */

    if (isNaN(Number(this.form.note))) {

      this.presentToast(

        'La note doit être un nombre.',

        'danger'

      );

      return;

    }

    /* =============================
       Vérification de l'intervalle
       ============================= */

    if (

      Number(this.form.note) < 0 ||

      Number(this.form.note) > 20

    ) {

      this.presentToast(

        'La note doit être comprise entre 0 et 20.',

        'danger'

      );

      return;

    }

    /* =============================
       Vérification des doublons
       ============================= */

    if (!this.isEditing) {

      const exists = this.grades.find(g =>

        g.studentId === this.form.studentId &&

        g.subjectId === this.form.subjectId &&

        g.periode === this.form.periode

      );

      if (exists) {

        this.presentToast(

          'Une note existe déjà pour cet élève, cette matière et cette période.',

          'danger'

        );

        return;

      }

    }

    /* =============================
       Modification
       ============================= */

    if (this.isEditing) {

      this.gradeService.update(

        this.form as Grade

      );

      this.presentToast(

        'Note modifiée avec succès.'

      );

    }

    /* =============================
       Ajout
       ============================= */

    else {

      this.gradeService.add({

        studentId: this.form.studentId,

        subjectId: this.form.subjectId,

        note: Number(this.form.note),

        periode: this.form.periode

      });

      this.presentToast(

        'Note ajoutée avec succès.'

      );

    }

    /* =============================
       Rafraîchissement
       ============================= */

    this.closeModal();

    this.loadData();

  }

  /* ==========================================================
     SUPPRESSION
     ========================================================== */

  /**
   * Demande une confirmation
   * avant de supprimer une note.
   */
  async confirmDelete(

    grade: Grade

  ): Promise<void> {

    const alert = await this.alertCtrl.create({

      header: 'Confirmation',

      message:

        `Voulez-vous supprimer la note de ${this.getStudentName(grade.studentId)} ?`,

      buttons: [

        {

          text: 'Annuler',

          role: 'cancel'

        },

        {

          text: 'Supprimer',

          role: 'destructive',

          handler: () => {

            this.gradeService.delete(

              grade.id

            );

            this.loadData();

            this.presentToast(

              'Note supprimée.'

            );

          }

        }

      ]

    });

    await alert.present();

  }

  /* ==========================================================
     RÉINITIALISATION
     ========================================================== */

  /**
   * Supprime toutes les notes.
   * Utile pendant les tests.
   */
  resetGrades(): void {

    this.gradeService.reset();

    this.loadData();

    this.presentToast(

      'Toutes les notes ont été supprimées.',

      'warning'

    );

  }

  /* ==========================================================
     TOAST
     ========================================================== */

  /**
   * Affiche un message à l'utilisateur.
   */
  async presentToast(

    message: string,

    color: 'success' | 'warning' | 'danger' = 'success'

  ): Promise<void> {

    const toast = await this.toastCtrl.create({

      message,

      duration: 2000,

      position: 'bottom',

      color

    });

    await toast.present();

  }

}