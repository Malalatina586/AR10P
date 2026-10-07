"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    aclib?: {
      runAutoTag: (options: { zoneId: string }) => void;
    };
  }
}

export default function AdcashSlot() {
  useEffect(() => {
    if (!window.aclib) return;

    window.aclib.runAutoTag({
      zoneId: "oz74qhv59l",
    });
  }, []);

  return <div className="adcash-slot" aria-label="Publicité" />;
}
