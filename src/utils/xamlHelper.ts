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
 * Converts WPF Grid length (*, 2*, Auto, 120) with optional Min/Max to CSS Grid unit.
 */
export function parseGridLength(
  len: string | null | undefined,
  minVal?: string | null,
  maxVal?: string | null
): string {
  const minPx = minVal ? parseFloat(minVal) : null;
  const maxPx = maxVal ? parseFloat(maxVal) : null;

  if (!len) {
    if (minPx) return `minmax(${minPx}px, 1fr)`;
    return '1fr';
  }

  const trimmed = len.trim().toLowerCase();
  if (trimmed === 'auto') {
    if (minPx && !isNaN(minPx)) return `minmax(${minPx}px, auto)`;
    return 'auto';
  }

  if (trimmed === '*') {
    if (minPx && !isNaN(minPx)) return `minmax(${minPx}px, 1fr)`;
    return '1fr';
  }

  if (trimmed.endsWith('*')) {
    const num = parseFloat(trimmed.slice(0, -1));
    const frVal = `${isNaN(num) ? 1 : num}fr`;
    if (minPx && !isNaN(minPx)) return `minmax(${minPx}px, ${frVal})`;
    return frVal;
  }

  const num = parseFloat(trimmed);
  if (!isNaN(num)) {
    let finalPx = num;
    if (minPx && !isNaN(minPx) && finalPx < minPx) finalPx = minPx;
    if (maxPx && !isNaN(maxPx) && finalPx > maxPx) finalPx = maxPx;
    return `${finalPx}px`;
  }

  return trimmed;
}

export interface WpfColumnDefinition {
  header: string;
  binding?: string;
  type: 'text' | 'checkbox' | 'template' | 'combobox' | 'hyperlink';
  width?: string;
  textAlignment?: string;
}

/**
 * Intelligent BIM sample row generator tailored for Revit pyRevit DataGrid / ListView tables.
 */
export function generateBimSampleRows(columns: WpfColumnDefinition[], count: number = 15): Record<string, any>[] {
  const sheetNumbers = ['A101', 'A102', 'A103', 'A201', 'A202', 'S101', 'S102', 'S201', 'M101', 'M102', 'E101', 'E102', 'P101', 'P102', 'Q101', 'Q102'];
  const sheetNames = [
    'Mặt Bằng Kiến Trúc Tầng 1',
    'Mặt Bằng Kiến Trúc Tầng 2',
    'Mặt Bằng Bố Trí Nội Thất',
    'Mặt Cắt Tổng Thể Công Trình 1-1',
    'Mặt Đứng Trục Chính A-D',
    'Mặt Bằng Kết Cấu Móng & Cột',
    'Mặt Bằng Kết Cấu Dầm Sàn Tầng 2',
    'Chi Tiết Cầu Thang Bộ Thang Máy',
    'Sơ Đồ Nguyên Lý Cấp Điện Chiếu Sáng',
    'Mặt Bằng Cấp Thoát Nước Vệ Sinh',
    'Mặt Bằng Hệ Thống Thông Gió HVAC',
    'Mặt Bằng Báo Cháy & PCCC Tự Động',
    'Chi Tiết Vách Kính & Cửa Đi',
    'Bảng Thống Kê Cửa & Cấu Kiện',
    'Mặt Bằng Tổng Thể Cảnh Quan Dự Án',
  ];
  const disciplines = ['Kiến Trúc', 'Kiến Trúc', 'Nội Thất', 'Kiến Trúc', 'Kiến Trúc', 'Kết Cấu', 'Kết Cấu', 'Kết Cấu', 'Điện (MEP)', 'Nước (MEP)', 'HVAC (MEP)', 'PCCC', 'Kiến Trúc', 'Dự Toán', 'Quy Hoạch'];
  const scales = ['1:100', '1:100', '1:50', '1:100', '1:100', '1:100', '1:50', '1:25', '1:100', '1:100', '1:100', '1:100', '1:20', '1:1', '1:500'];
  const authors = ['Đông TB', 'Anh ĐT', 'Nam NV', 'Tuấn PM', 'Linh KT', 'Hoàng BIM', 'Đông TB', 'Hương KD', 'Quân ME', 'Thắng ME', 'Đông TB', 'Duy QC', 'Việt Arch', 'Sơn BIM', 'Hà KT'];
  const statuses = ['Đã duyệt', 'Đang sửa', 'Đã duyệt', 'Hoàn thành', 'Đang vẽ', 'Đã duyệt', 'Chờ phê duyệt', 'Hoàn thành', 'Đang kiểm tra', 'Đã duyệt', 'Đang sửa', 'Đã duyệt', 'Chờ kiểm tra', 'Hoàn thành', 'Đã duyệt'];
  const families = ['M_Door_Single_Flush', 'M_Window_Fixed_2Pane', 'M_Desk_Office_1500', 'Rectangular_Column_400x400', 'Floor_Concrete_200mm', 'Basic_Wall_Brick_220mm', 'M_Chair_Executive', 'Structural_Framing_W310', 'M_Air_Terminal_Grille', 'M_Pipe_PPR_DN50'];
  const categories = ['Doors', 'Windows', 'Furniture', 'Structural Columns', 'Floors', 'Walls', 'Furniture', 'Structural Framing', 'Duct Accessories', 'Pipes'];
  const levels = ['Tầng 1 (0.000)', 'Tầng 2 (+3.600)', 'Tầng 3 (+7.200)', 'Tầng 4 (+10.800)', 'Tầng Mái (+14.400)', 'Tầng Hầm (-3.300)'];

  const rows: Record<string, any>[] = [];

  for (let i = 0; i < count; i++) {
    const row: Record<string, any> = { _id: `row-${i + 1}`, _isSelected: i % 3 === 0 };

    columns.forEach((col, cIdx) => {
      const hLower = (col.header || '').toLowerCase();
      const bLower = (col.binding || '').toLowerCase();
      const key = col.binding || col.header || `col_${cIdx}`;

      if (col.type === 'checkbox' || hLower.includes('chọn') || hLower.includes('select') || bLower.includes('check') || bLower.includes('selected')) {
        row[key] = i % 2 === 0;
      } else if (hLower.includes('số hiệu') || hLower.includes('number') || bLower.includes('number')) {
        row[key] = sheetNumbers[i % sheetNumbers.length];
      } else if (hLower.includes('tên') || hLower.includes('name') || bLower.includes('name')) {
        row[key] = sheetNames[i % sheetNames.length];
      } else if (hLower.includes('bộ môn') || hLower.includes('discipline')) {
        row[key] = disciplines[i % disciplines.length];
      } else if (hLower.includes('tỷ lệ') || hLower.includes('scale')) {
        row[key] = scales[i % scales.length];
      } else if (hLower.includes('vẽ') || hLower.includes('drawn') || hLower.includes('người') || hLower.includes('author')) {
        row[key] = authors[i % authors.length];
      } else if (hLower.includes('duyệt') || hLower.includes('checked') || hLower.includes('approv')) {
        row[key] = 'Tuấn PM (Lead)';
      } else if (hLower.includes('trạng thái') || hLower.includes('status')) {
        row[key] = statuses[i % statuses.length];
      } else if (hLower.includes('family')) {
        row[key] = families[i % families.length];
      } else if (hLower.includes('category') || hLower.includes('phân loại')) {
        row[key] = categories[i % categories.length];
      } else if (hLower.includes('level') || hLower.includes('cao độ') || hLower.includes('tầng')) {
        row[key] = levels[i % levels.length];
      } else if (hLower.includes('dung lượng') || hLower.includes('size')) {
        row[key] = `${(1.2 + (i * 0.7)).toFixed(1)} MB`;
      } else if (hLower.includes('diện tích') || hLower.includes('area')) {
        row[key] = `${(32 + (i * 8.4)).toFixed(1)} m²`;
      } else if (hLower.includes('lần sửa') || hLower.includes('revision') || bLower.includes('rev')) {
        row[key] = `Rev ${(i % 3)}`;
      } else if (col.type === 'template' || hLower.includes('thao tác') || hLower.includes('action')) {
        row[key] = 'Xem Chi Tiết';
      } else {
        row[key] = `Giá trị #${i + 1}-${cIdx + 1}`;
      }
    });

    rows.push(row);
  }

  return rows;
}
