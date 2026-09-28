import Image from "next/image";

const categories = [
  ["Tous", "✨"],
  ["Livres", "📚"],
  ["Business", "💼"],
  ["Films", "🎬"],
  ["Actualités", "📰"],
  ["Technologie", "🤖"],
  ["Histoire & Monde", "🌍"],
];

const feed = [
  {
    category: "Business",
    icon: "💼",
    title: "Les grands concepts du business",
    text: "Les principes essentiels à comprendre pour développer une activité et prendre de meilleures décisions.",
    time: "Il y a 2 h",
  },
  {
    category: "Livres",
    icon: "📚",
    title: "Bienvenue dans AR10P",
    text: "Découvrez notre format : l'essentiel d'un livre résumé de manière claire et structurée.",
    time: "Il y a 5 h",
  },
  {
    category: "Technologie",
    icon: "🤖",
    title: "Comprendre l'intelligence artificielle",
    text: "Les concepts essentiels de l'IA expliqués simplement, sans jargon inutile.",
    time: "Hier",
  },
  {
    category: "Histoire & Monde",
    icon: "🌍",
    title: "Les grandes transformations du monde",
    text: "Un résumé pour comprendre les événements et idées qui ont marqué notre époque.",
    time: "Hier",
  },
];

export default function Home() {
  return (
    <main className="feed-page">

      <header className="topbar">
        <div className="brand">
          <Image
            src="/logo.png"
            alt="AR10P"
            width={42}
            height={42}
            priority
          />

          <div>
            <strong>AR10P</strong>
            <span>All Résumé in 10 Pages</span>
          </div>
        </div>

        <button
          className="menu"
          aria-label="Ouvrir le menu"
        >
          ☰
        </button>
      </header>

      <section className="feed-header">
        <div>
          <p className="eyebrow">AR10P</p>
          <h1>Fil d&apos;actualité</h1>
          <p>
            L&apos;essentiel de ce qu&apos;il faut comprendre,
            résumé en 10 pages.
          </p>
        </div>
      </section>

      <section className="search-box">
        <span>🔎</span>

        <input
          type="search"
          placeholder="Rechercher un résumé..."
          aria-label="Rechercher un résumé"
        />
      </section>

      <section className="category-scroll">
        {categories.map(([name, icon], index) => (
          <button
            key={name}
            className={
              index === 0
                ? "category-pill active"
                : "category-pill"
            }
          >
            <span>{icon}</span>
            {name}
          </button>
        ))}
      </section>

      <section className="section feed-section">

        <div className="section-head">
          <div>
            <p className="eyebrow">ACTUALITÉ</p>
            <h2>Derniers résumés</h2>
          </div>

          <span className="count">
            {feed.length} contenus
          </span>
        </div>

        <div className="feed-list">

          {feed.map((item) => (
            <article
              className="feed-card"
              key={item.title}
            >

              <div className="feed-card-top">

                <div className="feed-icon">
                  {item.icon}
                </div>

                <div className="feed-meta">
                  <span className="tag">
                    {item.category}
                  </span>

                  <span className="time">
                    {item.time}
                  </span>
                </div>

              </div>

              <h3>{item.title}</h3>

              <p>{item.text}</p>

              <div className="feed-actions">

                <button aria-label="J'aime">
                  ♡
                </button>

                <button aria-label="Partager">
                  ↗
                </button>

                <button className="read-button">
                  Lire le résumé →
                </button>

              </div>

            </article>
          ))}

        </div>

      </section>

      <section className="how feed-info">

        <p className="eyebrow">
          AR10P
        </p>

        <h2>
          Découvre. Comprends. Partage.
        </h2>

        <p>
          Des contenus courts et structurés pour
          comprendre rapidement l&apos;essentiel.
        </p>

      </section>

      <footer>
        <span>© 2026 AR10P</span>
        <span>All Résumé in 10 Pages</span>
      </footer>

    </main>
  );
}

