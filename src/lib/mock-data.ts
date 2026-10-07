// Données FICTIVES pour la phase 1 (remplacées par Supabase en phase 2).

export type Category =
  | "Business"
  | "Histoire"
  | "Tech"
  | "Finance"
  | "IA & Technologie"
  | "Développement personnel"
  | "Santé & Bien-être"
  | "Actualité & Monde"
  | "Sport"
  | "Culture & Divertissement"
  | "Éducation & Compétences"
  | "Climat, Énergie & Futur";

type Base = {
  id: string;
  title: string;
  description: string;
  publishedAt: string;
  more?: string;
  comments: number;
  likes: number;
  shares: number;
};

export type SummaryItem = Base & {
  avatar?: string;
  type: "summary";
  category: Category;
  readingMinutes: number;
  author: string;
  media?: {
    type: "image";
    url: string;
    ratio: "square" | "portrait";
  };
};

export type SponsoredItem = Base & {
  type: "sponsored";
  category: Category;
  sponsor: string;
  businessUsername: string;
  avatar?: string;
  media: {
    type: "image";
    url: string;
    ratio: "square" | "portrait";
  };
};

export type CreatorItem = Base & {
  type: "creator";
  category: Category;
  creator: string;
  avatar?: string;
  job: string;
  downloads: number;
  media?: {
    type: "image" | "video";
    url: string;
    ratio: "square" | "portrait";
  };
};

export type CreatorProfile = { username: string; creator: string; avatar?: string; job: string; category: Category; location?: string; bio: string; stats: { publications: number; followers: number; likes: number; comments: number; shares: number; downloads: number; }; };

export type FeedItem = SummaryItem | SponsoredItem | CreatorItem;

export const CATEGORIES: Category[] = [
  "Business",
  "Histoire",
  "Tech",
  "Finance",
  "IA & Technologie",
  "Développement personnel",
  "Santé & Bien-être",
  "Actualité & Monde",
  "Sport",
  "Culture & Divertissement",
  "Éducation & Compétences",
  "Climat, Énergie & Futur",

];

export const SHOW_SPONSORED_AND_CREATOR = true;

const hoursAgo = (h: number) =>
  new Date(Date.now() - h * 3600_000).toISOString();

export const CREATOR_PROFILES: CreatorProfile[] = [{ username: "andry.rakoto", creator: "Andry Rakoto", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e", job: "Entrepreneur", category: "Business", location: "Antananarivo, Madagascar", bio: "Entrepreneur et créateur de contenus. Je partage des méthodes simples pour mieux organiser son activité, développer ses compétences et passer à l’action.", stats: { publications: 24, followers: 1284, likes: 8642, comments: 327, shares: 184, downloads: 96 } }];
export const FEED: FeedItem[] = [
  {
    id: "ad1",
    type: "sponsored",
    title: "",
    description: "",
    publishedAt: "",
    category: "Business",
    sponsor: "Nexa Business",
    businessUsername: "nexa.business",
    avatar: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43",
    media: {
      type: "image",
      url: "https://images.unsplash.com/photo-1497366754035-f200968a6e72",
      ratio: "portrait",
    },
    comments: 0,
    likes: 0,
    shares: 0,
  },
  {
    id: "c1",
    type: "creator",
    category: "Business",
    creator: "Andry Rakoto",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e",
    job: "Entrepreneur",
    title: "Les 3 habitudes qui changent une activité",
    description: "Un partage simple pour mieux organiser son travail et avancer chaque semaine.",
    more: "Découvre trois habitudes simples pour mieux structurer tes journées, prioriser tes tâches et suivre tes progrès semaine après semaine.",
    publishedAt: hoursAgo(1),
    comments: 8,
    likes: 42,
    shares: 12,
    downloads: 27,
  },
  {
    id: "c2",
    type: "creator",
    category: "Business",
    creator: "Andry Rakoto",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e",
    job: "Entrepreneur",
    title: "Comment mieux organiser son activité ?",
    description: "Une courte vidéo avec trois conseils pratiques pour mieux organiser son activité.",
    more: "Dans cette vidéo, Andry partage trois méthodes simples pour mieux structurer son travail au quotidien.",
    publishedAt: hoursAgo(2),
    comments: 6,
    likes: 31,
    shares: 9,
    downloads: 18,
    media: {
      type: "video",
      url: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
      ratio: "portrait",
    },
  },

];

export function timeAgo(iso: string): string {
  const diff = Math.max(0, Date.now() - new Date(iso).getTime());
  const h = Math.floor(diff / 3600000);

  if (h < 1) return "À l'instant";
  if (h < 24) return `Il y a ${h} h`;

  return `Il y a ${Math.floor(h / 24)} j`;
}

export type LibraryStatus = "saved" | "in-progress" | "completed";

export type LibraryItem = {
  summaryId: string;
  status: LibraryStatus;
  progress: number;
};

export const LIBRARY: LibraryItem[] = [];

