import type { MessageInstance } from "antd/es/message/interface";
import type { AxiosError } from "axios";
import type { ApiWrapper } from "../types/api.wrapper";

/** Kết quả parse chuẩn từ ApiWrapper — dùng chung cho hiển thị và extract chuỗi. */
export type ParsedApiMessages = {
  message: string;
  errors: string[];
};

/** Trích `message` và `errors` từ body ApiWrapper (hoặc partial khi lỗi). */
export function parseApiWrapper(
  wrapper: Partial<ApiWrapper<unknown>> | undefined,
  fallbackMessage = "",
): ParsedApiMessages {
  const message = wrapper?.message?.trim() || fallbackMessage;
  const errors = (wrapper?.errors ?? [])
    .map((e) => e?.trim())
    .filter(Boolean) as string[];
  return { message, errors };
}

/** Đọc body ApiWrapper từ AxiosError — một điểm parse cho mọi request. */
export function parseAxiosApiError(
  error: unknown,
  fallbackMessage = "Đã xảy ra lỗi. Vui lòng thử lại.",
): ParsedApiMessages {
  const axiosErr = error as AxiosError<ApiWrapper<unknown>>;
  return parseApiWrapper(axiosErr.response?.data, fallbackMessage);
}

/**
 * Gộp lỗi thành một chuỗi (ưu tiên `errors[]`, sau đó `message`) —
 * tương thích các chỗ gọi `extractApiError` cũ.
 */
export function extractApiError(
  error: unknown,
  fallback = "Đã xảy ra lỗi. Vui lòng thử lại.",
): string {
  const { message, errors } = parseAxiosApiError(error, fallback);
  if (errors.length > 0) return errors.join(" | ");
  return message || fallback;
}

/** Hiển thị `message` từ ApiWrapper khi request thành công. */
export function showApiWrapperSuccess(
  messageApi: MessageInstance,
  wrapper: Pick<ApiWrapper<unknown>, "message">,
) {
  const text = wrapper.message?.trim();
  if (text) {
    messageApi.success(text);
  }
}

/** Hiển thị `message` và từng phần tử `errors` từ ApiWrapper khi thất bại. */
export function showApiWrapperFailure(
  messageApi: MessageInstance,
  wrapper: Partial<ApiWrapper<unknown>> | undefined,
  fallback?: string,
) {
  const { message, errors } = parseApiWrapper(wrapper, fallback ?? "");

  if (message) {
    messageApi.error(message);
  }
  errors.forEach((err) => messageApi.error(err));

  if (!message && errors.length === 0 && fallback) {
    messageApi.error(fallback);
  }
}

/** Bắt lỗi Axios và đọc body ApiWrapper nếu có. */
export function showAxiosApiFailure(
  messageApi: MessageInstance,
  error: unknown,
  fallback = "Đã xảy ra lỗi. Vui lòng thử lại.",
) {
  const axiosErr = error as AxiosError<ApiWrapper<unknown>>;
  showApiWrapperFailure(messageApi, axiosErr.response?.data, fallback);
}
