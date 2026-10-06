import { createClient } from "@/lib/supabase/client";

export const supabase = createClient();

export type Profile = {
  id: string;
  username: string | null;
  display_name: string | null;
  avatar_url: string | null;
  role: "user" | "admin";
};

export type ConversationRow = {
  id: string;
  user_a_id: string;
  user_b_id: string;
  created_at: string;
  updated_at: string;
};

export type MessageRow = {
  id: string;
  conversation_id: string;
  sender_id: string;
  body: string;
  created_at: string;
  read_at: string | null;
};

export async function getCurrentUser() {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) throw error;

  return user;
}

export async function getMyConversations(userId: string) {
  const { data, error } = await supabase
    .from("conversations")
    .select("id, user_a_id, user_b_id, created_at, updated_at")
    .or(`user_a_id.eq.${userId},user_b_id.eq.${userId}`)
    .order("updated_at", { ascending: false });

  if (error) throw error;

  return (data ?? []) as ConversationRow[];
}

export async function getProfile(userId: string) {
  const { data, error } = await supabase
    .from("profiles")
    .select("id, username, display_name, avatar_url, role")
    .eq("id", userId)
    .maybeSingle();

  if (error) throw error;

  return data as Profile | null;
}

export async function getMessages(conversationId: string) {
  const { data, error } = await supabase
    .from("messages")
    .select("id, conversation_id, sender_id, body, created_at, read_at")
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: true });

  if (error) throw error;

  return (data ?? []) as MessageRow[];
}

export async function sendMessage(
  conversationId: string,
  body: string,
) {
  const { data, error } = await supabase.rpc("send_message", {
    p_conversation_id: conversationId,
    p_body: body,
  });

  if (error) throw error;

  return data as string;
}

export async function getOrCreateDirectConversation(
  otherUserId: string,
) {
  const { data, error } = await supabase.rpc(
    "get_or_create_direct_conversation",
    {
      p_other_user_id: otherUserId,
    },
  );

  if (error) throw error;

  return data as string;
}

export async function createMessageRequest(
  recipientId: string,
) {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error("NOT_AUTHENTICATED");
  }

  const { data, error } = await supabase
    .from("message_requests")
    .insert({
      sender_id: user.id,
      recipient_id: recipientId,
      status: "pending",
    })
    .select("id")
    .single();

  if (error) throw error;

  return data.id as string;
}

export async function acceptMessageRequest(requestId: string) {
  const { data, error } = await supabase.rpc(
    "accept_message_request",
    {
      p_request_id: requestId,
    },
  );

  if (error) throw error;

  return data as string;
}

export async function rejectMessageRequest(requestId: string) {
  const { data, error } = await supabase.rpc(
    "reject_message_request",
    {
      p_request_id: requestId,
    },
  );

  if (error) throw error;

  return data as boolean;
}

export async function searchUsers(query: string, currentUserId: string) {
  const cleanQuery = query.trim();

  if (!cleanQuery) {
    return [] as Profile[];
  }

  const { data, error } = await supabase
    .from("profiles")
    .select("id, username, display_name, avatar_url, role")
    .neq("id", currentUserId)
    .or(`username.ilike.%${cleanQuery}%,display_name.ilike.%${cleanQuery}%`)
    .limit(20);

  if (error) throw error;

  return (data ?? []) as Profile[];
}

export async function getProfileByUsername(username: string) {
  const cleanUsername = username.trim();

  if (!cleanUsername) {
    return null;
  }

  const { data, error } = await supabase
    .from("profiles")
    .select("id, username, display_name, avatar_url, bio, role, created_at")
    .eq("username", cleanUsername)
    .maybeSingle();

  if (error) throw error;

  return data as (Profile & { bio: string | null; created_at: string }) | null;
}

export async function isFollowingUser(targetUserId: string) {
  const user = await getCurrentUser();
  if (!user || user.id === targetUserId) return false;

  const { data, error } = await supabase
    .from("follows")
    .select("follower_id")
    .eq("follower_id", user.id)
    .eq("following_id", targetUserId)
    .maybeSingle();

  if (error) throw error;

  return Boolean(data);
}

export async function followUser(targetUserId: string) {
  const user = await getCurrentUser();
  if (!user) throw new Error("NOT_AUTHENTICATED");
  if (user.id === targetUserId) throw new Error("CANNOT_FOLLOW_SELF");

  const { error } = await supabase
    .from("follows")
    .insert({
      follower_id: user.id,
      following_id: targetUserId,
    });

  if (error) throw error;
}

export async function unfollowUser(targetUserId: string) {
  const user = await getCurrentUser();
  if (!user) throw new Error("NOT_AUTHENTICATED");

  const { error } = await supabase
    .from("follows")
    .delete()
    .eq("follower_id", user.id)
    .eq("following_id", targetUserId);

  if (error) throw error;
}

export type MessageActionState =
  | "direct"
  | "request"
  | "outgoing_pending"
  | "incoming_pending"
  | "blocked";

export async function getMessageActionState(targetUserId: string) {
  const user = await getCurrentUser();

  if (!user || user.id === targetUserId) {
    return "blocked" as MessageActionState;
  }

  const [{ data: following }, { data: followedBy }, { data: outgoing }, { data: incoming }, { data: accepted }, { data: blockedByMe }, { data: blockedMe }] =
    await Promise.all([
      supabase
        .from("follows")
        .select("follower_id")
        .eq("follower_id", user.id)
        .eq("following_id", targetUserId)
        .maybeSingle(),

      supabase
        .from("follows")
        .select("follower_id")
        .eq("follower_id", targetUserId)
        .eq("following_id", user.id)
        .maybeSingle(),

      supabase
        .from("message_requests")
        .select("id")
        .eq("sender_id", user.id)
        .eq("recipient_id", targetUserId)
        .eq("status", "pending")
        .maybeSingle(),

      supabase
        .from("message_requests")
        .select("id")
        .eq("sender_id", targetUserId)
        .eq("recipient_id", user.id)
        .eq("status", "pending")
        .maybeSingle(),

      supabase
        .from("message_requests")
        .select("id")
        .or(
          `and(sender_id.eq.${user.id},recipient_id.eq.${targetUserId}),and(sender_id.eq.${targetUserId},recipient_id.eq.${user.id})`,
        )
        .eq("status", "accepted")
        .limit(1)
        .maybeSingle(),

      supabase
        .from("blocks")
        .select("blocker_id")
        .eq("blocker_id", user.id)
        .eq("blocked_id", targetUserId)
        .maybeSingle(),

      supabase
        .from("blocks")
        .select("blocker_id")
        .eq("blocker_id", targetUserId)
        .eq("blocked_id", user.id)
        .maybeSingle(),
    ]);

  if (blockedByMe || blockedMe) {
    return "blocked" as MessageActionState;
  }

  if (following && followedBy) {
    return "direct" as MessageActionState;
  }

  if (accepted) {
    return "direct" as MessageActionState;
  }

  if (outgoing) {
    return "outgoing_pending" as MessageActionState;
  }

  if (incoming) {
    return "incoming_pending" as MessageActionState;
  }

  return "request" as MessageActionState;
}
