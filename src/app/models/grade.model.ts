export interface Grade {
  id: number;
  studentId: number;
  subjectId: number;
  note: number;
  appreciation?: string;
  periode: string;
}