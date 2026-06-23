import { Injectable } from '@angular/core';
import { Movie } from '../models';

/* ==========================================================
   SERVICE DE GESTION DES FILMS
   ========================================================== */

@Injectable({
  providedIn: 'root'
})

export class MovieService {

  /* ==========================================================
     CLÉ LOCALSTORAGE
     ========================================================== */

  private readonly STORAGE_KEY = 'ebulletin_movies';

  constructor() {}

  /* ==========================================================
     RÉCUPÉRER TOUS LES FILMS
     ========================================================== */

  getAll(): Movie[] {

    const data = localStorage.getItem(this.STORAGE_KEY);

    // Premier lancement de l'application
    if (!data) {

      const defaults = this.getDefaults();

      this.save(defaults);

      return defaults;

    }

    return JSON.parse(data);

  }

  /* ==========================================================
     RECHERCHER UN FILM PAR ID
     ========================================================== */

  getById(id: number): Movie | undefined {

    return this.getAll().find(

      movie => movie.id === id

    );

  }
    /* ==========================================================
     AJOUTER UN FILM
     ========================================================== */

  add(movie: Omit<Movie, 'id'>): Movie {

    const movies = this.getAll();

    const newMovie: Movie = {

      id: Date.now(),

      ...movie

    };

    movies.push(newMovie);

    this.save(movies);

    return newMovie;

  }

  /* ==========================================================
     MODIFIER UN FILM
     ========================================================== */

  update(movie: Movie): void {

    const movies = this.getAll();

    const index = movies.findIndex(

      m => m.id === movie.id

    );

    if (index !== -1) {

      movies[index] = movie;

      this.save(movies);

    }

  }

  /* ==========================================================
     SUPPRIMER UN FILM
     ========================================================== */

  delete(id: number): void {

    const movies = this.getAll()

      .filter(movie => movie.id !== id);

    this.save(movies);

  }

  /* ==========================================================
     RECHERCHE
     ========================================================== */

  search(term: string): Movie[] {

    term = term.toLowerCase();

    return this.getAll().filter(movie =>

      movie.titre.toLowerCase().includes(term)

      ||

      movie.genre.toLowerCase().includes(term)

      ||

      movie.description.toLowerCase().includes(term)

    );

  }
    /* ==========================================================
     SAUVEGARDE
     ========================================================== */

  private save(movies: Movie[]): void {

    localStorage.setItem(

      this.STORAGE_KEY,

      JSON.stringify(movies)

    );

  }

  /* ==========================================================
     RÉINITIALISER LA LISTE
     ========================================================== */

  reset(): void {

    this.save(this.getDefaults());

  }

  /* ==========================================================
     FILMS PAR DÉFAUT
     ========================================================== */

  private getDefaults(): Movie[] {

    return [

      {
        id: 1,
        titre: 'Black Panther',
        description: 'Le roi du Wakanda protège son royaume.',
        genre: 'Action',
        annee: 2018,
        duree: 134,
        image: 'assets/movies/black-panther.jpg'
      },

      {
        id: 2,
        titre: 'Avatar',
        description: 'Une aventure sur Pandora.',
        genre: 'Science-Fiction',
        annee: 2009,
        duree: 162,
        image: 'assets/movies/avatar.jpg'
      },

      {
        id: 3,
        titre: 'Fast & Furious',
        description: 'Courses automobiles et action.',
        genre: 'Action',
        annee: 2021,
        duree: 145,
        image: 'assets/movies/fast-furious.jpg'
      },

      {
        id: 4,
        titre: 'The Lion King',
        description: 'Le destin du jeune Simba.',
        genre: 'Animation',
        annee: 2019,
        duree: 118,
        image: 'assets/movies/lion-king.jpg'
      }

    ];

  }

}