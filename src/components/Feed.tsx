"use client";

import { useMemo, useRef, useState } from "react";
import { CATEGORIES, FEED, SHOW_SPONSORED_AND_CREATOR } from "@/lib/mock-data";
import FeedCard from "./FeedCard";
import { IconBell, IconHome, IconLibrary, IconSearch } from "./Icons";
import ThemeToggle from "./ThemeToggle";

// Recherche tolérante aux accents et à la casse
const norm = (s: string) => s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

export default function Feed() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>("Tous");
  const searchRef = useRef<HTMLInputElement>(null);

  const items = useMemo(() => {
    const q = norm(query.trim());
    return FEED
      .filter((i) => SHOW_SPONSORED_AND_CREATOR || i.type === "summary")
      .filter((i) => category === "Tous" || i.category === category)
      .filter((i) => !q || norm(`${i.title} ${i.description} ${i.category}`).includes(q))
      .sort((a, b) => +new Date(b.publishedAt) - +new Date(a.publishedAt)); // derniers ajouts d'abord
  }, [query, category]);

  return (
    <div className="app">
      <header className="app-head">
        <div className="head-row">
          <h1 className="logo">AR10P</h1>
          <div className="head-actions">
            <ThemeToggle />
            <button className="icon-btn" aria-label="Alertes (bientôt)" title="Alertes — bientôt"><IconBell /></button>
          </div>
        </div>
        <label className="search">
          <IconSearch />
          <input ref={searchRef} type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Rechercher un sujet que vous aimez" aria-label="Rechercher un sujet" />
        </label>
        <div className="chips" role="tablist" aria-label="Catégories">
          {["Tous", ...CATEGORIES].map((c) => (
            <button key={c} role="tab" aria-selected={category === c} className={`chip${category === c ? " active" : ""}`} onClick={() => setCategory(c)}>{c}</button>
          ))}
        </div>
      </header>

      <main className="feed">
        {items.length === 0 ? (
          <p className="empty">Aucun résumé pour « {query || category} » pour l'instant.</p>
        ) : (
          items.map((item) => <FeedCard key={item.id} item={item} />)
        )}
        <p className="feed-end"><a href="/a-propos">À propos d'AR10P</a></p>
      </main>

      <nav className="tabbar" aria-label="Navigation principale">
        <button className="tab active" aria-current="page"><IconHome /><span>Fil</span></button>
        <button className="tab" onClick={() => { window.scrollTo({ top: 0, behavior: "smooth" }); searchRef.current?.focus(); }}><IconSearch size={24} /><span>Recherche</span></button>
        <button className="tab" disabled title="Bientôt"><IconLibrary /><span>Bibliothèque</span></button>
        <button className="tab" disabled title="Bientôt"><IconBell size={24} /><span>Alertes</span></button>
      </nav>
    </div>
  );
}
