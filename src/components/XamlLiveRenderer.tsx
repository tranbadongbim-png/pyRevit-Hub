import React, { useState, useMemo, useEffect } from 'react';
import { 
  AlertCircle, 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  Sun, 
  Moon, 
  Eye, 
  RefreshCw,
  LayoutGrid,
  AppWindow,
  ChevronDown,
  ChevronRight,
  Sliders,
  ImageIcon,
  FolderOpen
} from 'lucide-react';
import { RevitTheme, PyRevitTool } from '../types';
import { WinFormsSimulator } from './WinFormsSimulator';
import { WpfDataGrid } from './WpfDataGrid';
import { WpfListBox } from './WpfListBox';
import { 
  resolveWpfColor, 
  parseWpfThickness, 
  parseWpfCornerRadius, 
  parseGridLength,
  REVIT_THEME_PALETTES 
} from '../utils/xamlHelper';

interface XamlLiveRendererProps {
  xamlCode: string;
  tool?: PyRevitTool;
  theme: RevitTheme;
  onThemeToggle?: () => void;
  onActionLog?: (type: 'event' | 'alert' | 'info' | 'warn', message: string, details?: string) => void;
}

export const XamlLiveRenderer: React.FC<XamlLiveRendererProps> = ({
  xamlCode,
  tool,
  theme,
  onThemeToggle,
  onActionLog,
}) => {
  const [zoom, setZoom] = useState(1);
  const [inspectMode, setInspectMode] = useState(false);
  const [previewEngine, setPreviewEngine] = useState<'wpf' | 'winforms'>('wpf');
  const [hoveredNodeInfo, setHoveredNodeInfo] = useState<string | null>(null);
  const [isWindowClosed, setIsWindowClosed] = useState(false);
  const [isWindowMaximized, setIsWindowMaximized] = useState(false);
  const [windowOffset, setWindowOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0, offX: 0, offY: 0 });
  const [controlValues, setControlValues] = useState<Record<string, any>>({});
  const [activeTabs, setActiveTabs] = useState<Record<string, number>>({});
  const [expandedPanels, setExpandedPanels] = useState<Record<string, boolean>>({});
  const [tableWidthPreset, setTableWidthPreset] = useState<'auto' | 'standard' | 'wide' | 'ultra'>('auto');

  useEffect(() => {
    setIsWindowClosed(false);
    setIsWindowMaximized(false);
    setControlValues({});
    setActiveTabs({});
    setExpandedPanels({});
  }, [xamlCode]);

  // Robust DOM Parser for XAML
  const { doc, parseError, resources } = useMemo(() => {
    try {
      const parser = new DOMParser();
      const parsed = parser.parseFromString(xamlCode, 'text/xml');
      const errNodes = parsed.getElementsByTagName('parsererror');
      if (errNodes.length > 0) {
        return {
          doc: null,
          parseError: errNodes[0].textContent || 'Lỗi phân tích cú pháp XAML (XML Syntax Error)',
          resources: {},
        };
      }

      // Parse Resources (Brushes, Colors)
      const res: Record<string, string> = {};
      const allElements = parsed.getElementsByTagName('*');
      for (let i = 0; i < allElements.length; i++) {
        const el = allElements[i];
        const tagName = (el.localName || el.tagName).toLowerCase();
        if (tagName.endsWith('solidcolorbrush') || tagName.endsWith('color')) {
          const key = el.getAttribute('x:Key') || el.getAttribute('Key') || el.getAttribute('x:key');
          const color = el.getAttribute('Color') || el.getAttribute('color');
          if (key && color) {
            res[key] = color;
          }
        }
      }

      return { doc: parsed, parseError: null, resources: res };
    } catch (e: any) {
      return { doc: null, parseError: e.message, resources: {} };
    }
  }, [xamlCode]);

  const triggerAction = (type: 'event' | 'alert' | 'info' | 'warn', name: string, detail?: string) => {
    if (onActionLog) {
      onActionLog(type, name, detail);
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({
      x: e.clientX,
      y: e.clientY,
      offX: windowOffset.x,
      offY: windowOffset.y,
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setWindowOffset({
      x: dragStart.offX + (e.clientX - dragStart.x),
      y: dragStart.offY + (e.clientY - dragStart.y),
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Helper to extract element children without comments or text whitespace
  const getChildElements = (node: Element): Element[] => {
    const list: Element[] = [];
    for (let i = 0; i < node.children.length; i++) {
      list.push(node.children[i]);
    }
    return list;
  };

  const getGridPlacement = (el: Element) => {
    let row = 0;
    let col = 0;
    let rowSpan = 1;
    let colSpan = 1;

    for (let i = 0; i < el.attributes.length; i++) {
      const attr = el.attributes[i];
      const name = attr.name.toLowerCase();
      if (name === 'grid.row' || name.endsWith(':row') || name === 'row') {
        row = parseInt(attr.value, 10) || 0;
      } else if (name === 'grid.column' || name.endsWith(':column') || name === 'column') {
        col = parseInt(attr.value, 10) || 0;
      } else if (name === 'grid.rowspan' || name.endsWith(':rowspan') || name === 'rowspan') {
        rowSpan = parseInt(attr.value, 10) || 1;
      } else if (name === 'grid.columnspan' || name.endsWith(':columnspan') || name === 'columnspan') {
        colSpan = parseInt(attr.value, 10) || 1;
      }
    }
    return { row, col, rowSpan, colSpan };
  };

  // Recursive Element Renderer
  const renderXmlElement = (element: Element, index: number = 0, isRootWindow: boolean = false): React.ReactNode => {
    const rawTag = element.localName || element.tagName;
    const tagLower = rawTag.toLowerCase();

    // Ignore property definitions & resources in rendering loop
    if (
      tagLower.endsWith('.resources') ||
      tagLower === 'resources' ||
      tagLower.endsWith('.rowdefinitions') ||
      tagLower === 'rowdefinitions' ||
      tagLower.endsWith('.columndefinitions') ||
      tagLower === 'columndefinitions' ||
      tagLower.endsWith('.effect') ||
      tagLower === 'effect' ||
      tagLower.endsWith('.columns') ||
      tagLower === 'columns'
    ) {
      return null;
    }

    const getAttr = (n: string) => {
      for (let i = 0; i < element.attributes.length; i++) {
        const a = element.attributes[i];
        if (a.name.toLowerCase() === n.toLowerCase() || a.name.toLowerCase().endsWith(':' + n.toLowerCase())) {
          return a.value;
        }
      }
      return null;
    };

    const width = getAttr('Width');
    const height = getAttr('Height');
    const minWidth = getAttr('MinWidth');
    const minHeight = getAttr('MinHeight');
    const maxWidth = getAttr('MaxWidth');
    const maxHeight = getAttr('MaxHeight');
    const margin = parseWpfThickness(getAttr('Margin'));
    const padding = parseWpfThickness(getAttr('Padding'));
    const hAlign = getAttr('HorizontalAlignment');
    const vAlign = getAttr('VerticalAlignment');
    const background = resolveWpfColor(getAttr('Background'), theme, resources, 'transparent');
    const foreground = resolveWpfColor(getAttr('Foreground'), theme, resources, theme === 'dark' ? '#F3F4F6' : '#0F172A');
    const borderBrush = resolveWpfColor(getAttr('BorderBrush'), theme, resources, 'transparent');
    const borderThickness = getAttr('BorderThickness');
    const cornerRadius = getAttr('CornerRadius');
    const name = getAttr('Name') || getAttr('x:Name') || '';

    const baseStyle: React.CSSProperties = {
      margin,
      padding,
      boxSizing: 'border-box',
    };

    if (width && width.toLowerCase() !== 'auto') {
      baseStyle.width = isNaN(Number(width)) ? width : `${width}px`;
    }
    if (height && height.toLowerCase() !== 'auto') {
      baseStyle.height = isNaN(Number(height)) ? height : `${height}px`;
    }
    if (minWidth) baseStyle.minWidth = isNaN(Number(minWidth)) ? minWidth : `${minWidth}px`;
    if (minHeight) baseStyle.minHeight = isNaN(Number(minHeight)) ? minHeight : `${minHeight}px`;
    if (maxWidth) baseStyle.maxWidth = isNaN(Number(maxWidth)) ? maxWidth : `${maxWidth}px`;
    if (maxHeight) baseStyle.maxHeight = isNaN(Number(maxHeight)) ? maxHeight : `${maxHeight}px`;

    if (borderBrush !== 'transparent') {
      baseStyle.borderColor = borderBrush;
      baseStyle.borderStyle = 'solid';
      baseStyle.borderWidth = borderThickness ? parseWpfThickness(borderThickness) : '1px';
    }

    if (cornerRadius) {
      baseStyle.borderRadius = parseWpfCornerRadius(cornerRadius);
    }

    if (background !== 'transparent') {
      baseStyle.backgroundColor = background;
    }

    // Alignments
    if (hAlign === 'Center') {
      baseStyle.marginInline = 'auto';
    } else if (hAlign === 'Right') {
      baseStyle.marginLeft = 'auto';
    } else if (hAlign === 'Left') {
      baseStyle.marginRight = 'auto';
    }

    if (vAlign === 'Center') {
      baseStyle.alignSelf = 'center';
    } else if (vAlign === 'Bottom') {
      baseStyle.marginTop = 'auto';
    } else if (vAlign === 'Top') {
      baseStyle.marginBottom = 'auto';
    }

    const handleNodeHover = (e: React.MouseEvent) => {
      if (!inspectMode) return;
      e.stopPropagation();
      setHoveredNodeInfo(`<${rawTag}${name ? ` Name="${name}"` : ''} />`);
    };

    const children = getChildElements(element);

    // ==========================================
    // 1. WINDOW / USERCONTROL / PAGE
    // ==========================================
    if (tagLower === 'window' || tagLower === 'usercontrol' || tagLower === 'page') {
      const explicitWidth = getAttr('Width');
      const explicitHeight = getAttr('Height');
      const minW = getAttr('MinWidth');
      const minH = getAttr('MinHeight');
      const maxW = getAttr('MaxWidth');
      const maxH = getAttr('MaxHeight');

      let winWidth = explicitWidth ? `${explicitWidth}px` : '540px';
      if (tableWidthPreset === 'standard') {
        winWidth = '540px';
      } else if (tableWidthPreset === 'wide') {
        winWidth = '860px';
      } else if (tableWidthPreset === 'ultra') {
        winWidth = '1120px';
      } else if (tableWidthPreset === 'auto') {
        if (!explicitWidth) {
          const lowerXaml = xamlCode.toLowerCase();
          if (lowerXaml.includes('datagrid') || lowerXaml.includes('gridview') || lowerXaml.includes('listview')) {
            winWidth = '780px';
          }
        }
      }

      let winHeight = explicitHeight ? `${explicitHeight}px` : '540px';
      if (explicitHeight && parseInt(explicitHeight, 10) < 420 && (xamlCode.toLowerCase().includes('datagrid') || xamlCode.toLowerCase().includes('gridview'))) {
        winHeight = '520px';
      }

      const winTitle = getAttr('Title') || (tool ? `pyRevit • ${tool.title.replace('\\n', ' ')}` : 'WPF Window');
      const winStyle = getAttr('WindowStyle') || 'SingleBorderWindow';
      const allowsTransparency = getAttr('AllowsTransparency')?.toLowerCase() === 'true';
      const isBorderless = winStyle.toLowerCase() === 'none' || allowsTransparency;

      if (isWindowClosed) {
        return (
          <div className="flex flex-col items-center justify-center p-8 text-center rounded-2xl border border-dashed border-zinc-700 bg-zinc-900/80 shadow-2xl backdrop-blur">
            <p className="text-sm text-zinc-200 font-semibold mb-1">Cửa sổ đã đóng (Window.Close())</p>
            <p className="text-xs text-zinc-400 mb-4">Nhấn nút bên dưới để khởi chạy lại hộp thoại WPF</p>
            <button
              onClick={() => setIsWindowClosed(false)}
              className="px-4 py-2 text-xs font-semibold rounded-xl bg-sky-500 hover:bg-sky-400 text-white transition-all shadow-md flex items-center gap-2 active:scale-95"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Khởi Chạy Lại Window</span>
            </button>
          </div>
        );
      }

      const finalWinWidth = isWindowMaximized ? '98%' : winWidth;
      const finalWinHeight = isWindowMaximized ? '96%' : winHeight;

      return (
        <div
          key="window-root"
          style={{
            width: finalWinWidth,
            height: finalWinHeight,
            minWidth: isWindowMaximized ? undefined : (minW ? `${minW}px` : undefined),
            minHeight: isWindowMaximized ? undefined : (minH ? `${minH}px` : undefined),
            maxWidth: isWindowMaximized ? '100%' : (maxW ? `${maxW}px` : undefined),
            maxHeight: isWindowMaximized ? '100%' : (maxH ? `${maxH}px` : undefined),
            transform: isWindowMaximized ? 'none' : `translate(${windowOffset.x}px, ${windowOffset.y}px)`,
            backgroundColor: isBorderless ? 'transparent' : theme === 'dark' ? '#1E1E24' : '#FFFFFF',
          }}
          className={`relative transition-shadow duration-200 select-none flex flex-col ${
            isBorderless ? '' : 'rounded-lg border shadow-2xl overflow-hidden'
          } ${theme === 'dark' ? 'border-zinc-700/80 text-zinc-100' : 'border-slate-300 text-slate-900'}`}
          onMouseEnter={handleNodeHover}
        >
          {/* Windows Classic Titlebar if NOT WindowStyle="None" */}
          {!isBorderless && (
            <div
              onMouseDown={isWindowMaximized ? undefined : handleMouseDown}
              className={`h-8 px-3 flex items-center justify-between border-b ${
                isWindowMaximized ? '' : 'cursor-move'
              } select-none shrink-0 ${
                theme === 'dark' ? 'bg-[#18181F] border-zinc-700 text-zinc-200' : 'bg-slate-100 border-slate-300 text-slate-800'
              }`}
            >
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-xs">{tool?.icon || '⚡'}</span>
                <span className="text-xs font-medium truncate">{winTitle}</span>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => triggerAction('event', 'Window.WindowState = Minimized')}
                  className="w-6 h-6 flex items-center justify-center hover:bg-zinc-700/40 rounded text-xs"
                  title="Thu nhỏ"
                >
                  —
                </button>
                <button
                  onClick={() => setIsWindowMaximized((prev) => !prev)}
                  className="w-6 h-6 flex items-center justify-center hover:bg-zinc-700/40 rounded text-xs font-mono"
                  title={isWindowMaximized ? 'Thu nhỏ cửa sổ' : 'Phóng to tối đa'}
                >
                  {isWindowMaximized ? '❐' : '▢'}
                </button>
                <button
                  onClick={() => setIsWindowClosed(true)}
                  className="w-6 h-6 flex items-center justify-center hover:bg-red-500 hover:text-white rounded text-xs"
                  title="Đóng (Window.Close())"
                >
                  ✕
                </button>
              </div>
            </div>
          )}

          {/* Window Children Area */}
          <div 
            style={{ 
              padding: padding && padding !== '0px' ? padding : undefined,
              boxSizing: 'border-box'
            }}
            className="flex-1 relative flex flex-col min-h-0 min-w-0 overflow-auto"
          >
            {children.map((child, idx) => renderXmlElement(child, idx, true))}
          </div>
        </div>
      );
    }

    // ==========================================
    // 2. GRID (WPF Grid Row & Column Definitions)
    // ==========================================
    if (tagLower === 'grid') {
      let rowDefs: Element[] = [];
      let colDefs: Element[] = [];

      children.forEach((c) => {
        const t = (c.localName || c.tagName).toLowerCase();
        if (t.endsWith('.rowdefinitions') || t === 'rowdefinitions') {
          rowDefs = getChildElements(c).filter((ch) =>
            (ch.localName || ch.tagName).toLowerCase().endsWith('rowdefinition')
          );
        } else if (t.endsWith('.columndefinitions') || t === 'columndefinitions') {
          colDefs = getChildElements(c).filter((ch) =>
            (ch.localName || ch.tagName).toLowerCase().endsWith('columndefinition')
          );
        }
      });

      const gridTemplateRows =
        rowDefs.length > 0
          ? rowDefs
              .map((r) =>
                parseGridLength(
                  r.getAttribute('Height') || r.getAttribute('height'),
                  r.getAttribute('MinHeight') || r.getAttribute('minheight'),
                  r.getAttribute('MaxHeight') || r.getAttribute('maxheight')
                )
              )
              .join(' ')
          : undefined;

      const gridTemplateColumns =
        colDefs.length > 0
          ? colDefs
              .map((c) =>
                parseGridLength(
                  c.getAttribute('Width') || c.getAttribute('width'),
                  c.getAttribute('MinWidth') || c.getAttribute('minwidth'),
                  c.getAttribute('MaxWidth') || c.getAttribute('maxwidth')
                )
              )
              .join(' ')
          : undefined;

      const validChildren = children.filter((c) => {
        const t = (c.localName || c.tagName).toLowerCase();
        return (
          !t.endsWith('.rowdefinitions') &&
          t !== 'rowdefinitions' &&
          !t.endsWith('.columndefinitions') &&
          t !== 'columndefinitions' &&
          !t.endsWith('.resources')
        );
      });

      const isMultiCell = rowDefs.length > 0 || colDefs.length > 0;
      const hasMargin = baseStyle.margin && baseStyle.margin !== '0px';

      return (
        <div
          key={index}
          style={{
            ...baseStyle,
            display: 'grid',
            gridTemplateRows,
            gridTemplateColumns,
            width: isRootWindow 
              ? (hasMargin ? 'auto' : '100%') 
              : baseStyle.width || (hasMargin ? 'auto' : '100%'),
            height: isRootWindow ? '100%' : baseStyle.height || '100%',
          }}
          className={`min-h-0 min-w-0 ${hasMargin ? '' : 'w-full'} h-full`}
          onMouseEnter={handleNodeHover}
        >
          {validChildren.map((child, cIdx) => {
            const { row, col, rowSpan, colSpan } = getGridPlacement(child);

            const cellStyle: React.CSSProperties = isMultiCell
              ? {
                  gridRow: `${row + 1} / span ${rowSpan}`,
                  gridColumn: `${col + 1} / span ${colSpan}`,
                }
              : {
                  gridArea: '1 / 1',
                };

            return (
              <div
                key={cIdx}
                style={cellStyle}
                className="relative min-w-0 min-h-0 w-full h-full flex flex-col"
              >
                {renderXmlElement(child, cIdx)}
              </div>
            );
          })}
        </div>
      );
    }

    // ==========================================
    // 3. DOCKPANEL (WPF DockPanel.Dock)
    // ==========================================
    if (tagLower === 'dockpanel') {
      const lastChildFill = getAttr('LastChildFill')?.toLowerCase() !== 'false';
      const hasMargin = baseStyle.margin && baseStyle.margin !== '0px';

      return (
        <div
          key={index}
          style={{
            ...baseStyle,
            display: 'flex',
            flexDirection: 'column',
            width: baseStyle.width || (hasMargin ? 'auto' : '100%'),
            height: baseStyle.height || '100%',
          }}
          className={`min-w-0 min-h-0 relative ${hasMargin ? '' : 'w-full'} h-full`}
          onMouseEnter={handleNodeHover}
        >
          {children.map((child, cIdx) => {
            let dock = 'Top';
            for (let i = 0; i < child.attributes.length; i++) {
              const a = child.attributes[i];
              if (a.name.toLowerCase().endsWith('dock')) {
                dock = a.value;
                break;
              }
            }

            const isLast = cIdx === children.length - 1;
            const isBottom = dock.toLowerCase() === 'bottom';
            const isTop = dock.toLowerCase() === 'top';

            const fillStyle: React.CSSProperties = {
              ...(isLast && lastChildFill ? { flex: 1, minHeight: 0 } : {}),
              order: isBottom ? 99 : isTop ? 1 : 10,
            };

            return (
              <div key={cIdx} style={fillStyle} className="w-full shrink-0">
                {renderXmlElement(child, cIdx)}
              </div>
            );
          })}
        </div>
      );
    }

    // ==========================================
    // 3.1 STATUSBAR & STATUSBARITEM
    // ==========================================
    if (tagLower === 'statusbar') {
      return (
        <div
          key={index}
          style={{
            minHeight: '28px',
            padding: baseStyle.padding || '4px 12px',
            backgroundColor: background !== 'transparent' ? background : theme === 'dark' ? '#14141A' : '#F1F5F9',
            borderTop: `1px solid ${borderBrush !== 'transparent' ? borderBrush : theme === 'dark' ? '#272733' : '#E2E8F0'}`,
            boxSizing: 'border-box',
            ...baseStyle,
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
          }}
          className="shrink-0 text-xs select-none w-full gap-2"
          onMouseEnter={handleNodeHover}
        >
          {children.map((child, cIdx) => renderXmlElement(child, cIdx))}
        </div>
      );
    }

    if (tagLower === 'statusbaritem') {
      return (
        <div
          key={index}
          style={{
            ...baseStyle,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            marginLeft: hAlign === 'Right' ? 'auto' : undefined,
            marginRight: hAlign === 'Left' ? 'auto' : undefined,
            flexShrink: 0,
          }}
          className="shrink-0 text-xs"
          onMouseEnter={handleNodeHover}
        >
          {children.length > 0
            ? children.map((child, cIdx) => renderXmlElement(child, cIdx))
            : (
                <span style={{ color: foreground || (theme === 'dark' ? '#9CA3AF' : '#64748B') }}>
                  {getAttr('Content') || element.textContent?.trim()}
                </span>
              )}
        </div>
      );
    }

    // ==========================================
    // 4. WRAPPANEL
    // ==========================================
    if (tagLower === 'wrappanel') {
      const isHoriz = (getAttr('Orientation') || 'Horizontal').toLowerCase() === 'horizontal';
      return (
        <div
          key={index}
          style={{
            ...baseStyle,
            display: 'flex',
            flexWrap: 'wrap',
            flexDirection: isHoriz ? 'row' : 'column',
          }}
          className="gap-1.5 w-full"
          onMouseEnter={handleNodeHover}
        >
          {children.map((child, cIdx) => renderXmlElement(child, cIdx))}
        </div>
      );
    }

    // ==========================================
    // 5. CANVAS
    // ==========================================
    if (tagLower === 'canvas') {
      return (
        <div
          key={index}
          style={{
            ...baseStyle,
            position: 'relative',
          }}
          className="w-full h-full min-h-[120px] overflow-hidden"
          onMouseEnter={handleNodeHover}
        >
          {children.map((child, cIdx) => {
            const left = child.getAttribute('Canvas.Left') || child.getAttribute('left');
            const top = child.getAttribute('Canvas.Top') || child.getAttribute('top');
            const right = child.getAttribute('Canvas.Right') || child.getAttribute('right');
            const bottom = child.getAttribute('Canvas.Bottom') || child.getAttribute('bottom');

            const posStyle: React.CSSProperties = {
              position: 'absolute',
              left: left ? `${left}px` : undefined,
              top: top ? `${top}px` : undefined,
              right: right ? `${right}px` : undefined,
              bottom: bottom ? `${bottom}px` : undefined,
            };

            return (
              <div key={cIdx} style={posStyle}>
                {renderXmlElement(child, cIdx)}
              </div>
            );
          })}
        </div>
      );
    }

    // ==========================================
    // 6. BORDER
    // ==========================================
    if (tagLower === 'border') {
      const isHeaderDrag =
        element.hasAttribute('MouseLeftButtonDown') ||
        (getAttr('BorderThickness') && getAttr('BorderThickness')?.includes('0,0,0,1'));

      return (
        <div
          key={index}
          style={{
            ...baseStyle,
            display: 'flex',
            flexDirection: 'column',
            height: baseStyle.height || '100%',
            width: baseStyle.width || '100%',
          }}
          onMouseDown={isHeaderDrag ? handleMouseDown : undefined}
          className={`${isHeaderDrag ? 'cursor-move' : ''} relative min-w-0 min-h-0 w-full h-full`}
          onMouseEnter={handleNodeHover}
        >
          {children.map((child, cIdx) => renderXmlElement(child, cIdx))}
        </div>
      );
    }

    // ==========================================
    // 7. STACKPANEL
    // ==========================================
    if (tagLower === 'stackpanel') {
      const orientation = getAttr('Orientation') || 'Vertical';
      const isHoriz = orientation.toLowerCase() === 'horizontal';
      const hasMargin = baseStyle.margin && baseStyle.margin !== '0px';

      return (
        <div
          key={index}
          style={{
            ...baseStyle,
            display: 'flex',
            flexDirection: isHoriz ? 'row' : 'column',
            alignItems: isHoriz
              ? (vAlign === 'Center' ? 'center' : vAlign === 'Bottom' ? 'flex-end' : vAlign === 'Top' ? 'flex-start' : 'center')
              : (hAlign === 'Center' ? 'center' : 'stretch'),
            justifyContent: isHoriz
              ? (hAlign === 'Right' ? 'flex-end' : hAlign === 'Center' ? 'center' : 'flex-start')
              : (vAlign === 'Bottom' ? 'flex-end' : vAlign === 'Center' ? 'center' : 'flex-start'),
            width: baseStyle.width || (hasMargin ? 'auto' : (isHoriz && hAlign === 'Right' ? 'auto' : '100%')),
            gap: isHoriz ? '8px' : '4px',
          }}
          className={`relative min-w-0 ${isHoriz ? 'shrink-0' : (hasMargin ? '' : 'w-full')}`}
          onMouseEnter={handleNodeHover}
        >
          {children.map((child, cIdx) => renderXmlElement(child, cIdx))}
        </div>
      );
    }

    // ==========================================
    // 8. SCROLLVIEWER
    // ==========================================
    if (tagLower === 'scrollviewer') {
      const hScroll = getAttr('HorizontalScrollBarVisibility');
      const vScroll = getAttr('VerticalScrollBarVisibility');
      const isHDisabled = hScroll?.toLowerCase() === 'disabled';
      const isVDisabled = vScroll?.toLowerCase() === 'disabled';

      return (
        <div
          key={index}
          style={{
            ...baseStyle,
            flex: 1,
            minHeight: 0,
            minWidth: 0,
          }}
          className={`${isHDisabled ? 'overflow-x-hidden' : 'overflow-x-auto'} ${isVDisabled ? 'overflow-y-hidden' : 'overflow-y-auto'} w-full h-full scrollbar-thin scrollbar-thumb-zinc-700`}
          onMouseEnter={handleNodeHover}
        >
          {children.map((child, cIdx) => renderXmlElement(child, cIdx))}
        </div>
      );
    }

    // ==========================================
    // 9. TABCONTROL & TABITEM
    // ==========================================
    if (tagLower === 'tabcontrol') {
      const tabItems = children.filter((c) => (c.localName || c.tagName).toLowerCase().endsWith('tabitem'));
      const activeIdx = activeTabs[name || 'tabctrl'] || 0;

      return (
        <div
          key={index}
          style={baseStyle}
          className="flex flex-col w-full h-full min-h-[160px] border border-zinc-700/60 rounded-xl overflow-hidden"
          onMouseEnter={handleNodeHover}
        >
          {/* Tab Header Bar */}
          <div className="flex items-center gap-1 px-2 pt-2 border-b border-zinc-700 bg-black/20 overflow-x-auto">
            {tabItems.map((tab, tIdx) => {
              const tabHeader = tab.getAttribute('Header') || `Tab ${tIdx + 1}`;
              const isSelected = activeIdx === tIdx;
              return (
                <button
                  key={tIdx}
                  onClick={() => {
                    setActiveTabs((prev) => ({ ...prev, [name || 'tabctrl']: tIdx }));
                    triggerAction('event', `TabControl: Chọn [${tabHeader}]`);
                  }}
                  className={`px-3 py-1.5 rounded-t-lg text-xs font-semibold transition-all border-t border-x ${
                    isSelected
                      ? 'bg-sky-500/20 text-sky-400 border-sky-500/50 shadow-sm'
                      : 'text-zinc-400 hover:text-zinc-200 border-transparent hover:bg-white/5'
                  }`}
                >
                  {tabHeader}
                </button>
              );
            })}
          </div>

          {/* Active Tab Body */}
          <div className="flex-1 p-3 overflow-auto">
            {tabItems[activeIdx] &&
              getChildElements(tabItems[activeIdx]).map((ch, cIdx) => renderXmlElement(ch, cIdx))}
          </div>
        </div>
      );
    }

    // ==========================================
    // 10. EXPANDER
    // ==========================================
    if (tagLower === 'expander') {
      const header = getAttr('Header') || 'Tùy chọn mở rộng';
      const isExpanded = expandedPanels[name || header] ?? (getAttr('IsExpanded')?.toLowerCase() === 'true');

      return (
        <div key={index} style={baseStyle} className="border border-zinc-700/60 rounded-xl overflow-hidden my-1">
          <div
            onClick={() => {
              setExpandedPanels((prev) => ({ ...prev, [name || header]: !isExpanded }));
              triggerAction('event', `Expander [${header}]: ${!isExpanded ? 'Mở rộng' : 'Thu gọn'}`);
            }}
            className="flex items-center justify-between px-3 py-2 bg-white/5 cursor-pointer hover:bg-white/10 transition-colors"
          >
            <span className="text-xs font-semibold" style={{ color: foreground }}>
              {header}
            </span>
            {isExpanded ? <ChevronDown className="w-4 h-4 text-zinc-400" /> : <ChevronRight className="w-4 h-4 text-zinc-400" />}
          </div>
          {isExpanded && (
            <div className="p-3 bg-black/10 border-t border-zinc-800">
              {children.map((child, cIdx) => renderXmlElement(child, cIdx))}
            </div>
          )}
        </div>
      );
    }

    // ==========================================
    // 11. DATAGRID & LISTVIEW (With GridView Support)
    // ==========================================
    if (tagLower === 'datagrid' || tagLower === 'listview') {
      // Check if ListView has a GridView or if it's a simple list with ListViewItem
      const hasGridView =
        element.getElementsByTagName('GridView').length > 0 ||
        Array.from(element.getElementsByTagName('*')).some((el) =>
          (el.localName || el.tagName).toLowerCase().endsWith('gridview')
        );

      const hasOnlyItems =
        !hasGridView &&
        getChildElements(element).some((c) =>
          (c.localName || c.tagName).toLowerCase().endsWith('listviewitem')
        );

      if (tagLower === 'listview' && hasOnlyItems) {
        return (
          <WpfListBox
            key={index}
            element={element}
            name={name}
            theme={theme}
            baseStyle={baseStyle}
            foreground={foreground}
            onAction={triggerAction}
            onHover={handleNodeHover}
          />
        );
      }

      return (
        <WpfDataGrid
          key={index}
          element={element}
          name={name}
          theme={theme}
          baseStyle={baseStyle}
          foreground={foreground}
          onAction={triggerAction}
          onHover={handleNodeHover}
        />
      );
    }

    // ==========================================
    // 11b. LISTBOX
    // ==========================================
    if (tagLower === 'listbox') {
      return (
        <WpfListBox
          key={index}
          element={element}
          name={name}
          theme={theme}
          baseStyle={baseStyle}
          foreground={foreground}
          onAction={triggerAction}
          onHover={handleNodeHover}
        />
      );
    }

    // ==========================================
    // 12. TEXTBLOCK & LABEL
    // ==========================================
    if (tagLower === 'textblock' || tagLower === 'label') {
      let text = getAttr('Text') || getAttr('Content') || element.textContent?.trim() || '';
      const fontSize = getAttr('FontSize') ? `${getAttr('FontSize')}px` : '13px';
      const fontWeight = getAttr('FontWeight') || 'normal';
      const textAlignment = getAttr('TextAlignment') || (hAlign === 'Center' ? 'center' : 'left');
      const textWrapping = getAttr('TextWrapping');

      text = text.replace(/&#x0a;/gi, '\n');

      return (
        <div
          key={index}
          style={{
            ...baseStyle,
            color: foreground,
            fontSize,
            fontWeight: fontWeight === 'Bold' ? 700 : fontWeight === 'SemiBold' ? 600 : 400,
            textAlign: textAlignment as any,
            whiteSpace: textWrapping === 'Wrap' ? 'pre-wrap' : 'nowrap',
            lineHeight: 1.45,
          }}
          onMouseEnter={handleNodeHover}
        >
          {text}
        </div>
      );
    }

    // ==========================================
    // 13. TEXTBOX & PASSWORDBOX
    // ==========================================
    if (tagLower === 'textbox' || tagLower === 'passwordbox') {
      const isPass = tagLower === 'passwordbox';
      const initialText = getAttr('Text') || '';
      const currentVal = controlValues[name] !== undefined ? controlValues[name] : initialText;
      const fontSize = getAttr('FontSize') ? `${getAttr('FontSize')}px` : '12px';

      return (
        <input
          key={index}
          type={isPass ? 'password' : 'text'}
          value={currentVal}
          onChange={(e) => {
            setControlValues((prev) => ({ ...prev, [name]: e.target.value }));
            triggerAction('event', `[TextBox: ${name || 'txt'}] TextChanged: "${e.target.value}"`);
          }}
          placeholder={getAttr('Tag') || 'Nhập văn bản...'}
          style={{
            ...baseStyle,
            color: foreground,
            fontSize,
            backgroundColor:
              background !== 'transparent'
                ? background
                : theme === 'dark'
                ? REVIT_THEME_PALETTES.dark.InputBg
                : REVIT_THEME_PALETTES.light.InputBg,
            borderColor:
              borderBrush !== 'transparent'
                ? borderBrush
                : theme === 'dark'
                ? REVIT_THEME_PALETTES.dark.InputBorder
                : REVIT_THEME_PALETTES.light.InputBorder,
            borderWidth: borderThickness ? parseWpfThickness(borderThickness) : '1px',
            borderStyle: 'solid',
          }}
          className="w-full outline-none rounded-lg px-2.5 py-1.5 transition-colors focus:ring-2 focus:ring-sky-500/50"
          onMouseEnter={handleNodeHover}
        >
        </input>
      );
    }

    // ==========================================
    // 14. BUTTON
    // ==========================================
    if (tagLower === 'button') {
      const content = getAttr('Content');
      const isCloseBtn = name.toLowerCase().includes('close') || content === '✕';
      const isMinBtn = name.toLowerCase().includes('minimize') || content === '—';

      const handleClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (isCloseBtn) {
          setIsWindowClosed(true);
          triggerAction('event', 'Window.Close() [Button clicked]');
          return;
        }
        if (isMinBtn) {
          triggerAction('event', 'Window.WindowState = Minimized [Button clicked]');
          return;
        }

        const btnLabel = content || name || element.textContent?.trim() || 'Button';
        triggerAction('event', `Click: ${name || btnLabel}()`);
        triggerAction('alert', `pyRevit: Thực thi sự kiện cho [${btnLabel}]`);
      };

      const hasCustomBg = baseStyle.backgroundColor && baseStyle.backgroundColor !== 'transparent';
      const defaultBg = theme === 'dark' ? '#2A2A36' : '#F1F3F5';
      const defaultBorder = theme === 'dark' ? '1px solid #404052' : '1px solid #CBD5E1';
      const defaultText = theme === 'dark' ? '#F3F4F6' : '#1E293B';

      return (
        <button
          key={index}
          style={{
            minHeight: '26px',
            padding: baseStyle.padding || '4px 14px',
            backgroundColor: hasCustomBg ? baseStyle.backgroundColor : defaultBg,
            border: baseStyle.borderColor ? undefined : defaultBorder,
            color: foreground || defaultText,
            borderRadius: baseStyle.borderRadius || '5px',
            whiteSpace: 'nowrap',
            flexShrink: 0,
            boxSizing: 'border-box',
            ...baseStyle,
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
          }}
          onClick={handleClick}
          className="font-medium transition-all active:scale-95 hover:opacity-90 select-none shadow-sm shrink-0 text-xs"
          onMouseEnter={handleNodeHover}
        >
          {content ? (
            <span style={{ color: foreground || defaultText, whiteSpace: 'nowrap' }}>{content}</span>
          ) : (
            children.map((child, cIdx) => renderXmlElement(child, cIdx))
          )}
        </button>
      );
    }

    // ==========================================
    // 15. CHECKBOX & RADIOBUTTON
    // ==========================================
    if (tagLower === 'checkbox' || tagLower === 'radiobutton') {
      const isRadio = tagLower === 'radiobutton';
      const content = getAttr('Content') || element.textContent?.trim() || '';
      const isDefaultChecked = getAttr('IsChecked')?.toLowerCase() === 'true';
      const isChecked = controlValues[name || content] !== undefined ? controlValues[name || content] : isDefaultChecked;
      const groupName = getAttr('GroupName') || 'wpf-radio-group';

      return (
        <label
          key={index}
          style={baseStyle}
          className="flex items-center gap-2 cursor-pointer select-none text-xs my-1"
          onMouseEnter={handleNodeHover}
        >
          <input
            type={isRadio ? 'radio' : 'checkbox'}
            name={isRadio ? groupName : undefined}
            checked={isChecked}
            onChange={(e) => {
              setControlValues((prev) => ({ ...prev, [name || content]: e.target.checked }));
              triggerAction('event', `[${isRadio ? 'RadioButton' : 'CheckBox'}: ${name || content}] Checked: ${e.target.checked}`);
            }}
            className={`w-4 h-4 text-sky-500 accent-sky-500 cursor-pointer shrink-0 ${isRadio ? 'rounded-full' : 'rounded'}`}
          />
          <span style={{ color: foreground }}>{content}</span>
        </label>
      );
    }

    // ==========================================
    // 16. COMBOBOX
    // ==========================================
    if (tagLower === 'combobox') {
      const items = Array.from(element.getElementsByTagName('*'))
        .filter((el) => (el.localName || el.tagName).toLowerCase().endsWith('comboboxitem'))
        .map((i) => i.getAttribute('Content') || i.textContent || '');

      return (
        <select
          key={index}
          style={{
            ...baseStyle,
            backgroundColor: background !== 'transparent' ? background : theme === 'dark' ? '#1E1E24' : '#FFFFFF',
            color: foreground,
            borderColor: borderBrush !== 'transparent' ? borderBrush : theme === 'dark' ? '#3A3A47' : '#CBD5E1',
            borderWidth: '1px',
            borderStyle: 'solid',
          }}
          onChange={(e) => {
            triggerAction('event', `[ComboBox: ${name || 'cbo'}] Selected: "${e.target.value}"`);
          }}
          className="w-full rounded-lg px-2.5 py-1.5 text-xs outline-none focus:ring-2 focus:ring-sky-500/50 cursor-pointer my-1"
          onMouseEnter={handleNodeHover}
        >
          {items.length > 0 ? (
            items.map((it, i) => (
              <option key={i} value={it}>
                {it}
              </option>
            ))
          ) : (
            <>
              <option value="item1">Mục lựa chọn 1 (Default)</option>
              <option value="item2">Mục lựa chọn 2</option>
              <option value="item3">Mục lựa chọn 3</option>
            </>
          )}
        </select>
      );
    }

    // ==========================================
    // 17. SLIDER
    // ==========================================
    if (tagLower === 'slider') {
      const min = parseFloat(getAttr('Minimum') || '0');
      const max = parseFloat(getAttr('Maximum') || '100');
      const currentVal = controlValues[name] !== undefined ? controlValues[name] : parseFloat(getAttr('Value') || '50');

      return (
        <div key={index} style={baseStyle} className="flex items-center gap-2 w-full my-1">
          <input
            type="range"
            min={min}
            max={max}
            value={currentVal}
            onChange={(e) => {
              const v = parseFloat(e.target.value);
              setControlValues((prev) => ({ ...prev, [name]: v }));
              triggerAction('event', `[Slider: ${name || 'sld'}] Value: ${v}`);
            }}
            className="w-full h-1.5 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-sky-500"
          />
          <span className="text-xs font-mono text-zinc-400 min-w-[32px] text-right">{currentVal}</span>
        </div>
      );
    }

    // ==========================================
    // 18. PROGRESSBAR
    // ==========================================
    if (tagLower === 'progressbar') {
      const val = parseFloat(getAttr('Value') || '50');
      const max = parseFloat(getAttr('Maximum') || '100');
      const pct = Math.min(100, Math.max(0, (val / max) * 100));

      return (
        <div
          key={index}
          style={{
            ...baseStyle,
            backgroundColor: resolveWpfColor(getAttr('Background'), theme, resources, theme === 'dark' ? '#272730' : '#E2E8F0'),
            height: getAttr('Height') ? `${getAttr('Height')}px` : '10px',
          }}
          className="w-full rounded-full overflow-hidden my-1"
          onMouseEnter={handleNodeHover}
        >
          <div
            style={{
              width: `${pct}%`,
              backgroundColor: resolveWpfColor(getAttr('Foreground'), theme, resources, '#10B981'),
            }}
            className="h-full rounded-full transition-all duration-300"
          />
        </div>
      );
    }

    // ==========================================
    // 19. GROUPBOX
    // ==========================================
    if (tagLower === 'groupbox') {
      const header = getAttr('Header') || '';
      return (
        <fieldset
          key={index}
          style={{
            ...baseStyle,
            borderColor: borderBrush !== 'transparent' ? borderBrush : theme === 'dark' ? '#3A3A47' : '#CBD5E1',
          }}
          className="border rounded-xl p-3.5 pt-1.5 w-full my-2"
          onMouseEnter={handleNodeHover}
        >
          {header && (
            <legend className="px-2 text-xs font-bold" style={{ color: foreground }}>
              {header}
            </legend>
          )}
          {children.map((child, cIdx) => renderXmlElement(child, cIdx))}
        </fieldset>
      );
    }

    // ==========================================
    // 20. SEPARATOR
    // ==========================================
    if (tagLower === 'separator') {
      return (
        <div
          key={index}
          style={{
            ...baseStyle,
            backgroundColor: borderBrush !== 'transparent' ? borderBrush : theme === 'dark' ? '#3A3A47' : '#E2E8F0',
            height: '1px',
            width: '100%',
          }}
          className="my-2"
        />
      );
    }

    // ==========================================
    // 21. IMAGE
    // ==========================================
    if (tagLower === 'image') {
      const src = getAttr('Source');
      return (
        <div
          key={index}
          style={{
            ...baseStyle,
            width: baseStyle.width || '24px',
            height: baseStyle.height || '24px',
          }}
          className="flex items-center justify-center text-sky-400"
          onMouseEnter={handleNodeHover}
        >
          {src ? (
            <img src={src} alt="WPF Image" className="w-full h-full object-contain" />
          ) : (
            <ImageIcon className="w-full h-full opacity-70" />
          )}
        </div>
      );
    }

    // Default Fallback for generic containers
    return (
      <div key={index} style={baseStyle} onMouseEnter={handleNodeHover}>
        {children.map((child, cIdx) => renderXmlElement(child, cIdx))}
      </div>
    );
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      className="relative w-full h-full flex flex-col rounded-2xl overflow-hidden border border-zinc-800 bg-[#0E0E12] shadow-2xl"
    >
      {/* Top Toolbar */}
      <div className="h-11 px-3 flex items-center justify-between border-b border-zinc-800 bg-[#141418] text-xs text-zinc-300">
        <div className="flex items-center gap-2">
          {/* Engine Switcher */}
          <div className="flex items-center bg-zinc-900 border border-zinc-700/80 rounded-lg p-0.5 text-[11px]">
            <button
              onClick={() => setPreviewEngine('wpf')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded font-medium transition-all ${
                previewEngine === 'wpf'
                  ? 'bg-sky-500 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>WPF XAML Live</span>
            </button>
            <button
              onClick={() => setPreviewEngine('winforms')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded font-medium transition-all ${
                previewEngine === 'winforms'
                  ? 'bg-sky-500 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <AppWindow className="w-3.5 h-3.5" />
              <span>WinForms Form</span>
            </button>
          </div>

          <span className="text-zinc-700">|</span>

          {onThemeToggle && (
            <button
              onClick={onThemeToggle}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg hover:bg-zinc-800 text-zinc-300 transition-colors"
            >
              {theme === 'dark' ? <Moon className="w-3.5 h-3.5 text-sky-400" /> : <Sun className="w-3.5 h-3.5 text-amber-400" />}
              <span className="text-[11px] font-medium">Revit {theme === 'dark' ? 'Dark' : 'Light'}</span>
            </button>
          )}

          {/* Window / Table Width Presets */}
          {previewEngine === 'wpf' && (
            <div className="flex items-center bg-zinc-900 border border-zinc-700/80 rounded-lg p-0.5 text-[11px] ml-1">
              <span className="px-1.5 text-[10px] text-zinc-400 font-medium">Khổ:</span>
              <button
                onClick={() => setTableWidthPreset('auto')}
                className={`px-2 py-0.5 rounded text-[10px] font-medium transition-all ${
                  tableWidthPreset === 'auto'
                    ? 'bg-zinc-700 text-white shadow-sm font-semibold'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
                title="Kích thước tự động theo XAML"
              >
                Gốc
              </button>
              <button
                onClick={() => setTableWidthPreset('standard')}
                className={`px-2 py-0.5 rounded text-[10px] font-medium transition-all ${
                  tableWidthPreset === 'standard'
                    ? 'bg-zinc-700 text-white shadow-sm font-semibold'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
                title="Chuẩn (540px)"
              >
                540px
              </button>
              <button
                onClick={() => setTableWidthPreset('wide')}
                className={`px-2 py-0.5 rounded text-[10px] font-medium transition-all ${
                  tableWidthPreset === 'wide'
                    ? 'bg-sky-500 text-white shadow-sm font-semibold'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
                title="Khổ rộng tối ưu cho DataGrid & Bảng lớn (860px)"
              >
                Rộng (860px)
              </button>
              <button
                onClick={() => setTableWidthPreset('ultra')}
                className={`px-2 py-0.5 rounded text-[10px] font-medium transition-all ${
                  tableWidthPreset === 'ultra'
                    ? 'bg-sky-500 text-white shadow-sm font-semibold'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
                title="Siêu rộng cho bảng nhiều cột (1120px)"
              >
                1120px
              </button>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          {previewEngine === 'wpf' && (
            <button
              onClick={() => setInspectMode(!inspectMode)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-medium border transition-colors ${
                inspectMode
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                  : 'text-zinc-400 hover:text-zinc-200 border-transparent hover:bg-zinc-800'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Soi Node XAML</span>
            </button>
          )}

          <div className="flex items-center gap-1 bg-zinc-800/80 rounded-lg px-1.5 py-0.5 border border-zinc-700/60">
            <button
              onClick={() => setZoom((z) => Math.max(0.4, Number((z - 0.1).toFixed(1))))}
              className="p-1 hover:text-white transition-colors"
              title="Thu nhỏ"
            >
              <ZoomOut className="w-3 h-3" />
            </button>
            <span className="text-[10px] font-mono px-1 font-semibold">{Math.round(zoom * 100)}%</span>
            <button
              onClick={() => setZoom((z) => Math.min(1.8, Number((z + 0.1).toFixed(1))))}
              className="p-1 hover:text-white transition-colors"
              title="Phóng to"
            >
              <ZoomIn className="w-3 h-3" />
            </button>
            <button
              onClick={() => {
                setZoom(1);
                setWindowOffset({ x: 0, y: 0 });
              }}
              className="p-1 hover:text-white transition-colors ml-0.5"
              title="Khôi phục gốc"
            >
              <Maximize2 className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {inspectMode && hoveredNodeInfo && (
        <div className="absolute top-14 left-4 z-50 px-3 py-1.5 rounded-lg bg-amber-500 text-slate-950 font-mono text-xs font-bold shadow-xl border border-amber-300 animate-fade-in">
          {hoveredNodeInfo}
        </div>
      )}

      {/* Canvas Viewport */}
      <div
        className="flex-1 relative overflow-auto p-8 flex items-center justify-center min-h-[460px]"
        style={{
          backgroundColor: theme === 'dark' ? '#101015' : '#E2E8F0',
          backgroundImage: `radial-gradient(${theme === 'dark' ? '#2A2A35' : '#CBD5E1'} 1.5px, transparent 1.5px)`,
          backgroundSize: '24px 24px',
        }}
      >
        {previewEngine === 'winforms' && tool ? (
          <div
            style={{
              transform: `scale(${zoom})`,
              transformOrigin: 'center center',
              transition: 'transform 0.15s ease-out',
            }}
          >
            <WinFormsSimulator tool={tool} theme={theme} onActionLog={onActionLog} />
          </div>
        ) : parseError ? (
          <div className="max-w-md p-5 rounded-2xl bg-red-950/80 border border-red-800 text-red-200 text-xs shadow-2xl backdrop-blur">
            <div className="flex items-center gap-2 font-bold mb-1 text-red-400">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>Cảnh báo cú pháp XAML (XML Syntax Error)</span>
            </div>
            <div className="font-mono text-[11px] leading-relaxed bg-black/40 p-3 rounded-lg border border-red-900 mt-2">
              {parseError}
            </div>
          </div>
        ) : doc ? (
          <div
            style={{
              transform: `scale(${zoom})`,
              transformOrigin: 'center center',
              transition: 'transform 0.15s ease-out',
            }}
          >
            {renderXmlElement(doc.documentElement, 0, true)}
          </div>
        ) : null}
      </div>

      {/* Bottom Status bar */}
      <div className="h-7 px-3 flex items-center justify-between border-t border-zinc-800 bg-[#141418] text-[10px] text-zinc-400 font-mono">
        <div className="flex items-center gap-2">
          <span className="font-medium">Engine: {previewEngine === 'wpf' ? 'WPF PresentationFramework' : 'WinForms Form'}</span>
          <span>•</span>
          <span>Revit Theme: {theme.toUpperCase()}</span>
        </div>
        <div>
          <span>{previewEngine === 'wpf' ? 'Hỗ trợ kéo di chuyển cửa sổ (DragMove)' : 'WinForms Standard Dialog'}</span>
        </div>
      </div>
    </div>
  );
};
