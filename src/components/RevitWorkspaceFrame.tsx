import React from 'react';
import { Sun, Moon, HardHat, Sparkles } from 'lucide-react';
import { RevitTheme, RevitDocInfo } from '../types';

interface RevitWorkspaceFrameProps {
  theme: RevitTheme;
  onThemeToggle: () => void;
  activeToolTitle?: string;
  docInfo: RevitDocInfo;
  children: React.ReactNode;
}

export const RevitWorkspaceFrame: React.FC<RevitWorkspaceFrameProps> = ({
  theme,
  onThemeToggle,
  activeToolTitle = 'Chào Anh Đông',
  docInfo,
  children,
}) => {
  const isDark = theme === 'dark';

  return (
    <div
      className={`w-full max-w-4xl rounded-2xl overflow-hidden border shadow-2xl transition-colors duration-200 ${
        isDark ? 'bg-[#18181B] border-zinc-800' : 'bg-slate-100 border-slate-300'
      }`}
    >
      {/* 1. Revit Topmost Window Title Bar */}
      <div
        className={`h-8 px-4 flex items-center justify-between text-xs select-none border-b ${
          isDark ? 'bg-[#121214] text-zinc-400 border-zinc-800' : 'bg-slate-200 text-slate-700 border-slate-300'
        }`}
      >
        <div className="flex items-center gap-2 truncate">
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-500 inline-block" />
          <span className="font-semibold text-zinc-200 dark:text-zinc-300">
            Autodesk Revit {docInfo.revitVersion}
          </span>
          <span className="text-zinc-500">•</span>
          <span className="truncate">{docInfo.title}</span>
          <span className="text-zinc-500">•</span>
          <span className="text-sky-400 font-mono text-[11px]">{docInfo.activeView}</span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[11px] px-2 py-0.5 rounded bg-zinc-800/60 dark:bg-zinc-800 text-zinc-400">
            User: {docInfo.userName}
          </span>
          {/* Quick Theme Switcher Button */}
          <button
            onClick={onThemeToggle}
            className={`flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium border transition-colors ${
              isDark
                ? 'bg-zinc-800 border-zinc-700 hover:bg-zinc-700 text-sky-400'
                : 'bg-white border-slate-300 hover:bg-slate-50 text-sky-700'
            }`}
            title="Đổi qua lại Dark / Light Mode của Revit"
          >
            {isDark ? <Moon className="w-3 h-3 text-sky-400" /> : <Sun className="w-3 h-3 text-amber-500" />}
            <span>{isDark ? 'Revit Dark UI' : 'Revit Light UI'}</span>
          </button>
        </div>
      </div>

      {/* 2. Simulated Revit Ribbon Navigation Tabs */}
      <div
        className={`px-3 py-1 flex items-center gap-1 text-xs border-b overflow-x-auto select-none ${
          isDark ? 'bg-[#222226] border-zinc-800 text-zinc-400' : 'bg-slate-100 border-slate-300 text-slate-600'
        }`}
      >
        <span className="px-2.5 py-1 rounded hover:text-white cursor-pointer">Architecture</span>
        <span className="px-2.5 py-1 rounded hover:text-white cursor-pointer">Structure</span>
        <span className="px-2.5 py-1 rounded hover:text-white cursor-pointer">Collaborate</span>
        <span className="px-2.5 py-1 rounded hover:text-white cursor-pointer">View</span>
        <span className="px-2.5 py-1 rounded hover:text-white cursor-pointer">Manage</span>
        <span className="px-2.5 py-1 rounded hover:text-white cursor-pointer">pyRevit</span>

        {/* Active Custom Tab: BIM Hanoi */}
        <span
          className={`px-3 py-1 rounded-t font-semibold flex items-center gap-1.5 cursor-pointer shadow-sm ${
            isDark
              ? 'bg-[#2A2A30] text-sky-400 border-t-2 border-sky-400'
              : 'bg-white text-sky-700 border-t-2 border-sky-600'
          }`}
        >
          <HardHat className="w-3.5 h-3.5" />
          <span>BIM Hanoi</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
        </span>
      </div>

      {/* 3. Ribbon Panel Toolbar for BIM Hanoi */}
      <div
        className={`px-4 py-2 flex items-center justify-between border-b ${
          isDark ? 'bg-[#27272D] border-zinc-800' : 'bg-slate-50 border-slate-300'
        }`}
      >
        <div className="flex items-center gap-3">
          {/* Active Pushbutton */}
          <div
            className={`px-3 py-1.5 rounded-xl border flex items-center gap-3 ${
              isDark ? 'bg-[#1E1E24] border-zinc-700/80' : 'bg-white border-slate-200 shadow-sm'
            }`}
          >
            <div className="flex flex-col items-center">
              <div
                className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all ${
                  isDark
                    ? 'bg-sky-500/20 text-sky-400 border border-sky-500/40'
                    : 'bg-sky-50 text-sky-600 border border-sky-200'
                }`}
              >
                <Sparkles className="w-4 h-4" />
              </div>
              <span
                className={`text-[10px] font-semibold text-center mt-1 leading-tight ${
                  isDark ? 'text-zinc-200' : 'text-slate-800'
                }`}
              >
                {activeToolTitle}
              </span>
            </div>

            <div className="border-l pl-2.5 ml-1 border-zinc-700/50">
              <span className="text-[9px] font-medium tracking-wide uppercase text-zinc-400 block">
                Active Tool
              </span>
              <span className="text-[10px] text-sky-400 font-mono">Running WPF...</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-zinc-400">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-sky-500/10 text-sky-400 border border-sky-500/20 text-[11px] font-medium">
            WPF Window Active in Revit Process
          </span>
        </div>
      </div>

      {/* 4. Canvas Area: Simulated Revit Viewport with WPF Window Floating */}
      <div
        className={`relative p-8 min-h-[500px] flex items-center justify-center ${
          isDark ? 'bg-[#16161B]' : 'bg-slate-200/90'
        }`}
      >
        {/* Subtle grid pattern resembling Revit canvas */}
        <div
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(${isDark ? '#52525B' : '#94A3B8'} 1px, transparent 1px)`,
            backgroundSize: '24px 24px',
          }}
        />

        {/* Floating WPF Window Simulator */}
        <div className="relative z-10">{children}</div>
      </div>

      {/* 5. Revit Status Bar */}
      <div
        className={`h-6 px-4 flex items-center justify-between text-[11px] select-none border-t ${
          isDark ? 'bg-[#18181B] text-zinc-400 border-zinc-800' : 'bg-slate-200 text-slate-600 border-slate-300'
        }`}
      >
        <div className="flex items-center gap-3">
          <span>Sẵn sàng • Ready</span>
          <span>|</span>
          <span>Press ESC or close WPF Window to return to Revit</span>
        </div>
        <div className="flex items-center gap-3 font-mono text-[10px]">
          <span>Revit Theme: {theme.toUpperCase()}</span>
          <span>•</span>
          <span>pyRevit 4.8.16</span>
        </div>
      </div>
    </div>
  );
};
