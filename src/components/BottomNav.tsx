"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  IconSmartHome,
  IconMessages,
  IconStackPlus,
  IconUserTabler,
} from "./Icons";

const ITEMS = [
  { href: "/", label: "Fil", Icon: IconSmartHome },
  { href: "/messages", label: "Messages", Icon: IconMessages },
  { href: "/bibliotheque", label: "Bibliothèque", Icon: IconStackPlus },
  { href: "/profil", label: "Profil", Icon: IconUserTabler },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="tabbar" aria-label="Navigation principale">
      {ITEMS.map(({ href, label, Icon }) => {
        const active =
          href === "/" ? pathname === "/" : pathname.startsWith(href);

        return (
          <Link
            key={href}
            className={`tab${active ? " active" : ""}`}
            href={href}
            aria-label={label}
            aria-current={active ? "page" : undefined}
          >
            <Icon />
          </Link>
        );
      })}
    </nav>
  );
}
