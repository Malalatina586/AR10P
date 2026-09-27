# AR10P — All Résumé in 10 Pages

Projet indépendant de média/résumés, pensé mobile-first et PWA.

## Vision
Permettre de comprendre rapidement l’essentiel d’un livre, d’un film, d’une actualité ou d’un sujet grâce à des synthèses originales structurées en 10 pages.

## MVP
- Accueil mobile-first
- Catégories
- Fiches de contenus
- Lecture et téléchargement de résumés
- Publicité compatible avec les règles du fournisseur choisi
- Analytics
- Stockage cloud découplé du frontend
- Préparation Supabase/Vercel

## Stack prévue
- Next.js 16 + React 19 + TypeScript
- PWA
- Supabase pour les données à venir
- Vercel pour le déploiement
- IA pour la production éditoriale, avec validation humaine

## Développement
```bash
npm install
npm run dev
```

Build Android/Termux recommandé :
```bash
npm run build
```

Le script de build utilise Webpack pour éviter les problèmes Turbopack observés sur certains environnements ARM/Android.

## Identité
AR10P — All Résumé in 10 Pages
Promesse : **L’essentiel. En 10 pages.**
