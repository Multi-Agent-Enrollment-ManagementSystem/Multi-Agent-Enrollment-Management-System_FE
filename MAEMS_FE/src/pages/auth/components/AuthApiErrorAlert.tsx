import { Alert } from "antd";
import type { AuthApiErrorState } from "../types";

type AuthApiErrorAlertProps = {
  error: AuthApiErrorState | null;
};

/** Alert lỗi API thống nhất cho các form trên trang auth. */
export function AuthApiErrorAlert({ error }: AuthApiErrorAlertProps) {
  if (!error) return null;

  return (
    <Alert
      type="error"
      showIcon
      className="rounded-xl !mb-4 [&_.ant-alert-message]:!break-words [&_.ant-alert-description]:!break-words"
      message={error.message}
      description={
        error.errors.length > 0 ? (
          <ul className="list-disc pl-4 text-sm space-y-1 mt-1">
            {error.errors.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        ) : undefined
      }
    />
  );
}
