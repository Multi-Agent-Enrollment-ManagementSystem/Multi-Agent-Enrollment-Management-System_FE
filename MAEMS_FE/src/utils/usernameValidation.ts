import * as Yup from "yup";
import type { Rule } from "antd/es/form";
import { createYupAntdRule } from "./yupForm";

/** Chỉ chữ cái (a–z, A–Z), chữ số và dấu gạch dưới. */
export const USERNAME_PATTERN = /^[a-zA-Z0-9_]+$/;

export const usernameYupSchema = Yup.string()
  .required("Vui lòng nhập tên đăng nhập")
  .trim()
  .matches(
    USERNAME_PATTERN,
    "Tên đăng nhập chỉ được chứa chữ cái, chữ số và dấu gạch dưới (_)",
  );

export const usernameFormRules: Rule[] = [createYupAntdRule(usernameYupSchema)];
