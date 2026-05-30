import { Button, Card, Popconfirm, Tag, Typography } from "antd";
import { CheckCircle2, FilePlus2, XCircle } from "lucide-react";
import type { Application } from "../../../../types/application";
import { STATUS_CFG } from "../types";

const { Title, Text } = Typography;

type ApplicationActionsPanelProps = {
  app: Application;
  isDone: boolean;
  canReview: boolean;
  canRequestSupplement: boolean;
  actionLoading: string | null;
  onApprove: () => void;
  onReject: () => void;
  onRequestSupplement: () => void;
};

/** Cột phải: các hành động phê duyệt / từ chối / yêu cầu bổ sung */
export function ApplicationActionsPanel({
  app,
  isDone,
  canReview,
  canRequestSupplement,
  actionLoading,
  onApprove,
  onReject,
  onRequestSupplement,
}: ApplicationActionsPanelProps) {
  return (
    <Card
      className="!mt-0 rounded-2xl border border-gray-100 shadow-sm"
      styles={{ body: { padding: "20px 24px" } }}
    >
      <Title level={5} className="!mb-4 !text-gray-700">
        Hành động
      </Title>

      {isDone ? (
        <div className="text-center py-4">
          <Tag
            color={app.status === "approved" ? "success" : "error"}
            className="text-sm px-4 py-1"
          >
            {STATUS_CFG[app.status].label}
          </Tag>
          <Text className="block text-gray-400 text-xs mt-2">
            Hồ sơ đã được xử lý xong.
          </Text>
        </div>
      ) : (
        <div className="space-y-3">
          <Popconfirm
            title="Phê duyệt hồ sơ này?"
            description="Hành động này không thể hoàn tác."
            okText="Phê duyệt"
            cancelText="Huỷ"
            onConfirm={onApprove}
            disabled={!canReview}
          >
            <Button
              block
              type="primary"
              icon={<CheckCircle2 size={15} />}
              disabled={!canReview}
              loading={actionLoading === "approve"}
              className="!rounded-xl !h-10 !bg-emerald-500 !border-emerald-500 hover:!bg-emerald-600"
            >
              Phê duyệt hồ sơ
            </Button>
          </Popconfirm>

          <Button
            block
            danger
            icon={<XCircle size={15} />}
            disabled={!canReview}
            loading={actionLoading === "reject"}
            onClick={onReject}
            className="!rounded-xl !h-10"
          >
            Từ chối hồ sơ
          </Button>

          <Button
            block
            icon={<FilePlus2 size={15} />}
            disabled={!canRequestSupplement}
            loading={actionLoading === "supplement"}
            onClick={onRequestSupplement}
            className="!rounded-xl !h-10 !text-amber-600 !border-amber-300 hover:!border-amber-400"
          >
            Yêu cầu bổ sung tài liệu
          </Button>
        </div>
      )}

      <div className="mt-5 pt-4 border-t border-gray-100 space-y-2">
        <div className="flex justify-between text-xs text-gray-400">
          <span>Mã hồ sơ</span>
          <span className="font-mono text-indigo-500">#{app.applicationId}</span>
        </div>
        <div className="flex justify-between text-xs text-gray-400">
          <span>Trạng thái</span>
          <Tag color={STATUS_CFG[app.status].color} className="!text-xs !m-0">
            {STATUS_CFG[app.status].label}
          </Tag>
        </div>
        <div className="flex justify-between text-xs text-gray-400">
          <span>Tài liệu</span>
          <span>{app.documents?.length ?? 0} file</span>
        </div>
      </div>
    </Card>
  );
}
