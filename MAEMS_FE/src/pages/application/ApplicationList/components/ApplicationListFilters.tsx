import { Button, Card, Grid, Input, Select } from "antd";
import { Search } from "lucide-react";
import type { ApplicationStatus } from "@/types/application";
import type { StatusFilterValue } from "../types";
import {
  applicationListPanelClassName,
  applicationListPanelStyle,
} from "../utils/applicationListPanel";

const { useBreakpoint } = Grid;

type FilterOption = { value: string; label: string };

type ApplicationListFiltersProps = {
  searchText: string;
  onSearchTextChange: (value: string) => void;
  statusFilter: StatusFilterValue;
  onStatusFilterChange: (value: StatusFilterValue) => void;
  programFilter: string;
  onProgramFilterChange: (value: string) => void;
  campusFilter: string;
  onCampusFilterChange: (value: string) => void;
  admissionFilter: string;
  onAdmissionFilterChange: (value: string) => void;
  statusOptions: { value: ApplicationStatus; label: string }[];
  programOptions: FilterOption[];
  campusOptions: FilterOption[];
  admissionOptions: FilterOption[];
  hasActiveFilters: boolean;
  onClearFilters: () => void;
};

const selectClass =
  "w-full sm:min-w-[160px] sm:flex-1 [&_.ant-select-selector]:!rounded-2xl [&_.ant-select-selector]:!min-h-10 [&_.ant-select-selector]:!border-gray-200/90 [&_.ant-select-selector]:!shadow-sm";

/** Khối tìm kiếm và bộ lọc — bo góc panel 36px, không bị vuông bởi ant-card mặc định. */
export function ApplicationListFilters({
  searchText,
  onSearchTextChange,
  statusFilter,
  onStatusFilterChange,
  programFilter,
  onProgramFilterChange,
  campusFilter,
  onCampusFilterChange,
  admissionFilter,
  onAdmissionFilterChange,
  statusOptions,
  programOptions,
  campusOptions,
  admissionOptions,
  hasActiveFilters,
  onClearFilters,
}: ApplicationListFiltersProps) {
  const screens = useBreakpoint();

  return (
    <Card
      className={`${applicationListPanelClassName} backdrop-blur-[3px] shadow-md shadow-gray-200/25`}
      style={applicationListPanelStyle}
      styles={{ body: { padding: "18px 20px" } }}
    >
      <div className="rounded-[28px] border border-gray-100/80 bg-gradient-to-br from-gray-50/80 via-white to-orange-50/20 px-3.5 py-3.5 sm:px-4 sm:py-4">
        <div className="flex flex-col gap-3">
          <div className="flex gap-2 items-center">
            <Input
              allowClear
              prefix={<Search size={15} className="text-gray-400" />}
              placeholder={
                screens.sm
                  ? "Tìm theo chương trình, cơ sở, loại xét tuyển, mã đơn…"
                  : "Tìm kiếm đơn đăng ký…"
              }
              value={searchText}
              onChange={(e) => onSearchTextChange(e.target.value)}
              className="!rounded-2xl !border-gray-200/90 !min-h-10 flex-1 shadow-sm"
            />
            <Button
              type="link"
              size="small"
              className="!px-2 shrink-0 !text-orange-600 !text-xs !rounded-xl"
              disabled={!hasActiveFilters}
              onClick={onClearFilters}
            >
              Xóa lọc
            </Button>
          </div>

          <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2 sm:gap-3">
            <Select<StatusFilterValue>
              value={statusFilter}
              onChange={onStatusFilterChange}
              className={`${selectClass} sm:min-w-[180px]`}
              popupMatchSelectWidth={false}
              options={[
                { value: "all", label: "Tất cả trạng thái" },
                ...statusOptions,
              ]}
            />
            <Select<string>
              value={programFilter}
              onChange={onProgramFilterChange}
              className={`${selectClass} sm:min-w-[200px]`}
              popupMatchSelectWidth={false}
              options={[
                { value: "all", label: "Tất cả chương trình" },
                ...programOptions,
              ]}
            />
            <Select<string>
              value={campusFilter}
              onChange={onCampusFilterChange}
              className={selectClass}
              popupMatchSelectWidth={false}
              options={[
                { value: "all", label: "Tất cả cơ sở" },
                ...campusOptions,
              ]}
            />
            <Select<string>
              value={admissionFilter}
              onChange={onAdmissionFilterChange}
              className={`${selectClass} sm:min-w-[200px]`}
              popupMatchSelectWidth={false}
              options={[
                { value: "all", label: "Tất cả loại xét tuyển" },
                ...admissionOptions,
              ]}
            />
          </div>
        </div>
      </div>
    </Card>
  );
}
