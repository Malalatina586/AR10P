"use client";

import { useState } from "react";
import Link from "next/link";
import { IconUser } from "@/components/Icons";
import { createClient } from "@/lib/supabase/client";

import "../admin/(protected)/admin.css";
import "./inscription.css";

export default function InscriptionPage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSuccess("");
      const cleanUsername = username.trim().replace(/^@+/, "").toLowerCase();
      if (!/^[a-z0-9_]{3,30}$/.test(cleanUsername)) { setError("Le username doit contenir 3 à 30 caractères : lettres minuscules, chiffres ou _."); return; }
      const birth = new Date(birthDate + "T00:00:00"); const today = new Date(); let age = today.getFullYear() - birth.getFullYear(); const monthDiff = today.getMonth() - birth.getMonth(); if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) age--; if (!birthDate || Number.isNaN(birth.getTime()) || age < 18) { setError("Vous devez avoir au moins 18 ans pour créer un compte AR10P."); return; }

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
          first_name: firstName.trim(),
          last_name: lastName.trim(),
          username: username.trim().replace(/^@+/, "").toLowerCase(),
          birth_date: birthDate,
        },
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    setSuccess("Compte créé. Vérifie ta boîte email pour confirmer ton adresse avant de te connecter.");
    setLoading(false);
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
              <span>Prénom</span>
              <input
                type="text"
                name="firstName"
                value={firstName}
                onChange={(event) => setFirstName(event.target.value)}
                placeholder="Votre prénom"
                autoComplete="given-name"
                required
              />
            </label>
            <label>
              <span>Nom</span>
              <input type="text" name="lastName" value={lastName} onChange={(event) => setLastName(event.target.value)} placeholder="Votre nom" autoComplete="family-name" required />
            </label>

            <label>
              <span>Username</span>
              <input type="text" name="username" value={username} onChange={(event) => setUsername(event.target.value)} placeholder="ex. herizo" autoComplete="username" minLength={3} maxLength={30} required />
            </label>

            <label>
              <span>Date de naissance</span>
              <input type="date" name="birthDate" value={birthDate} onChange={(event) => setBirthDate(event.target.value)} autoComplete="bday" required />
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
            {success && <p className="admin-login-success">{success}</p>}

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
