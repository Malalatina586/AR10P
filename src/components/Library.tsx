"use client";

import { useMemo, useState } from "react";
import { FEED, LIBRARY, type LibraryStatus } from "@/lib/mock-data";
import BottomNav from "./BottomNav";

type Filter = "all" | LibraryStatus;

const FILTERS: { id: Filter; label: string }[] = [
  { id: "all", label: "Tous" },
  { id: "in-progress", label: "En cours" },
  { id: "completed", label: "Terminés" },
];

export default function Library() {
  const [filter, setFilter] = useState<Filter>("all");

  const items = useMemo(() => {
    return LIBRARY
      .filter((entry) => filter === "all" || entry.status === filter)
      .map((entry) => ({
        ...entry,
        summary: FEED.find((item) => item.id === entry.summaryId),
      }))
      .filter((entry) => entry.summary);
  }, [filter]);

  return (
    <div className="app-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">AR10P</p>
          <h1>Bibliothèque</h1>
          <p>Retrouve tes résumés sauvegardés et reprends ta lecture.</p>
        </div>
      </header>

      <main className="library">
        <div className="library-filters" aria-label="Filtrer la bibliothèque">
          {FILTERS.map((item) => (
            <button
              key={item.id}
              className={`library-filter ${filter === item.id ? "active" : ""}`}
              onClick={() => setFilter(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>

        <section className="library-list" aria-label="Résumés enregistrés">
          {items.map(({ summaryId, status, progress, summary }) => {
            if (!summary || summary.type !== "summary") return null;

            return (
              <article className="library-card" key={summaryId}>
                <div className={`library-cover library-cover-${summary.category.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}><span>AR10P</span><strong>{summary.category}</strong></div>
                <div className="library-card-content">
                  <span className="library-category">{summary.category}</span>

                  <h2>{summary.title}</h2>

                  <p>{summary.description}</p>

                  <div className="library-meta">
                    <span>{summary.readingMinutes} min de lecture</span>
                    <span>
                      {status === "completed"
                        ? "Terminé"
                        : status === "in-progress"
                          ? `${progress}% lu`
                          : "À lire"}
                    </span>
                  </div>

                  {status === "in-progress" && (
                    <div
                      className="library-progress"
                      aria-label={`${progress}% lu`}
                    >
                      <span style={{ width: `${progress}%` }} />
                    </div>
                  )}

                  <button className="library-action">
                    {status === "completed"
                      ? "Relire"
                      : status === "in-progress"
                        ? "Continuer la lecture"
                        : "Commencer"}
                  </button>
                </div>
              </article>
            );
          })}
        </section>

        {items.length === 0 && (
          <p className="empty">Aucun résumé dans cette catégorie.</p>
        )}
      </main>

        <BottomNav />
    </div>
  );
}
