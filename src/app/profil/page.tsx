'use client';

/**
 * AR10P — Page Profil (sans Tailwind, utilise les variables de globals.css)
 * Emplacement : src/app/profil/page.tsx  (+ profil.css à côté)
 */

import { useState } from 'react';
import { Bell, Briefcase, ChevronRight, Coins, Cpu, Film, Landmark, Languages, Moon, Settings } from 'lucide-react';
import { NETWORKS, useConnectedAccounts, useTheme } from '@/lib/profile-shared';
import './profil.css';

const TOPICS = [
  { id: 'business', label: 'Business', Icon: Briefcase },
  { id: 'tech', label: 'Tech', Icon: Cpu },
  { id: 'histoire', label: 'Histoire', Icon: Landmark },
  { id: 'finance', label: 'Finance', Icon: Coins },
  { id: 'culture', label: 'Culture', Icon: Film },
];

function Section({ title, hint, children }: { title: string; hint?: string; children: React.ReactNode }) {
  return (
    <section className="pf-sec">
      <h2>{title}</h2>
      {hint && <p className="pf-hint">{hint}</p>}
      {children}
    </section>
  );
}

function Row({ icon, title, sub, right }: {
  icon: React.ReactNode; title: string; sub?: string; right?: React.ReactNode;
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

function Switch({ on, onChange, label }: { on: boolean; onChange: () => void; label: string }) {
  return (
    <button role="switch" aria-checked={on} aria-label={label} onClick={onChange}
      className={`pf-sw${on ? ' on' : ''}`} />
  );
}

export default function ProfilPage() {
  const { isConnected, toggle } = useConnectedAccounts();
  const { dark, toggleDark } = useTheme();
  const [topics, setTopics] = useState<string[]>(['business', 'tech', 'finance']);
  const [notifs, setNotifs] = useState(true);

  const toggleTopic = (id: string) =>
    setTopics((t) => (t.includes(id) ? t.filter((x) => x !== id) : [...t, id]));

  return (
    <main className="pf">
      <header className="pf-head">
        <h1>Profil</h1>
        <button className="pf-ic" aria-label="Réglages"><Settings size={19} /></button>
      </header>

      {/* Identité anonyme (données de démo : à remplacer par ton identifiant réel) */}
      <div className="pf-id">
        <div className="pf-av">L</div>
        <div>
          <div className="pf-nm">Lecteur #4821</div>
          <div className="pf-sb">Sans compte · gratuit</div>
        </div>
      </div>

      {/* Statistiques (démo) */}
      <dl className="pf-stats">
        {[['12', 'Lus'], ['5', 'Téléchargés'], ['8', 'Favoris']].map(([n, l]) => (
          <div key={l}>
            <dt className="pf-sr">{l}</dt>
            <dd>{n}</dd>
            <span aria-hidden>{l}</span>
          </div>
        ))}
      </dl>

      <Section title="Sujets suivis">
        <div className="pf-chips">
          {TOPICS.map(({ id, label, Icon }) => (
            <button key={id} aria-pressed={topics.includes(id)}
              className={topics.includes(id) ? 'on' : ''} onClick={() => toggleTopic(id)}>
              <Icon size={15} /> {label}
            </button>
          ))}
        </div>
      </Section>

      <Section title="Comptes connectés" hint="Pour partager un résumé en un geste sur tes réseaux.">
        <div className="pf-card">
          {NETWORKS.map(({ id, name, Icon }) => {
            const on = isConnected(id);
            return (
              <Row key={id} icon={<Icon size={17} />} title={name}
                sub={on ? 'Connecté' : 'Non connecté'}
                right={
                  <button className={`pf-cn${on ? ' off' : ''}`} onClick={() => toggle(id)}>
                    {on ? 'Déconnecter' : 'Connecter'}
                  </button>
                } />
            );
          })}
        </div>
      </Section>

      <Section title="Préférences">
        <div className="pf-card">
          <Row icon={<Moon size={17} />} title="Mode sombre"
            right={<Switch on={dark} onChange={toggleDark} label="Mode sombre" />} />
          <Row icon={<Bell size={17} />} title="Notifications"
            right={<Switch on={notifs} onChange={() => setNotifs((n) => !n)} label="Notifications" />} />
          <Row icon={<Languages size={17} />} title="Langue"
            right={<span className="pf-lang">Français <ChevronRight size={16} /></span>} />
        </div>
      </Section>

      <p className="pf-note">Aucune inscription requise. Ton identifiant anonyme est lié à cet appareil.</p>
    </main>
  );
}
