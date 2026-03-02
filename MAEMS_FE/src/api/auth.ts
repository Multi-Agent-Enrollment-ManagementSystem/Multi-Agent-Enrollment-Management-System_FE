import { apiClient } from "../services/axios";
import type {
  AuthRole,
  AuthUser,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
} from "../types/auth";

type ApiWrapper<T> = {
  success: boolean;
  message: string;
  data: T;
  errors: string[];
};

type ApiLoginData = {
  accessToken: string;
  refreshToken: string;
  user: { username: string; email: string; role: string };
};

type ApiProfileData = {
  username: string;
  email: string;
  roleName: string;
  createdAt: string;
};

export async function login(data: LoginRequest): Promise<LoginResponse> {
  const res = await apiClient.post<ApiWrapper<ApiLoginData>>(
    "/api/Users/login",
    data
  );
  const { accessToken, refreshToken, user } = res.data.data;
  return {
    token: accessToken,
    refreshToken,
    user: {
      username: user.username,
      email: user.email,
      role: (user.role?.toLowerCase() ?? "applicant") as AuthRole,
    },
  };
}

export async function register(data: RegisterRequest): Promise<LoginResponse> {
  const res = await apiClient.post<ApiWrapper<ApiLoginData>>(
    "/api/Users/register",
    data
  );
  const { accessToken, refreshToken, user } = res.data.data;
  return {
    token: accessToken,
    refreshToken,
    user: {
      username: user.username,
      email: user.email,
      role: (user.role?.toLowerCase() ?? "applicant") as AuthRole,
    },
  };
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  try {
    const res = await apiClient.get<ApiWrapper<ApiProfileData>>(
      "/api/Users/profile"
    );
    const { username, email, roleName } = res.data.data;
    return {
      username,
      email,
      role: (roleName?.toLowerCase() ?? "applicant") as AuthRole,
    };
  } catch {
    return null;
  }
}
