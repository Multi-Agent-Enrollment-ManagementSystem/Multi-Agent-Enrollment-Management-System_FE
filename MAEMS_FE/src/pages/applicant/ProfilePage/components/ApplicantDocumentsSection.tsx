import { Button, Card, Empty, Spin, Tag, Tooltip, Typography } from "antd";
import {
  Eye,
  FileImage,
  FileText,
  Paperclip,
  Trash2,
  UploadCloud,
} from "lucide-react";
import { motion } from "motion/react";
import { ensureUtc } from "@/utils/date";
import type { Document as ApplicantDocument } from "@/types/document";
import { DOC_TYPE_OPTIONS } from "../utils/applicantProfileConstants";
import {
  getVerificationBadge,
  isImageDocument,
} from "../utils/applicantProfileDocumentHelpers";

const { Title, Text } = Typography;

type ApplicantDocumentsSectionProps = {
  documents: ApplicantDocument[];
  docsLoading: boolean;
  deletingDocId: number | null;
  onUploadClick: () => void;
  onPreview: (doc: ApplicantDocument) => void;
  onDelete: (doc: ApplicantDocument) => void;
};

/** Section danh sách tài liệu đính kèm hồ sơ — grid thumbnail và nút upload. */
export function ApplicantDocumentsSection({
  documents,
  docsLoading,
  deletingDocId,
  onUploadClick,
  onPreview,
  onDelete,
}: ApplicantDocumentsSectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.32, ease: "easeOut", delay: 0.1 }}
      whileHover={{ y: -2 }}
    >
      <Card className="w-full rounded-[36px] border border-gray-100/90 bg-white/90 shadow-sm backdrop-blur-[2px] transition-shadow duration-300 hover:shadow-md [&_.ant-card-body]:!p-4 sm:[&_.ant-card-body]:!p-6 lg:[&_.ant-card-body]:!p-8">
        <div className="mb-1 flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
          <div className="flex items-center gap-2">
            <Paperclip size={16} className="text-orange-500" />
            <Title level={5} className="!mb-0 !text-gray-800">
              Tài liệu đính kèm
            </Title>
          </div>
          <Button
            icon={<UploadCloud size={14} />}
            className="!rounded-lg !border-orange-200 !text-orange-600 hover:!bg-orange-50"
            onClick={onUploadClick}
          >
            Tải lên tài liệu
          </Button>
        </div>
        <Text className="text-gray-400 text-sm block mb-5">
          Các tài liệu bạn nộp sẽ được đính kèm vào hồ sơ và dùng cho quá trình
          xét tuyển.
        </Text>

        {docsLoading ? (
          <div className="flex justify-center py-8">
            <Spin />
          </div>
        ) : documents.length === 0 ? (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={
              <Text className="text-gray-400 text-sm">Chưa có tài liệu nào.</Text>
            }
            className="py-6"
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {documents.map((doc, idx) => {
              const typeLabel =
                DOC_TYPE_OPTIONS.find((o) => o.value === doc.documentType)
                  ?.label ??
                doc.documentType ??
                "Tài liệu";
              const isImage = isImageDocument(doc);
              const badge = getVerificationBadge(doc.verificationResult);
              return (
                <Tooltip
                  key={doc.documentId ?? idx}
                  title="Nhấn để xem chi tiết"
                >
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.24,
                      delay: Math.min(idx * 0.03, 0.2),
                    }}
                    whileHover={{ y: -2, scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    className="group relative flex flex-col overflow-hidden rounded-3xl border border-gray-100 bg-white cursor-pointer transition-all hover:border-orange-300 hover:shadow-md"
                    onClick={() => onPreview(doc)}
                  >
                    <div className="relative w-full h-24 bg-gray-50 flex items-center justify-center overflow-hidden">
                      {isImage ? (
                        <img
                          src={doc.filePath}
                          alt={doc.fileName}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (
                              e.currentTarget as HTMLImageElement
                            ).style.display = "none";
                            (
                              e.currentTarget
                                .nextElementSibling as HTMLElement | null
                            )?.style.setProperty("display", "flex");
                          }}
                        />
                      ) : null}
                      <div
                        className="w-full h-full items-center justify-center flex-col gap-1"
                        style={{ display: isImage ? "none" : "flex" }}
                      >
                        <FileText size={28} className="text-orange-300" />
                        <span className="text-xs text-gray-400 uppercase">
                          {doc.fileFormat ?? "file"}
                        </span>
                      </div>
                      <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                        <Eye size={20} className="text-white" />
                        <button
                          className="text-white hover:text-red-300 transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            onDelete(doc);
                          }}
                          disabled={deletingDocId === doc.documentId}
                          title="Xoá tài liệu"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                      <div className="absolute top-1.5 right-1.5">
                        <Tag
                          color={badge.color}
                          className="!text-[10px] !px-1.5 !py-0 !leading-4 !m-0 !rounded-full"
                        >
                          {badge.label}
                        </Tag>
                      </div>
                    </div>

                    <div className="px-2.5 py-2">
                      <p
                        className="text-xs font-medium text-gray-700 truncate leading-tight"
                        title={doc.fileName}
                      >
                        {doc.fileName || typeLabel}
                      </p>
                      <p className="text-[10px] text-gray-400 truncate mt-0.5 leading-tight flex items-center gap-1">
                        <FileImage size={10} className="shrink-0" />
                        {typeLabel}
                      </p>
                      {doc.uploadedAt && (
                        <p className="text-[10px] text-gray-300 mt-0.5 leading-tight">
                          {new Date(
                            ensureUtc(doc.uploadedAt),
                          ).toLocaleDateString("vi-VN")}
                        </p>
                      )}
                    </div>
                  </motion.div>
                </Tooltip>
              );
            })}
          </div>
        )}
      </Card>
    </motion.div>
  );
}
