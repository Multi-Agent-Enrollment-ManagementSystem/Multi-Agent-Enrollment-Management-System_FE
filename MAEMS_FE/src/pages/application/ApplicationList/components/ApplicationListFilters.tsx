import { Button, Card, Grid, Input, Select } from "antd";
import { Search } from "lucide-react";
import type { ApplicationStatus } from "@/types/application";
import type { StatusFilterValue } from "../types";

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

/** Khối tìm kiếm và bộ lọc đa chiều — responsive 2 cột trên mobile. */
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
      className="rounded-2xl border border-gray-200/80 bg-white shadow-sm shadow-gray-200/40"
      styles={{ body: { padding: "14px 16px" } }}
    >
      <div className="rounded-xl border border-gray-100 bg-gradient-to-br from-gray-50/90 to-white px-3.5 py-3 sm:px-4 sm:py-3.5">
        <div className="flex flex-col gap-2.5 sm:gap-3">
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
              className="!rounded-xl !border-gray-200 flex-1 shadow-sm"
            />
            <Button
              type="link"
              size="small"
              className="!px-1.5 shrink-0 !text-orange-600 !text-xs"
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
              className="w-full sm:min-w-[180px] sm:flex-1 [&_.ant-select-selector]:!rounded-xl"
              popupMatchSelectWidth={false}
              options={[
                { value: "all", label: "Tất cả trạng thái" },
                ...statusOptions,
              ]}
            />
            <Select<string>
              value={programFilter}
              onChange={onProgramFilterChange}
              className="w-full sm:min-w-[200px] sm:flex-1 [&_.ant-select-selector]:!rounded-xl"
              popupMatchSelectWidth={false}
              options={[
                { value: "all", label: "Tất cả chương trình" },
                ...programOptions,
              ]}
            />
            <Select<string>
              value={campusFilter}
              onChange={onCampusFilterChange}
              className="w-full sm:min-w-[160px] sm:flex-1 [&_.ant-select-selector]:!rounded-xl"
              popupMatchSelectWidth={false}
              options={[
                { value: "all", label: "Tất cả cơ sở" },
                ...campusOptions,
              ]}
            />
            <Select<string>
              value={admissionFilter}
              onChange={onAdmissionFilterChange}
              className="w-full sm:min-w-[200px] sm:flex-1 [&_.ant-select-selector]:!rounded-xl"
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
