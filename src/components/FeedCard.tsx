"use client";

import Image from "next/image";
import { useState } from "react";
import { FeedItem, timeAgo } from "@/lib/mock-data";
import { IconBookmark, IconClock, IconDownload, IconHeart, IconMessage, IconShare } from "./Icons";

const initials = (name: string) => name.split(/[\s.]+/).filter(Boolean).slice(0, 2).map((w) => w[0]).join("").toUpperCase();

function ProfileAvatar({ name, avatar, tone }: { name: string; avatar?: string; tone: "blue" | "green" | "amber" }) {
  const [open, setOpen] = useState(false);
  if (!avatar) return <div className={`avatar avatar-${tone}`}>{initials(name)}</div>;
  return (
    <>
      <button type="button" className={`avatar avatar-${tone} avatar-photo`} onClick={() => setOpen(true)} aria-label={`Agrandir la photo de profil de ${name}`}>
        <Image src={avatar} alt="" width={44} height={44} />
      </button>
      {open && (
        <div className="media-lightbox" onClick={() => setOpen(false)} role="dialog" aria-modal="true" aria-label={`Photo de profil de ${name}`}>
          <div className="profile-lightbox-frame" onClick={(e) => e.stopPropagation()}>
            <Image src={avatar} alt="" fill sizes="80vw" className="profile-lightbox-image" />
          </div>
        </div>
      )}
    </>
  );
}

// Placeholder tant que l'authentification (Supabase) n'est pas branchée.
// Une fois les comptes en place, ceci ouvrira la fenêtre de connexion/inscription
// au lieu de cette alerte, sans changer le reste du composant.
function requireAccount(action: string) {
  window.alert(`Crée un compte gratuit pour ${action}.`);
}

function MediaTile({ item, tone }: { item: FeedItem; tone: "blue" | "green" }) {
  const [open, setOpen] = useState(false);

  if (item.type === "creator" && item.media?.type === "video") {
    return (
      <>
        <button type="button" className={`feed-media feed-media-${item.media.ratio} feed-video-thumb`} onClick={() => setOpen(true)} aria-label="Lire la vidéo">
          <video src={item.media.url} muted playsInline preload="metadata" aria-hidden="true" />
          <span className="video-play" aria-hidden="true">▶</span>
        </button>
        {open && (
          <div className="media-lightbox" onClick={() => setOpen(false)} role="dialog" aria-modal="true" aria-label="Lecteur vidéo">
            <div className={`media-lightbox-frame media-lightbox-${item.media.ratio}`} onClick={(e) => e.stopPropagation()}>
              <video src={item.media.url} controls autoPlay playsInline className="media-lightbox-video" />
            </div>
          </div>
        )}
      </>
    );
  }

  if (item.type === "summary" && item.media?.type === "image") {
    return (
      <>
        <button
          type="button"
          className={`feed-media feed-media-${item.media.ratio}`}
          onClick={() => setOpen(true)}
          aria-label="Agrandir l’image"
        >
          <Image src={item.media.url} alt="" width={1080} height={1350} />
        </button>

        {open && (
          <div
            className="media-lightbox"
            onClick={() => setOpen(false)}
            role="dialog"
            aria-modal="true"
            aria-label="Image agrandie"
          >
            <div
              className={`media-lightbox-frame media-lightbox-${item.media.ratio}`}
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={item.media.url}
                alt=""
                fill
                sizes="92vw"
                className="media-lightbox-image"
              />
            </div>
          </div>
        )}
      </>
    );
  }
  return (
    <div className={`tile tile-${tone}`} aria-hidden="true">
      <b>10</b>
      <span>pages</span>
    </div>
  );
}

function Actions({ item, downloads }: { item: FeedItem; downloads?: number }) {
  const [liked, setLiked] = useState(false);

  function like() {
    // J'aime nécessite un compte (comme commenter, télécharger, bibliothèque).
    requireAccount("aimer ce résumé");
  }

  return (
    <div className="actions">
      <button className={`stat${liked ? " liked" : ""}`} onClick={liked ? () => setLiked(false) : like} aria-pressed={liked} aria-label="J'aime">
        <IconHeart filled={liked} /> {item.likes}
      </button>
      <button className="stat" onClick={() => requireAccount("commenter")} aria-label="Commenter">
        <IconMessage size={19} /> {item.comments}
      </button>
      <button className="stat" aria-label="Partager"><IconShare /> {item.shares}</button>
      {downloads !== undefined && <span className="stat stat-static"><IconDownload size={19} /> {downloads}</span>}
    </div>
  );
}

function ExpandableText({ description, more }: { description: string; more?: string }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <p className="post-desc">{description}</p>
      {more && (
        <>
          {open && <p className="post-more">{more}</p>}
          <button className="see-more" onClick={() => setOpen((v) => !v)}>{open ? "Voir moins" : "Voir plus"}</button>
        </>
      )}
      {open && (
        <div className="unlock-actions">
          <button className="pill" onClick={() => requireAccount("télécharger le PDF")}><IconDownload size={18} /> Télécharger</button>
          <button className="pill pill-accent" onClick={() => requireAccount("ajouter à ta bibliothèque")}><IconBookmark size={18} /> Ajouter à la bibliothèque</button>
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
          <ProfileAvatar name={item.sponsor} avatar={item.avatar} tone="amber" />
          <div className="who"><strong>{item.sponsor}</strong><span>{item.place}</span></div>
          <span className="badge badge-amber">Sponsorisé</span>
        </header>
        <h2 className="post-title">{item.title}</h2>
        <ExpandableText description={item.description} more={item.more} />
        <a className="cta" href="#">{item.cta} →</a>
      </article>
    );
  }

  if (item.type === "creator") {
    return (
      <article className="post">
        <header className="post-head">
          <ProfileAvatar name={item.creator} avatar={item.avatar} tone="green" />
          <div className="who"><strong>{item.creator}</strong><span suppressHydrationWarning>{item.job} · {timeAgo(item.publishedAt)}</span></div>
          <span className="badge badge-green">Créateur</span>
        </header>
        <div className="post-body">
          <MediaTile item={item} tone="green" />
          <div>
            <h2 className="post-title">{item.title}</h2>
            <ExpandableText description={item.description} more={item.more} />
          </div>
        </div>
        <Actions item={item} downloads={item.downloads} />
      </article>
    );
  }

  return (
    <article className="post">
      <header className="post-head">
        <ProfileAvatar name="AR10P" avatar="/logo.png" tone="blue" />
        <div className="who"><strong>AR10P</strong><span suppressHydrationWarning>{timeAgo(item.publishedAt)} · {item.category}</span></div>
      </header>
      <div className="post-body">
        <MediaTile item={item} tone="blue" />
        <div>
          <h2 className="post-title">{item.title}</h2>
          <ExpandableText description={item.description} more={item.more} />
          <p className="reading"><IconClock /> {item.readingMinutes} min de lecture</p>
        </div>
      </div>
      <Actions item={item} />
    </article>
  );
}
