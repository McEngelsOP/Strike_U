"use client";

import { motion } from "framer-motion";
import { TrendingUp, Award, Target } from "lucide-react";
import { useStudent } from "@/lib/student-context";

export function GPAVisualizer() {
  const { courses, currentSemester } = useStudent();

  const calculateWeightedGPA = (filterCourses: typeof courses) => {
    if (filterCourses.length === 0) return "0.0";
    const totalCredits = filterCourses.reduce((acc, c) => acc + c.credits, 0);
    if (totalCredits === 0) return "0.0";
    const weightedSum = filterCourses.reduce(
      (acc, c) => acc + c.grade * c.credits,
      0
    );
    return (weightedSum / totalCredits).toFixed(1);
  };

  const semesterCourses = courses.filter((c) => c.semester === currentSemester);
  const previousCourses = courses.filter((c) => c.semester < currentSemester);
  const allCourses = courses;

  const gpaData = [
    {
      label: "Ponderado semestre actual",
      value: calculateWeightedGPA(semesterCourses),
      icon: Target,
      color: "from-chart-1 to-chart-1/60",
      textColor: "text-card-foreground",
    },
    {
      label: "Ponderado Acumulado",
      value: calculateWeightedGPA(previousCourses),
      icon: TrendingUp,
      color: "from-chart-2 to-chart-2/60",
      textColor: "text-card-foreground",
    },
    {
      label: "Ponderado General",
      value: calculateWeightedGPA(allCourses),
      icon: Award,
      color: "from-chart-3 to-chart-3/60",
      textColor: "text-card-foreground",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="grid grid-cols-3 gap-3 md:gap-4"
    >
      {gpaData.map((item, index) => (
        <motion.div
          key={item.label}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
          whileHover={{ scale: 1.05, y: -5 }}
          className={`relative overflow-hidden rounded-[2rem] bg-gradient-to-br ${item.color} p-4 md:p-5 shadow-xl cursor-pointer`}
        >
          <div className="absolute top-0 right-0 w-16 h-16 bg-card-foreground/10 rounded-full -translate-y-1/2 translate-x-1/2" />

          <div className="relative z-10">
            <item.icon className={`w-5 h-5 md:w-6 md:h-6 ${item.textColor} opacity-80 mb-2`} />
            <p className={`text-2xl md:text-3xl font-bold ${item.textColor}`}>
              {item.value}
            </p>
            <p className={`${item.textColor} opacity-70 text-xs md:text-sm mt-1`}>
              {item.label}
            </p>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}
