import type dayjs from "dayjs";
import type { CreateApplicantRequest } from "@/types/applicant";

/** Giá trị form hồ sơ thí sinh — dayjs cho các trường ngày thay vì chuỗi ISO. */
export type ApplicantFormValues = Omit<
  CreateApplicantRequest,
  "dateOfBirth" | "idIssueDate" | "allowShare"
> & {
  dateOfBirth: dayjs.Dayjs;
  idIssueDate: dayjs.Dayjs;
};

/** Trạng thái từng file trong phiên upload đa tài liệu (tối đa 5 file). */
export type DocUploadItem = {
  uid: string;
  file: File;
  status: "idle" | "uploading" | "success" | "error";
  /** Thông báo lỗi chung từ field `message` của ApiWrapper. */
  errorMessage?: string;
  /** Chi tiết lỗi từ field `errors[]` của ApiWrapper. */
  errorDetails?: string[];
  /** URL blob xem trước ảnh cục bộ; cần revoke khi xóa item hoặc đóng modal. */
  previewUrl?: string;
};
