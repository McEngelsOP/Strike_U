"use client";

import { motion } from "framer-motion";
import { Home, Calendar, BookOpen, Wrench } from "lucide-react";
import { useState } from "react";

type Tab = "home" | "calendar" | "study" | "tools";

interface BottomNavProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

export function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  const tabs = [
    { id: "home" as Tab, icon: Home, label: "Inicio" },
    { id: "calendar" as Tab, icon: Calendar, label: "Agenda" },
    { id: "study" as Tab, icon: BookOpen, label: "Cursos" },
    { id: "tools" as Tab, icon: Wrench, label: "Herramientas" },
  ];

  return (
    <motion.nav
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.6 }}
      className="fixed bottom-4 left-4 right-4 md:left-1/2 md:-translate-x-1/2 md:max-w-md"
    >
      <div className="bg-card/80 backdrop-blur-xl rounded-[2rem] shadow-2xl border border-border/50 p-2">
        <div className="flex items-center justify-around">
          {tabs.map((tab) => (
            <motion.button
              key={tab.id}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onTabChange(tab.id)}
              className={`relative flex flex-col items-center gap-1 px-6 py-3 rounded-2xl transition-all ${
                activeTab === tab.id
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {activeTab === tab.id && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-primary/10 rounded-2xl"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <tab.icon className="w-5 h-5 relative z-10" />
              <span className="text-xs font-medium relative z-10">
                {tab.label}
              </span>
            </motion.button>
          ))}
        </div>
      </div>
    </motion.nav>
  );
}
