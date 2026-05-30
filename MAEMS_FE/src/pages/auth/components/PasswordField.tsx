import { useState, type ChangeEvent } from "react";
import { Input, Progress, Typography } from "antd";
import type { InputProps } from "antd";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import {
  getPasswordStrength,
  getRequirementStatus,
} from "../../../utils/passwordValidation";

const { Text } = Typography;

type PasswordFieldProps = Omit<InputProps, "value" | "onChange"> & {
  value?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  /** Hiển thị thanh độ mạnh và checklist yêu cầu (dùng khi tạo/đổi mật khẩu). */
  showStrengthMeter?: boolean;
};

export function PasswordField({
  value = "",
  onChange,
  showStrengthMeter = false,
  ...inputProps
}: PasswordFieldProps) {
  const [focused, setFocused] = useState(false);
  const password = value ?? "";
  const strength = getPasswordStrength(password);
  const requirements = getRequirementStatus(password);
  const showHints = showStrengthMeter && (focused || password.length > 0);

  return (
    <div>
      <Input.Password
        value={value}
        onChange={onChange}
        onFocus={(e) => {
          setFocused(true);
          inputProps.onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocused(false);
          inputProps.onBlur?.(e);
        }}
        {...inputProps}
      />

      {showStrengthMeter && password.length > 0 && (
        <div className="mt-2 space-y-1">
          <div className="flex items-center justify-between gap-2">
            <Progress
              percent={strength.score}
              showInfo={false}
              strokeColor={strength.color}
              size="small"
              className="!mb-0 flex-1"
            />
            {strength.label && (
              <Text
                className="!text-xs whitespace-nowrap"
                style={{ color: strength.color }}
              >
                {strength.label}
              </Text>
            )}
          </div>
        </div>
      )}

      {showHints && (
        <ul className="mt-2 space-y-1" aria-live="polite">
          {requirements.map((req) => (
            <li
              key={req.key}
              className="flex items-start gap-1.5 text-xs leading-snug"
            >
              {req.met ? (
                <CheckOutlined className="!text-green-600 mt-0.5 flex-shrink-0" />
              ) : (
                <CloseOutlined className="!text-slate-300 mt-0.5 flex-shrink-0" />
              )}
              <span className={req.met ? "text-green-700" : "text-slate-500"}>
                {req.label}
              </span>
            </li>
          ))}
          <li className="flex items-start gap-1.5 text-xs leading-snug text-slate-500 pl-0">
            <span className="w-3.5 flex-shrink-0" />
            Tối đa 100 ký tự
          </li>
        </ul>
      )}
    </div>
  );
}
