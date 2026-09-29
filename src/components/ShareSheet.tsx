'use client';

/**
 * AR10P — Feuille de partage (bottom sheet)
 * Emplacement : src/components/ShareSheet.tsx  (+ share-sheet.css à côté)
 *
 * Utilisation dans FeedCard.tsx :
 *   const [shareOpen, setShareOpen] = useState(false);
 *   <button onClick={() => setShareOpen(true)}>Partager</button>
 *   <ShareSheet open={shareOpen} onClose={() => setShareOpen(false)} title={titre} url={lien} />
 */

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Copy, Ellipsis, Plus } from 'lucide-react';
import { copyLink, shareTo, useConnectedAccounts, type Network } from '@/lib/profile-shared';
import './share-sheet.css';

type Props = { open: boolean; onClose: () => void; title: string; url: string };

export function ShareSheet({ open, onClose, title, url }: Props) {
  const { connected } = useConnectedAccounts();
  const [toast, setToast] = useState<string | null>(null);

  // Ferme avec Échap
  useEffect(() => {
    if (!open) { setToast(null); return; }
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  // Le message disparaît tout seul
  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(null), 2200);
    return () => clearTimeout(id);
  }, [toast]);

  async function handleCopy() {
    try { await copyLink(url); setToast('Lien copié'); }
    catch { setToast('Copie impossible : copie le lien à la main'); }
  }

  async function handleNetwork(n: Network) {
    try {
      const r = await shareTo(n, url, title);
      setToast(r === 'copied' ? `Lien copié : colle-le dans ${n.name}` : null);
    } catch { setToast('Partage impossible'); }
  }

  async function handleMore() {
    if (typeof navigator.share === 'function') {
      try { await navigator.share({ title, url }); } catch { /* annulé */ }
    } else {
      handleCopy();
    }
  }

  return (
    <div className={`sh${open ? ' open' : ''}`} aria-hidden={!open}>
      <div className="sh-ov" onClick={onClose} />
      <div className="sh-sheet" role="dialog" aria-modal="true" aria-label="Partager ce résumé">
        <div className="sh-hn" />
        <h2 className="sh-t">Partager ce résumé</h2>

        <div className="sh-lk">
          <span>{url.replace(/^https?:\/\//, '')}</span>
          <button onClick={handleCopy}>
            <Copy size={15} /> {toast === 'Lien copié' ? 'Lien copié' : 'Copier le lien'}
          </button>
        </div>

        <p className="sh-lb">Partager sur tes comptes</p>
        {connected.length > 0 ? (
          <ul className="sh-nw">
            {connected.map((n) => (
              <li key={n.id}>
                <button onClick={() => handleNetwork(n)} aria-label={`Partager sur ${n.name}`}>
                  <n.Icon size={24} />
                </button>
                <span>{n.name}</span>
              </li>
            ))}
            <li>
              <Link href="/profil" aria-label="Ajouter un compte" className="add"><Plus size={24} /></Link>
              <span>Ajouter</span>
            </li>
          </ul>
        ) : (
          <p className="sh-emp">
            Aucun compte connecté. <Link href="/profil">Ajoute un réseau depuis ton profil</Link> pour partager en un geste.
          </p>
        )}

        <button className="sh-more" onClick={handleMore}>
          <span><Ellipsis size={17} /></span> Plus d'options
        </button>

        <p role="status" className="sh-st">{toast && toast !== 'Lien copié' ? toast : ''}</p>
      </div>
    </div>
  );
}
