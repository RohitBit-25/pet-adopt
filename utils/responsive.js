import { Dimensions, Platform, StatusBar } from "react-native";

// Get device dimensions
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

// Device type detection
const isTablet = SCREEN_WIDTH >= 768;
const isSmallPhone = SCREEN_WIDTH < 375;
const isMediumPhone = SCREEN_WIDTH >= 375 && SCREEN_WIDTH < 414;
const isLargePhone = SCREEN_WIDTH >= 414;

// Status bar height
const STATUS_BAR_HEIGHT =
  Platform.OS === "ios" ? 44 : StatusBar.currentHeight || 24;

// Safe area calculations
const HEADER_HEIGHT = Platform.OS === "ios" ? 88 : 64;
const TAB_BAR_HEIGHT = Platform.OS === "ios" ? 83 : 60;

// Responsive scaling functions
const scale = (size) => {
  const baseWidth = 375; // iPhone X base width
  return (SCREEN_WIDTH / baseWidth) * size;
};

const verticalScale = (size) => {
  const baseHeight = 812; // iPhone X base height
  return (SCREEN_HEIGHT / baseHeight) * size;
};

const moderateScale = (size, factor = 0.5) => {
  return size + (scale(size) - size) * factor;
};

// Font scaling with device-specific adjustments
const fontScale = (size) => {
  if (isTablet) {
    return moderateScale(size, 0.3); // Less scaling for tablets
  } else if (isSmallPhone) {
    return moderateScale(size, 0.2); // Minimal scaling for small phones
  } else if (isLargePhone) {
    return moderateScale(size, 0.4); // More scaling for large phones
  }
  return moderateScale(size, 0.3); // Default for medium phones
};

// Spacing system
const spacing = {
  xs: scale(4),
  sm: scale(8),
  md: scale(16),
  lg: scale(24),
  xl: scale(32),
  xxl: scale(48),
};

// Responsive padding/margin
const responsivePadding = {
  horizontal: isTablet ? scale(40) : scale(20),
  vertical: isTablet ? scale(30) : scale(20),
  small: isTablet ? scale(12) : scale(8),
  medium: isTablet ? scale(20) : scale(16),
  large: isTablet ? scale(32) : scale(24),
};

// Font sizes
const fontSize = {
  xs: fontScale(10),
  sm: fontScale(12),
  md: fontScale(14),
  lg: fontScale(16),
  xl: fontScale(18),
  xxl: fontScale(20),
  title: fontScale(24),
  heading: fontScale(28),
  hero: fontScale(32),
};

// Icon sizes
const iconSize = {
  xs: scale(12),
  sm: scale(16),
  md: scale(20),
  lg: scale(24),
  xl: scale(28),
  xxl: scale(32),
};

// Border radius
const borderRadius = {
  sm: scale(8),
  md: scale(12),
  lg: scale(16),
  xl: scale(20),
  xxl: scale(24),
  round: scale(50),
};

// Shadow system
const shadow = {
  small: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: scale(2) },
    shadowOpacity: 0.1,
    shadowRadius: scale(4),
    elevation: 2,
  },
  medium: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: scale(4) },
    shadowOpacity: 0.15,
    shadowRadius: scale(8),
    elevation: 4,
  },
  large: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: scale(8) },
    shadowOpacity: 0.2,
    shadowRadius: scale(16),
    elevation: 8,
  },
};

// Component-specific responsive values
const components = {
  header: {
    height: isTablet ? verticalScale(120) : verticalScale(100),
    paddingTop: STATUS_BAR_HEIGHT + spacing.md,
    paddingBottom: spacing.lg,
    paddingHorizontal: responsivePadding.horizontal,
  },
  card: {
    padding: isTablet ? spacing.xl : spacing.lg,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.md,
  },
  button: {
    height: isTablet ? scale(56) : scale(48),
    paddingHorizontal: isTablet ? spacing.xl : spacing.lg,
    borderRadius: borderRadius.xl,
  },
  input: {
    height: isTablet ? scale(56) : scale(48),
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.xl,
    fontSize: fontSize.lg,
  },
  avatar: {
    small: scale(32),
    medium: scale(48),
    large: scale(64),
    xlarge: scale(80),
  },
  image: {
    small: scale(60),
    medium: scale(80),
    large: scale(120),
    xlarge: scale(150),
  },
};

// Grid system
const grid = {
  container: {
    paddingHorizontal: responsivePadding.horizontal,
    maxWidth: isTablet ? 1024 : SCREEN_WIDTH,
  },
  columns: isTablet ? 3 : 2, // For pet grid layouts
};

// Responsive breakpoints
const breakpoints = {
  small: 375,
  medium: 414,
  large: 768,
  xlarge: 1024,
};

// Device info
const deviceInfo = {
  isTablet,
  isSmallPhone,
  isMediumPhone,
  isLargePhone,
  screenWidth: SCREEN_WIDTH,
  screenHeight: SCREEN_HEIGHT,
  statusBarHeight: STATUS_BAR_HEIGHT,
  headerHeight: HEADER_HEIGHT,
  tabBarHeight: TAB_BAR_HEIGHT,
};

export {
  scale,
  verticalScale,
  moderateScale,
  fontScale,
  spacing,
  responsivePadding,
  fontSize,
  iconSize,
  borderRadius,
  shadow,
  components,
  grid,
  breakpoints,
  deviceInfo,
  SCREEN_WIDTH,
  SCREEN_HEIGHT,
};
