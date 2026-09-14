import React, { useState, useRef } from 'react';
import confetti from 'canvas-confetti';
import { Sparkles, Coffee, AlertTriangle, Play, RefreshCw, X, Minus, Check } from 'lucide-react';
import { RevitTheme, GreetingTone, RevitDocInfo } from '../types';

interface WpfWindowSimulatorProps {
  theme: RevitTheme;
  tone: GreetingTone;
  docInfo: RevitDocInfo;
  onThemeToggle: () => void;
}

export const WpfWindowSimulator: React.FC<WpfWindowSimulatorProps> = ({
  theme,
  tone,
  docInfo,
}) => {
  const [isWaving, setIsWaving] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isClosed, setIsClosed] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ mouseX: 0, mouseY: 0, posX: 0, posY: 0 });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((current) => (current === msg ? null : current));
    }, 3800);
  };

  const handleWaveClick = () => {
    setIsWaving(true);
    confetti({
      particleCount: 45,
      spread: 60,
      origin: { y: 0.6 },
      colors: theme === 'dark' ? ['#38BDF8', '#818CF8', '#34D399'] : ['#0284C7', '#6366F1', '#10B981'],
    });
    showToast('👋 Anh Đông vẫy tay chào lại! Chúc anh làm việc suôn sẻ!');
    setTimeout(() => setIsWaving(false), 1200);
  };

  const handleStartWork = () => {
    showToast('🚀 pyRevit: Bắt đầu ca làm việc! Chúc anh Đông ngày mới tràn đầy cảm hứng!');
  };

  const handleCheckWarnings = () => {
    if (docInfo.warningsCount === 0) {
      showToast('🌟 Tuyệt vời anh Đông ơi! Mô hình sạch bóng, 0 cảnh báo!');
    } else {
      showToast(`⚠️ Đã phát hiện ${docInfo.warningsCount} cảnh báo trong mô hình ${docInfo.title}.`);
    }
  };

  const handleCoffee = () => {
    showToast('☕ Đã chuẩn bị 1 ly cà phê đậm đà cho anh Đông! Nghỉ ngơi vài phút anh nhé!');
  };

  // Dragging logic simulating WPF DragMove()
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    dragStartRef.current = {
      mouseX: e.clientX,
      mouseY: e.clientY,
      posX: position.x,
      posY: position.y,
    };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const dx = e.clientX - dragStartRef.current.mouseX;
    const dy = e.clientY - dragStartRef.current.mouseY;
    setPosition({
      x: dragStartRef.current.posX + dx,
      y: dragStartRef.current.posY + dy,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Tone generator
  const getGreetingContent = () => {
    switch (tone) {
      case 'bim_manager':
        return {
          title: 'Xin chào BIM Manager - Anh Đông!',
          sub: 'Tiêu chuẩn BIM Hanoi đã sẵn sàng. Chúc anh quản lý mô hình và gia đình Revit trơn tru!',
        };
      case 'humorous':
        return {
          title: 'Chào Đại Ca Đông (Tao Đó)! 😎',
          sub: 'Hôm nay Revit ngoan ngoãn nhé, không giật lag, không fatal error, chiều về đúng giờ!',
        };
      case 'gentle':
        return {
          title: 'Chào anh Đông thân mến! 🌿',
          sub: 'Từng nét vẽ tạo nên công trình vững chãi. Chúc anh ngày làm việc an yên và hiệu quả.',
        };
      case 'friendly':
      default:
        return {
          title: 'Chào anh Đông! 👋',
          sub: 'Chúc anh Đông một ca làm việc Revit mượt mà, không crash & clean model!',
        };
    }
  };

  const greeting = getGreetingContent();

  if (isClosed) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center rounded-2xl border border-dashed border-slate-300 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-900/40">
        <p className="text-sm font-medium text-slate-600 dark:text-zinc-400 mb-3">
          Cửa sổ WPF đã được đóng (tương đương với lệnh <code>window.Close()</code> trong Python).
        </p>
        <button
          id="btn-reopen-wpf"
          onClick={() => setIsClosed(false)}
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg bg-sky-500 hover:bg-sky-600 text-white shadow-sm transition-all"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Mở lại cửa sổ Chào Anh Đông
        </button>
      </div>
    );
  }

  const isDark = theme === 'dark';

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      className="relative w-full flex items-center justify-center py-4 select-none min-h-[500px]"
    >
      {/* Toast Notification */}
      {toastMessage && (
        <div className="absolute top-2 z-50 animate-bounce transition-all duration-300">
          <div className="flex items-center gap-2.5 px-4 py-2 rounded-full shadow-lg text-xs font-medium backdrop-blur-md border bg-slate-900/90 text-white border-slate-700">
            <Sparkles className="w-3.5 h-3.5 text-sky-400 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* Main Simulated WPF Window */}
      <div
        style={{
          transform: `translate(${position.x}px, ${position.y}px)`,
        }}
        className={`w-full max-w-[460px] rounded-2xl transition-shadow duration-300 border ${
          isDark
            ? 'bg-[#1E1E24] text-gray-100 border-[#3A3A47] shadow-[0_20px_45px_rgba(0,0,0,0.65)]'
            : 'bg-white text-slate-900 border-slate-200 shadow-[0_18px_40px_rgba(0,0,0,0.12)]'
        } ${isMinimized ? 'h-12 overflow-hidden' : ''}`}
      >
        {/* WPF Custom Header / Title Bar (draggable) */}
        <div
          onMouseDown={handleMouseDown}
          className={`h-11 px-4 flex items-center justify-between border-b cursor-move ${
            isDark ? 'border-[#3A3A47] bg-[#1E1E24]' : 'border-slate-200 bg-white'
          }`}
        >
          {/* Logo & Title */}
          <div className="flex items-center gap-2.5">
            <div className={`w-5 h-5 rounded flex items-center justify-center text-[10px] font-bold ${
              isDark ? 'bg-sky-400 text-slate-950' : 'bg-sky-600 text-white'
            }`}>
              B
            </div>
            <span className={`text-xs font-medium tracking-wide ${
              isDark ? 'text-gray-300' : 'text-slate-600'
            }`}>
              BIM Hanoi • pyRevit Assistant
            </span>
          </div>

          {/* Window Controls (Minimize & Close) */}
          <div className="flex items-center gap-1">
            <button
              id="wpf-btn-minimize"
              title="Thu nhỏ"
              onClick={() => setIsMinimized(!isMinimized)}
              className={`w-7 h-7 flex items-center justify-center rounded transition-colors ${
                isDark ? 'hover:bg-zinc-800 text-zinc-400' : 'hover:bg-slate-100 text-slate-500'
              }`}
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <button
              id="wpf-btn-close"
              title="Đóng cửa sổ"
              onClick={() => setIsClosed(true)}
              className={`w-7 h-7 flex items-center justify-center rounded transition-colors ${
                isDark ? 'hover:bg-red-500/20 hover:text-red-400 text-zinc-400' : 'hover:bg-red-50 hover:text-red-600 text-slate-500'
              }`}
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* WPF Window Body */}
        {!isMinimized && (
          <div className="p-6">
            {/* Friendly Greeting Icon Section */}
            <div className="flex flex-col items-center text-center">
              <button
                id="btn-greeting-avatar"
                title="Bấm để vẫy tay chào lại anh Đông!"
                onClick={handleWaveClick}
                className={`relative group p-4 rounded-full border-2 transition-all transform hover:scale-105 active:scale-95 ${
                  isDark
                    ? 'bg-[#2A3342] border-sky-400/40 hover:border-sky-400'
                    : 'bg-sky-50 border-sky-200 hover:border-sky-400'
                }`}
              >
                {/* Glowing Pulsing Ring */}
                <span className="absolute inset-0 rounded-full animate-ping opacity-20 bg-sky-400" />

                {/* Animated Friendly Vector Waving Hand Icon */}
                <div className={`w-14 h-14 flex items-center justify-center text-3xl ${isWaving ? 'animate-bounce' : 'group-hover:rotate-12 transition-transform'}`}>
                  <svg
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className={`w-11 h-11 transition-colors ${
                      isDark ? 'text-sky-400' : 'text-sky-600'
                    }`}
                  >
                    {/* Waving Hand Vector Path */}
                    <path d="M12.5 2C13.3 2 14 2.7 14 3.5V11.2C14 11.6 14.3 12 14.8 12C15.2 12 15.6 11.6 15.6 11.2V5.5C15.6 4.7 16.3 4 17.1 4C17.9 4 18.6 4.7 18.6 5.5V11.2C18.6 11.6 19 12 19.4 12C19.8 12 20.2 11.6 20.2 11.2V7.5C20.2 6.7 20.9 6 21.7 6C22.5 6 23.2 6.7 23.2 7.5V14.5C23.2 19.2 19.4 23 14.7 23C11 23 7.8 20.6 6.8 17.2L5.4 12.8C5.2 12.1 5.6 11.4 6.3 11.2C7 11 7.7 11.4 7.9 12.1L9 15.8C9.2 16.5 10 16.8 10.6 16.5C11.1 16.2 11.3 15.6 11.2 15L10.1 9.4C9.9 8.6 10.5 7.9 11.3 7.8C12.1 7.6 12.8 8.1 12.9 8.9L13.8 13.5C13.9 13.9 14.3 14.2 14.7 14.1C15.1 14 15.4 13.6 15.3 13.2L14.2 3.5C14.2 2.7 13.3 2 12.5 2Z" />
                  </svg>
                </div>

                {/* Friendly Sparkle Badge */}
                <div className={`absolute -bottom-1 -right-1 p-1 rounded-full text-[10px] ${
                  isDark ? 'bg-sky-400 text-slate-900' : 'bg-sky-600 text-white'
                }`}>
                  <Sparkles className="w-3 h-3" />
                </div>
              </button>

              {/* Greeting Heading */}
              <h2 className="mt-3.5 text-xl font-bold tracking-tight">
                {greeting.title}
              </h2>

              {/* Subtitle / Wish */}
              <p className={`mt-1.5 text-xs max-w-xs leading-relaxed ${
                isDark ? 'text-gray-400' : 'text-slate-500'
              }`}>
                {greeting.sub}
              </p>

              {/* Revit Theme Sync Badge */}
              <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold border transition-colors border-sky-400/30 bg-sky-400/10 text-sky-400">
                <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
                <span>Đồng bộ Revit {isDark ? 'Dark Mode' : 'Light Mode'}</span>
                <Check className="w-3 h-3 ml-0.5" />
              </div>
            </div>

            {/* Document Info Card (Revit active project) */}
            <div className={`mt-5 p-3.5 rounded-xl border ${
              isDark ? 'bg-[#272730] border-[#3A3A47]' : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <div className={`text-[10px] font-bold uppercase tracking-wider ${
                    isDark ? 'text-gray-400' : 'text-slate-400'
                  }`}>
                    Dự án hiện tại
                  </div>
                  <div className="text-xs font-semibold truncate mt-0.5 text-sky-400" title={docInfo.title}>
                    {docInfo.title}
                  </div>
                </div>

                <div>
                  <div className={`text-[10px] font-bold uppercase tracking-wider ${
                    isDark ? 'text-gray-400' : 'text-slate-400'
                  }`}>
                    View đang mở
                  </div>
                  <div className="text-xs font-medium truncate mt-0.5">
                    {docInfo.activeView}
                  </div>
                </div>

                <div>
                  <div className={`text-[10px] font-bold uppercase tracking-wider ${
                    isDark ? 'text-gray-400' : 'text-slate-400'
                  }`}>
                    Warnings
                  </div>
                  <div className={`text-xs font-semibold mt-0.5 flex items-center gap-1 ${
                    docInfo.warningsCount === 0 ? 'text-emerald-400' : 'text-amber-400'
                  }`}>
                    {docInfo.warningsCount === 0 ? '0 cảnh báo (Tốt)' : `${docInfo.warningsCount} cảnh báo`}
                  </div>
                </div>
              </div>
            </div>

            {/* Actions Bar */}
            <div className="mt-5 pt-3 border-t flex items-center gap-2.5 border-inherit">
              {/* Coffee Easter Egg Button */}
              <button
                id="btn-coffee"
                title="Tách cafe tặng anh Đông ☕"
                onClick={handleCoffee}
                className={`w-9 h-9 flex items-center justify-center rounded-lg border transition-all ${
                  isDark
                    ? 'bg-[#272730] border-[#3A3A47] hover:bg-[#30303C] text-amber-300'
                    : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-amber-600'
                }`}
              >
                <Coffee className="w-4 h-4" />
              </button>

              {/* Check Warning Button */}
              <button
                id="btn-check-warning"
                onClick={handleCheckWarnings}
                className={`flex-1 h-9 px-3 flex items-center justify-center gap-1.5 rounded-lg border text-xs font-medium transition-all ${
                  isDark
                    ? 'bg-[#272730] border-[#3A3A47] hover:bg-[#30303C] text-gray-200'
                    : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700'
                }`}
              >
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                <span>Kiểm tra Warning</span>
              </button>

              {/* Start Work Primary Button */}
              <button
                id="btn-start-work"
                onClick={handleStartWork}
                className={`h-9 px-4 flex items-center justify-center gap-1.5 rounded-lg text-xs font-semibold shadow-sm transition-all active:scale-95 ${
                  isDark
                    ? 'bg-sky-400 hover:bg-sky-300 text-slate-950 font-bold'
                    : 'bg-sky-600 hover:bg-sky-700 text-white'
                }`}
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Bắt đầu ✨</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
