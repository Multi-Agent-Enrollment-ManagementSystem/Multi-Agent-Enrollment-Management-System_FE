import { Col, Empty, Pagination, Row } from "antd";
import type { ProgramListItem } from "../types";
import { ProgramCard } from "./ProgramCard";
import { ProgramCardSkeleton } from "./ProgramCardSkeleton";
import { PublicItemReveal } from "@/components/public/PublicPageMotion";

type ProgramListGridProps = {
  programs: ProgramListItem[];
  loading: boolean;
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  hasActiveFilters: boolean;
  onClearAll: () => void;
  onPaginationChange: (page: number, size: number) => void;
};

/** Lưới chương trình — skeleton khi loading, empty state và phân trang. */
export function ProgramListGrid({
  programs,
  loading,
  totalCount,
  pageNumber,
  pageSize,
  hasActiveFilters,
  onClearAll,
  onPaginationChange,
}: ProgramListGridProps) {
  return (
    <section className="py-14 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        {!loading && programs.length === 0 ? (
          <div className="py-24">
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={
                <span className="text-gray-500">
                  Không tìm thấy chương trình đào tạo phù hợp.
                  {hasActiveFilters && (
                    <>
                      {" "}
                      Thử{" "}
                      <button
                        className="text-orange-500 underline cursor-pointer"
                        onClick={onClearAll}
                      >
                        xóa bộ lọc
                      </button>
                      .
                    </>
                  )}
                </span>
              }
            />
          </div>
        ) : (
          <>
            <Row gutter={[24, 24]}>
              {loading
                ? Array.from({ length: 6 }).map((_, i) => (
                    <Col xs={24} sm={12} lg={8} key={i}>
                      <ProgramCardSkeleton />
                    </Col>
                  ))
                : programs.map((p, i) => (
                    <Col xs={24} sm={12} lg={8} key={p.programId}>
                      <PublicItemReveal index={i}>
                        <ProgramCard program={p} />
                      </PublicItemReveal>
                    </Col>
                  ))}
            </Row>

            {totalCount > pageSize && (
              <div className="flex justify-center mt-10">
                <Pagination
                  current={pageNumber}
                  pageSize={pageSize}
                  total={totalCount}
                  showSizeChanger
                  pageSizeOptions={[10, 20, 50]}
                  onChange={onPaginationChange}
                  showTotal={(total) => `Tổng ${total} chương trình`}
                />
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
