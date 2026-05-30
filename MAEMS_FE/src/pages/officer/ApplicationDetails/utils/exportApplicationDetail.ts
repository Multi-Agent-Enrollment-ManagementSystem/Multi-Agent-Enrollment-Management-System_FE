import * as XLSX from "xlsx";
import { getApplicantById } from "../../../../api/applicants";
import { getApplicantScores } from "../../../../api/scores";
import type { CreateApplicantResponse } from "../../../../types/applicant";
import type { Application } from "../../../../types/application";
import type { Document } from "../../../../types/document";
import type { Score } from "../../../../types/score";
import { pickPrimaryScore } from "../../../../utils/scoreDisplay";

const APP_FILE_PREFIX = "APP";

export function getAppExportFileName(applicationId: number): string {
  return `${APP_FILE_PREFIX}-${applicationId}.xlsx`;
}

/** Một object API → một sheet (header = tên field, value = giá trị gốc) */
function sheetFromApiRow<T extends object>(row: T): XLSX.WorkSheet {
  return XLSX.utils.json_to_sheet([row]);
}

function buildWorkbook(
  applicationRow: Omit<Application, "documents">,
  documents: Document[],
  applicant: CreateApplicantResponse | null,
  score: Score | null,
): XLSX.WorkBook {
  const wb = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(
    wb,
    sheetFromApiRow(applicationRow),
    "Application",
  );

  if (applicant) {
    XLSX.utils.book_append_sheet(wb, sheetFromApiRow(applicant), "Applicant");
  }

  if (score) {
    XLSX.utils.book_append_sheet(wb, sheetFromApiRow(score), "Scores");
  }

  if (documents.length > 0) {
    XLSX.utils.book_append_sheet(
      wb,
      XLSX.utils.json_to_sheet(documents),
      "Documents",
    );
  }

  return wb;
}

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

export type ApplicationDetailExportResult = {
  fileName: string;
};

/**
 * Tải Excel: ghi nguyên field/value từ API (không dịch, không tải file tài liệu).
 */
export async function downloadApplicationDetail(
  app: Application,
): Promise<ApplicationDetailExportResult> {
  const fileName = getAppExportFileName(app.applicationId);

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

  const { documents, ...applicationRow } = app;

  const wb = buildWorkbook(
    applicationRow,
    documents ?? [],
    applicant,
    score,
  );

  const excelBuffer = XLSX.write(wb, {
    bookType: "xlsx",
    type: "array",
  }) as ArrayBuffer;

  triggerBrowserDownload(
    new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    }),
    fileName,
  );

  return { fileName };
}
