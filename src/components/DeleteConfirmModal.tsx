import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';
import { PyRevitTool } from '../types';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  tool: PyRevitTool | null;
  onClose: () => void;
  onConfirm: () => void;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  tool,
  onClose,
  onConfirm,
}) => {
  if (!isOpen || !tool) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md rounded-2xl bg-[#141418] border border-red-500/40 shadow-2xl p-5 text-zinc-200">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400 shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-bold text-white">Xác Nhận Xóa Công Cụ?</h3>
            <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
              Bạn có chắc chắn muốn xóa tool{' '}
              <span className="font-semibold text-red-300 font-mono">[{tool.name}]</span> khỏi thư viện không?
            </p>
            <div className="mt-2.5 p-2 rounded-lg bg-red-950/30 border border-red-900/50 text-[11px] text-red-300">
              Thao tác này sẽ xóa toàn bộ {tool.files.length} tệp mã nguồn (.py, .xaml, v.v.) của tool này trong bộ nhớ trình duyệt.
            </div>
          </div>
        </div>

        <div className="mt-5 flex items-center justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-medium text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            Hủy
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold shadow-md flex items-center gap-1.5 transition-all active:scale-95"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Xóa Vĩnh Viễn</span>
          </button>
        </div>
      </div>
    </div>
  );
};
