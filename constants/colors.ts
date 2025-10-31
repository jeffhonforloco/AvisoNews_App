// AvisoNews Premium Design System
// Modern, sophisticated color palette inspired by premium news platforms

export const lightColors = {
  primary: "#0071E3", // Premium blue - trust, clarity, news
  secondary: "#1D1D1F", // Rich black for contrast
  accent: "#007AFF",
  highlight: "#FF6B35", // Vibrant orange for breaking news
  shadow: "#000000",
  
  text: {
    primary: "#1D1D1F",
    secondary: "#86868B",
    tertiary: "#C7C7CC",
    inverse: "#FFFFFF",
    muted: "#AEAEB2",
  },
  
  background: {
    primary: "#FBFBFD", // Off-white, softer than pure white
    secondary: "#F5F5F7",
    tertiary: "#E8E8ED",
    card: "#FFFFFF",
    modal: "#FFFFFF",
    elevated: "#FFFFFF",
    overlay: "rgba(0, 0, 0, 0.4)",
  },
  
  border: {
    primary: "#D2D2D7",
    secondary: "#E5E5EA",
    tertiary: "#F5F5F7",
  },
  
  // Premium category colors with better saturation
  categories: {
    tech: "#0071E3",
    business: "#30C86E",
    world: "#FF9500",
    health: "#FF3B30",
    gaming: "#5856D6",
    science: "#00C7BE",
    sports: "#FF6B35",
    audio: "#AF52DE",
    politics: "#8E8E93",
    entertainment: "#FF2D55",
    environment: "#34C759",
  },
  
  status: {
    success: "#30C86E",
    warning: "#FF9500",
    error: "#FF3B30",
    info: "#0071E3",
    breaking: "#FF6B35",
  },
  
  // Gradients for premium feel
  gradients: {
    primary: ["#0071E3", "#0051D5"],
    secondary: ["#FF6B35", "#FF8E53"],
    hero: ["rgba(0, 113, 227, 0.1)", "rgba(255, 107, 53, 0.1)"],
    card: ["rgba(255, 255, 255, 0.95)", "rgba(255, 255, 255, 0.85)"],
  },
  
  // Shadows for depth
  shadows: {
    small: "0 1px 3px rgba(0, 0, 0, 0.08)",
    medium: "0 4px 12px rgba(0, 0, 0, 0.1)",
    large: "0 8px 24px rgba(0, 0, 0, 0.12)",
    card: "0 2px 8px rgba(0, 0, 0, 0.06)",
  },
};

export const darkColors = {
  primary: "#0A84FF", // Brighter blue for dark mode
  secondary: "#FFFFFF",
  accent: "#0A84FF",
  highlight: "#FF6B35",
  shadow: "#000000",
  
  text: {
    primary: "#F5F5F7",
    secondary: "#AEAEB2",
    tertiary: "#636366",
    inverse: "#1D1D1F",
    muted: "#8E8E93",
  },
  
  background: {
    primary: "#000000", // True black like Apple News
    secondary: "#1C1C1E",
    tertiary: "#2C2C2E",
    card: "#1C1C1E",
    modal: "#2C2C2E",
    elevated: "#2C2C2E",
    overlay: "rgba(0, 0, 0, 0.6)",
  },
  
  border: {
    primary: "#38383A",
    secondary: "#48484A",
    tertiary: "#2C2C2E",
  },
  
  categories: {
    tech: "#0A84FF",
    business: "#32D74B",
    world: "#FF9F0A",
    health: "#FF453A",
    gaming: "#5E5CE6",
    science: "#64D2FF",
    sports: "#FF6B35",
    audio: "#BF5AF2",
    politics: "#8E8E93",
    entertainment: "#FF2D55",
    environment: "#32D74B",
  },
  
  status: {
    success: "#32D74B",
    warning: "#FF9F0A",
    error: "#FF453A",
    info: "#0A84FF",
    breaking: "#FF6B35",
  },
  
  gradients: {
    primary: ["#0A84FF", "#0051D5"],
    secondary: ["#FF6B35", "#FF8E53"],
    hero: ["rgba(10, 132, 255, 0.15)", "rgba(255, 107, 53, 0.15)"],
    card: ["rgba(28, 28, 30, 0.95)", "rgba(28, 28, 30, 0.85)"],
  },
  
  shadows: {
    small: "0 1px 3px rgba(0, 0, 0, 0.3)",
    medium: "0 4px 12px rgba(0, 0, 0, 0.4)",
    large: "0 8px 24px rgba(0, 0, 0, 0.5)",
    card: "0 2px 8px rgba(0, 0, 0, 0.3)",
  },
};

export type ColorScheme = typeof lightColors;

export default lightColors;