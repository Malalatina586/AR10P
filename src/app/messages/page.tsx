"use client";
import Link from "next/link";

import { useMemo, useState } from "react";
import {
  IconBell,
  IconBookmark,
  IconClock,
  IconMessage,
  IconSearch,
  IconSend,
  IconSmartHome,
  IconStackPlus,
  IconUserTabler,
  IconMessages,
} from "@/components/Icons";

type Conversation = {
  id: string;
  name: string;
  initials: string;
  preview: string;
  time: string;
  unread?: number;
  online?: boolean;
  official?: boolean;
};

const CONVERSATIONS: Conversation[] = [
  {
    id: "ar10p",
    name: "AR10P",
    initials: "AR",
    preview: "Nouveau : Finance personnelle en 10 pages",
    time: "2 min",
    unread: 2,
    official: true,
  },
  {
    id: "miora",
    name: "Miora",
    initials: "MI",
    preview: "Tu as lu le résumé sur l'IA ?",
    time: "18 min",
    unread: 1,
    online: true,
  },
  {
    id: "club",
    name: "Club lecture",
    initials: "CL",
    preview: "Je propose le prochain thème",
    time: "1 h",
  },
  {
    id: "lala",
    name: "Lala",
    initials: "LA",
    preview: "Merci pour le résumé !",
    time: "Hier",
    online: true,
  },
];

const MESSAGES: Record<string, { from: "me" | "them"; text: string; time: string }[]> = {
  ar10p: [
    {
      from: "them",
      text: "Bienvenue sur AR10P 👋",
      time: "10:24",
    },
    {
      from: "them",
      text: "Ton nouveau résumé est disponible : Finance personnelle en 10 pages.",
      time: "10:25",
    },
    {
      from: "me",
      text: "Parfait, je vais le lire.",
      time: "10:27",
    },
  ],
  miora: [
    {
      from: "them",
      text: "Tu as lu le résumé sur l'IA ?",
      time: "18:02",
    },
    {
      from: "me",
      text: "Pas encore, mais il est dans ma bibliothèque.",
      time: "18:05",
    },
  ],
  club: [
    {
      from: "them",
      text: "Je propose le prochain thème : les grands entrepreneurs.",
      time: "17:12",
    },
  ],
  lala: [
    {
      from: "them",
      text: "Merci pour le résumé !",
      time: "Hier",
    },
  ],
};

export default function MessagesPage() {
  const [selectedId, setSelectedId] = useState("ar10p");
  const [search, setSearch] = useState("");
  const [draft, setDraft] = useState("");

  const selected = CONVERSATIONS.find((item) => item.id === selectedId) ?? CONVERSATIONS[0];

  const filteredConversations = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return CONVERSATIONS;

    return CONVERSATIONS.filter(
      (conversation) =>
        conversation.name.toLowerCase().includes(query) ||
        conversation.preview.toLowerCase().includes(query),
    );
  }, [search]);

  const messages = MESSAGES[selected.id] ?? [];

  function sendMessage() {
    if (!draft.trim()) return;
    setDraft("");
  }

  return (
    <div className="app-shell messages-page">
      <header className="topbar messages-topbar">
        <div>
          <p className="eyebrow">AR10P</p>
          <h1>Messages</h1>
          <p>Discute, partage et découvre de nouveaux résumés.</p>
        </div>

        <button className="messages-icon-button" aria-label="Notifications">
          <IconBell />
        </button>
      </header>

      <main className="messages-layout">
        <section className="messages-inbox">
          <div className="messages-search">
            <IconSearch size={18} />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Rechercher une conversation"
              aria-label="Rechercher une conversation"
            />
          </div>

          <div className="messages-section-title">
            <span>Conversations</span>
            <span>{filteredConversations.length}</span>
          </div>

          <div className="conversation-list">
            {filteredConversations.map((conversation) => (
              <button
                key={conversation.id}
                className={`conversation-item ${
                  selected.id === conversation.id ? "active" : ""
                }`}
                onClick={() => setSelectedId(conversation.id)}
              >
                <div className="conversation-avatar">
                  {conversation.initials}
                  {conversation.online && <span className="online-dot" />}
                </div>

                <div className="conversation-content">
                  <div className="conversation-heading">
                    <strong>
                      {conversation.name}
                      {conversation.official && <span className="official-badge">OFFICIEL</span>}
                    </strong>
                    <span>{conversation.time}</span>
                  </div>

                  <div className="conversation-preview">
                    <span>{conversation.preview}</span>
                    {conversation.unread ? (
                      <b className="unread-badge">{conversation.unread}</b>
                    ) : null}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </section>

        <section className="chat-panel" aria-label={`Conversation avec ${selected.name}`}>
          <div className="chat-header">
            <div className="chat-person">
              <div className="conversation-avatar large">
                {selected.initials}
                {selected.online && <span className="online-dot" />}
              </div>

              <div>
                <strong>{selected.name}</strong>
                <span>
                  {selected.official
                    ? "Compte officiel AR10P"
                    : selected.online
                      ? "En ligne"
                      : "Dernière activité récente"}
                </span>
              </div>
            </div>

            <button className="messages-icon-button" aria-label="Informations">
              <IconMessage />
            </button>
          </div>

          <div className="chat-body">
            <div className="chat-date">Aujourd&apos;hui</div>

            {messages.map((message, index) => (
              <div
                key={`${message.time}-${index}`}
                className={`message-row ${message.from === "me" ? "mine" : ""}`}
              >
                <div className="message-bubble">
                  <p>{message.text}</p>
                  <span>
                    <IconClock />
                    {message.time}
                  </span>
                </div>
              </div>
            ))}

            {selected.id === "ar10p" && (
              <article className="shared-summary">
                <div className="shared-summary-icon">
                  <IconBookmark />
                </div>
                <div>
                  <span className="shared-summary-label">RÉSUMÉ PARTAGÉ</span>
                  <strong>Finance personnelle en 10 pages</strong>
                  <p>Les principes essentiels pour mieux gérer son argent.</p>
                  <button>Lire le résumé</button>
                </div>
              </article>
            )}
          </div>

          <div className="chat-composer">
            <input
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") sendMessage();
              }}
              placeholder="Écrire un message..."
              aria-label="Écrire un message"
            />
            <button
              className="send-button"
              onClick={sendMessage}
              aria-label="Envoyer le message"
            >
              <IconSend />
            </button>
          </div>
        </section>
      </main>

      <nav className="tabbar" aria-label="Navigation principale">
        <Link className="tab" href="/" aria-label="Fil">
          <IconSmartHome />
        </Link>

        <button className="tab active" aria-current="page" aria-label="Messages">
          <IconMessages />
        </button>

        <a className="tab" href="/bibliotheque" aria-label="Bibliothèque">
          <IconStackPlus />
        </a>

        <button
          className="tab"
          disabled
          title="Bientôt — nécessite un compte"
          aria-label="Profil (bientôt)"
        >
          <IconUserTabler />
        </button>
      </nav>
    </div>
  );
}
