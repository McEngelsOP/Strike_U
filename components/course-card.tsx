"use client";

import { motion } from "framer-motion";
import { BookOpen } from "lucide-react";
import type { Course } from "@/lib/types";

interface CourseCardProps {
  course: Course;
  index: number;
  onClick: () => void;
}

export function CourseCard({ course, index, onClick }: CourseCardProps) {
  const getGradeColor = (grade: number) => {
    if (grade >= 90) return "text-emerald-600";
    if (grade >= 80) return "text-blue-600";
    if (grade >= 70) return "text-amber-600";
    return "text-red-600";
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay: 0.1 * index }}
      whileHover={{ scale: 1.03, y: -5 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`${course.color} rounded-[2rem] p-5 shadow-xl cursor-pointer relative overflow-hidden`}
    >
      <div className="absolute top-0 right-0 w-20 h-20 bg-foreground/5 rounded-full -translate-y-1/2 translate-x-1/2" />

      <div className="relative z-10">
        <div className="flex items-start justify-between mb-3">
          <div className="p-2 bg-foreground/10 rounded-xl">
            <BookOpen className="w-4 h-4 text-foreground/70" />
          </div>
          <span className="text-xs bg-foreground/10 text-foreground/70 px-2 py-1 rounded-full">
            {course.credits} créditos
          </span>
        </div>

        <h3 className="font-semibold text-foreground text-sm mb-2 line-clamp-2">
          {course.name}
        </h3>

        <div className="flex items-end justify-between">
          <p className="text-muted-foreground text-xs">Promedio</p>
          <p className={`text-2xl font-bold ${getGradeColor(course.grade)}`}>
            {course.grade}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
