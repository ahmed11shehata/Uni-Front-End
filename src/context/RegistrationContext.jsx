// src/context/RegistrationContext.jsx
import { createContext, useContext, useState, useEffect } from "react";

const RegistrationContext = createContext(null);

const DEFAULT_STATE = {
  isOpen:         false,
  semester:       "Semester 1",
  academicYear:   "2025/2026",
  startDate:      "",
  deadline:       "",
  startedAt:      null,
  // NEW: which year batches are open
  openYears:      [],
  // NEW: which course codes are enabled for registration this semester
  enabledCourses: [],
};

export function RegistrationProvider({ children }) {
  const [regWindow, setRegWindow] = useState(() => {
    try {
      const saved = localStorage.getItem("uni_reg_window_v2");
      return saved ? JSON.parse(saved) : DEFAULT_STATE;
    } catch {
      return DEFAULT_STATE;
    }
  });

  useEffect(() => {
    localStorage.setItem("uni_reg_window_v2", JSON.stringify(regWindow));
  }, [regWindow]);

  const startRegistration = (settings) =>
    setRegWindow({ ...settings, isOpen: true, startedAt: new Date().toISOString() });

  const stopRegistration = () =>
    setRegWindow(prev => ({ ...prev, isOpen: false, startedAt: null }));

  const updateSettings = (settings) =>
    setRegWindow(prev => ({ ...prev, ...settings }));

  return (
    <RegistrationContext.Provider value={{ regWindow, startRegistration, stopRegistration, updateSettings }}>
      {children}
    </RegistrationContext.Provider>
  );
}

export function useRegistration() {
  const ctx = useContext(RegistrationContext);
  if (!ctx) throw new Error("useRegistration must be inside RegistrationProvider");
  return ctx;
}
