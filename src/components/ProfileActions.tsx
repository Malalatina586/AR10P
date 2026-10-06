"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  createMessageRequest,
  followUser,
  getCurrentUser,
  getMessageActionState,
  getOrCreateDirectConversation,
  isFollowingUser,
  unfollowUser,
  type MessageActionState,
} from "@/lib/messaging";

type ProfileActionsProps = {
  targetUserId: string;
};

export default function ProfileActions({
  targetUserId,
}: ProfileActionsProps) {
  const router = useRouter();
  const [isFollowing, setIsFollowing] = useState(false);
  const [messageState, setMessageState] =
    useState<MessageActionState | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadState() {
      try {
        const user = await getCurrentUser();

        if (!user || user.id === targetUserId) {
          if (!cancelled) setLoading(false);
          return;
        }

        const [following, actionState] = await Promise.all([
          isFollowingUser(targetUserId),
          getMessageActionState(targetUserId),
        ]);

        if (!cancelled) {
          setIsFollowing(following);
          setMessageState(actionState);
          setLoading(false);
        }
      } catch (error) {
        console.error("Erreur état profil:", error);

        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadState();

    return () => {
      cancelled = true;
    };
  }, [targetUserId]);

  async function handleFollow() {
    if (busy) return;

    setBusy(true);

    try {
      if (isFollowing) {
        await unfollowUser(targetUserId);
        setIsFollowing(false);
      } else {
        await followUser(targetUserId);
        setIsFollowing(true);
      }

      const nextState = await getMessageActionState(targetUserId);
      setMessageState(nextState);
    } catch (error) {
      console.error("Erreur suivi:", error);
    } finally {
      setBusy(false);
    }
  }

  async function handleMessage() {
    if (busy || !messageState) return;

    setBusy(true);

    try {
      if (messageState === "direct") {
        const conversationId =
          await getOrCreateDirectConversation(targetUserId);

        router.push(
          `/messages?conversation=${encodeURIComponent(conversationId)}`,
        );
        return;
      }

      if (messageState === "request") {
        await createMessageRequest(targetUserId);
        setMessageState("outgoing_pending");
        return;
      }

      if (messageState === "incoming_pending") {
        router.push("/messages");
        return;
      }
    } catch (error) {
      console.error("Erreur message:", error);
    } finally {
      setBusy(false);
    }
  }

  function getMessageLabel() {
    if (loading) return "...";

    switch (messageState) {
      case "direct":
        return "Message";
      case "request":
        return "Envoyer une demande";
      case "outgoing_pending":
        return "Demande envoyée";
      case "incoming_pending":
        return "Demande reçue";
      case "blocked":
        return "Indisponible";
      default:
        return "Message";
    }
  }

  return (
    <div className="creator-public-actions">
      <button
        type="button"
        className="creator-follow"
        onClick={handleFollow}
        disabled={loading || busy}
      >
        {loading ? "..." : isFollowing ? "✓ Suivi" : "+ Suivre"}
      </button>

      <button
        type="button"
        className="creator-message"
        onClick={() => void handleMessage()}
        disabled={loading || busy || messageState === "blocked"}
      >
        {getMessageLabel()}
      </button>
    </div>
  );
}
