import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { DEFAULT_TOOLS } from './data/defaultTools';
import { PyRevitTool, RevitTheme } from './types';
import { ToolSidebar } from './components/ToolSidebar';
import { ToolEditor } from './components/ToolEditor';
import { CreateToolModal } from './components/CreateToolModal';
import { EditToolModal } from './components/EditToolModal';
import { DeleteConfirmModal } from './components/DeleteConfirmModal';
import { StorageManagerModal } from './components/StorageManagerModal';
import { downloadToolAsZip, downloadFullExtensionBundle } from './utils/pyrevitPackager';

// Upgraded to v4 to ensure users get the new BIMSheetDataManager and high-accuracy DataGrid rendering
const CURRENT_STORAGE_KEY = 'pyrevit_tools_library_v4';

export default function App() {
  const [tools, setTools] = useState<PyRevitTool[]>(() => {
    try {
      // 1. Check v4
      const savedV4 = localStorage.getItem(CURRENT_STORAGE_KEY);
      if (savedV4) {
        const parsed = JSON.parse(savedV4);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }

      // 2. Migration from v3/v2 if exists (preserve user custom tools)
      const savedV3 = localStorage.getItem('pyrevit_tools_library_v3') || localStorage.getItem('pyrevit_tools_library_v2');
      if (savedV3) {
        const parsedV3 = JSON.parse(savedV3);
        if (Array.isArray(parsedV3)) {
          const customOnly = parsedV3.filter((t: PyRevitTool) => t.isCustom);
          if (customOnly.length > 0) {
            return [...DEFAULT_TOOLS, ...customOnly];
          }
        }
      }
    } catch (e) {
      console.warn('Could not load stored tools:', e);
    }
    return DEFAULT_TOOLS;
  });

  const [selectedToolId, setSelectedToolId] = useState<string>(() => {
    return tools[0]?.id || DEFAULT_TOOLS[0]?.id || '';
  });

  const [revitTheme, setRevitTheme] = useState<RevitTheme>('dark');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [toolToEdit, setToolToEdit] = useState<PyRevitTool | null>(null);
  const [toolToDelete, setToolToDelete] = useState<PyRevitTool | null>(null);
  const [isStorageModalOpen, setIsStorageModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Auto-save to localStorage whenever tools array changes
  useEffect(() => {
    try {
      localStorage.setItem(CURRENT_STORAGE_KEY, JSON.stringify(tools));
    } catch (e) {
      console.warn('Could not persist tools:', e);
    }
  }, [tools]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const selectedTool = tools.find((t) => t.id === selectedToolId) || tools[0];

  const handleSelectTool = (id: string) => {
    setSelectedToolId(id);
  };

  const handleUpdateTool = (updated: PyRevitTool) => {
    setTools((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
    showToast(`Đã lưu thay đổi cho [${updated.name}]!`);
  };

  const handleCreateTool = (newTool: PyRevitTool) => {
    setTools((prev) => [newTool, ...prev]);
    setSelectedToolId(newTool.id);
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
    showToast(`Đã tạo thành công tool [${newTool.name}]!`);
  };

  const handleDuplicateTool = (tool: PyRevitTool) => {
    const newId = `${tool.id}-copy-${Date.now().toString(36)}`;
    const baseName = tool.name.replace('.pushbutton', '');
    const newName = `${baseName}_Copy.pushbutton`;

    const duplicated: PyRevitTool = {
      ...tool,
      id: newId,
      name: newName,
      title: `${tool.title}\\n(Bản Sao)`,
      description: `Bản sao của ${tool.name}: ${tool.description}`,
      isCustom: true,
      updatedAt: new Date().toISOString().split('T')[0],
      files: tool.files.map((f) => ({
        ...f,
        path: f.path.replace(tool.name, newName),
      })),
    };

    setTools((prev) => [duplicated, ...prev]);
    setSelectedToolId(duplicated.id);
    showToast(`Đã nhân bản công cụ [${newName}]!`);
  };

  const handleConfirmDelete = () => {
    if (!toolToDelete) return;
    const idToDelete = toolToDelete.id;
    const nameToDelete = toolToDelete.name;

    setTools((prev) => {
      const remaining = prev.filter((t) => t.id !== idToDelete);
      if (selectedToolId === idToDelete) {
        setSelectedToolId(remaining[0]?.id || '');
      }
      return remaining;
    });

    setToolToDelete(null);
    showToast(`Đã xóa tool [${nameToDelete}] khỏi thư viện.`);
  };

  const handleImportTools = (imported: PyRevitTool[]) => {
    setTools(imported);
    if (imported.length > 0) {
      setSelectedToolId(imported[0].id);
    }
    showToast(`Đã nạp thành công ${imported.length} công cụ từ tệp sao lưu!`);
  };

  const handleResetDefault = () => {
    localStorage.removeItem(CURRENT_STORAGE_KEY);
    localStorage.removeItem('pyrevit_tools_library_v2');
    setTools(DEFAULT_TOOLS);
    setSelectedToolId(DEFAULT_TOOLS[0].id);
    showToast('Đã làm mới toàn bộ kho công cụ về bản chuẩn pyRevit 2026!');
  };

  const handleDownloadSingleTool = async (tool: PyRevitTool) => {
    await downloadToolAsZip(tool);
    showToast(`Đang tải gói [${tool.name}.zip]...`);
  };

  const handleDownloadAll = async () => {
    await downloadFullExtensionBundle(tools);
    confetti({ particleCount: 70, spread: 80, origin: { y: 0.6 } });
    showToast('Đang tải trọn bộ Extension BIMHanoi.extension.zip!');
  };

  const handleToggleTheme = () => {
    setRevitTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <div className="flex h-screen w-screen bg-[#0A0A0D] text-zinc-100 antialiased overflow-hidden font-sans">
      {/* Left Sidebar for Tools Catalog */}
      <ToolSidebar
        tools={tools}
        selectedToolId={selectedToolId}
        onSelectTool={handleSelectTool}
        onOpenCreateModal={() => setIsCreateModalOpen(true)}
        onOpenEditModal={(t) => setToolToEdit(t)}
        onOpenDeleteModal={(t) => setToolToDelete(t)}
        onDuplicateTool={handleDuplicateTool}
        onOpenStorageModal={() => setIsStorageModalOpen(true)}
        onDownloadAll={handleDownloadAll}
      />

      {/* Main Workspace Area: Code & XAML Live Studio */}
      <main className="flex-1 flex flex-col h-full overflow-hidden">
        {selectedTool ? (
          <ToolEditor
            key={selectedTool.id}
            tool={selectedTool}
            theme={revitTheme}
            onThemeToggle={handleToggleTheme}
            onUpdateTool={handleUpdateTool}
            onDownloadZip={handleDownloadSingleTool}
            onOpenEditModal={() => setToolToEdit(selectedTool)}
            onOpenDeleteModal={() => setToolToDelete(selectedTool)}
            onDuplicateTool={() => handleDuplicateTool(selectedTool)}
          />
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-6 text-zinc-500 text-sm">
            <p className="mb-3 text-zinc-300 font-semibold">Chưa có công cụ nào trong thư viện</p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-white text-xs font-bold transition-all shadow-md"
              >
                + Tạo Tool Mới
              </button>
              <button
                onClick={handleResetDefault}
                className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-bold transition-all"
              >
                Tải lại kho mặc định
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Create New Tool Modal */}
      <CreateToolModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreate={handleCreateTool}
      />

      {/* Edit Tool Modal */}
      <EditToolModal
        isOpen={!!toolToEdit}
        tool={toolToEdit}
        onClose={() => setToolToEdit(null)}
        onSave={handleUpdateTool}
      />

      {/* Delete Tool Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={!!toolToDelete}
        tool={toolToDelete}
        onClose={() => setToolToDelete(null)}
        onConfirm={handleConfirmDelete}
      />

      {/* Storage & Backup/Restore Manager Modal */}
      <StorageManagerModal
        isOpen={isStorageModalOpen}
        onClose={() => setIsStorageModalOpen(false)}
        tools={tools}
        onImportTools={handleImportTools}
        onResetDefault={handleResetDefault}
      />

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-2.5 rounded-xl bg-sky-500 text-slate-950 font-semibold text-xs shadow-2xl border border-sky-300 animate-bounce">
          {toastMessage}
        </div>
      )}
    </div>
  );
}
