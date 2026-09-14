import React, { useState } from 'react';
import { X, Sparkles, PlusCircle, FileText, Check } from 'lucide-react';
import { PyRevitTool, ToolCategory } from '../types';

interface CreateToolModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (newTool: PyRevitTool) => void;
}

export const CreateToolModal: React.FC<CreateToolModalProps> = ({
  isOpen,
  onClose,
  onCreate,
}) => {
  const [toolName, setToolName] = useState('MyCustomTool');
  const [title, setTitle] = useState('Công Cụ\\nMới');
  const [author, setAuthor] = useState('Đông TB (BIM Hanoi)');
  const [category, setCategory] = useState<ToolCategory>('Documentation');
  const [panel, setPanel] = useState('Tools.panel');
  const [extensionTab, setExtensionTab] = useState('BIMHanoi.tab');
  const [iconEmoji, setIconEmoji] = useState('⚡');
  const [template, setTemplate] = useState<'standard' | 'dialog' | 'batch'>('standard');

  if (!isOpen) return null;

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();

    const formattedName = toolName.endsWith('.pushbutton')
      ? toolName
      : `${toolName}.pushbutton`;
    const id = toolName.toLowerCase().replace(/[^a-z0-9]/g, '-') + '-' + Date.now().toString(36);

    // Template XAML
    let xamlContent = '';
    let pythonContent = '';

    if (template === 'standard') {
      xamlContent = `<Window xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
        xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
        Title="pyRevit • ${title.replace('\\n', ' ')}"
        Height="460" Width="480"
        WindowStartupLocation="CenterScreen"
        WindowStyle="None"
        AllowsTransparency="True"
        Background="Transparent"
        ResizeMode="NoResize">

    <Window.Resources>
        <SolidColorBrush x:Key="WindowBg" Color="#1E1E24" />
        <SolidColorBrush x:Key="CardBg" Color="#272730" />
        <SolidColorBrush x:Key="BorderColor" Color="#3A3A47" />
        <SolidColorBrush x:Key="TextPrimary" Color="#F3F4F6" />
        <SolidColorBrush x:Key="TextSecondary" Color="#9CA3AF" />
        <SolidColorBrush x:Key="AccentColor" Color="#38BDF8" />
        <SolidColorBrush x:Key="AccentText" Color="#0F172A" />
    </Window.Resources>

    <Grid Margin="12">
        <Border Background="{DynamicResource WindowBg}" BorderBrush="{DynamicResource BorderColor}" BorderThickness="1" CornerRadius="16">
            <Border.Effect>
                <DropShadowEffect BlurRadius="24" Color="#000000" Opacity="0.4" ShadowDepth="6" Direction="270" />
            </Border.Effect>

            <Grid>
                <Grid.RowDefinitions>
                    <RowDefinition Height="46" />
                    <RowDefinition Height="*" />
                    <RowDefinition Height="60" />
                </Grid.RowDefinitions>

                <!-- Header -->
                <Border Grid.Row="0" BorderBrush="{DynamicResource BorderColor}" BorderThickness="0,0,0,1">
                    <Grid Margin="16,0,12,0">
                        <StackPanel Orientation="Horizontal" VerticalAlignment="Center">
                            <TextBlock Text="${iconEmoji}" FontSize="15" Margin="0,0,8,0" VerticalAlignment="Center"/>
                            <TextBlock Text="${title.replace('\\n', ' ')} • BIM Hanoi" Foreground="{DynamicResource TextPrimary}" FontWeight="SemiBold" FontSize="13" VerticalAlignment="Center"/>
                        </StackPanel>
                        <Button HorizontalAlignment="Right" Width="28" Height="28" Background="Transparent" BorderThickness="0" Name="btn_close">
                            <TextBlock Text="✕" Foreground="{DynamicResource TextSecondary}" FontSize="12"/>
                        </Button>
                    </Grid>
                </Border>

                <!-- Body Content -->
                <ScrollViewer Grid.Row="1" Margin="20,16" VerticalScrollBarVisibility="Auto">
                    <StackPanel>
                        <TextBlock Text="Cấu hình tùy biến" Foreground="{DynamicResource TextPrimary}" FontSize="15" FontWeight="Bold" Margin="0,0,0,6"/>
                        <TextBlock Text="Nhập các tham số và lựa chọn đối tượng cần xử lý trong mô hình Revit." Foreground="{DynamicResource TextSecondary}" FontSize="12" Margin="0,0,0,14"/>

                        <Border Background="{DynamicResource CardBg}" BorderBrush="{DynamicResource BorderColor}" BorderThickness="1" CornerRadius="10" Padding="14">
                            <StackPanel>
                                <TextBlock Text="TÊN TIẾN TRÌNH" Foreground="{DynamicResource AccentColor}" FontSize="11" FontWeight="Bold" Margin="0,0,0,4"/>
                                <TextBox Name="txtInput" Text="Giá trị mặc định..." Height="32" Padding="8,4" Background="{DynamicResource WindowBg}" Foreground="{DynamicResource TextPrimary}" BorderBrush="{DynamicResource BorderColor}" BorderThickness="1" Margin="0,0,0,12"/>
                                <CheckBox Name="chkOption" Content="Tự động sao lưu trước khi thực thi" IsChecked="True" Foreground="{DynamicResource TextPrimary}"/>
                            </StackPanel>
                        </Border>
                    </StackPanel>
                </ScrollViewer>

                <!-- Footer Action Buttons -->
                <Border Grid.Row="2" Background="{DynamicResource CardBg}" BorderBrush="{DynamicResource BorderColor}" BorderThickness="0,1,0,0" CornerRadius="0,0,16,16" Padding="20,12">
                    <Grid>
                        <Button HorizontalAlignment="Left" Width="90" Height="36" Name="btn_cancel" Background="{DynamicResource WindowBg}" BorderBrush="{DynamicResource BorderColor}" BorderThickness="1">
                            <TextBlock Text="Hủy" Foreground="{DynamicResource TextPrimary}" FontSize="12"/>
                        </Button>
                        <Button HorizontalAlignment="Right" Padding="18,0" Height="36" Name="btn_run" Background="{DynamicResource AccentColor}">
                            <TextBlock Text="Chạy Công Cụ ⚡" Foreground="{DynamicResource AccentText}" FontWeight="Bold" FontSize="12"/>
                        </Button>
                    </Grid>
                </Border>
            </Grid>
        </Border>
    </Grid>
</Window>`;

      pythonContent = `# -*- coding: utf-8 -*-
from pyrevit import forms, revit, DB

class MainWindow(forms.WPFWindow):
    def __init__(self):
        forms.WPFWindow.__init__(self, 'MainWindow.xaml')

    def btn_close_click(self, sender, args):
        self.Close()

    def btn_cancel_click(self, sender, args):
        self.Close()

    def btn_run_click(self, sender, args):
        val = self.txtInput.Text
        forms.alert("Đã thực thi thành công với giá trị: {}".format(val))
        self.Close()

if __name__ == '__main__':
    MainWindow().ShowDialog()
`;
    } else {
      // Batch template with progress bar
      xamlContent = `<Window xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
        xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
        Title="pyRevit • ${title.replace('\\n', ' ')}"
        Height="420" Width="460"
        WindowStartupLocation="CenterScreen"
        WindowStyle="None"
        AllowsTransparency="True"
        Background="Transparent"
        ResizeMode="NoResize">

    <Window.Resources>
        <SolidColorBrush x:Key="WindowBg" Color="#1E1E24" />
        <SolidColorBrush x:Key="CardBg" Color="#272730" />
        <SolidColorBrush x:Key="BorderColor" Color="#3A3A47" />
        <SolidColorBrush x:Key="TextPrimary" Color="#F3F4F6" />
        <SolidColorBrush x:Key="TextSecondary" Color="#9CA3AF" />
        <SolidColorBrush x:Key="AccentColor" Color="#10B981" />
        <SolidColorBrush x:Key="AccentText" Color="#064E3B" />
    </Window.Resources>

    <Grid Margin="12">
        <Border Background="{DynamicResource WindowBg}" BorderBrush="{DynamicResource BorderColor}" BorderThickness="1" CornerRadius="16">
            <Border.Effect>
                <DropShadowEffect BlurRadius="24" Color="#000000" Opacity="0.4" ShadowDepth="6" Direction="270" />
            </Border.Effect>

            <Grid>
                <Grid.RowDefinitions>
                    <RowDefinition Height="46" />
                    <RowDefinition Height="*" />
                    <RowDefinition Height="60" />
                </Grid.RowDefinitions>

                <Border Grid.Row="0" BorderBrush="{DynamicResource BorderColor}" BorderThickness="0,0,0,1">
                    <Grid Margin="16,0,12,0">
                        <StackPanel Orientation="Horizontal" VerticalAlignment="Center">
                            <TextBlock Text="${iconEmoji}" FontSize="15" Margin="0,0,8,0" VerticalAlignment="Center"/>
                            <TextBlock Text="${title.replace('\\n', ' ')}" Foreground="{DynamicResource TextPrimary}" FontWeight="SemiBold" FontSize="13" VerticalAlignment="Center"/>
                        </StackPanel>
                        <Button HorizontalAlignment="Right" Width="28" Height="28" Background="Transparent" BorderThickness="0" Name="btn_close">
                            <TextBlock Text="✕" Foreground="{DynamicResource TextSecondary}" FontSize="12"/>
                        </Button>
                    </Grid>
                </Border>

                <ScrollViewer Grid.Row="1" Margin="20,16">
                    <StackPanel>
                        <Border Background="{DynamicResource CardBg}" BorderBrush="{DynamicResource BorderColor}" BorderThickness="1" CornerRadius="10" Padding="14">
                            <StackPanel>
                                <Grid Margin="0,0,0,6">
                                    <TextBlock Text="TIẾN ĐỘ THỰC HIỆN" Foreground="{DynamicResource TextSecondary}" FontSize="11" FontWeight="Bold"/>
                                    <TextBlock Text="60%" HorizontalAlignment="Right" Foreground="{DynamicResource AccentColor}" FontSize="11" FontWeight="Bold"/>
                                </Grid>
                                <ProgressBar Value="60" Maximum="100" Height="8" Background="{DynamicResource WindowBg}" Foreground="{DynamicResource AccentColor}"/>
                                <TextBlock Text="Đang xử lý phần tử 12 / 20..." Foreground="{DynamicResource TextSecondary}" FontSize="11" Margin="0,8,0,0"/>
                            </StackPanel>
                        </Border>
                    </StackPanel>
                </ScrollViewer>

                <Border Grid.Row="2" Background="{DynamicResource CardBg}" BorderBrush="{DynamicResource BorderColor}" BorderThickness="0,1,0,0" CornerRadius="0,0,16,16" Padding="20,12">
                    <Grid>
                        <Button HorizontalAlignment="Right" Padding="18,0" Height="36" Name="btn_start" Background="{DynamicResource AccentColor}">
                            <TextBlock Text="Bắt đầu xử lý 🚀" Foreground="{DynamicResource AccentText}" FontWeight="Bold"/>
                        </Button>
                    </Grid>
                </Border>
            </Grid>
        </Border>
    </Grid>
</Window>`;

      pythonContent = `# -*- coding: utf-8 -*-
from pyrevit import forms, revit

class MainWindow(forms.WPFWindow):
    def __init__(self):
        forms.WPFWindow.__init__(self, 'MainWindow.xaml')

    def btn_start_click(self, sender, args):
        forms.alert("Đang tiến hành xử lý batch...")
        self.Close()

if __name__ == '__main__':
    MainWindow().ShowDialog()
`;
    }

    const newTool: PyRevitTool = {
      id,
      name: formattedName,
      title,
      icon: iconEmoji,
      category,
      author,
      description: `Công cụ ${title.replace('\\n', ' ')} xây dựng cho dự án BIM Hanoi.`,
      tooltip: `Tool ${title.replace('\\n', ' ')} cho pyRevit.`,
      version: '1.0.0',
      minRevit: '2020',
      maxRevit: '2026',
      extensionTab,
      panel,
      buttonType: 'pushbutton',
      xamlFileName: 'MainWindow.xaml',
      updatedAt: new Date().toISOString().split('T')[0],
      isCustom: true,
      files: [
        {
          name: 'MainWindow.xaml',
          path: `${extensionTab}/${panel}/${formattedName}/MainWindow.xaml`,
          language: 'xml',
          description: 'Giao diện WPF hiện đại.',
          content: xamlContent,
        },
        {
          name: 'script.py',
          path: `${extensionTab}/${panel}/${formattedName}/script.py`,
          language: 'python',
          description: 'Logic Python pyRevit.',
          content: pythonContent,
        },
        {
          name: 'bundle.yaml',
          path: `${extensionTab}/${panel}/${formattedName}/bundle.yaml`,
          language: 'yaml',
          description: 'Cấu hình pyRevit Button.',
          content: `title: "${title}"\ntooltip: "Mô tả công cụ"\nauthor: "${author}"\n`,
        },
      ],
    };

    onCreate(newTool);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-lg bg-[#18181D] border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="h-14 px-6 border-b border-zinc-800 flex items-center justify-between bg-[#141418]">
          <div className="flex items-center gap-2 text-zinc-100 font-semibold">
            <PlusCircle className="w-5 h-5 text-sky-400" />
            <span>Tạo Tool pyRevit Mới</span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleCreate} className="p-6 space-y-4 overflow-y-auto max-h-[80vh]">
          {/* Tool Directory Name & Title */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                Tên Thư Mục (.pushbutton)
              </label>
              <input
                type="text"
                required
                value={toolName}
                onChange={(e) => setToolName(e.target.value)}
                placeholder="AutoSheetRenumber"
                className="w-full h-9 px-3 text-xs bg-zinc-900 border border-zinc-700 rounded-lg text-zinc-200 outline-none focus:border-sky-500 font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                Tiêu Đề Ribbon Button
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Đánh Số\nBản Vẽ"
                className="w-full h-9 px-3 text-xs bg-zinc-900 border border-zinc-700 rounded-lg text-zinc-200 outline-none focus:border-sky-500"
              />
            </div>
          </div>

          {/* Author & Icon */}
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2">
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                Tác Giả (Author)
              </label>
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className="w-full h-9 px-3 text-xs bg-zinc-900 border border-zinc-700 rounded-lg text-zinc-200 outline-none focus:border-sky-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                Biểu Tượng Icon
              </label>
              <input
                type="text"
                value={iconEmoji}
                onChange={(e) => setIconEmoji(e.target.value)}
                className="w-full h-9 px-3 text-center text-base bg-zinc-900 border border-zinc-700 rounded-lg text-zinc-200 outline-none focus:border-sky-500"
              />
            </div>
          </div>

          {/* Category & Panel */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                Chuyên Mục (Category)
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ToolCategory)}
                className="w-full h-9 px-3 text-xs bg-zinc-900 border border-zinc-700 rounded-lg text-zinc-200 outline-none focus:border-sky-500"
              >
                <option value="Personal">Personal (Cá nhân)</option>
                <option value="Documentation">Documentation (Hồ sơ)</option>
                <option value="Modeling">Modeling (Dựng hình)</option>
                <option value="QA_QC">QA_QC (Kiểm tra mô hình)</option>
                <option value="Management">Management (Quản lý)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                Panel pyRevit
              </label>
              <input
                type="text"
                value={panel}
                onChange={(e) => setPanel(e.target.value)}
                placeholder="Sheets.panel"
                className="w-full h-9 px-3 text-xs bg-zinc-900 border border-zinc-700 rounded-lg text-zinc-200 outline-none focus:border-sky-500 font-mono"
              />
            </div>
          </div>

          {/* Template Selection */}
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-2">
              Mẫu Giao Diện WPF XAML Khởi Tạo
            </label>
            <div className="grid grid-cols-2 gap-3">
              <div
                onClick={() => setTemplate('standard')}
                className={`p-3 rounded-xl border cursor-pointer transition-all ${
                  template === 'standard'
                    ? 'bg-sky-500/10 border-sky-500/50 text-white'
                    : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-xs text-zinc-200">WPF Form Cấu Hình</span>
                  {template === 'standard' && <Check className="w-3.5 h-3.5 text-sky-400" />}
                </div>
                <p className="text-[11px] text-zinc-500">Form bo góc hiện đại, TextBox, CheckBox và Button chạy script.</p>
              </div>

              <div
                onClick={() => setTemplate('batch')}
                className={`p-3 rounded-xl border cursor-pointer transition-all ${
                  template === 'batch'
                    ? 'bg-sky-500/10 border-sky-500/50 text-white'
                    : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-xs text-zinc-200">WPF Batch Progress</span>
                  {template === 'batch' && <Check className="w-3.5 h-3.5 text-sky-400" />}
                </div>
                <p className="text-[11px] text-zinc-500">Cửa sổ chạy hàng loạt với ProgressBar và thống kê phần trăm.</p>
              </div>
            </div>
          </div>

          {/* Footer Submit */}
          <div className="pt-3 border-t border-zinc-800 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-xs font-medium text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-sky-500 hover:bg-sky-400 text-white text-xs font-semibold shadow-sm transition-all active:scale-95 flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Khởi Tạo Tool Ngay</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
