import { Form, message } from "antd";
import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getAdmissionTypeById } from "../../../../api/admission-types";
import { getApplicantById } from "../../../../api/applicants";
import {
  fetchApplicationDetail,
  patchApplication,
  requestAdditionalDocuments,
} from "../../../../api/applications";
import { getApplicantScores } from "../../../../api/scores";
import type { CreateApplicantResponse } from "../../../../types/applicant";
import type { Application } from "../../../../types/application";
import type { Document } from "../../../../types/document";
import type { Score } from "../../../../types/score";
import {
  showApiWrapperFailure,
  showApiWrapperSuccess,
  showAxiosApiFailure,
} from "../../../../utils/apiFeedback";
import { pickPrimaryScore } from "../../../../utils/scoreDisplay";
import { downloadApplicationDetail } from "../utils/exportApplicationDetail";
import { normalizeRequiredDocumentList } from "../utils/displayHelpers";

/** Hook tập trung state và xử lý nghiệp vụ trang chi tiết hồ sơ (cán bộ) */
export function useOfficerApplicationDetail() {
  const { id } = useParams<{ id: string }>();
  const [messageApi, contextHolder] = message.useMessage();

  const [app, setApp] = useState<Application | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const [rejectModal, setRejectModal] = useState(false);
  const [supplementModal, setSupplementModal] = useState(false);
  const [previewDoc, setPreviewDoc] = useState<Document | null>(null);
  const [notesExpanded, setNotesExpanded] = useState(false);
  const [previewDetailExpanded, setPreviewDetailExpanded] = useState(false);
  const [applicantModalOpen, setApplicantModalOpen] = useState(false);
  const [applicantDetail, setApplicantDetail] =
    useState<CreateApplicantResponse | null>(null);
  const [applicantLoading, setApplicantLoading] = useState(false);
  const [rejectForm] = Form.useForm();
  const [supplementForm] = Form.useForm();

  const [profileTabKey, setProfileTabKey] = useState("profile");
  const [applicantScore, setApplicantScore] = useState<Score | null>(null);
  const [scoresLoading, setScoresLoading] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);

  const loadApplicantScores = useCallback(async () => {
    if (!app?.applicantId) return;
    setScoresLoading(true);
    try {
      const wrapper = await getApplicantScores(app.applicantId);
      if (wrapper.success) {
        showApiWrapperSuccess(messageApi, wrapper);
        setApplicantScore(pickPrimaryScore(wrapper.data));
      } else {
        showApiWrapperFailure(
          messageApi,
          wrapper,
          "Không tải được điểm thí sinh.",
        );
        setApplicantScore(null);
      }
    } catch (err) {
      showAxiosApiFailure(messageApi, err, "Không tải được điểm thí sinh.");
      setApplicantScore(null);
    } finally {
      setScoresLoading(false);
    }
  }, [app?.applicantId, messageApi]);

  // Gọi API điểm khi cán bộ chuyển sang tab "Điểm thí sinh"
  useEffect(() => {
    if (profileTabKey === "scores" && app?.applicantId) {
      void loadApplicantScores();
    }
  }, [profileTabKey, app?.applicantId, loadApplicantScores]);

  const openApplicantProfile = async () => {
    if (!app) return;
    setApplicantModalOpen(true);
    setApplicantDetail(null);
    setApplicantLoading(true);
    try {
      const data = await getApplicantById(app.applicantId);
      setApplicantDetail(data);
    } catch {
      messageApi.error("Không tải được hồ sơ thí sinh.");
      setApplicantModalOpen(false);
    } finally {
      setApplicantLoading(false);
    }
  };

  const closeApplicantProfile = () => {
    setApplicantModalOpen(false);
    setApplicantDetail(null);
  };

  const loadApp = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const data = await fetchApplicationDetail(Number(id));
      setApp(data);
    } catch {
      messageApi.error("Không thể tải thông tin hồ sơ.");
    } finally {
      setLoading(false);
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    void loadApp();
  }, [id]);

  const handleApprove = async () => {
    if (!app) return;
    if (app.status !== "under_review") {
      messageApi.warning(
        "Chỉ có thể phê duyệt khi hồ sơ ở trạng thái chờ xét duyệt.",
      );
      return;
    }

    setActionLoading("approve");
    try {
      await patchApplication(app.applicationId, { status: "approved" });
      messageApi.success("Đã phê duyệt hồ sơ.");
      setApp({ ...app, status: "approved" });
    } catch {
      messageApi.error("Phê duyệt thất bại, vui lòng thử lại.");
    } finally {
      setActionLoading(null);
    }
  };

  const handleRejectSubmit = async () => {
    if (!app) return;
    if (app.status !== "under_review") {
      messageApi.warning(
        "Chỉ có thể từ chối khi hồ sơ ở trạng thái chờ xét duyệt.",
      );
      return;
    }

    try {
      await rejectForm.validateFields();
      setActionLoading("reject");
      await patchApplication(app.applicationId, { status: "rejected" });
      messageApi.success("Đã từ chối hồ sơ.");
      setApp({ ...app, status: "rejected" });
      setRejectModal(false);
      rejectForm.resetFields();
    } catch {
      messageApi.error("Từ chối thất bại, vui lòng thử lại.");
    } finally {
      setActionLoading(null);
    }
  };

  const handleSupplementSubmit = async () => {
    if (!app) return;
    if (app.status !== "under_review") {
      messageApi.warning(
        "Chỉ có thể yêu cầu bổ sung khi hồ sơ đang chờ xét duyệt.",
      );
      return;
    }

    try {
      const values = await supplementForm.validateFields();
      const docsNeed = String(values.note ?? "");
      setActionLoading("supplement");
      const updated = await requestAdditionalDocuments(app.applicationId, {
        docsNeed,
      });
      messageApi.success("Đã gửi yêu cầu bổ sung tài liệu.");
      setApp({
        ...app,
        status: updated.status,
        requiresReview: updated.requiresReview,
        lastUpdated: updated.lastUpdated || app.lastUpdated,
        assignedOfficerId: updated.assignedOfficerId,
        assignedOfficerName: updated.assignedOfficerName,
      });
      setSupplementModal(false);
      supplementForm.resetFields();
    } catch {
      messageApi.error("Gửi yêu cầu thất bại, vui lòng thử lại.");
    } finally {
      setActionLoading(null);
    }
  };

  const openSupplementModal = async () => {
    if (!app) return;
    if (app.status !== "under_review") {
      messageApi.warning(
        "Chỉ có thể yêu cầu bổ sung khi hồ sơ đang chờ xét duyệt.",
      );
      return;
    }

    let suggestedDocs = "";
    try {
      const admissionType = await getAdmissionTypeById(app.admissionTypeId);
      suggestedDocs = normalizeRequiredDocumentList(
        admissionType.requiredDocumentList,
      );
    } catch {
      // Modal vẫn mở được khi không tải được gợi ý tài liệu
    }

    setSupplementModal(true);
    supplementForm.setFieldsValue({ note: suggestedDocs });
  };

  const closePreviewDoc = () => {
    setPreviewDoc(null);
    setPreviewDetailExpanded(false);
  };

  /** Tải về → file Excel APP-{id}.xlsx (dữ liệu gốc từ API) */
  const handleDownloadExport = async () => {
    if (!app) return;
    setExportLoading(true);
    try {
      const result = await downloadApplicationDetail(app);
      messageApi.success(`Đã tải "${result.fileName}" vào Thư mục Tải xuống.`);
    } catch {
      messageApi.error("Không thể tải Excel. Vui lòng thử lại.");
    } finally {
      setExportLoading(false);
    }
  };

  const isDone = app?.status === "approved" || app?.status === "rejected";
  const canReview = app?.status === "under_review";
  const canRequestSupplement = app?.status === "under_review";

  return {
    contextHolder,
    app,
    loading,
    actionLoading,
    rejectModal,
    setRejectModal,
    supplementModal,
    setSupplementModal,
    previewDoc,
    setPreviewDoc,
    notesExpanded,
    setNotesExpanded,
    previewDetailExpanded,
    setPreviewDetailExpanded,
    applicantModalOpen,
    applicantDetail,
    applicantLoading,
    rejectForm,
    supplementForm,
    profileTabKey,
    setProfileTabKey,
    applicantScore,
    scoresLoading,
    loadApplicantScores,
    openApplicantProfile,
    closeApplicantProfile,
    loadApp,
    handleApprove,
    handleRejectSubmit,
    handleSupplementSubmit,
    openSupplementModal,
    closePreviewDoc,
    isDone,
    canReview,
    canRequestSupplement,
    exportLoading,
    handleDownloadExport,
  };
}
