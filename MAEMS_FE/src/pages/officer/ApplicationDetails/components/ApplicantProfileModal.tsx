import { Button, Descriptions, Divider, Modal, Spin, Tag, Typography } from "antd";
import { User } from "lucide-react";
import type { CreateApplicantResponse } from "../../../../types/applicant";
import type { Application } from "../../../../types/application";
import { ensureUtc } from "../../../../utils/date";
import { formatGender, initialsFromName } from "../utils/displayHelpers";

const { Text } = Typography;

type ApplicantProfileModalProps = {
  app: Application | null;
  open: boolean;
  loading: boolean;
  applicantDetail: CreateApplicantResponse | null;
  onClose: () => void;
};

/** Modal xem chi tiết hồ sơ cá nhân thí sinh */
export function ApplicantProfileModal({
  app,
  open,
  loading,
  applicantDetail,
  onClose,
}: ApplicantProfileModalProps) {
  return (
    <Modal
      title={
        <div className="flex items-center gap-2 pr-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600">
            <User size={18} aria-hidden />
          </div>
          <div className="min-w-0">
            <div className="text-base font-semibold text-gray-900 truncate">
              Hồ sơ thí sinh
            </div>
            {app && (
              <Text className="text-xs text-gray-400 font-normal">
                Mã thí sinh{" "}
                <span className="font-mono text-indigo-500">
                  #{app.applicantId}
                </span>
              </Text>
            )}
          </div>
        </div>
      }
      open={open}
      onCancel={onClose}
      footer={
        <Button type="primary" className="!rounded-xl" onClick={onClose}>
          Đóng
        </Button>
      }
      width={680}
      destroyOnClose
    >
      <Spin spinning={loading}>
        {applicantDetail && (
          <div className="pt-1 max-h-[70vh] overflow-y-auto pr-1">
            <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-100">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-700 font-bold text-lg">
                {initialsFromName(applicantDetail.fullName)}
              </div>
              <div className="min-w-0">
                <Text className="!text-lg !font-semibold !text-gray-900 block truncate">
                  {applicantDetail.fullName}
                </Text>
                <Text className="text-xs text-gray-400">
                  User ID{" "}
                  <span className="font-mono text-gray-600">
                    {applicantDetail.userId}
                  </span>
                </Text>
              </div>
            </div>

            <Text className="!text-xs !font-semibold !text-gray-400 uppercase tracking-wide block mb-2">
              Thông tin cá nhân
            </Text>
            <Descriptions
              column={{ xs: 1, sm: 2 }}
              size="small"
              bordered
              className="!mb-4"
            >
              <Descriptions.Item label="Ngày sinh" span={1}>
                {applicantDetail.dateOfBirth
                  ? new Date(
                      ensureUtc(applicantDetail.dateOfBirth),
                    ).toLocaleDateString("vi-VN")
                  : "—"}
              </Descriptions.Item>
              <Descriptions.Item label="Giới tính" span={1}>
                {formatGender(applicantDetail.gender)}
              </Descriptions.Item>
            </Descriptions>

            <Divider className="!my-4" />

            <Text className="!text-xs !font-semibold !text-gray-400 uppercase tracking-wide block mb-2">
              Trường THPT
            </Text>
            <Descriptions
              column={{ xs: 1, sm: 2 }}
              size="small"
              bordered
              className="!mb-4"
            >
              <Descriptions.Item label="Trường" span={2}>
                {applicantDetail.highSchoolName || "—"}
              </Descriptions.Item>
              <Descriptions.Item label="Huyện / quận">
                {applicantDetail.highSchoolDistrict || "—"}
              </Descriptions.Item>
              <Descriptions.Item label="Tỉnh / TP">
                {applicantDetail.highSchoolProvince || "—"}
              </Descriptions.Item>
              <Descriptions.Item label="Năm tốt nghiệp" span={2}>
                {applicantDetail.graduationYear ?? "—"}
              </Descriptions.Item>
            </Descriptions>

            <Divider className="!my-4" />

            <Text className="!text-xs !font-semibold !text-gray-400 uppercase tracking-wide block mb-2">
              CCCD / CMND
            </Text>
            <Descriptions
              column={{ xs: 1, sm: 2 }}
              size="small"
              bordered
              className="!mb-4"
            >
              <Descriptions.Item label="Số">
                {applicantDetail.idIssueNumber || "—"}
              </Descriptions.Item>
              <Descriptions.Item label="Ngày cấp">
                {applicantDetail.idIssueDate
                  ? new Date(
                      ensureUtc(applicantDetail.idIssueDate),
                    ).toLocaleDateString("vi-VN")
                  : "—"}
              </Descriptions.Item>
              <Descriptions.Item label="Nơi cấp" span={2}>
                {applicantDetail.idIssuePlace || "—"}
              </Descriptions.Item>
            </Descriptions>

            <Divider className="!my-4" />

            <Text className="!text-xs !font-semibold !text-gray-400 uppercase tracking-wide block mb-2">
              Liên hệ
            </Text>
            <Descriptions
              column={{ xs: 1, sm: 2 }}
              size="small"
              bordered
              className="!mb-4"
            >
              <Descriptions.Item label="Người liên hệ" span={2}>
                {applicantDetail.contactName || "—"}
              </Descriptions.Item>
              <Descriptions.Item label="Địa chỉ" span={2}>
                {applicantDetail.contactAddress || "—"}
              </Descriptions.Item>
              <Descriptions.Item label="Điện thoại">
                {applicantDetail.contactPhone || "—"}
              </Descriptions.Item>
              <Descriptions.Item label="Email">
                {applicantDetail.contactEmail || "—"}
              </Descriptions.Item>
            </Descriptions>

            <Divider className="!my-4" />

            <Descriptions column={1} size="small" bordered>
              <Descriptions.Item label="Đồng ý chia sẻ thông tin">
                {applicantDetail.allowShare ? (
                  <Tag color="green">Có</Tag>
                ) : (
                  <Tag>Không</Tag>
                )}
              </Descriptions.Item>
              <Descriptions.Item label="Tạo hồ sơ lúc">
                {applicantDetail.createdAt
                  ? new Date(
                      ensureUtc(applicantDetail.createdAt),
                    ).toLocaleString("vi-VN")
                  : "—"}
              </Descriptions.Item>
            </Descriptions>
          </div>
        )}
      </Spin>
    </Modal>
  );
}
