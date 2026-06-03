import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { message } from "antd";
import type { TableProps } from "antd";
import type {
  FilterValue,
  SorterResult,
  TablePaginationConfig,
} from "antd/es/table/interface";
import type { ApplicationMe, ApplicationStatus } from "@/types/application";
import {
  parseApiWrapper,
  parseAxiosApiError,
  showApiWrapperFailure,
  showApiWrapperSuccess,
  showAxiosApiFailure,
} from "@/utils/apiFeedback";
import {
  fetchMyApplicationsForList,
  submitApplicationFinalForList,
} from "../api/applicationListApi";
import type {
  ApplicationListSortField,
  ApplicationListSortState,
  QrModalState,
  StatusFilterValue,
} from "../types";
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
  DEFAULT_APPLICATION_LIST_SORT,
  sortApplicationList,
} from "../utils/applicationListSort";
import {
  isApplicationStatus,
  STATUS_FILTER_ORDER,
  statusConfig,
} from "../utils/applicationListStatus";
import { useApplicationListColumns } from "./useApplicationListColumns";

const LOAD_ERROR_FALLBACK =
  "Không tải được danh sách đơn đăng ký. Vui lòng thử lại.";

/** Hook tập trung state, fetch, lọc, sort và handler nộp đơn / QR. */
export function useApplicationList() {
  const navigate = useNavigate();
  const [messageApi, messageContextHolder] = message.useMessage();

  const [apps, setApps] = useState<ApplicationMe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submittingId, setSubmittingId] = useState<number | null>(null);
  const [qrModal, setQrModal] = useState<QrModalState | null>(null);
  const [sort, setSort] = useState<ApplicationListSortState>(
    DEFAULT_APPLICATION_LIST_SORT,
  );

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

  const sortedFilteredApps = useMemo(
    () => sortApplicationList(filteredApps, sort.field, sort.order),
    [filteredApps, sort.field, sort.order],
  );

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

  const loadApps = useCallback(async (options?: { silent?: boolean }) => {
    setLoading(true);
    setError(null);
    try {
      const { items, wrapper } = await fetchMyApplicationsForList();
      setApps(items);

      if (wrapper.success) {
        if (!options?.silent) {
          showApiWrapperSuccess(messageApi, wrapper);
        }
      } else {
        showApiWrapperFailure(messageApi, wrapper, LOAD_ERROR_FALLBACK);
        const { message: main, errors } = parseApiWrapper(
          wrapper,
          LOAD_ERROR_FALLBACK,
        );
        setError(errors[0] ?? main);
      }
    } catch (err: unknown) {
      showAxiosApiFailure(messageApi, err, LOAD_ERROR_FALLBACK);
      const { message: main, errors } = parseAxiosApiError(
        err,
        LOAD_ERROR_FALLBACK,
      );
      setError(errors[0] ?? main);
      setApps([]);
    } finally {
      setLoading(false);
    }
  }, [messageApi]);

  useEffect(() => {
    loadApps();
  }, [loadApps]);

  const handleTableChange: TableProps<ApplicationMe>["onChange"] = useCallback(
    (
      _pagination: TablePaginationConfig,
      _filters: Record<string, FilterValue | null>,
      sorter: SorterResult<ApplicationMe> | SorterResult<ApplicationMe>[],
    ) => {
      const single = Array.isArray(sorter) ? sorter[0] : sorter;
      if (!single?.field || !single.order) {
        setSort(DEFAULT_APPLICATION_LIST_SORT);
        return;
      }
      const field = String(single.field) as ApplicationListSortField;
      if (
        field === "submittedAt" ||
        field === "lastUpdated" ||
        field === "applicationId"
      ) {
        setSort({ field, order: single.order });
      }
    },
    [],
  );

  const handleSubmitFinal = useCallback(
    async (app: ApplicationMe) => {
      setSubmittingId(app.applicationId);
      try {
        const payment = await submitApplicationFinalForList(
          Number(app.applicationId),
        );

        if (hasPaymentQr(payment)) {
          setQrModal({
            url: payment.url,
            transactionId: payment.transactionId,
            amount: getAmountFromPaymentUrl(payment.url),
            programName: app.programName,
          });
          return;
        }

        messageApi.success(
          `Bạn đã thanh toán trước đó. Đơn "${app.programName}" đang được gửi xét duyệt!`,
        );
        loadApps({ silent: true });
      } catch (err: unknown) {
        showAxiosApiFailure(
          messageApi,
          err,
          "Nộp đơn thất bại. Vui lòng thử lại.",
        );
      } finally {
        setSubmittingId(null);
      }
    },
    [loadApps, messageApi],
  );

  const applicationColumns = useApplicationListColumns({
    submittingId,
    onSubmitFinal: handleSubmitFinal,
    sortField: sort.field,
    sortOrder: sort.order,
  });

  const handleQrPaid = useCallback(() => {
    setQrModal(null);
    loadApps({ silent: true });
  }, [loadApps]);

  const handleQrClose = useCallback(() => setQrModal(null), []);

  const handleQrExpire = useCallback(() => {
    setQrModal(null);
    messageApi.warning(
      "Mã QR đã hết hiệu lực sau 5 phút. Vui lòng nộp đơn lại để nhận mã QR mới.",
      8,
    );
  }, [messageApi]);

  const goToApplicationDetail = useCallback(
    (id: number) => navigate(`/applicant/applications/${id}`),
    [navigate],
  );

  const goToNewApplication = useCallback(
    () => navigate("/applicant/submit-application"),
    [navigate],
  );

  return {
    messageContextHolder,
    qrModal,
    handleQrPaid,
    handleQrClose,
    handleQrExpire,
    loading,
    error,
    apps,
    sortedFilteredApps,
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
    handleTableChange,
    sort,
    reload: loadApps,
  };
}
