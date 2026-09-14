import React, { useState } from 'react';
import { 
  Folder, 
  FileCode, 
  Copy, 
  Check, 
  X, 
  ExternalLink, 
  Terminal, 
  Sparkles, 
  HardDrive, 
  Layers, 
  HelpCircle,
  FolderOpen,
  Keyboard,
  Info
} from 'lucide-react';
import { PyRevitTool } from '../types';

interface LocalFilesModalProps {
  isOpen: boolean;
  onClose: () => void;
  tool: PyRevitTool;
  activeFileName?: string;
}

export const LocalFilesModal: React.FC<LocalFilesModalProps> = ({
  isOpen,
  onClose,
  tool,
  activeFileName,
}) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!isOpen) return null;

  // Resolve standard pyRevit paths on Windows
  const extensionDir = 'BIMHanoi.extension';
  const tabDir = `${tool.extensionTab}.tab`;
  const panelDir = `${tool.panel}.panel`;
  const buttonDir = tool.name; // e.g. SheetAndViews.pushbutton

  const relativeToolPath = `pyRevit\\Extensions\\${extensionDir}\\${tabDir}\\${panelDir}\\${buttonDir}`;
  const appDataPath = `%appdata%\\${relativeToolPath}`;
  const expandedSamplePath = `C:\\Users\\%USERNAME%\\AppData\\Roaming\\${relativeToolPath}`;
  const explorerCommand = `explorer "%appdata%\\${relativeToolPath}"`;
  const powershellCommand = `ii "$env:APPDATA\\${relativeToolPath}"`;

  const copyToClipboard = async (text: string, key: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2500);
    } catch (e) {
      console.error('Failed to copy', e);
    }
  };

  const xamlFile = tool.files.find((f) => f.name.endsWith('.xaml'))?.name || tool.xamlFileName || 'ui.xaml';
  const pyFile = tool.files.find((f) => f.name.endsWith('.py'))?.name || 'script.py';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in select-none">
      <div 
        className="w-full max-w-2xl bg-[#141419] border border-zinc-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-zinc-800 flex items-center justify-between bg-[#191920]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400">
              <HardDrive className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <span>Vị Trí Tệp pyRevit Trên Máy Tính (Windows)</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-sky-500/20 text-sky-300 border border-sky-500/30">
                  Revit 2020-2026
                </span>
              </h2>
              <p className="text-xs text-zinc-400">
                Đường dẫn thư mục & tệp nguồn <span className="text-sky-400 font-mono font-semibold">{tool.name}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs">
          
          {/* Quick Tip Box: pyRevit Hotkey */}
          <div className="p-3.5 rounded-xl bg-gradient-to-r from-sky-950/50 to-indigo-950/40 border border-sky-800/60 flex items-start gap-3">
            <div className="p-2 rounded-lg bg-sky-500/20 text-sky-300 shrink-0">
              <Keyboard className="w-4 h-4" />
            </div>
            <div className="space-y-1">
              <div className="font-bold text-sky-200 text-xs flex items-center gap-1.5">
                <span>Mẹo mở siêu tốc ngay từ Revit (pyRevit Ribbon Shortcuts):</span>
              </div>
              <ul className="text-zinc-300 text-[11px] space-y-1 list-disc pl-4 leading-relaxed">
                <li>
                  <strong className="text-amber-300">Giữ phím ALT + Click vào nút trên Ribbon Revit:</strong> pyRevit sẽ tự động mở thẳng thư mục chứa <code className="text-sky-300 font-mono">script.py</code> và <code className="text-sky-300 font-mono">{xamlFile}</code> trong Windows File Explorer!
                </li>
                <li>
                  <strong className="text-emerald-300">Giữ phím SHIFT + Click vào nút trên Ribbon Revit:</strong> Mở trực tiếp tệp <code className="text-sky-300 font-mono">script.py</code> trong trình soạn code của bạn (VS Code).
                </li>
                <li>
                  <strong className="text-indigo-300">Giữ phím CTRL + Click:</strong> Nạp lại pyRevit (Reload) để cập nhật code mới ngay tức thì.
                </li>
              </ul>
            </div>
          </div>

          {/* 1. Main Folder Path on Windows */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-zinc-300 font-semibold">
              <span className="flex items-center gap-1.5 text-zinc-200">
                <FolderOpen className="w-4 h-4 text-amber-400" />
                <span>1. Thư mục Tool trên máy (Windows Explorer / Run):</span>
              </span>
              <span className="text-[10px] text-zinc-500 font-mono">Chuẩn pyRevit Extensions</span>
            </div>

            <div className="p-3 rounded-xl bg-black/50 border border-zinc-800 flex items-center justify-between gap-3 group">
              <div className="font-mono text-zinc-200 break-all select-all text-[11px] leading-relaxed">
                {appDataPath}
              </div>
              <button
                onClick={() => copyToClipboard(appDataPath, 'appdata')}
                className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 text-xs font-semibold shrink-0 transition-all ${
                  copiedKey === 'appdata'
                    ? 'bg-emerald-500 text-slate-950 shadow-md'
                    : 'bg-zinc-800 hover:bg-sky-500 hover:text-white text-zinc-300'
                }`}
                title="Sao chép đường dẫn này"
              >
                {copiedKey === 'appdata' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedKey === 'appdata' ? 'Đã Chép!' : 'Chép Đường Dẫn'}</span>
              </button>
            </div>

            <p className="text-[11px] text-zinc-400 pl-1">
              💡 <strong>Cách mở:</strong> Nhấn tổ hợp phím <kbd className="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-200 font-mono border border-zinc-700">Win + R</kbd>, dán đường dẫn trên vào và ấn <kbd className="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-200 font-mono border border-zinc-700">Enter</kbd> là Windows mở thẳng thư mục!
            </p>
          </div>

          {/* 2. Direct One-Click Command */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-zinc-300 font-semibold">
              <span className="flex items-center gap-1.5 text-zinc-200">
                <Terminal className="w-4 h-4 text-emerald-400" />
                <span>2. Lệnh mở nhanh qua CMD / PowerShell / Terminal:</span>
              </span>
            </div>

            <div className="p-3 rounded-xl bg-black/50 border border-zinc-800 flex items-center justify-between gap-3">
              <div className="font-mono text-emerald-400 break-all select-all text-[11px]">
                {explorerCommand}
              </div>
              <button
                onClick={() => copyToClipboard(explorerCommand, 'cmd')}
                className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 text-xs font-semibold shrink-0 transition-all ${
                  copiedKey === 'cmd'
                    ? 'bg-emerald-500 text-slate-950 shadow-md'
                    : 'bg-zinc-800 hover:bg-emerald-500 hover:text-slate-950 text-zinc-300'
                }`}
              >
                {copiedKey === 'cmd' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedKey === 'cmd' ? 'Đã Chép!' : 'Chép Lệnh'}</span>
              </button>
            </div>
          </div>

          {/* 3. Individual Files in this tool */}
          <div className="space-y-2">
            <span className="text-zinc-200 font-semibold flex items-center gap-1.5">
              <FileCode className="w-4 h-4 text-sky-400" />
              <span>3. Vị trí từng tệp cụ thể trong thư mục này:</span>
            </span>

            <div className="grid grid-cols-1 gap-2">
              {/* Python Script */}
              <div className="p-2.5 rounded-xl bg-zinc-900/70 border border-zinc-800 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-mono text-xs shrink-0">
                    PY
                  </div>
                  <div className="min-w-0">
                    <div className="font-mono font-bold text-zinc-200 text-[11px] truncate">{pyFile}</div>
                    <div className="text-[10px] text-zinc-500 truncate">{appDataPath}\\{pyFile}</div>
                  </div>
                </div>
                <button
                  onClick={() => copyToClipboard(`${appDataPath}\\${pyFile}`, 'py')}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-semibold flex items-center gap-1 transition-all ${
                    copiedKey === 'py' ? 'bg-emerald-500 text-slate-950' : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300'
                  }`}
                >
                  {copiedKey === 'py' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedKey === 'py' ? 'Đã Chép' : 'Chép Path'}</span>
                </button>
              </div>

              {/* XAML UI File */}
              <div className="p-2.5 rounded-xl bg-zinc-900/70 border border-zinc-800 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-7 h-7 rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400 font-mono text-xs shrink-0">
                    UI
                  </div>
                  <div className="min-w-0">
                    <div className="font-mono font-bold text-zinc-200 text-[11px] truncate">{xamlFile} (Giao diện WPF XAML)</div>
                    <div className="text-[10px] text-zinc-500 truncate">{appDataPath}\\{xamlFile}</div>
                  </div>
                </div>
                <button
                  onClick={() => copyToClipboard(`${appDataPath}\\${xamlFile}`, 'xaml')}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-semibold flex items-center gap-1 transition-all ${
                    copiedKey === 'xaml' ? 'bg-emerald-500 text-slate-950' : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300'
                  }`}
                >
                  {copiedKey === 'xaml' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedKey === 'xaml' ? 'Đã Chép' : 'Chép Path'}</span>
                </button>
              </div>

              {/* bundle.yaml */}
              <div className="p-2.5 rounded-xl bg-zinc-900/70 border border-zinc-800 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 font-mono text-xs shrink-0">
                    YML
                  </div>
                  <div className="min-w-0">
                    <div className="font-mono font-bold text-zinc-200 text-[11px] truncate">bundle.yaml (Cấu hình Nút Bấm Revit)</div>
                    <div className="text-[10px] text-zinc-500 truncate">{appDataPath}\\bundle.yaml</div>
                  </div>
                </div>
                <button
                  onClick={() => copyToClipboard(`${appDataPath}\\bundle.yaml`, 'yaml')}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-semibold flex items-center gap-1 transition-all ${
                    copiedKey === 'yaml' ? 'bg-emerald-500 text-slate-950' : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300'
                  }`}
                >
                  {copiedKey === 'yaml' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedKey === 'yaml' ? 'Đã Chép' : 'Chép Path'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* 4. Full Absolute Path Reference */}
          <div className="p-3 rounded-xl bg-zinc-900/40 border border-zinc-800/80 text-[11px] text-zinc-400 space-y-1">
            <div className="flex items-center gap-1.5 text-zinc-300 font-medium">
              <Info className="w-3.5 h-3.5 text-sky-400" />
              <span>Đường dẫn tuyệt đối (Full Path khi mở rộng %appdata%):</span>
            </div>
            <div className="font-mono text-[10px] text-zinc-400 select-all break-all bg-black/40 p-2 rounded border border-zinc-800">
              {expandedSamplePath}
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3 border-t border-zinc-800 bg-[#16161D] flex items-center justify-between">
          <span className="text-[11px] text-zinc-500">
            pyRevit tự động quét và nhận diện tool khi lưu file vào thư mục trên.
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-medium text-xs transition-colors"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
