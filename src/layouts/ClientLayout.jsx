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

  useEffect(() => {
    const onLang = () => setLang(window.localStorage.getItem("lang") || "es");
    window.addEventListener("lang-changed", onLang);
    return () => {
      window.removeEventListener("lang-changed", onLang);
    };
  }, []);

  useEffect(() => {
    // Force light theme (site-wide)
    document.documentElement.classList.remove("dark");
    document.documentElement.setAttribute("data-theme", "light");
  }, []);

  const t = (key) => translations[lang]?.[key] || key;

  return (
    <>
      <Rainy />
      <main>
        <div className="z-10 relative main-section text-foreground surface-shell backdrop-blur-sm sm:backdrop-blur-md">
          <NavBar lang={lang} t={t} />
          {children}
          <Contact />
        </div>
      </main>
    </>
  );
}
