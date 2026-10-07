"use client";

import Link from "next/link";
import { useState } from "react";
import { CATEGORIES } from "@/lib/mock-data";

export default function PublierPage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [imageName, setImageName] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    alert("Interface de publication prête. La connexion à Supabase sera ajoutée ensuite.");
  }

  return (
    <main className="publish-page">
      <header className="publish-head">
        <Link href="/" className="publish-back" aria-label="Retour au fil">
          ←
        </Link>
        <h1>Créer une publication</h1>
      </header>

      <form className="publish-form" onSubmit={handleSubmit}>
        <div className="publish-intro">
          <h2>Partager avec la communauté</h2>
          <p>
            Crée une publication utile, claire et adaptée à la communauté AR10P.
          </p>
        </div>

        <label className="publish-field">
          <span>Titre</span>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Titre de ta publication"
            maxLength={120}
          />
        </label>

        <label className="publish-field">
          <span>Contenu</span>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Écris ton contenu ici..."
            rows={8}
            maxLength={5000}
          />
          <small>{content.length}/5000</small>
        </label>

        <label className="publish-field">
          <span>Catégorie</span>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">Choisir une catégorie</option>
            {CATEGORIES.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>

        <label className="publish-upload">
          <span>Image</span>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              setImageName(file?.name ?? "");
            }}
          />
          {imageName && <small>{imageName}</small>}
        </label>

        <div className="publish-info">
          <strong>Avant publication</strong>
          <p>
            Les publications seront soumises à la modération automatique avant
            leur apparition dans le fil.
          </p>
        </div>

        <button type="submit" className="publish-submit">
          Publier
        </button>
      </form>
    </main>
  );
}
