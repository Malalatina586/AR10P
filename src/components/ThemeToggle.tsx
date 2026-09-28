"use client";

import { useEffect, useState } from "react";
import { IconMoon, IconSun } from "./Icons";

const KEY = "ar10p-theme";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const current = document.documentElement.dataset.theme === "dark" ? "dark" : "light";
    setTheme(current);
  }, []);

  function toggle() {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.dataset.theme = next;
    try { localStorage.setItem(KEY, next); } catch { /* stockage indisponible */ }
  }

  return (
    <button className="icon-btn" onClick={toggle} aria-label={theme === "dark" ? "Passer en mode clair" : "Passer en mode sombre"}>
      {theme === "dark" ? <IconSun /> : <IconMoon />}
    </button>
  );
}
