"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, X, Trash2 } from "lucide-react";
import { useStudent } from "@/lib/student-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Course, PartialGrade } from "@/lib/types";

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

const getGradeColor = (grade: number) => {
  if (grade >= 17) return "text-emerald-600";
  if (grade >= 14) return "text-blue-600";
  if (grade >= 11) return "text-amber-600";
  return "text-red-600";
};

export function CoursesGrid() {
  const { courses, setCourses, currentSemester } = useStudent();
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [isAddingCourse, setIsAddingCourse] = useState(false);
  const [newCourse, setNewCourse] = useState({
    name: "",
    credits: 3,
    partialGrades: [{ id: "1", name: "Parcial 1", weight: 100, grade: 0 }],
  });
  const [validationError, setValidationError] = useState<string>("");

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (selectedCourse) {
          setSelectedCourse(null);
          setValidationError("");
        }
        if (isAddingCourse) {
          setIsAddingCourse(false);
          setNewCourse({
            name: "",
            credits: 3,
            partialGrades: [{ id: "1", name: "Parcial 1", weight: 100, grade: 0 }],
          });
          setValidationError("");
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedCourse, isAddingCourse]);

  const semesterCourses = courses.filter((c) => c.semester === currentSemester);

  const validateCourse = (course: Course): string => {
    const totalWeight = course.partialGrades.reduce(
      (sum, pg) => sum + pg.weight,
      0
    );
    
    if (totalWeight > 100) {
      return "El porcentaje total no puede superar el 100%";
    }

    for (const pg of course.partialGrades) {
      if (pg.grade < 0 || pg.grade > 20) {
        return "Las notas deben estar entre 0 y 20";
      }
    }

    return "";
  };

  const handleSaveCourse = () => {
    if (selectedCourse) {
      const error = validateCourse(selectedCourse);
      if (error) {
        setValidationError(error);
        return;
      }
      setCourses(
        courses.map((c) => (c.id === selectedCourse.id ? selectedCourse : c))
      );
      setValidationError("");
      setSelectedCourse(null);
    }
  };

  const handleAddPartialGrade = () => {
    if (selectedCourse) {
      const newPartial: PartialGrade = {
        id: Date.now().toString(),
        name: `Parcial ${selectedCourse.partialGrades.length + 1}`,
        weight: 0,
        grade: 0,
      };
      setSelectedCourse({
        ...selectedCourse,
        partialGrades: [...selectedCourse.partialGrades, newPartial],
      });
    }
  };

  const handleUpdatePartialGrade = (
    id: string,
    field: keyof PartialGrade,
    value: string | number
  ) => {
    if (selectedCourse) {
      let numValue = Number(value);
      
      // Validar notas entre 0 y 20
      if (field === "grade") {
        numValue = Math.max(0, Math.min(20, numValue));
      }
      
      // Validar peso entre 0 y 100
      if (field === "weight") {
        numValue = Math.max(0, Math.min(100, numValue));
      }

      const updatedGrades = selectedCourse.partialGrades.map((pg) =>
        pg.id === id ? { ...pg, [field]: field === "name" ? value : numValue } : pg
      );
      
      const totalWeight = updatedGrades.reduce((sum, pg) => sum + pg.weight, 0);
      const totalGrade = updatedGrades.reduce(
        (acc, pg) => acc + (pg.grade * pg.weight) / 100,
        0
      );
      
      setSelectedCourse({
        ...selectedCourse,
        partialGrades: updatedGrades,
        grade: totalWeight > 0 ? Math.round(totalGrade) : 0,
      });
      
      // Limpiar error de validación si se corrige
      if (validationError) {
        setValidationError("");
      }
    }
  };

  const handleDeletePartialGrade = (id: string) => {
    if (selectedCourse && selectedCourse.partialGrades.length > 1) {
      setSelectedCourse({
        ...selectedCourse,
        partialGrades: selectedCourse.partialGrades.filter((pg) => pg.id !== id),
      });
    }
  };

  const handleCreateCourse = () => {
    const totalWeight = newCourse.partialGrades.reduce(
      (sum, pg) => sum + pg.weight,
      0
    );
    const totalGrade = newCourse.partialGrades.reduce(
      (acc, pg) => acc + (pg.grade * pg.weight) / 100,
      0
    );
    
    const course: Course = {
      id: Date.now().toString(),
      name: newCourse.name,
      credits: newCourse.credits,
      grade: totalWeight > 0 ? Math.round(totalGrade) : 0,
      color: pastelColors[semesterCourses.length % pastelColors.length],
      partialGrades: newCourse.partialGrades,
      semester: currentSemester,
    };
    
    setCourses([...courses, course]);
    setNewCourse({
      name: "",
      credits: 3,
      partialGrades: [{ id: "1", name: "Parcial 1", weight: 100, grade: 0 }],
    });
    setValidationError("");
    setIsAddingCourse(false);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="space-y-4"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">Mis Cursos</h2>
          <Button
            variant="outline"
            size="sm"
            className="rounded-full bg-transparent"
            onClick={() => setIsAddingCourse(true)}
          >
            <Plus className="w-4 h-4 mr-1" />
            Agregar
          </Button>
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
                whileHover={{ scale: 1.03, y: -5 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedCourse(course)}
              >
                <div
                  className="h-full rounded-[2rem] p-5 shadow-lg cursor-pointer"
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
          {semesterCourses.length > 0 && (
            <div className="absolute top-0 right-0 bottom-4 w-12 bg-gradient-to-l from-background to-transparent pointer-events-none" />
          )}
        </div>
      </motion.div>

      {/* Course Edit Modal */}
      <AnimatePresence>
        {selectedCourse && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-40"
              onClick={() => setSelectedCourse(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 50 }}
              className="fixed inset-x-4 top-1/2 -translate-y-1/2 md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-lg bg-card rounded-[2.5rem] p-6 shadow-2xl z-50 max-h-[80vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-foreground">
                  {selectedCourse.name}
                </h3>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full"
                  onClick={() => setSelectedCourse(null)}
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col items-center justify-center bg-muted rounded-2xl p-4">
                    <span className="text-xs text-muted-foreground mb-1">
                      Promedio
                    </span>
                    <span className="text-2xl font-bold text-primary">
                      {selectedCourse.grade}
                    </span>
                  </div>
                  <div className="flex flex-col items-center justify-center bg-muted rounded-2xl p-4">
                    <span className="text-xs text-muted-foreground mb-1">
                      Créditos
                    </span>
                    <Input
                      type="number"
                      value={selectedCourse.credits}
                      onChange={(e) =>
                        setSelectedCourse({
                          ...selectedCourse,
                          credits: Math.max(1, Math.min(10, Number(e.target.value))),
                        })
                      }
                      className="text-center text-xl font-bold rounded-xl w-16 h-10 p-0"
                      min={1}
                      max={10}
                    />
                  </div>
                </div>
                
                {validationError && (
                  <div className="bg-destructive/10 text-destructive text-sm rounded-xl p-3 text-center">
                    {validationError}
                  </div>
                )}

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-foreground font-medium">
                      Notas Parciales
                    </Label>
                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-full bg-transparent"
                      onClick={handleAddPartialGrade}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>

                  {selectedCourse.partialGrades.map((pg) => (
                    <motion.div
                      key={pg.id}
                      layout
                      className="bg-muted rounded-2xl p-4 space-y-3"
                    >
                      <div className="flex items-center gap-2">
                        <Input
                          value={pg.name}
                          onChange={(e) =>
                            handleUpdatePartialGrade(
                              pg.id,
                              "name",
                              e.target.value
                            )
                          }
                          className="flex-1 rounded-xl"
                          placeholder="Nombre"
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          className="rounded-full text-destructive"
                          onClick={() => handleDeletePartialGrade(pg.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label className="text-xs text-muted-foreground">
                            Nota (0-20)
                          </Label>
                          <Input
                            type="number"
                            value={pg.grade}
                            onChange={(e) =>
                              handleUpdatePartialGrade(
                                pg.id,
                                "grade",
                                Number(e.target.value)
                              )
                            }
                            className="rounded-xl"
                            min={0}
                            max={20}
                            step={0.1}
                          />
                        </div>
                        <div>
                          <Label className="text-xs text-muted-foreground">
                            Peso (%)
                          </Label>
                          <Input
                            type="number"
                            value={pg.weight}
                            onChange={(e) =>
                              handleUpdatePartialGrade(
                                pg.id,
                                "weight",
                                Number(e.target.value)
                              )
                            }
                            className="rounded-xl"
                            min={0}
                            max={100}
                            step={1}
                          />
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground text-center">
                        Peso total: {selectedCourse.partialGrades.reduce((sum, p) => sum + p.weight, 0)}%
                      </div>
                    </motion.div>
                  ))}
                </div>

                <Button
                  className="w-full rounded-2xl"
                  onClick={handleSaveCourse}
                >
                  Guardar Cambios
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Add Course Modal */}
      <AnimatePresence>
        {isAddingCourse && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-40"
              onClick={() => setIsAddingCourse(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 50 }}
              className="fixed inset-x-4 top-1/2 -translate-y-1/2 md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-lg bg-card rounded-[2.5rem] p-6 shadow-2xl z-50"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-foreground">
                  Nuevo Curso
                </h3>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full"
                  onClick={() => setIsAddingCourse(false)}
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <div className="space-y-4">
                <div>
                  <Label className="text-foreground">Nombre del Curso</Label>
                  <Input
                    value={newCourse.name}
                    onChange={(e) =>
                      setNewCourse({ ...newCourse, name: e.target.value })
                    }
                    className="rounded-xl mt-1"
                    placeholder="Ej: Cálculo IV"
                  />
                </div>
                <div>
                  <Label className="text-foreground">Créditos</Label>
                  <Input
                    type="number"
                    value={newCourse.credits}
                    onChange={(e) =>
                      setNewCourse({
                        ...newCourse,
                        credits: Number(e.target.value),
                      })
                    }
                    className="rounded-xl mt-1"
                    min={1}
                    max={10}
                  />
                </div>
                <Button
                  className="w-full rounded-2xl"
                  onClick={handleCreateCourse}
                  disabled={!newCourse.name}
                >
                  Crear Curso
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
