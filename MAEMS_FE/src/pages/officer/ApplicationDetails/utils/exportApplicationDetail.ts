import JSZip from "jszip";
import * as XLSX from "xlsx";
import { getApplicantById } from "../../../../api/applicants";
import { getApplicantScores } from "../../../../api/scores";
import type { CreateApplicantResponse } from "../../../../types/applicant";
import {
  APPLICATION_REQUIRES_REVIEW_LABEL,
  APPLICATION_STATUS,
  type Application,
} from "../../../../types/application";
import type { Document } from "../../../../types/document";
import type { Score } from "../../../../types/score";
import { formatApplicationLevel } from "./applicationLevelDisplay";
import { ensureUtc } from "../../../../utils/date";
import {
  SCORE_SECTIONS,
  formatScoreValue,
  pickPrimaryScore,
} from "../../../../utils/scoreDisplay";
import { formatGender } from "./displayHelpers";
import { fetchDocumentFromFilePath } from "./fetchDocumentFromFilePath";

/** Tên folder gốc: APP-{mã hồ sơ} */
const APP_FOLDER_PREFIX = "APP";
/** Folder con chứa toàn bộ file đính kèm */
const DOCS_SUBFOLDER = "tai-lieu";

type ColumnEntry = { label: string; value: string };

export function getAppExportFolderName(applicationId: number): string {
  return `${APP_FOLDER_PREFIX}-${applicationId}`;
}

function formatDateTime(raw: string | null | undefined): string {
  if (!raw) return "—";
  try {
    return new Date(ensureUtc(raw)).toLocaleString("vi-VN");
  } catch {
    return String(raw);
  }
}

function formatDate(raw: string | null | undefined): string {
  if (!raw) return "—";
  try {
    return new Date(ensureUtc(raw)).toLocaleDateString("vi-VN");
  } catch {
    return String(raw);
  }
}

function columnSheet(entries: ColumnEntry[]): XLSX.WorkSheet {
  const headers = entries.map((e) => e.label);
  const values = entries.map((e) => e.value);
  return XLSX.utils.aoa_to_sheet([headers, values]);
}

function buildApplicationSheet(app: Application): XLSX.WorkSheet {
  return columnSheet([
    { label: "Mã hồ sơ", value: String(app.applicationId) },
    { label: "Mã thí sinh", value: String(app.applicantId) },
    { label: "Họ tên thí sinh", value: app.applicantName },
    { label: "Ngành đăng ký", value: app.programName },
    { label: "Cơ sở", value: app.campusName },
    { label: "Phương thức xét tuyển", value: app.admissionTypeName },
    { label: "Năm tuyển sinh", value: app.enrollmentYear },
    { label: "Xếp hạng", value: formatApplicationLevel(app.level) },
    { label: "Trạng thái", value: APPLICATION_STATUS[app.status] },
    {
      label: APPLICATION_REQUIRES_REVIEW_LABEL,
      value: app.requiresReview ? "Có" : "Không",
    },
    { label: "Ngày nộp", value: formatDateTime(app.submittedAt) },
    { label: "Cập nhật lần cuối", value: formatDateTime(app.lastUpdated) },
    {
      label: "Cán bộ phụ trách",
      value: app.assignedOfficerName ?? "Chưa phân công",
    },
    {
      label: "Mã cán bộ phụ trách",
      value:
        app.assignedOfficerId != null ? String(app.assignedOfficerId) : "—",
    },
    { label: "Ghi chú Agent hệ thống", value: app.notes?.trim() || "—" },
    {
      label: "Số tài liệu đính kèm",
      value: String(app.documents?.length ?? 0),
    },
  ]);
}

function buildApplicantSheet(
  applicant: CreateApplicantResponse | null,
): XLSX.WorkSheet {
  if (!applicant) {
    return columnSheet([
      { label: "Thông báo", value: "Không tải được hồ sơ thí sinh." },
    ]);
  }

  return columnSheet([
    { label: "Mã thí sinh", value: String(applicant.applicantId) },
    { label: "User ID", value: String(applicant.userId) },
    { label: "Họ và tên", value: applicant.fullName },
    { label: "Ngày sinh", value: formatDate(applicant.dateOfBirth) },
    { label: "Giới tính", value: formatGender(applicant.gender) },
    { label: "Trường THPT", value: applicant.highSchoolName || "—" },
    { label: "Huyện / quận", value: applicant.highSchoolDistrict || "—" },
    { label: "Tỉnh / TP", value: applicant.highSchoolProvince || "—" },
    {
      label: "Năm tốt nghiệp",
      value:
        applicant.graduationYear != null
          ? String(applicant.graduationYear)
          : "—",
    },
    { label: "Số CCCD/CMND", value: applicant.idIssueNumber || "—" },
    { label: "Ngày cấp", value: formatDate(applicant.idIssueDate) },
    { label: "Nơi cấp", value: applicant.idIssuePlace || "—" },
    { label: "Người liên hệ", value: applicant.contactName || "—" },
    { label: "Địa chỉ liên hệ", value: applicant.contactAddress || "—" },
    { label: "Điện thoại", value: applicant.contactPhone || "—" },
    { label: "Email", value: applicant.contactEmail || "—" },
    {
      label: "Đồng ý chia sẻ thông tin",
      value: applicant.allowShare ? "Có" : "Không",
    },
    { label: "Tạo hồ sơ lúc", value: formatDateTime(applicant.createdAt) },
  ]);
}

function buildScoresSheet(score: Score | null): XLSX.WorkSheet {
  if (!score) {
    return columnSheet([
      {
        label: "Thông báo",
        value: "Thí sinh chưa có điểm trên hệ thống.",
      },
    ]);
  }

  const entries: ColumnEntry[] = [];
  for (const section of SCORE_SECTIONS) {
    for (const field of section.fields) {
      entries.push({
        label: `${section.title} — ${field.label}`,
        value: formatScoreValue(score[field.key]),
      });
    }
  }
  return columnSheet(entries);
}

function buildWorkbook(
  app: Application,
  applicant: CreateApplicantResponse | null,
  score: Score | null,
): XLSX.WorkBook {
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, buildApplicationSheet(app), "Thông tin đơn");
  XLSX.utils.book_append_sheet(
    wb,
    buildApplicantSheet(applicant),
    "Thông tin thí sinh",
  );
  XLSX.utils.book_append_sheet(wb, buildScoresSheet(score), "Điểm thí sinh");
  return wb;
}

function sanitizeFileName(name: string): string {
  const sanitized = [...name]
    .map((ch) => {
      const code = ch.charCodeAt(0);
      if (code <= 31) return "_";
      if (/[<>:"/\\|?*]/.test(ch)) return "_";
      return ch;
    })
    .join("");
  return sanitized.trim() || "file";
}

function documentFileName(doc: Document): string {
  const url = doc.filePath?.trim();
  if (url) {
    try {
      const parsed = new URL(url);
      const lastPart = parsed.pathname.split("/").pop() ?? "";
      let decoded = decodeURIComponent(lastPart);
      decoded = decoded.split("/").pop() ?? decoded;
      const fromUrl = decoded.split("?")[0];
      if (fromUrl) return sanitizeFileName(fromUrl);
    } catch {
      // metadata
    }
  }

  const ext = (doc.fileFormat || "").replace(/^\./, "").toLowerCase();
  const base = sanitizeFileName(
    doc.fileName || doc.documentType || `document-${doc.documentId}`,
  );
  const hasExt =
    ext && (base.toLowerCase().endsWith(`.${ext}`) || base.includes("."));
  return hasExt ? base : ext ? `${base}.${ext}` : base;
}

function uniqueFileName(base: string, used: Set<string>): string {
  if (!used.has(base)) {
    used.add(base);
    return base;
  }
  const dot = base.lastIndexOf(".");
  const stem = dot > 0 ? base.slice(0, dot) : base;
  const ext = dot > 0 ? base.slice(dot) : "";
  let n = 2;
  while (used.has(`${stem}_${n}${ext}`)) n += 1;
  const name = `${stem}_${n}${ext}`;
  used.add(name);
  return name;
}

/** Tải 1 blob vào Thư mục Tải xuống (không hỏi chọn folder) */
function triggerBrowserDownload(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = fileName;
  anchor.rel = "noopener";
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 2000);
}

/**
 * Đóng gói APP-{id}/ (Excel + tai-lieu/) thành zip STORE — không nén byte, chỉ gom cấu trúc folder.
 * Windows không cho <a download="folder/file"> nên dùng zip 1 lần bấm, giải nén ra đúng folder.
 */
async function buildExportZip(
  folderName: string,
  excelBuffer: ArrayBuffer,
  documents: Document[],
): Promise<{ zipBlob: Blob; documentsOk: number; documentFailures: string[] }> {
  const zip = new JSZip();
  const root = zip.folder(folderName);
  if (!root) {
    throw new Error("ZIP_FOLDER_CREATE_FAILED");
  }

  root.file(`${folderName}.xlsx`, excelBuffer);

  const docsFolder = root.folder(DOCS_SUBFOLDER);
  const documentFailures: string[] = [];
  let documentsOk = 0;
  const usedNames = new Set<string>();

  if (docsFolder) {
    for (const doc of documents) {
      const label = doc.fileName || doc.documentType || String(doc.documentId);
      const url = doc.filePath?.trim();

      if (!url) {
        documentFailures.push(label);
        continue;
      }

      const blob = await fetchDocumentFromFilePath(doc);
      if (!blob?.size) {
        documentFailures.push(label);
        continue;
      }

      const arrayBuffer = await blob.arrayBuffer();
      docsFolder.file(uniqueFileName(documentFileName(doc), usedNames), arrayBuffer);
      documentsOk += 1;
    }
  }

  const zipBlob = await zip.generateAsync({
    type: "blob",
    compression: "STORE",
  });

  return { zipBlob, documentsOk, documentFailures };
}

export type ApplicationDetailExportResult = {
  folderName: string;
  documentsOk: number;
  documentFailures: string[];
};

export class ApplicationExportCancelledError extends Error {
  constructor() {
    super("USER_CANCELLED");
    this.name = "ApplicationExportCancelledError";
  }
}

/**
 * Bấm Tải về → 1 file APP-{id}.zip vào Downloads (không chọn folder).
 * Giải nén → APP-{id}/APP-{id}.xlsx + APP-{id}/tai-lieu/
 */
export async function downloadApplicationDetail(
  app: Application,
): Promise<ApplicationDetailExportResult> {
  const folderName = getAppExportFolderName(app.applicationId);

  const [applicantResult, scoresResult] = await Promise.allSettled([
    getApplicantById(app.applicantId),
    getApplicantScores(app.applicantId),
  ]);

  const applicant =
    applicantResult.status === "fulfilled" ? applicantResult.value : null;

  let score: Score | null = null;
  if (scoresResult.status === "fulfilled" && scoresResult.value.success) {
    score = pickPrimaryScore(scoresResult.value.data);
  }

  const wb = buildWorkbook(app, applicant, score);
  const excelBuffer = XLSX.write(wb, {
    bookType: "xlsx",
    type: "array",
  }) as ArrayBuffer;

  const documents = app.documents ?? [];
  const { zipBlob, documentsOk, documentFailures } = await buildExportZip(
    folderName,
    excelBuffer,
    documents,
  );

  triggerBrowserDownload(zipBlob, `${folderName}.zip`);

  return {
    folderName,
    documentsOk,
    documentFailures,
  };
}
