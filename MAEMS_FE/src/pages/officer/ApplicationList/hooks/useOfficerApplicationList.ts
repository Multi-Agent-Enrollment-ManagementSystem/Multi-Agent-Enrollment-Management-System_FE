import { Form, message } from "antd";
import type { TablePaginationConfig } from "antd/es/table";
import type { SorterResult } from "antd/es/table/interface";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import type { AdmissionTypeBasic } from "@/types/admission.type";
import type { Application, ApplicationStatus } from "@/types/application";
import type { ApplicationLevel } from "@/types/enums";
import type { CampusBasic } from "@/types/campus";
import type { ProgramBasic } from "@/types/program";
import {
  fetchAllApplications,
  getAdmissionTypeById,
  loadOfficerListFilterOptions,
  patchApplication,
  requestAdditionalDocuments,
} from "../api/officerApplicationListApi";
import type {
  ApplicationListSortOption,
  DashboardListPreset,
  FilterDimensionAvailability,
} from "../types";
import {
  FACET_LIST_PAGE_CAP,
  PRESET_PAGE_SIZE,
} from "../utils/officerApplicationListConstants";
import {
  buildAvailabilityFromApps,
  emptyFilterAvailability,
  mergeApplicationsById,
  mergeAvailabilityFromFacetSlices,
} from "../utils/officerApplicationListFacet";
import {
  dashboardPresetHint,
  normalizeRequiredDocumentList,
  parseListQueryState,
} from "../utils/officerApplicationListQuery";
import { isApplicationStatus } from "../utils/officerApplicationListStatus";
import { useOfficerApplicationListColumns } from "./useOfficerApplicationListColumns";

/** Hook tập trung state, fetch phân trang/facet, filter URL và thao tác nhanh trên bảng. */
export function useOfficerApplicationList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [messageApi, messageContextHolder] = message.useMessage();

  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);

  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState<string | undefined>();
  const [filterStatus, setFilterStatus] = useState<ApplicationStatus | "all">(
    () => parseListQueryState(searchParams).filterStatus,
  );
  const [filterCampusId, setFilterCampusId] = useState<number | "all">("all");
  const [filterProgramId, setFilterProgramId] = useState<number | "all">("all");
  const [filterAdmissionTypeId, setFilterAdmissionTypeId] = useState<
    number | "all"
  >("all");
  const [onlyEscalated, setOnlyEscalated] = useState(false);
  const [filterLevel, setFilterLevel] = useState<ApplicationLevel | "all">(
    "all",
  );
  const [dashboardPreset, setDashboardPreset] =
    useState<DashboardListPreset | null>(
      () => parseListQueryState(searchParams).dashboardPreset,
    );
  const [mergedBuffer, setMergedBuffer] = useState<Application[]>([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [sortBy, setSortBy] = useState("applicationId");
  const [sortDesc, setSortDesc] = useState(true);
  const [campuses, setCampuses] = useState<CampusBasic[]>([]);
  const [programs, setPrograms] = useState<ProgramBasic[]>([]);
  const [admissionTypes, setAdmissionTypes] = useState<AdmissionTypeBasic[]>(
    [],
  );
  const [filterAvailability, setFilterAvailability] =
    useState<FilterDimensionAvailability>(emptyFilterAvailability());
  const [facetReady, setFacetReady] = useState(false);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const handleSearchChange = (value: string) => {
    setSearchInput(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setSearch(value || undefined);
      setPageNumber(1);
    }, 500);
  };

  const [rejectModal, setRejectModal] = useState<{
    open: boolean;
    id: number | string;
  }>({ open: false, id: "" });
  const [supplementModal, setSupplementModal] = useState<{
    open: boolean;
    id: number | string;
  }>({ open: false, id: "" });
  const [rejectForm] = Form.useForm();
  const [supplementForm] = Form.useForm();

  const loadFilterOptions = useCallback(async () => {
    try {
      const data = await loadOfficerListFilterOptions();
      setCampuses(data.campuses);
      setPrograms(data.programs);
      setAdmissionTypes(data.admissionTypes);
    } catch {
      messageApi.error("Không thể tải dữ liệu bộ lọc.");
    }
  }, [messageApi]);

  const listQueryBase = useMemo(
    () => ({
      search,
      campusId: filterCampusId !== "all" ? filterCampusId : undefined,
      programId: filterProgramId !== "all" ? filterProgramId : undefined,
      admissionTypeId:
        filterAdmissionTypeId !== "all" ? filterAdmissionTypeId : undefined,
      level: filterLevel !== "all" ? filterLevel : undefined,
    }),
    [
      search,
      filterCampusId,
      filterProgramId,
      filterAdmissionTypeId,
      filterLevel,
    ],
  );

  const loadDashboardPresetData = useCallback(async () => {
    if (!dashboardPreset) return;
    setLoading(true);
    setFacetReady(false);
    try {
      if (dashboardPreset === "pending") {
        const [draftRes, subRes] = await Promise.all([
          fetchAllApplications({
            ...listQueryBase,
            status: "draft",
            pageNumber: 1,
            pageSize: PRESET_PAGE_SIZE,
            sortBy: "lastUpdated",
            sortDesc: true,
          }),
          fetchAllApplications({
            ...listQueryBase,
            status: "submitted",
            pageNumber: 1,
            pageSize: PRESET_PAGE_SIZE,
            sortBy: "lastUpdated",
            sortDesc: true,
          }),
        ]);
        const merged = mergeApplicationsById([draftRes.items, subRes.items]);
        setMergedBuffer(merged);
        setTotalCount(merged.length);
        setFilterAvailability(buildAvailabilityFromApps(merged));
        setFacetReady(true);
        return;
      }

      const [urRes, rrRes] = await Promise.all([
        fetchAllApplications({
          ...listQueryBase,
          status: "under_review",
          pageNumber: 1,
          pageSize: PRESET_PAGE_SIZE,
          sortBy: "lastUpdated",
          sortDesc: true,
        }),
        fetchAllApplications({
          ...listQueryBase,
          requiresReview: true,
          pageNumber: 1,
          pageSize: PRESET_PAGE_SIZE,
          sortBy: "lastUpdated",
          sortDesc: true,
        }),
      ]);
      const merged = mergeApplicationsById([urRes.items, rrRes.items]);
      setMergedBuffer(merged);
      setTotalCount(merged.length);
      setFilterAvailability(buildAvailabilityFromApps(merged));
      setFacetReady(true);
    } catch {
      messageApi.error("Không thể tải danh sách hồ sơ.");
      setMergedBuffer([]);
      setTotalCount(0);
      setApplications([]);
      setFilterAvailability(emptyFilterAvailability());
      setFacetReady(false);
    } finally {
      setLoading(false);
    }
  }, [dashboardPreset, listQueryBase, messageApi]);

  const loadServerPage = useCallback(async () => {
    if (dashboardPreset) return;
    setLoading(true);
    setFacetReady(false);
    try {
      setMergedBuffer([]);
      const result = await fetchAllApplications({
        ...listQueryBase,
        status: filterStatus !== "all" ? filterStatus : undefined,
        requiresReview: onlyEscalated ? true : undefined,
        pageNumber,
        pageSize,
        sortBy,
        sortDesc: sortBy ? sortDesc : true,
      });
      setApplications(result.items);
      setTotalCount(result.totalCount);

      const facetPageSize = Math.min(
        FACET_LIST_PAGE_CAP,
        Math.max(result.totalCount, 1),
      );
      const facetSort = {
        sortBy: "lastUpdated" as const,
        sortDesc: true as const,
      };
      const esc = onlyEscalated
        ? ({ requiresReview: true as const } as const)
        : {};
      const st =
        filterStatus !== "all"
          ? ({ status: filterStatus } as const)
          : ({} as const);

      if (result.totalCount === 0) {
        setFilterAvailability(emptyFilterAvailability());
      } else {
        const [forStatus, forCampus, forProgram, forAdmission] =
          await Promise.all([
            fetchAllApplications({
              search: listQueryBase.search,
              campusId: listQueryBase.campusId,
              programId: listQueryBase.programId,
              admissionTypeId: listQueryBase.admissionTypeId,
              ...esc,
              pageNumber: 1,
              pageSize: facetPageSize,
              ...facetSort,
            }),
            fetchAllApplications({
              search: listQueryBase.search,
              programId: listQueryBase.programId,
              admissionTypeId: listQueryBase.admissionTypeId,
              ...st,
              ...esc,
              pageNumber: 1,
              pageSize: facetPageSize,
              ...facetSort,
            }),
            fetchAllApplications({
              search: listQueryBase.search,
              campusId: listQueryBase.campusId,
              admissionTypeId: listQueryBase.admissionTypeId,
              ...st,
              ...esc,
              pageNumber: 1,
              pageSize: facetPageSize,
              ...facetSort,
            }),
            fetchAllApplications({
              search: listQueryBase.search,
              campusId: listQueryBase.campusId,
              programId: listQueryBase.programId,
              ...st,
              ...esc,
              pageNumber: 1,
              pageSize: facetPageSize,
              ...facetSort,
            }),
          ]);
        setFilterAvailability(
          mergeAvailabilityFromFacetSlices(
            forStatus.items,
            forCampus.items,
            forProgram.items,
            forAdmission.items,
          ),
        );
      }
      setFacetReady(true);
    } catch {
      messageApi.error("Không thể tải danh sách hồ sơ.");
      setFilterAvailability(emptyFilterAvailability());
      setFacetReady(false);
    } finally {
      setLoading(false);
    }
  }, [
    dashboardPreset,
    listQueryBase,
    filterStatus,
    onlyEscalated,
    pageNumber,
    pageSize,
    sortBy,
    sortDesc,
    messageApi,
  ]);

  const searchParamsKey = searchParams.toString();
  useEffect(() => {
    const preset = searchParams.get("preset");
    const st = searchParams.get("status");
    if (preset === "pending" || preset === "need_action") {
      setDashboardPreset(preset);
      setFilterStatus("all");
      setOnlyEscalated(false);
      setPageNumber(1);
    } else if (st && isApplicationStatus(st)) {
      setDashboardPreset(null);
      setMergedBuffer([]);
      setFilterStatus(st);
      setOnlyEscalated(false);
      setPageNumber(1);
    } else {
      setDashboardPreset(null);
      setMergedBuffer([]);
    }
  }, [searchParamsKey]);

  useEffect(() => {
    if (!dashboardPreset) return;
    void loadDashboardPresetData();
  }, [dashboardPreset, loadDashboardPresetData]);

  useEffect(() => {
    if (dashboardPreset) return;
    void loadServerPage();
  }, [dashboardPreset, loadServerPage]);

  useEffect(() => {
    if (!dashboardPreset || mergedBuffer.length === 0) return;
    const start = (pageNumber - 1) * pageSize;
    setApplications(mergedBuffer.slice(start, start + pageSize));
  }, [dashboardPreset, pageNumber, pageSize, mergedBuffer]);

  useEffect(() => {
    void loadFilterOptions();
  }, [loadFilterOptions]);

  const handleTableChange = (
    pagination: TablePaginationConfig,
    _filters: unknown,
    sorter: SorterResult<Application> | SorterResult<Application>[],
  ) => {
    if (pagination.current) setPageNumber(pagination.current);
    if (pagination.pageSize) setPageSize(pagination.pageSize);

    const s = Array.isArray(sorter) ? sorter[0] : sorter;
    if (s?.columnKey && s.order) {
      setSortBy(String(s.columnKey));
      setSortDesc(s.order === "descend");
    } else {
      setSortBy("applicationId");
      setSortDesc(true);
    }
  };

  const syncListSearchParams = useCallback(
    (mutate: (p: URLSearchParams) => void) => {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        mutate(next);
        return next;
      });
    },
    [setSearchParams],
  );

  const handleStatusChange = (val: ApplicationStatus | "all") => {
    syncListSearchParams((p) => {
      p.delete("preset");
      if (val === "all") p.delete("status");
      else p.set("status", val);
    });
    setDashboardPreset(null);
    setMergedBuffer([]);
    setFilterStatus(val);
    setPageNumber(1);
  };

  const handleEscalatedChange = (checked: boolean) => {
    syncListSearchParams((p) => {
      p.delete("preset");
    });
    setDashboardPreset(null);
    setMergedBuffer([]);
    setOnlyEscalated(checked);
    setPageNumber(1);
  };

  const handleCampusChange = (val: number | "all") => {
    setFilterCampusId(val);
    setPageNumber(1);
  };

  const handleProgramChange = (val: number | "all") => {
    setFilterProgramId(val);
    setPageNumber(1);
  };

  const handleAdmissionTypeChange = (val: number | "all") => {
    setFilterAdmissionTypeId(val);
    setPageNumber(1);
  };

  const handleSortChange = (val: ApplicationListSortOption) => {
    const [field, direction] = val.split("_") as [string, "asc" | "desc"];
    setSortBy(field);
    setSortDesc(direction === "desc");
    setPageNumber(1);
  };

  const handleLevelChange = (val: ApplicationLevel | "all") => {
    setFilterLevel(val);
    setPageNumber(1);
  };

  const clearFilters = () => {
    setSearchParams(new URLSearchParams());
    setSearchInput("");
    setSearch(undefined);
    setFilterStatus("all");
    setFilterCampusId("all");
    setFilterProgramId("all");
    setFilterAdmissionTypeId("all");
    setFilterLevel("all");
    setOnlyEscalated(false);
    setDashboardPreset(null);
    setMergedBuffer([]);
    setPageNumber(1);
    setSortBy("applicationId");
    setSortDesc(true);
  };

  const refreshList = useCallback(() => {
    if (dashboardPreset) void loadDashboardPresetData();
    else void loadServerPage();
  }, [dashboardPreset, loadDashboardPresetData, loadServerPage]);

  const handleApprove = async (id: number | string) => {
    const strId = String(id);
    const targetApp = applications.find(
      (a) => String(a.applicationId) === strId,
    );
    if (!targetApp || targetApp.status !== "under_review") {
      messageApi.warning(
        "Chỉ có thể phê duyệt khi hồ sơ ở trạng thái chờ xét duyệt.",
      );
      return;
    }

    setActionLoading(strId + "_approve");
    try {
      await patchApplication(Number(id), { status: "approved" });
      messageApi.success("Đã phê duyệt hồ sơ.");
      setApplications((prev) =>
        prev.map((a) =>
          String(a.applicationId) === strId
            ? { ...a, status: "approved" as ApplicationStatus }
            : a,
        ),
      );
    } catch {
      messageApi.error("Phê duyệt thất bại, vui lòng thử lại.");
    } finally {
      setActionLoading(null);
    }
  };

  const handleRejectSubmit = async () => {
    try {
      await rejectForm.validateFields();
      const strId = String(rejectModal.id);
      const targetApp = applications.find(
        (a) => String(a.applicationId) === strId,
      );
      if (!targetApp || targetApp.status !== "under_review") {
        messageApi.warning(
          "Chỉ có thể từ chối khi hồ sơ ở trạng thái chờ xét duyệt.",
        );
        return;
      }

      setActionLoading(strId + "_reject");
      await patchApplication(Number(rejectModal.id), { status: "rejected" });
      messageApi.success("Đã từ chối hồ sơ.");
      setApplications((prev) =>
        prev.map((a) =>
          String(a.applicationId) === strId
            ? { ...a, status: "rejected" as ApplicationStatus }
            : a,
        ),
      );
      setRejectModal({ open: false, id: "" });
      rejectForm.resetFields();
    } catch {
      messageApi.error("Từ chối thất bại, vui lòng thử lại.");
    } finally {
      setActionLoading(null);
    }
  };

  const handleSupplementSubmit = async () => {
    try {
      const targetApp = applications.find(
        (a) => String(a.applicationId) === String(supplementModal.id),
      );
      if (!targetApp || targetApp.status !== "under_review") {
        messageApi.warning(
          "Chỉ có thể yêu cầu bổ sung khi hồ sơ đang chờ xét duyệt.",
        );
        return;
      }

      const values = await supplementForm.validateFields();
      const strId = String(supplementModal.id);
      const docsNeed = String(values.note ?? "");

      setActionLoading(strId + "_supplement");
      const updated = await requestAdditionalDocuments(
        Number(supplementModal.id),
        { docsNeed },
      );

      messageApi.success("Đã gửi yêu cầu bổ sung tài liệu.");

      setApplications((prev) =>
        prev.map((a) =>
          String(a.applicationId) === strId
            ? {
                ...a,
                status: updated.status,
                requiresReview: updated.requiresReview,
                lastUpdated: updated.lastUpdated || a.lastUpdated,
                assignedOfficerId: updated.assignedOfficerId,
                assignedOfficerName: updated.assignedOfficerName,
              }
            : a,
        ),
      );

      setSupplementModal({ open: false, id: "" });
      supplementForm.resetFields();
    } catch {
      messageApi.error("Gửi yêu cầu thất bại, vui lòng thử lại.");
    } finally {
      setActionLoading(null);
    }
  };

  const openSupplementModal = async (record: Application) => {
    if (record.status !== "under_review") {
      messageApi.warning(
        "Chỉ có thể yêu cầu bổ sung khi hồ sơ đang chờ xét duyệt.",
      );
      return;
    }

    let suggestedDocs = "";
    try {
      const admissionType = await getAdmissionTypeById(record.admissionTypeId);
      suggestedDocs = normalizeRequiredDocumentList(
        admissionType.requiredDocumentList,
      );
    } catch {
      // Modal vẫn mở được nếu gợi ý tài liệu lỗi.
    }

    setSupplementModal({ open: true, id: record.applicationId });
    supplementForm.setFieldsValue({ note: suggestedDocs });
  };

  const columns = useOfficerApplicationListColumns({
    actionLoading,
    onApprove: handleApprove,
    onOpenReject: (id) => setRejectModal({ open: true, id }),
    onOpenSupplement: openSupplementModal,
  });

  const activeFilterCount = [
    !!search,
    filterStatus !== "all",
    filterCampusId !== "all",
    filterProgramId !== "all",
    filterAdmissionTypeId !== "all",
    filterLevel !== "all",
    onlyEscalated,
    !!dashboardPreset,
  ].filter(Boolean).length;

  const currentSortOption: ApplicationListSortOption = useMemo(() => {
    if (sortBy === "applicationId")
      return sortDesc ? "applicationId_desc" : "applicationId_asc";
    if (sortBy === "lastUpdated")
      return sortDesc ? "lastUpdated_desc" : "lastUpdated_asc";
    return "applicationId_desc";
  }, [sortBy, sortDesc]);

  const presetHint = dashboardPresetHint(dashboardPreset);

  const closeRejectModal = () => {
    setRejectModal({ open: false, id: "" });
    rejectForm.resetFields();
  };

  const closeSupplementModal = () => {
    setSupplementModal({ open: false, id: "" });
    supplementForm.resetFields();
  };

  return {
    messageContextHolder,
    loading,
    totalCount,
    activeFilterCount,
    presetHint,
    refreshList,
    searchInput,
    handleSearchChange,
    filterStatus,
    handleStatusChange,
    filterCampusId,
    handleCampusChange,
    filterProgramId,
    handleProgramChange,
    filterAdmissionTypeId,
    handleAdmissionTypeChange,
    filterLevel,
    handleLevelChange,
    currentSortOption,
    handleSortChange,
    onlyEscalated,
    handleEscalatedChange,
    clearFilters,
    facetReady,
    filterAvailability,
    campuses,
    programs,
    admissionTypes,
    applications,
    columns,
    pageNumber,
    pageSize,
    handleTableChange,
    rejectModal,
    rejectForm,
    closeRejectModal,
    handleRejectSubmit,
    actionLoading,
    supplementModal,
    supplementForm,
    closeSupplementModal,
    handleSupplementSubmit,
  };
}
