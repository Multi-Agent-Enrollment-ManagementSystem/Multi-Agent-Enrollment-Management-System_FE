import { Button, Typography } from "antd";
import { RefreshCw } from "lucide-react";
import { OfficerLayout } from "@/layouts/OfficerLayout";
import {
  OfficerApplicationListFilters,
  OfficerApplicationListTable,
  OfficerRejectModal,
  OfficerSupplementModal,
} from "./components";
import { useOfficerApplicationList } from "./hooks";

const { Title, Text } = Typography;

/** Trang danh sách hồ sơ tuyển sinh của cán bộ — ghép layout và các section. */
export function OfficerApplicationList() {
  const {
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
  } = useOfficerApplicationList();

  return (
    <OfficerLayout>
      {messageContextHolder}

      <div className="flex flex-col gap-6 pb-14 md:pb-16">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <Title level={4} className="!mb-1 !text-gray-800 !font-bold">
              Quản Lý Hồ Sơ Tuyển Sinh
            </Title>
            <Text type="secondary">
              Tổng cộng {totalCount} hồ sơ
              {activeFilterCount > 0 && ` (đang lọc)`}
            </Text>
          </div>
          <Button
            icon={<RefreshCw size={14} />}
            onClick={refreshList}
            loading={loading}
            className="!rounded-xl shrink-0"
          >
            Làm mới
          </Button>
        </div>

        <OfficerApplicationListFilters
          presetHint={presetHint}
          searchInput={searchInput}
          onSearchChange={handleSearchChange}
          filterStatus={filterStatus}
          onStatusChange={handleStatusChange}
          filterCampusId={filterCampusId}
          onCampusChange={handleCampusChange}
          filterProgramId={filterProgramId}
          onProgramChange={handleProgramChange}
          filterAdmissionTypeId={filterAdmissionTypeId}
          onAdmissionTypeChange={handleAdmissionTypeChange}
          filterLevel={filterLevel}
          onLevelChange={handleLevelChange}
          currentSortOption={currentSortOption}
          onSortChange={handleSortChange}
          onlyEscalated={onlyEscalated}
          onEscalatedChange={handleEscalatedChange}
          facetReady={facetReady}
          filterAvailability={filterAvailability}
          campuses={campuses}
          programs={programs}
          admissionTypes={admissionTypes}
          activeFilterCount={activeFilterCount}
          onClearFilters={clearFilters}
        />

        <OfficerApplicationListTable
          loading={loading}
          applications={applications}
          columns={columns}
          pageNumber={pageNumber}
          pageSize={pageSize}
          totalCount={totalCount}
          onTableChange={handleTableChange}
        />
      </div>

      <OfficerRejectModal
        open={rejectModal.open}
        form={rejectForm}
        confirmLoading={actionLoading === rejectModal.id + "_reject"}
        onCancel={closeRejectModal}
        onSubmit={handleRejectSubmit}
      />

      <OfficerSupplementModal
        open={supplementModal.open}
        form={supplementForm}
        confirmLoading={actionLoading === supplementModal.id + "_supplement"}
        onCancel={closeSupplementModal}
        onSubmit={handleSupplementSubmit}
      />
    </OfficerLayout>
  );
}
