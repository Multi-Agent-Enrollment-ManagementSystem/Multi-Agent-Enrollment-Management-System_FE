import type { Campus } from './campus';

export interface Program {
  programId: number;
  programName: string;
  majorName: string;
  enrollmentYear: string;
  description: string;
  careerProspects: string;
  duration: string;
  isActive: boolean;
  campuses: Campus[];
}
