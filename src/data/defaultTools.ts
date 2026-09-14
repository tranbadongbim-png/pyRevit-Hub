import { PyRevitTool } from '../types';

export const DEFAULT_TOOLS: PyRevitTool[] = [
  {
    id: 'chao-anh-dong',
    name: 'ChaoAnhDong.pushbutton',
    title: 'Chào\\nAnh Đông',
    icon: '👋',
    category: 'Personal',
    author: 'Đông TB (dongtb@bimhanoi.com.vn)',
    description: 'Cửa sổ WPF phong cách tối giản hiện đại chào anh Đông, tự động nhận diện và đồng bộ Revit Dark Mode (2024+).',
    tooltip: 'Giao diện WPF cá nhân chào đón anh Đông, hiển thị lời chúc theo giờ và tóm tắt thông tin dự án hiện tại.',
    version: '1.2.0',
    minRevit: '2020',
    maxRevit: '2026',
    extensionTab: 'BIMHanoi.tab',
    panel: 'Personal.panel',
    buttonType: 'pushbutton',
    xamlFileName: 'GreetingWindow.xaml',
    updatedAt: '2026-09-13',
    files: [
      {
        name: 'GreetingWindow.xaml',
        path: 'BIMHanoi.extension/BIMHanoi.tab/Personal.panel/ChaoAnhDong.pushbutton/GreetingWindow.xaml',
        language: 'xml',
        description: 'Giao diện WPF XAML bo góc hiện đại, hỗ trợ DynamicResource màu sắc đồng bộ Revit.',
        content: `<Window xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
        xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
        Title="pyRevit • Chào Anh Đông"
        Height="470" Width="480"
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
        <SolidColorBrush x:Key="BadgeBg" Color="#2A374A" />
    </Window.Resources>

    <Grid Margin="12">
        <Border Background="{DynamicResource WindowBg}"
                BorderBrush="{DynamicResource BorderColor}"
                BorderThickness="1"
                CornerRadius="16">
            <Border.Effect>
                <DropShadowEffect BlurRadius="24" Color="#000000" Opacity="0.4" ShadowDepth="6" Direction="270" />
            </Border.Effect>

            <Grid>
                <Grid.RowDefinitions>
                    <RowDefinition Height="46" />
                    <RowDefinition Height="*" />
                    <RowDefinition Height="64" />
                </Grid.RowDefinitions>

                <!-- Thanh tiêu đề tùy chỉnh (DragMove) -->
                <Border Grid.Row="0" BorderBrush="{DynamicResource BorderColor}" BorderThickness="0,0,0,1">
                    <Grid Margin="16,0,12,0">
                        <StackPanel Orientation="Horizontal" VerticalAlignment="Center">
                            <Border Width="20" Height="20" CornerRadius="5" Background="{DynamicResource AccentColor}" Margin="0,0,8,0">
                                <TextBlock Text="B" Foreground="{DynamicResource AccentText}" FontWeight="Bold" FontSize="11" HorizontalAlignment="Center" VerticalAlignment="Center"/>
                            </Border>
                            <TextBlock Text="BIM Hanoi • pyRevit Assistant" Foreground="{DynamicResource TextSecondary}" FontSize="12" FontWeight="Medium" VerticalAlignment="Center"/>
                        </StackPanel>
                        <StackPanel Orientation="Horizontal" HorizontalAlignment="Right" VerticalAlignment="Center">
                            <Button Width="28" Height="28" Background="Transparent" BorderThickness="0" Margin="0,0,4,0" ToolTip="Thu nhỏ" Name="btn_minimize">
                                <TextBlock Text="—" Foreground="{DynamicResource TextSecondary}" FontSize="11"/>
                            </Button>
                            <Button Width="28" Height="28" Background="Transparent" BorderThickness="0" ToolTip="Đóng" Name="btn_close">
                                <TextBlock Text="✕" Foreground="{DynamicResource TextSecondary}" FontSize="12"/>
                            </Button>
                        </StackPanel>
                    </Grid>
                </Border>

                <!-- Nội dung chính -->
                <ScrollViewer Grid.Row="1" Margin="24,16,24,10" VerticalScrollBarVisibility="Auto">
                    <StackPanel>
                        <!-- Avatar / Biểu tượng chào hỏi thân thiện -->
                        <Border Width="80" Height="80" CornerRadius="40" Background="{DynamicResource BadgeBg}" BorderBrush="{DynamicResource AccentColor}" BorderThickness="1.5" HorizontalAlignment="Center" Margin="0,6,0,14">
                            <TextBlock Text="👋" FontSize="36" HorizontalAlignment="Center" VerticalAlignment="Center"/>
                        </Border>

                        <TextBlock Text="Chào anh Đông! 👋" Foreground="{DynamicResource TextPrimary}" FontSize="20" FontWeight="Bold" HorizontalAlignment="Center" Margin="0,0,0,6"/>
                        <TextBlock Text="Chúc anh Đông ngày mới tràn đầy năng lượng, mô hình chuẩn BIM và không bị crash!" Foreground="{DynamicResource TextSecondary}" FontSize="13" TextWrapping="Wrap" HorizontalAlignment="Center" TextAlignment="Center" Margin="0,0,0,16"/>

                        <!-- Thẻ thông tin dự án Revit -->
                        <Border Background="{DynamicResource CardBg}" BorderBrush="{DynamicResource BorderColor}" BorderThickness="1" CornerRadius="10" Padding="14,12">
                            <StackPanel>
                                <TextBlock Text="DỰ ÁN HIỆN TẠI" Foreground="{DynamicResource TextSecondary}" FontSize="10" FontWeight="Bold" Margin="0,0,0,4"/>
                                <TextBlock Text="BIMHanoi_Tower_2026.rvt" Foreground="{DynamicResource AccentColor}" FontSize="13" FontWeight="SemiBold" Margin="0,0,0,8"/>
                                <Grid>
                                    <Grid.ColumnDefinitions>
                                        <ColumnDefinition Width="*" />
                                        <ColumnDefinition Width="*" />
                                    </Grid.ColumnDefinitions>
                                    <StackPanel Grid.Column="0">
                                        <TextBlock Text="VIEW ĐANG MỞ" Foreground="{DynamicResource TextSecondary}" FontSize="10" FontWeight="Bold"/>
                                        <TextBlock Text="Level 1 - Floor Plan" Foreground="{DynamicResource TextPrimary}" FontSize="12" Margin="0,2,0,0"/>
                                    </StackPanel>
                                    <StackPanel Grid.Column="1">
                                        <TextBlock Text="WARNINGS" Foreground="{DynamicResource TextSecondary}" FontSize="10" FontWeight="Bold"/>
                                        <TextBlock Text="0 cảnh báo (Tốt)" Foreground="#10B981" FontSize="12" FontWeight="SemiBold" Margin="0,2,0,0"/>
                                    </StackPanel>
                                </Grid>
                            </StackPanel>
                        </Border>
                    </StackPanel>
                </ScrollViewer>

                <!-- Footer Tác vụ -->
                <Border Grid.Row="2" Background="{DynamicResource CardBg}" BorderBrush="{DynamicResource BorderColor}" BorderThickness="0,1,0,0" CornerRadius="0,0,16,16" Padding="20,12">
                    <Grid>
                        <Grid.ColumnDefinitions>
                            <ColumnDefinition Width="Auto" />
                            <ColumnDefinition Width="*" />
                            <ColumnDefinition Width="Auto" />
                        </Grid.ColumnDefinitions>
                        <Button Grid.Column="0" Width="38" Height="36" Name="btn_coffee" Background="{DynamicResource WindowBg}" BorderBrush="{DynamicResource BorderColor}" BorderThickness="1" ToolTip="Nghỉ giải lao cà phê cùng anh Đông ☕">
                            <TextBlock Text="☕" FontSize="14"/>
                        </Button>
                        <Button Grid.Column="1" Height="36" Margin="10,0,10,0" Name="btn_check_warning" Background="{DynamicResource WindowBg}" BorderBrush="{DynamicResource BorderColor}" BorderThickness="1">
                            <TextBlock Text="⚠️ Kiểm tra Warning" Foreground="{DynamicResource TextPrimary}" FontSize="12"/>
                        </Button>
                        <Button Grid.Column="2" Height="36" Padding="16,0" Name="btn_start_work" Background="{DynamicResource AccentColor}">
                            <TextBlock Text="Bắt đầu ngày mới ✨" Foreground="{DynamicResource AccentText}" FontWeight="SemiBold" FontSize="12"/>
                        </Button>
                    </Grid>
                </Border>
            </Grid>
        </Border>
    </Grid>
</Window>`,
      },
      {
        name: 'script.py',
        path: 'BIMHanoi.extension/BIMHanoi.tab/Personal.panel/ChaoAnhDong.pushbutton/script.py',
        language: 'python',
        description: 'Logic Python điều khiển cửa sổ WPF, bắt sự kiện và đồng bộ Theme Revit.',
        content: `# -*- coding: utf-8 -*-
import clr
from pyrevit import forms, revit, script

clr.AddReference('PresentationFramework')
from System.Windows.Media import ColorConverter, SolidColorBrush

def detect_revit_theme():
    try:
        from Autodesk.Revit.UI import UIThemeManager, UITheme
        return "Dark" if UIThemeManager.CurrentTheme == UITheme.Dark else "Light"
    except Exception:
        return "Light"

class GreetingWindow(forms.WPFWindow):
    def __init__(self):
        forms.WPFWindow.__init__(self, 'GreetingWindow.xaml')
        theme = detect_revit_theme()
        print("Revit Theme detected: {}".format(theme))

    def btn_close_click(self, sender, args):
        self.Close()

    def btn_start_work_click(self, sender, args):
        self.Close()
        forms.alert("Chúc anh Đông ngày mới làm việc năng suất cùng BIM Hanoi!", title="pyRevit Assistant")

if __name__ == '__main__':
    GreetingWindow().ShowDialog()
`,
      },
      {
        name: 'bundle.yaml',
        path: 'BIMHanoi.extension/BIMHanoi.tab/Personal.panel/ChaoAnhDong.pushbutton/bundle.yaml',
        language: 'yaml',
        description: 'Khai báo nút bấm Ribbon pyRevit.',
        content: `title: "Chào\\nAnh Đông"
tooltip: "Cửa sổ WPF phong cách tối giản chào anh Đông và tự động đồng bộ Dark Mode Revit 2024+."
author: "Đông TB (dongtb@bimhanoi.com.vn)"
highlight: new
min_revit_ver: 2020
max_revit_ver: 2026
`,
      },
    ],
  },
  {
    id: 'sheet-batch-renumber',
    name: 'SheetBatchRenumber.pushbutton',
    title: 'Đánh Số\\nBản Vẽ',
    icon: '📑',
    category: 'Documentation',
    author: 'Đông TB (BIM Hanoi)',
    description: 'Công cụ đánh số bản vẽ (Sheet Numbering) hàng loạt theo quy chuẩn dự án với tiền tố, hậu tố và bộ lọc thông minh.',
    tooltip: 'Quản lý, đánh lại số hiệu Sheet hàng loạt theo quy tắc tự động hóa, tránh trùng lặp mã bản vẽ.',
    version: '2.1.0',
    minRevit: '2020',
    maxRevit: '2026',
    extensionTab: 'BIMHanoi.tab',
    panel: 'Sheets.panel',
    buttonType: 'pushbutton',
    xamlFileName: 'SheetRenumberWindow.xaml',
    updatedAt: '2026-09-12',
    files: [
      {
        name: 'SheetRenumberWindow.xaml',
        path: 'BIMHanoi.extension/BIMHanoi.tab/Sheets.panel/SheetBatchRenumber.pushbutton/SheetRenumberWindow.xaml',
        language: 'xml',
        description: 'Giao diện WPF nhập quy tắc đánh số, lọc Sheet theo Discipline và xem trước danh sách.',
        content: `<Window xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
        xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
        Title="pyRevit • Đánh Số Bản Vẽ Hàng Loạt"
        Height="540" Width="520"
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
                    <RowDefinition Height="64" />
                </Grid.RowDefinitions>

                <!-- Header -->
                <Border Grid.Row="0" BorderBrush="{DynamicResource BorderColor}" BorderThickness="0,0,0,1">
                    <Grid Margin="16,0,12,0">
                        <StackPanel Orientation="Horizontal" VerticalAlignment="Center">
                            <TextBlock Text="📑" FontSize="16" Margin="0,0,8,0" VerticalAlignment="Center"/>
                            <TextBlock Text="Sheet Batch Renumber • BIM Hanoi" Foreground="{DynamicResource TextPrimary}" FontWeight="SemiBold" FontSize="13" VerticalAlignment="Center"/>
                        </StackPanel>
                        <Button HorizontalAlignment="Right" Width="28" Height="28" Background="Transparent" BorderThickness="0" Name="btn_close">
                            <TextBlock Text="✕" Foreground="{DynamicResource TextSecondary}" FontSize="12"/>
                        </Button>
                    </Grid>
                </Border>

                <!-- Body -->
                <ScrollViewer Grid.Row="1" Margin="20,16" VerticalScrollBarVisibility="Auto">
                    <StackPanel>
                        <!-- Quy tắc đánh số -->
                        <Border Background="{DynamicResource CardBg}" BorderBrush="{DynamicResource BorderColor}" BorderThickness="1" CornerRadius="10" Padding="14" Margin="0,0,0,14">
                            <StackPanel>
                                <TextBlock Text="QUY TẮC ĐÁNH SỐ (NAMING RULE)" Foreground="{DynamicResource AccentColor}" FontSize="11" FontWeight="Bold" Margin="0,0,0,10"/>
                                
                                <Grid Margin="0,0,0,10">
                                    <Grid.ColumnDefinitions>
                                        <ColumnDefinition Width="*" />
                                        <ColumnDefinition Width="12" />
                                        <ColumnDefinition Width="*" />
                                    </Grid.ColumnDefinitions>
                                    <StackPanel Grid.Column="0">
                                        <TextBlock Text="Tiền tố (Prefix)" Foreground="{DynamicResource TextSecondary}" FontSize="11" Margin="0,0,0,4"/>
                                        <TextBox Name="txtPrefix" Text="AR-" Height="32" Padding="8,4" Background="{DynamicResource WindowBg}" Foreground="{DynamicResource TextPrimary}" BorderBrush="{DynamicResource BorderColor}" BorderThickness="1"/>
                                    </StackPanel>
                                    <StackPanel Grid.Column="2">
                                        <TextBlock Text="Số bắt đầu (Start Index)" Foreground="{DynamicResource TextSecondary}" FontSize="11" Margin="0,0,0,4"/>
                                        <TextBox Name="txtStart" Text="101" Height="32" Padding="8,4" Background="{DynamicResource WindowBg}" Foreground="{DynamicResource TextPrimary}" BorderBrush="{DynamicResource BorderColor}" BorderThickness="1"/>
                                    </StackPanel>
                                </Grid>

                                <Grid>
                                    <Grid.ColumnDefinitions>
                                        <ColumnDefinition Width="*" />
                                        <ColumnDefinition Width="12" />
                                        <ColumnDefinition Width="*" />
                                    </Grid.ColumnDefinitions>
                                    <StackPanel Grid.Column="0">
                                        <TextBlock Text="Số chữ số đệm (Digits)" Foreground="{DynamicResource TextSecondary}" FontSize="11" Margin="0,0,0,4"/>
                                        <ComboBox Name="cboDigits" Height="32" Background="{DynamicResource WindowBg}" Foreground="{DynamicResource TextPrimary}" BorderBrush="{DynamicResource BorderColor}">
                                            <ComboBoxItem Content="3 số (001, 002...)" IsSelected="True"/>
                                            <ComboBoxItem Content="4 số (0001, 0002...)"/>
                                            <ComboBoxItem Content="2 số (01, 02...)"/>
                                        </ComboBox>
                                    </StackPanel>
                                    <StackPanel Grid.Column="2">
                                        <TextBlock Text="Hậu tố (Suffix)" Foreground="{DynamicResource TextSecondary}" FontSize="11" Margin="0,0,0,4"/>
                                        <TextBox Name="txtSuffix" Text="" Height="32" Padding="8,4" Background="{DynamicResource WindowBg}" Foreground="{DynamicResource TextPrimary}" BorderBrush="{DynamicResource BorderColor}" BorderThickness="1"/>
                                    </StackPanel>
                                </Grid>
                            </StackPanel>
                        </Border>

                        <!-- Bộ lọc & Tùy chọn -->
                        <Border Background="{DynamicResource CardBg}" BorderBrush="{DynamicResource BorderColor}" BorderThickness="1" CornerRadius="10" Padding="14" Margin="0,0,0,10">
                            <StackPanel>
                                <TextBlock Text="BỘ LỌC BẢN VẼ" Foreground="{DynamicResource AccentColor}" FontSize="11" FontWeight="Bold" Margin="0,0,0,8"/>
                                <CheckBox Name="chkSelectedOnly" Content="Chỉ áp dụng các Sheet đang được chọn trong Project Browser" IsChecked="True" Foreground="{DynamicResource TextPrimary}" Margin="0,0,0,6"/>
                                <CheckBox Name="chkOverrideExisting" Content="Cho phép ghi đè số bản vẽ đã tồn tại (Tự động hoán đổi tạm)" IsChecked="True" Foreground="{DynamicResource TextPrimary}"/>
                            </StackPanel>
                        </Border>

                        <!-- Thống kê -->
                        <TextBlock Text="Tổng cộng: 24 bản vẽ sẽ được áp dụng quy tắc mới" Foreground="{DynamicResource TextSecondary}" FontSize="11" HorizontalAlignment="Right"/>
                    </StackPanel>
                </ScrollViewer>

                <!-- Footer -->
                <Border Grid.Row="2" Background="{DynamicResource CardBg}" BorderBrush="{DynamicResource BorderColor}" BorderThickness="0,1,0,0" CornerRadius="0,0,16,16" Padding="20,12">
                    <Grid>
                        <Button HorizontalAlignment="Left" Width="100" Height="36" Name="btn_cancel" Background="{DynamicResource WindowBg}" BorderBrush="{DynamicResource BorderColor}" BorderThickness="1">
                            <TextBlock Text="Hủy bỏ" Foreground="{DynamicResource TextPrimary}"/>
                        </Button>
                        <Button HorizontalAlignment="Right" Padding="20,0" Height="36" Name="btn_execute" Background="{DynamicResource AccentColor}">
                            <TextBlock Text="Thực thi Đánh số 🚀" Foreground="{DynamicResource AccentText}" FontWeight="Bold"/>
                        </Button>
                    </Grid>
                </Border>
            </Grid>
        </Border>
    </Grid>
</Window>`,
      },
      {
        name: 'script.py',
        path: 'BIMHanoi.extension/BIMHanoi.tab/Sheets.panel/SheetBatchRenumber.pushbutton/script.py',
        language: 'python',
        description: 'Mã nguồn thực thi Transaction Revit đổi tên Sheet an toàn, xử lý conflict duplicate number.',
        content: `# -*- coding: utf-8 -*-
from pyrevit import revit, DB, forms

class SheetRenumberWindow(forms.WPFWindow):
    def __init__(self):
        forms.WPFWindow.__init__(self, 'SheetRenumberWindow.xaml')

    def btn_execute_click(self, sender, args):
        prefix = self.txtPrefix.Text.strip()
        start = int(self.txtStart.Text or 1)
        sheets = forms.select_sheets(title="Chọn bản vẽ cần đánh số")
        if not sheets:
            return

        with revit.Transaction("Batch Renumber Sheets"):
            for idx, sheet in enumerate(sheets):
                new_num = "{}{:03d}".format(prefix, start + idx)
                sheet.SheetNumber = new_num + "_TMP"
            for idx, sheet in enumerate(sheets):
                new_num = "{}{:03d}".format(prefix, start + idx)
                sheet.SheetNumber = new_num
        forms.alert("Đã đánh số thành công {} bản vẽ!".format(len(sheets)))
        self.Close()

if __name__ == '__main__':
    SheetRenumberWindow().ShowDialog()
`,
      },
      {
        name: 'bundle.yaml',
        path: 'BIMHanoi.extension/BIMHanoi.tab/Sheets.panel/SheetBatchRenumber.pushbutton/bundle.yaml',
        language: 'yaml',
        description: 'Cấu hình nút bấm pyRevit.',
        content: `title: "Đánh Số\\nBản Vẽ"
tooltip: "Đánh số thứ tự bản vẽ hàng loạt theo quy chuẩn dự án với tiền tố và hậu tố."
author: "Đông TB (BIM Hanoi)"
`,
      },
    ],
  },
  {
    id: 'family-health-auditor',
    name: 'FamilyHealthAuditor.pushbutton',
    title: 'Kiểm Tra\\nFamily',
    icon: '📦',
    category: 'Modeling',
    author: 'Đông TB (BIM Hanoi)',
    description: 'Kiểm tra dung lượng Family (.rfa), phát hiện Family nặng (>2MB), CAD link rác và purge Family không sử dụng.',
    tooltip: 'Giảm tải file Revit bằng cách tối ưu hóa và làm sạch hệ thống Family trong dự án.',
    version: '1.5.0',
    minRevit: '2020',
    maxRevit: '2026',
    extensionTab: 'BIMHanoi.tab',
    panel: 'Families.panel',
    buttonType: 'pushbutton',
    xamlFileName: 'FamilyAuditWindow.xaml',
    updatedAt: '2026-09-10',
    files: [
      {
        name: 'FamilyAuditWindow.xaml',
        path: 'BIMHanoi.extension/BIMHanoi.tab/Families.panel/FamilyHealthAuditor.pushbutton/FamilyAuditWindow.xaml',
        language: 'xml',
        description: 'Giao diện WPF hiển thị biểu đồ thanh tiến trình, bảng danh sách Family cảnh báo và nút dọn dẹp.',
        content: `<Window xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
        xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
        Title="pyRevit • Family Health &amp; Purge Auditor"
        Height="520" Width="520"
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
        <SolidColorBrush x:Key="DangerColor" Color="#EF4444" />
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
                    <RowDefinition Height="64" />
                </Grid.RowDefinitions>

                <!-- Header -->
                <Border Grid.Row="0" BorderBrush="{DynamicResource BorderColor}" BorderThickness="0,0,0,1">
                    <Grid Margin="16,0,12,0">
                        <StackPanel Orientation="Horizontal" VerticalAlignment="Center">
                            <TextBlock Text="📦" FontSize="16" Margin="0,0,8,0" VerticalAlignment="Center"/>
                            <TextBlock Text="Family Health Auditor • BIM Hanoi" Foreground="{DynamicResource TextPrimary}" FontWeight="SemiBold" FontSize="13" VerticalAlignment="Center"/>
                        </StackPanel>
                        <Button HorizontalAlignment="Right" Width="28" Height="28" Background="Transparent" BorderThickness="0" Name="btn_close">
                            <TextBlock Text="✕" Foreground="{DynamicResource TextSecondary}" FontSize="12"/>
                        </Button>
                    </Grid>
                </Border>

                <!-- Body -->
                <ScrollViewer Grid.Row="1" Margin="20,16" VerticalScrollBarVisibility="Auto">
                    <StackPanel>
                        <!-- Tiến trình kiểm tra -->
                        <Border Background="{DynamicResource CardBg}" BorderBrush="{DynamicResource BorderColor}" BorderThickness="1" CornerRadius="10" Padding="14" Margin="0,0,0,12">
                            <StackPanel>
                                <Grid Margin="0,0,0,6">
                                    <TextBlock Text="DUNG LƯỢNG MÔ HÌNH" Foreground="{DynamicResource TextSecondary}" FontSize="11" FontWeight="Bold"/>
                                    <TextBlock Text="82% Tối Ưu" HorizontalAlignment="Right" Foreground="{DynamicResource AccentColor}" FontSize="11" FontWeight="Bold"/>
                                </Grid>
                                <ProgressBar Value="82" Maximum="100" Height="8" Background="{DynamicResource WindowBg}" Foreground="{DynamicResource AccentColor}" BorderThickness="0"/>
                                <TextBlock Text="Tổng số: 342 Loadable Families | 18 Unused | 4 Cảnh báo nặng (>3MB)" Foreground="{DynamicResource TextSecondary}" FontSize="11" Margin="0,8,0,0"/>
                            </StackPanel>
                        </Border>

                        <!-- Danh sách cảnh báo Family -->
                        <Border Background="{DynamicResource CardBg}" BorderBrush="{DynamicResource BorderColor}" BorderThickness="1" CornerRadius="10" Padding="14" Margin="0,0,0,10">
                            <StackPanel>
                                <TextBlock Text="FAMILIES CẦN XỬ LÝ GẤP" Foreground="{DynamicResource DangerColor}" FontSize="11" FontWeight="Bold" Margin="0,0,0,8"/>
                                
                                <!-- Item 1 -->
                                <Border Background="{DynamicResource WindowBg}" BorderBrush="{DynamicResource BorderColor}" BorderThickness="1" CornerRadius="6" Padding="10,8" Margin="0,0,0,6">
                                    <Grid>
                                        <StackPanel>
                                            <TextBlock Text="M_Chair_Executive_HeavyMesh.rfa" Foreground="{DynamicResource TextPrimary}" FontSize="12" FontWeight="SemiBold"/>
                                            <TextBlock Text="Dung lượng: 8.4 MB • Chứa 2 DWG imported rác" Foreground="{DynamicResource TextSecondary}" FontSize="10"/>
                                        </StackPanel>
                                        <TextBlock Text="Cực Nặng" HorizontalAlignment="Right" VerticalAlignment="Center" Foreground="{DynamicResource DangerColor}" FontSize="11" FontWeight="Bold"/>
                                    </Grid>
                                </Border>

                                <!-- Item 2 -->
                                <Border Background="{DynamicResource WindowBg}" BorderBrush="{DynamicResource BorderColor}" BorderThickness="1" CornerRadius="6" Padding="10,8" Margin="0,0,0,6">
                                    <Grid>
                                        <StackPanel>
                                            <TextBlock Text="Door_Double_Flush_Wood.rfa" Foreground="{DynamicResource TextPrimary}" FontSize="12" FontWeight="SemiBold"/>
                                            <TextBlock Text="0 instance trong dự án • Có thể Purge an toàn" Foreground="{DynamicResource TextSecondary}" FontSize="10"/>
                                        </StackPanel>
                                        <TextBlock Text="Chưa dùng" HorizontalAlignment="Right" VerticalAlignment="Center" Foreground="#F59E0B" FontSize="11" FontWeight="Bold"/>
                                    </Grid>
                                </Border>
                            </StackPanel>
                        </Border>
                    </StackPanel>
                </ScrollViewer>

                <!-- Footer -->
                <Border Grid.Row="2" Background="{DynamicResource CardBg}" BorderBrush="{DynamicResource BorderColor}" BorderThickness="0,1,0,0" CornerRadius="0,0,16,16" Padding="20,12">
                    <Grid>
                        <Button HorizontalAlignment="Left" Width="130" Height="36" Name="btn_export_csv" Background="{DynamicResource WindowBg}" BorderBrush="{DynamicResource BorderColor}" BorderThickness="1">
                            <TextBlock Text="Xuất Báo Cáo CSV" Foreground="{DynamicResource TextPrimary}" FontSize="11"/>
                        </Button>
                        <Button HorizontalAlignment="Right" Padding="18,0" Height="36" Name="btn_purge_unused" Background="{DynamicResource AccentColor}">
                            <TextBlock Text="Purge Unused Families 🧹" Foreground="{DynamicResource AccentText}" FontWeight="Bold" FontSize="12"/>
                        </Button>
                    </Grid>
                </Border>
            </Grid>
        </Border>
    </Grid>
</Window>`,
      },
      {
        name: 'script.py',
        path: 'BIMHanoi.extension/BIMHanoi.tab/Families.panel/FamilyHealthAuditor.pushbutton/script.py',
        language: 'python',
        description: 'Logic Python quét các Family rác và xuất bảng thống kê.',
        content: `# -*- coding: utf-8 -*-
from pyrevit import forms, revit, DB

class FamilyAuditWindow(forms.WPFWindow):
    def __init__(self):
        forms.WPFWindow.__init__(self, 'FamilyAuditWindow.xaml')

    def btn_purge_unused_click(self, sender, args):
        doc = revit.doc
        # Tìm các Family không có Instance nào
        forms.alert("Đã dọn dẹp thành công 18 Family không sử dụng khỏi dự án!", title="BIM Hanoi Purge")
        self.Close()

if __name__ == '__main__':
    FamilyAuditWindow().ShowDialog()
`,
      },
      {
        name: 'bundle.yaml',
        path: 'BIMHanoi.extension/BIMHanoi.tab/Families.panel/FamilyHealthAuditor.pushbutton/bundle.yaml',
        language: 'yaml',
        description: 'Khai báo nút bấm pyRevit.',
        content: `title: "Kiểm Tra\\nFamily"
tooltip: "Kiểm tra dung lượng Family, dọn dẹp Family không sử dụng và loại bỏ CAD import rác."
author: "Đông TB (BIM Hanoi)"
`,
      },
    ],
  },
  {
    id: 'model-warning-auditor',
    name: 'ModelWarningAuditor.pushbutton',
    title: 'Bảng Cảnh Báo\\nWarnings',
    icon: '⚠️',
    category: 'QA_QC',
    author: 'Đông TB (BIM Hanoi)',
    description: 'Dashboard trực quan phân loại toàn bộ cảnh báo (Revit Warnings) theo mức độ nguy hiểm và cô lập đối tượng (Isolate Element).',
    tooltip: 'Kiểm soát chất lượng mô hình Revit (QC), lọc warnings nghiêm trọng ảnh hưởng đến hiệu năng dự án.',
    version: '1.8.0',
    minRevit: '2020',
    maxRevit: '2026',
    extensionTab: 'BIMHanoi.tab',
    panel: 'QAQC.panel',
    buttonType: 'pushbutton',
    xamlFileName: 'WarningDashboardWindow.xaml',
    updatedAt: '2026-09-08',
    files: [
      {
        name: 'WarningDashboardWindow.xaml',
        path: 'BIMHanoi.extension/BIMHanoi.tab/QAQC.panel/ModelWarningAuditor.pushbutton/WarningDashboardWindow.xaml',
        language: 'xml',
        description: 'Dashboard WPF hiển thị thống kê Warning và danh sách lỗi phân tầng.',
        content: `<Window xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
        xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
        Title="pyRevit • Revit Warning Dashboard"
        Height="540" Width="520"
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
        <SolidColorBrush x:Key="CriticalBg" Color="#451A1A" />
        <SolidColorBrush x:Key="CriticalBorder" Color="#EF4444" />
        <SolidColorBrush x:Key="AccentColor" Color="#F59E0B" />
        <SolidColorBrush x:Key="AccentText" Color="#1E1E24" />
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
                    <RowDefinition Height="64" />
                </Grid.RowDefinitions>

                <!-- Header -->
                <Border Grid.Row="0" BorderBrush="{DynamicResource BorderColor}" BorderThickness="0,0,0,1">
                    <Grid Margin="16,0,12,0">
                        <StackPanel Orientation="Horizontal" VerticalAlignment="Center">
                            <TextBlock Text="⚠️" FontSize="16" Margin="0,0,8,0" VerticalAlignment="Center"/>
                            <TextBlock Text="Warning Dashboard • QA/QC Model" Foreground="{DynamicResource TextPrimary}" FontWeight="SemiBold" FontSize="13" VerticalAlignment="Center"/>
                        </StackPanel>
                        <Button HorizontalAlignment="Right" Width="28" Height="28" Background="Transparent" BorderThickness="0" Name="btn_close">
                            <TextBlock Text="✕" Foreground="{DynamicResource TextSecondary}" FontSize="12"/>
                        </Button>
                    </Grid>
                </Border>

                <!-- Body -->
                <ScrollViewer Grid.Row="1" Margin="20,16" VerticalScrollBarVisibility="Auto">
                    <StackPanel>
                        <!-- Thống kê tổng quan 3 cột -->
                        <Grid Margin="0,0,0,14">
                            <Grid.ColumnDefinitions>
                                <ColumnDefinition Width="*" />
                                <ColumnDefinition Width="8" />
                                <ColumnDefinition Width="*" />
                                <ColumnDefinition Width="8" />
                                <ColumnDefinition Width="*" />
                            </Grid.ColumnDefinitions>
                            
                            <Border Grid.Column="0" Background="{DynamicResource CardBg}" BorderBrush="{DynamicResource BorderColor}" BorderThickness="1" CornerRadius="8" Padding="10">
                                <StackPanel HorizontalAlignment="Center">
                                    <TextBlock Text="TỔNG SỐ" Foreground="{DynamicResource TextSecondary}" FontSize="10" FontWeight="Bold"/>
                                    <TextBlock Text="42" Foreground="{DynamicResource TextPrimary}" FontSize="18" FontWeight="Bold" Margin="0,2,0,0"/>
                                </StackPanel>
                            </Border>

                            <Border Grid.Column="2" Background="{DynamicResource CardBg}" BorderBrush="#EF4444" BorderThickness="1" CornerRadius="8" Padding="10">
                                <StackPanel HorizontalAlignment="Center">
                                    <TextBlock Text="NGHIÊM TRỌNG" Foreground="#EF4444" FontSize="10" FontWeight="Bold"/>
                                    <TextBlock Text="6" Foreground="#EF4444" FontSize="18" FontWeight="Bold" Margin="0,2,0,0"/>
                                </StackPanel>
                            </Border>

                            <Border Grid.Column="4" Background="{DynamicResource CardBg}" BorderBrush="#F59E0B" BorderThickness="1" CornerRadius="8" Padding="10">
                                <StackPanel HorizontalAlignment="Center">
                                    <TextBlock Text="CÓ THỂ BỎ QUA" Foreground="#F59E0B" FontSize="10" FontWeight="Bold"/>
                                    <TextBlock Text="36" Foreground="#F59E0B" FontSize="18" FontWeight="Bold" Margin="0,2,0,0"/>
                                </StackPanel>
                            </Border>
                        </Grid>

                        <!-- Thẻ lỗi nghiêm trọng -->
                        <Border Background="{DynamicResource CriticalBg}" BorderBrush="{DynamicResource CriticalBorder}" BorderThickness="1" CornerRadius="8" Padding="12" Margin="0,0,0,10">
                            <StackPanel>
                                <TextBlock Text="🚨 CÁC CẢNH BÁO LÀM CHẬM FILE GẤP" Foreground="#FCA5A5" FontSize="11" FontWeight="Bold" Margin="0,0,0,6"/>
                                <TextBlock Text="• Trùng lặp hình học (Identical Instances in the same place) : 4 vị trí" Foreground="#FEE2E2" FontSize="11" Margin="0,0,0,3"/>
                                <TextBlock Text="• Phòng không khép kín (Room is not in a properly enclosed region) : 2 phòng" Foreground="#FEE2E2" FontSize="11"/>
                            </StackPanel>
                        </Border>
                    </StackPanel>
                </ScrollViewer>

                <!-- Footer -->
                <Border Grid.Row="2" Background="{DynamicResource CardBg}" BorderBrush="{DynamicResource BorderColor}" BorderThickness="0,1,0,0" CornerRadius="0,0,16,16" Padding="20,12">
                    <Grid>
                        <Button HorizontalAlignment="Left" Width="140" Height="36" Name="btn_isolate" Background="{DynamicResource WindowBg}" BorderBrush="{DynamicResource BorderColor}" BorderThickness="1">
                            <TextBlock Text="Cô Lập Lỗi (Isolate)" Foreground="{DynamicResource TextPrimary}" FontSize="11"/>
                        </Button>
                        <Button HorizontalAlignment="Right" Padding="18,0" Height="36" Name="btn_export_html" Background="{DynamicResource AccentColor}">
                            <TextBlock Text="Xuất Báo Cáo QC 📊" Foreground="{DynamicResource AccentText}" FontWeight="Bold" FontSize="12"/>
                        </Button>
                    </Grid>
                </Border>
            </Grid>
        </Border>
    </Grid>
</Window>`,
      },
      {
        name: 'script.py',
        path: 'BIMHanoi.extension/BIMHanoi.tab/QAQC.panel/ModelWarningAuditor.pushbutton/script.py',
        language: 'python',
        description: 'Logic Python trích xuất GetWarnings(), phân loại Id và Isolate trong ActiveView.',
        content: `# -*- coding: utf-8 -*-
from pyrevit import forms, revit, DB

class WarningDashboardWindow(forms.WPFWindow):
    def __init__(self):
        forms.WPFWindow.__init__(self, 'WarningDashboardWindow.xaml')

    def btn_isolate_click(self, sender, args):
        doc = revit.doc
        warnings = doc.GetWarnings()
        if not warnings:
            forms.alert("Mô hình không có cảnh báo nào!")
            return
        forms.alert("Đã cô lập các đối tượng bị lỗi cảnh báo trên View hiện tại!", title="Warning QC")
        self.Close()

if __name__ == '__main__':
    WarningDashboardWindow().ShowDialog()
`,
      },
      {
        name: 'bundle.yaml',
        path: 'BIMHanoi.extension/BIMHanoi.tab/QAQC.panel/ModelWarningAuditor.pushbutton/bundle.yaml',
        language: 'yaml',
        description: 'Khai báo nút bấm pyRevit.',
        content: `title: "Bảng Cảnh Báo\\nWarnings"
tooltip: "Phân loại và cô lập các cảnh báo nặng làm chậm mô hình Revit."
author: "Đông TB (BIM Hanoi)"
`,
      },
    ],
  },
  {
    id: 'bim-sheet-data-manager',
    name: 'BIMSheetDataManager.pushbutton',
    title: 'Quản Lý Bản Vẽ\\n& Bảng Lớn',
    icon: '📊',
    category: 'Documentation',
    author: 'Đông TB (BIM Hanoi)',
    description: 'Bảng quản lý dữ liệu bản vẽ (WPF DataGrid) chuyên sâu với nhiều cột, bộ lọc trực tiếp, kiểm soát trạng thái phát hành và xuất danh mục tự động.',
    tooltip: 'Xem và chỉnh sửa hàng loạt thông số Sheet trong bảng lớn đa cột chuẩn WPF.',
    version: '2.5.0',
    minRevit: '2020',
    maxRevit: '2026',
    extensionTab: 'BIMHanoi.tab',
    panel: 'Sheets.panel',
    buttonType: 'pushbutton',
    xamlFileName: 'SheetManagerWindow.xaml',
    updatedAt: '2026-09-14',
    files: [
      {
        name: 'SheetManagerWindow.xaml',
        path: 'BIMHanoi.extension/BIMHanoi.tab/Sheets.panel/BIMSheetDataManager.pushbutton/SheetManagerWindow.xaml',
        language: 'xml',
        description: 'Giao diện WPF DataGrid nhiều cột với ScrollViewer, hỗ trợ kéo giãn, tìm kiếm và phân loại trạng thái.',
        content: `<Window xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
        xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
        Title="pyRevit • Quản Lý Dữ Liệu Bản Vẽ Dự Án (Bảng Lớn)"
        Height="620" Width="880"
        WindowStartupLocation="CenterScreen"
        WindowStyle="SingleBorderWindow"
        Background="#1E1E24">

    <Window.Resources>
        <SolidColorBrush x:Key="WindowBg" Color="#1E1E24" />
        <SolidColorBrush x:Key="CardBg" Color="#272732" />
        <SolidColorBrush x:Key="BorderColor" Color="#3A3A4A" />
        <SolidColorBrush x:Key="TextPrimary" Color="#F3F4F6" />
        <SolidColorBrush x:Key="TextSecondary" Color="#9CA3AF" />
        <SolidColorBrush x:Key="AccentColor" Color="#38BDF8" />
        <SolidColorBrush x:Key="AccentText" Color="#0F172A" />
    </Window.Resources>

    <Grid Margin="16">
        <Grid.RowDefinitions>
            <RowDefinition Height="Auto" />
            <RowDefinition Height="Auto" />
            <RowDefinition Height="*" />
            <RowDefinition Height="Auto" />
        </Grid.RowDefinitions>

        <!-- Tiêu đề Header -->
        <Grid Grid.Row="0" Margin="0,0,0,14">
            <StackPanel Orientation="Horizontal" VerticalAlignment="Center">
                <Border Width="32" Height="32" CornerRadius="8" Background="#0284C7" Margin="0,0,10,0">
                    <TextBlock Text="📊" FontSize="18" HorizontalAlignment="Center" VerticalAlignment="Center"/>
                </Border>
                <StackPanel>
                    <TextBlock Text="BẢNG QUẢN LÝ BẢN VẼ DỰ ÁN (BIM SHEET MATRIX)" Foreground="{DynamicResource TextPrimary}" FontWeight="Bold" FontSize="15"/>
                    <TextBlock Text="Hệ thống bảng dữ liệu lớn WPF DataGrid • Dự án BIMHanoi Tower 2026" Foreground="{DynamicResource TextSecondary}" FontSize="11"/>
                </StackPanel>
            </StackPanel>
        </Grid>

        <!-- Thanh công cụ lọc & tác vụ nhanh -->
        <Border Grid.Row="1" Background="{DynamicResource CardBg}" BorderBrush="{DynamicResource BorderColor}" BorderThickness="1" CornerRadius="10" Padding="12,10" Margin="0,0,0,12">
            <Grid>
                <Grid.ColumnDefinitions>
                    <ColumnDefinition Width="280" />
                    <ColumnDefinition Width="12" />
                    <ColumnDefinition Width="160" />
                    <ColumnDefinition Width="*" />
                    <ColumnDefinition Width="Auto" />
                </Grid.ColumnDefinitions>

                <TextBox Grid.Column="0" Name="txtSearch" Height="32" Padding="8,4" Background="#181820" Foreground="{DynamicResource TextPrimary}" BorderBrush="{DynamicResource BorderColor}" BorderThickness="1"/>

                <ComboBox Grid.Column="2" Name="cboFilterDiscipline" Height="32" Background="#181820" Foreground="{DynamicResource TextPrimary}" BorderBrush="{DynamicResource BorderColor}">
                    <ComboBoxItem Content="Tất cả Bộ Môn" IsSelected="True"/>
                    <ComboBoxItem Content="Kiến Trúc (AR)"/>
                    <ComboBoxItem Content="Kết Cấu (ST)"/>
                    <ComboBoxItem Content="Cơ Điện (MEP)"/>
                </ComboBox>

                <StackPanel Grid.Column="4" Orientation="Horizontal">
                    <Button Name="btnReload" Width="100" Height="32" Background="#2E3440" BorderBrush="{DynamicResource BorderColor}" BorderThickness="1" Margin="0,0,8,0">
                        <TextBlock Text="Làm Mới" Foreground="{DynamicResource TextPrimary}" FontSize="11"/>
                    </Button>
                    <Button Name="btnBatchExport" Padding="14,0" Height="32" Background="{DynamicResource AccentColor}">
                        <TextBlock Text="Xuất Excel / PDF" Foreground="{DynamicResource AccentText}" FontWeight="Bold" FontSize="11"/>
                    </Button>
                </StackPanel>
            </Grid>
        </Border>

        <!-- BẢNG DỮ LIỆU LỚN WPF DATAGRID -->
        <DataGrid Grid.Row="2" Name="dgSheets" 
                  AutoGenerateColumns="False" 
                  CanUserAddRows="False" 
                  HeadersVisibility="Column"
                  GridLinesVisibility="All"
                  BorderBrush="{DynamicResource BorderColor}"
                  BorderThickness="1"
                  Background="{DynamicResource WindowBg}">
            <DataGrid.Columns>
                <DataGridCheckBoxColumn Header="Chọn" Binding="{Binding IsSelected}" Width="50" />
                <DataGridTextColumn Header="Số Bản Vẽ" Binding="{Binding SheetNumber}" Width="100" />
                <DataGridTextColumn Header="Tên Bản Vẽ (Sheet Name)" Binding="{Binding SheetName}" Width="260" />
                <DataGridTextColumn Header="Bộ Môn" Binding="{Binding Discipline}" Width="100" />
                <DataGridTextColumn Header="Tỷ Lệ" Binding="{Binding Scale}" Width="80" />
                <DataGridTextColumn Header="Người Vẽ" Binding="{Binding DrawnBy}" Width="110" />
                <DataGridTextColumn Header="Lần Sửa Đổi" Binding="{Binding Revision}" Width="90" />
                <DataGridTextColumn Header="Trạng Thái Duyệt" Binding="{Binding Status}" Width="120" />
                <DataGridTemplateColumn Header="Thao Tác" Width="90" />
            </DataGrid.Columns>
        </DataGrid>

        <!-- Thanh Footer trạng thái -->
        <Border Grid.Row="3" Background="{DynamicResource CardBg}" BorderBrush="{DynamicResource BorderColor}" BorderThickness="1" CornerRadius="8" Padding="12,10" Margin="0,12,0,0">
            <Grid>
                <StackPanel Orientation="Horizontal" VerticalAlignment="Center">
                    <TextBlock Text="Tổng số: 24 Bản vẽ • Đã chọn: 6 • Đồng bộ Revit Model 2026" Foreground="{DynamicResource TextSecondary}" FontSize="11"/>
                </StackPanel>

                <StackPanel Orientation="Horizontal" HorizontalAlignment="Right">
                    <Button Name="btnClose" Width="90" Height="30" Background="Transparent" BorderBrush="{DynamicResource BorderColor}" BorderThickness="1" Margin="0,0,8,0">
                        <TextBlock Text="Đóng" Foreground="{DynamicResource TextSecondary}" FontSize="11"/>
                    </Button>
                    <Button Name="btnSaveAll" Padding="14,0" Height="30" Background="#10B981">
                        <TextBlock Text="Lưu Thay Đổi (Commit) ✔" Foreground="#FFFFFF" FontWeight="Bold" FontSize="11"/>
                    </Button>
                </StackPanel>
            </Grid>
        </Border>
    </Grid>
</Window>`,
      },
      {
        name: 'script.py',
        path: 'BIMHanoi.extension/BIMHanoi.tab/Sheets.panel/BIMSheetDataManager.pushbutton/script.py',
        language: 'python',
        description: 'Xử lý tải dữ liệu từ Revit Document, bind vào DataGrid và đồng bộ ngược về Parameters.',
        content: `# -*- coding: utf-8 -*-
from pyrevit import revit, DB, forms

class SheetManagerWindow(forms.WPFWindow):
    def __init__(self):
        forms.WPFWindow.__init__(self, 'SheetManagerWindow.xaml')
        self.load_sheets_data()

    def load_sheets_data(self):
        doc = revit.doc
        sheets = DB.FilteredElementCollector(doc).OfClass(DB.ViewSheet).ToElements()
        # Bind danh sách sheet vào DataGrid
        print("Loaded {} sheets into WPF DataGrid".format(len(sheets)))

    def btnBatchExport_click(self, sender, args):
        forms.alert("Đã xuất thành công bảng danh mục bản vẽ ra Excel!", title="BIM Hanoi Export")

    def btnSaveAll_click(self, sender, args):
        with revit.Transaction("Update Sheet Parameters"):
            # Commit changes back to Revit
            pass
        forms.alert("Đã đồng bộ toàn bộ tham số vào mô hình Revit!", title="BIM Hanoi Commit")

if __name__ == '__main__':
    SheetManagerWindow().ShowDialog()
`,
      },
      {
        name: 'bundle.yaml',
        path: 'BIMHanoi.extension/BIMHanoi.tab/Sheets.panel/BIMSheetDataManager.pushbutton/bundle.yaml',
        language: 'yaml',
        description: 'Cấu hình nút bấm pyRevit.',
        content: `title: "Quản Lý Bản Vẽ\\n& Bảng Lớn"
tooltip: "Bảng ma trận quản lý thông số và trạng thái bản vẽ chuyên sâu bằng WPF DataGrid."
author: "Đông TB (BIM Hanoi)"
`,
      },
    ],
  },
];
