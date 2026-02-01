"use client";

import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
  import { Search, Plus, X, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import { useStudent } from "@/lib/student-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import type { Note } from "@/lib/types";

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

type CategoryFilter = "all" | "important" | "casual";

export function NotesSection() {
  const { notes, setNotes } = useStudent();
  const [searchQuery, setSearchQuery] = useState("");
  const [referenceDate, setReferenceDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>("all");
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [newNote, setNewNote] = useState({
    title: "",
    content: "",
    category: "casual" as "important" | "casual",
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (selectedNote) {
          setSelectedNote(null);
        }
        if (isAddingNote) {
          setIsAddingNote(false);
          setNewNote({ title: "", content: "", category: "casual" });
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedNote, isAddingNote]);

  const weekDays = useMemo(() => {
    const days = [];
    for (let i = -4; i <= 4; i++) {
      const date = new Date(referenceDate);
      date.setDate(referenceDate.getDate() + i);
      days.push(date);
    }
    return days;
  }, [referenceDate]);

  const filteredNotes = useMemo(() => {
    return notes.filter((note) => {
      const matchesSearch =
        note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.content.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        categoryFilter === "all" || note.category === categoryFilter;
      const noteDate = new Date(note.date);
      const matchesDate =
        searchQuery ? true : noteDate.toDateString() === selectedDate.toDateString();
      return matchesSearch && matchesCategory && matchesDate;
    });
  }, [notes, searchQuery, categoryFilter, selectedDate]);

  const handleSaveNote = () => {
    if (selectedNote) {
      setNotes(notes.map((n) => (n.id === selectedNote.id ? selectedNote : n)));
      setSelectedNote(null);
    }
  };

  const handleDeleteNote = (id: string) => {
    setNotes(notes.filter((n) => n.id !== id));
    setSelectedNote(null);
  };

  const handleCreateNote = () => {
    const note: Note = {
      id: Date.now().toString(),
      title: newNote.title,
      content: newNote.content,
      category: newNote.category,
      date: selectedDate,
      color: pastelColors[notes.length % pastelColors.length],
    };
    setNotes([note, ...notes]);
    setNewNote({ title: "", content: "", category: "casual" });
    setIsAddingNote(false);
  };

  const formatDayName = (date: Date) => {
    return date.toLocaleDateString("es-ES", { weekday: "short" }).slice(0, 2);
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isSelected = (date: Date) => {
    return date.toDateString() === selectedDate.toDateString();
  };

  const handlePrevDay = () => {
    const newDate = new Date(referenceDate);
    newDate.setDate(referenceDate.getDate() - 1);
    setReferenceDate(newDate);
  };

  const handleNextDay = () => {
    const newDate = new Date(referenceDate);
    newDate.setDate(referenceDate.getDate() + 1);
    setReferenceDate(newDate);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="space-y-4"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">
            Agenda / Apuntes
          </h2>
          <Button
            variant="outline"
            size="sm"
            className="rounded-full bg-transparent"
            onClick={() => setIsAddingNote(true)}
          >
            <Plus className="w-4 h-4 mr-1" />
            Nueva Nota
          </Button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar notas..."
            className="pl-12 rounded-2xl bg-card shadow-lg"
          />
        </div>

        {/* Date Selector */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full shrink-0"
            onClick={handlePrevDay}
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>

          <div className="flex gap-2 overflow-x-auto py-2 scrollbar-hide flex-1 justify-center">
            {weekDays.map((date) => (
              <motion.button
                key={date.toISOString()}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedDate(date)}
                className={`flex flex-col items-center min-w-[3.5rem] py-3 px-2 rounded-2xl transition-all ${
                  isSelected(date)
                    ? "bg-primary text-primary-foreground shadow-lg"
                    : isToday(date)
                      ? "bg-accent text-accent-foreground"
                      : "bg-card text-foreground"
                }`}
              >
                <span className="text-xs font-medium uppercase">
                  {formatDayName(date)}
                </span>
                <span className="text-lg font-bold">{date.getDate()}</span>
              </motion.button>
            ))}
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="rounded-full shrink-0"
            onClick={handleNextDay}
          >
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>

        {/* Category Filters */}
        <div className="flex gap-2">
          {(["all", "important", "casual"] as CategoryFilter[]).map(
            (category) => (
              <Button
                key={category}
                variant={categoryFilter === category ? "default" : "outline"}
                size="sm"
                className="rounded-full capitalize"
                onClick={() => setCategoryFilter(category)}
              >
                {category === "all"
                  ? "Todos"
                  : category === "important"
                    ? "Importante"
                    : "Casual"}
              </Button>
            )
          )}
        </div>

        {/* Notes Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <AnimatePresence>
            {filteredNotes.map((note, index) => (
              <motion.div
                key={note.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                whileHover={{ scale: 1.03, y: -5 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedNote(note)}
                className={`${note.color} rounded-[2rem] p-5 shadow-xl cursor-pointer min-h-[140px] flex flex-col`}
              >
                <div className="flex items-start justify-between mb-2">
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      note.category === "important"
                        ? "bg-red-500/20 text-red-700"
                        : "bg-foreground/10 text-foreground/70"
                    }`}
                  >
                    {note.category === "important" ? "Importante" : "Casual"}
                  </span>
                </div>
                <h3 className="font-semibold text-foreground text-sm mb-2 line-clamp-2">
                  {note.title}
                </h3>
                <p className="text-muted-foreground text-xs line-clamp-3 flex-1">
                  {note.content}
                </p>
                <p className="text-muted-foreground text-xs mt-2">
                  {note.date.toLocaleDateString("es-ES")}
                </p>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Note Edit Modal */}
      <AnimatePresence>
        {selectedNote && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-40"
              onClick={() => setSelectedNote(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 50 }}
              className="fixed inset-x-4 top-1/2 -translate-y-1/2 md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-lg bg-card rounded-[2.5rem] p-6 shadow-2xl z-50"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-foreground">
                  Editar Nota
                </h3>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full text-destructive"
                    onClick={() => handleDeleteNote(selectedNote.id)}
                  >
                    <Trash2 className="w-5 h-5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full"
                    onClick={() => setSelectedNote(null)}
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label className="text-foreground">Título</Label>
                  <Input
                    value={selectedNote.title}
                    onChange={(e) =>
                      setSelectedNote({
                        ...selectedNote,
                        title: e.target.value,
                      })
                    }
                    className="rounded-xl mt-1"
                  />
                </div>
                <div>
                  <Label className="text-foreground">Contenido</Label>
                  <Textarea
                    value={selectedNote.content}
                    onChange={(e) =>
                      setSelectedNote({
                        ...selectedNote,
                        content: e.target.value,
                      })
                    }
                    className="rounded-xl mt-1 min-h-[100px]"
                  />
                </div>
                <div>
                  <Label className="text-foreground">Categoría</Label>
                  <div className="flex gap-2 mt-2">
                    <Button
                      variant={
                        selectedNote.category === "important"
                          ? "default"
                          : "outline"
                      }
                      size="sm"
                      className="rounded-full"
                      onClick={() =>
                        setSelectedNote({
                          ...selectedNote,
                          category: "important",
                        })
                      }
                    >
                      Importante
                    </Button>
                    <Button
                      variant={
                        selectedNote.category === "casual"
                          ? "default"
                          : "outline"
                      }
                      size="sm"
                      className="rounded-full"
                      onClick={() =>
                        setSelectedNote({ ...selectedNote, category: "casual" })
                      }
                    >
                      Casual
                    </Button>
                  </div>
                </div>
                <Button
                  className="w-full rounded-2xl"
                  onClick={handleSaveNote}
                >
                  Guardar Cambios
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Add Note Modal */}
      <AnimatePresence>
        {isAddingNote && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-40"
              onClick={() => setIsAddingNote(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 50 }}
              className="fixed inset-x-4 top-1/2 -translate-y-1/2 md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-lg bg-card rounded-[2.5rem] p-6 shadow-2xl z-50"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-foreground">
                  Nueva Nota
                </h3>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full"
                  onClick={() => setIsAddingNote(false)}
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <div className="space-y-4">
                <div>
                  <Label className="text-foreground">Título</Label>
                  <Input
                    value={newNote.title}
                    onChange={(e) =>
                      setNewNote({ ...newNote, title: e.target.value })
                    }
                    className="rounded-xl mt-1"
                    placeholder="Ej: Tarea de matemáticas"
                  />
                </div>
                <div>
                  <Label className="text-foreground">Contenido</Label>
                  <Textarea
                    value={newNote.content}
                    onChange={(e) =>
                      setNewNote({ ...newNote, content: e.target.value })
                    }
                    className="rounded-xl mt-1 min-h-[100px]"
                    placeholder="Escribe tu nota aquí..."
                  />
                </div>
                <div>
                  <Label className="text-foreground">Categoría</Label>
                  <div className="flex gap-2 mt-2">
                    <Button
                      variant={
                        newNote.category === "important" ? "default" : "outline"
                      }
                      size="sm"
                      className="rounded-full"
                      onClick={() =>
                        setNewNote({ ...newNote, category: "important" })
                      }
                    >
                      Importante
                    </Button>
                    <Button
                      variant={
                        newNote.category === "casual" ? "default" : "outline"
                      }
                      size="sm"
                      className="rounded-full"
                      onClick={() =>
                        setNewNote({ ...newNote, category: "casual" })
                      }
                    >
                      Casual
                    </Button>
                  </div>
                </div>
                <Button
                  className="w-full rounded-2xl"
                  onClick={handleCreateNote}
                  disabled={!newNote.title}
                >
                  Crear Nota
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
