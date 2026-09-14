import JSZip from 'jszip';
import { PyRevitTool } from '../types';

/**
 * Downloads a single pyRevit Tool as a zip archive
 */
export async function downloadToolAsZip(tool: PyRevitTool) {
  const zip = new JSZip();
  const rootDirName = tool.name; // e.g. "ChaoAnhDong.pushbutton"
  const folder = zip.folder(rootDirName);

  if (!folder) return;

  // Add files
  tool.files.forEach((file) => {
    folder.file(file.name, file.content);
  });

  // Add README
  const readmeContent = `# ${tool.name}
${tool.description}

- Tác giả: ${tool.author}
- Phiên bản: v${tool.version}
- Revit hỗ trợ: ${tool.minRevit} - ${tool.maxRevit}
- Vị trí Extension đề xuất:
  %appdata%\\pyRevit\\Extensions\\${tool.extensionTab}\\${tool.panel}\\${tool.name}

## Hướng dẫn cài đặt nhanh:
1. Giải nén thư mục \`${tool.name}\` này vào thư mục panel pyRevit của bạn.
2. Mở Autodesk Revit hoặc nhấn **pyRevit > Reload**.
3. Nút bấm sẽ xuất hiện ngay trên thanh công cụ Ribbon!
`;
  folder.file('README.md', readmeContent);

  const blob = await zip.generateAsync({ type: 'blob' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${tool.name}.zip`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Downloads the entire Extension repository containing all tools
 */
export async function downloadFullExtensionBundle(tools: PyRevitTool[]) {
  const zip = new JSZip();
  const extFolder = zip.folder('BIMHanoi.extension');

  if (!extFolder) return;

  // Add extension.json
  const extConfig = {
    name: 'BIM Hanoi pyRevit Extension',
    author: 'Đông TB (dongtb@bimhanoi.com.vn)',
    description: 'Bộ công cụ pyRevit chuyên nghiệp cho Revit 2020-2026 với giao diện WPF hiện đại.',
    version: '2.5.0',
    min_revit_ver: 2020,
    max_revit_ver: 2026,
  };
  extFolder.file('extension.json', JSON.stringify(extConfig, null, 2));

  // Add each tool under its tab and panel
  tools.forEach((tool) => {
    const tabFolder = extFolder.folder(tool.extensionTab);
    if (!tabFolder) return;
    const panelFolder = tabFolder.folder(tool.panel);
    if (!panelFolder) return;
    const toolFolder = panelFolder.folder(tool.name);
    if (!toolFolder) return;

    tool.files.forEach((file) => {
      toolFolder.file(file.name, file.content);
    });
  });

  // Comprehensive installation guide
  const guide = `# HƯỚNG DẪN CÀI ĐẶT PYREVIT EXTENSION - BIM HANOI
Dành cho: Anh Đông & Đội ngũ Kỹ sư BIM Hanoi
------------------------------------------------------

## BƯỚC 1: Tìm thư mục pyRevit Extensions
Nhấn tổ hợp phím [Windows + R], nhập đường dẫn sau và nhấn Enter:
%appdata%\\pyRevit\\Extensions

(Nếu chưa có thư mục Extensions, bạn chỉ cần tạo thư mục mới tên là "Extensions")

## BƯỚC 2: Sao chép thư mục Extension
Copy toàn bộ thư mục \`BIMHanoi.extension\` trong file zip này vào:
%appdata%\\pyRevit\\Extensions\\BIMHanoi.extension

Cấu trúc chuẩn:
BIMHanoi.extension/
  ├── extension.json
  └── BIMHanoi.tab/
      ├── Personal.panel/
      │   └── ChaoAnhDong.pushbutton/
      │       ├── script.py
      │       ├── GreetingWindow.xaml
      │       └── bundle.yaml
      ├── Sheets.panel/
      │   └── SheetBatchRenumber.pushbutton/
      ├── Families.panel/
      │   └── FamilyHealthAuditor.pushbutton/
      └── QAQC.panel/
          └── ModelWarningAuditor.pushbutton/

## BƯỚC 3: Kích hoạt trong Revit
1. Mở Revit bất kỳ (Revit 2020, 2021, 2022, 2023, 2024, 2025 hoặc 2026).
2. Vào Tab \`pyRevit\` trên Ribbon -> Chọn \`pyRevit\` -> Chọn \`Reload\`.
3. Tab mới **BIM Hanoi** sẽ xuất hiện trên thanh công cụ với đầy đủ các nút bấm WPF!

Chúc anh Đông và team làm việc hiệu quả và thành công rực rỡ!
`;

  extFolder.file('HD_CAI_DAT_CHITIET.md', guide);

  const blob = await zip.generateAsync({ type: 'blob' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `BIMHanoi_pyRevit_Extension_Bundle.zip`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
