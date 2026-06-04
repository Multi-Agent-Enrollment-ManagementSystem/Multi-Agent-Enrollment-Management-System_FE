import { Card, Col, Row, Typography } from "antd";
import { useNavigate } from "react-router-dom";
import type { QuickAccessLinkConfig } from "../types";
import { applicationListHref } from "../utils/officerDashboardNavigation";

const { Title, Text } = Typography;

type OfficerQuickAccessSectionProps = {
  links: QuickAccessLinkConfig[];
};

/** Lưới shortcut mở danh sách hồ sơ với bộ lọc sẵn. */
export function OfficerQuickAccessSection({
  links,
}: OfficerQuickAccessSectionProps) {
  const navigate = useNavigate();

  return (
    <div className="block" style={{ marginTop: 32, paddingBottom: 32 }}>
      <Card
        className="rounded-2xl border border-gray-100 shadow-sm"
        styles={{ body: { padding: "20px 24px" } }}
      >
        <Title level={5} className="!mb-1 !text-gray-700">
          Truy cập nhanh
        </Title>
        <Text className="text-xs text-gray-400 block mb-4">
          Mở trang quản lý hồ sơ với bộ lọc sẵn theo từng loại
        </Text>
        <Row gutter={[12, 12]}>
          {links.map((item) => (
            <Col xs={24} sm={12} md={8} key={item.title}>
              <button
                type="button"
                onClick={() => navigate(applicationListHref(item.filter))}
                className={`w-full flex items-center gap-3 p-4 rounded-xl border ${item.ring} ${item.bg} ${item.hoverBg} transition-colors text-left group focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300`}
              >
                <div
                  className={`w-10 h-10 rounded-xl ${item.iconBg} flex items-center justify-center text-white shrink-0 group-hover:scale-105 transition-transform`}
                >
                  {item.icon}
                </div>
                <div className="min-w-0">
                  <div className={`font-semibold text-sm ${item.titleClass}`}>
                    {item.title}
                  </div>
                  <div className={`text-xs ${item.subtitleClass}`}>
                    {item.subtitle}
                  </div>
                </div>
              </button>
            </Col>
          ))}
        </Row>
      </Card>
    </div>
  );
}
