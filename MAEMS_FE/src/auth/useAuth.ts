import { useAuthStore } from "./authStore";

/** Hook tiện ích bọc auth store — dùng ở component thay vì gọi store trực tiếp khi chỉ cần API đơn giản. */
export function useAuth() {
  const { user, token, refreshToken, setAuth, logout, initAuth, isInitialized } =
    useAuthStore();

  return {
    user,
    token,
    refreshToken,
    isAuthenticated: !!token && !!user,
    setAuth,
    logout,
    initAuth,
    isInitialized,
  };
}
