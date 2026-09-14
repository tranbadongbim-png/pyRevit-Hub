import React, { useState, useMemo } from 'react';
import { 
  Search, 
  CheckSquare, 
  Square, 
  Filter, 
  SlidersHorizontal, 
  ArrowUpDown, 
  Download,
  ChevronRight,
  Eye,
  CheckCircle2,
  AlertTriangle,
  Clock
} from 'lucide-react';
import { RevitTheme } from '../types';
import { WpfColumnDefinition, generateBimSampleRows } from '../utils/xamlHelper';

interface WpfDataGridProps {
  element: Element;
  name: string;
  theme: RevitTheme;
  baseStyle: React.CSSProperties;
  foreground: string;
  onAction: (type: 'event' | 'alert', message: string) => void;
  onHover?: (e: React.MouseEvent) => void;
}

export const WpfDataGrid: React.FC<WpfDataGridProps> = ({
  element,
  name,
  theme,
  baseStyle,
  foreground,
  onAction,
  onHover,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortAsc, setSortAsc] = useState<boolean>(true);

  // 1. Extract all column definitions from XAML
  const columns = useMemo<WpfColumnDefinition[]>(() => {
    const colNodes = (Array.from(element.getElementsByTagName('*')) as Element[]).filter((el) => {
      const tn = (el.localName || el.tagName).toLowerCase();
      return (
        tn.endsWith('datagridtextcolumn') ||
        tn.endsWith('datagridcheckboxcolumn') ||
        tn.endsWith('datagridtemplatecolumn') ||
        tn.endsWith('datagridcomboboxcolumn') ||
        tn.endsWith('datagridhyperlinkcolumn') ||
        tn.endsWith('gridviewcolumn') ||
        tn.endsWith('datagridcolumn')
      );
    });

    if (colNodes.length > 0) {
      return colNodes.map((c, idx) => {
        const tn = (c.localName || c.tagName).toLowerCase();
        let type: WpfColumnDefinition['type'] = 'text';
        if (tn.endsWith('checkboxcolumn')) type = 'checkbox';
        else if (tn.endsWith('templatecolumn')) type = 'template';
        else if (tn.endsWith('comboboxcolumn')) type = 'combobox';
        else if (tn.endsWith('hyperlinkcolumn')) type = 'hyperlink';

        let header = c.getAttribute('Header') || c.getAttribute('header');
        if (!header) {
          const headerChild = (Array.from(c.children) as Element[]).find((ch) =>
            (ch.localName || ch.tagName).toLowerCase().endsWith('.header')
          );
          header = headerChild?.textContent?.trim() || `Cột ${idx + 1}`;
        }

        const bindingAttr =
          c.getAttribute('Binding') ||
          c.getAttribute('binding') ||
          c.getAttribute('DisplayMemberBinding') ||
          '';
        const bindingMatch = bindingAttr.match(/\{Binding\s+([a-zA-Z0-9_]+)\}/);
        const binding = bindingMatch ? bindingMatch[1] : bindingAttr.replace(/[\{\}]/g, '').trim();

        const width = c.getAttribute('Width') || c.getAttribute('width') || undefined;

        return {
          header,
          binding: binding || header,
          type,
          width,
        };
      });
    }

    // Default Comprehensive BIM Columns if no explicit column tags found
    return [
      { header: 'Chọn', binding: 'IsSelected', type: 'checkbox', width: '50' },
      { header: 'Số Hiệu', binding: 'SheetNumber', type: 'text', width: '90' },
      { header: 'Tên Bản Vẽ (Sheet Name)', binding: 'SheetName', type: 'text', width: '220' },
      { header: 'Bộ Môn', binding: 'Discipline', type: 'text', width: '100' },
      { header: 'Tỷ Lệ', binding: 'Scale', type: 'text', width: '80' },
      { header: 'Người Vẽ', binding: 'DrawnBy', type: 'text', width: '100' },
      { header: 'Lần Sửa Đổi', binding: 'Revision', type: 'text', width: '90' },
      { header: 'Trạng Thái', binding: 'Status', type: 'text', width: '110' },
      { header: 'Thao Tác', binding: 'Action', type: 'template', width: '90' },
    ];
  }, [element]);

  // 2. Generate BIM Data Rows matching extracted columns
  const initialRows = useMemo(() => {
    return generateBimSampleRows(columns, 16);
  }, [columns]);

  const [rows, setRows] = useState<Record<string, any>[]>(initialRows);

  // Toggle single row selection
  const handleToggleRow = (index: number) => {
    setRows((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], _isSelected: !copy[index]._isSelected };
      return copy;
    });
    onAction('event', `[DataGrid: ${name || 'dg'}] RowSelectionChanged: Row #${index + 1}`);
  };

  // Toggle Select All
  const areAllSelected = rows.length > 0 && rows.every((r) => r._isSelected);
  const handleToggleSelectAll = () => {
    const nextState = !areAllSelected;
    setRows((prev) => prev.map((r) => ({ ...r, _isSelected: nextState })));
    onAction('event', `[DataGrid: ${name || 'dg'}] SelectAll: ${nextState}`);
  };

  // Filtered & Sorted Rows
  const processedRows = useMemo(() => {
    let result = [...rows];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter((row) =>
        Object.values(row).some((val) => String(val).toLowerCase().includes(q))
      );
    }

    if (sortColumn) {
      result.sort((a, b) => {
        const valA = a[sortColumn] ?? '';
        const valB = b[sortColumn] ?? '';
        if (valA < valB) return sortAsc ? -1 : 1;
        if (valA > valB) return sortAsc ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [rows, searchQuery, sortColumn, sortAsc]);

  const selectedCount = rows.filter((r) => r._isSelected).length;

  const handleSort = (colKey: string) => {
    if (sortColumn === colKey) {
      setSortAsc(!sortAsc);
    } else {
      setSortColumn(colKey);
      setSortAsc(true);
    }
  };

  // Render Status Badge
  const renderStatusPill = (val: string) => {
    const vLower = String(val).toLowerCase();
    if (vLower.includes('duyệt') || vLower.includes('hoàn thành')) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
          <CheckCircle2 className="w-2.5 h-2.5" />
          <span>{val}</span>
        </span>
      );
    }
    if (vLower.includes('sửa') || vLower.includes('chờ')) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/15 text-amber-400 border border-amber-500/30">
          <AlertTriangle className="w-2.5 h-2.5" />
          <span>{val}</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-sky-500/15 text-sky-400 border border-sky-500/30">
        <Clock className="w-2.5 h-2.5" />
        <span>{val}</span>
      </span>
    );
  };

  return (
    <div
      style={{
        ...baseStyle,
        display: 'flex',
        flexDirection: 'column',
        minHeight: baseStyle.minHeight || '240px',
        maxHeight: baseStyle.maxHeight || '480px',
        height: baseStyle.height || '100%',
      }}
      className={`rounded-xl border overflow-hidden transition-all shadow-md relative w-full flex-1 ${
        theme === 'dark'
          ? 'bg-[#15151B] border-zinc-700/80 text-zinc-100'
          : 'bg-white border-slate-300 text-slate-800'
      }`}
      onMouseEnter={onHover}
    >
      {/* 1. Quick DataGrid Filter Toolbar */}
      <div
        className={`px-3 py-2 border-b flex items-center justify-between gap-3 text-xs shrink-0 select-none ${
          theme === 'dark' ? 'bg-[#191922] border-zinc-800' : 'bg-slate-50 border-slate-200'
        }`}
      >
        <div className="flex items-center gap-2 flex-1 max-w-sm">
          <div className="relative w-full">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm dữ liệu bản vẽ, bộ môn, mã hiệu..."
              className={`w-full h-7 pl-8 pr-3 text-xs rounded-lg border outline-none transition-colors ${
                theme === 'dark'
                  ? 'bg-[#111115] border-zinc-700 text-zinc-200 placeholder:text-zinc-500 focus:border-sky-500'
                  : 'bg-white border-slate-300 text-slate-800 placeholder:text-slate-400 focus:border-sky-500'
              }`}
            />
          </div>
        </div>

        <div className="flex items-center gap-2 text-[11px] text-zinc-400 font-medium">
          <span className="hidden sm:inline">
            Đã chọn: <strong className="text-sky-400 font-bold">{selectedCount}</strong>/{rows.length}
          </span>
          <button
            onClick={handleToggleSelectAll}
            className={`px-2 py-1 rounded-md border text-[11px] font-semibold transition-colors flex items-center gap-1 ${
              theme === 'dark'
                ? 'bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 border-zinc-700'
                : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-300'
            }`}
          >
            {areAllSelected ? (
              <>
                <CheckSquare className="w-3 h-3 text-sky-400" />
                <span>Bỏ Chọn</span>
              </>
            ) : (
              <>
                <Square className="w-3 h-3 text-zinc-400" />
                <span>Chọn Hết</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 2. Scrollable Data Table with STICKY HEADER */}
      <div className="flex-1 overflow-auto relative w-full scrollbar-thin scrollbar-thumb-zinc-700">
        <table className="w-full text-left border-collapse min-w-full table-fixed text-xs">
          {/* Table Header */}
          <thead className="sticky top-0 z-10 shadow-sm select-none">
            <tr
              className={`border-b ${
                theme === 'dark'
                  ? 'bg-[#20202B] text-zinc-200 border-zinc-700/80'
                  : 'bg-slate-100 text-slate-800 border-slate-300'
              }`}
            >
              {/* Checkbox Column Header */}
              <th className="w-10 p-2.5 text-center shrink-0">
                <input
                  type="checkbox"
                  checked={areAllSelected}
                  onChange={handleToggleSelectAll}
                  className="rounded cursor-pointer accent-sky-500 w-3.5 h-3.5"
                  title="Chọn tất cả dòng"
                />
              </th>

              {columns.map((col, idx) => {
                const isSorted = sortColumn === (col.binding || col.header);
                const colWidthStyle: React.CSSProperties = {};
                if (col.width) {
                  if (col.width === '*' || col.width.endsWith('*')) {
                    colWidthStyle.minWidth = '140px';
                  } else if (!isNaN(Number(col.width))) {
                    colWidthStyle.width = `${col.width}px`;
                    colWidthStyle.minWidth = `${col.width}px`;
                  }
                } else {
                  colWidthStyle.minWidth = '110px';
                }

                return (
                  <th
                    key={idx}
                    style={colWidthStyle}
                    onClick={() => handleSort(col.binding || col.header)}
                    className={`p-2.5 text-xs font-semibold tracking-tight border-r last:border-r-0 cursor-pointer transition-colors ${
                      theme === 'dark' ? 'border-zinc-700/60 hover:bg-zinc-700/40' : 'border-slate-200 hover:bg-slate-200/60'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1.5 truncate">
                      <span className="truncate">{col.header}</span>
                      <ArrowUpDown
                        className={`w-3 h-3 shrink-0 ${
                          isSorted ? 'text-sky-400' : 'text-zinc-500 opacity-50'
                        }`}
                      />
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>

          {/* Table Body with Alternating Colors (Zebra Striping) */}
          <tbody className="divide-y divide-zinc-800/60 font-mono text-[11px]">
            {processedRows.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + 1}
                  className="p-8 text-center text-zinc-500 text-xs italic"
                >
                  Không tìm thấy dòng dữ liệu nào khớp với từ khóa "{searchQuery}"
                </td>
              </tr>
            ) : (
              processedRows.map((row, rIdx) => {
                const isSelected = row._isSelected;
                const isEven = rIdx % 2 === 0;

                let rowBg = 'transparent';
                if (isSelected) {
                  rowBg = theme === 'dark' ? 'rgba(14, 165, 233, 0.16)' : 'rgba(224, 242, 254, 0.8)';
                } else if (isEven) {
                  rowBg = theme === 'dark' ? 'rgba(255, 255, 255, 0.02)' : 'rgba(0, 0, 0, 0.02)';
                }

                return (
                  <tr
                    key={row._id || rIdx}
                    onClick={() => handleToggleRow(rIdx)}
                    style={{ backgroundColor: rowBg }}
                    className={`cursor-pointer transition-colors hover:bg-sky-500/10 ${
                      isSelected ? 'font-medium ring-1 ring-inset ring-sky-500/30' : ''
                    }`}
                  >
                    {/* Checkbox Cell */}
                    <td
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleRow(rIdx);
                      }}
                      className="p-2.5 text-center shrink-0 border-r border-zinc-800/40"
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => {}}
                        className="rounded cursor-pointer accent-sky-500 w-3.5 h-3.5"
                      />
                    </td>

                    {/* Data Cells */}
                    {columns.map((col, cIdx) => {
                      const key = col.binding || col.header || `col_${cIdx}`;
                      const cellValue = row[key] ?? row[col.header] ?? '';

                      const isStatus =
                        col.header.toLowerCase().includes('trạng thái') ||
                        col.header.toLowerCase().includes('status');

                      return (
                        <td
                          key={cIdx}
                          className={`p-2.5 truncate border-r last:border-r-0 ${
                            theme === 'dark' ? 'border-zinc-800/50 text-zinc-300' : 'border-slate-200 text-slate-700'
                          }`}
                        >
                          {col.type === 'checkbox' ? (
                            <input
                              type="checkbox"
                              checked={!!cellValue}
                              onChange={(e) => {
                                e.stopPropagation();
                                const copy = [...rows];
                                copy[rIdx][key] = e.target.checked;
                                setRows(copy);
                              }}
                              className="rounded accent-sky-500 cursor-pointer"
                            />
                          ) : isStatus ? (
                            renderStatusPill(String(cellValue))
                          ) : col.type === 'template' ? (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onAction('event', `[DataGrid] Action Click: Row #${rIdx + 1}`);
                                onAction('alert', `Chi tiết hàng: ${row.SheetNumber || row.SheetName || rIdx + 1}`);
                              }}
                              className="px-2 py-0.5 rounded bg-sky-500/20 hover:bg-sky-500 hover:text-white text-sky-400 text-[10px] font-semibold transition-colors flex items-center gap-1"
                            >
                              <Eye className="w-2.5 h-2.5" />
                              <span>Xem</span>
                            </button>
                          ) : (
                            <span className="truncate">{String(cellValue)}</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* 3. Bottom Table Status & Metric Bar */}
      <div
        className={`px-3 py-2 border-t flex items-center justify-between text-[11px] font-mono shrink-0 select-none ${
          theme === 'dark' ? 'bg-[#181822] border-zinc-800 text-zinc-400' : 'bg-slate-50 border-slate-200 text-slate-600'
        }`}
      >
        <div className="flex items-center gap-2">
          <span>
            Tổng: <strong className="text-zinc-200 font-semibold">{processedRows.length}</strong> dòng
          </span>
          <span>•</span>
          <span>
            {columns.length} cột ({name || 'DataGrid'})
          </span>
        </div>

        <div className="flex items-center gap-2 text-[10px]">
          <span className="text-emerald-400 font-medium">● WPF Live DataBinding</span>
          <span>•</span>
          <span>Revit 2026 Ready</span>
        </div>
      </div>
    </div>
  );
};
