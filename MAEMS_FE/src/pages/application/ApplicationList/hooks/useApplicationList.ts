import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { notification } from "antd";
import type { ApplicationMe, ApplicationStatus } from "@/types/application";
import {
  fetchMyApplications,
  submitApplicationFinal,
} from "../api/applicationListApi";
import type { QrModalState, StatusFilterValue } from "../types";
import {
  meAdmissionFilterKey,
  meAdmissionOptionLabel,
  meCampusFilterKey,
  meCampusOptionLabel,
  meProgramFilterKey,
  meProgramOptionLabel,
} from "../utils/applicationListFilterKeys";
import {
  getAmountFromPaymentUrl,
  hasPaymentQr,
} from "../utils/applicationListPayment";
import {
  isApplicationStatus,
  STATUS_FILTER_ORDER,
  statusConfig,
} from "../utils/applicationListStatus";
import { useApplicationListColumns } from "./useApplicationListColumns";

/** Hook tập trung state, fetch, lọc và handler nộp đơn / QR cho trang danh sách đơn. */
export function useApplicationList() {
  const navigate = useNavigate();
  const [notifApi, notifContextHolder] = notification.useNotification();

  const [apps, setApps] = useState<ApplicationMe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submittingId, setSubmittingId] = useState<number | null>(null);
  const [qrModal, setQrModal] = useState<QrModalState | null>(null);

  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilterValue>("all");
  const [programFilter, setProgramFilter] = useState("all");
  const [campusFilter, setCampusFilter] = useState("all");
  const [admissionFilter, setAdmissionFilter] = useState("all");

  const statusOptions = useMemo(() => {
    const seen = new Set<ApplicationStatus>();
    for (const a of apps) {
      if (isApplicationStatus(a.status)) seen.add(a.status);
    }
    return STATUS_FILTER_ORDER.filter((s) => seen.has(s)).map((s) => ({
      value: s,
      label: statusConfig[s].label,
    }));
  }, [apps]);

  useEffect(() => {
    if (statusFilter === "all") return;
    if (!statusOptions.some((o) => o.value === statusFilter)) {
      setStatusFilter("all");
    }
  }, [statusFilter, statusOptions]);

  const programOptions = useMemo(() => {
    const m = new Map<string, string>();
    for (const a of apps) {
      const k = meProgramFilterKey(a);
      if (!m.has(k)) m.set(k, meProgramOptionLabel(a));
    }
    return [...m.entries()]
      .map(([value, label]) => ({ value, label }))
      .sort((x, y) => x.label.localeCompare(y.label, "vi"));
  }, [apps]);

  const campusOptions = useMemo(() => {
    const m = new Map<string, string>();
    for (const a of apps) {
      const k = meCampusFilterKey(a);
      if (!m.has(k)) m.set(k, meCampusOptionLabel(a));
    }
    return [...m.entries()]
      .map(([value, label]) => ({ value, label }))
      .sort((x, y) => x.label.localeCompare(y.label, "vi"));
  }, [apps]);

  const admissionOptions = useMemo(() => {
    const m = new Map<string, string>();
    for (const a of apps) {
      const k = meAdmissionFilterKey(a);
      if (!m.has(k)) m.set(k, meAdmissionOptionLabel(a));
    }
    return [...m.entries()]
      .map(([value, label]) => ({ value, label }))
      .sort((x, y) => x.label.localeCompare(y.label, "vi"));
  }, [apps]);

  const filteredApps = useMemo(() => {
    const q = searchText.trim().toLowerCase();
    return apps.filter((app) => {
      if (statusFilter !== "all" && app.status !== statusFilter) return false;
      if (programFilter !== "all" && meProgramFilterKey(app) !== programFilter)
        return false;
      if (campusFilter !== "all" && meCampusFilterKey(app) !== campusFilter)
        return false;
      if (
        admissionFilter !== "all" &&
        meAdmissionFilterKey(app) !== admissionFilter
      )
        return false;
      if (!q) return true;
      const blob = [
        app.programName,
        app.campusName,
        app.admissionTypeName,
        String(app.applicationId),
        app.applicantName,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return blob.includes(q);
    });
  }, [
    apps,
    searchText,
    statusFilter,
    programFilter,
    campusFilter,
    admissionFilter,
  ]);

  const hasActiveFilters =
    searchText.trim() !== "" ||
    statusFilter !== "all" ||
    programFilter !== "all" ||
    campusFilter !== "all" ||
    admissionFilter !== "all";

  const clearFilters = useCallback(() => {
    setSearchText("");
    setStatusFilter("all");
    setProgramFilter("all");
    setCampusFilter("all");
    setAdmissionFilter("all");
  }, []);

  const loadApps = useCallback(() => {
    setLoading(true);
    fetchMyApplications()
      .then((appList) => setApps(appList ?? []))
      .catch(() => setError("Không tìm thấy đơn đăng ký cho ứng viên này."))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    loadApps();
  }, [loadApps]);

  const handleSubmitFinal = useCallback(
    async (app: ApplicationMe) => {
      setSubmittingId(app.applicationId);
      try {
        const payment = await submitApplicationFinal(Number(app.applicationId));

        if (hasPaymentQr(payment)) {
          setQrModal({
            url: payment.url,
            transactionId: payment.transactionId,
            amount: getAmountFromPaymentUrl(payment.url),
            programName: app.programName,
          });
          return;
        }

        notifApi.success({
          message: "Thanh toán đã xác nhận",
          description: `Bạn đã thanh toán trước đó. Đơn "${app.programName}" đang được gửi xét duyệt!`,
          placement: "topRight",
          duration: 6,
        });
        loadApps();
      } catch (err: unknown) {
        const errData = (
          err as {
            response?: { data?: { message?: string; errors?: string[] } };
          }
        ).response?.data;
        const msg =
          errData?.message ||
          (errData?.errors?.length ? errData.errors.join("; ") : null) ||
          "Nộp đơn thất bại. Vui lòng thử lại.";
        notifApi.error({
          message: "Nộp đơn thất bại",
          description: msg,
          placement: "topRight",
          duration: 6,
        });
      } finally {
        setSubmittingId(null);
      }
    },
    [loadApps, notifApi],
  );

  const applicationColumns = useApplicationListColumns({
    submittingId,
    onSubmitFinal: handleSubmitFinal,
  });

  const handleQrPaid = useCallback(() => {
    setQrModal(null);
    loadApps();
  }, [loadApps]);

  const handleQrClose = useCallback(() => setQrModal(null), []);

  const handleQrExpire = useCallback(() => {
    setQrModal(null);
    notifApi.warning({
      message: "Phiên thanh toán hết hạn",
      description:
        "Mã QR đã hết hiệu lực sau 5 phút. Vui lòng nộp đơn lại để nhận mã QR mới.",
      placement: "topRight",
      duration: 8,
    });
  }, [notifApi]);

  const goToApplicationDetail = useCallback(
    (id: number) => navigate(`/applicant/applications/${id}`),
    [navigate],
  );

  const goToNewApplication = useCallback(
    () => navigate("/applicant/submit-application"),
    [navigate],
  );

  return {
    notifContextHolder,
    qrModal,
    handleQrPaid,
    handleQrClose,
    handleQrExpire,
    loading,
    error,
    apps,
    filteredApps,
    hasActiveFilters,
    clearFilters,
    searchText,
    setSearchText,
    statusFilter,
    setStatusFilter,
    programFilter,
    setProgramFilter,
    campusFilter,
    setCampusFilter,
    admissionFilter,
    setAdmissionFilter,
    statusOptions,
    programOptions,
    campusOptions,
    admissionOptions,
    applicationColumns,
    handleSubmitFinal,
    submittingId,
    goToApplicationDetail,
    goToNewApplication,
  };
}
