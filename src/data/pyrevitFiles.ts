import { PyRevitFile } from '../types';

export const PYREVIT_FILES: PyRevitFile[] = [
  {
    name: 'script.py',
    path: 'BIMHanoi.extension/BIMHanoi.tab/Personal.panel/ChaoAnhDong.pushbutton/script.py',
    language: 'python',
    description: 'Script chính điều khiển logic pyRevit, nhận diện Dark/Light mode Revit và nạp giao diện WPF.',
    content: `# -*- coding: utf-8 -*-
"""
Chao Anh Dong - pyRevit PushButton
----------------------------------------------------------------------
Tác giả   : Đông TB (dongtb@bimhanoi.com.vn) - BIM Hanoi
Chức năng : Hiển thị cửa sổ WPF chào hỏi anh Đông, phong cách tối giản,
            tự động đồng bộ Dark Mode theo thiết lập Revit 2024+.
----------------------------------------------------------------------
"""
__title__ = "Chào\\nAnh Đông"
__author__ = "Đông TB (BIM Hanoi)"
__doc__ = "Giao diện WPF hiện đại chào anh Đông và đồng bộ Dark/Light Mode Revit."

import os
import clr
from datetime import datetime

# Import pyRevit & Revit API
from pyrevit import forms, revit, script

# Nạp thư viện WPF .NET
clr.AddReference('PresentationFramework')
clr.AddReference('PresentationCore')
clr.AddReference('WindowsBase')
from System.Windows import WindowState, ResourceDictionary
from System.Windows.Media import ColorConverter, SolidColorBrush
from System.Windows.Input import MouseButtonState

# Bảng màu Dark / Light đồng bộ chuẩn Revit 2024 - 2026
PALETTES = {
    "Dark": {
        "WindowBg": "#1E1E24",
        "CardBg": "#272730",
        "CardHover": "#30303C",
        "BorderColor": "#3A3A47",
        "TextPrimary": "#F3F4F6",
        "TextSecondary": "#9CA3AF",
        "AccentColor": "#38BDF8",
        "AccentHover": "#0EA5E9",
        "AccentText": "#0F172A",
        "BadgeBg": "#2A374A",
        "BadgeBorder": "#38BDF8",
        "CloseHover": "#EF4444",
        "IconCircleBg": "#2A3342"
    },
    "Light": {
        "WindowBg": "#FFFFFF",
        "CardBg": "#F8FAFC",
        "CardHover": "#F1F5F9",
        "BorderColor": "#E2E8F0",
        "TextPrimary": "#0F172A",
        "TextSecondary": "#64748B",
        "AccentColor": "#0284C7",
        "AccentHover": "#0369A1",
        "AccentText": "#FFFFFF",
        "BadgeBg": "#E0F2FE",
        "BadgeBorder": "#BAE6FD",
        "CloseHover": "#EF4444",
        "IconCircleBg": "#E0F2FE"
    }
}


def detect_revit_theme():
    """
    Tự động kiểm tra giao diện Revit đang dùng Dark Theme hay Light Theme.
    Tương thích với Revit 2024, 2025, 2026 (UIThemeManager)
    và tự fallback về Light cho các bản Revit cũ hơn (2020 - 2023).
    """
    try:
        from Autodesk.Revit.UI import UIThemeManager, UITheme
        current = UIThemeManager.CurrentTheme
        if current == UITheme.Dark:
            return "Dark"
        return "Light"
    except Exception:
        # Fallback an toàn cho Revit < 2024
        return "Light"


def get_greeting_text():
    """Tạo lời chào thông minh theo khung thời gian trong ngày."""
    hour = datetime.now().hour
    if 5 <= hour < 12:
        return "Chào buổi sáng tốt lành, anh Đông! ☀️", "Chúc anh ngày mới tràn đầy năng lượng và xử lý mô hình mượt mà."
    elif 12 <= hour < 18:
        return "Chào buổi chiều anh Đông! 🚀", "Chúc anh buổi chiều làm việc năng suất, Revit chạy êm không crash."
    elif 18 <= hour < 22:
        return "Chào buổi tối anh Đông! 🌙", "Công việc hôm nay tiến triển tốt chứ anh? Sắp xong việc để nghỉ ngơi rồi!"
    else:
        return "Đêm muộn rồi anh Đông ơi! ☕", "Nhớ lưu file Sync with Central và nghỉ ngơi sớm giữ gìn sức khỏe nhé anh!"


class GreetingWindow(forms.WPFWindow):
    """Lớp điều khiển giao diện WPF Greeting Window."""

    def __init__(self, xaml_file_name='GreetingWindow.xaml'):
        # Khởi tạo cửa sổ từ file XAML đi kèm trong cùng thư mục
        forms.WPFWindow.__init__(self, xaml_file_name)

        # 1. Đồng bộ Theme Revit (Dark / Light)
        self.theme_mode = detect_revit_theme()
        self.apply_theme(self.theme_mode)

        # 2. Cập nhật lời chào tới anh Đông
        title_greeting, sub_greeting = get_greeting_text()
        self.txtGreetingTitle.Text = title_greeting
        self.txtGreetingSub.Text = sub_greeting
        self.txtThemeStatus.Text = "Revit " + self.theme_mode + " Mode"

        # 3. Thu thập thông tin dự án hiện tại (nếu có file đang mở)
        self.load_project_info()

    def apply_theme(self, theme_name):
        """Áp dụng bảng màu động vào Resources của WPF Window."""
        palette = PALETTES.get(theme_name, PALETTES["Dark"])
        conv = ColorConverter()

        for key, hex_value in palette.items():
            color = conv.ConvertFromString(hex_value)
            brush = SolidColorBrush(color)
            self.Resources[key] = brush

    def load_project_info(self):
        """Lấy thông tin file Revit hiện tại để hiển thị trên thẻ thông tin."""
        doc = revit.doc
        if doc:
            try:
                title = doc.Title or "Chưa đặt tên"
                active_view = doc.ActiveView.Name if doc.ActiveView else "Không có"
                warnings_count = len(doc.GetWarnings()) if hasattr(doc, 'GetWarnings') else 0
                
                self.txtProjectName.Text = title
                self.txtActiveView.Text = active_view
                self.txtWarnings.Text = str(warnings_count) + " cảnh báo"
            except Exception:
                self.txtProjectName.Text = "Không thể đọc thông tin Document"
        else:
            self.txtProjectName.Text = "Chưa mở dự án Revit nào"
            self.txtActiveView.Text = "N/A"
            self.txtWarnings.Text = "0 cảnh báo"

    # --- Sự kiện người dùng (Event Handlers) ---
    def header_mouse_down(self, sender, args):
        """Cho phép kéo thả cửa sổ khi click vào thanh tiêu đề."""
        if args.LeftButton == MouseButtonState.Pressed:
            self.DragMove()

    def btn_minimize_click(self, sender, args):
        """Thu nhỏ cửa sổ."""
        self.WindowState = WindowState.Minimized

    def btn_close_click(self, sender, args):
        """Đóng cửa sổ."""
        self.Close()

    def btn_start_work_click(self, sender, args):
        """Nút Bắt đầu làm việc."""
        self.Close()
        forms.alert(
            "Chúc anh Đông một ngày làm việc tuyệt vời cùng BIM Hanoi! 🚀",
            title="pyRevit Assistant",
            ok=True
        )

    def btn_check_warnings_click(self, sender, args):
        """Nút kiểm tra cảnh báo nhanh."""
        doc = revit.doc
        if doc and hasattr(doc, 'GetWarnings'):
            warnings = doc.GetWarnings()
            if warnings:
                forms.alert("Dự án hiện có {} cảnh báo cần xem xét.".format(len(warnings)), title="BIM Warning Checker")
            else:
                forms.alert("Mô hình quá sạch! Không có cảnh báo nào cả anh Đông nhé! 🌟", title="BIM Warning Checker")
        else:
            forms.alert("Hãy mở một dự án Revit trước nhé anh Đông!", title="Thông báo")

    def btn_coffee_click(self, sender, args):
        """Easter egg mời anh Đông ly cà phê."""
        forms.alert(
            "☕ Đã order tượng trưng 1 ly cà phê sữa đá đậm đà cho anh Đông!\\nNghỉ giải lao 5 phút rồi chiến tiếp anh nhé!",
            title="Coffee Time • Anh Đông"
        )


# Điểm khởi chạy của pyRevit
if __name__ == '__main__':
    window = GreetingWindow()
    window.ShowDialog()
`,
  },
  {
    name: 'GreetingWindow.xaml',
    path: 'BIMHanoi.extension/BIMHanoi.tab/Personal.panel/ChaoAnhDong.pushbutton/GreetingWindow.xaml',
    language: 'xml',
    description: 'File giao diện WPF XAML phong cách Minimalist Modern, hỗ trợ bo góc, hiệu ứng bóng mờ và DynamicResource màu sắc.',
    content: `<Window xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
        xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
        Title="pyRevit • Chào Anh Đông"
        Height="460" Width="480"
        WindowStartupLocation="CenterScreen"
        WindowStyle="None"
        AllowsTransparency="True"
        Background="Transparent"
        ResizeMode="NoResize">

    <!-- Bảng màu mặc định (được script.py cập nhật động theo Revit Dark/Light Mode) -->
    <Window.Resources>
        <SolidColorBrush x:Key="WindowBg" Color="#1E1E24" />
        <SolidColorBrush x:Key="CardBg" Color="#272730" />
        <SolidColorBrush x:Key="CardHover" Color="#30303C" />
        <SolidColorBrush x:Key="BorderColor" Color="#3A3A47" />
        <SolidColorBrush x:Key="TextPrimary" Color="#F3F4F6" />
        <SolidColorBrush x:Key="TextSecondary" Color="#9CA3AF" />
        <SolidColorBrush x:Key="AccentColor" Color="#38BDF8" />
        <SolidColorBrush x:Key="AccentHover" Color="#0EA5E9" />
        <SolidColorBrush x:Key="AccentText" Color="#0F172A" />
        <SolidColorBrush x:Key="BadgeBg" Color="#2A374A" />
        <SolidColorBrush x:Key="BadgeBorder" Color="#38BDF8" />
        <SolidColorBrush x:Key="CloseHover" Color="#EF4444" />
        <SolidColorBrush x:Key="IconCircleBg" Color="#2A3342" />

        <!-- Style cho các nút bấm hiện đại -->
        <Style x:Key="MinimalButton" TargetType="Button">
            <Setter Property="Foreground" Value="{DynamicResource TextPrimary}"/>
            <Setter Property="Background" Value="{DynamicResource CardBg}"/>
            <Setter Property="BorderBrush" Value="{DynamicResource BorderColor}"/>
            <Setter Property="BorderThickness" Value="1"/>
            <Setter Property="Cursor" Value="Hand"/>
            <Setter Property="Template">
                <Setter.Value>
                    <ControlTemplate TargetType="Button">
                        <Border Background="{TemplateBinding Background}"
                                BorderBrush="{TemplateBinding BorderBrush}"
                                BorderThickness="{TemplateBinding BorderThickness}"
                                CornerRadius="8"
                                Padding="{TemplateBinding Padding}">
                            <ContentPresenter HorizontalAlignment="Center" VerticalAlignment="Center"/>
                        </Border>
                    </ControlTemplate>
                </Setter.Value>
            </Setter>
        </Style>

        <Style x:Key="PrimaryAccentButton" TargetType="Button">
            <Setter Property="Foreground" Value="{DynamicResource AccentText}"/>
            <Setter Property="Background" Value="{DynamicResource AccentColor}"/>
            <Setter Property="BorderThickness" Value="0"/>
            <Setter Property="FontWeight" Value="SemiBold"/>
            <Setter Property="Cursor" Value="Hand"/>
            <Setter Property="Template">
                <Setter.Value>
                    <ControlTemplate TargetType="Button">
                        <Border Background="{TemplateBinding Background}"
                                CornerRadius="8"
                                Padding="{TemplateBinding Padding}">
                            <ContentPresenter HorizontalAlignment="Center" VerticalAlignment="Center"/>
                        </Border>
                    </ControlTemplate>
                </Setter.Value>
            </Setter>
        </Style>
    </Window.Resources>

    <!-- Khung viền ngoài với đổ bóng mềm mại -->
    <Grid Margin="12">
        <Border Background="{DynamicResource WindowBg}"
                BorderBrush="{DynamicResource BorderColor}"
                BorderThickness="1"
                CornerRadius="16">
            <Border.Effect>
                <DropShadowEffect BlurRadius="24"
                                  Color="#000000"
                                  Opacity="0.35"
                                  ShadowDepth="6"
                                  Direction="270" />
            </Border.Effect>

            <Grid>
                <Grid.RowDefinitions>
                    <!-- Row 0: Header / Thanh tiêu đề tùy biến -->
                    <RowDefinition Height="46" />
                    <!-- Row 1: Nội dung chính & Lời chào anh Đông -->
                    <RowDefinition Height="*" />
                    <!-- Row 2: Thanh tác vụ phía dưới (Footer) -->
                    <RowDefinition Height="64" />
                </Grid.RowDefinitions>

                <!-- 0. THANH TIÊU ĐỀ (Cho phép kéo thả cửa sổ) -->
                <Border Grid.Row="0"
                        Background="Transparent"
                        MouseLeftButtonDown="header_mouse_down"
                        BorderBrush="{DynamicResource BorderColor}"
                        BorderThickness="0,0,0,1">
                    <Grid Margin="16,0,12,0">
                        <!-- Tên ứng dụng & Logo nhỏ -->
                        <StackPanel Orientation="Horizontal" VerticalAlignment="Center">
                            <Border Width="20" Height="20" CornerRadius="5" Background="{DynamicResource AccentColor}" Margin="0,0,8,0">
                                <TextBlock Text="B" Foreground="{DynamicResource AccentText}" FontWeight="Bold" FontSize="11"
                                           HorizontalAlignment="Center" VerticalAlignment="Center"/>
                            </Border>
                            <TextBlock Text="BIM Hanoi • pyRevit Assistant"
                                       Foreground="{DynamicResource TextSecondary}"
                                       FontSize="12"
                                       FontWeight="Medium"
                                       VerticalAlignment="Center"/>
                        </StackPanel>

                        <!-- Nút Minimize và Close góc trên bên phải -->
                        <StackPanel Orientation="Horizontal" HorizontalAlignment="Right" VerticalAlignment="Center">
                            <!-- Nút Thu nhỏ -->
                            <Button Width="28" Height="28" Margin="0,0,4,0"
                                    Background="Transparent" BorderThickness="0"
                                    Click="btn_minimize_click"
                                    Cursor="Hand" ToolTip="Thu nhỏ">
                                <TextBlock Text="—" Foreground="{DynamicResource TextSecondary}" FontSize="11" HorizontalAlignment="Center" VerticalAlignment="Center"/>
                            </Button>
                            <!-- Nút Đóng -->
                            <Button Width="28" Height="28"
                                    Background="Transparent" BorderThickness="0"
                                    Click="btn_close_click"
                                    Cursor="Hand" ToolTip="Đóng">
                                <TextBlock Text="✕" Foreground="{DynamicResource TextSecondary}" FontSize="12" HorizontalAlignment="Center" VerticalAlignment="Center"/>
                            </Button>
                        </StackPanel>
                    </Grid>
                </Border>

                <!-- 1. KHU VỰC LỜI CHÀO & NỘI DUNG CHÍNH -->
                <ScrollViewer Grid.Row="1" VerticalScrollBarVisibility="Auto" Margin="24,18,24,10">
                    <StackPanel>
                        <!-- BIỂU TƯỢNG CHÀO HỎI THÂN THIỆN (Waving Hand / Friendly Avatar) -->
                        <Grid HorizontalAlignment="Center" Margin="0,6,0,16">
                            <!-- Vòng tròn hào quang nền -->
                            <Border Width="80" Height="80"
                                    CornerRadius="40"
                                    Background="{DynamicResource IconCircleBg}"
                                    BorderBrush="{DynamicResource AccentColor}"
                                    BorderThickness="1.5">
                                <Grid>
                                    <!-- Biểu tượng bàn tay vẫy chào thân thiện dạng Vector Path -->
                                    <Viewbox Width="44" Height="44" HorizontalAlignment="Center" VerticalAlignment="Center">
                                        <Canvas Width="48" Height="48">
                                            <!-- Path bàn tay chào hỏi 👋 sắc nét và thân thiện -->
                                            <Path Fill="{DynamicResource AccentColor}"
                                                  Data="M24,4 C25.1,4 26,4.9 26,6 L26,18 C26,18.6 26.4,19 27,19 C27.6,19 28,18.6 28,18 L28,9 C28,7.9 28.9,7 30,7 C31.1,7 32,7.9 32,9 L32,18 C32,18.6 32.4,19 33,19 C33.6,19 34,18.6 34,18 L34,12 C34,10.9 34.9,10 36,10 C37.1,10 38,10.9 38,12 L38,23 C38,31.3 31.3,38 23,38 C16.5,38 11,33.8 9.3,27.9 L7.2,20.8 C6.9,19.7 7.5,18.6 8.6,18.3 C9.7,18 10.8,18.6 11.1,19.7 L13,26 C13.3,27 14.5,27.5 15.4,27 C16.2,26.5 16.5,25.5 16.3,24.6 L14.7,15.5 C14.5,14.4 15.2,13.4 16.3,13.2 C17.4,13 18.4,13.7 18.6,14.8 L20,22 C20.1,22.6 20.6,23 21.2,23 C21.8,23 22.3,22.5 22.2,21.9 L22,6 C22,4.9 22.9,4 24,4 Z" />
                                            <!-- Tia sáng chào hỏi thân thiện bên cạnh -->
                                            <Path Fill="{DynamicResource TextSecondary}"
                                                  Data="M40,6 L43,3 M44,14 L48,14 M42,22 L45,24"
                                                  Stroke="{DynamicResource AccentColor}"
                                                  StrokeThickness="2"
                                                  StrokeStartLineCap="Round"
                                                  StrokeEndLineCap="Round" />
                                        </Canvas>
                                    </Viewbox>
                                </Grid>
                            </Border>
                        </Grid>

                        <!-- TIÊU ĐỀ LỜI CHÀO ANH ĐÔNG -->
                        <TextBlock x:Name="txtGreetingTitle"
                                   Text="Chào anh Đông! 👋"
                                   Foreground="{DynamicResource TextPrimary}"
                                   FontSize="21"
                                   FontWeight="Bold"
                                   TextAlignment="Center"
                                   Margin="0,0,0,6"/>

                        <!-- PHỤ ĐỀ / LỜI CHÚC CÔNG VIỆC -->
                        <TextBlock x:Name="txtGreetingSub"
                                   Text="Chúc anh Đông một ca làm việc Revit mượt mà, không crash &amp; clean model!"
                                   Foreground="{DynamicResource TextSecondary}"
                                   FontSize="13"
                                   TextAlignment="Center"
                                   TextWrapping="Wrap"
                                   LineHeight="18"
                                   Margin="0,0,0,16"/>

                        <!-- NHÃN TRẠNG THÁI ĐỒNG BỘ DARK / LIGHT THEME REVIT -->
                        <StackPanel Orientation="Horizontal" HorizontalAlignment="Center" Margin="0,0,0,16">
                            <Border Background="{DynamicResource BadgeBg}"
                                    BorderBrush="{DynamicResource BadgeBorder}"
                                    BorderThickness="1"
                                    CornerRadius="12"
                                    Padding="10,4">
                                <StackPanel Orientation="Horizontal">
                                    <Ellipse Width="7" Height="7" Fill="{DynamicResource AccentColor}" Margin="0,0,6,0" VerticalAlignment="Center"/>
                                    <TextBlock x:Name="txtThemeStatus"
                                               Text="Đồng bộ Revit Dark Mode"
                                               Foreground="{DynamicResource AccentColor}"
                                               FontSize="11"
                                               FontWeight="SemiBold"/>
                                </StackPanel>
                            </Border>
                        </StackPanel>

                        <!-- THẺ THÔNG TIN TÓM TẮT REVIT DOCUMENT -->
                        <Border Background="{DynamicResource CardBg}"
                                BorderBrush="{DynamicResource BorderColor}"
                                BorderThickness="1"
                                CornerRadius="10"
                                Padding="14,12"
                                Margin="0,0,0,8">
                            <Grid>
                                <Grid.ColumnDefinitions>
                                    <ColumnDefinition Width="*" />
                                    <ColumnDefinition Width="*" />
                                </Grid.ColumnDefinitions>
                                <Grid.RowDefinitions>
                                    <RowDefinition Height="Auto" />
                                    <RowDefinition Height="Auto" />
                                </Grid.RowDefinitions>

                                <!-- Tên file dự án -->
                                <StackPanel Grid.Row="0" Grid.Column="0" Grid.ColumnSpan="2" Margin="0,0,0,10">
                                    <TextBlock Text="DỰ ÁN HIỆN TẠI" Foreground="{DynamicResource TextSecondary}" FontSize="10" FontWeight="Bold"/>
                                    <TextBlock x:Name="txtProjectName" Text="BIMHanoi_Tower_2026.rvt" Foreground="{DynamicResource TextPrimary}" FontSize="13" FontWeight="SemiBold" TextTrimming="CharacterEllipsis"/>
                                </StackPanel>

                                <!-- Active View -->
                                <StackPanel Grid.Row="1" Grid.Column="0">
                                    <TextBlock Text="VIEW ĐANG MỞ" Foreground="{DynamicResource TextSecondary}" FontSize="10" FontWeight="Bold"/>
                                    <TextBlock x:Name="txtActiveView" Text="Level 1 - Floor Plan" Foreground="{DynamicResource TextPrimary}" FontSize="12" TextTrimming="CharacterEllipsis"/>
                                </StackPanel>

                                <!-- Warnings Count -->
                                <StackPanel Grid.Row="1" Grid.Column="1">
                                    <TextBlock Text="WARNINGS" Foreground="{DynamicResource TextSecondary}" FontSize="10" FontWeight="Bold"/>
                                    <TextBlock x:Name="txtWarnings" Text="0 cảnh báo" Foreground="{DynamicResource AccentColor}" FontSize="12" FontWeight="SemiBold"/>
                                </StackPanel>
                            </Grid>
                        </Border>
                    </StackPanel>
                </ScrollViewer>

                <!-- 2. THANH TÁC VỤ DƯỚI CÙNG (ACTIONS) -->
                <Border Grid.Row="2"
                        Background="{DynamicResource CardBg}"
                        BorderBrush="{DynamicResource BorderColor}"
                        BorderThickness="0,1,0,0"
                        CornerRadius="0,0,16,16"
                        Padding="20,12">
                    <Grid>
                        <Grid.ColumnDefinitions>
                            <ColumnDefinition Width="Auto" />
                            <ColumnDefinition Width="*" />
                            <ColumnDefinition Width="Auto" />
                        </Grid.ColumnDefinitions>

                        <!-- Nút Easter Egg: Tách cà phê -->
                        <Button Grid.Column="0"
                                Width="38" Height="36"
                                Style="{StaticResource MinimalButton}"
                                Click="btn_coffee_click"
                                ToolTip="Nghỉ giải lao cà phê cùng anh Đông ☕">
                            <TextBlock Text="☕" FontSize="14" HorizontalAlignment="Center" VerticalAlignment="Center"/>
                        </Button>

                        <!-- Nút Kiểm tra Warning -->
                        <Button Grid.Column="1"
                                Margin="10,0,10,0"
                                Height="36"
                                Content="Kiểm tra Warning"
                                FontSize="12"
                                Style="{StaticResource MinimalButton}"
                                Click="btn_check_warnings_click" />

                        <!-- Nút Bắt đầu làm việc (Primary) -->
                        <Button Grid.Column="2"
                                Height="36"
                                Padding="16,0"
                                Content="Bắt đầu ngày mới ✨"
                                FontSize="12"
                                Style="{StaticResource PrimaryAccentButton}"
                                Click="btn_start_work_click" />
                    </Grid>
                </Border>
            </Grid>
        </Border>
    </Grid>
</Window>
`,
  },
  {
    name: 'bundle.yaml',
    path: 'BIMHanoi.extension/BIMHanoi.tab/Personal.panel/ChaoAnhDong.pushbutton/bundle.yaml',
    language: 'yaml',
    description: 'Tệp khai báo cấu hình nút bấm pyRevit Ribbon (title, tooltip, author, icon).',
    content: `title: "Chào\\nAnh Đông"
tooltip: "Cửa sổ WPF phong cách tối giản chào anh Đông và tự động đồng bộ Dark Mode Revit 2024+."
author: "Đông TB (dongtb@bimhanoi.com.vn) • BIM Hanoi"
highlight: new
min_revit_ver: 2020
max_revit_ver: 2027
context:
  - zero-doc
  - doc
`,
  },
  {
    name: 'HuongDanCaiDat.md',
    path: 'BIMHanoi.extension/HuongDanCaiDat.md',
    language: 'markdown',
    description: 'Hướng dẫn chi tiết từng bước cài đặt script vào pyRevit trên máy tính của anh Đông.',
    content: `# Hướng Dẫn Cài Đặt pyRevit Extension Cho Anh Đông

Chào anh Đông! Dưới đây là hướng dẫn 3 bước nhanh nhất để đưa nút bấm WPF này lên thanh Ribbon của Revit:

---

### Bước 1: Tạo cấu trúc thư mục Extension
pyRevit quét các thư mục theo quy tắc định danh: \`.extension\`, \`.tab\`, \`.panel\`, \`.pushbutton\`.

Hãy tạo (hoặc giải nén) thư mục theo đúng đường dẫn sau trong máy của anh:
\`\`\`text
%appdata%\\pyRevit\\Extensions\\BIMHanoi.extension\\
└── BIMHanoi.tab\\
    └── Personal.panel\\
        └── ChaoAnhDong.pushbutton\\
            ├── script.py
            ├── GreetingWindow.xaml
            ├── bundle.yaml
            └── icon.png
\`\`\`

> 💡 **Mẹo mở nhanh:** Nhấn tổ hợp phím \`Windows + R\`, gõ \`%appdata%\\pyRevit\\Extensions\` rồi ấn **Enter**.

---

### Bước 2: Thêm các tệp vào thư mục \`ChaoAnhDong.pushbutton\`
Chép 3 tệp sau vào thư mục \`ChaoAnhDong.pushbutton\`:
1. \`script.py\`
2. \`GreetingWindow.xaml\`
3. \`bundle.yaml\`
4. \`icon.png\` *(Hình icon 32x32 hoặc 64x64 dạng PNG)*

---

### Bước 3: Tải lại pyRevit (Reload)
Mở Revit lên:
- Trên thanh Ribbon Revit, chọn thẻ **pyRevit** -> bấm nút **Reload** (hoặc mở Command Prompt gõ \`pyrevit reload\`).
- Lúc này trên thanh Ribbon sẽ xuất hiện tab **BIM Hanoi**, panel **Personal** với nút **Chào Anh Đông**!

---

### Tính Năng Nổi Bật Dành Riêng Cho Anh Đông:
- 🎨 **Tự động nhận diện Revit Theme:** Tương thích với Dark Theme của Revit 2024, 2025, 2026 thông qua \`UIThemeManager\`.
- 👋 **Biểu tượng chào hỏi thân thiện:** Thiết kế vector sắc nét, không vỡ hạt trên màn hình 2K/4K.
- 🕒 **Lời chào thông minh:** Tự đổi lời chào theo Sáng, Chiều, Tối và Đêm muộn.
- 📐 **Đọc thông số Document:** Tự động lấy tên file dự án, Active View và số lượng cảnh báo (Warnings).
`,
  },
];
