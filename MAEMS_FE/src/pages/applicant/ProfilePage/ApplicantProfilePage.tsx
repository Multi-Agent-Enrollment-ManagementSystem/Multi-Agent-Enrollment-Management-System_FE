import { useEffect } from "react";
import { Card, Skeleton, Typography } from "antd";
import { ApplicantLayout } from "@/layouts/ApplicantLayout";
import { ApplicantMenu } from "../ApplicantMenu";
import {
  AccountProfileCard,
  ApplicantDocumentsSection,
  ApplicantFormCard,
  ApplicantReadOnlyCard,
  DocumentPreviewModal,
  DocumentUploadModal,
} from "./components";
import { useApplicantDocuments, useApplicantProfile } from "./hooks";

const { Title } = Typography;

/** Trang hồ sơ cá nhân thí sinh — ghép layout và các section hồ sơ/tài liệu. */
export function ApplicantProfilePage() {
  const {
    profile,
    applicant,
    loading,
    submitting,
    isEditing,
    setIsEditing,
    form,
    messageApi,
    contextHolder,
    initial,
    handleStartEdit,
    handleSubmit,
  } = useApplicantProfile();

  const {
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
  } = useApplicantDocuments(messageApi);

  // Tải danh sách tài liệu khi đã có hồ sơ thí sinh sau lần load đầu.
  useEffect(() => {
    if (!loading && applicant) {
      void loadDocuments();
    }
  }, [loading, applicant, loadDocuments]);

  return (
    <ApplicantLayout menuItems={ApplicantMenu}>
      {contextHolder}
      <div className="mx-auto w-full max-w-3xl space-y-8 px-3 pb-6 sm:px-0">
        <Title level={4} className="!mb-6 !text-gray-700 !font-semibold">
          Hồ sơ cá nhân
        </Title>

        <AccountProfileCard
          loading={loading}
          profile={profile}
          initial={initial}
        />

        {!loading && applicant && !isEditing && (
          <ApplicantReadOnlyCard
            applicant={applicant}
            onStartEdit={handleStartEdit}
          />
        )}

        {!loading && applicant && !isEditing && (
          <ApplicantDocumentsSection
            documents={documents}
            docsLoading={docsLoading}
            deletingDocId={deletingDocId}
            onUploadClick={() => setUploadOpen(true)}
            onPreview={setPreviewDoc}
            onDelete={handleDeleteDocument}
          />
        )}

        <DocumentPreviewModal
          doc={previewDoc}
          onClose={() => setPreviewDoc(null)}
        />

        <DocumentUploadModal
          open={uploadOpen}
          uploading={uploading}
          docItems={docItems}
          onClose={handleCloseUpload}
          onUploadAll={() => void handleUploadAllDocs()}
          onRemoveItem={removeDocUploadItem}
          onBeforeUpload={handleBeforeUpload}
        />

        {!loading && (!applicant || isEditing) ? (
          <ApplicantFormCard
            isEditing={isEditing}
            submitting={submitting}
            form={form}
            onSubmit={(values) => void handleSubmit(values)}
            onCancelEdit={() => setIsEditing(false)}
          />
        ) : loading ? (
          <Card className="w-full rounded-[36px] border border-gray-100/90 shadow-sm [&_.ant-card-body]:!p-4 sm:[&_.ant-card-body]:!p-6 lg:[&_.ant-card-body]:!p-8">
            <Skeleton active paragraph={{ rows: 8 }} />
          </Card>
        ) : null}
      </div>
    </ApplicantLayout>
  );
}
