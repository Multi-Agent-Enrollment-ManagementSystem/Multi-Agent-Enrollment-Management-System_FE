export type AuthRole = "admin" | "staff" | "qa" | "applicant" | "guest";

export type AuthUser = {
  username: string;
  email: string;
  role: AuthRole;
};

export type LoginRequest = {
  usernameOrEmail: string;
  password: string;
};

export type RegisterRequest = {
  username: string;
  email: string;
  password: string;
};

export type LoginResponse = {
  token: string;
  refreshToken: string;
  user: AuthUser;
};
