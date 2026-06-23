import { Injectable } from '@angular/core';

/* ==========================================================
   IMPORTATION DES SERVICES
   ========================================================== */

import { GradeService } from './grade.service';
import { SubjectService } from './subject.service';
import { StudentService } from './student.service';

/* ==========================================================
   IMPORTATION DES MODÈLES
   ========================================================== */

import {

  ReportCard,
  ReportCardLine

} from '../models';

/* ==========================================================
   SERVICE DE GÉNÉRATION DES BULLETINS
   ========================================================== */

@Injectable({

  providedIn: 'root'

})

export class ReportCardService {

  /* ==========================================================
     CONSTRUCTEUR
     ========================================================== */

  constructor(

    private gradeService: GradeService,

    private subjectService: SubjectService,

    private studentService: StudentService

  ) {}

  /* ==========================================================
     GÉNÉRATION D'UN BULLETIN
     ========================================================== */

  /**
   * Génère automatiquement le bulletin
   * d'un élève pour une période.
   */

  generate(

    studentId: number,

    periode: string

  ): ReportCard | null {

    /* ------------------------------
       Recherche de l'élève
       ------------------------------ */

    const student = this.studentService.getById(

      studentId

    );

    if (!student) {

      return null;

    }

    /* ------------------------------
       Récupération des notes
       ------------------------------ */

    const grades =

      this.gradeService.getByStudentAndPeriode(

        studentId,

        periode

      );

    /* ------------------------------
       Liste des matières
       ------------------------------ */

    const subjects =

      this.subjectService.getAll();

    /* ------------------------------
       Lignes du bulletin
       ------------------------------ */

    const lines: ReportCardLine[] = [];

    /* ------------------------------
       Variables de calcul
       ------------------------------ */

    let totalPoints = 0;

    let totalCoefficient = 0;

    /* ------------------------------
       Construction des lignes
       ------------------------------ */

    grades.forEach(grade => {

      const subject = subjects.find(

        s => s.id === grade.subjectId

      );

      if (!subject) {

        return;

      }

      const noteCoeff =

        grade.note *

        subject.coefficient;

      totalPoints += noteCoeff;

      totalCoefficient +=

        subject.coefficient;

      lines.push({

        subject: subject.libelle,

        code: subject.code,

        coefficient:

          subject.coefficient,

        note: grade.note,

        noteCoeff,

        appreciation:

          grade.appreciation ??

          this.getAppreciation(

            grade.note

          )

      });

    });

    /* ------------------------------
       Calcul de la moyenne
       ------------------------------ */

    const moyenne =

      totalCoefficient > 0

        ?

        Number(

          (

            totalPoints /

            totalCoefficient

          ).toFixed(2)

        )

        : 0;

    /* ------------------------------
       Mention
       ------------------------------ */

    const mention =

      this.getMention(

        moyenne

      );

    /* ------------------------------
       Décision
       ------------------------------ */

    const decision =

      this.getDecision(

        moyenne

      );

    /* ------------------------------
       Création du bulletin
       ------------------------------ */

    const bulletin: ReportCard = {

      student:

        `${student.prenom} ${student.nom}`,

      matricule:

        student.matricule,

      classe:

        student.classe,

      periode,

      lines,

      totalCoefficient,

      totalPoints,

      moyenne,

      mention,

      decision

    };

    return bulletin;

  }
    /* ==========================================================
     CALCUL DU RANG DES ÉLÈVES
     ========================================================== */

  /**
   * Retourne le classement des élèves
   * d'une classe pour une période donnée.
   */
  getRanks(

    classe: string,

    periode: string

  ): Map<number, number> {

    // Récupération des élèves de la classe
    const students = this.studentService

      .getAll()

      .filter(student =>

        student.classe === classe

      );

    // Calcul des moyennes
    const averages = students.map(student => ({

      studentId: student.id,

      moyenne:

        this.generate(

          student.id,

          periode

        )?.moyenne ?? 0

    }));

    // Tri décroissant
    averages.sort(

      (a, b) =>

        b.moyenne - a.moyenne

    );

    // Création du classement
    const ranks = new Map<number, number>();

    averages.forEach(

      (student, index) => {

        ranks.set(

          student.studentId,

          index + 1

        );

      }

    );

    return ranks;

  }

  /* ==========================================================
     MENTION
     ========================================================== */

  /**
   * Retourne la mention
   * selon la moyenne générale.
   */
  getMention(

    moyenne: number

  ): string {

    if (moyenne >= 18)

      return 'Excellent';

    if (moyenne >= 16)

      return 'Très Bien';

    if (moyenne >= 14)

      return 'Bien';

    if (moyenne >= 12)

      return 'Assez Bien';

    if (moyenne >= 10)

      return 'Passable';

    return 'Insuffisant';

  }

  /* ==========================================================
     DÉCISION
     ========================================================== */

  /**
   * Détermine la décision
   * du conseil de classe.
   */
  getDecision(

    moyenne: number

  ): string {

    if (moyenne >= 10)

      return 'Admis';

    if (moyenne >= 8)

      return 'Autorisé au rattrapage';

    return 'Redouble';

  }

  /* ==========================================================
     APPRÉCIATION
     ========================================================== */

  /**
   * Retourne l'appréciation
   * d'une matière.
   */
  getAppreciation(

    note: number

  ): string {

    if (note >= 18)

      return 'Excellent';

    if (note >= 16)

      return 'Très Bien';

    if (note >= 14)

      return 'Bien';

    if (note >= 12)

      return 'Assez Bien';

    if (note >= 10)

      return 'Passable';

    if (note >= 8)

      return 'Faible';

    return 'Insuffisant';

  }
    /* ==========================================================
     MOYENNE D'UNE CLASSE
     ========================================================== */

  /**
   * Calcule la moyenne générale
   * d'une classe pour une période donnée.
   */
  getClassAverage(

    classe: string,

    periode: string

  ): number {

    const students = this.studentService

      .getAll()

      .filter(student =>

        student.classe === classe

      );

    if (students.length === 0) {

      return 0;

    }

    let total = 0;

    students.forEach(student => {

      const report = this.generate(

        student.id,

        periode

      );

      total += report?.moyenne ?? 0;

    });

    return Number(

      (total / students.length).toFixed(2)

    );

  }

  /* ==========================================================
     MEILLEUR ÉLÈVE
     ========================================================== */

  /**
   * Retourne le meilleur élève
   * d'une classe.
   */
  getBestStudent(

    classe: string,

    periode: string

  ) {

    const students = this.studentService

      .getAll()

      .filter(student =>

        student.classe === classe

      );

    let bestStudent: any = null;

    let bestAverage = -1;

    students.forEach(student => {

      const report = this.generate(

        student.id,

        periode

      );

      const moyenne = report?.moyenne ?? 0;

      if (moyenne > bestAverage) {

        bestAverage = moyenne;

        bestStudent = {

          student,

          moyenne

        };

      }

    });

    return bestStudent;

  }

  /* ==========================================================
     PLUS FAIBLE MOYENNE
     ========================================================== */

  /**
   * Retourne l'élève ayant
   * la plus faible moyenne.
   */
  getWorstStudent(

    classe: string,

    periode: string

  ) {

    const students = this.studentService

      .getAll()

      .filter(student =>

        student.classe === classe

      );

    let worstStudent: any = null;

    let lowestAverage = 21;

    students.forEach(student => {

      const report = this.generate(

        student.id,

        periode

      );

      const moyenne = report?.moyenne ?? 0;

      if (moyenne < lowestAverage) {

        lowestAverage = moyenne;

        worstStudent = {

          student,

          moyenne

        };

      }

    });

    return worstStudent;

  }

  /* ==========================================================
     STATISTIQUES GÉNÉRALES
     ========================================================== */

  /**
   * Retourne les statistiques
   * d'une classe.
   */
  getStatistics(

    classe: string,

    periode: string

  ) {

    const students = this.studentService

      .getAll()

      .filter(student =>

        student.classe === classe

      );

    const reports = students

      .map(student =>

        this.generate(

          student.id,

          periode

        )

      )

      .filter(report => report !== null);

    return {

      effectif: students.length,

      moyenneClasse:

        this.getClassAverage(

          classe,

          periode

        ),

      meilleur:

        this.getBestStudent(

          classe,

          periode

        ),

      plusFaible:

        this.getWorstStudent(

          classe,

          periode

        ),

      bulletinsGeneres:

        reports.length

    };

  }

  /* ==========================================================
     NOMBRE DE BULLETINS
     ========================================================== */

  /**
   * Retourne le nombre
   * total de bulletins générés.
   */
  getTotalReportCards(

    classe: string,

    periode: string

  ): number {

    return this.studentService

      .getAll()

      .filter(student =>

        student.classe === classe

      )

      .filter(student =>

        this.generate(

          student.id,

          periode

        ) !== null

      )

      .length;

  }

}