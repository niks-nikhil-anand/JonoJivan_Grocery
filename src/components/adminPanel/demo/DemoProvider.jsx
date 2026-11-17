"use client";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { createFixtures, DEMO_VERSION } from "@/lib/admin/demo/fixtures";
import { mutateDemo } from "@/lib/admin/demo/store";
const Context = createContext(null);
const KEY = "jonojivan-admin-demo-v1";
export function DemoProvider({ children }) {
  const [state, setState] = useState(null);
  const [scenario, setScenario] = useState("normal");
  const [storageError, setStorageError] = useState("");
  const current = useRef(null);
  useEffect(() => {
    let initial = createFixtures();
    try {
      const saved = JSON.parse(localStorage.getItem(KEY) || "null");
      if (
        saved?.version === DEMO_VERSION &&
        Object.keys(initial).every((key) => key in saved) &&
        Object.keys(initial)
          .filter((key) => Array.isArray(initial[key]))
          .every((key) => Array.isArray(saved[key]))
      )
        initial = saved;
      else if (saved)
        setStorageError("An older demo was reset to the current sample data.");
    } catch {
      setStorageError(
        "Saved demo data could not be read. Fresh sample data is loaded.",
      );
    }
    current.current = initial;
    setState(initial);
  }, []);
  const persist = (next) => {
    try {
      localStorage.setItem(KEY, JSON.stringify(next));
      setStorageError("");
    } catch {
      setStorageError(
        "Browser storage is unavailable. Changes work in this session but may not survive a refresh.",
      );
    }
    current.current = next;
    setState(next);
  };
  const dispatch = (action) => {
    const next = mutateDemo(current.current, action);
    persist(next);
    return next;
  };
  return (
    <Context.Provider
      value={{
        state,
        dispatch,
        scenario,
        setScenario,
        reset: () => persist(createFixtures()),
        storageError,
      }}
    >
      {children}
    </Context.Provider>
  );
}
export function useDemo() {
  return useContext(Context);
}
