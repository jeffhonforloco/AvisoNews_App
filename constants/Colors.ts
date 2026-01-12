export const Colors = {
  light: {
    // Primary
    primary: '#FF6B6B',
    primaryLight: '#FF8E53',
    primaryDark: '#E85555',

    // Background
    background: '#F2F2F7',
    backgroundElevated: '#FFFFFF',
    backgroundSecondary: '#FAFAFA',

    // Text
    text: '#1C1C1E',
    textSecondary: '#3C3C43',
    textTertiary: '#8E8E93',
    textQuaternary: '#C7C7CC',

    // Border
    border: '#E5E5EA',
    borderLight: '#F2F2F7',

    // Card
    cardBackground: '#FFFFFF',
    cardBorder: '#E5E5EA',

    // Status
    success: '#34C759',
    warning: '#FF9500',
    error: '#FF3B30',
    info: '#007AFF',

    // Overlay
    overlay: 'rgba(0, 0, 0, 0.5)',
    overlayLight: 'rgba(0, 0, 0, 0.3)',

    // Gradient
    gradientStart: '#FF6B6B',
    gradientEnd: '#FF8E53',

    // Tab Bar
    tabBarBackground: '#FFFFFF',
    tabBarBorder: '#E5E5EA',
    tabBarActive: '#FF6B6B',
    tabBarInactive: '#8E8E93',

    // Input
    inputBackground: '#F2F2F7',
    inputBorder: '#E5E5EA',
    inputPlaceholder: '#8E8E93',

    // Shadow
    shadowColor: '#000000',
  },

  dark: {
    // Primary
    primary: '#FF6B6B',
    primaryLight: '#FF8E53',
    primaryDark: '#E85555',

    // Background
    background: '#000000',
    backgroundElevated: '#1C1C1E',
    backgroundSecondary: '#2C2C2E',

    // Text
    text: '#FFFFFF',
    textSecondary: '#E5E5EA',
    textTertiary: '#AEAEB2',
    textQuaternary: '#636366',

    // Border
    border: '#38383A',
    borderLight: '#48484A',

    // Card
    cardBackground: '#1C1C1E',
    cardBorder: '#38383A',

    // Status
    success: '#32D74B',
    warning: '#FF9F0A',
    error: '#FF453A',
    info: '#0A84FF',

    // Overlay
    overlay: 'rgba(0, 0, 0, 0.7)',
    overlayLight: 'rgba(0, 0, 0, 0.5)',

    // Gradient
    gradientStart: '#FF6B6B',
    gradientEnd: '#FF8E53',

    // Tab Bar
    tabBarBackground: '#1C1C1E',
    tabBarBorder: '#38383A',
    tabBarActive: '#FF6B6B',
    tabBarInactive: '#8E8E93',

    // Input
    inputBackground: '#2C2C2E',
    inputBorder: '#38383A',
    inputPlaceholder: '#8E8E93',

    // Shadow
    shadowColor: '#000000',
  },
};

export type Theme = typeof Colors.light;
export type ColorScheme = 'light' | 'dark';
