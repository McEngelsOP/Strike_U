"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GraduationCap, Edit3, Check, X } from "lucide-react";
import { useStudent } from "@/lib/student-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function ProfileCard() {
  const { student, setStudent } = useStudent();
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(student.name);
  const [editCareer, setEditCareer] = useState(student.career);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isEditing) {
        setEditName(student.name);
        setEditCareer(student.career);
        setIsEditing(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isEditing, student]);

  const handleSave = () => {
    setStudent({
      ...student,
      name: editName,
      career: editCareer,
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditName(student.name);
    setEditCareer(student.career);
    setIsEditing(false);
  };

  return (
    <>
      <AnimatePresence>
        {isEditing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-40"
            onClick={handleCancel}
          />
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className={`relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-primary via-primary/90 to-accent p-6 md:p-8 shadow-2xl ${isEditing ? "z-50" : ""}`}
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary-foreground/10 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-primary-foreground/10 rounded-full translate-y-1/2 -translate-x-1/2" />

        <div className="relative z-10">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-primary-foreground/20 rounded-2xl">
                <GraduationCap className="w-6 h-6 md:w-8 md:h-8 text-primary-foreground" />
              </div>
              <div>
                <p className="text-primary-foreground/70 text-sm">
                  Carrera Profesional
                </p>
                <p className="text-primary-foreground font-medium text-xs">
                  Semestre {student.semester}
                </p>
              </div>
            </div>

            {!isEditing ? (
              <Button
                variant="ghost"
                size="icon"
                className="text-primary-foreground hover:bg-primary-foreground/20 rounded-full"
                onClick={() => setIsEditing(true)}
              >
                <Edit3 className="w-4 h-4" />
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-primary-foreground hover:bg-primary-foreground/20 rounded-full"
                  onClick={handleSave}
                >
                  <Check className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-primary-foreground hover:bg-primary-foreground/20 rounded-full"
                  onClick={handleCancel}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>

          {!isEditing ? (
            <>
              <h2 className="text-2xl md:text-3xl font-bold text-primary-foreground mb-2">
                {student.name}
              </h2>
              <p className="text-primary-foreground/80 text-sm md:text-base leading-relaxed">
                {student.career}
              </p>
            </>
          ) : (
            <div className="space-y-3">
              <Input
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="bg-primary-foreground/20 border-primary-foreground/30 text-primary-foreground placeholder:text-primary-foreground/50 rounded-2xl"
                placeholder="Nombre completo"
              />
              <Input
                value={editCareer}
                onChange={(e) => setEditCareer(e.target.value)}
                className="bg-primary-foreground/20 border-primary-foreground/30 text-primary-foreground placeholder:text-primary-foreground/50 rounded-2xl"
                placeholder="Carrera"
              />
            </div>
          )}
        </div>
      </motion.div>
    </>
  );
}
