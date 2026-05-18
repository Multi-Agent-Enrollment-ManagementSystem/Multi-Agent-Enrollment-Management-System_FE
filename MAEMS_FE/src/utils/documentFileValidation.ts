/** Giới hạn dung lượng tài liệu hồ sơ (đồng bộ với validator backend). */
export const MAX_DOCUMENT_FILE_SIZE = 10 * 1024 * 1024;

/** Phần mở rộng file được phép tải lên. */
export const ALLOWED_DOCUMENT_EXTENSIONS = [
  ".pdf",
  ".jpg",
  ".jpeg",
  ".png",
] as const;

/** Chuỗi `accept` cho input/Upload Ant Design — lọc sớm ở trình duyệt. */
export const ALLOWED_DOCUMENT_ACCEPT = ALLOWED_DOCUMENT_EXTENSIONS.join(",");

/** Nhãn hiển thị cho người dùng (định dạng cho phép). */
export const ALLOWED_DOCUMENT_FORMATS_LABEL = "PDF, JPG, JPEG, PNG";

export type DocumentFileValidationResult =
  | { valid: true }
  | { valid: false; error: string };

/** Lấy phần mở rộng file (có dấu chấm, chữ thường). */
export function getDocumentFileExtension(fileName: string): string {
  const dotIndex = fileName.lastIndexOf(".");
  if (dotIndex === -1) return "";
  return fileName.substring(dotIndex).toLowerCase();
}

/** Kiểm tra kích thước và đuôi file trước khi thêm vào hàng đợi upload. */
export function validateDocumentFile(file: File): DocumentFileValidationResult {
  const ext = getDocumentFileExtension(file.name);

  if (
    !ALLOWED_DOCUMENT_EXTENSIONS.includes(
      ext as (typeof ALLOWED_DOCUMENT_EXTENSIONS)[number],
    )
  ) {
    return {
      valid: false,
      error: `Chỉ chấp nhận file ${ALLOWED_DOCUMENT_FORMATS_LABEL}.`,
    };
  }

  if (file.size > MAX_DOCUMENT_FILE_SIZE) {
    return {
      valid: false,
      error: "Dung lượng file không được vượt quá 10MB.",
    };
  }

  return { valid: true };
}

/** File ảnh trong danh sách cho phép — dùng tạo preview cục bộ. */
export function isDocumentImageFile(file: File): boolean {
  const ext = getDocumentFileExtension(file.name);
  return ext === ".jpg" || ext === ".jpeg" || ext === ".png";
}

/** Hiển thị dung lượng file thân thiện (B / KB / MB). */
export function formatDocumentFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
