import { apiClient } from "@/services/axios";
import type {
  ApplicationMe,
  SubmitApplicationFinalResponse,
} from "@/types/application";
import type { ApiWrapper } from "@/types/api.wrapper";

/** Kết quả fetch `/me` kèm metadata ApiWrapper — dùng feedback message cho user. */
export type FetchMyApplicationsResult = {
  items: ApplicationMe[];
  wrapper: Pick<ApiWrapper<ApplicationMe[]>, "success" | "message" | "errors">;
};

/**
 * Lấy danh sách đơn của ứng viên — trả cả wrapper để hiển thị message success/error.
 */
export async function fetchMyApplicationsForList(): Promise<FetchMyApplicationsResult> {
  const res = await apiClient.get<ApiWrapper<ApplicationMe[]>>(
    "/api/Applications/me",
  );
  return {
    items: res.data.data ?? [],
    wrapper: {
      success: res.data.success,
      message: res.data.message,
      errors: res.data.errors ?? [],
    },
  };
}

/** Nộp đơn cuối cùng — giữ endpoint global, bọc tại feature api. */
export async function submitApplicationFinalForList(
  id: number,
): Promise<SubmitApplicationFinalResponse> {
  const res = await apiClient.post<
    ApiWrapper<SubmitApplicationFinalResponse>
  >(`/api/Applications/${id}/submit`, null, {
    headers: { "Content-Type": "application/json" },
  });
  return res.data.data;
}
