import * as Yup from "yup";
import type { Rule } from "antd/es/form";
import { createYupAntdRule } from "./yupForm";

/** Chỉ chữ cái (a–z, A–Z), chữ số và dấu gạch dưới. */
export const USERNAME_PATTERN = /^[a-zA-Z0-9_]+$/;

export const USERNAME_MIN_LENGTH = 3;
export const USERNAME_MAX_LENGTH = 50;

export const usernameYupSchema = Yup.string()
  .required("Vui lòng nhập tên đăng nhập")
  // Không trim: nếu trim trước thì "s " thành "s" và lọt qua pattern/min một cách sai.
  .test(
    "no-edge-whitespace",
    "Tên đăng nhập không được có khoảng trắng ở đầu hoặc cuối",
    (value) => value == null || value === value.trim(),
  )
  .min(
    USERNAME_MIN_LENGTH,
    `Tên đăng nhập phải có ít nhất ${USERNAME_MIN_LENGTH} ký tự`,
  )
  .max(
    USERNAME_MAX_LENGTH,
    `Tên đăng nhập không được vượt quá ${USERNAME_MAX_LENGTH} ký tự`,
  )
  .matches(
    USERNAME_PATTERN,
    "Tên đăng nhập chỉ được chứa chữ cái, chữ số và dấu gạch dưới (_)",
  );

export const usernameFormRules: Rule[] = [createYupAntdRule(usernameYupSchema)];
