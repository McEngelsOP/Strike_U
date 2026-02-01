"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Palette } from "lucide-react";
import { useStudent } from "@/lib/student-context";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import type { ColorPalette } from "@/lib/types";

export function Header() {
  const { student, colorPalette, setColorPalette } =
    useStudent();

  const currentDate = new Date().toLocaleDateString("es-ES", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Buenos días";
    if (hour < 18) return "Buenas tardes";
    return "Buenas noches";
  };

  const palettes: { id: ColorPalette; label: string; color: string }[] = [
    { id: "indigo", label: "Opción 1", color: "bg-indigo-500" },
    { id: "amber", label: "Opción 2", color: "bg-[#7b5f48]" },
  ];

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex items-center justify-between p-4 md:p-6"
    >
      <div className="flex-1">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-muted-foreground text-sm capitalize"
        >
          {currentDate}
        </motion.p>
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-xl md:text-2xl font-bold text-foreground"
        >
          {getGreeting()},{" "}
          <span className="text-primary">
            {student.name === "Nombre/Apodo?"
              ? "..."
              : student.name.split(" ")[0]}
          </span>
        </motion.h1>
      </div>

      <div className="flex items-center gap-2 md:gap-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="rounded-full shadow-lg bg-transparent"
            >
              <Palette className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="rounded-[1.5rem]">
            {palettes.map((p) => (
              <DropdownMenuItem
                key={p.id}
                onClick={() => setColorPalette(p.id)}
                className="flex items-center gap-2 cursor-pointer"
              >
                <div className={`w-4 h-4 rounded-full ${p.color}`} />
                <span className="capitalize">{p.label}</span>
                {colorPalette === p.id && (
                  <span className="ml-auto text-primary">✓</span>
                )}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative"
        >
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-primary to-accent p-0.5 shadow-lg">
            <div className="w-full h-full rounded-full bg-card flex items-center justify-center overflow-hidden">
              <span className="text-lg md:text-xl font-bold text-primary">
                {student.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </span>
            </div>
          </div>
          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-card" />
        </motion.div>
      </div>
    </motion.header>
  );
}
