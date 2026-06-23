import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

import {
  IonApp,
  IonSplitPane,
  IonMenu,
  IonContent,
  IonList,
  IonListHeader,
  IonNote,
  IonMenuToggle,
  IonItem,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonRouterLink
} from '@ionic/angular/standalone';

import { addIcons } from 'ionicons';

import {
  homeOutline,
  homeSharp,
  peopleOutline,
  peopleSharp,
  bookOutline,
  bookSharp,
  documentTextOutline,
  documentTextSharp,
  schoolOutline,
  schoolSharp,
  filmOutline,
  filmSharp
} from 'ionicons/icons';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
    IonApp,
    IonSplitPane,
    IonMenu,
    IonContent,
    IonList,
    IonListHeader,
    IonNote,
    IonMenuToggle,
    IonItem,
    IonIcon,
    IonLabel,
    IonRouterLink,
    IonRouterOutlet
  ]
})
export class AppComponent {

  appPages = [

    {
      title: 'Dashboard',
      url: '/dashboard',
      icon: 'home'
    },

    {
      title: 'Élèves',
      url: '/students',
      icon: 'people'
    },

    {
      title: 'Matières',
      url: '/subjects',
      icon: 'book'
    },

    {
      title: 'Notes',
      url: '/grades',
      icon: 'document-text'
    },

    {
      title: 'Bulletins',
      url: '/report-cards',
      icon: 'school'
    },

    {
      title: 'Movies',
      url: '/movies',
      icon: 'film'
    }

  ];

  constructor() {

    addIcons({

      homeOutline,
      homeSharp,

      peopleOutline,
      peopleSharp,

      bookOutline,
      bookSharp,

      documentTextOutline,
      documentTextSharp,

      schoolOutline,
      schoolSharp,

      filmOutline,
      filmSharp

    });

  }

}