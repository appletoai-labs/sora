// src/context/UiPreferencesContext.tsx
import { createContext, useContext, useEffect, useState } from "react";

type UiPreferences = {
  highContrast: boolean;
  fontSizeLevel: number;
  setHighContrast: (value: boolean) => void;
  setFontSizeLevel: (value: number) => void;
};

const UiPreferencesContext = createContext<UiPreferences | undefined>(undefined);

export const UiPreferencesProvider = ({ children }: { children: React.ReactNode }) => {
  const [highContrast, setHighContrastState] = useState(false);
  const [fontSizeLevel, setFontSizeLevelState] = useState(1);

  useEffect(() => {
    const contrast = localStorage.getItem("sora-contrast");
    const fontSize = localStorage.getItem("sora-fontsize");
    if (contrast) setHighContrastState(contrast === "true");
    if (fontSize) setFontSizeLevelState(parseInt(fontSize));
  }, []);

  useEffect(() => {
    localStorage.setItem("sora-contrast", highContrast.toString());
    localStorage.setItem("sora-fontsize", fontSizeLevel.toString());
  }, [highContrast, fontSizeLevel]);

  return (
    <UiPreferencesContext.Provider
      value={{
        highContrast,
        fontSizeLevel,
        setHighContrast: setHighContrastState,
        setFontSizeLevel: setFontSizeLevelState,
      }}
    >
      {children}
    </UiPreferencesContext.Provider>
  );
};

export const useUiPreferences = () => {
  const context = useContext(UiPreferencesContext);
  if (!context) throw new Error("useUiPreferences must be used within UiPreferencesProvider");
  return context;
};
