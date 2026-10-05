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
