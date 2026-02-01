export interface Course {
  id: string;
  name: string;
  credits: number;
  grade: number;
  color: string;
  partialGrades: PartialGrade[];
  semester: number;
}

export interface PartialGrade {
  id: string;
  name: string;
  weight: number;
  grade: number;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  category: "important" | "casual" | "all";
  date: Date;
  color: string;
}

export interface Student {
  name: string;
  career: string;
  avatar: string;
  semester: number;
}

export type Theme = "light" | "dark";
export type ColorPalette = "indigo" | "emerald" | "rose" | "amber";
