import React, { useState } from 'react';
import { 
  Search, 
  Plus, 
  FolderArchive, 
  Trash2, 
  Edit3,
  Copy,
  Database,
  HardHat,
  RotateCcw
} from 'lucide-react';
import { PyRevitTool, ToolCategory } from '../types';

interface ToolSidebarProps {
  tools: PyRevitTool[];
  selectedToolId: string;
  onSelectTool: (id: string) => void;
  onOpenCreateModal: () => void;
  onOpenEditModal: (tool: PyRevitTool) => void;
  onOpenDeleteModal: (tool: PyRevitTool) => void;
  onDuplicateTool: (tool: PyRevitTool) => void;
  onOpenStorageModal: () => void;
  onDownloadAll: () => void;
}

export const ToolSidebar: React.FC<ToolSidebarProps> = ({
  tools,
  selectedToolId,
  onSelectTool,
  onOpenCreateModal,
  onOpenEditModal,
  onOpenDeleteModal,
  onDuplicateTool,
  onOpenStorageModal,
  onDownloadAll,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<ToolCategory | 'All'>('All');

  const categories: (ToolCategory | 'All')[] = [
    'All',
    'Personal',
    'Documentation',
    'Modeling',
    'QA_QC',
  ];

  const filteredTools = tools.filter((tool) => {
    const matchesSearch =
      tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.panel.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      activeCategory === 'All' || tool.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <aside className="w-80 h-full border-r border-zinc-800 bg-[#121216] flex flex-col shrink-0 select-none">
      {/* App Branding */}
      <div className="h-14 px-4 border-b border-zinc-800 flex items-center justify-between bg-[#141418]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400">
            <HardHat className="w-4 h-4" />
          </div>
          <div>
            <h1 className="text-xs font-bold tracking-tight text-white flex items-center gap-1.5">
              <span>pyRevit Tool Hub</span>
              <span className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-sky-500/20 text-sky-300 font-bold border border-sky-500/30">
                v3.0
              </span>
            </h1>
            <p className="text-[10px] text-zinc-400">BIM Hanoi • {tools.length} Tools Quản Trị</p>
          </div>
        </div>

        {/* Create Tool Trigger */}
        <button
          onClick={onOpenCreateModal}
          className="px-2.5 py-1.5 rounded-lg bg-sky-500 hover:bg-sky-400 text-white flex items-center gap-1 text-xs font-bold shadow-md transition-all active:scale-90"
          title="Tạo Tool pyRevit Mới (+)"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Tạo Tool</span>
        </button>
      </div>

      {/* Storage Status Bar with Direct Backup & Reset */}
      <div className="px-3 py-1.5 bg-[#17171E] border-b border-zinc-800 flex items-center justify-between text-[11px]">
        <button
          onClick={onOpenStorageModal}
          className="flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 transition-colors"
          title="Xem nơi lưu trữ dữ liệu & Sao lưu JSON"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-semibold">Bộ nhớ: LocalStorage</span>
          <span className="text-[10px] text-zinc-500">({tools.length})</span>
        </button>

        <button
          onClick={onOpenStorageModal}
          className="px-2 py-0.5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-sky-300 transition-colors flex items-center gap-1 text-[10px] font-medium"
          title="Sao lưu & Phục hồi JSON"
        >
          <Database className="w-3 h-3 text-sky-400" />
          <span>Sao Lưu</span>
        </button>
      </div>

      {/* Search Input */}
      <div className="p-3 border-b border-zinc-800/80">
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm kiếm tool pyRevit..."
            className="w-full h-8 pl-8 pr-3 bg-[#18181F] text-xs text-zinc-200 border border-zinc-700/60 rounded-lg outline-none focus:border-sky-500 transition-colors placeholder:text-zinc-500"
          />
        </div>

        {/* Category Filter Chips */}
        <div className="flex items-center gap-1 mt-2.5 overflow-x-auto scrollbar-none pb-0.5">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-2 py-0.5 rounded-full text-[10px] font-medium transition-colors shrink-0 ${
                activeCategory === cat
                  ? 'bg-sky-500 text-white shadow-sm'
                  : 'bg-zinc-800/80 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800'
              }`}
            >
              {cat === 'All' ? 'Tất cả' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Tool List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-2 scrollbar-thin scrollbar-thumb-zinc-800">
        {filteredTools.length === 0 ? (
          <div className="p-6 text-center text-xs text-zinc-500">
            Không tìm thấy tool nào phù hợp.
          </div>
        ) : (
          filteredTools.map((t) => {
            const isSelected = t.id === selectedToolId;
            return (
              <div
                key={t.id}
                onClick={() => onSelectTool(t.id)}
                className={`group relative p-2.5 rounded-xl border cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-sky-500/10 border-sky-500/50 shadow-md ring-1 ring-sky-500/30'
                    : 'bg-[#16161B] hover:bg-[#1A1A22] border-zinc-800/80 hover:border-zinc-700'
                }`}
              >
                <div className="flex items-start gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-zinc-800/90 border border-zinc-700 flex items-center justify-center text-base shrink-0 group-hover:scale-105 transition-transform">
                    {t.icon}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <span
                        className={`text-xs font-semibold truncate ${
                          isSelected ? 'text-sky-300 font-bold' : 'text-zinc-200'
                        }`}
                      >
                        {t.name}
                      </span>
                      <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-zinc-800 text-zinc-400 border border-zinc-700/60">
                        v{t.version}
                      </span>
                    </div>

                    <p className="text-[11px] text-zinc-400 truncate mt-0.5">
                      {t.title.replace('\\n', ' ')}
                    </p>

                    <div className="flex items-center gap-2 mt-1.5 text-[10px] text-zinc-500">
                      <span className="px-1.5 py-0.2 rounded bg-zinc-800 text-zinc-400 font-medium truncate max-w-[110px]">
                        {t.panel}
                      </span>
                      <span>•</span>
                      <span>{t.files.length} tệp</span>
                    </div>
                  </div>
                </div>

                {/* PROMINENT ACTION BUTTONS on Active Card (Always Visible) */}
                {isSelected ? (
                  <div className="mt-2.5 pt-2 border-t border-sky-500/20 flex items-center justify-between gap-1.5 text-[11px]">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenEditModal(t);
                      }}
                      className="flex-1 py-1 px-1.5 rounded bg-zinc-800 hover:bg-sky-500 hover:text-white text-zinc-200 transition-colors flex items-center justify-center gap-1 font-semibold text-[11px] shadow-sm"
                      title="Sửa thông tin tool (Tên, Ribbon, Icon, Tệp...)"
                    >
                      <Edit3 className="w-3 h-3 text-sky-400 group-hover:text-white" />
                      <span>Sửa</span>
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDuplicateTool(t);
                      }}
                      className="flex-1 py-1 px-1.5 rounded bg-zinc-800 hover:bg-indigo-500 hover:text-white text-zinc-200 transition-colors flex items-center justify-center gap-1 font-semibold text-[11px] shadow-sm"
                      title="Nhân bản tool này ra bản sao mới"
                    >
                      <Copy className="w-3 h-3 text-indigo-400 group-hover:text-white" />
                      <span>Nhân bản</span>
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenDeleteModal(t);
                      }}
                      className="py-1 px-2 rounded bg-zinc-800 hover:bg-red-500 hover:text-white text-zinc-400 hover:text-white transition-colors flex items-center justify-center gap-1 font-semibold text-[11px] shadow-sm"
                      title="Xoá tool này khỏi thư viện"
                    >
                      <Trash2 className="w-3 h-3 text-red-400" />
                      <span>Xóa</span>
                    </button>
                  </div>
                ) : (
                  /* Quick Action Buttons on Hover for inactive cards */
                  <div className="mt-2 pt-1.5 border-t border-zinc-800/60 hidden group-hover:flex items-center justify-end gap-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenEditModal(t);
                      }}
                      className="p-1 rounded hover:bg-zinc-700 text-zinc-400 hover:text-sky-300 transition-colors"
                      title="Sửa thông tin"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDuplicateTool(t);
                      }}
                      className="p-1 rounded hover:bg-zinc-700 text-zinc-400 hover:text-indigo-300 transition-colors"
                      title="Nhân bản"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenDeleteModal(t);
                      }}
                      className="p-1 rounded hover:bg-red-500/20 text-zinc-400 hover:text-red-400 transition-colors"
                      title="Xoá tool"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Bottom Download Extension Bundle Button */}
      <div className="p-3 border-t border-zinc-800 bg-[#141418] space-y-2">
        <button
          onClick={onDownloadAll}
          className="w-full h-9 rounded-lg bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-semibold text-xs shadow-md flex items-center justify-center gap-2 transition-all active:scale-95"
          title="Tải toàn bộ thư viện pyRevit Extension (.zip) về cài đặt vào Revit"
        >
          <FolderArchive className="w-4 h-4" />
          <span>Xuất Bộ Extension (.zip)</span>
        </button>

        <div className="flex items-center justify-between text-[10px] text-zinc-500 px-1">
          <span>pyRevit 4.8+ • Revit 2020-2026</span>
          <button
            onClick={onOpenStorageModal}
            className="hover:text-zinc-300 underline underline-offset-2 transition-colors"
          >
            Quản lý kho
          </button>
        </div>
      </div>
    </aside>
  );
};
