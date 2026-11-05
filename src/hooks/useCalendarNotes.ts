import { useState, useEffect } from 'react';
import { DayNote } from '../types/calendar';

const STORAGE_KEY = 'kj_calendar_notes_v1';

export function useCalendarNotes() {
  const [notes, setNotes] = useState<Record<string, DayNote[]>>({});

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setNotes(JSON.parse(saved));
      }
    } catch {
      // ignore
    }
  }, []);

  const saveToStorage = (updated: Record<string, DayNote[]>) => {
    setNotes(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // storage quota or error
    }
  };

  const addNote = (dateKey: string, text: string, category: DayNote['category'] = 'general') => {
    if (!text.trim()) return;
    const newNote: DayNote = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      dateKey,
      text: text.trim(),
      category,
      createdAt: new Date().toISOString()
    };

    const currentList = notes[dateKey] || [];
    const updated = {
      ...notes,
      [dateKey]: [...currentList, newNote]
    };
    saveToStorage(updated);
  };

  const deleteNote = (dateKey: string, noteId: string) => {
    const currentList = notes[dateKey] || [];
    const filtered = currentList.filter(n => n.id !== noteId);
    const updated = { ...notes };
    if (filtered.length > 0) {
      updated[dateKey] = filtered;
    } else {
      delete updated[dateKey];
    }
    saveToStorage(updated);
  };

  const getNotesForDate = (dateKey: string): DayNote[] => {
    return notes[dateKey] || [];
  };

  const hasNotes = (dateKey: string): boolean => {
    return (notes[dateKey]?.length ?? 0) > 0;
  };

  return {
    notes,
    addNote,
    deleteNote,
    getNotesForDate,
    hasNotes
  };
}
