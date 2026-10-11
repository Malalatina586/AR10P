"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { IconBell } from "@/components/Icons";
import { supabase } from "@/lib/messaging";

export default function NotificationBell() {
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    let active = true;
    let channel: ReturnType<typeof supabase.channel> | null = null;

    async function start() {
      const { data: { user }, error } = await supabase.auth.getUser();

      if (error || !user || !active) return;

      const userId = user.id;

      async function refreshCount() {
        const { count, error: countError } = await supabase
          .from("notifications")
          .select("id", { count: "exact", head: true })
          .eq("recipient_id", userId)
          .is("read_at", null);

        if (!countError && active) {
          setUnreadCount(count ?? 0);
        }
      }

      await refreshCount();

      if (!active) return;

      channel = supabase
        .channel(`notification-bell:${userId}`)
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "notifications",
            filter: `recipient_id=eq.${userId}`,
          },
          () => {
            void refreshCount();
          },
        )
        .subscribe();
    }

    void start();

    return () => {
      active = false;
      if (channel) void supabase.removeChannel(channel);
    };
  }, []);

  return (
    <Link
      href="/notifications"
      className="icon-btn"
      aria-label={
        unreadCount > 0
          ? `Notifications, ${unreadCount} non lue${unreadCount > 1 ? "s" : ""}`
          : "Notifications"
      }
      title={
        unreadCount > 0
          ? `${unreadCount} notification${unreadCount > 1 ? "s" : ""} non lue${unreadCount > 1 ? "s" : ""}`
          : "Notifications"
      }
      style={{ position: "relative" }}
    >
      <IconBell />
      {unreadCount > 0 && (
        <span
          aria-hidden="true"
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            minWidth: 17,
            height: 17,
            padding: "0 4px",
            borderRadius: 999,
            background: "var(--blue, #3984ff)",
            color: "#fff",
            fontSize: 10,
            fontWeight: 700,
            lineHeight: "17px",
            textAlign: "center",
          }}
        >
          {unreadCount > 99 ? "99+" : unreadCount}
        </span>
      )}
    </Link>
  );
}
