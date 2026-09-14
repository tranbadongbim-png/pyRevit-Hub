import React, { useState, useMemo } from 'react';
import { Search, CheckSquare, Square, Layers, ListFilter } from 'lucide-react';
import { RevitTheme } from '../types';

interface WpfListBoxProps {
  element: Element;
  name: string;
  theme: RevitTheme;
  baseStyle: React.CSSProperties;
  foreground: string;
  onAction: (type: 'event' | 'alert', message: string) => void;
  onHover?: (e: React.MouseEvent) => void;
}

export const WpfListBox: React.FC<WpfListBoxProps> = ({
  element,
  name,
  theme,
  baseStyle,
  foreground,
  onAction,
  onHover,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  // Extract static ListBoxItem elements if any
  const items = useMemo(() => {
    const rawItems: { id: string; label: string; isChecked: boolean }[] = [];
    const itemNodes = (Array.from(element.children) as Element[]).filter((c) => {
      const tn = (c.localName || c.tagName).toLowerCase();
      return tn.endsWith('listboxitem') || tn.endsWith('listviewitem');
    });

    if (itemNodes.length > 0) {
      itemNodes.forEach((node, idx) => {
        const text =
          node.getAttribute('Content') ||
          node.getAttribute('Text') ||
          node.textContent?.trim() ||
          `Mục #${idx + 1}`;
        const isChecked = node.getAttribute('IsSelected')?.toLowerCase() === 'true';
        rawItems.push({ id: `item-${idx}`, label: text, isChecked });
      });
      return rawItems;
    }

    // Default Revit BIM Categories & Elements
    return [
      { id: '1', label: 'OST_Walls (Tường Kiến Trúc & Kết Cấu)', isChecked: true },
      { id: '2', label: 'OST_Floors (Sàn Dầm Bê Tông)', isChecked: true },
      { id: '3', label: 'OST_StructuralColumns (Cột Chịu Lực)', isChecked: true },
      { id: '4', label: 'OST_Doors (Cửa Đi & Phụ Kiện)', isChecked: false },
      { id: '5', label: 'OST_Windows (Cửa Sổ & Vách Kính)', isChecked: false },
      { id: '6', label: 'OST_StructuralFraming (Dầm Khung Kết Cấu)', isChecked: true },
      { id: '7', label: 'OST_Rooms (Khu Vực & Phòng)', isChecked: true },
      { id: '8', label: 'OST_DuctCurves (Đường Ống Gió HVAC)', isChecked: false },
      { id: '9', label: 'OST_PipeCurves (Đường Ống Cấp Thoát Nước)', isChecked: false },
      { id: '10', label: 'OST_ElectricalFixtures (Thiết Bị Điện)', isChecked: false },
      { id: '11', label: 'OST_Sheets (Danh Sách Bản Vẽ Dự Án)', isChecked: true },
      { id: '12', label: 'OST_Views (Mặt Bằng & Mặt Đứng)', isChecked: false },
    ];
  }, [element]);

  const [itemStates, setItemStates] = useState(items);

  const toggleItem = (id: string) => {
    setItemStates((prev) =>
      prev.map((it) => (it.id === id ? { ...it, isChecked: !it.isChecked } : it))
    );
    const item = itemStates.find((i) => i.id === id);
    onAction('event', `[ListBox: ${name || 'lb'}] SelectionChanged: [${item?.label}]`);
  };

  const filteredItems = useMemo(() => {
    if (!searchQuery.trim()) return itemStates;
    const q = searchQuery.toLowerCase();
    return itemStates.filter((it) => it.label.toLowerCase().includes(q));
  }, [itemStates, searchQuery]);

  const selectedCount = itemStates.filter((it) => it.isChecked).length;
  const areAllSelected = itemStates.length > 0 && itemStates.every((it) => it.isChecked);

  const toggleAll = () => {
    const next = !areAllSelected;
    setItemStates((prev) => prev.map((it) => ({ ...it, isChecked: next })));
    onAction('event', `[ListBox: ${name || 'lb'}] SelectAll: ${next}`);
  };

  return (
    <div
      style={{
        ...baseStyle,
        display: 'flex',
        flexDirection: 'column',
        minHeight: baseStyle.minHeight || '180px',
        maxHeight: baseStyle.maxHeight || '320px',
        height: baseStyle.height || '100%',
      }}
      className={`rounded-xl border overflow-hidden transition-all shadow-sm w-full my-2 flex-1 ${
        theme === 'dark'
          ? 'bg-[#16161D] border-zinc-700/80 text-zinc-200'
          : 'bg-white border-slate-300 text-slate-800'
      }`}
      onMouseEnter={onHover}
    >
      {/* Header filter bar */}
      <div
        className={`px-3 py-1.5 border-b flex items-center justify-between text-xs shrink-0 select-none ${
          theme === 'dark' ? 'bg-[#1D1D27] border-zinc-800' : 'bg-slate-50 border-slate-200'
        }`}
      >
        <div className="flex items-center gap-2 flex-1 mr-2">
          <Search className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Lọc danh sách đối tượng..."
            className={`w-full h-6 text-[11px] bg-transparent outline-none placeholder:text-zinc-500`}
          />
        </div>
        <button
          onClick={toggleAll}
          className="text-[11px] font-medium text-sky-400 hover:text-sky-300 transition-colors shrink-0"
        >
          {areAllSelected ? 'Bỏ chọn hết' : 'Chọn tất cả'}
        </button>
      </div>

      {/* Item list */}
      <div className="flex-1 overflow-auto p-1.5 space-y-1 scrollbar-thin scrollbar-thumb-zinc-700">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            onClick={() => toggleItem(item.id)}
            className={`flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-xs cursor-pointer transition-colors select-none ${
              item.isChecked
                ? 'bg-sky-500/15 text-sky-300 border border-sky-500/30'
                : 'hover:bg-zinc-800/40 border border-transparent'
            }`}
          >
            <input
              type="checkbox"
              checked={item.isChecked}
              onChange={() => {}}
              className="rounded accent-sky-500 cursor-pointer w-3.5 h-3.5"
            />
            <span className="font-mono text-[11px] truncate flex-1">{item.label}</span>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div
        className={`px-3 py-1.5 border-t flex items-center justify-between text-[10px] font-mono shrink-0 select-none ${
          theme === 'dark' ? 'bg-[#181822] border-zinc-800 text-zinc-400' : 'bg-slate-50 border-slate-200 text-slate-500'
        }`}
      >
        <span>
          Đã chọn: <strong className="text-sky-400">{selectedCount}</strong>/{itemStates.length} mục
        </span>
        <span className="text-zinc-500 font-mono">WPF SelectionMode</span>
      </div>
    </div>
  );
};
