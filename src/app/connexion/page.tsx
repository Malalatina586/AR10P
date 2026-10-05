"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { IconUser } from "@/components/Icons";
import { createClient } from "@/lib/supabase/client";

import "../admin/(protected)/admin.css";
import "./connexion.css";

export default function ConnexionPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    const supabase = createClient();

    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (error) {
      setError("Email ou mot de passe incorrect.");
      setLoading(false);
      return;
    }

    router.push("/profil");
  }

  return (
    <div className="admin-app">
      <main className="user-login">
        <div className="admin-login-brand">
          <span className="admin-logo">AR10P</span>
          <span className="admin-label">COMPTE</span>
        </div>

        <section className="admin-login-card">
          <div className="admin-login-icon">
            <IconUser size={22} />
          </div>

          <p className="admin-eyebrow">ACCÈS À VOTRE COMPTE</p>
          <h1>Connexion</h1>
          <p className="admin-login-description">
            Connecte-toi à ton compte AR10P pour continuer.
          </p>

          <form className="admin-login-form" onSubmit={handleSubmit}>
            <label>
              <span>Email</span>
              <input
                type="email"
                name="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="Votre email"
                autoComplete="email"
                required
              />
            </label>

            <label>
              <span>Mot de passe</span>
              <input
                type="password"
                name="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Votre mot de passe"
                autoComplete="current-password"
                required
              />
            </label>

            {error && <p className="admin-login-error">{error}</p>}

            <button type="submit" disabled={loading}>
              {loading ? "Connexion..." : "Se connecter"}
            </button>
          </form>

          <Link className="admin-login-back" href="/inscription">
            Pas encore de compte ? S&apos;inscrire
          </Link>

          <Link className="admin-login-back" href="/">
            Retour à AR10P
          </Link>
        </section>
      </main>
    </div>
  );
}
