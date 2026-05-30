import { Button, Card, Tag, Typography } from "antd";
import { ExternalLink, Eye, FileText } from "lucide-react";
import type { Application } from "../../../../types/application";
import type { Document } from "../../../../types/document";
import { ensureUtc } from "../../../../utils/date";
import { isImageDocument, verificationBadge } from "../utils/displayHelpers";

const { Title, Text } = Typography;

type DocumentsSectionProps = {
  app: Application;
  onPreviewDocument: (doc: Document) => void;
};

/** Lưới tài liệu đính kèm với thumbnail và trạng thái xác minh */
export function DocumentsSection({ app, onPreviewDocument }: DocumentsSectionProps) {
  return (
    <Card
      className="rounded-2xl border border-gray-100 shadow-sm"
      styles={{ body: { padding: "20px 24px" } }}
    >
      <div className="flex items-center justify-between mb-4">
        <Title level={5} className="!mb-0 !text-gray-700">
          Tài liệu đính kèm
        </Title>
        <Tag color={(app.documents?.length ?? 0) > 0 ? "blue" : "orange"}>
          {app.documents?.length ?? 0} tài liệu
        </Tag>
      </div>

      {!app.documents?.length ? (
        <div className="text-center py-8 text-gray-300">
          <FileText size={36} className="mx-auto mb-2" />
          <Text className="text-gray-400 text-sm">
            Chưa có tài liệu nào được đính kèm
          </Text>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {app.documents.map((doc: Document) => {
            const isImage = isImageDocument(doc);
            const fileUrl = doc.filePath;
            return (
              <div
                key={doc.documentId}
                className="group rounded-xl border border-gray-100 hover:border-indigo-200 hover:shadow-sm transition-all overflow-hidden cursor-pointer"
                onClick={() => onPreviewDocument(doc)}
              >
                <div className="relative h-52 bg-gray-50 border-b border-gray-100 overflow-hidden">
                  {isImage && fileUrl && (
                    <img
                      src={fileUrl}
                      alt={doc.fileName || doc.documentType}
                      className="w-full h-full object-contain bg-white"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).style.display =
                          "none";
                        const fb = e.currentTarget
                          .nextElementSibling as HTMLElement | null;
                        if (fb) fb.style.display = "flex";
                      }}
                    />
                  )}
                  <div
                    className="absolute inset-0 items-center justify-center flex-col gap-1"
                    style={{
                      display: isImage && fileUrl ? "none" : "flex",
                    }}
                  >
                    <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center">
                      <FileText size={28} className="text-indigo-400" />
                    </div>
                    <span className="text-xs text-gray-400 uppercase mt-1">
                      {doc.fileFormat || "file"}
                    </span>
                  </div>
                  <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Eye size={20} className="text-white" />
                  </div>
                </div>

                <div className="p-3">
                  <div className="flex items-start justify-between gap-2">
                    <Text className="font-medium text-gray-700 text-sm block truncate">
                      {doc.fileName || doc.documentType}
                    </Text>
                    {fileUrl && (
                      <Button
                        size="small"
                        type="link"
                        icon={<ExternalLink size={13} />}
                        href={fileUrl}
                        target="_blank"
                        className="!p-0 flex-shrink-0"
                        onClick={(e) => e.stopPropagation()}
                      />
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-2 flex-wrap">
                    <Tag className="!text-xs !m-0 !px-1.5">
                      {doc.documentType}
                    </Tag>
                    <Text className="text-xs text-gray-400">
                      {doc.fileFormat?.toUpperCase()}
                    </Text>
                    <Text className="text-xs text-gray-300">
                      {doc.uploadedAt
                        ? new Date(
                            ensureUtc(doc.uploadedAt),
                          ).toLocaleDateString("vi-VN")
                        : ""}
                    </Text>
                  </div>
                  <div className="mt-2">
                    {verificationBadge(doc.verificationResult)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
}
