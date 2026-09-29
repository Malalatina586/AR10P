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
  type: "summary";
  category: Category;
  readingMinutes: number;
  author: string;
  media?: {
    type: "image" | "video";
    url: string;
    ratio: "square" | "portrait";
  };
};

export type SponsoredItem = Base & {
  type: "sponsored";
  category: Category;
  sponsor: string;
  avatar?: string;
  place: string;
  cta: string;
};

export type CreatorItem = Base & {
  type: "creator";
  category: Category;
  creator: string;
  avatar?: string;
  job: string;
  downloads: number;
};

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

export const SHOW_SPONSORED_AND_CREATOR = false;

const hoursAgo = (h: number) =>
  new Date(Date.now() - h * 3600_000).toISOString();

export const FEED: FeedItem[] = [
  {
    id: "s1",
    type: "summary",
    category: "Business",
    author: "AR10P",
    media: {
      type: "image",
      url:
    "https://images.unsplash.com/photo-1497366754035-f200968a6e72",
      ratio: "square",
    },
    title: "Père riche, père pauvre : l'essentiel",
    description:
      "Les 7 idées clés sur l'argent et les actifs, avec 3 actions à appliquer cette semaine.",
    readingMinutes: 6,
    publishedAt: hoursAgo(2),
    comments: 0,
    likes: 248,
    shares: 61,
  },
  {
    id: "s2",
    type: "summary",
    category: "Tech",
    author: "AR10P",
    media: {
      type: "image",
      url:
    "https://images.unsplash.com/photo-1497366754035-f200968a6e72",
    ratio: "portrait",
    },
    title: "L'intelligence artificielle en 10 pages",
    description:
      "Comprendre ce que l'IA sait faire, ses limites et comment l'utiliser dès aujourd'hui.",
    readingMinutes: 7,
    publishedAt: hoursAgo(9),
    comments: 0,
    likes: 173,
    shares: 44,
  },
  {
    id: "s3",
    type: "summary",
    category: "Histoire",
    author: "AR10P",
    title: "Les grands empires d'Afrique : l'essentiel",
    description:
      "Mali, Songhaï, Éthiopie… les repères pour comprendre cinq siècles d'histoire.",
    readingMinutes: 8,
    publishedAt: hoursAgo(30),
    comments: 0,
    likes: 131,
    shares: 38,
  },
  {
    id: "s4",
    type: "summary",
    category: "Finance",
    author: "AR10P",
    title: "Épargner et investir : par où commencer ?",
    description:
      "Budget, fonds d'urgence, premiers placements : un plan simple en 4 étapes.",
    readingMinutes: 6,
    publishedAt: hoursAgo(52),
    comments: 0,
    likes: 205,
    shares: 57,
  },
  {
    id: "s5",
    type: "summary",
    category: "Business",
    author: "AR10P",
    title: "Lancer son entreprise avec peu de moyens",
    description:
      "Valider une idée, trouver ses 10 premiers clients et garder ses coûts bas.",
    readingMinutes: 7,
    publishedAt: hoursAgo(75),
    comments: 0,
    likes: 164,
    shares: 41,
  },
  {
    id: "s6",
    type: "summary",
    category: "IA & Technologie",
    author: "AR10P",
    title: "L'IA générative en 10 pages",
    description:
      "Comprendre les modèles génératifs, leurs usages et les limites à connaître.",
    readingMinutes: 7,
    publishedAt: hoursAgo(12),
    comments: 0,
    likes: 189,
    shares: 52,
  },
  {
    id: "s7",
    type: "summary",
    category: "Développement personnel",
    author: "AR10P",
    title: "Construire de meilleures habitudes",
    description:
      "Les principes essentiels pour transformer une intention en routine durable.",
    readingMinutes: 6,
    publishedAt: hoursAgo(18),
    comments: 0,
    likes: 156,
    shares: 39,
  },
  {
    id: "s8",
    type: "summary",
    category: "Santé & Bien-être",
    author: "AR10P",
    title: "Mieux comprendre le sommeil",
    description:
      "Les bases du sommeil, les habitudes qui peuvent l'améliorer et les idées reçues.",
    readingMinutes: 6,
    publishedAt: hoursAgo(22),
    comments: 0,
    likes: 142,
    shares: 31,
  },

  {
    id: "s9",
    type: "summary",
    category: "Actualité & Monde",
    author: "AR10P",
    title: "Comprendre l actualité mondiale",
    description: "Les grands événements mondiaux expliqués simplement.",
    readingMinutes: 6,
    publishedAt: hoursAgo(4),
    comments: 0,
    likes: 128,
    shares: 27,
  },
  {
    id: "s10",
    type: "summary",
    category: "Sport",
    author: "AR10P",
    title: "Le sport moderne en 10 pages",
    description: "Les grands enjeux du sport moderne, son économie et son évolution.",
    readingMinutes: 5,
    publishedAt: hoursAgo(6),
    comments: 0,
    likes: 119,
    shares: 24,
  },
  {
    id: "s11",
    type: "summary",
    category: "Culture & Divertissement",
    author: "AR10P",
    title: "Pourquoi les films et séries nous captivent",
    description: "Comprendre les mécanismes qui rendent les histoires captivantes.",
    readingMinutes: 5,
    publishedAt: hoursAgo(8),
    comments: 0,
    likes: 104,
    shares: 21,
  },
  {
    id: "s12",
    type: "summary",
    category: "Éducation & Compétences",
    author: "AR10P",
    title: "Apprendre plus efficacement",
    description: "Des principes simples pour mieux mémoriser et développer ses compétences.",
    readingMinutes: 6,
    publishedAt: hoursAgo(10),
    comments: 0,
    likes: 97,
    shares: 19,
  },
  {
    id: "s13",
    type: "summary",
    category: "Climat, Énergie & Futur",
    author: "AR10P",
    title: "Comprendre la transition énergétique",
    description: "Les grandes sources d énergie et les transformations à venir.",
    readingMinutes: 7,
    publishedAt: hoursAgo(12),
    comments: 0,
    likes: 91,
    shares: 18,
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

export const LIBRARY: LibraryItem[] = [
  { summaryId: "s2", status: "in-progress", progress: 60 },
  { summaryId: "s1", status: "completed", progress: 100 },
  { summaryId: "s4", status: "saved", progress: 0 },
  { summaryId: "s6", status: "in-progress", progress: 35 },
  { summaryId: "s3", status: "completed", progress: 100 },
];

