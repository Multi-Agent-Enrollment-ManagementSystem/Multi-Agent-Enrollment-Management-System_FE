import { fetchAllApplications } from "@/api/applications";

/** Tải toàn bộ hồ sơ cho dashboard (thống kê client-side). */
export async function loadOfficerDashboardApplications() {
  const result = await fetchAllApplications();
  return result.items;
}
