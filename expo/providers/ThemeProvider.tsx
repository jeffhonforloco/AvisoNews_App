import React, { createContext, useContext, useMemo } from "react";
import { useColorScheme } from "react-native";
import { Colors, Theme, ColorScheme } from "@/constants/Colors";
import { usePreferences } from "./PreferencesProvider";

interface ThemeContextType {
  theme: Theme;
  colorScheme: ColorScheme;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemColorScheme = useColorScheme();
  const { preferences } = usePreferences();

  const themeValue = useMemo(() => {
    const colorScheme: ColorScheme = preferences.darkMode
      ? 'dark'
      : (systemColorScheme === 'dark' ? 'dark' : 'light');

    const theme = Colors[colorScheme] ?? Colors.light;
    const isDark = colorScheme === 'dark';

    return { theme, colorScheme, isDark };
  }, [preferences.darkMode, systemColorScheme]);

  const { theme, colorScheme, isDark } = themeValue;

  return (
    <ThemeContext.Provider value={{ theme, colorScheme, isDark }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
