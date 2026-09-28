"use client";

import { useState } from "react";
import { FeedItem, timeAgo } from "@/lib/mock-data";
import {
  IconClock,
  IconComment,
  IconDownload,
  IconHeart,
  IconSend,
  IconShare,
} from "./Icons";

const initials = (name: string) =>
  name
    .split(/[\s.]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

function Tile({ tone }: { tone: "blue" | "green" }) {
  return (
    <div className={`tile tile-${tone}`} aria-hidden="true">
      <b>10</b>
      <span>pages</span>
    </div>
  );
}

function Actions({ item, extra }: { item: FeedItem; extra: React.ReactNode }) {
  const [liked, setLiked] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([
    "Très intéressant !",
    "Merci pour ce résumé.",
  ]);

  const publishComment = () => {
    const text = comment.trim();
    if (!text) return;
    setComments((current) => [...current, text]);
    setComment("");
  };

  return (
    <>
      <div className="actions">
        <button
          className={`stat${liked ? " liked" : ""}`}
          onClick={() => setLiked((v) => !v)}
          aria-pressed={liked}
          aria-label="J'aime"
        >
          <IconHeart filled={liked} /> {item.likes + (liked ? 1 : 0)}
        </button>
        <button
          className="stat"
          onClick={() => setShowComments((v) => !v)}
          aria-expanded={showComments}
          aria-label="Commenter"
        >
          <IconComment /> {comments.length}
        </button>
        <button className="stat" aria-label="Partager">
          <IconShare /> {item.shares}
        </button>
        <div className="spacer" />
        {extra}
      </div>
      {showComments && (
        <div className="comments">
          <div className="comments-title">Commentaires</div>
          {comments.map((text, index) => (
            <div className="comment" key={`${index}-${text}`}>
              {text}
            </div>
          ))}
          <div className="comment-form">
            <input
              value={comment}
              onChange={(event) => setComment(event.target.value)}
              placeholder="Écrire un commentaire…"
              aria-label="Écrire un commentaire"
            />
            <button type="button" onClick={publishComment}>
              Publier
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default function FeedCard({ item }: { item: FeedItem }) {
  if (item.type === "sponsored") {
    return (
      <article className="post post-sponsored">
        <header className="post-head">
          <div className="avatar avatar-amber">{initials(item.sponsor)}</div>
          <div className="who">
            <strong>{item.sponsor}</strong>
            <span>{item.place}</span>
          </div>
          <span className="badge badge-amber">Sponsorisé</span>
        </header>
        <h2 className="post-title">{item.title}</h2>
        <p className="post-desc">{item.description}</p>
        <a className="cta" href="#">
          {item.cta} →
        </a>
      </article>
    );
  }

  if (item.type === "creator") {
    return (
      <article className="post">
        <header className="post-head">
          <div className="avatar avatar-green">{initials(item.creator)}</div>
          <div className="who">
            <strong>{item.creator}</strong>
            <span>
              {item.job} · {timeAgo(item.publishedAt)}
            </span>
          </div>
          <span className="badge badge-green">Créateur</span>
        </header>
        <div className="post-body">
          <Tile tone="green" />
          <div>
            <h2 className="post-title">{item.title}</h2>
            <p className="post-desc">{item.description}</p>
          </div>
        </div>
        <Actions
          item={item}
          extra={
            <span className="stat">
              <IconDownload size={20} /> {item.downloads}
            </span>
          }
        />
      </article>
    );
  }

  return (
    <article className="post">
      <header className="post-head">
        <div className="avatar avatar-blue">AR</div>
        <div className="who">
          <strong>AR10P</strong>
          <span>
            {timeAgo(item.publishedAt)} · {item.category}
          </span>
        </div>
      </header>
      <div className="post-body">
        <Tile tone="blue" />
        <div>
          <h2 className="post-title">{item.title}</h2>
          <p className="post-desc">{item.description}</p>
          <p className="reading">
            <IconClock /> {item.readingMinutes} min de lecture
          </p>
        </div>
      </div>
      <Actions
        item={item}
        extra={
          <>
            <button className="pill">
              <IconDownload size={18} /> PDF
            </button>
            <button className="pill pill-accent">
              <IconSend /> Telegram
            </button>
          </>
        }
      />
    </article>
  );
}
