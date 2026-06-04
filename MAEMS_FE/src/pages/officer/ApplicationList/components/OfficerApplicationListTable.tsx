import { Card, Spin, Table, Typography } from "antd";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";
import type { SorterResult } from "antd/es/table/interface";
import type { Application } from "@/types/application";
import { isEscalated } from "../utils/officerApplicationListStatus";

const { Text } = Typography;

type OfficerApplicationListTableProps = {
  loading: boolean;
  applications: Application[];
  columns: ColumnsType<Application>;
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  onTableChange: (
    pagination: TablePaginationConfig,
    filters: unknown,
    sorter: SorterResult<Application> | SorterResult<Application>[],
  ) => void;
};

/** Bảng danh sách hồ sơ — highlight hàng cần xem xét, expandable ghi chú agent. */
export function OfficerApplicationListTable({
  loading,
  applications,
  columns,
  pageNumber,
  pageSize,
  totalCount,
  onTableChange,
}: OfficerApplicationListTableProps) {
  return (
    <Card
      className="rounded-2xl border border-gray-100 shadow-sm"
      styles={{ body: { padding: "0" } }}
    >
      <Spin spinning={loading}>
        <Table
          columns={columns}
          dataSource={applications}
          rowKey="applicationId"
          scroll={{ x: 900 }}
          onChange={onTableChange}
          pagination={{
            current: pageNumber,
            pageSize,
            total: totalCount,
            showSizeChanger: true,
            showTotal: (total) => `Tổng ${total} hồ sơ`,
            pageSizeOptions: ["10", "20", "50"],
            className: "!px-4 !pb-4 !pt-3 !box-border sm:!px-6 sm:!pb-5",
          }}
          rowClassName={(record) =>
            isEscalated(record)
              ? "bg-rose-50/40 hover:bg-rose-50"
              : "hover:bg-gray-50 transition-colors"
          }
          expandable={{
            expandedRowRender: (record) =>
              record.notes ? (
                <div className="mx-4 my-2 p-4 rounded-xl bg-indigo-50 border border-indigo-100">
                  <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wide block mb-2">
                    Ghi chú từ Agent
                  </span>
                  <Text className="text-sm text-gray-700 font-mono whitespace-pre-wrap">
                    {record.notes}
                  </Text>
                </div>
              ) : (
                <div className="px-4 py-3 text-gray-400 text-sm italic">
                  Không có ghi chú từ hệ thống.
                </div>
              ),
            rowExpandable: (record) => !!record.notes,
          }}
          size="middle"
        />
      </Spin>
    </Card>
  );
}
