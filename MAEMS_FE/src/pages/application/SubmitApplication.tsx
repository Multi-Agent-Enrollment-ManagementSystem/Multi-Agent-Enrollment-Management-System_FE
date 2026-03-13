import { Button, Typography } from "antd";
import { Award, BookOpen, CheckCircle, FileCheck2, GraduationCap } from "lucide-react";
import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "../../components/DashboardLayout";
import { applicantMenu } from "../applicant/applicantMenu";

const { Title, Text } = Typography;

type Method = {
  pt: string;
  icon: ReactNode;
  color: string;
  bg: string;
  title: string;
  description: string;
  requirements: string[];
};

const methods: Method[] = [
  {
    pt: "PT1",
    icon: <BookOpen size={20} />,
    color: "#f97316",
    bg: "#fff7ed",
    title: "Xét kết quả học tập THPT (Học bạ)",
    description: "Sử dụng điểm trung bình học kỳ hoặc cả năm từ năm lớp 10 đến lớp 12 theo chương trình THPT.",
    requirements: ["Học bạ THPT bản gốc hoặc có công chứng", "Điểm trung bình các môn xét tuyển ≥ 6.0", "Tốt nghiệp THPT"],
  },
  {
    pt: "PT2",
    icon: <FileCheck2 size={20} />,
    color: "#8b5cf6",
    bg: "#f5f3ff",
    title: "Đánh giá năng lực (ĐHQG Hà Nội & TP.HCM)",
    description: "Sử dụng điểm thi Đánh giá năng lực của ĐHQG Hà Nội hoặc ĐHQG TP.HCM năm 2025–2026.",
    requirements: ["Giấy báo điểm kỳ thi ĐGNL", "Điểm tổng đạt ngưỡng theo ngành đăng ký", "Tốt nghiệp THPT"],
  },
  {
    pt: "PT3",
    icon: <GraduationCap size={20} />,
    color: "#0ea5e9",
    bg: "#f0f9ff",
    title: "Kết quả thi tốt nghiệp THPT",
    description: "Sử dụng điểm thi tốt nghiệp THPT quốc gia (các năm còn hiệu lực theo quy định Bộ GD&ĐT).",
    requirements: ["Phiếu điểm thi tốt nghiệp THPT", "Tổng điểm 3 môn xét tuyển ≥ 15", "Tốt nghiệp THPT"],
  },
  {
    pt: "PT4",
    icon: <Award size={20} />,
    color: "#10b981",
    bg: "#f0fdf4",
    title: "Phương thức khác",
    description: "Dành cho thí sinh có chứng chỉ quốc tế, học sinh giỏi quốc gia/quốc tế hoặc đối tượng ưu tiên đặc biệt.",
    requirements: ["Chứng chỉ quốc tế hợp lệ (SAT, IELTS, …) hoặc giấy chứng nhận HS giỏi", "Đáp ứng điều kiện đặc thù theo từng ngành"],
  },
];

export function SubmitApplication() {
  const navigate = useNavigate();

  return (
    <DashboardLayout menuItems={applicantMenu}>
      <div style={{ maxWidth: 780, margin: "0 auto", paddingBottom: 48 }}>

        {/* Hero */}
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              background: "#fff7ed",
              border: "1px solid #fed7aa",
              borderRadius: 99,
              padding: "6px 18px",
              marginBottom: 16,
            }}
          >
            <span style={{ color: "#f97316", fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" }}>
              Trường Đại học FPT — Tuyển sinh 2026
            </span>
          </div>
          <Title level={2} style={{ marginBottom: 8, fontWeight: 800, color: "#1f2937" }}>
            Các phương thức xét tuyển
          </Title>
          <Text style={{ color: "#6b7280", fontSize: 15, display: "block", maxWidth: 520, margin: "0 auto" }}>
            FPT University áp dụng 4 phương thức xét tuyển. Tìm hiểu từng phương thức và bấm <strong>Đăng ký xét tuyển</strong> để bắt đầu nộp hồ sơ.
          </Text>
        </div>

        {/* Method list */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 40 }}>
          {methods.map((m) => (
            <div
              key={m.pt}
              style={{
                background: "#fff",
                border: "1px solid #f3f4f6",
                borderRadius: 16,
                padding: "20px 24px",
                display: "flex",
                gap: 20,
                alignItems: "flex-start",
                boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
              }}
            >
              {/* Icon badge */}
              <div
                style={{
                  flexShrink: 0,
                  width: 48,
                  height: 48,
                  borderRadius: 12,
                  background: m.bg,
                  color: m.color,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {m.icon}
              </div>

              {/* Content */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4, flexWrap: "wrap" }}>
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 800,
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
                      color: m.color,
                      background: m.bg,
                      borderRadius: 99,
                      padding: "2px 10px",
                    }}
                  >
                    {m.pt}
                  </span>
                  <span style={{ fontWeight: 700, fontSize: 15, color: "#1f2937" }}>{m.title}</span>
                </div>
                <Text style={{ color: "#6b7280", fontSize: 13, display: "block", marginBottom: 10 }}>
                  {m.description}
                </Text>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px 12px" }}>
                  {m.requirements.map((req) => (
                    <span key={req} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, color: "#374151" }}>
                      <CheckCircle size={12} style={{ color: m.color, flexShrink: 0 }} />
                      {req}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div
          style={{
            background: "linear-gradient(135deg, #fff7ed 0%, #fef3c7 100%)",
            border: "1px solid #fed7aa",
            borderRadius: 20,
            padding: "32px 28px",
            textAlign: "center",
          }}
        >
          <Title level={4} style={{ marginBottom: 8, fontWeight: 700, color: "#1f2937" }}>
            Sẵn sàng nộp hồ sơ?
          </Title>
          <Text style={{ color: "#6b7280", fontSize: 14, display: "block", marginBottom: 20 }}>
            Hệ thống sẽ hướng dẫn bạn hoàn thiện đơn đăng ký và chọn phương thức xét tuyển phù hợp.
          </Text>
          <Button
            type="primary"
            size="large"
            onClick={() => navigate("/applicant/submit-application/form")}
            style={{
              background: "#f97316",
              borderColor: "#f97316",
              borderRadius: 12,
              fontWeight: 700,
              fontSize: 15,
              height: 48,
              paddingInline: 40,
              boxShadow: "0 4px 14px rgba(249,115,22,0.35)",
            }}
          >
            Đăng ký xét tuyển ngay
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
}
