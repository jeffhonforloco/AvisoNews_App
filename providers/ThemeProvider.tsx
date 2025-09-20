import { useState, useEffect, useMemo } from 'react';
import { Appearance, ColorSchemeName } from 'react-native';
import createContextHook from '@nkzw/create-context-hook';
import { lightColors, darkColors, ColorScheme } from '@/constants/colors';
import { usePreferences } from './PreferencesProvider';

interface ThemeContextType {
  colors: ColorScheme;
  isDark: boolean;
  colorScheme: 'light' | 'dark';
}

export const [ThemeProvider, useTheme] = createContextHook<ThemeContextType>(() => {
  const { preferences } = usePreferences();
  const [systemColorScheme, setSystemColorScheme] = useState<ColorSchemeName>(
    Appearance.getColorScheme()
  );

  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      setSystemColorScheme(colorScheme);
    });

    return () => subscription?.remove();
  }, []);

  const getEffectiveColorScheme = (): 'light' | 'dark' => {
    // Add null check and default value
    const theme = preferences?.readingPreferences?.theme;
    
    // Handle legacy boolean darkMode value
    if (typeof theme === 'boolean') {
      return theme ? 'dark' : 'light';
    }
    
    // Handle string theme value
    const themeStr = theme || 'auto';
    if (themeStr === 'auto') {
      return systemColorScheme === 'dark' ? 'dark' : 'light';
    }
    return themeStr === 'dark' ? 'dark' : 'light';
  };

  const colorScheme = getEffectiveColorScheme();
  const isDark = colorScheme === 'dark';
  const colors = isDark ? darkColors : lightColors;

  return useMemo(() => ({
    colors,
    isDark,
    colorScheme,
  }), [colors, isDark, colorScheme]);
});