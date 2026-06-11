import type { Document as ApplicantDocument } from "@/types/document";
import type { DocumentStatus } from "@/types/enums";
import {
  IMAGE_FORMATS,
  VERIFICATION_BADGE,
} from "./applicantProfileConstants";

/** Kiểm tra đuôi/format file có thuộc nhóm ảnh hay không. */
export function isImageFormat(fileFormat?: string) {
  const normalized = (fileFormat ?? "").toLowerCase().trim();
  return IMAGE_FORMATS.some(
    (ext) =>
      normalized === ext ||
      normalized === `.${ext}` ||
      normalized.includes(`image/${ext}`) ||
      normalized.includes(ext),
  );
}

/** Xác định tài liệu có thể preview dạng ảnh dựa trên metadata hoặc đường dẫn file. */
export function isImageDocument(doc?: ApplicantDocument | null) {
  if (!doc) return false;
  if (isImageFormat(doc.fileFormat)) return true;
  const path = (doc.filePath ?? "").toLowerCase();
  return IMAGE_FORMATS.some((ext) => path.includes(`.${ext}`));
}

/** Map kết quả duyệt từ API sang badge màu/nhãn chuẩn hoá. */
export function getVerificationBadge(result?: string | null) {
  if (!result) return { color: "default", label: "—" };
  const normalizedResult = result.trim().toLowerCase() as DocumentStatus;
  return (
    VERIFICATION_BADGE[normalizedResult] ?? { color: "default", label: result }
  );
}
