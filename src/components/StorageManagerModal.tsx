import React, { useRef } from 'react';
import { 
  Database, 
  Download, 
  Upload, 
  RotateCcw, 
  HardDrive, 
  CheckCircle2, 
  X, 
  AlertCircle,
  FileJson,
  ShieldCheck
} from 'lucide-react';
import { PyRevitTool } from '../types';

interface StorageManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  tools: PyRevitTool[];
  onImportTools: (imported: PyRevitTool[]) => void;
  onResetDefault: () => void;
}

export const StorageManagerModal: React.FC<StorageManagerModalProps> = ({
  isOpen,
  onClose,
  tools,
  onImportTools,
  onResetDefault,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  // Calculate size in localStorage
  const rawData = JSON.stringify(tools);
  const sizeKb = (new Blob([rawData]).size / 1024).toFixed(1);

  // Export JSON backup
  const handleExportJson = () => {
    const backupData = {
      version: '2.0.0',
      exportedAt: new Date().toISOString(),
      author: 'BIM Hanoi (dongtb@bimhanoi.com.vn)',
      totalTools: tools.length,
      tools,
    };

    const blob = new Blob([JSON.stringify(backupData, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `BIMHanoi_pyRevit_Tools_Backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Import JSON backup
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        const importedTools = Array.isArray(parsed) ? parsed : parsed.tools;

        if (!Array.isArray(importedTools) || importedTools.length === 0) {
          alert('Tệp JSON không hợp lệ hoặc không có dữ liệu công cụ pyRevit!');
          return;
        }

        onImportTools(importedTools);
        alert(`Đã khôi phục thành công ${importedTools.length} công cụ pyRevit!`);
        onClose();
      } catch (err: any) {
        alert(`Lỗi đọc file JSON: ${err.message}`);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-lg rounded-2xl bg-[#141418] border border-zinc-700/80 shadow-2xl overflow-hidden flex flex-col text-zinc-200">
        {/* Header */}
        <div className="px-5 py-4 border-b border-zinc-800 flex items-center justify-between bg-[#18181F]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Nơi Lưu Trữ &amp; Sao Lưu Dữ Liệu</h3>
              <p className="text-xs text-zinc-400">Cơ chế bảo toàn mã nguồn và đồng bộ giữa các máy tính</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4 text-xs">
          {/* Status Box */}
          <div className="p-4 rounded-xl bg-[#191922] border border-zinc-700/80 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-zinc-300 flex items-center gap-2">
                <HardDrive className="w-4 h-4 text-emerald-400" />
                <span>Trạng thái lưu trữ hiện tại:</span>
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                <span>Đang hoạt động</span>
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-zinc-800 text-center font-mono">
              <div className="p-2 rounded-lg bg-black/20">
                <div className="text-[10px] text-zinc-500">Bộ Nhớ</div>
                <div className="text-xs font-bold text-sky-400">LocalStorage</div>
              </div>
              <div className="p-2 rounded-lg bg-black/20">
                <div className="text-[10px] text-zinc-500">Số Lượng Tool</div>
                <div className="text-xs font-bold text-white">{tools.length} công cụ</div>
              </div>
              <div className="p-2 rounded-lg bg-black/20">
                <div className="text-[10px] text-zinc-500">Dung Lượng</div>
                <div className="text-xs font-bold text-emerald-400">{sizeKb} KB</div>
              </div>
            </div>

            <p className="text-[11px] text-zinc-400 leading-relaxed pt-1">
              ✓ <strong className="text-zinc-200">Lưu trữ cục bộ an toàn:</strong> Toàn bộ mã nguồn Python (.py), XAML (.xaml), cấu hình bundle được lưu tự động liên tục vào bộ nhớ trình duyệt của máy anh. Tắt trình duyệt hoặc khởi động lại máy tính dữ liệu vẫn nguyên vẹn 100%.
            </p>
          </div>

          {/* Backup & Restore Controls */}
          <div className="space-y-2 pt-1">
            <h4 className="font-bold text-zinc-200 flex items-center gap-1.5 text-xs">
              <FileJson className="w-4 h-4 text-sky-400" />
              <span>Xuất / Nhập Kho Dữ Liệu (Backup &amp; Migration)</span>
            </h4>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={handleExportJson}
                className="p-3 rounded-xl bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/30 text-sky-300 font-semibold flex flex-col items-center justify-center gap-1.5 transition-all text-center group"
              >
                <Download className="w-5 h-5 group-hover:-translate-y-0.5 transition-transform" />
                <span>Xuất File Sao Lưu (.json)</span>
                <span className="text-[10px] text-zinc-400 font-normal">Tải file về lưu trữ hoặc gửi đồng nghiệp</span>
              </button>

              <button
                onClick={() => fileInputRef.current?.click()}
                className="p-3 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 font-semibold flex flex-col items-center justify-center gap-1.5 transition-all text-center group"
              >
                <Upload className="w-5 h-5 group-hover:-translate-y-0.5 transition-transform" />
                <span>Nhập File Sao Lưu (.json)</span>
                <span className="text-[10px] text-zinc-400 font-normal">Khôi phục kho tool từ file trên máy tính</span>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
          </div>

          {/* Reset Action */}
          <div className="pt-3 border-t border-zinc-800 flex items-center justify-between">
            <div className="text-[11px] text-zinc-500">
              Cần nạp lại bộ mẫu BIM Hanoi ban đầu?
            </div>
            <button
              onClick={() => {
                if (confirm('Bạn có chắc chắn muốn khôi phục lại kho công cụ mẫu BIM Hanoi ban đầu? Các công cụ tùy chỉnh có thể bị ghi đè.')) {
                  onResetDefault();
                  onClose();
                }
              }}
              className="px-3 py-1.5 rounded-lg border border-zinc-700 hover:border-amber-500/50 text-zinc-400 hover:text-amber-300 text-xs flex items-center gap-1.5 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Khôi Phục Mặc Định</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
