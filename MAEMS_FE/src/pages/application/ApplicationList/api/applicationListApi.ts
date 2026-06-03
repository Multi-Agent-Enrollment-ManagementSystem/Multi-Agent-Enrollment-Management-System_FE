/**
 * Lớp API riêng cho trang danh sách đơn của ứng viên —
 * tách biên feature khỏi api global, dễ mock/test sau này.
 */
export {
  fetchMyApplications,
  submitApplicationFinal,
} from "@/api/applications";
