'use client'
import { useEffect, useState } from "react";
import translations from "../i18n";
import NavBar from "../components/share/NavBar.astro";
import Contact from "../components/Contact.astro";
import Rainy from "../components/share/Rainy.astro";

export default function ClientLayout({ title, children }) {
  void title;
  const [lang, setLang] = useState(() =>
    typeof window !== "undefined" ? window.localStorage.getItem("lang") || "es" : "es"
  );
  const [theme, setTheme] = useState(() =>
    typeof window !== "undefined" ? window.localStorage.getItem("theme") || "system" : "system"
  );

  useEffect(() => {
    const onLang = () => setLang(window.localStorage.getItem("lang") || "es");
    const onTheme = () => setTheme(window.localStorage.getItem("theme") || "system");
    window.addEventListener("lang-changed", onLang);
    window.addEventListener("theme-changed", onTheme);
    return () => {
      window.removeEventListener("lang-changed", onLang);
      window.removeEventListener("theme-changed", onTheme);
    };
  }, []);

  useEffect(() => {
    if (theme === "system") {
      document.documentElement.removeAttribute("data-theme");
      if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    } else {
      document.documentElement.setAttribute("data-theme", theme);
      if (theme === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }
  }, [theme]);

  const t = (key) => translations[lang]?.[key] || key;

  return (
    <>
      <Rainy />
      <main>
        <div className="z-10 relative main-section text-white backdrop-blur-sm sm:backdrop-blur-md bg-black/30">
          <NavBar lang={lang} t={t} />
          {children}
          <Contact />
        </div>
      </main>
    </>
  );
}
