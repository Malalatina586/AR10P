// Données FICTIVES pour la phase 1 (remplacées par Supabase en phase 2).

export type Category = "Business" | "Histoire" | "Tech" | "Finance";

type Base = { id: string; title: string; description: string; publishedAt: string; likes: number; shares: number };

export type SummaryItem = Base & {
  type: "summary";
  category: Category;
  readingMinutes: number;
  author: string;
};
export type SponsoredItem = Base & {
  type: "sponsored";
  category: Category;
  sponsor: string;
  place: string;
  cta: string;
};
export type CreatorItem = Base & {
  type: "creator";
  category: Category;
  creator: string;
  job: string;
  downloads: number;
};
export type FeedItem = SummaryItem | SponsoredItem | CreatorItem;

export const CATEGORIES: Category[] = ["Business", "Histoire", "Tech", "Finance"];

// V0.1.1 : seules les cartes « résumé AR10P » sont visibles.
// Sponsorisé = V2.0, Créateur = V3.0 (passer à true pour prévisualiser).
export const SHOW_SPONSORED_AND_CREATOR = false;

const hoursAgo = (h: number) => new Date(Date.now() - h * 3600_000).toISOString();

export const FEED: FeedItem[] = [
  { id: "s1", type: "summary", category: "Business", author: "AR10P", title: "Père riche, père pauvre : l'essentiel", description: "Les 7 idées clés sur l'argent et les actifs, avec 3 actions à appliquer cette semaine.", readingMinutes: 6, publishedAt: hoursAgo(2), likes: 248, shares: 61 },
  { id: "sp1", type: "sponsored", category: "Business", sponsor: "Salon agrobusiness Tana", place: "Antananarivo", title: "Rencontrez 40 exposants les 14 et 15 novembre", description: "Programme, conférences et invitation gratuite pour les lecteurs AR10P.", cta: "Voir l'événement", publishedAt: hoursAgo(5), likes: 12, shares: 3 },
  { id: "s2", type: "summary", category: "Tech", author: "AR10P", title: "L'intelligence artificielle en 10 pages", description: "Comprendre ce que l'IA sait faire, ses limites et comment l'utiliser dès aujourd'hui.", readingMinutes: 7, publishedAt: hoursAgo(9), likes: 173, shares: 44 },
  { id: "c1", type: "creator", category: "Finance", creator: "Miora R.", job: "Comptable", title: "Comprendre la TVA en 10 pages", description: "Pour les petits entrepreneurs : quoi déclarer, quand et comment.", downloads: 310, publishedAt: hoursAgo(26), likes: 96, shares: 22 },
  { id: "s3", type: "summary", category: "Histoire", author: "AR10P", title: "Les grands empires d'Afrique : l'essentiel", description: "Mali, Songhaï, Éthiopie… les repères pour comprendre cinq siècles d'histoire.", readingMinutes: 8, publishedAt: hoursAgo(30), likes: 131, shares: 38 },
  { id: "s4", type: "summary", category: "Finance", author: "AR10P", title: "Épargner et investir : par où commencer ?", description: "Budget, fonds d'urgence, premiers placements : un plan simple en 4 étapes.", readingMinutes: 6, publishedAt: hoursAgo(52), likes: 205, shares: 57 },
  { id: "s5", type: "summary", category: "Business", author: "AR10P", title: "Lancer son entreprise avec peu de moyens", description: "Valider une idée, trouver ses 10 premiers clients et garder ses coûts bas.", readingMinutes: 7, publishedAt: hoursAgo(75), likes: 164, shares: 41 },
];

export function timeAgo(iso: string): string {
  const diff = Math.max(0, Date.now() - new Date(iso).getTime());
  const h = Math.floor(diff / 3600_000);
  if (h < 1) return "À l'instant";
  if (h < 24) return `Il y a ${h} h`;
  return `Il y a ${Math.floor(h / 24)} j`;
}
