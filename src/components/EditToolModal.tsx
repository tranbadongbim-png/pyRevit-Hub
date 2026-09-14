import React, { useState, useEffect } from 'react';
import { X, Save, FilePlus, Trash2, FileCode, Check, AlertCircle } from 'lucide-react';
import { PyRevitTool, ToolCategory, PyRevitToolFile } from '../types';

interface EditToolModalProps {
  isOpen: boolean;
  tool: PyRevitTool | null;
  onClose: () => void;
  onSave: (updatedTool: PyRevitTool) => void;
}

export const EditToolModal: React.FC<EditToolModalProps> = ({
  isOpen,
  tool,
  onClose,
  onSave,
}) => {
  if (!isOpen || !tool) return null;

  const [name, setName] = useState(tool.name);
  const [title, setTitle] = useState(tool.title);
  const [icon, setIcon] = useState(tool.icon);
  const [category, setCategory] = useState<ToolCategory>(tool.category);
  const [panel, setPanel] = useState(tool.panel);
  const [extensionTab, setExtensionTab] = useState(tool.extensionTab);
  const [description, setDescription] = useState(tool.description);
  const [tooltip, setTooltip] = useState(tool.tooltip || '');
  const [author, setAuthor] = useState(tool.author);
  const [version, setVersion] = useState(tool.version);
  const [minRevit, setMinRevit] = useState(tool.minRevit || '2020');
  const [maxRevit, setMaxRevit] = useState(tool.maxRevit || '2026');
  
  // Files management
  const [files, setFiles] = useState<PyRevitToolFile[]>(tool.files);
  const [newFileName, setNewFileName] = useState('');
  const [showAddFile, setShowAddFile] = useState(false);

  useEffect(() => {
    setName(tool.name);
    setTitle(tool.title);
    setIcon(tool.icon);
    setCategory(tool.category);
    setPanel(tool.panel);
    setExtensionTab(tool.extensionTab);
    setDescription(tool.description);
    setTooltip(tool.tooltip || '');
    setAuthor(tool.author);
    setVersion(tool.version);
    setMinRevit(tool.minRevit || '2020');
    setMaxRevit(tool.maxRevit || '2026');
    setFiles(tool.files);
  }, [tool]);

  const handleAddFile = () => {
    if (!newFileName.trim()) return;
    const fileName = newFileName.trim();
    if (files.some((f) => f.name.toLowerCase() === fileName.toLowerCase())) {
      alert('Tệp này đã tồn tại!');
      return;
    }

    const isXaml = fileName.endsWith('.xaml');
    const isPy = fileName.endsWith('.py');
    const isYaml = fileName.endsWith('.yaml') || fileName.endsWith('.yml');

    let initialContent = '# pyRevit script\n';
    if (isXaml) {
      initialContent = `<Window xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"\n        xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"\n        Title="${name}" Height="400" Width="450">\n    <Grid Margin="12">\n        <TextBlock Text="Nội dung giao diện mới" FontSize="14"/>\n    </Grid>\n</Window>`;
    } else if (isYaml) {
      initialContent = `title: "${title.replace('\\n', ' ')}"\ntooltip: "${tooltip || description}"\nauthor: "${author}"\nhighlight: new\n`;
    }

    const newFile: PyRevitToolFile = {
      name: fileName,
      path: `${extensionTab}/${panel}/${name}/${fileName}`,
      language: isXaml ? 'xml' : isPy ? 'python' : isYaml ? 'yaml' : 'plaintext',
      description: `Tệp ${fileName} được thêm mới`,
      content: initialContent,
    };

    setFiles([...files, newFile]);
    setNewFileName('');
    setShowAddFile(false);
  };

  const handleDeleteFile = (fileName: string) => {
    if (files.length <= 1) {
      alert('Tool phải có ít nhất 1 tệp mã nguồn!');
      return;
    }
    setFiles(files.filter((f) => f.name !== fileName));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const formattedName = name.trim().endsWith('.pushbutton')
      ? name.trim()
      : `${name.trim()}.pushbutton`;

    const updated: PyRevitTool = {
      ...tool,
      name: formattedName,
      title: title.trim(),
      icon: icon.trim(),
      category,
      panel: panel.trim().endsWith('.panel') ? panel.trim() : `${panel.trim()}.panel`,
      extensionTab: extensionTab.trim().endsWith('.tab') ? extensionTab.trim() : `${extensionTab.trim()}.tab`,
      description: description.trim(),
      tooltip: tooltip.trim(),
      author: author.trim(),
      version: version.trim(),
      minRevit,
      maxRevit,
      files,
      updatedAt: new Date().toISOString().split('T')[0],
    };

    onSave(updated);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-2xl max-h-[90vh] flex flex-col rounded-2xl bg-[#141418] border border-zinc-700/80 shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-zinc-800 flex items-center justify-between bg-[#18181F]">
          <div className="flex items-center gap-2.5">
            <span className="text-xl">{icon}</span>
            <div>
              <h3 className="text-sm font-bold text-white">Chỉnh Sửa Thông Tin Tool</h3>
              <p className="text-xs text-zinc-400">Cập nhật thông số metadata và quản lý tệp mã nguồn pyRevit</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Tool Name */}
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">
                Tên Thư Mục Tool (.pushbutton)
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full h-9 px-3 bg-[#1B1B22] border border-zinc-700 rounded-lg text-xs text-zinc-200 outline-none focus:border-sky-500 font-mono"
              />
            </div>

            {/* Ribbon Title */}
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">
                Tiêu Đề Nút Bấm Revit Ribbon
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ví dụ: Đổi Tên\nSheet"
                required
                className="w-full h-9 px-3 bg-[#1B1B22] border border-zinc-700 rounded-lg text-xs text-zinc-200 outline-none focus:border-sky-500"
              />
              <span className="text-[10px] text-zinc-500">Dùng ký tự \n để ngắt dòng hiển thị</span>
            </div>

            {/* Icon */}
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">
                Biểu Tượng (Icon / Emoji)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={icon}
                  onChange={(e) => setIcon(e.target.value)}
                  maxLength={4}
                  className="w-16 h-9 px-3 bg-[#1B1B22] border border-zinc-700 rounded-lg text-center text-base text-zinc-200 outline-none focus:border-sky-500"
                />
                <div className="flex gap-1">
                  {['⚡', '📐', '📋', '👋', '🏗️', '🔍', '⚙️', '✨'].map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => setIcon(emoji)}
                      className="w-7 h-7 rounded bg-zinc-800 hover:bg-zinc-700 text-xs flex items-center justify-center transition-colors"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Category */}
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">
                Phân Loại (Category)
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ToolCategory)}
                className="w-full h-9 px-3 bg-[#1B1B22] border border-zinc-700 rounded-lg text-xs text-zinc-200 outline-none focus:border-sky-500"
              >
                <option value="Personal">Personal (Cá nhân)</option>
                <option value="Documentation">Documentation (Hồ sơ & Sheet)</option>
                <option value="Modeling">Modeling (Dựng hình & Model)</option>
                <option value="QA_QC">QA_QC (Kiểm tra & Báo lỗi)</option>
              </select>
            </div>

            {/* Panel */}
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">
                Nhóm Bảng pyRevit (.panel)
              </label>
              <input
                type="text"
                value={panel}
                onChange={(e) => setPanel(e.target.value)}
                required
                className="w-full h-9 px-3 bg-[#1B1B22] border border-zinc-700 rounded-lg text-xs text-zinc-200 outline-none focus:border-sky-500 font-mono"
              />
            </div>

            {/* Extension Tab */}
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">
                Tab Ribbon pyRevit (.tab)
              </label>
              <input
                type="text"
                value={extensionTab}
                onChange={(e) => setExtensionTab(e.target.value)}
                required
                className="w-full h-9 px-3 bg-[#1B1B22] border border-zinc-700 rounded-lg text-xs text-zinc-200 outline-none focus:border-sky-500 font-mono"
              />
            </div>

            {/* Author */}
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">
                Tác Giả (Author)
              </label>
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                required
                className="w-full h-9 px-3 bg-[#1B1B22] border border-zinc-700 rounded-lg text-xs text-zinc-200 outline-none focus:border-sky-500"
              />
            </div>

            {/* Version */}
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">
                Phiên Bản (Version)
              </label>
              <input
                type="text"
                value={version}
                onChange={(e) => setVersion(e.target.value)}
                required
                className="w-full h-9 px-3 bg-[#1B1B22] border border-zinc-700 rounded-lg text-xs text-zinc-200 outline-none focus:border-sky-500 font-mono"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">
              Mô Tả Chức Năng Tool
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              className="w-full p-2.5 bg-[#1B1B22] border border-zinc-700 rounded-lg text-xs text-zinc-200 outline-none focus:border-sky-500 leading-relaxed resize-none"
            />
          </div>

          {/* Files Management */}
          <div className="border border-zinc-800 rounded-xl p-3.5 bg-black/20">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <FileCode className="w-4 h-4 text-sky-400" />
                <span className="text-xs font-bold text-zinc-200">Danh Sách Tệp Trong Bundle ({files.length})</span>
              </div>
              <button
                type="button"
                onClick={() => setShowAddFile(!showAddFile)}
                className="text-[11px] px-2.5 py-1 rounded bg-sky-500/20 text-sky-400 hover:bg-sky-500/30 font-medium transition-colors"
              >
                + Thêm tệp mới
              </button>
            </div>

            {showAddFile && (
              <div className="flex items-center gap-2 p-2 bg-[#1B1B22] rounded-lg border border-zinc-700 mb-3">
                <input
                  type="text"
                  placeholder="Tên tệp (vd: helper.py, config.json, Dialog.xaml)"
                  value={newFileName}
                  onChange={(e) => setNewFileName(e.target.value)}
                  className="flex-1 bg-transparent text-xs text-zinc-200 outline-none font-mono"
                />
                <button
                  type="button"
                  onClick={handleAddFile}
                  className="px-3 py-1 bg-sky-500 hover:bg-sky-400 text-white rounded text-xs font-medium"
                >
                  Xác nhận
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddFile(false)}
                  className="px-2 py-1 text-zinc-400 hover:text-white text-xs"
                >
                  Hủy
                </button>
              </div>
            )}

            <div className="space-y-1.5">
              {files.map((file) => (
                <div
                  key={file.name}
                  className="flex items-center justify-between p-2 rounded-lg bg-[#18181F] border border-zinc-800 text-xs"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="font-mono text-zinc-300 font-semibold">{file.name}</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-zinc-800 text-zinc-400 uppercase font-mono">
                      {file.language}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDeleteFile(file.name)}
                    className="p-1 rounded text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                    title="Xóa tệp này"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Modal Actions */}
          <div className="pt-3 border-t border-zinc-800 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-medium text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition-colors"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-white text-xs font-bold shadow-md flex items-center gap-1.5 transition-all active:scale-95"
            >
              <Save className="w-4 h-4" />
              <span>Lưu Thay Đổi</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
