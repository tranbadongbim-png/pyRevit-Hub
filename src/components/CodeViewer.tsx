import React, { useState } from 'react';
import JSZip from 'jszip';
import { Copy, Check, Download, FileCode, FolderArchive, Terminal, BookOpen, Layers } from 'lucide-react';
import { PYREVIT_FILES } from '../data/pyrevitFiles';

export const CodeViewer: React.FC = () => {
  const [activeFileIndex, setActiveFileIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  const [isZipping, setIsZipping] = useState(false);

  const activeFile = PYREVIT_FILES[activeFileIndex];

  const handleCopy = () => {
    navigator.clipboard.writeText(activeFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadSingleFile = () => {
    const blob = new Blob([activeFile.content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = activeFile.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDownloadZip = async () => {
    try {
      setIsZipping(true);
      const zip = new JSZip();

      // Add files with pyRevit folder structure
      for (const file of PYREVIT_FILES) {
        zip.file(file.path, file.content);
      }

      // Generate zip blob
      const content = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(content);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'BIMHanoi_ChaoAnhDong_pyRevit.zip';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Lỗi khi nén file zip:', err);
    } finally {
      setIsZipping(false);
    }
  };

  return (
    <div className="w-full rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-[#18181C] shadow-lg overflow-hidden">
      {/* Top action header */}
      <div className="p-4 border-b border-slate-200 dark:border-zinc-800 flex flex-wrap items-center justify-between gap-3 bg-slate-50/70 dark:bg-zinc-900/50">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-zinc-100 flex items-center gap-2">
            <FileCode className="w-4 h-4 text-sky-500" />
            <span>Mã nguồn pyRevit &amp; Giao diện WPF</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
            Dành riêng cho anh Đông (BIM Hanoi) - Tương thích Revit 2020 - 2026, tự động đồng bộ Dark Mode
          </p>
        </div>

        {/* Download Zip CTA */}
        <div className="flex items-center gap-2">
          <button
            id="btn-copy-code"
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 hover:bg-slate-50 dark:hover:bg-zinc-700 text-slate-700 dark:text-zinc-200 transition-colors shadow-sm"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Đã sao chép!' : 'Sao chép mã'}</span>
          </button>

          <button
            id="btn-download-single"
            onClick={handleDownloadSingleFile}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 hover:bg-slate-50 dark:hover:bg-zinc-700 text-slate-700 dark:text-zinc-200 transition-colors shadow-sm"
          >
            <Download className="w-3.5 h-3.5 text-sky-500" />
            <span>Tải file {activeFile.name}</span>
          </button>

          <button
            id="btn-download-zip"
            onClick={handleDownloadZip}
            disabled={isZipping}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-sky-600 hover:bg-sky-500 active:bg-sky-700 text-white transition-all shadow-sm disabled:opacity-50"
          >
            <FolderArchive className="w-3.5 h-3.5" />
            <span>{isZipping ? 'Đang đóng gói...' : 'Tải trọn bộ .ZIP'}</span>
          </button>
        </div>
      </div>

      {/* File Navigation Tabs */}
      <div className="flex items-center gap-1 px-4 pt-2 border-b border-slate-200 dark:border-zinc-800 bg-slate-100/50 dark:bg-[#141418] overflow-x-auto">
        {PYREVIT_FILES.map((file, idx) => {
          const isActive = idx === activeFileIndex;
          return (
            <button
              key={file.name}
              id={`tab-file-${file.name}`}
              onClick={() => setActiveFileIndex(idx)}
              className={`flex items-center gap-2 px-3.5 py-2 text-xs font-medium rounded-t-lg transition-colors border-t-2 ${
                isActive
                  ? 'bg-white dark:bg-[#1E1E24] text-sky-600 dark:text-sky-400 border-sky-500 font-semibold shadow-sm'
                  : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-200 border-transparent hover:bg-slate-200/40 dark:hover:bg-zinc-800/40'
              }`}
            >
              {file.language === 'python' && <Terminal className="w-3.5 h-3.5 text-emerald-500" />}
              {file.language === 'xml' && <FileCode className="w-3.5 h-3.5 text-sky-500" />}
              {file.language === 'yaml' && <Layers className="w-3.5 h-3.5 text-amber-500" />}
              {file.language === 'markdown' && <BookOpen className="w-3.5 h-3.5 text-purple-500" />}
              <span>{file.name}</span>
            </button>
          );
        })}
      </div>

      {/* File Path & Description Bar */}
      <div className="px-4 py-2 bg-slate-50 dark:bg-zinc-900/60 border-b border-slate-200 dark:border-zinc-800 flex items-center justify-between text-xs">
        <div className="font-mono text-[11px] text-slate-500 dark:text-zinc-400 truncate">
          <span className="text-slate-400 dark:text-zinc-500">Đường dẫn thư mục: </span>
          <span className="text-sky-600 dark:text-sky-400 font-semibold">{activeFile.path}</span>
        </div>
        <div className="text-[11px] text-slate-500 dark:text-zinc-400 hidden sm:block">
          {activeFile.description}
        </div>
      </div>

      {/* Code Display Area */}
      <div className="relative">
        <pre className="p-4 overflow-x-auto text-xs font-mono leading-relaxed bg-slate-950 text-slate-100 max-h-[520px] scrollbar-thin">
          <code>{activeFile.content}</code>
        </pre>
      </div>

      {/* Directory structure summary footer */}
      <div className="p-4 bg-slate-50/90 dark:bg-zinc-900/90 border-t border-slate-200 dark:border-zinc-800 text-xs text-slate-600 dark:text-zinc-400">
        <div className="font-semibold text-slate-800 dark:text-zinc-200 mb-1 flex items-center gap-1.5">
          <span>📁 Cấu trúc thư mục pyRevit chuẩn:</span>
        </div>
        <div className="font-mono text-[11px] bg-white dark:bg-black/40 p-2.5 rounded-lg border border-slate-200 dark:border-zinc-800 leading-normal text-slate-700 dark:text-zinc-300">
          <div>%appdata%\pyRevit\Extensions\BIMHanoi.extension\</div>
          <div className="pl-4">└── BIMHanoi.tab\</div>
          <div className="pl-8">└── Personal.panel\</div>
          <div className="pl-12">└── ChaoAnhDong.pushbutton\</div>
          <div className="pl-16 text-sky-600 dark:text-sky-400 font-semibold">├── script.py</div>
          <div className="pl-16 text-sky-600 dark:text-sky-400 font-semibold">├── GreetingWindow.xaml</div>
          <div className="pl-16 text-sky-600 dark:text-sky-400 font-semibold">├── bundle.yaml</div>
          <div className="pl-16 text-slate-400 dark:text-zinc-500">└── icon.png</div>
        </div>
      </div>
    </div>
  );
};
