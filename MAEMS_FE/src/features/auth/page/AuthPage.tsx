import {
  Button,
  DatePicker,
  Form,
  Input,
  Layout,
  Select,
  Tabs,
  Typography,
} from "antd";
import type { DatePickerProps } from "antd";
import { AppHeader } from "../../../shared/components/AppHeader";
import dayjs from "dayjs";

const { Content } = Layout;
const { Title, Text } = Typography;
const { Option } = Select;

type LoginFormValues = {
  username: string;
  password: string;
};

type RegisterFormValues = {
  fullName: string;
  username: string;
  dob: dayjs.Dayjs;
  gender: string;
  password: string;
  confirmPassword: string;
};

export function AuthPage() {
  const [loginForm] = Form.useForm<LoginFormValues>();
  const [registerForm] = Form.useForm<RegisterFormValues>();

  const onLoginFinish = (values: LoginFormValues) => {
    console.log("Login", values);
    // TODO: call login API
  };

  const onRegisterFinish = (values: RegisterFormValues) => {
    console.log("Register", { ...values, dob: values.dob?.format("YYYY-MM-DD") });
    // TODO: call register API
  };

  const dobDatePickerProps: DatePickerProps = {
    className: "w-full",
    format: "DD/MM/YYYY",
    placeholder: "Chọn ngày sinh",
  };

  return (
    <Layout className="min-h-screen bg-gradient-to-br from-orange-200 via-amber-50 to-gray-50">
      <AppHeader />

      <Content className="w-full py-8 px-6 md:px-10 pb-16 box-border text-gray-900 max-md:px-4">
        <div className="max-w-md mx-auto mt-8 md:mt-12">
          <div className="rounded-2xl bg-white border border-orange-200/20 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.08),0_2px_4px_-2px_rgba(0,0,0,0.05)] p-6 md:p-8">
            <Title level={3} className="!text-slate-900 !mb-6 !text-center">
              Tài khoản
            </Title>

            <Tabs
              defaultActiveKey="login"
              className="auth-tabs [&_.ant-tabs-nav]:mb-6 [&_.ant-tabs-tab]:py-2 [&_.ant-tabs-ink-bar]:bg-orange-500"
              items={[
                {
                  key: "login",
                  label: <span className="font-medium">Đăng nhập</span>,
                  children: (
                    <Form<LoginFormValues>
                      form={loginForm}
                      layout="vertical"
                      requiredMark={false}
                      onFinish={onLoginFinish}
                      className="[&_.ant-form-item]:mb-4"
                    >
                      <Form.Item
                        name="username"
                        label={<Text strong>Tên đăng nhập</Text>}
                        rules={[{ required: true, message: "Vui lòng nhập tên đăng nhập" }]}
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
                        rules={[{ required: true, message: "Vui lòng nhập mật khẩu" }]}
                      >
                        <Input.Password
                          placeholder="Nhập mật khẩu"
                          size="large"
                          className="rounded-lg"
                        />
                      </Form.Item>
                      <Form.Item className="!mb-0 !pt-2">
                        <Button
                          type="primary"
                          htmlType="submit"
                          size="large"
                          block
                          className="!bg-orange-500 !border-orange-500 hover:!bg-orange-600 hover:!border-orange-600 !rounded-lg !h-11"
                        >
                          Đăng nhập
                        </Button>
                      </Form.Item>
                    </Form>
                  ),
                },
                {
                  key: "register",
                  label: <span className="font-medium">Đăng ký</span>,
                  children: (
                    <Form<RegisterFormValues>
                      form={registerForm}
                      layout="vertical"
                      requiredMark={false}
                      onFinish={onRegisterFinish}
                      className="[&_.ant-form-item]:mb-4"
                    >
                      <Form.Item
                        name="fullName"
                        label={<Text strong>Họ tên đầy đủ</Text>}
                        rules={[{ required: true, message: "Vui lòng nhập họ tên" }]}
                      >
                        <Input
                          placeholder="Nhập họ tên đầy đủ"
                          size="large"
                          className="rounded-lg"
                        />
                      </Form.Item>
                      <Form.Item
                        name="username"
                        label={<Text strong>Tên đăng nhập</Text>}
                        rules={[{ required: true, message: "Vui lòng nhập tên đăng nhập" }]}
                      >
                        <Input
                          placeholder="Nhập tên đăng nhập"
                          size="large"
                          className="rounded-lg"
                        />
                      </Form.Item>
                      <Form.Item
                        name="dob"
                        label={<Text strong>Ngày sinh</Text>}
                        rules={[{ required: true, message: "Vui lòng chọn ngày sinh" }]}
                      >
                        <DatePicker {...dobDatePickerProps} size="large" />
                      </Form.Item>
                      <Form.Item
                        name="gender"
                        label={<Text strong>Giới tính</Text>}
                        rules={[{ required: true, message: "Vui lòng chọn giới tính" }]}
                      >
                        <Select
                          placeholder="Chọn giới tính"
                          size="large"
                          className="rounded-lg"
                          allowClear
                        >
                          <Option value="male">Nam</Option>
                          <Option value="female">Nữ</Option>
                          <Option value="other">Khác</Option>
                        </Select>
                      </Form.Item>
                      <Form.Item
                        name="password"
                        label={<Text strong>Mật khẩu</Text>}
                        rules={[
                          { required: true, message: "Vui lòng nhập mật khẩu" },
                          { min: 6, message: "Mật khẩu tối thiểu 6 ký tự" },
                        ]}
                      >
                        <Input.Password
                          placeholder="Nhập mật khẩu"
                          size="large"
                          className="rounded-lg"
                        />
                      </Form.Item>
                      <Form.Item
                        name="confirmPassword"
                        label={<Text strong>Xác nhận mật khẩu</Text>}
                        dependencies={["password"]}
                        rules={[
                          { required: true, message: "Vui lòng xác nhận mật khẩu" },
                          ({ getFieldValue }) => ({
                            validator(_, value) {
                              if (!value || getFieldValue("password") === value) {
                                return Promise.resolve();
                              }
                              return Promise.reject(new Error("Mật khẩu không trùng khớp"));
                            },
                          }),
                        ]}
                      >
                        <Input.Password
                          placeholder="Nhập lại mật khẩu"
                          size="large"
                          className="rounded-lg"
                        />
                      </Form.Item>
                      <Form.Item className="!mb-0 !pt-2">
                        <Button
                          type="primary"
                          htmlType="submit"
                          size="large"
                          block
                          className="!bg-orange-500 !border-orange-500 hover:!bg-orange-600 hover:!border-orange-600 !rounded-lg !h-11"
                        >
                          Đăng ký
                        </Button>
                      </Form.Item>
                    </Form>
                  ),
                },
              ]}
            />
          </div>
        </div>
      </Content>
    </Layout>
  );
}
