import type { ApplicationMe } from "@/types/application";

/**
 * `/me` không có programId — lọc theo tên hiển thị;
 * tiền tố tránh trùng key giữa các chiều lọc.
 */
export function meProgramFilterKey(a: ApplicationMe): string {
  const t = (a.programName || "").trim();
  return t ? `p:${t}` : `p:#${a.applicationId}`;
}

export function meCampusFilterKey(a: ApplicationMe): string {
  const t = (a.campusName || "").trim();
  return t ? `c:${t}` : `c:#${a.applicationId}`;
}

export function meAdmissionFilterKey(a: ApplicationMe): string {
  const t = (a.admissionTypeName || "").trim();
  return t ? `a:${t}` : `a:#${a.applicationId}`;
}

export function meProgramOptionLabel(a: ApplicationMe): string {
  const t = (a.programName || "").trim();
  return t || `Chương trình — đơn #${a.applicationId}`;
}

export function meCampusOptionLabel(a: ApplicationMe): string {
  const t = (a.campusName || "").trim();
  return t || `Cơ sở — đơn #${a.applicationId}`;
}

export function meAdmissionOptionLabel(a: ApplicationMe): string {
  const t = (a.admissionTypeName || "").trim();
  return t || `Loại xét tuyển — đơn #${a.applicationId}`;
}
