"use client";

import { useState } from "react";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { IconHeart, IconMessage, IconShare } from "./Icons";

export type Publication = {
  id: string;
  author_id: string;
  title: string;
  content: string;
  category: string;
  image_url: string | null;
  created_at: string;
  author_name: string;
  author_username: string | null;
};

type PublicationCardProps = {
  publication: Publication;
  initialLikes: number;
  initialComments: number;
  initialShares: number;
  initialLiked: boolean;
  currentUserId: string | null;
};

const MAX_PREVIEW_LENGTH = 100;

function ExpandablePublicationText({ content }: { content: string }) {
  const [open, setOpen] = useState(false);
  const isLong = content.length > MAX_PREVIEW_LENGTH;
  const preview = isLong ? `${content.slice(0, MAX_PREVIEW_LENGTH).trimEnd()}…` : content;

  return (
    <>
      <p className="post-desc">{open || !isLong ? content : preview}</p>
      {isLong && (
        <button
          type="button"
          className="see-more"
          onClick={() => setOpen((value) => !value)}
        >
          {open ? "Voir moins" : "Voir plus"}
        </button>
      )}
    </>
  );
}

const initials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

export default function PublicationCard({
  publication,
  initialLikes,
  initialComments,
  initialShares,
  initialLiked,
  currentUserId,
}: PublicationCardProps) {
  const supabase = createClient();

  const [liked, setLiked] = useState(initialLiked);
  const [likes, setLikes] = useState(initialLikes);
  const [comments, setComments] = useState(initialComments);
  const [shares, setShares] = useState(initialShares);
  const [commentOpen, setCommentOpen] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [sendingComment, setSendingComment] = useState(false);
  const [message, setMessage] = useState("");
  const [imageOpen, setImageOpen] = useState(false);

  const date = new Date(publication.created_at);

  const publishedLabel = Number.isNaN(date.getTime())
    ? ""
    : new Intl.DateTimeFormat("fr-FR", {
        day: "numeric",
        month: "short",
      }).format(date);

  async function toggleLike() {
    setMessage("");

    if (!currentUserId) {
      setMessage("Connecte-toi pour aimer cette publication.");
      return;
    }

    if (liked) {
      const { error } = await supabase
        .from("publication_likes")
        .delete()
        .eq("publication_id", publication.id)
        .eq("user_id", currentUserId);

      if (error) {
        setMessage("Impossible de modifier le J’aime.");
        return;
      }

      setLiked(false);
      setLikes((value) => Math.max(0, value - 1));
      return;
    }

    const { error } = await supabase.from("publication_likes").insert({
      publication_id: publication.id,
      user_id: currentUserId,
    });

    if (error) {
      setMessage("Impossible d’ajouter le J’aime.");
      return;
    }

    setLiked(true);
    setLikes((value) => value + 1);
  }

  async function addComment() {
    const text = commentText.trim();

    if (!currentUserId) {
      setMessage("Connecte-toi pour commenter.");
      return;
    }

    if (!text || sendingComment) return;

    setSendingComment(true);
    setMessage("");

    const { error } = await supabase.from("publication_comments").insert({
      publication_id: publication.id,
      author_id: currentUserId,
      content: text,
    });

    if (error) {
      setMessage("Impossible d’ajouter le commentaire.");
      setSendingComment(false);
      return;
    }

    setCommentText("");
    setComments((value) => value + 1);
    setSendingComment(false);
  }

  async function sharePublication() {
    setMessage("");

    const shareUrl = window.location.href;

    try {
      if (navigator.share) {
        await navigator.share({
          title: publication.title,
          text: publication.content.slice(0, 180),
          url: shareUrl,
        });
      } else {
        await navigator.clipboard.writeText(shareUrl);
      }

      if (currentUserId) {
        const { error } = await supabase
          .from("publication_shares")
          .insert({
            publication_id: publication.id,
            user_id: currentUserId,
          });

        if (!error) {
          setShares((value) => value + 1);
        }
      }

      if (!navigator.share) {
        setMessage("Lien copié.");
      }
    } catch {
      // L'utilisateur peut annuler le partage.
    }
  }

  return (
    <article className="post">
      <header className="post-head">
        <div className="avatar avatar-green">
          {initials(publication.author_name)}
        </div>

        <div className="who">
          <strong>{publication.author_name}</strong>
          <span>
            {publishedLabel} · {publication.category}
          </span>
        </div>
      </header>

      <div className="post-body">
        {publication.image_url ? (
          <button
            type="button"
            className="feed-media feed-media-portrait"
            onClick={() => setImageOpen(true)}
            aria-label="Agrandir l’image"
          >
            <Image
              src={publication.image_url}
              alt=""
              width={1080}
              height={1350}
            />
          </button>
        ) : (
          <div className="tile tile-green" aria-hidden="true">
            <b>10</b>
            <span>pages</span>
          </div>
        )}

        <div>
          <h2 className="post-title">{publication.title}</h2>
          <ExpandablePublicationText content={publication.content} />
        </div>
      </div>

      <div className="actions">
        <button
          className={`stat${liked ? " liked" : ""}`}
          onClick={() => void toggleLike()}
          aria-pressed={liked}
          aria-label="J’aime"
        >
          <IconHeart filled={liked} /> {likes}
        </button>

        <button
          className="stat"
          onClick={() => setCommentOpen((value) => !value)}
          aria-expanded={commentOpen}
          aria-label="Commentaires"
        >
          <IconMessage size={19} /> {comments}
        </button>

        <button
          className="stat"
          onClick={() => void sharePublication()}
          aria-label="Partager"
        >
          <IconShare /> {shares}
        </button>
      </div>

      {message && (
        <p className="publication-message" role="status">
          {message}
        </p>
      )}

      {commentOpen && (
        <div className="publication-comment-box">
          <textarea
            value={commentText}
            onChange={(event) => setCommentText(event.target.value)}
            placeholder="Écrire un commentaire..."
            maxLength={2000}
            rows={3}
            disabled={!currentUserId || sendingComment}
          />

          <button
            type="button"
            className="publish-submit"
            onClick={() => void addComment()}
            disabled={
              !currentUserId ||
              sendingComment ||
              !commentText.trim()
            }
          >
            {sendingComment ? "Envoi..." : "Commenter"}
          </button>
        </div>
      )}

      {imageOpen && publication.image_url && (
        <div
          className="media-lightbox"
          onClick={() => setImageOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Image agrandie"
        >
          <div
            className="media-lightbox-frame media-lightbox-portrait"
            onClick={(event) => event.stopPropagation()}
          >
            <Image
              src={publication.image_url}
              alt=""
              fill
              sizes="92vw"
              className="media-lightbox-image"
            />
          </div>
        </div>
      )}
    </article>
  );
}
