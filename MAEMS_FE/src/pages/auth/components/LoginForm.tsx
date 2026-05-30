import { Button, Divider, Form, Input, Typography } from "antd";
import type { FormInstance } from "antd";
import { GoogleLoginButton } from "../../../components/GoogleLoginButton";
import { loginPasswordFormRules } from "../../../utils/passwordValidation";
import type { AuthApiErrorState, LoginFormValues } from "../types";
import { AuthApiErrorAlert } from "./AuthApiErrorAlert";
import { PasswordField } from "./PasswordField";

const { Text } = Typography;

type LoginFormProps = {
  form: FormInstance<LoginFormValues>;
  loading: boolean;
  error: AuthApiErrorState | null;
  onSubmit: (values: LoginFormValues) => void;
  onForgotPassword: () => void;
};

/** Form đăng nhập — chỉ UI và validation, logic gọi API nằm ở page/hook. */
export function LoginForm({
  form,
  loading,
  error,
  onSubmit,
  onForgotPassword,
}: LoginFormProps) {
  return (
    <Form<LoginFormValues>
      form={form}
      layout="vertical"
      requiredMark={false}
      onFinish={onSubmit}
      className="[&_.ant-form-item]:mb-4"
    >
      <Form.Item
        name="usernameOrEmail"
        label={<Text strong>Tên đăng nhập hay email</Text>}
        rules={[
          {
            required: true,
            message: "Vui lòng nhập tên đăng nhập hoặc email",
          },
        ]}
      >
        <Input
          placeholder="Nhập tên đăng nhập"
          size="large"
          className="rounded-lg"
        />
      </Form.Item>

      <Form.Item
        name="password"
        label={<Text strong>Mật khẩu</Text>}
        rules={loginPasswordFormRules}
      >
        <PasswordField
          placeholder="Nhập mật khẩu"
          size="large"
          className="rounded-lg"
          autoComplete="current-password"
        />
      </Form.Item>

      <Form.Item className="!mb-2 !-mt-2">
        <Button
          type="link"
          onClick={onForgotPassword}
          className="!px-0 !h-auto !text-xs !font-normal !text-slate-400 hover:!text-slate-500 transition-colors"
        >
          Quên mật khẩu?
        </Button>
      </Form.Item>

      <AuthApiErrorAlert error={error} />

      <Form.Item className="!mb-0 !pt-2">
        <Button
          type="primary"
          htmlType="submit"
          size="large"
          block
          loading={loading}
          className="!bg-orange-500 !border-orange-500 hover:!bg-orange-600 hover:!border-orange-600 !rounded-lg !h-11"
        >
          Đăng nhập
        </Button>
      </Form.Item>

      <Divider plain className="!my-4 !text-gray-400">
        hoặc
      </Divider>
      <GoogleLoginButton />
    </Form>
  );
}
