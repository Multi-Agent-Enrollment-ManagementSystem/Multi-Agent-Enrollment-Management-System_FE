import { fetchAllApplicationsComplete } from "@/utils/fetchAllApplicationsComplete";

/** Tải toàn bộ hồ sơ cho thống kê dashboard — không sort (thứ tự không ảnh hưởng aggregate). */
export async function loadOfficerDashboardApplications() {
  const result = await fetchAllApplicationsComplete();
  return result.items;
}
