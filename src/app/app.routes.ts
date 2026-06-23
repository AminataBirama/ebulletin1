import { Routes } from '@angular/router';

export const routes: Routes = [

  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },

  {
    path: 'dashboard',
    loadComponent: () =>
      import('./pages/dashboard/dashboard.page').then(m => m.DashboardPage)
  },

  {
    path: 'students',
    loadComponent: () =>
      import('./pages/students/students.page').then(m => m.StudentsPage)
  },

  {
    path: 'subjects',
    loadComponent: () =>
      import('./pages/subjects/subjects.page').then(m => m.SubjectsPage)
  },

  {
    path: 'grades',
    loadComponent: () =>
      import('./pages/grades/grades.page').then(m => m.GradesPage)
  },

  {
    path: 'report-cards',
    loadComponent: () =>
      import('./pages/report-cards/report-cards.page').then(m => m.ReportCardsPage)
  },

  {
    path: 'movies',
    loadComponent: () =>
      import('./pages/movies/movies.page').then(m => m.MoviesPage)
  },

  {
    path: '**',
    redirectTo: 'dashboard'
  }

];