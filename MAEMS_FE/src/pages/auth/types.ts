/** Kiểu lỗi API chuẩn hóa để hiển thị inline trong form auth. */
export type AuthApiErrorState = {
  message: string;
  errors: string[];
};

export type LoginFormValues = {
  usernameOrEmail: string;
  password: string;
};

export type RegisterFormValues = {
  username: string;
  email: string;
  password: string;
};

export type ResetRequestFormValues = {
  email: string;
};

export type ResetVerifyFormValues = {
  otpCode: string;
  newPassword: string;
  confirmPassword: string;
};

/** Thứ tự view dùng cho animation tiến/lùi giữa đăng nhập và flow quên mật khẩu. */
export const VIEW_ORDER = {
  auth: 0,
  "reset-request": 1,
  "reset-verify": 2,
} as const;

export type AuthView = keyof typeof VIEW_ORDER;
