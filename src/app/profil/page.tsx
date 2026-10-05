"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Bell, ChevronRight, Languages, Moon, Settings } from "lucide-react";

import {
  NETWORKS,
  useConnectedAccounts,
  useTheme,
} from "@/lib/profile-shared";

import { CATEGORIES } from "@/lib/mock-data";
import { createClient } from "@/lib/supabase/client";

import BottomNav from "@/components/BottomNav";

import "./profil.css";

type Profile = {
  username: string | null;
  display_name: string | null;
  role: "user" | "admin";
  avatar_url: string | null;
  created_at: string;
};

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
      className={`pf-sw${on ? " on" : ""}`}
    />
  );
}

export default function ProfilPage() {
  const router = useRouter();
  const { isConnected, toggle } = useConnectedAccounts();
  const { dark, toggleDark } = useTheme();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [notifs, setNotifs] = useState(true);

  const [topics, setTopics] = useState<string[]>([
    "Business",
    "Tech",
    "Finance",
  ]);

  useEffect(() => {
    async function loadProfile() {
      const supabase = createClient();

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setLoadingProfile(false);
        return;
      }

      const { data } = await supabase
        .from("profiles")
        .select("username, display_name, role, avatar_url, created_at")
        .eq("id", user.id)
        .single();

      setProfile(data);
      setLoadingProfile(false);
    }

    loadProfile();
  }, []);

  const toggleTopic = (category: string) =>
    setTopics((current) =>
      current.includes(category)
        ? current.filter((item) => item !== category)
        : [...current, category],
    );

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
  }

  const displayName =
    profile?.display_name?.trim() || "Utilisateur AR10P";

  const avatarLetter = displayName.charAt(0).toUpperCase();

  const accountLabel =
    profile?.role === "admin" ? "Administrateur" : "Utilisateur";

  return (
    <main className="pf">
      <header className="pf-head">
        <h1>Profil</h1>

        <button className="pf-ic" aria-label="Réglages">
          <Settings size={19} />
        </button>
      </header>

      {/* Identité réelle */}
      <div className="pf-id">
        <div className="pf-av">
          {profile?.avatar_url ? (
            <img
              src={profile.avatar_url}
              alt=""
              width={68}
              height={68}
              style={{
                width: "100%",
                height: "100%",
                borderRadius: "50%",
                objectFit: "cover",
              }}
            />
          ) : (
            avatarLetter
          )}
        </div>

        <div>
          <div className="pf-nm">
            {loadingProfile ? "Chargement..." : displayName}
          </div>

          <div className="pf-sb">
            {loadingProfile
              ? "Chargement du compte..."
              : profile
                ? `${accountLabel}${profile.username ? ` · @${profile.username}` : ""}`
                : "Visiteur · non connecté"}
          </div>
        </div>
      </div>

      {/* Statistiques */}
      <dl className="pf-stats">
        {[
          ["12", "Lus"],
          ["5", "Téléchargés"],
          ["8", "Favoris"],
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
              className={topics.includes(category) ? "on" : ""}
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
                sub={on ? "Connecté" : "Non connecté"}
                right={
                  <button
                    type="button"
                    className={`pf-cn${on ? " off" : ""}`}
                    onClick={() => toggle(id)}
                  >
                    {on ? "Déconnecter" : "Connecter"}
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

      {profile ? (
        <button
          type="button"
          onClick={handleLogout}
          style={{
            width: "100%",
            marginTop: 20,
            padding: "12px 16px",
            borderRadius: 14,
            border: "1px solid var(--line)",
            background: "var(--surface)",
            color: "var(--text)",
            font: "inherit",
            fontWeight: 600,
          }}
        >
          Se déconnecter
        </button>
      ) : (
        <p className="pf-note">
          Connecte-toi ou crée un compte pour accéder aux fonctionnalités
          réservées aux utilisateurs.
        </p>
      )}

      <BottomNav />
    </main>
  );
}
