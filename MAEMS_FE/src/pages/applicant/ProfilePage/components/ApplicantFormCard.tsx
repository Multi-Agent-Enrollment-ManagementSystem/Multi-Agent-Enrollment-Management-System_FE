import {
  Button,
  Card,
  DatePicker,
  Divider,
  Form,
  Input,
  InputNumber,
  Select,
  Typography,
} from "antd";
import type { FormInstance } from "antd";
import { BookOpen, CreditCard, Phone, User } from "lucide-react";
import { motion } from "motion/react";
import dayjs from "dayjs";
import type { ApplicantFormValues } from "../types";
import { SectionHeader } from "./SectionHeader";

const { Title, Text } = Typography;

type ApplicantFormCardProps = {
  isEditing: boolean;
  submitting: boolean;
  form: FormInstance<ApplicantFormValues>;
  onSubmit: (values: ApplicantFormValues) => void;
  onCancelEdit: () => void;
};

/** Form tạo mới hoặc chỉnh sửa hồ sơ thí sinh. */
export function ApplicantFormCard({
  isEditing,
  submitting,
  form,
  onSubmit,
  onCancelEdit,
}: ApplicantFormCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <Card className="w-full rounded-[36px] border border-gray-100/90 bg-white/90 shadow-sm backdrop-blur-[2px] [&_.ant-card-body]:!p-4 sm:[&_.ant-card-body]:!p-6 lg:[&_.ant-card-body]:!p-8">
        <Title level={5} className="!mb-1 !text-gray-800">
          {isEditing ? "Chỉnh sửa thông tin thí sinh" : "Thông tin thí sinh"}
        </Title>
        <Text className="text-gray-400 text-sm">
          {isEditing
            ? "Cập nhật thông tin hồ sơ thí sinh của bạn."
            : "Điền đầy đủ thông tin để hoàn thiện hồ sơ đăng ký xét tuyển."}
        </Text>

        <Divider className="!my-5" />

        <Form
          form={form}
          layout="vertical"
          onFinish={onSubmit}
          requiredMark={false}
          className="!mt-0"
          initialValues={{ gender: "Nam" }}
        >
          <SectionHeader icon={<User size={16} />} title="Thông tin cá nhân" />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5">
            <Form.Item
              name="fullName"
              label="Họ và tên"
              rules={[{ required: true, message: "Vui lòng nhập họ và tên" }]}
            >
              <Input placeholder="Nguyễn Văn A" />
            </Form.Item>

            <Form.Item
              name="gender"
              label="Giới tính"
              rules={[{ required: true, message: "Vui lòng chọn giới tính" }]}
            >
              <Select
                options={[
                  { value: "Nam", label: "Nam" },
                  { value: "Nữ", label: "Nữ" },
                  { value: "Khác", label: "Khác" },
                ]}
              />
            </Form.Item>

            <Form.Item
              name="dateOfBirth"
              label="Ngày sinh"
              rules={[{ required: true, message: "Vui lòng chọn ngày sinh" }]}
            >
              <DatePicker
                className="w-full"
                format="DD/MM/YYYY"
                placeholder="DD/MM/YYYY"
                disabledDate={(d) => d && d.isAfter(dayjs())}
              />
            </Form.Item>
          </div>

          <Divider className="!my-5" />

          <SectionHeader
            icon={<BookOpen size={16} />}
            title="Thông tin trường THPT"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5">
            <Form.Item
              name="highSchoolName"
              label="Tên trường"
              rules={[{ required: true, message: "Vui lòng nhập tên trường" }]}
              className="sm:col-span-2"
            >
              <Input placeholder="THPT Chuyên Lê Hồng Phong" />
            </Form.Item>

            <Form.Item
              name="highSchoolDistrict"
              label="Quận / Huyện"
              rules={[{ required: true, message: "Vui lòng nhập quận/huyện" }]}
            >
              <Input placeholder="Quận 5" />
            </Form.Item>

            <Form.Item
              name="highSchoolProvince"
              label="Tỉnh / Thành phố"
              rules={[
                { required: true, message: "Vui lòng nhập tỉnh/thành phố" },
              ]}
            >
              <Input placeholder="TP. Hồ Chí Minh" />
            </Form.Item>

            <Form.Item
              name="graduationYear"
              label="Năm tốt nghiệp"
              rules={[
                { required: true, message: "Vui lòng nhập năm tốt nghiệp" },
              ]}
            >
              <InputNumber
                className="w-full"
                min={1990}
                max={new Date().getFullYear() + 1}
                placeholder="2025"
              />
            </Form.Item>
          </div>

          <Divider className="!my-5" />

          <SectionHeader
            icon={<CreditCard size={16} />}
            title="Giấy tờ tùy thân"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5">
            <Form.Item
              name="idIssueNumber"
              label="Số CCCD / CMND"
              rules={[
                { required: true, message: "Vui lòng nhập số CCCD/CMND" },
              ]}
            >
              <Input placeholder="079xxxxxxxxx" maxLength={12} />
            </Form.Item>

            <Form.Item
              name="idIssueDate"
              label="Ngày cấp"
              rules={[{ required: true, message: "Vui lòng chọn ngày cấp" }]}
            >
              <DatePicker
                className="w-full"
                format="DD/MM/YYYY"
                placeholder="DD/MM/YYYY"
                disabledDate={(d) => d && d.isAfter(dayjs())}
              />
            </Form.Item>

            <Form.Item
              name="idIssuePlace"
              label="Nơi cấp"
              rules={[{ required: true, message: "Vui lòng nhập nơi cấp" }]}
              className="sm:col-span-2"
            >
              <Input placeholder="Cục Cảnh sát quản lý hành chính về TTXH" />
            </Form.Item>
          </div>

          <Divider className="!my-5" />

          <SectionHeader icon={<Phone size={16} />} title="Thông tin liên lạc" />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5">
            <Form.Item
              name="contactName"
              label="Họ tên người liên lạc"
              rules={[{ required: true, message: "Vui lòng nhập họ tên" }]}
            >
              <Input placeholder="Nguyễn Thị B" />
            </Form.Item>

            <Form.Item
              name="contactPhone"
              label="Số điện thoại"
              rules={[
                { required: true, message: "Vui lòng nhập số điện thoại" },
                {
                  pattern: /^[0-9]{9,11}$/,
                  message: "Số điện thoại không hợp lệ",
                },
              ]}
            >
              <Input placeholder="0901234567" maxLength={11} />
            </Form.Item>

            <Form.Item
              name="contactEmail"
              label="Email liên lạc"
              rules={[
                { required: true, message: "Vui lòng nhập email" },
                { type: "email", message: "Email không hợp lệ" },
              ]}
            >
              <Input placeholder="lienhe@example.com" />
            </Form.Item>

            <Form.Item
              name="contactAddress"
              label="Địa chỉ liên lạc"
              rules={[{ required: true, message: "Vui lòng nhập địa chỉ" }]}
              className="sm:col-span-2"
            >
              <Input.TextArea
                rows={2}
                placeholder="123 Đường ABC, Phường XYZ, Quận 1, TP. HCM"
              />
            </Form.Item>
          </div>

          <Divider className="!my-5" />

          <div className="flex justify-end gap-3 pt-2">
            {isEditing && (
              <Button
                size="large"
                className="!rounded-lg px-8"
                onClick={onCancelEdit}
                disabled={submitting}
              >
                Hủy
              </Button>
            )}
            <Button
              type="primary"
              htmlType="submit"
              loading={submitting}
              className="!bg-orange-500 !border-orange-500 hover:!bg-orange-600 hover:!border-orange-600 !rounded-lg px-8"
              size="large"
            >
              {isEditing ? "Cập nhật" : "Lưu hồ sơ"}
            </Button>
          </div>
        </Form>
      </Card>
    </motion.div>
  );
}
