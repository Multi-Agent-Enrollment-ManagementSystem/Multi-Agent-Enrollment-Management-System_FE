import { Button, Card, Table, Typography } from "antd";
import type { ColumnsType } from "antd/es/table";
import type { Application } from "@/types/application";
import {
  APPLICATION_REQUIRES_REVIEW_LABEL,
  APPLICATION_STATUS,
} from "@/types/application";

const { Title, Text } = Typography;

type OfficerEscalatedTableProps = {
  loading: boolean;
  columns: ColumnsType<Application>;
  dataSource: Application[];
  onViewAll: () => void;
};

/** Bảng tối đa 5 hồ sơ cần xử lý gấp trên dashboard. */
export function OfficerEscalatedTable({
  loading,
  columns,
  dataSource,
  onViewAll,
}: OfficerEscalatedTableProps) {
  return (
    <Card
      className="rounded-2xl border border-gray-100 shadow-sm mb-6"
      styles={{ body: { padding: "20px 24px" } }}
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <Title level={5} className="!mb-0.5 !text-gray-700">
            Danh sách hồ sơ cần xử lý
          </Title>
          <Text className="text-xs text-gray-400">
            {APPLICATION_STATUS.under_review} hoặc{" "}
            {APPLICATION_REQUIRES_REVIEW_LABEL}
            {!loading && dataSource.length > 0 && (
              <span className="ml-1 text-violet-600 font-medium">
                ({dataSource.length})
              </span>
            )}
          </Text>
        </div>
        <Button
          type="primary"
          size="small"
          onClick={onViewAll}
          className="!rounded-lg"
        >
          Xem tất cả
        </Button>
      </div>
      <Table
        columns={columns}
        dataSource={dataSource}
        rowKey="applicationId"
        pagination={false}
        size="small"
        tableLayout="fixed"
        scroll={{ x: 720 }}
        locale={{ emptyText: "Không có hồ sơ cần xử lý" }}
        rowClassName="hover:bg-gray-50 transition-colors"
      />
    </Card>
  );
}
