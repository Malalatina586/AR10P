
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import {
  IconBell,
  IconBookmark,
  IconDownload,
  IconHeart,
  IconMessage,
  IconSearch,
  IconSend,
  IconUser,
 } from "@/components/Icons";

import "./admin.css";

const STATS = [
  { label: "Utilisateurs", value: "—", Icon: IconUser },
  { label: "Publications", value: "—", Icon: IconSend },
  { label: "PDF disponibles", value: "—", Icon: IconBookmark },
  { label: "Téléchargements", value: "—", Icon: IconDownload },
];

const ACTIONS = [
  { label: "Publications à valider", value: "—", href: "/admin/publications" },
  { label: "Signalements", value: "—", href: "/admin/signalements" },
  { label: "Nouveaux utilisateurs", value: "—", href: "/admin/utilisateurs" },
];

const ACTIVITY = [
  { label: "Likes", value: "—", Icon: IconHeart },
  { label: "Commentaires", value: "—", Icon: IconMessage },
  { label: "Partages", value: "—", Icon: IconSend },
  { label: "Téléchargements", value: "—", Icon: IconDownload },
];

export default async function AdminDashboard() {
  const supabase = await createClient();

  const { count: userCount } = await supabase
    .from("profiles")
    .select("*", { count: "exact", head: true });

  const stats = STATS.map((stat) =>
    stat.label === "Utilisateurs"
      ? { ...stat, value: String(userCount ?? 0) }
      : stat,
  );
  return (
    <div className="admin-app">
      <header className="admin-header">
        <div className="admin-brand">
          <span className="admin-logo">AR10P</span>
          <span className="admin-label">ADMIN</span>
        </div>
        <div className="admin-header-actions">
          <button className="admin-icon-btn" type="button" aria-label="Rechercher">
            <IconSearch size={19} />
          </button>
          <button className="admin-icon-btn" type="button" aria-label="Notifications">
            <IconBell size={19} />
          </button>
        </div>
      </header>
      <main className="admin-main">
        <section className="admin-welcome">
          <p className="admin-eyebrow">TABLEAU DE BORD</p>
          <h1>Bonjour, Administrateur</h1>
          <p>Vue centrale du fonctionnement d&apos;AR10P.</p>
        </section>
        <section className="admin-section">
          <div className="admin-section-heading">
            <div>
              <p className="admin-eyebrow">APERÇU</p>
              <h2>Indicateurs principaux</h2>
            </div>
          </div>

          <div className="admin-stat-grid">
            {stats.map(({ label, value, Icon }) => (
              <article className="admin-stat-card" key={label}>
                <div className="admin-stat-icon">
                  <Icon size={19} />
                </div>
                <strong>{value}</strong>
                <span>{label}</span>
              </article>
            ))}
          </div>
        </section>
        <section className="admin-section">
          <div className="admin-section-heading">
            <div>
              <p className="admin-eyebrow">ACTION</p>
              <h2>À traiter</h2>
            </div>
          </div>

          <div className="admin-action-list">
            {ACTIONS.map(({ label, value, href }) => (
              <Link className="admin-action-row" href={href} key={label}>
                <span>{label}</span>
                <strong>{value}</strong>
              </Link>
            ))}
          </div>
        </section>
        <section className="admin-section">
          <div className="admin-section-heading">
            <div>
              <p className="admin-eyebrow">ACTIVITÉ</p>
              <h2>Engagement</h2>
            </div>
          </div>

          <div className="admin-activity-grid">
            {ACTIVITY.map(({ label, value, Icon }) => (
              <article className="admin-activity-card" key={label}>
                <Icon size={20} />
                <strong>{value}</strong>
                <span>{label}</span>
              </article>
            ))}
          </div>
        </section>
        <section className="admin-control-card">
          <p className="admin-eyebrow">ADMINISTRATION</p>
          <h2>Centre de contrôle</h2>
          <p>Gérer les utilisateurs, publications, documents, signalements et paramètres d&apos;AR10P.</p>
          <Link className="admin-primary-btn" href="/admin/statistiques">
            Voir les statistiques
          </Link>
        </section>

        <nav className="admin-nav" aria-label="Navigation administrateur">
          <Link className="active" href="/admin">Dashboard</Link>
          <Link href="/admin/utilisateurs">Gestion</Link>
          <Link href="/admin/statistiques">Stats</Link>
          <Link href="/admin/parametres">Paramètres</Link>
        </nav>
      </main>
    </div>
  );
}
