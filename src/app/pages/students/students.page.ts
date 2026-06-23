import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

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
  IonSelectOption

} from '@ionic/angular/standalone';

import { addIcons } from 'ionicons';

import {

  addOutline,
  createOutline,
  trashOutline

} from 'ionicons/icons';

import { Student } from '../../models';
import { StudentService } from '../../services/student.service';

@Component({
  selector: 'app-students',
  standalone: true,
  templateUrl: './students.page.html',
  styleUrls: ['./students.page.scss'],
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
    IonSelectOption

  ]
})

export class StudentsPage implements OnInit {

  students: Student[] = [];

  filteredStudents: Student[] = [];

  showModal = false;

  isEditing = false;

  search = '';

  form: Partial<Student> = this.emptyForm();

  classes = [

    '6ème',

    '5ème',

    '4ème',

    '3ème',

    'Seconde',

    'Première',

    'Terminale A',

    'Terminale D'

  ];

  constructor(

    private studentService: StudentService,

    private alertCtrl: AlertController,

    private toastCtrl: ToastController

  ) {

    addIcons({

      addOutline,

      createOutline,

      trashOutline

    });

  }

  ngOnInit(): void {
    this.loadStudents();
  }

  loadStudents(): void {
    this.students = this.studentService.getAll();
    this.filteredStudents = [...this.students];
  }

  onSearch(event: any): void {

    const value = event.detail.value?.toLowerCase() || '';

    if (value === '') {

      this.filteredStudents = [...this.students];

      return;

    }

    this.filteredStudents = this.students.filter(student =>

      student.nom.toLowerCase().includes(value) ||

      student.prenom.toLowerCase().includes(value) ||

      student.matricule.toLowerCase().includes(value) ||

      student.classe.toLowerCase().includes(value)

    );

  }

  openAdd(): void {

    this.form = this.emptyForm();

    this.isEditing = false;

    this.showModal = true;

  }

  openEdit(student: Student): void {

    this.form = { ...student };

    this.isEditing = true;

    this.showModal = true;

  }

  closeModal(): void {

    this.showModal = false;

    this.form = this.emptyForm();

  }

  emptyForm(): Partial<Student> {

    return {

      id: Date.now(),

      matricule: '',

      nom: '',

      prenom: '',

      dateNaissance: '',

      classe: ''

    };

  }


  save(): void {

    if (
      !this.form.nom ||
      !this.form.prenom ||
      !this.form.matricule ||
      !this.form.classe
    ) {

      this.presentToast('Veuillez remplir tous les champs.');

      return;

    }

    if (this.isEditing) {

      this.studentService.update(this.form as Student);

      this.presentToast('Élève modifié avec succès.');

    } else {

      this.studentService.add(this.form as Student);

      this.presentToast('Élève ajouté avec succès.');

    }

    this.closeModal();

    this.loadStudents();

  }

  async confirmDelete(student: Student): Promise<void> {

    const alert = await this.alertCtrl.create({

      header: 'Confirmation',

      message: `Supprimer ${student.prenom} ${student.nom} ?`,

      buttons: [

        {
          text: 'Annuler',
          role: 'cancel'
        },

        {
          text: 'Supprimer',
          role: 'destructive',

          handler: () => {

            this.studentService.delete(student.id);

            this.loadStudents();

            this.presentToast('Élève supprimé.');

          }

        }

      ]

    });

    await alert.present();

  }

  async presentToast(message: string): Promise<void> {

    const toast = await this.toastCtrl.create({

      message,

      duration: 2000,

      position: 'bottom',

      color: 'success'

    });

    await toast.present();

  }

}
