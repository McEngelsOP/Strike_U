"use client";

import { motion } from "framer-motion";
import { useStudent } from "@/lib/student-context";
import type { Course } from "@/lib/types";

interface GroupedCourses {
  [semester: number]: Course[];
}

const getSemesterName = (semester: number): string => {
  const names = [
    "Primer Semestre",
    "Segundo Semestre",
    "Tercer Semestre",
    "Cuarto Semestre",
    "Quinto Semestre",
    "Sexto Semestre",
    "Séptimo Semestre",
    "Octavo Semestre",
    "Noveno Semestre",
    "Décimo Semestre",
  ];
  return names[semester - 1] || `Semestre ${semester}`;
};

const getGradeColor = (grade: number) => {
  if (grade >= 17) return "text-emerald-600";
  if (grade >= 14) return "text-blue-600";
  if (grade >= 11) return "text-amber-600";
  return "text-red-600";
};

export function AllCoursesView() {
  const { courses } = useStudent();

  // Group courses by semester
  const groupedCourses = courses.reduce((acc, course) => {
    if (!acc[course.semester]) {
      acc[course.semester] = [];
    }
    acc[course.semester].push(course);
    return acc;
  }, {} as GroupedCourses);

  // Sort semesters
  const sortedSemesters = Object.keys(groupedCourses)
    .map(Number)
    .sort((a, b) => a - b);

  if (sortedSemesters.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <p className="text-muted-foreground text-center">
          No hay cursos registrados aún
        </p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8 pb-8"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">Todos los Cursos</h2>
        <p className="text-sm text-muted-foreground">
          {courses.length} {courses.length === 1 ? "curso" : "cursos"} en total
        </p>
      </div>

      {sortedSemesters.map((semester, semesterIndex) => {
        const semesterCourses = groupedCourses[semester];
        const totalCredits = semesterCourses.reduce(
          (sum, c) => sum + c.credits,
          0
        );
        const weightedSum = semesterCourses.reduce(
          (sum, c) => sum + c.grade * c.credits,
          0
        );
        const semesterGPA = (weightedSum / totalCredits).toFixed(1);

        return (
          <motion.div
            key={semester}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: semesterIndex * 0.1 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-foreground">
                {getSemesterName(semester)}
              </h3>
              <div className="flex items-center gap-4 text-sm">
                <span className="text-muted-foreground">
                  {totalCredits} créditos
                </span>
                <span className={`font-bold ${getGradeColor(Number(semesterGPA))}`}>
                  Promedio: {semesterGPA}
                </span>
              </div>
            </div>

            <div className="relative">
              <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory">
                {semesterCourses.map((course, index) => (
                  <motion.div
                    key={course.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="flex-shrink-0 w-48 snap-start"
                  >
                    <div
                      className="h-full rounded-[2rem] p-5 shadow-lg cursor-default"
                      style={{ backgroundColor: course.color }}
                    >
                      <div className="space-y-3">
                        <h4 className="font-semibold text-foreground/90 text-sm leading-tight min-h-[2.5rem]">
                          {course.name}
                        </h4>

                        <div className="flex items-baseline gap-1">
                          <span
                            className={`text-3xl font-bold ${getGradeColor(course.grade)}`}
                          >
                            {course.grade}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            / 20
                          </span>
                        </div>

                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">
                            {course.credits}{" "}
                            {course.credits === 1 ? "crédito" : "créditos"}
                          </span>
                          <span className="text-muted-foreground">
                            {course.partialGrades.length}{" "}
                            {course.partialGrades.length === 1
                              ? "parcial"
                              : "parciales"}
                          </span>
                        </div>

                        <div className="pt-2 border-t border-foreground/10">
                          <div className="text-xs text-muted-foreground space-y-1">
                            {course.partialGrades.map((pg) => (
                              <div
                                key={pg.id}
                                className="flex justify-between items-center"
                              >
                                <span className="truncate max-w-[100px]">
                                  {pg.name}
                                </span>
                                <span className="font-medium">
                                  {pg.grade} ({pg.weight}%)
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Gradient fade on right side for scroll indicator */}
              <div className="absolute top-0 right-0 bottom-4 w-12 bg-gradient-to-l from-background to-transparent pointer-events-none" />
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
