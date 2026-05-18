import * as Yup from "yup";
import type { Rule } from "antd/es/form";
import { createYupAntdRule } from "./yupForm";

export const PASSWORD_MIN_LENGTH = 8;
export const PASSWORD_MAX_LENGTH = 100;

export type PasswordRequirement = {
  key: string;
  label: string;
  test: (value: string) => boolean;
};

/** Các tiêu chí hiển thị trên checklist (không gồm max — xử lý qua Yup). */
export const PASSWORD_STRENGTH_REQUIREMENTS: PasswordRequirement[] = [
  {
    key: "length",
    label: `Ít nhất ${PASSWORD_MIN_LENGTH} ký tự`,
    test: (v) => v.length >= PASSWORD_MIN_LENGTH,
  },
  {
    key: "lower",
    label: "Ít nhất một chữ thường (a–z)",
    test: (v) => /[a-z]/.test(v),
  },
  {
    key: "upper",
    label: "Ít nhất một chữ hoa (A–Z)",
    test: (v) => /[A-Z]/.test(v),
  },
  {
    key: "digit",
    label: "Ít nhất một chữ số (0–9)",
    test: (v) => /\d/.test(v),
  },
];

const passwordRules = {
  min: PASSWORD_MIN_LENGTH,
  minMessage: "Mật khẩu phải có ít nhất 8 ký tự",
  max: PASSWORD_MAX_LENGTH,
  maxMessage: "Mật khẩu không được vượt quá 100 ký tự",
  lowerMessage: "Phải có ít nhất một chữ thường",
  upperMessage: "Phải có ít nhất một chữ hoa",
  digitMessage: "Phải có ít nhất một chữ số",
};

function buildPasswordSchema(requiredMessage: string) {
  return Yup.string()
    .required(requiredMessage)
    .min(passwordRules.min, passwordRules.minMessage)
    .max(passwordRules.max, passwordRules.maxMessage)
    .matches(/[a-z]/, passwordRules.lowerMessage)
    .matches(/[A-Z]/, passwordRules.upperMessage)
    .matches(/\d/, passwordRules.digitMessage);
}

export const passwordYupSchema = buildPasswordSchema("Vui lòng nhập mật khẩu");

export const newPasswordYupSchema = buildPasswordSchema(
  "Vui lòng nhập mật khẩu mới",
);

export const loginPasswordYupSchema = Yup.string()
  .required("Vui lòng nhập mật khẩu")
  .max(PASSWORD_MAX_LENGTH, "Mật khẩu không được vượt quá 100 ký tự");

export const passwordFormRules: Rule[] = [createYupAntdRule(passwordYupSchema)];
export const newPasswordFormRules: Rule[] = [
  createYupAntdRule(newPasswordYupSchema),
];
export const loginPasswordFormRules: Rule[] = [
  createYupAntdRule(loginPasswordYupSchema),
];

export type PasswordStrength = {
  score: number;
  label: string;
  color: string;
};

export function getPasswordStrength(value: string): PasswordStrength {
  if (!value) {
    return { score: 0, label: "", color: "#d9d9d9" };
  }

  if (value.length > PASSWORD_MAX_LENGTH) {
    return { score: 0, label: "Quá dài", color: "#ff4d4f" };
  }

  const met = PASSWORD_STRENGTH_REQUIREMENTS.filter((r) => r.test(value)).length;
  const total = PASSWORD_STRENGTH_REQUIREMENTS.length;
  const score = Math.round((met / total) * 100);

  if (met <= 1) {
    return { score: Math.max(score, 20), label: "Yếu", color: "#ff4d4f" };
  }
  if (met === 2) {
    return { score: Math.max(score, 45), label: "Trung bình", color: "#fa8c16" };
  }
  if (met === 3) {
    return { score: Math.max(score, 70), label: "Khá", color: "#faad14" };
  }
  return { score: 100, label: "Mạnh", color: "#52c41a" };
}

export function getRequirementStatus(value: string) {
  return PASSWORD_STRENGTH_REQUIREMENTS.map((req) => ({
    ...req,
    met: req.test(value),
  }));
}
