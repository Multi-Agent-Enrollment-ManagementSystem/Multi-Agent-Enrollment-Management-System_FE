import type { AuthRole } from "../../types/auth";

/** Đường dẫn dashboard sau đăng nhập theo vai trò người dùng. */
export const ROLE_DASHBOARD: Record<AuthRole, string> = {
  applicant: "/applicant/dashboard",
  admin: "/admin/dashboard",
  officer: "/officer/dashboard",
  qa: "/qa/review-evaluation",
};

/** Thời gian hiệu lực mã OTP reset mật khẩu (giây). */
export const RESET_OTP_DURATION_SECONDS = 600;
