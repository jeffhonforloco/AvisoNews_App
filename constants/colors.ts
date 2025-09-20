export const lightColors = {
  primary: "#FF6B6B",
  secondary: "#FF8E53",
  accent: "#007AFF",
  shadow: "#000000",
  
  text: {
    primary: "#1C1C1E",
    secondary: "#8E8E93",
    tertiary: "#C7C7CC",
    inverse: "#FFFFFF",
  },
  
  background: {
    primary: "#FFFFFF",
    secondary: "#F2F2F7",
    tertiary: "#E5E5EA",
    card: "#FFFFFF",
    modal: "#FFFFFF",
  },
  
  border: {
    primary: "#E5E5EA",
    secondary: "#C7C7CC",
  },
  
  categories: {
    tech: "#007AFF",
    business: "#34C759",
    world: "#FF9500",
    health: "#FF3B30",
    gaming: "#5856D6",
    science: "#00C7BE",
    sports: "#FF9500",
    audio: "#AF52DE",
  },
  
  status: {
    success: "#34C759",
    warning: "#FF9500",
    error: "#FF3B30",
    info: "#007AFF",
  },
};

export const darkColors = {
  primary: "#FF6B6B",
  secondary: "#FF8E53",
  accent: "#0A84FF",
  shadow: "#000000",
  
  text: {
    primary: "#FFFFFF",
    secondary: "#8E8E93",
    tertiary: "#48484A",
    inverse: "#1C1C1E",
  },
  
  background: {
    primary: "#000000",
    secondary: "#1C1C1E",
    tertiary: "#2C2C2E",
    card: "#1C1C1E",
    modal: "#2C2C2E",
  },
  
  border: {
    primary: "#38383A",
    secondary: "#48484A",
  },
  
  categories: {
    tech: "#0A84FF",
    business: "#30D158",
    world: "#FF9F0A",
    health: "#FF453A",
    gaming: "#5E5CE6",
    science: "#40C8E0",
    sports: "#FF9F0A",
    audio: "#BF5AF2",
  },
  
  status: {
    success: "#30D158",
    warning: "#FF9F0A",
    error: "#FF453A",
    info: "#0A84FF",
  },
};

export type ColorScheme = typeof lightColors;

export default lightColors;