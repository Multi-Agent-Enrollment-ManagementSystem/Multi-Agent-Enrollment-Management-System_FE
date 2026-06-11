import { Button, Card, Divider, Tag, Typography } from "antd";
import {
  CheckCircle2,
  CreditCard,
  GraduationCap,
  Phone,
  User,
} from "lucide-react";
import { motion } from "motion/react";
import type { CreateApplicantResponse } from "@/types/applicant";
import { formatProfileDate } from "../utils/formatProfileDate";
import { ReadOnlyField } from "./ReadOnlyField";
import { SectionHeader } from "./SectionHeader";

const { Title, Text } = Typography;

type ApplicantReadOnlyCardProps = {
  applicant: CreateApplicantResponse;
  onStartEdit: () => void;
};

/** Card xem hồ sơ thí sinh ở chế độ chỉ đọc, có nút chuyển sang sửa. */
export function ApplicantReadOnlyCard({
  applicant,
  onStartEdit,
}: ApplicantReadOnlyCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut", delay: 0.05 }}
      whileHover={{ y: -2 }}
    >
      <Card className="w-full rounded-[36px] border border-green-100/90 bg-white/90 shadow-sm backdrop-blur-[2px] transition-shadow duration-300 hover:shadow-md [&_.ant-card-body]:!p-4 sm:[&_.ant-card-body]:!p-6 lg:[&_.ant-card-body]:!p-8">
        <div className="flex items-center justify-between mb-1">
          <Title level={5} className="!mb-0 !text-gray-800">
            Thông tin thí sinh
          </Title>
          <div className="flex items-center gap-2 sm:gap-3">
            <Tag
              icon={<CheckCircle2 size={13} />}
              color="success"
              className="flex items-center gap-1 !rounded-full !px-3"
            >
              Đã có hồ sơ
            </Tag>
            <Button size="small" onClick={onStartEdit} className="!rounded-lg">
              Sửa
            </Button>
          </div>
        </div>
        <Text className="text-gray-400 text-sm">
          Thông tin đã được lưu. Nhấn <strong>Sửa</strong> nếu cần chỉnh sửa.
        </Text>

        <Divider className="!my-5" />

        <SectionHeader icon={<User size={16} />} title="Thông tin cá nhân" />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-6">
          <ReadOnlyField label="Họ và tên" value={applicant.fullName} />
          <ReadOnlyField label="Giới tính" value={applicant.gender} />
          <ReadOnlyField
            label="Ngày sinh"
            value={
              applicant.dateOfBirth
                ? formatProfileDate(applicant.dateOfBirth)
                : "—"
            }
          />
        </div>

        <Divider className="!my-5" />

        <SectionHeader
          icon={<GraduationCap size={16} />}
          title="Thông tin trường THPT"
        />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-6">
          <ReadOnlyField label="Tên trường" value={applicant.highSchoolName} />
          <ReadOnlyField
            label="Quận / Huyện"
            value={applicant.highSchoolDistrict}
          />
          <ReadOnlyField
            label="Tỉnh / Thành phố"
            value={applicant.highSchoolProvince}
          />
          <ReadOnlyField
            label="Năm tốt nghiệp"
            value={applicant.graduationYear}
          />
        </div>

        <Divider className="!my-5" />

        <SectionHeader
          icon={<CreditCard size={16} />}
          title="Giấy tờ tùy thân"
        />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-6">
          <ReadOnlyField
            label="Số CCCD / CMND"
            value={applicant.idIssueNumber}
          />
          <ReadOnlyField
            label="Ngày cấp"
            value={
              applicant.idIssueDate
                ? formatProfileDate(applicant.idIssueDate)
                : "—"
            }
          />
          <ReadOnlyField label="Nơi cấp" value={applicant.idIssuePlace} />
        </div>

        <Divider className="!my-5" />

        <SectionHeader icon={<Phone size={16} />} title="Thông tin liên lạc" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <ReadOnlyField
            label="Họ tên người liên lạc"
            value={applicant.contactName}
          />
          <ReadOnlyField
            label="Số điện thoại"
            value={applicant.contactPhone}
          />
          <ReadOnlyField
            label="Email liên lạc"
            value={applicant.contactEmail}
          />
          <ReadOnlyField
            label="Địa chỉ liên lạc"
            value={applicant.contactAddress}
          />
        </div>
      </Card>
    </motion.div>
  );
}
