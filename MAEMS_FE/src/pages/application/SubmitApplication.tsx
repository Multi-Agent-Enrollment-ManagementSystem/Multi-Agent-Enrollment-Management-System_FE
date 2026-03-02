import { Typography } from "antd";
import { Award, BookOpen, FileCheck2, GraduationCap } from "lucide-react";
import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "../../components/DashboardLayout";
import { applicantMenu } from "../applicant/applicantMenu";

const { Title, Text } = Typography;

type Method = {
  pt: string;
  icon: ReactNode;
  title: string;
  path: string;
};

const methods: Method[] = [
  {
    pt: "PT1",
    icon: <BookOpen size={28} color="#fff" />,
    title: "Xét kết quả học tập cấp THPT (học bạ) năm 2025",
    path: "/applicant/submit-application/hoc-ba",
  },
  {
    pt: "PT2",
    icon: <FileCheck2 size={28} color="#fff" />,
    title: "Sử dụng kết quả thi Đánh giá năng lực của ĐHQG Hà Nội và ĐHQG TP.HCM",
    path: "/applicant/submit-application/danh-gia-nang-luc",
  },
  {
    pt: "PT3",
    icon: <GraduationCap size={28} color="#fff" />,
    title: "Xét kết quả thi tốt nghiệp THPT các năm",
    path: "/applicant/submit-application/tot-nghiep-thpt",
  },
  {
    pt: "PT4",
    icon: <Award size={28} color="#fff" />,
    title: "Phương thức khác",
    path: "/applicant/submit-application/phuong-thuc-khac",
  },
];

export function SubmitApplication() {
  const navigate = useNavigate();

  return (
    <DashboardLayout menuItems={applicantMenu}>
      <div style={{ maxWidth: 560, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              background: "#fff7ed",
              border: "1px solid #fed7aa",
              borderRadius: 99,
              padding: "6px 16px",
              marginBottom: 12,
            }}
          >
            <span style={{ color: "#f97316", fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" }}>
              Trường Đại học FPT — Tuyển sinh 2026
            </span>
          </div>
          <Title level={3} style={{ marginBottom: 4, fontWeight: 800, color: "#1f2937" }}>
            Đăng ký xét tuyển đại học
          </Title>
          <Text style={{ color: "#9ca3af", fontSize: 13 }}>
            Chọn phương thức xét tuyển phù hợp với hồ sơ của bạn
          </Text>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          {methods.map((m) => (
            <div
              key={m.pt}
              onClick={() => navigate(m.path)}
              style={{
                background: "#f97316",
                borderRadius: 24,
                padding: "28px 20px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                cursor: "pointer",
                boxShadow: "0 4px 14px rgba(249,115,22,0.35)",
                transition: "transform 0.15s, box-shadow 0.15s",
                userSelect: "none",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.background = "#ea6c0a";
                (e.currentTarget as HTMLDivElement).style.boxShadow = "0 6px 20px rgba(249,115,22,0.45)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.background = "#f97316";
                (e.currentTarget as HTMLDivElement).style.boxShadow = "0 4px 14px rgba(249,115,22,0.35)";
              }}
              onMouseDown={(e) => {
                (e.currentTarget as HTMLDivElement).style.transform = "scale(0.96)";
              }}
              onMouseUp={(e) => {
                (e.currentTarget as HTMLDivElement).style.transform = "scale(1)";
              }}
            >
              <div
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: 16,
                  background: "rgba(255,255,255,0.2)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 16,
                }}
              >
                {m.icon}
              </div>
              <span
                style={{
                  color: "rgba(255,255,255,0.7)",
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: "0.15em",
                  display: "block",
                  marginBottom: 6,
                }}
              >
                {m.pt}
              </span>
              <span
                style={{
                  color: "#fff",
                  fontWeight: 800,
                  fontSize: 13,
                  lineHeight: 1.4,
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                {m.title}
              </span>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
