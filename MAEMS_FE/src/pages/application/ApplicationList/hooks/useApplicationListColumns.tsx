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
import type { SortOrder } from "antd/es/table/interface";
import { Bot, Eye, SendHorizonal } from "lucide-react";
import type { ApplicationMe } from "@/types/application";
import type { ApplicationListSortField } from "../types";
import {
  formatApplicationDate,
  relativeApplicationTime,
} from "../utils/applicationListFormatters";
import { statusConfig } from "../utils/applicationListStatus";

const { Text } = Typography;

type UseApplicationListColumnsParams = {
  submittingId: number | null;
  onSubmitFinal: (app: ApplicationMe) => void;
  sortField: ApplicationListSortField;
  sortOrder: Exclude<SortOrder, null>;
};

function columnSortOrder(
  field: ApplicationListSortField,
  activeField: ApplicationListSortField,
  order: Exclude<SortOrder, null>,
): SortOrder {
  return activeField === field ? order : null;
}

/** Định nghĩa cột bảng desktop — có sorter cho submittedAt, lastUpdated, applicationId. */
export function useApplicationListColumns({
  submittingId,
  onSubmitFinal,
  sortField,
  sortOrder,
}: UseApplicationListColumnsParams) {
  const navigate = useNavigate();

  return useMemo<ColumnsType<ApplicationMe>>(
    () => [
      {
        title: "Chương trình",
        dataIndex: "programName",
        key: "program",
        ellipsis: true,
        width: 220,
        fixed: "left",
        className: "!pl-5 sm:!pl-7",
        render: (name: string) => (
          <Tooltip title={name?.trim() ? name : undefined}>
            <span className="font-semibold text-gray-800">
              {name?.trim() ? name : "—"}
            </span>
          </Tooltip>
        ),
      },
      {
        title: "Trạng thái",
        key: "status",
        width: 188,
        render: (_, app) => {
          const sc = statusConfig[app.status];
          const isAiProcessing =
            app.status === "under_review" || app.status === "submitted";
          return (
            <Space size={6} wrap className="max-w-[200px]">
              <Tag color={sc.color} className="!m-0 text-xs !rounded-full">
                {sc.label}
              </Tag>
              {isAiProcessing && (
                <Tag
                  color="purple"
                  className="!m-0 inline-flex items-center gap-0.5 text-xs !rounded-full"
                >
                  <Bot size={11} className="shrink-0" />
                  AI
                </Tag>
              )}
            </Space>
          );
        },
      },
      {
        title: "Loại xét tuyển",
        dataIndex: "admissionTypeName",
        key: "admission",
        ellipsis: true,
        responsive: ["md"],
        width: 200,
        render: (v: string) => (
          <Text className="text-sm text-gray-600">{v?.trim() ? v : "—"}</Text>
        ),
      },
      {
        title: "Cơ sở",
        dataIndex: "campusName",
        key: "campus",
        ellipsis: true,
        responsive: ["md"],
        width: 160,
        render: (v: string) => (
          <Text className="text-sm text-gray-600">{v?.trim() ? v : "—"}</Text>
        ),
      },
      {
        title: "Mã đơn",
        dataIndex: "applicationId",
        key: "applicationId",
        width: 96,
        responsive: ["lg"],
        sorter: true,
        sortOrder: columnSortOrder("applicationId", sortField, sortOrder),
        showSorterTooltip: { title: "Sắp xếp theo mã đơn" },
        render: (id: number) => (
          <span className="font-mono text-sm text-gray-700 tabular-nums">
            {id}
          </span>
        ),
      },
      {
        title: "Nộp ngày",
        dataIndex: "submittedAt",
        key: "submittedAt",
        width: 118,
        responsive: ["lg"],
        sorter: true,
        sortOrder: columnSortOrder("submittedAt", sortField, sortOrder),
        defaultSortOrder: "descend",
        showSorterTooltip: { title: "Sắp xếp theo ngày nộp" },
        render: (_, app) => (
          <Text className="text-sm text-gray-600">
            {app.submittedAt ? formatApplicationDate(app.submittedAt) : "—"}
          </Text>
        ),
      },
      {
        title: "Cập nhật",
        dataIndex: "lastUpdated",
        key: "lastUpdated",
        width: 124,
        responsive: ["lg"],
        sorter: true,
        sortOrder: columnSortOrder("lastUpdated", sortField, sortOrder),
        showSorterTooltip: { title: "Sắp xếp theo lần cập nhật" },
        render: (_, app) => (
          <Tooltip
            title={
              app.lastUpdated
                ? formatApplicationDate(app.lastUpdated)
                : undefined
            }
          >
            <Text className="text-sm text-gray-500">
              {app.lastUpdated
                ? relativeApplicationTime(app.lastUpdated)
                : "—"}
            </Text>
          </Tooltip>
        ),
      },
      {
        title: "Thao tác",
        key: "actions",
        width: 228,
        align: "right",
        fixed: "right",
        className: "!pr-5 sm:!pr-7",
        render: (_, app) => {
          const canSubmitFinal =
            app.status === "draft" || app.status === "document_required";
          const isResubmit = app.status === "document_required";
          const isSubmitting = submittingId === app.applicationId;
          return (
            <Space size={8} wrap className="justify-end">
              {canSubmitFinal && (
                <Popconfirm
                  title={
                    isResubmit
                      ? "Xác nhận nộp lại đơn đăng ký"
                      : "Xác nhận nộp đơn đăng ký"
                  }
                  description={
                    <span className="text-xs text-gray-500">
                      {isResubmit
                        ? "Sau khi nộp lại, đơn sẽ được gửi lại vào hệ thống xét duyệt."
                        : "Sau khi nộp, đơn sẽ được gửi đến hệ thống xét duyệt."}
                      <br />
                      Bạn sẽ không thể chỉnh sửa sau khi xác nhận.
                    </span>
                  }
                  okText={isResubmit ? "Xác nhận nộp lại" : "Xác nhận nộp"}
                  cancelText="Hủy"
                  okButtonProps={{
                    className: "!bg-green-600 !border-green-600 !rounded-xl",
                  }}
                  onConfirm={() => onSubmitFinal(app)}
                >
                  <Button
                    size="small"
                    icon={<SendHorizonal size={14} />}
                    loading={isSubmitting}
                    className="!rounded-xl !border-green-400 !text-green-600 hover:!bg-green-50"
                  >
                    {isResubmit ? "Nộp lại" : "Nộp đơn"}
                  </Button>
                </Popconfirm>
              )}
              <Button
                type="primary"
                size="small"
                icon={<Eye size={14} />}
                className="!rounded-xl !bg-orange-500 !border-orange-500 hover:!bg-orange-600"
                onClick={() =>
                  navigate(`/applicant/applications/${app.applicationId}`)
                }
              >
                Chi tiết
              </Button>
            </Space>
          );
        },
      },
    ],
    [navigate, onSubmitFinal, submittingId, sortField, sortOrder],
  );
}
