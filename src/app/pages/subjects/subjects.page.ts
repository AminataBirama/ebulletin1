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

  IonInput

} from '@ionic/angular/standalone';

import { addIcons } from 'ionicons';

import {

  addOutline,
  createOutline,
  trashOutline

} from 'ionicons/icons';

import { Subject } from '../../models';
import { SubjectService } from '../../services/subject.service';

@Component({
  selector: 'app-subjects',
  standalone: true,
  templateUrl: './subjects.page.html',
  styleUrls: ['./subjects.page.scss'],
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

    IonInput

  ]
})
export class SubjectsPage implements OnInit {

  subjects: Subject[] = [];

  filteredSubjects: Subject[] = [];

  showModal = false;

  isEditing = false;

  form: Partial<Subject> = this.emptyForm();

  constructor(

    private subjectService: SubjectService,

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
    this.loadSubjects();
  }

  loadSubjects(): void {

    this.subjects = this.subjectService.getAll();

    this.filteredSubjects = [...this.subjects];

  }

  onSearch(event: CustomEvent): void {

    const value = String(event.detail.value ?? '').toLowerCase();

    this.filteredSubjects = value
      ? this.subjectService.search(value)
      : [...this.subjects];

  }

  openAdd(): void {

    this.form = this.emptyForm();

    this.isEditing = false;

    this.showModal = true;

  }

  openEdit(subject: Subject): void {

    this.form = { ...subject };

    this.isEditing = true;

    this.showModal = true;

  }

  closeModal(): void {

    this.showModal = false;

    this.form = this.emptyForm();

  }

  emptyForm(): Partial<Subject> {

    return {

      id: Date.now(),

      code: '',

      libelle: '',

      coefficient: 1

    };

  }

  save(): void {

    if (
      !this.form.code ||
      !this.form.libelle ||
      !this.form.coefficient
    ) {

      this.presentToast(
        'Veuillez remplir tous les champs.',
        'warning'
      );

      return;

    }

    if (this.isEditing) {

      this.subjectService.update(this.form as Subject);

      this.presentToast(
        'Matière modifiée avec succès.'
      );

    } else {

      this.subjectService.add({

        code: this.form.code,

        libelle: this.form.libelle,

        coefficient: this.form.coefficient

      });

      this.presentToast(
        'Matière ajoutée avec succès.'
      );

    }

    this.closeModal();

    this.loadSubjects();

  }

  async confirmDelete(subject: Subject): Promise<void> {

    const alert = await this.alertCtrl.create({

      header: 'Confirmation',

      message: `Supprimer la matière "${subject.libelle}" ?`,

      buttons: [

        {
          text: 'Annuler',
          role: 'cancel'
        },

        {
          text: 'Supprimer',
          role: 'destructive',

          handler: () => {

            this.subjectService.delete(subject.id);

            this.loadSubjects();

            this.presentToast(
              'Matière supprimée.'
            );

          }

        }

      ]

    });

    await alert.present();

  }

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


