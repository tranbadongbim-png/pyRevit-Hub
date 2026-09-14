import React, { useState, useEffect } from 'react';
import { 
  FileCode, 
  Eye, 
  Columns, 
  Terminal, 
  Copy, 
  Check, 
  Download, 
  Edit3, 
  Trash2, 
  Sparkles, 
  Layers, 
  Sun, 
  Moon, 
  FilePlus,
  Save,
  HelpCircle,
  FolderOpen
} from 'lucide-react';
import { PyRevitTool, PyRevitToolFile, RevitTheme, ConsoleLogItem } from '../types';
import { XamlLiveRenderer } from './XamlLiveRenderer';
import { RevitWorkspaceFrame } from './RevitWorkspaceFrame';
import { LocalFilesModal } from './LocalFilesModal';

interface ToolEditorProps {
  tool: PyRevitTool;
  theme: RevitTheme;
  onThemeToggle: () => void;
  onUpdateTool: (updated: PyRevitTool) => void;
  onDownloadZip: (tool: PyRevitTool) => void;
  onOpenEditModal: () => void;
  onOpenDeleteModal: () => void;
  onDuplicateTool: () => void;
}

export const ToolEditor: React.FC<ToolEditorProps> = ({
  tool,
  theme,
  onThemeToggle,
  onUpdateTool,
  onDownloadZip,
  onOpenEditModal,
  onOpenDeleteModal,
  onDuplicateTool,
}) => {
  const [selectedFileName, setSelectedFileName] = useState<string>(
    tool.xamlFileName || tool.files[0]?.name || ''
  );
  const [viewMode, setViewMode] = useState<'split' | 'code' | 'preview' | 'revit'>('split');
  const [copied, setCopied] = useState(false);
  const [isLocalFilesModalOpen, setIsLocalFilesModalOpen] = useState(false);
  const [consoleLogs, setConsoleLogs] = useState<ConsoleLogItem[]>([
    {
      id: 'init-1',
      timestamp: new Date().toLocaleTimeString(),
      type: 'info',
      message: `Đã nạp công cụ pyRevit [${tool.name}] v${tool.version}`,
      details: `Đích: %appdata%\\pyRevit\\Extensions\\${tool.extensionTab}\\${tool.panel}\\${tool.name}`,
    },
    {
      id: 'init-2',
      timestamp: new Date().toLocaleTimeString(),
      type: 'info',
      message: `Revit Host API: ${tool.minRevit} - ${tool.maxRevit} (WPF PresentationFramework)`,
    },
  ]);
  const [showConsole, setShowConsole] = useState(true);

  // Active file
  const activeFile = tool.files.find((f) => f.name === selectedFileName) || tool.files[0];
  const xamlFile = tool.files.find((f) => f.name.endsWith('.xaml')) || tool.files[0];

  const handleContentChange = (newContent: string) => {
    const updatedFiles = tool.files.map((f) => {
      if (f.name === activeFile.name) {
        return { ...f, content: newContent };
      }
      return f;
    });

    onUpdateTool({
      ...tool,
      files: updatedFiles,
      updatedAt: new Date().toISOString().split('T')[0],
    });
  };

  const addConsoleLog = (
    type: 'event' | 'alert' | 'info' | 'warn',
    message: string,
    details?: string
  ) => {
    const newLog: ConsoleLogItem = {
      id: Math.random().toString(36).substring(7),
      timestamp: new Date().toLocaleTimeString(),
      type,
      message,
      details,
    };
    setConsoleLogs((prev) => [newLog, ...prev.slice(0, 49)]);
  };

  const handleCopyCode = async () => {
    if (!activeFile) return;
    await navigator.clipboard.writeText(activeFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    addConsoleLog('info', `Đã sao chép mã nguồn [${activeFile.name}] vào clipboard`);
  };

  // Quick XAML snippets inserter
  const insertXamlSnippet = (snippet: string) => {
    if (!activeFile || !activeFile.name.endsWith('.xaml')) return;
    const current = activeFile.content;
    const insertIdx = current.lastIndexOf('</StackPanel>');
    if (insertIdx !== -1) {
      const updated = current.slice(0, insertIdx) + `\n${snippet}\n` + current.slice(insertIdx);
      handleContentChange(updated);
      addConsoleLog('info', 'Đã chèn mẫu control WPF vào file XAML');
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#0E0E12] overflow-hidden select-none">
      {/* Top Header bar */}
      <div className="h-14 px-4 border-b border-zinc-800 flex items-center justify-between bg-[#141418]">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-lg shrink-0">
            {tool.icon}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-semibold text-zinc-100 truncate">{tool.name}</h2>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-zinc-800 text-zinc-300 border border-zinc-700 shrink-0">
                v{tool.version}
              </span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shrink-0">
                {tool.category}
              </span>
              <div className="flex items-center gap-1 ml-1">
                <button
                  onClick={onOpenEditModal}
                  className="px-2 py-0.5 rounded bg-zinc-800 hover:bg-sky-500 hover:text-white text-zinc-300 transition-colors flex items-center gap-1 text-[11px] font-medium border border-zinc-700"
                  title="Sửa thông tin tool (Tên, Ribbon, Biểu tượng, Tệp...)"
                >
                  <Edit3 className="w-3 h-3 text-sky-400" />
                  <span>Sửa Info</span>
                </button>
                <button
                  onClick={onDuplicateTool}
                  className="px-2 py-0.5 rounded bg-zinc-800 hover:bg-indigo-500 hover:text-white text-zinc-300 transition-colors flex items-center gap-1 text-[11px] font-medium border border-zinc-700"
                  title="Nhân bản tool này ra bản sao mới"
                >
                  <Copy className="w-3 h-3 text-indigo-400" />
                  <span>Nhân Bản</span>
                </button>
                <button
                  onClick={onOpenDeleteModal}
                  className="px-2 py-0.5 rounded bg-zinc-800 hover:bg-red-500 hover:text-white text-zinc-400 hover:text-white transition-colors flex items-center gap-1 text-[11px] font-medium border border-zinc-700"
                  title="Xóa công cụ này"
                >
                  <Trash2 className="w-3 h-3 text-red-400" />
                  <span>Xóa</span>
                </button>
              </div>
            </div>
            <p className="text-xs text-zinc-400 truncate max-w-md">{tool.description}</p>
          </div>
        </div>

        {/* View Switcher & Action buttons */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="flex items-center bg-zinc-900 border border-zinc-800 rounded-lg p-0.5 text-xs">
            <button
              onClick={() => setViewMode('split')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-all font-medium ${
                viewMode === 'split'
                  ? 'bg-sky-500 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
              title="Chia đôi màn hình (Code + XAML Preview)"
            >
              <Columns className="w-3.5 h-3.5" />
              <span>Chia Đôi</span>
            </button>
            <button
              onClick={() => setViewMode('code')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-all font-medium ${
                viewMode === 'code'
                  ? 'bg-sky-500 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
              title="Chỉ xem Trình Soạn Thảo Mã"
            >
              <FileCode className="w-3.5 h-3.5" />
              <span>Mã Nguồn</span>
            </button>
            <button
              onClick={() => setViewMode('preview')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-all font-medium ${
                viewMode === 'preview'
                  ? 'bg-sky-500 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
              title="Chỉ xem Trực Quan Giao Diện XAML"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>XAML Live</span>
            </button>
            <button
              onClick={() => setViewMode('revit')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-all font-medium ${
                viewMode === 'revit'
                  ? 'bg-sky-500 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
              title="Xem trước trong không gian Revit 2026"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Revit View</span>
            </button>
          </div>

          <div className="h-4 w-px bg-zinc-800 mx-1" />

          {/* Theme switcher */}
          <button
            onClick={onThemeToggle}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-zinc-700 bg-zinc-800/80 hover:bg-zinc-700 text-zinc-200 text-xs font-medium transition-colors"
            title="Đổi theme Revit Dark/Light"
          >
            {theme === 'dark' ? (
              <Moon className="w-3.5 h-3.5 text-sky-400" />
            ) : (
              <Sun className="w-3.5 h-3.5 text-amber-400" />
            )}
            <span className="hidden sm:inline">Theme {theme === 'dark' ? 'Dark' : 'Light'}</span>
          </button>

          {/* Local files guide button */}
          <button
            onClick={() => setIsLocalFilesModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-semibold shadow-sm transition-all active:scale-95"
            title="Xem vị trí tệp script.py, ui.xaml trên ổ cứng máy tính & cách mở"
          >
            <FolderOpen className="w-3.5 h-3.5 text-amber-400" />
            <span>📁 Vị Trí File Máy</span>
          </button>

          {/* Download button */}
          <button
            onClick={() => onDownloadZip(tool)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-500 hover:bg-sky-400 text-white text-xs font-semibold shadow-sm transition-all active:scale-95"
            title="Tải gói công cụ pyRevit này (.zip) về máy"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Tải .zip</span>
          </button>

          {/* Delete tool button */}
          <button
            onClick={onOpenDeleteModal}
            className="p-1.5 rounded-lg border border-zinc-800 hover:border-red-500/50 hover:bg-red-500/10 text-zinc-500 hover:text-red-400 transition-colors"
            title="Xóa công cụ này"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Workspace Body */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* LEFT / TOP: Code Editor (if split or code) */}
        {(viewMode === 'split' || viewMode === 'code') && (
          <div
            className={`flex flex-col border-r border-zinc-800 bg-[#101014] overflow-hidden ${
              viewMode === 'split' ? 'w-full md:w-1/2' : 'w-full'
            }`}
          >
            {/* File Tabs */}
            <div className="h-10 px-2 flex items-center justify-between border-b border-zinc-800 bg-[#141418]">
              <div className="flex items-center gap-1 overflow-x-auto scrollbar-none">
                {tool.files.map((file) => {
                  const isActive = file.name === activeFile?.name;
                  return (
                    <button
                      key={file.name}
                      onClick={() => setSelectedFileName(file.name)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-mono transition-colors ${
                        isActive
                          ? 'bg-zinc-800 text-sky-400 font-semibold border border-zinc-700'
                          : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40'
                      }`}
                    >
                      <FileCode className="w-3.5 h-3.5" />
                      <span>{file.name}</span>
                    </button>
                  );
                })}
              </div>

              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={() => setIsLocalFilesModalOpen(true)}
                  className="flex items-center gap-1 px-2 py-1 rounded bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 text-xs border border-amber-500/30 transition-colors"
                  title="Xem đường dẫn file thực tế trên máy tính"
                >
                  <FolderOpen className="w-3.5 h-3.5 text-amber-400" />
                  <span className="text-[11px] hidden sm:inline">Vị trí file</span>
                </button>
                <button
                  onClick={handleCopyCode}
                  className="flex items-center gap-1 px-2 py-1 rounded hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 text-xs transition-colors"
                  title="Sao chép nội dung file"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span className="text-[11px]">{copied ? 'Đã chép' : 'Sao chép'}</span>
                </button>
              </div>
            </div>

            {/* Path indicator banner */}
            <div className="h-7 px-3 bg-[#0c0c0f] border-b border-zinc-800 flex items-center justify-between text-[11px] font-mono text-zinc-400">
              <div className="flex items-center gap-1.5 truncate">
                <span className="text-zinc-600">Đích máy:</span>
                <span className="text-sky-400 truncate">
                  %appdata%\pyRevit\Extensions\BIMHanoi.extension\{tool.extensionTab}.tab\{tool.panel}.panel\{tool.name}\{activeFile?.name}
                </span>
              </div>
              <button
                onClick={() => setIsLocalFilesModalOpen(true)}
                className="text-[10px] text-amber-400 hover:text-amber-300 hover:underline shrink-0 ml-2"
              >
                Mở lệnh Explorer →
              </button>
            </div>

            {/* Quick snippet tools for XAML */}
            {activeFile?.name.endsWith('.xaml') && (
              <div className="px-3 py-1.5 bg-[#121216] border-b border-zinc-800/80 flex items-center gap-1.5 overflow-x-auto text-[11px]">
                <span className="text-zinc-500 font-medium shrink-0">Chèn nhanh:</span>
                <button
                  onClick={() =>
                    insertXamlSnippet(
                      `                        <Button Height="34" Margin="0,4" Background="{DynamicResource AccentColor}" Name="btn_custom">\n                            <TextBlock Text="Nút Bấm Mới" Foreground="{DynamicResource AccentText}" FontWeight="SemiBold"/>\n                        </Button>`
                    )
                  }
                  className="px-2 py-0.5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-mono transition-colors"
                >
                  + Button
                </button>
                <button
                  onClick={() =>
                    insertXamlSnippet(
                      `                        <TextBox Text="Nhập dữ liệu..." Height="32" Margin="0,4" Padding="6" Background="{DynamicResource WindowBg}" Foreground="{DynamicResource TextPrimary}" BorderBrush="{DynamicResource BorderColor}"/>`
                    )
                  }
                  className="px-2 py-0.5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-mono transition-colors"
                >
                  + TextBox
                </button>
                <button
                  onClick={() =>
                    insertXamlSnippet(
                      `                        <CheckBox Content="Tùy chọn tự động hóa" IsChecked="True" Foreground="{DynamicResource TextPrimary}" Margin="0,4"/>`
                    )
                  }
                  className="px-2 py-0.5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-mono transition-colors"
                >
                  + CheckBox
                </button>
                <button
                  onClick={() =>
                    insertXamlSnippet(
                      `                        <ProgressBar Value="65" Maximum="100" Height="8" Margin="0,6" Background="{DynamicResource CardBg}" Foreground="{DynamicResource AccentColor}"/>`
                    )
                  }
                  className="px-2 py-0.5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-mono transition-colors"
                >
                  + ProgressBar
                </button>
              </div>
            )}

            {/* Code Textarea with line numbers */}
            <div className="flex-1 relative flex overflow-hidden font-mono text-xs">
              <textarea
                value={activeFile?.content || ''}
                onChange={(e) => handleContentChange(e.target.value)}
                spellCheck={false}
                className="w-full h-full p-4 bg-transparent text-zinc-200 resize-none outline-none leading-relaxed font-mono selection:bg-sky-500/30"
              />
            </div>
          </div>
        )}

        {/* RIGHT / BOTTOM: Live Preview (XAML or Revit Workspace) */}
        {(viewMode === 'split' || viewMode === 'preview' || viewMode === 'revit') && (
          <div
            className={`flex flex-col bg-[#0B0B0E] overflow-hidden ${
              viewMode === 'split' ? 'w-full md:w-1/2' : 'w-full'
            }`}
          >
            {viewMode === 'revit' ? (
              <div className="flex-1 p-4 overflow-auto flex items-center justify-center">
                <RevitWorkspaceFrame
                  theme={theme}
                  onThemeToggle={onThemeToggle}
                  activeToolTitle={tool.title.replace('\\n', ' ')}
                  docInfo={{
                    title: 'BIMHanoi_Project_2026.rvt',
                    activeView: '{3D - Structural Model}',
                    userName: 'Đông TB (Lead BIM)',
                    revitVersion: 'Revit 2026.1 (Build 2026.1.0)',
                    warningsCount: 14,
                    sheetsCount: 48,
                    syncedTime: '10:45 AM',
                  }}
                >
                  <XamlLiveRenderer
                    xamlCode={xamlFile.content}
                    tool={tool}
                    theme={theme}
                    onThemeToggle={onThemeToggle}
                    onActionLog={addConsoleLog}
                  />
                </RevitWorkspaceFrame>
              </div>
            ) : (
              <div className="flex-1 p-4 overflow-hidden flex flex-col">
                <XamlLiveRenderer
                  xamlCode={xamlFile.content}
                  tool={tool}
                  theme={theme}
                  onThemeToggle={onThemeToggle}
                  onActionLog={addConsoleLog}
                />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bottom Console Logs Tray */}
      <div className="border-t border-zinc-800 bg-[#121216] flex flex-col">
        <div
          onClick={() => setShowConsole(!showConsole)}
          className="h-8 px-4 flex items-center justify-between cursor-pointer hover:bg-zinc-800/50 transition-colors"
        >
          <div className="flex items-center gap-2 text-xs font-mono text-zinc-300">
            <Terminal className="w-3.5 h-3.5 text-sky-400" />
            <span className="font-semibold">pyRevit Console &amp; WPF Event Tracker</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-zinc-800 text-zinc-400">
              {consoleLogs.length} sự kiện
            </span>
          </div>
          <div className="flex items-center gap-3 text-xs text-zinc-500">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setConsoleLogs([]);
              }}
              className="hover:text-zinc-300 transition-colors text-[11px]"
            >
              Xóa log
            </button>
            <span>{showConsole ? '▼ Thu gọn' : '▲ Mở rộng'}</span>
          </div>
        </div>

        {showConsole && (
          <div className="h-28 overflow-y-auto p-3 font-mono text-[11px] space-y-1 bg-[#09090C] border-t border-zinc-900 scrollbar-thin scrollbar-thumb-zinc-800">
            {consoleLogs.length === 0 ? (
              <div className="text-zinc-600 italic">Chưa có sự kiện nào. Hãy tương tác với các nút bấm trên giao diện XAML để kiểm thử!</div>
            ) : (
              consoleLogs.map((log) => (
                <div key={log.id} className="flex items-start gap-2 leading-relaxed">
                  <span className="text-zinc-600 shrink-0">[{log.timestamp}]</span>
                  <span
                    className={`font-semibold shrink-0 ${
                      log.type === 'alert'
                        ? 'text-amber-400'
                        : log.type === 'event'
                        ? 'text-sky-400'
                        : log.type === 'warn'
                        ? 'text-rose-400'
                        : 'text-emerald-400'
                    }`}
                  >
                    [{log.type.toUpperCase()}]
                  </span>
                  <span className="text-zinc-200">{log.message}</span>
                  {log.details && <span className="text-zinc-500">({log.details})</span>}
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Modal hướng dẫn vị trí file trên máy tính & lệnh mở Explorer */}
      <LocalFilesModal
        isOpen={isLocalFilesModalOpen}
        onClose={() => setIsLocalFilesModalOpen(false)}
        tool={tool}
        activeFileName={activeFile?.name}
      />
    </div>
  );
};
