import { useEffect, useRef, useState } from "react";
import { Form, message } from "antd";
import { useNavigate } from "react-router-dom";
import * as authApi from "../../../api/auth";
import { useAuth } from "../../../auth";
import {
  extractApiError,
  isEmailLike,
  type ResetPasswordApiResponse,
} from "../../../utils/authReset";
import { RESET_OTP_DURATION_SECONDS, ROLE_DASHBOARD } from "../constants";
import {
  VIEW_ORDER,
  type AuthApiErrorState,
  type AuthView,
  type LoginFormValues,
  type RegisterFormValues,
  type ResetRequestFormValues,
  type ResetVerifyFormValues,
} from "../types";

/** Hook tập trung state và handler cho trang auth — page chỉ lo layout và ghép view. */
export function useAuthPage() {
  const [loginForm] = Form.useForm<LoginFormValues>();
  const [registerForm] = Form.useForm<RegisterFormValues>();
  const [resetRequestForm] = Form.useForm<ResetRequestFormValues>();
  const [resetVerifyForm] = Form.useForm<ResetVerifyFormValues>();

  const [loading, setLoading] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("login");
  const [loginError, setLoginError] = useState<AuthApiErrorState | null>(null);
  const [registerError, setRegisterError] = useState<AuthApiErrorState | null>(
    null,
  );

  const [authView, setAuthView] = useState<AuthView>("auth");
  const prevViewRef = useRef<AuthView>("auth");

  const [isResetExpired, setIsResetExpired] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [remainingSeconds, setRemainingSeconds] = useState(0);
  const [verifyResult, setVerifyResult] =
    useState<ResetPasswordApiResponse | null>(null);
  const [resetError, setResetError] = useState<AuthApiErrorState | null>(null);

  const { setAuth } = useAuth();
  const navigate = useNavigate();

  const changeView = (next: AuthView) => {
    prevViewRef.current = authView;
    setAuthView(next);
  };

  const animClass =
    VIEW_ORDER[authView] >= VIEW_ORDER[prevViewRef.current]
      ? "auth-forward"
      : "auth-back";

  const resetPasswordState = () => {
    prevViewRef.current = authView;
    setAuthView("auth");
    setResetEmail("");
    setRemainingSeconds(0);
    setIsResetExpired(false);
    setVerifyResult(null);
    setResetError(null);
    resetRequestForm.resetFields();
    resetVerifyForm.resetFields();
  };

  useEffect(() => {
    if (remainingSeconds <= 0) return;
    const timer = window.setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev <= 1) {
          window.clearInterval(timer);
          setIsResetExpired(true);
          setResetError({
            message:
              "Mã OTP đã hết hạn sau 10 phút. Nhấn 'Gửi lại OTP' để nhận mã mới.",
            errors: [],
          });
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => window.clearInterval(timer);
  }, [remainingSeconds]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setLoginError(null);
    setRegisterError(null);
  };

  const onLogin = async (values: LoginFormValues) => {
    setLoading(true);
    setLoginError(null);
    try {
      const res = await authApi.login(values);
      setAuth(
        res.user,
        res.token,
        res.refreshToken,
        res.accessTokenExpiresAt,
        res.refreshTokenExpiresAt,
      );
      message.success("Đăng nhập thành công");
      navigate(ROLE_DASHBOARD[res.user.role] ?? "/", { replace: true });
    } catch (err: unknown) {
      setLoginError(
        extractApiError(
          err,
          "Thông tin đăng nhập không hợp lệ — tên người dùng/email hoặc mật khẩu không chính xác.",
        ),
      );
      message.error("Đăng nhập thất bại");
    } finally {
      setLoading(false);
    }
  };

  const onRegister = async (values: RegisterFormValues) => {
    setLoading(true);
    setRegisterError(null);
    try {
      await authApi.register(values);
      message.success(
        "Đăng ký tài khoản thành công! Vui lòng kiểm tra email để xác nhận tài khoản.",
      );
      registerForm.resetFields();
      setActiveTab("login");
    } catch (err: unknown) {
      setRegisterError(
        extractApiError(
          err,
          "Đăng ký tài khoản thất bại — vui lòng kiểm tra lại thông tin.",
        ),
      );
      message.error("Đăng ký thất bại");
    } finally {
      setLoading(false);
    }
  };

  const openResetFlow = () => {
    const userInput = loginForm.getFieldValue("usernameOrEmail");
    const prefillEmail = isEmailLike(userInput) ? userInput.trim() : "";
    setResetError(null);
    setVerifyResult(null);
    setIsResetExpired(false);
    setResetEmail(prefillEmail);
    resetRequestForm.setFieldsValue({ email: prefillEmail });
    changeView("reset-request");
  };

  const onResetRequest = async (values: ResetRequestFormValues) => {
    setResetLoading(true);
    setResetError(null);
    try {
      await authApi.requestResetPassword(values.email.trim());
      setResetEmail(values.email.trim());
      setRemainingSeconds(RESET_OTP_DURATION_SECONDS);
      setIsResetExpired(false);
      resetVerifyForm.resetFields();
      changeView("reset-verify");
      message.success(
        "Mã OTP đã được gửi về email của bạn. Vui lòng kiểm tra hộp thư.",
      );
    } catch (err: unknown) {
      setResetError(
        extractApiError(
          err,
          "Gửi mã OTP thất bại — vui lòng kiểm tra lại địa chỉ email.",
        ),
      );
      message.error("Gửi mã OTP thất bại");
    } finally {
      setResetLoading(false);
    }
  };

  const onResetVerify = async (values: ResetVerifyFormValues) => {
    if (isResetExpired || remainingSeconds <= 0) {
      setIsResetExpired(true);
      setResetError({
        message: "Mã OTP đã hết hạn. Vui lòng gửi lại yêu cầu reset.",
        errors: [],
      });
      return;
    }
    setResetLoading(true);
    setResetError(null);
    try {
      const res = await authApi.verifyResetPassword({
        email: resetEmail,
        otpCode: values.otpCode,
        newPassword: values.newPassword,
        confirmPassword: values.confirmPassword,
      });
      setVerifyResult(res);
      setRemainingSeconds(0);
      message.success("Đặt lại mật khẩu thành công");
    } catch (err: unknown) {
      setVerifyResult(null);
      setResetError(
        extractApiError(
          err,
          "Xác thực OTP hoặc đặt mật khẩu thất bại — vui lòng kiểm tra lại mã OTP và mật khẩu.",
        ),
      );
      message.error("Xác thực OTP thất bại");
    } finally {
      setResetLoading(false);
    }
  };

  const handleResendOtp = () => {
    prevViewRef.current = "reset-verify";
    setAuthView("reset-request");
    setIsResetExpired(false);
    setRemainingSeconds(0);
    setResetError(null);
    setVerifyResult(null);
    resetVerifyForm.resetFields();
    resetRequestForm.setFieldsValue({ email: resetEmail });
  };

  const backToResetRequest = () => {
    prevViewRef.current = "reset-verify";
    setAuthView("reset-request");
    setVerifyResult(null);
    setResetError(null);
    resetVerifyForm.resetFields();
    resetRequestForm.setFieldsValue({ email: resetEmail });
  };

  return {
    authView,
    animClass,
    activeTab,
    loading,
    resetLoading,
    loginForm,
    registerForm,
    resetRequestForm,
    resetVerifyForm,
    loginError,
    registerError,
    resetError,
    resetEmail,
    isResetExpired,
    remainingSeconds,
    verifyResult,
    handleTabChange,
    onLogin,
    onRegister,
    openResetFlow,
    onResetRequest,
    onResetVerify,
    handleResendOtp,
    backToResetRequest,
    resetPasswordState,
  };
}
