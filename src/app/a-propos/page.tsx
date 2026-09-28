import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "À propos — AR10P" };

const steps = [
  ["01", "Découvre", "Depuis les réseaux sociaux ou la bibliothèque AR10P."],
  ["02", "Comprends", "Un format structuré pour aller directement à l'essentiel."],
  ["03", "Partage", "Envoie les résumés utiles à tes amis et ta communauté."],
];

export default function About() {
  return (
    <div className="app about">
      <header className="app-head">
        <div className="head-row">
          <Link href="/" className="back">← Retour au fil</Link>
        </div>
      </header>
      <main className="about-body">
        <Image src="/logo.png" alt="Logo AR10P" width={96} height={96} className="about-logo" priority />
        <h1>L'essentiel. En 10 pages.</h1>
        <p>AR10P propose des résumés courts, clairs et faciles à lire sur mobile : livres, business, histoire, technologie, finance et plus encore. Gratuit, sans inscription.</p>
        <ol className="steps">
          {steps.map(([n, t, d]) => (
            <li key={n}><b>{n}</b><h2>{t}</h2><p>{d}</p></li>
          ))}
        </ol>
        <p className="about-foot">© 2026 AR10P — All Résumé in 10 Pages</p>
      </main>
    </div>
  );
}
