import { Button, Popconfirm, Tag } from "antd";
import { motion } from "motion/react";
import { Bot, Eye, SendHorizonal } from "lucide-react";
import type { ApplicationMe } from "@/types/application";
import {
  formatApplicationDate,
  relativeApplicationTime,
} from "../utils/applicationListFormatters";
import { statusConfig } from "../utils/applicationListStatus";

type ApplicationCardListProps = {
  apps: ApplicationMe[];
  onSubmit: (app: ApplicationMe) => void;
  onView: (id: number) => void;
  submittingId: number | null;
};

/** Danh sách dạng card trên mobile — thay bảng để tránh scroll ngang khó dùng. */
export function ApplicationCardList({
  apps,
  onSubmit,
  onView,
  submittingId,
}: ApplicationCardListProps) {
  return (
    <div className="flex flex-col gap-3">
      {apps.map((app, index) => {
        const sc = statusConfig[app.status];
        const canSubmitFinal =
          app.status === "draft" || app.status === "document_required";
        const isResubmit = app.status === "document_required";
        const isSubmitting = submittingId === app.applicationId;
        const isAiProcessing =
          app.status === "under_review" || app.status === "submitted";

        return (
          <motion.div
            key={app.applicationId}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.28,
              delay: Math.min(index * 0.04, 0.24),
              ease: [0.22, 1, 0.36, 1],
            }}
            className="bg-white/95 rounded-3xl border border-gray-200/70 shadow-sm shadow-gray-900/[0.03] p-4 flex flex-col gap-3 active:bg-orange-50/30 transition-colors"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-gray-800 text-sm leading-snug line-clamp-2">
                  {app.programName?.trim() || "—"}
                </div>
                <div className="text-xs text-gray-400 mt-0.5 font-mono">
                  #{app.applicationId}
                </div>
              </div>
              <div className="flex items-center gap-1 shrink-0 flex-wrap justify-end">
                <Tag color={sc.color} className="!m-0 text-xs !rounded-full">
                  {sc.label}
                </Tag>
                {isAiProcessing && (
                  <Tag
                    color="purple"
                    className="!m-0 inline-flex items-center gap-0.5 text-xs"
                  >
                    <Bot size={11} className="shrink-0" />
                    AI
                  </Tag>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs bg-gray-50/80 rounded-2xl px-3 py-2.5 border border-gray-100/80">
              {app.campusName?.trim() && (
                <div className="min-w-0">
                  <span className="text-gray-400 block">Cơ sở</span>
                  <span className="text-gray-700 font-medium truncate block">
                    {app.campusName}
                  </span>
                </div>
              )}
              {app.admissionTypeName?.trim() && (
                <div className="min-w-0">
                  <span className="text-gray-400 block">Xét tuyển</span>
                  <span className="text-gray-700 font-medium truncate block">
                    {app.admissionTypeName}
                  </span>
                </div>
              )}
              {app.submittedAt && (
                <div>
                  <span className="text-gray-400 block">Ngày nộp</span>
                  <span className="text-gray-700 font-medium">
                    {formatApplicationDate(app.submittedAt)}
                  </span>
                </div>
              )}
              {app.lastUpdated && (
                <div>
                  <span className="text-gray-400 block">Cập nhật</span>
                  <span className="text-gray-700 font-medium">
                    {relativeApplicationTime(app.lastUpdated)}
                  </span>
                </div>
              )}
            </div>

            <div className="flex gap-2 pt-1 border-t border-gray-100">
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
                    className: "!bg-green-600 !border-green-600",
                  }}
                  onConfirm={() => onSubmit(app)}
                >
                  <Button
                    size="small"
                    icon={<SendHorizonal size={14} />}
                    loading={isSubmitting}
                    className="!rounded-2xl !border-green-400 !text-green-600 hover:!bg-green-50 flex-1"
                    block
                  >
                    {isResubmit ? "Nộp lại" : "Nộp đơn"}
                  </Button>
                </Popconfirm>
              )}
              <Button
                type="primary"
                size="small"
                icon={<Eye size={14} />}
                className="!rounded-2xl !bg-orange-500 !border-orange-500 hover:!bg-orange-600 flex-1 shadow-sm"
                block
                onClick={() => onView(app.applicationId)}
              >
                Chi tiết
              </Button>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
