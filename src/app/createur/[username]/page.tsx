import Link from "next/link";
import { notFound } from "next/navigation";
import { CREATOR_PROFILES, FEED } from "@/lib/mock-data";

type PageProps = {
  params: Promise<{ username: string }>;
};

export default async function CreatorProfilePage({ params }: PageProps) {
  const { username } = await params;

  const profile = CREATOR_PROFILES.find(
    (item) => item.username === username
  );

  if (!profile) {
    notFound();
  }

  const posts = FEED.filter(
    (item) => item.type === "creator" && item.creator === profile.creator
  );

  return (
    <main className="creator-public-page">
      <div className="creator-public-topbar">
        <Link href="/" className="back">
          ← Retour
        </Link>
      </div>

      <section className="creator-public-hero">
        <div className="creator-public-avatar">
          {profile.avatar ? (
            <img src={profile.avatar} alt={profile.creator} />
          ) : (
            profile.creator
              .split(" ")
              .map((name) => name[0])
              .join("")
          )}
        </div>

        <div className="creator-public-identity">
          <span className="profile-label">CRÉATEUR</span>
          <h1>{profile.creator}</h1>
          <p>
            {profile.job} · @{profile.username}
          </p>
        </div>
      </section>

      <section className="creator-public-bio">
        <p>{profile.bio}</p>
        <span>⌖ {profile.location}</span>
      </section>

      <section className="creator-public-stats" aria-label="Statistiques publiques">
        <div>
          <strong>{profile.stats.publications}</strong>
          <span>Publications</span>
        </div>
        <div>
          <strong>{profile.stats.followers.toLocaleString("fr-FR")}</strong>
          <span>Abonnés</span>
        </div>
        <div>
          <strong>{profile.stats.likes.toLocaleString("fr-FR")}</strong>
          <span>J&#39;aime</span>
        </div>
      </section>

      <div className="creator-public-actions">
        <button type="button" className="creator-follow">
          + Suivre
        </button>
        <button type="button" className="creator-message">
          Message
        </button>
      </div>

      <nav className="creator-public-tabs" aria-label="Profil du créateur">
        <a href="#publications">Publications</a>
        <a href="#a-propos">À propos</a>
        <a href="#stats">Stats</a>
      </nav>

      <section id="publications" className="creator-public-section">
        <div className="profile-section-heading">
          <div>
            <span className="profile-label">CONTENU</span>
            <h2>Publications de {profile.creator}</h2>
          </div>
        </div>

        <div className="creator-public-posts">
          {posts.map((post) => (
            <article className="post" key={post.id}>
              <header className="post-head">
                <div className="avatar avatar-green">
                  {profile.creator
                    .split(" ")
                    .map((name) => name[0])
                    .join("")}
                </div>

                <div className="who">
                  <strong>{profile.creator}</strong>
                  <span>{profile.job}</span>
                </div>

                <span className="badge badge-green">Créateur</span>
              </header>

              <div className="post-body">
                <div>
                  <h3 className="post-title">{post.title}</h3>
                  <p className="post-desc">{post.description}</p>
                </div>
              </div>

              <div className="actions">
                <span className="stat">♡ {post.likes}</span>
                <span className="stat">💬 {post.comments}</span>
                <span className="stat">↗ {post.shares}</span>
                <span className="stat stat-static">↓ {post.type === "creator" ? post.downloads : 0}</span>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="a-propos" className="creator-public-section">
        <div className="profile-section-heading">
          <div>
            <span className="profile-label">PROFIL</span>
            <h2>À propos</h2>
          </div>
        </div>

        <div className="profile-list">
          <div className="profile-list-item">
            <span className="profile-list-icon">B</span>
            <span>
              <strong>Catégorie</strong>
              <small>{profile.category}</small>
            </span>
          </div>

          <div className="profile-list-item">
            <span className="profile-list-icon">⌖</span>
            <span>
              <strong>Localisation</strong>
              <small>{profile.location}</small>
            </span>
          </div>

          <div className="profile-list-item">
            <span className="profile-list-icon">✦</span>
            <span>
              <strong>Membre depuis</strong>
              <small>2026</small>
            </span>
          </div>
        </div>
      </section>

      <section id="stats" className="creator-public-section">
        <div className="profile-section-heading">
          <div>
            <span className="profile-label">ACTIVITÉ</span>
            <h2>Statistiques publiques</h2>
          </div>
        </div>

        <div className="creator-public-detail-stats">
          <div>
            <strong>{profile.stats.publications}</strong>
            <span>Publications</span>
          </div>
          <div>
            <strong>{profile.stats.followers.toLocaleString("fr-FR")}</strong>
            <span>Abonnés</span>
          </div>
          <div>
            <strong>{profile.stats.likes.toLocaleString("fr-FR")}</strong>
            <span>J&#39;aime</span>
          </div>
          <div>
            <strong>{profile.stats.comments.toLocaleString("fr-FR")}</strong>
            <span>Commentaires</span>
          </div>
          <div>
            <strong>{profile.stats.shares.toLocaleString("fr-FR")}</strong>
            <span>Partages</span>
          </div>
          <div>
            <strong>{profile.stats.downloads.toLocaleString("fr-FR")}</strong>
            <span>Téléchargements</span>
          </div>
        </div>
      </section>
    </main>
  );
}
