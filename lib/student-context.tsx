"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import type { Course, Note, Student, Theme, ColorPalette } from "./types";

interface StudentContextType {
  student: Student;
  setStudent: (student: Student) => void;
  courses: Course[];
  setCourses: (courses: Course[]) => void;
  notes: Note[];
  setNotes: (notes: Note[]) => void;
  colorPalette: ColorPalette;
  setColorPalette: (palette: ColorPalette) => void;
  currentSemester: number;
  setCurrentSemester: (semester: number) => void;
}

const StudentContext = createContext<StudentContextType | undefined>(undefined);

const pastelColors = [
  "bg-pastel-pink",
  "bg-pastel-blue",
  "bg-pastel-green",
  "bg-pastel-yellow",
  "bg-pastel-purple",
  "bg-pastel-orange",
  "bg-pastel-cyan",
  "bg-pastel-rose",
];

const initialCourses: Course[] = [
  {
    id: "1",
    name: "Ingrese nombre del curso",
    credits: 4,
    grade: 0,
    color: pastelColors[0],
    semester: 1,
    partialGrades: [
      { id: "1", name: "Parcial 1", weight: 0, grade: 0 },
      { id: "2", name: "Parcial 2", weight:0, grade: 0 },
      { id: "3", name: "Final", weight: 0, grade: 0 },
    ]
  },

];

const initialNotes: Note[] = [
  {
    id: "1",
    title: "Fórmulas de Cálculo",
    content: "Derivadas e integrales importantes para el examen final",
    category: "important",
    date: new Date(),
    color: pastelColors[0],
  },
  {
    id: "2",
    title: "Reunión de equipo",
    content: "Proyecto de programación - Lunes 3pm",
    category: "important",
    date: new Date(),
    color: pastelColors[1],
  },
  {
    id: "3",
    title: "Ideas para el proyecto",
    content: "App de gestión de tareas con React Native",
    category: "casual",
    date: new Date(Date.now() - 86400000),
    color: pastelColors[2],
  },
  {
    id: "4",
    title: "Libros por leer",
    content: "Clean Code, The Pragmatic Programmer",
    category: "casual",
    date: new Date(Date.now() - 172800000),
    color: pastelColors[3],
  },
  {
    id: "5",
    title: "Entrega de tarea",
    content: "Álgebra Lineal - Matrices inversas - Viernes",
    category: "important",
    date: new Date(Date.now() + 86400000),
    color: pastelColors[4],
  },
];

export function StudentProvider({ children }: { children: ReactNode }) {
  const [student, setStudent] = useState<Student>({
    name: "Nombre/Apodo?",
    career: "Carrera?",
    avatar: "/placeholder.svg?height=80&width=80",
    semester: 1,
  });
  const [courses, setCourses] = useState<Course[]>(initialCourses);
  const [notes, setNotes] = useState<Note[]>(initialNotes);
  const [colorPalette, setColorPalette] = useState<ColorPalette>("indigo");
  const [currentSemester, setCurrentSemester] = useState(1);

  useEffect(() => {
    const root = document.documentElement;
    if (colorPalette === "amber") {
      // Opción 2: Paleta personalizada (Tonos Café Cálidos - Modo Claro)
      root.style.setProperty("--background", "#fdfbf7"); // Fondo crema muy suave
      root.style.setProperty("--foreground", "#4a3b32"); // Texto marrón oscuro
      root.style.setProperty("--card", "#ffffff"); // Tarjetas blancas
      root.style.setProperty("--card-foreground", "#4a3b32");
      root.style.setProperty("--popover", "#ffffff");
      root.style.setProperty("--popover-foreground", "#4a3b32");
      root.style.setProperty("--primary", "#7b5f48"); // Marrón cálido (tu color principal)
      root.style.setProperty("--primary-foreground", "#ffffff");
      root.style.setProperty("--secondary", "#f4efe9"); // Beige suave para elementos secundarios
      root.style.setProperty("--secondary-foreground", "#4a3b32");
      root.style.setProperty("--muted", "#f4efe9");
      root.style.setProperty("--muted-foreground", "#8d7f76");
      root.style.setProperty("--accent", "#f4efe9");
      root.style.setProperty("--accent-foreground", "#5d4037");
      root.style.setProperty("--border", "#e6e0da");
      root.style.setProperty("--input", "#e6e0da");
      root.style.setProperty("--ring", "#7b5f48");
      root.style.setProperty("--chart-1", "#d6c4b8"); // Beige cálido
      root.style.setProperty("--chart-2", "#c4d6b8"); // Verde salvia suave
      root.style.setProperty("--chart-3", "#d6b8c4"); // Rosa terracota suave
    } else {
      // Opción 1: Tema Claro Original (Reset)
      root.style.removeProperty("--background");
      root.style.removeProperty("--foreground");
      root.style.removeProperty("--card");
      root.style.removeProperty("--card-foreground");
      root.style.removeProperty("--popover");
      root.style.removeProperty("--popover-foreground");
      root.style.removeProperty("--primary");
      root.style.removeProperty("--primary-foreground");
      root.style.removeProperty("--secondary");
      root.style.removeProperty("--secondary-foreground");
      root.style.removeProperty("--muted");
      root.style.removeProperty("--muted-foreground");
      root.style.removeProperty("--accent");
      root.style.removeProperty("--accent-foreground");
      root.style.removeProperty("--border");
      root.style.removeProperty("--input");
      root.style.removeProperty("--ring");
      root.style.removeProperty("--chart-1");
      root.style.removeProperty("--chart-2");
      root.style.removeProperty("--chart-3");
    }
  }, [colorPalette]);

  return (
    <StudentContext.Provider
      value={{
        student,
        setStudent,
        courses,
        setCourses,
        notes,
        setNotes,
        colorPalette,
        setColorPalette,
        currentSemester,
        setCurrentSemester,
      }}
    >
      {children}
    </StudentContext.Provider>
  );
}

export function useStudent() {
  const context = useContext(StudentContext);
  if (context === undefined) {
    throw new Error("useStudent must be used within a StudentProvider");
  }
  return context;
}
