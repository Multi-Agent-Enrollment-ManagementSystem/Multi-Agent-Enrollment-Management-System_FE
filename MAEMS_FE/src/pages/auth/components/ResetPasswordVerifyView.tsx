import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { Alert, Button, Form, Input, Tag, Typography } from "antd";
import type { FormInstance } from "antd";
import {
  formatCountdown,
  type ResetPasswordApiResponse,
} from "../../../utils/authReset";
import { newPasswordFormRules } from "../../../utils/passwordValidation";
import type { AuthApiErrorState, ResetVerifyFormValues } from "../types";
import { authFormClassName } from "../utils/authFormClassName";
import { AuthApiErrorAlert } from "./AuthApiErrorAlert";
import { PasswordField } from "./PasswordField";
import { ResetFlowHeader } from "./ResetFlowHeader";

const { Title, Text } = Typography;

type ResetPasswordVerifyViewProps = {
  form: FormInstance<ResetVerifyFormValues>;
  resetEmail: string;
  loading: boolean;
  isExpired: boolean;
  remainingSeconds: number;
  verifyResult: ResetPasswordApiResponse | null;
  error: AuthApiErrorState | null;
  onSubmit: (values: ResetVerifyFormValues) => void;
  onBack: () => void;
  onResendOtp: () => void;
  onGoToLogin: () => void;
};

/** Bước 2 flow quên mật khẩu: xác thực OTP và đặt mật khẩu mới. */
export function ResetPasswordVerifyView({
  form,
  resetEmail,
  loading,
  isExpired,
  remainingSeconds,
  verifyResult,
  error,
  onSubmit,
  onBack,
  onResendOtp,
  onGoToLogin,
}: ResetPasswordVerifyViewProps) {
  return (
    <>
      <ResetFlowHeader onBack={onBack} currentStep={1} />

      <Title level={4} className="!text-slate-900 !mb-1 !text-lg sm:!text-xl">
        Xác thực OTP
      </Title>
      <Text className="!text-slate-500 !text-sm block !mb-3">
        Mã OTP đã gửi tới{" "}
        <strong className="text-slate-700 font-medium break-all">
          {resetEmail}
        </strong>
      </Text>

      <div className="mb-4">
        {isExpired ? (
          <Tag
            icon={<ExclamationCircleOutlined />}
            color="error"
            className="!rounded-full !px-3 !py-0.5 !text-sm"
          >
            Mã OTP đã hết hạn
          </Tag>
        ) : (
          <Tag
            icon={<ClockCircleOutlined />}
            color={remainingSeconds <= 60 ? "warning" : "processing"}
            className="!rounded-full !px-3 !py-0.5 !text-sm !font-mono"
          >
            {formatCountdown(remainingSeconds)} còn lại
          </Tag>
        )}
      </div>

      {verifyResult && (
        <Alert
          type="success"
          showIcon
          icon={<CheckCircleOutlined />}
          className="rounded-xl !mb-4 [&_.ant-alert-message]:!break-words"
          message="Đặt lại mật khẩu thành công"
          description={
            <Button
              type="link"
              className="!px-0 !h-auto !text-sm"
              onClick={onGoToLogin}
            >
              Đăng nhập ngay →
            </Button>
          }
        />
      )}

      <AuthApiErrorAlert error={error} />

      <Form<ResetVerifyFormValues>
        form={form}
        layout="vertical"
        requiredMark={false}
        onFinish={onSubmit}
        className={authFormClassName}
      >
        <Form.Item
          name="otpCode"
          label={<Text strong>Mã OTP</Text>}
          rules={[
            { required: true, message: "Vui lòng nhập mã OTP" },
            { len: 6, message: "Mã OTP gồm 6 ký tự" },
          ]}
        >
          <Input.OTP
            length={6}
            size="large"
            disabled={isExpired}
            inputMode="numeric"
            className="!w-full [&_.ant-otp]:!w-full [&_.ant-otp]:!gap-1.5 sm:[&_.ant-otp]:!gap-2 [&_.ant-otp-input]:!flex-1 [&_.ant-otp-input]:!min-w-0 [&_.ant-otp-input]:!rounded-xl [&_.ant-otp-input]:!font-mono [&_.ant-otp-input]:!text-base [&_.ant-otp-input]:!h-11 sm:[&_.ant-otp-input]:!h-12"
          />
        </Form.Item>

        <Form.Item
          name="newPassword"
          label={<Text strong>Mật khẩu mới</Text>}
          rules={newPasswordFormRules}
          validateTrigger={["onChange", "onBlur"]}
        >
          <PasswordField
            size="large"
            placeholder="Nhập mật khẩu mới"
            className="rounded-xl"
            disabled={isExpired}
            showStrengthMeter
            autoComplete="new-password"
          />
        </Form.Item>

        <Form.Item
          name="confirmPassword"
          label={<Text strong>Xác nhận mật khẩu mới</Text>}
          dependencies={["newPassword"]}
          rules={[
            { required: true, message: "Vui lòng xác nhận mật khẩu mới" },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("newPassword") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error(
                    "Mật khẩu xác nhận không trùng khớp với mật khẩu mới",
                  ),
                );
              },
            }),
          ]}
        >
          <Input.Password
            size="large"
            placeholder="Nhập lại mật khẩu mới"
            className="rounded-xl"
            disabled={isExpired}
            autoComplete="new-password"
          />
        </Form.Item>

        <div className="flex flex-col gap-2 sm:flex-row sm:justify-between sm:items-center">
          {isExpired && (
            <Button
              type="default"
              onClick={onResendOtp}
              block
              className="!rounded-xl !h-11 sm:!w-auto sm:!flex-none"
            >
              Gửi lại OTP
            </Button>
          )}
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            disabled={isExpired || !!verifyResult}
            size="large"
            block
            className="!bg-orange-500 !border-orange-500 hover:!bg-orange-600 hover:!border-orange-600 !rounded-xl !h-11 disabled:!opacity-40 sm:!flex-1"
          >
            Xác thực và đổi mật khẩu
          </Button>
        </div>
      </Form>
    </>
  );
}
