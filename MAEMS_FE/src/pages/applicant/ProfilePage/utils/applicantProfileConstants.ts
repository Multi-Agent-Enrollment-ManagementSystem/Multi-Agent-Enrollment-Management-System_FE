import { DOCUMENT_STATUS } from "@/constants/labels";
import type { DocumentStatus } from "@/types/enums";

/** Các định dạng ảnh dùng để nhận diện thumbnail/preview tài liệu. */
export const IMAGE_FORMATS = [
  "jpg",
  "jpeg",
  "png",
  "gif",
  "webp",
  "bmp",
  "svg",
];

/** Nhãn màu cho badge trạng thái duyệt tài liệu — đồng bộ wording với constants toàn app. */
export const VERIFICATION_BADGE: Record<
  DocumentStatus,
  { color: string; label: string }
> = {
  pending: { color: "orange", label: DOCUMENT_STATUS.pending },
  verified: { color: "success", label: DOCUMENT_STATUS.verified },
  rejected: { color: "error", label: DOCUMENT_STATUS.rejected },
};

/** Danh sách loại tài liệu thí sinh có thể nộp kèm hồ sơ. */
export const DOC_TYPE_OPTIONS = [
  { value: "CCCD_FRONT", label: "CCCD/CMND mặt trước" },
  { value: "CCCD_BACK", label: "CCCD/CMND mặt sau" },
  { value: "HOC_BA", label: "Học bạ THPT bản gốc hoặc bản sao công chứng" },
  {
    value: "DGNL",
    label:
      "Bản sao chứng thực Giấy chứng nhận kết quả thi ĐGNL của ĐHQG TP.HCM năm 2026 (đạt từ 670/1200 điểm trở lên)",
  },
  {
    value: "THPT",
    label: "Giấy chứng nhận tốt nghiệp THPT hoặc bằng tốt nghiệp THPT",
  },
  {
    value: "THPT_RESULT",
    label: "Bản sao Giấy chứng nhận kết quả thi tốt nghiệp THPT năm 2026",
  },
  {
    value: "SCHOOL_RANK",
    label:
      "Giấy chứng nhận xếp hạng Top 50 SchoolRank tại schoolrank.fpt.edu.vn",
  },
  { value: "BIEN_LAI", label: "Biên lai nộp phí" },
  {
    value: "VAN_BANG",
    label:
      "Chứng chỉ ngoại ngữ quốc tế còn hiệu lực (không quá 2 năm tính đến 01/09/2026): IELTS Academic từ 6.0, hoặc TOEFL iBT từ 80, hoặc VSTEP bậc 4 trở lên, hoặc JLPT từ N3, hoặc TOPIK II cấp độ 4, hoặc HSK cấp độ 4 trở lên",
  },
  { value: "KHAC", label: "Tài liệu khác" },
];

/** Nhãn hiển thị vai trò tài khoản trên UI. */
export const ROLE_LABEL: Record<string, string> = {
  applicant: "Thí sinh",
  admin: "Quản trị viên",
  officer: "Nhân viên",
  qa: "Kiểm duyệt viên",
};
