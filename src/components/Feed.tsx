"use client";

import { useMemo, useRef, useState } from "react";
import { CATEGORIES, FEED, SHOW_SPONSORED_AND_CREATOR } from "@/lib/mock-data";
import FeedCard from "./FeedCard";
import { IconBell, IconSmartHome, IconStackPlus, IconMessages, IconSearch, IconUserTabler } from "./Icons";
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
          <p className="empty">Aucun résumé pour « {query || category} » pour l&apos;instant.</p>
        ) : (
          items.map((item) => <FeedCard key={item.id} item={item} />)
        )}
        <p className="feed-end"><a href="/a-propos">À propos d&apos;AR10P</a></p>
      </main>

      <nav className="tabbar" aria-label="Navigation principale">
        <button className="tab active" aria-current="page" aria-label="Fil"><IconSmartHome /></button>
        <a className="tab" href="/messages" aria-label="Messages"><IconMessages size={24} /></a>
        <a className="tab" href="/bibliotheque" aria-label="Bibliothèque"><IconStackPlus /></a>
        <button className="tab" disabled title="Bientôt — nécessite un compte" aria-label="Profil (bientôt)"><IconUserTabler size={24} /></button>
      </nav>
    </div>
  );
}
