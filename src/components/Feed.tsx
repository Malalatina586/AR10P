"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { FEED, SHOW_SPONSORED_AND_CREATOR } from "@/lib/mock-data";
import FeedCard from "./FeedCard";
import PublicationCard, {
  type Publication,
} from "./PublicationCard";
import { IconBell, IconSearch } from "./Icons";
import BottomNav from "./BottomNav";
import AdcashSlot from "./AdcashSlot";
import { createClient } from "@/lib/supabase/client";

type PublicationRow = {
  id: string;
  author_id: string;
  title: string;
  content: string;
  category: string;
  image_url: string | null;
  created_at: string;
};

type ProfileRow = {
  id: string;
  display_name: string | null;
  username: string | null;
};

type InteractionState = {
  likes: number;
  comments: number;
  shares: number;
  liked: boolean;
};

const norm = (s: string) =>
  s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

export default function Feed() {
  const supabase = useMemo(() => createClient(), []);
  const [query, setQuery] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);

  const [publications, setPublications] = useState<Publication[]>([]);
  const [interactions, setInteractions] = useState<
    Record<string, InteractionState>
  >({});
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [loadingPublications, setLoadingPublications] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadPublications() {
      setLoadingPublications(true);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!cancelled) {
        setCurrentUserId(user?.id ?? null);
      }

      const { data, error } = await supabase
        .from("publications")
        .select(
          "id, author_id, title, content, category, image_url, created_at",
        )
        .eq("status", "approved")
        .order("created_at", { ascending: false })
        .limit(50);

      if (error) {
        console.error("Erreur chargement publications:", error);

        if (!cancelled) {
          setPublications([]);
          setLoadingPublications(false);
        }

        return;
      }

      const rows = (data ?? []) as PublicationRow[];
      const authorIds = [...new Set(rows.map((row) => row.author_id))];
      const publicationIds = rows.map((row) => row.id);

      const profilesById: Record<string, ProfileRow> = {};

      if (authorIds.length > 0) {
        const { data: profiles, error: profilesError } = await supabase
          .from("profiles")
          .select("id, display_name, username")
          .in("id", authorIds);

        if (profilesError) {
          console.error("Erreur chargement profils:", profilesError);
        }

        for (const profile of (profiles ?? []) as ProfileRow[]) {
          profilesById[profile.id] = profile;
        }
      }

      const nextInteractions: Record<string, InteractionState> = {};

      for (const id of publicationIds) {
        nextInteractions[id] = {
          likes: 0,
          comments: 0,
          shares: 0,
          liked: false,
        };
      }

      if (publicationIds.length > 0) {
        const [likesResult, commentsResult, sharesResult] =
          await Promise.all([
            supabase
              .from("publication_likes")
              .select("publication_id, user_id")
              .in("publication_id", publicationIds),

            supabase
              .from("publication_comments")
              .select("publication_id")
              .in("publication_id", publicationIds),

            supabase
              .from("publication_shares")
              .select("publication_id")
              .in("publication_id", publicationIds),
          ]);

        for (const like of likesResult.data ?? []) {
          const state = nextInteractions[like.publication_id];

          if (state) {
            state.likes += 1;

            if (like.user_id === user?.id) {
              state.liked = true;
            }
          }
        }

        for (const comment of commentsResult.data ?? []) {
          const state = nextInteractions[comment.publication_id];

          if (state) {
            state.comments += 1;
          }
        }

        for (const share of sharesResult.data ?? []) {
          const state = nextInteractions[share.publication_id];

          if (state) {
            state.shares += 1;
          }
        }
      }

      const mapped: Publication[] = rows.map((row) => {
        const profile = profilesById[row.author_id];

        return {
          id: row.id,
          author_id: row.author_id,
          title: row.title,
          content: row.content,
          category: row.category,
          image_url: row.image_url,
          created_at: row.created_at,
          author_name:
            profile?.display_name ||
            profile?.username ||
            "Utilisateur AR10P",
          author_username: profile?.username ?? null,
        };
      });

      if (!cancelled) {
        setPublications(mapped);
        setInteractions(nextInteractions);
        setLoadingPublications(false);
      }
    }

    void loadPublications();

    return () => {
      cancelled = true;
    };
  }, [supabase]);

  const filteredPublications = useMemo(() => {
    const q = norm(query.trim());

    return publications.filter(
      (item) =>
        !q ||
        norm(
          `${item.title} ${item.content} ${item.category} ${item.author_name}`,
        ).includes(q),
    );
  }, [publications, query]);

  const filteredMockItems = useMemo(() => {
    const q = norm(query.trim());

    return FEED.filter(
      (item) => SHOW_SPONSORED_AND_CREATOR || item.type === "summary",
    ).filter(
      (item) =>
        !q ||
        norm(`${item.title} ${item.description} ${item.category}`).includes(q),
    );
  }, [query]);

  return (
    <div className="app">
      <header className="app-head">
        <div className="head-row">
          <h1 className="logo">AR10P</h1>

          <label className="search">
            <IconSearch />
            <input
              ref={searchRef}
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Rechercher..."
              aria-label="Rechercher un sujet"
            />
          </label>

          <div className="head-actions">
            <Link
              href="/publier"
              className="icon-btn"
              aria-label="Créer une publication"
              title="Publier"
            >
              +
            </Link>

            <button
              className="icon-btn"
              aria-label="Alertes (bientôt)"
              title="Alertes — bientôt"
            >
              <IconBell />
            </button>
          </div>
        </div>
      </header>

      <main className="feed">
        {filteredPublications.map((publication, index) => {
          const state = interactions[publication.id] ?? {
            likes: 0,
            comments: 0,
            shares: 0,
            liked: false,
          };

            return (
              <div key={`publication-group-${publication.id}`}>
                <PublicationCard
                  key={`publication-${publication.id}`}
                  publication={publication}
                  initialLikes={state.likes}
                  initialComments={state.comments}
                  initialShares={state.shares}
                  initialLiked={state.liked}
                  currentUserId={currentUserId}
                />
                {index === 1 && <AdcashSlot />}
              </div>
            );

        })}

        {filteredMockItems.map((item) => (
          <FeedCard key={`mock-${item.id}`} item={item} />
        ))}

        {!loadingPublications &&
          filteredPublications.length === 0 &&
          filteredMockItems.length === 0 && (
            <p className="empty">
              Aucun contenu pour « {query} » pour l&apos;instant.
            </p>
          )}

        {loadingPublications && (
          <p className="empty">Chargement du Fil...</p>
        )}
      </main>

      <BottomNav />
    </div>
  );
}
