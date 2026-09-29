'use client';
import { useState } from "react";

/**
 * AR10P — Page Profil
 * Utilise les variables de globals.css et le système pf-*.
 */

import {
  Bell,
  ChevronRight,
  Languages,
  Moon,
  Settings,
} from 'lucide-react';

import {
  NETWORKS,
  useConnectedAccounts,
  useTheme,
} from '@/lib/profile-shared';

import { CATEGORIES } from '@/lib/mock-data';

import BottomNav from "@/components/BottomNav";

import './profil.css';

function Section({
  title,
  hint,
  children,
}: {
  title: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="pf-sec">
      <h2>{title}</h2>
      {hint && <p className="pf-hint">{hint}</p>}
      {children}
    </section>
  );
}

function Row({
  icon,
  title,
  sub,
  right,
}: {
  icon: React.ReactNode;
  title: string;
  sub?: string;
  right?: React.ReactNode;
}) {
  return (
    <div className="pf-row">
      <span className="pf-ri">{icon}</span>

      <div className="pf-rt">
        {title}
        {sub && <small>{sub}</small>}
      </div>

      {right}
    </div>
  );
}

function Switch({
  on,
  onChange,
  label,
}: {
  on: boolean;
  onChange: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={label}
      onClick={onChange}
      className={`pf-sw${on ? ' on' : ''}`}
    />
  );
}

export default function ProfilPage() {
  const { isConnected, toggle } = useConnectedAccounts();
  const { dark, toggleDark } = useTheme();

  const [topics, setTopics] = useState<string[]>([
    'Business',
    'Tech',
    'Finance',
  ]);

  const [notifs, setNotifs] = useState(true);

  const toggleTopic = (category: string) =>
    setTopics((current) =>
      current.includes(category)
        ? current.filter((item) => item !== category)
        : [...current, category],
    );

  return (
    <main className="pf">
      <header className="pf-head">
        <h1>Profil</h1>

        <button className="pf-ic" aria-label="Réglages">
          <Settings size={19} />
        </button>
      </header>

      {/* Identité anonyme */}
      <div className="pf-id">
        <div className="pf-av">L</div>

        <div>
          <div className="pf-nm">Lecteur #4821</div>
          <div className="pf-sb">Sans compte · gratuit</div>
        </div>
      </div>

      {/* Statistiques */}
      <dl className="pf-stats">
        {[
          ['12', 'Lus'],
          ['5', 'Téléchargés'],
          ['8', 'Favoris'],
        ].map(([n, label]) => (
          <div key={label}>
            <dt className="pf-sr">{label}</dt>
            <dd>{n}</dd>
            <span aria-hidden>{label}</span>
          </div>
        ))}
      </dl>

      {/* Sujets suivis */}
      <Section title="Sujets suivis">
        <div className="pf-chips">
          {CATEGORIES.map((category) => (
            <button
              type="button"
              key={category}
              aria-pressed={topics.includes(category)}
              className={topics.includes(category) ? 'on' : ''}
              onClick={() => toggleTopic(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </Section>

      {/* Comptes connectés */}
      <Section
        title="Comptes connectés"
        hint="Pour partager un résumé en un geste sur tes réseaux."
      >
        <div className="pf-card">
          {NETWORKS.map(({ id, name, Icon }) => {
            const on = isConnected(id);

            return (
              <Row
                key={id}
                icon={<Icon size={17} />}
                title={name}
                sub={on ? 'Connecté' : 'Non connecté'}
                right={
                  <button
                    type="button"
                    className={`pf-cn${on ? ' off' : ''}`}
                    onClick={() => toggle(id)}
                  >
                    {on ? 'Déconnecter' : 'Connecter'}
                  </button>
                }
              />
            );
          })}
        </div>
      </Section>

      {/* Préférences */}
      <Section title="Préférences">
        <div className="pf-card">
          <Row
            icon={<Moon size={17} />}
            title="Mode sombre"
            right={
              <Switch
                on={dark}
                onChange={toggleDark}
                label="Mode sombre"
              />
            }
          />

          <Row
            icon={<Bell size={17} />}
            title="Notifications"
            right={
              <Switch
                on={notifs}
                onChange={() => setNotifs((value) => !value)}
                label="Notifications"
              />
            }
          />

          <Row
            icon={<Languages size={17} />}
            title="Langue"
            right={
              <span className="pf-lang">
                Français
                <ChevronRight size={16} />
              </span>
            }
          />
        </div>
      </Section>

      <p className="pf-note">
        Aucune inscription requise. Ton identifiant anonyme est lié à cet
        appareil.
      </p>

      {/* Navigation principale AR10P */}
        <BottomNav />
    </main>
  );
}
