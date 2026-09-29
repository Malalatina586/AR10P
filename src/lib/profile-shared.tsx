'use client';

/**
 * AR10P — Utilitaires partagés par la page Profil et la feuille de partage
 * Emplacement : src/lib/profile-shared.tsx
 */

import { useCallback, useEffect, useState } from 'react';
import type { IconType } from 'react-icons';
import { FaFacebook, FaInstagram, FaTelegram, FaTiktok, FaWhatsapp } from 'react-icons/fa6';

/* Clé de stockage du thème : doit être la même que dans src/components/ThemeToggle.tsx.
 * Vérifie avec :  grep -n "localStorage" src/components/ThemeToggle.tsx */
export const THEME_KEY = 'ar10p-theme';

/* ---------- Réseaux de partage ---------- */
export type NetworkId = 'telegram' | 'whatsapp' | 'facebook' | 'instagram' | 'tiktok';

export type Network = {
  id: NetworkId;
  name: string;
  Icon: IconType;
  /** Lien de partage web. Absent = le réseau n'en propose pas (Instagram, TikTok). */
  shareUrl?: (url: string, text: string) => string;
};

const enc = encodeURIComponent;

export const NETWORKS: Network[] = [
  { id: 'telegram', name: 'Telegram', Icon: FaTelegram,
    shareUrl: (u, t) => `https://t.me/share/url?url=${enc(u)}&text=${enc(t)}` },
  { id: 'whatsapp', name: 'WhatsApp', Icon: FaWhatsapp,
    shareUrl: (u, t) => `https://wa.me/?text=${enc(`${t} ${u}`)}` },
  { id: 'facebook', name: 'Facebook', Icon: FaFacebook,
    shareUrl: (u) => `https://www.facebook.com/sharer/sharer.php?u=${enc(u)}` },
  { id: 'instagram', name: 'Instagram', Icon: FaInstagram },
  { id: 'tiktok', name: 'TikTok', Icon: FaTiktok },
];

/* ---------- État persistant (localStorage, compatible SSR) ---------- */
function usePersistentState<V>(key: string, initial: V) {
  const [value, setValue] = useState<V>(initial);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(key);
      if (saved !== null) setValue(JSON.parse(saved));
    } catch { /* stockage indisponible : valeur par défaut */ }
  }, [key]);

  const set = useCallback((next: V | ((prev: V) => V)) => {
    setValue((prev) => {
      const v = typeof next === 'function' ? (next as (p: V) => V)(prev) : next;
      try { localStorage.setItem(key, JSON.stringify(v)); } catch { /* ignoré */ }
      return v;
    });
  }, [key]);

  return [value, set] as const;
}

/* ---------- Comptes connectés ----------
 * « Connecté » = préférence enregistrée sur l'appareil (pas de mot de passe,
 * pas d'inscription) : le partage passe par de simples liens. */
export function useConnectedAccounts() {
  const [ids, setIds] = usePersistentState<NetworkId[]>('ar10p:accounts', ['telegram', 'facebook']);

  const isConnected = (id: NetworkId) => ids.includes(id);
  const toggle = (id: NetworkId) =>
    setIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  const connected = NETWORKS.filter((n) => ids.includes(n.id));

  return { connected, isConnected, toggle };
}

/* ---------- Thème : utilise le même mécanisme que ton CSS (data-theme sur <html>) ---------- */
export function useTheme() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    setDark(document.documentElement.dataset.theme === 'dark');
  }, []);

  function toggleDark() {
    const next = dark ? 'light' : 'dark';
    document.documentElement.dataset.theme = next;
    try { localStorage.setItem(THEME_KEY, next); } catch { /* ignoré */ }
    setDark(!dark);
  }

  return { dark, toggleDark };
}

/* ---------- Actions de partage ---------- */
export async function copyLink(url: string) {
  await navigator.clipboard.writeText(url);
}

/** Ouvre le partage du réseau, ou copie le lien si le réseau n'a pas de lien de partage web. */
export async function shareTo(network: Network, url: string, title: string): Promise<'opened' | 'copied'> {
  if (network.shareUrl) {
    window.open(network.shareUrl(url, `${title} — résumé en 10 pages`), '_blank', 'noopener,noreferrer');
    return 'opened';
  }
  await copyLink(url);
  return 'copied';
}
