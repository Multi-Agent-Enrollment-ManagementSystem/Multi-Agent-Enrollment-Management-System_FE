import { useCallback, useEffect, useState } from "react";
import type { MajorBasic } from "@/types/major";
import {
  getActiveMajorsBasic,
  getActiveProgramsBasic,
  getFilteredProgramsBasic,
} from "../api/programListApi";
import type { ProgramListItem, ProgramSortKey } from "../types";

/** Hook tập trung state, fetch và handler cho trang danh sách chương trình đào tạo. */
export function useProgramList() {
  const [programs, setPrograms] = useState<ProgramListItem[]>([]);
  const [majors, setMajors] = useState<MajorBasic[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMajorId, setSelectedMajorId] = useState<number | undefined>(
    undefined,
  );
  const [searchName, setSearchName] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [totalCount, setTotalCount] = useState(0);
  const [sortKey, setSortKey] = useState<ProgramSortKey>("");

  // Tải danh sách khoa/ngành một lần khi mount — dùng cho bộ lọc và thống kê.
  useEffect(() => {
    getActiveMajorsBasic()
      .then(setMajors)
      .catch(() => setMajors([]));
  }, []);

  const fetchPrograms = useCallback(async () => {
    setLoading(true);
    try {
      const sortBy = sortKey ? sortKey.split("_")[0] : undefined;
      const sortDesc = sortKey ? sortKey.endsWith("_desc") : undefined;
      const isFiltering =
        selectedMajorId !== undefined || !!searchName || !!sortKey;

      if (isFiltering) {
        // Có bộ lọc → gọi API phân trang phía server.
        const paged = await getFilteredProgramsBasic(
          selectedMajorId,
          searchName || undefined,
          sortBy,
          sortDesc,
          pageNumber,
          pageSize,
        );
        setPrograms(Array.isArray(paged.items) ? paged.items : []);
        setTotalCount(paged.totalCount ?? 0);
      } else {
        // Không lọc → lấy toàn bộ rồi phân trang client-side.
        const data = await getActiveProgramsBasic();
        const all = Array.isArray(data) ? data : [];
        setTotalCount(all.length);
        const start = (pageNumber - 1) * pageSize;
        setPrograms(all.slice(start, start + pageSize));
      }
    } catch {
      setPrograms([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  }, [selectedMajorId, searchName, sortKey, pageNumber, pageSize]);

  useEffect(() => {
    fetchPrograms();
  }, [fetchPrograms]);

  const handleSearch = () => {
    setPageNumber(1);
    setSearchName(searchInput);
  };

  const handleMajorChange = (val: number | undefined) => {
    setPageNumber(1);
    setSelectedMajorId(val);
  };

  const handleSortChange = (val: string) => {
    setPageNumber(1);
    setSortKey((val ?? "") as ProgramSortKey);
  };

  const handleClearAll = () => {
    setSelectedMajorId(undefined);
    setSearchName("");
    setSearchInput("");
    setSortKey("");
    setPageNumber(1);
  };

  const handleSearchInputClear = () => {
    setSearchInput("");
    setSearchName("");
    setPageNumber(1);
  };

  const handlePaginationChange = (page: number, size: number) => {
    setPageNumber(page);
    setPageSize(size);
  };

  const hasActiveFilters =
    selectedMajorId !== undefined || !!searchName || !!sortKey;

  const activeFilterCount = [selectedMajorId, searchName, sortKey].filter(
    Boolean,
  ).length;

  return {
    programs,
    majors,
    loading,
    selectedMajorId,
    searchInput,
    pageNumber,
    pageSize,
    totalCount,
    sortKey,
    hasActiveFilters,
    activeFilterCount,
    setSearchInput,
    handleSearch,
    handleMajorChange,
    handleSortChange,
    handleClearAll,
    handleSearchInputClear,
    handlePaginationChange,
  };
}
