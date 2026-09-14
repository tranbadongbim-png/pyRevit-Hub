import { RevitTheme } from '../types';

export const REVIT_THEME_PALETTES = {
  dark: {
    WindowBg: '#1E1E24',
    CardBg: '#272730',
    CardHover: '#30303C',
    BorderColor: '#3A3A47',
    TextPrimary: '#F3F4F6',
    TextSecondary: '#9CA3AF',
    TextMuted: '#6B7280',
    AccentColor: '#38BDF8',
    AccentHover: '#0EA5E9',
    AccentText: '#0F172A',
    BadgeBg: '#2A374A',
    BadgeBorder: '#38BDF8',
    DangerColor: '#EF4444',
    CriticalBg: '#451A1A',
    CriticalBorder: '#EF4444',
    InputBg: '#141418',
    InputBorder: '#3A3A47',
    SuccessColor: '#10B981',
    WarningColor: '#F59E0B',
  },
  light: {
    WindowBg: '#FFFFFF',
    CardBg: '#F8FAFC',
    CardHover: '#F1F5F9',
    BorderColor: '#CBD5E1',
    TextPrimary: '#0F172A',
    TextSecondary: '#64748B',
    TextMuted: '#94A3B8',
    AccentColor: '#0284C7',
    AccentHover: '#0369A1',
    AccentText: '#FFFFFF',
    BadgeBg: '#E0F2FE',
    BadgeBorder: '#BAE6FD',
    DangerColor: '#EF4444',
    CriticalBg: '#FEF2F2',
    CriticalBorder: '#F87171',
    InputBg: '#FFFFFF',
    InputBorder: '#CBD5E1',
    SuccessColor: '#10B981',
    WarningColor: '#F59E0B',
  },
};

const WPF_NAMED_COLORS: Record<string, string> = {
  black: '#000000',
  white: '#FFFFFF',
  transparent: 'transparent',
  red: '#FF0000',
  green: '#008000',
  blue: '#0000FF',
  yellow: '#FFFF00',
  orange: '#FFA500',
  gray: '#808080',
  grey: '#808080',
  lightgray: '#D3D3D3',
  lightgrey: '#D3D3D3',
  darkgray: '#A9A9A9',
  darkgrey: '#A9A9A9',
  dimgray: '#696969',
  dimgrey: '#696969',
  slategray: '#708090',
  slategrey: '#708090',
  lightslategray: '#778899',
  dodgerblue: '#1E90FF',
  skyblue: '#87CEEB',
  deepskyblue: '#00BFFF',
  royalblue: '#4169E1',
  navy: '#000080',
  teal: '#008080',
  cyan: '#00FFFF',
  magenta: '#FF00FF',
  purple: '#800080',
  crimson: '#DC143C',
  gainsboro: '#DCDCDC',
  ghostwhite: '#F8F8FF',
  whitesmoke: '#F5F5F5',
  silver: '#C0C0C0',
  maroon: '#800000',
  gold: '#FFD700',
  goldenrod: '#DAA520',
};

/**
 * Converts WPF colors (including #AARRGGBB, Named Colors, and DynamicResources) to CSS-compatible strings.
 */
export function resolveWpfColor(
  val: string | null | undefined,
  theme: RevitTheme,
  resources: Record<string, string> = {},
  defaultColor: string = 'inherit'
): string {
  if (!val) return defaultColor;
  val = val.trim();
  if (val.toLowerCase() === 'transparent') return 'transparent';

  // Check DynamicResource or StaticResource
  const dynMatch = val.match(/\{(?:DynamicResource|StaticResource)\s+([a-zA-Z0-9_]+)\}/);
  if (dynMatch) {
    const resKey = dynMatch[1];
    const palette = REVIT_THEME_PALETTES[theme];
    if ((palette as any)[resKey]) {
      return (palette as any)[resKey];
    }
    if (resources[resKey]) {
      return resolveWpfColor(resources[resKey], theme, resources, defaultColor);
    }
    return defaultColor;
  }

  // Check WPF 8-char Hex: #AARRGGBB
  if (val.startsWith('#') && val.length === 9) {
    const a = parseInt(val.substring(1, 3), 16) / 255;
    const r = parseInt(val.substring(3, 5), 16);
    const g = parseInt(val.substring(5, 7), 16);
    const b = parseInt(val.substring(7, 9), 16);
    return `rgba(${r}, ${g}, ${b}, ${Number(a.toFixed(3))})`;
  }

  // Standard 6-char or 3-char Hex
  if (val.startsWith('#')) {
    return val;
  }

  // Named Colors
  const lower = val.toLowerCase();
  if (WPF_NAMED_COLORS[lower]) {
    return WPF_NAMED_COLORS[lower];
  }

  return val;
}

/**
 * Parses WPF Thickness (Left, Top, Right, Bottom) into CSS box spacing (top right bottom left).
 */
export function parseWpfThickness(spacing: string | null | undefined): string {
  if (!spacing) return '0px';
  const parts = spacing.split(',').map((s) => s.trim());
  if (parts.length === 1) {
    return isNaN(Number(parts[0])) ? parts[0] : `${parts[0]}px`;
  }
  if (parts.length === 2) {
    // WPF: Horizontal, Vertical -> CSS: Vertical Horizontal
    const horiz = isNaN(Number(parts[0])) ? parts[0] : `${parts[0]}px`;
    const vert = isNaN(Number(parts[1])) ? parts[1] : `${parts[1]}px`;
    return `${vert} ${horiz}`;
  }
  if (parts.length === 4) {
    // WPF: Left, Top, Right, Bottom -> CSS: Top, Right, Bottom, Left
    const left = isNaN(Number(parts[0])) ? parts[0] : `${parts[0]}px`;
    const top = isNaN(Number(parts[1])) ? parts[1] : `${parts[1]}px`;
    const right = isNaN(Number(parts[2])) ? parts[2] : `${parts[2]}px`;
    const bottom = isNaN(Number(parts[3])) ? parts[3] : `${parts[3]}px`;
    return `${top} ${right} ${bottom} ${left}`;
  }
  return spacing;
}

/**
 * Parses WPF CornerRadius (TopLeft, TopRight, BottomRight, BottomLeft).
 */
export function parseWpfCornerRadius(radius: string | null | undefined): string {
  if (!radius || radius === '0') return '0px';
  const parts = radius.split(',').map((p) => p.trim());
  if (parts.length === 1) {
    return isNaN(Number(parts[0])) ? parts[0] : `${parts[0]}px`;
  }
  if (parts.length === 4) {
    return `${parts[0]}px ${parts[1]}px ${parts[2]}px ${parts[3]}px`;
  }
  return radius;
}

/**
 * Converts WPF Grid length (*, 2*, Auto, 120) to CSS Grid unit (fr, auto, px).
 */
export function parseGridLength(len: string | null | undefined): string {
  if (!len) return '1fr';
  const trimmed = len.trim().toLowerCase();
  if (trimmed === 'auto') return 'auto';
  if (trimmed === '*') return '1fr';
  if (trimmed.endsWith('*')) {
    const num = parseFloat(trimmed.slice(0, -1));
    return `${isNaN(num) ? 1 : num}fr`;
  }
  const num = parseFloat(trimmed);
  return isNaN(num) ? trimmed : `${num}px`;
}
