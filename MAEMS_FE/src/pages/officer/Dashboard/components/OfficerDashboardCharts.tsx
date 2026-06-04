import { Card, Col, Row, Typography } from "antd";
import {
  Bar,
  BarChart,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { MajorChartSlice, StatusChartSlice } from "../types";

const { Title } = Typography;

type OfficerDashboardChartsProps = {
  statusChartData: StatusChartSlice[];
  majorChartData: MajorChartSlice[];
};

/** Biểu đồ tròn (trạng thái) và cột (ngành) trên dashboard. */
export function OfficerDashboardCharts({
  statusChartData,
  majorChartData,
}: OfficerDashboardChartsProps) {
  return (
    <Row gutter={[16, 16]} className="mb-6">
      <Col xs={24} md={10}>
        <Card
          className="rounded-2xl border border-gray-100 shadow-sm h-full"
          styles={{ body: { padding: "20px 24px" } }}
        >
          <Title level={5} className="!mb-4 !text-gray-700">
            Hồ sơ theo trạng thái
          </Title>
          {statusChartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={statusChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {statusChartData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  content={({ active, payload }) => {
                    if (!active || !payload?.length) return null;
                    const p = payload[0];
                    const label = String(p.name ?? p.payload?.name ?? "");
                    const count = Number(p.value ?? 0);
                    return (
                      <div className="rounded-lg border border-gray-200 bg-white px-3 py-2 shadow-md">
                        <div className="text-sm font-semibold text-gray-800">
                          {label}
                        </div>
                        <div className="text-xs text-gray-600 mt-0.5">
                          {count} hồ sơ
                        </div>
                      </div>
                    );
                  }}
                />
                <Legend
                  iconType="circle"
                  iconSize={8}
                  formatter={(value) => (
                    <span className="text-xs text-gray-600">{value}</span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[220px] flex items-center justify-center text-gray-300 text-sm">
              Chưa có dữ liệu
            </div>
          )}
        </Card>
      </Col>

      <Col xs={24} md={14}>
        <Card
          className="rounded-2xl border border-gray-100 shadow-sm h-full"
          styles={{ body: { padding: "20px 24px" } }}
        >
          <Title level={5} className="!mb-4 !text-gray-700">
            Hồ sơ theo ngành
          </Title>
          {majorChartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart
                data={majorChartData}
                margin={{ top: 0, right: 0, left: -20, bottom: 0 }}
              >
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 11, fill: "#9ca3af" }}
                  axisLine={false}
                  tickLine={false}
                  interval={0}
                  angle={majorChartData.length > 5 ? -20 : 0}
                  textAnchor={majorChartData.length > 5 ? "end" : "middle"}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: "#9ca3af" }}
                  axisLine={false}
                  tickLine={false}
                  allowDecimals={false}
                />
                <Tooltip
                  formatter={(value) => [`${value} hồ sơ`, "Số lượng"]}
                  cursor={{ fill: "#eff6ff" }}
                />
                <Bar
                  dataKey="total"
                  fill="#3b82f6"
                  radius={[6, 6, 0, 0]}
                  maxBarSize={40}
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[220px] flex items-center justify-center text-gray-300 text-sm">
              Chưa có dữ liệu
            </div>
          )}
        </Card>
      </Col>
    </Row>
  );
}
