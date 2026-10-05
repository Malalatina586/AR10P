"use client";

import { useEffect, useMemo, useState } from "react";
import BottomNav from "@/components/BottomNav";
import {
  getCurrentUser,
  getMyConversations,
  getProfile,
  getMessages,
  sendMessage as sendSupabaseMessage,
  type ConversationRow,
  type MessageRow,
  type Profile,
} from "@/lib/messaging";
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
  online?: boolean;
  official?: boolean;
  otherUserId: string;
};

type Message = {
  id: string;
  from: "me" | "them";
  text: string;
  time: string;
  read?: boolean;
};

function formatTime(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatConversationTime(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const now = new Date();
  const sameDay =
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate();

  if (sameDay) {
    return formatTime(value);
  }

  return date.toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
  });
}

function getDisplayName(profile: Profile | null, fallback = "Utilisateur") {
  return (
    profile?.display_name?.trim() ||
    profile?.username?.trim() ||
    fallback
  );
}

function getInitials(name: string) {
  const parts = name
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (parts.length === 0) {
    return "U";
  }

  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }

  return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
}

export default function MessagesPage() {
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messagesByConversation, setMessagesByConversation] = useState<
    Record<string, Message[]>
  >({});
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [draft, setDraft] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selected =
    conversations.find((item) => item.id === selectedId) ?? null;

  const filteredConversations = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return conversations;
    }

    return conversations.filter(
      (conversation) =>
        conversation.name.toLowerCase().includes(query) ||
        conversation.preview.toLowerCase().includes(query),
    );
  }, [conversations, search]);

  const messages = selected
    ? messagesByConversation[selected.id] ?? []
    : [];

  useEffect(() => {
    let cancelled = false;

    async function loadConversations() {
      try {
        setLoading(true);
        setError(null);

        const user = await getCurrentUser();

        if (!user) {
          throw new Error("NOT_AUTHENTICATED");
        }

        const rows = await getMyConversations(user.id);

        const loaded = await Promise.all(
          rows.map(async (conversation: ConversationRow) => {
            const otherUserId =
              conversation.user_a_id === user.id
                ? conversation.user_b_id
                : conversation.user_a_id;

            const profile = await getProfile(otherUserId);
            const name = getDisplayName(profile);

            return {
              id: conversation.id,
              name,
              initials: getInitials(name),
              preview: "Conversation",
              time: formatConversationTime(conversation.updated_at),
              official: profile?.role === "admin",
              otherUserId,
            };
          }),
        );

        if (cancelled) {
          return;
        }

        setCurrentUserId(user.id);
        setConversations(loaded);
      } catch (loadError) {
        if (cancelled) {
          return;
        }

        console.error("Erreur chargement Messages:", loadError);
        setError("Impossible de charger les conversations.");
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadConversations();

    return () => {
      cancelled = true;
    };
  }, []);

  async function openConversation(id: string) {
    setSelectedId(id);
    setDraft("");
    setError(null);

    if (messagesByConversation[id]) {
      return;
    }

    try {
      setLoadingMessages(true);

      const loadedMessages = await getMessages(id);

      setMessagesByConversation((current) => ({
        ...current,
        [id]: loadedMessages.map((message: MessageRow) => ({
          id: message.id,
          from: message.sender_id === currentUserId ? "me" : "them",
          text: message.body,
          time: formatTime(message.created_at),
          read: Boolean(message.read_at),
        })),
      }));
    } catch (loadError) {
      console.error("Erreur chargement messages:", loadError);
      setError("Impossible de charger cette conversation.");
    } finally {
      setLoadingMessages(false);
    }
  }

  function closeConversation() {
    setSelectedId(null);
    setDraft("");
    setError(null);
  }

  async function sendMessage() {
    const text = draft.trim();

    if (!text || !selected || sending) {
      return;
    }

    try {
      setSending(true);
      setError(null);

      const messageId = await sendSupabaseMessage(selected.id, text);

      const message: Message = {
        id: messageId,
        from: "me",
        text,
        time: formatTime(new Date().toISOString()),
        read: false,
      };

      setMessagesByConversation((current) => ({
        ...current,
        [selected.id]: [...(current[selected.id] ?? []), message],
      }));

      setConversations((current) =>
        current.map((conversation) =>
          conversation.id === selected.id
            ? {
                ...conversation,
                preview: text,
                time: formatTime(new Date().toISOString()),
              }
            : conversation,
        ),
      );

      setDraft("");
    } catch (sendError) {
      console.error("Erreur envoi message:", sendError);
      setError("Impossible d'envoyer le message.");
    } finally {
      setSending(false);
    }
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

          {error && (
            <p role="alert" style={{ padding: "0 18px" }}>
              {error}
            </p>
          )}

          {loading ? (
            <div className="conversation-list">
              <div className="conversation-item">
                <div className="conversation-content">
                  <strong>Chargement des conversations...</strong>
                </div>
              </div>
            </div>
          ) : filteredConversations.length === 0 ? (
            <div className="conversation-list">
              <div className="conversation-item">
                <div className="conversation-content">
                  <div className="conversation-heading">
                    <strong>Aucune conversation</strong>
                  </div>
                  <div className="conversation-preview">
                    <span>
                      Tes conversations réelles apparaîtront ici.
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="conversation-list">
              {filteredConversations.map((conversation) => (
                <button
                  key={conversation.id}
                  className="conversation-item"
                  onClick={() => void openConversation(conversation.id)}
                  type="button"
                >
                  <div className="conversation-avatar">
                    {conversation.initials}
                    {conversation.online && (
                      <span className="online-dot" />
                    )}
                  </div>

                  <div className="conversation-content">
                    <div className="conversation-heading">
                      <strong>
                        {conversation.name}
                        {conversation.official && (
                          <span className="official-badge">
                            OFFICIEL
                          </span>
                        )}
                      </strong>
                      <span>{conversation.time}</span>
                    </div>

                    <div className="conversation-preview">
                      <span>{conversation.preview}</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
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
                </div>

                <div>
                  <strong>{selected.name}</strong>
                  <span>
                    {selected.official
                      ? "Compte officiel AR10P"
                      : "Conversation"}
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
              <div className="chat-date">Messages</div>

              {error && (
                <p role="alert" style={{ padding: "0 18px" }}>
                  {error}
                </p>
              )}

              {loadingMessages ? (
                <div className="chat-date">
                  Chargement des messages...
                </div>
              ) : messages.length === 0 ? (
                <div className="chat-date">
                  Aucun message pour le moment.
                </div>
              ) : (
                messages.map((message) => (
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
                ))
              )}

              {selected.official && (
                <article className="shared-summary">
                  <div className="shared-summary-icon">
                    <IconBookmark />
                  </div>

                  <div>
                    <span className="shared-summary-label">
                      RÉSUMÉ AR10P
                    </span>
                    <strong>Bibliothèque AR10P</strong>
                    <p>
                      Les contenus officiels AR10P pourront être
                      partagés ici.
                    </p>
                    <button type="button">Voir la bibliothèque</button>
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
                    void sendMessage();
                  }
                }}
                placeholder="Écrire un message..."
                aria-label="Écrire un message"
                disabled={sending}
              />

              <button
                className="send-button"
                onClick={() => void sendMessage()}
                aria-label="Envoyer le message"
                type="button"
                disabled={sending}
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
