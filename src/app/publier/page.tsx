"use client";

import Link from "next/link";
import Image from "next/image";
import { useMemo, useState } from "react";
import { CATEGORIES } from "@/lib/mock-data";
import { createClient } from "@/lib/supabase/client";

type Step = "form" | "preview";

export default function PublierPage() {
  const supabase = useMemo(() => createClient(), []);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [step, setStep] = useState<Step>("form");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  function validateForm() {
    if (!title.trim()) {
      setMessage("Ajoute un titre.");
      return false;
    }

    if (!content.trim()) {
      setMessage("Ajoute le contenu de ta publication.");
      return false;
    }

    if (!category) {
      setMessage("Choisis une catégorie.");
      return false;
    }

    return true;
  }

  function handlePreview(e: React.FormEvent) {
    e.preventDefault();
    setMessage("");

    if (!validateForm()) return;

    setStep("preview");
  }

  async function publish() {
    if (loading) return;

    setMessage("");
    setLoading(true);

    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        setMessage("Connecte-toi pour publier.");
        return;
      }

      let imageUrl: string | null = null;

      if (image) {
        const extension = image.name.split(".").pop()?.toLowerCase() || "jpg";
        const filePath = `${user.id}/${crypto.randomUUID()}.${extension}`;

        const { error: uploadError } = await supabase.storage
          .from("publication-images")
          .upload(filePath, image, {
            cacheControl: "3600",
            upsert: false,
          });

        if (uploadError) {
          setMessage(`Impossible d'envoyer l'image : ${uploadError.message}`);
          return;
        }

        const {
          data: { publicUrl },
        } = supabase.storage
          .from("publication-images")
          .getPublicUrl(filePath);

        imageUrl = publicUrl;
      }

      const { error: insertError } = await supabase
        .from("publications")
        .insert({
          author_id: user.id,
          title: title.trim(),
          content: content.trim(),
          category,
          image_url: imageUrl,
          status: "pending",
        });

      if (insertError) {
        setMessage(`Impossible de publier : ${insertError.message}`);
        return;
      }

      setTitle("");
      setContent("");
      setCategory("");
      setImage(null);
      setStep("form");

      setMessage(
        "Publication envoyée. Elle sera vérifiée automatiquement avant d'apparaître dans le Fil."
      );
    } catch {
      setMessage("Une erreur inattendue est survenue.");
    } finally {
      setLoading(false);
    }
  }

  if (step === "preview") {
    return (
      <main className="publish-page">
        <header className="publish-head">
          <button
            type="button"
            className="publish-back"
            onClick={() => setStep("form")}
            aria-label="Modifier la publication"
          >
            ←
          </button>
          <h1>Prévisualisation</h1>
        </header>

        <section className="publish-preview">
          <div className="publish-preview-label">APERÇU DU POST</div>

          <article className="publish-preview-card">
            {image && (
              <Image
                src={URL.createObjectURL(image)}
                alt=""
                width={1080}
                height={1350}
                className="publish-preview-image"
              />
            )}

            <div className="publish-preview-content">
              <span className="publish-preview-category">{category}</span>
              <h2>{title}</h2>
              <p>{content}</p>
            </div>
          </article>

          {message && (
            <p className="publish-error" role="alert">
              {message}
            </p>
          )}

          <div className="publish-preview-actions">
            <button
              type="button"
              className="publish-secondary"
              onClick={() => setStep("form")}
              disabled={loading}
            >
              Modifier
            </button>

            <button
              type="button"
              className="publish-submit"
              onClick={() => void publish()}
              disabled={loading}
            >
              {loading ? "Publication..." : "Confirmer la publication"}
            </button>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="publish-page">
      <header className="publish-head">
        <Link href="/" className="publish-back" aria-label="Retour au fil">
          ←
        </Link>
        <h1>Créer une publication</h1>
      </header>

      <form className="publish-form" onSubmit={handlePreview}>
        <div className="publish-intro">
          <h2>Partager avec la communauté</h2>
          <p>
            Crée une publication utile, claire et adaptée à la communauté AR10P.
          </p>
        </div>

        <label className="publish-field">
          <span>Titre</span>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Titre de ta publication"
            maxLength={120}
          />
        </label>

        <label className="publish-field">
          <span>Contenu</span>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Écris ton contenu ici..."
            rows={8}
            maxLength={5000}
          />
          <small>{content.length}/5000</small>
        </label>

        <label className="publish-field">
          <span>Catégorie</span>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">Choisir une catégorie</option>
            {CATEGORIES.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>

        <label className="publish-upload">
          <span>Image</span>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files?.[0] ?? null)}
          />
          {image && <small>{image.name}</small>}
        </label>

        <div className="publish-info">
          <strong>Avant publication</strong>
          <p>
            Ta publication sera enregistrée puis vérifiée automatiquement.
            Seules les publications approuvées apparaîtront dans le Fil.
          </p>
        </div>

        {message && (
          <p className="publish-error" role="alert">
            {message}
          </p>
        )}

        <button type="submit" className="publish-submit">
          Prévisualiser
        </button>
      </form>
    </main>
  );
}
