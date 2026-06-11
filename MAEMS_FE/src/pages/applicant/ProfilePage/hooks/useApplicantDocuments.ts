import { useCallback, useState } from "react";
import { Modal, Upload } from "antd";
import type { MessageInstance } from "antd/es/message/interface";
import { parseAxiosApiError } from "@/utils/apiError";
import type { Document as ApplicantDocument } from "@/types/document";
import {
  validateDocumentFile,
  isDocumentImageFile,
} from "@/utils/documentFileValidation";
import {
  deleteDocument,
  getApplicantDocuments,
  uploadApplicantDocuments,
} from "../api/applicantProfileApi";
import type { DocUploadItem } from "../types";
import { revokeDocItemPreviews } from "../utils/docUploadHelpers";
import { DOC_TYPE_OPTIONS } from "../utils/applicantProfileConstants";

/** Hook quản lý danh sách tài liệu đính kèm và luồng upload/xóa/preview. */
export function useApplicantDocuments(messageApi: MessageInstance) {
  const [documents, setDocuments] = useState<ApplicantDocument[]>([]);
  const [docsLoading, setDocsLoading] = useState(false);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [docItems, setDocItems] = useState<DocUploadItem[]>([]);
  const [previewDoc, setPreviewDoc] = useState<ApplicantDocument | null>(null);
  const [deletingDocId, setDeletingDocId] = useState<number | null>(null);

  const loadDocuments = useCallback(async () => {
    setDocsLoading(true);
    try {
      const docs = await getApplicantDocuments();
      setDocuments(docs);
    } catch {
      setDocuments([]);
    } finally {
      setDocsLoading(false);
    }
  }, []);

  /** Upload đồng thời nhiều file — mỗi file một request độc lập, lỗi không block file khác. */
  async function handleUploadAllDocs() {
    const idleItems = docItems.filter((i) => i.status === "idle");
    if (idleItems.length === 0) return;

    const invalidItem = idleItems.find(
      (item) => !validateDocumentFile(item.file).valid,
    );
    if (invalidItem) {
      const check = validateDocumentFile(invalidItem.file);
      if (!check.valid) messageApi.error(check.error);
      return;
    }

    setUploading(true);
    setDocItems((prev) =>
      prev.map((i) =>
        i.status === "idle" ? { ...i, status: "uploading" as const } : i,
      ),
    );

    await Promise.allSettled(
      idleItems.map(async (item) => {
        const formData = new FormData();
        formData.append("file", item.file);
        try {
          await uploadApplicantDocuments(formData);
          setDocItems((prev) =>
            prev.map((i) =>
              i.uid === item.uid ? { ...i, status: "success" as const } : i,
            ),
          );
        } catch (err) {
          // Tách `message` và `errors[]` để hiển thị riêng trên modal upload.
          const { message, errors } = parseAxiosApiError(
            err,
            "Tải lên thất bại. Vui lòng thử lại.",
          );
          setDocItems((prev) =>
            prev.map((i) =>
              i.uid === item.uid
                ? {
                    ...i,
                    status: "error" as const,
                    errorMessage: message || undefined,
                    errorDetails: errors.length > 0 ? errors : undefined,
                  }
                : i,
            ),
          );
        }
      }),
    );

    setUploading(false);
  }

  /** Đóng modal upload, revoke preview và tải lại danh sách nếu có file thành công. */
  function handleCloseUpload() {
    const hadSuccess = docItems.some((i) => i.status === "success");
    revokeDocItemPreviews(docItems);
    setDocItems([]);
    setUploadOpen(false);
    if (hadSuccess) void loadDocuments();
  }

  /** Xóa file khỏi hàng đợi upload và thu hồi blob URL preview. */
  function removeDocUploadItem(uid: string) {
    setDocItems((prev) => {
      const removed = prev.find((i) => i.uid === uid);
      if (removed?.previewUrl) URL.revokeObjectURL(removed.previewUrl);
      return prev.filter((i) => i.uid !== uid);
    });
  }

  /** Thêm file vào hàng đợi upload sau khi validate kích thước/đuôi. */
  function handleBeforeUpload(file: File & { uid: string }) {
    const validation = validateDocumentFile(file);
    if (!validation.valid) {
      messageApi.error(validation.error);
      return Upload.LIST_IGNORE;
    }

    const previewUrl = isDocumentImageFile(file)
      ? URL.createObjectURL(file)
      : undefined;

    setDocItems((prev) => {
      if (prev.length >= 5) return prev;
      if (prev.some((i) => i.uid === file.uid)) return prev;
      return [
        ...prev,
        { uid: file.uid, file, status: "idle", previewUrl },
      ];
    });
    return false;
  }

  /** Xác nhận và xóa tài liệu đã nộp trên server. */
  function handleDeleteDocument(doc: ApplicantDocument) {
    Modal.confirm({
      title: "Xoá tài liệu",
      content: `Bạn có chắc muốn xoá tài liệu "${doc.fileName || DOC_TYPE_OPTIONS.find((o) => o.value === doc.documentType)?.label || "này"}"?`,
      okText: "Xoá",
      okButtonProps: { danger: true },
      cancelText: "Huỷ",
      onOk: async () => {
        if (doc.documentId == null) return;
        setDeletingDocId(doc.documentId);
        try {
          await deleteDocument(doc.documentId);
          messageApi.success("Đã xoá tài liệu thành công.");
          void loadDocuments();
        } catch {
          messageApi.error("Xoá tài liệu thất bại. Vui lòng thử lại.");
        } finally {
          setDeletingDocId(null);
        }
      },
    });
  }

  return {
    documents,
    docsLoading,
    uploadOpen,
    setUploadOpen,
    uploading,
    docItems,
    previewDoc,
    setPreviewDoc,
    deletingDocId,
    loadDocuments,
    handleUploadAllDocs,
    handleCloseUpload,
    removeDocUploadItem,
    handleBeforeUpload,
    handleDeleteDocument,
  };
}
