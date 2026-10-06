import Link from "next/link";
import { notFound } from "next/navigation";
import { getProfileByUsername } from "@/lib/messaging";
import ProfileActions from "@/components/ProfileActions";

type PageProps = {
  params: Promise<{ username: string }>;
};

export default async function PublicProfilePage({ params }: PageProps) {
  const { username } = await params;
  const profile = await getProfileByUsername(username);

  if (!profile) {
    notFound();
  }

  const displayName = profile.display_name || profile.username || "Utilisateur";
  const initials = displayName
    .split(" ")
    .map((name) => name[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <main className="creator-public-page">
      <div className="creator-public-topbar">
        <Link href="/messages" className="back">
          ← Messages
        </Link>
      </div>

      <section className="creator-public-hero">
        <div className="creator-public-avatar">
          {profile.avatar_url ? (
            <img src={profile.avatar_url} alt={displayName} />
          ) : (
            initials
          )}
        </div>

        <div className="creator-public-identity">
          <h1>{displayName}</h1>
          <p>@{profile.username}</p>
        </div>
      </section>

      <section className="creator-public-bio">
        <p>{profile.bio || "Aucune biographie renseignée."}</p>
      </section>

      <ProfileActions targetUserId={profile.id} />

      <nav className="creator-public-tabs" aria-label="Profil utilisateur">
        <a href="#publications">Publications</a>
        <a href="#a-propos">À propos</a>
        <a href="#stats">Stats</a>
      </nav>

      <section id="publications" className="creator-public-section">
        <div className="profile-section-heading">
          <div>
            <span className="profile-label">CONTENU</span>
            <h2>Publications de {displayName}</h2>
          </div>
        </div>

        <div className="creator-public-posts">
          <p>Aucune publication pour le moment.</p>
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
              <strong>Compte</strong>
              <small>Utilisateur AR10P</small>
            </span>
          </div>

          <div className="profile-list-item">
            <span className="profile-list-icon">✦</span>
            <span>
              <strong>Membre depuis</strong>
              <small>
                {new Date(profile.created_at).toLocaleDateString("fr-FR", {
                  month: "long",
                  year: "numeric",
                })}
              </small>
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
            <strong>0</strong>
            <span>Publications</span>
          </div>
          <div>
            <strong>0</strong>
            <span>Abonnés</span>
          </div>
          <div>
            <strong>0</strong>
            <span>Abonnements</span>
          </div>
          <div>
            <strong>0</strong>
            <span>J&apos;aime</span>
          </div>
        </div>
      </section>
    </main>
  );
}
