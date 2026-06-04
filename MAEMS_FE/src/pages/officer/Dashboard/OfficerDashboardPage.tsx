import { Button, Spin, Typography } from "antd";
import { ClipboardList } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { OfficerLayout } from "@/layouts/OfficerLayout";
import {
  OfficerDashboardCharts,
  OfficerEscalatedTable,
  OfficerQuickAccessSection,
  OfficerQuickStatsRow,
} from "./components";
import { useOfficerDashboard } from "./hooks";
import { OFFICER_APP_LIST_PATH } from "./utils/officerDashboardConstants";

const { Title, Text } = Typography;

/** Trang dashboard tuyển sinh của cán bộ — ghép layout và các section. */
export function OfficerDashboard() {
  const navigate = useNavigate();
  const {
    loading,
    refresh,
    updatedAtLabel,
    quickStats,
    statusChartData,
    majorChartData,
    escalatedList,
    escalatedColumns,
    quickAccessLinks,
  } = useOfficerDashboard();

  return (
    <OfficerLayout>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <Title level={4} className="!mb-1 !text-gray-800 !font-bold">
            Dashboard Tuyển Sinh
          </Title>
          <Text className="text-gray-400 text-sm">
            Theo dõi tình trạng tuyển sinh tổng quan — cập nhật lúc{" "}
            {updatedAtLabel}
          </Text>
        </div>
        <Button
          icon={<ClipboardList size={14} />}
          loading={loading}
          onClick={() => void refresh()}
          className="!rounded-xl"
        >
          Làm mới
        </Button>
      </div>

      <Spin spinning={loading}>
        <OfficerQuickStatsRow loading={loading} cards={quickStats} />

        <OfficerDashboardCharts
          statusChartData={statusChartData}
          majorChartData={majorChartData}
        />

        <OfficerEscalatedTable
          loading={loading}
          columns={escalatedColumns}
          dataSource={escalatedList}
          onViewAll={() => navigate(OFFICER_APP_LIST_PATH)}
        />

        <OfficerQuickAccessSection links={quickAccessLinks} />
      </Spin>
    </OfficerLayout>
  );
}
