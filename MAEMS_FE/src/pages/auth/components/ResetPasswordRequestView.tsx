import { Button, Form, Input, Typography } from "antd";
import type { FormInstance } from "antd";
import type { AuthApiErrorState, ResetRequestFormValues } from "../types";
import { authFormClassName } from "../utils/authFormClassName";
import { AuthApiErrorAlert } from "./AuthApiErrorAlert";
import { ResetFlowHeader } from "./ResetFlowHeader";

const { Title, Text } = Typography;

type ResetPasswordRequestViewProps = {
  form: FormInstance<ResetRequestFormValues>;
  loading: boolean;
  error: AuthApiErrorState | null;
  onSubmit: (values: ResetRequestFormValues) => void;
  onBack: () => void;
};

/** Bước 1 flow quên mật khẩu: nhập email để nhận OTP. */
export function ResetPasswordRequestView({
  form,
  loading,
  error,
  onSubmit,
  onBack,
}: ResetPasswordRequestViewProps) {
  return (
    <>
      <ResetFlowHeader onBack={onBack} currentStep={0} />

      <Title level={4} className="!text-slate-900 !mb-1 !text-lg sm:!text-xl">
        Khôi phục mật khẩu
      </Title>
      <Text className="!text-slate-500 !text-sm block !mb-5">
        Nhập email tài khoản để nhận mã OTP.
      </Text>

      <AuthApiErrorAlert error={error} />

      <Form<ResetRequestFormValues>
        form={form}
        layout="vertical"
        requiredMark={false}
        onFinish={onSubmit}
        className={authFormClassName}
      >
        <Form.Item
          name="email"
          label={<Text strong>Email</Text>}
          rules={[
            { required: true, message: "Vui lòng nhập email" },
            { type: "email", message: "Email không hợp lệ" },
          ]}
        >
          <Input
            size="large"
            placeholder="Nhập email để nhận mã OTP"
            className="rounded-xl"
            autoComplete="email"
          />
        </Form.Item>

        <Button
          type="primary"
          htmlType="submit"
          loading={loading}
          block
          size="large"
          className="!bg-orange-500 !border-orange-500 hover:!bg-orange-600 hover:!border-orange-600 !rounded-xl !h-11"
        >
          Gửi mã OTP
        </Button>
      </Form>
    </>
  );
}
