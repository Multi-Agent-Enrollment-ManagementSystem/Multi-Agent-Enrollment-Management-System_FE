import { Button, Divider, Form, Input, Typography } from "antd";
import type { FormInstance } from "antd";
import { GoogleLoginButton } from "../../../components/GoogleLoginButton";
import { passwordFormRules } from "../../../utils/passwordValidation";
import { emailFormRules } from "../../../utils/emailValidation";
import { usernameFormRules } from "../../../utils/usernameValidation";
import type { AuthApiErrorState, RegisterFormValues } from "../types";
import { AuthApiErrorAlert } from "./AuthApiErrorAlert";
import { PasswordField } from "./PasswordField";

const { Text } = Typography;

type RegisterFormProps = {
  form: FormInstance<RegisterFormValues>;
  loading: boolean;
  error: AuthApiErrorState | null;
  onSubmit: (values: RegisterFormValues) => void;
};

/** Form đăng ký tài khoản applicant — UI thuần, không gọi API trực tiếp. */
export function RegisterForm({
  form,
  loading,
  error,
  onSubmit,
}: RegisterFormProps) {
  return (
    <Form<RegisterFormValues>
      form={form}
      layout="vertical"
      requiredMark={false}
      onFinish={onSubmit}
      className="[&_.ant-form-item]:mb-4"
    >
      <Form.Item
        name="username"
        label={<Text strong>Tên đăng nhập</Text>}
        rules={usernameFormRules}
        validateTrigger={["onChange", "onBlur"]}
      >
        <Input
          placeholder="Nhập tên đăng nhập"
          size="large"
          className="rounded-lg"
        />
      </Form.Item>

      <Form.Item
        name="email"
        label={<Text strong>Email</Text>}
        rules={emailFormRules}
        validateTrigger={["onChange", "onBlur"]}
      >
        <Input placeholder="Nhập email" size="large" className="rounded-lg" />
      </Form.Item>

      <Form.Item
        name="password"
        label={<Text strong>Mật khẩu</Text>}
        rules={passwordFormRules}
        validateTrigger={["onChange", "onBlur"]}
      >
        <PasswordField
          placeholder="Nhập mật khẩu"
          size="large"
          className="rounded-lg"
          showStrengthMeter
          autoComplete="new-password"
        />
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
          Đăng ký
        </Button>
      </Form.Item>

      <Divider plain className="!my-4 !text-gray-400">
        hoặc
      </Divider>
      <GoogleLoginButton />
    </Form>
  );
}
