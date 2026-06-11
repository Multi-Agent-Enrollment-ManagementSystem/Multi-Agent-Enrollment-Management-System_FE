import { Button, Modal, Tag, Typography } from "antd";
import { Eye, FileText } from "lucide-react";
import { ensureUtc } from "@/utils/date";
import type { Document as ApplicantDocument } from "@/types/document";
import { DOC_TYPE_OPTIONS } from "../utils/applicantProfileConstants";
import {
  getVerificationBadge,
  isImageDocument,
} from "../utils/applicantProfileDocumentHelpers";

const { Text } = Typography;

type DocumentPreviewModalProps = {
  doc: ApplicantDocument | null;
  onClose: () => void;
};

/** Modal xem chi tiết và preview tài liệu đã nộp. */
export function DocumentPreviewModal({ doc, onClose }: DocumentPreviewModalProps) {
  return (
    <Modal
      open={!!doc}
      onCancel={onClose}
      footer={null}
      destroyOnClose
      width={720}
      title={
        doc && (
          <div className="flex items-center gap-2 pr-4">
            <FileText size={16} className="text-orange-500 shrink-0" />
            <span className="text-sm font-semibold text-gray-800 truncate">
              {doc.fileName ||
                DOC_TYPE_OPTIONS.find((o) => o.value === doc.documentType)
                  ?.label ||
                "Tài liệu"}
            </span>
            {doc.verificationResult &&
              (() => {
                const b = getVerificationBadge(doc.verificationResult);
                return (
                  <Tag color={b.color} className="!rounded-full !ml-1">
                    {b.label}
                  </Tag>
                );
              })()}
          </div>
        )
      }
    >
      {doc && (
        <div className="flex flex-col gap-4 pt-2">
          <div className="rounded-xl overflow-hidden border border-gray-100 bg-gray-50 flex items-center justify-center min-h-[320px]">
            {isImageDocument(doc) ? (
              <img
                src={doc.filePath}
                alt={doc.fileName}
                className="max-w-full max-h-[480px] object-contain"
              />
            ) : (
              <iframe
                src={doc.filePath}
                title={doc.fileName}
                className="w-full h-[480px] border-0"
              />
            )}
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <Text className="!text-xs !text-gray-400 block">Loại tài liệu</Text>
              <Text className="!text-sm !text-gray-700 !font-medium">
                {DOC_TYPE_OPTIONS.find((o) => o.value === doc.documentType)
                  ?.label ??
                  doc.documentType ??
                  "—"}
              </Text>
            </div>
            <div>
              <Text className="!text-xs !text-gray-400 block">Định dạng</Text>
              <Text className="!text-sm !text-gray-700 !font-medium uppercase">
                {doc.fileFormat ?? "—"}
              </Text>
            </div>
            <div>
              <Text className="!text-xs !text-gray-400 block">Ngày tải lên</Text>
              <Text className="!text-sm !text-gray-700 !font-medium">
                {doc.uploadedAt
                  ? new Date(ensureUtc(doc.uploadedAt)).toLocaleDateString(
                      "vi-VN",
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      },
                    )
                  : "—"}
              </Text>
            </div>
            {doc.verificationDetails && (
              <div className="col-span-2">
                <Text className="!text-xs !text-gray-400 block">
                  Ghi chú duyệt
                </Text>
                <Text className="!text-sm !text-gray-700">
                  {doc.verificationDetails}
                </Text>
              </div>
            )}
          </div>

          <div className="flex justify-end">
            <a href={doc.filePath} target="_blank" rel="noopener noreferrer">
              <Button
                icon={<Eye size={14} />}
                className="!rounded-lg !border-orange-200 !text-orange-600 hover:!bg-orange-50"
              >
                Mở trong tab mới
              </Button>
            </a>
          </div>
        </div>
      )}
    </Modal>
  );
}
