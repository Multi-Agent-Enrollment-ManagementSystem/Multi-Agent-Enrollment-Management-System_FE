import * as Yup from "yup";
import type { Rule } from "antd/es/form";
import { createYupAntdRule } from "./yupForm";

export const EMAIL_MAX_LENGTH = 100;

/**
 * Chặt hơn Yup.email() (HTML5): bắt buộc có @ và domain có ít nhất một dấu chấm + TLD ≥ 2 chữ.
 * Ví dụ: user@domain.com — từ chối abc@xyz (thiếu .com/.vn...).
 */
export const EMAIL_PATTERN =
  /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export const emailYupSchema = Yup.string()
  .required("Vui lòng nhập email")
  // Một test tuần tự: Yup chạy .max() và .email() song song nên lỗi độ dài có thể bị che bởi lỗi định dạng.
  .test("email-rules", "", function (value) {
    if (value == null || value === "") return true;

    if (value.length > EMAIL_MAX_LENGTH) {
      return this.createError({
        message: `Email không được vượt quá ${EMAIL_MAX_LENGTH} ký tự`,
      });
    }

    if (!EMAIL_PATTERN.test(value)) {
      return this.createError({ message: "Email không hợp lệ" });
    }

    return true;
  });export const emailFormRules: Rule[] = [createYupAntdRule(emailYupSchema)];
