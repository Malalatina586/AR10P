import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AR10P — All Résumé in 10 Pages",
  description: "L’essentiel des livres, films, actualités et idées en 10 pages.",
  applicationName: "AR10P",
  manifest: "/manifest.webmanifest",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
