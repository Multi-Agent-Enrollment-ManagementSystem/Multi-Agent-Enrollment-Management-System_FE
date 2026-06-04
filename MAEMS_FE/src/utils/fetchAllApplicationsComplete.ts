import {
  fetchAllApplications,
  type FetchAllApplicationsParams,
} from "@/api/applications";
import type { Application } from "@/types/application";
import type { PagedResult } from "@/types/api.wrapper";

type FetchAllApplicationsCompleteParams = Omit<
  FetchAllApplicationsParams,
  "pageNumber" | "pageSize"
>;

export type FetchAllApplicationsCompleteOptions = {
  /** Giới hạn pageSize lần 2 (facet list dùng cap, dashboard thì không truyền). */
  maxPageSize?: number;
};

/**
 * Lấy đủ hồ sơ theo bộ lọc trong một trang phân trang.
 * Bước 1: pageSize=1 — payload nhỏ, chỉ cần totalCount (nhanh hơn pageSize=20).
 * Bước 2: pageSize = min(totalCount, maxPageSize?) — tải items; sort/filter chỉ truyền khi caller cần.
 */
export async function fetchAllApplicationsComplete(
  params?: FetchAllApplicationsCompleteParams,
  options?: FetchAllApplicationsCompleteOptions,
): Promise<PagedResult<Application>> {
  const probe = await fetchAllApplications({
    ...params,
    pageNumber: 1,
    pageSize: 1,
  });

  if (probe.totalCount === 0) {
    return { ...probe, items: [] };
  }

  const fullPageSize = options?.maxPageSize
    ? Math.min(probe.totalCount, options.maxPageSize)
    : probe.totalCount;

  if (fullPageSize <= probe.items.length) {
    return { ...probe, items: probe.items.slice(0, fullPageSize) };
  }

  return fetchAllApplications({
    ...params,
    pageNumber: 1,
    pageSize: fullPageSize,
  });
}
