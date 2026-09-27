import Image from "next/image";

const categories = [
  ["📚", "Livres"],
  ["💼", "Business"],
  ["🎬", "Films"],
  ["📰", "Actualités"],
  ["🤖", "Technologie"],
  ["🌍", "Histoire & Monde"],
];

const featured = [
  { title: "Bienvenue sur AR10P", category: "Guide", text: "Découvrez notre format : comprendre l’essentiel d’un sujet en 10 pages." },
  { title: "Les grands concepts du business", category: "Business", text: "Une sélection de notions utiles pour entrepreneurs et créateurs." },
  { title: "À venir : bibliothèque AR10P", category: "Nouveautés", text: "Les premiers résumés seront publiés ici, puis enrichis au fil de la communauté." },
];

export default function Home() {
  return (
    <main>
      <header className="topbar">
        <div className="brand">
          <Image src="/logo.png" alt="AR10P" width={46} height={46} priority />
          <div><strong>AR10P</strong><span>All Résumé in 10 Pages</span></div>
        </div>
        <button className="menu" aria-label="Ouvrir le menu">☰</button>
      </header>

      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">ALL RÉSUMÉ IN 10 PAGES</p>
          <h1>L’essentiel.<br /><em>En 10 pages.</em></h1>
          <p className="lead">Des résumés courts, clairs et faciles à lire sur mobile — livres, business, films, actualités, technologie et plus.</p>
          <div className="hero-actions"><a href="#explore" className="primary">Explorer les résumés</a><a href="#how" className="secondary">Comment ça marche ?</a></div>
        </div>
        <div className="hero-mark"><Image src="/logo.png" alt="Logo AR10P" width={280} height={280} priority /></div>
      </section>

      <section className="section" id="explore">
        <div className="section-head"><div><p className="eyebrow">DÉCOUVRIR</p><h2>Choisis ton univers</h2></div><span className="count">6 catégories</span></div>
        <div className="categories">{categories.map(([icon, name]) => <a href="#featured" className="category" key={name}><span>{icon}</span><b>{name}</b></a>)}</div>
      </section>

      <section className="section" id="featured">
        <div className="section-head"><div><p className="eyebrow">À LA UNE</p><h2>Les résumés AR10P</h2></div></div>
        <div className="cards">{featured.map((item) => <article className="card" key={item.title}><span className="tag">{item.category}</span><h3>{item.title}</h3><p>{item.text}</p><button>Lire le résumé →</button></article>)}</div>
      </section>

      <section className="how" id="how"><p className="eyebrow">SIMPLE</p><h2>Découvre. Lis. Partage.</h2><div className="steps"><div><b>01</b><h3>Découvre</h3><p>Depuis les réseaux sociaux ou la bibliothèque AR10P.</p></div><div><b>02</b><h3>Comprends</h3><p>Un format structuré pour aller directement à l’essentiel.</p></div><div><b>03</b><h3>Partage</h3><p>Envoie les résumés utiles à tes amis et ta communauté.</p></div></div></section>

      <footer><span>© 2026 AR10P</span><span>All Résumé in 10 Pages</span></footer>
    </main>
  );
}
