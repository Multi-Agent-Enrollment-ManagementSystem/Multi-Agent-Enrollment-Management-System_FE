import { Tabs, Typography } from "antd";
import type { FormInstance } from "antd";
import type {
  AuthApiErrorState,
  LoginFormValues,
  RegisterFormValues,
} from "../types";
import { LoginForm } from "./LoginForm";
import { RegisterForm } from "./RegisterForm";

const { Title } = Typography;

type AuthCredentialsPanelProps = {
  activeTab: string;
  onTabChange: (tab: string) => void;
  loginForm: FormInstance<LoginFormValues>;
  registerForm: FormInstance<RegisterFormValues>;
  loading: boolean;
  loginError: AuthApiErrorState | null;
  registerError: AuthApiErrorState | null;
  onLogin: (values: LoginFormValues) => void;
  onRegister: (values: RegisterFormValues) => void;
  onForgotPassword: () => void;
};

/** Khối tab Đăng nhập / Đăng ký trên card auth chính. */
export function AuthCredentialsPanel({
  activeTab,
  onTabChange,
  loginForm,
  registerForm,
  loading,
  loginError,
  registerError,
  onLogin,
  onRegister,
  onForgotPassword,
}: AuthCredentialsPanelProps) {
  return (
    <>
      <Title level={3} className="!text-slate-900 !mb-6 !text-center">
        Tài khoản
      </Title>

      <Tabs
        activeKey={activeTab}
        onChange={onTabChange}
        className="auth-tabs [&_.ant-tabs-nav]:mb-6 [&_.ant-tabs-tab]:py-2 [&_.ant-tabs-ink-bar]:bg-orange-500"
        items={[
          {
            key: "login",
            label: <span className="font-medium">Đăng nhập</span>,
            children: (
              <LoginForm
                form={loginForm}
                loading={loading}
                error={loginError}
                onSubmit={onLogin}
                onForgotPassword={onForgotPassword}
              />
            ),
          },
          {
            key: "register",
            label: <span className="font-medium">Đăng ký</span>,
            children: (
              <RegisterForm
                form={registerForm}
                loading={loading}
                error={registerError}
                onSubmit={onRegister}
              />
            ),
          },
        ]}
      />
    </>
  );
}
