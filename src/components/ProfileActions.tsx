"use client";

import { useEffect, useState } from "react";
import {
  followUser,
  getCurrentUser,
  isFollowingUser,
  unfollowUser,
} from "@/lib/messaging";

type ProfileActionsProps = {
  targetUserId: string;
};

export default function ProfileActions({
  targetUserId,
}: ProfileActionsProps) {
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadFollowState() {
      try {
        const user = await getCurrentUser();

        if (!user || user.id === targetUserId) {
          if (!cancelled) setLoading(false);
          return;
        }

        const following = await isFollowingUser(targetUserId);

        if (!cancelled) {
          setIsFollowing(following);
          setLoading(false);
        }
      } catch (error) {
        console.error("Erreur état suivi:", error);

        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadFollowState();

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
    } catch (error) {
      console.error("Erreur suivi:", error);
    } finally {
      setBusy(false);
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

      <button type="button" className="creator-message">
        Message
      </button>
    </div>
  );
}
