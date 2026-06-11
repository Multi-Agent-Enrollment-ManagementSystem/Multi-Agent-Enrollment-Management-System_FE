import { Alert, Button, Modal, Spin, Typography, Upload } from "antd";
import {
  AlertCircle,
  CheckCircle2,
  FileText,
  UploadCloud,
  X,
} from "lucide-react";
import {
  ALLOWED_DOCUMENT_ACCEPT,
  ALLOWED_DOCUMENT_FORMATS_LABEL,
  formatDocumentFileSize,
} from "@/utils/documentFileValidation";
import type { DocUploadItem } from "../types";

const { Text } = Typography;

type DocumentUploadModalProps = {
  open: boolean;
  uploading: boolean;
  docItems: DocUploadItem[];
  onClose: () => void;
  onUploadAll: () => void;
  onRemoveItem: (uid: string) => void;
  onBeforeUpload: (file: File & { uid: string }) => boolean | typeof Upload.LIST_IGNORE;
};

/** Modal upload đa tài liệu — kéo thả tối đa 5 file, hiển thị trạng thái từng file. */
export function DocumentUploadModal({
  open,
  uploading,
  docItems,
  onClose,
  onUploadAll,
  onRemoveItem,
  onBeforeUpload,
}: DocumentUploadModalProps) {
  const idleCount = docItems.filter((i) => i.status === "idle").length;

  return (
    <Modal
      open={open}
      onCancel={onClose}
      title={
        <div className="flex items-center gap-2">
          <UploadCloud size={18} className="text-orange-500" />
          <span className="text-base font-bold text-gray-800">
            Tải lên tài liệu
          </span>
          <Text className="!text-xs !text-gray-400 !font-normal">
            (tối đa 5 file)
          </Text>
        </div>
      }
      footer={null}
      destroyOnClose
      width={620}
      centered
    >
      <div className="mt-3 space-y-3">
        <Alert
          type="info"
          showIcon
          className="!rounded-2xl !border-orange-100 !bg-orange-50/90"
          message={
            <span className="text-sm font-semibold text-gray-800">
              Định dạng cho phép: {ALLOWED_DOCUMENT_FORMATS_LABEL}
            </span>
          }
          description={
            <span className="text-xs text-gray-600">
              Mỗi file tối đa <strong>10 MB</strong>. Tải tối đa{" "}
              <strong>5 file</strong> mỗi lần.
            </span>
          }
        />

        {docItems.length < 5 && !uploading && (
          <Upload.Dragger
            accept={ALLOWED_DOCUMENT_ACCEPT}
            multiple
            showUploadList={false}
            fileList={[]}
            beforeUpload={onBeforeUpload}
            className="!rounded-2xl"
          >
            <div className="flex flex-col items-center gap-1.5 py-5">
              <UploadCloud size={30} className="text-gray-300" />
              <Text className="text-sm text-gray-500">
                Kéo thả file vào đây hoặc{" "}
                <span className="text-orange-500 font-medium">nhấn để chọn</span>
              </Text>
              <Text className="text-xs text-gray-500 text-center px-4">
                <span className="font-semibold text-gray-700">
                  {ALLOWED_DOCUMENT_FORMATS_LABEL}
                </span>
                {" · "}
                tối đa 10 MB/file ·{" "}
                <strong>Còn thêm được {5 - docItems.length} file</strong>
              </Text>
            </div>
          </Upload.Dragger>
        )}

        {docItems.length > 0 && (
          <div className="space-y-2">
            {docItems.map((item) => (
              <div
                key={item.uid}
                className={`rounded-2xl border px-4 py-3 transition-colors ${
                  item.status === "success"
                    ? "border-green-200 bg-green-50"
                    : item.status === "error"
                      ? "border-red-200 bg-red-50"
                      : item.status === "uploading"
                        ? "border-orange-200 bg-orange-50/60"
                        : "border-gray-100 bg-gray-50"
                }`}
              >
                <div className="flex items-center gap-2">
                  {item.previewUrl ? (
                    <img
                      src={item.previewUrl}
                      alt={`Xem trước ${item.file.name}`}
                      className="h-12 w-12 shrink-0 rounded-lg border border-gray-200 object-cover"
                    />
                  ) : (
                    <FileText size={16} className="text-gray-400 shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p
                      className="text-sm text-gray-700 font-medium truncate leading-tight"
                      title={item.file.name}
                    >
                      {item.file.name}
                    </p>
                    <p className="text-xs text-gray-400">
                      {formatDocumentFileSize(item.file.size)}
                    </p>
                  </div>

                  {item.status === "uploading" && (
                    <Spin size="small" className="shrink-0" />
                  )}
                  {item.status === "success" && (
                    <CheckCircle2
                      size={16}
                      className="text-green-500 shrink-0"
                    />
                  )}
                  {item.status === "error" && (
                    <AlertCircle size={16} className="text-red-500 shrink-0" />
                  )}

                  {item.status === "idle" && (
                    <button
                      onClick={() => onRemoveItem(item.uid)}
                      className="text-gray-300 hover:text-red-400 transition-colors shrink-0 ml-1"
                      title="Xóa"
                    >
                      <X size={15} />
                    </button>
                  )}
                </div>

                {item.status === "error" && item.errorMsg && (
                  <p className="text-xs text-red-500 mt-2 pl-6 leading-relaxed">
                    {item.errorMsg}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}

        {docItems.length === 0 && (
          <p className="text-center text-sm text-gray-400 py-2">
            Chưa có file nào. Kéo thả hoặc nhấn vào vùng trên để thêm.
          </p>
        )}

        <div className="flex gap-2 justify-end pt-1">
          <Button onClick={onClose} className="!rounded-xl">
            {docItems.some((i) => i.status === "success")
              ? "Đóng & Cập nhật"
              : "Hủy"}
          </Button>
          <Button
            type="primary"
            loading={uploading}
            disabled={uploading || idleCount === 0}
            onClick={onUploadAll}
            icon={<UploadCloud size={14} />}
            className="!rounded-xl !bg-orange-500 !border-orange-500 hover:!bg-orange-600"
          >
            {uploading
              ? "Đang tải lên..."
              : `Tải lên${idleCount > 0 ? ` (${idleCount})` : ""}`}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
