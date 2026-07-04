"use client";

import { useEffect } from "react";

export default function ThemeSetter({ themeClass }: { themeClass: string }) {
  useEffect(() => {
    document.body.classList.add(themeClass);
    return () => {
      document.body.classList.remove(themeClass);
    };
  }, [themeClass]);

  return null;
}
