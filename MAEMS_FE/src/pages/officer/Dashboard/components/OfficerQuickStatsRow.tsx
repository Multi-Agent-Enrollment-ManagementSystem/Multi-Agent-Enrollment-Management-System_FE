import { Card, Col, Row } from "antd";
import type { QuickStatCardConfig } from "../types";

type OfficerQuickStatsRowProps = {
  loading: boolean;
  cards: QuickStatCardConfig[];
};

/** Hàng thẻ thống kê nhanh trên dashboard. */
export function OfficerQuickStatsRow({
  loading,
  cards,
}: OfficerQuickStatsRowProps) {
  return (
    <Row gutter={[12, 12]} className="mb-6">
      {cards.map((s) => (
        <Col xs={12} sm={12} md={8} lg={8} xl={4} key={s.label}>
          <Card
            className={`rounded-2xl border ${s.border} shadow-sm`}
            styles={{ body: { padding: "16px 20px" } }}
          >
            <div className="flex items-start justify-between mb-3">
              <div
                className={`w-9 h-9 rounded-xl ${s.bg} flex items-center justify-center ${s.iconColor}`}
              >
                {s.icon}
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`inline-block size-2 shrink-0 rounded-full ${s.trendDotClass}`}
                  aria-hidden
                />
                <span className="text-[11px] text-gray-400">{s.trend}</span>
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-800">
              {loading ? "—" : s.value}
            </div>
            <div className="text-xs text-gray-400 mt-0.5">{s.label}</div>
          </Card>
        </Col>
      ))}
    </Row>
  );
}
