import { Col, Row, Typography } from "antd";
import { Link } from "react-router-dom";

const { Paragraph, Text } = Typography;

const quickLinks = [
  { label: "Trang chủ", to: "/" },
  { label: "Thông tin tuyển sinh", to: "/tuyen-sinh" },
  { label: "Đăng nhập / Đăng ký", to: "/auth" },
];

export function AppFooter() {
  return (
    <footer className="bg-gray-900 text-gray-400 py-14 px-6">
      <div className="max-w-6xl mx-auto">
        <Row gutter={[48, 32]}>
          <Col xs={24} md={8}>
            <Text className="!text-white font-extrabold text-lg tracking-widest uppercase block mb-3">
              MAEMS
            </Text>
            <Paragraph className="!text-gray-400 text-sm leading-relaxed !mb-0">
              Multi-Agent Enrollment Management System — hệ thống đa tác tử hỗ
              trợ quản lý tuyển sinh với LLM, minh bạch, thông minh và hiệu quả
              cho Trường Đại học FPT.
            </Paragraph>
          </Col>
          <Col xs={24} md={8}>
            <Text strong className="!text-white block mb-4">
              Truy cập nhanh
            </Text>
            <div className="space-y-2">
              {quickLinks.map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  className="block !text-gray-400 hover:!text-orange-400 text-sm transition-colors"
                >
                  {l.label}
                </Link>
              ))}
            </div>
          </Col>
          <Col xs={24} md={8}>
            <Text strong className="!text-white block mb-4">
              Liên hệ
            </Text>
            <div className="space-y-1 text-sm">
              <Text className="!text-gray-400 block">Trường Đại học FPT</Text>
              <Text className="!text-gray-400 block">
                Khu GD&amp;ĐT – Khu CNC Hòa Lạc, Hà Nội
              </Text>
              <Text className="!text-gray-400 block">
                tuyensinh@fpt.edu.vn
              </Text>
            </div>
          </Col>
        </Row>
        <div className="border-t border-gray-800 mt-10 pt-6 text-center">
          <Text className="!text-gray-600 text-xs">
            © 2026 Multi-Agent Enrollment Management System – Trường Đại học
            FPT. All rights reserved.
          </Text>
        </div>
      </div>
    </footer>
  );
}
