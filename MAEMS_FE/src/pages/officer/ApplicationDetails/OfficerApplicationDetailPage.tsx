import { Button, Spin, Typography } from "antd";
import { ArrowLeft, Download, RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { OfficerLayout } from "../../../layouts/OfficerLayout";
import {
  AgentNotesCard,
  ApplicantProfileModal,
  ApplicationActionsPanel,
  ApplicationProfileTabs,
  DocumentPreviewModal,
  DocumentsSection,
  RejectApplicationModal,
  SupplementRequestModal,
} from "./components";
import { useOfficerApplicationDetail } from "./hooks";

const { Title, Text } = Typography;

/** Trang chi tiết hồ sơ (cán bộ) — ghép layout và ủy logic cho hook */
export function OfficerApplicationDetail() {
  const navigate = useNavigate();
  const detail = useOfficerApplicationDetail();

  return (
    <OfficerLayout>
      {detail.contextHolder}

      <div className="flex flex-col gap-6 pb-14 md:pb-16">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <Button
              icon={<ArrowLeft size={15} />}
              onClick={() => navigate(-1)}
              className="!rounded-xl shrink-0"
            >
              Quay lại
            </Button>
            <div className="min-w-0 flex-1">
              <Title
                level={4}
                className="!mb-0.5 !text-gray-800 !font-bold !flex !items-center gap-2 flex-wrap"
              >
                <span>
                  Chi tiết hồ sơ
                  {detail.app && (
                    <span className="ml-2 font-mono text-indigo-500 text-lg">
                      #{detail.app.applicationId}
                    </span>
                  )}
                </span>
              </Title>
              <Text className="text-gray-400 text-sm">
                Thông tin đầy đủ về hồ sơ đăng ký
              </Text>
            </div>
          </div>
          <Button
            icon={<RefreshCw size={14} />}
            onClick={detail.loadApp}
            loading={detail.loading}
            className="!rounded-xl shrink-0"
          >
            Làm mới
          </Button>
        </div>

        <Spin spinning={detail.loading}>
          {detail.app && (
            <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(280px,33%)] gap-4 lg:gap-6 items-start">
              <div className="flex min-w-0 flex-col gap-6 md:gap-8">
                <ApplicationProfileTabs
                  app={detail.app}
                  profileTabKey={detail.profileTabKey}
                  onProfileTabChange={detail.setProfileTabKey}
                  onOpenApplicantProfile={detail.openApplicantProfile}
                  applicantScore={detail.applicantScore}
                  scoresLoading={detail.scoresLoading}
                  onRefreshScores={detail.loadApplicantScores}
                />

                <AgentNotesCard
                  app={detail.app}
                  expanded={detail.notesExpanded}
                  onToggleExpanded={() =>
                    detail.setNotesExpanded((prev) => !prev)
                  }
                />

                <DocumentsSection
                  app={detail.app}
                  onPreviewDocument={detail.setPreviewDoc}
                />
              </div>

              <div className="flex min-w-0 w-full flex-col gap-3 lg:sticky lg:top-4 lg:self-start">
                <ApplicationActionsPanel
                  app={detail.app}
                  isDone={detail.isDone}
                  canReview={detail.canReview}
                  canRequestSupplement={detail.canRequestSupplement}
                  actionLoading={detail.actionLoading}
                  onApprove={detail.handleApprove}
                  onReject={() => detail.setRejectModal(true)}
                  onRequestSupplement={detail.openSupplementModal}
                />
                <Button
                  block
                  icon={<Download size={15} />}
                  loading={detail.exportLoading}
                  onClick={detail.handleDownloadExport}
                  className="!rounded-xl !h-10 !border-indigo-200 !text-indigo-600 hover:!border-indigo-300 hover:!bg-indigo-50"
                >
                  Tải về
                </Button>
              </div>
            </div>
          )}
        </Spin>
      </div>

      <ApplicantProfileModal
        app={detail.app}
        open={detail.applicantModalOpen}
        loading={detail.applicantLoading}
        applicantDetail={detail.applicantDetail}
        onClose={detail.closeApplicantProfile}
      />

      <DocumentPreviewModal
        document={detail.previewDoc}
        detailExpanded={detail.previewDetailExpanded}
        onToggleDetailExpanded={() =>
          detail.setPreviewDetailExpanded((prev) => !prev)
        }
        onClose={detail.closePreviewDoc}
      />

      <RejectApplicationModal
        open={detail.rejectModal}
        form={detail.rejectForm}
        loading={detail.actionLoading === "reject"}
        onCancel={() => {
          detail.setRejectModal(false);
          detail.rejectForm.resetFields();
        }}
        onSubmit={detail.handleRejectSubmit}
      />

      <SupplementRequestModal
        open={detail.supplementModal}
        form={detail.supplementForm}
        loading={detail.actionLoading === "supplement"}
        onCancel={() => {
          detail.setSupplementModal(false);
          detail.supplementForm.resetFields();
        }}
        onSubmit={detail.handleSupplementSubmit}
      />
    </OfficerLayout>
  );
}
