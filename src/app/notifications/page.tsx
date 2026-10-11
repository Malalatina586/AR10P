"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import BottomNav from "@/components/BottomNav";
import { supabase, getCurrentUser } from "@/lib/messaging";

type NotificationRow = {
  id: string;
  actor_id: string;
  type: "message" | "comment" | "like" | "follow";
  conversation_id: string | null;
  publication_id: string | null;
  created_at: string;
  read_at: string | null;
};

type Actor = {
  id: string;
  username: string | null;
  display_name: string | null;
};

type NotificationItem = NotificationRow & {
  actor: Actor | null;
};

function notificationText(item: NotificationItem) {
  const name =
    item.actor?.display_name?.trim() ||
    item.actor?.username?.trim() ||
    "Un utilisateur";

  switch (item.type) {
    case "message":
      return `${name} vous a envoyé un message.`;
    case "comment":
      return `${name} a commenté une publication.`;
    case "like":
      return `${name} aime une publication.`;
    case "follow":
      return `${name} vous suit maintenant.`;
    default:
      return "Vous avez une nouvelle notification.";
  }
}

function notificationDestination(item: NotificationItem) {
  if (item.type === "message" && item.conversation_id) {
    return `/messages?conversation=${encodeURIComponent(item.conversation_id)}`;
  }

  if (item.type === "follow" && item.actor?.username) {
    return `/profil/${encodeURIComponent(item.actor.username)}`;
  }

  return "/";
}

export default function NotificationsPage() {
  const router = useRouter();
  const [items, setItems] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [userId, setUserId] = useState<string | null>(null);

  const loadNotifications = useCallback(async (recipientId: string) => {
    const { data, error: queryError } = await supabase
      .from("notifications")
      .select(
        "id, actor_id, type, conversation_id, publication_id, created_at, read_at",
      )
      .eq("recipient_id", recipientId)
      .order("created_at", { ascending: false })
      .limit(100);

    if (queryError) throw queryError;

    const rows = (data ?? []) as NotificationRow[];
    const actorIds = [...new Set(rows.map((row) => row.actor_id))];
    let actors: Actor[] = [];

    if (actorIds.length > 0) {
      const { data: profiles, error: profileError } = await supabase
        .from("profiles")
        .select("id, username, display_name")
        .in("id", actorIds);

      if (profileError) throw profileError;
      actors = (profiles ?? []) as Actor[];
    }

    const actorById = new Map(actors.map((actor) => [actor.id, actor]));

    setItems(
      rows.map((row) => ({
        ...row,
        actor: actorById.get(row.actor_id) ?? null,
      })),
    );
  }, []);

  useEffect(() => {
    let active = true;
    let channel: ReturnType<typeof supabase.channel> | null = null;

    async function start() {
      try {
        const user = await getCurrentUser();

        if (!user) {
          if (active) {
            setError("Connectez-vous pour consulter vos notifications.");
            setLoading(false);
          }
          return;
        }

        if (!active) return;

        setUserId(user.id);
        await loadNotifications(user.id);

        if (!active) return;

        channel = supabase
          .channel(`notifications:${user.id}`)
          .on(
            "postgres_changes",
            {
              event: "*",
              schema: "public",
              table: "notifications",
              filter: `recipient_id=eq.${user.id}`,
            },
            () => {
              void loadNotifications(user.id).catch(() => {
                if (active) {
                  setError("Impossible d’actualiser les notifications.");
                }
              });
            },
          )
          .subscribe();
      } catch {
        if (active) {
          setError("Impossible de charger les notifications.");
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    void start();

    return () => {
      active = false;
      if (channel) void supabase.removeChannel(channel);
    };
  }, [loadNotifications]);

  async function openNotification(item: NotificationItem) {
    if (!userId) {
      router.push("/connexion");
      return;
    }

    if (!item.read_at) {
      const readAt = new Date().toISOString();

      const { error: updateError } = await supabase
        .from("notifications")
        .update({ read_at: readAt })
        .eq("id", item.id)
        .eq("recipient_id", userId)
        .is("read_at", null);

      if (updateError) {
        setError("Impossible de marquer cette notification comme lue.");
        return;
      }

      setItems((current) =>
        current.map((entry) =>
          entry.id === item.id ? { ...entry, read_at: readAt } : entry,
        ),
      );
    }

    router.push(notificationDestination(item));
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        padding: "24px 16px 100px",
        maxWidth: 720,
        margin: "0 auto",
      }}
    >
      <header style={{ marginBottom: 24 }}>
        <p style={{ fontSize: 13, opacity: 0.65, marginBottom: 6 }}>AR10P</p>
        <h1 style={{ fontSize: 26, fontWeight: 700, margin: 0 }}>
          Notifications
        </h1>
        <p style={{ fontSize: 14, opacity: 0.7, marginTop: 8 }}>
          Retrouvez les activités liées à votre compte.
        </p>
      </header>

      {error && (
        <p role="alert" style={{ padding: 12, borderRadius: 10 }}>
          {error}
        </p>
      )}

      {loading ? (
        <p style={{ padding: 16, opacity: 0.7 }}>Chargement...</p>
      ) : items.length === 0 ? (
        <section
          style={{
            padding: "36px 16px",
            textAlign: "center",
            border: "1px solid var(--border, #e5e7eb)",
            borderRadius: 16,
          }}
        >
          <p style={{ fontSize: 18, fontWeight: 600 }}>
            Aucune notification
          </p>
          <p style={{ fontSize: 14, opacity: 0.7 }}>
            Vos nouveaux messages, likes, commentaires et abonnés apparaîtront ici.
          </p>
        </section>
      ) : (
        <section aria-label="Liste des notifications">
          {items.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => void openNotification(item)}
              style={{
                display: "flex",
                width: "100%",
                gap: 12,
                alignItems: "flex-start",
                textAlign: "left",
                padding: 16,
                marginBottom: 8,
                border: "1px solid var(--border, #e5e7eb)",
                borderRadius: 14,
                background: item.read_at
                  ? "var(--surface, transparent)"
                  : "var(--surface-alt, rgba(100, 140, 255, 0.10))",
                color: "inherit",
                cursor: "pointer",
              }}
            >
              <span
                aria-hidden="true"
                style={{
                  width: 10,
                  height: 10,
                  flexShrink: 0,
                  marginTop: 6,
                  borderRadius: "50%",
                  background: item.read_at ? "transparent" : "var(--blue, #3984ff)",
                  border: item.read_at ? "1px solid var(--border, #aaa)" : "none",
                }}
              />
              <span style={{ flex: 1 }}>
                <span style={{ display: "block", fontSize: 15, lineHeight: 1.5 }}>
                  {notificationText(item)}
                </span>
                <span style={{ display: "block", fontSize: 12, opacity: 0.65, marginTop: 6 }}>
                  {new Date(item.created_at).toLocaleString("fr-FR")}
                </span>
              </span>
            </button>
          ))}
        </section>
      )}

      <BottomNav />
    </main>
  );
}
