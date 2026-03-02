import { Button, Form, Input, Select, Typography, Upload } from "antd";
import { ArrowLeft, BookOpen, UploadCloud } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "../../components/DashboardLayout";
import { applicantMenu } from "../applicant/applicantMenu";

const { Title, Text } = Typography;
const { Option } = Select;

export function SubmitHocBa() {
  const navigate = useNavigate();
  const [form] = Form.useForm();

  return (
    <DashboardLayout menuItems={applicantMenu}>
      <div className="max-w-2xl mx-auto">
        <button
          onClick={() => navigate("/applicant/submit-application")}
          className="flex items-center gap-2 text-gray-400 hover:text-orange-500 text-sm mb-6 transition-colors cursor-pointer bg-transparent border-0 p-0"
        >
          <ArrowLeft size={15} />
          Quay lại chọn phương thức
        </button>

        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-200 flex items-center justify-center">
            <BookOpen size={20} className="text-orange-500" />
          </div>
          <div>
            <Text className="text-xs text-gray-400 uppercase tracking-wider">
              Phương thức xét tuyển
            </Text>
            <Title level={4} className="!mb-0 !text-gray-800 !font-bold">
              Đăng ký xét học bạ
            </Title>
          </div>
        </div>

        <div className="rounded-2xl bg-white border border-gray-100 shadow-sm p-6 md:p-8">
          <Form form={form} layout="vertical" requiredMark={false}>
            <Title level={5} className="!text-gray-700 !mb-4">
              Thông tin cá nhân
            </Title>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
              <Form.Item
                name="fullName"
                label={<Text strong>Họ và tên</Text>}
                rules={[{ required: true, message: "Vui lòng nhập họ và tên" }]}
              >
                <Input placeholder="Nguyễn Văn A" size="large" className="rounded-lg" />
              </Form.Item>
              <Form.Item
                name="dob"
                label={<Text strong>Ngày sinh</Text>}
                rules={[{ required: true, message: "Vui lòng nhập ngày sinh" }]}
              >
                <Input placeholder="dd/mm/yyyy" size="large" className="rounded-lg" />
              </Form.Item>
              <Form.Item
                name="phone"
                label={<Text strong>Số điện thoại</Text>}
                rules={[{ required: true, message: "Vui lòng nhập số điện thoại" }]}
              >
                <Input placeholder="0xxxxxxxxx" size="large" className="rounded-lg" />
              </Form.Item>
              <Form.Item
                name="email"
                label={<Text strong>Email</Text>}
                rules={[
                  { required: true, message: "Vui lòng nhập email" },
                  { type: "email", message: "Email không hợp lệ" },
                ]}
              >
                <Input placeholder="example@email.com" size="large" className="rounded-lg" />
              </Form.Item>
            </div>

            <Form.Item
              name="idNumber"
              label={<Text strong>CCCD / CMND</Text>}
              rules={[{ required: true, message: "Vui lòng nhập số CCCD/CMND" }]}
            >
              <Input placeholder="0xxxxxxxxx" size="large" className="rounded-lg" />
            </Form.Item>

            <div className="border-t border-gray-100 my-6" />
            <Title level={5} className="!text-gray-700 !mb-4">
              Thông tin học tập
            </Title>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
              <Form.Item
                name="highSchool"
                label={<Text strong>Trường THPT</Text>}
                rules={[{ required: true, message: "Vui lòng nhập tên trường" }]}
              >
                <Input placeholder="Tên trường THPT" size="large" className="rounded-lg" />
              </Form.Item>
              <Form.Item
                name="graduationYear"
                label={<Text strong>Năm tốt nghiệp</Text>}
                rules={[{ required: true, message: "Vui lòng chọn năm" }]}
              >
                <Select placeholder="Chọn năm" size="large" className="w-full">
                  {[2026, 2025, 2024, 2023].map((y) => (
                    <Option key={y} value={y}>{y}</Option>
                  ))}
                </Select>
              </Form.Item>
            </div>

            <Form.Item
              name="major"
              label={<Text strong>Ngành đăng ký xét tuyển</Text>}
              rules={[{ required: true, message: "Vui lòng chọn ngành" }]}
            >
              <Select placeholder="Chọn ngành" size="large" className="w-full">
                <Option value="cntt">Công nghệ thông tin</Option>
                <Option value="ktpm">Kỹ thuật phần mềm</Option>
                <Option value="attt">An toàn thông tin</Option>
                <Option value="qtkd">Quản trị kinh doanh</Option>
                <Option value="ngon-ngu-anh">Ngôn ngữ Anh</Option>
              </Select>
            </Form.Item>

            <div className="border-t border-gray-100 my-6" />
            <Title level={5} className="!text-gray-700 !mb-4">
              Tài liệu đính kèm
            </Title>

            <Form.Item
              name="transcript"
              label={<Text strong>Học bạ THPT (3 năm)</Text>}
              rules={[{ required: true, message: "Vui lòng tải lên học bạ" }]}
            >
              <Upload.Dragger
                name="transcript"
                multiple={false}
                accept=".pdf,.jpg,.jpeg,.png"
                maxCount={1}
                beforeUpload={() => false}
                className="rounded-xl"
              >
                <div className="py-4">
                  <UploadCloud size={28} className="text-orange-400 mx-auto mb-2" />
                  <Text className="text-gray-500 text-sm">
                    Kéo thả hoặc{" "}
                    <span className="text-orange-500 font-medium">nhấn để chọn file</span>
                  </Text>
                  <Text className="text-gray-400 text-xs block mt-1">
                    PDF, JPG, PNG — tối đa 10MB
                  </Text>
                </div>
              </Upload.Dragger>
            </Form.Item>

            <Form.Item className="!mb-0 !mt-6">
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                block
                className="!bg-orange-500 !border-orange-500 hover:!bg-orange-600 !rounded-xl !h-12 !font-semibold"
              >
                Nộp hồ sơ xét học bạ
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </DashboardLayout>
  );
}
