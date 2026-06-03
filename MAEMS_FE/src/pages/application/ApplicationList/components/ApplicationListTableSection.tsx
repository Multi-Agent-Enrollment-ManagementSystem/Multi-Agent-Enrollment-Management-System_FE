import { Button, Card, Empty, Grid, Table, Tag, Typography } from "antd";
import type { ColumnsType, TableProps } from "antd/es/table";
import { motion } from "motion/react";
import type { ApplicationMe } from "@/types/application";
import { ApplicationCardList } from "./ApplicationCardList";
import {
  applicationListPanelBottomClassName,
  applicationListPanelClassName,
  applicationListPanelStyle,
} from "../utils/applicationListPanel";

const { useBreakpoint } = Grid;
const { Title, Text } = Typography;

type ApplicationListTableSectionProps = {
  apps: ApplicationMe[];
  sortedFilteredApps: ApplicationMe[];
  hasActiveFilters: boolean;
  columns: ColumnsType<ApplicationMe>;
  submittingId: number | null;
  onSubmit: (app: ApplicationMe) => void;
  onView: (id: number) => void;
  onClearFilters: () => void;
  onTableChange: TableProps<ApplicationMe>["onChange"];
};

const tableClassName = [
  "[&_.ant-table-container]:!rounded-none",
  "[&_.ant-table]:!bg-transparent",
  "[&_.ant-table-thead>tr>th]:!bg-gray-50/90",
  "[&_.ant-table-thead>tr>th]:!text-xs",
  "[&_.ant-table-thead>tr>th]:!font-semibold",
  "[&_.ant-table-thead>tr>th]:!text-gray-600",
  "[&_.ant-table-thead>tr>th]:!uppercase",
  "[&_.ant-table-thead>tr>th]:!tracking-wide",
  "[&_.ant-table-thead>tr>th]:!border-b-gray-200",
  "[&_.ant-table-tbody>tr>td]:!align-middle",
  "[&_.ant-table-tbody>tr]:transition-colors",
  "[&_.ant-table-tbody>tr:hover>td]:!bg-orange-50/40",
].join(" ");

/** Khối danh sách: header thống kê, bảng desktop (sort) hoặc card mobile. */
export function ApplicationListTableSection({
  apps,
  sortedFilteredApps,
  hasActiveFilters,
  columns,
  submittingId,
  onSubmit,
  onView,
  onClearFilters,
  onTableChange,
}: ApplicationListTableSectionProps) {
  const screens = useBreakpoint();

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
    >
      <Card
        className={`${applicationListPanelClassName} backdrop-blur-[2px] shadow-lg shadow-orange-900/[0.04]`}
        style={applicationListPanelStyle}
        styles={{ body: { padding: 0 } }}
      >
        <div className="flex flex-col gap-1 border-b border-gray-100/90 bg-gradient-to-r from-orange-50/50 via-white to-gray-50/70 px-4 py-3.5 sm:px-6 sm:py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
          <div className="flex flex-wrap items-center gap-2.5">
            <Title
              level={5}
              className="!mb-0 !text-gray-800 !font-semibold !text-sm sm:!text-base"
            >
              Danh sách đơn
            </Title>
            <span
              className="inline-flex items-center gap-1.5 rounded-full border border-orange-200/90 bg-orange-50/90 px-3.5 py-1.5 text-xs font-bold tabular-nums text-orange-900 shadow-sm"
              title={
                hasActiveFilters
                  ? `${sortedFilteredApps.length} đơn khớp bộ lọc trên tổng ${apps.length} đơn`
                  : `Tổng ${apps.length} đơn đăng ký`
              }
            >
              {hasActiveFilters ? (
                <>
                  <span>{sortedFilteredApps.length}</span>
                  <span className="font-medium text-orange-700/80">/</span>
                  <span className="font-semibold text-orange-950">
                    {apps.length}
                  </span>
                  <span className="pl-0.5 font-semibold">đơn</span>
                </>
              ) : (
                <>
                  <span className="font-semibold">{apps.length}</span>
                  <span className="font-semibold">đơn đăng ký</span>
                </>
              )}
            </span>
            {hasActiveFilters && (
              <Tag className="!m-0 !rounded-full border-amber-200 bg-amber-50 text-amber-900 text-xs px-2.5">
                Đang lọc
              </Tag>
            )}
          </div>
        </div>

        {sortedFilteredApps.length === 0 ? (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={
              <Text className="text-gray-500 text-sm">
                Không có đơn nào khớp bộ lọc.
              </Text>
            }
            className="py-16 px-4"
          >
            <Button
              type="primary"
              className="!rounded-2xl !bg-orange-500 !border-orange-500 shadow-sm"
              onClick={onClearFilters}
            >
              Đặt lại bộ lọc
            </Button>
          </Empty>
        ) : screens.md ? (
          <div className="overflow-hidden">
            <Table<ApplicationMe>
              rowKey="applicationId"
              columns={columns}
              dataSource={sortedFilteredApps}
              size="middle"
              scroll={{ x: 1040 }}
              onChange={onTableChange}
              showSorterTooltip
              pagination={{
                pageSize: 5,
                showSizeChanger: true,
                pageSizeOptions: [5, 10, 20, 50],
                showTotal: (total, range) =>
                  `${range[0]}–${range[1]} của ${total} đơn`,
                hideOnSinglePage: false,
                showQuickJumper: sortedFilteredApps.length > 10,
                className: `!m-0 border-t border-gray-100 bg-gray-50/50 !px-5 !py-4 sm:!px-7 ${applicationListPanelBottomClassName}`,
              }}
              className={tableClassName}
            />
          </div>
        ) : (
          <div className="p-4 sm:p-5">
            <ApplicationCardList
              apps={sortedFilteredApps}
              onSubmit={onSubmit}
              onView={onView}
              submittingId={submittingId}
            />
          </div>
        )}
      </Card>
    </motion.div>
  );
}
