import { Badge } from "antd";
import type { Document } from "../../../../types/document";
import type { DocumentStatus } from "../../../../types/enums";
import { DOCUMENT_VERIFICATION } from "../types";

/** Chuẩn hóa về DocumentStatus; hỗ trợ giá trị cũ từ API nếu có */
export function normalizeDocumentStatus(
  raw: DocumentStatus | string | null | undefined,
): DocumentStatus | null {
  if (raw == null || raw === "") return null;
  const r = String(raw).toLowerCase().trim();
  if (r === "pending") return "pending";
  if (r === "verified" || r === "passed") return "verified";
  if (r === "rejected" || r === "failed") return "rejected";
  return null;
}

/** Badge trạng thái xác minh tài liệu cho danh sách và modal xem trước */
export function verificationBadge(
  result: DocumentStatus | string | null | undefined,
) {
  const status = normalizeDocumentStatus(result);
  if (!status) {
    return (
      <Badge
        status="default"
        text={
          result == null || result === "" ? "Chưa xác minh" : String(result)
        }
      />
    );
  }
  const cfg = DOCUMENT_VERIFICATION[status];
  return <Badge status={cfg.status} text={cfg.text} />;
}

function isImageFile(fileFormat?: string) {
  const normalized = (fileFormat || "").toLowerCase().trim();
  return ["png", "jpg", "jpeg", "webp", "gif", "bmp", "svg"].some(
    (ext) =>
      normalized === ext ||
      normalized === `.${ext}` ||
      normalized.includes(`image/${ext}`) ||
      normalized.includes(ext),
  );
}

/** Kiểm tra tài liệu có phải ảnh để hiển thị thumbnail / preview */
export function isImageDocument(doc: Document) {
  if (isImageFile(doc.fileFormat)) return true;
  const path = (doc.filePath || "").toLowerCase();
  return [".png", ".jpg", ".jpeg", ".webp", ".gif", ".bmp", ".svg"].some(
    (ext) => path.includes(ext),
  );
}

/** Hiển thị giới tính theo chuẩn tiếng Việt */
export function formatGender(g: string) {
  const x = (g || "").toLowerCase();
  if (x === "male" || x === "nam" || x === "m") return "Nam";
  if (x === "female" || x === "nữ" || x === "nu" || x === "f") return "Nữ";
  if (x === "other" || x === "khác") return "Khác";
  return g?.trim() || "—";
}

/** Lấy chữ cái viết tắt từ họ tên cho avatar */
export function initialsFromName(name: string) {
  const parts = (name || "").trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

/** Parse danh sách tài liệu bắt buộc từ JSON hoặc chuỗi thuần (gợi ý bổ sung) */
export function normalizeRequiredDocumentList(raw: string | null | undefined) {
  if (!raw) return "";
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed
        .map((item) => String(item).trim())
        .filter(Boolean)
        .join(", ");
    }
  } catch {
    // Fallback: giữ nguyên text nếu không phải JSON
  }
  return String(raw).trim();
}
