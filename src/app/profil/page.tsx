"use client";
import Link from 'next/link';

import { useState } from "react";
import {
  IconBell,
  IconBookmark,
  IconClock,
  IconMessages,
  IconSmartHome,
  IconStackPlus,
  IconUserTabler,
} from "@/components/Icons";

export default function ProfilPage() {
  const [notifications, setNotifications] = useState(true);

  return (
    <div className="app-shell profile-page">
      <header className="topbar profile-topbar">
        <div>
          <p className="eyebrow">AR10P</p>
          <h1>Profil</h1>
          <p>Ton espace personnel de lecture.</p>
        </div>

        <button
          className="profile-icon-button"
          aria-label="Notifications"
          onClick={() => setNotifications((value) => !value)}
        >
          <IconBell />
          {notifications && <span className="notification-dot" />}
        </button>
      </header>

      <main className="profile-content">
        <section className="profile-hero">
          <div className="profile-avatar">AR</div>

          <div className="profile-identity">
            <span className="profile-label">MEMBRE AR10P</span>
            <h2>Utilisateur AR10P</h2>
            <p>Découvre, lis et partage l&apos;essentiel.</p>
          </div>

          <button className="profile-edit" type="button">
            Modifier
          </button>
        </section>

        <section className="profile-stats" aria-label="Statistiques de lecture">
          <div>
            <strong>12</strong>
            <span>Résumés lus</span>
          </div>
          <div>
            <strong>5</strong>
            <span>Sauvegardés</span>
          </div>
          <div>
            <strong>3</strong>
            <span>Catégories</span>
          </div>
        </section>

        <section className="profile-section">
          <div className="profile-section-heading">
            <div>
              <span className="eyebrow">LECTURE</span>
              <h2>Ma lecture</h2>
            </div>
          </div>

          <div className="profile-reading-card">
            <div className="profile-reading-icon">
              <IconBookmark />
            </div>
            <div>
              <strong>Finance personnelle en 10 pages</strong>
              <span>Lecture en cours · 60 %</span>
              <div className="profile-progress">
                <span style={{ width: "60%" }} />
              </div>
            </div>
          </div>
        </section>

        <section className="profile-section">
          <div className="profile-section-heading">
            <div>
              <span className="eyebrow">PRÉFÉRENCES</span>
              <h2>Mes préférences</h2>
            </div>
          </div>

          <div className="profile-list">
            <button className="profile-list-item" type="button">
              <span className="profile-list-icon">
                <IconBookmark />
              </span>
              <span>
                <strong>Catégories favorites</strong>
                <small>Business · Tech · Finance</small>
              </span>
              <b>›</b>
            </button>

            <button className="profile-list-item" type="button">
              <span className="profile-list-icon">
                <IconClock />
              </span>
              <span>
                <strong>Langue</strong>
                <small>Français</small>
              </span>
              <b>›</b>
            </button>

            <button className="profile-list-item" type="button">
              <span className="profile-list-icon">
                <IconBell />
              </span>
              <span>
                <strong>Notifications</strong>
                <small>{notifications ? "Activées" : "Désactivées"}</small>
              </span>
              <b>›</b>
            </button>
          </div>
        </section>

        <section className="profile-section">
          <div className="profile-section-heading">
            <div>
              <span className="eyebrow">COMPTE</span>
              <h2>Mon espace</h2>
            </div>
          </div>

          <div className="profile-list">
            <button className="profile-list-item" type="button">
              <span className="profile-list-icon">
                <IconUserTabler />
              </span>
              <span>
                <strong>Créer un compte</strong>
                <small>Synchronise ton espace plus tard</small>
              </span>
              <b>›</b>
            </button>

            <button className="profile-list-item" type="button">
              <span className="profile-list-icon">
                <IconMessages />
              </span>
              <span>
                <strong>Mes messages</strong>
                <small>Accéder à tes conversations</small>
              </span>
              <b>›</b>
            </button>
          </div>
        </section>
      </main>

      <nav className="tabbar" aria-label="Navigation principale">
        <Link className="tab" href="/" aria-label="Fil">
          <IconSmartHome />
        </Link>

        <a className="tab" href="/messages" aria-label="Messages">
          <IconMessages />
        </a>

        <a className="tab" href="/bibliotheque" aria-label="Bibliothèque">
          <IconStackPlus />
        </a>

        <button className="tab active" aria-current="page" aria-label="Profil">
          <IconUserTabler />
        </button>
      </nav>
    </div>
  );
}
