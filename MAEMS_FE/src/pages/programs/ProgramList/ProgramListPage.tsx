import {
  ProgramListCta,
  ProgramListFilters,
  ProgramListGrid,
  ProgramListHero,
  ProgramListStatsBar,
} from "./components";
import { useProgramList } from "./hooks";

/** Trang danh sách chương trình đào tạo — ghép layout và các section UI. */
export function ProgramList() {
  const {
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
  } = useProgramList();

  return (
    <>
      <ProgramListHero />
      <ProgramListStatsBar totalCount={totalCount} majorCount={majors.length} />
      <ProgramListFilters
        majors={majors}
        selectedMajorId={selectedMajorId}
        sortKey={sortKey}
        searchInput={searchInput}
        totalCount={totalCount}
        activeFilterCount={activeFilterCount}
        hasActiveFilters={hasActiveFilters}
        onMajorChange={handleMajorChange}
        onSortChange={handleSortChange}
        onSearchInputChange={setSearchInput}
        onSearch={handleSearch}
        onSearchClear={handleSearchInputClear}
        onClearAll={handleClearAll}
      />
      <ProgramListGrid
        programs={programs}
        loading={loading}
        totalCount={totalCount}
        pageNumber={pageNumber}
        pageSize={pageSize}
        hasActiveFilters={hasActiveFilters}
        onClearAll={handleClearAll}
        onPaginationChange={handlePaginationChange}
      />
      <ProgramListCta />
    </>
  );
}
