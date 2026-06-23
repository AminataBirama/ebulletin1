import { Component, OnInit } from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

/* ==========================================================
   IMPORTS IONIC
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

  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,

  IonSearchbar,

  IonFab,
  IonFabButton,

  IonModal,

  IonInput,

  IonTextarea,

  IonSelect,
  IonSelectOption

} from '@ionic/angular/standalone';

/* ==========================================================
   ICÔNES
   ========================================================== */

import { addIcons } from 'ionicons';

import {

  addOutline,
  createOutline,
  trashOutline

} from 'ionicons/icons';

/* ==========================================================
   MODÈLE ET SERVICE
   ========================================================== */

import { Movie } from '../../models';

import { MovieService } from '../../services/movie.service';

/* ==========================================================
   COMPOSANT
   ========================================================== */

@Component({

  selector: 'app-movies',

  standalone: true,

  templateUrl: './movies.page.html',

  styleUrls: ['./movies.page.scss'],

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

    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,

    IonSearchbar,

    IonFab,
    IonFabButton,

    IonModal,

    IonInput,
    IonTextarea,

    IonSelect,
    IonSelectOption

  ]

})

export class MoviesPage implements OnInit {

  /* ==========================================================
     DONNÉES
     ========================================================== */

  movies: Movie[] = [];

  filteredMovies: Movie[] = [];

  showModal = false;

  isEditing = false;

  form: Partial<Movie> = this.emptyForm();

  genres = [

    'Action',

    'Animation',

    'Aventure',

    'Comédie',

    'Drame',

    'Fantastique',

    'Science-Fiction',

    'Romance',

    'Horreur'

  ];

  /* ==========================================================
     CONSTRUCTEUR
     ========================================================== */

  constructor(

    private movieService: MovieService,

    private alertCtrl: AlertController,

    private toastCtrl: ToastController

  ) {

    addIcons({

      addOutline,

      createOutline,

      trashOutline

    });

  }

  /* ==========================================================
     INITIALISATION
     ========================================================== */

  ngOnInit(): void {

    this.loadMovies();

  }

  /* ==========================================================
     CHARGER LES FILMS
     ========================================================== */

  loadMovies(): void {

    this.movies = this.movieService.getAll();

    this.filteredMovies = [...this.movies];

  }
  /* ==========================================================
     RECHERCHE
     ========================================================== */

  /**
   * Recherche un film par son titre,
   * son genre ou sa description.
   */
  onSearch(event: any): void {

    const value = event.detail.value?.trim().toLowerCase() || '';

    if (!value) {

      this.filteredMovies = [...this.movies];

      return;

    }

    this.filteredMovies = this.movieService.search(value);

  }

  /* ==========================================================
     FORMULAIRE VIDE
     ========================================================== */

  /**
   * Initialise un formulaire vide.
   */
  emptyForm(): Partial<Movie> {

    return {

      id: Date.now(),

      titre: '',

      description: '',

      genre: '',

      annee: new Date().getFullYear(),

      duree: 90,

      image: ''

    };

  }

  /* ==========================================================
     AJOUTER UN FILM
     ========================================================== */

  /**
   * Ouvre le formulaire en mode ajout.
   */
  openAdd(): void {

    this.form = this.emptyForm();

    this.isEditing = false;

    this.showModal = true;

  }

  /* ==========================================================
     MODIFIER UN FILM
     ========================================================== */

  /**
   * Ouvre le formulaire avec les
   * informations du film sélectionné.
   */
  openEdit(movie: Movie): void {

    this.form = {

      ...movie

    };

    this.isEditing = true;

    this.showModal = true;

  }

  /* ==========================================================
     FERMER LE MODAL
     ========================================================== */

  /**
   * Ferme la fenêtre modale.
   */
  closeModal(): void {

    this.showModal = false;

    this.form = this.emptyForm();

  }
    /* ==========================================================
     ENREGISTRER
     ========================================================== */

  /**
   * Ajoute ou modifie un film.
   */
  save(): void {

    if (

      !this.form.titre ||

      !this.form.genre ||

      !this.form.description ||

      !this.form.annee ||

      !this.form.duree

    ) {

      this.presentToast(

        'Veuillez remplir tous les champs.',

        'warning'

      );

      return;

    }

    if (this.isEditing) {

      this.movieService.update(

        this.form as Movie

      );

      this.presentToast(

        'Film modifié avec succès.'

      );

    }

    else {

      this.movieService.add({

        titre: this.form.titre,

        description: this.form.description,

        genre: this.form.genre,

        annee: this.form.annee,

        duree: this.form.duree,

        image: this.form.image || ''

      });

      this.presentToast(

        'Film ajouté avec succès.'

      );

    }

    this.closeModal();

    this.loadMovies();

  }

  /* ==========================================================
     SUPPRIMER
     ========================================================== */

  /**
   * Demande une confirmation avant
   * la suppression d'un film.
   */
  async confirmDelete(movie: Movie): Promise<void> {

    const alert = await this.alertCtrl.create({

      header: 'Confirmation',

      message:

        `Supprimer "${movie.titre}" ?`,

      buttons: [

        {

          text: 'Annuler',

          role: 'cancel'

        },

        {

          text: 'Supprimer',

          role: 'destructive',

          handler: () => {

            this.movieService.delete(

              movie.id

            );

            this.loadMovies();

            this.presentToast(

              'Film supprimé.'

            );

          }

        }

      ]

    });

    await alert.present();

  }

  /* ==========================================================
     TOAST
     ========================================================== */

  /**
   * Affiche un message de notification.
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