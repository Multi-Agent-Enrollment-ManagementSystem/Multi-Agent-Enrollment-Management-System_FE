import { Button, Modal, Typography } from "antd";
import { ChevronDown, ChevronUp, ExternalLink, FileText } from "lucide-react";
import type { Document } from "../../../../types/document";
import { ensureUtc } from "../../../../utils/date";
import { isImageDocument, verificationBadge } from "../utils/displayHelpers";

const { Text } = Typography;

type DocumentPreviewModalProps = {
  document: Document | null;
  detailExpanded: boolean;
  onToggleDetailExpanded: () => void;
  onClose: () => void;
};

/** Modal xem trước tài liệu (ảnh hoặc iframe PDF) */
export function DocumentPreviewModal({
  document: previewDoc,
  detailExpanded,
  onToggleDetailExpanded,
  onClose,
}: DocumentPreviewModalProps) {
  return (
    <Modal
      open={!!previewDoc}
      onCancel={onClose}
      footer={null}
      destroyOnClose
      width={720}
      title={
        previewDoc && (
          <div className="flex items-center gap-2 pr-4">
            <FileText size={16} className="text-indigo-500 shrink-0" />
            <span className="text-sm font-semibold text-gray-800 truncate">
              {previewDoc.fileName || previewDoc.documentType || "Tài liệu"}
            </span>
          </div>
        )
      }
    >
      {previewDoc && (
        <div className="flex flex-col gap-4 pt-2">
          <div className="rounded-xl overflow-hidden border border-gray-100 bg-gray-50 flex items-center justify-center h-[50vh] sm:h-[55vh] md:h-[60vh] max-h-[640px] min-h-[240px]">
            {isImageDocument(previewDoc) ? (
              <img
                src={previewDoc.filePath}
                alt={previewDoc.fileName}
                className="block w-full h-full object-contain"
              />
            ) : (
              <iframe
                src={previewDoc.filePath}
                title={previewDoc.fileName}
                className="w-full h-full border-0"
              />
            )}
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <Text className="!text-xs !text-gray-400 block">Loại tài liệu</Text>
              <Text className="!text-sm !text-gray-700 !font-medium">
                {previewDoc.documentType || "—"}
              </Text>
            </div>
            <div>
              <Text className="!text-xs !text-gray-400 block">Định dạng</Text>
              <Text className="!text-sm !text-gray-700 !font-medium uppercase">
                {previewDoc.fileFormat || "—"}
              </Text>
            </div>
            <div>
              <Text className="!text-xs !text-gray-400 block">Ngày tải lên</Text>
              <Text className="!text-sm !text-gray-700 !font-medium">
                {previewDoc.uploadedAt
                  ? new Date(
                      ensureUtc(previewDoc.uploadedAt),
                    ).toLocaleDateString("vi-VN", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                  : "—"}
              </Text>
            </div>
            <div>
              <Text className="!text-xs !text-gray-400 block">Xác minh</Text>
              <div className="mt-1">
                {verificationBadge(previewDoc.verificationResult)}
              </div>
            </div>
            {previewDoc.verificationDetails && (
              <div className="col-span-2">
                <button
                  type="button"
                  className="w-full flex items-center justify-between !text-xs text-gray-400 hover:text-gray-500"
                  onClick={onToggleDetailExpanded}
                >
                  <span>Ghi chú duyệt</span>
                  {detailExpanded ? (
                    <ChevronUp size={14} />
                  ) : (
                    <ChevronDown size={14} />
                  )}
                </button>
                <Text
                  className={`!text-sm !text-gray-700 block ${detailExpanded ? "" : "line-clamp-2"}`}
                >
                  {previewDoc.verificationDetails}
                </Text>
              </div>
            )}
          </div>

          <div className="flex justify-end">
            <a
              href={previewDoc.filePath}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                icon={<ExternalLink size={14} />}
                className="!rounded-lg !border-indigo-200 !text-indigo-600 hover:!bg-indigo-50"
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
