// src/components/layout/AppWrapper.tsx
import { useUiPreferences } from "@/context/UiPreferencesContext";
import clsx from "clsx";
import { useEffect } from "react";

export const AppWrapper = ({ children }: { children: React.ReactNode }) => {
  const { highContrast, fontSizeLevel } = useUiPreferences();

  const fontSize = 14 + fontSizeLevel * 2;

  // Dynamically apply a class to <html> for full-site styling (optional but cleaner)
  useEffect(() => {
    const root = document.documentElement;
    if (highContrast) {
      root.classList.add("high-contrast");
    } else {
      root.classList.remove("high-contrast");
    }
  }, [highContrast]);

  return (
    <div
      className={clsx("min-h-screen", highContrast ? "bg-black text-white" : "bg-background text-foreground")}
      style={{ fontSize: `${fontSize}px` }}
    >
      {children}
    </div>
  );
};
