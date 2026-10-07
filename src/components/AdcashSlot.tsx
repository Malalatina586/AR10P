"use client";

import { useEffect, useRef } from "react";

declare global {
  interface Window {
    aclib?: {
      runBanner: (options: { zoneId: string }) => void;
    };
  }
}

export default function AdcashSlot() {
  const slotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!window.aclib || !slotRef.current) return;

    window.aclib.runBanner({
      zoneId: "12282130",
    });
  }, []);

  return (
    <div
      ref={slotRef}
      className="adcash-slot"
      aria-label="Publicité"
    />
  );
}
