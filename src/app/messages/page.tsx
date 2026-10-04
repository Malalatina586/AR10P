"use client";

import { useMemo, useState } from "react";
import BottomNav from "@/components/BottomNav";
import {

  IconBookmark,
  IconClock,
  IconMessage,
  IconSearch,
  IconSend,
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

type Message = {
  id: string;
  from: "me" | "them";
  text: string;
  time: string;
  read?: boolean;
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

const INITIAL_MESSAGES: Record<string, Message[]> = {
  ar10p: [
    {
      id: "ar10p-1",
      from: "them",
      text: "Bienvenue sur AR10P 👋",
      time: "10:24",
      read: true,
    },
    {
      id: "ar10p-2",
      from: "them",
      text: "Ton nouveau résumé est disponible : Finance personnelle en 10 pages.",
      time: "10:25",
      read: true,
    },
    {
      id: "ar10p-3",
      from: "me",
      text: "Parfait, je vais le lire.",
      time: "10:27",
      read: true,
    },
  ],
  miora: [
    {
      id: "miora-1",
      from: "them",
      text: "Tu as lu le résumé sur l'IA ?",
      time: "18:02",
      read: true,
    },
    {
      id: "miora-2",
      from: "me",
      text: "Pas encore, mais il est dans ma bibliothèque.",
      time: "18:05",
      read: true,
    },
  ],
  club: [
    {
      id: "club-1",
      from: "them",
      text: "Je propose le prochain thème : les grands entrepreneurs.",
      time: "17:12",
      read: true,
    },
  ],
  lala: [
    {
      id: "lala-1",
      from: "them",
      text: "Merci pour le résumé !",
      time: "Hier",
      read: false,
    },
  ],
};

export default function MessagesPage() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [draft, setDraft] = useState("");
  const [messagesByConversation, setMessagesByConversation] =
    useState(INITIAL_MESSAGES);

  const selected = CONVERSATIONS.find((item) => item.id === selectedId) ?? null;

  const filteredConversations = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return CONVERSATIONS;

    return CONVERSATIONS.filter(
      (conversation) =>
        conversation.name.toLowerCase().includes(query) ||
        conversation.preview.toLowerCase().includes(query),
    );
  }, [search]);

  const messages = selected
    ? messagesByConversation[selected.id] ?? []
    : [];

  function openConversation(id: string) {
    setSelectedId(id);
    setDraft("");

    setMessagesByConversation((current) => current);
  }

  function closeConversation() {
    setSelectedId(null);
    setDraft("");
  }

  function sendMessage() {
    const text = draft.trim();

    if (!text || !selected) return;

    const now = new Date();

    const time = now.toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    });

    const message: Message = {
      id: `${selected.id}-${Date.now()}`,
      from: "me",
      text,
      time,
      read: false,
    };

    setMessagesByConversation((current) => ({
      ...current,
      [selected.id]: [...(current[selected.id] ?? []), message],
    }));

    setDraft("");
  }

  return (
    <div className="app-shell messages-page">

      {!selected ? (
        <main className="messages-inbox messages-inbox-full">
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
                className="conversation-item"
                onClick={() => openConversation(conversation.id)}
                type="button"
              >
                <div className="conversation-avatar">
                  {conversation.initials}
                  {conversation.online && <span className="online-dot" />}
                </div>

                <div className="conversation-content">
                  <div className="conversation-heading">
                    <strong>
                      {conversation.name}
                      {conversation.official && (
                        <span className="official-badge">OFFICIEL</span>
                      )}
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
        </main>
      ) : (
        <main className="message-conversation">
          <section
            className="chat-panel"
            aria-label={`Conversation avec ${selected.name}`}
          >
            <div className="chat-header">
              <div className="chat-person">
                <button
                  className="conversation-back"
                  onClick={closeConversation}
                  aria-label="Retour aux conversations"
                  type="button"
                >
                  ←
                </button>

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

              <button
                className="messages-icon-button"
                aria-label="Informations"
                type="button"
              >
                <IconMessage />
              </button>
            </div>

            <div className="chat-body">
              <div className="chat-date">Aujourd&apos;hui</div>

              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`message-row ${
                    message.from === "me" ? "mine" : ""
                  }`}
                >
                  <div className="message-bubble">
                    <p>{message.text}</p>
                    <span>
                      <IconClock />
                      {message.time}
                      {message.from === "me" && (
                        <span className="message-read">
                          {message.read ? "✓✓" : "✓"}
                        </span>
                      )}
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
                    <span className="shared-summary-label">
                      RÉSUMÉ PARTAGÉ
                    </span>
                    <strong>Finance personnelle en 10 pages</strong>
                    <p>
                      Les principes essentiels pour mieux gérer son argent.
                    </p>
                    <button type="button">Lire le résumé</button>
                  </div>
                </article>
              )}
            </div>

            <div className="chat-composer">
              <input
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    sendMessage();
                  }
                }}
                placeholder="Écrire un message..."
                aria-label="Écrire un message"
              />

              <button
                className="send-button"
                onClick={sendMessage}
                aria-label="Envoyer le message"
                type="button"
              >
                <IconSend />
              </button>
            </div>
          </section>
        </main>
      )}

      <BottomNav />
    </div>
  );
}
