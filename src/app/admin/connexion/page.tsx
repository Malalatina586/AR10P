"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { IconLock } from "@/components/Icons";
import { createClient } from "@/lib/supabase/client";

import "../(protected)/admin.css";
import "./connexion.css";

export default function AdminConnexion() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [secret, setSecret] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    const supabase = createClient();

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password: secret,
    });

    if (error) {
      setError("Email ou code secret incorrect.");
      setLoading(false);
      return;
    }

    router.push("/admin");
  }

  return (
    <div className="admin-app">
      <main className="admin-login">
        <div className="admin-login-brand">
          <span className="admin-logo">AR10P</span>
          <span className="admin-label">ADMIN</span>
        </div>

        <section className="admin-login-card">
          <div className="admin-login-icon">
            <IconLock size={22} />
          </div>

          <p className="admin-eyebrow">ACCÈS ADMINISTRATEUR</p>
          <h1>Connexion</h1>
          <p className="admin-login-description">
            Accédez au centre de contrôle d&apos;AR10P.
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
              <span>Code secret</span>
              <input
                type="password"
                name="secret"
                value={secret}
                onChange={(event) => setSecret(event.target.value)}
                placeholder="Votre code secret"
                autoComplete="current-password"
                required
              />
            </label>

            {error && <p className="admin-login-error">{error}</p>}

            <button type="submit" disabled={loading}>
              {loading ? "Connexion..." : "Accéder au Dashboard"}
            </button>
          </form>

          <Link className="admin-login-back" href="/">
            Retour à AR10P
          </Link>
        </section>
      </main>
    </div>
  );
}
