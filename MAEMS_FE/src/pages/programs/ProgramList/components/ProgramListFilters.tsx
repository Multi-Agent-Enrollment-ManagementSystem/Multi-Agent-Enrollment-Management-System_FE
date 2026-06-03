import { Badge, Input, Select, Tag } from "antd";
import { ArrowUpDown, BookOpen, Search, SlidersHorizontal } from "lucide-react";
import type { MajorBasic } from "@/types/major";
import type { ProgramSortKey } from "../types";
import { PublicSectionReveal } from "@/components/public/PublicPageMotion";

const { Option } = Select;

type ProgramListFiltersProps = {
  majors: MajorBasic[];
  selectedMajorId: number | undefined;
  sortKey: ProgramSortKey;
  searchInput: string;
  totalCount: number;
  activeFilterCount: number;
  hasActiveFilters: boolean;
  onMajorChange: (val: number | undefined) => void;
  onSortChange: (val: string) => void;
  onSearchInputChange: (value: string) => void;
  onSearch: () => void;
  onSearchClear: () => void;
  onClearAll: () => void;
};

/** Khu vực lọc theo khoa, sắp xếp và tìm kiếm tên chương trình. */
export function ProgramListFilters({
  majors,
  selectedMajorId,
  sortKey,
  searchInput,
  totalCount,
  activeFilterCount,
  hasActiveFilters,
  onMajorChange,
  onSortChange,
  onSearchInputChange,
  onSearch,
  onSearchClear,
  onClearAll,
}: ProgramListFiltersProps) {
  return (
    <PublicSectionReveal>
    <section className="py-6 sm:py-8 px-6 bg-gray-50/95 backdrop-blur-sm border-b border-gray-100 z-30">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-3 items-stretch lg:items-center">
          <div className="flex items-center gap-2 text-gray-500 text-sm flex-shrink-0">
            <SlidersHorizontal size={16} className="text-orange-500" />
            <span className="font-medium">Lọc & Tìm kiếm</span>
          </div>

          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-[240px_220px_minmax(0,1fr)] gap-3">
            <Select
              allowClear
              placeholder="Tất cả khoa / ngành"
              className="w-full"
              size="large"
              value={selectedMajorId}
              onChange={onMajorChange}
              suffixIcon={<BookOpen size={14} className="text-gray-400" />}
            >
              {majors.map((m) => (
                <Option key={m.majorId} value={m.majorId}>
                  {m.majorName}
                </Option>
              ))}
            </Select>

            <Select
              allowClear
              placeholder="Sắp xếp theo..."
              className="w-full"
              size="large"
              value={sortKey || undefined}
              onChange={onSortChange}
              suffixIcon={<ArrowUpDown size={14} className="text-gray-400" />}
            >
              <Option value="programName_asc">Tên A → Z</Option>
              <Option value="programName_desc">Tên Z → A</Option>
              <Option value="majorName_asc">Khoa A → Z</Option>
              <Option value="majorName_desc">Khoa Z → A</Option>
            </Select>

            <Input.Search
              placeholder="Tìm kiếm chương trình đào tạo..."
              size="large"
              value={searchInput}
              onChange={(e) => onSearchInputChange(e.target.value)}
              onSearch={onSearch}
              onPressEnter={onSearch}
              enterButton={
                <button className="flex items-center gap-1.5">
                  <Search size={15} />
                  <span>Tìm</span>
                </button>
              }
              className="flex-1"
              allowClear
              onClear={onSearchClear}
            />
          </div>

          {hasActiveFilters && (
            <div className="flex items-center gap-2 flex-shrink-0 justify-start lg:justify-end">
              <Badge count={activeFilterCount} color="orange">
                <Tag
                  closable
                  color="orange"
                  onClose={onClearAll}
                  className="cursor-pointer"
                >
                  {totalCount} kết quả
                </Tag>
              </Badge>
            </div>
          )}
        </div>
      </div>
    </section>
    </PublicSectionReveal>
  );
}
