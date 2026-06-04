import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Popconfirm,
  Space,
  Tag,
  Tooltip,
  Typography,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import {
  CheckCircle2,
  Eye,
  FilePlus2,
  TriangleAlert,
  XCircle,
} from "lucide-react";
import { APPLICATION_REQUIRES_REVIEW_LABEL } from "@/types/application";
import type { Application, ApplicationStatus } from "@/types/application";
import type { ApplicationLevel } from "@/types/enums";
import { ensureUtc } from "@/utils/date";
import {
  LEVEL_TAG_CONFIG,
  statusConfig,
} from "../utils/officerApplicationListStatus";

const { Text } = Typography;

type UseOfficerApplicationListColumnsParams = {
  actionLoading: string | null;
  onApprove: (id: number | string) => void;
  onOpenReject: (id: number | string) => void;
  onOpenSupplement: (record: Application) => void;
};

/** Định nghĩa cột bảng hồ sơ officer — tách khỏi page để dễ đọc hook chính. */
export function useOfficerApplicationListColumns({
  actionLoading,
  onApprove,
  onOpenReject,
  onOpenSupplement,
}: UseOfficerApplicationListColumnsParams) {
  const navigate = useNavigate();

  return useMemo<ColumnsType<Application>>(
    () => [
      {
        title: "Mã hồ sơ",
        dataIndex: "applicationId",
        key: "applicationId",
        width: 120,
        render: (id: string) => (
          <Text className="font-mono text-xs text-indigo-600 font-semibold">
            {id}
          </Text>
        ),
      },
      {
        title: "Thí sinh",
        dataIndex: "applicantName",
        key: "applicantName",
        sorter: true,
        render: (name: string, record) => (
          <div>
            <Text className="font-medium text-gray-800 block">{name}</Text>
            <Text className="text-xs text-gray-400">{record.campusName}</Text>
          </div>
        ),
      },
      {
        title: "Ngành",
        dataIndex: "programName",
        key: "programName",
        sorter: true,
        render: (prog: string, record) => (
          <div>
            <Text className="text-gray-700 text-sm block">{prog}</Text>
            <Text className="text-xs text-gray-400">
              {record.admissionTypeName}
            </Text>
          </div>
        ),
      },
      {
        title: "Ngày nộp",
        dataIndex: "submittedAt",
        key: "submittedAt",
        width: 120,
        sorter: true,
        render: (date: string) =>
          date ? (
            <Text className="text-gray-500 text-sm">
              {new Date(ensureUtc(date)).toLocaleDateString("vi-VN")}
            </Text>
          ) : (
            <Text className="text-gray-300 text-sm">—</Text>
          ),
      },
      {
        title: "Trạng thái",
        dataIndex: "status",
        key: "status",
        width: 150,
        render: (_: ApplicationStatus, record: Application) => {
          const cfg = statusConfig[record.status];
          return (
            <Space size={4} wrap className="max-w-[200px]">
              <Tag color={cfg.color} className="text-xs">
                {cfg.label}
              </Tag>
              {record.requiresReview && (
                <Tag
                  color="error"
                  className="text-xs !inline-flex !items-center gap-1 !m-0"
                >
                  <TriangleAlert className="size-3.5 shrink-0" aria-hidden />
                  {APPLICATION_REQUIRES_REVIEW_LABEL}
                </Tag>
              )}
            </Space>
          );
        },
      },
      {
        title: "Xếp hạng",
        dataIndex: "level",
        key: "level",
        width: 120,
        render: (level: ApplicationLevel | null) => {
          if (!level) {
            return (
              <Tag color="default" className="text-xs">
                Chưa xác định
              </Tag>
            );
          }
          const cfg = LEVEL_TAG_CONFIG[level];
          return (
            <Tag color={cfg.color} className="text-xs font-medium">
              {cfg.label.toUpperCase()}
            </Tag>
          );
        },
      },
      {
        title: "Hành động",
        key: "actions",
        width: 160,
        fixed: "right" as const,
        render: (_: unknown, record: Application) => {
          const id = record.applicationId;
          const strId = String(id);
          const canReview = record.status === "under_review";
          const canRequestSupplement = record.status === "under_review";

          return (
            <Space size={4}>
              <Tooltip title="Xem chi tiết">
                <Button
                  size="small"
                  icon={<Eye size={13} />}
                  onClick={() => navigate(`/officer/applications/${strId}`)}
                  className="!rounded-lg"
                />
              </Tooltip>

              {canReview ? (
                <Popconfirm
                  title="Phê duyệt hồ sơ này?"
                  okText="Phê duyệt"
                  cancelText="Huỷ"
                  onConfirm={() => onApprove(id)}
                >
                  <Tooltip title="Phê duyệt">
                    <Button
                      size="small"
                      icon={<CheckCircle2 size={13} />}
                      type="primary"
                      loading={actionLoading === strId + "_approve"}
                      className="!rounded-lg !bg-emerald-500 !border-emerald-500 hover:!bg-emerald-600"
                    />
                  </Tooltip>
                </Popconfirm>
              ) : (
                <Tooltip title="Chỉ phê duyệt được khi hồ sơ ở trạng thái chờ xét duyệt">
                  <span>
                    <Button
                      size="small"
                      icon={<CheckCircle2 size={13} />}
                      type="primary"
                      disabled
                      className="!rounded-lg !bg-emerald-500 !border-emerald-500"
                    />
                  </span>
                </Tooltip>
              )}

              <Tooltip
                title={
                  canReview
                    ? "Từ chối"
                    : "Chỉ từ chối được khi hồ sơ ở trạng thái chờ xét duyệt"
                }
              >
                <Button
                  size="small"
                  icon={<XCircle size={13} />}
                  danger
                  disabled={!canReview}
                  loading={actionLoading === strId + "_reject"}
                  onClick={() => onOpenReject(id)}
                  className="!rounded-lg"
                />
              </Tooltip>

              <Tooltip
                title={
                  canRequestSupplement
                    ? "Yêu cầu bổ sung"
                    : "Chỉ yêu cầu bổ sung khi hồ sơ ở trạng thái chờ xét duyệt"
                }
              >
                <Button
                  size="small"
                  icon={<FilePlus2 size={13} />}
                  disabled={!canRequestSupplement}
                  loading={actionLoading === strId + "_supplement"}
                  onClick={() => onOpenSupplement(record)}
                  className="!rounded-lg !text-amber-600 !border-amber-300 hover:!border-amber-400"
                />
              </Tooltip>
            </Space>
          );
        },
      },
    ],
    [actionLoading, navigate, onApprove, onOpenReject, onOpenSupplement],
  );
}
