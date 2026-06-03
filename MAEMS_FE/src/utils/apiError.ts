/**
 * Re-export từ apiFeedback — tránh trùng logic parse lỗi.
 * Import trực tiếp từ `@/utils/apiFeedback` cho code mới.
 */
export {
  extractApiError,
  parseApiWrapper,
  parseAxiosApiError,
  type ParsedApiMessages,
} from "./apiFeedback";
