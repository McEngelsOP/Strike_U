"use client";

import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useStudent } from "@/lib/student-context";
import { Button } from "@/components/ui/button";

export function SemesterSelector() {
  const { currentSemester, setCurrentSemester } = useStudent();

  const handlePrevious = () => {
    if (currentSemester > 1) {
      setCurrentSemester(currentSemester - 1);
    }
  };

  const handleNext = () => {
    if (currentSemester < 10) {
      setCurrentSemester(currentSemester + 1);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="flex items-center justify-center gap-4 py-4"
    >
      <Button
        variant="outline"
        size="icon"
        className="rounded-full shadow-lg disabled:opacity-50 bg-transparent"
        onClick={handlePrevious}
        disabled={currentSemester <= 1}
      >
        <ChevronLeft className="w-5 h-5" />
      </Button>

      <motion.div
        key={currentSemester}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-card rounded-[2rem] px-8 py-3 shadow-lg border border-border"
      >
        <p className="text-muted-foreground text-xs text-center">
          Semestre Actual
        </p>
        <p className="text-2xl font-bold text-foreground text-center">
          {currentSemester}°
        </p>
      </motion.div>

      <Button
        variant="outline"
        size="icon"
        className="rounded-full shadow-lg disabled:opacity-50 bg-transparent"
        onClick={handleNext}
        disabled={currentSemester >= 10}
      >
        <ChevronRight className="w-5 h-5" />
      </Button>
    </motion.div>
  );
}
