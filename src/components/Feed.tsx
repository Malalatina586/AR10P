"use client";

import { useMemo, useRef, useState } from "react";
import { FEED, SHOW_SPONSORED_AND_CREATOR } from "@/lib/mock-data";
import FeedCard from "./FeedCard";
import { IconBell, IconSearch } from "./Icons";
import BottomNav from "./BottomNav";

// Recherche tolérante aux accents et à la casse
const norm = (s: string) => s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

export default function Feed() {
  const [query, setQuery] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);

  const items = useMemo(() => {
    const q = norm(query.trim());
    return FEED
      .filter((i) => SHOW_SPONSORED_AND_CREATOR || i.type === "summary")
      .filter((i) => !q || norm(`${i.title} ${i.description} ${i.category}`).includes(q))
      .sort((a, b) => +new Date(b.publishedAt) - +new Date(a.publishedAt)); // derniers ajouts d'abord
  }, [query]);

  return (
    <div className="app">
      <header className="app-head">
        <div className="head-row">
          <h1 className="logo">AR10P</h1>
          <div className="head-actions">
            <button className="icon-btn" aria-label="Alertes (bientôt)" title="Alertes — bientôt"><IconBell /></button>
          </div>
        </div>
        <label className="search">
          <IconSearch />
          <input ref={searchRef} type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Rechercher un sujet que vous aimez" aria-label="Rechercher un sujet" />
        </label>
      </header>

      <main className="feed">
        {items.length === 0 ? (
          <p className="empty">Aucun résumé pour « {query} » pour l&apos;instant.</p>
        ) : (
          items.map((item) => <FeedCard key={item.id} item={item} />)
        )}
        <p className="feed-end"><a href="/a-propos">À propos d&apos;AR10P</a></p>
      </main>

        <BottomNav />
    </div>
  );
}
