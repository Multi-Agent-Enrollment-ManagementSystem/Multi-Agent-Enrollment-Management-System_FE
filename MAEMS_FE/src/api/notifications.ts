import { apiClient } from "../services/axios";
import type { ApiWrapper } from "../types/api.wrapper";
import type { Notification } from "../types/notification";

export async function getMyNotifications() {
  const res = await apiClient.get<ApiWrapper<Notification[]>>(
    "/api/Notifications/me",
  );
  return res.data.data;
}

export async function markNotificationAsRead(id: number) {
  const res = await apiClient.post<ApiWrapper<boolean>>(
    `/api/Notifications/${id}/read`,
  );
  return res.data.data;
}