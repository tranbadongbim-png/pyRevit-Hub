import React, { useState } from 'react';
import { PyRevitTool, RevitTheme } from '../types';
import { Minus, Square, X, Folder, Play, CheckSquare, Settings2, Info } from 'lucide-react';

interface WinFormsSimulatorProps {
  tool: PyRevitTool;
  theme: RevitTheme;
  onActionLog?: (type: 'event' | 'alert' | 'info' | 'warn', message: string, details?: string) => void;
}

export const WinFormsSimulator: React.FC<WinFormsSimulatorProps> = ({
  tool,
  theme,
  onActionLog,
}) => {
  const [isClosed, setIsClosed] = useState(false);
  const [statusText, setStatusText] = useState('Ready');
  const [txtVal, setTxtVal] = useState('AR-');
  const [chkVal, setChkVal] = useState(true);
  const [comboVal, setComboVal] = useState('3 số (001, 002...)');
  const [progress, setProgress] = useState(75);

  const isDark = theme === 'dark';

  const triggerAction = (type: 'event' | 'alert' | 'info', name: string) => {
    if (onActionLog) {
      onActionLog(type, name);
    }
    setStatusText(`Last Event: ${name}`);
  };

  if (isClosed) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center rounded-lg border border-dashed border-zinc-700 bg-zinc-900/50">
        <p className="text-xs text-zinc-400 mb-3">
          WinForm đã gọi <code className="text-sky-400 font-mono">this.Close()</code>
        </p>
        <button
          onClick={() => setIsClosed(false)}
          className="px-3 py-1.5 text-xs font-semibold rounded bg-zinc-700 hover:bg-zinc-600 text-white transition-all shadow-sm"
        >
          Mở lại Form (Form.ShowDialog())
        </button>
      </div>
    );
  }

  // WinForms Color Palette (Dark mode vs Classic Windows System Gray)
  const bg = isDark ? '#202020' : '#F0F0F0';
  const text = isDark ? '#FFFFFF' : '#000000';
  const textMuted = isDark ? '#A0A0A0' : '#505050';
  const border = isDark ? '#3E3E42' : '#A0A0A0';
  const controlBg = isDark ? '#2D2D30' : '#FFFFFF';
  const headerBg = isDark ? '#1E1E1E' : '#E6E6E6';
  const titleBarBg = isDark ? '#181818' : '#0078D7';
  const titleBarText = isDark ? '#E0E0E0' : '#FFFFFF';

  return (
    <div
      style={{
        backgroundColor: bg,
        color: text,
        borderColor: isDark ? '#434346' : '#999999',
        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.4), 0 8px 10px -6px rgba(0, 0, 0, 0.3)',
      }}
      className="w-[490px] rounded-t-lg rounded-b border font-sans select-none overflow-hidden transition-colors duration-200"
    >
      {/* 1. Windows Classic / Win11 Form Title Bar */}
      <div
        style={{
          backgroundColor: titleBarBg,
          color: titleBarText,
        }}
        className="h-8 px-2 flex items-center justify-between border-b border-black/20"
      >
        <div className="flex items-center gap-2">
          {/* Revit WinForms App Icon */}
          <div className="w-4 h-4 bg-sky-600 rounded-sm flex items-center justify-center text-[10px] font-bold text-white shadow-sm">
            R
          </div>
          <span className="text-xs font-medium truncate max-w-[340px]">
            {tool.title.replace('\\n', ' ')} - [WinForms pyRevit Host]
          </span>
        </div>

        {/* Min / Max / Close Controls */}
        <div className="flex items-center">
          <button
            onClick={() => triggerAction('event', 'Form.WindowState = Minimized')}
            className="w-7 h-6 flex items-center justify-center hover:bg-black/10 transition-colors text-xs"
            title="Minimize"
          >
            <Minus className="w-3 h-3" />
          </button>
          <button
            onClick={() => triggerAction('event', 'Form.WindowState = Maximized')}
            className="w-7 h-6 flex items-center justify-center hover:bg-black/10 transition-colors text-xs"
            title="Maximize"
          >
            <Square className="w-2.5 h-2.5" />
          </button>
          <button
            onClick={() => {
              setIsClosed(true);
              triggerAction('event', 'Form.Close()');
            }}
            className="w-7 h-6 flex items-center justify-center hover:bg-red-600 hover:text-white transition-colors text-xs"
            title="Close"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 2. MenuStrip */}
      <div
        style={{
          backgroundColor: headerBg,
          borderColor: border,
        }}
        className="h-6 px-2 flex items-center gap-3 text-[11px] border-b"
      >
        <span className="hover:bg-sky-500/20 px-1.5 py-0.5 rounded cursor-pointer">File</span>
        <span className="hover:bg-sky-500/20 px-1.5 py-0.5 rounded cursor-pointer">Edit</span>
        <span className="hover:bg-sky-500/20 px-1.5 py-0.5 rounded cursor-pointer">Revit View</span>
        <span className="hover:bg-sky-500/20 px-1.5 py-0.5 rounded cursor-pointer">Help</span>
      </div>

      {/* 3. Form Body */}
      <div className="p-4 space-y-3.5 text-xs">
        {/* Tool Header Notice */}
        <div
          style={{
            backgroundColor: controlBg,
            borderColor: border,
          }}
          className="p-3 rounded border flex items-center gap-3"
        >
          <div className="text-2xl">{tool.icon}</div>
          <div>
            <div className="font-bold text-xs">{tool.name}</div>
            <div style={{ color: textMuted }} className="text-[11px]">
              {tool.description}
            </div>
          </div>
        </div>

        {/* GroupBox 1: Parameters */}
        <fieldset
          style={{
            borderColor: border,
          }}
          className="border rounded p-3 pt-1 space-y-2.5"
        >
          <legend className="px-1 text-[11px] font-semibold">Cấu hình tham số (System.Windows.Forms)</legend>

          <div className="grid grid-cols-2 gap-3 items-center">
            <label className="text-[11px]">Tiền tố (Prefix TextBox):</label>
            <input
              type="text"
              value={txtVal}
              onChange={(e) => {
                setTxtVal(e.target.value);
                triggerAction('event', `TextBox.TextChanged: "${e.target.value}"`);
              }}
              style={{
                backgroundColor: controlBg,
                color: text,
                borderColor: border,
              }}
              className="h-6 px-2 text-xs border rounded-sm outline-none focus:border-sky-500 font-mono"
            />
          </div>

          <div className="grid grid-cols-2 gap-3 items-center">
            <label className="text-[11px]">Định dạng (ComboBox):</label>
            <select
              value={comboVal}
              onChange={(e) => {
                setComboVal(e.target.value);
                triggerAction('event', `ComboBox.SelectedIndexChanged: "${e.target.value}"`);
              }}
              style={{
                backgroundColor: controlBg,
                color: text,
                borderColor: border,
              }}
              className="h-6 px-1 text-xs border rounded-sm outline-none"
            >
              <option>3 số (001, 002...)</option>
              <option>4 số (0001, 0002...)</option>
              <option>2 số (01, 02...)</option>
            </select>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="chkOption"
              checked={chkVal}
              onChange={(e) => {
                setChkVal(e.target.checked);
                triggerAction('event', `CheckBox.CheckedChanged: ${e.target.checked}`);
              }}
              className="w-3.5 h-3.5"
            />
            <label htmlFor="chkOption" className="text-[11px] cursor-pointer">
              Áp dụng giao dịch Revit Transaction tự động
            </label>
          </div>
        </fieldset>

        {/* GroupBox 2: Progress & DataGridView Preview */}
        <fieldset
          style={{
            borderColor: border,
          }}
          className="border rounded p-3 pt-1 space-y-2"
        >
          <legend className="px-1 text-[11px] font-semibold">Trạng thái xử lý (ProgressBar)</legend>

          <div className="flex items-center justify-between text-[11px]">
            <span style={{ color: textMuted }}>Tiến độ quét dữ liệu:</span>
            <span className="font-mono font-bold text-sky-500">{progress}%</span>
          </div>

          {/* WinForms ProgressBar */}
          <div
            style={{
              backgroundColor: controlBg,
              borderColor: border,
            }}
            className="h-4 border rounded-sm overflow-hidden p-0.5"
          >
            <div
              style={{
                width: `${progress}%`,
                backgroundColor: '#107C41', // Classic WinForms Green
              }}
              className="h-full transition-all duration-300"
            />
          </div>
        </fieldset>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-2 pt-2">
          <button
            onClick={() => {
              setIsClosed(true);
              triggerAction('event', 'btnCancel_Click() -> DialogResult.Cancel');
            }}
            style={{
              backgroundColor: isDark ? '#333333' : '#E1E1E1',
              borderColor: border,
              color: text,
            }}
            className="px-4 py-1 text-xs border rounded-sm hover:brightness-110 active:brightness-90 transition-all"
          >
            Hủy bỏ (Cancel)
          </button>
          <button
            onClick={() => {
              triggerAction('alert', `WinForms: Thực thi [${tool.name}] thành công!`);
              setProgress(100);
            }}
            style={{
              backgroundColor: isDark ? '#0E639C' : '#0078D7',
              borderColor: isDark ? '#1177BB' : '#005A9E',
              color: '#FFFFFF',
            }}
            className="px-5 py-1 text-xs font-semibold border rounded-sm hover:brightness-110 active:brightness-90 transition-all shadow-sm"
          >
            Thực thi (OK)
          </button>
        </div>
      </div>

      {/* 4. StatusStrip */}
      <div
        style={{
          backgroundColor: headerBg,
          borderColor: border,
          color: textMuted,
        }}
        className="h-5 px-2 flex items-center justify-between border-t text-[10px] font-mono"
      >
        <span>{statusText}</span>
        <span>Revit Document: Active</span>
      </div>
    </div>
  );
};
