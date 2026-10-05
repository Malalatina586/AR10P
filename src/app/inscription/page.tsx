"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { IconUser } from "@/components/Icons";
import { createClient } from "@/lib/supabase/client";

import "../admin/(protected)/admin.css";
import "./inscription.css";

export default function InscriptionPage() {
  const router = useRouter();
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    setLoading(true);

    const supabase = createClient();

    const { error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: {
          display_name: displayName.trim(),
        },
      },
    });

    if (error) {
      setError(error.message);
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

          <p className="admin-eyebrow">CRÉATION DE COMPTE</p>
          <h1>Inscription</h1>
          <p className="admin-login-description">
            Crée ton compte AR10P pour accéder à toutes les fonctionnalités.
          </p>

          <form className="admin-login-form" onSubmit={handleSubmit}>
            <label>
              <span>Nom</span>
              <input
                type="text"
                name="displayName"
                value={displayName}
                onChange={(event) => setDisplayName(event.target.value)}
                placeholder="Votre nom"
                autoComplete="name"
                required
              />
            </label>

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
                autoComplete="new-password"
                minLength={6}
                required
              />
            </label>

            <label>
              <span>Confirmer le mot de passe</span>
              <input
                type="password"
                name="confirmPassword"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                placeholder="Confirmez votre mot de passe"
                autoComplete="new-password"
                minLength={6}
                required
              />
            </label>

            {error && <p className="admin-login-error">{error}</p>}

            <button type="submit" disabled={loading}>
              {loading ? "Création..." : "Créer mon compte"}
            </button>
          </form>

          <Link className="admin-login-back" href="/connexion">
            Déjà un compte ? Se connecter
          </Link>

          <Link className="admin-login-back" href="/">
            Retour à AR10P
          </Link>
        </section>
      </main>
    </div>
  );
}
